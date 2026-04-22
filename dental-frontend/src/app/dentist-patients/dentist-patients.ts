import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DentistSidebar } from '../dentist-sidebar/dentist-sidebar';
import { DENTIST_PATIENTS } from '../dentist-portal-data';

@Component({
  selector: 'app-dentist-patient',
  standalone: true,
  imports: [CommonModule, RouterLink, DentistSidebar],
  templateUrl: './dentist-patients.html',
  styleUrl: './dentist-patients.css',
})
export class DentistPatientsComponent {
  protected readonly patients = DENTIST_PATIENTS;
}
