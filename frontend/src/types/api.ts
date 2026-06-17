export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiErrorShape {
  message: string;
  details?: unknown;
  status?: number;
}
