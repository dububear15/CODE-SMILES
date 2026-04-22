import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DentistSidebar } from '../dentist-sidebar/dentist-sidebar';

interface DashboardStat {
  label: string;
  value: string;
  unit: string;
  icon: string;
  tone: 'blue' | 'green' | 'violet' | 'amber';
}

interface DashboardScheduleItem {
  time: string;
  period: string;
  initials: string;
  patient: string;
  patientId: string;
  age: number;
  service: string;
  status: string;
  statusTone: 'confirmed' | 'progress' | 'pending';
  primaryAction: string;
}

interface QueueItem {
  patient: string;
  service: string;
  date: string;
  time: string;
  status: string;
  statusTone: 'confirmed' | 'progress' | 'pending';
}

interface QuickAction {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-dentist-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, DentistSidebar],
  templateUrl: './dentist-dashboard.html',
  styleUrl: './dentist-dashboard.css',
})
export class DentistDashboard {
  protected readonly notifications = [
    { title: 'Lab result ready' },
    { title: 'Patient confirmation' },
    { title: 'Chair prep update' },
  ];

  protected readonly summaryCards: DashboardStat[] = [
    { label: "Today's Appointments", value: '12', unit: 'Visits', icon: 'C', tone: 'blue' },
    { label: 'Pending Requests', value: '06', unit: 'Reviews', icon: 'R', tone: 'violet' },
    { label: 'Approved Today', value: '09', unit: 'Cases', icon: 'O', tone: 'green' },
    { label: 'Cancelled / Rescheduled', value: '04', unit: 'Updates', icon: 'L', tone: 'amber' },
  ];

  protected readonly todaySchedule: DashboardScheduleItem[] = [
    {
      time: '9:00',
      period: 'AM',
      initials: 'IC',
      patient: 'Isabella Cruz',
      patientId: 'CS-0811',
      age: 26,
      service: 'Dental Cleaning',
      status: 'Confirmed',
      statusTone: 'confirmed',
      primaryAction: 'Start Consultation',
    },
    {
      time: '10:30',
      period: 'AM',
      initials: 'MR',
      patient: 'Miguel Reyes',
      patientId: 'CS-1123',
      age: 28,
      service: 'Tooth Extraction',
      status: 'In Progress',
      statusTone: 'progress',
      primaryAction: 'Continue',
    },
    {
      time: '1:00',
      period: 'PM',
      initials: 'AS',
      patient: 'Ariana Santos',
      patientId: 'CS-0767',
      age: 19,
      service: 'Orthodontic Review',
      status: 'Confirmed',
      statusTone: 'confirmed',
      primaryAction: 'Open Chart',
    },
    {
      time: '3:30',
      period: 'PM',
      initials: 'DF',
      patient: 'Daniel Flores',
      patientId: 'CS-0941',
      age: 34,
      service: 'Root Canal Follow-up',
      status: 'Pending',
      statusTone: 'pending',
      primaryAction: 'View Details',
    },
  ];

  protected readonly approvalQueue: QueueItem[] = [
    {
      patient: 'Sofia Bautista',
      service: 'Teeth Whitening and Consultation',
      date: 'Apr 13, 2024',
      time: '11:00 AM',
      status: 'Standard',
      statusTone: 'pending',
    },
    {
      patient: 'Noah Villanueva',
      service: 'Deep Cleaning',
      date: 'Apr 13, 2024',
      time: '2:00 PM',
      status: 'High',
      statusTone: 'progress',
    },
    {
      patient: 'Camille Navarro',
      service: 'Braces Adjustment',
      date: 'Apr 14, 2024',
      time: '9:30 AM',
      status: 'Standard',
      statusTone: 'pending',
    },
  ];

  protected readonly quickActions: QuickAction[] = [
    { label: 'My Appointments', icon: 'A', route: '/dentist-appointments' },
    { label: 'My Patients', icon: 'P', route: '/dentist-patients' },
    { label: 'Medical Records', icon: 'R', route: '/dentist-medical-vault' },
    { label: 'Treatment Plans', icon: 'T', route: '/dentist-treatment-plans' },
  ];
}
