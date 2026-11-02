// AI Interior Design Suggester & Spatial Arrangement Engine
// Provides heuristic algorithmic spatial planning + optional Gemini Generative AI integration

export class AIEngine {
  // Main suggestion generator
  static async generateDesign(preferences, geminiApiKey = '') {
    // If user provided a Gemini API Key, try calling the Gemini API first
    if (geminiApiKey && geminiApiKey.trim().length > 10) {
      try {
        const geminiResult = await this.callGeminiAPI(preferences, geminiApiKey.trim());
        if (geminiResult) return geminiResult;
      } catch (err) {
        console.warn('Gemini API call failed, falling back to built-in AI rules engine:', err);
      }
    }

    // High-precision algorithmic design engine
    return this.generateAlgorithmicDesign(preferences);
  }

  // Built-in intelligent heuristic rule planner
  static generateAlgorithmicDesign(pref) {
    const { roomType, dimensions, style, colorScheme, flooring, lighting, customNotes } = pref;
    const { width: W, length: L } = dimensions;

    // 1. Color Palette derivation
    const palette = this.getPaletteForScheme(colorScheme, style);

    // 2. Spatial Layout & Furniture Generation
    const items = [];
    let concept = '';
    let spatialRationale = '';
    let lightingPlan = '';

    if (roomType === 'living_room') {
      concept = `${style.toUpperCase()} HARMONY LIVING SPACE`;
      spatialRationale = `Furniture is arranged to optimize conversation flow while maintaining a minimum 0.8m walking corridor from the entrance. The main focal wall features the media console, balanced by a comfortable seating cluster anchored by a tactile area rug.`;
      lightingPlan = `${lighting === 'warm_ambient' ? 'Warm 2700K ambient illumination' : 'Bright 4000K daylight simulation'} with localized accent pools via a designer floor lamp beside the reading lounge chair.`;

      // Area Rug in center
      const rugW = Math.min(W * 0.65, 3.0);
      const rugL = Math.min(L * 0.55, 2.4);
      items.push({
        id: 'rug_1',
        type: 'rug',
        name: 'Area Rug',
        position: [0, 0, 0.2],
        rotation: [0, 0, 0],
        style: style,
        dimensions: [rugW, rugL],
        cost: 250
      });

      // Sofa against back wall or setback
      const sofaZ = -L / 2 + 1.0;
      items.push({
        id: 'sofa_1',
        type: 'sofa',
        name: `${style.charAt(0).toUpperCase() + style.slice(1)} Sofa`,
        position: [0, 0, sofaZ],
        rotation: [0, 0, 0],
        style: style,
        color: palette.sofaColor,
        cost: 950
      });

      // Wall Art above Sofa
      items.push({
        id: 'art_1',
        type: 'wall_art',
        name: 'Gallery Wall Canvas',
        position: [0, 1.8, -L / 2 + 0.05],
        rotation: [0, 0, 0],
        style: style,
        cost: 160
      });

      // Coffee Table in front of Sofa
      items.push({
        id: 'table_1',
        type: 'coffee_table',
        name: 'Coffee Table',
        position: [0, 0, sofaZ + 1.1],
        rotation: [0, 0, 0],
        style: style,
        color: palette.woodColor,
        cost: 290
      });

      // TV Console on front wall opposite sofa
      const tvZ = L / 2 - 0.5;
      items.push({
        id: 'tv_1',
        type: 'tv_unit',
        name: 'Media Console & TV',
        position: [0, 0, tvZ],
        rotation: [0, Math.PI, 0],
        style: style,
        cost: 1200
      });

      // Armchair angled on side
      const chairX = -W / 2 + 1.1;
      items.push({
        id: 'chair_1',
        type: 'armchair',
        name: 'Accent Armchair',
        position: [chairX, 0, 0.2],
        rotation: [0, Math.PI / 4, 0],
        style: style,
        color: palette.accentColor,
        cost: 440
      });

      // Floor Lamp in cozy corner
      items.push({
        id: 'lamp_1',
        type: 'floor_lamp',
        name: 'Sculptural Floor Lamp',
        position: [W / 2 - 0.7, 0, sofaZ - 0.2],
        rotation: [0, 0, 0],
        style: style,
        cost: 210
      });

      // Indoor Plant near window
      items.push({
        id: 'plant_1',
        type: 'plant',
        name: 'Monstera Plant',
        position: [-W / 2 + 0.6, 0, -L / 2 + 0.7],
        rotation: [0, 0.4, 0],
        style: style,
        cost: 85
      });

      // Bookshelf along side wall if room is wide enough
      if (W >= 4.0) {
        items.push({
          id: 'credenza_1',
          type: 'credenza',
          name: 'Storage Credenza',
          position: [W / 2 - 0.35, 0, 0.3],
          rotation: [0, -Math.PI / 2, 0],
          style: style,
          color: palette.woodColor,
          cost: 650
        });
      }

      // Overhead Pendant Light
      items.push({
        id: 'pendant_1',
        type: 'pendant_light',
        name: 'Overhead Pendant Light',
        position: [0, 0, sofaZ + 1.1],
        rotation: [0, 0, 0],
        style: style,
        cost: 180
      });
    } else if (roomType === 'bedroom') {
      concept = `${style.toUpperCase()} SERENITY RETREAT`;
      spatialRationale = `The bed serves as the foundational anchor along the solid back wall, maximizing peace and alignment with Feng Shui principles. Symmetrical nightstands flank each side, while generous clearance ensures easy wardrobe access.`;
      lightingPlan = `Layered lighting including soft dimmable bedside table lamps and overhead ambient glow to foster restful sleep.`;

      // Bed against back wall
      const bedZ = -L / 2 + 1.35;
      items.push({
        id: 'bed_1',
        type: 'bed',
        name: 'Platform Bed',
        position: [0, 0, bedZ],
        rotation: [0, 0, 0],
        style: style,
        color: palette.sofaColor,
        cost: 1450
      });

      // Bedside Nightstands
      items.push({
        id: 'nightstand_l',
        type: 'nightstand',
        name: 'Left Nightstand',
        position: [-1.4, 0, bedZ - 0.7],
        rotation: [0, 0, 0],
        style: style,
        cost: 160
      });

      items.push({
        id: 'nightstand_r',
        type: 'nightstand',
        name: 'Right Nightstand',
        position: [1.4, 0, bedZ - 0.7],
        rotation: [0, 0, 0],
        style: style,
        cost: 160
      });

      // Wall Art above headboard
      items.push({
        id: 'art_1',
        type: 'wall_art',
        name: 'Abstract Wall Art',
        position: [0, 1.9, -L / 2 + 0.05],
        rotation: [0, 0, 0],
        style: style,
        cost: 160
      });

      // Area Rug under bed extending forward
      items.push({
        id: 'rug_1',
        type: 'rug',
        name: 'Plush Bedroom Rug',
        position: [0, 0, bedZ + 0.4],
        rotation: [0, 0, 0],
        style: style,
        dimensions: [2.6, 2.0],
        cost: 280
      });

      // Built-in Mirrored Wardrobe along right wall
      items.push({
        id: 'wardrobe_1',
        type: 'mirrored_wardrobe',
        name: 'Mirrored Double Wardrobe',
        position: [W / 2 - 0.4, 0, 0.3],
        rotation: [0, -Math.PI / 2, 0],
        style: style,
        color: palette.sofaColor,
        cost: 950
      });

      // Ceiling Pendant Light
      items.push({
        id: 'pendant_1',
        type: 'pendant_light',
        name: 'Designer Pendant Light',
        position: [0, 0, bedZ + 0.4],
        rotation: [0, 0, 0],
        style: style,
        cost: 180
      });

      // Indoor Plant in corner
      items.push({
        id: 'plant_1',
        type: 'plant',
        name: 'Fiddle Leaf Fig',
        position: [-W / 2 + 0.6, 0, -L / 2 + 0.7],
        rotation: [0, 0, 0],
        style: style,
        cost: 85
      });
    } else if (roomType === 'home_office') {
      concept = `${style.toUpperCase()} FOCUS & PRODUCTIVITY STUDIO`;
      spatialRationale = `The workstation is positioned perpendicular to the window to invite abundant daylight while avoiding monitor reflection. An ergonomic chair and open shelving provide ergonomic comfort and organized storage.`;
      lightingPlan = `Focused task lighting on work surface combined with daylight simulation for alertness and eye comfort.`;

      // Desk (detect gaming or default executive)
      const isGaming = (customNotes || '').toLowerCase().includes('game') || (customNotes || '').toLowerCase().includes('gaming');
      const deskType = isGaming ? 'gaming_desk' : 'desk';
      const deskName = isGaming ? 'Dual Monitor Battlestation' : 'Executive Workstation';
      const deskCost = isGaming ? 980 : 620;

      items.push({
        id: 'desk_1',
        type: deskType,
        name: deskName,
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        style: style,
        cost: deskCost
      });

      // Ergonomic Chair behind desk
      items.push({
        id: 'office_chair_1',
        type: 'office_chair',
        name: 'Ergonomic Mesh Chair',
        position: [0, 0, -0.65],
        rotation: [0, 0, 0],
        style: style,
        cost: 340
      });

      // Bookshelf behind chair on back wall
      items.push({
        id: 'bookshelf_1',
        type: 'bookshelf',
        name: 'Reference Library Shelving',
        position: [0, 0, -L / 2 + 0.3],
        rotation: [0, 0, 0],
        style: style,
        cost: 490
      });

      // Floor Lamp
      items.push({
        id: 'lamp_1',
        type: 'floor_lamp',
        name: 'Task Floor Lamp',
        position: [W / 2 - 0.8, 0, -L / 2 + 0.8],
        rotation: [0, 0, 0],
        style: style,
        cost: 210
      });

      // Indoor Plant
      items.push({
        id: 'plant_1',
        type: 'plant',
        name: 'Air-Purifying Plant',
        position: [-W / 2 + 0.6, 0, -L / 2 + 0.6],
        rotation: [0, 0, 0],
        style: style,
        cost: 75
      });

      // Rug
      items.push({
        id: 'rug_1',
        type: 'rug',
        name: 'Low-Pile Office Rug',
        position: [0, 0, -0.2],
        rotation: [0, 0, 0],
        style: style,
        dimensions: [2.2, 1.8],
        cost: 200
      });
    } else if (roomType === 'dining_room') {
      // Dining Room
      concept = `${style.toUpperCase()} ELEVATED DINING SUITE`;
      spatialRationale = `The 6-seater dining table takes center stage with a minimum 1.0m pull-out clearance for all chairs. A low credenza / storage unit lines the perimeter for dinnerware.`;
      lightingPlan = `Warm, intimate overhead pendant lighting (2700K) cast directly onto the dining surface to create a cozy gathering ambiance.`;

      // Dining Table in center
      items.push({
        id: 'dining_table_1',
        type: 'dining_table',
        name: 'Dining Table',
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        style: style,
        color: palette.woodColor,
        cost: 650
      });

      // Individual Dining Chairs (each independently moveable & recolorable)
      const chairConfigs = [
        { id: 'chair_1', name: 'Dining Chair 1', pos: [-0.55, 0, 0.68], rot: Math.PI },
        { id: 'chair_2', name: 'Dining Chair 2', pos: [0.55, 0, 0.68], rot: Math.PI },
        { id: 'chair_3', name: 'Dining Chair 3', pos: [-0.55, 0, -0.68], rot: 0 },
        { id: 'chair_4', name: 'Dining Chair 4', pos: [0.55, 0, -0.68], rot: 0 },
        { id: 'chair_5', name: 'Dining Chair 5', pos: [-1.15, 0, 0], rot: -Math.PI / 2 },
        { id: 'chair_6', name: 'Dining Chair 6', pos: [1.15, 0, 0], rot: Math.PI / 2 }
      ];
      chairConfigs.forEach(c => {
        items.push({
          id: c.id,
          type: 'dining_chair',
          name: c.name,
          position: c.pos,
          rotation: [0, c.rot, 0],
          style: style,
          color: palette.accentColor,
          cost: 150
        });
      });

      // Wall Art
      items.push({
        id: 'art_1',
        type: 'wall_art',
        name: 'Curated Wall Art',
        position: [0, 1.8, -L / 2 + 0.05],
        rotation: [0, 0, 0],
        style: style,
        cost: 160
      });

      // Area Rug under dining table
      items.push({
        id: 'rug_1',
        type: 'rug',
        name: 'Dining Area Rug',
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        style: style,
        dimensions: [2.8, 2.0],
        cost: 290
      });

      // Ceiling Pendant Light above dining table
      items.push({
        id: 'pendant_1',
        type: 'pendant_light',
        name: 'Dining Chandelier / Pendant',
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        style: style,
        cost: 180
      });

      // Credenza Buffet / Sideboard on right wall
      items.push({
        id: 'credenza_1',
        type: 'credenza',
        name: 'Buffet Credenza / Sideboard',
        position: [W / 2 - 0.35, 0, 0],
        rotation: [0, -Math.PI / 2, 0],
        style: style,
        color: palette.woodColor,
        cost: 650
      });

      // Plant
      items.push({
        id: 'plant_1',
        type: 'plant',
        name: 'Potted Olive Tree',
        position: [-W / 2 + 0.7, 0, -L / 2 + 0.7],
        rotation: [0, 0, 0],
        style: style,
        cost: 95
      });
    } else {
      // Modular Chef's Kitchen (roomType === 'kitchen')
      concept = `${style.toUpperCase()} CHEF'S CULINARY STUDIO`;
      spatialRationale = `Ergonomic golden work triangle connecting the smart refrigerator, prep sink, and high-performance cooking range with optimal 1.1m clearance surrounding the central island breakfast bar.`;
      lightingPlan = `Bright 4000K daylight-balanced task illumination over prep surfaces with warm 2700K ambient statement pendants above the breakfast bar.`;

      // 1. Main Kitchen Cabinets & Counter with Double Sink & Gooseneck Faucet (back wall)
      items.push({
        id: 'cabinets_1',
        type: 'kitchen_cabinets',
        name: 'Kitchen Counter & Sink',
        position: [-0.3, 0, -L / 2 + 0.35],
        rotation: [0, 0, 0],
        style: style,
        color: palette.sofaColor,
        cost: 1850
      });

      // 2. Oven Range & Chimney Range Hood (back wall to the right)
      items.push({
        id: 'range_1',
        type: 'kitchen_range',
        name: 'Oven Range & Hood',
        position: [W / 2 - 0.75, 0, -L / 2 + 0.35],
        rotation: [0, 0, 0],
        style: style,
        cost: 1200
      });

      // 3. Smart Refrigerator (side wall corner forming the work triangle)
      items.push({
        id: 'fridge_1',
        type: 'refrigerator',
        name: 'Smart Refrigerator',
        position: [-W / 2 + 0.55, 0, -L / 2 + 0.45],
        rotation: [0, 0, 0],
        style: style,
        cost: 1600
      });

      // 4. Kitchen Island with Countertop & Induction Cooktop (center)
      items.push({
        id: 'island_1',
        type: 'kitchen_island',
        name: 'Kitchen Island',
        position: [0, 0, 0.4],
        rotation: [0, 0, 0],
        style: style,
        color: palette.woodColor,
        cost: 1450
      });

      // 5. Counter-Height Bar Stools (3 individual moveable stools along island)
      const stoolConfigs = [
        { id: 'stool_1', name: 'Bar Stool 1', pos: [-0.6, 0, 0.98] },
        { id: 'stool_2', name: 'Bar Stool 2', pos: [0, 0, 0.98] },
        { id: 'stool_3', name: 'Bar Stool 3', pos: [0.6, 0, 0.98] }
      ];
      stoolConfigs.forEach((s, idx) => {
        items.push({
          id: s.id,
          type: 'bar_stool',
          name: s.name,
          stoolIndex: idx + 1,
          position: s.pos,
          rotation: [0, Math.PI, 0],
          style: style,
          color: palette.accentColor,
          cost: 180
        });
      });

      // 6. Statement Pendant Light over Island
      items.push({
        id: 'pendant_1',
        type: 'pendant_light',
        name: 'Island Pendant Fixture',
        position: [0, 0, 0.4],
        rotation: [0, 0, 0],
        style: style,
        cost: 190
      });

      // 7. Indoor Herb Planter
      items.push({
        id: 'plant_1',
        type: 'plant',
        name: 'Fresh Herb Planter',
        position: [W / 2 - 0.6, 0, L / 2 - 0.6],
        rotation: [0, 0, 0],
        style: style,
        cost: 65
      });

      // 8. Anti-fatigue Kitchen Runner Rug between counter and island
      items.push({
        id: 'rug_1',
        type: 'rug',
        name: 'Kitchen Runner Rug',
        position: [0, 0, -0.4],
        rotation: [0, 0, 0],
        style: style,
        dimensions: [2.6, 0.75],
        cost: 140
      });
    }

    const totalCost = items.reduce((sum, item) => sum + (item.cost || 0), 0);

    return {
      conceptName: concept,
      description: `Tailored ${style} interior configuration created for a ${W.toFixed(1)}m × ${L.toFixed(1)}m ${roomType.replace('_', ' ')}. ${customNotes ? `Incorporating: "${customNotes}".` : ''}`,
      spatialRationale: spatialRationale,
      lightingPlan: lightingPlan,
      palette: palette,
      wallColorHex: palette.wallColor,
      flooring: flooring,
      items: items,
      totalEstimatedCost: totalCost
    };
  }

