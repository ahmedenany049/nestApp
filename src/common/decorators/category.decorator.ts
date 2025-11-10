import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Types } from "mongoose";


@ValidatorConstraint({ name: 'matchFields', async: false })
export class IdsMongo implements ValidatorConstraintInterface {
    validate(ids: string[], args: ValidationArguments) {
        return ids.filter(id=>Types.ObjectId.isValid(id)).length==ids.length; 
    }
    defaultMessage(args: ValidationArguments) {
        return `${args.property} not match with ${args.constraints}`;
    }
}




