import { useState, useEffect } from "react";
import { generateVehicles } from "../data/mockData";
import type { Vehicle } from "../data/mockData";
import PipelineViz from "../components/PipelineViz";
import { Truck, Search, Gauge, Thermometer, Battery, Package, Zap, Ruler, Target, Crosshair } from "lucide-react";

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  running: { label: "运行中", color: "var(--accent)", bg: "var(--accent-dim)" },
  idle: { label: "待命中", color: "#94a3b8", bg: "rgba(148,163,184,0.15)" },
  charging: { label: "充电中", color: "var(--amber)", bg: "var(--amber-dim)" },
  maintenance: { label: "维护中", color: "var(--purple)", bg: "var(--purple-dim)" },
  error: { label: "故障", color: "var(--red)", bg: "var(--red-dim)" },
};

const TRACTION_MAP: Record<string, string> = {
  accelerate: "加速",
  coast: "滑行",
  brake: "制动",
  reverse: "反向制动",
};

const TYPE_MAP: Record<string, string> = { light: "轻型", medium: "中型", heavy: "重型" };

export default function VehicleMonitor() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(generateVehicles());
  const [selected, setSelected] = useState<Vehicle | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles(prev => prev.map(v => {
        const speed = v.status === "running" ? 20 + Math.random() * 60 : 0;
        const mass = 80 + v.load;
        const kineticEnergy = 0.5 * mass * Math.pow(speed / 3.6, 2) / 1000;
        const laserLoadCurrent = 5 + v.load * 0.08;
        const laserAccelL = speed * (0.1 + v.load * 0.0005);
        const recoveryCoils = Math.ceil(kineticEnergy / 0.5);
        const laserBrakeDist = recoveryCoils * 0.5;
        const speedLimit = v.load > v.maxLoad * 0.8 ? 50 : 80;
        return {
          ...v,
          speed,
          position: Math.max(0, Math.min(100, v.position + (Math.random() - 0.5) * 3)),
          battery: Math.max(0, Math.min(100, v.battery + (Math.random() - 0.5) * 0.8)),
          temperature: 25 + Math.random() * 15,
          laserLoadCurrent: Math.round(laserLoadCurrent * 10) / 10,
          laserSpeedV: Math.round(speed * (0.98 + Math.random() * 0.04) * 10) / 10,
          laserAccelL: Math.round(laserAccelL * 10) / 10,
          laserBrakeDist: Math.round(laserBrakeDist * 10) / 10,
          kineticEnergy: Math.round(kineticEnergy * 100) / 100,
          recoveryCoils,
          speedLimit,
          tractionMode: speed > 0 ? (speed > 40 ? "coast" : "accelerate") : "brake",
        };
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const filtered = vehicles
    .filter(v => statusFilter === "all" || v.status === statusFilter)
    .filter(v => !search || v.name.includes(search) || v.id.includes(search) || v.route.includes(search));

  const runningCount = vehicles.filter(v => v.status === "running").length;

  return (
    <div style={{ animation: "fadeIn 0.5s ease", display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
        {[
          { label: "在线/总数", value: `${runningCount}/${vehicles.length}`, color: "var(--accent)" },
          { label: "平均速度", value: `${Math.round(vehicles.filter(v => v.status === "running").reduce((s, v) => s + v.speed, 0) / Math.max(1, runningCount))} km/h`, color: "var(--purple)" },
          { label: "平均电量", value: `${Math.round(vehicles.reduce((s, v) => s + v.battery, 0) / vehicles.length)}%`, color: "var(--green)" },
          { label: "总载重", value: `${Math.round(vehicles.reduce((s, v) => s + v.load, 0))} kg`, color: "var(--amber)" },
          { label: "平均温度", value: `${Math.round(vehicles.reduce((s, v) => s + v.temperature, 0) / vehicles.length)}°C`, color: "#f87171" },
        ].map(item => (
          <div key={item.label} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 16px", textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: item.color }}>{item.value}</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>{item.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 20 }}>
        <PipelineViz vehicles={vehicles} compact />

        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600 }}>车辆列表</h3>
            <div style={{ display: "flex", gap: 8 }}>
              {["all", "running", "idle", "charging", "error"].map(s => (
                <button key={s} onClick={() => setStatusFilter(s)} style={{
                  padding: "4px 12px", borderRadius: 6, border: "1px solid var(--border)",
                  background: statusFilter === s ? "var(--accent-dim)" : "transparent",
                  color: statusFilter === s ? "var(--accent)" : "var(--text-muted)",
                  fontSize: 11, cursor: "pointer", fontWeight: statusFilter === s ? 600 : 400,
                }}>
                  {s === "all" ? "全部" : STATUS_MAP[s]?.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "var(--bg-hover)", borderRadius: 8, marginBottom: 12 }}>
            <Search size={14} color="var(--text-muted)" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索车辆名称、编号或路线..." style={{ flex: 1, background: "none", border: "none", outline: "none", color: "var(--text-primary)", fontSize: 13 }} />
          </div>

          <div style={{ maxHeight: 460, overflow: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["车辆", "状态", "速度", "电量", "载重", "温度", "路线"].map(h => (
                    <th key={h} style={{ padding: "8px 10px", textAlign: "left", fontSize: 11, color: "var(--text-muted)", fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(v => {
                  const st = STATUS_MAP[v.status];
                  return (
                    <tr key={v.id} onClick={() => setSelected(v)} style={{
                      borderBottom: "1px solid var(--border)", cursor: "pointer",
                      background: selected?.id === v.id ? "var(--accent-dim)" : "transparent",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={e => { if (selected?.id !== v.id) e.currentTarget.style.background = "var(--bg-hover)" }}
                    onMouseLeave={e => { if (selected?.id !== v.id) e.currentTarget.style.background = "transparent" }}
                    >
                      <td style={{ padding: "8px 10px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <Truck size={14} color={st.color} />
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600 }}>{v.name}</div>
                            <div style={{ fontSize: 10, color: "var(--text-muted)" }}>{v.id} · {TYPE_MAP[v.type]}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "8px 10px" }}>
                        <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 11, background: st.bg, color: st.color, fontWeight: 500 }}>{st.label}</span>
                      </td>
                      <td style={{ padding: "8px 10px", fontSize: 13, color: "var(--text-secondary)" }}>{v.speed > 0 ? `${v.speed.toFixed(0)} km/h` : "—"}</td>
                      <td style={{ padding: "8px 10px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <div style={{ width: 50, height: 4, background: "var(--border)", borderRadius: 2, overflow: "hidden" }}>
                            <div style={{ width: `${v.battery}%`, height: "100%", background: v.battery > 40 ? "var(--green)" : v.battery > 20 ? "var(--amber)" : "var(--red)", borderRadius: 2 }} />
                          </div>
                          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{v.battery.toFixed(0)}%</span>
                        </div>
                      </td>
                      <td style={{ padding: "8px 10px", fontSize: 12, color: "var(--text-secondary)" }}>{v.load.toFixed(0)}/{v.maxLoad} kg</td>
                      <td style={{ padding: "8px 10px", fontSize: 12, color: v.temperature > 45 ? "var(--red)" : "var(--text-secondary)" }}>{v.temperature.toFixed(0)}°C</td>
                      <td style={{ padding: "8px 10px", fontSize: 12, color: "var(--text-muted)" }}>{v.route}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selected && (
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: 24, animation: "fadeIn 0.3s ease" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: 17, fontWeight: 600 }}>{selected.name} <span style={{ fontSize: 12, color: "var(--text-muted)", marginLeft: 8, fontWeight: 400 }}>{selected.id}</span></h3>
              <span style={{ display: "inline-block", marginTop: 4, padding: "2px 10px", borderRadius: 4, fontSize: 11, background: STATUS_MAP[selected.status].bg, color: STATUS_MAP[selected.status].color, fontWeight: 500 }}>{STATUS_MAP[selected.status].label}</span>
            </div>
            <button onClick={() => setSelected(null)} style={{ padding: "6px 16px", borderRadius: 6, background: "var(--bg-hover)", border: "1px solid var(--border)", color: "var(--text-secondary)", cursor: "pointer", fontSize: 12 }}>关闭</button>
          </div>

          {/* Basic Metrics */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 20 }}>
            {[
              { icon: Gauge, label: "当前速度", value: `${selected.speed.toFixed(0)} km/h`, max: 80, current: selected.speed, color: "var(--accent)" },
              { icon: Battery, label: "电池电量", value: `${selected.battery.toFixed(0)}%`, max: 100, current: selected.battery, color: "var(--green)" },
              { icon: Package, label: "载重", value: `${selected.load.toFixed(0)} / ${selected.maxLoad} kg`, max: selected.maxLoad, current: selected.load, color: "var(--amber)" },
              { icon: Thermometer, label: "悬浮系统温度", value: `${selected.temperature.toFixed(0)}°C`, max: 60, current: selected.temperature, color: selected.temperature > 45 ? "var(--red)" : "#f87171" },
            ].map(item => (
              <div key={item.label} style={{ background: "var(--bg-hover)", borderRadius: 10, padding: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <item.icon size={16} color={item.color} />
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{item.label}</span>
                </div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>{item.value}</div>
                <div style={{ width: "100%", height: 6, background: "var(--border)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ width: `${Math.min(100, (item.current / item.max) * 100)}%`, height: "100%", background: item.color, borderRadius: 3, transition: "width 0.5s" }} />
                </div>
              </div>
            ))}
          </div>

          {/* Laser Control System Panel */}
          <div style={{ background: "rgba(0,212,255,0.03)", border: "1px solid rgba(0,212,255,0.15)", borderRadius: 12, padding: 20, marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <Crosshair size={16} color="var(--accent)" />
              <h4 style={{ fontSize: 14, fontWeight: 600, color: "var(--accent)" }}>激光加速/制动控制系统</h4>
              <span style={{ fontSize: 10, color: "var(--accent)", padding: "2px 8px", borderRadius: 4, background: "var(--accent-dim)" }}>
                {TRACTION_MAP[selected.tractionMode]}
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
              {/* Laser Load Detection */}
              <div style={{ background: "var(--bg-hover)", borderRadius: 8, padding: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                  <Target size={14} color="var(--purple)" />
                  <span style={{ fontSize: 11, color: "var(--text-muted)" }}>激光测载</span>
                </div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "var(--purple)" }}>{selected.laserLoadCurrent} A</div>
                <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 4 }}>
                  M = kI → {Math.round(80 + selected.load)} kg
                </div>
                <div style={{ marginTop: 8 }}>
                  <div style={{ fontSize: 10, color: "var(--text-muted)", marginBottom: 4 }}>
                    悬浮电流 {selected.laserLoadCurrent > 20 ? "⚡ 重载" : "正常"}
                  </div>
                  <div style={{ width: "100%", height: 4, background: "var(--border)", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ width: `${Math.min(100, (selected.laserLoadCurrent / 50) * 100)}%`, height: "100%", background: "var(--purple)", borderRadius: 2 }} />
                  </div>
                </div>
              </div>

              {/* Laser Speed Measurement */}
              <div style={{ background: "var(--bg-hover)", borderRadius: 8, padding: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                  <Zap size={14} color="var(--accent)" />
                  <span style={{ fontSize: 11, color: "var(--text-muted)" }}>激光测速</span>
                </div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "var(--accent)" }}>{selected.laserSpeedV} km/h</div>
                <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 4 }}>
                  V = L/Δt (L=50cm)
                </div>
                <div style={{ fontSize: 10, color: selected.speedLimit < 80 ? "var(--amber)" : "var(--green)", marginTop: 8 }}>
                  限速: {selected.speedLimit} km/h {selected.speedLimit < 80 ? "(重载限速)" : ""}
                </div>
              </div>

              {/* Accel Zone */}
              <div style={{ background: "var(--bg-hover)", borderRadius: 8, padding: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                  <Ruler size={14} color="var(--green)" />
                  <span style={{ fontSize: 11, color: "var(--text-muted)" }}>加速区段</span>
                </div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "var(--green)" }}>{selected.laserAccelL} m</div>
                <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 4 }}>
                  L = V × Δt
                </div>
                <div style={{ fontSize: 10, color: selected.load > selected.maxLoad * 0.8 ? "var(--amber)" : "var(--text-muted)", marginTop: 8 }}>
                  Δt = {Math.round((0.1 + selected.load * 0.0005) * 1000)}ms
                  {selected.load > selected.maxLoad * 0.8 ? " 螺线管辅助牵引" : ""}
                </div>
              </div>

              {/* Brake Recovery */}
              <div style={{ background: "var(--bg-hover)", borderRadius: 8, padding: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                  <Zap size={14} color="var(--amber)" />
                  <span style={{ fontSize: 11, color: "var(--text-muted)" }}>制动回收</span>
                </div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "var(--amber)" }}>{selected.recoveryCoils} 线圈</div>
                <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 4 }}>
                  动能 {selected.kineticEnergy} kJ
                </div>
                <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 8 }}>
                  制动距离: {selected.laserBrakeDist} m
                </div>
              </div>
            </div>

            {/* Traction Status */}
            <div style={{
              marginTop: 16, padding: 12, borderRadius: 8,
              background: selected.tractionMode === "accelerate" ? "var(--accent-dim)" :
                selected.tractionMode === "brake" ? "var(--amber-dim)" :
                selected.tractionMode === "reverse" ? "var(--red-dim)" : "var(--bg-hover)",
              border: `1px solid ${
                selected.tractionMode === "accelerate" ? "rgba(0,212,255,0.2)" :
                selected.tractionMode === "brake" ? "rgba(245,158,11,0.2)" :
                selected.tractionMode === "reverse" ? "rgba(239,68,68,0.2)" : "var(--border)"
              }`,
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                  牵引模式: {TRACTION_MAP[selected.tractionMode]}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                  {selected.tractionMode === "accelerate" && "前方牵引电磁铁通电，车首尾间断电"}
                  {selected.tractionMode === "coast" && "牵引电磁铁断电，悬浮保持，惯性滑行"}
                  {selected.tractionMode === "brake" && "牵引电磁铁断电，螺线管闭合回收动能"}
                  {selected.tractionMode === "reverse" && "牵引电磁铁反向通电 + 螺线管反向通电，强制减速"}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {["accelerate", "coast", "brake", "reverse"].map(mode => (
                  <div key={mode} style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: selected.tractionMode === mode ? (
                      mode === "accelerate" ? "var(--accent)" :
                      mode === "brake" ? "var(--amber)" :
                      mode === "reverse" ? "var(--red)" : "var(--text-muted)"
                    ) : "var(--border)",
                    boxShadow: selected.tractionMode === mode ? `0 0 6px ${
                      mode === "accelerate" ? "var(--accent)" :
                      mode === "brake" ? "var(--amber)" :
                      mode === "reverse" ? "var(--red)" : "var(--text-muted)"
                    }` : "none",
                  }} />
                ))}
              </div>
            </div>
          </div>

          {/* Vehicle Info + System Check */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
            <div style={{ background: "var(--bg-hover)", borderRadius: 10, padding: 16 }}>
              <h4 style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 12 }}>车辆信息</h4>
              {[
                ["类型", TYPE_MAP[selected.type]],
                ["当前路线", selected.route],
                ["所在区段", selected.section],
                ["位置进度", `${selected.position.toFixed(1)}%`],
                ["悬浮间隙", "8-12 mm (正常)"],
                ["导向系统", "稳定"],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{k}</span>
                  <span style={{ fontSize: 12, color: "var(--text-primary)", fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ background: "var(--bg-hover)", borderRadius: 10, padding: 16 }}>
              <h4 style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 12 }}>系统自检</h4>
              {[
                ["悬浮电磁铁", "正常", "var(--green)"],
                ["导向电磁铁", "正常", "var(--green)"],
                ["防脱轨系统", "正常", "var(--green)"],
                ["激光测载光路", selected.load > 0 ? "正常" : "待机", selected.load > 0 ? "var(--green)" : "var(--text-muted)"],
                ["激光测速模块", selected.speed > 0 ? "正常" : "待机", selected.speed > 0 ? "var(--green)" : "var(--text-muted)"],
                ["动能回收线圈", selected.tractionMode === "brake" ? "回收中" : "待机", selected.tractionMode === "brake" ? "var(--amber)" : "var(--green)"],
                ["牵引电磁铁", TRACTION_MAP[selected.tractionMode], selected.tractionMode === "reverse" ? "var(--red)" : selected.tractionMode === "accelerate" ? "var(--accent)" : "var(--green)"],
                ["通信模块", "正常", "var(--green)"],
                ["温控系统", "正常", "var(--green)"],
              ].map(([k, v, c]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{k}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: c }} />
                    <span style={{ fontSize: 12, color: c, fontWeight: 500 }}>{v}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}