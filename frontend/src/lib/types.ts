export interface Specialty {
  id: string;
  name: string;
  description: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  name: string;
  description: string | null;
  category: string;
  price: string | null;
  currency: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Professional {
  id: string;
  firstName: string;
  lastName: string | null;
  title: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  professional_specialties: ProfessionalSpecialty[];
  professional_services: ProfessionalService[];
  schedules: Schedule[];
}

export interface ProfessionalSpecialty {
  professionalId: string;
  specialtyId: string;
  specialties: Specialty;
}

export interface ProfessionalService {
  professionalId: string;
  serviceId: string;
  services: Service;
}

export interface Schedule {
  id: string;
  professionalId: string;
  specialtyId: string | null;
  serviceId: string | null;
  type: string;
  dayOfWeek: string | null;
  startTime: string | null;
  endTime: string | null;
  notes: string | null;
}

export interface Client {
  id: string;
  firstName: string | null;
  lastName: string | null;
  phone: string;
  email: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  id: string;
  clientId: string;
  externalId: string | null;
  status: string;
  startedAt: string;
  closedAt: string | null;
  clients: Client;
  messages?: Message[];
}

export interface Message {
  id: string;
  conversationId: string;
  sender: string;
  type: string;
  content: string | null;
  mediaUrl: string | null;
  metadata: unknown;
  createdAt: string;
}

export interface Lead {
  id: string;
  clientId: string;
  conversationId: string | null;
  specialtyId: string | null;
  serviceId: string | null;
  status: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  clients: Client;
  specialties: Specialty | null;
  services: Service | null;
}

export interface Appointment {
  id: string;
  clientId: string;
  professionalId: string;
  specialtyId: string | null;
  serviceId: string | null;
  scheduledAt: string;
  status: string;
  source: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  clients: Client;
  professionals: Professional | null;
  specialties: Specialty | null;
  services: Service | null;
}

export interface AnalyticsOverview {
  totalClients: number;
  totalConversations: number;
  totalMessages: number;
  totalLeads: number;
  totalAppointments: number;
  conversionRate: number;
}

export interface StatusCount {
  status: string;
  count: number;
}

export interface SpecialtyCount {
  specialty: string;
  count: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
