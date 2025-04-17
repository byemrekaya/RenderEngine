import { Injectable } from '@angular/core';
import { TemplateStrategy } from '../interfaces/template-strategy.interface';

@Injectable({
  providedIn: 'root',
})
export class CustomLogicStrategy implements TemplateStrategy {
  handleAction(value: any, config?: any): void {
    alert(`selected value: ${value}`);
  }
}
