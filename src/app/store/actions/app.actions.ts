import { createAction, props } from '@ngrx/store';

export const updateState = createAction(
  '[App] Update State',
  props<{ key: string; value: any }>(),
);
