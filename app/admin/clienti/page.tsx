"use client";

import { useState } from "react";
import Link from "next/link";
import { useClients } from "./useClients";
import ClientTable from "./components/ClientTable";
import { toast } from "sonner";
import { 
  Users, 
  User, 
  Building2, 
  Plus, 
  Search, 
  X 
} from "lucide-react";

export default function ClientiPage() {
  const { clients, loading, handleDeleteClient } = useClients();
  const [filter, setFilter] = useState<'tutti' | 'privato' | 'azienda'>('tutti');
  const [searchQuery, setSearchQuery] = useState("");

  // FILTRO DOPPIO: Categoria + Ricerca (Nome, Cognome, Ragione Sociale, CF/PIVA)
  const filteredClients = clients.filter(c => {
    const matchesTab = filter === 'tutti' || c.tipo === filter;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      c.nome.toLowerCase().includes(searchLower) ||
      c.cognome?.toLowerCase().includes(searchLower) ||
      c.ragione_sociale?.toLowerCase().includes(searchLower) ||
      c.codice_fiscale?.toLowerCase().includes(searchLower) ||
      c.partita_iva?.toLowerCase().includes(searchLower);
    
    return matchesTab && matchesSearch;
  });

  const onDeleteConfirm = async (id: string) => {
    if (window.confirm("Sei sicuro di voler eliminare questo cliente?")) {
      try {
        await handleDeleteClient(id);
        toast.success("Cliente rimosso correttamente");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error("Impossibile eliminare il cliente");
      }
    }
  };

  const tabs = [
    { id: 'tutti', label: 'Tutti i Clienti', icon: <Users size={14} /> },
    { id: 'privato', label: 'Privati', icon: <User size={14} /> },
    { id: 'azienda', label: 'Aziende', icon: <Building2 size={14} /> },
  ];

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-500">      
      
      {/* HEADER INTEGRATO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">
            Anagrafica <span className="text-blue-600 font-italic">Clienti</span>
          </h1>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-1">
            {filteredClients.length} record in elenco
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* RICERCA */}
          <div className="relative flex-1 md:w-72 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={16} />
            <input 
              type="text"
              placeholder="Cerca cliente o P.IVA/CF..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-10 text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-rose-500 transition-colors">
                <X size={16} />
              </button>
            )}
          </div>

          <Link href="/admin/clienti/nuovo" className="btn-primary flex items-center gap-3 shadow-xl shadow-blue-500/10 px-6 py-3.5">
            <Plus size={18} strokeWidth={3} />
            <span className="hidden sm:inline uppercase font-black text-[11px] tracking-widest">Nuovo Cliente</span>
          </Link>
        </div>
      </div>

      {/* TABS */}
      <div className="flex items-center gap-1 border-b border-slate-100">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative
              ${filter === tab.id ? 'text-blue-600' : 'text-slate-400 hover:text-slate-900'}`}
          >
            {tab.icon}
            {tab.label}
            {filter === tab.id && (
              <div className="absolute -bottom-px left-0 w-full h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* TABELLA */}
      <div className="relative">
        {filteredClients.length > 0 ? (
          <ClientTable 
            clients={filteredClients} 
            loading={loading} 
            onDelete={onDeleteConfirm}
          />
        ) : !loading && (
          <div className="py-20 text-center bg-slate-50 rounded-4xl border-2 border-dashed border-slate-200">
            <Search size={40} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">
              Nessun cliente trovato
            </p>
          </div>
        )}
      </div>
    </div>
  );
}