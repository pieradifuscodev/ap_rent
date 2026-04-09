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
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Intestazione */}
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Dashboard
        </h1>
        <p className="text-slate-500 mt-1 font-medium">
          Benvenuto nel gestionale di <span className="text-blue-600">AP Rent</span>.
        </p>
      </header>

      {/* Griglia Statistiche */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="admin-card-stat border-l-slate-400">
          <div className="admin-label">Flotta Totale</div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-slate-900">
              {loading ? "---" : stats.totale}
            </span>
            <span className="text-slate-400 font-semibold uppercase text-[10px]">Mezzi</span>
          </div>
        </div>

        <div className="admin-card-stat border-l-emerald-500">
          <div className="admin-label text-emerald-600/70">Disponibili</div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-emerald-600">
              {loading ? "---" : stats.disponibili}
            </span>
            <span className="text-emerald-400 font-semibold uppercase text-[10px]">Pronti</span>
          </div>
        </div>

        <div className="admin-card-stat border-l-amber-500">
          <div className="admin-label text-amber-600/70">In Manutenzione</div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-amber-600">
              {loading ? "---" : stats.manutenzione}
            </span>
            <span className="text-amber-400 font-semibold uppercase text-[10px]">Fermi</span>
          </div>
        </div>
      </section>

      {/* Sezioni Inferiori */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="admin-card flex flex-col items-center justify-center py-12 border-dashed">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-2xl">
            📅
          </div>
          <h3 className="font-bold text-slate-800 text-lg">Ultime Prenotazioni</h3>
          <p className="text-slate-400 text-sm mt-1">Non ci sono prenotazioni recenti da mostrare.</p>
        </div>

        <div className="admin-card flex flex-col items-center justify-center py-12 border-dashed">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-2xl">
            🔔
          </div>
          <h3 className="font-bold text-slate-800 text-lg">Scadenze Imminenti</h3>
          <p className="text-slate-400 text-sm mt-1">Nessuna scadenza assicurativa nei prossimi 30 giorni.</p>
        </div>
      </section>
    </div>
  );
}