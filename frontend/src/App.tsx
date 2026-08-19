import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import Appointments from "./pages/Appointments";
import Conversations from "./pages/Conversations";
import Professionals from "./pages/Professionals";
import Specialties from "./pages/Specialties";
import Services from "./pages/Services";
import Escalations from "./pages/Escalations";
import FollowUps from "./pages/FollowUps";
import Alerts from "./pages/Alerts";
import Reports from "./pages/Reports";
import Surveys from "./pages/Surveys";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/conversations" element={<Conversations />} />
          <Route path="/escalations" element={<Escalations />} />
          <Route path="/follow-ups" element={<FollowUps />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/professionals" element={<Professionals />} />
          <Route path="/specialties" element={<Specialties />} />
          <Route path="/services" element={<Services />} />
          <Route path="/surveys" element={<Surveys />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
