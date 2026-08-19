import { useEffect, useState } from "react";
import api from "../lib/api";
import type { DailyReport, WeeklyReport, ApiResponse } from "../lib/types";

export default function Reports() {
  const [tab, setTab] = useState<"daily" | "weekly">("daily");
  const [daily, setDaily] = useState<DailyReport | null>(null);
  const [weekly, setWeekly] = useState<WeeklyReport | null>(null);

  useEffect(() => {
    api.get<ApiResponse<DailyReport>>("/reports/daily").then((r) => setDaily(r.data.data));
    api.get<ApiResponse<WeeklyReport>>("/reports/weekly").then((r) => setWeekly(r.data.data));
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Reportes</h2>
          <p>Reportes diarios y semanales</p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <button
          className={`btn ${tab === "daily" ? "btn-primary" : ""}`}
          onClick={() => setTab("daily")}
        >
          Diario
        </button>
        <button
          className={`btn ${tab === "weekly" ? "btn-primary" : ""}`}
          onClick={() => setTab("weekly")}
        >
          Semanal
        </button>
      </div>

      {tab === "daily" && daily && (
        <div className="card">
          <h3 style={{ marginTop: 0, marginBottom: 16 }}>Reporte Diario — {daily.date}</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">
                <div className="stat-icon" style={{ background: "#dbeafe" }}>💬</div>
                Mensajes Totales
              </div>
              <div className="stat-value">{daily.messages.total}</div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>
                Clientes: {daily.messages.fromClients} | Bot: {daily.messages.fromBot}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">
                <div className="stat-icon" style={{ background: "#d1fae5" }}>📋</div>
                Conversaciones
              </div>
              <div className="stat-value">{daily.conversations.new}</div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>
                Nuevas: {daily.conversations.new} | Cerradas: {daily.conversations.closed}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">
                <div className="stat-icon" style={{ background: "#fef3c7" }}>🎯</div>
                Leads
              </div>
              <div className="stat-value">{daily.leads.new}</div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>Nuevos hoy</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">
                <div className="stat-icon" style={{ background: "#ede9fe" }}>📅</div>
                Citas
              </div>
              <div className="stat-value">{daily.appointments.total}</div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>
                Completadas: {daily.appointments.completed}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "daily" && !daily && (
        <div className="card">
          <div className="empty-state"><p>Cargando reporte diario...</p></div>
        </div>
      )}

      {tab === "weekly" && weekly && (
        <div className="card">
          <h3 style={{ marginTop: 0, marginBottom: 16 }}>Reporte Semanal — {weekly.period}</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">
                <div className="stat-icon" style={{ background: "#dbeafe" }}>💬</div>
                Mensajes Totales
              </div>
              <div className="stat-value">{weekly.messages.total}</div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>
                Clientes: {weekly.messages.fromClients} | Bot: {weekly.messages.fromBot}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">
                <div className="stat-icon" style={{ background: "#d1fae5" }}>📋</div>
                Conversaciones
              </div>
              <div className="stat-value">{weekly.conversations.new}</div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>
                Nuevas: {weekly.conversations.new} | Cerradas: {weekly.conversations.closed}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">
                <div className="stat-icon" style={{ background: "#fef3c7" }}>🎯</div>
                Leads
              </div>
              <div className="stat-value">{weekly.leads.new}</div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>Nuevos en la semana</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">
                <div className="stat-icon" style={{ background: "#ede9fe" }}>📅</div>
                Citas
              </div>
              <div className="stat-value">{weekly.appointments.total}</div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>
                Completadas: {weekly.appointments.completed} | Canceladas: {weekly.appointments.cancelled}
              </div>
            </div>
          </div>
          <div className="stat-card" style={{ marginTop: 16 }}>
            <div className="stat-label">
              <div className="stat-icon" style={{ background: "#d1fae5" }}>📈</div>
              Tasa de Conversión
            </div>
            <div className="stat-value">{weekly.conversionRate}%</div>
          </div>
        </div>
      )}

      {tab === "weekly" && !weekly && (
        <div className="card">
          <div className="empty-state"><p>Cargando reporte semanal...</p></div>
        </div>
      )}
    </div>
  );
}
