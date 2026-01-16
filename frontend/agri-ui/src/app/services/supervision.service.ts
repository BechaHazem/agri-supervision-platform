import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DonneeCapteur } from '../models/donnee-capteur.model';
import { DonneeMeteo } from '../models/donnee-meteo.model';
import { apiUrl } from './api-base-url';

@Injectable({
  providedIn: 'root'
})
export class SupervisionService {
  private readonly capteursBase = apiUrl('/api/supervision/capteurs');
  private readonly meteoBase = apiUrl('/api/supervision/meteo');

  constructor(private readonly http: HttpClient) {}

  // Capteurs
  listCapteurs(): Observable<DonneeCapteur[]> {
    return this.http.get<DonneeCapteur[]>(this.capteursBase);
  }

  createCapteur(payload: DonneeCapteur): Observable<DonneeCapteur> {
    return this.http.post<DonneeCapteur>(this.capteursBase, payload);
  }

  updateCapteur(id: number, payload: DonneeCapteur): Observable<DonneeCapteur> {
    return this.http.put<DonneeCapteur>(`${this.capteursBase}/${id}`, payload);
  }

  deleteCapteur(id: number): Observable<void> {
    return this.http.delete<void>(`${this.capteursBase}/${id}`);
  }

  // Meteo
  listMeteo(): Observable<DonneeMeteo[]> {
    return this.http.get<DonneeMeteo[]>(this.meteoBase);
  }

  createMeteo(payload: DonneeMeteo): Observable<DonneeMeteo> {
    return this.http.post<DonneeMeteo>(this.meteoBase, payload);
  }

  updateMeteo(id: number, payload: DonneeMeteo): Observable<DonneeMeteo> {
    return this.http.put<DonneeMeteo>(`${this.meteoBase}/${id}`, payload);
  }

  deleteMeteo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.meteoBase}/${id}`);
  }
}
