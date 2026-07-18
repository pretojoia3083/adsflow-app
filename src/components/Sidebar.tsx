"use client";

import { useState } from "react";

export type SidebarPage = "dashboard" | "campaigns" | "metrics" | "creatives" | "radar" | "ads-shop" | "install" | "settings" | "plans" | "ia" | "meta-api" | "support";

interface SidebarProps {
  currentPage: SidebarPage;
  onNavigate: (page: SidebarPage) => void;
  userName?: string;
  avatarUrl?: string | null;
}

const MENU_SECTIONS = [
  {
    title: "Principal",
    items: [
      { id: "dashboard" as SidebarPage, label: "Dashboard", icon: "📊" },
      { id: "campaigns" as SidebarPage, label: "Campanhas", icon: "🎯" },
      { id: "metrics" as SidebarPage, label: "Metricas", icon: "📈" },
      { id: "creatives" as SidebarPage, label: "Criativos", icon: "🎨" },
      { id: "radar" as SidebarPage, label: "Radar de Anuncios", icon: "🔍" },
      { id: "ads-shop" as SidebarPage, label: "ADS SHOP", icon: "🛒" },
    ],
  },
  {
    title: "Sistema",
    items: [
      { id: "install" as SidebarPage, label: "Instalar App", icon: "📱" },
      { id: "settings" as SidebarPage, label: "Configuracao", icon: "⚙️" },
    ],
  },
  {
    title: "Integracoes",
    items: [
      { id: "ia" as SidebarPage, label: "IA", icon: "🤖" },
      { id: "meta-api" as SidebarPage, label: "Meta Ads API", icon: "🔗" },
    ],
  },
  {
    title: "Conta",
    items: [
      { id: "plans" as SidebarPage, label: "Planos", icon: "💎" },
      { id: "support" as SidebarPage, label: "Suporte", icon: "💬" },
    ],
  },
];

export default function Sidebar({ currentPage, onNavigate, userName, avatarUrl }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      style={{
        width: collapsed ? 72 : 240,
        minWidth: collapsed ? 72 : 240,
        background: "#0C1022",
        borderRight: "1px solid #1A2040",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.25s ease, min-width 0.25s ease",
        overflow: "hidden",
      }}
    >
      <div style={{ padding: collapsed ? "20px 8px" : "20px 20px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid #1A2040", minHeight: 72 }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
          <svg width="40" height="40" viewBox="0 0 96 96" fill="none">
            <rect width="96" height="96" rx="20" fill="#171A21" stroke="#262B36" />
            <path d="M24 32 L40 48 L52 38 L72 60" stroke="#22B07D" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M60 60 H72 V48" stroke="#22B07D" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="24" cy="32" r="4" fill="#3FCB92" />
            <circle cx="52" cy="38" r="4" fill="#3FCB92" />
          </svg>
          {!collapsed && (
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 22 }}>
              <span style={{ color: "#F3F5FF" }}>Ads</span>
              <span style={{ background: "linear-gradient(90deg,#22B07D,#5FD9A4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Flow</span>
            </span>
          )}
        </a>
      </div>

      <nav style={{ flex: 1, padding: "12px 8px", display: "flex", flexDirection: "column", gap: 4, overflowY: "auto" }}>
        {MENU_SECTIONS.map((section) => (
          <div key={section.title} style={{ marginBottom: 8 }}>
            {!collapsed && (
              <div style={{ fontSize: 11, fontWeight: 600, color: "#4A5178", textTransform: "uppercase", letterSpacing: 1.2, padding: "8px 16px 4px" }}>
                {section.title}
              </div>
            )}
            {collapsed && <div style={{ height: 8, borderBottom: "1px solid #1A2040", margin: "8px 0" }} />}
            {section.items.map((item) => {
              const active = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  title={collapsed ? item.label : undefined}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: collapsed ? "10px 0" : "10px 16px",
                    justifyContent: collapsed ? "center" : "flex-start",
                    background: active ? "rgba(34,176,125,0.1)" : "transparent",
                    border: "none",
                    borderRadius: 10,
                    color: active ? "#3FCB92" : "#6B739E",
                    fontSize: 15,
                    fontWeight: active ? 700 : 500,
                    cursor: "pointer",
                    transition: "all 0.15s",
                    whiteSpace: "nowrap",
                    width: "100%",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = "rgba(59,130,246,0.06)";
                      e.currentTarget.style.color = "#A0A8CE";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "#6B739E";
                    }
                  }}
                >
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
                  {!collapsed && <span>{item.label}</span>}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      <div style={{ padding: "12px 8px", borderTop: "1px solid #1A2040" }}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            width: "100%",
            padding: collapsed ? "10px 0" : "10px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            gap: 8,
            background: "transparent",
            border: "1px solid #1A2040",
            borderRadius: 8,
            color: "#6B739E",
            fontSize: 15,
            cursor: "pointer",
          }}
        >
          <span style={{ fontSize: 16, transform: collapsed ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>◀</span>
          {!collapsed && <span>Recolher</span>}
        </button>
      </div>

      {collapsed && userName && (
        <div style={{ padding: "12px 0", borderTop: "1px solid #1A2040", display: "flex", justifyContent: "center" }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
            background: avatarUrl ? "none" : "linear-gradient(135deg, #22B07D, #3FCB92)",
            display: "flex", alignItems: "center", justifyContent: "center",
            overflow: "hidden", border: "2px solid #232C52",
          }}>
            {avatarUrl ? (
              <img src={avatarUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <span style={{ color: "#080B14", fontSize: 12, fontWeight: 700 }}>{userName.charAt(0).toUpperCase()}</span>
            )}
          </div>
        </div>
      )}

      {!collapsed && userName && (
        <div style={{ padding: "16px 20px", borderTop: "1px solid #1A2040", display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => onNavigate("settings")}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
            background: avatarUrl ? "none" : "linear-gradient(135deg, #22B07D, #3FCB92)",
            display: "flex", alignItems: "center", justifyContent: "center",
            overflow: "hidden", border: "2px solid #232C52",
          }}>
            {avatarUrl ? (
              <img src={avatarUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <span style={{ color: "#080B14", fontSize: 14, fontWeight: 700 }}>{userName.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div style={{ fontSize: 14, color: "#A0A8CE", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{userName}</div>
        </div>
      )}
    </aside>
  );
}
