"use client";

import { useState } from "react";

export type SidebarPage = "dashboard" | "plans" | "ia" | "support" | "meta-api";

interface SidebarProps {
  currentPage: SidebarPage;
  onNavigate: (page: SidebarPage) => void;
  userName?: string;
}

const MENU = [
  { id: "dashboard" as SidebarPage, label: "Dashboard", icon: "📊" },
  { id: "plans" as SidebarPage, label: "Planos", icon: "💎" },
  { id: "ia" as SidebarPage, label: "IA", icon: "🤖" },
  { id: "meta-api" as SidebarPage, label: "Meta Ads API", icon: "⚙️" },
  { id: "support" as SidebarPage, label: "Suporte", icon: "💬" },
];

export default function Sidebar({ currentPage, onNavigate, userName }: SidebarProps) {
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
      {/* Logo */}
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

      {/* Menu */}
      <nav style={{ flex: 1, padding: "12px 8px", display: "flex", flexDirection: "column", gap: 4 }}>
        {MENU.map((item) => {
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
                padding: collapsed ? "12px 0" : "12px 16px",
                justifyContent: collapsed ? "center" : "flex-start",
                background: active ? "rgba(34,176,125,0.1)" : "transparent",
                border: "none",
                borderRadius: 10,
                color: active ? "#3FCB92" : "#6B739E",
                fontSize: 16,
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
              <span style={{ fontSize: 20, flexShrink: 0 }}>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Collapse toggle */}
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

      {/* User */}
      {!collapsed && userName && (
        <div style={{ padding: "16px 20px", borderTop: "1px solid #1A2040" }}>
          <div style={{ fontSize: 15, color: "#6B739E", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{userName}</div>
        </div>
      )}
    </aside>
  );
}
