"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { useVehicles } from "../../useVehicles";
import VehicleForm from "../../components/VehicleForm";
import { Veicolo } from "../../types";
import { supabase } from "@/lib/supabase";

export default function ModificaVeicoloPage() {
  const router = useRouter();
  const params = useParams();
  const { handleUpdateVehicle, loading: updateLoading } = useVehicles();
  
  const [vehicle, setVehicle] = useState<Veicolo | null>(null);
  const [fetching, setFetching] = useState(true);

  // Recupero dati veicolo al caricamento
  useEffect(() => {
    async function fetchVehicle() {
      try {
        const { data, error } = await supabase
          .from("vehicles")
          .select("*")
          .eq("id", params.id)
          .single();

        if (error) throw error;
        setVehicle(data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error("Impossibile recuperare i dati del veicolo");
        router.push("/admin/veicoli");
      } finally {
        setFetching(false);
      }
    }
    if (params.id) fetchVehicle();
  }, [params.id, router]);

  const onUpdate = async (data: any) => {
    try {
      await handleUpdateVehicle(params.id as string, data);
      toast.success("Scheda veicolo aggiornata con successo");
      router.refresh();
      router.push("/admin/veicoli");
    } catch (error: any) {
      toast.error(error.message || "Errore durante l'aggiornamento");
    }
  };

  if (fetching) {
    return (
      <div className="w-full h-96 flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Caricamento scheda...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col gap-3">
        <button 
          onClick={() => router.push("/admin/veicoli")} 
          className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-blue-600 transition-colors w-fit"
        >
          ← Torna alla flotta
        </button>
        <h1 className="text-5xl font-black text-slate-900 uppercase tracking-tighter">
          Modifica <span className="text-blue-600 italic">Mezzo</span>
        </h1>
        <p className="text-slate-400 font-bold text-[11px] uppercase tracking-widest">
          Stai modificando: {vehicle?.marca} {vehicle?.modello} ({vehicle?.targa})
        </p>
      </div>

      <VehicleForm 
        initialData={vehicle || undefined} 
        onSubmit={onUpdate} 
        onCancel={() => router.push("/admin/veicoli")} 
        loading={updateLoading} 
      />
    </div>
  );
}