import { supabase } from "@/lib/supabase";

export const storageService = {
  /**
   * Carica la scansione della patente nel bucket privato.
   * Il file viene salvato con un percorso basato sull'ID cliente o un timestamp
   * per evitare sovrascritture accidentali.
   */
  async uploadPatente(file: File, clientId?: string) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${clientId || 'temp'}_${Date.now()}.${fileExt}`;
    const filePath = `patenti/${fileName}`;

    const { data, error } = await supabase.storage
      .from('documenti_clienti')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;
    return data.path; // Restituiamo il path interno per salvarlo nel DB
  },

  /**
   * Genera un link temporaneo per visualizzare il documento in sicurezza.
   * L'URL generato sarà valido solo per il tempo specificato.
   */
  async getSecureUrl(path: string) {
    const { data, error } = await supabase.storage
      .from('documenti_clienti')
      .createSignedUrl(path, 60); // Scade dopo 60 secondi

    if (error) {
      console.error("Errore generazione URL sicuro:", error);
      return null;
    }

    return data.signedUrl;
  },

  /**
   * Rimuove un documento dallo storage
   */
  async deleteFile(path: string) {
    const { error } = await supabase.storage
      .from('documenti_clienti')
      .remove([path]);

    if (error) throw error;
  }
};