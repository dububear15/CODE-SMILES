import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
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

  // -------------------------
  // NAME VALIDATION HELPER
  // -------------------------
  private isHumanLikeName(name: string): boolean {
    const trimmedName = name.trim();

    // basic allowed characters and length
    if (!/^[A-Za-zÀ-ÿ\s'-]{2,30}$/.test(trimmedName)) {
      return false;
    }

    // block same character repeated too much, like "aaaaaa"
    if (/(.)\1{3,}/i.test(trimmedName)) {
      return false;
    }

    // block names with too many consonants in a row, like "rtfgdrg"
    if (/[bcdfghjklmnpqrstvwxyz]{6,}/i.test(trimmedName)) {
      return false;
    }

    // each word part should have at least 2 letters
    const parts = trimmedName.split(/[\s'-]+/).filter(Boolean);
    if (parts.some(part => part.length < 2)) {
      return false;
    }

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
    // Philippines mobile format: 09XXXXXXXXX
    return /^09\d{9}$/.test(this.registerData.contactNumber.trim());
  }

  get isRegisterPasswordValid(): boolean {
    // At least 8 chars, one uppercase, one lowercase, one number
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

  // -------------------------
  // TOGGLES
  // -------------------------
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  // only allow digits for contact number while typing
  onContactInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/\D/g, '').slice(0, 11);
    this.registerData.contactNumber = input.value;
  }

  register(form: NgForm): void {
    this.submitted = true;

    if (!this.isFormValid) {
      form.control.markAllAsTouched();
      return;
    }

    alert('Account created successfully! 🎉');
    this.router.navigate(['/login']);
  }

  signUpWithGoogle(): void {
    alert('Google Sign-Up (to be implemented)');
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