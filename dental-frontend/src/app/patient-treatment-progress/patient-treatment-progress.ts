import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PatientSidebarComponent } from '../patient-sidebar/patient-sidebar';
import { AuthService } from '../services/auth.service';
import {
  LinkedRecord,
  PATIENT_TREATMENT_PLANS,
  TreatmentPlan,
} from './patient-treatment-plan-data';

@Component({
  selector: 'app-patient-treatment-progress',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, PatientSidebarComponent],
  templateUrl: './patient-treatment-progress.html',
  styleUrl: './patient-treatment-progress.css',
})
export class PatientTreatmentProgress {
  constructor(private readonly router: Router, private readonly auth: AuthService) {}

  protected get patientProfile() {
    const user = this.auth.getUser();
    return {
      name: user ? `${user.first_name} ${user.last_name}` : 'Patient',
      id:   user ? `CS-${String(user.id).padStart(5, '0')}` : '—',
    };
  }

  protected readonly treatmentPlans: TreatmentPlan[] = PATIENT_TREATMENT_PLANS;

  // ── Search / filter ──────────────────────────────────────────
  protected searchTerm = '';
  protected statusFilter = 'all';

  protected get filteredPlans(): TreatmentPlan[] {
    const q = this.searchTerm.trim().toLowerCase();
    return this.treatmentPlans.filter(p => {
      const matchesSearch = !q ||
        p.title.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q);
      const matchesStatus = this.statusFilter === 'all' ||
        p.statusClass === this.statusFilter;
      return matchesSearch && matchesStatus;
    });
  }

  protected get activePlans(): TreatmentPlan[] {
    return this.filteredPlans.filter(p =>
      p.statusClass === 'active' || p.statusClass === 'pending' || p.statusClass === 'upcoming'
    );
  }

  protected get completedPlans(): TreatmentPlan[] {
    return this.filteredPlans.filter(p => p.statusClass === 'completed');
  }

  protected get activeCount(): number {
    return this.treatmentPlans.filter(p => p.statusClass === 'active' || p.statusClass === 'pending').length;
  }

  protected get completedCount(): number {
    return this.treatmentPlans.filter(p => p.statusClass === 'completed').length;
  }

  // ── Accordion ────────────────────────────────────────────────
  protected expandedId: string | null = null;

  protected toggleExpand(id: string): void {
    this.expandedId = this.expandedId === id ? null : id;
  }

  protected isExpanded(id: string): boolean {
    return this.expandedId === id;
  }

  // ── Linked records ───────────────────────────────────────────
  protected viewLinkedRecord(record: LinkedRecord): void {
    this.router.navigate(['/patient-medical-vault'], {
      queryParams: { record: record.title },
    });
  }

  /** Collect all unique linked records across all steps of a plan */
  protected getLinkedRecords(plan: TreatmentPlan): LinkedRecord[] {
    const seen = new Set<string>();
    const result: LinkedRecord[] = [];
    for (const step of plan.steps) {
      for (const r of step.linkedRecords ?? []) {
        if (!seen.has(r.title)) {
          seen.add(r.title);
          result.push(r);
        }
      }
    }
    return result;
  }

  // ── Toast ────────────────────────────────────────────────────
  protected toastMessage = '';

  protected showToast(msg: string): void {
    this.toastMessage = msg;
    window.clearTimeout((this as { _tt?: number })._tt);
    (this as { _tt?: number })._tt = window.setTimeout(() => {
      this.toastMessage = '';
    }, 2400);
  }

  // ── Step icon helper ─────────────────────────────────────────
  protected stepIcon(stage: string): 'done' | 'current' | 'next' {
    return stage as 'done' | 'current' | 'next';
  }
}
