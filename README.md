# AI-Based Interior Design Suggester with 3D Visualization

An intelligent web application that simplifies interior design planning by providing personalized AI design recommendations and real-time interactive 3D visualizations in the browser.

---

## 🌟 Project Synopsis

Planning interior spaces often requires expensive professional design services or complex CAD software that is difficult for everyday homeowners and renters to use. 

This platform bridges that gap by providing an accessible, cost-effective, and immersive tool. Users provide basic room specifications (room type, dimensions, design style, color preferences, flooring, and lighting requirements), and the system's AI engine formulates tailored suggestions for furniture selection, spatial layouts, color palettes, and lighting setups, rendering the space in real-time 3D.

---

## ✨ Key Features

- **AI-Driven Personalized Suggestions**: Generates cohesive design concepts, walking clearance recommendations, spatial rationale, color swatches, and estimated furniture budgets. Supports both instant offline algorithmic planning and generative AI via Gemini.
- **Interactive 3D Room Visualization (Three.js)**:
  - Dynamic 3D architectural rendering conforming to custom room dimensions (width, length, height).
  - Procedural realistic textures (oak wood, dark walnut, marble slabs, ceramic tiles, plush carpet, woven fabrics) generated on-the-fly via HTML5 canvas with zero external download latency.
  - Realistic lighting simulation with directional window sunlight, ambient fill, and ceiling fixtures.
- **Multiple Design Styles**:
  - 🏙️ **Modern** (sleek silhouettes, balanced geometry)
  - 🪴 **Minimalist** (clean lines, uncluttered negative space)
  - 👑 **Luxury** (rich dark tones, brass accents, refined materials)
  - 🏛️ **Traditional** (warm wood grains, classic symmetry)
- **Fluid 3D Controls & View Presets**:
  - Orbit, pan, and zoom with boundary constraints.
  - One-click camera presets: **3D Orbit**, **2D Floor Plan**, **Front Elevation**, and **Eye-Level Walk-In**.
  - **Cutaway Front Wall** mode so furniture is always visible without being blocked by front walls.
  - **Day / Night Lighting Toggle** to test lighting conditions across different times of day.
  - **Measurement Floor Grid** toggle for spatial accuracy.
- **Interactive Object Inspector**:
  - Click any 3D furniture item in the scene to select it.
  - Real-time sliders to adjust position (X and Z coordinates).
  - One-click 45° rotation and item deletion.
  - Interactive catalog to add additional pieces (Sofas, Armchairs, Beds, Desks, Plants, Lamps, Rugs, Art).
- **Project Persistence & Export**:
  - Save and load unlimited project configurations in browser storage (`localStorage`).
  - Export and import designs as standalone JSON files.
  - High-resolution 3D canvas snapshot capture (`.png`).

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Core Runtimes** | HTML5, CSS3, Modern ES6+ JavaScript |
| **3D Graphics Engine** | Three.js (r128), OrbitControls |
| **Material & Textures** | Procedural Canvas-generated PBR Textures |
| **AI Suggestion Engine** | Heuristic Spatial Arrangement Planner + Google Gemini API |
| **Persistence** | LocalStorage API + JSON File Export / Import |

---

## 📂 Project Structure

```
Ai interior/
├── index.html              # Main single-page application shell
├── css/
│   └── style.css           # Modern dark glassmorphic UI design system
├── js/
│   ├── app.js              # Central coordinator, Three.js setup, scene management
│   ├── room-model.js       # Dynamic room architecture (walls, cutaways, windows, doors)
│   ├── furniture-models.js # Procedural 3D furniture models across design styles
│   ├── textures.js         # Canvas-based procedural wood, marble, tile & fabric textures
│   └── ai-engine.js        # Algorithmic spatial layout planner & Gemini AI integration
└── README.md               # Project documentation & synopsis
```

---

## 🚀 How to Run the Application

This is a zero-dependency web application that runs directly in modern web browsers (Chrome, Edge, Firefox, Safari).

### Option 1: Direct Browser Launch
Double-click `index.html` or open it with your browser.

### Option 2: Local HTTP Server (Recommended for ES Modules)
If running with a local server:

**Using Python (if installed):**
```bash
python -m http.server 8080
```
Then navigate to `http://localhost:8080`

**Using Node.js / npx (if installed):**
```bash
npx serve .
```

**Using VS Code Live Server:**
Right-click `index.html` and click **"Open with Live Server"**.

---

## 💡 Using the AI Interior Studio

1. **Setup Your Room**:
   - Select room type (Living Room, Bedroom, Office, Dining).
   - Enter your room's width, length, and height in meters.
   - Choose your favorite design style (Modern, Minimalist, Luxury, Traditional).
   - Pick a color palette, flooring, and lighting mood.
2. **Generate AI Suggestions**:
   - Click **"Generate AI Design Suggestions"**.
   - Review the generated spatial rationale, color swatches, and itemized checklist on the **AI Insights** tab.
3. **Explore in 3D**:
   - Drag with your left mouse button to orbit.
   - Right-click and drag to pan.
   - Scroll mouse wheel to zoom in and out.
   - Click the camera buttons at the top to jump between **3D Orbit**, **Floor Plan**, and **Eye-Level**.
4. **Customize & Refine**:
   - Click any object in 3D to move or rotate it.
   - Use the **Catalog** tab to add extra decor or change wall paint colors.
5. **Save & Share**:
   - Click **"Snapshot"** to download a high-res rendering.
   - Save the design to your project list or export as a JSON file.
