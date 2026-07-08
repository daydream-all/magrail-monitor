import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  Box,
  CloudSun,
  Cpu,
  Gauge,
  Home,
  Layers,
  Radio,
  Route,
  ShieldCheck,
  ThermometerSun,
  Users,
  Zap,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "./App.css";

const sections = [
  { id: "home", label: "首页", Icon: Home },
  { id: "tech", label: "核心技术", Icon: Cpu },
  { id: "architecture", label: "系统架构", Icon: Layers },
  { id: "demo", label: "动态演示", Icon: Radio },
  { id: "console", label: "总控制台", Icon: Gauge },
  { id: "scenarios", label: "应用场景", Icon: Route },
  { id: "about", label: "关于我们", Icon: Users },
];

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

const baseTrend = [
  { time: "14:20", value: 360 },
  { time: "14:30", value: 620 },
  { time: "14:40", value: 1180 },
  { time: "14:50", value: 1660 },
  { time: "15:00", value: 2360 },
  { time: "15:10", value: 2680 },
  { time: "15:20", value: 2700 },
  { time: "15:30", value: 3260 },
  { time: "15:40", value: 3120 },
  { time: "15:50", value: 3740 },
  { time: "16:00", value: 3860 },
];

const baseSplit = [
  { name: "悬浮系统", value: 28, color: "#26d7c4" },
  { name: "牵引系统", value: 32, color: "#f8a629" },
  { name: "控制系统", value: 12, color: "#b9c2d0" },
  { name: "辅助系统", value: 8, color: "#1388ff" },
  { name: "能量回收", value: 20, color: "#23da5b" },
];

const techItems = [
  {
    key: "roller",
    title: "仿过山车三轮系磁悬浮结构",
    summary: "用垂直悬浮、侧向导向、底部防脱轨三组电磁约束替代传统轮系，实现稳定承载和主动纠偏。",
    bullets: ["载重变化自动补偿", "转弯偏摆实时纠正", "异常抬升主动拉回"],
    tone: "cyan",
  },
  {
    key: "tube",
    title: "全封闭管道环境控制系统",
    summary: "通过封闭式非磁性管道隔绝雨雪、沙尘、湿热与外来扰动，适配校园、园区和城市末端配送环境。",
    bullets: ["外界环境隔离", "冷链和低压可扩展", "全天候稳定运行"],
    tone: "blue",
  },
  {
    key: "recovery",
    title: "磁通量变化动能回收系统",
    summary: "在减速、滑行和下坡阶段闭合感应线圈，让车辆动能回收为可用电能并反馈系统。",
    bullets: ["再生制动替代摩擦制动", "线圈分段闭合按需回收", "形成系统能量闭环"],
    tone: "amber",
  },
];

const alertsSeed = [
  { color: "orange", text: "FL-008 牵引电机温度偏高", time: "15:22:11" },
  { color: "yellow", text: "轨道 T03 段能量回收效率下降", time: "15:21:45" },
  { color: "blue-dot", text: "激光传感器 L-21 信号波动已稳定", time: "15:20:32" },
];

const blueprintLabels: [string, number, number, number, number][] = [
  ["激光检测器", 196, 66, 204, 132],
  ["悬浮电磁铁", 356, 56, 370, 148],
  ["铝合金轨道管", 518, 48, 524, 126],
  ["线圈供电区", 666, 58, 668, 138],
  ["动能回收线圈", 782, 62, 786, 154],
  ["车舱舱体", 214, 228, 252, 202],
  ["导向轮", 346, 228, 360, 198],
  ["悬浮气隙 (8-12 mm)", 486, 230, 486, 194],
  ["牵引电磁铁", 646, 228, 646, 190],
  ["能量回收模块", 790, 228, 790, 196],
];

function FluxLogo() {
  return (
    <div className="brand">
      <img
        className="brand-image"
        src={`${import.meta.env.BASE_URL}fluxloop-logo-cropped.png`}
        alt="FluxLoop logo"
      />
    </div>
  );
}

function Metric({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
      <em>{unit}</em>
    </div>
  );
}

