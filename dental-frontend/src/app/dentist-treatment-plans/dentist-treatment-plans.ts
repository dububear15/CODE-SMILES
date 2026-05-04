import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DentistSidebar } from '../dentist-sidebar/dentist-sidebar';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';

export type Priority = 'Urgent' | 'High Priority' | 'Regular' | 'Follow-up';
export type PlanStatus = 'Active' | 'Completed' | 'Pending' | 'On Hold';
export type StepStatus = 'done' | 'ongoing' | 'pending' | 'upcoming';

export interface TreatmentStep {
  session: number; title: string; date: string; status: StepStatus; notes: string;
}
export interface PlannedProcedure {
  name: string; category: string; tooth: string; sessions: number; priority: Priority; status: StepStatus; steps: TreatmentStep[];
}
export interface ClinicalNote {
  date: string; type: 'Consultation' | 'Procedure' | 'Progress' | 'Recommendation'; note: string; dentist: string;
}
export interface Prescription {
  medication: string; dosage: string; frequency: string; duration: string; instructions: string; date: string; status: 'Active' | 'Completed' | 'Pending';
}
export interface Attachment {
  name: string; type: 'X-ray' | 'Photo' | 'Lab Result' | 'Consent Form' | 'Reference'; date: string; size: string;
}
export interface TreatmentPlan {
  id: string;
  db_id: number;
  patient: string;
  initials: string;
  age: number;
  gender: string;
  diagnosis: string;
  chiefComplaint: string;
  treatmentType: string;
  category: string;
  status: PlanStatus;
  priority: Priority;
  progress: number;
  estimatedSessions: number;
  completedSessions: number;
  startDate: string;
  targetDate: string;
  assignedDentist: string;
  procedures: PlannedProcedure[];
  clinicalNotes: ClinicalNote[];
  prescriptions: Prescription[];
  attachments: Attachment[];
}

@Component({
  selector: 'app-dentist-treatment-plan',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, DentistSidebar],
  templateUrl: './dentist-treatment-plans.html',
  styleUrl: './dentist-treatment-plans.css',
})
export class DentistTreatmentPlansComponent implements OnInit {

  searchQuery = '';
  filterStatus = 'All';
  activeTab = 'diagnosis';
  selectedPlan: TreatmentPlan | null = null;
  isLoading = true;

  readonly statusOptions = ['All', 'Active', 'Completed', 'Pending', 'On Hold'];
  readonly tabs = [
    { key: 'diagnosis',    label: 'Diagnosis'      },
    { key: 'procedures',   label: 'Procedures'     },
    { key: 'progress',     label: 'Progress'       },
    { key: 'notes',        label: 'Clinical Notes' },
    { key: 'prescriptions',label: 'Prescriptions'  },
    { key: 'attachments',  label: 'Attachments'    },
  ];

  plans: TreatmentPlan[] = [];

  constructor(private api: ApiService, private auth: AuthService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    const user = this.auth.getUser();
    const dentistName = user ? `Dr. ${user.first_name} ${user.last_name}` : '';
    this.api.getDentistTreatmentPlans(dentistName).subscribe({
      next: (data) => {
        this.plans = data.map(p => this.mapPlan(p));
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => { this.isLoading = false; this.cdr.detectChanges(); }
    });
  }

  private mapPlan(p: any): TreatmentPlan {
    const name = p.patient_name || '—';
    const sessions: any[] = p.sessions || [];
    const done = sessions.filter((s: any) => s.status === 'done').length;
    const total = sessions.length || 1;
    const progress = Math.round((done / total) * 100);

    return {
      db_id:             p.id,
      id:                `TP-${String(p.id).padStart(5,'0')}`,
      patient:           name,
      initials:          name.split(' ').map((n: string) => n[0]).join('').slice(0,2).toUpperCase(),
      age:               0,
      gender:            '—',
      diagnosis:         p.description || '—',
      chiefComplaint:    '—',
      treatmentType:     p.title || '—',
      category:          '—',
      status:            (p.status === 'Active' ? 'Active' : p.status === 'Completed' ? 'Completed' : 'Pending') as PlanStatus,
      priority:          'Regular' as Priority,
      progress,
      estimatedSessions: total,
      completedSessions: done,
      startDate:         p.date_fmt || '—',
      targetDate:        '—',
      assignedDentist:   '—',
      procedures: [{
        name:     p.title || '—',
        category: '—',
        tooth:    '—',
        sessions: total,
        priority: 'Regular' as Priority,
        status:   done === total ? 'done' : done > 0 ? 'ongoing' : 'pending',
        steps:    sessions.map((s: any) => ({
          session: s.session_no || 1,
          title:   s.title || '—',
          date:    s.session_date ? new Date(s.session_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—',
          status:  (s.status || 'pending') as StepStatus,
          notes:   s.note || '',
        })),
      }],
      clinicalNotes:  [],
      prescriptions:  [],
      attachments:    [],
    };
  }

  get filtered(): TreatmentPlan[] {
    return this.plans.filter(p => {
      const q = this.searchQuery.toLowerCase();
      const matchSearch = !q || p.patient.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.treatmentType.toLowerCase().includes(q);
      const matchStatus = this.filterStatus === 'All' || p.status === this.filterStatus;
      return matchSearch && matchStatus;
    });
  }

  selectPlan(p: TreatmentPlan) { this.selectedPlan = p; this.activeTab = 'diagnosis'; }
  setTab(tab: string) { this.activeTab = tab; }

  statusTone(s: string): string {
    return ({ Active: 'active', Completed: 'completed', Pending: 'pending', 'On Hold': 'hold' } as any)[s] || 'pending';
  }
  priorityTone(p: string): string {
    return ({ Urgent: 'urgent', 'High Priority': 'high', Regular: 'regular', 'Follow-up': 'followup' } as any)[p] || 'regular';
  }
  stepTone(s: string): string {
    return ({ done: 'done', ongoing: 'ongoing', pending: 'pending', upcoming: 'upcoming' } as any)[s] || 'upcoming';
  }
  noteTypeColor(t: string): string {
    return ({ Consultation: 'blue', Procedure: 'teal', Progress: 'green', Recommendation: 'amber' } as any)[t] || 'blue';
  }
  rxStatusColor(s: string): string {
    return ({ Active: 'active', Completed: 'completed', Pending: 'pending' } as any)[s] || 'pending';
  }
  attachIcon(t: string): string {
    return ({ 'X-ray': '🩻', Photo: '📷', 'Lab Result': '🧪', 'Consent Form': '📄', Reference: '🔗' } as any)[t] || '📎';
  }
  progressWidth(v: number): string { return `${v}%`; }
}
