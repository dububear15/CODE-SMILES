export type AppointmentStatus =
  | 'Pending'
  | 'Approved'
  | 'Completed'
  | 'Cancelled'
  | 'Rescheduled';

export interface SummaryCard {
  label: string;
  value: string;
  note: string;
  tone?: 'sky' | 'gold' | 'mint' | 'rose';
  delta?: string;
}

export interface ScheduleItem {
  patient: string;
  service: string;
  time: string;
  status: string;
}

export interface AppointmentRequest {
  id: string;
  patient: string;
  service: string;
  dentist: string;
  preferredDate: string;
  preferredTime: string;
  duration: number;
  status: AppointmentStatus;
  notes: string;
  validation: string;
  urgency: string;
}

export interface AppointmentRecord {
  patient: string;
  services: string;
  dentist: string;
  date: string;
  time: string;
  duration: string;
  status: AppointmentStatus;
}

export interface PatientRecord {
  name: string;
  contact: string;
  email: string;
  lastVisit: string;
  nextAppointment: string;
  status: 'Active' | 'Inactive';
}

export interface CalendarSlot {
  day: string;
  time: string;
  patient: string;
  status: 'Available' | 'Booked' | 'Blocked' | 'Fully Booked';
}

export interface WeeklyCalendarEvent {
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';
  startTime: string;
  endTime: string;
  patient: string;
  service: string;
  dentist: string;
  status: 'Available' | 'Booked' | 'Blocked' | 'Fully Booked';
  chair: string;
}

export interface NotificationItem {
  title: string;
  detail: string;
  level: 'New' | 'Warning' | 'Update';
  time: string;
}

export interface ActivityItem {
  title: string;
  detail: string;
  time: string;
}

export const STAFF_SUMMARY_CARDS: SummaryCard[] = [
  {
    label: "Today's Appointments",
    value: '14',
    note: 'Chairside visits, consultations, and follow-ups scheduled across the day.',
    tone: 'sky',
    delta: '+3 from yesterday',
  },
  {
    label: 'Pending Requests',
    value: '06',
    note: 'Requests waiting for staff review against availability and service duration.',
    tone: 'gold',
    delta: '2 urgent reviews',
  },
  {
    label: 'Approved Today',
    value: '09',
    note: 'Bookings already pushed into the clinic calendar and dentist workflow.',
    tone: 'mint',
    delta: '64% approval rate',
  },
  {
    label: 'Cancelled or Rescheduled',
    value: '04',
    note: 'Changes requiring updated patient communication and calendar cleanup.',
    tone: 'rose',
    delta: '1 conflict unresolved',
  },
];

export const TODAY_SCHEDULE: ScheduleItem[] = [
  { patient: 'Isabella Cruz', service: 'Dental Cleaning', time: '9:00 AM', status: 'Confirmed' },
  { patient: 'Miguel Reyes', service: 'Tooth Extraction', time: '10:30 AM', status: 'In Progress' },
  { patient: 'Ariana Santos', service: 'Orthodontic Review', time: '1:00 PM', status: 'Confirmed' },
  { patient: 'Daniel Flores', service: 'Root Canal Follow-up', time: '3:30 PM', status: 'Needs Prep' },
];

export const STAFF_REQUESTS: AppointmentRequest[] = [
  {
    id: 'REQ-2084',
    patient: 'Sofia Bautista',
    service: 'Teeth Whitening and Consultation',
    dentist: 'Dr. Angela Lim',
    preferredDate: 'April 13, 2026',
    preferredTime: '11:00 AM',
    duration: 90,
    status: 'Pending',
    notes: 'Requested a morning slot before school dismissal hours.',
    validation: 'Fits service-duration rules and stays within the 120-minute booking limit.',
    urgency: 'Standard',
  },
  {
    id: 'REQ-2085',
    patient: 'Noah Villanueva',
    service: 'Deep Cleaning',
    dentist: 'Dr. Marcus Rivera',
    preferredDate: 'April 13, 2026',
    preferredTime: '2:00 PM',
    duration: 75,
    status: 'Pending',
    notes: 'Patient prefers the same dentist from the previous visit.',
    validation: 'Preferred chair is free, but dentist turnaround is tight.',
    urgency: 'High',
  },
  {
    id: 'REQ-2086',
    patient: 'Camille Navarro',
    service: 'Braces Adjustment',
    dentist: 'Dr. Angela Lim',
    preferredDate: 'April 14, 2026',
    preferredTime: '9:30 AM',
    duration: 45,
    status: 'Pending',
    notes: 'Asked to align with guardian availability.',
    validation: 'No service conflict found. Slot is available and below the session threshold.',
    urgency: 'Standard',
  },
];

