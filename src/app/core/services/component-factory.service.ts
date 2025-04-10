import { Injectable, Type } from '@angular/core';
import { BasicRadioListTemplate } from '@app/templates';
import { ConfigService } from '@core';

export type ComponentConfig = Record<string, unknown>;

export interface ComponentData<T = unknown> {
  component: Type<T>;
  config: ComponentConfig;
}

@Injectable({
  providedIn: 'root',
})
export class ComponentFactory {
  private componentRegistry = new Map<string, Type<unknown>>();

  constructor(private configService: ConfigService) {
    this.initializeRegistry();
  }

  private initializeRegistry() {
    this.componentRegistry.set('basic-radio-list', BasicRadioListTemplate);
  }

  async createComponent(
    shortcode: string,
    configKey: string,
  ): Promise<ComponentData> {
    try {
      const component = this.componentRegistry.get(shortcode);
      if (!component) {
        throw new Error(`Component not found for shortcode: ${shortcode}`);
      }

      const config = await this.configService.loadConfig(configKey);

      return {
        component,
        config,
      };
    } catch (error) {
      console.error('Failed to create component:', error);
      throw error;
    }
  }

  registerComponent<T>(shortcode: string, component: Type<T>) {
    this.componentRegistry.set(shortcode, component);
  }
}
