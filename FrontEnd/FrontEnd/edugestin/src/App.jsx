import { useState } from "react";
import { C } from "./constants";
import { Sidebar } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
// Import other pages here as you create them:
// import { StudentsPage } from "./pages/StudentsPage";
// import { GradesPage } from "./pages/GradesPage";
// import { AttendancePage } from "./pages/AttendancePage";

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) {
    return <LoginPage onLogin={(u) => setUser(u)} />;
  }

  const renderPage = () => {
    switch (page) {
      case "dashboard":  return <DashboardPage />;
      // Add cases as you build more pages:
      // case "students":   return <StudentsPage />;
      // case "grades":     return <GradesPage />;
      // case "attendance": return <AttendancePage />;
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
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
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

      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-shrink-0">
        <Sidebar
          page={page}
          setPage={setPage}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
      </div>

      {/* Main */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar
          user={user}
          onLogout={() => setUser(null)}
          onMenuClick={() => setMobileOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-5 lg:p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}