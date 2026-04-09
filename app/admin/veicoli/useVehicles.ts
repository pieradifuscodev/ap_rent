import { useState, useEffect, useCallback } from "react";
import { vehicleService } from "./services/vehicleService";
import { Veicolo } from "./types";

export const useVehicles = () => {
  const [vehicles, setVehicles] = useState<Veicolo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadVehicles = useCallback(async () => {
    setLoading(true);
    try {
      const data = await vehicleService.getAll();
      setVehicles(data);
    } catch (error: unknown) {
      if (error instanceof Error) alert(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log("Hooks montato: carico veicoli...");
    loadVehicles();
  }, [loadVehicles]);

  const handleAddVehicle = async (formData: Omit<Veicolo, 'id' | 'created_at'>) => {
    setLoading(true);
    try {
      await vehicleService.create(formData);
      // Non serve ricaricare qui se facciamo il redirect, 
      // ma lo teniamo per sicurezza o per utilizzi futuri
      await loadVehicles();
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
        throw error; // Rilanciamo l'errore per bloccare il redirect nella pagina
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    try {
      await vehicleService.delete(id);
      // Aggiornamento ottimistico della UI
      setVehicles((prev) => prev.filter((v) => v.id !== id));
    } catch (error: unknown) {
      if (error instanceof Error) alert("Errore: " + error.message);
    }
  };

  return {
    vehicles,
    loading,
    handleAddVehicle,
    handleDeleteVehicle,
    refresh: loadVehicles
  };
};