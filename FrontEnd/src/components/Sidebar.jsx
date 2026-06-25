import {
  LayoutDashboard, Users, BookOpen, ClipboardList, Calendar,
  Settings, UserCheck, FileText, GraduationCap, ChevronLeft, X,
} from "lucide-react";
import { C } from "../constants";

export const NAV_ITEMS = [
  { id: "dashboard",  label: "Dashboard",     icon: LayoutDashboard },
  { id: "students",   label: "Alumnos",       icon: Users           },
  { id: "subjects",   label: "Materias",      icon: BookOpen        },
  { id: "grades",     label: "Notas",         icon: ClipboardList   },
  { id: "attendance", label: "Asistencias",   icon: Calendar        },
  { id: "users",      label: "Usuarios",      icon: UserCheck       },
  { id: "reports",    label: "Reportes",      icon: FileText        },
  { id: "settings",   label: "Configuración", icon: Settings        },
];

export function Sidebar({ page, setPage, collapsed, setCollapsed, mobile, onClose }) {
  return (
    <aside
      className={`flex flex-col h-full transition-all duration-300 ${
        collapsed && !mobile ? "w-[68px]" : "w-[220px]"
      }`}
      style={{ backgroundColor: C.sidebar, fontFamily: "'DM Sans',sans-serif" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${C.secondary}, #56aee8)` }}
        >
          <GraduationCap size={20} color="white" />
        </div>
        {(!collapsed || mobile) && (
          <span className="text-white font-bold text-base tracking-tight">EduGestión</span>
        )}
        {mobile && (
          <button onClick={onClose} className="ml-auto text-white/60 hover:text-white">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const active = page === id;
          return (
            <button
              key={id}
              onClick={() => { setPage(id); if (mobile) onClose(); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 mb-0.5 rounded-lg mx-1.5 transition-all text-sm
                ${active ? "text-white font-semibold" : "text-white/50 hover:text-white/80 hover:bg-white/5"}`}
              style={{
                width: "calc(100% - 12px)",
                background: active ? `linear-gradient(90deg, ${C.secondary}40, ${C.secondary}20)` : undefined,
                borderLeft: active ? `3px solid ${C.secondary}` : "3px solid transparent",
              }}
            >
              <Icon size={18} className="flex-shrink-0" />
              {(!collapsed || mobile) && <span>{label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Collapse btn (desktop only) */}
      {!mobile && (
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center py-3 border-t border-white/10 text-white/40 hover:text-white/70 transition"
        >
          <ChevronLeft
            size={16}
            className={`transition-transform ${collapsed ? "rotate-180" : ""}`}
          />
        </button>
      )}
    </aside>
  );
}