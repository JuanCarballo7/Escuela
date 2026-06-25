import { useState, useEffect } from "react";
import { Users, BookOpen, Calendar, UserCheck, PieChart as PieIcon, BarChart2 } from "lucide-react";
import {
  PieChart as RPieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { C } from "../constants";
import { api } from "../api";
import { KPICard } from "../components/Badge";
import { Badge } from "../components/Badge";

export function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.dashboard.stats(),
      api.dashboard.activity(),
      api.dashboard.pie(),
      api.dashboard.bar(),
    ]).then(([s, a, p, b]) => {
      setStats(s);
      setActivity(a);
      setPieData(p);
      setBarData(b);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
        Cargando dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-500">Resumen del sistema</p>
      </div>

      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard icon={Users}     label="Alumnos activos" value={stats.alumnosActivos} sub={`Del total: ${stats.totalAlumnos}`} color={C.secondary} trend="+4%" />
          <KPICard icon={BookOpen}  label="Materias"        value={stats.materias}       sub={`${stats.cursos} cursos activos`}  color={C.primary} />
          <KPICard icon={Calendar}  label="Asistencia"      value={`${stats.asistencia || 0}%`} sub="Este mes"            color={C.success} trend="+2%" />
          <KPICard icon={UserCheck} label="Docentes"        value={stats.docentes}       sub="Staff activo"                color={C.warning} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <PieIcon size={18} style={{ color: C.primary }} />
            <h2 className="font-semibold text-gray-700 text-sm">Distribución de notas</h2>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <RPieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            </RPieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 size={18} style={{ color: C.secondary }} />
            <h2 className="font-semibold text-gray-700 text-sm">Asistencia mensual (%)</h2>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData} barSize={28}>
              <XAxis dataKey="mes" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[80, 100]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v) => `${v}%`} cursor={{ fill: "#f0f4f8" }} />
              <Bar dataKey="asistencia" fill={C.secondary} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h2 className="font-semibold text-gray-700 text-sm mb-4">Actividad reciente</h2>
        <div className="space-y-3">
          {activity.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
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
          {activity.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">Sin actividad reciente</p>
          )}
        </div>
      </div>
    </div>
  );
}
