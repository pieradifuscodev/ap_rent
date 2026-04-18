"use client";

import { Save, Ban, Loader2, RefreshCw, CreditCard, UserCheck, UploadCloud, Camera, Trash2, Globe, MapPin, Sparkles, AlertCircle, ScanEye } from "lucide-react";
import { useClientForm } from "../hooks/useClientForm";
import { useState, useEffect } from "react";

// SmartInput dichiarato fuori per evitare reset dello stato durante il render
const SmartInput = ({ label, value, onChange, placeholder, type = "text", required = false, maxLength, isAiField = false, isAiGenerated, inputClass, aiInputClass, labelClass }: any) => (
  <div className="relative">
    <label className={labelClass}>{label}</label>
    <div className="relative">
      <input 
        type={type} 
        required={required} 
        maxLength={maxLength} 
        value={value || ""} 
        onChange={onChange} 
        placeholder={placeholder}
        className={`${inputClass} ${isAiField && isAiGenerated ? aiInputClass : ""}`} 
      />
      {isAiField && isAiGenerated && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-amber-100 text-amber-700 px-2 py-1 rounded-lg border border-amber-200 animate-pulse">
          <Sparkles size={10} /><span className="text-[8px] font-black uppercase">AI</span>
        </div>
      )}
    </div>
  </div>
);

