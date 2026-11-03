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

    if (roomType === 'living_room' || roomType.startsWith('living_room_')) {
      // Determine which of the 4 Living Room Design Types is selected
      let livingType = pref.livingRoomType || 1;
      if (roomType === 'living_room_zen' || roomType === 'living_room_type2') livingType = 2;
      else if (roomType === 'living_room_luxury' || roomType === 'living_room_type3') livingType = 3;
      else if (roomType === 'living_room_cozy' || roomType === 'living_room_type4') livingType = 4;
      else if (roomType === 'living_room' && pref.livingRoomType) livingType = parseInt(pref.livingRoomType, 10) || 1;

      if (livingType === 1) {
        // TYPE 1: CONTEMPORARY MEDIA & CONVERSATION LOUNGE
        concept = `TYPE 1: CONTEMPORARY MEDIA & CONVERSATION LOUNGE (${style.toUpperCase()})`;
        spatialRationale = `Engineered for effortless social hosting and cinematic immersion. The spacious seating zone is anchored by a deep designer sofa and accent armchair angled for face-to-face dialogue, with an expansive low-profile media console providing a balanced architectural focal point.`;
        lightingPlan = `Layered ambient and bias entertainment lighting: a designer central pendant provides soft overhead warmth while a perimeter floor lamp creates glare-free mood pools for movie evenings.`;

        // Area Rug in center
        const rugW = Math.min(W * 0.65, 3.0);
        const rugL = Math.min(L * 0.55, 2.4);
        items.push({
          id: 'rug_1',
          type: 'rug',
          name: 'Designer Area Rug',
          position: [0, 0, 0.1],
          rotation: [0, 0, 0],
          style: style,
          dimensions: [rugW, rugL],
          cost: 260
        });

        // Sofa against back wall setback
        const sofaZ = -L / 2 + 1.05;
        items.push({
          id: 'sofa_1',
          type: 'sofa',
          name: `${style.charAt(0).toUpperCase() + style.slice(1)} Deep Lounge Sofa`,
          position: [0, 0, sofaZ],
          rotation: [0, 0, 0],
          style: style,
          color: palette.sofaColor,
          cost: 1100
        });

        // Gallery Wall Art above Sofa
        items.push({
          id: 'art_1',
          type: 'wall_art',
          name: 'Contemporary Canvas Art',
          position: [0, 1.85, -L / 2 + 0.05],
          rotation: [0, 0, 0],
          style: style,
          cost: 180
        });

        // Coffee Table in front of Sofa
        items.push({
          id: 'table_1',
          type: 'coffee_table',
          name: 'Modern Coffee Table',
          position: [0, 0, sofaZ + 1.15],
          rotation: [0, 0, 0],
          style: style,
          color: palette.woodColor,
          cost: 320
        });

        // Media Console & TV Unit on front wall
        const tvZ = L / 2 - 0.45;
        items.push({
          id: 'tv_1',
          type: 'tv_unit',
          name: 'Media Console & 4K Display',
          position: [0, 0, tvZ],
          rotation: [0, Math.PI, 0],
          style: style,
          cost: 1350
        });

        // Accent Armchair angled on side
        const chairX = -W / 2 + 1.15;
        items.push({
          id: 'chair_1',
          type: 'armchair',
          name: 'Sculptural Accent Armchair',
          position: [chairX, 0, 0.2],
          rotation: [0, Math.PI / 4, 0],
          style: style,
          color: palette.accentColor,
          cost: 460
        });

        // Sculptural Floor Lamp
        items.push({
          id: 'lamp_1',
          type: 'floor_lamp',
          name: 'Sculptural Brass Floor Lamp',
          position: [W / 2 - 0.7, 0, sofaZ - 0.2],
          rotation: [0, 0, 0],
          style: style,
          cost: 220
        });

        // Storage Credenza along right wall
        items.push({
          id: 'credenza_1',
          type: 'credenza',
          name: 'Perimeter Storage Credenza',
          position: [W / 2 - 0.35, 0, 0.3],
          rotation: [0, -Math.PI / 2, 0],
          style: style,
          color: palette.woodColor,
          cost: 680
        });

        // Overhead Pendant Light
        items.push({
          id: 'pendant_1',
          type: 'pendant_light',
          name: 'Architectural Pendant Light',
          position: [0, 0, sofaZ + 1.15],
          rotation: [0, 0, 0],
          style: style,
          cost: 190
        });

        // Tall Indoor Plant
        items.push({
          id: 'plant_1',
          type: 'plant',
          name: 'Monstera Deliciosa Plant',
          position: [-W / 2 + 0.65, 0, L / 2 - 0.75],
          rotation: [0, 0.4, 0],
          style: style,
          cost: 90
        });

      } else if (livingType === 2) {
        // TYPE 2: MINIMALIST JAPANDI ZEN LOUNGE
        concept = `TYPE 2: MINIMALIST JAPANDI ZEN LOUNGE (${style.toUpperCase()})`;
        spatialRationale = `Embraces Wabi-Sabi simplicity with low-profile horizontal silhouettes, uncluttered pathways, and rich natural organic materials. Generous open floor clearance maintains sightlines, bringing peaceful breathing room into the home.`;
        lightingPlan = `Warm 2500K-2700K indirect twilight glow: soft diffused orb illumination paired with a warm paper-shade floor accent.`;

        // Low Minimalist Sofa
        const sofaZ = -L / 2 + 1.1;
        items.push({
          id: 'sofa_1',
          type: 'sofa',
          name: 'Low Japandi Linen Sofa',
          position: [0, 0, sofaZ],
          rotation: [0, 0, 0],
          style: 'minimalist',
          color: palette.sofaColor,
          cost: 1050
        });

        // Bauhaus Wall Art
        items.push({
          id: 'art_1',
          type: 'wall_art',
          name: 'Zen Bauhaus Minimal Canvas',
          position: [0, 1.9, -L / 2 + 0.05],
          rotation: [0, 0, 0],
          style: 'minimalist',
          cost: 160
        });

        // Low Organic Wood Coffee Table
        items.push({
          id: 'table_1',
          type: 'coffee_table',
          name: 'Low Organic Oak Coffee Table',
          position: [0, 0, -0.05],
          rotation: [0, 0, 0],
          style: 'minimalist',
          color: palette.woodColor,
          cost: 290
        });

        // Natural Woven Jute & Wool Rug
        items.push({
          id: 'rug_1',
          type: 'rug',
          name: 'Woven Jute & Wool Rug',
          position: [0, 0, 0.1],
          rotation: [0, 0, 0],
          style: 'minimalist',
          dimensions: [2.8, 2.2],
          cost: 240
        });

        // Low Media & Storage Credenza on front wall
        items.push({
          id: 'credenza_1',
          type: 'credenza',
          name: 'Low Horizon Media Credenza',
          position: [0, 0, L / 2 - 0.45],
          rotation: [0, Math.PI, 0],
          style: 'minimalist',
          color: palette.woodColor,
          cost: 620
        });

        // Low Japandi Accent Chair
        items.push({
          id: 'chair_1',
          type: 'armchair',
          name: 'Low Oak Japandi Armchair',
          position: [-W / 2 + 1.15, 0, 0.1],
          rotation: [0, Math.PI / 4, 0],
          style: 'minimalist',
          color: palette.accentColor,
          cost: 410
        });

        // Full-length Leaning Floor Mirror
        items.push({
          id: 'mirror_1',
          type: 'floor_mirror',
          name: 'Full-Length Leaning Mirror',
          position: [W / 2 - 0.6, 0, L / 2 - 0.8],
          rotation: [0, -Math.PI / 4, 0],
          style: 'minimalist',
          cost: 210
        });

        // Paper Lantern Floor Lamp
        items.push({
          id: 'lamp_1',
          type: 'floor_lamp',
          name: 'Paper Lantern Floor Lamp',
          position: [-W / 2 + 0.65, 0, -L / 2 + 0.75],
          rotation: [0, 0, 0],
          style: 'minimalist',
          cost: 160
        });

        // Potted Zen Bamboo / Plant
        items.push({
          id: 'plant_1',
          type: 'plant',
          name: 'Potted Zen Bamboo',
          position: [W / 2 - 0.6, 0, -L / 2 + 0.75],
          rotation: [0, 0, 0],
          style: 'minimalist',
          cost: 85
        });

        // Diffused Orb Pendant Light
        items.push({
          id: 'pendant_1',
          type: 'pendant_light',
          name: 'Diffused Orb Pendant Light',
          position: [0, 0, -0.05],
          rotation: [0, 0, 0],
          style: 'minimalist',
          cost: 175
        });

      } else if (livingType === 3) {
        // TYPE 3: MODERN LUXURY PENTHOUSE SALON
        concept = `TYPE 3: MODERN LUXURY PENTHOUSE SALON (${style.toUpperCase()})`;
        spatialRationale = `A grand salon arrangement designed for formal hosting and luxurious relaxation. Symmetrical armchair placements form a high-end conversation quadrangle around a marble-topped coffee table, balanced by a perimeter luxury credenza and statement entertainment center.`;
        lightingPlan = `Multi-tiered architectural luxury lighting: a brilliant sculptural brass pendant acts as the room's crown jewel, complemented by warm localized accent downlights and brass floor sconces.`;

        // Luxury Velvet Tuxedo Sofa
        const sofaZ = -L / 2 + 1.15;
        items.push({
          id: 'sofa_1',
          type: 'sofa',
          name: 'Velvet Tailored Luxury Sofa',
          position: [0, 0, sofaZ],
          rotation: [0, 0, 0],
          style: 'luxury',
          color: palette.sofaColor,
          cost: 1450
        });

        // Executive Fine Art Canvas
        items.push({
          id: 'art_1',
          type: 'wall_art',
          name: 'Executive Fine Art Canvas',
          position: [0, 1.9, -L / 2 + 0.05],
          rotation: [0, 0, 0],
          style: 'luxury',
          cost: 250
        });

        // Polished Marble & Brass Coffee Table
        items.push({
          id: 'table_1',
          type: 'coffee_table',
          name: 'Polished Marble & Brass Table',
          position: [0, 0, 0.0],
          rotation: [0, 0, 0],
          style: 'luxury',
          color: palette.woodColor,
          cost: 480
        });

        // Plush Silk-Wool Luxury Rug
        items.push({
          id: 'rug_1',
          type: 'rug',
          name: 'Plush Silk-Wool Luxury Rug',
          position: [0, 0, 0.1],
          rotation: [0, 0, 0],
          style: 'luxury',
          dimensions: [3.2, 2.5],
          cost: 420
        });

        // Grand Floating Media Console & Display
        items.push({
          id: 'tv_1',
          type: 'tv_unit',
          name: 'Grand Floating Media Console',
          position: [0, 0, L / 2 - 0.45],
          rotation: [0, Math.PI, 0],
          style: 'luxury',
          cost: 1550
        });

        // Symmetrical Luxury Armchairs (Left & Right)
        items.push({
          id: 'chair_1',
          type: 'armchair',
          name: 'Velvet Salon Club Chair (L)',
          position: [-W / 2 + 1.1, 0, 0.0],
          rotation: [0, Math.PI / 3, 0],
          style: 'luxury',
          color: palette.accentColor,
          cost: 520
        });
        items.push({
          id: 'chair_2',
          type: 'armchair',
          name: 'Velvet Salon Club Chair (R)',
          position: [W / 2 - 1.1, 0, 0.0],
          rotation: [0, -Math.PI / 3, 0],
          style: 'luxury',
          color: palette.accentColor,
          cost: 520
        });

        // Luxury Buffet / Bar Credenza along back right
        items.push({
          id: 'credenza_1',
          type: 'credenza',
          name: 'Cocktail Salon Buffet Credenza',
          position: [W / 2 - 0.35, 0, -L / 2 + 1.4],
          rotation: [0, -Math.PI / 2, 0],
          style: 'luxury',
          color: palette.woodColor,
          cost: 780
        });

        // Sculptural Brass Floor Lamp
        items.push({
          id: 'lamp_1',
          type: 'floor_lamp',
          name: 'Sculptural Brass Floor Lamp',
          position: [-W / 2 + 0.65, 0, -L / 2 + 0.75],
          rotation: [0, 0, 0],
          style: 'luxury',
          cost: 260
        });

        // Grand Brass Designer Chandelier
        items.push({
          id: 'pendant_1',
          type: 'pendant_light',
          name: 'Grand Brass Designer Chandelier',
          position: [0, 0, 0.0],
          rotation: [0, 0, 0],
          style: 'luxury',
          cost: 320
        });

        // Statement Architectural Palm
        items.push({
          id: 'plant_1',
          type: 'plant',
          name: 'Statement Architectural Palm',
          position: [-W / 2 + 0.65, 0, L / 2 - 0.75],
          rotation: [0, 0, 0],
          style: 'luxury',
          cost: 120
        });

      } else {
        // TYPE 4: SCANDINAVIAN HYGGE FAMILY LIVING (WITH LIBRARY & STUDY NOOK)
        concept = `TYPE 4: SCANDINAVIAN HYGGE FAMILY LIVING (${style.toUpperCase()})`;
        spatialRationale = `A versatile, warm family sanctuary that seamlessly combines relaxed communal lounging with an integrated library and laptop work nook. The corner reading zone invites quiet afternoon reading, while the central sofa cluster provides comfortable movie and game nights.`;
        lightingPlan = `Cozy 2700K hygge illumination: directional reading lamp by the bookshelf nook, warm timber overhead pendant, and soft task lighting at the study desk.`;

        // Cozy Hygge Family Sofa
        const sofaZ = -L / 2 + 1.15;
        items.push({
          id: 'sofa_1',
          type: 'sofa',
          name: 'Hygge Family Fabric Sofa',
          position: [-0.35, 0, sofaZ],
          rotation: [0, 0, 0],
          style: 'traditional',
          color: palette.sofaColor,
          cost: 1150
        });

        // Botanical Scandinavian Canvas
        items.push({
          id: 'art_1',
          type: 'wall_art',
          name: 'Botanical Scandinavian Canvas',
          position: [-0.35, 1.9, -L / 2 + 0.05],
          rotation: [0, 0, 0],
          style: style,
          cost: 175
        });

        // Round Oak Coffee & Reading Table
        items.push({
          id: 'table_1',
          type: 'coffee_table',
          name: 'Round Natural Oak Coffee Table',
          position: [-0.35, 0, 0.0],
          rotation: [0, 0, 0],
          style: style,
          color: palette.woodColor,
          cost: 280
        });

        // Chunky Wool Hygge Rug
        items.push({
          id: 'rug_1',
          type: 'rug',
          name: 'Chunky Wool Hygge Rug',
          position: [-0.35, 0, 0.1],
          rotation: [0, 0, 0],
          style: style,
          dimensions: [2.8, 2.2],
          cost: 290
        });

        // Low Media Console & TV
        items.push({
          id: 'tv_1',
          type: 'tv_unit',
          name: 'Nordic Oak Media Console',
          position: [-0.35, 0, L / 2 - 0.45],
          rotation: [0, Math.PI, 0],
          style: style,
          cost: 1200
        });

        // Open Nordic Library Bookshelf
        items.push({
          id: 'bookshelf_1',
          type: 'bookshelf',
          name: 'Nordic Open Library Shelf',
          position: [-W / 2 + 0.35, 0, -L / 2 + 1.3],
          rotation: [0, Math.PI / 2, 0],
          style: style,
          cost: 440
        });

        // Cozy Reading Armchair
        items.push({
          id: 'chair_1',
          type: 'armchair',
          name: 'Hygge Reading Armchair',
          position: [-W / 2 + 1.1, 0, 0.35],
          rotation: [0, Math.PI / 4, 0],
          style: style,
          color: palette.accentColor,
          cost: 460
        });

        // Integrated Work & Study Desk along right wall
        items.push({
          id: 'desk_1',
          type: 'desk',
          name: 'Integrated Work / Study Desk',
          position: [W / 2 - 0.75, 0, 0.3],
          rotation: [0, -Math.PI / 2, 0],
          style: style,
          color: palette.woodColor,
          cost: 560
        });

        // Ergonomic Desk Chair
        items.push({
          id: 'office_chair_1',
          type: 'office_chair',
          name: 'Ergonomic Desk Chair',
          position: [W / 2 - 1.45, 0, 0.3],
          rotation: [0, Math.PI / 2, 0],
          style: style,
          cost: 280
        });

        // Timber Directional Reading Lamp
        items.push({
          id: 'lamp_1',
          type: 'floor_lamp',
          name: 'Timber Reading Floor Lamp',
          position: [-W / 2 + 0.6, 0, -L / 2 + 0.65],
          rotation: [0, 0, 0],
          style: style,
          cost: 195
        });

        // Woven Timber Pendant Lamp
        items.push({
          id: 'pendant_1',
          type: 'pendant_light',
          name: 'Woven Timber Pendant Lamp',
          position: [-0.35, 0, 0.0],
          rotation: [0, 0, 0],
          style: style,
          cost: 185
        });

        // Lush Monstera Plant
        items.push({
          id: 'plant_1',
          type: 'plant',
          name: 'Lush Monstera Deliciosa',
          position: [W / 2 - 0.6, 0, L / 2 - 0.75],
          rotation: [0, 0, 0],
          style: style,
          cost: 85
        });
      }
    } else if (roomType === 'bedroom' || roomType.startsWith('bedroom_')) {
      // Determine which of the 4 Master Bedroom Design Types is selected
      let bedType = pref.bedroomType || 1;
      if (roomType === 'bedroom_zen' || roomType === 'bedroom_type2') bedType = 2;
      else if (roomType === 'bedroom_hotel' || roomType === 'bedroom_type3') bedType = 3;
      else if (roomType === 'bedroom_scandi' || roomType === 'bedroom_type4') bedType = 4;
      else if (roomType === 'bedroom' && pref.bedroomType) bedType = parseInt(pref.bedroomType, 10) || 1;

      if (bedType === 1) {
        // TYPE 1: LUXURY EXECUTIVE MASTER SUITE
        // King bed, mirrored double wardrobe, private lounge armchair & side table, brass floor lamp & chandelier
        concept = `TYPE 1: LUXURY EXECUTIVE MASTER SUITE (${style.toUpperCase()})`;
        spatialRationale = `A palatial master suite anchored by an opulent King platform bed framed by symmetrical floating nightstands. The foreground features an exclusive private reading and cocktail lounge nook with a plush velvet armchair, sculpted side table, and reading floor lamp. A built-in mirrored wardrobe along the perimeter reflects ambient light to double visual room volume.`;
        lightingPlan = `Multi-layered architectural lighting: warm 2700K bedside reading accents, a central statement designer chandelier, and targeted ambient illumination over the reading lounge.`;

        // King Bed against back wall
        const bedZ = -L / 2 + 1.35;
        items.push({
          id: 'bed_1',
          type: 'bed',
          name: 'Executive King Platform Bed',
          position: [0, 0, bedZ],
          rotation: [0, 0, 0],
          style: style,
          color: palette.sofaColor,
          cost: 1650
        });

        // Symmetrical Bedside Nightstands
        items.push({
          id: 'nightstand_l',
          type: 'nightstand',
          name: 'Executive Nightstand (L)',
          position: [-1.4, 0, bedZ - 0.7],
          rotation: [0, 0, 0],
          style: style,
          cost: 180
        });
        items.push({
          id: 'nightstand_r',
          type: 'nightstand',
          name: 'Executive Nightstand (R)',
          position: [1.4, 0, bedZ - 0.7],
          rotation: [0, 0, 0],
          style: style,
          cost: 180
        });

        // Master Wall Art above Headboard
        items.push({
          id: 'art_1',
          type: 'wall_art',
          name: 'Executive Fine Art Canvas',
          position: [0, 1.9, -L / 2 + 0.05],
          rotation: [0, 0, 0],
          style: style,
          cost: 220
        });

        // Extended Plush Bedroom Rug
        items.push({
          id: 'rug_1',
          type: 'rug',
          name: 'Plush Silk-Wool Master Rug',
          position: [0, 0, bedZ + 0.4],
          rotation: [0, 0, 0],
          style: style,
          dimensions: [2.8, 2.2],
          cost: 350
        });

        // Mirrored Double Wardrobe along right wall
        items.push({
          id: 'wardrobe_1',
          type: 'mirrored_wardrobe',
          name: 'Mirrored Double Dressing Robe',
          position: [W / 2 - 0.36, 0, -0.2],
          rotation: [0, -Math.PI / 2, 0],
          style: style,
          color: palette.sofaColor,
          cost: 1100
        });

        // Luxury Armchair in lounge corner
        items.push({
          id: 'chair_1',
          type: 'armchair',
          name: 'Velvet Lounge Accent Chair',
          position: [-W / 2 + 1.15, 0, L / 2 - 1.15],
          rotation: [0, Math.PI / 3, 0],
          style: style,
          color: palette.accentColor,
          cost: 520
        });

        // Marble & Brass Side Table next to armchair
        items.push({
          id: 'table_1',
          type: 'coffee_table',
          name: 'Marble & Brass Side Table',
          position: [-W / 2 + 1.85, 0, L / 2 - 0.85],
          rotation: [0, 0, 0],
          style: style,
          color: palette.woodColor,
          cost: 280
        });

        // Reading Floor Lamp
        items.push({
          id: 'lamp_1',
          type: 'floor_lamp',
          name: 'Sculptural Brass Floor Lamp',
          position: [-W / 2 + 0.65, 0, L / 2 - 1.5],
          rotation: [0, 0, 0],
          style: style,
          cost: 240
        });

        // Statement Ceiling Chandelier / Pendant
        items.push({
          id: 'pendant_1',
          type: 'pendant_light',
          name: 'Grand Designer Chandelier',
          position: [0, 0, bedZ + 0.4],
          rotation: [0, 0, 0],
          style: style,
          cost: 290
        });

        // Tall Fiddle Leaf Fig Plant
        items.push({
          id: 'plant_1',
          type: 'plant',
          name: 'Potted Fiddle Leaf Fig',
          position: [W / 2 - 0.65, 0, L / 2 - 0.75],
          rotation: [0, 0, 0],
          style: style,
          cost: 110
        });

      } else if (bedType === 2) {
        // TYPE 2: MINIMALIST ZEN RETREAT
        // Low Japandi bed, low storage credenza, full-length leaning mirror, paper lantern lamp & orb pendant
        concept = `TYPE 2: MINIMALIST ZEN MASTER RETREAT (${style.toUpperCase()})`;
        spatialRationale = `Inspired by Japandi and Wabi-Sabi philosophies, this layout prioritizes uncluttered horizontal horizons and generous floor breathing room. A low-profile platform bed is complemented by a low horizontal storage credenza and a full-length leaning mirror, creating an organic, grounding sanctuary that calms sensory overload.`;
        lightingPlan = `Soft, indirect diffused 2700K illumination: a warm paper-lantern floor lamp and an overhead glowing sphere pendant that create gentle, shadowless ambiance.`;

        // Low Platform Bed against back wall
        const bedZ = -L / 2 + 1.35;
        items.push({
          id: 'bed_1',
          type: 'bed',
          name: 'Low Japandi Platform Bed',
          position: [0, 0, bedZ],
          rotation: [0, 0, 0],
          style: 'minimalist',
          color: palette.sofaColor,
          cost: 1350
        });

        // Floating Minimalist Nightstands
        items.push({
          id: 'nightstand_l',
          type: 'nightstand',
          name: 'Floating Zen Nightstand (L)',
          position: [-1.35, 0, bedZ - 0.7],
          rotation: [0, 0, 0],
          style: 'minimalist',
          cost: 140
        });
        items.push({
          id: 'nightstand_r',
          type: 'nightstand',
          name: 'Floating Zen Nightstand (R)',
          position: [1.35, 0, bedZ - 0.7],
          rotation: [0, 0, 0],
          style: 'minimalist',
          cost: 140
        });

        // Serene Bauhaus Wall Art
        items.push({
          id: 'art_1',
          type: 'wall_art',
          name: 'Zen Geometric Bauhaus Art',
          position: [0, 1.85, -L / 2 + 0.05],
          rotation: [0, 0, 0],
          style: 'minimalist',
          cost: 160
        });

        // Natural Woven Area Rug
        items.push({
          id: 'rug_1',
          type: 'rug',
          name: 'Organic Jute & Wool Rug',
          position: [0, 0, bedZ + 0.35],
          rotation: [0, 0, 0],
          style: 'minimalist',
          dimensions: [2.5, 1.9],
          cost: 220
        });

        // Low Storage Credenza along left wall
        items.push({
          id: 'credenza_1',
          type: 'credenza',
          name: 'Low Oak Media & Storage Credenza',
          position: [-W / 2 + 0.38, 0, 0.4],
          rotation: [0, Math.PI / 2, 0],
          style: 'minimalist',
          color: palette.woodColor,
          cost: 580
        });

        // Full-length Leaning Floor Mirror
        items.push({
          id: 'mirror_1',
          type: 'floor_mirror',
          name: 'Full-Length Leaning Mirror',
          position: [W / 2 - 0.65, 0, L / 2 - 0.85],
          rotation: [0, -Math.PI / 4, 0],
          style: 'minimalist',
          cost: 210
        });

        // Flush Wardrobe along right wall
        items.push({
          id: 'wardrobe_1',
          type: 'wardrobe',
          name: 'Concealed Sliding Wardrobe',
          position: [W / 2 - 0.35, 0, -0.6],
          rotation: [0, -Math.PI / 2, 0],
          style: 'minimalist',
          color: palette.sofaColor,
          cost: 850
        });

        // Paper Lantern Floor Lamp
        items.push({
          id: 'lamp_1',
          type: 'floor_lamp',
          name: 'Zen Lantern Floor Lamp',
          position: [-W / 2 + 0.65, 0, -L / 2 + 0.7],
          rotation: [0, 0, 0],
          style: 'minimalist',
          cost: 160
        });

        // Potted Zen Bamboo / Plant
        items.push({
          id: 'plant_1',
          type: 'plant',
          name: 'Potted Zen Bamboo / Plant',
          position: [-W / 2 + 0.6, 0, L / 2 - 0.7],
          rotation: [0, 0, 0],
          style: 'minimalist',
          cost: 80
        });

        // Diffused Orb Pendant Light
        items.push({
          id: 'pendant_1',
          type: 'pendant_light',
          name: 'Diffused Orb Pendant Light',
          position: [0, 0, bedZ + 0.35],
          rotation: [0, 0, 0],
          style: 'minimalist',
          cost: 170
        });

      } else if (bedType === 3) {
        // TYPE 3: MODERN HOTEL CHIC & VANITY
        // Designer bed, work/vanity desk + ergonomic chair, mirrored robe, floor mirror, task lamp
        concept = `TYPE 3: MODERN HOTEL CHIC & VANITY SUITE (${style.toUpperCase()})`;
        spatialRationale = `A high-functioning master suite combining premium sleeping comfort with a dedicated grooming vanity and laptop workstation. By placing the bed on the left-center axis and positioning the vanity station along the opposite wall, two functional zones coexist with uninterrupted traffic flow. A full mirrored wardrobe and tall mirror optimize morning preparation.`;
        lightingPlan = `Dual-zone illumination: soft dimmable ambient glow over the sleeping quarter paired with crisp 4000K daylight-balanced task illumination at the vanity workstation.`;

        // Designer Bed
        const bedZ = -L / 2 + 1.35;
        items.push({
          id: 'bed_1',
          type: 'bed',
          name: 'Hotel Chic Upholstered Bed',
          position: [-0.45, 0, bedZ],
          rotation: [0, 0, 0],
          style: style,
          color: palette.sofaColor,
          cost: 1550
        });

        // Nightstands
        items.push({
          id: 'nightstand_l',
          type: 'nightstand',
          name: 'Bedside Nightstand (L)',
          position: [-1.85, 0, bedZ - 0.7],
          rotation: [0, 0, 0],
          style: style,
          cost: 160
        });
        items.push({
          id: 'nightstand_r',
          type: 'nightstand',
          name: 'Bedside Nightstand (R)',
          position: [0.95, 0, bedZ - 0.7],
          rotation: [0, 0, 0],
          style: style,
          cost: 160
        });

        // Wall Art
        items.push({
          id: 'art_1',
          type: 'wall_art',
          name: 'Urban Contemporary Canvas',
          position: [-0.45, 1.9, -L / 2 + 0.05],
          rotation: [0, 0, 0],
          style: style,
          cost: 180
        });

        // Geometric Rug
        items.push({
          id: 'rug_1',
          type: 'rug',
          name: 'Geometric Designer Rug',
          position: [-0.45, 0, bedZ + 0.4],
          rotation: [0, 0, 0],
          style: style,
          dimensions: [2.7, 2.1],
          cost: 310
        });

        // Executive Vanity / Laptop Desk along right wall
        items.push({
          id: 'desk_1',
          type: 'desk',
          name: 'Executive Vanity & Laptop Desk',
          position: [W / 2 - 0.75, 0, 0.4],
          rotation: [0, -Math.PI / 2, 0],
          style: style,
          color: palette.woodColor,
          cost: 580
        });

        // Velvet Ergonomic Vanity Chair
        items.push({
          id: 'office_chair_1',
          type: 'office_chair',
          name: 'Ergonomic Vanity Chair',
          position: [W / 2 - 1.45, 0, 0.4],
          rotation: [0, Math.PI / 2, 0],
          style: style,
          cost: 290
        });

        // Mirrored Double Wardrobe along left wall
        items.push({
          id: 'wardrobe_1',
          type: 'mirrored_wardrobe',
          name: 'Mirrored Double Wardrobe',
          position: [-W / 2 + 0.36, 0, 0.7],
          rotation: [0, Math.PI / 2, 0],
          style: style,
          cost: 1050
        });

        // Floor Dressing Mirror in corner
        items.push({
          id: 'mirror_1',
          type: 'floor_mirror',
          name: 'Illuminated Dressing Mirror',
          position: [W / 2 - 0.55, 0, -L / 2 + 0.75],
          rotation: [0, -Math.PI / 3, 0],
          style: style,
          cost: 220
        });

        // Vanity Task Floor Lamp
        items.push({
          id: 'lamp_1',
          type: 'floor_lamp',
          name: 'Vanity Arc Task Lamp',
          position: [W / 2 - 0.55, 0, 1.35],
          rotation: [0, 0, 0],
          style: style,
          cost: 190
        });

        // Ceiling Pendant Light
        items.push({
          id: 'pendant_1',
          type: 'pendant_light',
          name: 'Modern Articulated Pendant',
          position: [-0.45, 0, bedZ + 0.4],
          rotation: [0, 0, 0],
          style: style,
          cost: 200
        });

        // Potted Plant
        items.push({
          id: 'plant_1',
          type: 'plant',
          name: 'Potted Air-Filtering Plant',
          position: [W / 2 - 0.6, 0, L / 2 - 0.6],
          rotation: [0, 0, 0],
          style: style,
          cost: 75
        });

      } else {
        // TYPE 4: SCANDINAVIAN COZY HAVEN
        // Solid wood bed, library bookshelf, cozy reading armchair, timber table & reading lamp
        concept = `TYPE 4: SCANDINAVIAN COZY MASTER HAVEN (${style.toUpperCase()})`;
        spatialRationale = `Rooted in Nordic hygge philosophy, this layout pairs warm natural oak tones with a dedicated reading library nook. An open bookshelf, deep upholstered armchair, and timber reading lamp create an inviting corner for winding down with a book before sleep, while an expansive wool rug under the wood platform bed grounds the space in comfort.`;
        lightingPlan = `Hygge-inspired 2500K warm amber lighting: focused directional light at the reading chair, gentle nightstand glow, and a woven Scandinavian overhead pendant fixture.`;

        // Natural Oak Bed
        const bedZ = -L / 2 + 1.35;
        items.push({
          id: 'bed_1',
          type: 'bed',
          name: 'Solid Natural Oak Bed',
          position: [0.35, 0, bedZ],
          rotation: [0, 0, 0],
          style: 'traditional',
          color: palette.woodColor,
          cost: 1400
        });

        // Matching Nightstands
        items.push({
          id: 'nightstand_l',
          type: 'nightstand',
          name: 'Oak Bedside Table (L)',
          position: [-1.05, 0, bedZ - 0.7],
          rotation: [0, 0, 0],
          style: 'traditional',
          cost: 150
        });
        items.push({
          id: 'nightstand_r',
          type: 'nightstand',
          name: 'Oak Bedside Table (R)',
          position: [1.75, 0, bedZ - 0.7],
          rotation: [0, 0, 0],
          style: 'traditional',
          cost: 150
        });

        // Botanical Wall Art
        items.push({
          id: 'art_1',
          type: 'wall_art',
          name: 'Botanical Scandinavian Canvas',
          position: [0.35, 1.9, -L / 2 + 0.05],
          rotation: [0, 0, 0],
          style: style,
          cost: 170
        });

        // Textured Chunky Wool Rug
        items.push({
          id: 'rug_1',
          type: 'rug',
          name: 'Chunky Wool Hygge Rug',
          position: [0.35, 0, bedZ + 0.4],
          rotation: [0, 0, 0],
          style: style,
          dimensions: [2.6, 2.0],
          cost: 290
        });

        // Open Library Bookshelf along left wall
        items.push({
          id: 'bookshelf_1',
          type: 'bookshelf',
          name: 'Nordic Open Library Shelf',
          position: [-W / 2 + 0.35, 0, -0.6],
          rotation: [0, Math.PI / 2, 0],
          style: style,
          cost: 420
        });

        // Cozy Reading Armchair
        items.push({
          id: 'chair_1',
          type: 'armchair',
          name: 'Hygge Reading Armchair',
          position: [-W / 2 + 1.15, 0, 0.85],
          rotation: [0, Math.PI / 4, 0],
          style: style,
          color: palette.accentColor,
          cost: 460
        });

        // Round Timber Reading Table
        items.push({
          id: 'table_1',
          type: 'coffee_table',
          name: 'Round Oak Reading Table',
          position: [-W / 2 + 1.75, 0, 0.5],
          rotation: [0, 0, 0],
          style: style,
          color: palette.woodColor,
          cost: 210
        });

        // Directional Reading Floor Lamp
        items.push({
          id: 'lamp_1',
          type: 'floor_lamp',
          name: 'Nordic Timber Reading Lamp',
          position: [-W / 2 + 0.55, 0, 1.55],
          rotation: [0, 0, 0],
          style: style,
          cost: 190
        });

        // Mirrored Wardrobe along right wall
        items.push({
          id: 'wardrobe_1',
          type: 'mirrored_wardrobe',
          name: 'Ash Mirrored Double Wardrobe',
          position: [W / 2 - 0.36, 0, 0.4],
          rotation: [0, -Math.PI / 2, 0],
          style: style,
          cost: 980
        });

        // Potted Monstera Plant
        items.push({
          id: 'plant_1',
          type: 'plant',
          name: 'Lush Monstera Deliciosa',
          position: [W / 2 - 0.6, 0, -L / 2 + 0.7],
          rotation: [0, 0, 0],
          style: style,
          cost: 85
        });

        // Woven Timber Pendant Lamp
        items.push({
          id: 'pendant_1',
          type: 'pendant_light',
          name: 'Woven Timber Pendant Light',
          position: [0.35, 0, bedZ + 0.4],
          rotation: [0, 0, 0],
          style: style,
          cost: 180
        });
      }
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
          name: 'Earthy Terracotta & Walnut',
          wallColor: 0xf7f1e5,
          wallColorHex: '#f7f1e5',
          accentColor: 0xb85d43,
          accentColorHex: '#b85d43',
          sofaColor: 0x5a3825,
          sofaColorHex: '#5a3825',
          woodColor: 0x3e2723,
          woodColorHex: '#3e2723'
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
    const typeTitle = pref.roomType === 'bedroom_zen' ? 'Minimalist Zen Retreat Master Bedroom'
      : pref.roomType === 'bedroom_hotel' ? 'Modern Hotel Chic & Vanity Master Bedroom'
      : pref.roomType === 'bedroom_scandi' ? 'Scandinavian Cozy Haven Master Bedroom'
      : pref.roomType.startsWith('bedroom') ? 'Luxury Executive Master Bedroom Suite'
      : pref.roomType === 'living_room_zen' ? 'Minimalist Japandi Zen Living Room'
      : pref.roomType === 'living_room_luxury' ? 'Modern Luxury Penthouse Living Salon'
      : pref.roomType === 'living_room_cozy' ? 'Scandinavian Hygge Family Living Room'
      : pref.roomType.startsWith('living_room') ? 'Contemporary Media & Conversation Living Room'
      : pref.roomType.replace('_', ' ');

    const prompt = `You are a world-class AI interior architect. Generate an interior design plan for a ${typeTitle} with dimensions ${pref.dimensions.width}m width by ${pref.dimensions.length}m length by ${pref.dimensions.height}m height.
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
