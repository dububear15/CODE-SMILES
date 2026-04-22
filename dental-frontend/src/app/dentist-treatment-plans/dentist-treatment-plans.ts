import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DentistSidebar } from '../dentist-sidebar/dentist-sidebar';
import { DENTIST_TREATMENT_PROGRESS } from '../dentist-portal-data';

@Component({
  selector: 'app-dentist-treatment-plan',
  standalone: true,
  imports: [CommonModule, RouterLink, DentistSidebar],
  templateUrl: './dentist-treatment-plans.html',
  styleUrl: './dentist-treatment-plans.css',
})
export class DentistTreatmentPlansComponent {
  protected readonly plans = DENTIST_TREATMENT_PROGRESS;

  protected progressWidth(value: number): string {
    return `${value}%`;
  }
}
