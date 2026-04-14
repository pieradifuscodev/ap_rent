"use client";

import { useVehicles } from "./veicoli/useVehicles";

export default function AdminDashboard() {
  const { vehicles, loading } = useVehicles();

  const stats = {
    totale: vehicles.length,
    disponibili: vehicles.filter(v => v.stato === 'disponibile').length,
    manutenzione: vehicles.filter(v => v.stato === 'manutenzione').length,
  };

  return (
    /* RIMOSSO max-w-6xl mx-auto */
    <div className="w-full space-y-10">
      <header>
        <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">
          Dashboard
        </h1>
        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-2">
          Benvenuto nel gestionale <span className="text-blue-600 italic">AP Rent</span>
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="admin-card-stat border-l-slate-200 bg-white shadow-sm p-8 rounded-[2rem]">
          <div className="admin-label">Flotta Totale</div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-5xl font-black text-slate-900">
              {loading ? "---" : stats.totale}
            </span>
          </div>
        </div>

        <div className="admin-card-stat border-l-blue-500 bg-white shadow-sm p-8 rounded-[2rem]">
          <div className="admin-label text-blue-600">Disponibili</div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-5xl font-black text-blue-600">
              {loading ? "---" : stats.disponibili}
            </span>
          </div>
        </div>

        <div className="admin-card-stat border-l-amber-500 bg-white shadow-sm p-8 rounded-[2rem]">
          <div className="admin-label text-amber-600">In Manutenzione</div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-5xl font-black text-amber-600">
              {loading ? "---" : stats.manutenzione}
            </span>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-12 rounded-[2rem] border border-slate-100 border-dashed flex flex-col items-center justify-center">
          <div className="text-3xl mb-4 opacity-30">📅</div>
          <h3 className="font-black uppercase text-xs tracking-widest text-slate-400">Ultime Prenotazioni</h3>
        </div>

        <div className="bg-white p-12 rounded-[2rem] border border-slate-100 border-dashed flex flex-col items-center justify-center">
          <div className="text-3xl mb-4 opacity-30">🔔</div>
          <h3 className="font-black uppercase text-xs tracking-widest text-slate-400">Scadenze Imminenti</h3>
        </div>
      </section>
    </div>
  );
}