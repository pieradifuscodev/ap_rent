import { supabase } from "@/lib/supabase";
import { Veicolo } from "../types";

export const vehicleService = {
  async getAll(): Promise<Veicolo[]> {
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async create(vehicleData: any) {
    // Pulizia date (come fatto prima)
    const formattedData = {
      ...vehicleData,
      immatricolazione: vehicleData.immatricolazione || null,
      scadenza_assicurazione: vehicleData.scadenza_assicurazione || null,
      scadenza_bollo: vehicleData.scadenza_bollo || null,
      scadenza_revisione: vehicleData.scadenza_revisione || null,
    };

    const { data, error } = await supabase
      .from("vehicles")
      .insert([formattedData])
      .select();

    if (error) {
      // Codice 23505 = Unique Violation (Targa già esistente)
      if (error.code === '23505') {
        throw new Error("Targa già registrata nel sistema");
      }
      throw new Error(error.message);
    }
    return data;
  },

  async update(id: string, updates: Partial<Veicolo>): Promise<void> {
    const { error } = await supabase
      .from("vehicles")
      .update(updates)
      .eq("id", id);
    
    if (error) throw error;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("vehicles")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
  }
};