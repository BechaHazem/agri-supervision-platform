import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { DonneeMeteo } from 'src/app/models/donnee-meteo.model';
import { SupervisionService } from 'src/app/services/supervision.service';

@Component({
  selector: 'app-meteo',
  templateUrl: './meteo.component.html',
  styleUrls: ['./meteo.component.scss']
})
export class MeteoComponent implements OnInit {
  items: DonneeMeteo[] = [];
  isLoading = false;
  error: string | null = null;

  editingId: number | null = null;

  readonly form = this.fb.group({
    parcelleId: [null as number | null, [Validators.required]],
    temperature: [null as number | null],
    humiditeAir: [null as number | null],
    pluviometrie: [null as number | null]
  });

  constructor(
    private readonly api: SupervisionService,
    private readonly fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.error = null;
    this.api.listMeteo().subscribe({
      next: (items) => {
        this.items = items;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.error = this.humanizeError(err);
      }
    });
  }

  startCreate(): void {
    this.editingId = null;
    this.form.reset({
      parcelleId: null,
      temperature: null,
      humiditeAir: null,
      pluviometrie: null
    });
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  startEdit(item: DonneeMeteo): void {
    if (item.id == null) return;
    this.editingId = item.id;
    this.form.reset({
      parcelleId: item.parcelleId,
      temperature: item.temperature ?? null,
      humiditeAir: item.humiditeAir ?? null,
      pluviometrie: item.pluviometrie ?? null
    });
  }

  cancel(): void {
    this.startCreate();
  }

  quickAnomaly(): void {
    this.form.patchValue({ temperature: 60 });
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const payload: DonneeMeteo = {
      parcelleId: this.form.controls.parcelleId.value!,
      temperature: this.form.controls.temperature.value ?? null,
      humiditeAir: this.form.controls.humiditeAir.value ?? null,
      pluviometrie: this.form.controls.pluviometrie.value ?? null
    };

    this.isLoading = true;
    this.error = null;

    const request$ = this.editingId == null
      ? this.api.createMeteo(payload)
      : this.api.updateMeteo(this.editingId, payload);

    request$.subscribe({
      next: () => {
        this.isLoading = false;
        this.startCreate();
        this.load();
      },
      error: (err) => {
        this.isLoading = false;
        this.error = this.humanizeError(err);
      }
    });
  }

  remove(item: DonneeMeteo): void {
    if (item.id == null) return;
    const ok = window.confirm('Supprimer cette donnée météo ?');
    if (!ok) return;

    this.isLoading = true;
    this.error = null;
    this.api.deleteMeteo(item.id).subscribe({
      next: () => {
        this.isLoading = false;
        if (this.editingId === item.id) this.startCreate();
        this.load();
      },
      error: (err) => {
        this.isLoading = false;
        this.error = this.humanizeError(err);
      }
    });
  }

  private humanizeError(err: any): string {
    const status = err?.status;
    const message = err?.error?.message || err?.message;
    if (status != null) return `Erreur HTTP ${status}${message ? `: ${message}` : ''}`;
    return message || 'Erreur inconnue';
  }

}
