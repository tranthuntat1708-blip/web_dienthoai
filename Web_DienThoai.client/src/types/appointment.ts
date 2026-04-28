// src/types/appointment.ts

export type ConsultingNeed = 'NewDesign' | 'Renovation' | 'RetailPurchase';
export type AppointmentStatus = 'New' | 'Confirmed' | 'Completed' | 'Cancelled';

export interface CreateAppointmentPayload {
  fullName: string;
  phone: string;
  email: string;
  need: ConsultingNeed;
  appointmentDate: string;   // ISO date string
  appointmentTime: string;   // "HH:mm"
  attachmentBase64?: string;
  attachmentFileName?: string;
}

export interface AppointmentDto {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  need: ConsultingNeed;
  appointmentDate: string;
  appointmentTime: string;
  attachmentUrl?: string;
  status: AppointmentStatus;
  depositAmount?: number;
  isDepositPaid: boolean;
  createdAt: string;
}