export default function ClientForm({ initialData, onSubmit, loading }: any) {
  const {
    formData, setFormData, isScanning, patenteInputRef, documentoInputRef,
    patenteUrlView, documentoUrlView, sessoLocale, setSessoLocale,
    tipoCittadinanza, setTipoCittadinanza, handleCalcolaCF,
    handleTriggerOcr, handleUploadFile, handleFormSubmit
  } = useClientForm(initialData, onSubmit);

  const [isAiGenerated, setIsAiGenerated] = useState(false);
  
  useEffect(() => { 
    if (isScanning) setIsAiGenerated(true); 
  }, [isScanning]);

  const inputClass = "w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all uppercase tracking-wider";
  const aiInputClass = "border-amber-200 bg-amber-50/30 focus:border-amber-500 focus:ring-amber-500/10";
  const labelClass = "ml-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block";
  const errorLabelClass = "text-[9px] text-rose-500 font-bold mt-2 ml-4 animate-in fade-in slide-in-from-top-1 uppercase flex items-center gap-1";
  const sharedProps = { isAiGenerated, inputClass, aiInputClass, labelClass };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-8 space-y-8">
        <form className="space-y-8" id="client-form" onSubmit={handleFormSubmit}>
          
          {/* CITTADINANZA */}
          <div className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm">
            <label className={labelClass}>Tipo Cittadinanza / Provenienza Documento</label>
            <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl">
              {(['ITA', 'EU', 'EXTRA'] as const).map((t) => (
                <button 
                  key={t} 
                  type="button" 
                  onClick={() => { 
                    setTipoCittadinanza(t); 
                    setFormData({ ...formData, tipo_cittadinanza: t }); 
                  }} 
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black transition-all ${
                    tipoCittadinanza === t ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {t === 'ITA' ? '🇮🇹 ITA' : t === 'EU' ? '🇪🇺 EU' : '🌎 EXTRA'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* BOX PATENTE */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
              <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                <h2 className="text-lg font-black uppercase tracking-tighter text-slate-900 flex items-center gap-2"><CreditCard className="text-blue-500" size={20} /> Patente</h2>
                <div className="flex gap-2">
                  {formData.patente_url && (
                    <button 
                      type="button" 
                      onClick={handleTriggerOcr} 
                      disabled={isScanning} 
                      className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-xl font-black text-[9px] uppercase hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
                    >
                      {isScanning ? <Loader2 className="animate-spin" size={14} /> : <ScanEye size={14} />} 
                      {isScanning ? "Analisi..." : "Analizza con AI"}
                    </button>
                  )}
                  <button type="button" onClick={() => patenteInputRef.current?.click()} className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100"><Camera size={18} /></button>
                </div>
              </div>

              {!formData.patente_url ? (
                <div onClick={() => patenteInputRef.current?.click()} className="border-2 border-dashed border-slate-200 rounded-3xl p-10 flex flex-col items-center gap-3 cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600"><UploadCloud size={24} /></div>
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-tight text-center">Carica foto per abilitare l'AI</span>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative aspect-video bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 group">
                    {patenteUrlView ? <img src={patenteUrlView} className="w-full h-full object-cover" alt="Patente" /> : <div className="w-full h-full flex items-center justify-center"><Loader2 className="animate-spin text-slate-300" /></div>}
                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button type="button" onClick={() => setFormData({...formData, patente_url: ''})} className="p-3 bg-rose-500 text-white rounded-xl hover:scale-110 transition-transform"><Trash2 size={20} /></button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <SmartInput {...sharedProps} label="N° Patente" value={formData.patente_numero} isAiField onChange={(e:any) => setFormData({...formData, patente_numero: e.target.value.toUpperCase()})} />
                    <SmartInput {...sharedProps} label="Scadenza" type="date" value={formData.patente_scadenza} isAiField onChange={(e:any) => setFormData({...formData, patente_scadenza: e.target.value})} />
                  </div>
                </div>
              )}
            </div>

            {/* BOX IDENTITÀ */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
              <h2 className="text-lg font-black uppercase tracking-tighter text-slate-900 border-b border-slate-50 pb-4 flex items-center gap-2"><UserCheck className="text-emerald-500" size={20} /> Identità</h2>
              {!formData.documento_url ? (
                <div onClick={() => documentoInputRef.current?.click()} className="border-2 border-dashed border-slate-200 rounded-3xl p-10 flex flex-col items-center gap-3 cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 transition-all">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600"><UploadCloud size={24} /></div>
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-tight text-center">Carica Identità</span>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative aspect-video bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 group">
                    {documentoUrlView ? <img src={documentoUrlView} className="w-full h-full object-cover" alt="Documento" /> : <div className="w-full h-full flex items-center justify-center"><Loader2 className="animate-spin text-slate-300" /></div>}
                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button type="button" onClick={() => setFormData({...formData, documento_url: ''})} className="p-3 bg-rose-500 text-white rounded-xl hover:scale-110 transition-transform"><Trash2 size={20} /></button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <SmartInput {...sharedProps} label="N° Documento" value={formData.documento_numero} onChange={(e:any) => setFormData({...formData, documento_numero: e.target.value.toUpperCase()})} />
                    <SmartInput {...sharedProps} label="Scadenza" type="date" value={formData.documento_scadenza} onChange={(e:any) => setFormData({...formData, documento_scadenza: e.target.value})} />
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* ANAGRAFICA NASCITA */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
            <h2 className="text-lg font-black uppercase tracking-tighter text-slate-900 border-b border-slate-50 pb-4">Anagrafica Nascita</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 flex gap-2 p-1 bg-slate-100 rounded-xl w-fit">
                {(['M', 'F'] as const).map((s) => (
                  <button 
                    key={s} 
                    type="button" 
                    onClick={() => setSessoLocale(s)} 
                    className={`px-6 py-2 rounded-lg text-[10px] font-black transition-all ${
                      sessoLocale === s ? "bg-white text-blue-600 shadow-sm" : "text-slate-400"
                    }`}
                  >
                    {s === 'M' ? "UOMO" : "DONNA"}
                  </button>
                ))}
              </div>
              <SmartInput {...sharedProps} label="Nome" required isAiField value={formData.nome} onChange={(e:any) => setFormData({...formData, nome: e.target.value.toUpperCase()})} />
              <SmartInput {...sharedProps} label="Cognome" required isAiField value={formData.cognome} onChange={(e:any) => setFormData({...formData, cognome: e.target.value.toUpperCase()})} />
              <div className="md:col-span-2 relative">
                <SmartInput {...sharedProps} label={tipoCittadinanza === 'ITA' ? "Codice Fiscale" : "ID Estero / CF"} required maxLength={tipoCittadinanza === 'ITA' ? 16 : undefined} value={formData.codice_fiscale} onChange={(e:any) => setFormData({...formData, codice_fiscale: e.target.value.toUpperCase()})} />
                {tipoCittadinanza === 'ITA' && (
                  <button type="button" onClick={handleCalcolaCF} className="absolute right-2 bottom-4 bg-blue-50 text-blue-600 p-2.5 rounded-xl flex items-center gap-2 hover:bg-blue-100 transition-colors"><RefreshCw size={14} /><span className="text-[9px] font-black uppercase">Calcola</span></button>
                )}
              </div>
              <SmartInput {...sharedProps} label="Data Nascita" type="date" isAiField value={formData.data_nascita} onChange={(e:any) => setFormData({...formData, data_nascita: e.target.value})} />
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:col-span-1">
                <div className="md:col-span-8"><SmartInput {...sharedProps} label="Comune Nascita" isAiField value={formData.comune_nascita} onChange={(e:any) => setFormData({...formData, comune_nascita: e.target.value.toUpperCase()})} /></div>
                <div className="md:col-span-4"><SmartInput {...sharedProps} label="Prov." maxLength={2} isAiField value={formData.provincia_nascita} onChange={(e:any) => setFormData({...formData, provincia_nascita: e.target.value.toUpperCase()})} /></div>
              </div>
            </div>
          </div>

          {/* RESIDENZA */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
            <h2 className="text-lg font-black uppercase tracking-tighter text-slate-900 border-b border-slate-50 pb-4 flex items-center gap-2"><MapPin className="text-blue-500" size={20} /> Residenza</h2>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-8"><SmartInput {...sharedProps} label="Indirizzo" value={formData.indirizzo} onChange={(e:any) => setFormData({...formData, indirizzo: e.target.value.toUpperCase()})} /></div>
              <div className="md:col-span-4">
                <SmartInput {...sharedProps} label="CAP" value={formData.cap} onChange={(e:any) => setFormData({...formData, cap: e.target.value})} />
                {tipoCittadinanza === 'ITA' && formData.cap && !/^[0-9]{5}$/.test(formData.cap) && (<p className={errorLabelClass}><AlertCircle size={10} /> 5 numeri richiesti</p>)}
              </div>
              <div className="md:col-span-8"><SmartInput {...sharedProps} label="Città" value={formData.citta} onChange={(e:any) => setFormData({...formData, citta: e.target.value.toUpperCase()})} /></div>
              <div className="md:col-span-4"><SmartInput {...sharedProps} label="Prov." maxLength={2} value={formData.provincia} onChange={(e:any) => setFormData({...formData, provincia: e.target.value.toUpperCase()})} /></div>
            </div>
          </div>

          {/* CONTATTI */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
            <h2 className="text-lg font-black uppercase tracking-tighter text-slate-900 border-b border-slate-50 pb-4">Contatti</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SmartInput {...sharedProps} label="Telefono" value={formData.telefono} onChange={(e:any) => setFormData({...formData, telefono: e.target.value})} />
              <SmartInput {...sharedProps} label="Email" type="email" value={formData.email} onChange={(e:any) => setFormData({...formData, email: e.target.value.toLowerCase()})} />
            </div>
          </div>
        </form>
      </div>

      {/* AZIONI SIDEBAR */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white space-y-4 shadow-2xl sticky top-8">
          <button type="submit" form="client-form" disabled={loading} className="w-full bg-blue-600 py-5 rounded-2xl flex items-center justify-center gap-3 font-black uppercase text-[10px] tracking-widest hover:bg-blue-500 transition-all shadow-lg active:scale-95 disabled:opacity-50">
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} {loading ? "SALVATAGGIO..." : "SALVA CLIENTE"}
          </button>
          <button type="button" onClick={() => setFormData({...formData, is_blacklisted: !formData.is_blacklisted})}
            className={`w-full py-5 rounded-2xl flex items-center justify-center gap-3 font-black uppercase text-[10px] tracking-widest border-2 transition-all ${formData.is_blacklisted ? "bg-rose-500 border-rose-500 shadow-rose-500/20 shadow-lg" : "border-slate-700 text-slate-400 hover:border-rose-500 hover:text-rose-500"}`}>
            <Ban size={18} /> {formData.is_blacklisted ? "IN BLACKLIST" : "METTI IN BLACKLIST"}
          </button>
        </div>
      </div>

      {/* INPUT FILE NASCOSTI */}
      <input type="file" ref={patenteInputRef} className="hidden" accept="image/*" onChange={(e) => handleUploadFile(e, 'patente')} />
      <input type="file" ref={documentoInputRef} className="hidden" accept="image/*" onChange={(e) => handleUploadFile(e, 'documento')} />
    </div>
  );
}