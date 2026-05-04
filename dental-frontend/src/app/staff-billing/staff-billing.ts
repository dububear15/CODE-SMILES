import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { StaffSidebar } from '../staff-sidebar/staff-sidebar';
import { BillingRecord, BillingStatus, PaymentMethod, PaymentHistoryEntry } from './staff-billing-data';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-staff-billing',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, StaffSidebar],
  templateUrl: './staff-billing.html',
  styleUrl: './staff-billing.css',
})
export class StaffBilling implements OnInit {

  protected records: BillingRecord[] = [];
  protected isLoading = true;
  protected summary = { total_revenue: 0, outstanding: 0, overdue_count: 0, partial_count: 0 };

  protected readonly statusTabs: BillingStatus[] = ['Unpaid', 'Partial', 'Overdue', 'Paid', 'Waived'];
  protected readonly paymentMethods: PaymentMethod[] = ['Cash', 'GCash', 'Maya', 'Card', 'Bank Transfer', 'Insurance', 'HMO'];

  protected activeTab: BillingStatus = 'Unpaid';
  protected searchTerm = '';

  // ── INVOICE PANEL ──────────────────────────────────────────────
  protected showInvoice = false;
  protected invoiceRecord: BillingRecord | null = null;

  // ── PAYMENT MODAL ──────────────────────────────────────────────
  protected showPayModal = false;
  protected payRecord: BillingRecord | null = null;
  protected modalPayAmount = 0;
  protected modalPayMethod: PaymentMethod = 'Cash';
  protected modalPayRef = '';
  protected modalNotes = '';
  protected modalError = '';

  // ── WAIVER REQUEST MODAL ───────────────────────────────────────
  protected showWaiverModal = false;
  protected waiverTarget: BillingRecord | null = null;
  protected waiverReason = '';
  protected waiverError = '';

  // ── RECEIPT MODAL ──────────────────────────────────────────────
  protected showReceiptModal = false;
  protected receiptRecord: BillingRecord | null = null;

  constructor(private api: ApiService, private auth: AuthService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadRecords();
    this.loadSummary();
  }

