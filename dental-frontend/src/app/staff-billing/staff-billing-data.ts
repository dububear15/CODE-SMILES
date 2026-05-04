export type BillingStatus = 'Paid' | 'Unpaid' | 'Partial' | 'Waived' | 'Overdue';
export type PaymentMethod = 'Cash' | 'GCash' | 'Maya' | 'Card' | 'Bank Transfer' | 'Insurance' | 'HMO';
export type WaiverStatus = 'None' | 'Pending' | 'Approved' | 'Rejected';

export interface PaymentHistoryEntry {
  amount: number;
  method: PaymentMethod;
  date: string;
  receivedBy: string;
  reference: string;
}

export interface TreatmentLineItem {
  description: string;
  qty: number;
  unitPrice: number;
  discount: number; // peso amount
}

export interface BillingRecord {
  id: string;
  patient: string;
  patientId: string;
  service: string;
  dentist: string;
  date: string;
  dueDate: string;
  amount: number;
  amountPaid: number;
  discount: number;
  status: BillingStatus;
  paymentMethod: PaymentMethod | null;
  notes: string;
  invoiceNo: string;
  waiverStatus: WaiverStatus;
  waiverReason: string;
  lineItems: TreatmentLineItem[];
  paymentHistory: PaymentHistoryEntry[];
}

