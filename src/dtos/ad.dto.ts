import { JoiSchemaOptions, JoiSchema } from 'nestjs-joi';
import * as Joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';

@JoiSchemaOptions({
    allowUnknown: false,
})
export class CreateAdDto{
    @ApiProperty({ enum: ['VILLA', 'HOUSE', 'LAND', 'APARTMENT']})
    @JoiSchema(Joi.string().valid('VILLA', 'HOUSE', 'LAND', 'APARTMENT').required())
    propertyType: string;

    @ApiProperty()
    @JoiSchema(Joi.number().required())
    area: number;

    @ApiProperty()
    @JoiSchema(Joi.number().required())
    price: number;

    @ApiProperty()
    @JoiSchema(Joi.string().required())
    city: string;
    
    @ApiProperty()
    @JoiSchema(Joi.string().required())
    district: string;
    
    @ApiProperty()
    @JoiSchema(Joi.string().min(25).required())
    description: string;

}