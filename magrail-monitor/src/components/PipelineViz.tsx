import { useEffect, useState } from "react";
import type { Vehicle } from "../data/mockData";

interface PipelineVizProps {
  vehicles: Vehicle[];
  compact?: boolean;
}

interface MovingDot {
  id: string;
  progress: number;
  speed: number;
  route: number;
  color: string;
  status: string;
}

const STATUS_COLORS: Record<string, string> = {
  running: "#00d4ff",
  idle: "#94a3b8",
  charging: "#f59e0b",
  maintenance: "#8b5cf6",
  error: "#ef4444",
};

export default function PipelineViz({ vehicles, compact = false }: PipelineVizProps) {
  const [dots, setDots] = useState<MovingDot[]>([]);

  useEffect(() => {
    const dotsFromVehicles = vehicles.slice(0, 8).map(v => ({
      id: v.id,
      progress: v.position / 100,
      speed: v.speed / 60 * 0.3,
      route: v.route.includes("A") ? 0 : v.route.includes("B") ? 1 : 0,
      color: STATUS_COLORS[v.status] || "#64748b",
      status: v.status,
    }));
    setDots(dotsFromVehicles);
  }, [vehicles.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.map(d => {
        let progress = d.progress + d.speed;
        if (progress > 1) progress -= 1;
        return { ...d, progress };
      }));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const getDotPosition = (progress: number, pathIndex: number) => {
    if (pathIndex === 0) {
      const angle = progress * Math.PI * 2;
      const cx = 270, cy = 220, rx = 220, ry = 170;
      return { x: cx + rx * Math.cos(angle), y: cy + ry * Math.sin(angle) };
    } else {
      const angle = progress * Math.PI * 2;
      const cx = 620, cy = 200, rx = 70, ry = 70;
      return { x: cx + rx * Math.cos(angle), y: cy + ry * Math.sin(angle) };
    }
  };

  return (
    <div style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      borderRadius: 12,
      padding: compact ? 16 : 20,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600 }}>管道网络实时状态</h3>
        <div style={{ display: "flex", gap: 12, fontSize: 11 }}>
          {Object.entries(STATUS_COLORS).map(([status, color]) => (
            <div key={status} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
              <span style={{ color: "var(--text-muted)" }}>
                {status === "running" ? "运行" : status === "idle" ? "待命" : status === "charging" ? "充电" : status === "maintenance" ? "维护" : "故障"}
              </span>
            </div>
          ))}
        </div>
      </div>
      <svg viewBox="0 0 800 440" style={{ width: "100%", height: "auto" }}>
        <defs>
          <filter id="plGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="pipeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="50%" stopColor="#2a3a5c" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
        </defs>

        {Array.from({ length: 8 }, (_, i) =>
          Array.from({ length: 8 }, (_, j) => (
            <circle key={`grid-${i}-${j}`} cx={i * 110 + 20} cy={j * 60 + 20} r={1} fill="#1e293b" />
          ))
        )}

        <ellipse cx={270} cy={220} rx={220} ry={170} fill="none" stroke="url(#pipeGrad)" strokeWidth={12} opacity={0.6} />
        <ellipse cx={270} cy={220} rx={220} ry={170} fill="none" stroke="#334155" strokeWidth={14} opacity={0.4} />
        <ellipse cx={270} cy={220} rx={220} ry={170} fill="none" stroke="rgba(0,212,255,0.15)" strokeWidth={18} opacity={0.5} />

        <ellipse cx={620} cy={200} rx={70} ry={70} fill="none" stroke="url(#pipeGrad)" strokeWidth={10} opacity={0.6} />
        <ellipse cx={620} cy={200} rx={70} ry={70} fill="none" stroke="#334155" strokeWidth={12} opacity={0.4} />

        <line x1={340} y1={150} x2={580} y2={150} stroke="url(#pipeGrad)" strokeWidth={8} opacity={0.5} strokeLinecap="round" />
        <path d="M340,290 C420,300 500,280 580,260" fill="none" stroke="url(#pipeGrad)" strokeWidth={8} opacity={0.5} strokeLinecap="round" />

        {[0, 0.25, 0.5, 0.75].map(offset => {
          const angle = offset * Math.PI * 2 - Math.PI / 2;
          const cx = 270, cy = 220, rx = 228, ry = 178;
          return (
            <g key={`marker-a-${offset}`}>
              <circle cx={cx + rx * Math.cos(angle)} cy={cy + ry * Math.sin(angle)} r={4} fill="#334155" stroke="rgba(0,212,255,0.3)" strokeWidth={2} />
              <text x={cx + rx * Math.cos(angle) + 10} y={cy + ry * Math.sin(angle) + 4} fill="#64748b" fontSize={10}>
                S{Math.floor(offset * 8) + 1}
              </text>
            </g>
          );
        })}

        {dots.map(dot => {
          const pos = getDotPosition(dot.progress, dot.route);
          const isRunning = dot.status === "running";
          return (
            <g key={dot.id} filter={isRunning ? "url(#plGlow)" : undefined}>
              {isRunning && (
                <circle cx={pos.x} cy={pos.y} r={8} fill="none" stroke={dot.color} strokeWidth={2} opacity={0.4}>
                  <animate attributeName="r" values="8;14;8" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
                </circle>
              )}
              <circle cx={pos.x} cy={pos.y} r={5} fill={dot.color} />
              <text x={pos.x} y={pos.y - 10} fill={dot.color} fontSize={9} textAnchor="middle" fontWeight={500}>
                {dot.id}
              </text>
            </g>
          );
        })}

        <text x={270} y={215} fill="#64748b" fontSize={13} textAnchor="middle" fontWeight={600}>A线 · 主物流环</text>
        <text x={620} y={195} fill="#64748b" fontSize={11} textAnchor="middle">B线 · 仓储环</text>
      </svg>

      {!compact && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginTop: 12, padding: "0 8px" }}>
          {[
            { label: "管道总长", value: "2.8 km" },
            { label: "设计时速", value: "80 km/h" },
            { label: "悬浮间隙", value: "8-12 mm" },
            { label: "年运力", value: "800 万吨" },
          ].map(item => (
            <div key={item.label} style={{ textAlign: "center", padding: "8px 4px", background: "var(--bg-hover)", borderRadius: 8 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "var(--accent)" }}>{item.value}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{item.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}