import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Component, DestroyRef, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-patient-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './patient-sidebar.html',
  styleUrl: './patient-sidebar.css',
})
export class PatientSidebarComponent {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly auth = inject(AuthService);

  protected fullName: string;
  protected initial: string;
  protected clinicExpanded = false;

  constructor() {
    const user = this.auth.getUser();
    this.fullName = user ? `${user.first_name} ${user.last_name}` : 'Patient';
    this.initial  = (user?.first_name?.charAt(0) ?? 'P').toUpperCase();

    this.syncClinicSectionState();
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.syncClinicSectionState());
  }

  protected toggleClinicSection(): void {
    this.clinicExpanded = !this.clinicExpanded;
  }

  protected isDashboardActive(): boolean {
    return this.getCurrentUrl() === '/patient-dashboard';
  }

  protected isTreatmentProgressActive(): boolean {
    const currentUrl = this.getCurrentUrl();
    return (
      currentUrl === '/patient-treatment-progress' ||
      currentUrl.startsWith('/patient-treatment-plan')
    );
  }

  protected isClinicSectionActive(): boolean {
    const currentUrl = this.getCurrentUrl();
    return (
      currentUrl === '/patient-services' ||
      currentUrl === '/patient-about' ||
      currentUrl === '/patient-contact'
    );
  }

  protected logout(): void {
    this.auth.logout();
  }

  private syncClinicSectionState(): void {
    if (this.isClinicSectionActive()) {
      this.clinicExpanded = true;
    }
  }

  private getCurrentUrl(): string {
    return this.router.url.split('#')[0];
  }
}
