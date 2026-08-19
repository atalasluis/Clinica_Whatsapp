import { useEffect, useState } from "react";
import api from "../lib/api";
import type { Service, ApiResponse } from "../lib/types";

const categoryLabel: Record<string, string> = {
  DIAGNOSTIC: "Diagnóstico",
  REHABILITATION: "Rehabilitación",
  COMPLEMENTARY: "Complementario",
  OTHER: "Otro",
};

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    api.get<ApiResponse<Service[]>>("/services").then((r) => setServices(r.data.data));
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Servicios</h2>
          <p>Servicios médicos disponibles</p>
        </div>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {services.length === 0 ? (
              <tr><td colSpan={4}><div className="empty-state"><p>No hay servicios registrados</p></div></td></tr>
            ) : (
              services.map((s) => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 500 }}>{s.name}</td>
                  <td>{categoryLabel[s.category] || s.category}</td>
                  <td>{s.price ? `${s.price} ${s.currency}` : "Consultar"}</td>
                  <td>
                    <span className={`badge ${s.active ? "badge-confirmed" : "badge-cancelled"}`}>
                      {s.active ? "Activo" : "Inactivo"}
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
