import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";

import { getClassSchema } from "nestjs-joi";



export class ValidationPipe implements PipeTransform{
    constructor(private readonly dto: any){}
    async transform(value: any, metadata: ArgumentMetadata) {

        const schema = getClassSchema(this.dto);
        let error = schema.validate(value).error;
        if (error) {
            throw new BadRequestException(
                'Validation failed: ' +
                error.details.map((err) => err.message).join(', '),
            );
        };

        return value;
    }
};