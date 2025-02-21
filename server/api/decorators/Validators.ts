import {
  ValidatorConstraintInterface,
  ValidationOptions,
  registerDecorator,
  ValidatorConstraint,
} from 'class-validator';
import { ApplicationDecision } from '../../types/Enums';

const ALLOWED_EMAIL_DOMAINS = ['.edu', '.ca'];

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
    return ALLOWED_EMAIL_DOMAINS.some((domain) => email.endsWith(domain));
  }

  defaultMessage(): string {
    return (
      'Email must end in one of the following: ' +
      ALLOWED_EMAIL_DOMAINS.join(', ')
    );
  }
}

export function IsEduEmail(validationOptions?: ValidationOptions) {
  return templatedValidationDecorator(EduEmailValidator, validationOptions);
}

@ValidatorConstraint()
class LinkedinValidator implements ValidatorConstraintInterface {
  validate(url: string): boolean {
    const regex =
      /^https?:\/\/(www\.)?linkedin\.com\/(in|pub)\/[a-zA-Z0-9-]+\/?$/;
    return regex.test(url);
  }

  defaultMessage(): string {
    return 'Invalid LinkedIn URL';
  }
}

export function IsLinkedinURL(validationOptions?: ValidationOptions) {
  return templatedValidationDecorator(LinkedinValidator, validationOptions);
}

@ValidatorConstraint()
class ApplicationDecisionValidator implements ValidatorConstraintInterface {
  validate(applicationDecision: ApplicationDecision): boolean {
    return Object.values(ApplicationDecision).includes(applicationDecision);
  }

  defaultMessage(): string {
    return `Application decision must be one of ${Object.values(
      ApplicationDecision,
    )}`;
  }
}

export function IsValidApplicationDecision(
  validationOptions?: ValidationOptions,
) {
  return templatedValidationDecorator(
    ApplicationDecisionValidator,
    validationOptions,
  );
}
