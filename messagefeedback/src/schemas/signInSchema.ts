import {z} from 'zod'

export const signInSchema = z.object({
    // email : z.string().email({ message: 'Invalid email address'}),
    identifier : z.string(),    // it can be email , phone, username
    password: z.string(),
})