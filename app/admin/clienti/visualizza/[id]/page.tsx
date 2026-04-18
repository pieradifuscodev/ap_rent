"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Cliente } from "../../types";
import { storageService } from "../../services/storageService";
import { 
  ArrowLeft, Pencil, Download, User, 
  MapPin, Mail, Phone, CreditCard, ShieldCheck, ShieldAlert,
  FileText, Image as ImageIcon
} from "lucide-react";

export default function VisualizzaCliente() {
  const { id } = useParams();
  const router = useRouter();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  
  // Stati per le varie anteprime
  const [patenteUrl, setPatenteUrl] = useState<string | null>(null);
  const [documentoUrl, setDocumentoUrl] = useState<string | null>(null);
  const [documentoRetroUrl, setDocumentoRetroUrl] = useState<string | null>(null);

  useEffect(() => {
    async function loadCliente() {
      const { data } = await supabase.from('customers').select('*').eq('id', id).single();
      if (data) {
        setCliente(data);
        
        // Carica Patente
        if (data.patente_url) {
          storageService.getSecureUrl(data.patente_url).then(setPatenteUrl);
        }
        
        // Carica Documento Identità (Fronte)
        if (data.documento_url) {
          storageService.getSecureUrl(data.documento_url).then(setDocumentoUrl);
        }

        // Carica Documento Identità (Retro) - Assicurati che il campo esista nel DB
        if (data.documento_retro_url) {
          storageService.getSecureUrl(data.documento_retro_url).then(setDocumentoRetroUrl);
        }
      }
    }
    loadCliente();
  }, [id]);

  if (!cliente) return <div className="p-10 text-center uppercase font-black text-slate-400">Caricamento...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* HEADER AZIONI */}
      <div className="flex justify-between items-center">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors font-black text-[10px] uppercase">
          <ArrowLeft size={16} /> Torna all'elenco
        </button>
        <button 
          onClick={() => router.push(`/admin/clienti/modifica/${id}`)}
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-black text-[10px] uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20"
        >
          <Pencil size={16} /> Modifica Anagrafica
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* COLONNA SINISTRA: DATI ANAGRAFICI */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-5 mb-10">
              <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center transition-colors ${cliente.is_blacklisted ? 'bg-rose-50 text-rose-500' : 'bg-blue-50 text-blue-500'}`}>
                <User size={40} strokeWidth={1.5} />
              </div>
              <div>
                <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-900 leading-none mb-3">
                  {cliente.nome} {cliente.cognome}
                </h1>
                <div className="flex items-center gap-3">
                  {cliente.is_blacklisted ? (
                    <span className="bg-rose-500 text-white text-[9px] font-black uppercase px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                      <ShieldAlert size={12} /> Blacklisted
                    </span>
                  ) : (
                    <span className="bg-emerald-500 text-white text-[9px] font-black uppercase px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                      <ShieldCheck size={12} /> Cliente Affidabile
                    </span>
                  )}
                  <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                    CF: {cliente.codice_fiscale}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
              <DataBlock icon={<Mail size={18}/>} label="Email Personale" value={cliente.email} />
              <DataBlock icon={<Phone size={18}/>} label="Recapito Telefonico" value={cliente.telefono} />
              <DataBlock icon={<MapPin size={18}/>} label="Indirizzo Residenza" value={`${cliente.indirizzo}, ${cliente.cap} ${cliente.citta} (${cliente.provincia})`} />
              <DataBlock icon={<ImageIcon size={18}/>} label="Nascita" value={`${cliente.data_nascita} - ${cliente.comune_nascita}`} />
              <DataBlock icon={<CreditCard size={18}/>} label="Patente N°" value={cliente.patente_numero} extra={`Scad: ${cliente.patente_scadenza}`} />
              <DataBlock icon={<FileText size={18}/>} label="Documento Identità" value={cliente.documento_numero} extra={`Scad: ${cliente.documento_scadenza}`} />
            </div>
          </div>
        </div>

        {/* COLONNA DESTRA: DOCUMENTI CARICATI (GALLERIA) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white space-y-8 sticky top-8">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-blue-400 flex items-center gap-2">
               Documenti Digitalizzati
            </h2>
            
            <div className="space-y-8">
              {/* SEZIONE PATENTE */}
              <DocumentPreview 
                title="Patente di Guida" 
                url={patenteUrl} 
                icon={<CreditCard size={16} />} 
              />

              {/* SEZIONE CARTA IDENTITÀ (FRONTE) */}
              <DocumentPreview 
                title="Carta Identità (Fronte)" 
                url={documentoUrl} 
                icon={<FileText size={16} />} 
              />

              {/* SEZIONE CARTA IDENTITÀ (RETRO) */}
              {documentoRetroUrl && (
                <DocumentPreview 
                  title="Carta Identità (Retro)" 
                  url={documentoRetroUrl} 
                  icon={<FileText size={16} />} 
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sotto-componente per i blocchi dati
function DataBlock({ icon, label, value, extra }: { icon: any, label: string, value: any, extra?: string }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-slate-400 font-black text-[9px] uppercase tracking-widest">
        {icon} {label}
      </div>
      <div className="flex flex-col">
        <span className="text-[13px] font-bold text-slate-800 uppercase break-words">
          {value || 'Non inserito'}
        </span>
        {extra && <span className="text-[10px] text-blue-600 font-bold mt-0.5">{extra}</span>}
      </div>
    </div>
  );
}

// Sotto-componente per le anteprime documenti
function DocumentPreview({ title, url, icon }: { title: string, url: string | null, icon: any }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
          {icon} {title}
        </span>
        {url && (
          <button 
            onClick={() => window.open(url, '_blank')}
            className="text-[9px] font-black uppercase text-blue-400 hover:text-blue-300 transition-colors"
          >
            Ingrandisci
          </button>
        )}
      </div>
      
      <div className="aspect-video bg-slate-800 rounded-2xl overflow-hidden border border-slate-700/50 group relative">
        {url ? (
          <img src={url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={title} />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 space-y-2">
             <ImageIcon size={24} strokeWidth={1} />
             <span className="text-[9px] font-black uppercase">Non caricato</span>
          </div>
        )}
      </div>

      {url && (
        <button 
          onClick={() => window.open(url, '_blank')}
          className="w-full bg-slate-800 py-3.5 rounded-xl flex items-center justify-center gap-3 font-black uppercase text-[9px] tracking-widest hover:bg-slate-700 transition-all border border-slate-700"
        >
          <Download size={14} /> Scarica Originale
        </button>
      )}
    </div>
  );
}