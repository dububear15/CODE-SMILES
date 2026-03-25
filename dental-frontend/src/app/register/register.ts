import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})

export class RegisterComponent {

  constructor(private router: Router) {}

  // ─────────────────────────────
  // FORM DATA
  // ─────────────────────────────
  registerData = {
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  };

  submitted = false;
  showPassword = false;
  showConfirmPassword = false;

  // ─────────────────────────────
  // VALIDATIONS
  // ─────────────────────────────

  get isFirstNameValid(): boolean {
    return this.registerData.firstName.trim().length > 0;
  }

  get isLastNameValid(): boolean {
    return this.registerData.lastName.trim().length > 0;
  }

  get isRegisterEmailValid(): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.registerData.email.trim());
  }

  get isContactValid(): boolean {
    return this.registerData.contactNumber.trim().length > 0;
  }

  get isRegisterPasswordValid(): boolean {
    return this.registerData.password.trim().length >= 6;
  }

  get doPasswordsMatch(): boolean {
    return this.registerData.confirmPassword.trim().length > 0 &&
           this.registerData.password === this.registerData.confirmPassword;
  }

  get isFormValid(): boolean {
    return (
      this.isFirstNameValid &&
      this.isLastNameValid &&
      this.isRegisterEmailValid &&
      this.isContactValid &&
      this.isRegisterPasswordValid &&
      this.doPasswordsMatch &&
      this.registerData.agreeTerms
    );
  }

  // ─────────────────────────────
  // ACTIONS
  // ─────────────────────────────

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  register(): void {
    this.submitted = true;

    if (!this.isFormValid) {
      console.log('Form invalid ❌');
      return;
    }

    // 🔥 FRONTEND ONLY (for now)
    console.log('REGISTER SUCCESS ✅', this.registerData);

    // simulate success
    alert('Account created successfully! 🎉');

    // redirect to login
    this.router.navigate(['/login']);
  }

  signUpWithGoogle(): void {
    console.log('Google Sign-Up clicked 🔵');

    // frontend placeholder
    alert('Google Sign-Up (to be implemented)');
  }
}