"use client";

import { useState } from "react";
import Link from "next/link";
import { useVehicles } from "./useVehicles";
import VehicleTable from "./components/VehicleTable";
import { toast } from "sonner";
import { LayoutGrid, Car, Bike, Plus, Search, X } from "lucide-react";

export default function VeicoliPage() {
  const { vehicles, loading, handleDeleteVehicle } = useVehicles();
  const [filter, setFilter] = useState<'tutti' | 'auto' | 'scooter' | 'bici_elettrica'>('tutti');
  const [searchQuery, setSearchQuery] = useState("");

  // FILTRO DOPPIO: Categoria + Ricerca Testuale
  const filteredVehicles = vehicles.filter(v => {
    const matchesTab = filter === 'tutti' || v.tipo === filter;
    const matchesSearch = 
      v.marca.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.modello.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.targa?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  const onDeleteConfirm = async (id: string) => {
    if (window.confirm("Sei sicuro di voler eliminare questo veicolo?")) {
      try {
        await handleDeleteVehicle(id);
        toast.success("Veicolo rimosso correttamente");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error("Impossibile eliminare il veicolo");
      }
    }
  };

  const tabs = [
    { id: 'tutti', label: 'Tutti', icon: <LayoutGrid size={14} /> },
    { id: 'auto', label: 'Auto', icon: <Car size={14} /> },
    { id: 'scooter', label: 'Scooter', icon: <Bike size={14} className="rotate-12" /> },
    { id: 'bici_elettrica', label: 'E-Bike', icon: <Bike size={14} /> },
  ];

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-500">      
      
      {/* HEADER INTEGRATO CON RICERCA */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">
            Gestione <span className="text-blue-600 font-italic">Flotta</span>
          </h1>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-1">
            {filteredVehicles.length} Mezzi trovati
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* BARRA DI RICERCA COMPATTA */}
          <div className="relative flex-1 md:w-64 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={16} />
            <input 
              type="text"
              placeholder="Cerca..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-10 text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-rose-500 transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <Link 
            href="/admin/veicoli/nuovo"
            className="btn-primary flex items-center gap-3 shadow-xl shadow-blue-500/10 px-6 py-3.5"
          >
            <Plus size={18} strokeWidth={3} />
            <span className="hidden sm:inline">Nuovo</span>
          </Link>
        </div>
      </div>

      {/* TABS FILTRO */}
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

      {/* TABELLA RISULTATI */}
      <div className="relative">
        {filteredVehicles.length > 0 ? (
          <VehicleTable 
            vehicles={filteredVehicles} 
            loading={loading} 
            onDelete={onDeleteConfirm}
            currentFilter={filter}
          />
        ) : !loading && (
          <div className="py-20 text-center bg-slate-50 rounded-4xl border-2 border-dashed border-slate-200">
            <Search size={40} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">
              Nessun mezzo trovato per "{searchQuery}&quot;
            </p>
          </div>
        )}
      </div>
    </div>
  );
}