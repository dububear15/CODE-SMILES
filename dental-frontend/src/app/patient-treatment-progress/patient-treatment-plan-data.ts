export type TreatmentStatus = 'active' | 'completed' | 'pending' | 'upcoming';
export type TreatmentIcon = 'orthodontics' | 'whitening' | 'filling' | 'retainer' | 'consultation';

export interface LinkedRecord {
  title: string;
  type: 'xray' | 'plan' | 'notes';
}

export interface TreatmentStep {
  order: number;
  title: string;
  date: string;
  dentist: string;
  note: string;
  status: string;
  statusClass: 'completed' | 'pending' | 'upcoming';
  stage: 'done' | 'current' | 'next';
  appointment?: {
    date: string;
    time: string;
    doctor: string;
  };
  linkedRecords?: LinkedRecord[];
}

export interface TreatmentPlan {
  id: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  status: string;
  statusClass: TreatmentStatus;
  progress: number;
  stepsCompleted: number;
  totalSteps: number;
  icon: TreatmentIcon;
  cardDescription: string;
  nextStepTitle: string;
  nextStepDate: string;
  nextStepTime: string;
  nextStepDoctor: string;
  nextStepDescription: string;
  steps: TreatmentStep[];
}

export const PATIENT_TREATMENT_PLANS: TreatmentPlan[] = [
  {
    id: 'orthodontics',
    title: 'Orthodontic Treatment',
    shortTitle: 'Orthodontics',
    subtitle: 'Braces & Alignment',
    status: 'Active',
    statusClass: 'active',
    progress: 60,
    stepsCompleted: 3,
    totalSteps: 5,
    icon: 'orthodontics',
    cardDescription: 'Braces & Alignment',
    nextStepTitle: 'Attend Upcoming Appointment',
    nextStepDate: 'Tue, Sep 10',
    nextStepTime: '10:00 AM',
    nextStepDoctor: 'Dr. Christine Faith Metillo',
    nextStepDescription: 'Adjustment session and progress review',
    steps: [
      {
        order: 1,
        title: 'Initial Consultation',
        date: 'Aug 12, 2024',
        dentist: 'Dr. Christine Faith Metillo',
        note: 'Notes: Exam, X-rays, and treatment plan created',
        status: 'Completed',
        statusClass: 'completed',
        stage: 'done',
      },
      {
        order: 2,
        title: 'Braces Installation',
        date: 'Aug 20, 2024',
        dentist: 'Dr. Christine Faith Metillo',
        note: 'Notes: Braces placed successfully',
        status: 'Completed',
        statusClass: 'completed',
        stage: 'done',
      },
      {
        order: 3,
        title: 'Adjustment Session',
        date: 'Tue, Sep 10, 2024',
        dentist: 'Dr. Christine Faith Metillo',
        note: 'Notes: Tightening and progress check',
        status: 'Pending Approval',
        statusClass: 'pending',
        stage: 'current',
        appointment: {
          date: 'Tue, Sep 10, 2024',
          time: '10:00 AM',
          doctor: 'Dr. Christine Faith Metillo',
        },
        linkedRecords: [
          { title: 'Panoramic X-Ray - 2024', type: 'xray' },
          { title: 'Treatment Plan - Orthodontics', type: 'plan' },
          { title: 'Post-Op Instructions', type: 'notes' },
        ],
      },
      {
        order: 4,
        title: 'Refinement & Alignment',
        date: 'Projected Oct 2024',
        dentist: 'Dr. Christine Faith Metillo',
        note: 'Expected after the next adjustment cycle is approved',
        status: 'Upcoming',
        statusClass: 'upcoming',
        stage: 'next',
      },
      {
        order: 5,
        title: 'Final Review & Retainer',
        date: 'Projected Mar 2025',
        dentist: 'Dr. Christine Faith Metillo',
        note: 'Final evaluation and retainer fitting',
        status: 'Upcoming',
        statusClass: 'upcoming',
        stage: 'next',
      },
    ],
  },
  {
    id: 'whitening',
    title: 'Teeth Whitening',
    shortTitle: 'Teeth Whitening',
    subtitle: 'Smile Brightening Program',
    status: 'Completed',
    statusClass: 'completed',
    progress: 100,
    stepsCompleted: 3,
    totalSteps: 3,
    icon: 'whitening',
    cardDescription: 'Completed Aug 5',
    nextStepTitle: 'Maintain Whitening Results',
    nextStepDate: 'Daily',
    nextStepTime: 'Morning & Night',
    nextStepDoctor: 'Dr. Raphoncel Eduria',
    nextStepDescription: 'Maintain your results with whitening-safe products',
    steps: [
      {
        order: 1,
        title: 'Whitening Consultation',
        date: 'Jul 18, 2024',
        dentist: 'Dr. Raphoncel Eduria',
        note: 'Notes: Shade assessment and care instructions reviewed',
        status: 'Completed',
        statusClass: 'completed',
        stage: 'done',
      },
      {
        order: 2,
        title: 'Whitening Session',
        date: 'Jul 25, 2024',
        dentist: 'Dr. Raphoncel Eduria',
        note: 'Notes: In-clinic whitening completed successfully',
        status: 'Completed',
        statusClass: 'completed',
        stage: 'done',
        linkedRecords: [
          { title: 'Treatment Plan - Whitening', type: 'plan' },
          { title: 'Whitening Instructions', type: 'notes' },
        ],
      },
      {
        order: 3,
        title: 'Result Review',
        date: 'Aug 05, 2024',
        dentist: 'Dr. Raphoncel Eduria',
        note: 'Notes: Shade improvement confirmed and maintenance advice shared',
        status: 'Completed',
        statusClass: 'completed',
        stage: 'done',
      },
    ],
  },
  {
    id: 'filling',
    title: 'Tooth Filling #14',
    shortTitle: 'Tooth Filling #14',
    subtitle: 'Restoration Workflow',
    status: 'Pending Approval',
    statusClass: 'pending',
    progress: 25,
    stepsCompleted: 1,
    totalSteps: 4,
    icon: 'filling',
    cardDescription: 'Waiting for Approval',
    nextStepTitle: 'Wait for Clinic Approval',
    nextStepDate: 'Pending scheduling',
    nextStepTime: 'TBD',
    nextStepDoctor: 'Dr. Derence Acojedo',
    nextStepDescription: 'The clinic is reviewing your submitted request',
    steps: [
      {
        order: 1,
        title: 'Initial Assessment',
        date: 'Sep 01, 2024',
        dentist: 'Dr. Derence Acojedo',
        note: 'Notes: Cavity depth reviewed and restoration recommended',
        status: 'Completed',
        statusClass: 'completed',
        stage: 'done',
        linkedRecords: [
          { title: 'Panoramic X-Ray - 2024', type: 'xray' },
          { title: 'Treatment Request - Filling', type: 'plan' },
        ],
      },
      {
        order: 2,
        title: 'Clinic Approval',
        date: 'Pending',
        dentist: 'Clinic Review Team',
        note: 'Notes: Waiting for materials and availability confirmation',
        status: 'Pending Approval',
        statusClass: 'pending',
        stage: 'current',
        linkedRecords: [
          { title: 'Composite Filling Notes', type: 'notes' },
          { title: 'Treatment Request - Filling', type: 'plan' },
        ],
      },
      {
        order: 3,
        title: 'Procedure Appointment',
        date: 'To be scheduled',
        dentist: 'Dr. Derence Acojedo',
        note: 'The appointment will appear once approval is complete',
        status: 'Upcoming',
        statusClass: 'upcoming',
        stage: 'next',
      },
      {
        order: 4,
        title: 'Recovery Check',
        date: 'After restoration',
        dentist: 'Dr. Derence Acojedo',
        note: 'Follow-up evaluation after the filling is completed',
        status: 'Upcoming',
        statusClass: 'upcoming',
        stage: 'next',
      },
    ],
  },
  {
    id: 'retainer',
    title: 'Retainer Plan',
    shortTitle: 'Retainer Plan',
    subtitle: 'Starts After Braces',
    status: 'Upcoming',
    statusClass: 'upcoming',
    progress: 0,
    stepsCompleted: 0,
    totalSteps: 3,
    icon: 'retainer',
    cardDescription: 'Starts After Braces',
    nextStepTitle: 'Complete Current Orthodontic Phase',
    nextStepDate: 'Not started',
    nextStepTime: 'After braces removal',
    nextStepDoctor: 'Dr. Christine Faith Metillo',
    nextStepDescription: 'Retainer fitting begins after active braces treatment',
    steps: [
      {
        order: 1,
        title: 'Braces Removal Clearance',
        date: 'Pending orthodontic completion',
        dentist: 'Dr. Christine Faith Metillo',
        note: 'Clearance is needed before retainer impressions can begin',
        status: 'Upcoming',
        statusClass: 'upcoming',
        stage: 'next',
      },
      {
        order: 2,
        title: 'Retainer Impression',
        date: 'Upcoming',
        dentist: 'Dr. Christine Faith Metillo',
        note: 'Digital impression and retainer fitting plan',
        status: 'Upcoming',
        statusClass: 'upcoming',
        stage: 'next',
      },
      {
        order: 3,
        title: 'Retainer Delivery',
        date: 'Upcoming',
        dentist: 'Dr. Christine Faith Metillo',
        note: 'Wear schedule and maintenance instructions will be reviewed',
        status: 'Upcoming',
        statusClass: 'upcoming',
        stage: 'next',
      },
    ],
  },
  {
    id: 'consultation',
    title: 'Wisdom Tooth Consultation',
    shortTitle: 'Wisdom Tooth Consultation',
    subtitle: 'Not Scheduled',
    status: 'Upcoming',
    statusClass: 'upcoming',
    progress: 0,
    stepsCompleted: 0,
    totalSteps: 2,
    icon: 'consultation',
    cardDescription: 'Not Scheduled',
    nextStepTitle: 'Schedule Consultation',
    nextStepDate: 'Choose an appointment',
    nextStepTime: 'TBD',
    nextStepDoctor: 'Oral Surgery Team',
    nextStepDescription: 'Book a consultation to review symptoms and imaging needs',
    steps: [
      {
        order: 1,
        title: 'Initial Consultation',
        date: 'Awaiting appointment',
        dentist: 'Oral Surgery Team',
        note: 'Consultation will assess pain, position, and treatment options',
        status: 'Upcoming',
        statusClass: 'upcoming',
        stage: 'next',
      },
      {
        order: 2,
        title: 'Treatment Recommendation',
        date: 'After consultation',
        dentist: 'Oral Surgery Team',
        note: 'The clinic will share next steps after the exam',
        status: 'Upcoming',
        statusClass: 'upcoming',
        stage: 'next',
      },
    ],
  },
];
