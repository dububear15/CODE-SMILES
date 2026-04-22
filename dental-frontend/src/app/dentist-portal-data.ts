export interface DentistSummaryCard {
  label: string;
  value: string;
  note: string;
  action: string;
  icon: string;
  tone: 'cyan' | 'amber' | 'violet' | 'emerald';
}

export interface DentistAppointment {
  patient: string;
  service: string;
  date: string;
  time: string;
  visitType: string;
  notes: string;
  status: 'Confirmed' | 'Pending' | 'Upcoming' | 'Completed' | 'Cancelled' | 'In Progress';
  recordState: string;
  reason: string;
}

export interface NextPatientFocus {
  patient: string;
  schedule: string;
  reasonForVisit: string;
  reminder: string;
  lastNote: string;
}

export interface TreatmentProgressItem {
  patient: string;
  treatmentType: string;
  milestone: string;
  progress: number;
  nextStep: string;
  followUp: string;
  pendingTask: string;
  status: 'Consultation Needed' | 'Active Treatment' | 'Follow-up Required' | 'Completed';
}

export interface RecordUpdateItem {
  patient: string;
  update: string;
  detail: string;
  time: string;
  category: 'Treatment Note' | 'Prescription' | 'Visit Summary' | 'Diagnosis';
}

export interface DentistPatient {
  name: string;
  age: number;
  lastVisit: string;
  currentTreatment: string;
  nextVisit: string;
  treatmentStatus: string;
  riskFlag: string;
}

export interface MedicalVaultEntry {
  section: string;
  title: string;
  summary: string;
  date: string;
}

export interface TimelineEntry {
  date: string;
  title: string;
  detail: string;
}

export interface PrescriptionRecord {
  patient: string;
  medication: string;
  dosage: string;
  issueDate: string;
  status: string;
  instruction: string;
}

export interface NotificationAlert {
  title: string;
  detail: string;
  type: 'Consultation' | 'Schedule' | 'Records' | 'Follow-up';
  time: string;
}

export const DENTIST_SUMMARY_CARDS: DentistSummaryCard[] = [
  {
    label: "Today's Appointments",
    value: '08',
    note: 'From the current working day',
    action: 'View Schedule',
    icon: 'CAL',
    tone: 'cyan',
  },
  {
    label: 'My Patients',
    value: '142',
    note: 'Under active care and review',
    action: 'View Patients',
    icon: 'PAT',
    tone: 'emerald',
  },
  {
    label: 'Pending Records',
    value: '05',
    note: 'Charts waiting for updates',
    action: 'Review Records',
    icon: 'REC',
    tone: 'violet',
  },
  {
    label: 'Treatment Plans',
    value: '12',
    note: 'Plans needing attention',
    action: 'Manage Plans',
    icon: 'TPL',
    tone: 'amber',
  },
];

export const DENTIST_APPOINTMENTS: DentistAppointment[] = [
  {
    patient: 'Juan Dela Cruz',
    service: 'Cleaning & Checkup',
    date: 'April 17, 2024',
    time: '9:00 AM',
    visitType: 'Routine Visit',
    notes: 'Review cleaning notes, reinforce daily care routine, and check lower molar sensitivity.',
    status: 'Confirmed',
    recordState: 'Chart ready',
    reason: 'Regular preventive care visit',
  },
  {
    patient: 'Miguel Reyes',
    service: 'Orthodontic Adjustment',
    date: 'April 17, 2024',
    time: '10:30 AM',
    visitType: 'Adjustment',
    notes: 'Check bracket response, review elastic wear, and update progress note after the visit.',
    status: 'In Progress',
    recordState: 'Note pending',
    reason: 'Monthly alignment review',
  },
  {
    patient: 'Miguel Torres',
    service: 'Treatment Consultation',
    date: 'April 17, 2024',
    time: '1:00 PM',
    visitType: 'Consultation',
    notes: 'Review treatment options, discuss imaging findings, and approve the next care plan.',
    status: 'Pending',
    recordState: 'Approval needed',
    reason: 'Treatment planning discussion',
  },
  {
    patient: 'Liza Garcia',
    service: 'Tooth Filling',
    date: 'April 17, 2024',
    time: '3:30 PM',
    visitType: 'Procedure',
    notes: 'Confirm shade, isolate upper premolar, and document post-procedure care advice.',
    status: 'Pending',
    recordState: 'Prep requested',
    reason: 'Restoration for recurrent cavity',
  },
  {
    patient: 'Paolo Mendoza',
    service: 'Smile Design Review',
    date: 'April 18, 2024',
    time: '9:30 AM',
    visitType: 'Review',
    notes: 'Prepare before-and-after references and discuss revised cosmetic treatment preferences.',
    status: 'Upcoming',
    recordState: 'Presentation deck ready',
    reason: 'Follow-up consultation',
  },
  {
    patient: 'Camille Navarro',
    service: 'Braces Adjustment',
    date: 'April 18, 2024',
    time: '2:00 PM',
    visitType: 'Adjustment',
    notes: 'Guardian joining. Prepare adjustment notes and next wire progression plan.',
    status: 'Upcoming',
    recordState: 'Guardian noted',
    reason: 'Monthly braces review',
  },
  {
    patient: 'Rafael Gomez',
    service: 'Post-op Follow-up',
    date: 'April 16, 2024',
    time: '11:00 AM',
    visitType: 'Follow-up',
    notes: 'Healing looked stable. Post-op summary already saved to the chart.',
    status: 'Completed',
    recordState: 'Closed',
    reason: 'One-week post extraction check',
  },
  {
    patient: 'Sofia Mendoza',
    service: 'Whitening Consultation',
    date: 'April 16, 2024',
    time: '4:00 PM',
    visitType: 'Consultation',
    notes: 'Patient asked to move after finals week. Leave consultation note available for the next slot.',
    status: 'Cancelled',
    recordState: 'Reschedule requested',
    reason: 'Smile design consultation',
  },
];

