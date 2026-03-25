import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface TimeSlot {
  time: string;
  slotsLeft: number;
}

interface ServiceDetail {
  name: string;
  duration: number;
}

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking.html',
  styleUrls: ['./booking.css']
})
export class BookingComponent implements OnInit {
  currentStep: any = 1;
  selectedCategory: string = '';
  selectedServices: string[] = [];
  selectedSubServices: ServiceDetail[] = [];

  totalSelectedDuration: number = 0;
  readonly MAX_MINUTES = 120;

  selectedDate: string = '';
  selectedTime: string = '';
  availableSlots: TimeSlot[] = [];

  viewDate: Date = new Date();
  currentMonthName: string = '';
  currentYear: number = 0;
  calendarDays: any[] = [];

  bookingConfirmed: boolean = false;

  confirmedBooking = {
    fullName: '',
    date: '',
    time: '',
    services: [] as ServiceDetail[]
  };

  patientDetails = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: '',
    notes: ''
  };

  serviceMap: { [key: string]: ServiceDetail[] } = {
    'General Dentistry': [
      { name: 'Oral Consultation', duration: 15 },
      { name: 'Dental Cleaning', duration: 45 },
      { name: 'Digital X-Rays', duration: 20 },
      { name: 'Tooth Fillings', duration: 60 },
      { name: 'Fluoride Treatment', duration: 15 },
      { name: 'Dental Sealants', duration: 30 },
      { name: 'Simple Extraction', duration: 45 },
      { name: 'Emergency Dental Care', duration: 60 }
    ],
    'Cosmetic Arts': [
      { name: 'Teeth Whitening', duration: 60 },
      { name: 'Dental Veneers', duration: 90 },
      { name: 'Dental Bonding', duration: 60 },
      { name: 'Smile Makeover', duration: 120 },
      { name: 'Tooth Contouring', duration: 45 },
      { name: 'Gum Contouring', duration: 60 }
    ],
    'Orthodontics': [
      { name: 'Traditional Braces', duration: 90 },
      { name: 'Ceramic Braces', duration: 90 },
      { name: 'Self-Ligating Braces', duration: 90 },
      { name: 'Clear Aligners', duration: 45 },
      { name: 'Retainers', duration: 30 },
      { name: 'Orthodontic Consultation', duration: 30 }
    ],
    'Oral Surgery': [
      { name: 'Surgical Extraction', duration: 60 },
      { name: 'Wisdom Tooth Removal', duration: 90 },
      { name: 'Cyst Removal', duration: 60 },
      { name: 'Minor Oral Surgery', duration: 45 },
      { name: 'Frenectomy', duration: 30 }
    ],
    'Dental Implants': [
      { name: 'Implant Consultation', duration: 30 },
      { name: 'Single Tooth Implant', duration: 90 },
      { name: 'Multiple Tooth Implant', duration: 120 },
      { name: 'Implant Crown Placement', duration: 60 },
      { name: 'Implant Maintenance', duration: 45 }
    ],
    'Pediatric Care': [
      { name: 'Pediatric Check-up', duration: 20 },
      { name: 'Pediatric Cleaning', duration: 30 },
      { name: 'Fluoride for Kids', duration: 15 },
      { name: 'Dental Sealants', duration: 30 },
      { name: 'Baby Tooth Extraction', duration: 30 },
      { name: 'Space Maintainers', duration: 45 }
    ]
  };

  constructor(private router: Router) {}

  ngOnInit() {
    this.generateCalendar();
  }

  get currentSubServices() {
    return this.serviceMap[this.selectedCategory] || [];
  }

  get selectedServiceSummary(): string {
    const names = this.selectedSubServices.map(service => service.name).join(', ');
    return `${names} • ${this.totalSelectedDuration} mins`;
  }

  get isFirstNameValid(): boolean {
    return /^[A-Za-z\s'-]{2,}$/.test(this.patientDetails.firstName.trim());
  }

  get isLastNameValid(): boolean {
    return /^[A-Za-z\s'-]{2,}$/.test(this.patientDetails.lastName.trim());
  }

  get isEmailValid(): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.patientDetails.email.trim());
  }

  get isPhoneValid(): boolean {
    return /^09\d{9}$/.test(this.patientDetails.phone.trim());
  }

  get isAgeValid(): boolean {
    const age = Number(this.patientDetails.age);
    return Number.isInteger(age) && age >= 1 && age <= 120;
  }

  get canProceedToReview(): boolean {
    return (
      this.isFirstNameValid &&
      this.isLastNameValid &&
      this.isEmailValid &&
      this.isPhoneValid &&
      this.isAgeValid
    );
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.currentStep = 1.5;
  }

  toggleService(serviceName: string) {
    const serviceObj = this.currentSubServices.find(s => s.name === serviceName);
    if (!serviceObj) return;

    const index = this.selectedServices.indexOf(serviceName);

    if (index > -1) {
      this.selectedServices.splice(index, 1);
      this.selectedSubServices = this.selectedSubServices.filter(s => s.name !== serviceName);
      this.totalSelectedDuration -= serviceObj.duration;
    } else {
      if (
        this.selectedServices.length < 3 &&
        this.totalSelectedDuration + serviceObj.duration <= this.MAX_MINUTES
      ) {
        this.selectedServices.push(serviceName);
        this.selectedSubServices.push(serviceObj);
        this.totalSelectedDuration += serviceObj.duration;
      }
    }

    if (this.selectedDate) {
      this.availableSlots = this.generateAvailableSlots(this.selectedDate);

      if (!this.availableSlots.some(slot => slot.time === this.selectedTime && slot.slotsLeft > 0)) {
        this.selectedTime = '';
      }
    }
  }

  resetSelection() {
    this.selectedServices = [];
    this.selectedSubServices = [];
    this.totalSelectedDuration = 0;
    this.selectedDate = '';
    this.selectedTime = '';
    this.availableSlots = [];
  }

  resetPatientDetails() {
    this.patientDetails = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      age: '',
      notes: ''
    };
  }

  resetConfirmedBooking() {
    this.confirmedBooking = {
      fullName: '',
      date: '',
      time: '',
      services: []
    };
  }

  generateCalendar() {
    const year = this.viewDate.getFullYear();
    const month = this.viewDate.getMonth();

    this.currentMonthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(this.viewDate);
    this.currentYear = year;
    this.calendarDays = [];

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
      this.calendarDays.push({
        number: '',
        date: '',
        isPast: true,
        isWeekend: false,
        isFullyBooked: false,
        isAvailable: false,
        isToday: false
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 1; i <= daysInMonth; i++) {
      const dateObj = new Date(year, month, i);
      dateObj.setHours(0, 0, 0, 0);

      const dayOfWeek = dateObj.getDay();
      const isPast = dateObj < today;
      const isFullyBooked = i % 4 === 0;
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      this.calendarDays.push({
        number: i,
        date: this.formatDateLocal(dateObj),
        isToday: dateObj.getTime() === today.getTime(),
        isPast,
        isWeekend,
        isFullyBooked,
        isAvailable: !isPast && !isFullyBooked
      });
    }
  }

  prevMonth() {
    this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() - 1, 1);
    this.generateCalendar();
  }

  nextMonth() {
    this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + 1, 1);
    this.generateCalendar();
  }

  selectDate(date: string) {
    const dayObj = this.calendarDays.find(d => d.date === date);

    if (dayObj && dayObj.isAvailable && !dayObj.isPast && !dayObj.isFullyBooked) {
      this.selectedDate = date;
      this.selectedTime = '';
      this.availableSlots = this.generateAvailableSlots(date);
    } else {
      this.selectedDate = '';
      this.selectedTime = '';
      this.availableSlots = [];
    }
  }

  generateAvailableSlots(date: string): TimeSlot[] {
    const dateObj = new Date(date);
    const day = dateObj.getDay();

    const closingMinutes =
      day === 0 ? 21 * 60 + 30 :
      day === 6 ? 21 * 60 :
      20 * 60 + 30;

    const candidateStarts = [
      9 * 60,
      10 * 60 + 30,
      13 * 60,
      14 * 60 + 30,
      16 * 60,
      17 * 60 + 30,
      19 * 60
    ];

    return candidateStarts
      .filter(start => start + this.totalSelectedDuration <= closingMinutes)
      .map(start => ({
        time: this.to12Hour(start),
        slotsLeft: this.getSlotsLeftForTime(start)
      }));
  }

  to12Hour(totalMinutes: number): string {
    let hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const suffix = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12 || 12;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${suffix}`;
  }

  getSlotsLeftForTime(start: number): number {
    if (start === 13 * 60) return 0;
    if (start === 9 * 60) return 2;
    if (start === 10 * 60 + 30) return 5;
    if (start === 14 * 60 + 30) return 3;
    if (start === 16 * 60) return 1;
    if (start === 17 * 60 + 30) return 2;
    if (start === 19 * 60) return 1;

    return 2;
  }

  formatDateLocal(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  completeBooking() {
    if (!this.canProceedToReview) {
      return;
    }

    this.confirmedBooking = {
      fullName: `${this.patientDetails.firstName.trim()} ${this.patientDetails.lastName.trim()}`,
      date: this.selectedDate,
      time: this.selectedTime,
      services: [...this.selectedSubServices]
    };

    this.bookingConfirmed = true;
    this.currentStep = 1;
    this.selectedCategory = '';

    this.resetSelection();
    this.resetPatientDetails();
  }

  startNewBooking() {
    this.bookingConfirmed = false;
    this.currentStep = 1;
    this.selectedCategory = '';

    this.resetSelection();
    this.resetPatientDetails();
    this.resetConfirmedBooking();
  }

  goHome() {
    this.bookingConfirmed = false;
    this.currentStep = 1;
    this.selectedCategory = '';

    this.resetSelection();
    this.resetPatientDetails();
    this.resetConfirmedBooking();

    this.router.navigate(['/']);
  }
}