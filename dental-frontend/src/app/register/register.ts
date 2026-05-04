import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class RegisterComponent {
  constructor(private router: Router, private auth: AuthService) {}

  registerData = {
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  };

  submitted = false;
  isLoading = false;
  showPassword = false;
  showConfirmPassword = false;
  errorMessage = '';
  successMessage = '';

  // -------------------------
  // NAME VALIDATION HELPER
  // -------------------------
  private isHumanLikeName(name: string): boolean {
    const trimmedName = name.trim();
    if (!/^[A-Za-zÀ-ÿ\s'-]{2,30}$/.test(trimmedName)) return false;
    if (/(.)\1{3,}/i.test(trimmedName)) return false;
    if (/[bcdfghjklmnpqrstvwxyz]{6,}/i.test(trimmedName)) return false;
    const parts = trimmedName.split(/[\s'-]+/).filter(Boolean);
    if (parts.some((part) => part.length < 2)) return false;
    return true;
  }

  // -------------------------
  // VALIDATION GETTERS
  // -------------------------
  get isFirstNameValid(): boolean {
    return this.isHumanLikeName(this.registerData.firstName);
  }

  get isLastNameValid(): boolean {
    return this.isHumanLikeName(this.registerData.lastName);
  }

  get isRegisterEmailValid(): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.registerData.email.trim());
  }

  get isContactValid(): boolean {
    return /^09\d{9}$/.test(this.registerData.contactNumber.trim());
  }

  get isRegisterPasswordValid(): boolean {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(this.registerData.password);
  }

  get isConfirmPasswordFilled(): boolean {
    return this.registerData.confirmPassword.trim().length > 0;
  }

  get doPasswordsMatch(): boolean {
    return (
      this.isConfirmPasswordFilled &&
      this.registerData.password === this.registerData.confirmPassword
    );
  }

  get isTermsAccepted(): boolean {
    return this.registerData.agreeTerms;
  }

  get isFormValid(): boolean {
    return (
      this.isFirstNameValid &&
      this.isLastNameValid &&
      this.isRegisterEmailValid &&
      this.isContactValid &&
      this.isRegisterPasswordValid &&
      this.doPasswordsMatch &&
      this.isTermsAccepted
    );
  }

  get submitButtonText(): string {
    return this.isLoading ? 'Creating Account…' : 'Create Account';
  }

  // -------------------------
  // TOGGLES
  // -------------------------
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onContactInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/\D/g, '').slice(0, 11);
    this.registerData.contactNumber = input.value;
  }

  register(form: NgForm): void {
    this.submitted = true;
    this.errorMessage = '';

    if (!this.isFormValid) {
      form.control.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    this.auth
      .register({
        first_name: this.registerData.firstName.trim(),
        last_name: this.registerData.lastName.trim(),
        email: this.registerData.email.trim(),
        phone: this.registerData.contactNumber.trim(),
        password: this.registerData.password,
      })
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage =
            err?.error?.message ?? 'Registration failed. Please try again.';
        },
      });
  }

  signUpWithGoogle(): void {
    // Google auth — to be implemented
    console.log('Google Sign-Up');
  }

  handleAccentMove(event: MouseEvent): void {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const moveX = ((x - rect.width / 2) / rect.width) * 20;
    const moveY = ((y - rect.height / 2) / rect.height) * 20;
    target.style.setProperty('--mx', `${moveX}px`);
    target.style.setProperty('--my', `${moveY}px`);
  }

  resetAccentMove(): void {
    const el = document.querySelector('.register-left') as HTMLElement;
    if (!el) return;
    el.style.setProperty('--mx', '0px');
    el.style.setProperty('--my', '0px');
  }
}
