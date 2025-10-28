import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";


@ValidatorConstraint({ name: 'matchFields', async: false })
export class matchFields implements ValidatorConstraintInterface {
    validate(value: string, args: ValidationArguments) {
        return value===args.object[args.constraints[0]]; 
    }
    defaultMessage(args: ValidationArguments) {
        return `${args.property} not match with ${args.constraints}`;
    }
}

export function IsMatch(constraints:string[],validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints,
            validator: matchFields,
        });
    };
}