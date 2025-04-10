import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  ValidationService,
  ValidationRule,
} from '../../core/services/validation.service';
import { NavigationService } from '../../core/services/navigation.service';

export interface BaseConfig {
  id?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  validations?: ValidationRule[];
  [key: string]: unknown;
}

export interface ValidationError {
  type: string;
  message: string;
}

@Component({
  template: '',
})
export abstract class BaseTemplateComponent<
    TConfig extends BaseConfig = BaseConfig,
  >
  implements OnInit, OnDestroy
{
  @Input() config!: TConfig;

  protected form: FormGroup;
  protected destroy$ = new Subject<void>();
  protected validationErrors: ValidationError[] = [];
  protected validationService = inject(ValidationService);
  protected navigationService = inject(NavigationService);

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
    if (this.config?.validations?.length) {
      const validators = this.validationService.getValidators(
        this.config.validations,
      );
      Object.keys(this.form.controls).forEach((key) => {
        this.form.get(key)?.setValidators(validators);
      });
    }
  }

  protected subscribeToValueChanges(): void {
    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.validateForm();
      this.updateNavigationState();
    });
  }

  protected validateForm(): void {
    this.validationErrors = [];
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach((key) => {
        const control = this.form.get(key);
        if (control?.errors) {
          Object.keys(control.errors).forEach((errorType) => {
            this.validationErrors.push({
              type: errorType,
              message: this.validationService.getErrorMessage(control.errors!),
            });
          });
        }
      });
    }
  }

  protected updateNavigationState(): void {
    this.navigationService.setNavigationState({
      canProceed: this.form.valid,
      errors:
        this.validationErrors.length > 0
          ? this.validationErrors.map((error) => error.message)
          : undefined,
    });
  }

  public isValid(): boolean {
    return this.form.valid;
  }

  public getValue(): unknown {
    return this.form.value;
  }

  public reset(): void {
    this.form.reset();
    this.validationErrors = [];
    this.updateNavigationState();
  }

  public disable(): void {
    this.form.disable();
  }

  public enable(): void {
    this.form.enable();
  }
}
