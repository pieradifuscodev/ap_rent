"use client";

interface ActionSidebarProps {
  onSave?: () => void;
  onCancel: () => void;
  loading?: boolean;
  saveLabel?: string;
  isSubmit?: boolean; // Prop fondamentale per la validazione standard
  infoText?: string;
}

export default function ActionSidebar({ 
  onSave, 
  onCancel, 
  loading, 
  saveLabel = "Salva", 
  isSubmit = true, 
  infoText 
}: ActionSidebarProps) {
  return (
    <div className="w-full xl:w-96 sticky top-10 space-y-6">
      <div className="bg-white p-8 rounded-4xl border border-slate-200 shadow-xl space-y-6">
        <div className="space-y-1 text-center">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Azioni Flotta</h4>
        </div>
        
        <div className="space-y-3 pt-6 border-t border-slate-50">
          <button 
            type={isSubmit ? "submit" : "button"}
            onClick={isSubmit ? undefined : onSave}
            disabled={loading} 
            className="btn-primary w-full py-5 text-xs font-black uppercase tracking-[0.2em] shadow-blue-500/20"
          >
            {loading ? "Elaborazione..." : saveLabel}
          </button>
          
          <button 
            type="button" 
            onClick={onCancel} 
            className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 transition-colors"
          >
            Annulla operazione
          </button>
        </div>
      </div>

      {infoText && (
        <div className="p-8 bg-blue-50 rounded-4xl border border-blue-100">
          <p className="text-[11px] font-bold text-blue-600 leading-relaxed uppercase tracking-tighter">
            {infoText}
          </p>
        </div>
      )}
    </div>
  );
}