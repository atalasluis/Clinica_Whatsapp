import { NavLink, Outlet } from "react-router-dom";

const nav = [
  { to: "/", label: "Dashboard", icon: "📊" },
  { section: "Gestión" },
  { to: "/leads", label: "Leads", icon: "📋" },
  { to: "/appointments", label: "Citas", icon: "📅" },
  { to: "/conversations", label: "Conversaciones", icon: "💬" },
  { section: "Catálogos" },
  { to: "/professionals", label: "Profesionales", icon: "🩺" },
  { to: "/specialties", label: "Especialidades", icon: "🏥" },
  { to: "/services", label: "Servicios", icon: "🔬" },
];

export default function Layout() {
  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <h1>Clínica WhatsApp</h1>
          <span>Sistema de Gestión</span>
        </div>
        <nav className="sidebar-nav">
          {nav.map((item, i) =>
            "section" in item ? (
              <div key={i} className="sidebar-section">
                {item.section}
              </div>
            ) : (
              <NavLink
                key={item.to}
                to={item.to!}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `sidebar-link${isActive ? " active" : ""}`
                }
              >
                <span>{item.icon}</span>
                {item.label}
              </NavLink>
            )
          )}
        </nav>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
