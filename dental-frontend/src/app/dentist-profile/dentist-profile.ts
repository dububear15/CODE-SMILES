import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DentistSidebar } from '../dentist-sidebar/dentist-sidebar';

@Component({
  selector: 'app-dentist-profile',
  standalone: true,
  imports: [CommonModule, DentistSidebar],
  templateUrl: './dentist-profile.html',
  styleUrl: './dentist-profile.css',
})
export class DentistProfile {}
