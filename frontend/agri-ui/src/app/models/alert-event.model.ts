export interface AlertEvent {
  kind: string;
  parcelleId?: number | null;
  message: string;
  /** ISO timestamp */
  timestamp?: string;
}
