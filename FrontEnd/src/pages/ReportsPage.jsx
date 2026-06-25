import { FileText, Users, BookOpen, ClipboardList, Download } from "lucide-react";
import { C } from "../constants";

const reports = [
  { icon: Users, label: "Listado de alumnos", desc: "Exportar listado completo de estudiantes", color: C.secondary },
  { icon: BookOpen, label: "Materias por curso", desc: "Planilla de materias y docentes asignados", color: C.primary },
  { icon: ClipboardList, label: "Acta de notas", desc: "Resumen de calificaciones por curso", color: C.success },
  { icon: FileText, label: "Reporte de asistencia", desc: "Asistencia mensual por alumno", color: C.warning },
];

export function ReportsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Reportes</h1>
        <p className="text-sm text-gray-500">Exportación de datos del sistema</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {reports.map((r, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
            <div className="p-2.5 rounded-xl w-fit mb-4" style={{ backgroundColor: r.color + "18" }}>
              <r.icon size={20} style={{ color: r.color }} />
            </div>
            <h3 className="font-semibold text-gray-800 text-sm mb-1">{r.label}</h3>
            <p className="text-xs text-gray-500 mb-4">{r.desc}</p>
            <button className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition" style={{ color: r.color, backgroundColor: r.color + "12" }}>
              <Download size={14} /> Exportar
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
        <FileText size={32} className="mx-auto mb-3 text-gray-300" />
        <p className="text-sm text-gray-500">Los reportes se generarán en formato PDF y Excel</p>
      </div>
    </div>
  );
}
