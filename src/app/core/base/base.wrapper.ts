import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface BaseConfig {
  id?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  validations?: ValidationRules;
  [key: string]: unknown;
}

export interface ValidationRules {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: string;
  custom?: (value: unknown) => boolean;
}

export interface ValidationError {
  type: string;
  message: string;
}

@Component({
  template: '',
})
export abstract class BaseWrapperComponent<
    TConfig extends BaseConfig = BaseConfig,
    TValue = unknown,
  >
  implements OnInit, OnDestroy
{
  @Input() config!: TConfig;

  protected form: FormGroup;
  protected destroy$ = new Subject<void>();
  protected validationErrors: ValidationError[] = [];

  constructor(protected fb: FormBuilder) {
    this.form = this.fb.group({});
  }

  ngOnInit(): void {
    this.initializeForm();
    this.setupValidations();
    this.subscribeToValueChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected abstract initializeForm(): void;

  protected setupValidations(): void {
    if (this.config?.validations) {
      const validators = this.buildValidators();
      Object.keys(this.form.controls).forEach((key) => {
        this.form.get(key)?.setValidators(validators);
      });
    }
  }

  protected subscribeToValueChanges(): void {
    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      this.onValueChange(value);
    });
  }

  protected onValueChange(value: TValue): void {
    this.validateForm();
  }

  protected validateForm(): void {
    this.validationErrors = [];
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach((key) => {
        const control = this.form.get(key);
        if (control?.errors) {
          Object.keys(control.errors).forEach((errorKey) => {
            const errorMessages = this.buildErrorMessages();
            this.validationErrors.push({
              type: errorKey,
              message:
                errorMessages[errorKey] || `Validation error: ${errorKey}`,
            });
          });
        }
      });
    }
  }

  public isValid(): boolean {
    return this.form.valid;
  }

  public getValue(): TValue {
    return this.form.value;
  }

  public reset(): void {
    this.form.reset();
    this.validationErrors = [];
  }

  public disable(): void {
    this.form.disable();
  }

  public enable(): void {
    this.form.enable();
  }

  protected abstract buildValidators(): ValidatorFn[];

  protected abstract buildErrorMessages(): Record<string, string>;
}
