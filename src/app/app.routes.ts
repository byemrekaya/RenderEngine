import { Routes } from '@angular/router';
import { RenderEngineComponent } from './core/render-engine/render-engine.component';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'type',
        pathMatch: 'full',
      },
      {
        path: 'type',
        component: RenderEngineComponent,
        data: {
          shortcode: 'basic-radio-list',
          configKey: 'vehicle-type-config',
        },
      },
      {
        path: 'age',
        component: RenderEngineComponent,
        data: {
          shortcode: 'basic-radio-list',
          configKey: 'vehicle-age-config',
        },
      },
    ],
  },
];
