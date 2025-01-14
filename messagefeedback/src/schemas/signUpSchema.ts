import {z} from 'zod' 

export const usernameValidation = z
.string({ required_error: 'Username is required' })
.min(3, { message: 'Username must be at least 3 characters long' })
.max(20, { message: 'Username must be at most 20 characters long' })
.regex(/^[a-zA-Z0-9_]+$/, { message: 'Username can only contain letters'})

export const signUpSchema = z.object({
    username: usernameValidation,
    email : z.string().email({ message: 'Invalid email address'}),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
})