import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaffSidebar } from '../staff-sidebar/staff-sidebar';

interface InfoItem {
  label: string;
  value: string;
}

interface InfoCard {
  title: string;
  iconViewBox: string;
  iconPaths: string[];
  items: InfoItem[];
}

@Component({
  selector: 'app-staff-profile',
  standalone: true,
  imports: [CommonModule, StaffSidebar],
  templateUrl: './staff-profile.html',
  styleUrls: ['./staff-profile.css'],
})
export class StaffProfile {
  protected readonly infoCards: InfoCard[] = [
    {
      title: 'Personal Information',
      iconViewBox: '0 0 24 24',
      iconPaths: ['M12 12a3.5 3.5 0 1 0-3.5-3.5A3.5 3.5 0 0 0 12 12Z', 'M5.5 19.5a6.8 6.8 0 0 1 13 0'],
      items: [
        { label: 'Full Name', value: 'Maria Santos' },
        { label: 'Date of Birth', value: 'March 15, 1995' },
        { label: 'Address', value: '123 Smile Street, Brgy. Dental, Manila' },
        { label: 'Emergency Contact', value: 'Juan Santos - 0917 987 6543' },
      ],
    },
    {
      title: 'Work Information',
      iconViewBox: '0 0 24 24',
      iconPaths: ['M4 5.5h16v14H4z', 'M8 3.5v4M16 3.5v4M4 9.5h16'],
      items: [
        { label: 'Position', value: 'Front Desk Staff' },
        { label: 'Department', value: 'Administration' },
        { label: 'Hire Date', value: 'January 10, 2023' },
        { label: 'Work Schedule', value: 'Mon - Fri - 8:00 AM - 5:00 PM' },
      ],
    },
  ];
}
