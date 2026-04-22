import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DentistSidebar } from '../dentist-sidebar/dentist-sidebar';
import {
  DENTIST_MEDICAL_VAULT,
  DENTIST_NEXT_PATIENT,
  DENTIST_PRESCRIPTIONS,
  DENTIST_TREATMENT_TIMELINE,
} from '../dentist-portal-data';

@Component({
  selector: 'app-dentist-medical-vault',
  standalone: true,
  imports: [CommonModule, RouterLink, DentistSidebar],
  templateUrl: './dentist-medical-vault.html',
  styleUrl: './dentist-medical-vault.css',
})
export class DentistMedicalVault {
  protected readonly focusPatient = DENTIST_NEXT_PATIENT;
  protected readonly vaultEntries = DENTIST_MEDICAL_VAULT;
  protected readonly timeline = DENTIST_TREATMENT_TIMELINE;
  protected readonly prescriptions = DENTIST_PRESCRIPTIONS;
}
