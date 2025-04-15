export interface AppState {
  type: string | null;
  age: string | null;
}

export const initialAppState: AppState = {
  type: null,
  age: null,
};
