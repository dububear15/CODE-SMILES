import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    HttpClientModule,
    MatCardModule, 
    MatDatepickerModule, 
    MatNativeDateModule
  ],
  templateUrl: './contact.html',
  styleUrls: ['./contact.css']
})
export class ContactComponent {
  selectedDate: Date | null = null;
  
  appointmentData = {
    full_name: '',    // Changed from patient_id
    phone: '',        // New field
    email: '',        // New field
    treatment: '',
    appointment_date: '',
    appointment_time: ''
  };

  allTimeSlots: string[] = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];
  bookedSlots: string[] = [];

  constructor(private http: HttpClient) {}

  onDateSelected(date: Date | null) {
    if (!date) return;
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    this.appointmentData.appointment_date = `${year}-${month}-${day}`;
    this.checkDateAvailability();
  }

  checkDateAvailability() {
    const url = `http://localhost:3000/check-availability/${this.appointmentData.appointment_date}`;
    this.http.get<string[]>(url).subscribe({
      next: (times) => {
        this.bookedSlots = times.map(t => t.substring(0, 5));
        this.appointmentData.appointment_time = ''; 
      }
    });
  }

  submitBooking() {
    const url = 'http://localhost:3000/add-appointment';
    this.http.post(url, this.appointmentData, { responseType: 'text' }).subscribe({
      next: (res) => {
        alert('Booking Request Sent! We will contact you shortly.');
        this.resetForm();
      },
      error: (err) => alert('Error: Please check your connection.')
    });
  }

  resetForm() {
    this.appointmentData = {
      full_name: '', phone: '', email: '',
      treatment: '', appointment_date: '', appointment_time: ''
    };
    this.selectedDate = null;
    this.bookedSlots = [];
  }
}