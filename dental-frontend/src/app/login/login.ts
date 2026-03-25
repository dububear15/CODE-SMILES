import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

type UserRole = 'Patient' | 'Staff' | 'Admin';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  selectedRole: UserRole = 'Patient';
  showPassword = false;
  submitted = false;

  loginData = {
    email: '',
    password: '',
    rememberMe: false
  };

  constructor(private router: Router) {}

  selectRole(role: UserRole): void {
    this.selectedRole = role;
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  get roleDescription(): string {
    switch (this.selectedRole) {
      case 'Patient':
        return 'Access your appointments, requests, and profile.';
      case 'Staff':
        return 'Manage schedules, bookings, and patient requests.';
      case 'Admin':
        return 'Oversee the system, users, and portal settings.';
      default:
        return '';
    }
  }

  get loginButtonText(): string {
    switch (this.selectedRole) {
      case 'Patient':
        return 'Sign In as Patient';
      case 'Staff':
        return 'Sign In as Staff';
      case 'Admin':
        return 'Sign In as Admin';
      default:
        return 'Sign In';
    }
  }

  get isEmailValid(): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.loginData.email.trim());
  }

  get isPasswordValid(): boolean {
    return this.loginData.password.trim().length >= 6;
  }

  get canLogin(): boolean {
    return this.isEmailValid && this.isPasswordValid;
  }

  login(): void {
    this.submitted = true;

    if (!this.canLogin) {
      return;
    }

    console.log('Logging in as:', this.selectedRole);
    console.log('Login data:', this.loginData);

    if (this.selectedRole === 'Patient') {
      this.router.navigate(['/patient-dashboard']);
    } else if (this.selectedRole === 'Staff') {
      this.router.navigate(['/staff-dashboard']);
    } else if (this.selectedRole === 'Admin') {
      this.router.navigate(['/dentist-dashboard']);
    }
  }

  signInWithGoogle(): void {
    if (this.selectedRole !== 'Patient') {
      return;
    }

    console.log('Google Sign-In for Patient');
    // Put your Google auth logic here
  }
}