import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BaseConfig, BaseTemplateComponent } from '@core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/models/app-state.model';

interface UserFormConfig extends BaseConfig {
  title: string;
  subtitle: string;
  labels: {
    name: string;
    surname: string;
    email: string;
  };
  stateKey: keyof AppState;
}

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="form-container">
      <h2>{{ config?.title }}</h2>
      <h4>{{ config?.subtitle }}</h4>

      <form [formGroup]="form">
        <div class="form-group">
          <label for="name">{{ config?.labels?.name }}</label>
          <input
            type="text"
            id="name"
            formControlName="name"
            [attr.required]="config?.required || null"
          />
        </div>

        <div class="form-group">
          <label for="surname">{{ config?.labels?.surname }}</label>
          <input
            type="text"
            id="surname"
            formControlName="surname"
            [attr.required]="config?.required || null"
          />
        </div>

        <div class="form-group">
          <label for="email">{{ config?.labels?.email }}</label>
          <input
            type="email"
            id="email"
            formControlName="email"
            [attr.required]="config?.required || null"
            placeholder="ornek@email.com"
          />
        </div>

        <div *ngIf="validationErrors.length > 0" class="validation-errors">
          <p *ngFor="let error of validationErrors" class="error-message">
            {{ error.message }}
          </p>
        </div>
      </form>
    </div>
  `,
  styles: [
    `
      .form-container {
        padding: 20px;
        max-width: 600px;
        margin: 0 auto;
      }

      .form-group {
        margin-bottom: 15px;
      }

      label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
      }

      input {
        width: 100%;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
      }

      .validation-errors {
        margin-top: 10px;
        color: #dc3545;
      }

      .error-message {
        margin: 5px 0;
        font-size: 14px;
      }
    `,
  ],
})
export class UserFormTemplate extends BaseTemplateComponent<UserFormConfig> {
  onValueChange?: (value: any) => void;
  private isUpdating = false;

  constructor(
    fb: FormBuilder,
    private store: Store<{ app: AppState }>,
  ) {
    super(fb);
  }

  protected override initializeForm(): void {
    const defaultValidations = [
      this.validationService.createRequiredValidator(),
    ];

    const emailValidations = [
      this.validationService.createRequiredValidator(),
      this.validationService.createEmailValidator(),
    ];

    this.form = this.fb.group({
      name: [null, this.validationService.getValidators(defaultValidations)],
      surname: [null, this.validationService.getValidators(defaultValidations)],
      email: [null, this.validationService.getValidators(emailValidations)],
    });

    this.store
      .select((state) => state.app[this.config.stateKey])
      .subscribe((value) => {
        if (value && !this.isUpdating) {
          this.isUpdating = true;
          this.form.patchValue(value as Record<string, any>, {
            emitEvent: false,
          });
          this.isUpdating = false;
        }
      });

    this.form.valueChanges.subscribe((value) => {
      if (this.onValueChange && !this.isUpdating) {
        this.onValueChange(value);
      }
    });
  }
}
