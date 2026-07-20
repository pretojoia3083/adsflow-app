"use client";

import { useState, useEffect, useCallback } from "react";

interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  plan: string;
  role: string;
  createdAt: string;
  subscription: {
    status: string;
    currentPeriod: string | null;
    cancelAt: string | null;
    priceId: string | null;
  } | null;
}

const PLAN_BADGES: Record<string, { color: string; bg: string; label: string }> = {
  FREE: { color: "#8C93B8", bg: "rgba(140,147,184,0.12)", label: "Gratuito" },
  BASICO: { color: "#22B07D", bg: "rgba(34,176,125,0.12)", label: "Basico (R$30)" },
  PRO: { color: "#8B5CF6", bg: "rgba(139,92,246,0.12)", label: "Pro (R$50)" },
};

const SUB_BADGES: Record<string, { color: string; bg: string; label: string }> = {
  active: { color: "#22B07D", bg: "rgba(34,176,125,0.12)", label: "Ativa" },
  past_due: { color: "#F97316", bg: "rgba(249,115,22,0.12)", label: "Atrasada" },
  canceled: { color: "#F87171", bg: "rgba(248,113,113,0.12)", label: "Cancelada" },
  unpaid: { color: "#F87171", bg: "rgba(248,113,113,0.12)", label: "Nao paga" },
};

export default function AdminPanel() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const fetchUsers = useCallback(async (q?: string) => {
    setLoading(true);
    try {
      const url = q ? `/api/admin/users?search=${encodeURIComponent(q)}` : "/api/admin/users";
      const res = await fetch(url);
      const data = await res.json();
      setUsers(data.users || []);
    } catch {
      setUsers([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  useEffect(() => {
    const t = setTimeout(() => { fetchUsers(search); }, 400);
    return () => clearTimeout(t);
  }, [search, fetchUsers]);

  async function handleChangePlan(userId: string, newPlan: string) {
    if (!confirm(`Alterar plano para ${PLAN_BADGES[newPlan]?.label || newPlan}?`)) return;
    setUpdatingId(userId);
    try {
      await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, plan: newPlan }),
      });
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, plan: newPlan } : u));
    } catch {}
    setUpdatingId(null);
  }

  const filtered = filter === "all" ? users : users.filter((u) => u.plan === filter);
  const counts = {
    all: users.length,
    FREE: users.filter((u) => u.plan === "FREE").length,
    BASICO: users.filter((u) => u.plan === "BASICO").length,
    PRO: users.filter((u) => u.plan === "PRO").length,
  };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: "#F3F5FF", margin: 0 }}>Painel ADM</h2>
        <p style={{ color: "#8C93B8", fontSize: 15, marginTop: 6 }}>Gerencie usuarios e planos</p>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {(["all", "FREE", "BASICO", "PRO"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "8px 16px",
              background: filter === f ? "rgba(139,92,246,0.15)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${filter === f ? "rgba(139,92,246,0.3)" : "#1A2040"}`,
              borderRadius: 8,
              color: filter === f ? "#A78BFA" : "#6B739E",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {f === "all" ? "Todos" : PLAN_BADGES[f]?.label || f} ({counts[f]})
          </button>
        ))}
      </div>

      <div style={{ position: "relative", marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Buscar por email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%", padding: "12px 16px", background: "#121830", border: "1px solid #232C52",
            borderRadius: 10, color: "#F3F5FF", fontSize: 15, outline: "none", boxSizing: "border-box",
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "#8B5CF6"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "#232C52"; }}
        />
      </div>

      {loading ? (
        <p style={{ color: "#8C93B8", fontSize: 14 }}>Carregando...</p>
      ) : filtered.length === 0 ? (
        <div style={{ background: "#121830", border: "1px solid #232C52", borderRadius: 16, padding: "48px 32px", textAlign: "center" }}>
          <p style={{ fontSize: 36, marginBottom: 12 }}>&#128100;</p>
          <p style={{ color: "#8C93B8", fontSize: 15 }}>Nenhum usuario encontrado</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map((user) => {
            const pb = PLAN_BADGES[user.plan] || PLAN_BADGES.FREE;
            const sub = user.subscription;
            const subBadge = sub ? SUB_BADGES[sub.status] : null;

            return (
              <div key={user.id} style={{
                background: "#121830", border: "1px solid #232C52", borderRadius: 12,
                padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between",
                gap: 16, flexWrap: "wrap",
              }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 600, color: "#F3F5FF", fontSize: 15 }}>{user.email}</span>
                    {user.name && <span style={{ color: "#6B739E", fontSize: 13 }}>({user.name})</span>}
                    {user.role === "ADMIN" && (
                      <span style={{ padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700, color: "#F97316", background: "rgba(249,115,22,0.12)" }}>ADM</span>
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
                    <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600, color: pb.color, background: pb.bg }}>
                      {pb.label}
                    </span>
                    {subBadge && (
                      <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600, color: subBadge.color, background: subBadge.bg }}>
                        {subBadge.label}
                      </span>
                    )}
                    {sub?.currentPeriod && (
                      <span style={{ fontSize: 12, color: "#6B739E" }}>
                        Expira: {new Date(sub.currentPeriod).toLocaleDateString("pt-BR")}
                      </span>
                    )}
                    <span style={{ fontSize: 12, color: "#4A5178" }}>
                      Cadastro: {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  {(["FREE", "BASICO", "PRO"] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => handleChangePlan(user.id, p)}
                      disabled={user.plan === p || updatingId === user.id}
                      style={{
                        padding: "6px 12px",
                        background: user.plan === p ? (PLAN_BADGES[p]?.bg || "#1A2040") : "transparent",
                        border: `1px solid ${user.plan === p ? (PLAN_BADGES[p]?.color || "#232C52") + "40" : "#232C52"}`,
                        borderRadius: 8,
                        color: user.plan === p ? (PLAN_BADGES[p]?.color || "#8C93B8") : "#6B739E",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: user.plan === p || updatingId === user.id ? "default" : "pointer",
                        opacity: user.plan === p ? 1 : 0.7,
                      }}
                    >
                      {p === "FREE" ? "Liberar" : p === "BASICO" ? "Basico" : "Pro"}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
