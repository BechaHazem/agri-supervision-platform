export interface DonneeCapteur {
  id?: number;
  parcelleId: number;
  type: string;
  valeur: number;
  /** ISO timestamp */
  date?: string;
}
