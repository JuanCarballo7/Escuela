import { useState, useEffect, useCallback } from "react";
import { Search, Plus, Pencil, Trash2, X, Check } from "lucide-react";
import { C } from "../constants";
import { api } from "../api";
import { Badge } from "../components/Badge";
import { Modal } from "../components/Modal";

const emptyForm = { nombre: "", dni: "", legajo: "", email: "", curso: "1°A", estado: "Activo", ingreso: String(new Date().getFullYear()) };
const CURSOS = ["1°A","1°B","2°A","2°B","3°A","3°B","4°A","4°B","5°A","5°B"];

export function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCurso, setFilterCurso] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("q", search);
      if (filterCurso) params.set("curso", filterCurso);
      const data = await api.students.list("?" + params.toString());
      setStudents(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [search, filterCurso]);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (s) => { setEditing(s); setForm({ nombre:s.nombre, dni:s.dni, legajo:s.legajo, email:s.email||"", curso:s.curso, estado:s.estado, ingreso:s.ingreso }); setModalOpen(true); };

  const handleSave = async () => {
    if (!form.nombre || !form.dni || !form.legajo) return;
    setSaving(true);
    try {
      if (editing) {
        await api.students.update(editing.id, form);
      } else {
        await api.students.create(form);
      }
      setModalOpen(false);
      fetchStudents();
    } catch (e) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (s) => {
    if (!confirm(`¿Eliminar a ${s.nombre}?`)) return;
    try {
      await api.students.delete(s.id);
      fetchStudents();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Alumnos</h1>
          <p className="text-sm text-gray-500">Gestión de estudiantes</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-sm font-semibold shadow-lg hover:opacity-90 active:scale-95 transition-all" style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})` }}>
          <Plus size={16} /> Agregar alumno
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 flex-1 min-w-[200px] max-w-xs">
          <Search size={15} className="text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nombre, DNI, legajo..." className="bg-transparent text-sm outline-none flex-1 text-gray-600 placeholder-gray-400" />
          {search && <X size={14} className="text-gray-400 cursor-pointer" onClick={() => setSearch("")} />}
        </div>
        <select value={filterCurso} onChange={e => setFilterCurso(e.target.value)} className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 outline-none">
          <option value="">Todos los cursos</option>
          {CURSOS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Cargando alumnos...</div>
        ) : students.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">No se encontraron alumnos</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="text-left px-4 py-3 font-semibold">Legajo</th>
                  <th className="text-left px-4 py-3 font-semibold">Nombre</th>
                  <th className="text-left px-4 py-3 font-semibold">DNI</th>
                  <th className="text-left px-4 py-3 font-semibold">Curso</th>
                  <th className="text-left px-4 py-3 font-semibold">Email</th>
                  <th className="text-center px-4 py-3 font-semibold">Estado</th>
                  <th className="text-right px-4 py-3 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {students.map(s => (
                  <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-3 text-gray-500">{s.legajo}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{s.nombre}</td>
                    <td className="px-4 py-3 text-gray-500">{s.dni}</td>
                    <td className="px-4 py-3 text-gray-600">{s.curso}</td>
                    <td className="px-4 py-3 text-gray-500">{s.email || "—"}</td>
                    <td className="px-4 py-3 text-center"><Badge>{s.estado}</Badge></td>
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Editar alumno" : "Nuevo alumno"}>
        <div className="space-y-3">
          {[
            { label:"Nombre completo", key:"nombre", type:"text" },
            { label:"DNI", key:"dni", type:"text" },
            { label:"Legajo", key:"legajo", type:"text" },
            { label:"Email", key:"email", type:"email" },
          ].map(f => (
            <div key={f.key}>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">{f.label}</label>
              <input type={f.type} value={form[f.key]} onChange={e => setForm({...form, [f.key]: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400" />
            </div>
          ))}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Curso</label>
              <select value={form.curso} onChange={e => setForm({...form, curso: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none bg-white">
                {CURSOS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Estado</label>
              <select value={form.estado} onChange={e => setForm({...form, estado: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none bg-white">
                <option>Activo</option><option>Inactivo</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Ingreso</label>
              <input type="text" value={form.ingreso} onChange={e => setForm({...form, ingreso: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none" />
            </div>
          </div>
          <button onClick={handleSave} disabled={saving} className="w-full py-2.5 rounded-xl text-white text-sm font-semibold shadow-lg hover:opacity-90 active:scale-95 transition-all disabled:opacity-60" style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})` }}>
            {saving ? "Guardando..." : (editing ? "Guardar cambios" : "Crear alumno")}
          </button>
        </div>
      </Modal>
    </div>
  );
}
