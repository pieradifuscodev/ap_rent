"use client";

import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Toaster } from 'sonner';
import { Users, Car } from "lucide-react"; // Aggiunte icone lucide per coerenza

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/reset-password";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const isActive = (path: string) => pathname.startsWith(path);

  if (isAuthPage) return <>{children}</>;

  return (
    <div className="flex min-h-screen bg-[#fcfcfc]">
      <Toaster position="top-right" richColors />
      
      <aside className="w-72 bg-white text-slate-900 flex flex-col fixed h-full border-r border-slate-200 z-50">
        <div className="p-8">
          <h2 className="text-2xl font-black tracking-tighter text-blue-600 uppercase">
            AP Rent <span className="text-slate-400 font-light text-xs italic">Admin</span>
          </h2>
        </div>
        
        <nav className="grow px-4">
          <ul className="space-y-2">
            <li>
              <Link href="/admin/veicoli" 
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${
                  isActive('/admin/veicoli') 
                    ? "bg-blue-50 text-blue-600 shadow-sm" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Car size={20} />
                <span className="font-bold text-xs uppercase tracking-[0.15em]">Gestione Flotta</span>
              </Link>
            </li>
            
            {/* NUOVO LINK CLIENTI */}
            <li>
              <Link href="/admin/clienti" 
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${
                  isActive('/admin/clienti') 
                    ? "bg-blue-50 text-blue-600 shadow-sm" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Users size={20} />
                <span className="font-bold text-xs uppercase tracking-[0.15em]">Anagrafica Clienti</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="p-6 border-t border-slate-100">
          <button onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-500 text-rose-600 hover:text-white py-4 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest border border-rose-100"
          >
            Disconnetti
          </button>
        </div>
      </aside>

      <main className="ml-72 flex-1 p-0 min-h-screen flex flex-col">
        <div className="p-10 w-full max-w-none">
          {children}
        </div>
      </main>
    </div>
  );
}