import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PatientSidebarComponent } from '../patient-sidebar/patient-sidebar';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, PatientSidebarComponent],
  templateUrl: './patient-dashboard.html',
  styleUrl: './patient-dashboard.css',
})
export class PatientDashboardComponent {
  protected careChecklist = [
    { label: 'Brush for two full minutes twice daily.', done: false },
    { label: 'Drink more water to support enamel and gum health.', done: false },
    { label: 'Wear your aligners for the recommended hours today.', done: false },
    { label: 'Review aftercare notes before your next adjustment.', done: false },
  ];

  protected toggleChecklistItem(index: number): void {
    const item = this.careChecklist[index];
    if (!item) {
      return;
    }

    item.done = !item.done;
  }
}
