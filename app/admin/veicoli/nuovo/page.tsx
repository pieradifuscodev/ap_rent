"use client";

import { useRouter } from "next/navigation";
import { useVehicles } from "../useVehicles";
import VehicleForm from "../components/VehicleForm";
import { Veicolo } from "../types";

export default function NuovoVeicoloPage() {
  const router = useRouter();
  const { handleAddVehicle, loading } = useVehicles();

  const onSave = async (data: Omit<Veicolo, 'id' | 'created_at'>) => {
    try {
      await handleAddVehicle(data);
      // CORREZIONE: Aggiunto /admin/ prima di veicoli
      router.push("/admin/veicoli"); 
    } catch (error) {
      console.error("Errore durante il salvataggio:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.back()} 
          className="text-slate-400 hover:text-slate-600 transition-colors px-2 py-1 rounded-md hover:bg-slate-100"
        >
          ← Indietro
        </button>
        <h1 className="text-2xl font-black tracking-tight text-slate-900">
          Aggiungi nuovo veicolo
        </h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
        <VehicleForm 
          onSubmit={onSave} 
          // CORREZIONE: Aggiunto /admin/ prima di veicoli
          onCancel={() => router.push("/admin/veicoli")} 
          loading={loading} 
        />
      </div>
    </div>
  );
}