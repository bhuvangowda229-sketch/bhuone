# AI-Based Interior Design Suggester with 3D Visualization
## Architectural System Specification & Project Documentation

> **Project Title:** AI-Based Interior Design Suggester with 3D Visualization  
> **Repository:** [bhuvangowda229-sketch/bhuone](https://github.com/bhuvangowda229-sketch/bhuone.git)  
> **Workspace:** `c:\Users\DELL\Desktop\ai interior 2.0`  
> **Date:** August 2026 | Department of Computer Science & Engineering  

---

## 1. Executive Summary & Problem Statement

Planning interior layouts frequently requires hiring expensive professional designers or utilizing complicated CAD software that is inaccessible to everyday homeowners. Traditional methods rely on static 2D floor plans or pre-rendered images that fail to provide an immersive spatial experience.

**AI Interior Studio 2.0** bridges this gap by delivering an intelligent, browser-based 3D architectural platform that:
1. Translates structural parameters and aesthetic preferences into personalized spatial designs.
2. Renders whole-house architectural cutaway models in real-time using **Three.js (WebGL)**.
3. Implements strict architectural circulation principles (zero bathroom doors facing public entries, seamless room flow, and pure residential zoning).

---

## 2. Coordinated Architectural Types & Room Configurations

The platform models complete, interconnected residences with proportional structural elements, realistic ceiling heights, and coordinated circulation paths:

| Architectural Type | Dimensions | Total Area | Circulation Highlights | Key Rooms |
|---|---|---|---|---|
| **1BHK Compact House** | 10.5m × 8.5m | 650 – 800 sq.ft | Open living-dining flow, private ensuite | Foyer, Living, Balcony, Dining, Modular Kitchen, Master Suite, Master Ensuite |
| **2BHK Contemporary Villa** | 14.0m × 10.0m | 1,150 – 1,350 sq.ft | Central bedroom buffer corridor | Foyer, Grand Living, Balcony, Dining Pavilion, Island Kitchen, Master Suite + Bath, Bed 2, Common Bath |
| **3BHK Luxury Residence** | 17.5m × 12.0m | 1,700 – 2,100 sq.ft | Rustic brick dining barrier, west wing corridor | Screened Foyer, Great Room, Balcony, Brick Dining, Chef Kitchen, Master Suite + Spa Bath, Bed 2, Bed 3, Corridor Bath |
| **Individual Rooms** | Custom Dimensions | Dynamic | Tailored single room optimization | Bedroom, Living Room, Modular Kitchen, Executive Office |

---

## 3. Architectural Privacy & Room Connectivity Rules

### A. Removal of Bathroom Main Entry (Privacy-First Zoning)
- **Zero Front Entry Visibility:** Bathrooms have been completely eliminated from the entrance foyer, main entry, and dining sightlines.
- **Corridor & En-Suite Isolation:**
  - Common family bathrooms are accessed strictly via **private bedroom distribution corridors**.
  - Master bathrooms are designed as **private en-suites** accessible only from inside the bedroom suite.
  - Solid acoustic divider walls (such as rustic brick feature walls and slatted timber screens) shield all sanitary spaces from public view.

### B. Seamless Room Interconnectivity
- **Open Cased Archways:** Smooth transitions between living halls, dining pavilions, and kitchen spaces with overhead lintel headers.
- **Breakfast Counter Passes:** Fluid connection between dining and kitchen zones for effortless serving.
- **Full 4-Wall Door & Window Support:** Dynamic wall cutouts on North, South, East, and West walls, with 3D door frames and doors rendered slightly ajar for architectural depth.
- **Balcony Sliding Portals:** Multi-panel sliding glass doors connecting living spaces to outdoor balconies with tempered glass balustrades.

### C. Pure Residential Sanctuary
- Integrated residential **reading and study workstations** in bedrooms and peaceful study nooks.

---

## 4. Methodology & Four Core Phases

1. **Input & Parameter Acquisition:** Captures structural house dimensions (width, length, wall height), style presets (Minimalist, Luxury, Traditional, Modern), wall colors, flooring types, and lighting modes.
2. **AI Recommendation Generation:** Processes user inputs using heuristic spatial placement algorithms and machine learning rules to formulate balanced furniture layouts, color palettes, and walking clearances.
3. **Three.js 3D Scene Generation:** Dynamically instantiates meshes, procedural canvas PBR textures (Carrara marble, light oak, chevron walnut, ceramic tile), and realistic shadow lighting.
4. **Interactive Fine-Tuning & Customization:** Provides intuitive 3D camera controls (Orbit, Top-Down Floor Plan, Eye-Level Walkthrough), real-time finish updates, and instant quotation exports.

---

## 5. Technology Stack

| Layer | Component | Description |
|---|---|---|
| **Frontend UI** | HTML5, CSS3, Modern ES6+ JavaScript | Responsive layout, dark glassmorphism, responsive across desktop and tablet |
| **3D Engine** | Three.js (r128), OrbitControls | WebGL wrapper for hardware-accelerated real-time 3D rendering |
| **Textures** | Procedural HTML5 Canvas Textures | Zero-download latency PBR maps for marble, parquet, tiles, and wood slats |
| **Backend Framework** | Python with Flask (`app.py`) | RESTful APIs for user authentication, design persistence, and AI recommendations |
| **Database System** | MySQL / SQLite Relational Database (`database.sql`) | Stores user profile accounts, design templates, material libraries, and saved room states |
| **Local Server** | Windows Built-In .NET `HttpListener` (`start-server.ps1` / `start-server.bat`) | Zero-dependency standalone local web server |
| **Persistence** | Browser `localStorage` + REST APIs + JSON Export | Preserves customized house states, project proposals, and user authentication |

---

## 6. How to Run the Application

### Option A: Zero-Dependency Standalone Server (Immediate Launch)
Execute the standalone PowerShell server in your terminal or double-click `start-server.bat`:

```powershell
cd "c:\Users\DELL\Desktop\ai interior 2.0"
.\start-server.ps1
```

Or simply run:
```powershell
.\run.ps1
```

### Option B: Python Flask Backend
If running with the Python Flask REST API:

```bash
pip install -r requirements.txt
python app.py
```

### Navigating the Application:
- **Project Landing Page:** `http://localhost:8080/index.html` (or `http://localhost:8080/`)
- **Full 3D Design Studio:** `http://localhost:8080/studio.html` (or `http://localhost:8080/studio`)
- **User / Admin Login:** `http://localhost:8080/login.html`
- **Admin Dashboard:** `http://localhost:8080/admin.html`
