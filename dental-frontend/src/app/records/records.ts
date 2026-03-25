import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-records',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './records.html',
  styleUrl: './records.css',
})
export class Records {
  selectedFilter: string = 'all';

  filters = [
    { key: 'all', label: 'All' },
    { key: 'completed', label: 'Completed' },
    { key: 'updated', label: 'Updated' },
    { key: 'follow-up-required', label: 'Follow-up Required' },
    { key: 'archived', label: 'Archived' },
  ];

  records = [
    {
      icon: '🩺',
      type: 'Consultation',
      category: 'Initial Assessment',
      dentist: 'Dr. Lee Sung-Kyung',
      date: 'March 15, 2026',
      notes:
        'Initial consultation and oral examination completed. No major decay found. Recommended regular cleaning and continued monitoring.',
      status: 'Completed',
    },
    {
      icon: '🧼',
      type: 'Dental Cleaning',
      category: 'Preventive Care',
      dentist: 'Dr. Maria Santos',
      date: 'February 20, 2026',
      notes:
        'Professional cleaning performed. Mild plaque buildup removed successfully. Oral hygiene reminders were discussed during the visit.',
      status: 'Updated',
    },
    {
      icon: '✨',
      type: 'Whitening Assessment',
      category: 'Cosmetic Care',
      dentist: 'Dr. Ju Ji-Hoon',
      date: 'March 28, 2026',
      notes:
        'Patient is eligible for whitening treatment. Further assessment is needed before confirming the final procedure plan.',
      status: 'Follow-up Required',
    },
    {
      icon: '📸',
      type: 'X-Ray Review',
      category: 'Diagnostics',
      dentist: 'Dr. Choo Young-Woo',
      date: 'January 30, 2026',
      notes:
        'Radiographic review showed no urgent structural concerns. Continue routine monitoring and regular preventive visits.',
      status: 'Archived',
    },
    {
      icon: '🦷',
      type: 'Post-Cleaning Review',
      category: 'Routine Follow-up',
      dentist: 'Dr. Lee Sung-Kyung',
      date: 'April 2, 2026',
      notes:
        'Review completed after previous treatment. Patient condition is stable and no additional urgent procedure is required.',
      status: 'Completed',
    },
  ];

  setFilter(filter: string) {
    this.selectedFilter = filter;
  }

  get filteredRecords() {
    if (this.selectedFilter === 'all') return this.records;

    return this.records.filter(
      (record) =>
        record.status.toLowerCase().replace(/\s+/g, '-') === this.selectedFilter
    );
  }

  getStatusClass(status: string): string {
    return status.toLowerCase().replace(/\s+/g, '-');
  }
}