export const BILLING_RECORDS: BillingRecord[] = [
  {
    id: 'BIL-1001',
    patient: 'Isabella Cruz',
    patientId: 'CS-1001',
    service: 'Dental Cleaning',
    dentist: 'Dr. Raphoncel Eduria',
    date: 'April 9, 2026',
    dueDate: 'April 16, 2026',
    amount: 1500,
    amountPaid: 1500,
    discount: 0,
    status: 'Paid',
    paymentMethod: 'GCash',
    notes: '',
    invoiceNo: 'INV-2026-0041',
    waiverStatus: 'None',
    waiverReason: '',
    lineItems: [
      { description: 'Oral Prophylaxis', qty: 1, unitPrice: 1200, discount: 0 },
      { description: 'Fluoride Application', qty: 1, unitPrice: 300, discount: 0 },
    ],
    paymentHistory: [
      { amount: 1500, method: 'GCash', date: 'April 9, 2026', receivedBy: 'Maria Santos', reference: 'GC-20260409-001' },
    ],
  },
  {
    id: 'BIL-1002',
    patient: 'Miguel Reyes',
    patientId: 'CS-1002',
    service: 'Simple Tooth Extraction',
    dentist: 'Dr. Raphoncel Eduria',
    date: 'April 10, 2026',
    dueDate: 'April 17, 2026',
    amount: 2500,
    amountPaid: 0,
    discount: 0,
    status: 'Unpaid',
    paymentMethod: null,
    notes: 'Patient requested to pay on next visit.',
    invoiceNo: 'INV-2026-0042',
    waiverStatus: 'None',
    waiverReason: '',
    lineItems: [
      { description: 'Simple Extraction – Tooth #36', qty: 1, unitPrice: 2000, discount: 0 },
      { description: 'Local Anesthesia', qty: 1, unitPrice: 500, discount: 0 },
    ],
    paymentHistory: [],
  },
  {
    id: 'BIL-1003',
    patient: 'Ariana Santos',
    patientId: 'CS-1003',
    service: 'Traditional Braces',
    dentist: 'Dr. Christine Faith Metillo',
    date: 'April 11, 2026',
    dueDate: 'May 11, 2026',
    amount: 45000,
    amountPaid: 15000,
    discount: 2000,
    status: 'Partial',
    paymentMethod: 'Cash',
    notes: 'Installment plan — 3 payments of ₱15,000.',
    invoiceNo: 'INV-2026-0043',
    waiverStatus: 'None',
    waiverReason: '',
    lineItems: [
      { description: 'Metal Bracket Placement (Full Arch)', qty: 1, unitPrice: 40000, discount: 2000 },
      { description: 'Initial Consultation & X-Ray', qty: 1, unitPrice: 500, discount: 0 },
      { description: 'Dental Cleaning (Pre-ortho)', qty: 1, unitPrice: 1500, discount: 0 },
      { description: 'Retainer (Upper)', qty: 1, unitPrice: 3000, discount: 0 },
    ],
    paymentHistory: [
      { amount: 15000, method: 'Cash', date: 'April 11, 2026', receivedBy: 'Maria Santos', reference: 'OR-0043-A' },
    ],
  },
  {
    id: 'BIL-1004',
    patient: 'Daniel Flores',
    patientId: 'CS-1004',
    service: 'Oral Consultation',
    dentist: 'Dr. Raphoncel Eduria',
    date: 'April 10, 2026',
    dueDate: 'April 17, 2026',
    amount: 500,
    amountPaid: 0,
    discount: 500,
    status: 'Waived',
    paymentMethod: null,
    notes: 'Waived as courtesy for returning patient.',
    invoiceNo: 'INV-2026-0044',
    waiverStatus: 'Approved',
    waiverReason: 'Courtesy waiver for loyal returning patient. Approved by clinic manager.',
    lineItems: [
      { description: 'Oral Consultation', qty: 1, unitPrice: 500, discount: 500 },
    ],
    paymentHistory: [],
  },
  {
    id: 'BIL-1005',
    patient: 'Sofia Bautista',
    patientId: 'CS-1005',
    service: 'Teeth Whitening',
    dentist: 'Dr. Derence Acojedo',
    date: 'March 28, 2026',
    dueDate: 'April 4, 2026',
    amount: 8000,
    amountPaid: 0,
    discount: 0,
    status: 'Overdue',
    paymentMethod: null,
    notes: 'No payment received after 14 days. Follow-up required.',
    invoiceNo: 'INV-2026-0038',
    waiverStatus: 'None',
    waiverReason: '',
    lineItems: [
      { description: 'In-Office Teeth Whitening (Zoom)', qty: 1, unitPrice: 7500, discount: 0 },
      { description: 'Take-Home Whitening Kit', qty: 1, unitPrice: 500, discount: 0 },
    ],
    paymentHistory: [],
  },
  {
    id: 'BIL-1006',
    patient: 'Noah Villanueva',
    patientId: 'CS-1006',
    service: 'Dental Cleaning',
    dentist: 'Dr. Raphoncel Eduria',
    date: 'April 13, 2026',
    dueDate: 'April 20, 2026',
    amount: 1500,
    amountPaid: 0,
    discount: 0,
    status: 'Unpaid',
    paymentMethod: null,
    notes: '',
    invoiceNo: 'INV-2026-0045',
    waiverStatus: 'None',
    waiverReason: '',
    lineItems: [
      { description: 'Oral Prophylaxis', qty: 1, unitPrice: 1200, discount: 0 },
      { description: 'Fluoride Application', qty: 1, unitPrice: 300, discount: 0 },
    ],
    paymentHistory: [],
  },
  {
    id: 'BIL-1007',
    patient: 'Camille Navarro',
    patientId: 'CS-1007',
    service: 'Traditional Braces',
    dentist: 'Dr. Christine Faith Metillo',
    date: 'April 14, 2026',
    dueDate: 'April 21, 2026',
    amount: 45000,
    amountPaid: 45000,
    discount: 0,
    status: 'Paid',
    paymentMethod: 'HMO',
    notes: 'Covered by Maxicare HMO plan.',
    invoiceNo: 'INV-2026-0046',
    waiverStatus: 'None',
    waiverReason: '',
    lineItems: [
      { description: 'Metal Bracket Placement (Full Arch)', qty: 1, unitPrice: 40000, discount: 0 },
      { description: 'Initial Consultation & X-Ray', qty: 1, unitPrice: 500, discount: 0 },
      { description: 'Dental Cleaning (Pre-ortho)', qty: 1, unitPrice: 1500, discount: 0 },
      { description: 'Retainer (Upper)', qty: 1, unitPrice: 3000, discount: 0 },
    ],
    paymentHistory: [
      { amount: 45000, method: 'HMO', date: 'April 14, 2026', receivedBy: 'Maria Santos', reference: 'HMO-MAXI-0046' },
    ],
  },
  {
    id: 'BIL-1008',
    patient: 'Paolo Mendoza',
    patientId: 'CS-1008',
    service: 'Single Tooth Implant',
    dentist: 'Dr. Christine Faith Metillo',
    date: 'April 12, 2026',
    dueDate: 'May 12, 2026',
    amount: 35000,
    amountPaid: 17500,
    discount: 0,
    status: 'Partial',
    paymentMethod: 'Card',
    notes: '50% downpayment received. Balance due on implant placement.',
    invoiceNo: 'INV-2026-0047',
    waiverStatus: 'None',
    waiverReason: '',
    lineItems: [
      { description: 'Implant Fixture (Titanium)', qty: 1, unitPrice: 25000, discount: 0 },
      { description: 'Implant Crown (Zirconia)', qty: 1, unitPrice: 8000, discount: 0 },
      { description: 'Surgical Placement Fee', qty: 1, unitPrice: 2000, discount: 0 },
    ],
    paymentHistory: [
      { amount: 17500, method: 'Card', date: 'April 12, 2026', receivedBy: 'Maria Santos', reference: 'CARD-0047-DP' },
    ],
  },
];
