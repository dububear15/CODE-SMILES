import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DentistSidebar } from '../dentist-sidebar/dentist-sidebar';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';

export type RxStatus = 'Active' | 'Completed' | 'Pending' | 'Cancelled';

export interface RxMedication {
  name: string; dosage: string; frequency: string; duration: string; instructions: string; warnings: string;
}
export interface RxHistory {
  date: string; medication: string; dosage: string; reason: string; status: RxStatus;
}
export interface RxAttachment {
  name: string; type: 'X-ray' | 'Lab Result' | 'Reference' | 'Consent Form'; date: string; size: string;
}
export interface Prescription {
  id: string;
  db_id: number;
  patient: string;
  initials: string;
  age: number;
  gender: string;
  diagnosis: string;
  condition: string;
  allergies: string[];
  medicalConditions: string[];
  date: string;
  status: RxStatus;
  dentist: string;
  medications: RxMedication[];
  postCare: string[];
  notes: string;
  history: RxHistory[];
  attachments: RxAttachment[];
}

@Component({
  selector: 'app-dentist-prescription',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, DentistSidebar],
  templateUrl: './dentist-prescriptions.html',
  styleUrl: './dentist-prescriptions.css',
})
export class DentistPrescriptionsComponent implements OnInit {

  searchQuery = '';
  filterStatus = 'All';
  activeTab = 'patient';
  selectedRx: Prescription | null = null;
  isLoading = true;

  readonly statusOptions = ['All', 'Active', 'Completed', 'Pending', 'Cancelled'];
  readonly tabs = [
    { key: 'patient',    label: 'Patient Info'      },
    { key: 'medication', label: 'Medication Details' },
    { key: 'notes',      label: 'Notes & Care'       },
    { key: 'history',    label: 'History'            },
    { key: 'attachments',label: 'Attachments'        },
  ];

  prescriptions: Prescription[] = [];

  constructor(private api: ApiService, private auth: AuthService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    const user = this.auth.getUser();
    const dentistName = user ? `Dr. ${user.first_name} ${user.last_name}` : '';
    this.api.getDentistPrescriptions(dentistName).subscribe({
      next: (data) => {
        this.prescriptions = data.map(p => this.mapPrescription(p));
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => { this.isLoading = false; this.cdr.detectChanges(); }
    });
  }

  private mapPrescription(p: any): Prescription {
    const name = p.patient_name || '—';
    return {
      db_id:             p.id,
      id:                `RX-${String(p.id).padStart(5,'0')}`,
      patient:           name,
      initials:          name.split(' ').map((n: string) => n[0]).join('').slice(0,2).toUpperCase(),
      age:               0,
      gender:            '—',
      diagnosis:         p.diagnosis || '—',
      condition:         p.condition_note || '—',
      allergies:         ['—'],
      medicalConditions: ['—'],
      date:              p.date_fmt || '—',
      status:            (p.status || 'Active') as RxStatus,
      dentist:           p.dentist_name || '—',
      medications: [{
        name:         p.medication || '—',
        dosage:       p.dosage || '—',
        frequency:    p.frequency || '—',
        duration:     p.duration || '—',
        instructions: p.instructions || '—',
        warnings:     '—',
      }],
      postCare:    [],
      notes:       p.instructions || '',
      history:     [],
      attachments: [],
    };
  }

  get filtered(): Prescription[] {
    return this.prescriptions.filter(rx => {
      const q = this.searchQuery.toLowerCase();
      const matchSearch = !q || rx.patient.toLowerCase().includes(q) || rx.id.toLowerCase().includes(q) || rx.condition.toLowerCase().includes(q);
      const matchStatus = this.filterStatus === 'All' || rx.status === this.filterStatus;
      return matchSearch && matchStatus;
    });
  }

  selectRx(rx: Prescription) { this.selectedRx = rx; this.activeTab = 'patient'; }
  setTab(tab: string) { this.activeTab = tab; }

  statusTone(s: string): string {
    return ({ Active: 'active', Completed: 'completed', Pending: 'pending', Cancelled: 'cancelled' } as any)[s] || 'pending';
  }
  attachIcon(t: string): string {
    return ({ 'X-ray': '🩻', 'Lab Result': '🧪', Reference: '🔗', 'Consent Form': '📄' } as any)[t] || '📎';
  }
  hasAllergy(rx: Prescription): boolean {
    return rx.allergies.some(a => a !== 'None reported' && a !== '—');
  }
}
