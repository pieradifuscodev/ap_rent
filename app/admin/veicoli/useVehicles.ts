import { useState, useEffect, useCallback } from "react";
import { vehicleService } from "./services/vehicleService";
import { Veicolo } from "./types";
import { supabase } from "@/lib/supabase";

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
    loadVehicles();
  }, [loadVehicles]);

  const handleAddVehicle = async (formData: Omit<Veicolo, 'id' | 'created_at'>) => {
    setLoading(true);
    try {
      const cleanedData = {
        ...formData,
        targa: formData.tipo === 'bici_elettrica' ? "" : formData.targa.replace(/\s+/g, '').toUpperCase(),
        immatricolazione: formData.immatricolazione || null,
        scadenza_assicurazione: formData.scadenza_assicurazione || null,
        scadenza_bollo: formData.scadenza_bollo || null,
        scadenza_revisione: formData.scadenza_revisione || null,
        km_attuali: formData.km_attuali || 0
      };

      await vehicleService.create(cleanedData);
      await loadVehicles();
    } catch (error: unknown) {
      if (error instanceof Error) throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateVehicle = async (id: string, vehicleData: any) => {
    setLoading(true);
    try {
      // BLINDATURA AGGIUNTA ANCHE QUI
      const formattedData = {
        ...vehicleData,
        targa: vehicleData.tipo === 'bici_elettrica' ? "" : (vehicleData.targa?.replace(/\s+/g, '').toUpperCase() || ""),
        immatricolazione: vehicleData.immatricolazione || null,
        scadenza_assicurazione: vehicleData.scadenza_assicurazione || null,
        scadenza_bollo: vehicleData.scadenza_bollo || null,
        scadenza_revisione: vehicleData.scadenza_revisione || null,
      };

      const { error } = await supabase
        .from("vehicles")
        .update(formattedData)
        .eq("id", id);

      if (error) throw error;
      
      setVehicles(prev => prev.map(v => v.id === id ? { ...v, ...formattedData } : v));
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    try {
      await vehicleService.delete(id);
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
    handleUpdateVehicle,
    refresh: loadVehicles
  };
};