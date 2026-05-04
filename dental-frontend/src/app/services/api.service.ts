import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token') ?? '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  // ── USER PROFILE & AVATAR ───────────────────────────────────────────────────
  getUserProfile(userId: number): Observable<any> {
    return this.http.get(`${this.base}/user/profile/${userId}`);
  }

  updateUserProfile(userId: number, data: { first_name?: string; last_name?: string; phone?: string }): Observable<any> {
    return this.http.put(`${this.base}/user/profile/${userId}`, data);
  }

  updateAvatar(userId: number, avatar_url: string): Observable<any> {
    return this.http.put(`${this.base}/user/avatar/${userId}`, { avatar_url });
  }

  // ── AUTH ────────────────────────────────────────────────────────────────────
  login(email: string, password: string, role: string): Observable<any> {
    return this.http.post(`${this.base}/auth/login`, { email, password, role });
  }

  register(data: {
    first_name: string; last_name: string;
    email: string; phone: string; password: string;
  }): Observable<any> {
    return this.http.post(`${this.base}/auth/register`, data);
  }

  // ── DASHBOARD STATS (GET — no auth needed) ─────────────────────────────────
  getStaffDashboardStats(): Observable<any> {
    return this.http.get(`${this.base}/staff/dashboard-stats`);
  }

  getDentistDashboardStats(dentistName: string): Observable<any> {
    return this.http.get(`${this.base}/dentist/dashboard-stats?dentist=${encodeURIComponent(dentistName)}`);
  }

  getPatientDashboardStats(patientId: number): Observable<any> {
    return this.http.get(`${this.base}/patient/dashboard-stats/${patientId}`);
  }

  // ── PATIENTS (GET — no auth needed) ────────────────────────────────────────
  getPatients(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/list-patients`);
  }

  addPatient(data: { first_name: string; last_name: string; phone: string }): Observable<any> {
    return this.http.post(`${this.base}/add-patient`, data, { responseType: 'text' });
  }

  deletePatient(id: number): Observable<any> {
    return this.http.delete(`${this.base}/delete-patient/${id}`, { responseType: 'text' });
  }

  // ── APPOINTMENTS (patient) ──────────────────────────────────────────────────
  bookAppointment(data: {
    patient_id:       number | null;
    full_name:        string;
    phone:            string;
    email:            string;
    treatment:        string;
    services:         string[];
    appointment_date: string;
    appointment_time: string;
    duration_minutes: number;
    notes:            string;
  }): Observable<any> {
    return this.http.post(`${this.base}/add-appointment`, data);
  }

  getMyAppointments(patientId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/my-appointments/${patientId}`);
  }

  cancelMyAppointment(id: number, reason: string): Observable<any> {
    return this.http.put(`${this.base}/appointments/${id}/cancel`, { reason }, {
      headers: this.authHeaders(),
    });
  }

  checkAvailability(date: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.base}/check-availability/${date}`);
  }

  // ── APPOINTMENTS (staff) ────────────────────────────────────────────────────
  getStaffAppointments(status?: string): Observable<any[]> {
    const url = status
      ? `${this.base}/staff/appointments?status=${status}`
      : `${this.base}/staff/appointments`;
    return this.http.get<any[]>(url);
  }

  // Write operations keep auth
  approveAppointment(id: number, dentist_name: string, notes?: string): Observable<any> {
    return this.http.put(`${this.base}/staff/appointments/${id}/approve`,
      { dentist_name, notes }, { headers: this.authHeaders() });
  }

  cancelAppointment(id: number, reason: string): Observable<any> {
    return this.http.put(`${this.base}/staff/appointments/${id}/cancel`,
      { reason }, { headers: this.authHeaders() });
  }

  rescheduleAppointment(id: number, appointment_date: string, appointment_time: string, reason: string): Observable<any> {
    return this.http.put(`${this.base}/staff/appointments/${id}/reschedule`,
      { appointment_date, appointment_time, reason }, { headers: this.authHeaders() });
  }

  // ── APPOINTMENTS (dentist) ─────────────────────────────────────────────────
  getDentistAppointments(dentistName: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/dentist/appointments?dentist=${encodeURIComponent(dentistName)}`);
  }

  updateAppointmentStatus(id: number, status: string, notes?: string): Observable<any> {
    return this.http.put(`${this.base}/staff/appointments/${id}/status`,
      { status, notes }, { headers: this.authHeaders() });
  }

  // ── DENTIST PORTAL (GET — no auth needed) ───────────────────────────────────
  getDentistPatients(dentistName: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/dentist/patients?dentist=${encodeURIComponent(dentistName)}`);
  }

  getDentistPatientHistory(patientId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/dentist/patients/${patientId}/history`);
  }

  getDentistPrescriptions(dentistName: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/dentist/prescriptions?dentist=${encodeURIComponent(dentistName)}`);
  }

  createDentistPrescription(data: any): Observable<any> {
    return this.http.post(`${this.base}/dentist/prescriptions`, data, { headers: this.authHeaders() });
  }

  updatePrescriptionStatus(id: number, status: string): Observable<any> {
    return this.http.put(`${this.base}/dentist/prescriptions/${id}/status`, { status }, { headers: this.authHeaders() });
  }

  getDentistTreatmentPlans(dentistName: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/dentist/treatment-plans?dentist=${encodeURIComponent(dentistName)}`);
  }

  getDentistNotifications(dentistName: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/dentist/notifications?dentist=${encodeURIComponent(dentistName)}`);
  }

  // ── BILLING (GET — no auth needed) ──────────────────────────────────────────
  getBillingRecords(status?: string): Observable<any[]> {
    const url = status ? `${this.base}/staff/billing?status=${status}` : `${this.base}/staff/billing`;
    return this.http.get<any[]>(url);
  }

  getBillingSummary(): Observable<any> {
    return this.http.get(`${this.base}/staff/billing/summary`);
  }

  createBillingRecord(data: any): Observable<any> {
    return this.http.post(`${this.base}/staff/billing`, data, { headers: this.authHeaders() });
  }

  recordPayment(id: number, data: { amount_paid: number; payment_method: string; notes?: string }): Observable<any> {
    return this.http.put(`${this.base}/staff/billing/${id}/pay`, data, { headers: this.authHeaders() });
  }

  updateBillingStatus(id: number, status: string, notes?: string): Observable<any> {
    return this.http.put(`${this.base}/staff/billing/${id}/status`, { status, notes }, { headers: this.authHeaders() });
  }

  // ── STAFF NOTIFICATIONS (GET — no auth needed) ───────────────────────────────
  getStaffNotifications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/staff/notifications`);
  }

  // ── CALENDAR (GET — no auth needed) ──────────────────────────────────────────
  getCalendarAppointments(startDate: string, endDate: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/staff/calendar?startDate=${startDate}&endDate=${endDate}`);
  }

  // ── ADMIN ───────────────────────────────────────────────────────────────────
  getAppointments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/list-appointments`);
  }

  updateAppointment(id: number, data: any): Observable<any> {
    return this.http.put(`${this.base}/update-appointment/${id}`, data, { responseType: 'text' });
  }

  deleteAppointment(id: number): Observable<any> {
    return this.http.delete(`${this.base}/delete-appointment/${id}`, { responseType: 'text' });
  }

  // ── NOTIFICATIONS (GET — no auth needed) ────────────────────────────────────
  getNotifications(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/notifications/${userId}`);
  }

  markNotificationRead(id: number): Observable<any> {
    return this.http.put(`${this.base}/notifications/${id}/read`, {}, {
      headers: this.authHeaders(),
    });
  }
}
