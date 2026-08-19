import { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import api from "../lib/api";
import type {
  AnalyticsOverview,
  StatusCount,
  SpecialtyCount,
  ApiResponse,
} from "../lib/types";

const statusColors: Record<string, string> = {
  NEW: "#2563eb",
  QUALIFIED: "#7c3aed",
  CONTACTED: "#d97706",
  APPOINTMENT_BOOKED: "#059669",
  CLOSED: "#64748b",
  LOST: "#dc2626",
  PENDING: "#d97706",
  CONFIRMED: "#059669",
  COMPLETED: "#64748b",
  CANCELLED: "#dc2626",
  NO_SHOW: "#dc2626",
};

const statusLabels: Record<string, string> = {
  NEW: "Nuevo",
  QUALIFIED: "Calificado",
  CONTACTED: "Contactado",
  APPOINTMENT_BOOKED: "Cita Agendada",
  CLOSED: "Cerrado",
  LOST: "Perdido",
  PENDING: "Pendiente",
  CONFIRMED: "Confirmada",
  COMPLETED: "Completada",
  CANCELLED: "Cancelada",
  NO_SHOW: "No Asistió",
};

export default function Dashboard() {
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [leadsByStatus, setLeadsByStatus] = useState<StatusCount[]>([]);
  const [apptsByStatus, setApptsByStatus] = useState<StatusCount[]>([]);
  const [topSpecs, setTopSpecs] = useState<SpecialtyCount[]>([]);

  useEffect(() => {
    api.get<ApiResponse<AnalyticsOverview>>("/analytics/overview").then((r) => setOverview(r.data.data));
    api.get<ApiResponse<StatusCount[]>>("/analytics/leads-by-status").then((r) => setLeadsByStatus(r.data.data));
    api.get<ApiResponse<StatusCount[]>>("/analytics/appointments-by-status").then((r) => setApptsByStatus(r.data.data));
    api.get<ApiResponse<SpecialtyCount[]>>("/analytics/top-specialties").then((r) => setTopSpecs(r.data.data));
  }, []);

  const leadsPieOption = {
    tooltip: { trigger: "item" },
    series: [
      {
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 6, borderColor: "#fff", borderWidth: 2 },
        label: { show: false },
        emphasis: { label: { show: true, fontSize: 14, fontWeight: "bold" } },
        data: leadsByStatus
          .filter((s) => s.count > 0)
          .map((s) => ({
            value: s.count,
            name: statusLabels[s.status] || s.status,
            itemStyle: { color: statusColors[s.status] || "#94a3b8" },
          })),
      },
    ],
  };

  const apptsBarOption = {
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "category",
      data: apptsByStatus.map((s) => statusLabels[s.status] || s.status),
      axisLabel: { fontSize: 11, rotate: 30 },
    },
    yAxis: { type: "value", minInterval: 1 },
    series: [
      {
        type: "bar",
        data: apptsByStatus.map((s) => ({
          value: s.count,
          itemStyle: { color: statusColors[s.status] || "#94a3b8", borderRadius: [4, 4, 0, 0] },
        })),
        barWidth: "50%",
      },
    ],
    grid: { left: 40, right: 16, bottom: 60, top: 16 },
  };

  const specsBarOption = {
    tooltip: { trigger: "axis" },
    xAxis: { type: "value", minInterval: 1 },
    yAxis: {
      type: "category",
      data: topSpecs.map((s) => s.specialty),
      inverse: true,
      axisLabel: { fontSize: 11, width: 120, overflow: "truncate" },
    },
    series: [
      {
        type: "bar",
        data: topSpecs.map((s) => ({
          value: s.count,
          itemStyle: { color: "#0891b2", borderRadius: [0, 4, 4, 0] },
        })),
        barWidth: "60%",
      },
    ],
    grid: { left: 130, right: 24, bottom: 16, top: 16 },
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Dashboard</h2>
          <p>Vista general del sistema</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">
            <div className="stat-icon" style={{ background: "#dbeafe" }}>👥</div>
            Clientes
          </div>
          <div className="stat-value">{overview?.totalClients ?? "—"}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">
            <div className="stat-icon" style={{ background: "#fef3c7" }}>📋</div>
            Leads
          </div>
          <div className="stat-value">{overview?.totalLeads ?? "—"}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">
            <div className="stat-icon" style={{ background: "#d1fae5" }}>📅</div>
            Citas
          </div>
          <div className="stat-value">{overview?.totalAppointments ?? "—"}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">
            <div className="stat-icon" style={{ background: "#ede9fe" }}>💬</div>
            Conversaciones
          </div>
          <div className="stat-value">{overview?.totalConversations ?? "—"}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">
            <div className="stat-icon" style={{ background: "#cffafe" }}>✉️</div>
            Mensajes
          </div>
          <div className="stat-value">{overview?.totalMessages ?? "—"}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">
            <div className="stat-icon" style={{ background: "#d1fae5" }}>📈</div>
            Conversión
          </div>
          <div className="stat-value">{overview?.conversionRate ?? 0}%</div>
          <div className="stat-sub">leads → citas confirmadas</div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <div className="card-header"><h3>Leads por Estado</h3></div>
          <div className="chart-body">
            {leadsByStatus.some((s) => s.count > 0) ? (
              <ReactECharts option={leadsPieOption} style={{ height: 280 }} />
            ) : (
              <div className="empty-state"><p>Sin datos aún</p></div>
            )}
          </div>
        </div>
        <div className="chart-card">
          <div className="card-header"><h3>Citas por Estado</h3></div>
          <div className="chart-body">
            {apptsByStatus.some((s) => s.count > 0) ? (
              <ReactECharts option={apptsBarOption} style={{ height: 280 }} />
            ) : (
              <div className="empty-state"><p>Sin datos aún</p></div>
            )}
          </div>
        </div>
        <div className="chart-card">
          <div className="card-header"><h3>Especialidades Más Solicitadas</h3></div>
          <div className="chart-body">
            {topSpecs.length > 0 ? (
              <ReactECharts option={specsBarOption} style={{ height: 280 }} />
            ) : (
              <div className="empty-state"><p>Sin datos aún</p></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