export const STAFF_ACTIVITY: ActivityItem[] = [
  {
    title: 'New booking submitted',
    detail: 'Sofia Bautista requested a whitening consultation for April 13.',
    time: '5 minutes ago',
  },
  {
    title: 'Booking approved',
    detail: 'A routine oral prophylaxis slot was confirmed and synced to the patient portal.',
    time: '18 minutes ago',
  },
  {
    title: 'Booking rescheduled',
    detail: 'A braces adjustment moved from 4:00 PM to 5:00 PM because of a dentist delay.',
    time: '41 minutes ago',
  },
  {
    title: 'Cancellation notice',
    detail: 'One restorative visit was cancelled after patient confirmation by phone.',
    time: '1 hour ago',
  },
];

export const STAFF_APPOINTMENTS: AppointmentRecord[] = [
  {
    patient: 'Sofia Bautista',
    services: 'Teeth Whitening and Consultation',
    dentist: 'Dr. Angela Lim',
    date: 'April 13, 2026',
    time: '11:00 AM',
    duration: '90 min',
    status: 'Pending',
  },
  {
    patient: 'Noah Villanueva',
    services: 'Deep Cleaning',
    dentist: 'Dr. Marcus Rivera',
    date: 'April 13, 2026',
    time: '2:00 PM',
    duration: '75 min',
    status: 'Pending',
  },
  {
    patient: 'Ariana Santos',
    services: 'Orthodontic Review',
    dentist: 'Dr. Angela Lim',
    date: 'April 11, 2026',
    time: '1:00 PM',
    duration: '60 min',
    status: 'Approved',
  },
  {
    patient: 'Daniel Flores',
    services: 'Root Canal Follow-up',
    dentist: 'Dr. Marcus Rivera',
    date: 'April 10, 2026',
    time: '3:30 PM',
    duration: '45 min',
    status: 'Completed',
  },
  {
    patient: 'Jasmine Torres',
    services: 'Consultation',
    dentist: 'Dr. Angela Lim',
    date: 'April 10, 2026',
    time: '4:00 PM',
    duration: '30 min',
    status: 'Cancelled',
  },
  {
    patient: 'Paolo Mendoza',
    services: 'Crown Fitting',
    dentist: 'Dr. Marcus Rivera',
    date: 'April 12, 2026',
    time: '10:00 AM',
    duration: '90 min',
    status: 'Rescheduled',
  },
];

export const STAFF_PATIENTS: PatientRecord[] = [
  {
    name: 'Isabella Cruz',
    contact: '+63 917 555 0182',
    email: 'isabella.cruz@email.com',
    lastVisit: 'April 03, 2026',
    nextAppointment: 'April 11, 2026',
    status: 'Active',
  },
  {
    name: 'Miguel Reyes',
    contact: '+63 917 555 0214',
    email: 'miguel.reyes@email.com',
    lastVisit: 'April 01, 2026',
    nextAppointment: 'April 11, 2026',
    status: 'Active',
  },
  {
    name: 'Camille Navarro',
    contact: '+63 917 555 0370',
    email: 'camille.navarro@email.com',
    lastVisit: 'March 28, 2026',
    nextAppointment: 'April 14, 2026',
    status: 'Active',
  },
  {
    name: 'Liam Mendoza',
    contact: '+63 917 555 0446',
    email: 'liam.mendoza@email.com',
    lastVisit: 'January 19, 2026',
    nextAppointment: 'No booking',
    status: 'Inactive',
  },
];

