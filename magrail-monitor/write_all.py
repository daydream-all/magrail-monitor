import os
BASE = r"C:\Users\吕程扬\Documents\app\magrail-monitor\src"

def write_file(relpath, content):
    path = os.path.join(BASE, relpath)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"  Written: {relpath}")

# ===== StatCard.tsx =====
write_file("components/StatCard.tsx", """import { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  unit?: string;
  trend?: { value: number; positive: boolean };
  color: "cyan" | "purple" | "green" | "amber";
}

const colorMap = {
  cyan: { dim: "var(--accent-dim)", text: "var(--accent)", border: "rgba(0,212,255,0.2)", glow: "rgba(0,212,255,0.2)" },
  purple: { dim: "var(--purple-dim)", text: "var(--purple)", border: "rgba(139,92,246,0.2)", glow: "rgba(139,92,246,0.2)" },
  green: { dim: "var(--green-dim)", text: "var(--green)", border: "rgba(16,185,129,0.2)", glow: "rgba(16,185,129,0.2)" },
  amber: { dim: "var(--amber-dim)", text: "var(--amber)", border: "rgba(245,158,11,0.2)", glow: "rgba(245,158,11,0.2)" },
};

export default function StatCard({ icon, label, value, unit, trend, color }: StatCardProps) {
  const c = colorMap[color];
  return (
    <div style={{
      background: "var(--bg-card)",
      border: `1px solid ${c.border}`,
      borderRadius: 12, padding: "20px 24px",
      position: "relative", overflow: "hidden",
      animation: "fadeIn 0.5s ease",
    }}>
      <div style={{
        position: "absolute", top: -20, right: -20,
        width: 80, height: 80, borderRadius: "50%",
        background: c.glow, filter: "blur(20px)",
      }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative" }}>
        <div>
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8, letterSpacing: 0.5 }}>{label}</p>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
            <span style={{ fontSize: 32, fontWeight: 700, color: c.text }}>{value}</span>
            {unit && <span style={{ fontSize: 14, color: "var(--text-muted)" }}>{unit}</span>}
          </div>
          {trend && (
            <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: trend.positive ? "var(--green)" : "var(--red)" }}>
                {trend.positive ? "↑" : "↓"} {Math.abs(trend.value)}%
              </span>
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>较昨日</span>
            </div>
          )}
        </div>
        <div style={{
          width: 44, height: 44, borderRadius: 10,
          background: c.dim,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {icon}
        </div>
      </div>
    </div>
  );
}
""")

print("All files written!")