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

  async create(vehicleData: Omit<Veicolo, 'id' | 'created_at'>): Promise<Veicolo> {
    const { data, error } = await supabase
      .from("vehicles")
      .insert([vehicleData])
      .select()
      .single(); // Restituisce l'oggetto creato invece di un array
    
    if (error) throw error;
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