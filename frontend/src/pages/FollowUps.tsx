import { useEffect, useState } from "react";
import api from "../lib/api";
import type { FollowUpLead, FollowUpStats, ApiResponse } from "../lib/types";

const statusBadge: Record<string, string> = {
  NEW: "badge-new",
  QUALIFIED: "badge-qualified",
  CONTACTED: "badge-contacted",
  APPOINTMENT_BOOKED: "badge-booked",
  CLOSED: "badge-closed",
  LOST: "badge-lost",
};

const statusLabel: Record<string, string> = {
  NEW: "Nuevo",
  QUALIFIED: "Calificado",
  CONTACTED: "Contactado",
  APPOINTMENT_BOOKED: "Cita Agendada",
  CLOSED: "Cerrado",
  LOST: "Perdido",
};

const priorityLabel: Record<string, string> = {
  LOW: "Baja",
  MEDIUM: "Media",
  HIGH: "Alta",
  URGENT: "Urgente",
};

const priorityColor: Record<string, string> = {
  LOW: "#059669",
  MEDIUM: "#d97706",
  HIGH: "#ea580c",
  URGENT: "#dc2626",
};

function clientName(c: FollowUpLead["clients"]) {
  return [c.firstName, c.lastName].filter(Boolean).join(" ") || c.phone;
}

export default function FollowUps() {
  const [leads, setLeads] = useState<FollowUpLead[]>([]);
  const [stats, setStats] = useState<FollowUpStats | null>(null);

  const fetchData = () => {
    api.get<ApiResponse<FollowUpLead[]>>("/follow-ups").then((r) => setLeads(r.data.data));
    api.get<ApiResponse<FollowUpStats>>("/follow-ups/stats").then((r) => setStats(r.data.data));
  };

  useEffect(() => { fetchData(); }, []);

  const handleMark = (leadId: string) => {
    api.post<ApiResponse<unknown>>("/follow-ups/mark", { leadId, notes: "Seguimiento registrado" }).then(() => fetchData());
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Seguimiento de Leads</h2>
          <p>Leads que requieren seguimiento</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">
            <div className="stat-icon" style={{ background: "#dbeafe" }}>📋</div>
            Total Leads
          </div>
          <div className="stat-value">{stats?.total ?? "—"}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">
            <div className="stat-icon" style={{ background: "#d1fae5" }}>🆕</div>
            Nuevos
          </div>
          <div className="stat-value">{stats?.newLeads ?? "—"}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">
            <div className="stat-icon" style={{ background: "#fef3c7" }}>📞</div>
            Contactados
          </div>
          <div className="stat-value">{stats?.contacted ?? "—"}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">
            <div className="stat-icon" style={{ background: "#ede9fe" }}>📈</div>
            Tasa Conversión
          </div>
          <div className="stat-value">{stats?.conversionRate ?? 0}%</div>
        </div>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Especialidad</th>
              <th>Estado</th>
              <th>Días sin Contacto</th>
              <th>Prioridad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr><td colSpan={6}><div className="empty-state"><p>No hay leads que requieran seguimiento</p></div></td></tr>
            ) : (
              leads.map((l) => (
                <tr key={l.id}>
                  <td style={{ fontWeight: 500 }}>{clientName(l.clients)}</td>
                  <td>{l.specialties?.name ?? "—"}</td>
                  <td><span className={`badge ${statusBadge[l.status] || ""}`}>{statusLabel[l.status] || l.status}</span></td>
                  <td>{l.daysSinceUpdated} días</td>
                  <td><span className="badge" style={{ background: `${priorityColor[l.priority]}20`, color: priorityColor[l.priority] }}>{priorityLabel[l.priority]}</span></td>
                  <td>
                    <button className="btn btn-primary" onClick={() => handleMark(l.id)}>Marcar Seguimiento</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
