import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PatientSidebarComponent } from '../patient-sidebar/patient-sidebar';
import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, PatientSidebarComponent],
  templateUrl: './patient-dashboard.html',
  styleUrl: './patient-dashboard.css',
})
export class PatientDashboardComponent implements OnInit {
  protected firstName: string;
  protected fullName: string;
  protected patientId: string;
  protected initial: string;
  protected isLoading = true;

  protected stats = { pending: 0, upcoming: 0, completed: 0 };
  protected nextAppointment: any = null;

  protected careChecklist = [
    { label: 'Brush for two full minutes twice daily.',                    done: false },
    { label: 'Drink more water to support enamel and gum health.',         done: false },
    { label: 'Wear your aligners for the recommended hours today.',        done: false },
    { label: 'Review aftercare notes before your next adjustment.',        done: false },
  ];

  constructor(private auth: AuthService, private api: ApiService) {
    const user = this.auth.getUser();
    this.firstName  = user?.first_name ?? 'Patient';
    this.fullName   = user ? `${user.first_name} ${user.last_name}` : 'Patient';
    this.patientId  = user ? `CS-${user.id.toString().padStart(5, '0')}` : 'CS-00000';
    this.initial    = (user?.first_name?.charAt(0) ?? 'P').toUpperCase();
  }

  ngOnInit() {
    const user = this.auth.getUser();
    if (!user?.id) { this.isLoading = false; return; }
    this.api.getPatientDashboardStats(user.id).subscribe({
      next: (data) => {
        this.stats = { pending: data.pending, upcoming: data.upcoming, completed: data.completed };
        this.nextAppointment = data.nextAppointment || null;
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  protected get greeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }

  protected toggleChecklistItem(index: number): void {
    const item = this.careChecklist[index];
    if (!item) return;
    item.done = !item.done;
  }

  protected formatDate(d: string): string {
    if (!d) return '—';
    return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  }

  protected formatTime(t: string): string {
    if (!t) return '—';
    const [h, m] = t.split(':').map(Number);
    return `${h % 12 || 12}:${String(m).padStart(2,'0')} ${h >= 12 ? 'PM' : 'AM'}`;
  }
}
