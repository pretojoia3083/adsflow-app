"use client";

import { useState, useRef } from "react";

interface Creative {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  url: string;
}

export default function CreativesPage() {
  const [creatives, setCreatives] = useState<Creative[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleUpload(files: FileList | null) {
    if (!files) return;
    const newCreatives: Creative[] = Array.from(files).map((f) => ({
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      name: f.name,
      type: f.type.includes("video") ? "Video" : f.type.includes("image") ? "Imagem" : "Outro",
      size: (f.size / 1024 / 1024).toFixed(2) + " MB",
      uploadedAt: new Date().toLocaleDateString("pt-BR"),
      url: URL.createObjectURL(f),
    }));
    setCreatives((prev) => [...newCreatives, ...prev]);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    handleUpload(e.dataTransfer.files);
  }

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: "#F3F5FF", margin: 0 }}>Criativos</h2>
        <p style={{ color: "#8C93B8", fontSize: 15, marginTop: 6 }}>Gerencie seus criativos de anuncio (imagens, videos, textos)</p>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        style={{
          border: `2px dashed ${dragOver ? "#22B07D" : "#232C52"}`,
          background: dragOver ? "rgba(34,176,125,0.05)" : "#121830",
          borderRadius: 16,
          padding: "48px 40px",
          textAlign: "center",
          cursor: "pointer",
          transition: "all 0.2s",
          marginBottom: 32,
        }}
      >
        <p style={{ fontSize: 40, margin: "0 0 12px" }}>📁</p>
        <p style={{ fontWeight: 600, fontSize: 17, color: "#F3F5FF", margin: "0 0 8px" }}>Arraste arquivos aqui ou clique para selecionar</p>
        <p style={{ color: "#8C93B8", fontSize: 14, margin: 0 }}>Imagens (JPG, PNG, GIF) e Videos (MP4, MOV) — Max 100MB</p>
        <input ref={fileRef} type="file" multiple accept="image/*,video/*" style={{ display: "none" }} onChange={(e) => handleUpload(e.target.files)} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
        {creatives.map((c) => (
          <div key={c.id} style={{ background: "#121830", border: "1px solid #232C52", borderRadius: 14, overflow: "hidden" }}>
            <div style={{ background: "#0C1022", height: 180, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              {c.type === "Imagem" ? (
                <img src={c.url} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : c.type === "Video" ? (
                <video src={c.url} style={{ width: "100%", height: "100%", objectFit: "cover" }} muted />
              ) : (
                <span style={{ fontSize: 36 }}>📄</span>
              )}
            </div>
            <div style={{ padding: "14px 16px" }}>
              <p style={{ color: "#F3F5FF", fontSize: 14, fontWeight: 600, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</p>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                <span style={{ color: "#8C93B8", fontSize: 12 }}>{c.type} · {c.size}</span>
                <span style={{ color: "#6B739E", fontSize: 12 }}>{c.uploadedAt}</span>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <a
                  href={c.url}
                  download={c.name}
                  style={{ flex: 1, padding: "8px 0", background: "rgba(34,176,125,0.1)", border: "1px solid rgba(34,176,125,0.3)", borderRadius: 8, color: "#3FCB92", fontSize: 13, fontWeight: 600, textAlign: "center", textDecoration: "none", cursor: "pointer" }}
                >
                  Baixar
                </a>
                <button
                  onClick={() => setCreatives((prev) => prev.filter((x) => x.id !== c.id))}
                  style={{ flex: 1, padding: "8px 0", background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 8, color: "#F87171", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                >
                  Remover
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {creatives.length === 0 && (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <p style={{ color: "#6B739E", fontSize: 14 }}>Nenhum criativo enviado ainda.</p>
        </div>
      )}
    </div>
  );
}
