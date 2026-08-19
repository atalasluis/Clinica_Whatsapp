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

export interface AnalyticsOverview {
  totalClients: number;
  totalConversations: number;
  totalMessages: number;
  totalLeads: number;
  totalAppointments: number;
  conversionRate: number;
}

export interface TotalMessagesReceived {
  totalMessagesReceived: number;
}

export interface MessagesAutoAttended {
  messagesAutoAttended: number;
}

export interface ConversationsPending {
  conversationsPending: number;
}

export interface AvgResponseTime {
  avgResponseTime: number;
}

export interface MessagesPerDay {
  date: string;
  count: number;
}

export interface LeadsBySource {
  source: string;
  count: number;
}

export interface AppointmentConversionRate {
  total: number;
  converted: number;
  rate: number;
}

export interface EscalatedConversations {
  escalatedConversations: number;
}

export interface TodaySummary {
  messagesToday: number;
  conversationsToday: number;
  appointmentsToday: number;
}

export interface EscalatedConversation {
  id: string;
  clientId: string;
  externalId: string | null;
  status: string;
  startedAt: string;
  closedAt: string | null;
  clients: Client;
  messages: Message[];
  leads: Lead[];
}

export interface EscalationStats {
  totalEscalated: number;
  currentlyPending: number;
  resolved: number;
}

export interface FollowUpLead {
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
  daysSinceCreated: number;
  daysSinceUpdated: number;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
}

export interface FollowUpStats {
  newLeads: number;
  qualified: number;
  contacted: number;
  appointmentBooked: number;
  closed: number;
  lost: number;
  total: number;
  conversionRate: number;
}

export interface Alert {
  id: string;
  type: string;
  severity: string;
  title: string;
  description: string;
  createdAt: string;
}

export interface AlertCount {
  total: number;
  critical: number;
  warnings: number;
  info: number;
}

export interface DailyReport {
  date: string;
  messages: { total: number; fromClients: number; fromBot: number };
  conversations: { new: number; closed: number };
  leads: { new: number };
  appointments: { total: number; completed: number };
}

export interface WeeklyReport {
  period: string;
  messages: { total: number; fromClients: number; fromBot: number };
  conversations: { new: number; closed: number };
  leads: { new: number };
  appointments: { total: number; completed: number; cancelled: number };
  conversionRate: number;
}

export interface SatisfactionSurvey {
  id: string;
  appointmentId: string;
  clientId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
}

export interface SurveyStats {
  totalSurveys: number;
  averageRating: number;
  distribution: Record<number, number>;
}