  // Color Swatch Generator
  static getPaletteForScheme(scheme, style) {
    switch (scheme) {
      case 'cool_scandi':
        return {
          name: 'Cool Scandinavian',
          wallColor: 0xf1f5f9,
          wallColorHex: '#f1f5f9',
          accentColor: 0x38bdf8,
          accentColorHex: '#38bdf8',
          sofaColor: 0x64748b,
          sofaColorHex: '#64748b',
          woodColor: 0xd6c4b2,
          woodColorHex: '#d6c4b2'
        };
      case 'dark_luxury':
        return {
          name: 'Midnight Luxury',
          wallColor: 0x1e293b,
          wallColorHex: '#1e293b',
          accentColor: 0xd4af37,
          accentColorHex: '#d4af37',
          sofaColor: 0x0f172a,
          sofaColorHex: '#0f172a',
          woodColor: 0x3e2723,
          woodColorHex: '#3e2723'
        };
      case 'earthy_terracotta':
        return {
          name: 'Earthy Terracotta & Olive',
          wallColor: 0xfbf7ee,
          wallColorHex: '#fbf7ee',
          accentColor: 0xc2410c,
          accentColorHex: '#c2410c',
          sofaColor: 0x3f6212,
          sofaColorHex: '#3f6212',
          woodColor: 0x78350f,
          woodColorHex: '#78350f'
        };
      case 'pastel':
        return {
          name: 'Pastel Harmony',
          wallColor: 0xfdf4ff,
          wallColorHex: '#fdf4ff',
          accentColor: 0xf472b6,
          accentColorHex: '#f472b6',
          sofaColor: 0xa5b4fc,
          sofaColorHex: '#a5b4fc',
          woodColor: 0xfef08a,
          woodColorHex: '#fef08a'
        };
      case 'warm_neutral':
      default:
        return {
          name: 'Warm Neutral Haven',
          wallColor: 0xfaf5ee,
          wallColorHex: '#faf5ee',
          accentColor: 0xd97706,
          accentColorHex: '#d97706',
          sofaColor: 0x374151,
          sofaColorHex: '#374151',
          woodColor: 0x8b5a2b,
          woodColorHex: '#8b5a2b'
        };
    }
  }

