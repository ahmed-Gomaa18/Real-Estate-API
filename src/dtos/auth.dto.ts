import { JoiSchemaOptions, JoiSchema } from 'nestjs-joi';
import * as Joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';

@JoiSchemaOptions({
    allowUnknown: false,
})
export class RegisterDto{
    @ApiProperty()
    @JoiSchema(Joi.string().required())
    name:   string;

    @ApiProperty()
    @JoiSchema(Joi.string().required())
    phone:  string;

    @ApiProperty({ enum: ['ADMIN', 'CLIENT', 'AGENT']})
    @JoiSchema(Joi.string().valid('ADMIN', 'CLIENT', 'AGENT').required())
    role: string;

    @ApiProperty()
    @JoiSchema(Joi.string().required())
    password:   string;
};


@JoiSchemaOptions({
    allowUnknown: false,
})
export class LoginDto{
    @ApiProperty()
    @JoiSchema(Joi.string().required())
    phone:  string;
    
    @ApiProperty()
    @JoiSchema(Joi.string().required())
    password:   string;
};