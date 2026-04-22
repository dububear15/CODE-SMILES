import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DentistSidebar } from '../dentist-sidebar/dentist-sidebar';
import { DENTIST_PRESCRIPTIONS } from '../dentist-portal-data';

@Component({
  selector: 'app-dentist-prescription',
  standalone: true,
  imports: [CommonModule, RouterLink, DentistSidebar],
  templateUrl: './dentist-prescriptions.html',
  styleUrl: './dentist-prescriptions.css',
})
export class DentistPrescriptionsComponent {
  protected readonly prescriptions = DENTIST_PRESCRIPTIONS;
}
