import { Injectable } from '@angular/core';
import { TemplateStrategy } from '../interfaces/template-strategy.interface';

@Injectable({
  providedIn: 'root',
})
export class AlertStrategy implements TemplateStrategy {
  handleAction(value: any): void {
    alert(`Seçilen değer: ${value}`);
  }
}