function Callout(props: { x: number; y: number; title: string; text: string; targetX: number; targetY: number }) {
  const { x, y, title, text, targetX, targetY } = props;
  return (
    <g className="callout">
      <path d={`M${x + 62} ${y + 72} L${targetX} ${targetY}`} />
      <rect x={x} y={y} width="176" height="74" rx="8" />
      <text x={x + 16} y={y + 28}>
        {title}
      </text>
      <text x={x + 16} y={y + 53} className="callout-sub">
        {text}
      </text>
      <circle cx={targetX} cy={targetY} r="3" />
    </g>
  );
}

function MaglevVehicle() {
  return (
    <g className="vehicle">
      <ellipse cx="276" cy="262" rx="170" ry="12" fill="#00aaff" opacity="0.18" />
      <path className="levitation-wave" d="M122 272 C186 258 252 282 312 268 S396 260 448 270" />
      <path
        className="car-shadow"
        d="M86 228 C124 181 306 169 420 191 C460 199 487 225 476 244 C461 272 192 278 100 251 C82 246 73 239 86 228Z"
      />
      <path
        className="car-body"
        d="M82 222 C119 176 304 164 421 187 C462 195 491 222 480 243 C463 274 190 280 98 251 C77 244 67 235 82 222Z"
      />
      <path
        className="car-cabin"
        d="M134 211 C176 176 315 171 402 190 C434 197 454 212 459 229 C352 222 232 222 108 236 C112 226 121 217 134 211Z"
      />
      <path
        className="car-window"
        d="M155 210 C198 188 314 185 389 198 C418 203 437 213 445 225 C351 220 252 222 127 234 C133 224 141 216 155 210Z"
      />
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

function MainTube() {
  return (
    <section className="main-tube panel">
      <svg viewBox="0 0 980 460" className="tube-svg" role="img" aria-label="封闭管道式磁悬浮系统演示">
        <defs>
          <linearGradient id="tubeGlass" x1="0" x2="1">
            <stop offset="0" stopColor="#93d8ff" stopOpacity="0.1" />
            <stop offset="0.5" stopColor="#d7f5ff" stopOpacity="0.25" />
            <stop offset="1" stopColor="#1a9fe6" stopOpacity="0.08" />
          </linearGradient>
          <linearGradient id="tubeCore" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#d6f4ff" stopOpacity="0.18" />
            <stop offset="0.45" stopColor="#67c9ff" stopOpacity="0.05" />
            <stop offset="1" stopColor="#02111f" stopOpacity="0.42" />
          </linearGradient>
          <linearGradient id="carShell" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fcfeff" />
            <stop offset="0.55" stopColor="#d8e3ec" />
            <stop offset="1" stopColor="#aebbc7" />
          </linearGradient>
          <linearGradient id="railLine" x1="0" x2="1">
            <stop offset="0" stopColor="#0c2033" />
            <stop offset="0.55" stopColor="#d5f7ff" />
            <stop offset="1" stopColor="#0b1d2c" />
          </linearGradient>
          <filter id="blueGlow">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="orangeGlow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path className="perspective-floor" d="M30 408 L930 314 L980 460 L0 460Z" />
        <g className="tube" transform="translate(38 34)">
          <path d="M42 220 C176 104 690 53 896 95 C946 105 953 239 895 265 C686 358 166 336 42 254 C18 238 18 232 42 220Z" fill="url(#tubeGlass)" />
          <path className="tube-core" d="M72 224 C186 130 676 88 860 118 C898 126 914 150 914 182 C914 214 900 238 862 250 C680 308 206 306 88 256 C60 244 52 236 72 224Z" fill="url(#tubeCore)" />
          <path d="M40 216 C176 100 690 49 897 91" />
          <path d="M40 257 C171 341 684 364 897 270" />
          <path className="tube-shine" d="M90 168 C250 118 624 92 858 116" />
          <path className="tube-shine lower-shine" d="M110 280 C322 292 624 288 842 246" />
          <path d="M94 194 L876 121" className="laser-line" />
          <path d="M90 272 L864 256" className="rail-line" />
          <path d="M118 296 L826 270" className="rail-line lower" />
          <path className="energy-stream primary" d="M418 206 C528 196 644 192 804 182" />
          <path className="energy-stream secondary" d="M408 244 C544 234 652 228 790 214" />
          <path className="energy-stream tertiary" d="M458 266 C564 266 650 254 744 238" />
          <g transform="translate(150 30)">
            <MaglevVehicle />
          </g>
          {[190, 306, 422, 540, 658, 772].map((x) => (
            <g key={x} className="blue-ring" transform={`translate(${x} 0)`}>
              <ellipse cx="0" cy="188" rx="20" ry="94" />
              <ellipse cx="0" cy="188" rx="29" ry="106" opacity="0.35" />
            </g>
          ))}
          {Array.from({ length: 24 }, (_, index) => (
            <g key={index} transform={`translate(${440 + index * 16} ${216 - index * 1.2})`} className={index > 15 ? "coil green" : "coil"}>
              <ellipse cx="0" cy="0" rx="6" ry="25" />
              <path d="M0 -25 L10 -18 L10 18 L0 25" />
            </g>
          ))}
          <g className="sensor" transform="translate(82 196)">
            <rect x="-30" y="-16" width="34" height="32" rx="3" />
            <path d="M8 -9 C24 -2 24 2 8 9" />
            <path d="M15 -17 C43 -5 43 5 15 17" />
          </g>
          <g className="sensor" transform="translate(874 162)">
            <rect x="0" y="-16" width="34" height="32" rx="3" />
            <path d="M-5 -9 C-21 -2 -21 2 -5 9" />
            <path d="M-12 -17 C-40 -5 -40 5 -12 17" />
          </g>
        </g>
        <Callout x={170} y={126} title="激光检测器" text="实时检测车位、载荷与安全边界" targetX={224} targetY={242} />
        <Callout x={408} y={88} title="悬浮电磁铁阵列" text="动态调节电流，形成三维主动约束" targetX={506} targetY={234} />
        <Callout x={642} y={60} title="线圈供电区" text="分段供电，形成平滑推进磁场" targetX={692} targetY={204} />
        <Callout x={724} y={318} title="动能回收线圈" text="减速与滑行阶段进行再生回收" targetX={760} targetY={246} />
      </svg>
      <div className="summary-strip">
        <Metric label="平均速度" value="7.62" unit="m/s" />
        <Metric label="平均载重" value="823" unit="kg" />
        <Metric label="回收功率" value="386" unit="kW" />
        <div className="status-big">
          <span>系统状态</span>
          <strong>稳定运行</strong>
        </div>
      </div>
    </section>
  );
}

function OverviewPanel() {
  const [trend, setTrend] = useState(baseTrend);
  const [split, setSplit] = useState(baseSplit);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTrend((current) => {
        const nextValue = Math.max(320, current[current.length - 1].value + Math.round((Math.random() - 0.28) * 420));
        const rest = current.slice(1);
        const hour = Number(current[current.length - 1].time.slice(0, 2));
        const minute = Number(current[current.length - 1].time.slice(3, 5)) + 10;
        const newHour = hour + Math.floor(minute / 60);
        const newMinute = minute % 60;
        return [
          ...rest,
          {
            time: `${String(newHour).padStart(2, "0")}:${String(newMinute).padStart(2, "0")}`,
            value: nextValue,
          },
        ];
      });

      setSplit((current) => {
        const shifted = current.map((item, index) => {
          const delta = index === 4 ? 1 : index === 1 ? -1 : 0;
          return { ...item, value: item.value + delta };
        });
        const total = shifted.reduce((sum, item) => sum + item.value, 0);
        return shifted.map((item) => ({
          ...item,
          value: Math.round((item.value / total) * 100),
        }));
      });
    }, 2800);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <>
      <section className="overview panel">
        <div className="panel-head">
          <h2>系统运行概览</h2>
        </div>
        <div className="stat-grid">
          <div>
            <span>运行车辆</span>
            <strong className="blue">12</strong>
            <em>辆</em>
          </div>
          <div>
            <span>在线轨道</span>
            <strong className="blue">8</strong>
            <em>/ 10</em>
          </div>
          <div>
            <span>今日运输量</span>
            <strong>18,568</strong>
            <em>吨</em>
          </div>
          <div>
            <span>能量回收</span>
            <strong>2,846</strong>
            <em>kWh</em>
          </div>
          <div>
            <span>系统效率</span>
            <strong>92.7</strong>
            <em>%</em>
          </div>
          <div>
            <span>安全状态</span>
            <strong className="green">正常</strong>
          </div>
        </div>
      </section>

      <section className="panel chart-card">
        <h2>
          能量回收趋势
          <span className="live-dot">LIVE</span>
        </h2>
        <ResponsiveContainer width="100%" height={170}>
          <AreaChart data={trend} margin={{ left: 4, right: 12, top: 8, bottom: 6 }}>
            <defs>
              <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#32f56d" stopOpacity={0.42} />
                <stop offset="100%" stopColor="#32f56d" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" tick={{ fill: "#9ab2c0", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#9ab2c0", fontSize: 11 }} axisLine={false} tickLine={false} width={42} />
            <Tooltip contentStyle={{ background: "#06121e", border: "1px solid rgba(0,151,230,0.35)" }} />
            <Area type="monotone" dataKey="value" stroke="#4dfc6b" strokeWidth={2} fill="url(#areaFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </section>

      <section className="panel pie-card">
        <h2>系统能耗分布</h2>
        <div className="pie-row">
          <ResponsiveContainer width="50%" height={180}>
            <PieChart>
              <Pie
                data={split}
                dataKey="value"
                innerRadius={42}
                outerRadius={70}
                paddingAngle={3}
                startAngle={90}
                endAngle={-270}
                animationDuration={900}
              >
                {split.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pie-legend">
            {split.map((item) => (
              <div key={item.name}>
                <i style={{ background: item.color }} />
                <span style={{ textAlign: "left" }}>{item.name}</span>
                <span>{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function VehiclePanel() {
  const [selected, setSelected] = useState("FL-001");
  const [acknowledged, setAcknowledged] = useState<string[]>([]);

  const detail = useMemo(
    () =>
      ({
        "FL-001": ["载货任务：生鲜冷链箱", "当前位置：东区主干线 S2-S3", "悬浮间隙：8.6 mm", "回收状态：线圈闭合 78%"],
        "FL-008": ["检修任务：牵引模块校准", "当前位置：维护支线", "悬浮间隙：0 mm", "回收状态：已停用"],
      })[selected] ?? ["载货任务：标准包裹舱", "当前位置：主环路", "悬浮间隙：8.2 mm", "回收状态：正常"],
    [selected],
  );

  return (
    <>
      <section className="vehicle-list panel">
        <div className="panel-head">
          <h2>车辆列表 (12)</h2>
          <span>查看全部</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>车辆 ID</th>
              <th>速度 (m/s)</th>
              <th>载重 (kg)</th>
              <th>状态</th>
              <th>电量/回收</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map(([id, speed, load, status, power]) => (
              <tr key={id} onClick={() => setSelected(id)} className={selected === id ? "selected-row" : ""}>
                <td>{id}</td>
                <td>{speed}</td>
                <td>{load}</td>
                <td className={status === "运行中" ? "ok" : status === "检修中" ? "warn" : "idle"}>{status}</td>
                <td>{power}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="vehicle-detail">
          <strong>{selected} 详情</strong>
          {detail.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </section>

      <section className="alerts panel">
        <div className="panel-head">
          <h2>告警信息</h2>
          <span>查看全部</span>
        </div>
        {alertsSeed.map((alert) => {
          const isAck = acknowledged.includes(alert.text);
          return (
            <button
              key={alert.text}
              className={`alert-row ${isAck ? "ack" : ""}`}
              onClick={() =>
                setAcknowledged((current) =>
                  current.includes(alert.text) ? current.filter((item) => item !== alert.text) : [...current, alert.text],
                )
              }
            >
              <i className={alert.color} />
              <span style={{ color: "#dbe8f2", fontSize: 13 }}>{alert.text}</span>
              <span>{isAck ? "已确认" : alert.time}</span>
            </button>
          );
        })}
      </section>
    </>
  );
}

function TrackMap() {
  const stations = [
    { id: "S0", name: "出站点", x: 90, y: 196, type: "depart" },
    { id: "S1", name: "装载站", x: 210, y: 108, type: "stop" },
    { id: "S2", name: "分拣站", x: 378, y: 108, type: "stop" },
    { id: "S3", name: "供电区", x: 548, y: 124, type: "power" },
    { id: "S4", name: "回收站", x: 718, y: 142, type: "recover" },
    { id: "S5", name: "停站点", x: 818, y: 244, type: "stop" },
    { id: "S6", name: "入库维护", x: 642, y: 306, type: "service" },
    { id: "S7", name: "内环换向", x: 398, y: 302, type: "power" },
    { id: "S8", name: "支线接驳", x: 160, y: 278, type: "stop" },
  ];

  const movingCars = [
    { id: "FL-001", speed: "7.21 m/s", path: "#route-main", duration: "16s" },
    { id: "FL-003", speed: "6.21 m/s", path: "#route-inner", duration: "19s" },
    { id: "FL-007", speed: "8.62 m/s", path: "#route-recover", duration: "14s" },
    { id: "FL-011", speed: "9.11 m/s", path: "#route-service", duration: "17s" },
  ];

  return (
    <section className="panel map-card">
      <h2>轨道网络地图</h2>
      <svg viewBox="0 0 920 360" className="track-map" role="img" aria-label="轨道网络地图">
        <defs>
          <filter id="mapGlow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <path id="route-main" d="M90 196 C104 118 166 86 250 88 H642 C764 88 840 122 840 198 C840 280 760 314 642 314 H220 C130 314 84 270 90 196Z" />
          <path id="route-inner" d="M214 138 H590 C650 138 694 168 694 214 C694 260 650 286 590 286 H272 C232 286 204 260 204 222 C204 184 214 160 214 138Z" />
          <path id="route-recover" d="M590 138 C666 140 736 146 786 176 C814 192 818 238 792 258 C752 288 684 304 642 314" />
          <path id="route-service" d="M272 286 C244 296 206 304 162 292 C118 280 104 244 90 196" />
        </defs>

        <rect className="city-block" x="42" y="56" width="836" height="268" rx="18" />
        <path className="city-grid" d="M70 96 H850 M70 144 H850 M70 192 H850 M70 240 H850 M70 288 H850" />
        <path className="city-grid" d="M118 70 V310 M214 70 V310 M310 70 V310 M406 70 V310 M502 70 V310 M598 70 V310 M694 70 V310 M790 70 V310" />

        <use href="#route-main" className="track blue-track" />
        <use href="#route-inner" className="track green-track" />
        <use href="#route-recover" className="track orange-track" />
        <use href="#route-service" className="track red-track" />

        {stations.map((station) => (
          <g key={station.id} className={`map-node ${station.type}`}>
            <circle cx={station.x} cy={station.y} r="10" />
            <circle className="node-core" cx={station.x} cy={station.y} r="4" />
            <text x={station.x} y={station.y - 18}>
              {station.id}
            </text>
            <text x={station.x} y={station.y + 30}>
              {station.name}
            </text>
          </g>
        ))}

        <g className="station-guide">
          <path d="M210 118 L210 138" />
          <path d="M378 118 L378 138" />
          <path d="M548 134 L548 146" />
          <path d="M718 152 L718 164" />
          <path d="M818 226 L818 214" />
          <path d="M642 288 L642 272" />
        </g>

        {movingCars.map((car) => (
          <g key={car.id} className="moving-car">
            <g className="map-car">
              <rect x="-34" y="-28" width="68" height="36" rx="7" />
              <path d="M-18 0 C-11 -8 4 -11 19 -8 C25 -6 28 -2 28 2 C28 7 20 10 4 10 C-8 10 -18 7 -22 3 C-23 2 -22 1 -18 0Z" />
              <path d="M-7 -1 C4 -4 16 -3 22 0 C19 5 12 8 0 8 C-8 8 -13 6 -16 3Z" />
              <text x="0" y="-8">
                {car.id}
              </text>
              <text x="0" y="22">
                {car.speed}
              </text>
            </g>
            <animateMotion dur={car.duration} repeatCount="indefinite" rotate="auto">
              <mpath href={car.path} />
            </animateMotion>
          </g>
        ))}

        <g className="map-legend" transform="translate(72 338)">
          <text x="0" y="0">主环线路</text>
          <text x="96" y="0">内环调度</text>
          <text x="188" y="0">供电子段</text>
          <text x="284" y="0">回收区</text>
          <text x="352" y="0">维护支线</text>
        </g>
      </svg>
    </section>
  );
}

function BlueprintSection() {
  return (
    <section className="panel blueprint">
      <h2>关键与车辆剖面图</h2>
      <svg viewBox="0 0 920 278" className="blueprint-svg" role="img" aria-label="车辆剖面图">
        <defs>
          <filter id="bpGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path className="bp-tube" d="M52 145 C90 70 252 54 790 72 C852 74 872 94 872 140 C872 190 842 212 790 212 C270 232 104 226 62 172 C50 158 46 150 52 145Z" />
        <path className="bp-rail" d="M150 176 L826 176" />
        <path className="bp-rail lower" d="M168 192 L814 192" />
        <g transform="translate(186 78)">
          <MaglevVehicle />
        </g>
        {Array.from({ length: 14 }, (_, index) => (
          <g key={index} transform={`translate(${544 + index * 18} 146)`} className={index > 8 ? "bp-coil recover" : "bp-coil"}>
            <ellipse cx="0" cy="0" rx="7" ry="34" />
          </g>
        ))}
        <path className="bp-current" d="M558 102 C634 112 706 110 784 104" />
        <path className="bp-cool" d="M160 104 C282 86 410 88 540 94" />
        {blueprintLabels.map(([label, x, y, tx, ty]) => (
          <g key={label} className="bp-label">
            <path d={`M${x} ${y + 8} L${tx} ${ty}`} />
            <circle cx={tx} cy={ty} r="3" />
            <text x={x} y={y}>
              {label}
            </text>
          </g>
        ))}
        <g className="bp-legend" transform="translate(808 92)">
          <text x="0" y="0">导能冷脉</text>
          <text x="0" y="24" className="orange-text">
            电流 I
          </text>
          <text x="0" y="48" className="yellow-text">
            回收功率 (kW)
          </text>
        </g>
      </svg>
    </section>
  );
}

function TechStrip() {
  const [active, setActive] = useState(techItems[0].key);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((current) => {
        const index = techItems.findIndex((item) => item.key === current);
        return techItems[(index + 1) % techItems.length].key;
      });
    }, 4200);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section id="tech" className="panel">
      <h2>核心技术亮点</h2>
      <div className="tech-strip">
        {techItems.map((item) => (
          <button key={item.key} className={`panel tech-card ${active === item.key ? "active" : ""}`} onClick={() => setActive(item.key)}>
            <span className={`tech-signal ${item.tone}`} />
            <h3>{item.title}</h3>
            <p>{item.summary}</p>
            <div className="tech-points">
              {item.bullets.map((point) => (
                <strong key={point}>{point}</strong>
              ))}
            </div>
          </button>
        ))}
        <div className="panel tech-card active">
          <h3>三大技术协同</h3>
          <p>悬浮稳定、封闭环境与动能回收三套机制共同作用，让车辆在高频配送、复杂转弯和近站减速阶段都保持可控与节能。</p>
          <div className="tech-points">
            <strong>M = kI 载荷补偿逻辑</strong>
            <strong>L = V × Δt 分段供电逻辑</strong>
            <strong>1/2MV² 回收距离动态计算</strong>
          </div>
        </div>
      </div>
    </section>
  );
}

function EnergyRecoveryStandard() {
  return (
    <section className="panel recovery-standard">
      <h2>标准化动能回收流程</h2>
      <div className="recovery-flow">
        {[
          ["01", "测速识别", "激光接收器记录 n 至 n+1 通过时间，计算 V = L / Δt"],
          ["02", "质量提取", "从悬浮补偿电流中提取 M，并结合阈值判断载重等级"],
          ["03", "动能估算", "根据 1/2MV² 估算可回收总能量，匹配回收区长度"],
          ["04", "分段断电", "中间牵引电磁铁断电，两侧悬浮电磁铁保持通电稳定悬浮"],
          ["05", "回收闭环", "回收线圈闭合吸收动能，近终点不足速时反向牵引补偿减速曲线"],
        ].map(([index, title, text]) => (
          <div key={index} className="recovery-node">
            <span>{index}</span>
            <strong>{title}</strong>
            <em>{text}</em>
          </div>
        ))}
      </div>
      <p className="recovery-note">逻辑重点：重载车辆优先保证安全限速与制动冗余，轻载车辆优先保证回收效率和近站平顺性。</p>
    </section>
  );
}

function ArchitectureSection() {
  const [active, setActive] = useState("sensing");
  const content: Record<string, string> = {
    sensing: "激光发射器与接收器布置于车首、车尾与车体两侧，实时识别车身下沉量、速度、通过位置与安全边界，为电流补偿和供电区间判断提供基础数据。",
    levitation: "两侧悬浮电磁铁根据光路遮挡程度逐步增大电流，直到光路恢复。系统记录当前电流作为载重映射值，为后续加速与动能回收提供质量基准。",
    traction: "当前车首通过检测区后，控制系统令前方 L 长度内的线圈供电，在车首与车尾之间断电，并保持后方一个轨道单元供电，实现分段推进与低损耗控制。",
    recovery: "当质量或速度达到阈值后，回收模块根据理论回收距离关闭中段牵引电磁铁，闭合对应回收线圈，同时在近终点区域结合反向电流完成柔性制动。",
  };

  return (
    <section id="architecture" className="panel info-section">
      <h2>系统架构</h2>
      <div className="architecture-flow">
        <button onClick={() => setActive("sensing")}>感知层</button>
        <button onClick={() => setActive("levitation")}>悬浮层</button>
        <button onClick={() => setActive("traction")}>牵引层</button>
        <button onClick={() => setActive("recovery")}>回收层</button>
      </div>
      <p>{content[active]}</p>
    </section>
  );
}

function SimulationPanel() {
  const [mass, setMass] = useState(820);
  const [speed, setSpeed] = useState(7.6);
  const [interval, setIntervalValue] = useState(0.86);

  const current = (mass / 40).toFixed(1);
  const safeTime = (mass / 1000).toFixed(2);
  const recoverDistance = Math.round((0.5 * mass * speed * speed) / 6200);
  const segments = Array.from({ length: 18 }, (_, index) => {
    if (index < 7) return "levitate";
    if (index < 12) return "recover";
    if (index < 15) return "brake";
    return "off";
  });

  return (
    <section id="demo" className="panel simulation">
      <h2>动态演示</h2>
      <div className="sim-grid">
        <div className="sliders">
          <label>
            车辆总质量 M ({mass} kg)
            <input type="range" min="300" max="1200" step="10" value={mass} onChange={(event) => setMass(Number(event.target.value))} />
          </label>
          <label>
            当前速度 V ({speed.toFixed(1)} m/s)
            <input type="range" min="2" max="12" step="0.1" value={speed} onChange={(event) => setSpeed(Number(event.target.value))} />
          </label>
          <label>
            检测时间差 Δt ({interval.toFixed(2)} s)
            <input type="range" min="0.3" max="1.6" step="0.01" value={interval} onChange={(event) => setIntervalValue(Number(event.target.value))} />
          </label>
        </div>
        <div>
          <div className="calc-grid">
            <Metric label="补偿电流 I" value={current} unit="A" />
            <Metric label="最短安全时间" value={safeTime} unit="s" />
            <Metric label="理论回收距离" value={String(recoverDistance)} unit="m" />
            <Metric label="前向供电长度 L" value={(speed * interval).toFixed(2)} unit="m" />
            <Metric label="理论动能" value={(0.5 * mass * speed * speed / 1000).toFixed(1)} unit="kJ" />
            <Metric label="当前模式" value={mass > 900 ? "限速回收" : "平衡回收"} unit="" />
          </div>
          <div className="segment-track">
            {segments.map((segment, index) => (
              <i key={index} className={segment} />
            ))}
          </div>
          <p className="formula-line">公式演示：M = kI，L = V × Δt，Ek = 1/2MV²。当前展示用于网页可视化说明，不替代工程实测标定。</p>
        </div>
      </div>
    </section>
  );
}

function ScenarioSection() {
  const [tab, setTab] = useState("campus");
  const content: Record<string, string> = {
    campus: "校园内可连接宿舍区、食堂、快递站和实验楼，实现高峰时段包裹、餐配和样品运输的全时段无人化调度。",
    industrial: "在园区场景中，系统可承接零部件、冷链耗材和危险品的小批量高频运输，减少地面车辆交叉和人工转运。",
    urban: "城市末端场景可将轨道嵌入社区商业和仓储节点之间，利用封闭管道完成低噪声、低占地、高准点的微循环物流。",
  };

  return (
    <section id="scenarios" className="panel info-section">
      <h2>应用场景</h2>
      <div className="scenario-tabs">
        <button className={tab === "campus" ? "active" : ""} onClick={() => setTab("campus")}>
          校园配送
        </button>
        <button className={tab === "industrial" ? "active" : ""} onClick={() => setTab("industrial")}>
          园区物流
        </button>
        <button className={tab === "urban" ? "active" : ""} onClick={() => setTab("urban")}>
          城市末端
        </button>
      </div>
      <p>{content[tab]}</p>
    </section>
  );
}

function AboutSection() {
  const members = ["李紫宸", "舒沛春", "王凯宜", "吕程扬", "杨骏", "甄云翔", "单端"];
  return (
    <section id="about" className="panel about-section">
      <h2>关于我们</h2>
      <div className="about-grid">
        <div>
          <span>项目归属</span>
          <strong>太原理工大学</strong>
          <p>材料科学与工程学院项目团队，围绕封闭管道式磁悬浮动能回收智能物流系统开展方案设计、理论验证、结构集成与展示应用。</p>
        </div>
        <div>
          <span>指导老师</span>
          <strong>王永胜 / 程芳</strong>
          <p>项目文档登记为第一指导老师王永胜、第二指导老师程芳，负责项目技术路线把关与整体方案指导。</p>
        </div>
        <div className="member-card">
          <span>负责人 / 团队成员</span>
          <strong>负责人：李紫宸</strong>
          <div>
            {members.map((member) => (
              <i key={member}>{member}</i>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const timeText = now.toLocaleTimeString("zh-CN", { hour12: false });
  const dateText = now.toLocaleDateString("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit" }).replace(/\//g, "-");

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="screen">
      <header className="topbar">
        <FluxLogo />
        <nav>
          {sections.map(({ id, label, Icon }) => (
            <button key={id} className={activeSection === id ? "active" : ""} onClick={() => scrollToSection(id)}>
              <Icon size={17} />
              {label}
            </button>
          ))}
        </nav>
        <div className="top-status">
          <div className="time">
            <strong>{timeText}</strong>
            <span>{dateText}</span>
          </div>
          <div>
            <CloudSun />
            <span>28°C</span>
          </div>
          <button className="bell" onClick={() => setMessagesOpen((current) => !current)}>
            <Bell />
            <i>3</i>
          </button>
          {messagesOpen && (
            <div className="message-popover">
              <div className="message-title">最新消息</div>
              <button onClick={() => scrollToSection("demo")}>
                动态演示区已更新为交互版
                <span>点击跳转查看模拟参数</span>
              </button>
              <button onClick={() => scrollToSection("tech")}>
                核心技术亮点已强化展示
                <span>点击跳转查看三大技术协同</span>
              </button>
              <button onClick={() => scrollToSection("about")}>
                关于我们已按文档更新
                <span>点击跳转查看团队信息区</span>
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="dashboard" id="home">
        <aside className="left-rail">
          <OverviewPanel />
        </aside>

        <section className="center-stage">
          <MainTube />
          <TechStrip />
          <ArchitectureSection />
          <SimulationPanel />
        </section>

        <aside className="right-rail" id="console">
          <VehiclePanel />
        </aside>
      </main>

      <TrackMap />
      <BlueprintSection />
      <EnergyRecoveryStandard />
      <ScenarioSection />
      <AboutSection />

      <footer>
        <ShieldCheck size={16} />
        <span>FluxLoop 封闭管道式磁悬浮动能回收智能物流系统展示站</span>
        <ThermometerSun size={16} />
        <span>实时状态、技术演示与场景逻辑一体呈现</span>
        <Box size={16} />
        <span>适用于项目展示、答辩演示与网页发布</span>
      </footer>

      <button className="back-top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
        <Zap size={16} />
        返回顶部
      </button>
    </div>
  );
}
