import { Routes } from '@angular/router';
import { RenderEngineComponent } from '@core';
import { LayoutComponent } from './layout';

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
          templateKey: 'basic-radio-list',
          configKey: 'vehicle-type-config',
        },
      },
      {
        path: 'age',
        component: RenderEngineComponent,
        data: {
          templateKey: 'basic-radio-list',
          configKey: 'vehicle-age-config',
          strategyKey: 'custom-logic',
        },
      },
    ],
  },
];
