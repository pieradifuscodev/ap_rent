"use client";

import { useState } from "react";
import { Veicolo, VeicoloTariffe } from "../types";
import Input from "../../components/ui/Input";
import Card from "../../components/ui/Card";
import ActionSidebar from "../../components/ui/ActionSidebar";

interface VehicleFormProps {
  initialData?: Veicolo;
  onSubmit: (data: Omit<Veicolo, 'id' | 'created_at'>) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

export default function VehicleForm({ initialData, onSubmit, onCancel, loading }: VehicleFormProps) {
  const defaultTariffe: VeicoloTariffe = {
    bassa: { giornaliero: 0, settimanale: 0 },
    media: { giornaliero: 0, settimanale: 0 },
    alta: { giornaliero: 0, settimanale: 0 }
  };

  // ✅ Inizializzazione Lazy: viene eseguita solo al primo montaggio
  const [formData, setFormData] = useState<Omit<Veicolo, 'id' | 'created_at'>>(() => {
    return {
      marca: initialData?.marca || "",
      modello: initialData?.modello || "",
      targa: initialData?.targa || "",
      immatricolazione: initialData?.immatricolazione || "",
      proprietario: initialData?.proprietario || "",
      tipo: initialData?.tipo || "auto",
      stato: initialData?.stato || "disponibile",
      km_attuali: initialData?.km_attuali || 0,
      tipo_carburante: initialData?.tipo_carburante || "",
      capacita_carburante: initialData?.capacita_carburante || 0,
      totale_tacche: initialData?.totale_tacche || 8,
      scadenza_assicurazione: initialData?.scadenza_assicurazione || "",
      scadenza_bollo: initialData?.scadenza_bollo || "",
      scadenza_revisione: initialData?.scadenza_revisione || "",
      note: initialData?.note || "",
      tariffe: {
        bassa: { ...defaultTariffe.bassa, ...(initialData?.tariffe?.bassa || {}) },
        media: { ...defaultTariffe.media, ...(initialData?.tariffe?.media || {}) },
        alta: { ...defaultTariffe.alta, ...(initialData?.tariffe?.alta || {}) }
      }
    };
  });

  const isBici = formData.tipo === 'bici_elettrica';

  const updateTariffa = (stagione: keyof VeicoloTariffe, campo: 'giornaliero' | 'settimanale', valore: string) => {
    const numVal = parseFloat(valore) || 0;
    setFormData(prev => ({
      ...prev,
      tariffe: { 
        ...prev.tariffe, 
        [stagione]: { 
          ...prev.tariffe[stagione], 
          [campo]: numVal 
        } 
      }
    }));
  };

  return (
    <form 
      onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} 
      className="flex flex-col xl:flex-row gap-10 items-start w-full max-w-none font-sans"
    >
      <div className="flex-1 space-y-10 w-full">
        
        {/* 1. IDENTIFICAZIONE */}
        <Card title="1. Identificazione Mezzo">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Input 
              label="Tipo Mezzo" 
              as="select" 
              value={formData.tipo} 
              onChange={e => setFormData({...formData, tipo: e.target.value as Veicolo['tipo']})}
            >
              <option value="auto">Automobile</option>
              <option value="scooter">Scooter</option>
              <option value="bici_elettrica">Bici Elettrica</option>
            </Input>
            <Input label="Marca" required value={formData.marca} onChange={e => setFormData({...formData, marca: e.target.value})} placeholder="Es: Specialized" />
            <Input label="Modello" required value={formData.modello} onChange={e => setFormData({...formData, modello: e.target.value})} placeholder="Es: Turbo Levo" />
            
            {!isBici && (
              <>
                <Input 
                  label="Targa" 
                  required 
                  value={formData.targa} 
                  onChange={e => setFormData({
                    ...formData, 
                    targa: e.target.value.replace(/\s+/g, '').toUpperCase() 
                  })} 
                  placeholder="AA123BB" 
                />
                <Input label="Proprietario" value={formData.proprietario} onChange={e => setFormData({...formData, proprietario: e.target.value})} />
                <Input label="Data Immatricolazione" type="date" value={formData.immatricolazione} onChange={e => setFormData({...formData, immatricolazione: e.target.value})} />
              </>
            )}
          </div>
        </Card>

        {/* 2. PREZZI NOLEGGIO */}
        <Card title="2. Prezzi Noleggio (€)">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {(['bassa', 'media', 'alta'] as const).map(stagione => (
              <div key={stagione} className="space-y-6 p-8 bg-slate-50/50 rounded-3xl border border-slate-100">
                <div className="text-center font-bold uppercase text-[10px] tracking-widest text-slate-400 mb-2">{stagione} stagione</div>
                <Input 
                  label="Giorno" 
                  type="number" 
                  step="0.01" 
                  className="text-center font-bold" 
                  value={formData.tariffe[stagione]?.giornaliero ?? 0} 
                  onChange={e => updateTariffa(stagione, 'giornaliero', e.target.value)} 
                />
                <Input 
                  label="Settimana" 
                  type="number" 
                  step="0.01" 
                  className="text-center font-bold" 
                  value={formData.tariffe[stagione]?.settimanale ?? 0} 
                  onChange={e => updateTariffa(stagione, 'settimanale', e.target.value)} 
                />
              </div>
            ))}
          </div>
        </Card>

        {/* 3. SCADENZE & TECNICA */}
        {!isBici && (
          <Card title="3. Scadenze & Tecnica">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <Input label="Assicurazione" type="date" value={formData.scadenza_assicurazione} onChange={e => setFormData({...formData, scadenza_assicurazione: e.target.value})} />
              <Input label="Revisione" type="date" value={formData.scadenza_revisione} onChange={e => setFormData({...formData, scadenza_revisione: e.target.value})} />
              <Input label="Bollo" type="date" value={formData.scadenza_bollo} onChange={e => setFormData({...formData, scadenza_bollo: e.target.value})} />
              <Input 
                label="KM Attuali" 
                type="number" 
                value={formData.km_attuali} 
                onChange={e => setFormData({...formData, km_attuali: parseInt(e.target.value) || 0})} 
              />
            </div>
          </Card>
        )}

        {/* 4. NOTE */}
        <Card title={isBici ? "3. Note" : "4. Note"}>
          <Input 
            as="textarea" 
            rows={4} 
            value={formData.note} 
            onChange={e => setFormData({...formData, note: e.target.value})} 
            placeholder="Stato batteria, accessori inclusi, ecc..." 
          />
        </Card>
      </div>

      <ActionSidebar 
        onCancel={onCancel} 
        loading={loading}
        isSubmit={true}
        saveLabel={initialData ? "Aggiorna" : "Registra"}
        infoText={isBici ? "Per le bici non sono richieste targhe o documenti legali." : "Marca, Modello e Targa sono obbligatori per i veicoli a motore."}
      />
    </form>
  );
}