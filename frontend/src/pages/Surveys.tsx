import { useEffect, useState } from "react";
import api from "../lib/api";
import type { SurveyStats, ApiResponse } from "../lib/types";

export default function Surveys() {
  const [stats, setStats] = useState<SurveyStats | null>(null);
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [form, setForm] = useState({ appointmentId: "", clientId: "", comment: "" });
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    api.get<ApiResponse<SurveyStats>>("/surveys/stats").then((r) => setStats(r.data.data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.appointmentId || !form.clientId || rating === 0) return;
    setSubmitting(true);
    try {
      await api.post("/surveys", {
        appointmentId: form.appointmentId,
        clientId: form.clientId,
        rating,
        comment: form.comment || undefined,
      });
      setSuccessMsg("Encuesta enviada correctamente");
      setForm({ appointmentId: "", clientId: "", comment: "" });
      setRating(0);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch {
      // silently handle
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (count: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <span key={i}>{i < count ? "★" : "☆"}</span>
    ));

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Encuestas de Satisfacción</h2>
          <p>Feedback de pacientes</p>
        </div>
      </div>

      <div className="stats-grid" style={{ marginBottom: 20 }}>
        <div className="stat-card">
          <div className="stat-label">
            <div className="stat-icon" style={{ background: "#dbeafe" }}>📊</div>
            Total Encuestas
          </div>
          <div className="stat-value">{stats?.totalSurveys ?? 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">
            <div className="stat-icon" style={{ background: "#fef3c7" }}>⭐</div>
            Rating Promedio
          </div>
          <div className="stat-value">
            {stats && stats.averageRating > 0 ? stats.averageRating.toFixed(1) : "—"}
          </div>
          <div style={{ fontSize: 14, color: "#d97706" }}>
            {stats && stats.averageRating > 0 ? renderStars(Math.round(stats.averageRating)) : "☆☆☆☆☆"}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">
            <div className="stat-icon" style={{ background: "#d1fae5" }}>📈</div>
            Distribución
          </div>
          <div className="stat-value">—</div>
          <div style={{ fontSize: 12, color: "#6b7280" }}>
            {stats
              ? Object.entries(stats.distribution)
                  .map(([k, v]) => `${k}★: ${v}`)
                  .join(" | ")
              : "Sin datos"}
          </div>
        </div>
      </div>

      {stats && stats.totalSurveys === 0 && (
        <div className="card">
          <div className="empty-state">
            <p>No hay encuestas registradas aún. Usa el formulario para enviar una.</p>
          </div>
        </div>
      )}

      <div className="card">
        <h3 style={{ marginTop: 0, marginBottom: 16 }}>Enviar Encuesta</h3>
        {successMsg && (
          <div style={{ padding: "10px 16px", background: "#d1fae5", borderRadius: 8, marginBottom: 16, color: "#065f46", fontSize: 14 }}>
            {successMsg}
          </div>
        )}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 500 }}>
          <div>
            <label style={{ display: "block", marginBottom: 4, fontSize: 14, fontWeight: 500 }}>ID de Cita</label>
            <input
              type="text"
              className="input"
              placeholder="appointmentId"
              value={form.appointmentId}
              onChange={(e) => setForm({ ...form, appointmentId: e.target.value })}
              required
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: 4, fontSize: 14, fontWeight: 500 }}>ID de Cliente</label>
            <input
              type="text"
              className="input"
              placeholder="clientId"
              value={form.clientId}
              onChange={(e) => setForm({ ...form, clientId: e.target.value })}
              required
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 500 }}>Calificación</label>
            <div style={{ fontSize: 28, cursor: "pointer" }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  style={{ color: star <= (hoveredStar || rating) ? "#d97706" : "#d1d5db" }}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
          <div>
            <label style={{ display: "block", marginBottom: 4, fontSize: 14, fontWeight: 500 }}>Comentario (opcional)</label>
            <textarea
              className="input"
              placeholder="Comentarios adicionales..."
              rows={3}
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={submitting || rating === 0} style={{ alignSelf: "flex-start" }}>
            {submitting ? "Enviando..." : "Enviar Encuesta"}
          </button>
        </form>
      </div>
    </div>
  );
}
