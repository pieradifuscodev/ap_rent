"use client";

import { useState } from "react";
import { Veicolo, VeicoloTariffe } from "../types";

interface VehicleFormProps {
  onSubmit: (data: Omit<Veicolo, 'id' | 'created_at'>) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

export default function VehicleForm({ onSubmit, onCancel, loading }: VehicleFormProps) {
  const [formData, setFormData] = useState<Omit<Veicolo, 'id' | 'created_at'>>({
    marca: "",
    modello: "",
    targa: "",
    immatricolazione: "",
    proprietario: "",
    tipo: "auto",
    stato: "disponibile",
    km_attuali: 0,
    tipo_carburante: "",
    capacita_carburante: 0,
    totale_tacche: 8,
    scadenza_assicurazione: "",
    scadenza_bollo: "",
    scadenza_revisione: "",
    note: "",
    tariffe: {
      bassa: { giornaliero: 0, settimanale: 0 },
      media: { giornaliero: 0, settimanale: 0 },
      alta: { giornaliero: 0, settimanale: 0 }
    }
  });

  const updateTariffa = (stagione: keyof VeicoloTariffe, campo: 'giornaliero' | 'settimanale', valore: string) => {
    const numVal = parseFloat(valore) || 0;
    setFormData(prev => ({
      ...prev,
      tariffe: {
        ...prev.tariffe,
        [stagione]: { ...prev.tariffe[stagione], [campo]: numVal }
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="admin-card space-y-8 animate-in fade-in duration-500">
      
      {/* SEZIONE 1: IDENTIFICAZIONE */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-b pb-2">Informazioni Base</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="admin-label">Marca</label>
            <input type="text" required className="admin-input" value={formData.marca} onChange={e => setFormData({...formData, marca: e.target.value})} placeholder="Es: Fiat" />
          </div>
          <div>
            <label className="admin-label">Modello</label>
            <input type="text" required className="admin-input" value={formData.modello} onChange={e => setFormData({...formData, modello: e.target.value})} placeholder="Es: Panda" />
          </div>
          <div>
            <label className="admin-label">Targa</label>
            <input type="text" required className="admin-input" value={formData.targa} onChange={e => setFormData({...formData, targa: e.target.value.toUpperCase()})} placeholder="AA123BB" />
          </div>
          <div>
            <label className="admin-label">Proprietario</label>
            <input type="text" className="admin-input" value={formData.proprietario} onChange={e => setFormData({...formData, proprietario: e.target.value})} />
          </div>
          <div>
            <label className="admin-label">Data Immatricolazione</label>
            <input type="date" className="admin-input" value={formData.immatricolazione} onChange={e => setFormData({...formData, immatricolazione: e.target.value})} />
          </div>
          <div>
            <label className="admin-label">Tipo Mezzo</label>
            <select className="admin-input" value={formData.tipo} onChange={e => setFormData({...formData, tipo: e.target.value as Veicolo['tipo']})}>
              <option value="auto">Auto</option>
              <option value="scooter">Scooter</option>
              <option value="bici_elettrica">Bici Elettrica</option>
            </select>
          </div>
        </div>
      </section>

      {/* SEZIONE 2: STATO E TECNICA */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-b pb-2">Dati Tecnici & Stato</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="admin-label">Stato Attuale</label>
            <select className="admin-input" value={formData.stato} onChange={e => setFormData({...formData, stato: e.target.value as Veicolo['stato']})}>
              <option value="disponibile">Disponibile</option>
              <option value="occupato">Occupato</option>
              <option value="manutenzione">In Manutenzione</option>
              <option value="sospeso">Sospeso</option>
            </select>
          </div>
          <div>
            <label className="admin-label">KM Attuali</label>
            <input type="number" className="admin-input" value={formData.km_attuali} onChange={e => setFormData({...formData, km_attuali: parseInt(e.target.value) || 0})} />
          </div>
          <div>
            <label className="admin-label">Carburante</label>
            <input type="text" className="admin-input" placeholder="Benzina, Diesel, Elettrica" value={formData.tipo_carburante} onChange={e => setFormData({...formData, tipo_carburante: e.target.value})} />
          </div>
          <div>
            <label className="admin-label">Capacità (L/kWh)</label>
            <input type="number" className="admin-input" value={formData.capacita_carburante} onChange={e => setFormData({...formData, capacita_carburante: parseFloat(e.target.value) || 0})} />
          </div>
          <div>
            <label className="admin-label">Totale Tacche</label>
            <input type="number" className="admin-input" value={formData.totale_tacche} onChange={e => setFormData({...formData, totale_tacche: parseInt(e.target.value) || 0})} />
          </div>
        </div>
      </section>

      {/* SEZIONE 3: TARIFFE */}
      <section className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
        <h3 className="text-sm font-bold text-blue-600 uppercase tracking-widest">Listino Prezzi (€)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(['bassa', 'media', 'alta'] as const).map(stagione => (
            <div key={stagione} className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-3">
              <label className="admin-label text-slate-900 capitalize text-center border-b pb-2">{stagione} Stagione</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Giorno</span>
                  <input type="number" className="admin-input text-center" value={formData.tariffe[stagione].giornaliero} onChange={e => updateTariffa(stagione, 'giornaliero', e.target.value)} />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Settimana</span>
                  <input type="number" className="admin-input text-center" value={formData.tariffe[stagione].settimanale} onChange={e => updateTariffa(stagione, 'settimanale', e.target.value)} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SEZIONE 4: SCADENZE E NOTE */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-b pb-2">Scadenze & Note</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="admin-label text-rose-500">Scadenza Assicurazione</label>
            <input type="date" className="admin-input border-rose-100" value={formData.scadenza_assicurazione} onChange={e => setFormData({...formData, scadenza_assicurazione: e.target.value})} />
          </div>
          <div>
            <label className="admin-label">Scadenza Bollo</label>
            <input type="date" className="admin-input" value={formData.scadenza_bollo} onChange={e => setFormData({...formData, scadenza_bollo: e.target.value})} />
          </div>
          <div>
            <label className="admin-label">Scadenza Revisione</label>
            <input type="date" className="admin-input" value={formData.scadenza_revisione} onChange={e => setFormData({...formData, scadenza_revisione: e.target.value})} />
          </div>
        </div>
        <div className="pt-2">
          <label className="admin-label">Note Aggiuntive</label>
          <textarea rows={3} className="admin-input resize-none" value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})} placeholder="Eventuali danni, accessori extra..." />
        </div>
      </section>

      {/* AZIONI */}
      <div className="flex justify-end gap-3 pt-6 border-t">
        <button type="button" onClick={onCancel} className="btn-secondary">Esci senza salvare</button>
        <button type="submit" disabled={loading} className="btn-primary min-w-[150px]">
          {loading ? "Inviando..." : "Salva Veicolo"}
        </button>
      </div>
    </form>
  );
}