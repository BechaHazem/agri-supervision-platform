import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { DonneeCapteur } from 'src/app/models/donnee-capteur.model';
import { SupervisionService } from 'src/app/services/supervision.service';

@Component({
  selector: 'app-capteurs',
  templateUrl: './capteurs.component.html',
  styleUrls: ['./capteurs.component.scss']
})
export class CapteursComponent implements OnInit {
  items: DonneeCapteur[] = [];
  isLoading = false;
  error: string | null = null;

  editingId: number | null = null;

  readonly form = this.fb.group({
    parcelleId: [null as number | null, [Validators.required]],
    type: ['HUMIDITE_SOL', [Validators.required, Validators.minLength(2)]],
    valeur: [null as number | null, [Validators.required]]
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
    this.api.listCapteurs().subscribe({
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
      type: 'HUMIDITE_SOL',
      valeur: null
    });
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  startEdit(item: DonneeCapteur): void {
    if (item.id == null) return;
    this.editingId = item.id;
    this.form.reset({
      parcelleId: item.parcelleId,
      type: item.type,
      valeur: item.valeur
    });
  }

  cancel(): void {
    this.startCreate();
  }

  quickAnomaly(): void {
    this.form.patchValue({ valeur: 150 });
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const payload: DonneeCapteur = {
      parcelleId: this.form.controls.parcelleId.value!,
      type: this.form.controls.type.value ?? 'HUMIDITE_SOL',
      valeur: this.form.controls.valeur.value!
    };

    this.isLoading = true;
    this.error = null;

    const request$ = this.editingId == null
      ? this.api.createCapteur(payload)
      : this.api.updateCapteur(this.editingId, payload);

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

  remove(item: DonneeCapteur): void {
    if (item.id == null) return;
    const ok = window.confirm('Supprimer cette donnée capteur ?');
    if (!ok) return;

    this.isLoading = true;
    this.error = null;
    this.api.deleteCapteur(item.id).subscribe({
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
