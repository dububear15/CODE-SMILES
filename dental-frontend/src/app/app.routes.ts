import { Routes } from '@angular/router';

// Public
import { PublicHomeComponent } from './public-home/public-home';
import { PublicAboutComponent } from './public-about/public-about';
import { PublicContactComponent } from './public-contact/public-contact';
import { PublicServicesComponent } from './public-services/public-services';

// Auth / General
import { AdminComponent } from './admin/admin';
import { LoginComponent } from './login/login';
import { RegisterComponent } from './register/register';
import { ForgotPasswordComponent } from './forgot-password/forgot-password';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy';

// Patient
import { PatientBookingComponent } from './patient-booking/patient-booking';
import { PatientDashboardComponent } from './patient-dashboard/patient-dashboard';
import { MyAppointments } from './patient-appointments/patient-appointments';
import { PatientAppointmentDetailsComponent } from './patient-appointments/patient-appointment-details';
import { PatientMedicalVault } from './patient-medical-vault/patient-medical-vault';
import { PatientNotificationsComponent } from './patient-notifications/patient-notifications';
import { PatientMessagesComponent } from './patient-messages/patient-messages';
import { PatientProfileComponent } from './patient-profile/patient-profile';
import { PatientProfileEditComponent } from './patient-profile-edit/patient-profile-edit';
import { PatientChangePasswordComponent } from './patient-change-password/patient-change-password';
import { PatientForgotPasswordComponent } from './patient-forgot-password/patient-forgot-password';
import { PatientAbout } from './patient-about/patient-about';
import { PatientContact } from './patient-contact/patient-contact';
import { PatientServicesComponent } from './patient-services/patient-services';
import { PatientHelpCenter } from './patient-help-center/patient-help-center';
import { PatientPrivacyPolicy } from './patient-privacy-policy/patient-privacy-policy';
import { PatientTerms } from './patient-terms/patient-terms';
import { PatientTreatmentProgress } from './patient-treatment-progress/patient-treatment-progress';

// Staff
import { StaffDashboard } from './staff-dashboard/staff-dashboard';
import { StaffAppointmentsComponent } from './staff-appointments/staff-appointments';
import { StaffPatientsComponent } from './staff-patients/staff-patients';
import { StaffCalendar } from './staff-calendar/staff-calendar';
import { StaffRequestsComponent } from './staff-requests/staff-requests';
import { StaffNotificationsComponent } from './staff-notifications/staff-notifications';
import { StaffProfile } from './staff-profile/staff-profile';
import { StaffHelpCenter } from './staff-help-center/staff-help-center';

// Dentist
import { DentistDashboard } from './dentist-dashboard/dentist-dashboard';
import { DentistAppointmentsComponent } from './dentist-appointments/dentist-appointments';
import { DentistPatientsComponent } from './dentist-patients/dentist-patients';
import { DentistMedicalVault } from './dentist-medical-vault/dentist-medical-vault';
import { DentistTreatmentPlansComponent } from './dentist-treatment-plans/dentist-treatment-plans';
import { DentistPrescriptionsComponent } from './dentist-prescriptions/dentist-prescriptions';
import { DentistNotificationsComponent } from './dentist-notifications/dentist-notifications';
import { DentistProfile } from './dentist-profile/dentist-profile';
import { DentistSettingsComponent } from './dentist-settings/dentist-settings';

export const routes: Routes = [
  // Public
  { path: '', component: PublicHomeComponent },
  { path: 'about', component: PublicAboutComponent },
  { path: 'contact', component: PublicContactComponent },
  { path: 'services', component: PublicServicesComponent },

  // Auth / General
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'booking', component: PatientBookingComponent },
  { path: 'my-appointments', redirectTo: 'patient-appointments', pathMatch: 'full' },
  { path: 'profile', redirectTo: 'patient-profile', pathMatch: 'full' },
  { path: 'notifications', redirectTo: 'patient-notifications', pathMatch: 'full' },

  // Patient Portal
  { path: 'patient-booking', component: PatientBookingComponent },
  { path: 'patient-dashboard', component: PatientDashboardComponent },
  { path: 'patient-appointments', component: MyAppointments },
  { path: 'patient-appointments/:id', component: PatientAppointmentDetailsComponent },
  { path: 'patient-medical-vault', component: PatientMedicalVault },
  { path: 'patient-notifications', component: PatientNotificationsComponent },
  { path: 'patient-messages', component: PatientMessagesComponent },
  { path: 'patient-profile', component: PatientProfileComponent },
  { path: 'patient-profile/edit', component: PatientProfileEditComponent },
  { path: 'patient-profile/change-password', component: PatientChangePasswordComponent },
  { path: 'patient-profile/forgot-password', component: PatientForgotPasswordComponent },
  { path: 'patient-about', component: PatientAbout },
  { path: 'patient-contact', component: PatientContact },
  { path: 'patient-services', component: PatientServicesComponent },
  { path: 'patient-help-center', component: PatientHelpCenter },
  { path: 'help-center', redirectTo: 'patient-help-center', pathMatch: 'full' },
  { path: 'patient-privacy-policy', component: PatientPrivacyPolicy },
  { path: 'patient-terms', component: PatientTerms },
  { path: 'patient-treatment-progress', component: PatientTreatmentProgress },

  // Staff Portal
  { path: 'staff-dashboard', component: StaffDashboard },
  { path: 'staff-appointments', component: StaffAppointmentsComponent },
  { path: 'staff-patients', component: StaffPatientsComponent },
  { path: 'staff-calendar', component: StaffCalendar },
  { path: 'staff-requests', component: StaffRequestsComponent },
  { path: 'staff-notifications', component: StaffNotificationsComponent },
  { path: 'staff-profile', component: StaffProfile },
  { path: 'staff-help-center', component: StaffHelpCenter },

  // Dentist Portal
  { path: 'dentist-dashboard', component: DentistDashboard },
  { path: 'dentist-appointments', component: DentistAppointmentsComponent },
  { path: 'dentist-schedule', component: DentistAppointmentsComponent },
  { path: 'dentist-patients', component: DentistPatientsComponent },
  { path: 'dentist-medical-vault', component: DentistMedicalVault },
  { path: 'dentist-treatment-plans', component: DentistTreatmentPlansComponent },
  { path: 'dentist-prescriptions', component: DentistPrescriptionsComponent },
  { path: 'dentist-notifications', component: DentistNotificationsComponent },
  { path: 'dentist-profile', component: DentistProfile },
  { path: 'dentist-settings', component: DentistSettingsComponent },

  // Fallback
  { path: '**', redirectTo: '' }
];
