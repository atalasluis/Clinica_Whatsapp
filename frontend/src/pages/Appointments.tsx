import { useEffect, useState } from "react";
import api from "../lib/api";
import type { Appointment, ApiResponse } from "../lib/types";

const statusBadge: Record<string, string> = {
  PENDING: "badge-pending",
  CONFIRMED: "badge-confirmed",
  COMPLETED: "badge-completed",
  CANCELLED: "badge-cancelled",
  NO_SHOW: "badge-no-show",
};

const statusLabel: Record<string, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmada",
  COMPLETED: "Completada",
  CANCELLED: "Cancelada",
  NO_SHOW: "No Asistió",
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("es-BO", { day: "2-digit", month: "short", year: "numeric" });
}

function formatTime(d: string) {
  return new Date(d).toLocaleTimeString("es-BO", { hour: "2-digit", minute: "2-digit" });
}

function clientName(c: Appointment["clients"]) {
  return [c.firstName, c.lastName].filter(Boolean).join(" ") || c.phone;
}

function profName(p: Appointment["professionals"]) {
  if (!p) return "—";
  return [p.title, p.firstName, p.lastName].filter(Boolean).join(" ");
}

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    api.get<ApiResponse<Appointment[]>>("/appointments").then((r) => setAppointments(r.data.data));
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Citas</h2>
          <p>Gestión de citas del centro médico</p>
        </div>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Paciente</th>
              <th>Profesional</th>
              <th>Especialidad</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length === 0 ? (
              <tr><td colSpan={6}><div className="empty-state"><p>No hay citas registradas</p></div></td></tr>
            ) : (
              appointments.map((a) => (
                <tr key={a.id}>
                  <td style={{ fontWeight: 500 }}>{clientName(a.clients)}</td>
                  <td>{profName(a.professionals)}</td>
                  <td>{a.specialties?.name ?? "—"}</td>
                  <td>{formatDate(a.scheduledAt)}</td>
                  <td>{formatTime(a.scheduledAt)}</td>
                  <td><span className={`badge ${statusBadge[a.status] || ""}`}>{statusLabel[a.status] || a.status}</span></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
