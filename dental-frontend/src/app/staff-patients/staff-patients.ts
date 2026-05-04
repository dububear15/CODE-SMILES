import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StaffSidebar } from '../staff-sidebar/staff-sidebar';
import { ApiService } from '../services/api.service';

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  contact: string;
  email: string;
  address: string;
  status: 'Active' | 'Inactive';
  lastVisit: string;
  nextAppointment: string;
  registeredDate: string;
  // raw DB fields
  db_id?: number;
  first_name?: string;
  last_name?: string;
  phone?: string;
  created_at?: string;
}

@Component({
  selector: 'app-staff-patient',
  standalone: true,
  imports: [CommonModule, FormsModule, StaffSidebar],
  templateUrl: './staff-patients.html',
  styleUrls: ['./staff-patients.css'],
})
export class StaffPatientsComponent implements OnInit {

  protected patients: Patient[] = [];
  protected isLoading = true;

  protected searchTerm = '';
  protected genderFilter = '';
  protected statusFilter = '';

  protected isModalOpen = false;
  protected editingPatient: Patient | null = null;
  protected showSuccessAlert = false;
  protected successMessage = '';
  protected form: Partial<Patient> = {};
  protected viewingPatient: Patient | null = null;

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadPatients();
  }

  loadPatients() {
    this.isLoading = true;
    this.api.getPatients().subscribe({
      next: (data) => {
        this.patients = data.map((p: any) => ({
          db_id:           p.id,
          id:              `CS-${String(p.id).padStart(5, '0')}`,
          name:            `${p.first_name} ${p.last_name}`,
          first_name:      p.first_name,
          last_name:       p.last_name,
          age:             0,
          gender:          '',
          contact:         p.phone || '—',
          phone:           p.phone || '—',
          email:           p.email || '—',
          address:         '—',
          status:          (p.status === 'Active' ? 'Active' : 'Inactive') as 'Active' | 'Inactive',
          lastVisit:       '—',
          nextAppointment: 'No booking',
          registeredDate:  p.created_at ? p.created_at.split('T')[0] : '—',
          created_at:      p.created_at,
        }));
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  protected get filteredPatients(): Patient[] {
    const q = this.searchTerm.trim().toLowerCase();
    return this.patients.filter(p => {
      const matchSearch = !q || [p.name, p.contact, p.email, p.id]
        .join(' ').toLowerCase().includes(q);
      const matchGender = !this.genderFilter || p.gender === this.genderFilter;
      const matchStatus = !this.statusFilter || p.status === this.statusFilter;
      return matchSearch && matchGender && matchStatus;
    });
  }

  protected resetFilters(): void {
    this.searchTerm = '';
    this.genderFilter = '';
    this.statusFilter = '';
  }

  protected get activePatientsCount(): number {
    return this.patients.filter(p => p.status === 'Active').length;
  }

  protected get inactivePatientsCount(): number {
    return this.patients.filter(p => p.status === 'Inactive').length;
  }

  protected get newThisMonth(): number {
    const now = new Date();
    return this.patients.filter(p => {
      if (!p.registeredDate || p.registeredDate === '—') return false;
      const d = new Date(p.registeredDate);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;
  }

  protected openAddModal(): void {
    this.editingPatient = null;
    this.form = { status: 'Active', gender: '' };
    this.isModalOpen = true;
  }

  protected openEditModal(p: Patient): void {
    this.editingPatient = p;
    this.form = { ...p };
    this.isModalOpen = true;
  }

  protected closeModal(): void {
    this.isModalOpen = false;
    this.editingPatient = null;
    this.form = {};
  }

  protected savePatient(): void {
    if (!this.form.name?.trim() && !(this.form.first_name?.trim())) return;

    const firstName = this.form.first_name?.trim() || this.form.name?.split(' ')[0] || '';
    const lastName  = this.form.last_name?.trim()  || this.form.name?.split(' ').slice(1).join(' ') || '';

    if (this.editingPatient) {
      // Local update only for now (no edit endpoint)
      const idx = this.patients.findIndex(p => p.id === this.editingPatient!.id);
      if (idx !== -1) {
        this.patients[idx] = { ...this.patients[idx], ...this.form } as Patient;
        this.successMessage = `Patient "${this.form.name}" updated.`;
      }
      this.closeModal();
      this.flashSuccess();
    } else {
      // Save to DB
      this.api.addPatient({ first_name: firstName, last_name: lastName, phone: this.form.contact || '' }).subscribe({
        next: () => {
          this.successMessage = `Patient "${firstName} ${lastName}" registered successfully.`;
          this.closeModal();
          this.flashSuccess();
          this.loadPatients(); // Reload from DB
        },
        error: () => {
          this.successMessage = 'Failed to register patient. Please try again.';
          this.flashSuccess();
        }
      });
    }
  }

  private flashSuccess(): void {
    this.showSuccessAlert = true;
    setTimeout(() => { this.showSuccessAlert = false; }, 4000);
  }

  protected viewProfile(p: Patient): void {
    this.viewingPatient = p;
  }

  protected closeProfile(): void {
    this.viewingPatient = null;
  }

  protected dismissAlert(): void {
    this.showSuccessAlert = false;
  }
}
