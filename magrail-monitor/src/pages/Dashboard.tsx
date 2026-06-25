import { useState, useEffect } from "react";
import { Truck, Activity, Zap, Leaf, AlertTriangle, ArrowUpRight } from "lucide-react";
import { generateVehicles, getSystemStats, generateEnergyData, generateAlerts } from "../data/mockData";
import type { Vehicle, SystemStats, EnergyData, Alert } from "../data/mockData";
import StatCard from "../components/StatCard";
import PipelineViz from "../components/PipelineViz";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const [stats, setStats] = useState<SystemStats>(getSystemStats());
  const [vehicles, setVehicles] = useState<Vehicle[]>(generateVehicles());
  const [energyData, setEnergyData] = useState<EnergyData[]>(generateEnergyData(12));
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(getSystemStats());
      setVehicles(prev => prev.map(v => ({
        ...v,
        speed: v.status === "running" ? 20 + Math.random() * 60 : 0,
        position: Math.max(0, Math.min(100, v.position + (Math.random() - 0.5) * 3)),
        battery: Math.max(0, Math.min(100, v.battery + (Math.random() - 0.5) * 0.8)),
        temperature: 25 + Math.random() * 15,
      })));
      setEnergyData(prev => {
        const now = new Date();
        const newPoint = {
          timestamp: `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`,
          consumption: Math.round((38 + Math.random() * 22) * 10) / 10,
          recovery: Math.round((12 + Math.random() * 16) * 10) / 10,
          efficiency: Math.round((30 + Math.random() * 20) * 10) / 10,
        };
        return [...prev.slice(-11), newPoint];
      });
      setAlerts(generateAlerts(5));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => { setAlerts(generateAlerts(5)); }, []);

  const runningVehicles = vehicles.filter(v => v.status === "running").length;
  const errorVehicles = vehicles.filter(v => v.status === "error").length;

  const severityColor = (s: string) =>
    s === "critical" ? "var(--red)" : s === "error" ? "#f87171" : s === "warning" ? "var(--amber)" : "var(--text-muted)";
  const severityLabel = (s: string) =>
    s === "critical" ? "严重" : s === "error" ? "错误" : s === "warning" ? "警告" : "信息";

  return (
    <div style={{ animation: "fadeIn 0.5s ease" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 20 }}>
        <StatCard icon={<Truck size={22} color="var(--accent)" />} label="在线车辆" value={`${runningVehicles}/${stats.totalVehicles}`} unit="辆" trend={{ value: 8, positive: true }} color="cyan" />
        <StatCard icon={<Activity size={22} color="var(--purple)" />} label="今日运输量" value={stats.todayTransport.toFixed(1)} unit="吨" trend={{ value: 12, positive: true }} color="purple" />
        <StatCard icon={<Zap size={22} color="var(--green)" />} label="动能回收率" value={stats.energyRecoveryRate} unit="%" trend={{ value: 5, positive: true }} color="green" />
        <StatCard icon={<Leaf size={22} color="#10b981" />} label="CO2减排" value={stats.co2Reduction.toFixed(1)} unit="吨/日" trend={{ value: 3, positive: true }} color="green" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        <PipelineViz vehicles={vehicles} />

        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600 }}>能耗与回收趋势</h3>
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>近12小时</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={energyData}>
              <defs>
                <linearGradient id="consumeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00d4ff" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#00d4ff" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="recoverGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="timestamp" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} unit="kW" />
              <Tooltip contentStyle={{ background: "#1e2433", border: "1px solid #2a3344", borderRadius: 8, fontSize: 12, color: "#e2e8f0" }} />
              <Area type="monotone" dataKey="consumption" stroke="#00d4ff" fill="url(#consumeGrad)" strokeWidth={2} name="能耗" />
              <Area type="monotone" dataKey="recovery" stroke="#10b981" fill="url(#recoverGrad)" strokeWidth={2} name="回收" />
            </AreaChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", gap: 24, marginTop: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 12, height: 2, background: "var(--accent)", borderRadius: 2 }} />
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>能耗 (kW)</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 12, height: 2, background: "var(--green)", borderRadius: 2 }} />
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>回收 (kW)</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>车辆状态概览</h3>
          <div style={{ display: "flex", gap: 16 }}>
            {[
              { label: "运行中", count: runningVehicles, color: "var(--accent)", bg: "var(--accent-dim)" },
              { label: "待命中", count: vehicles.filter(v => v.status === "idle").length, color: "#94a3b8", bg: "rgba(148,163,184,0.15)" },
              { label: "充电中", count: vehicles.filter(v => v.status === "charging").length, color: "var(--amber)", bg: "var(--amber-dim)" },
              { label: "维护", count: vehicles.filter(v => v.status === "maintenance").length, color: "var(--purple)", bg: "var(--purple-dim)" },
              { label: "故障", count: errorVehicles, color: "var(--red)", bg: "var(--red-dim)" },
            ].map(item => (
              <div key={item.label} style={{ flex: 1, textAlign: "center", padding: "12px 8px", background: item.bg, borderRadius: 10, border: `1px solid ${item.color}22` }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: item.color }}>{item.count}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>{item.label}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20 }}>
            <h4 style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 10 }}>运行中车辆</h4>
            {vehicles.filter(v => v.status === "running").slice(0, 5).map(v => (
              <div key={v.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", borderRadius: 6, marginBottom: 4, background: "var(--bg-hover)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Truck size={14} color="var(--accent)" />
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{v.name}</span>
                  <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{v.route}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{v.speed.toFixed(0)} km/h</span>
                  <div style={{ width: 60, height: 4, background: "var(--border)", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ width: `${v.battery}%`, height: "100%", background: v.battery > 20 ? "var(--green)" : "var(--red)", borderRadius: 2, transition: "width 0.5s" }} />
                  </div>
                  <span style={{ fontSize: 11, color: "var(--text-muted)", width: 35 }}>{v.battery.toFixed(0)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600 }}>实时告警</h3>
            <a href="/alerts" style={{ fontSize: 11, color: "var(--accent)", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
              查看全部 <ArrowUpRight size={12} />
            </a>
          </div>
          {alerts.slice(0, 5).map(alert => (
            <div key={alert.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
              <AlertTriangle size={14} color={severityColor(alert.severity)} style={{ marginTop: 1 }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                  <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 4, background: `${severityColor(alert.severity)}22`, color: severityColor(alert.severity), fontWeight: 600 }}>
                    {severityLabel(alert.severity)}
                  </span>
                  {alert.vehicleId && <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{alert.vehicleId}</span>}
                  {alert.section && <span style={{ fontSize: 11, color: "var(--text-muted)" }}>区段 {alert.section}</span>}
                </div>
                <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>{alert.message}</p>
              </div>
              <span style={{ fontSize: 10, color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                {new Date(alert.time).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}