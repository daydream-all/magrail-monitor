import { useState, useEffect } from "react";
import { generateEnergyData } from "../data/mockData";
import type { EnergyData } from "../data/mockData";
import { Zap, TrendingUp, Battery, Leaf } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function EnergyMonitor() {
  const [dailyData, setDailyData] = useState<EnergyData[]>(generateEnergyData(24));
  const [stats, setStats] = useState({ totalConsumption: 0, totalRecovery: 0, avgEfficiency: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setDailyData(prev => {
        const now = new Date();
        const newPoint = {
          timestamp: `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`,
          consumption: Math.round((38 + Math.random() * 22) * 10) / 10,
          recovery: Math.round((12 + Math.random() * 16) * 10) / 10,
          efficiency: Math.round((30 + Math.random() * 20) * 10) / 10,
        };
        return [...prev.slice(-23), newPoint];
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const total = dailyData.reduce((s, d) => s + d.consumption, 0);
    const recovered = dailyData.reduce((s, d) => s + d.recovery, 0);
    setStats({
      totalConsumption: Math.round(total * 10) / 10,
      totalRecovery: Math.round(recovered * 10) / 10,
      avgEfficiency: Math.round(dailyData.reduce((s, d) => s + d.efficiency, 0) / dailyData.length),
    });
  }, [dailyData]);

  const pieData = [
    { name: "动能回收", value: stats.totalRecovery, color: "#10b981" },
    { name: "电网供电", value: stats.totalConsumption - stats.totalRecovery, color: "#00d4ff" },
    { name: "损耗", value: Math.round((stats.totalConsumption - stats.totalRecovery) * 0.12 * 10) / 10, color: "#64748b" },
  ];

  const weeklyData = ["周一","周二","周三","周四","周五","周六","周日"].map((day) => ({
    day,
    consumption: Math.round((420 + Math.random() * 80) * 10) / 10,
    recovery: Math.round((160 + Math.random() * 60) * 10) / 10,
  }));

  return (
    <div style={{ animation: "fadeIn 0.5s ease", display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {[
          { icon: Zap, label: "今日总能耗", value: `${stats.totalConsumption} kWh`, color: "var(--accent)", trend: "↓5%" },
          { icon: TrendingUp, label: "动能回收量", value: `${stats.totalRecovery} kWh`, color: "var(--green)", trend: "↑8%" },
          { icon: Battery, label: "平均回收效率", value: `${stats.avgEfficiency}%`, color: "var(--amber)", trend: "↑3%" },
          { icon: Leaf, label: "CO2减排", value: `${(stats.totalRecovery * 0.5).toFixed(0)} kg`, color: "#10b981", trend: "↑12%" },
        ].map(item => (
          <div key={item.label} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: "18px 22px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>{item.label}</p>
                <div style={{ fontSize: 26, fontWeight: 700, color: item.color }}>{item.value}</div>
              </div>
              <div style={{ width: 42, height: 42, borderRadius: 10, background: `${item.color}22`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <item.icon size={20} color={item.color} />
              </div>
            </div>
            <div style={{ marginTop: 10, fontSize: 12, color: "var(--green)", fontWeight: 500 }}>{item.trend} 较昨日</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>24小时能耗趋势</h3>
          <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 16 }}>能耗 vs 动能回收 · 实时监测</p>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={dailyData}>
              <defs>
                <linearGradient id="cGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00d4ff" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#00d4ff" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="rGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="timestamp" stroke="#64748b" fontSize={10} tickLine={false} interval={3} />
              <YAxis stroke="#64748b" fontSize={10} tickLine={false} unit="kW" />
              <Tooltip contentStyle={{ background: "#1e2433", border: "1px solid #2a3344", borderRadius: 8, fontSize: 12, color: "#e2e8f0" }} />
              <Area type="monotone" dataKey="consumption" stroke="#00d4ff" fill="url(#cGrad)" strokeWidth={2} name="能耗" />
              <Area type="monotone" dataKey="recovery" stroke="#10b981" fill="url(#rGrad)" strokeWidth={2} name="回收" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>能源结构分布</h3>
          <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 16 }}>电网供电 · 动能回收 · 线路损耗</p>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                {pieData.map((entry, i) => <Cell key={i} fill={entry.color} stroke="transparent" />)}
              </Pie>
              <Tooltip contentStyle={{ background: "#1e2433", border: "1px solid #2a3344", borderRadius: 8, fontSize: 12, color: "#e2e8f0" }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 8 }}>
            {pieData.map(d => (
              <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: d.color }} />
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{d.name}</span>
                <span style={{ fontSize: 11, fontWeight: 600 }}>{d.value} kWh</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>综合能效评估</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {[
              { label: "系统效率", value: "94.2%", color: "var(--green)", sub: "高于行业标准" },
              { label: "悬浮能耗", value: "0.8 kW", color: "var(--accent)", sub: "/每吨·公里" },
              { label: "对比传统", value: "节能 95%", color: "var(--purple)", sub: "较公路运输" },
            ].map(item => (
              <div key={item.label} style={{ background: "var(--bg-hover)", borderRadius: 10, padding: 16, textAlign: "center" }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: item.color, marginBottom: 4 }}>{item.value}</div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 2 }}>{item.label}</div>
                <div style={{ fontSize: 10, color: "var(--text-muted)" }}>{item.sub}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 20, padding: 16, background: "var(--bg-hover)", borderRadius: 10, border: "1px solid rgba(0,212,255,0.1)" }}>
            <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, color: "var(--accent)" }}>
              <Zap size={14} style={{ display: "inline", marginRight: 6, verticalAlign: "middle" }} />
              动能回收原理
            </h4>
            <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.8 }}>
              管道内壁布设感应线圈阵列。当磁悬浮车辆通过时，车体磁场引起线圈磁通量变化，
              依据<strong style={{ color: "var(--accent)" }}>法拉第电磁感应定律</strong>产生感应电流，
              经整流稳压后回馈至储能系统，实现动能→电能的高效转化。
              综合节能率可达<strong style={{ color: "var(--green)" }}>40%以上</strong>。
            </p>
          </div>
        </div>

        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>七日能耗对比</h3>
          <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 16 }}>每日能耗与回收量对比 (kWh)</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip contentStyle={{ background: "#1e2433", border: "1px solid #2a3344", borderRadius: 8, fontSize: 12, color: "#e2e8f0" }} />
              <Bar dataKey="consumption" fill="#00d4ff" radius={[4,4,0,0]} name="能耗" />
              <Bar dataKey="recovery" fill="#10b981" radius={[4,4,0,0]} name="回收" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}