export interface StateAction<T = unknown> {
  type: string;
  payload?: T;
}

export interface StateConfig {
  storePath: string[];
  actions?: string[];
}

export interface WrapperState {
  loading?: boolean;
  error?: string | null;
  data?: unknown;
  [key: string]: unknown;
}
