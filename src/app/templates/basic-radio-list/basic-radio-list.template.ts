import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BaseConfig, BaseTemplateComponent } from '@core';

interface RadioOption {
  id: number;
  label: string;
}

interface RadioListConfig extends BaseConfig {
  title: string;
  subtitle: string;
  options: RadioOption[];
}

@Component({
  selector: 'app-basic-radio-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="radio-list-container">
      <h2>{{ config?.title }}</h2>
      <h4>{{ config?.subtitle }}</h4>

      <form [formGroup]="form">
        <div class="radio-options">
          <div *ngFor="let option of config?.options" class="radio-option">
            <input
              type="radio"
              [id]="'option-' + option.id"
              [value]="option.id"
              formControlName="selectedOption"
              name="selectedOption"
            />
            <label [for]="'option-' + option.id">{{ option.label }}</label>
          </div>
        </div>

        <div *ngIf="validationErrors.length > 0" class="validation-errors">
          <p *ngFor="let error of validationErrors" class="error-message">
            {{ error.message }}
          </p>
        </div>

        <div *ngIf="form.get('selectedOption')?.value" class="selected-value">
          Selected value: {{ form.get('selectedOption')?.value }}
        </div>
      </form>
    </div>
  `,
  styles: [
    `
      .radio-list-container {
        padding: 20px;
        max-width: 600px;
        margin: 0 auto;
      }

      .radio-options {
        margin-top: 20px;
      }

      .radio-option {
        margin-bottom: 10px;
      }

      .radio-option label {
        margin-left: 8px;
      }

      .selected-value {
        margin-top: 20px;
        padding: 10px;
        background-color: #f5f5f5;
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
export class BasicRadioListTemplate extends BaseTemplateComponent<RadioListConfig> {
  onValueChange?: (value: any) => void;

  constructor(fb: FormBuilder) {
    super(fb);
  }

  protected override initializeForm(): void {
    const defaultValidations = [
      this.validationService.createRequiredValidator(),
    ];

    this.form = this.fb.group({
      selectedOption: [
        null,
        this.validationService.getValidators(defaultValidations),
      ],
    });

    this.form.get('selectedOption')?.valueChanges.subscribe((value) => {
      if (this.onValueChange && value !== null) {
        this.onValueChange(value);
      }
    });
  }
}
