"use client";

import { useEffect, useState, use } from "react"; // Importa 'use' da react
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ClientForm from "../../components/ClientForm";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ModificaCliente({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  
  // 1. Unwrapping dei params (fondamentale per Next.js 15+)
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;

  const [cliente, setCliente] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function fetchCliente() {
      try {
        const { data, error } = await supabase
          .from("customers")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setCliente(data);
      } catch (error) {
        console.error("Errore fetch:", error);
        toast.error("Impossibile trovare il cliente");
        router.push("/admin/clienti");
      } finally {
        setLoading(false);
      }
    }

    fetchCliente();
  }, [id, router]); // Usa 'id' spacchettato nelle dipendenze

  const handleUpdate = async (formData: any) => {
    setUpdating(true);
    try {
      const { error } = await supabase
        .from("customers")
        .update(formData)
        .eq("id", id);

      if (error) {
        if (error.code === '23505') {
          toast.error("Il cliente esiste già (Codice Fiscale duplicato)");
          return;
        }
        throw error;
      }

      toast.success("Cliente aggiornato con successo");
      router.push("/admin/clienti");
    } catch (error) {
      console.error("Errore update:", error);
      toast.error("Errore durante l'aggiornamento");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/clienti" 
          className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-blue-600 transition-all shadow-sm"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-900">
            Modifica Cliente
          </h1>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">
            ID: {id.slice(0, 8)}...
          </p>
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <ClientForm 
          initialData={cliente} 
          onSubmit={handleUpdate} 
          loading={updating} 
        />
      </div>
    </div>
  );
}