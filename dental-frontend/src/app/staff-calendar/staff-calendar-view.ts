import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StaffCalendarService, Schedule } from './staff-calendar.service';
import { StaffSidebar } from '../staff-sidebar/staff-sidebar';

@Component({
  selector: 'app-staff-calendar-view',
  standalone: true,
  imports: [CommonModule, StaffSidebar],
  templateUrl: './staff-calendar-view.html',
  styleUrls: ['./staff-calendar.css'],
})
export class StaffCalendarViewComponent implements OnInit {
  // Existing data
  schedule: Schedule | undefined;
  schedules: Schedule[] = [];
  notFound = false;
  scheduleId: string = '';

  // Boilerplate for Calendar Grid
  calendarDays = [
    { label: 'Mon', date: '19', active: true },
    { label: 'Tue', date: '20', active: false },
    { label: 'Wed', date: '21', active: false },
    { label: 'Thu', date: '22', active: false },
    { label: 'Fri', date: '23', active: false },
    { label: 'Sat', date: '24', active: false },
    { label: 'Sun', date: '25', active: false },
  ];

  boardTimeLabels = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
  boardEvents: any[] = [];
  unavailableBlocks: any[] = [];
  
  miniCalendarWeekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  miniCalendarDates = Array.from({length: 31}, (_, i) => i + 1);
  
  legendItems = [
    { label: 'Confirmed', className: 'legend-confirmed' },
    { label: 'In Progress', className: 'legend-progress' },
    { label: 'Needs Prep', className: 'legend-needs-prep' },
    { label: 'Cancelled', className: 'legend-cancelled' },
    { label: 'Unavailable', className: 'legend-unavailable' }
  ];

  constructor(
    private service: StaffCalendarService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Load single schedule if ID exists
    this.route.params.subscribe((params) => {
      this.scheduleId = params['id'];
      if (this.scheduleId) {
        this.schedule = this.service.getScheduleById(this.scheduleId);
        if (!this.schedule) { this.notFound = true; }
      }
    });

    // Load full list for calendar
    this.service.getSchedules().subscribe((data: Schedule[]) => {
      this.schedules = data;
    });
  }

  // --- UI Methods ---

  navigateToNotifications(): void {
    // Update path if needed
    this.router.navigate(['/notifications']);
  }

  getBoardEventClass(status: string): string {
    const map: Record<string, string> = {
      'Confirmed': 'status-confirmed',
      'Pending': 'status-pending',
    };
    return map[status] || 'status-pending';
  }

  getBoardEventStyle(event: any): any {
    // Placeholder logic for positioning events
    return { 'grid-row': '2 / 4' }; 
  }

  getBoardStatusLabel(status: string): string {
    return status;
  }

  // --- Existing Logic ---

  onEdit(): void {
    this.router.navigate(['/staff-calendar/edit', this.scheduleId]);
  }

  onDelete(): void {
    if (confirm('Are you sure you want to delete this schedule?')) {
      this.service.deleteSchedule(this.scheduleId);
      this.router.navigate(['/staff-calendar']);
    }
  }

  onBack(): void {
    this.router.navigate(['/staff-calendar']);
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      Confirmed: '#2aa483',
      Pending: '#d99b3f',
      Completed: '#4d8fe1',
      Cancelled: '#df6f7d',
    };
    return colors[status] || '#7a8fa7';
  }
}