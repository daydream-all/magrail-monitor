import os

BASE = r"C:\Users\吕程扬\Documents\app\magrail-monitor\src"

files = {}

files["data/mockData.ts"] = """// 模拟实时数据引擎 - 磁轨智行智能物流监控系统

export interface Vehicle {
  id: string;
  name: string;
  type: "light" | "medium" | "heavy";
  status: "running" | "idle" | "charging" | "maintenance" | "error";
  speed: number;
  position: number;
  battery: number;
  load: number;
  maxLoad: number;
  temperature: number;
  route: string;
  section: string;
}

export interface EnergyData {
  timestamp: string;
  consumption: number;
  recovery: number;
  efficiency: number;
}

export interface Alert {
  id: string;
  time: string;
  severity: "info" | "warning" | "error" | "critical";
  vehicleId: string | null;
  section: string | null;
  message: string;
  resolved: boolean;
}

export interface SystemStats {
  onlineVehicles: number;
  totalVehicles: number;
  todayTransport: number;
  todayDistance: number;
  energyRecoveryRate: number;
  systemEfficiency: number;
  co2Reduction: number;
  pipelineStatus: "normal" | "degraded" | "error";
}

const VEHICLE_NAMES = [
  "磁轨-01", "磁轨-02", "磁轨-03", "磁轨-05", "磁轨-06",
  "磁轨-07", "磁轨-08", "磁轨-09", "磁轨-10", "磁轨-11",
  "磁轨-12", "磁轨-13", "磁轨-15", "磁轨-16", "磁轨-17",
  "磁轨-18"
];

const ROUTES = ["A线-原料段", "A线-加工段", "A线-成品段", "B线-原料段", "B线-组装段", "B线-仓储段"];
const TYPES: Vehicle["type"][] = ["light", "medium", "heavy"];

function randomStatus(): Vehicle["status"] {
  const r = Math.random();
  if (r < 0.65) return "running";
  if (r < 0.85) return "idle";
  if (r < 0.95) return "charging";
  if (r < 0.99) return "maintenance";
  return "error";
}

export function generateVehicles(): Vehicle[] {
  return VEHICLE_NAMES.map((name, i) => {
    const type = TYPES[i % 3];
    const maxLoad = type === "light" ? 50 : type === "medium" ? 200 : 500;
    const status = randomStatus();
    return {
      id: `V-${String(i + 1).padStart(3, "0")}`,
      name,
      type,
      status,
      speed: status === "running" ? 20 + Math.random() * 60 : 0,
      position: Math.random() * 100,
      battery: 60 + Math.random() * 40,
      load: status === "running" ? Math.random() * maxLoad : maxLoad * (0.8 + Math.random() * 0.2),
      maxLoad,
      temperature: 25 + Math.random() * 15,
      route: ROUTES[i % ROUTES.length],
      section: `S${Math.floor(Math.random() * 8) + 1}`
    };
  });
}

export function generateEnergyData(hours: number = 24): EnergyData[] {
  const data: EnergyData[] = [];
  const now = new Date();
  for (let i = hours; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 3600000);
    const baseConsumption = 40 + Math.random() * 20;
    const recoveryRate = 0.3 + Math.random() * 0.2;
    data.push({
      timestamp: `${t.getHours().toString().padStart(2, "0")}:00`,
      consumption: Math.round(baseConsumption * 10) / 10,
      recovery: Math.round(baseConsumption * recoveryRate * 10) / 10,
      efficiency: Math.round(recoveryRate * 100)
    });
  }
  return data;
}

const ALERT_TEMPLATES = [
  { msg: "悬浮控制系统温度偏高", sev: "warning" as const, hasVehicle: true, hasSection: true },
  { msg: "动能回收效率低于阈值", sev: "warning" as const, hasVehicle: false, hasSection: true },
  { msg: "管道内磁场异常波动", sev: "error" as const, hasVehicle: false, hasSection: true },
  { msg: "车辆通信超时", sev: "error" as const, hasVehicle: true, hasSection: false },
  { msg: "导向电磁铁电流异常", sev: "critical" as const, hasVehicle: true, hasSection: true },
  { msg: "防脱轨系统自检完成", sev: "info" as const, hasVehicle: false, hasSection: true },
  { msg: "感应线圈阵列校准完成", sev: "info" as const, hasVehicle: false, hasSection: true },
  { msg: "车辆进入节能模式", sev: "info" as const, hasVehicle: true, hasSection: false },
  { msg: "管道密封性检测通过", sev: "info" as const, hasVehicle: false, hasSection: true },
  { msg: "电网波动导致供电不稳", sev: "warning" as const, hasVehicle: false, hasSection: false },
];

export function generateAlerts(count: number = 50): Alert[] {
  const alerts: Alert[] = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const tpl = ALERT_TEMPLATES[Math.floor(Math.random() * ALERT_TEMPLATES.length)];
    const time = new Date(now.getTime() - Math.random() * 86400000);
    alerts.push({
      id: `ALT-${String(i + 1).padStart(4, "0")}`,
      time: time.toISOString(),
      severity: tpl.sev,
      vehicleId: tpl.hasVehicle ? `V-${String(Math.floor(Math.random() * 16) + 1).padStart(3, "0")}` : null,
      section: tpl.hasSection ? `S${Math.floor(Math.random() * 8) + 1}` : null,
      message: tpl.msg,
      resolved: Math.random() > 0.3
    });
  }
  return alerts.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
}

export function getSystemStats(): SystemStats {
  return {
    onlineVehicles: 14 + Math.floor(Math.random() * 3),
    totalVehicles: 16,
    todayTransport: Math.round(42.5 + Math.random() * 5),
    todayDistance: Math.round(1280 + Math.random() * 120),
    energyRecoveryRate: Math.round(38 + Math.random() * 8),
    systemEfficiency: Math.round(92 + Math.random() * 5),
    co2Reduction: Math.round(2.8 + Math.random() * 0.4),
    pipelineStatus: Math.random() > 0.95 ? "degraded" : "normal"
  };
}
"""

for name, content in files.items():
    path = os.path.join(BASE, name)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Written: {name}")