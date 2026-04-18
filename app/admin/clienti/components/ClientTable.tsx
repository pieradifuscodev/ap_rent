"use client";

import { Cliente } from "../types";
import Table from "../../components/ui/Table";
import { useRouter } from "next/navigation";
import { 
  User, 
  Mail, 
  Phone, 
  CreditCard, 
  Trash2, 
  Pencil,
  Eye,
  ShieldAlert,
  ShieldCheck
} from "lucide-react";

interface ClientTableProps {
  clients: Cliente[];
  loading: boolean;
  onDelete: (id: string) => void;
}

export default function ClientTable({ clients, loading, onDelete }: ClientTableProps) {
  const router = useRouter();

  const getDeadlineStyles = (dateString: string | null | undefined) => {
    if (!dateString) return "text-slate-200";
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadline = new Date(dateString);
    const diffDays = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "text-rose-500 animate-pulse";
    if (diffDays <= 15) return "text-amber-500";
    return "text-emerald-500/40";
  };

  const getStatusStyles = (isBlacklisted: boolean) => {
    if (isBlacklisted) {
      return { 
        label: "Blacklisted", 
        color: "text-rose-500", 
        dot: "bg-rose-500", 
        bg: "bg-rose-50",
        icon: <ShieldAlert size={12} />
      };
    }
    return { 
      label: "Affidabile", 
      color: "text-emerald-500", 
      dot: "bg-emerald-500", 
      bg: "bg-emerald-50",
      icon: <ShieldCheck size={12} />
    };
  };

  const headers = ["Anagrafica", "Contatti", "Documenti", "Stato", ""];

  return (
    <Table headers={headers} loading={loading}>
      {clients.map((c) => {
        const status = getStatusStyles(c.is_blacklisted);

        return (
          <tr 
            key={c.id} 
            onClick={() => router.push(`/admin/clienti/visualizza/${c.id}`)}
            className={`group cursor-pointer hover:bg-blue-50/20 transition-all border-b border-slate-50 last:border-0 ${c.is_blacklisted ? 'bg-rose-50/30' : ''}`}
          >
            
            {/* ANAGRAFICA */}
            <td className="px-5 py-4 first:pl-8">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl bg-white border flex items-center justify-center transition-all shadow-sm ${c.is_blacklisted ? 'border-rose-200 text-rose-400' : 'border-slate-200 text-slate-400 group-hover:text-blue-500 group-hover:border-blue-200'}`}>
                  <User size={20} />
                </div>
                <div className="flex flex-col gap-0.5">
                  <div className={`text-[13px] font-black uppercase tracking-tight leading-none ${c.is_blacklisted ? 'text-rose-700' : 'text-slate-900'}`}>
                    {c.nome} {c.cognome}
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                    {c.codice_fiscale || '---'}
                  </span>
                </div>
              </div>
            </td>

            {/* CONTATTI */}
            <td className="px-5 py-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail size={14} className="text-slate-300" />
                  <span className="text-xs font-medium lowercase">{c.email || '---'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone size={14} className="text-slate-300" />
                  <span className="text-xs font-medium">{c.telefono || '---'}</span>
                </div>
              </div>
            </td>

            {/* DOCUMENTI & PATENTE */}
            <td className="px-5 py-4">
              <div className="flex items-center gap-4">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <CreditCard size={14} className={getDeadlineStyles(c.patente_scadenza)} />
                    <span className="text-[11px] font-bold text-slate-700 uppercase">Pat. {c.patente_numero || '---'}</span>
                  </div>
                </div>
              </div>
            </td>

            {/* STATO */}
            <td className="px-5 py-4">
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full w-fit text-[9px] font-black uppercase tracking-wider ${status.bg} ${status.color}`}>
                {status.icon}
                {status.label}
              </div>
            </td>

            {/* AZIONI */}
            <td className="px-5 py-4 last:pr-8 text-right" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                <button 
                  onClick={() => router.push(`/admin/clienti/visualizza/${c.id}`)}
                  className="p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                  title="Visualizza"
                >
                  <Eye size={16} strokeWidth={2} />
                </button>
                <button 
                  onClick={() => router.push(`/admin/clienti/modifica/${c.id}`)}
                  className="p-2 text-slate-300 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all"
                  title="Modifica"
                >
                  <Pencil size={16} strokeWidth={2} />
                </button>
                <button 
                  onClick={() => onDelete(c.id as string)} 
                  className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                  title="Elimina"
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