  private loadRecords(): void {
    this.isLoading = true;
    this.api.getBillingRecords().subscribe({
      next: (data) => {
        this.records = data.map((r: any) => this.mapDbRecord(r));
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private loadSummary(): void {
    this.api.getBillingSummary().subscribe({
      next: (data) => {
        this.summary = data;
        this.cdr.detectChanges();
      },
      error: () => {}
    });
  }

  private mapDbRecord(r: any): BillingRecord {
    const user = this.auth.getUser();
    return {
      id:             String(r.id),
      patient:        r.patient_name || '—',
      patientId:      r.patient_id ? `CS-${String(r.patient_id).padStart(5,'0')}` : '—',
      service:        r.service || '—',
      dentist:        r.dentist_name || '—',
      date:           r.date_fmt || r.created_at || '—',
      dueDate:        r.due_date_fmt || '—',
      amount:         parseFloat(r.amount) || 0,
      amountPaid:     parseFloat(r.amount_paid) || 0,
      discount:       parseFloat(r.discount) || 0,
      status:         (r.status || 'Unpaid') as BillingStatus,
      paymentMethod:  r.payment_method as PaymentMethod || null,
      notes:          r.notes || '',
      invoiceNo:      r.invoice_no || `INV-${r.id}`,
      waiverStatus:   'None' as any,
      waiverReason:   '',
      lineItems:      [{ description: r.service || 'Service', qty: 1, unitPrice: parseFloat(r.amount)||0, discount: parseFloat(r.discount)||0 }],
      paymentHistory: [],
    };
  }

  // ── SUMMARY STATS ──────────────────────────────────────────────
  protected get totalRevenue(): number { return parseFloat(String(this.summary.total_revenue)) || 0; }
  protected get totalOutstanding(): number { return parseFloat(String(this.summary.outstanding)) || 0; }
  protected get overdueCount(): number { return parseInt(String(this.summary.overdue_count)) || 0; }
  protected get partialCount(): number { return parseInt(String(this.summary.partial_count)) || 0; }

  // ── FILTERED LIST ──────────────────────────────────────────────
  protected get filtered(): BillingRecord[] {
    const q = this.searchTerm.trim().toLowerCase();
    return this.records
      .filter(r => r.status === this.activeTab)
      .filter(r => {
        if (!q) return true;
        return [r.patient, r.service, r.dentist, r.invoiceNo, r.patientId]
          .join(' ').toLowerCase().includes(q);
      });
  }

  protected countForTab(tab: BillingStatus): number {
    return this.records.filter(r => r.status === tab).length;
  }

  // ── INVOICE PANEL ──────────────────────────────────────────────
  protected openInvoice(record: BillingRecord): void {
    this.invoiceRecord = record;
    this.showInvoice = true;
  }
  protected closeInvoice(): void {
    this.showInvoice = false;
    this.invoiceRecord = null;
  }
  protected openPayFromInvoice(): void {
    if (!this.invoiceRecord) return;
    this.closeInvoice();
    this.openPayModal(this.invoiceRecord);
  }
  protected openWaiverFromInvoice(): void {
    if (!this.invoiceRecord) return;
    const rec = this.invoiceRecord;
    this.closeInvoice();
    this.openWaiverModal(rec);
  }

  // ── PAYMENT MODAL ──────────────────────────────────────────────
  protected openPayModal(record: BillingRecord): void {
    this.payRecord = record;
    this.modalPayAmount = record.amount - record.amountPaid;
    this.modalPayMethod = 'Cash';
    this.modalPayRef = '';
    this.modalNotes = '';
    this.modalError = '';
    this.showPayModal = true;
  }
  protected closePayModal(): void {
    this.showPayModal = false;
    this.payRecord = null;
  }
  protected get payModalBalance(): number {
    if (!this.payRecord) return 0;
    return this.payRecord.amount - this.payRecord.amountPaid;
  }
  protected recordPayment(): void {
    if (!this.payRecord) return;
    if (!this.modalPayAmount || this.modalPayAmount <= 0) {
      this.modalError = 'Please enter a valid payment amount.';
      return;
    }
    if (this.modalPayAmount > this.payModalBalance) {
      this.modalError = `Amount cannot exceed the balance of ${this.formatPeso(this.payModalBalance)}.`;
      return;
    }

    // Save to DB
    this.api.recordPayment(parseInt(this.payRecord.id), {
      amount_paid: this.modalPayAmount,
      payment_method: this.modalPayMethod,
      notes: this.modalNotes.trim() || undefined,
    }).subscribe({
      next: (res) => {
        if (this.payRecord) {
          this.payRecord.amountPaid += this.modalPayAmount;
          this.payRecord.paymentMethod = this.modalPayMethod;
          this.payRecord.status = res.status as BillingStatus;
          if (this.modalNotes.trim()) this.payRecord.notes = this.modalNotes.trim();
          const entry: PaymentHistoryEntry = {
            amount: this.modalPayAmount,
            method: this.modalPayMethod,
            date: new Date().toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' }),
            receivedBy: 'Staff',
            reference: this.modalPayRef.trim() || `OR-${this.payRecord.invoiceNo}-${Date.now().toString().slice(-4)}`,
          };
          this.payRecord.paymentHistory = [...this.payRecord.paymentHistory, entry];
        }
        this.loadSummary();
        this.closePayModal();
        this.cdr.detectChanges();
      },
      error: () => {
        this.modalError = 'Failed to record payment. Please try again.';
        this.cdr.detectChanges();
      }
    });
  }

  // ── WAIVER REQUEST ─────────────────────────────────────────────
  protected openWaiverModal(record: BillingRecord): void {
    this.waiverTarget = record;
    this.waiverReason = '';
    this.waiverError = '';
    this.showWaiverModal = true;
  }
  protected closeWaiverModal(): void {
    this.showWaiverModal = false;
    this.waiverTarget = null;
  }
  protected submitWaiverRequest(): void {
    if (!this.waiverTarget) return;
    if (!this.waiverReason.trim()) {
      this.waiverError = 'Please provide a reason for the waiver request.';
      return;
    }
    this.waiverTarget.waiverStatus = 'Pending';
    this.waiverTarget.waiverReason = this.waiverReason.trim();
    this.closeWaiverModal();
  }

  // ── RECEIPT MODAL ──────────────────────────────────────────────
  protected openReceipt(record: BillingRecord): void {
    this.receiptRecord = record;
    this.showReceiptModal = true;
  }
  protected closeReceipt(): void {
    this.showReceiptModal = false;
    this.receiptRecord = null;
  }
  protected printReceipt(): void {
    window.print();
  }

  // ── HELPERS ────────────────────────────────────────────────────
  protected getBalance(r: BillingRecord): number { return r.amount - r.amountPaid; }

  protected getLineSubtotal(r: BillingRecord): number {
    return r.lineItems.reduce((s, l) => s + (l.qty * l.unitPrice), 0);
  }
  protected getLineDiscounts(r: BillingRecord): number {
    return r.lineItems.reduce((s, l) => s + l.discount, 0);
  }

  protected isOverdue(r: BillingRecord): boolean {
    if (r.status === 'Paid' || r.status === 'Waived') return false;
    try {
      return new Date(r.dueDate) < new Date();
    } catch { return false; }
  }

  protected statusClass(status: BillingStatus): string {
    const map: Record<BillingStatus, string> = {
      Paid: 'badge-paid', Unpaid: 'badge-unpaid',
      Partial: 'badge-partial', Waived: 'badge-waived', Overdue: 'badge-overdue',
    };
    return map[status] ?? '';
  }

  protected waiverBadgeClass(ws: string): string {
    if (ws === 'Pending') return 'badge-waiver-pending';
    if (ws === 'Approved') return 'badge-waiver-approved';
    if (ws === 'Rejected') return 'badge-waiver-rejected';
    return '';
  }

  protected formatPeso(n: number): string {
    return '&#8369;' + n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  protected formatPesoPlain(n: number): string {
    return '₱' + n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
}
