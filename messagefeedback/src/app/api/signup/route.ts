import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from 'bcryptjs'
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

//sigup route to register new user
export async function POST(request: Request){
    await dbConnect()
    try {
        const { username, email, password } = await request.json()

        //check if user already exists with the same username 
        const existingUserVerifiedByUsername = await UserModel.findOne({ 
            username: username,
            isVerified: true
        })
        //if user already exists with the same username then return below response
        if(existingUserVerifiedByUsername){
            return Response.json({
                success: false,
                message: "User already exists with this username"
            }, {status: 400})
        }

        //check if user already exists with the same email
        const existingUserByEmail = await UserModel.findOne({ 
            email: email,
        })
        
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        //if user already exists with the same email then verified him again if user updated details
        if(existingUserByEmail){
           if(existingUserByEmail.isVerified){
            return Response.json({
                success: false,
                message: "User already exists with this email"  
            }, {status: 400})
           } else{
            //if email exists but user is not verified then verfiy user and update user details
            const hashedPassword = await bcrypt.hash(password, 10);
            existingUserByEmail.password = hashedPassword;
            existingUserByEmail.verifyCode = verifyCode;
            existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
            await existingUserByEmail.save()
           }
        } else{
            const hashedPassword = await bcrypt.hash(password, 10);
            const verifyCodeExpiry = new Date();
            verifyCodeExpiry.setHours(verifyCodeExpiry.getHours() + 1);

            const newUser = new UserModel({
                username: username,
                email: email,
                password: hashedPassword,
                verifyCode: verifyCode,
                verifyCodeExpiry: verifyCodeExpiry,
                isVerified: false,
                isAcceptingMeesage: true,
                messages: []
            })
            await newUser.save();   //save the new user in the database
        }

        //send verification email to the user
        const emailResponse = await sendVerificationEmail(email, username, verifyCode)
        //if email sending fails then return below response
        if(!emailResponse.success){
            return Response.json({
                success: false,
                message: emailResponse.message
            }, {status: 500})
        }
        //return response to the user
        return Response.json({
            success: true,
            message: "User registered successfully.Verification email sent to your email address"
        }, {status: 201})

    } catch (error) {
        console.log("Error registering user", error)
        return Response.json({
            success: false,
            message: "Error registering user",
        }, {status: 500, })
    }
}
