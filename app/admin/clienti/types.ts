export interface Cliente {
  id?: string;
  created_at?: string;
  tipo: 'privato' | 'azienda';
  nome: string;
  cognome?: string;
  ragione_sociale?: string;
  codice_fiscale?: string;
  partita_iva?: string;
  email?: string;
  telefono?: string;
  indirizzo?: string;
  citta?: string;
  cap?: string;
  documento_numero?: string;
  documento_scadenza?: string;
  patente_numero?: string;
  patente_categoria?: string;
  patente_scadenza?: string;
  note?: string;
  stato: 'attivo' | 'blacklist' | 'nuovo';
}