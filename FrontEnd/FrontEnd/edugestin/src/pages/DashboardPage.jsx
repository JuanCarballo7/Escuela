import { Users, BookOpen, Calendar, UserCheck, PieChart as PieIcon, BarChart2 } from "lucide-react";
import {
  PieChart as RPieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { C, PIE_DATA, BAR_DATA, ACTIVITY } from "../constants";
import { KPICard } from "../components/Badge";
import { Badge } from "../components/Badge";

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-500">Resumen del sistema — Junio 2025</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard icon={Users}     label="Alumnos activos" value="487" sub="Del total: 512"    color={C.secondary} trend="+4%" />
        <KPICard icon={BookOpen}  label="Materias"        value="24"  sub="8 cursos activos"  color={C.primary} />
        <KPICard icon={Calendar}  label="Asistencia"      value="93%" sub="Este mes"           color={C.success} trend="+2%" />
        <KPICard icon={UserCheck} label="Docentes"        value="38"  sub="Staff activo"       color={C.warning} />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Pie */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <PieIcon size={18} style={{ color: C.primary }} />
            <h2 className="font-semibold text-gray-700 text-sm">Distribución de notas</h2>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <RPieChart>
              <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                {PIE_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            </RPieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 size={18} style={{ color: C.secondary }} />
            <h2 className="font-semibold text-gray-700 text-sm">Asistencia mensual (%)</h2>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={BAR_DATA} barSize={28}>
              <XAxis dataKey="mes" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[80, 100]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v) => `${v}%`} cursor={{ fill: "#f0f4f8" }} />
              <Bar dataKey="asistencia" fill={C.secondary} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Actividad reciente */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h2 className="font-semibold text-gray-700 text-sm mb-4">Actividad reciente</h2>
        <div className="space-y-3">
          {ACTIVITY.map((item, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-3">
                <Badge color={item.tipo}>{item.tipo}</Badge>
                <div>
                  <p className="text-sm font-medium text-gray-700">{item.accion}</p>
                  <p className="text-xs text-gray-400">{item.alumno}</p>
                </div>
              </div>
              <span className="text-xs text-gray-400">{item.tiempo}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}