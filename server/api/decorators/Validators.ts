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

@ValidatorConstraint()
class LinkedinValidator implements ValidatorConstraintInterface {
  validate(url: string): boolean {
    const regex = /^https?:\/\/(www\.)?linkedin\.com\/(in|pub)\/[a-zA-Z0-9-]+\/?$/;
    return regex.test(url);
  }

  defaultMessage(): string {
    return 'Invalid LinkedIn URL';
  }
}

export function IsLinkedinURL(validationOptions?: ValidationOptions) {
  return templatedValidationDecorator(LinkedinValidator, validationOptions);
}