export const DENTIST_NEXT_PATIENT: NextPatientFocus = {
  patient: 'Miguel Torres',
  schedule: 'Today at 1:00 PM',
  reasonForVisit: 'Treatment consultation for restorative and cosmetic care planning.',
  reminder: 'Open the latest x-rays, confirm consent details, and prepare the treatment plan summary.',
  lastNote: 'Patient asked for a clearer cost breakdown and wanted the restoration sequence explained before approval.',
};

export const DENTIST_TREATMENT_PROGRESS: TreatmentProgressItem[] = [
  {
    patient: 'Ariana Santos',
    treatmentType: 'Clear aligner therapy',
    milestone: 'Tray 9 of 14 delivered',
    progress: 64,
    nextStep: 'Evaluate rotation improvement and release next tray set.',
    followUp: 'Next review in 2 weeks',
    pendingTask: 'Update progress note with current fit assessment',
    status: 'Active Treatment',
  },
  {
    patient: 'Camille Navarro',
    treatmentType: 'Fixed braces',
    milestone: 'Archwire progression review',
    progress: 58,
    nextStep: 'Adjust brackets and reinforce elastic wear routine.',
    followUp: 'Guardian follow-up after adjustment',
    pendingTask: 'Confirm discomfort note after wire change',
    status: 'Follow-up Required',
  },
  {
    patient: 'Daniel Flores',
    treatmentType: 'Root canal restoration',
    milestone: 'Healing check before crown fitting',
    progress: 82,
    nextStep: 'Approve crown placement if tenderness remains resolved.',
    followUp: 'Chairside reassessment later today',
    pendingTask: 'Close treatment phase if asymptomatic',
    status: 'Active Treatment',
  },
  {
    patient: 'Liam Mendoza',
    treatmentType: 'Occlusion workup',
    milestone: 'Initial records collected',
    progress: 18,
    nextStep: 'Review x-ray findings and build treatment recommendation.',
    followUp: 'Consultation needed next week',
    pendingTask: 'Add diagnosis summary to vault',
    status: 'Consultation Needed',
  },
];

export const DENTIST_RECORD_UPDATES: RecordUpdateItem[] = [
  {
    patient: 'Carlos Mendoza',
    update: 'New lab results uploaded',
    detail: 'Recent diagnostic files were attached and are ready for clinical review before the next visit.',
    time: '10 min ago',
    category: 'Diagnosis',
  },
  {
    patient: 'Sofia Martinez',
    update: 'Treatment plan needs approval',
    detail: 'The draft plan is waiting on your sign-off before staff can confirm the procedure schedule.',
    time: '2 hours ago',
    category: 'Visit Summary',
  },
  {
    patient: 'Tomorrow’s schedule',
    update: 'Schedule update available',
    detail: 'Chair assignments and room prep details were refreshed for the next working day.',
    time: '1 day ago',
    category: 'Treatment Note',
  },
];

