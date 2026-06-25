import { useState } from "react";
import { GraduationCap, AlertCircle, Eye, EyeOff } from "lucide-react";
import { C } from "../constants";
import { api } from "../api";

export function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ usuario: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.usuario || !form.password) {
      setError("Completá todos los campos.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await api.login(form.usuario, form.password);
      onLogin(data);
    } catch (e) {
      setError(e.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ fontFamily: "'DM Sans',sans-serif", backgroundColor: C.bg }}
    >
      {/* Panel Izquierdo */}
      <div
        className="hidden lg:flex flex-col justify-center items-center w-1/2 relative overflow-hidden"
        style={{
          background: `linear-gradient(145deg, ${C.sidebar} 0%, ${C.primary} 60%, ${C.secondary} 100%)`,
        }}
      >
        <div className="absolute top-[-80px] left-[-80px] w-72 h-72 rounded-full opacity-10 border-[40px] border-white" />
        <div className="absolute bottom-[-60px] right-[-60px] w-56 h-56 rounded-full opacity-10 border-[30px] border-white" />
        <div className="absolute top-1/3 right-[-30px] w-24 h-24 rounded-full opacity-10 bg-white" />

        <div className="relative z-10 text-center px-12">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl"
            style={{ background: `linear-gradient(135deg, ${C.secondary}, #56aee8)` }}
          >
            <GraduationCap size={40} color="white" />
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight mb-3">EduGestión</h1>
          <p className="text-blue-200 text-lg leading-relaxed max-w-xs">
            Sistema integral de gestión escolar para instituciones educativas modernas.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4 text-center">
            {[["500+", "Alumnos"], ["30+", "Docentes"], ["98%", "Asistencia"]].map(([v, l]) => (
              <div key={l} className="bg-white/10 rounded-xl py-3 px-2 backdrop-blur-sm">
                <p className="text-white font-bold text-xl">{v}</p>
                <p className="text-blue-200 text-xs mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Panel Derecho */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 px-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <GraduationCap size={28} style={{ color: C.primary }} />
            <span className="text-2xl font-bold" style={{ color: C.primary }}>EduGestión</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Bienvenido</h2>
          <p className="text-gray-500 text-sm mb-8">Ingresá con tu cuenta institucional</p>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-5 text-sm">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                Usuario
              </label>
              <input
                type="text"
                placeholder="usuario@escuela.edu.ar"
                value={form.usuario}
                onChange={(e) => setForm({ ...form, usuario: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none transition"
                onFocus={(e) => (e.target.style.boxShadow = `0 0 0 3px ${C.secondary}30`)}
                onBlur={(e) => (e.target.style.boxShadow = "none")}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none transition pr-12"
                  onFocus={(e) => (e.target.style.boxShadow = `0 0 0 3px ${C.secondary}30`)}
                  onBlur={(e) => (e.target.style.boxShadow = "none")}
                />
                <button
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

          </div>

          <div className="flex justify-end mt-2 mb-6">
            <button className="text-xs font-medium hover:underline" style={{ color: C.secondary }}>
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-white font-semibold text-sm shadow-lg hover:opacity-90 active:scale-95 transition-all disabled:opacity-60"
            style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})` }}
          >
            {loading ? "Ingresando..." : "Ingresar al sistema"}
          </button>

          <p className="text-center text-xs text-gray-400 mt-6">
            © 2026 EduGestión · Todos los derechos reservados
          </p>
        </div>
      </div>
    </div>
  );
}