import { useEffect, useState } from "react";
import api from "../lib/api";
import type { Specialty, ApiResponse } from "../lib/types";

export default function Specialties() {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);

  useEffect(() => {
    api.get<ApiResponse<Specialty[]>>("/specialties").then((r) => setSpecialties(r.data.data));
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Especialidades</h2>
          <p>Especialidades médicas del centro</p>
        </div>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {specialties.length === 0 ? (
              <tr><td colSpan={3}><div className="empty-state"><p>No hay especialidades registradas</p></div></td></tr>
            ) : (
              specialties.map((s) => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 500 }}>{s.name}</td>
                  <td>{s.description ?? "—"}</td>
                  <td>
                    <span className={`badge ${s.active ? "badge-confirmed" : "badge-cancelled"}`}>
                      {s.active ? "Activa" : "Inactiva"}
                    </span>
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
