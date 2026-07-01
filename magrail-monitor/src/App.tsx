import { useEffect, useMemo, useState } from "react";
import { Bell, Box, CloudSun, Cpu, Gauge, Home, Layers, Radio, Route, ShieldCheck, ThermometerSun, Users, Zap } from "lucide-react";
import { Area, AreaChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import "./App.css";

const vehicles = [
  ["FL-001", "7.21", "820", "运行中", "78%"],
  ["FL-002", "6.45", "760", "运行中", "65%"],
  ["FL-003", "6.21", "910", "运行中", "82%"],
  ["FL-004", "0.00", "0", "停靠中", "100%"],
  ["FL-005", "8.12", "680", "运行中", "71%"],
  ["FL-006", "9.05", "950", "运行中", "63%"],
  ["FL-007", "8.62", "830", "运行中", "76%"],
  ["FL-008", "0.00", "0", "检修中", "-"],
  ["FL-009", "7.88", "710", "运行中", "69%"],
  ["FL-010", "6.02", "500", "运行中", "58%"],
  ["FL-011", "9.11", "880", "运行中", "74%"],
  ["FL-012", "0.00", "0", "待发车", "100%"],
];

const sections = [
  { id: "home", label: "首页", Icon: Home },
  { id: "tech", label: "核心技术", Icon: Cpu },
  { id: "architecture", label: "系统架构", Icon: Layers },
  { id: "demo", label: "动态演示", Icon: Radio },
  { id: "console", label: "总控制台", Icon: Gauge },
  { id: "scenarios", label: "应用场景", Icon: Route },
  { id: "about", label: "关于我们", Icon: Users },
];

const initialEnergyTrend = [
  { time: "14:20", value: 360 }, { time: "14:30", value: 620 }, { time: "14:40", value: 1180 },
  { time: "14:50", value: 1660 }, { time: "15:00", value: 2360 }, { time: "15:10", value: 2680 },
  { time: "15:20", value: 2700 }, { time: "15:30", value: 3260 }, { time: "15:40", value: 3120 },
  { time: "15:50", value: 3740 }, { time: "16:00", value: 3860 },
];

const pieData = [
  { name: "悬浮系统", value: 28, color: "#26d7c4" },
  { name: "牵引系统", value: 32, color: "#f8a629" },
  { name: "控制系统", value: 12, color: "#b9c2d0" },
  { name: "辅助系统", value: 8, color: "#1388ff" },
  { name: "能量回收", value: 20, color: "#23da5b" },
];

function FluxLogo() {
  return (
    <div className="brand">
      <img className="brand-image" src={`${import.meta.env.BASE_URL}fluxloop-logo-cropped.png`} alt="FluxLoop logo" />
    </div>
  );
}
function MaglevVehicle() {
  return (
    <g className="vehicle">
      <ellipse cx="276" cy="262" rx="168" ry="12" fill="#00aaff" opacity="0.2" />
      <path className="levitation-wave" d="M124 272 C182 258 252 283 314 268 S398 260 448 271" />
      <path className="car-shadow" d="M86 228 C124 181 306 169 420 191 C460 199 487 225 476 244 C461 272 192 278 100 251 C82 246 73 239 86 228Z" />
      <path className="car-body" d="M82 222 C119 176 304 164 421 187 C462 195 491 222 480 243 C463 274 190 280 98 251 C77 244 67 235 82 222Z" />
      <path className="car-cabin" d="M134 211 C176 176 315 171 402 190 C434 197 454 212 459 229 C352 222 232 222 108 236 C112 226 121 217 134 211Z" />
      <path className="car-window" d="M155 210 C198 188 314 185 389 198 C418 203 437 213 445 225 C351 220 252 222 127 234 C133 224 141 216 155 210Z" />
      <path className="car-nose" d="M417 223 C450 223 468 232 454 242 C435 256 381 260 330 257 C365 247 395 236 417 223Z" />
      <path className="car-tail" d="M91 224 C106 204 132 191 160 185 C146 205 138 225 134 250 C105 247 84 240 78 233 C76 230 81 225 91 224Z" />
      <path className="car-side" d="M115 239 C202 224 345 225 444 231 C423 253 368 265 216 264 C151 263 109 256 95 246Z" />
      <path className="car-glass-cut" d="M332 197 C361 199 389 204 414 215 L349 220 C339 212 334 204 332 197Z" />
      <path className="car-highlight" d="M139 202 C204 179 322 178 396 194" />
      <g className="cube-mark" transform="translate(246 231)">
        <path d="M0 7 L12 0 L24 7 L12 14Z" />
        <path d="M0 7 L0 21 L12 28 L12 14Z" />
        <path d="M24 7 L24 21 L12 28 L12 14Z" />
      </g>
      <path className="car-skirt" d="M142 258 C226 267 354 267 420 254" />
      <path className="rear-grille" d="M413 195 v32M424 199 v29M435 205 v23" />
    </g>
  );
}

function Metric({ label, value, unit }: { label: string; value: string; unit: string }) {
  return <div className="metric"><span>{label}</span><strong>{value}</strong><em>{unit}</em></div>;
}

function Callout({ x, y, title, text, targetX, targetY }: { x: number; y: number; title: string; text: string; targetX: number; targetY: number }) {
  return (
    <g className="callout">
      <path d={`M${x + 62} ${y + 72} L${targetX} ${targetY}`} />
      <rect x={x} y={y} width="160" height="72" rx="7" />
      <text x={x + 16} y={y + 28}>{title}</text>
      <text x={x + 16} y={y + 53} className="callout-sub">{text}</text>
      <circle cx={targetX} cy={targetY} r="3" />
    </g>
  );
}

function MainTube() {
  return (
    <section className="main-tube panel">
      <svg viewBox="0 0 980 460" className="tube-svg" role="img" aria-label="透明管道磁悬浮物流车模型">
        <defs>
          <linearGradient id="tubeGlass" x1="0" x2="1"><stop offset="0" stopColor="#93d8ff" stopOpacity="0.1" /><stop offset="0.5" stopColor="#d7f5ff" stopOpacity="0.25" /><stop offset="1" stopColor="#1a9fe6" stopOpacity="0.08" /></linearGradient>
          <linearGradient id="railLine" x1="0" x2="1"><stop offset="0" stopColor="#0c2033" /><stop offset="0.55" stopColor="#d5f7ff" /><stop offset="1" stopColor="#0b1d2c" /></linearGradient>
          <filter id="blueGlow"><feGaussianBlur stdDeviation="5" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <filter id="orangeGlow"><feGaussianBlur stdDeviation="4" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <path className="perspective-floor" d="M30 408 L930 314 L980 460 L0 460Z" />
        <g className="tube" transform="translate(38 34)">
          <path d="M42 220 C176 104 690 53 896 95 C946 105 953 239 895 265 C686 358 166 336 42 254 C18 238 18 232 42 220Z" fill="url(#tubeGlass)" />
          <path d="M40 216 C176 100 690 49 897 91" />
          <path d="M40 257 C171 341 684 364 897 270" />
          <path d="M94 194 L876 121" className="laser-line" />
          <path d="M90 272 L864 256" className="rail-line" />
          <path d="M118 296 L826 270" className="rail-line lower" />
          <g transform="translate(150 30)"><MaglevVehicle /></g>
          {[190, 306, 422, 540, 658, 772].map((x) => <g key={x} className="blue-ring" transform={`translate(${x} 0)`}><ellipse cx="0" cy="188" rx="20" ry="94" /><ellipse cx="0" cy="188" rx="29" ry="106" opacity="0.35" /></g>)}
          {Array.from({ length: 24 }, (_, i) => <g key={i} transform={`translate(${440 + i * 16} ${216 - i * 1.2})`} className={i > 15 ? "coil green" : "coil"}><ellipse cx="0" cy="0" rx="6" ry="25" /><path d="M0 -25 L10 -18 L10 18 L0 25" /></g>)}
          <g className="sensor" transform="translate(82 196)"><rect x="-30" y="-16" width="34" height="32" rx="3" /><path d="M8 -9 C24 -2 24 2 8 9" /><path d="M15 -17 C43 -5 43 5 15 17" /></g>
          <g className="sensor" transform="translate(874 162)"><rect x="0" y="-16" width="34" height="32" rx="3" /><path d="M-5 -9 C-21 -2 -21 2 -5 9" /><path d="M-12 -17 C-40 -5 -40 5 -12 17" /></g>
        </g>
        <Callout x={186} y={126} title="激光检测器" text="实时检测车辆位置与质量" targetX={226} targetY={242} />
        <Callout x={420} y={86} title="悬浮电磁铁阵列" text="动态调节电流保持悬浮" targetX={512} targetY={236} />
        <Callout x={638} y={58} title="线圈供电区" text="分段供电，动态推送" targetX={694} targetY={205} />
        <Callout x={736} y={320} title="动能回收线圈" text="回收制动能量并存储" targetX={764} targetY={245} />
      </svg>
      <div className="summary-strip">
        <Metric label="平均速度" value="7.62" unit="m/s" />
        <Metric label="平均载重" value="823" unit="kg" />
        <Metric label="回收功率" value="386" unit="kW" />
        <div className="status-big"><span>系统状态</span><strong>稳定运行</strong></div>
      </div>
    </section>
  );
}

function OverviewPanel() {
  const [trend, setTrend] = useState(initialEnergyTrend);
  const [energySplit, setEnergySplit] = useState(pieData);

  useEffect(() => {
    const timer = window.setInterval(() => {
      const now = new Date();
      const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      setTrend((items) => {
        const last = items.at(-1)?.value ?? 3200;
        const next = Math.max(280, Math.min(4200, Math.round(last + (Math.random() - 0.35) * 520)));
        return [...items.slice(-10), { time, value: next }];
      });
      setEnergySplit((items) => {
        const shifted = items.map((item) => ({
          ...item,
          value: Math.max(6, item.value + Math.round((Math.random() - 0.5) * 4)),
        }));
        const total = shifted.reduce((sum, item) => sum + item.value, 0);
        return shifted.map((item) => ({ ...item, value: Math.round((item.value / total) * 100) }));
      });
    }, 2200);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <aside className="left-rail">
      <section className="panel overview">
        <h2>系统运行概览</h2>
        <div className="stat-grid">
          <div><span>运行车辆</span><strong className="blue">12</strong><em>辆</em></div>
          <div><span>在线轨道</span><strong>8</strong><em>/ 10</em></div>
          <div><span>今日运输量</span><strong>18,568</strong><em>吨</em></div>
          <div><span>能量回收</span><strong>2,846</strong><em>kWh</em></div>
          <div><span>系统效率</span><strong>92.7</strong><em>%</em></div>
          <div><span>安全状态</span><strong className="green">正常</strong></div>
        </div>
      </section>
      <section className="panel chart-card"><h2>能源回收趋势（实时）<span className="live-dot">LIVE</span></h2><ResponsiveContainer width="100%" height={150}><AreaChart data={trend}><defs><linearGradient id="energyFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#31f66b" stopOpacity={0.55} /><stop offset="100%" stopColor="#31f66b" stopOpacity={0.04} /></linearGradient></defs><XAxis dataKey="time" tick={{ fill: "#8aa1b8", fontSize: 10 }} axisLine={false} tickLine={false} /><YAxis tick={{ fill: "#8aa1b8", fontSize: 10 }} axisLine={false} tickLine={false} width={34} /><Tooltip contentStyle={{ background: "#06121f", border: "1px solid #0d70a6", color: "#dff7ff" }} /><Area dataKey="value" stroke="#31f66b" fill="url(#energyFill)" strokeWidth={2} isAnimationActive /></AreaChart></ResponsiveContainer></section>
      <section className="panel pie-card"><h2>系统能耗分布<span className="live-dot">LIVE</span></h2><div className="pie-row"><ResponsiveContainer width="42%" height={128}><PieChart><Pie data={energySplit} innerRadius={35} outerRadius={58} dataKey="value" paddingAngle={2} isAnimationActive animationDuration={700}>{energySplit.map((item) => <Cell key={item.name} fill={item.color} />)}</Pie></PieChart></ResponsiveContainer><div className="pie-legend">{energySplit.map((item) => <div key={item.name}><i style={{ background: item.color }} />{item.name}<span>{item.value}%</span></div>)}</div></div></section>
      <section className="panel map-card"><h2>轨道网络地图</h2><TrackMap /></section>
    </aside>
  );
}

function VehiclePanel() {
  const [selectedVehicle, setSelectedVehicle] = useState(vehicles[0]);
  const [showAll, setShowAll] = useState(false);
  const [acknowledged, setAcknowledged] = useState<string[]>([]);
  const visibleVehicles = showAll ? vehicles : vehicles.slice(0, 9);
  const alerts = [
    ["a1", "orange", "FL-008 牵引电机温度过高", "15:22:11"],
    ["a2", "yellow", "轨道 T03 段能量回收效率下降", "15:21:45"],
    ["a3", "blue-dot", "激光传感器 L-21 信号弱", "15:20:32"],
  ];
  return (
    <aside className="right-rail">
      <section className="panel vehicle-list">
        <div className="panel-head"><h2>车辆列表（12）</h2><button type="button" onClick={() => setShowAll((value) => !value)}>{showAll ? "收起" : "查看全部"}</button></div>
        <table><thead><tr><th>车辆ID</th><th>速度(m/s)</th><th>载重(kg)</th><th>状态</th><th>电量/回收</th></tr></thead><tbody>{visibleVehicles.map((v) => <tr key={v[0]} onClick={() => setSelectedVehicle(v)} className={selectedVehicle[0] === v[0] ? "selected-row" : ""}><td>{v[0]}</td><td>{v[1]}</td><td>{v[2]}</td><td className={v[3] === "运行中" ? "ok" : v[3] === "检修中" ? "warn" : "idle"}>{v[3]}</td><td>{v[4]}</td></tr>)}</tbody></table>
        <div className="vehicle-detail"><strong>{selectedVehicle[0]} 实时详情</strong><span>牵引电流 {(Number(selectedVehicle[1]) * 8.4).toFixed(1)} A</span><span>悬浮气隙 {selectedVehicle[3] === "运行中" ? "9.6 mm" : "待校准"}</span><span>回收策略 {Number(selectedVehicle[2]) > 850 ? "重载辅助" : "标准回收"}</span></div>
      </section>
      <section className="panel alerts">
        <div className="panel-head"><h2>告警信息</h2><button type="button" onClick={() => setAcknowledged(alerts.map((alert) => alert[0]))}>全部确认</button></div>
        {alerts.map(([id, color, text, time]) => <button type="button" key={id} className={acknowledged.includes(id) ? "alert-row ack" : "alert-row"} onClick={() => setAcknowledged((list) => list.includes(id) ? list.filter((item) => item !== id) : [...list, id])}><i className={color} />{text}<span>{acknowledged.includes(id) ? "已确认" : time}</span></button>)}
      </section>
    </aside>
  );
}

function TrackMap() {
  const routes = [
    { id: "route-main", className: "track blue-track", d: "M100 60 H660 Q700 60 700 100 V190 Q700 230 660 230 H100 Q60 230 60 190 V100 Q60 60 100 60Z" },
    { id: "route-inner", className: "track green-track", d: "M100 230 V162 Q100 130 132 130 H300 Q360 130 380 60" },
    { id: "route-recover", className: "track orange-track", d: "M380 230 C474 182 590 184 700 190" },
    { id: "route-service", className: "track red-track", d: "M380 60 V146 H560 Q620 146 620 230" },
  ];
  const cityBlocks = [
    [38, 28, 78, 38], [160, 26, 82, 38], [292, 26, 72, 38], [430, 26, 86, 38], [572, 26, 78, 38],
    [156, 92, 82, 48], [430, 92, 92, 48], [570, 92, 78, 48], [156, 162, 78, 38], [286, 166, 92, 42],
    [430, 166, 84, 42], [38, 214, 78, 34], [158, 218, 86, 32], [438, 218, 88, 32], [646, 218, 72, 32],
  ];
  const stations = [
    { name: "S0 ???", x: 60, y: 190, type: "depart" },
    { name: "S1 ???", x: 100, y: 60, type: "stop" },
    { name: "S2 ???", x: 380, y: 60, type: "stop" },
    { name: "S3 ???", x: 700, y: 100, type: "power" },
    { name: "S4 ???", x: 700, y: 190, type: "recover" },
    { name: "S5 ???", x: 620, y: 230, type: "stop" },
    { name: "S6 ????", x: 560, y: 146, type: "service" },
    { name: "S7 ????", x: 100, y: 230, type: "power" },
    { name: "S8 ????", x: 380, y: 230, type: "recover" },
  ];
  const movingCars = [
    { id: "FL-001", speed: "7.21 m/s", route: "#route-main", delay: "0s", duration: "18s" },
    { id: "FL-003", speed: "6.21 m/s", route: "#route-recover", delay: "-4s", duration: "9s" },
    { id: "FL-007", speed: "8.62 m/s", route: "#route-inner", delay: "-7s", duration: "10s" },
    { id: "FL-011", speed: "9.11 m/s", route: "#route-service", delay: "-2s", duration: "9s" },
  ];

  return (
    <svg viewBox="0 0 760 270" className="track-map">
      <defs><filter id="mapGlow"><feGaussianBlur stdDeviation="3" /><feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
      {cityBlocks.map(([x, y, w, h], i) => <rect className="city-block" key={i} x={x} y={y} width={w} height={h} rx="3" />)}
      <path className="city-grid" d="M22 72 H732M20 136 H734M24 204 H728M142 18 V252M270 18 V252M398 18 V252M526 18 V252M654 18 V252" />
      {routes.map((route) => <path key={route.id} id={route.id} className={route.className} d={route.d} />)}
      {stations.map((station) => (
        <g className={`map-node ${station.type}`} key={station.name} transform={`translate(${station.x} ${station.y})`}>
          <circle r="10" />
          <circle r="4" className="node-core" />
          <text y={station.y < 80 ? "-16" : station.y > 205 ? "28" : "-16"}>{station.name}</text>
        </g>
      ))}
      {movingCars.map(({ id, speed, route, delay, duration }) => (
        <g key={id} className="map-car moving-car">
          <animateMotion dur={duration} repeatCount="indefinite" rotate="auto" begin={delay}>
            <mpath href={route} />
          </animateMotion>
          <rect x="-35" y="-40" width="76" height="40" rx="6" />
          <text x="0" y="-24">{id}</text>
          <text x="0" y="-9">{speed}</text>
          <path d="M-24 8 C-13 -4 20 -5 35 3 C44 8 39 17 20 18 L-26 17 C-38 15 -36 11 -24 8Z" />
          <path d="M-13 6 C0 0 20 0 29 5 L10 8 L-18 9Z" />
        </g>
      ))}
      <g className="station-guide"><path d="M60 190 L100 60 L380 60 L700 100 L700 190 L620 230 L380 230 L100 230 Z" /></g>
      <g className="map-legend"><text x="64" y="258">? ??</text><text x="190" y="258">? ??</text><text x="316" y="258">? ??</text><text x="442" y="258">? ??</text><text x="568" y="258">? ??</text></g>
    </svg>
  );
}

function BlueprintSection() {
  return (
    <section className="panel blueprint">
      <h2>关键与车辆剖面图</h2>
      <svg viewBox="0 0 980 300" className="blueprint-svg">
        <path className="bp-tube" d="M55 126 C210 82 750 66 934 101 C968 108 968 195 934 207 C739 278 216 250 54 192 C25 182 26 137 55 126Z" />
        <path className="bp-rail" d="M82 190 C236 205 722 214 913 176" /><path className="bp-rail lower" d="M102 220 C288 229 684 228 884 190" />
        <g transform="translate(120 -15) scale(.92)"><MaglevVehicle /></g>
        {Array.from({ length: 17 }, (_, i) => <g key={i} className={i > 10 ? "bp-coil recover" : "bp-coil"} transform={`translate(${560 + i * 18} 166)`}><ellipse cx="0" cy="0" rx="6" ry="32" /></g>)}
        <path className="bp-current" d="M562 222 C630 208 710 230 778 215 S884 202 925 219" />
        <path className="bp-cool" d="M82 104 C220 74 738 56 914 91" />
        {["激光检测器", "悬浮电磁铁", "铝合金轨道管", "线圈供电区", "动能回收线圈", "车辆舱体", "导向轮", "悬浮气隙（8-12mm）", "牵引电磁铁", "能量回收模块"].map((label, i) => {
          const top = i < 5;
          const x = top ? 170 + i * 150 : 190 + (i - 5) * 154;
          const y = top ? 55 : 260;
          const tx = top ? 150 + i * 160 : 226 + (i - 5) * 154;
          const ty = top ? 128 + (i % 2) * 32 : 196 + ((i - 5) % 2) * 18;
          return <g key={label} className="bp-label"><path d={`M${x} ${y + 8} L${tx} ${ty}`} /><circle cx={tx} cy={ty} r="3" /><text x={x} y={y}>{label}</text></g>;
        })}
        <g className="bp-legend"><text x="832" y="52">━ 导能冷馈</text><text x="832" y="78" className="orange-text">━ 电流(I)</text><text x="832" y="104" className="yellow-text">━ 回收功率(kW)</text></g>
      </svg>
    </section>
  );
}

function SimulationPanel() {
  const [mass, setMass] = useState(820);
  const [speed, setSpeed] = useState(7.6);
  const [distance, setDistance] = useState(420);
  const result = useMemo(() => {
    const current = Math.max(4, (mass - 280) / 38);
    const safeTime = 0.38 + 0.00082 * mass;
    const powerLength = speed * safeTime;
    const kinetic = 0.5 * mass * speed * speed / 1000;
    const coils = Math.ceil(kinetic / 0.78 / 1.15);
    const heavy = mass > 850;
    const braking = distance < 300 && speed > (heavy ? 4.8 : 5.8);
    return { current, safeTime, powerLength, kinetic, coils, recoverDistance: coils * 1.8, heavy, braking };
  }, [mass, speed, distance]);
  return (
    <section className="panel simulation" id="demo">
      <div className="panel-head"><h2>动态演示：载重-电流-回收制动联动</h2><span>{result.heavy ? "重载辅助已启用" : "标准牵引模式"}</span></div>
      <div className="sim-grid">
        <div className="sliders"><label>载重 M：{mass} kg<input type="range" min="420" max="1100" value={mass} onChange={(e) => setMass(Number(e.target.value))} /></label><label>当前速度 V：{speed.toFixed(1)} m/s<input type="range" min="2" max="12" step="0.1" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} /></label><label>距终点 D：{distance} m<input type="range" min="80" max="800" value={distance} onChange={(e) => setDistance(Number(e.target.value))} /></label></div>
        <div className="calc-grid"><Metric label="悬浮补偿电流" value={result.current.toFixed(1)} unit="A" /><Metric label="最短安全时间" value={result.safeTime.toFixed(2)} unit="s" /><Metric label="前方通电长度" value={result.powerLength.toFixed(1)} unit="m" /><Metric label="可回收动能" value={result.kinetic.toFixed(1)} unit="kJ" /><Metric label="回收线圈数量" value={`${result.coils}`} unit="组" /><Metric label="最大回收距离" value={result.recoverDistance.toFixed(1)} unit="m" /></div>
      </div>
      <div className="segment-track">{Array.from({ length: 18 }, (_, i) => <i key={i} className={result.braking && i > 13 ? "brake" : i > 8 && i <= 13 ? "recover" : i <= 6 ? "levitate" : "off"} />)}</div>
      <div className="formula-line">M_total = M0 + ksIlev · Δt_safe = t0 + kmM · L = V×Δt · Ek = 1/2MV² · Ncoil = ceil(Ek / ηEcoil)</div>
    </section>
  );
}

function TechStrip() {
  const [active, setActive] = useState("仿过山车三轮系磁悬浮结构");
  const items = [
    ["仿过山车三轮系磁悬浮结构", "以主轮、底轮、侧轮的安全约束为原型，将机械接触替换为垂直悬浮、侧向导向、底部防脱轨三组电磁铁阵列，实现三维主动约束。"],
    ["全封闭管道环境控制系统", "轨道完全封装在非磁性高强度管道内，隔绝雨雪、沙尘、盐雾、湿度和极端温度，提高电磁部件可靠性和寿命。"],
    ["磁通量变化动能回收系统", "在管道内壁按规律布设感应线圈，车辆磁场切割线圈产生感应电动势；减速、下坡或滑行时接通回收电路形成再生制动。"],
    ["多载具独立控制与能量闭环", "每个运载单元可独立路径规划和运动控制；回收电能供悬浮、控制、照明或反馈园区电网，形成内部能量循环。"],
  ];
  return <section className="tech-strip" id="tech">{items.map(([title, text]) => <button type="button" className={active === title ? "panel tech-card active" : "panel tech-card"} key={title} onClick={() => setActive(title)}><h3>{title}</h3><p>{text}</p>{active === title && <strong>已选中：控制台将优先展示该模块参数</strong>}</button>)}</section>;
}

function EnergyRecoveryStandard() {
  return (
    <section className="panel recovery-standard">
      <h2>标准化动能回收流程图</h2>
      <div className="recovery-flow">
        {[
          ["车辆动能", "Ek = 1/2MV²"],
          ["磁场切割线圈", "dΦ/dt ↑"],
          ["感应电动势", "e = -N·dΦ/dt"],
          ["整流储能", "超级电容 / 电池组"],
          ["能量回馈", "悬浮 · 控制 · 园区电网"],
        ].map(([title, formula], index) => (
          <div className="recovery-node" key={title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{title}</strong>
            <em>{formula}</em>
          </div>
        ))}
      </div>
      <div className="recovery-note">制动时控制系统闭合回收线圈，电磁阻力完成无接触减速，同时将动能转换为可存储电能。</div>
    </section>
  );
}

function ArchitectureSection() {
  return <section className="panel info-section" id="architecture"><h2>系统架构</h2><div className="architecture-flow">{["传感层：激光检测", "控制层：质量估算", "执行层：牵引/悬浮电流", "能量层：线圈回收", "云端调度：安全限速"].map((item) => <button type="button" key={item}>{item}</button>)}</div></section>;
}

function ScenarioSection() {
  const [scenario, setScenario] = useState("智慧园区");
  const copy: Record<string, string> = {
    智慧园区: "高频短驳、低噪声、封闭式运行，适合校园与产业园内部物流。",
    封闭厂区: "通过固定管道网连接产线、仓库与检测区，减少地面车辆干扰。",
    港口仓储: "重载货物可启用螺线管辅助牵引，并利用制动段回收能量。",
    医药洁净: "封闭管道降低污染风险，激光定位便于无接触调度。",
    危险环境: "适合矿区、化工区等人员不宜长期进入的物流通道。",
  };
  return <section className="panel info-section" id="scenarios"><h2>应用场景</h2><div className="scenario-tabs">{Object.keys(copy).map((item) => <button type="button" className={scenario === item ? "active" : ""} onClick={() => setScenario(item)} key={item}>{item}</button>)}</div><p>{copy[scenario]}</p></section>;
}

function AboutSection() {
  const members = ["李紫宸（负责人）", "舒沛春", "王凯宜", "吕程扬", "杨骏", "甄云翔", "单端"];
  return (
    <section className="panel about-section" id="about">
      <h2>关于我们</h2>
      <div className="about-grid">
        <div>
          <span>项目单位</span>
          <strong>太原理工大学</strong>
          <p>材料科学与工程学院学生团队，面向封闭管道式磁悬浮动能回收智能物流系统开展方案设计、材料适配、结构优化与原理验证。</p>
        </div>
        <div>
          <span>指导老师</span>
          <strong>王永胜 · 程芳</strong>
        </div>
        <div className="member-card">
          <span>团队成员</span>
          <div>{members.map((name) => <i key={name}>{name}</i>)}</div>
        </div>
      </div>
    </section>
  );
}

function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [now, setNow] = useState(() => new Date());
  const [messagesOpen, setMessagesOpen] = useState(false);
  const jumpTo = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const currentTime = now.toLocaleTimeString("zh-CN", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const currentDate = now.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).replace(/\//g, "-");

  return (
    <div className="screen">
      <header className="topbar" id="home">
        <FluxLogo />
        <nav>{sections.map(({ id, label, Icon }) => <button type="button" key={id} className={activeSection === id ? "active" : ""} onClick={() => jumpTo(id)}><Icon size={16} />{label}</button>)}</nav>
        <div className="top-status">
          <div className="time"><strong>{currentTime}</strong><span>{currentDate}</span></div>
          <div><CloudSun color="#ffd437" /><span>28°C</span></div>
          <button type="button" className="bell" onClick={() => setMessagesOpen((value) => !value)} aria-label="查看消息">
            <Bell /><i>3</i>
          </button>
          {messagesOpen && (
            <div className="message-popover">
              <div className="message-title">消息中心</div>
              <button type="button" onClick={() => { setMessagesOpen(false); jumpTo("console"); }}>FL-008 牵引电机温度过高<span>刚刚</span></button>
              <button type="button" onClick={() => { setMessagesOpen(false); jumpTo("demo"); }}>回收制动策略等待校验<span>2 分钟前</span></button>
              <button type="button" onClick={() => { setMessagesOpen(false); jumpTo("architecture"); }}>激光传感器 L-21 信号弱<span>4 分钟前</span></button>
            </div>
          )}
        </div>
      </header>
      <main className="dashboard" id="console"><OverviewPanel /><div className="center-stage"><MainTube /><BlueprintSection /></div><VehiclePanel /></main>
      <TechStrip />
      <ArchitectureSection />
      <EnergyRecoveryStandard />
      <SimulationPanel />
      <ScenarioSection />
      <AboutSection />
      <button type="button" className="back-top" onClick={() => jumpTo("home")}>↑ 返回顶部</button>
      <footer><ShieldCheck size={18} /> FluxLoop 磁轨智行 · 封闭管道式磁悬浮动能回收智能物流系统 <Box size={18} /> 路演展示版 <ThermometerSun size={18} /> 低摩擦、高回收、智能限速 <Zap size={18} /> 重载辅助牵引</footer>
    </div>
  );
}

export default App;
