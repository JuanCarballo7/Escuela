import { useState, useEffect, useCallback } from "react";
import { Plus, X } from "lucide-react";
import { C } from "../constants";
import { api } from "../api";
import { Badge } from "../components/Badge";
import { Modal } from "../components/Modal";

export function GradesPage() {
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentFilter, setStudentFilter] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ student_id: "", subject_id: "", tp: "", final: "" });
  const [saving, setSaving] = useState(false);

  const fetchGrades = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (studentFilter) params.set("student_id", studentFilter);
      if (subjectFilter) params.set("subject_id", subjectFilter);
      const [g, s, sub] = await Promise.all([
        api.grades.list("?" + params.toString()),
        api.students.list("?estado=Activo"),
        api.subjects.list(),
      ]);
      setGrades(g);
      setStudents(s);
      setSubjects(sub);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [studentFilter, subjectFilter]);

  useEffect(() => { fetchGrades(); }, [fetchGrades]);

  const openCreate = () => { setForm({ student_id: "", subject_id: "", tp: "", final: "" }); setModalOpen(true); };

  const handleSave = async () => {
    if (!form.student_id || !form.subject_id) return;
    setSaving(true);
    try {
      await api.grades.create({
        student_id: Number(form.student_id),
        subject_id: Number(form.subject_id),
        tp: form.tp ? Number(form.tp) : null,
        final: form.final ? Number(form.final) : null,
      });
      setModalOpen(false);
      fetchGrades();
    } catch (e) { alert(e.message); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Notas</h1>
          <p className="text-sm text-gray-500">Registro de calificaciones</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-sm font-semibold shadow-lg hover:opacity-90 active:scale-95 transition-all" style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})` }}>
          <Plus size={16} /> Cargar nota
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <select value={studentFilter} onChange={e => setStudentFilter(e.target.value)} className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 outline-none flex-1 min-w-[180px] max-w-xs">
          <option value="">Todos los alumnos</option>
          {students.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
        </select>
        <select value={subjectFilter} onChange={e => setSubjectFilter(e.target.value)} className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 outline-none flex-1 min-w-[180px] max-w-xs">
          <option value="">Todas las materias</option>
          {subjects.map(s => <option key={s.id} value={s.id}>{s.nombre} - {s.curso}</option>)}
        </select>
        {(studentFilter || subjectFilter) && (
          <button onClick={() => { setStudentFilter(""); setSubjectFilter(""); }} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
            <X size={14} /> Limpiar filtros
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Cargando notas...</div>
        ) : grades.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">No hay notas registradas</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="text-left px-4 py-3 font-semibold">Alumno</th>
                  <th className="text-left px-4 py-3 font-semibold">Materia</th>
                  <th className="text-center px-4 py-3 font-semibold">TP</th>
                  <th className="text-center px-4 py-3 font-semibold">Final</th>
                  <th className="text-center px-4 py-3 font-semibold">Promedio</th>
                  <th className="text-center px-4 py-3 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody>
                {grades.map(g => (
                  <tr key={g.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-medium text-gray-800">{g.alumno_nombre || "—"}</td>
                    <td className="px-4 py-3 text-gray-600">{g.materia_nombre || "—"}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{g.tp ?? "—"}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{g.final ?? "—"}</td>
                    <td className="px-4 py-3 text-center font-semibold text-gray-700">{g.promedio ?? "—"}</td>
                    <td className="px-4 py-3 text-center"><Badge>{g.estado || "Pendiente"}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Cargar nota">
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Alumno</label>
            <select value={form.student_id} onChange={e => setForm({...form, student_id: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none bg-white">
              <option value="">Seleccionar alumno</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.nombre} ({s.curso})</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Materia</label>
            <select value={form.subject_id} onChange={e => setForm({...form, subject_id: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none bg-white">
              <option value="">Seleccionar materia</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.nombre} - {s.curso}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">TP</label>
              <input type="number" step="0.1" min="0" max="10" value={form.tp} onChange={e => setForm({...form, tp: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Final</label>
              <input type="number" step="0.1" min="0" max="10" value={form.final} onChange={e => setForm({...form, final: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none" />
            </div>
          </div>
          <button onClick={handleSave} disabled={saving} className="w-full py-2.5 rounded-xl text-white text-sm font-semibold shadow-lg hover:opacity-90 active:scale-95 transition-all disabled:opacity-60" style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})` }}>
            {saving ? "Guardando..." : "Guardar nota"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
