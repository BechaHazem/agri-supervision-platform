import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

import { Exploitation } from 'src/app/models/exploitation.model';
import { Parcelle } from 'src/app/models/parcelle.model';
import { ExploitationsService } from 'src/app/services/exploitations.service';
import { ParcellesService } from 'src/app/services/parcelles.service';

@Component({
  selector: 'app-parcelles',
  templateUrl: './parcelles.component.html',
  styleUrls: ['./parcelles.component.scss']
})
export class ParcellesComponent implements OnInit {
  private readonly subs = new Subscription();

  exploitationId: number | null = null;
  exploitation: Exploitation | null = null;
  parcelles: Parcelle[] = [];

  isLoading = false;
  error: string | null = null;

  editingId: number | null = null;

  readonly form = this.fb.group({
    exploitationId: [{ value: 0, disabled: true }, [Validators.required]],
    culture: [''],
    surface: [null as number | null],
    etat: ['']
  });

  constructor(
    private readonly api: ParcellesService,
    private readonly exploitationsApi: ExploitationsService,
    private readonly route: ActivatedRoute,
    private readonly fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.subs.add(
      this.route.paramMap.subscribe((params: ParamMap) => {
        const raw = params.get('id');
        this.exploitationId = raw ? Number(raw) : null;
        this.startCreate();
        this.load();
        this.loadExploitation();
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  load(): void {
    if (this.exploitationId == null || Number.isNaN(this.exploitationId)) {
      this.parcelles = [];
      return;
    }
    this.isLoading = true;
    this.error = null;
    this.api.getByExploitationId(this.exploitationId).subscribe({
      next: (items) => {
        this.parcelles = items;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.error = this.humanizeError(err);
      }
    });
  }

  loadExploitation(): void {
    if (this.exploitationId == null || Number.isNaN(this.exploitationId)) {
      this.exploitation = null;
      return;
    }
    this.exploitationsApi.getById(this.exploitationId).subscribe({
      next: (e) => (this.exploitation = e),
      error: () => (this.exploitation = null)
    });
  }

  startCreate(): void {
    this.editingId = null;
    this.form.reset({
      exploitationId: this.exploitationId ?? 0,
      culture: '',
      surface: null,
      etat: ''
    });
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  startEdit(item: Parcelle): void {
    if (item.id == null) return;
    this.editingId = item.id;
    this.form.reset({
      exploitationId: item.exploitationId ?? this.exploitationId ?? 0,
      culture: item.culture ?? '',
      surface: item.surface ?? null,
      etat: item.etat ?? ''
    });
  }

  cancel(): void {
    this.startCreate();
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    if (this.exploitationId == null || Number.isNaN(this.exploitationId)) return;

    const raw = this.form.getRawValue();
    const payload: Parcelle = {
      exploitationId: this.exploitationId,
      culture: this.emptyToNull(raw.culture),
      surface: raw.surface ?? null,
      etat: this.emptyToNull(raw.etat)
    };

    this.isLoading = true;
    this.error = null;

    const request$ = this.editingId == null
      ? this.api.create(payload)
      : this.api.update(this.editingId, payload);

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

  remove(item: Parcelle): void {
    if (item.id == null) return;
    const ok = window.confirm('Supprimer cette parcelle ?');
    if (!ok) return;

    this.isLoading = true;
    this.error = null;
    this.api.delete(item.id).subscribe({
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

  private emptyToNull(value: string | null | undefined): string | null {
    const trimmed = (value ?? '').trim();
    return trimmed.length === 0 ? null : trimmed;
  }

  private humanizeError(err: any): string {
    const status = err?.status;
    const message = err?.error?.message || err?.message;
    if (status != null) return `Erreur HTTP ${status}${message ? `: ${message}` : ''}`;
    return message || 'Erreur inconnue';
  }

}
