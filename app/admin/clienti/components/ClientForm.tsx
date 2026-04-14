"use client";

import { useState, useRef, useEffect } from "react";
import { createWorker } from "tesseract.js";
import CodiceFiscale from "codice-fiscale-js";
import { 
  Camera, Save, Ban, Loader2, FileText, 
  Download, Eye, Trash2, RefreshCw, CreditCard, UserCheck, UploadCloud
} from "lucide-react";
import { storageService } from "../services/storageService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ClientForm({ initialData, onSubmit, loading }: any) {
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(false);
  
  // Ref separati per i file
  const patenteInputRef = useRef<HTMLInputElement>(null);
  const documentoInputRef = useRef<HTMLInputElement>(null);

  const [patenteUrlView, setPatenteUrlView] = useState<string | null>(null);
  const [documentoUrlView, setDocumentoUrlView] = useState<string | null>(null);

  // Stati locali per calcoli e UI (non inviati al DB)
  const [sessoLocale, setSessoLocale] = useState('M');
  const [rilasciataDaLocale, setRilasciataDaLocale] = useState('');

  const [formData, setFormData] = useState(initialData || {
    nome: '', 
    cognome: '', 
    ragione_sociale: '', 
    codice_fiscale: '', 
    partita_iva: '',
    email: '', 
    telefono: '', 
    indirizzo: '', 
    citta: '', 
    cap: '',
    documento_numero: '', 
    documento_scadenza: '',
    patente_numero: '', 
    patente_categoria: 'B', 
    patente_scadenza: '',
    data_nascita: '', 
    comune_nascita: '', 
    patente_url: '',
    documento_url: '', 
    is_blacklisted: false
  });

  const inputClass = "w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all uppercase tracking-wider";
  const labelClass = "ml-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block";

  // Gestione URL sicuri per le anteprime
  useEffect(() => {
    if (formData.patente_url) {
      storageService.getSecureUrl(formData.patente_url).then(setPatenteUrlView);
    } else {
      setPatenteUrlView(null);
    }
    if (formData.documento_url) {
      storageService.getSecureUrl(formData.documento_url).then(setDocumentoUrlView);
    } else {
      setDocumentoUrlView(null);
    }
  }, [formData.patente_url, formData.documento_url]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanData = { ...formData };
    const dateFields = ['documento_scadenza', 'patente_scadenza', 'data_nascita'];
    dateFields.forEach(field => {
      if (cleanData[field] === "") cleanData[field] = null;
    });
    delete (cleanData as any).sesso;
    onSubmit(cleanData);
  };

  const handleCalcolaCF = () => {
    try {
      const { nome, cognome, data_nascita, comune_nascita } = formData;
      if (nome && cognome && data_nascita && comune_nascita) {
        const birthDate = new Date(data_nascita);
        if (isNaN(birthDate.getTime())) return toast.error("Data nascita non valida");
        const comuneInput = comune_nascita.split('(')[0].trim().toUpperCase();
        const cf = new CodiceFiscale({
          name: nome.trim(),
          surname: cognome.trim(),
          gender: sessoLocale as "M" | "F",
          day: birthDate.getDate(),
          month: birthDate.getMonth() + 1,
          year: birthDate.getFullYear(),
          birthplace: comuneInput,
          birthplaceProvincia: "" 
        });
        setFormData((prev: any) => ({ ...prev, codice_fiscale: cf.toString() }));
        toast.success("Codice Fiscale generato");
      } else {
        toast.error("Dati mancanti per il calcolo");
      }
    } catch (e) {
      toast.error("Errore nel calcolo del CF");
    }
  };

  const parseLicenseText = (text: string) => {
    const lines = text.split('\n');
    const extracted: any = {};
    lines.forEach(line => {
      const cleanLine = line.replace(/[|]/g, '').trim();
      if (/^1[\.\s]/.test(cleanLine)) extracted.cognome = cleanLine.replace(/^1[\.\s]/, '').trim().toUpperCase();
      if (/^2[\.\s]/.test(cleanLine)) extracted.nome = cleanLine.replace(/^2[\.\s]/, '').trim().toUpperCase();
      if (/^3[\.\s]/.test(cleanLine)) {
        const dateMatch = cleanLine.match(/\d{2}[\/\.-]\d{2}[\/\.-]\d{2,4}/);
        if (dateMatch) {
          let parts = dateMatch[0].replace(/[\.\/]/g, '-').split('-');
          if (parts[2].length === 2) parts[2] = parseInt(parts[2]) > 40 ? `19${parts[2]}` : `20${parts[2]}`;
          extracted.data_nascita = `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
        extracted.comune_nascita = cleanLine.replace(/^3[\.\s]/, '').replace(/\d{2}[\/\.-]\d{2}[\/\.-]\d{2,4}/, '').trim().toUpperCase();
      }
      if (/4b[\.\s]/.test(cleanLine)) {
        const match = cleanLine.match(/\d{2}[\/\.-]\d{2}[\/\.-]\d{4}/);
        if (match) {
          const p = match[0].replace(/[\.\/]/g, '-').split('-');
          extracted.patente_scadenza = `${p[2]}-${p[1]}-${p[0]}`;
        }
      }
      if (/4c[\.\s]/.test(cleanLine)) setRilasciataDaLocale(cleanLine.replace(/.*4c[\.\s]/, '').trim().toUpperCase());
      if (/^5[\.\s]/.test(cleanLine)) extracted.patente_numero = cleanLine.replace(/^5[\.\s]/, '').trim().toUpperCase();
    });
    return extracted;
  };

  const handlePatenteScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsScanning(true);
    const tid = toast.loading("Analisi patente...");
    try {
      const path = await storageService.uploadPatente(file);
      const worker = await createWorker('ita');
      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();
      const ext = parseLicenseText(text);
      setFormData((p: any) => ({ ...p, ...ext, patente_url: path }));
      toast.success("Dati estratti", { id: tid });
    } catch (error) {
      toast.error("Errore scansione", { id: tid });
    } finally { 
      setIsScanning(false); 
      if (patenteInputRef.current) patenteInputRef.current.value = ""; 
    }
  };

  const handleDocumentoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const tid = toast.loading("Caricamento documento...");
    try {
      const path = await storageService.uploadPatente(file);
      setFormData((p: any) => ({ ...p, documento_url: path }));
      toast.success("Documento caricato", { id: tid });
    } catch (error) {
      toast.error("Errore caricamento", { id: tid });
    } finally {
      if (documentoInputRef.current) documentoInputRef.current.value = "";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-8 space-y-8">
        <form className="space-y-8" id="client-form" onSubmit={handleFormSubmit}>
          
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
            <h2 className="text-lg font-black uppercase tracking-tighter text-slate-900 border-b border-slate-50 pb-4">Anagrafica</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 flex gap-2 p-1 bg-slate-100 rounded-xl w-fit">
                {['M', 'F'].map((s) => (
                  <button key={s} type="button" onClick={() => setSessoLocale(s)}
                    className={`px-6 py-2 rounded-lg text-[10px] font-black transition-all ${sessoLocale === s ? "bg-white text-blue-600 shadow-sm" : "text-slate-400"}`}>
                    {s === 'M' ? "UOMO" : "DONNA"}
                  </button>
                ))}
              </div>
              <div><label className={labelClass}>Nome</label><input className={inputClass} required value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value.toUpperCase()})} /></div>
              <div><label className={labelClass}>Cognome</label><input className={inputClass} required value={formData.cognome} onChange={e => setFormData({...formData, cognome: e.target.value.toUpperCase()})} /></div>
              <div className="md:col-span-2 relative">
                <label className={labelClass}>Codice Fiscale</label>
                <div className="relative">
                  <input className={inputClass} required value={formData.codice_fiscale} onChange={e => setFormData({...formData, codice_fiscale: e.target.value.toUpperCase()})} />
                  <button type="button" onClick={handleCalcolaCF} className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-50 text-blue-600 p-2.5 rounded-xl flex items-center gap-2">
                    <RefreshCw size={14} /> <span className="text-[9px] font-black uppercase">Calcola</span>
                  </button>
                </div>
              </div>
              <div><label className={labelClass}>Data di Nascita</label><input type="date" className={inputClass} value={formData.data_nascita} onChange={e => setFormData({...formData, data_nascita: e.target.value})} /></div>
              <div><label className={labelClass}>Comune di Nascita</label><input className={inputClass} value={formData.comune_nascita} onChange={e => setFormData({...formData, comune_nascita: e.target.value.toUpperCase()})} /></div>
            </div>
          </div>

          {/* BOX DOCUMENTI (PATENTE E IDENTITÀ) NELLA COLONNA DI SINISTRA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* BOX PATENTE CON SCANNER */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
              <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                <h2 className="text-lg font-black uppercase tracking-tighter text-slate-900 flex items-center gap-2">
                  <CreditCard className="text-blue-500" size={20} /> Patente
                </h2>
                {formData.patente_url && (
                  <button type="button" onClick={() => patenteInputRef.current?.click()} className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors">
                    <Camera size={18} />
                  </button>
                )}
              </div>

              {!formData.patente_url ? (
                <div 
                  onClick={() => patenteInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 rounded-3xl p-10 flex flex-col items-center gap-3 cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all group"
                >
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                    {isScanning ? <Loader2 className="animate-spin" /> : <UploadCloud size={24} />}
                  </div>
                  <span className="text-[10px] font-black uppercase text-slate-400 text-center">Fai una foto o scannerizza la patente</span>
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in zoom-in duration-300">
                  <div className="relative aspect-video bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 group">
                    {patenteUrlView ? (
                      <img src={patenteUrlView} alt="Patente" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><Loader2 className="animate-spin text-slate-300" /></div>
                    )}
                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button type="button" onClick={() => setFormData({...formData, patente_url: ''})} className="p-3 bg-rose-500 text-white rounded-xl hover:scale-110 transition-transform"><Trash2 size={20} /></button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div><label className={labelClass}>N° Patente</label><input className={inputClass} value={formData.patente_numero} onChange={e => setFormData({...formData, patente_numero: e.target.value.toUpperCase()})} /></div>
                    <div><label className={labelClass}>Scadenza</label><input type="date" className={inputClass} value={formData.patente_scadenza} onChange={e => setFormData({...formData, patente_scadenza: e.target.value})} /></div>
                  </div>
                </div>
              )}
            </div>

            {/* BOX CARTA IDENTITÀ */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
              <h2 className="text-lg font-black uppercase tracking-tighter text-slate-900 border-b border-slate-50 pb-4 flex items-center gap-2">
                <UserCheck className="text-emerald-500" size={20} /> Identità
              </h2>

              {!formData.documento_url ? (
                <div 
                  onClick={() => documentoInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 rounded-3xl p-10 flex flex-col items-center gap-3 cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 transition-all group"
                >
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                    <UploadCloud size={24} />
                  </div>
                  <span className="text-[10px] font-black uppercase text-slate-400 text-center">Carica fronte documento d'identità</span>
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in zoom-in duration-300">
                  <div className="relative aspect-video bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 group">
                    {documentoUrlView ? (
                      <img src={documentoUrlView} alt="Documento" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><Loader2 className="animate-spin text-slate-300" /></div>
                    )}
                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button type="button" onClick={() => setFormData({...formData, documento_url: ''})} className="p-3 bg-rose-500 text-white rounded-xl hover:scale-110 transition-transform"><Trash2 size={20} /></button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div><label className={labelClass}>N° Documento</label><input className={inputClass} value={formData.documento_numero} onChange={e => setFormData({...formData, documento_numero: e.target.value.toUpperCase()})} /></div>
                    <div><label className={labelClass}>Scadenza</label><input type="date" className={inputClass} value={formData.documento_scadenza} onChange={e => setFormData({...formData, documento_scadenza: e.target.value})} /></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
            <h2 className="text-lg font-black uppercase tracking-tighter text-slate-900 border-b border-slate-50 pb-4">Contatti & Azienda</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2"><label className={labelClass}>Ragione Sociale</label><input className={inputClass} value={formData.ragione_sociale} onChange={e => setFormData({...formData, ragione_sociale: e.target.value.toUpperCase()})} /></div>
              <div><label className={labelClass}>Partita IVA</label><input className={inputClass} value={formData.partita_iva} onChange={e => setFormData({...formData, partita_iva: e.target.value})} /></div>
              <div><label className={labelClass}>Telefono</label><input className={inputClass} value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} /></div>
              <div className="md:col-span-2"><label className={labelClass}>Email</label><input type="email" className={inputClass} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value.toLowerCase()})} /></div>
            </div>
          </div>
        </form>
      </div>

      <div className="lg:col-span-4 space-y-6">
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white space-y-4">
          <button type="submit" form="client-form" disabled={loading} className="w-full bg-blue-600 py-5 rounded-2xl flex items-center justify-center gap-3 font-black uppercase text-[10px] tracking-widest shadow-lg transition-all active:scale-95">
            <Save size={18} /> {loading ? "SALVATAGGIO..." : "SALVA CLIENTE"}
          </button>
          <button type="button" onClick={() => setFormData({...formData, is_blacklisted: !formData.is_blacklisted})}
            className={`w-full py-5 rounded-2xl flex items-center justify-center gap-3 font-black uppercase text-[10px] tracking-widest border-2 transition-all ${formData.is_blacklisted ? "bg-rose-500 border-rose-500" : "border-slate-700 text-slate-400 hover:border-rose-500 hover:text-rose-500"}`}>
            <Ban size={18} /> {formData.is_blacklisted ? "IN BLACKLIST" : "METTI IN BLACKLIST"}
          </button>
        </div>
      </div>

      {/* Input file nascosti */}
      <input type="file" ref={patenteInputRef} className="hidden" accept="image/*" onChange={handlePatenteScan} />
      <input type="file" ref={documentoInputRef} className="hidden" accept="image/*" onChange={handleDocumentoUpload} />
    </div>
  );
}