export const DENTIST_PATIENTS: DentistPatient[] = [
  {
    name: 'Ariana Santos',
    age: 19,
    lastVisit: 'March 28, 2026',
    currentTreatment: 'Clear aligner therapy',
    nextVisit: 'April 11, 2026',
    treatmentStatus: 'Active treatment',
    riskFlag: 'Needs progress note after review',
  },
  {
    name: 'Daniel Flores',
    age: 34,
    lastVisit: 'April 04, 2026',
    currentTreatment: 'Root canal restoration',
    nextVisit: 'April 11, 2026',
    treatmentStatus: 'Follow-up required',
    riskFlag: 'Confirm crown clearance',
  },
  {
    name: 'Camille Navarro',
    age: 16,
    lastVisit: 'March 30, 2026',
    currentTreatment: 'Fixed braces adjustment',
    nextVisit: 'April 12, 2026',
    treatmentStatus: 'Active treatment',
    riskFlag: 'Guardian attendance noted',
  },
  {
    name: 'Liam Mendoza',
    age: 41,
    lastVisit: 'April 01, 2026',
    currentTreatment: 'Occlusion workup',
    nextVisit: 'April 15, 2026',
    treatmentStatus: 'Consultation needed',
    riskFlag: 'Pending diagnosis review',
  },
];

export const DENTIST_MEDICAL_VAULT: MedicalVaultEntry[] = [
  {
    section: 'Dental History',
    title: 'Previous restorative history',
    summary: 'Multiple posterior restorations, sensitivity under cold stimulus, no systemic allergies reported.',
    date: 'April 01, 2026',
  },
  {
    section: 'Visit Summary',
    title: 'Orthodontic review summary',
    summary: 'Alignment improving. Mild irritation noted on upper right canine. Continue tray wear 22 hours daily.',
    date: 'March 28, 2026',
  },
  {
    section: 'Diagnosis',
    title: 'Occlusion assessment',
    summary: 'Early signs of bite imbalance with intermittent jaw fatigue after prolonged chewing.',
    date: 'April 01, 2026',
  },
  {
    section: 'Prescription',
    title: 'Post-procedure medication guidance',
    summary: 'Ibuprofen as needed after extraction with soft-diet reminder and hydration instructions.',
    date: 'April 10, 2026',
  },
];

export const DENTIST_TREATMENT_TIMELINE: TimelineEntry[] = [
  {
    date: 'March 14, 2026',
    title: 'Initial consultation',
    detail: 'Collected records, photos, and baseline treatment goals.',
  },
  {
    date: 'March 21, 2026',
    title: 'Treatment plan approved',
    detail: 'Reviewed findings, aligned expectations, and staged follow-up schedule.',
  },
  {
    date: 'March 28, 2026',
    title: 'Progress review logged',
    detail: 'Milestone update recorded with improved compliance and reduced discomfort.',
  },
  {
    date: 'April 11, 2026',
    title: 'Current care touchpoint',
    detail: 'Pending note after today’s review to confirm next milestone.',
  },
];

export const DENTIST_PRESCRIPTIONS: PrescriptionRecord[] = [
  {
    patient: 'Miguel Reyes',
    medication: 'Ibuprofen 400 mg',
    dosage: 'Every 6 to 8 hours as needed',
    issueDate: 'April 11, 2026',
    status: 'Awaiting review',
    instruction: 'Take after meals and stop if gastric discomfort becomes persistent.',
  },
  {
    patient: 'Isabella Cruz',
    medication: 'Chlorhexidine rinse',
    dosage: 'Twice daily for 7 days',
    issueDate: 'April 11, 2026',
    status: 'Active',
    instruction: 'Use after brushing and avoid eating for 30 minutes after rinse.',
  },
  {
    patient: 'Daniel Flores',
    medication: 'Sensitivity care advice',
    dosage: 'Use desensitizing toothpaste nightly',
    issueDate: 'April 04, 2026',
    status: 'Reviewed',
    instruction: 'Continue for 2 weeks or until crown placement.',
  },
];

export const DENTIST_NOTIFICATIONS: NotificationAlert[] = [
  {
    title: 'New lab results uploaded',
    detail: 'Patient: Carlos Mendoza',
    type: 'Records',
    time: '10 min ago',
  },
  {
    title: 'Treatment plan needs approval',
    detail: 'Patient: Sofia Martinez',
    type: 'Consultation',
    time: '2 hours ago',
  },
  {
    title: 'Schedule update available',
    detail: "Tomorrow's appointments",
    type: 'Schedule',
    time: '1 day ago',
  },
];

export const DENTIST_QUICK_LINKS = [
  {
    title: 'View Patients',
    detail: 'Manage patient profiles',
    route: '/dentist-patients',
  },
  {
    title: 'Medical Records',
    detail: 'Access dental records',
    route: '/dentist-medical-vault',
  },
  {
    title: 'Treatment Plans',
    detail: 'Create & update plans',
    route: '/dentist-treatment-plans',
  },
  {
    title: 'My Schedule',
    detail: 'View your calendar',
    route: '/dentist-schedule',
  },
];
