import mongoose, {InferSchemaType} from "mongoose";

export const userSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true
        },
        phone: {
            type: String,
            unique: true,
            // length: 
            required: true
        },
        role: {
            type: String,
            enum: ['ADMIN', 'CLIENT', 'AGENT'],
            required: true
        },
        status: {
            type: String,
            enum: ['ACTIVE', 'DELETED'],
            default: 'ACTIVE',
            required: true
        },
        password: {
            type: String,
            required: true
        }
    }
    ,
    {
        timestamps: true,
    }
);


export type userType = InferSchemaType<typeof userSchema>;

export const userModelName = "user";