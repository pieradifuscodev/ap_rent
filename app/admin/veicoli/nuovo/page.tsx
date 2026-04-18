"use client";

import { useRouter } from "next/navigation";
import { useVehicles } from "../useVehicles";
import VehicleForm from "../components/VehicleForm";
import { toast } from "sonner";

export default function NuovoVeicoloPage() {
  const router = useRouter();
  const { handleAddVehicle, loading } = useVehicles();

  const onSave = async (data: any) => {
    try {
      await handleAddVehicle(data);
      router.refresh();
      router.push("/admin/veicoli");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Errore durante il salvataggio";
      toast.error(errorMessage);
      console.error("Salvataggio fallito:", error);
    }
  };

  return (
    <div className="w-full space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <button 
          onClick={() => router.push("/admin/veicoli")} 
          className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-blue-600 transition-colors w-fit"
        >
          ← Annulla e torna alla flotta
        </button>
        <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">
          Nuovo <span className="text-blue-600">Mezzo</span>
        </h1>
      </div>

      <VehicleForm 
        onSubmit={onSave} 
        onCancel={() => router.push("/admin/veicoli")} 
        loading={loading} 
      />
    </div>
  );
}