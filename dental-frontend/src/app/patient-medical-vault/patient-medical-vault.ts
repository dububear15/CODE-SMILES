import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-patient-medical-vault',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './patient-medical-vault.html',
  styleUrl: './patient-medical-vault.css',
})
export class PatientMedicalVault {
  protected readonly sidebarCollapsed = signal(false);

  selectedFilter = 'all';

  filters = [
    { key: 'all', label: 'All Records' },
    { key: 'consultation', label: 'Consultations' },
    { key: 'treatment', label: 'Treatments' },
    { key: 'prescription', label: 'Prescriptions' },
  ];

  records = [
    {
      title: 'General Consultation',
      type: 'Consultation',
      dentist: 'Dr. Lee Sung-Kyung',
      date: 'April 2, 2026',
      category: 'consultation',
      status: 'Completed',
      notes: 'Routine oral assessment completed.',
    },
    {
      title: 'Teeth Whitening Session',
      type: 'Treatment',
      dentist: 'Dr. Ju Ji-Hoon',
      date: 'March 20, 2026',
      category: 'treatment',
      status: 'Completed',
      notes: 'Post-treatment care instructions provided.',
    },
    {
      title: 'Pain Relief Prescription',
      type: 'Prescription',
      dentist: 'Dr. Park Shin-Hye',
      date: 'March 12, 2026',
      category: 'prescription',
      status: 'Active',
      notes: 'Take after meals for 5 days.',
    },
    {
      title: 'Braces Adjustment',
      type: 'Treatment',
      dentist: 'Dr. Choo Young-Woo',
      date: 'February 28, 2026',
      category: 'treatment',
      status: 'Completed',
      notes: 'Next follow-up visit recommended after 4 weeks.',
    },
  ];

  protected toggleSidebar(): void {
    this.sidebarCollapsed.update((collapsed) => !collapsed);
  }

  setFilter(filterKey: string) {
    this.selectedFilter = filterKey;
  }

  get filteredRecords() {
    if (this.selectedFilter === 'all') {
      return this.records;
    }

    return this.records.filter(
      (record) => record.category === this.selectedFilter
    );
  }

  getStatusClass(status: string): string {
    return status.toLowerCase().replace(/\s+/g, '-');
  }
}
