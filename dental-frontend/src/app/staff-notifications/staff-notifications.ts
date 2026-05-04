import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StaffSidebar } from '../staff-sidebar/staff-sidebar';
import { ApiService } from '../services/api.service';

type NotificationCategory = 'appointments' | 'treatment' | 'messages' | 'medical-vault' | 'clinic-updates';
type NotificationTone = 'green' | 'amber' | 'blue' | 'purple' | 'slate';
type NotificationPriority = 'urgent' | 'needs-action' | 'informational';
type NotificationIcon = 'calendar' | 'hourglass' | 'message' | 'document' | 'announcement';
type SortOption = 'newest' | 'oldest' | 'priority';
type StatusFilter = 'all' | 'unread' | 'read' | 'needs-action';

interface StaffNotification {
  id: number;
  category: NotificationCategory;
  tone: NotificationTone;
  priority: NotificationPriority;
  label: string;
  title: string;
  meta: string;
  detail: string;
  time: string;
  exactTime: string;
  icon: NotificationIcon;
  needsAction: boolean;
  unread: boolean;
  actionable: boolean;
  patientName?: string;
  appointmentId?: string;
  status?: string;
  grouped?: boolean;
  groupCount?: number;
  expanded?: boolean;
}

interface FilterChip {
  key: 'all' | NotificationCategory;
  label: string;
}

interface PreferenceItem {
  title: string;
  enabled: boolean;
  icon: string;
  sound?: boolean;
  frequency?: 'instant' | 'digest';
  channels?: { email: boolean; sms: boolean; inApp: boolean };
}

@Component({
  selector: 'app-staff-notification',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, StaffSidebar],
  templateUrl: './staff-notifications.html',
  styleUrls: ['./staff-notifications.css'],
})
export class StaffNotificationsComponent implements OnInit, OnDestroy {
  // ── Filters & Sort ───────────────────────────────────────────────────────
  selectedFilter: FilterChip['key'] = 'all';
  statusFilter: StatusFilter = 'all';
  sortBy: SortOption = 'newest';
  searchQuery = '';
  showSearch = false;

  // ── Modal ────────────────────────────────────────────────────────────────
  selectedNotification: StaffNotification | null = null;
  showRejectModal = false;
  rejectTarget: StaffNotification | null = null;
  rejectReason = '';

  // ── Polling ──────────────────────────────────────────────────────────────
  private pollInterval: any;

  filters: FilterChip[] = [
    { key: 'all',           label: 'All'          },
    { key: 'appointments',  label: 'Appointments' },
    { key: 'treatment',     label: 'Treatment'    },
    { key: 'messages',      label: 'Messages'     },
    { key: 'medical-vault', label: 'Medical Vault'},
    { key: 'clinic-updates',label: 'Clinic Updates'},
  ];

  preferences: PreferenceItem[] = [
    { title: 'Email Notifications',    enabled: true,  icon: 'mail',         sound: false, frequency: 'instant', channels: { email: true,  sms: false, inApp: true  } },
    { title: 'SMS Notifications',      enabled: true,  icon: 'sms',          sound: false, frequency: 'instant', channels: { email: false, sms: true,  inApp: false } },
    { title: 'Messages from Dentists', enabled: true,  icon: 'message',      sound: true,  frequency: 'instant', channels: { email: true,  sms: false, inApp: true  } },
    { title: 'Clinic Announcements',   enabled: false, icon: 'announcement', sound: false, frequency: 'digest',  channels: { email: true,  sms: false, inApp: true  } },
  ];

