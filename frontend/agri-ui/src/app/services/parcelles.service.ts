import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Parcelle } from '../models/parcelle.model';
import { apiUrl } from './api-base-url';

@Injectable({
  providedIn: 'root'
})
export class ParcellesService {
  private readonly base = apiUrl('/api/parcelles');

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Parcelle[]> {
    return this.http.get<Parcelle[]>(this.base);
  }

  getById(id: number): Observable<Parcelle> {
    return this.http.get<Parcelle>(`${this.base}/${id}`);
  }

  getByExploitationId(exploitationId: number): Observable<Parcelle[]> {
    return this.getAll().pipe(map((items: Parcelle[]) => items.filter((p: Parcelle) => p.exploitationId === exploitationId)));
  }

  create(payload: Parcelle): Observable<Parcelle> {
    return this.http.post<Parcelle>(this.base, payload);
  }

  update(id: number, payload: Parcelle): Observable<Parcelle> {
    return this.http.put<Parcelle>(`${this.base}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
