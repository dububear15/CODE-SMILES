import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DentistSidebar } from '../dentist-sidebar/dentist-sidebar';

@Component({
  selector: 'app-dentist-settings',
  standalone: true,
  imports: [CommonModule, DentistSidebar],
  templateUrl: './dentist-settings.html',
  styleUrl: './dentist-settings.css',
})
export class DentistSettingsComponent {}
