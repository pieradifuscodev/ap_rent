"use client";

import { Veicolo } from "../types";

interface VehicleTableProps {
  vehicles: Veicolo[];
  loading: boolean;
  onEdit: (v: Veicolo) => void;
  onDelete: (id: string) => void;
}

export default function VehicleTable({ vehicles, loading, onEdit, onDelete }: VehicleTableProps) {
  
  // Funzione per controllare se una data è scaduta o vicina alla scadenza (15gg)
  const getDateStatusClass = (dateString: string | undefined) => {
    if (!dateString) return "text-slate-400";
    const today = new Date();
    const expiryDate = new Date(dateString);
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "text-rose-600 font-bold animate-pulse"; // Scaduta
    if (diffDays <= 15) return "text-amber-600 font-bold"; // In scadenza
    return "text-slate-700 font-medium"; // Ok
  };

  const getStatusStyles = (stato: Veicolo['stato']) => {
    switch (stato) {
      case 'disponibile': return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case 'manutenzione': return "bg-amber-50 text-amber-700 border-amber-200";
      case 'occupato': return "bg-blue-50 text-blue-700 border-blue-200";
      case 'sospeso': return "bg-rose-50 text-rose-700 border-rose-200";
      default: return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-0">
          <thead>
            <tr className="bg-slate-50/80">
              <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Veicolo / Targa</th>
              <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Assicurazione</th>
              <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Bollo</th>
              <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Revisione</th>
              <th className="px-6 py-4 text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Stato</th>
              <th className="px-6 py-4 text-right text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Azioni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {!loading && vehicles.map((v) => (
              <tr key={v.id} className="hover:bg-slate-50/50 transition-colors group">
                {/* VEICOLO E TARGA */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-slate-900">{v.marca} {v.modello}</div>
                  <div className="font-mono text-[11px] text-blue-600 font-bold uppercase tracking-tighter">{v.targa}</div>
                </td>

                {/* SCADENZA ASSICURAZIONE */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-xs ${getDateStatusClass(v.scadenza_assicurazione)}`}>
                    {v.scadenza_assicurazione ? new Date(v.scadenza_assicurazione).toLocaleDateString('it-IT') : '---'}
                  </div>
                </td>

                {/* SCADENZA BOLLO */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-xs ${getDateStatusClass(v.scadenza_bollo)}`}>
                    {v.scadenza_bollo ? new Date(v.scadenza_bollo).toLocaleDateString('it-IT') : '---'}
                  </div>
                </td>

                {/* SCADENZA REVISIONE */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-xs ${getDateStatusClass(v.scadenza_revisione)}`}>
                    {v.scadenza_revisione ? new Date(v.scadenza_revisione).toLocaleDateString('it-IT') : '---'}
                  </div>
                </td>

                {/* STATO */}
                <td className="px-6 py-4 text-center whitespace-nowrap">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyles(v.stato)}`}>
                    {v.stato}
                  </span>
                </td>

                {/* AZIONI */}
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  <div className="flex justify-end gap-1">
                    <button 
                      onClick={() => onEdit(v)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                    </button>
                    <button 
                      onClick={() => v.id && onDelete(v.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}