import { useState } from "react";
import { Bell, Search, Menu, LogOut } from "lucide-react";
import { C } from "../constants";

export function Topbar({ user, onLogout, onMenuClick }) {
  const [notifs] = useState(3);

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center px-5 gap-4 sticky top-0 z-30 shadow-sm">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
      >
        <Menu size={20} />
      </button>

      <div className="flex-1 max-w-xs hidden sm:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
        <Search size={15} className="text-gray-400 flex-shrink-0" />
        <input
          placeholder="Buscar..."
          className="bg-transparent text-sm outline-none flex-1 text-gray-600 placeholder-gray-400"
        />
      </div>

      <div className="ml-auto flex items-center gap-3">
        <button className="relative p-2 rounded-xl hover:bg-gray-100 transition">
          <Bell size={18} className="text-gray-500" />
          {notifs > 0 && (
            <span
              className="absolute top-1 right-1 w-4 h-4 rounded-full text-[10px] text-white font-bold flex items-center justify-center"
              style={{ backgroundColor: C.error }}
            >
              {notifs}
            </span>
          )}
        </button>

        <div className="flex items-center gap-2.5 pl-3 border-l border-gray-100">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
            style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})` }}
          >
            {user.nombre?.[0]?.toUpperCase() || "A"}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-gray-700">{user.nombre || "Admin"}</p>
            <p className="text-[10px] text-gray-400">{user.rol}</p>
          </div>
          <button
            onClick={onLogout}
            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition ml-1"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}