import { ArrowUpRight } from "lucide-react";

// ─── BADGE ────────────────────────────────────────────────────────────────────
export function Badge({ color, children }) {
  const map = {
    success:   "bg-green-100 text-green-700",
    error:     "bg-red-100 text-red-700",
    warning:   "bg-yellow-100 text-yellow-700",
    info:      "bg-blue-100 text-blue-700",
    Activo:    "bg-green-100 text-green-700",
    Inactivo:  "bg-gray-100 text-gray-500",
    Aprobado:  "bg-green-100 text-green-700",
    Reprobado: "bg-red-100 text-red-700",
    Alumno:    "bg-purple-100 text-purple-700",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${map[color] || map[children] || "bg-gray-100 text-gray-600"}`}>
      {children}
    </span>
  );
}

// ─── KPI CARD ─────────────────────────────────────────────────────────────────
export function KPICard({ icon: Icon, label, value, sub, color, trend }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="p-2.5 rounded-xl" style={{ backgroundColor: color + "18" }}>
          <Icon size={20} style={{ color }} />
        </div>
        {trend && (
          <span className="flex items-center gap-1 text-xs font-medium text-green-600">
            <ArrowUpRight size={12} /> {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-sm text-gray-500 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}