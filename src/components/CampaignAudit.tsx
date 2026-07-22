"use client";

import { auditCampaign, type AuditResult } from "@/lib/campaign-audit";

interface Props {
  data: Parameters<typeof auditCampaign>[0];
}

const statusColors = { pass: "#22B07D", warn: "#F59E0B", fail: "#EF4444" };
const statusIcons = { pass: "✓", warn: "!", fail: "✕" };
const gradeColors: Record<string, string> = { A: "#22B07D", B: "#3FCB92", C: "#F59E0B", D: "#EF4444" };

export default function CampaignAudit({ data }: Props) {
  const result: AuditResult = auditCampaign(data);
  const categories = [...new Set(result.items.map((i) => i.category))];

  return (
    <div>
      <style>{`
        @keyframes auditFadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        .audit-item { animation: auditFadeIn 0.3s ease forwards; opacity: 0; }
      `}</style>

      {/* Score header */}
      <div style={{
        background: "linear-gradient(135deg, rgba(139,92,246,0.1), rgba(34,176,125,0.1))",
        border: "1px solid #232C52",
        borderRadius: 16,
        padding: "28px 32px",
        marginBottom: 24,
        display: "flex",
        alignItems: "center",
        gap: 32,
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            fontSize: 48,
            fontWeight: 800,
            color: gradeColors[result.grade] || "#8C93B8",
            lineHeight: 1,
          }}>
            {result.grade}
          </div>
          <div style={{ fontSize: 13, color: "#8C93B8", marginTop: 4 }}>
            {result.overallScore}/100
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 18, fontWeight: 700, color: "#F3F5FF", marginBottom: 6 }}>{result.verdict}</p>
          <div style={{ display: "flex", gap: 16, fontSize: 13 }}>
            <span style={{ color: statusColors.pass }}>✓ {result.summary.pass} aprovados</span>
            <span style={{ color: statusColors.warn }}>! {result.summary.warn} attention</span>
            <span style={{ color: statusColors.fail }}>✕ {result.summary.fail} problemas</span>
          </div>
        </div>
        {/* Score bar */}
        <div style={{ width: 120 }}>
          <div style={{ height: 8, background: "#1C2444", borderRadius: 4, overflow: "hidden" }}>
            <div style={{
              width: `${result.overallScore}%`,
              height: "100%",
              background: `linear-gradient(90deg, #8B5CF6, ${gradeColors[result.grade]})`,
              borderRadius: 4,
              transition: "width 0.8s ease",
            }} />
          </div>
        </div>
      </div>

      {/* Category groups */}
      {categories.map((cat, ci) => {
        const catItems = result.items.filter((i) => i.category === cat);
        return (
          <div key={cat} style={{ marginBottom: 20 }}>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: "#8C93B8", marginBottom: 10, textTransform: "uppercase" as const, letterSpacing: 1 }}>
              {cat}
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {catItems.map((item, ii) => (
                <div
                  key={ii}
                  className="audit-item"
                  style={{
                    animationDelay: `${(ci * catItems.length + ii) * 0.05}s`,
                    background: "#121830",
                    border: `1px solid ${item.status === "fail" ? "rgba(239,68,68,0.3)" : item.status === "warn" ? "rgba(245,158,11,0.2)" : "#232C52"}`,
                    borderRadius: 10,
                    padding: "12px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <div style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: `${statusColors[item.status]}15`,
                    border: `1px solid ${statusColors[item.status]}40`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 700,
                    color: statusColors[item.status],
                    flexShrink: 0,
                  }}>
                    {statusIcons[item.status]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 14, fontWeight: 500, color: "#F3F5FF" }}>{item.label}</span>
                      <span style={{ fontSize: 12, color: "#5B628A", flexShrink: 0, marginLeft: 8 }}>
                        {item.score}/{item.maxScore}
                      </span>
                    </div>
                    <p style={{ fontSize: 12, color: "#8C93B8", margin: "2px 0 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {item.detail}
                    </p>
                    {item.fix && (
                      <p style={{ fontSize: 11, color: statusColors[item.status], marginTop: 4 }}>
                        💡 {item.fix}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
