import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import {
  ValidationService,
  ValidationRule,
} from '../services/validation.service';
import { NavigationService } from '../services/navigation.service';

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
  protected isInitialized = false;

  constructor(protected fb: FormBuilder) {
    this.form = this.fb.group({});
  }

  ngOnInit(): void {
    if (!this.isInitialized) {
      this.initializeForm();
      this.setupValidations();
      this.setupFormSubscriptions();
      this.isInitialized = true;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.isInitialized = false;
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

  protected setupFormSubscriptions(): void {
    this.form.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged(
          (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr),
        ),
        debounceTime(300),
      )
      .subscribe(() => {
        this.validateForm();
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
    this.updateNavigationState();
  }

  protected updateNavigationState(): void {
    this.navigationService.setNavigationState({
      canProceed: this.form.valid,
      errors: this.validationErrors.map((error) => error.message),
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