  notifications: StaffNotification[] = [];

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) {}

  // ── Lifecycle ────────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.loadNotifications();
    // Poll every 30 seconds for new notifications
    this.pollInterval = setInterval(() => this.loadNotifications(), 30000);
  }

  ngOnDestroy(): void {
    if (this.pollInterval) clearInterval(this.pollInterval);
  }

  private loadNotifications(): void {
    this.api.getStaffNotifications().subscribe({
      next: (data) => {
        this.notifications = data.map((a: any) => ({
          id:            a.id,
          category:      'appointments' as NotificationCategory,
          tone:          this.toneForStatus(a.status),
          priority:      this.priorityForStatus(a.status),
          label:         this.labelForStatus(a.status),
          title:         this.titleForStatus(a.status, a.patient_name),
          meta:          `${this.formatDate(a.appointment_date)} – ${this.formatTime(a.appointment_time)}${a.dentist_name ? ' · ' + a.dentist_name : ''}`,
          detail:        `${a.patient_name} — ${a.treatment}${a.notes ? '. ' + a.notes : ''}`,
          time:          this.relativeTime(a.updated_at || a.created_at),
          exactTime:     this.formatDate(a.updated_at || a.created_at),
          icon:          (a.status === 'Pending' ? 'hourglass' : 'calendar') as NotificationIcon,
          needsAction:   a.status === 'Pending',
          unread:        a.status === 'Pending',
          actionable:    a.status === 'Pending',
          patientName:   a.patient_name,
          appointmentId: String(a.id),
          status:        a.status,
        }));
        this.cdr.detectChanges();
      },
      error: () => {}
    });
  }

  private toneForStatus(status: string): NotificationTone {
    if (status === 'Pending')     return 'amber';
    if (status === 'Approved')    return 'green';
    if (status === 'Cancelled')   return 'slate';
    if (status === 'Rescheduled') return 'blue';
    return 'slate';
  }

  private priorityForStatus(status: string): NotificationPriority {
    if (status === 'Pending') return 'needs-action';
    return 'informational';
  }

  private labelForStatus(status: string): string {
    const map: Record<string, string> = {
      Pending: 'Pending Approval', Approved: 'Approved',
      Cancelled: 'Cancelled', Rescheduled: 'Rescheduled', Completed: 'Completed',
    };
    return map[status] || status;
  }

  private titleForStatus(status: string, patient: string): string {
    if (status === 'Pending')     return 'Appointment Request Received';
    if (status === 'Approved')    return 'Appointment Confirmed';
    if (status === 'Cancelled')   return 'Appointment Cancelled';
    if (status === 'Rescheduled') return 'Appointment Rescheduled';
    if (status === 'Completed')   return 'Appointment Completed';
    return `Appointment Update — ${patient}`;
  }

  private formatDate(d: string): string {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  private formatTime(t: string): string {
    if (!t) return '';
    const [h, m] = t.split(':').map(Number);
    return `${h % 12 || 12}:${String(m).padStart(2,'0')} ${h >= 12 ? 'PM' : 'AM'}`;
  }

  private relativeTime(dateStr: string): string {
    if (!dateStr) return '—';
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hr ago`;
    return `${Math.floor(hrs / 24)} days ago`;
  }

  // ── Computed Lists ───────────────────────────────────────────────────────
  get visibleNotifications(): StaffNotification[] {
    let list = [...this.notifications];

    // Category filter
    if (this.selectedFilter !== 'all') {
      list = list.filter(n => n.category === this.selectedFilter);
    }

    // Status filter
    if (this.statusFilter === 'unread')       list = list.filter(n => n.unread);
    if (this.statusFilter === 'read')         list = list.filter(n => !n.unread);
    if (this.statusFilter === 'needs-action') list = list.filter(n => n.needsAction);

    // Search
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(n =>
        n.title.toLowerCase().includes(q) ||
        n.detail.toLowerCase().includes(q) ||
        (n.patientName?.toLowerCase().includes(q)) ||
        n.label.toLowerCase().includes(q)
      );
    }

    // Sort
    if (this.sortBy === 'newest')   list = list.sort((a, b) => b.id - a.id);
    if (this.sortBy === 'oldest')   list = list.sort((a, b) => a.id - b.id);
    if (this.sortBy === 'priority') {
      const order: Record<NotificationPriority, number> = { urgent: 0, 'needs-action': 1, informational: 2 };
      list = list.sort((a, b) => order[a.priority] - order[b.priority]);
    }

    return list;
  }

  get unreadCount():      number { return this.notifications.filter(n => n.unread).length; }
  get needsActionCount(): number { return this.notifications.filter(n => n.needsAction).length; }
  get messageCount():     number { return this.notifications.filter(n => n.category === 'messages').length; }
  get urgentCount():      number { return this.notifications.filter(n => n.priority === 'urgent').length; }

  getFilterCount(key: FilterChip['key']): number {
    return key === 'all'
      ? this.notifications.length
      : this.notifications.filter(n => n.category === key).length;
  }

  // ── Actions ──────────────────────────────────────────────────────────────
  setFilter(key: FilterChip['key']): void { this.selectedFilter = key; }

  markAllAsRead(): void {
    this.notifications = this.notifications.map(n => ({ ...n, unread: false }));
  }

  markAsRead(notif: StaffNotification): void {
    notif.unread = false;
  }

  toggleRead(notif: StaffNotification, event: Event): void {
    event.stopPropagation();
    notif.unread = !notif.unread;
  }

  approve(notif: StaffNotification, event: Event): void {
    event.stopPropagation();
    notif.status = 'Approved';
    notif.needsAction = false;
    notif.unread = false;
    notif.tone = 'green';
    notif.label = 'Approved';
    notif.priority = 'informational';
    notif.actionable = false;
    notif.detail = `${notif.patientName}'s appointment has been approved and synced to the calendar.`;
  }

  openReject(notif: StaffNotification, event: Event): void {
    event.stopPropagation();
    this.rejectTarget = notif;
    this.showRejectModal = true;
    this.rejectReason = '';
  }

  submitReject(): void {
    if (this.rejectTarget && this.rejectReason.trim()) {
      this.rejectTarget.status = 'Rejected';
      this.rejectTarget.needsAction = false;
      this.rejectTarget.unread = false;
      this.rejectTarget.tone = 'slate';
      this.rejectTarget.label = 'Rejected';
      this.rejectTarget.priority = 'informational';
      this.rejectTarget.actionable = false;
      this.rejectTarget.detail = `Rejected: ${this.rejectReason}`;
      this.closeRejectModal();
    }
  }

  closeRejectModal(): void {
    this.showRejectModal = false;
    this.rejectTarget = null;
    this.rejectReason = '';
  }

  openDetails(notif: StaffNotification, event?: Event): void {
    event?.stopPropagation();
    notif.unread = false;
    this.selectedNotification = notif;
  }

  closeDetails(): void { this.selectedNotification = null; }

  togglePreference(pref: PreferenceItem): void { pref.enabled = !pref.enabled; }

  toggleSearch(): void { this.showSearch = !this.showSearch; if (!this.showSearch) this.searchQuery = ''; }

  getPriorityBorderClass(priority: NotificationPriority): string {
    return { urgent: 'border-urgent', 'needs-action': 'border-action', informational: 'border-info' }[priority];
  }
}
