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
  TreatmentStep,
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

  protected selectedTreatmentId = 'orthodontics';

  protected readonly treatmentPlans: TreatmentPlan[] = PATIENT_TREATMENT_PLANS;

  protected readonly reminderItems = [
    'Brush after every meal',
    'Use fluoride toothpaste',
    'Attend all scheduled appointments',
  ];

  protected notesModalOpen = false;
  protected activeStepForNotes: TreatmentStep | null = null;
  protected noteDraft = '';
  protected toastMessage = '';

  protected selectTreatment(treatmentId: string): void {
    this.selectedTreatmentId = treatmentId;
  }

  protected viewLinkedRecord(record: LinkedRecord): void {
    this.router.navigate(['/patient-medical-vault'], {
      queryParams: { record: record.title },
    });
  }

  protected openAddNotes(step: TreatmentStep): void {
    this.activeStepForNotes = step;
    this.noteDraft = '';
    this.notesModalOpen = true;
  }

  protected closeNotesModal(): void {
    this.notesModalOpen = false;
    this.activeStepForNotes = null;
    this.noteDraft = '';
  }

  protected saveNote(): void {
    const stepTitle = this.activeStepForNotes?.title || 'Current step';
    const message = this.noteDraft.trim()
      ? `Note added for ${stepTitle}.`
      : `No note was entered for ${stepTitle}.`;

    this.closeNotesModal();
    this.toastMessage = message;
    window.clearTimeout((this as { toastTimeout?: number }).toastTimeout);
    (this as { toastTimeout?: number }).toastTimeout = window.setTimeout(() => {
      this.toastMessage = '';
    }, 2400);
  }

  protected get selectedTreatment(): TreatmentPlan {
    return (
      this.treatmentPlans.find((plan) => plan.id === this.selectedTreatmentId) ??
      this.treatmentPlans[0]
    );
  }
}
