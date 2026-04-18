export interface Cliente {
  id?: string;
  created_at?: string;
  
  // Anagrafica Nascita
  nome: string;
  cognome: string;
  sesso?: 'M' | 'F';
  data_nascita?: string;
  comune_nascita?: string; 
  provincia_nascita?: string;
  
  // Cittadinanza e Documenti
  tipo_cittadinanza: 'ITA' | 'EU' | 'EXTRA';
  nazione_rilascio?: string; 
  codice_fiscale: string;
  documento_numero?: string;
  documento_scadenza?: string;
  documento_url?: string;
  patente_numero?: string;
  patente_scadenza?: string;
  patente_url?: string;

  // Residenza Attuale
  indirizzo?: string;
  citta?: string;
  cap?: string;
  provincia?: string;

  // Contatti e Stato
  email?: string;
  telefono?: string;
  partita_iva?: string; 
  is_blacklisted: boolean;
  note?: string;
}