
import mongoose, {InferSchemaType, Schema} from "mongoose";

export const propertyRequestSchema = new mongoose.Schema(
    {
        propertyType: {
            type: String,
            enum: ['VILLA', 'HOUSE', 'LAND', 'APARTMENT'],
            required: true
        },
        area:{
            type: Number,
            required: true
        },
        price:{
            type: Number,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        district: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        userId:{
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        refreshedAt: {
            type: Date,
            default: new Date(),
            required: true
        }

    }
    ,
    {
        timestamps: true,
    }
);


export type propertyRequestType = InferSchemaType<typeof propertyRequestSchema>;

export const propertyRequestModelName = "propertyRequest";