export interface Tariffe {
  giornaliero: number;
  settimanale: number;
}

export interface VeicoloTariffe {
  bassa: Tariffe;
  media: Tariffe;
  alta: Tariffe;
}

export interface Veicolo {
  id?: string; // Opzionale perché nel form di creazione non esiste ancora
  created_at?: string;
  marca: string;
  modello: string;
  targa: string;
  immatricolazione: string;
  proprietario: string;
  tipo: 'auto' | 'scooter' | 'bici_elettrica';
  stato: 'disponibile' | 'occupato' | 'manutenzione' | 'sospeso';
  km_attuali: number;
  tipo_carburante: string;
  capacita_carburante: number;
  totale_tacche: number;
  tariffe: VeicoloTariffe;
  scadenza_assicurazione: string;
  scadenza_bollo: string;
  scadenza_revisione: string;
  note: string;
}