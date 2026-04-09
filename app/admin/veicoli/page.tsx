"use client";

import Link from "next/link";
import { useVehicles } from "./useVehicles";
import VehicleTable from "./components/VehicleTable";
import { Veicolo } from "./types";

export default function VeicoliPage() {
  const { vehicles, loading, handleDeleteVehicle } = useVehicles();

  // Funzione per gestire la conferma e l'eliminazione
  const onDeleteConfirm = async (id: string) => {
    if (window.confirm("Sei sicuro di voler eliminare definitivamente questo veicolo? L'azione non può essere annullata.")) {
      await handleDeleteVehicle(id);
    }
  };

  // Placeholder per la futura gestione della modifica
  const onEditRedirect = (v: Veicolo) => {
    console.log("Reindirizzamento alla modifica per il veicolo:", v.id);
    // Qui andrà: router.push(`/admin/veicoli/modifica/${v.id}`)
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER DELLA PAGINA */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">
            Flotta Veicoli
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Gestisci i mezzi, monitora le scadenze e aggiorna gli stati della flotta.
          </p>
        </div>

        <Link 
          href="/admin/veicoli/nuovo"
          className="btn-primary flex items-center gap-2 shadow-lg shadow-blue-500/20"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M5 12h14"/><path d="M12 5v14"/>
          </svg>
          Nuovo Veicolo
        </Link>
      </div>

      {/* COMPONENTE TABELLA UI */}
      <div className="relative">
        {/* Passiamo le props necessarie al componente figlio */}
        <VehicleTable 
          vehicles={vehicles} 
          loading={loading} 
          onEdit={onEditRedirect}
          onDelete={onDeleteConfirm}
        />
        
        {/* Footer info sotto la tabella */}
        {!loading && vehicles.length > 0 && (
          <p className="mt-4 text-[11px] text-slate-400 font-bold uppercase tracking-widest text-right px-2">
            Totale mezzi in flotta: {vehicles.length}
          </p>
        )}
      </div>
    </div>
  );
}