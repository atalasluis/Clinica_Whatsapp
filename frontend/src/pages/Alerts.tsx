import { useEffect, useState } from "react";
import api from "../lib/api";
import type { Alert, AlertCount, ApiResponse } from "../lib/types";

const severityColor: Record<string, string> = {
  CRITICAL: "#dc2626",
  WARNING: "#d97706",
  INFO: "#2563eb",
};

const severityIcon: Record<string, string> = {
  CRITICAL: "🔴",
  WARNING: "🟠",
  INFO: "🔵",
};

function timeAgo(date: string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "hace un momento";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `hace ${hours}h`;
  const days = Math.floor(hours / 24);
  return `hace ${days}d`;
}

export default function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [counts, setCounts] = useState<AlertCount | null>(null);

  useEffect(() => {
    api.get<ApiResponse<Alert[]>>("/alerts").then((r) => setAlerts(r.data.data));
    api.get<ApiResponse<AlertCount>>("/alerts/count").then((r) => setCounts(r.data.data));
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Alertas del Sistema</h2>
          <p>Notificaciones y alertas automáticas</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">
            <div className="stat-icon" style={{ background: "#dbeafe" }}>🔔</div>
            Total
          </div>
          <div className="stat-value">{counts?.total ?? "—"}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">
            <div className="stat-icon" style={{ background: "#fee2e2" }}>🔴</div>
            Críticas
          </div>
          <div className="stat-value">{counts?.critical ?? "—"}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">
            <div className="stat-icon" style={{ background: "#fef3c7" }}>🟠</div>
            Advertencias
          </div>
          <div className="stat-value">{counts?.warnings ?? "—"}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">
            <div className="stat-icon" style={{ background: "#dbeafe" }}>🔵</div>
            Info
          </div>
          <div className="stat-value">{counts?.info ?? "—"}</div>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        {alerts.length === 0 ? (
          <div className="empty-state">
            <p>No hay alertas registradas</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {alerts.map((alert) => (
              <div
                key={alert.id}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  padding: "16px 20px",
                  borderBottom: "1px solid #e5e7eb",
                  borderLeft: `4px solid ${severityColor[alert.severity] || "#6b7280"}`,
                }}
              >
                <span style={{ fontSize: 20, marginTop: 2 }}>
                  {severityIcon[alert.severity] || "⚪"}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontWeight: 600 }}>{alert.title}</span>
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: 12,
                        fontSize: 12,
                        fontWeight: 600,
                        background: alert.severity === "CRITICAL" ? "#fee2e2" : alert.severity === "WARNING" ? "#fef3c7" : "#dbeafe",
                        color: alert.severity === "CRITICAL" ? "#dc2626" : alert.severity === "WARNING" ? "#d97706" : "#2563eb",
                      }}
                    >
                      {alert.severity}
                    </span>
                    <span style={{ fontSize: 12, color: "#9ca3af" }}>{alert.type}</span>
                  </div>
                  <p style={{ margin: 0, color: "#6b7280", fontSize: 14 }}>{alert.description}</p>
                </div>
                <span style={{ fontSize: 12, color: "#9ca3af", whiteSpace: "nowrap" }}>
                  {timeAgo(alert.createdAt)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
