import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StaffSidebar } from '../staff-sidebar/staff-sidebar';
import { AppointmentRequest, STAFF_REQUESTS } from '../staff-portal-data';

@Component({
  selector: 'app-staff-request',
  standalone: true,
  imports: [CommonModule, RouterLink, StaffSidebar],
  templateUrl: './staff-requests.html',
  styleUrls: ['./staff-requests.css'],
})
export class StaffRequestsComponent {
  protected requests = STAFF_REQUESTS.map((request) => ({ ...request }));
  protected selectedRequest: AppointmentRequest | null = null;
  protected actionMessage = 'Review the request details before making a schedule decision.';

  protected openDetails(request: AppointmentRequest): void {
    this.selectedRequest = request;
  }

  protected closeDetails(): void {
    this.selectedRequest = null;
  }

  protected approve(request: AppointmentRequest): void {
    request.status = 'Approved';
    this.actionMessage = `${request.patient} was approved and should now reflect across patient, dentist, and calendar views.`;
  }

  protected reject(request: AppointmentRequest): void {
    request.status = 'Cancelled';
    this.actionMessage = `${request.patient} was rejected and should be followed up with a patient notice.`;
  }

  protected reschedule(request: AppointmentRequest): void {
    request.status = 'Rescheduled';
    this.actionMessage = `${request.patient} was marked for reschedule and needs a new proposed slot.`;
  }

  protected get pendingCount(): number {
    return this.requests.filter((request) => request.status === 'Pending').length;
  }

  protected get approvedCount(): number {
    return this.requests.filter((request) => request.status === 'Approved').length;
  }

  protected get changedCount(): number {
    return this.requests.filter((request) => request.status === 'Cancelled' || request.status === 'Rescheduled').length;
  }
}
