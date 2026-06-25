import { useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Truck, Zap, Bell, Menu, X, TrendingUp, ShieldCheck } from "lucide-react";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "系统总览", exact: true },
  { to: "/vehicles", icon: Truck, label: "车辆监控" },
  { to: "/energy", icon: Zap, label: "能耗分析" },
  { to: "/alerts", icon: Bell, label: "告警中心" },
];

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div style={{ display: "flex", height: "100vh", background: "var(--bg-primary)" }}>
      <aside style={{
        width: collapsed ? 64 : 240,
        background: "var(--bg-secondary)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.3s ease",
        flexShrink: 0,
        zIndex: 10,
      }}>
        <div style={{
          padding: collapsed ? "20px 12px" : "20px",
          borderBottom: "1px solid var(--border)",
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: "linear-gradient(135deg, var(--accent), var(--purple))",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <TrendingUp size={22} color="#fff" />
          </div>
          {!collapsed && (
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.2 }}>
                磁轨智行
              </div>
              <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: 1 }}>
                MagRail Monitor
              </div>
            </div>
          )}
        </div>
        <nav style={{ flex: 1, padding: "12px 8px" }}>
          {navItems.map(item => {
            const isActive = item.exact
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to) && item.to !== "/";
            return (
              <NavLink key={item.to} to={item.to} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: collapsed ? "12px" : "12px 16px",
                marginBottom: 4, borderRadius: 8,
                color: isActive ? "var(--accent)" : "var(--text-secondary)",
                background: isActive ? "var(--accent-dim)" : "transparent",
                textDecoration: "none", fontSize: 14,
                fontWeight: isActive ? 600 : 400,
                transition: "all 0.2s",
                border: isActive ? "1px solid rgba(0,212,255,0.2)" : "1px solid transparent",
              }}>
                <item.icon size={20} />
                {!collapsed && item.label}
              </NavLink>
            );
          })}
        </nav>
        <div style={{ padding: "12px 8px", borderTop: "1px solid var(--border)" }}>
          <button onClick={() => setCollapsed(!collapsed)} style={{
            width: "100%", padding: 10,
            background: "transparent", border: "none", borderRadius: 8,
            color: "var(--text-muted)", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-hover)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            {collapsed ? <Menu size={18} /> : <X size={18} />}
          </button>
        </div>
      </aside>
      <main style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
        <header style={{
          padding: "16px 28px", background: "var(--bg-secondary)",
          borderBottom: "1px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexShrink: 0,
        }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 600 }}>磁轨智行 · 智能物流监控系统</h1>
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
              封闭管道式磁悬浮动能回收智能物流系统
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "6px 14px", borderRadius: 20,
              background: "var(--green-dim)", border: "1px solid rgba(16,185,129,0.2)",
            }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--green)", boxShadow: "0 0 6px var(--green)" }} />
              <span style={{ fontSize: 12, color: "var(--green)", fontWeight: 500 }}>系统运行中</span>
            </div>
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "6px 14px", borderRadius: 20,
              background: "var(--bg-card)", border: "1px solid var(--border)",
            }}>
              <ShieldCheck size={14} color="var(--text-muted)" />
              <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>太原理工大学</span>
            </div>
          </div>
        </header>
        <div style={{ flex: 1, overflow: "auto", padding: 24 }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
