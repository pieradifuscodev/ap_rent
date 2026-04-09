"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.updateUser({ 
      password: newPassword 
    });

    if (error) {
      alert("Errore: " + error.message);
    } else {
      alert("Password aggiornata con successo! Ora puoi accedere.");
      router.push("/login");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Imposta la nuova Password</h1>
      <form onSubmit={updatePassword}>
        <input 
          type="password" 
          placeholder="Scrivi la nuova password" 
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)} 
          required
          minLength={6}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Salvataggio..." : "Salva nuova password"}
        </button>
      </form>
    </div>
  );
}