export const STAFF_CALENDAR_SLOTS: CalendarSlot[] = [
  { day: 'Mon', time: '9:00 AM', patient: 'Isabella Cruz', status: 'Booked' },
  { day: 'Mon', time: '11:00 AM', patient: 'Review queue', status: 'Available' },
  { day: 'Tue', time: '2:00 PM', patient: 'Noah Villanueva', status: 'Booked' },
  { day: 'Wed', time: '8:30 AM', patient: 'Chair maintenance', status: 'Blocked' },
  { day: 'Thu', time: '1:30 PM', patient: 'Overflow queue', status: 'Fully Booked' },
  { day: 'Fri', time: '4:00 PM', patient: 'Camille Navarro', status: 'Available' },
];

export const STAFF_WEEK_DAYS: Array<WeeklyCalendarEvent['day']> = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

export const STAFF_TIME_LABELS = [
  '8:00 AM',
  '8:30 AM',
  '9:00 AM',
  '9:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '12:00 PM',
  '12:30 PM',
  '1:00 PM',
  '1:30 PM',
  '2:00 PM',
  '2:30 PM',
  '3:00 PM',
  '3:30 PM',
  '4:00 PM',
  '4:30 PM',
  '5:00 PM',
];

export const STAFF_WEEKLY_EVENTS: WeeklyCalendarEvent[] = [
  {
    day: 'Mon',
    startTime: '9:00 AM',
    endTime: '10:00 AM',
    patient: 'Isabella Cruz',
    service: 'Dental Cleaning',
    dentist: 'Dr. Angela Lim',
    status: 'Booked',
    chair: 'Chair A1',
  },
  {
    day: 'Mon',
    startTime: '11:00 AM',
    endTime: '12:00 PM',
    patient: 'Open review block',
    service: 'Flexible approval slot',
    dentist: 'Staff-controlled',
    status: 'Available',
    chair: 'Chair A2',
  },
  {
    day: 'Tue',
    startTime: '2:00 PM',
    endTime: '3:30 PM',
    patient: 'Noah Villanueva',
    service: 'Deep Cleaning',
    dentist: 'Dr. Marcus Rivera',
    status: 'Booked',
    chair: 'Chair B1',
  },
  {
    day: 'Wed',
    startTime: '8:30 AM',
    endTime: '10:00 AM',
    patient: 'Chair maintenance',
    service: 'Sterilization and equipment check',
    dentist: 'Operations team',
    status: 'Blocked',
    chair: 'Chair C1',
  },
  {
    day: 'Thu',
    startTime: '1:30 PM',
    endTime: '4:00 PM',
    patient: 'Overflow queue',
    service: 'Walk-in demand buffer',
    dentist: 'Multi-chair support',
    status: 'Fully Booked',
    chair: 'Chair B2',
  },
  {
    day: 'Fri',
    startTime: '4:00 PM',
    endTime: '5:00 PM',
    patient: 'Camille Navarro',
    service: 'Braces Adjustment',
    dentist: 'Dr. Angela Lim',
    status: 'Available',
    chair: 'Chair A1',
  },
  {
    day: 'Fri',
    startTime: '1:00 PM',
    endTime: '2:00 PM',
    patient: 'Ariana Santos',
    service: 'Orthodontic Review',
    dentist: 'Dr. Angela Lim',
    status: 'Booked',
    chair: 'Chair A3',
  },
];

export const STAFF_NOTIFICATIONS: NotificationItem[] = [
  {
    title: 'New booking request',
    detail: 'Three fresh requests entered the queue in the last thirty minutes.',
    level: 'New',
    time: 'Now',
  },
  {
    title: 'Cancellation submitted',
    detail: 'One patient cancelled an afternoon consultation and freed a chair slot.',
    level: 'Update',
    time: '9 minutes ago',
  },
  {
    title: 'Slot conflict warning',
    detail: 'A preferred slot overlaps with a sterilization turnaround window.',
    level: 'Warning',
    time: '12 minutes ago',
  },
  {
    title: 'Reschedule needed',
    detail: 'One afternoon case needs reassignment because of dentist travel delay.',
    level: 'Warning',
    time: '24 minutes ago',
  },
  {
    title: 'Dentist availability update',
    detail: 'Dr. Angela Lim opened an extra review block for Friday afternoon.',
    level: 'Update',
    time: '48 minutes ago',
  },
];
