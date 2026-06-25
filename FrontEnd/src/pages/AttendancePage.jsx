import { useState, useEffect, useCallback } from "react";
import { Plus, X, Check } from "lucide-react";
import { C } from "../constants";
import { api } from "../api";
import { Modal } from "../components/Modal";

export function AttendancePage() {
  const [attendance, setAttendance] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentFilter, setStudentFilter] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ student_id: "", subject_id: "", fecha: new Date().toISOString().slice(0, 10), presente: "1" });
  const [saving, setSaving] = useState(false);

  const fetchAttendance = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (studentFilter) params.set("student_id", studentFilter);
      if (subjectFilter) params.set("subject_id", subjectFilter);
      const [a, s, sub] = await Promise.all([
        api.attendance.list("?" + params.toString()),
        api.students.list("?estado=Activo"),
        api.subjects.list(),
      ]);
      setAttendance(a);
      setStudents(s);
      setSubjects(sub);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [studentFilter, subjectFilter]);

  useEffect(() => { fetchAttendance(); }, [fetchAttendance]);

  const openCreate = () => {
    setForm({ student_id: "", subject_id: "", fecha: new Date().toISOString().slice(0, 10), presente: "1" });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.student_id || !form.subject_id || !form.fecha) return;
    setSaving(true);
    try {
      await api.attendance.create({
        student_id: Number(form.student_id),
        subject_id: Number(form.subject_id),
        fecha: form.fecha,
        presente: Number(form.presente),
      });
      setModalOpen(false);
      fetchAttendance();
    } catch (e) { alert(e.message); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Asistencias</h1>
          <p className="text-sm text-gray-500">Registro de asistencia diaria</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-sm font-semibold shadow-lg hover:opacity-90 active:scale-95 transition-all" style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})` }}>
          <Plus size={16} /> Registrar asistencia
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
          <div className="p-8 text-center text-gray-400 text-sm">Cargando asistencias...</div>
        ) : attendance.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">No hay registros de asistencia</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="text-left px-4 py-3 font-semibold">Alumno</th>
                  <th className="text-left px-4 py-3 font-semibold">Materia</th>
                  <th className="text-left px-4 py-3 font-semibold">Fecha</th>
                  <th className="text-center px-4 py-3 font-semibold">Presente</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map(a => (
                  <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-medium text-gray-800">{a.alumno_nombre}</td>
                    <td className="px-4 py-3 text-gray-600">{a.materia_nombre}</td>
                    <td className="px-4 py-3 text-gray-500">{a.fecha}</td>
                    <td className="px-4 py-3 text-center">
                      {a.presente ? (
                        <span className="inline-flex items-center gap-1 text-green-600 text-xs font-semibold"><Check size={14} /> Presente</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-500 text-xs font-semibold"><X size={14} /> Ausente</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Registrar asistencia">
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
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Fecha</label>
            <input type="date" value={form.fecha} onChange={e => setForm({...form, fecha: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Estado</label>
            <select value={form.presente} onChange={e => setForm({...form, presente: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none bg-white">
              <option value="1">Presente</option>
              <option value="0">Ausente</option>
            </select>
          </div>
          <button onClick={handleSave} disabled={saving} className="w-full py-2.5 rounded-xl text-white text-sm font-semibold shadow-lg hover:opacity-90 active:scale-95 transition-all disabled:opacity-60" style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})` }}>
            {saving ? "Guardando..." : "Registrar"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
