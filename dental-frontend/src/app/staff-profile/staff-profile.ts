import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StaffSidebar } from '../staff-sidebar/staff-sidebar';
import { AuthService } from '../services/auth.service';
import { AvatarService } from '../services/avatar.service';

@Component({
  selector: 'app-staff-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, StaffSidebar],
  templateUrl: './staff-profile.html',
  styleUrls: ['./staff-profile.css'],
})
export class StaffProfile {

  // ── Profile Data (populated from real auth) ───────────────────────────────
  profile = {
    firstName: '',
    lastName: '',
    employeeId: '',
    role: 'Front Desk Staff',
    department: 'Administration',
    position: 'Front Desk Staff',
    hireDate: '—',
    workSchedule: 'Mon – Fri · 8:00 AM – 5:00 PM',
    email: '',
    phone: '',
    dateOfBirth: '—',
    address: '—',
    emergencyContact: '—',
    emergencyPhone: '—',
    bio: '',
    status: 'Active',
    avatarText: '',
    avatarUrl: '',
  };

  // ── Edit Modal ───────────────────────────────────────────────────────────
  showEditModal = false;
  editData = { ...this.profile };
  activeEditTab: 'personal' | 'work' | 'contact' = 'personal';
  editDob = '';

  constructor(
    private auth: AuthService,
    private avatarSvc: AvatarService,
    private cdr: ChangeDetectorRef,
  ) {
    // Load real user data from auth
    const user = this.auth.getUser();
    if (user) {
      this.profile.firstName   = user.first_name;
      this.profile.lastName    = user.last_name;
      this.profile.email       = user.email;
      this.profile.employeeId  = `CS-${String(user.id).padStart(4,'0')}`;
      this.profile.avatarText  = (user.first_name[0] + user.last_name[0]).toUpperCase();
    }
    // Load saved avatar
    this.profile.avatarUrl = this.avatarSvc.getAvatar();
  }

  openEdit(): void {
    this.editData = { ...this.profile };
    this.activeEditTab = 'personal';
    // Convert display date to ISO for date input
    this.editDob = this.parseDateToISO(this.profile.dateOfBirth);
    this.showEditModal = true;
  }

  closeEdit(): void {
    this.showEditModal = false;
  }

  saveEdit(): void {
    this.profile = { ...this.editData };
    // Convert ISO date back to display format
    if (this.editDob) {
      this.profile.dateOfBirth = this.formatDateDisplay(this.editDob);
    }
    const first = this.profile.firstName.charAt(0).toUpperCase();
    const last = this.profile.lastName.charAt(0).toUpperCase();
    this.profile.avatarText = first + last;
    this.showEditModal = false;
    this.showSuccessToast('Profile updated successfully!');
  }

  private parseDateToISO(displayDate: string): string {
    try {
      const d = new Date(displayDate);
      if (isNaN(d.getTime())) return '1995-03-15';
      return d.toISOString().split('T')[0];
    } catch { return '1995-03-15'; }
  }

  private formatDateDisplay(iso: string): string {
    try {
      const d = new Date(iso + 'T00:00:00');
      return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch { return iso; }
  }

  get fullName(): string {
    return `${this.profile.firstName} ${this.profile.lastName}`;
  }

  // ── Photo Upload (saves to DB) ───────────────────────────────────────────
  onPhotoSelect(event: Event): void {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (!file) return;
    this.avatarSvc.uploadFromFile(file).then(url => {
      this.profile.avatarUrl = url;
      this.showSuccessToast('Profile photo updated!');
      this.cdr.detectChanges();
    }).catch(err => {
      this.showSuccessToast(typeof err === 'string' ? err : 'Upload failed. Max 2MB.');
      this.cdr.detectChanges();
    });
  }

  triggerPhotoUpload(): void {
    const input = document.getElementById('photo-upload') as HTMLInputElement;
    input?.click();
  }

  // ── Change Email Modal ───────────────────────────────────────────────────
  showEmailModal = false;
  newEmail = '';
  confirmEmail = '';
  emailError = '';

  openEmailModal(): void {
    this.newEmail = '';
    this.confirmEmail = '';
    this.emailError = '';
    this.showEmailModal = true;
  }

  closeEmailModal(): void { this.showEmailModal = false; }

  saveEmail(): void {
    if (!this.newEmail.includes('@')) {
      this.emailError = 'Please enter a valid email address.';
      return;
    }
    if (this.newEmail !== this.confirmEmail) {
      this.emailError = 'Email addresses do not match.';
      return;
    }
    this.profile.email = this.newEmail;
    this.closeEmailModal();
    this.showSuccessToast('Email updated successfully!');
  }

  // ── Change Password Modal ────────────────────────────────────────────────
  showPasswordModal = false;
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  passwordError = '';
  showCurrentPw = false;
  showNewPw = false;
  showConfirmPw = false;

  openPasswordModal(): void {
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.passwordError = '';
    this.showPasswordModal = true;
  }

  closePasswordModal(): void { this.showPasswordModal = false; }

  savePassword(): void {
    if (!this.currentPassword) {
      this.passwordError = 'Please enter your current password.';
      return;
    }
    if (this.newPassword.length < 8) {
      this.passwordError = 'New password must be at least 8 characters.';
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.passwordError = 'Passwords do not match.';
      return;
    }
    this.closePasswordModal();
    this.showSuccessToast('Password changed successfully!');
  }

  get passwordStrength(): 'weak' | 'medium' | 'strong' {
    const pw = this.newPassword;
    if (pw.length < 6) return 'weak';
    const hasUpper = /[A-Z]/.test(pw);
    const hasNumber = /[0-9]/.test(pw);
    const hasSpecial = /[^A-Za-z0-9]/.test(pw);
    if (pw.length >= 10 && hasUpper && hasNumber && hasSpecial) return 'strong';
    if (pw.length >= 8 && (hasUpper || hasNumber)) return 'medium';
    return 'weak';
  }

  // ── Deactivate Modal ─────────────────────────────────────────────────────
  showDeactivateModal = false;
  deactivateConfirm = '';

  openDeactivateModal(): void {
    this.deactivateConfirm = '';
    this.showDeactivateModal = true;
  }

  closeDeactivateModal(): void { this.showDeactivateModal = false; }

  confirmDeactivate(): void {
    if (this.deactivateConfirm === 'DEACTIVATE') {
      this.profile.status = 'Inactive';
      this.closeDeactivateModal();
      this.showSuccessToast('Account deactivated.');
    }
  }

  // ── Toast ────────────────────────────────────────────────────────────────
  toastMessage = '';
  showToast = false;

  showSuccessToast(msg: string): void {
    this.toastMessage = msg;
    this.showToast = true;
    setTimeout(() => this.showToast = false, 3500);
  }

  // ── Activity Log ─────────────────────────────────────────────────────────
  activityLog = [
    { action: 'Approved appointment request', time: '2 hours ago', icon: 'check' },
    { action: 'Updated patient record – Miguel Reyes', time: '5 hours ago', icon: 'edit' },
    { action: 'Recorded payment – INV-2026-0042', time: 'Yesterday, 3:15 PM', icon: 'payment' },
    { action: 'Rescheduled appointment – Camille Navarro', time: 'Yesterday, 10:00 AM', icon: 'calendar' },
    { action: 'Logged in from Chrome / Windows', time: 'Apr 27, 2026 – 8:02 AM', icon: 'login' },
  ];
}
