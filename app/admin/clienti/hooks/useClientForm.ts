"use client";

import { useState, useRef, useEffect } from "react";
import CodiceFiscale from "codice-fiscale-js";
import { storageService } from "../services/storageService";
import { toast } from "sonner";
import { Cliente } from "../types";

export function useClientForm(initialData: Partial<Cliente> | null, onSubmit: (data: Cliente) => void) {
  const [isScanning, setIsScanning] = useState(false);
  const [lastUploadedFile, setLastUploadedFile] = useState<File | null>(null); // Per trigger manuale AI
  
  const patenteInputRef = useRef<HTMLInputElement>(null);
  const documentoInputRef = useRef<HTMLInputElement>(null);
  
  const [patenteUrlView, setPatenteUrlView] = useState<string | null>(null);
  const [documentoUrlView, setDocumentoUrlView] = useState<string | null>(null);
  
  const [sessoLocale, setSessoLocale] = useState(initialData?.sesso || 'M');
  const [tipoCittadinanza, setTipoCittadinanza] = useState(initialData?.tipo_cittadinanza || 'ITA');

  const [formData, setFormData] = useState<Cliente>(() => ({
    nome: initialData?.nome || '', 
    cognome: initialData?.cognome || '', 
    sesso: initialData?.sesso || 'M',
    tipo_cittadinanza: initialData?.tipo_cittadinanza || 'ITA',
    nazione_rilascio: initialData?.nazione_rilascio || '',
    codice_fiscale: initialData?.codice_fiscale || '', 
    partita_iva: initialData?.partita_iva || '', 
    email: initialData?.email || '', 
    telefono: initialData?.telefono || '',
    indirizzo: initialData?.indirizzo || '', 
    citta: initialData?.citta || '', 
    cap: initialData?.cap || '', 
    provincia: initialData?.provincia || '',
    documento_numero: initialData?.documento_numero || '',
    documento_scadenza: initialData?.documento_scadenza || '', 
    patente_numero: initialData?.patente_numero || '', 
    patente_scadenza: initialData?.patente_scadenza || '', 
    data_nascita: initialData?.data_nascita || '', 
    comune_nascita: initialData?.comune_nascita || '',
    provincia_nascita: initialData?.provincia_nascita || '',
    patente_url: initialData?.patente_url || '', 
    documento_url: initialData?.documento_url || '', 
    is_blacklisted: initialData?.is_blacklisted || false,
    note: initialData?.note || ''
  }));

  const formattaPerInputDate = (dateStr: string | undefined) => {
    if (!dateStr) return "";
    const clean = dateStr.trim();
    const match = clean.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
    
    if (match) {
      let [_, day, month, year] = match;
      if (year.length === 2) {
        const numericYear = parseInt(year);
        year = numericYear > 30 ? `19${year}` : `20${year}`;
      }
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    return clean; 
  };

  useEffect(() => {
    if (formData.patente_url) {
      storageService.getSecureUrl(formData.patente_url).then(setPatenteUrlView);
    } else { setPatenteUrlView(null); }
    if (formData.documento_url) {
      storageService.getSecureUrl(formData.documento_url).then(setDocumentoUrlView);
    } else { setDocumentoUrlView(null); }
  }, [formData.patente_url, formData.documento_url]);

  const handleCalcolaCF = () => {
    try {
      const { nome, cognome, data_nascita, comune_nascita, provincia_nascita } = formData;
      if (nome && cognome && data_nascita && comune_nascita) {
        const birthDate = new Date(data_nascita);
        if (isNaN(birthDate.getTime())) return toast.error("Data nascita non valida");
        
        // Pulizia smart del comune per la libreria
        const cityClean = comune_nascita.split('(')[0].trim().toUpperCase();

        const cf = new CodiceFiscale({
          name: nome.trim().toUpperCase(), 
          surname: cognome.trim().toUpperCase(), 
          gender: sessoLocale as "M" | "F",
          day: birthDate.getDate(), 
          month: birthDate.getMonth() + 1, 
          year: birthDate.getFullYear(),
          birthplace: cityClean,
          birthplaceProvincia: provincia_nascita?.trim().toUpperCase() || "" 
        });
        setFormData((prev) => ({ ...prev, codice_fiscale: cf.toString() }));
        toast.success("Codice Fiscale generato");
      } else { toast.error("Dati mancanti (Nome, Cognome, Data o Comune) per il calcolo"); }
    } catch (e) { toast.error("Errore nel calcolo del CF. Verifica il Comune."); }
  };

  // 1. GESTIONE SOLO CARICAMENTO FILE (Patente o Documento)
  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>, type: 'patente' | 'documento') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const tid = toast.loading("Caricamento in corso...");
    try {
      const path = await storageService.uploadPatente(file);
      if (type === 'patente') {
        setFormData(p => ({ ...p, patente_url: path }));
        setLastUploadedFile(file); // Salviamo il riferimento per l'analisi AI successiva
      } else {
        setFormData(p => ({ ...p, documento_url: path }));
      }
      toast.success(`${type === 'patente' ? 'Patente' : 'Documento'} caricato`, { id: tid });
    } catch (error) {
      toast.error("Errore durante il caricamento", { id: tid });
    } finally {
      if (type === 'patente' && patenteInputRef.current) patenteInputRef.current.value = "";
      if (type === 'documento' && documentoInputRef.current) documentoInputRef.current.value = "";
    }
  };

  // 2. TRIGGER MANUALE ANALISI AI
  const handleTriggerOcr = async () => {
    if (!lastUploadedFile && !formData.patente_url) {
      return toast.error("Carica prima una foto della patente");
    }

    setIsScanning(true);
    const tid = toast.loading("L'AI sta analizzando il documento...");

    try {
      const formDataBody = new FormData();
      // Se abbiamo il file in memoria usiamo quello, altrimenti l'AI non può lavorare sul path stringa
      if (lastUploadedFile) {
        formDataBody.append("file", lastUploadedFile);
      } else {
        throw new Error("File originale non trovato per l'analisi");
      }

      const response = await fetch("/admin/api/ocr", {
        method: "POST",
        body: formDataBody,
      });

      if (!response.ok) throw new Error("Errore risposta server AI");

      const aiData = await response.json();
      const rawBirthPlace = aiData.birth_place?.toUpperCase() || "";
      
      let extractedComune = rawBirthPlace;
      let extractedProv = formData.provincia_nascita;

      if (rawBirthPlace.includes('(')) {
        const parts = rawBirthPlace.split('(');
        extractedComune = parts[0].trim();
        extractedProv = parts[1].replace(')', '').trim();
      }

      setFormData((prev) => ({
        ...prev,
        nome: aiData.given_name?.toUpperCase() || prev.nome,
        cognome: aiData.family_name?.toUpperCase() || prev.cognome,
        patente_numero: aiData.document_id?.toUpperCase() || prev.patente_numero,
        data_nascita: formattaPerInputDate(aiData.birth_date) || prev.data_nascita,
        patente_scadenza: formattaPerInputDate(aiData.expiration_date) || prev.patente_scadenza,
        comune_nascita: extractedComune || prev.comune_nascita,
        provincia_nascita: extractedProv || prev.provincia_nascita
      }));

      toast.success("Dati estratti con successo", { id: tid });
    } catch (error) {
      toast.error("Impossibile analizzare il file. Riprova il caricamento.", { id: tid });
    } finally {
      setIsScanning(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanData = { ...formData, sesso: sessoLocale as 'M' | 'F' };
    
    const dateFields = ['documento_scadenza', 'patente_scadenza', 'data_nascita'];
    dateFields.forEach(field => {
      if ((cleanData as any)[field] === "") (cleanData as any)[field] = null;
    });

    onSubmit(cleanData);
  };

  return {
    formData, setFormData, isScanning, patenteInputRef, documentoInputRef,
    patenteUrlView, documentoUrlView, sessoLocale, setSessoLocale,
    tipoCittadinanza, setTipoCittadinanza, handleCalcolaCF,
    handleTriggerOcr, handleUploadFile, handleFormSubmit
  };
}