"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase"; // Controlla che questo non sia rosso
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Funzione per il Login normale
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Errore: " + error.message);
    } else {
      router.push("/");
      router.refresh(); // Forza il middleware a ricontrollare la sessione
    }
    setLoading(false);
  };

  // Funzione per il Reset Password (quella che ti dava errore)
  const handleReset = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email) return alert("Inserisci la tua email nel campo sopra per ricevere il link di reset.");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://ap-rent-admin.vercel.app/reset-password',
    });

    if (error) alert(error.message);
    else alert("Controlla la mail! Abbiamo inviato il link di reset.");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Login Admin</h1>
      <form onSubmit={handleLogin}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <br />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <br />
        <button type="submit" disabled={loading}>
          {loading ? "Accesso in corso..." : "Accedi"}
        </button>
      </form>
      
      <button 
        onClick={handleReset} 
        style={{ marginTop: "10px", background: "none", border: "none", color: "blue", cursor: "pointer", textDecoration: "underline" }}
      >
        Password dimenticata?
      </button>
    </div>
  );
}