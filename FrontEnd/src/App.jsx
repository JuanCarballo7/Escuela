import { useState, useEffect } from "react";
import { C } from "./constants";
import { Sidebar } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { StudentsPage } from "./pages/StudentsPage";
import { SubjectsPage } from "./pages/SubjectsPage";
import { GradesPage } from "./pages/GradesPage";
import { AttendancePage } from "./pages/AttendancePage";
import { UsersPage } from "./pages/UsersPage";
import { ReportsPage } from "./pages/ReportsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { api, setToken, clearToken, getToken } from "./api";

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (token) {
      api.me()
        .then((u) => setUser(u))
        .catch(() => clearToken())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = (data) => {
    setToken(data.token);
    setUser(data.user);
  };

  const handleLogout = () => {
    clearToken();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center" style={{ backgroundColor: C.bg }}>
        <p className="text-gray-400 text-sm">Cargando...</p>
      </div>
    );
  }

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const renderPage = () => {
    switch (page) {
      case "dashboard":  return <DashboardPage />;
      case "students":   return <StudentsPage />;
      case "subjects":   return <SubjectsPage />;
      case "grades":     return <GradesPage />;
      case "attendance": return <AttendancePage />;
      case "users":      return <UsersPage />;
      case "reports":    return <ReportsPage />;
      case "settings":   return <SettingsPage />;
      default:
        return (
          <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
            Sección <strong className="mx-1 capitalize">{page}</strong> en construcción
          </div>
        );
    }
  };

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ fontFamily: "'DM Sans',sans-serif", backgroundColor: C.bg }}
    >
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 lg:hidden transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar
          page={page}
          setPage={setPage}
          collapsed={false}
          setCollapsed={() => {}}
          mobile
          onClose={() => setMobileOpen(false)}
        />
      </div>

      <div className="hidden lg:flex flex-shrink-0">
        <Sidebar
          page={page}
          setPage={setPage}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
      </div>

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar
          user={user}
          onLogout={handleLogout}
          onMenuClick={() => setMobileOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-5 lg:p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
