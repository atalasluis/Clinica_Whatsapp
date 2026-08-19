import { useEffect, useState } from "react";
import api from "../lib/api";
import type { Lead, ApiResponse } from "../lib/types";

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

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("es-BO", { day: "2-digit", month: "short", year: "numeric" });
}

function phoneName(c: Lead["clients"]) {
  return [c.firstName, c.lastName].filter(Boolean).join(" ") || c.phone;
}

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    api.get<ApiResponse<Lead[]>>("/leads").then((r) => setLeads(r.data.data));
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Leads</h2>
          <p>Personas interesadas en servicios del centro</p>
        </div>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Teléfono</th>
              <th>Especialidad</th>
              <th>Estado</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr><td colSpan={5}><div className="empty-state"><p>No hay leads registrados</p></div></td></tr>
            ) : (
              leads.map((l) => (
                <tr key={l.id}>
                  <td style={{ fontWeight: 500 }}>{phoneName(l.clients)}</td>
                  <td>{l.clients.phone}</td>
                  <td>{l.specialties?.name ?? "—"}</td>
                  <td><span className={`badge ${statusBadge[l.status] || ""}`}>{statusLabel[l.status] || l.status}</span></td>
                  <td>{formatDate(l.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
