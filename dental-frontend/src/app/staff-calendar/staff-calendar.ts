import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StaffSidebar } from '../staff-sidebar/staff-sidebar';

type BoardEventStatus = 'Confirmed' | 'In Progress' | 'Needs Prep' | 'Pending' | 'Cancelled';

interface CalendarDay {
  label: string;
  date: string;
  active?: boolean;
}

interface BoardEvent {
  dayIndex: number;
  startSlot: number;
  span: number;
  startTime: string;
  endTime: string;
  patient: string;
  service: string;
  status: BoardEventStatus;
}

interface UnavailableBlock {
  dayIndex: number;
  startSlot: number;
  span: number;
  startTime: string;
  endTime: string;
}

@Component({
  selector: 'app-staff-calendar',
  standalone: true,
  imports: [CommonModule, RouterLink, StaffSidebar],
  templateUrl: './staff-calendar.html',
  styleUrls: ['./staff-calendar.css'],
})
export class StaffCalendar {
  protected readonly calendarDays: CalendarDay[] = [
    { label: 'MON', date: 'Sep 8' },
    { label: 'TUE', date: 'Sep 9', active: true },
    { label: 'WED', date: 'Sep 10' },
    { label: 'THU', date: 'Sep 11' },
    { label: 'FRI', date: 'Sep 12' },
    { label: 'SAT', date: 'Sep 13' },
    { label: 'SUN', date: 'Sep 14' },
  ];

  protected readonly boardTimeLabels = [
    '8:00 AM',
    '9:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '1:00 PM',
    '2:00 PM',
    '3:00 PM',
    '4:00 PM',
    '5:00 PM',
  ];

  protected readonly boardEvents: BoardEvent[] = [
    { dayIndex: 1, startSlot: 2, span: 2, startTime: '9:00 AM', endTime: '10:30 AM', patient: 'Isabella Cruz', service: 'Cleaning', status: 'Confirmed' },
    { dayIndex: 2, startSlot: 4, span: 2, startTime: '10:30 AM', endTime: '12:00 PM', patient: 'Miguel Reyes', service: 'Extraction', status: 'In Progress' },
    { dayIndex: 3, startSlot: 5, span: 2, startTime: '11:00 AM', endTime: '1:00 PM', patient: 'Ariana Santos', service: 'Review', status: 'Needs Prep' },
    { dayIndex: 2, startSlot: 7, span: 2, startTime: '1:30 PM', endTime: '3:00 PM', patient: 'Sofia Navarro', service: 'Whitening', status: 'Cancelled' },
    { dayIndex: 5, startSlot: 3, span: 2, startTime: '9:30 AM', endTime: '11:00 AM', patient: 'Daniel Flores', service: 'Follow-up', status: 'Pending' },
    { dayIndex: 4, startSlot: 7, span: 2, startTime: '2:00 PM', endTime: '3:30 PM', patient: 'James Lee', service: 'Consultation', status: 'Confirmed' },
    { dayIndex: 1, startSlot: 9, span: 2, startTime: '4:30 PM', endTime: '5:30 PM', patient: 'Lucas David', service: 'Cleaning', status: 'Confirmed' },
  ];

  protected readonly unavailableBlocks: UnavailableBlock[] = [
    { dayIndex: 4, startSlot: 1, span: 1, startTime: '8:00 AM', endTime: '9:00 AM' },
    { dayIndex: 6, startSlot: 5, span: 5, startTime: '12:00 PM', endTime: '5:00 PM' },
  ];

  protected readonly miniCalendarWeekdays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  protected readonly miniCalendarDates = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];

  protected readonly legendItems = [
    { label: 'Confirmed', className: 'legend-confirmed' },
    { label: 'In Progress', className: 'legend-progress' },
    { label: 'Needs Prep', className: 'legend-needs-prep' },
    { label: 'Cancelled', className: 'legend-cancelled' },
    { label: 'Unavailable', className: 'legend-unavailable' },
  ];

  protected getBoardEventStyle(event: { dayIndex: number; startSlot: number; span: number }): Record<string, string> {
    return {
      gridColumn: `${event.dayIndex + 1}`,
      gridRow: `${event.startSlot + 1} / span ${event.span}`,
    };
  }

  protected getBoardEventClass(status: BoardEventStatus): string {
    return `status-${status.toLowerCase().replace(/ /g, '-')}`;
  }

  protected getBoardStatusLabel(status: BoardEventStatus): string {
    return status;
  }
}
