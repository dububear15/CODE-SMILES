import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';

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
  
  // Time Management
  totalSelectedDuration: number = 0;
  readonly MAX_MINUTES = 120; 

  // Calendar & Time Properties
  selectedDate: string = '';
  selectedTime: string = '';
  availableSlots: TimeSlot[] = []; // FIXED: Now an array of objects
  
  viewDate: Date = new Date();
  currentMonthName: string = '';
  currentYear: number = 0;
  calendarDays: any[] = [];

  // Step 3: Patient Data Model
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
      { name: 'Oral Consultation', duration: 15 }, { name: 'Dental Cleaning', duration: 45 },
      { name: 'Digital X-Rays', duration: 20 }, { name: 'Tooth Fillings', duration: 60 },
      { name: 'Fluoride Treatment', duration: 15 }, { name: 'Dental Sealants', duration: 30 },
      { name: 'Simple Extraction', duration: 45 }, { name: 'Emergency Dental Care', duration: 60 }
    ],
    'Cosmetic Arts': [
      { name: 'Teeth Whitening', duration: 60 }, { name: 'Dental Veneers', duration: 90 },
      { name: 'Dental Bonding', duration: 60 }, { name: 'Smile Makeover', duration: 120 },
      { name: 'Tooth Contouring', duration: 45 }, { name: 'Gum Contouring', duration: 60 }
    ],
    'Orthodontics': [
      { name: 'Traditional Braces', duration: 90 }, { name: 'Ceramic Braces', duration: 90 },
      { name: 'Self-Ligating Braces', duration: 90 }, { name: 'Clear Aligners', duration: 45 },
      { name: 'Retainers', duration: 30 }, { name: 'Orthodontic Consultation', duration: 30 }
    ],
    'Oral Surgery': [
      { name: 'Surgical Extraction', duration: 60 }, { name: 'Wisdom Tooth Removal', duration: 90 },
      { name: 'Cyst Removal', duration: 60 }, { name: 'Minor Oral Surgery', duration: 45 },
      { name: 'Frenectomy', duration: 30 }
    ],
    'Dental Implants': [
      { name: 'Implant Consultation', duration: 30 }, { name: 'Single Tooth Implant', duration: 90 },
      { name: 'Multiple Tooth Implant', duration: 120 }, { name: 'Implant Crown Placement', duration: 60 },
      { name: 'Implant Maintenance', duration: 45 }
    ],
    'Pediatric Care': [
      { name: 'Pediatric Check-up', duration: 20 }, { name: 'Pediatric Cleaning', duration: 30 },
      { name: 'Fluoride for Kids', duration: 15 }, { name: 'Dental Sealants', duration: 30 },
      { name: 'Baby Tooth Extraction', duration: 30 }, { name: 'Space Maintainers', duration: 45 }
    ]
  };

  ngOnInit() {
    this.generateCalendar();
  }

  get currentSubServices() {
    return this.serviceMap[this.selectedCategory] || [];
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
      if (this.selectedServices.length < 3 && (this.totalSelectedDuration + serviceObj.duration <= this.MAX_MINUTES)) {
        this.selectedServices.push(serviceName);
        this.selectedSubServices.push(serviceObj); 
        this.totalSelectedDuration += serviceObj.duration;
      }
    }
  }

  resetSelection() {
    this.selectedServices = [];
    this.selectedSubServices = []; 
    this.totalSelectedDuration = 0;
  }

  generateCalendar() {
    const year = this.viewDate.getFullYear();
    const month = this.viewDate.getMonth();
    this.currentMonthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(this.viewDate);
    this.currentYear = year;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    this.calendarDays = [];

    for (let i = 0; i < firstDay; i++) {
      this.calendarDays.push({ number: '', date: '', isPast: true });
    }

    const today = new Date();
    today.setHours(0,0,0,0);

    for (let i = 1; i <= daysInMonth; i++) {
      const dateObj = new Date(year, month, i);
      const isBooked = i % 4 === 0; 

      this.calendarDays.push({
        number: i,
        date: dateObj.toISOString().split('T')[0],
        isToday: dateObj.getTime() === today.getTime(),
        isPast: dateObj < today,
        isWeekend: dateObj.getDay() === 0 || dateObj.getDay() === 6,
        isAvailable: !isBooked 
      });
    }
  }

  prevMonth() {
    this.viewDate.setMonth(this.viewDate.getMonth() - 1);
    this.generateCalendar();
  }

  nextMonth() {
    this.viewDate.setMonth(this.viewDate.getMonth() + 1);
    this.generateCalendar();
  }

  selectDate(date: string) {
    const dayObj = this.calendarDays.find(d => d.date === date);
    if (dayObj && dayObj.isAvailable && !dayObj.isPast) {
      this.selectedDate = date;
      this.selectedTime = ''; 
      this.availableSlots = [
        { time: '09:00 AM', slotsLeft: 2 },
        { time: '10:30 AM', slotsLeft: 5 },
        { time: '01:00 PM', slotsLeft: 0 },
        { time: '02:30 PM', slotsLeft: 3 },
        { time: '04:00 PM', slotsLeft: 1 }
      ];
    } else {
      this.availableSlots = [];
    }
  }

  completeBooking() {
    console.log('Final Booking Data:', {
      services: this.selectedSubServices,
      date: this.selectedDate,
      time: this.selectedTime,
      patient: this.patientDetails
    });
    alert('Thank you, ' + this.patientDetails.firstName + '! Your appointment is confirmed.');
    this.currentStep = 1;
    this.resetSelection();
    this.selectedDate = '';
    this.selectedTime = '';
  }
}