import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ComponentFactory } from '../services/component-factory.service';

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
  ) {}

  async ngOnInit() {
    const { shortcode, configKey } = this.route.snapshot.data;

    try {
      const { component, config } = await this.componentFactory.createComponent(
        shortcode,
        configKey,
      );

      if (component) {
        const componentRef = this.container.createComponent(component);
        if (
          componentRef.instance &&
          typeof componentRef.instance === 'object'
        ) {
          (componentRef.instance as any).config = config;
        }
      }
    } catch (error) {
      console.error('Failed to render component:', error);
    }
  }
}
