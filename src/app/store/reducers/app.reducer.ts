import { createReducer, on } from '@ngrx/store';
import { AppState, initialAppState } from '../models/app-state.model';
import { updateState } from '../actions/app.actions';

export const appReducer = createReducer(
  initialAppState,
  on(updateState, (state, { key, value }) => ({
    ...state,
    [key]: value,
  })),
);
