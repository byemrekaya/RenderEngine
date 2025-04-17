export interface AppState {
  type: string | null;
  age: string | null;
  userInfo: {
    name: string;
    surname: string;
    email: string;
  } | null;
}

export const initialAppState: AppState = {
  type: null,
  age: null,
  userInfo: null,
};
