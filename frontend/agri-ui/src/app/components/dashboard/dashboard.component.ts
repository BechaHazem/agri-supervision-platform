import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, Subscription } from 'rxjs';
import * as L from 'leaflet';

import { ExploitationsService } from 'src/app/services/exploitations.service';
import { ParcellesService } from 'src/app/services/parcelles.service';
import { SupervisionService } from 'src/app/services/supervision.service';
import { Exploitation } from 'src/app/models/exploitation.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly subs = new Subscription();
  private map: L.Map | null = null;
  private markersLayer: L.LayerGroup | null = null;

  stats = {
    exploitations: 0,
    parcelles: 0,
    capteurs: 0,
    meteo: 0
  };

  exploitations: Exploitation[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(
    private readonly exploitationsApi: ExploitationsService,
    private readonly parcellesApi: ParcellesService,
    private readonly supervisionApi: SupervisionService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.renderMarkers();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  load(): void {
    this.isLoading = true;
    this.error = null;

    this.subs.add(
      forkJoin({
        exploitations: this.exploitationsApi.getAll(),
        parcelles: this.parcellesApi.getAll(),
        capteurs: this.supervisionApi.listCapteurs(),
        meteo: this.supervisionApi.listMeteo()
      }).subscribe({
        next: (res) => {
          this.exploitations = res.exploitations;
          this.stats = {
            exploitations: res.exploitations.length,
            parcelles: res.parcelles.length,
            capteurs: res.capteurs.length,
            meteo: res.meteo.length
          };
          this.isLoading = false;
          this.renderMarkers();
        },
        error: (err) => {
          this.isLoading = false;
          this.error = this.humanizeError(err);
        }
      })
    );
  }

  private initMap(): void {
    if (this.map) return;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
      iconUrl: 'assets/leaflet/marker-icon.png',
      shadowUrl: 'assets/leaflet/marker-shadow.png'
    });

    this.map = L.map('dashboard-map', {
      center: [46.2276, 2.2137],
      zoom: 5
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(this.map);

    this.markersLayer = L.layerGroup().addTo(this.map);
  }

  private renderMarkers(): void {
    if (!this.map || !this.markersLayer) return;
    this.markersLayer.clearLayers();

    const points: Array<{ lat: number; lng: number; label: string }> = [];
    for (const e of this.exploitations) {
      const coords = this.parseLatLng(e.localisation);
      if (!coords) continue;
      points.push({ lat: coords.lat, lng: coords.lng, label: e.nom });
      L.marker([coords.lat, coords.lng])
        .bindPopup(`<strong>${this.escapeHtml(e.nom)}</strong><br/>${this.escapeHtml(e.localisation ?? '')}`)
        .addTo(this.markersLayer);
    }

    if (points.length > 0) {
      const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng] as [number, number]));
      this.map.fitBounds(bounds.pad(0.2));
    }
  }

  private parseLatLng(value?: string | null): { lat: number; lng: number } | null {
    const raw = (value ?? '').trim();
    if (!raw) return null;
    const parts = raw.split(/\s*[,;]\s*/);
    if (parts.length < 2) return null;
    const lat = Number(parts[0]);
    const lng = Number(parts[1]);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    return { lat, lng };
  }

  private escapeHtml(input: string): string {
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  private humanizeError(err: any): string {
    const status = err?.status;
    const message = err?.error?.message || err?.message;
    if (status != null) return `Erreur HTTP ${status}${message ? `: ${message}` : ''}`;
    return message || 'Erreur inconnue';
  }
}
