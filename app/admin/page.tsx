"use client";

import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard Gestionale AP Rent</h1>
      <p>Benvenuto nell&apos;area riservata.</p>
      
      <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        <button onClick={() => alert("Qui gestiremo i veicoli")}>Gestione Flotta</button>
        <button onClick={handleLogout} style={{ color: "red" }}>Logout</button>
      </div>
    </div>
  );
}