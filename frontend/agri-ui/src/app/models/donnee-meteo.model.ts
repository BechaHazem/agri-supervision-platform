export interface DonneeMeteo {
  id?: number;
  parcelleId: number;
  temperature?: number | null;
  humiditeAir?: number | null;
  pluviometrie?: number | null;
  /** ISO timestamp */
  date?: string;
}
