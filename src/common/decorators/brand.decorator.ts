import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function AtLeastOne(
  requireFields: string[],
  validationOptions?: ValidationOptions,
) {
  return function (constructor: Function) {
    registerDecorator({
      target: constructor,
      propertyName: "",
      options: validationOptions,
      constraints:requireFields,
      validator: {
        validate(value: string, args: ValidationArguments) {
          return requireFields.some(field => args.object[field])
        },
        defaultMessage(args: ValidationArguments) {
          return `At least one of required fields ${requireFields.join(" , ")} is missing`;
        },
      },
    });
  };
}
