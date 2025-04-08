import { Injectable } from '@angular/core';
import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

export interface ValidationRule {
  type: string;
  message: string;
  validator: ValidatorFn;
}

export type ValidationConfig = Record<string, ValidationRule[]>;

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  private readonly defaultMessages: Record<string, string> = {
    required: 'This field is required',
    min: 'Value must be greater than or equal to {min}',
    max: 'Value must be less than or equal to {max}',
    email: 'Please enter a valid email address',
    pattern: 'Please enter a valid format',
    minlength: 'Minimum length is {requiredLength} characters',
    maxlength: 'Maximum length is {requiredLength} characters',
  };

  getValidators(rules: ValidationRule | ValidationRule[]): ValidatorFn[] {
    if (!rules) return [];

    const ruleArray = Array.isArray(rules) ? rules : [rules];
    return ruleArray.map((rule) => rule.validator);
  }

  getErrorMessage(error: ValidationErrors): string {
    const errorType = Object.keys(error)[0];
    const rule = this.defaultMessages[errorType];

    if (!rule) return 'Invalid value';

    // Replace placeholders with actual values
    return rule.replace(/{(\w+)}/g, (match, key) => {
      return error[errorType][key] || match;
    });
  }

  createRequiredValidator(): ValidationRule {
    return {
      type: 'required',
      message: this.defaultMessages['required'],
      validator: Validators.required,
    };
  }

  createMinValidator(min: number): ValidationRule {
    return {
      type: 'min',
      message: this.defaultMessages['min'].replace('{min}', min.toString()),
      validator: Validators.min(min),
    };
  }

  createMaxValidator(max: number): ValidationRule {
    return {
      type: 'max',
      message: this.defaultMessages['max'].replace('{max}', max.toString()),
      validator: Validators.max(max),
    };
  }

  createEmailValidator(): ValidationRule {
    return {
      type: 'email',
      message: this.defaultMessages['email'],
      validator: Validators.email,
    };
  }

  createPatternValidator(
    pattern: string | RegExp,
    message?: string,
  ): ValidationRule {
    return {
      type: 'pattern',
      message: message || this.defaultMessages['pattern'],
      validator: Validators.pattern(pattern),
    };
  }

  createCustomValidator(
    validatorFn: (control: AbstractControl) => ValidationErrors | null,
    message: string,
  ): ValidationRule {
    return {
      type: 'custom',
      message,
      validator: validatorFn,
    };
  }
}
