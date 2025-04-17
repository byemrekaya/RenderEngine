import { Injectable, Type, Inject } from '@angular/core';
import { BasicRadioListTemplate } from '@app/templates';
import { ConfigService } from '../config/config.service';
import { TemplateStrategy } from '../interfaces/template-strategy.interface';
import { CustomLogicStrategy } from '../strategies/custom-logic.strategy';
import { UserFormTemplate } from '../../templates/user-form/user-form.template';

export type ComponentConfig = Record<string, unknown>;

export interface ComponentData<T = unknown> {
  component: Type<T>;
  config: ComponentConfig;
  strategy?: TemplateStrategy;
}

@Injectable({
  providedIn: 'root',
})
export class ComponentFactory {
  private componentRegistry = new Map<string, Type<unknown>>();
  private strategyRegistry = new Map<string, TemplateStrategy>();

  constructor(
    private configService: ConfigService,
    @Inject(CustomLogicStrategy)
    private customLogicStrategy: CustomLogicStrategy,
  ) {
    this.initializeRegistry();
  }

  private initializeRegistry() {
    this.componentRegistry.set('basic-radio-list', BasicRadioListTemplate);
    this.componentRegistry.set('user-form', UserFormTemplate);
    this.strategyRegistry.set('custom-logic', this.customLogicStrategy);
  }

  async createComponent(
    templateKey: string,
    configKey: string,
    strategyKey?: string,
  ): Promise<ComponentData> {
    try {
      const component = this.componentRegistry.get(templateKey);
      if (!component) {
        throw new Error(`Component not found for templateKey: ${templateKey}`);
      }

      const config = await this.configService.loadConfig(configKey);
      const strategy = strategyKey
        ? this.strategyRegistry.get(strategyKey)
        : undefined;

      return {
        component,
        config,
        strategy,
      };
    } catch (error) {
      console.error('Failed to create component:', error);
      throw error;
    }
  }

  registerComponent<T>(templateKey: string, component: Type<T>) {
    this.componentRegistry.set(templateKey, component);
  }

  registerStrategy(strategyKey: string, strategy: TemplateStrategy) {
    this.strategyRegistry.set(strategyKey, strategy);
  }
}
