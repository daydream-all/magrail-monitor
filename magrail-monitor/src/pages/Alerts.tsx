import { useState, useEffect } from "react";
import { generateAlerts } from "../data/mockData";
import type { Alert } from "../data/mockData";
import { AlertTriangle, CheckCircle, Clock, Search, XCircle, Info } from "lucide-react";

const SEVERITY_CONFIG = {
  critical: { label: "严重", color: "var(--red)", icon: XCircle, bg: "var(--red-dim)" },
  error: { label: "错误", color: "#f87171", icon: AlertTriangle, bg: "rgba(248,113,113,0.15)" },
  warning: { label: "警告", color: "var(--amber)", icon: AlertTriangle, bg: "var(--amber-dim)" },
  info: { label: "信息", color: "var(--text-muted)", icon: Info, bg: "rgba(100,116,139,0.15)" },
};

export default function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>(generateAlerts(50));
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Alert | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setAlerts(prev => {
        const newAlerts = generateAlerts(2);
        return [...newAlerts, ...prev].slice(0, 100);
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const toggleResolved = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: !a.resolved } : a));
  };

  const filtered = alerts
    .filter(a => {
      if (filter === "all") return true;
      if (filter === "active") return !a.resolved;
      return a.severity === filter;
    })
    .filter(a => !search || a.message.includes(search) || (a.vehicleId && a.vehicleId.includes(search)));

  const counts = {
    all: alerts.length,
    active: alerts.filter(a => !a.resolved).length,
    critical: alerts.filter(a => a.severity === "critical" && !a.resolved).length,
    error: alerts.filter(a => a.severity === "error" && !a.resolved).length,
    warning: alerts.filter(a => a.severity === "warning" && !a.resolved).length,
  };

  return (
    <div style={{ animation: "fadeIn 0.5s ease", display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
        {[
          { label: "总告警", value: counts.all, color: "var(--text-primary)", bg: "var(--bg-card)" },
          { label: "未处理", value: counts.active, color: "var(--amber)", bg: "var(--amber-dim)" },
          { label: "严重", value: counts.critical, color: "var(--red)", bg: "var(--red-dim)" },
          { label: "错误", value: counts.error, color: "#f87171", bg: "rgba(248,113,113,0.15)" },
          { label: "警告", value: counts.warning, color: "var(--amber)", bg: "var(--amber-dim)" },
        ].map(item => (
          <div key={item.label} style={{ background: item.bg, border: "1px solid var(--border)", borderRadius: 10, padding: "14px 16px", textAlign: "center" }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: item.color }}>{item.value}</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>{item.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 20px" }}>
        <div style={{ display: "flex", gap: 8 }}>
          {[
            { key: "all", label: "全部" },
            { key: "active", label: "未处理" },
            { key: "critical", label: "严重" },
            { key: "error", label: "错误" },
            { key: "warning", label: "警告" },
          ].map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)} style={{
              padding: "6px 14px", borderRadius: 6, border: "none",
              background: filter === f.key ? "var(--accent-dim)" : "transparent",
              color: filter === f.key ? "var(--accent)" : "var(--text-muted)",
              fontSize: 12, cursor: "pointer", fontWeight: filter === f.key ? 600 : 400,
              transition: "all 0.2s",
            }}>
              {f.label}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--bg-hover)", padding: "6px 12px", borderRadius: 8 }}>
          <Search size={14} color="var(--text-muted)" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索告警内容..." style={{ background: "none", border: "none", outline: "none", color: "var(--text-primary)", fontSize: 13, width: 200 }} />
        </div>
      </div>

      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ overflow: "auto", maxHeight: "calc(100vh - 340px)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--bg-hover)", borderBottom: "1px solid var(--border)", position: "sticky", top: 0 }}>
                {["级别", "时间", "车辆", "区段", "告警内容", "状态", "操作"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(alert => {
                const cfg = SEVERITY_CONFIG[alert.severity];
                const Icon = cfg.icon;
                const time = new Date(alert.time);
                return (
                  <tr key={alert.id} onClick={() => setSelected(alert)} style={{
                    borderBottom: "1px solid var(--border)", cursor: "pointer", transition: "background 0.15s",
                    opacity: alert.resolved ? 0.6 : 1,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-hover)" }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent" }}
                  >
                    <td style={{ padding: "10px 16px" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 10px", borderRadius: 4, background: cfg.bg, color: cfg.color, fontSize: 11, fontWeight: 600 }}>
                        <Icon size={12} />{cfg.label}
                      </span>
                    </td>
                    <td style={{ padding: "10px 16px", fontSize: 12, color: "var(--text-secondary)" }}>
                      <div>{time.toLocaleDateString("zh-CN")}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{time.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</div>
                    </td>
                    <td style={{ padding: "10px 16px", fontSize: 12, color: "var(--text-secondary)" }}>{alert.vehicleId || "—"}</td>
                    <td style={{ padding: "10px 16px", fontSize: 12, color: "var(--text-secondary)" }}>{alert.section ? `区段 ${alert.section}` : "—"}</td>
                    <td style={{ padding: "10px 16px", fontSize: 13, fontWeight: 500 }}>{alert.message}</td>
                    <td style={{ padding: "10px 16px" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, padding: "2px 8px", borderRadius: 4, background: alert.resolved ? "var(--green-dim)" : "var(--amber-dim)", color: alert.resolved ? "var(--green)" : "var(--amber)" }}>
                        {alert.resolved ? <CheckCircle size={10} /> : <Clock size={10} />}
                        {alert.resolved ? "已处理" : "待处理"}
                      </span>
                    </td>
                    <td style={{ padding: "10px 16px" }}>
                      <button onClick={e => { e.stopPropagation(); toggleResolved(alert.id); }} style={{ padding: "4px 12px", borderRadius: 5, border: "1px solid var(--border)", background: "transparent", color: "var(--text-secondary)", fontSize: 11, cursor: "pointer" }}>
                        {alert.resolved ? "重新打开" : "标记处理"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }} onClick={() => setSelected(null)}>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: 28, maxWidth: 480, width: "90%", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {(() => { const Icon = SEVERITY_CONFIG[selected.severity].icon; return <Icon size={20} color={SEVERITY_CONFIG[selected.severity].color} />; })()}
                <span style={{ padding: "3px 10px", borderRadius: 4, background: SEVERITY_CONFIG[selected.severity].bg, color: SEVERITY_CONFIG[selected.severity].color, fontSize: 12, fontWeight: 600 }}>{SEVERITY_CONFIG[selected.severity].label}</span>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: 4, fontSize: 18 }}>×</button>
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>{selected.message}</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                ["告警编号", selected.id],
                ["发生时间", new Date(selected.time).toLocaleString("zh-CN")],
                ["涉及车辆", selected.vehicleId || "无"],
                ["涉及区段", selected.section || "无"],
                ["当前状态", selected.resolved ? "已处理" : "待处理"],
                ["告警级别", SEVERITY_CONFIG[selected.severity].label],
              ].map(([k, v]) => (
                <div key={k} style={{ padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 2 }}>{k}</div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{v}</div>
                </div>
              ))}
            </div>
            {selected.severity === "critical" && (
              <div style={{ marginTop: 16, padding: 12, background: "var(--red-dim)", borderRadius: 8, border: "1px solid rgba(239,68,68,0.2)" }}>
                <p style={{ fontSize: 12, color: "var(--red)", fontWeight: 500 }}>⚠ 此告警为严重级别，建议立即派遣维护人员到现场检查。</p>
              </div>
            )}
            <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
              <button onClick={() => setSelected(null)} style={{ padding: "8px 20px", borderRadius: 8, background: "var(--bg-hover)", border: "1px solid var(--border)", color: "var(--text-secondary)", cursor: "pointer", fontSize: 13 }}>关闭</button>
              <button onClick={() => { toggleResolved(selected.id); setSelected(null); }} style={{ padding: "8px 20px", borderRadius: 8, background: selected.resolved ? "var(--amber-dim)" : "var(--green-dim)", border: `1px solid ${selected.resolved ? "rgba(245,158,11,0.2)" : "rgba(16,185,129,0.2)"}`, color: selected.resolved ? "var(--amber)" : "var(--green)", cursor: "pointer", fontSize: 13, fontWeight: 500 }}>
                {selected.resolved ? "重新打开" : "标记已处理"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}