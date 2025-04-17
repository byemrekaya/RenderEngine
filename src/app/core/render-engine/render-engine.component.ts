import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ComponentFactory } from '@core';
import { Store } from '@ngrx/store';
import { updateState } from '../../store/actions/app.actions';
import { AppState } from '../../store/models/app-state.model';
import { TemplateStrategy } from '../interfaces/template-strategy.interface';

@Component({
  selector: 'app-render-engine',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="render-container">
      <ng-container #container></ng-container>
    </div>
  `,
  styles: [
    `
      .render-container {
        width: 100%;
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
      }
    `,
  ],
})
export class RenderEngineComponent implements OnInit {
  @ViewChild('container', { read: ViewContainerRef, static: true })
  container!: ViewContainerRef;

  constructor(
    private route: ActivatedRoute,
    private componentFactory: ComponentFactory,
    private store: Store<{ app: AppState }>,
  ) {}

  async ngOnInit() {
    const { templateKey, configKey, strategyKey } = this.route.snapshot.data;

    try {
      const { component, config, strategy } =
        await this.componentFactory.createComponent(
          templateKey,
          configKey,
          strategyKey,
        );

      if (component) {
        const componentRef = this.container.createComponent(component);
        if (componentRef.instance) {
          (componentRef.instance as any).config = config;
          (componentRef.instance as any).onValueChange = this.handleAction(
            strategy,
            config,
          );
        }
      }
    } catch (error) {
      console.error('Error creating component:', error);
    }
  }

  handleAction = (strategy?: TemplateStrategy, config?: any) => {
    return (value: any) => {
      if (strategy) {
        strategy.handleAction(value);
      } else if (config?.['stateKey']) {
        this.store.dispatch(
          updateState({
            key: config['stateKey'],
            value,
          }),
        );
      }
    };
  };
}
