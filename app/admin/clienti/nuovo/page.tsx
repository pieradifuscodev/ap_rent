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
      toast.error(error.message || "Errore durante il salvataggio");
      console.error("Salvataggio fallito:", error);
    }
  };

  return (
    <div className="w-full space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* HEADER COERENTE CON VEICOLI */}
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

      {/* FORM SENZA COMPONENTI UI ASTRATTI */}
      <ClientForm 
        onSubmit={onSave} 
        loading={loading} 
      />
    </div>
  );
}