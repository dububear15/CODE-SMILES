import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DentistSidebar } from '../dentist-sidebar/dentist-sidebar';
import { DENTIST_NOTIFICATIONS } from '../dentist-portal-data';

@Component({
  selector: 'app-dentist-notification',
  standalone: true,
  imports: [CommonModule, RouterLink, DentistSidebar],
  templateUrl: './dentist-notifications.html',
  styleUrl: './dentist-notifications.css',
})
export class DentistNotificationsComponent {
  protected readonly notifications = DENTIST_NOTIFICATIONS;
}
