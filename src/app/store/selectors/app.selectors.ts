import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from '../models/app-state.model';

export const selectAppState = createFeatureSelector<AppState>('app');

export const selectType = createSelector(
  selectAppState,
  (state: AppState) => state.type,
);

export const selectAge = createSelector(
  selectAppState,
  (state: AppState) => state.age,
);
