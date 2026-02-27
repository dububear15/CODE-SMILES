import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class AdminComponent implements OnInit {
  patients: any[] = [];
  appointments: any[] = []; 
  editingAppointmentId: number | null = null; 

  newPatient = { first_name: '', last_name: '', phone: '' };
  newAppointment = { patient_id: '', appointment_date: '', appointment_time: '', treatment: '' };

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.getPatients();
    this.getAppointments();
  }

  getPatients() {
    this.http.get<any[]>('http://localhost:3000/list-patients').subscribe({
      next: (data) => { this.patients = data; this.cdr.detectChanges(); },
      error: (err) => console.error("Server Down! Could not get patients.", err)
    });
  }

  savePatient() {
    this.http.post('http://localhost:3000/add-patient', this.newPatient, { responseType: 'text' }).subscribe({
      next: () => { this.getPatients(); this.newPatient = { first_name: '', last_name: '', phone: '' }; },
      error: (err) => alert("Failed to add patient. Is your Node server running?")
    });
  }

  deletePatient(id: number) {
    if(confirm("Are you sure?")) {
      this.http.delete(`http://localhost:3000/delete-patient/${id}`, { responseType: 'text' }).subscribe({
        next: () => this.getPatients(),
        error: (err) => console.error("Delete failed.", err)
      });
    }
  }

  getAppointments() {
    this.http.get<any[]>('http://localhost:3000/list-appointments').subscribe({
      next: (data) => { this.appointments = data; this.cdr.detectChanges(); }
    });
  }

  saveAppointment() {
    const url = this.editingAppointmentId 
      ? `http://localhost:3000/update-appointment/${this.editingAppointmentId}`
      : 'http://localhost:3000/add-appointment';
    
    const request = this.editingAppointmentId 
      ? this.http.put(url, this.newAppointment, { responseType: 'text' })
      : this.http.post(url, this.newAppointment, { responseType: 'text' });

    request.subscribe({
      next: () => {
        alert(this.editingAppointmentId ? "Updated!" : "Booked!");
        this.resetAppointmentForm(); // Updated name here
      },
      error: (err) => console.error("Booking Error:", err)
    });
  }

  editAppointment(appt: any) {
    this.editingAppointmentId = appt.appointment_id;
    this.newAppointment = { ...appt }; 
  }

  // CHOICE 2: Function renamed to match your HTML click event
  resetAppointmentForm() { 
    this.editingAppointmentId = null;
    this.newAppointment = { patient_id: '', appointment_date: '', appointment_time: '', treatment: '' };
    this.getAppointments();
  }

  deleteAppointment(id: number) {
    if(confirm("Cancel this?")) {
      this.http.delete(`http://localhost:3000/delete-appointment/${id}`, { responseType: 'text' }).subscribe({
        next: () => this.getAppointments()
      });
    }
  }
}