import { useState, useEffect, useCallback } from "react";
import { clientService } from "./services/clientService";
import { Cliente } from "./types";

export const useClients = () => {
  const [clients, setClients] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadClients = useCallback(async () => {
    setLoading(true);
    try {
      const data = await clientService.getAll();
      setClients(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  const handleAddClient = async (formData: Omit<Cliente, "id" | "created_at">) => {
    setLoading(true);
    try {
      // Determiniamo se è un'azienda in base alla presenza della Partita IVA
      const isAzienda = formData.partita_iva && formData.partita_iva.trim() !== "";

      const cleanedData = {
        ...formData,
        nome: formData.nome.toUpperCase(),
        // Se è azienda il cognome va a null, altrimenti maiuscolo (o null se mancante)
        cognome: isAzienda ? null : (formData.cognome?.toUpperCase() || null),
        codice_fiscale: formData.codice_fiscale?.replace(/\s+/g, '').toUpperCase() || null,
        partita_iva: formData.partita_iva?.replace(/\s+/g, '') || null,
        email: formData.email?.toLowerCase().trim() || null,
        // Pulizia spazi per telefono e cap
        telefono: formData.telefono?.trim() || null,
        cap: formData.cap?.trim() || null,
      };

      await clientService.create(cleanedData as Cliente);
      await loadClients();
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClient = async (id: string) => {
    try {
      await clientService.delete(id);
      setClients((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return {
    clients,
    loading,
    handleAddClient,
    handleDeleteClient,
    refresh: loadClients,
  };
};