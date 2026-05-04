import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, UserRole } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  selectedRole: UserRole = 'Patient';
  showPassword = false;
  submitted = false;
  isLoading = false;
  errorMessage = '';

  loginData = {
    email: '',
    password: '',
    rememberMe: false,
  };

  constructor(private router: Router, private auth: AuthService) {}

  selectRole(role: UserRole): void {
    this.selectedRole = role;
    this.errorMessage = '';
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  get roleDescription(): string {
    switch (this.selectedRole) {
      case 'Patient': return 'Access your appointments, requests, and profile.';
      case 'Staff':   return 'Manage schedules, bookings, and patient requests.';
      case 'Admin':   return 'Oversee the system, users, and portal settings.';
      default:        return '';
    }
  }

  get loginButtonText(): string {
    if (this.isLoading) return 'Signing in…';
    switch (this.selectedRole) {
      case 'Patient': return 'Sign In as Patient';
      case 'Staff':   return 'Sign In as Staff';
      case 'Admin':   return 'Sign In as Dentist';
      default:        return 'Sign In';
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
    this.errorMessage = '';

    if (!this.canLogin) return;

    this.isLoading = true;

    this.auth.login(this.loginData.email.trim(), this.loginData.password, this.selectedRole).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate([this.auth.getDashboardRoute()]);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage =
          err?.error?.message ?? 'Invalid email or password. Please try again.';
      },
    });
  }

  signInWithGoogle(): void {
    if (this.selectedRole !== 'Patient') return;
    // Google auth — to be implemented
    console.log('Google Sign-In for Patient');
  }
}