  // Gemini API integration for live AI reasoning
  static async callGeminiAPI(pref, apiKey) {
    const prompt = `You are a world-class AI interior architect. Generate an interior design plan for a ${pref.roomType.replace('_', ' ')} with dimensions ${pref.dimensions.width}m width by ${pref.dimensions.length}m length by ${pref.dimensions.height}m height.
Style: ${pref.style}. Preferred Color Scheme: ${pref.colorScheme}. Flooring: ${pref.flooring}. Lighting: ${pref.lighting}.
Notes: ${pref.customNotes || 'None'}.

Respond ONLY with valid JSON with this exact schema:
{
  "conceptName": "Short catchy design name",
  "description": "2-3 sentences explaining the design aesthetic and feel",
  "spatialRationale": "2 sentences explaining ergonomics and walking paths",
  "lightingPlan": "2 sentences explaining lighting fixtures and temperature",
  "wallColorHex": "#f4f4f5",
  "accentColorHex": "#d97706",
  "furnitureColorHex": "#374151"
}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    if (!res.ok) throw new Error(`Gemini HTTP error ${res.status}`);
    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Empty response from Gemini');

    const parsed = JSON.parse(text);
    // Combine Gemini's intelligent text with our spatial furniture layout
    const basePlan = this.generateAlgorithmicDesign(pref);
    basePlan.conceptName = parsed.conceptName || basePlan.conceptName;
    basePlan.description = parsed.description || basePlan.description;
    basePlan.spatialRationale = parsed.spatialRationale || basePlan.spatialRationale;
    basePlan.lightingPlan = parsed.lightingPlan || basePlan.lightingPlan;
    if (parsed.wallColorHex) {
      basePlan.wallColorHex = parseInt(parsed.wallColorHex.replace('#', '0x'), 16);
      basePlan.palette.wallColor = basePlan.wallColorHex;
      basePlan.palette.wallColorHex = parsed.wallColorHex;
    }
    return basePlan;
  }
}
