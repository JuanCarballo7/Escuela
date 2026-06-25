import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { C } from "../constants";
import { api } from "../api";
import { Badge } from "../components/Badge";
import { Modal } from "../components/Modal";

const emptyForm = { username: "", password: "", nombre: "", email: "", rol: "Docente" };

export function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try { setUsers(await api.users.list()); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (u) => { setEditing(u); setForm({ username:u.username, password:"", nombre:u.nombre, email:u.email||"", rol:u.rol }); setModalOpen(true); };

  const handleSave = async () => {
    if (!form.username || !form.nombre || (!editing && !form.password)) return;
    setSaving(true);
    try {
      const payload = { ...form };
      if (!payload.password) delete payload.password;
      if (editing) await api.users.update(editing.id, payload);
      else await api.users.create(payload);
      setModalOpen(false);
      fetch();
    } catch (e) { alert(e.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (u) => {
    if (!confirm(`¿Eliminar a "${u.nombre}"?`)) return;
    try { await api.users.delete(u.id); fetch(); }
    catch (e) { alert(e.message); }
  };

  const toggleStatus = async (u) => {
    try { await api.users.update(u.id, { activo: u.activo ? 0 : 1 }); fetch(); }
    catch (e) { alert(e.message); }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Usuarios</h1>
          <p className="text-sm text-gray-500">Gestión de usuarios del sistema</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-sm font-semibold shadow-lg hover:opacity-90 active:scale-95 transition-all" style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})` }}>
          <Plus size={16} /> Agregar usuario
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Cargando usuarios...</div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">No hay usuarios registrados</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="text-left px-4 py-3 font-semibold">Usuario</th>
                  <th className="text-left px-4 py-3 font-semibold">Nombre</th>
                  <th className="text-left px-4 py-3 font-semibold">Email</th>
                  <th className="text-center px-4 py-3 font-semibold">Rol</th>
                  <th className="text-center px-4 py-3 font-semibold">Estado</th>
                  <th className="text-right px-4 py-3 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-medium text-gray-800">{u.username}</td>
                    <td className="px-4 py-3 text-gray-700">{u.nombre}</td>
                    <td className="px-4 py-3 text-gray-500">{u.email || "—"}</td>
                    <td className="px-4 py-3 text-center"><Badge>{u.rol}</Badge></td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => toggleStatus(u)} className={`text-xs font-semibold px-2 py-0.5 rounded-full ${u.activo ? "text-green-700 bg-green-100" : "text-gray-500 bg-gray-100"}`}>
                        {u.activo ? "Activo" : "Inactivo"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => openEdit(u)} className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition"><Pencil size={15} /></button>
                      <button onClick={() => handleDelete(u)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition ml-1"><Trash2 size={15} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Editar usuario" : "Nuevo usuario"}>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Usuario</label>
              <input type="text" value={form.username} onChange={e => setForm({...form, username: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">{editing ? "Nueva contraseña" : "Contraseña"}</label>
              <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none" placeholder={editing ? "Dejar vacío para no cambiar" : ""} />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Nombre completo</label>
            <input type="text" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Email</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Rol</label>
              <select value={form.rol} onChange={e => setForm({...form, rol: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none bg-white">
                <option>Administrador</option>
                <option>Docente</option>
                <option>Preceptor</option>
              </select>
            </div>
          </div>
          <button onClick={handleSave} disabled={saving} className="w-full py-2.5 rounded-xl text-white text-sm font-semibold shadow-lg hover:opacity-90 active:scale-95 transition-all disabled:opacity-60" style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})` }}>
            {saving ? "Guardando..." : (editing ? "Guardar cambios" : "Crear usuario")}
          </button>
        </div>
      </Modal>
    </div>
  );
}
