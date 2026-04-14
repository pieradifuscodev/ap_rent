"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      alert("Accesso negato: controlla le credenziali");
      setLoading(false);
      return;
    }

    if (data.session) {
      window.location.href = "/veicoli";
    }
  };

  const handleReset = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email) return alert("Inserisci l'email");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://ap-rent-admin.vercel.app/reset-password',
    });
    if (error) alert(error.message);
    else alert("Controlla la mail!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md space-y-8">
        {/* LOGO AREA */}
        <div className="text-center">
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">
            AP Rent <span className="text-blue-600 italic font-light text-xl">Admin</span>
          </h1>
          <p className="mt-2 text-slate-500 font-medium">Inserisci le credenziali per gestire la flotta</p>
        </div>

        {/* LOGIN CARD */}
        <div className="admin-card">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="admin-label">Indirizzo Email</label>
              <input 
                type="email" 
                className="admin-input" 
                placeholder="nome@azienda.it"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>

            <div>
              <label className="admin-label">Password</label>
              <input 
                type="password" 
                className="admin-input" 
                placeholder="••••••••"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full uppercase tracking-widest text-xs font-black">
              {loading ? "Verifica in corso..." : "Accedi al Pannello"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button 
              onClick={handleReset} 
              className="text-xs font-bold text-slate-400 hover:text-blue-600 uppercase tracking-tighter transition-colors"
            >
              Hai dimenticato la password?
            </button>
          </div>
        </div>

        <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
          &copy; 2024 AP Rent Srl • Versione 1.0
        </p>
      </div>
    </div>
  );
}