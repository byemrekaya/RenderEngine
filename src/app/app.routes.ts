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
        redirectTo: 'user',
        pathMatch: 'full',
      },
      {
        path: 'user',
        component: RenderEngineComponent,
        data: {
          templateKey: 'user-form',
          configKey: 'user-form-config',
        },
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
