// CHANGE THIS:
import { Component } from '@angular/core'; // Component comes from core!
// KEEP THESE:
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking.html',
  styleUrls: ['./booking.css']
})
export class BookingComponent {
  currentStep: number = 1;
  selectedCategory: string = '';
  selectedServices: string[] = [];

  // --- NEW CALENDAR PROPERTIES (Fixes your errors!) ---
  selectedDate: string = '';
  selectedTime: string = '';
  availableTimes: string[] = ['09:00 AM', '10:30 AM', '01:00 PM', '02:30 PM', '04:00 PM'];
  
  calendarDays = [
    { day: 'Mon', date: 23 }, 
    { day: 'Tue', date: 24 }, 
    { day: 'Wed', date: 25 },
    { day: 'Thu', date: 26 }, 
    { day: 'Fri', date: 27 }, 
    { day: 'Sat', date: 28 }
  ];

  serviceMap: any = {
    'General Dentistry': ['Oral Consultation', 'Dental Cleaning', 'Digital X-Rays', 'Tooth Fillings', 'Fluoride Treatment', 'Dental Sealants', 'Simple Extraction', 'Emergency Care'],
    'Cosmetic Arts': ['Teeth Whitening', 'Dental Veneers', 'Dental Bonding', 'Smile Makeover', 'Tooth Contouring', 'Gum Contouring'],
    'Orthodontics': ['Traditional Braces', 'Ceramic Braces', 'Self-Ligating Braces', 'Clear Aligners', 'Retainers', 'Orthodontic Consultation'],
    'Oral Surgery': ['Surgical Extraction', 'Wisdom Tooth Removal', 'Cyst Removal', 'Minor Oral Surgery', 'Frenectomy'],
    'Dental Implants': ['Implant Consultation', 'Single Tooth Implant', 'Multiple Tooth Implant', 'Implant Maintenance'],
    'Pediatric Care': ['Pediatric Check-up', 'Pediatric Cleaning', 'Fluoride for Kids', 'Dental Sealants', 'Baby Tooth Extraction', 'Space Maintainers']
  };

  get currentSubServices() {
    return this.serviceMap[this.selectedCategory] || [];
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.currentStep = 1.5; 
  }

  toggleService(service: string) {
    const index = this.selectedServices.indexOf(service);
    if (index > -1) {
      this.selectedServices.splice(index, 1); 
    } else if (this.selectedServices.length < 3) {
      this.selectedServices.push(service); 
    }
  }

  // --- NEW CALENDAR FUNCTIONS (Fixes your errors!) ---
  selectDate(d: any) {
    this.selectedDate = `Feb ${d.date}, 2026`;
  }

  selectTime(t: string) {
    this.selectedTime = t;
  }

  confirmSelection() {
    if (this.selectedServices.length > 0) {
      this.currentStep = 2;
    }
  }
}