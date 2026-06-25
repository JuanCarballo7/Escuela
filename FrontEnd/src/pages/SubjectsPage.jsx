import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { C } from "../constants";
import { api } from "../api";
import { Modal } from "../components/Modal";

const emptyForm = { nombre: "", curso: "1°A", docente_id: "", horas_semanales: 4 };
const CURSOS = ["1°A","1°B","2°A","2°B","3°A","3°B","4°A","4°B","5°A","5°B"];

export function SubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const [s, t] = await Promise.all([api.subjects.list(), api.users.list()]);
      setSubjects(s);
      setTeachers(t.filter(u => u.rol === "Docente"));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (s) => { setEditing(s); setForm({ nombre:s.nombre, curso:s.curso, docente_id:s.docente_id || "", horas_semanales:s.horas_semanales }); setModalOpen(true); };

  const handleSave = async () => {
    if (!form.nombre || !form.curso) return;
    setSaving(true);
    try {
      const payload = { ...form, docente_id: form.docente_id ? Number(form.docente_id) : null };
      if (editing) await api.subjects.update(editing.id, payload);
      else await api.subjects.create(payload);
      setModalOpen(false);
      fetch();
    } catch (e) { alert(e.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (s) => {
    if (!confirm(`¿Eliminar la materia "${s.nombre}"?`)) return;
    try { await api.subjects.delete(s.id); fetch(); }
    catch (e) { alert(e.message); }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Materias</h1>
          <p className="text-sm text-gray-500">Gestión de materias y cursos</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-sm font-semibold shadow-lg hover:opacity-90 active:scale-95 transition-all" style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})` }}>
          <Plus size={16} /> Agregar materia
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Cargando materias...</div>
        ) : subjects.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">No hay materias registradas</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="text-left px-4 py-3 font-semibold">Materia</th>
                  <th className="text-left px-4 py-3 font-semibold">Curso</th>
                  <th className="text-left px-4 py-3 font-semibold">Docente</th>
                  <th className="text-center px-4 py-3 font-semibold">Horas/sem</th>
                  <th className="text-right px-4 py-3 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map(s => (
                  <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-medium text-gray-800">{s.nombre}</td>
                    <td className="px-4 py-3 text-gray-600">{s.curso}</td>
                    <td className="px-4 py-3 text-gray-500">{s.docente_nombre || "—"}</td>
                    <td className="px-4 py-3 text-center text-gray-500">{s.horas_semanales}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition"><Pencil size={15} /></button>
                      <button onClick={() => handleDelete(s)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition ml-1"><Trash2 size={15} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Editar materia" : "Nueva materia"}>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Nombre</label>
            <input type="text" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Curso</label>
              <select value={form.curso} onChange={e => setForm({...form, curso: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none bg-white">
                {CURSOS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Horas semanales</label>
              <input type="number" value={form.horas_semanales} onChange={e => setForm({...form, horas_semanales: Number(e.target.value)})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Docente</label>
            <select value={form.docente_id} onChange={e => setForm({...form, docente_id: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none bg-white">
              <option value="">Sin asignar</option>
              {teachers.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
            </select>
          </div>
          <button onClick={handleSave} disabled={saving} className="w-full py-2.5 rounded-xl text-white text-sm font-semibold shadow-lg hover:opacity-90 active:scale-95 transition-all disabled:opacity-60" style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})` }}>
            {saving ? "Guardando..." : (editing ? "Guardar cambios" : "Crear materia")}
          </button>
        </div>
      </Modal>
    </div>
  );
}
