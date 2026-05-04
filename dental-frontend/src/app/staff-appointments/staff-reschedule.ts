import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StaffSidebar } from '../staff-sidebar/staff-sidebar';
import { APPOINTMENTS_DATA, StaffReviewAppointment } from './staff-appointment-detail';

interface CalendarDay {
  number: number | '';
  date: string;
  isPast: boolean;
  isWeekend: boolean;
  isFullyBooked: boolean;
  isAvailable: boolean;
  isToday: boolean;
}

interface TimeSlot {
  label: string;
  available: boolean;
  slotsLeft: number;
}

@Component({
  selector: 'app-staff-reschedule',
  standalone: true,
  imports: [CommonModule, FormsModule, StaffSidebar],
  templateUrl: './staff-reschedule.html',
  styleUrls: ['./staff-reschedule.css'],
})
export class StaffRescheduleComponent implements OnInit {

  protected appointment: StaffReviewAppointment | undefined;
  private returnTo: string = 'list'; // 'list' or 'details'

  protected readonly dentists = [
    'Dr. Raphoncel Eduria',
    'Dr. Christine Faith Metillo',
    'Dr. Nico Bongolto',
    'Dr. Derence Acojedo',
  ];
  protected readonly chairs = ['Chair 1', 'Chair 2', 'Chair 3'];

  // Form state
  protected selectedDentist = '';
  protected selectedChair = '';
  protected selectedDate = '';
  protected selectedTime = '';
  protected reason = '';
  protected notifyPatient = true;

  // Calendar
  protected viewDate = new Date();
  protected currentMonthName = '';
  protected currentYear = 0;
  protected calendarDays: CalendarDay[] = [];
  protected timeSlots: TimeSlot[] = [];

  // UI state
  protected submitted = false;
  protected showConfirmDialog = false;
  protected formError = '';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.returnTo = this.route.snapshot.queryParamMap.get('returnTo') || 'list';
    this.appointment = APPOINTMENTS_DATA.find(a => a.id === id);
    if (this.appointment) {
      this.selectedDentist = this.appointment.dentist;
      this.selectedChair   = this.appointment.chair;
    }
    this.buildCalendar();
  }

  // ── CALENDAR ──────────────────────────────────────────────────
  protected buildCalendar(): void {
    const year  = this.viewDate.getFullYear();
    const month = this.viewDate.getMonth();
    this.currentMonthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(this.viewDate);
    this.currentYear = year;
    this.calendarDays = [];

    const firstDay    = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today       = new Date(); today.setHours(0, 0, 0, 0);

    for (let i = 0; i < firstDay; i++) {
      this.calendarDays.push({ number: '', date: '', isPast: true, isWeekend: false, isFullyBooked: false, isAvailable: false, isToday: false });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(year, month, d);
      dateObj.setHours(0, 0, 0, 0);
      const dow          = dateObj.getDay();
      const isPast       = dateObj < today;
      const isFullyBooked = d % 5 === 0;
      const isWeekend    = dow === 0 || dow === 6;
      this.calendarDays.push({
        number: d,
        date: this.toIso(dateObj),
        isToday: dateObj.getTime() === today.getTime(),
        isPast,
        isWeekend,
        isFullyBooked,
        isAvailable: !isPast && !isFullyBooked,
      });
    }
  }

  protected prevMonth(): void {
    this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() - 1, 1);
    this.buildCalendar();
  }

  protected nextMonth(): void {
    this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + 1, 1);
    this.buildCalendar();
  }

  protected selectDate(day: CalendarDay): void {
    if (!day.isAvailable || !day.number) return;
    this.selectedDate = day.date;
    this.selectedTime = '';
    this.buildTimeSlots();
  }

  // ── TIME SLOTS ────────────────────────────────────────────────
  protected buildTimeSlots(): void {
    const raw = [
      { label: '8:00 AM',  slotsLeft: 3 },
      { label: '9:00 AM',  slotsLeft: 2 },
      { label: '10:00 AM', slotsLeft: 0 },
      { label: '11:00 AM', slotsLeft: 1 },
      { label: '1:00 PM',  slotsLeft: 4 },
      { label: '2:00 PM',  slotsLeft: 0 },
      { label: '3:00 PM',  slotsLeft: 2 },
      { label: '4:00 PM',  slotsLeft: 1 },
      { label: '5:00 PM',  slotsLeft: 3 },
    ];
    this.timeSlots = raw.map(s => ({ ...s, available: s.slotsLeft > 0 }));
  }

  // ── VALIDATION ────────────────────────────────────────────────
  protected get canSubmit(): boolean {
    return !!this.selectedDate && !!this.selectedTime && !!this.selectedDentist && !!this.selectedChair && !!this.reason.trim();
  }

  protected get formattedDate(): string {
    if (!this.selectedDate) return '';
    return new Intl.DateTimeFormat('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
      .format(new Date(this.selectedDate + 'T00:00:00'));
  }

  // ── SUBMIT ────────────────────────────────────────────────────
  protected requestSubmit(): void {
    this.formError = '';
    if (!this.canSubmit) {
      this.formError = 'Please fill in all required fields before submitting.';
      return;
    }
    this.showConfirmDialog = true;
  }

  protected confirmReschedule(): void {
    if (!this.appointment) return;
    this.appointment.status      = 'Rescheduled';
    this.appointment.date        = this.formattedDate;
    this.appointment.startTime   = this.selectedTime;
    this.appointment.dentist     = this.selectedDentist;
    this.appointment.chair       = this.selectedChair;
    this.appointment.updatedAt   = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' (rescheduled)';
    this.appointment.note        = this.reason.trim();
    this.showConfirmDialog = false;
    this.submitted = true;
  }

  protected dismissConfirm(): void {
    this.showConfirmDialog = false;
  }

  protected goBack(): void {
    if (this.returnTo === 'details' && this.appointment) {
      this.router.navigate(['/staff-appointments', this.appointment.id]);
    } else {
      this.router.navigate(['/staff-appointments']);
    }
  }

  protected goToAppointments(): void {
    this.router.navigate(['/staff-appointments']);
  }

  // ── HELPERS ───────────────────────────────────────────────────
  protected getStatusClass(status: string): string {
    return `status-${status.toLowerCase()}`;
  }

  private toIso(d: Date): string {
    const y  = d.getFullYear();
    const m  = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dd}`;
  }
}
