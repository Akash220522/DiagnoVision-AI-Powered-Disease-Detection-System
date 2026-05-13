export type UserRole = 'patient' | 'doctor' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  photoURL?: string;
  createdAt: string;
  updatedAt?: string;
}

export type SeverityLevel = 'low' | 'moderate' | 'high' | 'critical';

export interface DiagnosisReport {
  id: string;
  patientId: string;
  diseaseType: string;
  prediction: string;
  confidence: number;
  severity: SeverityLevel;
  imageUrl: string;
  heatmapUrl?: string;
  analysis: string;
  recommendations: string[];
  explanation?: string;
  doctorId?: string;
  doctorNotes?: string;
  status: 'pending' | 'reviewed' | 'archived';
  createdAt: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  dateTime: string;
  type: 'online' | 'in-person';
  status: 'scheduled' | 'completed' | 'cancelled';
  reason?: string;
  createdAt: string;
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}
