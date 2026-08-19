import { useEffect, useState } from "react";
import api from "../lib/api";
import type { EscalatedConversation, EscalationStats, ApiResponse } from "../lib/types";

const statusBadge: Record<string, string> = {
  OPEN: "badge-open",
  HUMAN_ATTENTION: "badge-human",
  CLOSED: "badge-closed",
};

const statusLabel: Record<string, string> = {
  OPEN: "Abierta",
  HUMAN_ATTENTION: "Atención Humana",
  CLOSED: "Cerrada",
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("es-BO", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function clientName(c: EscalatedConversation["clients"]) {
  return [c.firstName, c.lastName].filter(Boolean).join(" ") || c.phone;
}

export default function Escalations() {
  const [escalations, setEscalations] = useState<EscalatedConversation[]>([]);
  const [stats, setStats] = useState<EscalationStats | null>(null);

  const fetchData = () => {
    api.get<ApiResponse<EscalatedConversation[]>>("/escalations").then((r) => setEscalations(r.data.data));
    api.get<ApiResponse<EscalationStats>>("/escalations/stats").then((r) => setStats(r.data.data));
  };

  useEffect(() => { fetchData(); }, []);

  const handleResolve = (conversationId: string) => {
    api.post<ApiResponse<unknown>>("/escalations/resolve", { conversationId }).then(() => fetchData());
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Escalamientos</h2>
          <p>Conversaciones que requieren atención humana</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">
            <div className="stat-icon" style={{ background: "#dbeafe" }}>🔀</div>
            Total Escalados
          </div>
          <div className="stat-value">{stats?.totalEscalated ?? "—"}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">
            <div className="stat-icon" style={{ background: "#fef3c7" }}>⏳</div>
            Pendientes
          </div>
          <div className="stat-value">{stats?.currentlyPending ?? "—"}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">
            <div className="stat-icon" style={{ background: "#d1fae5" }}>✅</div>
            Resueltos
          </div>
          <div className="stat-value">{stats?.resolved ?? "—"}</div>
        </div>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Teléfono</th>
              <th>Estado</th>
              <th>Fecha Inicio</th>
              <th>Último Mensaje</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {escalations.length === 0 ? (
              <tr><td colSpan={6}><div className="empty-state"><p>No hay escalamientos registrados</p></div></td></tr>
            ) : (
              escalations.map((e) => (
                <tr key={e.id}>
                  <td style={{ fontWeight: 500 }}>{clientName(e.clients)}</td>
                  <td>{e.clients.phone}</td>
                  <td><span className={`badge ${statusBadge[e.status] || ""}`}>{statusLabel[e.status] || e.status}</span></td>
                  <td>{formatDate(e.startedAt)}</td>
                  <td>{e.messages.length > 0 ? formatDate(e.messages[e.messages.length - 1].createdAt) : "—"}</td>
                  <td>
                    {e.status !== "CLOSED" && (
                      <button className="btn btn-success" onClick={() => handleResolve(e.id)}>Resolver</button>
                    )}
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
