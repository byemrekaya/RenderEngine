import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ComponentFactory } from '@core';
import { Store } from '@ngrx/store';
import { updateState } from '../../store/actions/app.actions';
import { AppState } from '../../store/models/app-state.model';
import { TemplateStrategy } from '../interfaces/template-strategy.interface';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';

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
export class RenderEngineComponent implements OnInit, OnDestroy {
  @ViewChild('container', { read: ViewContainerRef, static: true })
  container!: ViewContainerRef;

  private lastHandledValues = new Map<string, any>();
  private destroy$ = new Subject<void>();
  private currentComponentRef: any;
  private actionSubject = new Subject<{
    templateKey: string;
    value: any;
    strategy?: TemplateStrategy;
    config?: any;
  }>();

  constructor(
    private route: ActivatedRoute,
    private componentFactory: ComponentFactory,
    private store: Store<{ app: AppState }>,
  ) {
    this.setupActionHandler();
  }

  private setupActionHandler() {
    this.actionSubject
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged(
          (prev, curr) =>
            prev.templateKey === curr.templateKey &&
            JSON.stringify(prev.value) === JSON.stringify(curr.value),
        ),
      )
      .subscribe(({ templateKey, value, strategy, config }) => {
        this.processAction(templateKey, value, strategy, config);
      });
  }

  ngOnInit() {
    this.route.data.pipe(takeUntil(this.destroy$)).subscribe(async (data) => {
      await this.initializeComponent(data);
    });
  }

  ngOnDestroy() {
    this.cleanup();
    this.destroy$.next();
    this.destroy$.complete();
    this.actionSubject.complete();
  }

  private async initializeComponent(data: any) {
    const { templateKey, configKey, strategyKey } = data;

    try {
      this.cleanup();

      const { component, config, strategy } =
        await this.componentFactory.createComponent(
          templateKey,
          configKey,
          strategyKey,
        );

      if (component) {
        this.currentComponentRef = this.container.createComponent(component);
        if (this.currentComponentRef.instance) {
          (this.currentComponentRef.instance as any).config = config;
          (this.currentComponentRef.instance as any).onValueChange =
            this.handleAction(templateKey, strategy, config);
        }
      }
    } catch (error) {
      console.error('Component initialization error:', error);
    }
  }

  private cleanup() {
    if (this.currentComponentRef) {
      this.currentComponentRef.destroy();
      this.currentComponentRef = null;
    }
    this.container.clear();
    this.lastHandledValues.clear();
  }

  private processAction(
    templateKey: string,
    value: any,
    strategy?: TemplateStrategy,
    config?: any,
  ) {
    if (config?.['stateKey']) {
      this.store.dispatch(
        updateState({
          key: config['stateKey'],
          value,
        }),
      );
    }

    if (strategy) {
      strategy.handleAction(value, config);
    }
  }

  handleAction = (
    templateKey: string,
    strategy?: TemplateStrategy,
    config?: any,
  ) => {
    return (value: any) => {
      this.actionSubject.next({ templateKey, value, strategy, config });
    };
  };
}
