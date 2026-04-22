import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';

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

  protected clinicExpanded = false;

  constructor() {
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
    return this.getCurrentUrl() === '/patient-treatment-progress';
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
    this.router.navigate(['/']);
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
