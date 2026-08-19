import { useEffect, useState } from "react";
import api from "../lib/api";
import type { Conversation, ApiResponse } from "../lib/types";

const statusBadge: Record<string, string> = {
  OPEN: "badge-open",
  CLOSED: "badge-closed",
  HUMAN_ATTENTION: "badge-human",
};

const statusLabel: Record<string, string> = {
  OPEN: "Abierta",
  CLOSED: "Cerrada",
  HUMAN_ATTENTION: "Atención Humana",
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("es-BO", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function clientName(c: Conversation["clients"]) {
  return [c.firstName, c.lastName].filter(Boolean).join(" ") || c.phone;
}

export default function Conversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    api.get<ApiResponse<Conversation[]>>("/conversations").then((r) => setConversations(r.data.data));
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Conversaciones</h2>
          <p>Conversaciones vía WhatsApp con pacientes</p>
        </div>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Teléfono</th>
              <th>Estado</th>
              <th>Inicio</th>
              <th>Fin</th>
            </tr>
          </thead>
          <tbody>
            {conversations.length === 0 ? (
              <tr><td colSpan={5}><div className="empty-state"><p>No hay conversaciones registradas</p></div></td></tr>
            ) : (
              conversations.map((c) => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 500 }}>{clientName(c.clients)}</td>
                  <td>{c.clients.phone}</td>
                  <td><span className={`badge ${statusBadge[c.status] || ""}`}>{statusLabel[c.status] || c.status}</span></td>
                  <td>{formatDate(c.startedAt)}</td>
                  <td>{c.closedAt ? formatDate(c.closedAt) : "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
