import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.css']
})
export class ForgotPasswordComponent {
  identifier = '';
  submitted = false;
  resetSent = false;

  get isIdentifierValid(): boolean {
    const value = this.identifier.trim();

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    const isPhone = /^(09|\+639)\d{9}$/.test(value);

    return isEmail || isPhone;
  }

  sendResetLink(): void {
    this.submitted = true;

    if (!this.isIdentifierValid) {
      this.resetSent = false;
      return;
    }

    this.resetSent = true;
  }

  onInputChange(): void {
    this.resetSent = false;
  }
}