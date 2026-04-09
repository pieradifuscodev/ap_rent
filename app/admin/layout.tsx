"use client";

import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  // Funzione per gestire lo stile attivo dei link
  const isActive = (path: string) => pathname === path;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full shadow-xl">
        <div className="p-6">
          <h2 className="text-xl font-bold tracking-tight text-blue-400">
            AP Rent <span className="text-white">Admin</span>
          </h2>
        </div>
        
        <nav className="flex-grow px-4">
          <ul className="space-y-2">
            <li>
              <Link 
                href="/veicoli" 
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive('/veicoli') 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <span className="text-lg">🚗</span>
                <span className="font-medium">Veicoli</span>
              </Link>
            </li>
            
            {/* Esempio di altri link futuri */}
            <li>
              <Link 
                href="/prenotazioni" 
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
              >
                <span className="text-lg">📅</span>
                <span className="font-medium">Prenotazioni</span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* LOGOUT AREA */}
        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white py-2.5 rounded-lg transition-all duration-200 font-semibold text-sm border border-red-500/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Esci
          </button>
        </div>
      </aside>

      {/* CONTENUTO PRINCIPALE */}
      <main className="ml-64 flex-grow p-10">
        {children}
      </main>
    </div>
  );
}