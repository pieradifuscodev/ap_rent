import { supabase } from "@/lib/supabase";
import { Cliente } from "../types";

export const clientService = {
  async getAll() {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Cliente[];
  },

  async create(clientData: Omit<Cliente, "id" | "created_at">) {
    const { data, error } = await supabase
      .from("customers")
      .insert([clientData])
      .select();

    if (error) throw error;
    return data[0];
  },

  async update(id: string, clientData: Partial<Cliente>) {
    const { data, error } = await supabase
      .from("customers")
      .update(clientData)
      .eq("id", id)
      .select();

    if (error) throw error;
    return data[0];
  },

  async delete(id: string) {
    const { error } = await supabase.from("customers").delete().eq("id", id);
    if (error) throw error;
  },
};