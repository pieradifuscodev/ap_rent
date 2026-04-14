"use client";

import { Veicolo } from "../types";
import Table from "../../components/ui/Table";
import { useRouter } from "next/navigation";
import { 
  Car, 
  Bike, 
  Zap,
  ShieldCheck, 
  CalendarClock, 
  FileCheck, 
  Trash2,
  Pencil
} from "lucide-react";

interface VehicleTableProps {
  vehicles: Veicolo[];
  loading: boolean;
  onDelete: (id: string) => void;
  currentFilter: 'tutti' | 'auto' | 'scooter' | 'bici_elettrica'; 
}

export default function VehicleTable({ vehicles, loading, onDelete, currentFilter }: VehicleTableProps) {
  const router = useRouter();
  const isBiciMode = currentFilter === 'bici_elettrica';

  const getDeadlineStyles = (dateString: string | null) => {
    if (!dateString) return "text-slate-200";
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadline = new Date(dateString);
    const diffDays = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "text-rose-600 animate-pulse";
    if (diffDays <= 15) return "text-amber-500";
    return "text-emerald-500/40";
  };

  const getStatusStyles = (stato: string) => {
    switch (stato) {
      case 'disponibile': return { color: "text-emerald-500", dot: "bg-emerald-500" };
      case 'occupato': return { color: "text-rose-500", dot: "bg-rose-500" };
      case 'manutenzione': return { color: "text-amber-500", dot: "bg-amber-500" };
      case 'sospeso': return { color: "text-slate-400", dot: "bg-slate-400" };
      default: return { color: "text-slate-300", dot: "bg-slate-300" };
    }
  };

  const headers = isBiciMode 
    ? ["Dettagli Mezzo", "Stato", ""] 
    : ["Dettagli Mezzo", "Assicurazione", "Revisione", "Bollo", "Stato", ""];

  return (
    <Table headers={headers} loading={loading}>
      {vehicles.map((v) => {
        const status = getStatusStyles(v.stato);
        
        return (
          <tr key={v.id} className="group hover:bg-blue-50/10 transition-all border-b border-slate-50 last:border-0">
            
            {/* DETTAGLI CON TARGA PREMIUM SMALL */}
            <td className="px-5 py-4 first:pl-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-blue-500 group-hover:border-blue-200 transition-all shadow-sm">
                  {v.tipo === 'auto' && <Car size={20} strokeWidth={1.5} />}
                  {v.tipo === 'scooter' && <Bike size={20} strokeWidth={1.5} />}
                  {v.tipo === 'bici_elettrica' && <Zap size={20} strokeWidth={1.5} />}
                </div>
                <div className="flex flex-col gap-1">
                  <div className="text-[13px] font-black text-slate-900 uppercase tracking-tight leading-none">
                    {v.marca} <span className="font-medium text-slate-400">{v.modello}</span>
                  </div>
                  {!isBiciMode && v.targa && (
                    <div className="flex items-center w-fit bg-white border border-slate-200 rounded px-1.5 py-0.5 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                      <div className="w-1 h-3 bg-blue-600 rounded-sm mr-1.5 opacity-70" />
                      <span className="text-[10px] font-mono font-black text-slate-700 tracking-tighter uppercase">
                        {v.targa}
                      </span>
                      <div className="w-1 h-3 bg-blue-600 rounded-sm ml-1.5 opacity-70" />
                    </div>
                  )}
                </div>
              </div>
            </td>

            {/* DOCUMENTI */}
            {!isBiciMode && (
              <>
                <td className="px-5 py-4 text-center">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className={getDeadlineStyles(v.scadenza_assicurazione)} />
                    <span className="text-[12px] font-bold text-slate-700 leading-none">{v.scadenza_assicurazione || '---'}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <CalendarClock size={16} className={getDeadlineStyles(v.scadenza_revisione)} />
                    <span className="text-[12px] font-bold text-slate-700 leading-none">{v.scadenza_revisione || '---'}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <FileCheck size={16} className={getDeadlineStyles(v.scadenza_bollo)} />
                    <span className="text-[12px] font-bold text-slate-700 leading-none">{v.scadenza_bollo || '---'}</span>
                  </div>
                </td>
              </>
            )}

            {/* STATO CON COLORI RICHIESTI */}
            <td className="px-5 py-4">
              <div className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider ${status.color}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${status.dot} ${v.stato === 'disponibile' ? 'animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]' : ''}`} />
                {v.stato}
              </div>
            </td>

            {/* AZIONI */}
            <td className="px-5 py-4 last:pr-8 text-right">
              <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                <button 
                  onClick={() => router.push(`/admin/veicoli/modifica/${v.id}`)}
                  className="p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                >
                  <Pencil size={16} strokeWidth={2} />
                </button>
                <button 
                  onClick={() => onDelete(v.id as string)} 
                  className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                >
                  <Trash2 size={16} strokeWidth={2} />
                </button>
              </div>
            </td>
          </tr>
        );
      })}
    </Table>
  );
}