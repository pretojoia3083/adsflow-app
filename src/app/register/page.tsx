"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erro ao criar conta");
        return;
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Conta criada, mas houve erro ao fazer login automatico");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full mt-1.5 bg-[#1A2333] border border-[#232D40] rounded-lg px-3 py-2.5 text-sm text-gray-100 outline-none focus:border-indigo-500 transition-colors";

  return (
    <div className="min-h-[100dvh] bg-[#0B0F17] text-gray-100 flex items-center justify-center p-4 sm:p-7">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-8">
          <div className="text-xs font-bold text-indigo-500 tracking-wider mb-2">
            ADSFLOW
          </div>
          <h1 className="text-2xl font-extrabold">Criar conta</h1>
          <p className="text-sm text-gray-400 mt-1">
            Comece a criar campanhas com IA
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#121826] border border-[#232D40] rounded-[14px] p-5 sm:p-6 flex flex-col gap-4"
        >
          {error && (
            <div className="bg-red-500/15 border border-red-500 text-red-400 text-sm px-4 py-2.5 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-gray-400">
              Nome
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-400">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-400">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimo 6 caracteres"
              required
              minLength={6}
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-500 border-none text-white font-bold text-sm py-3 rounded-[9px] hover:bg-indigo-600 transition-colors disabled:opacity-70"
          >
            {loading ? "Criando..." : "Criar conta gratis"}
          </button>
        </form>

        <div className="text-center mt-4 text-sm text-gray-400">
          Ja tem conta?{" "}
          <Link href="/login" className="text-indigo-500 font-semibold">
            Entrar
          </Link>
        </div>
      </div>
    </div>
  );
}
