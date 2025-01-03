import {
  ValidatorConstraintInterface,
  ValidationOptions,
  registerDecorator,
  ValidatorConstraint,
} from 'class-validator';

function templatedValidationDecorator(
  validator: ValidatorConstraintInterface | Function,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator,
    });
  };
}

@ValidatorConstraint()
class EduEmailValidator implements ValidatorConstraintInterface {
  validate(email: string): boolean {
    return email.endsWith('.edu');
  }

  defaultMessage(): string {
    return 'Email must end in .edu';
  }
}

export function IsEduEmail(validationOptions?: ValidationOptions) {
  return templatedValidationDecorator(EduEmailValidator, validationOptions);
}
