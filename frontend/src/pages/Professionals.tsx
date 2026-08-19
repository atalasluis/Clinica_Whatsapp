import { useEffect, useState } from "react";
import api from "../lib/api";
import type { Professional, ApiResponse } from "../lib/types";

const dayLabels: Record<string, string> = {
  MONDAY: "Lunes",
  TUESDAY: "Martes",
  WEDNESDAY: "Miércoles",
  THURSDAY: "Jueves",
  FRIDAY: "Viernes",
  SATURDAY: "Sábado",
  SUNDAY: "Domingo",
};

const typeLabels: Record<string, string> = {
  FIXED: "Fijo",
  ON_CALL: "A llamado",
  TO_COORDINATE: "A coordinar",
  EMERGENCY: "Emergencia",
};

export default function Professionals() {
  const [professionals, setProfessionals] = useState<Professional[]>([]);

  useEffect(() => {
    api.get<ApiResponse<Professional[]>>("/professionals").then((r) => setProfessionals(r.data.data));
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Profesionales</h2>
          <p>Médicos y profesionales del centro</p>
        </div>
      </div>

      {professionals.length === 0 ? (
        <div className="card"><div className="card-body"><div className="empty-state"><p>No hay profesionales registrados</p></div></div></div>
      ) : (
        <div className="detail-grid">
          {professionals.map((p) => (
            <div className="card" key={p.id}>
              <div className="card-header">
                <h3>{[p.title, p.firstName, p.lastName].filter(Boolean).join(" ")}</h3>
              </div>
              <div className="card-body">
                {p.professional_specialties.length > 0 && (
                  <div className="detail-item" style={{ marginBottom: 12 }}>
                    <label>Especialidades</label>
                    <span>{p.professional_specialties.map((ps) => ps.specialties.name).join(", ")}</span>
                  </div>
                )}
                {p.schedules.length > 0 && (
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.3px", display: "block", marginBottom: 8 }}>Horarios</label>
                    {p.schedules.map((s) => (
                      <div className="schedule-item" key={s.id}>
                        {s.dayOfWeek && <span className="schedule-day">{dayLabels[s.dayOfWeek] || s.dayOfWeek}</span>}
                        {s.startTime && s.endTime && <span className="schedule-time">{s.startTime} - {s.endTime}</span>}
                        <span className="schedule-type">{typeLabels[s.type] || s.type}</span>
                      </div>
                    ))}
                  </div>
                )}
                {p.professional_specialties.length === 0 && p.schedules.length === 0 && (
                  <p style={{ fontSize: 13, color: "#94a3b8" }}>Sin especialidades ni horarios asignados</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
