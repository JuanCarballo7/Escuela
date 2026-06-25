import { C } from "../constants";

export function SettingsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Configuración</h1>
        <p className="text-sm text-gray-500">Ajustes del sistema</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-700 text-sm mb-4">Información institucional</h2>
          <div className="space-y-3">
            {[
              { label: "Nombre de la institución", value: "EduGestión School" },
              { label: "Directivo a cargo", value: "Carlos Martínez" },
              { label: "Ciclo lectivo", value: "2026" },
              { label: "Cantidad de cursos", value: "10" },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-500">{item.label}</span>
                <span className="text-sm font-medium text-gray-800">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-700 text-sm mb-4">Apariencia</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Tema</span>
              <span className="text-sm font-medium text-gray-800 bg-gray-100 px-3 py-1 rounded-lg">Claro</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Color primario</span>
              <div className="flex gap-1">
                {[C.primary, C.secondary, C.success, C.warning, C.error].map((c, i) => (
                  <div key={i} className="w-5 h-5 rounded-full border border-gray-200" style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-700 text-sm mb-4">Sistema</h2>
          <div className="space-y-3">
            {[
              { label: "Versión", value: "1.0.0" },
              { label: "Base de datos", value: "SQLite" },
              { label: "Entorno", value: "Desarrollo" },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-500">{item.label}</span>
                <span className="text-sm font-medium text-gray-800">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
