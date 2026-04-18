"use client";

import { useRouter } from "next/navigation";
import { useClients } from "../useClients";
import ClientForm from "../components/ClientForm";
import { toast } from "sonner";

export default function NuovoClientePage() {
  const router = useRouter();
  const { handleAddClient, loading } = useClients();

  const onSave = async (data: any) => {
    try {
      await handleAddClient(data);
      toast.success("Cliente registrato con successo");
      router.refresh();
      router.push("/admin/clienti");
    } catch (error: any) {
      // --- LOGICA FEEDBACK UMANO ---
      let friendlyMessage = "Errore durante il salvataggio";

      // Se l'errore viene dai vincoli SQL (Constraints)
      if (error.code === '23514' || error.message?.includes('violates check constraint')) {
        if (error.message?.includes('check_cap_smart')) {
          friendlyMessage = "Il CAP non è valido. Per l'Italia deve essere di 5 cifre.";
        } else if (error.message?.includes('check_provincia_smart')) {
          friendlyMessage = "La Provincia non è valida. Usa la sigla di 2 lettere (es: RM).";
        } else if (error.message?.includes('check_cf_length')) {
          friendlyMessage = "Il Codice Fiscale è troppo lungo (max 16 caratteri).";
        } else if (error.message?.includes('check_email_format')) {
          friendlyMessage = "L'indirizzo Email non sembra corretto.";
        } else {
          friendlyMessage = "Alcuni dati non rispettano il formato richiesto.";
        }
      } 
      // Errore di connessione o generico
      else if (error.message?.includes('fetch')) {
        friendlyMessage = "Problema di connessione al database. Riprova.";
      }

      toast.error(friendlyMessage, {
        description: "Controlla i campi evidenziati e riprova.",
        duration: 5000,
      });
      
      console.error("Dettaglio tecnico per developer:", error);
    }
  };

  return (
    <div className="w-full space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <button 
          onClick={() => router.push("/admin/clienti")} 
          className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-blue-600 transition-colors w-fit"
        >
          ← Annulla e torna all'anagrafica
        </button>
        <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">
          Nuovo <span className="text-blue-600">Cliente</span>
        </h1>
        <p className="text-slate-400 font-bold text-[11px] uppercase tracking-widest">
          Inserisci i dati per la registrazione del nuovo conducente
        </p>
      </div>

      <ClientForm 
        onSubmit={onSave} 
        loading={loading} 
      />
    </div>
  );
}