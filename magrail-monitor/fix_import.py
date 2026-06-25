import os
BASE = r"C:\Users\吕程扬\Documents\app\magrail-monitor\src"

# Fix StatCard.tsx
path = os.path.join(BASE, "components", "StatCard.tsx")
with open(path, "r", encoding="utf-8") as f:
    content = f.read()
content = content.replace('import { ReactNode } from "react";', 'import type { ReactNode } from "react";')
with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Fixed StatCard.tsx")

# Fix PipelineViz.tsx
path = os.path.join(BASE, "components", "PipelineViz.tsx")
with open(path, "r", encoding="utf-8") as f:
    content = f.read()
content = content.replace('import type { Vehicle } from "../data/mockData";', 'import type { Vehicle } from "../data/mockData";')
print("PipelineViz.tsx already correct")

# Check Dashboard.tsx for any type import issues
path = os.path.join(BASE, "pages", "Dashboard.tsx")
with open(path, "r", encoding="utf-8") as f:
    content = f.read()
content = content.replace('import type { Vehicle, SystemStats, EnergyData, Alert } from "../data/mockData";', 'import type { Vehicle, SystemStats, EnergyData, Alert } from "../data/mockData";')
print("Dashboard.tsx already correct")

print("Done fixing imports")