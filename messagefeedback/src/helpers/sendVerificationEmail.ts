import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

// functionality of Send verification email to user using resend emails api
export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string,
): Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Message Feedback | Verification Code',
            react: VerificationEmail({username, otp: verifyCode}),
        });

        return {success: true, message: "Verification email send successfully"};
    } catch (emailError) {
        console.error("Error in sending verification email", emailError);
        return {success: false, message: "Error in sending verification email"};
    }
}