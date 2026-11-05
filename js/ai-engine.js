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

    if (roomType === 'complete_house' || roomType === 'complete_house_2bhk' || roomType === 'villa_2bhk' || roomType === 'modern_apartment' || roomType === 'apartment' || roomType === 'whole_house' || roomType === 'house') {
      const isVilla = (roomType === 'villa_2bhk' || pref.houseType === 'villa_2bhk' || pref.houseType === 'villa');
      const is2BHK = (roomType === 'complete_house_2bhk' || pref.houseType === '2bhk' || isVilla);
      const isApartment = (roomType === 'modern_apartment' || roomType === 'apartment' || pref.houseType === 'apartment' || pref.houseType === 'modern_apartment');
      if (isVilla) {
        concept = `CONTEMPORARY LUXURY VILLA (2 BHK ESTATE ${style.toUpperCase()})`;
        spatialRationale = `A master-crafted 16m × 18.5m contemporary villa estate with perimeter boundary garden, front driveway & porch, entrance foyer with pivot door & console, sunken living lounge with cognac leather sectional & Missouri TV unit, open dining area, U-shaped modular kitchen, terracotta second bedroom suite with twin beds & vanity dressing lounge, walk-in closet, common & master en-suite designer bathrooms, and private backyard garden.`;
        lightingPlan = `Harmonious multi-zone architectural illumination: layered warm LED cove lighting in the living lounge, statement linear brass chandelier above dining, under-cabinet task strips in kitchen, illuminated LED mirrors in bathrooms, and independent dimmable bedside luminaires in both bedrooms.`;
      } else if (isApartment) {
        concept = `MODERN APARTMENT SUITE (REAL-TIME FLOW ${style.toUpperCase()})`;
        spatialRationale = `A full modern apartment floor plan engineered with real-time room flow. An open-concept living room transitions fluidly to a central dining area and a streamlined single-wall straight modular kitchen mounted flush along the right wall. The private master bedroom suite is peacefully situated in the rear wing. Continuous light porcelain floor tiles run throughout the open living, dining, and kitchen zones, transitioning via a satin brass threshold to rich herringbone wood flooring in the master suite.`;
        lightingPlan = `Warm 3000K interior illumination with natural morning daylight. Warm 3000K LED under-cabinet kitchen task lighting, overhead linear brass dining chandelier, recessed living cove glows, and natural morning sunlight streaming through wide balcony glazing with soft morning shadows.`;
      } else if (is2BHK) {
        concept = `COMPLETE DOUBLE BEDROOM RESIDENCE (2 BHK ${style.toUpperCase()})`;
        spatialRationale = `A unified, continuous 14m × 11.5m 2-Bedroom residential floor plan with fully connected living, dining, kitchen, and two dedicated bedroom suites. The front wing houses the great-room living lounge with Missouri TV entertainment center, interconnected dining pavilion, and modular kitchen. The rear wing features the Master Bedroom Suite (Bedroom 1) and a fully appointed Second Bedroom (Bedroom 2 / Double Bed & Dressing Suite) with private hallway access.`;
        lightingPlan = `Harmonious multi-zone architectural illumination: layered warm LED cove lighting in the living lounge, statement linear brass chandelier above dining, under-cabinet task strips in kitchen, and independent dimmable bedside luminaires and split ACs in both Master Bedroom 1 and Bedroom 2.`;
      } else {
        concept = `COMPLETE SINGLE BEDROOM RESIDENCE (1 BHK ${style.toUpperCase()})`;
        spatialRationale = `A unified, continuous 14m × 11.5m complete home layout where all rooms are situated seamlessly adjacent to each other with shared architectural walls, open archways, and connecting corridors. The sunlit front wing combines an expansive Living Lounge with Missouri TV Entertainment Center, an interconnected Formal Dining Pavilion, and an Open-Concept Modular Kitchen. The private rear wing features a secluded Master Bedroom Suite and a Master Dressing & En-Suite Luxury Suite.`;
        lightingPlan = `Harmonious multi-zone architectural illumination: layered warm LED cove lighting in the living lounge, statement linear brass chandelier above dining, under-cabinet task strips and pendant glow in kitchen, dimmable bedside luminaires in master bedroom, and flattering vanity mirror glow in master dressing en-suite.`;
      }

      const livingType = pref.livingRoomType || 1;
      const diningType = pref.diningType || 1;
      const kitchenType = pref.kitchenType || 1;
      const bedType = pref.bedroomType || 1;

      // ==========================================
      // ZONE 1: LIVING ROOM (X: -7.0 to -1.0, Z: 0.5 to 6.0)
      // ==========================================
      // 1. Missouri TV Entertainment Center (North dividing wall, facing South)
      items.push({
        id: 'house_living_tv_unit',
        type: 'missouri_tv_unit',
        name: 'Missouri Engineered Wood TV Unit',
        position: [-4.5, 0, 0.85],
        rotation: [0, 0, 0],
        style: style,
        design: livingType,
        room: 'living',
        cost: 1350
      });

      // 2. Main 3-Seater Living Room Sofa (facing North toward TV)
      items.push({
        id: 'house_living_sofa',
        type: 'sofa',
        name: 'Plush Ergonomic Living Lounge Sofa',
        position: [-4.5, 0, 4.0],
        rotation: [0, Math.PI, 0],
        style: style,
        color: palette.sofaColor,
        room: 'living',
        cost: 1400
      });

      // 3. Central Coffee Table
      items.push({
        id: 'house_living_coffee_table',
        type: 'coffee_table',
        name: 'Architectural Wood & Glass Coffee Table',
        position: [-4.5, 0, 2.5],
        rotation: [0, 0, 0],
        style: style,
        woodColor: palette.woodColor,
        room: 'living',
        cost: 420
      });

      // 4. Accent Armchair (Angled inward for social conversation)
      items.push({
        id: 'house_living_armchair',
        type: 'armchair',
        name: 'Designer Lounge Accent Chair',
        position: [-2.4, 0, 3.2],
        rotation: [0, -Math.PI / 2 - 0.35, 0],
        style: style,
        color: palette.accentColor,
        room: 'living',
        cost: 580
      });

      // 5. Living Room Area Rug
      items.push({
        id: 'house_living_rug',
        type: 'rug',
        name: 'Living Room Plush Wool Rug',
        position: [-4.3, 0.005, 3.1],
        rotation: [0, 0, 0],
        dimensions: [3.2, 2.4],
        style: style,
        room: 'living',
        cost: 380
      });

      // 6. Arc Floor Lamp
      items.push({
        id: 'house_living_lamp',
        type: 'floor_lamp',
        name: 'Sculptural Brass Arc Floor Lamp',
        position: [-6.4, 0, 4.8],
        rotation: [0, 0, 0],
        style: style,
        room: 'living',
        cost: 290
      });

      // 7. Indoor Fiddle Leaf Fig Plant
      items.push({
        id: 'house_living_plant',
        type: 'plant',
        name: 'Fiddle Leaf Fig Ceramic Planter',
        position: [-6.4, 0, 1.0],
        rotation: [0, 0, 0],
        room: 'living',
        cost: 140
      });

      // 8. Gallery Wall Canvas (West exterior wall)
      items.push({
        id: 'house_living_art',
        type: 'wall_art',
        name: 'Curated Gallery Wall Art',
        position: [-6.94, 1.8, 3.8],
        rotation: [0, Math.PI / 2, 0],
        dimensions: [1.6, 1.0],
        style: style,
        room: 'living',
        cost: 320
      });

      // 9. Ceiling Fan
      items.push({
        id: 'house_living_fan',
        type: 'ceiling_fan',
        name: 'Aero Minimalist Ceiling Fan',
        position: [-4.5, 2.75, 3.25],
        rotation: [0, 0, 0],
        room: 'living',
        cost: 280
      });

      // ==========================================
      // ZONE 2: DINING ROOM (X: -1.0 to 3.0, Z: 0.5 to 6.0)
      // ==========================================
      // 10. Dining Table & 6 Designer Chairs
      items.push({
        id: 'house_dining_set',
        type: 'dining_set',
        name: 'Solid Hardwood Dining Table & 6 Chairs',
        position: [1.0, 0, 3.25],
        rotation: [0, 0, 0],
        style: style,
        woodColor: palette.woodColor,
        room: 'dining',
        cost: 1850
      });

      // 11. Overhead Linear Brass Chandelier
      items.push({
        id: 'house_dining_pendant',
        type: 'pendant_light',
        name: 'Linear Brass Dining Chandelier',
        position: [1.0, 2.7, 3.25],
        rotation: [0, 0, 0],
        style: style,
        room: 'dining',
        cost: 450
      });

      // 12. Buffet Sideboard / Credenza (Against North wall)
      items.push({
        id: 'house_dining_credenza',
        type: 'credenza',
        name: 'Buffet Sideboard & Serving Credenza',
        position: [1.0, 0, 0.85],
        rotation: [0, 0, 0],
        style: style,
        woodColor: palette.woodColor,
        room: 'dining',
        cost: 720
      });

      // 13. Dining Room Rug
      items.push({
        id: 'house_dining_rug',
        type: 'rug',
        name: 'Dining Area Low-Pile Rug',
        position: [1.0, 0.005, 3.25],
        rotation: [0, 0, 0],
        dimensions: [2.8, 2.2],
        style: style,
        room: 'dining',
        cost: 310
      });

      // 14. Minimalist Wall Clock
      items.push({
        id: 'house_dining_clock',
        type: 'wall_clock',
        name: 'Architectural Minimalist Wall Clock',
        position: [1.0, 2.2, 0.58],
        rotation: [0, 0, 0],
        room: 'dining',
        cost: 110
      });

      // ==========================================
      // ZONE 3: MODULAR KITCHEN (X: 3.0 to 7.0, Z: 0.5 to 6.0)
      // ==========================================
      if (isApartment) {
        // SINGLE-WALL STRAIGHT MODULAR KITCHEN ON THE RIGHT WALL (EAST WALL, X: 6.65)
        // Leaving the center completely open for seamless real-time room flow to dining and living space!
        items.push({
          id: 'house_kitchen_straight',
          type: 'straight_kitchen',
          name: 'Single-Wall Straight Modular Kitchen (Right Wall Run)',
          position: [6.62, 0, 3.4],
          rotation: [0, -Math.PI / 2, 0],
          style: style,
          color: palette.kitchenColor || 0x2c3e50,
          room: 'kitchen',
          cost: 4200
        });

        // Stainless Steel French-Door Refrigerator (Flushed into Corner of Right Wall)
        items.push({
          id: 'house_kitchen_fridge',
          type: 'refrigerator',
          name: 'Stainless Steel French-Door Refrigerator',
          position: [6.52, 0, 0.95],
          rotation: [0, -Math.PI / 2, 0],
          room: 'kitchen',
          cost: 1600
        });

        // Artisan Espresso Coffee Machine
        items.push({
          id: 'house_kitchen_coffee',
          type: 'coffee_machine',
          name: 'Artisan Espresso Coffee Machine',
          position: [6.58, 0.92, 4.8],
          rotation: [0, -Math.PI / 2, 0],
          room: 'kitchen',
          cost: 350
        });

        // Alkaline Water Purifier
        items.push({
          id: 'house_kitchen_purifier',
          type: 'water_purifier',
          name: 'RO UV Alkaline Water Purifier',
          position: [6.88, 1.5, 2.2],
          rotation: [0, -Math.PI / 2, 0],
          room: 'kitchen',
          cost: 290
        });

        // Stainless Step Pedal Trash Bin
        items.push({
          id: 'house_kitchen_trash',
          type: 'trash_bin',
          name: 'Stainless Step Trash Bin',
          position: [6.6, 0, 5.5],
          rotation: [0, 0, 0],
          room: 'kitchen',
          cost: 95
        });
      } else {
        // 15. Modular Kitchen Cabinets with Dual Sink (North wall)
        items.push({
          id: 'house_kitchen_cabinets',
          type: 'kitchen_cabinets',
          name: 'Modular Shaker Cabinets with Double Sink',
          position: [5.0, 0, 0.95],
          rotation: [0, 0, 0],
          style: style,
          color: palette.kitchenColor || 0x2c3e50,
          room: 'kitchen',
          cost: 2600
        });

        // 16. Quartz Waterfall Prep Island with Breakfast Bar
        items.push({
          id: 'house_kitchen_island',
          type: 'kitchen_island',
          name: 'Quartz Waterfall Prep Island & Breakfast Bar',
          position: [4.8, 0, 3.25],
          rotation: [0, 0, 0],
          style: style,
          color: palette.kitchenIslandColor || 0x334155,
          room: 'kitchen',
          cost: 1450
        });

        // 17. Bar Stool 1
        items.push({
          id: 'house_kitchen_stool_1',
          type: 'bar_stool',
          name: 'Designer Swivel Bar Stool #1',
          position: [3.9, 0, 2.9],
          rotation: [0, -Math.PI / 2, 0],
          style: style,
          color: palette.accentColor,
          room: 'kitchen',
          cost: 180
        });

        // 18. Bar Stool 2
        items.push({
          id: 'house_kitchen_stool_2',
          type: 'bar_stool',
          name: 'Designer Swivel Bar Stool #2',
          position: [3.9, 0, 3.6],
          rotation: [0, -Math.PI / 2, 0],
          style: style,
          color: palette.accentColor,
          room: 'kitchen',
          cost: 180
        });

        // 19. French Door Refrigerator
        items.push({
          id: 'house_kitchen_fridge',
          type: 'refrigerator',
          name: 'Stainless Steel French-Door Refrigerator',
          position: [6.4, 0, 1.05],
          rotation: [0, 0, 0],
          room: 'kitchen',
          cost: 1600
        });

        // 20. Induction Range & Vent Hood (East wall)
        items.push({
          id: 'house_kitchen_range',
          type: 'kitchen_range',
          name: 'Induction Cooktop Range with Ducted Hood',
          position: [6.6, 0, 3.25],
          rotation: [0, -Math.PI / 2, 0],
          room: 'kitchen',
          cost: 1250
        });

        // 21. Espresso Coffee Machine
        items.push({
          id: 'house_kitchen_coffee',
          type: 'coffee_machine',
          name: 'Artisan Espresso Coffee Machine',
          position: [3.5, 0.92, 0.95],
          rotation: [0, 0, 0],
          room: 'kitchen',
          cost: 350
        });

        // 22. Alkaline Water Purifier
        items.push({
          id: 'house_kitchen_purifier',
          type: 'water_purifier',
          name: 'RO UV Alkaline Water Purifier',
          position: [6.35, 1.5, 2.1],
          rotation: [0, 0, 0],
          room: 'kitchen',
          cost: 290
        });

        // 23. Pedal Trash Bin
        items.push({
          id: 'house_kitchen_trash',
          type: 'trash_bin',
          name: 'Stainless Step Trash Bin',
          position: [6.6, 0, 5.4],
          rotation: [0, 0, 0],
          room: 'kitchen',
          cost: 95
        });
      }

      // ==========================================
      // ZONE 4: MASTER BEDROOM (X: -7.0 to -0.5, Z: -5.5 to 0.5)
      // ==========================================
      // 24. King Size Platform Bed (North headboard wall, facing South)
      items.push({
        id: 'house_bed_king',
        type: 'bed',
        name: 'King Size Designer Platform Bed',
        position: [-3.75, 0, -4.3],
        rotation: [0, 0, 0],
        style: style,
        color: palette.woodColor,
        room: 'bedroom',
        cost: 1750
      });

      // 25. Nightstand Left
      items.push({
        id: 'house_bed_nightstand_l',
        type: 'nightstand',
        name: 'Bedside Nightstand (Left)',
        position: [-5.3, 0, -4.9],
        rotation: [0, 0, 0],
        style: style,
        room: 'bedroom',
        cost: 240
      });

      // 26. Nightstand Right
      items.push({
        id: 'house_bed_nightstand_r',
        type: 'nightstand',
        name: 'Bedside Nightstand (Right)',
        position: [-2.2, 0, -4.9],
        rotation: [0, 0, 0],
        style: style,
        room: 'bedroom',
        cost: 240
      });

      // 27. Table Lamp Left
      items.push({
        id: 'house_bed_lamp_l',
        type: 'table_lamp',
        name: 'Bedside Table Lamp (Left)',
        position: [-5.3, 0.58, -4.9],
        rotation: [0, 0, 0],
        color: palette.accentColor,
        room: 'bedroom',
        cost: 110
      });

      // 28. Table Lamp Right
      items.push({
        id: 'house_bed_lamp_r',
        type: 'table_lamp',
        name: 'Bedside Table Lamp (Right)',
        position: [-2.2, 0.58, -4.9],
        rotation: [0, 0, 0],
        color: palette.accentColor,
        room: 'bedroom',
        cost: 110
      });

      // 29. 3-Door Master Wardrobe (East acoustic wall)
      items.push({
        id: 'house_bed_wardrobe',
        type: 'wardrobe',
        name: 'Full-Height 3-Door Master Wardrobe',
        position: [-0.9, 0, -2.4],
        rotation: [0, -Math.PI / 2, 0],
        style: style,
        color: palette.wardrobeColor || 0x2b2d42,
        room: 'bedroom',
        cost: 1550
      });

      // 30. Plush Bedroom Area Rug
      items.push({
        id: 'house_bed_rug',
        type: 'rug',
        name: 'Plush High-Pile Bedroom Rug',
        position: [-3.75, 0.005, -3.0],
        rotation: [0, 0, 0],
        dimensions: [3.2, 2.2],
        style: style,
        room: 'bedroom',
        cost: 360
      });

      // 31. Lounge Armchair in Bedroom
      items.push({
        id: 'house_bed_lounge',
        type: 'armchair',
        name: 'Velvet Bedroom Relaxation Armchair',
        position: [-6.2, 0, -2.0],
        rotation: [0, 0.8, 0],
        style: style,
        color: palette.sofaColor,
        room: 'bedroom',
        cost: 520
      });

      // 32. Full-Length Dressing Mirror
      items.push({
        id: 'house_bed_mirror',
        type: 'floor_mirror',
        name: 'Full-Length Dressing Mirror',
        position: [-6.5, 0, -0.6],
        rotation: [0, 0.5, 0],
        style: style,
        room: 'bedroom',
        cost: 280
      });

      // 33. Inverter Split AC
      items.push({
        id: 'house_bed_ac',
        type: 'air_conditioner',
        name: 'Inverter Split AC Unit',
        position: [-3.75, 2.4, -5.44],
        rotation: [0, 0, 0],
        room: 'bedroom',
        cost: 650
      });

      if (is2BHK) {
        // ==========================================
        // ZONE 5: BEDROOM 2 / DOUBLE BED SUITE (X: -0.5 to 7.0, Z: -5.5 to 0.5)
        // ==========================================
        // 34. Double / Queen Platform Bed (North wall facing South)
        items.push({
          id: 'house_bed2_double',
          type: 'bed',
          name: 'Double / Queen Guest & Family Bed',
          position: [3.25, 0, -4.3],
          rotation: [0, 0, 0],
          style: style,
          color: palette.woodColor,
          room: 'bedroom2',
          cost: 1350
        });

        // 35. Bedside Nightstand Left
        items.push({
          id: 'house_bed2_nightstand_l',
          type: 'nightstand',
          name: 'Bedside Nightstand (Left)',
          position: [1.8, 0, -4.9],
          rotation: [0, 0, 0],
          style: style,
          room: 'bedroom2',
          cost: 210
        });

        // 36. Bedside Nightstand Right
        items.push({
          id: 'house_bed2_nightstand_r',
          type: 'nightstand',
          name: 'Bedside Nightstand (Right)',
          position: [4.7, 0, -4.9],
          rotation: [0, 0, 0],
          style: style,
          room: 'bedroom2',
          cost: 210
        });

        // 37. Bedside Table Lamp Left
        items.push({
          id: 'house_bed2_lamp_l',
          type: 'table_lamp',
          name: 'Bedside Reading Lamp (Left)',
          position: [1.8, 0.58, -4.9],
          rotation: [0, 0, 0],
          color: palette.accentColor,
          room: 'bedroom2',
          cost: 110
        });

        // 38. Bedside Table Lamp Right
        items.push({
          id: 'house_bed2_lamp_r',
          type: 'table_lamp',
          name: 'Bedside Reading Lamp (Right)',
          position: [4.7, 0.58, -4.9],
          rotation: [0, 0, 0],
          color: palette.accentColor,
          room: 'bedroom2',
          cost: 110
        });

        // 39. Full 2-Door Wardrobe (East wall)
        items.push({
          id: 'house_bed2_wardrobe',
          type: 'wardrobe',
          name: 'Double Bedroom 2-Door Wardrobe',
          position: [6.4, 0, -2.5],
          rotation: [0, -Math.PI / 2, 0],
          style: style,
          color: palette.wardrobeColor || 0x2b2d42,
          room: 'bedroom2',
          cost: 1200
        });

        // 40. Bedroom Vanity Dressing Console (West acoustic wall)
        items.push({
          id: 'house_bed2_vanity',
          type: 'credenza',
          name: 'Bedroom Dressing Vanity Console',
          position: [0.4, 0, -2.5],
          rotation: [0, Math.PI / 2, 0],
          style: style,
          room: 'bedroom2',
          cost: 650
        });

        // 41. Velvet Accent Vanity Chair
        items.push({
          id: 'house_bed2_chair',
          type: 'armchair',
          name: 'Velvet Bedroom Vanity Lounge Chair',
          position: [1.1, 0, -2.5],
          rotation: [0, -Math.PI / 2, 0],
          room: 'bedroom2',
          cost: 380
        });

        // 42. Bedroom 2 Area Rug
        items.push({
          id: 'house_bed2_rug',
          type: 'rug',
          name: 'Bedroom 2 Plush Area Rug',
          position: [3.25, 0.005, -3.0],
          rotation: [0, 0, 0],
          dimensions: [3.0, 2.2],
          style: style,
          room: 'bedroom2',
          cost: 320
        });

        // 43. Bedroom 2 Wall Art (North wall)
        items.push({
          id: 'house_bed2_art',
          type: 'wall_art',
          name: 'Curated Bedroom Gallery Art',
          position: [0.8, 1.8, -5.44],
          rotation: [0, 0, 0],
          dimensions: [1.4, 0.9],
          style: style,
          room: 'bedroom2',
          cost: 260
        });

        // 44. Bedroom 2 Inverter Split AC
        items.push({
          id: 'house_bed2_ac',
          type: 'air_conditioner',
          name: 'Bedroom 2 Inverter Split AC',
          position: [3.25, 2.4, -5.44],
          rotation: [0, 0, 0],
          room: 'bedroom2',
          cost: 650
        });

        // 45. Twin Single Bed 2 for Second Bedroom
        items.push({
          id: 'house_bed2_twin2',
          type: 'single_bed',
          name: 'Twin Single Bed (Second Bedroom)',
          position: [-4.0, 0, -3.8],
          rotation: [0, Math.PI / 2, 0],
          style: style,
          color: palette.woodColor,
          room: 'bedroom2',
          cost: 850
        });

        if (isVilla) {
          // ==========================================
          // VILLA SUITE EXTENSIONS: FOYER, BATHROOMS & GARDENS
          // ==========================================
          // 46. Entrance Foyer Console & Brass Round Mirror
          items.push({
            id: 'house_foyer_console',
            type: 'foyer_console',
            name: 'Entrance Foyer Console Table & Round Mirror',
            position: [-4.7, 0, 4.9],
            rotation: [0, 0, 0],
            room: 'foyer',
            cost: 420
          });

          // 47. Entrance Foyer Potted Planter
          items.push({
            id: 'house_foyer_plant',
            type: 'plant',
            name: 'Entrance Foyer Potted Fig Tree',
            position: [-3.6, 0, 6.0],
            rotation: [0, 0, 0],
            room: 'foyer',
            cost: 160
          });

          // 48. Common Bathroom 1: Ceramic Toilet
          items.push({
            id: 'house_bath1_toilet',
            type: 'toilet',
            name: 'Common Bathroom Ceramic Toilet',
            position: [-5.6, 0, 1.8],
            rotation: [0, Math.PI / 2, 0],
            room: 'common_bath',
            cost: 280
          });

          // 49. Common Bathroom 1: Glass Shower Cabin
          items.push({
            id: 'house_bath1_shower',
            type: 'shower',
            name: 'Common Bathroom Walk-In Glass Shower',
            position: [-3.8, 0, 1.2],
            rotation: [0, 0, 0],
            room: 'common_bath',
            cost: 650
          });

          // 50. Common Bathroom 1: Floating Vanity & LED Mirror
          items.push({
            id: 'house_bath1_vanity',
            type: 'bathroom_vanity',
            name: 'Common Bathroom Vanity & Mirror',
            position: [-4.7, 0, 3.2],
            rotation: [0, Math.PI, 0],
            room: 'common_bath',
            cost: 480
          });

          // 51. Master Suite Walk-In Wardrobe System
          items.push({
            id: 'house_walk_in_wardrobe',
            type: 'walk_in_wardrobe',
            name: 'Master Suite Walk-In Wardrobe Organizer',
            position: [3.4, 0, -0.5],
            rotation: [0, 0, 0],
            room: 'walk_in_closet',
            cost: 890
          });

          // 52. Master En-Suite Bathroom: Glass Shower Enclosure
          items.push({
            id: 'house_master_shower',
            type: 'shower',
            name: 'Master En-Suite Walk-In Glass Shower',
            position: [5.8, 0, -1.2],
            rotation: [0, -Math.PI / 2, 0],
            room: 'master_bath',
            cost: 650
          });

          // 53. Master En-Suite Bathroom: Ceramic Toilet
          items.push({
            id: 'house_master_toilet',
            type: 'toilet',
            name: 'Master En-Suite Ceramic Toilet',
            position: [4.8, 0, -1.5],
            rotation: [0, 0, 0],
            room: 'master_bath',
            cost: 280
          });

          // 54. Master En-Suite Bathroom: Floating Vanity & Mirror
          items.push({
            id: 'house_master_vanity',
            type: 'bathroom_vanity',
            name: 'Master En-Suite Vanity & Lighted Mirror',
            position: [5.4, 0, 0.6],
            rotation: [0, Math.PI, 0],
            room: 'master_bath',
            cost: 480
          });

          // 55. Backyard Garden Slate Stepping Stones
          items.push({
            id: 'house_garden_stones',
            type: 'stepping_stones',
            name: 'Backyard Garden Slate Pathway Stones',
            position: [4.4, 0, -7.5],
            rotation: [0, 0, 0],
            room: 'backyard',
            cost: 65
          });

          // 56. Backyard Landscaped Garden Bushes
          items.push({
            id: 'house_garden_bush_1',
            type: 'garden_bush',
            name: 'Backyard Flowering Garden Shrub',
            position: [5.8, 0, -8.2],
            rotation: [0, 0, 0],
            room: 'backyard',
            cost: 45
          });

          items.push({
            id: 'house_garden_bush_2',
            type: 'garden_bush',
            name: 'Backyard Flowering Garden Shrub',
            position: [3.0, 0, -8.2],
            rotation: [0, 0, 0],
            room: 'backyard',
            cost: 45
          });

          items.push({
            id: 'house_front_bush',
            type: 'garden_bush',
            name: 'Front Lawn Manicured Hedge Shrub',
            position: [5.5, 0, 8.6],
            rotation: [0, 0, 0],
            room: 'front_lawn',
            cost: 45
          });
        }

      } else {
        // ==========================================
        // ZONE 5: MASTER DRESSING & EN-SUITE BATH SUITE (1BHK / MODERN APARTMENT)
        // ==========================================
        // 34. Custom Floor-to-Ceiling Walk-In Wardrobe Suite (North Wall)
        items.push({
          id: 'house_dressing_wardrobe',
          type: 'walk_in_wardrobe',
          name: 'Bespoke Walk-In Wardrobe System with Smoked Glass Doors',
          position: [3.25, 0, -5.1],
          rotation: [0, 0, 0],
          style: style,
          color: palette.wardrobeColor || 0x1f2937,
          room: 'dressing',
          cost: 2100
        });

        // 35. Vanity Dressing Table & Mirror (West dividing wall)
        items.push({
          id: 'house_dressing_vanity',
          type: 'credenza',
          name: 'Floating Dressing Table with Integrated LED Mirror',
          position: [-0.1, 0, -2.8],
          rotation: [0, Math.PI / 2, 0],
          style: style,
          woodColor: palette.woodColor,
          room: 'dressing',
          cost: 850
        });

        // 36. Bouclé Dressing Lounge Armchair
        items.push({
          id: 'house_dressing_chair',
          type: 'armchair',
          name: 'Bouclé Accent Vanity Lounge Chair',
          position: [0.85, 0, -2.8],
          rotation: [0, -Math.PI / 2, 0],
          style: style,
          color: palette.accentColor,
          room: 'dressing',
          cost: 450
        });

        // 37. Luxury En-Suite Glass Shower Enclosure (East Wall)
        items.push({
          id: 'house_dressing_shower',
          type: 'shower',
          name: 'Frameless Walk-In Glass Rain Shower Enclosure',
          position: [6.1, 0, -4.5],
          rotation: [0, -Math.PI / 2, 0],
          style: style,
          room: 'dressing',
          cost: 1600
        });

        // 38. Modern Bathroom Vanity with Vessel Sink
        items.push({
          id: 'house_dressing_bath_vanity',
          type: 'bathroom_vanity',
          name: 'Designer Double Basin En-Suite Vanity',
          position: [6.1, 0, -2.2],
          rotation: [0, -Math.PI / 2, 0],
          style: style,
          room: 'dressing',
          cost: 1250
        });

        // 39. En-Suite Wall-Hung Toilet
        items.push({
          id: 'house_dressing_toilet',
          type: 'toilet',
          name: 'Concealed Cistern Wall-Hung Toilet',
          position: [6.3, 0, -0.6],
          rotation: [0, -Math.PI / 2, 0],
          room: 'dressing',
          cost: 580
        });

        // 40. Indoor Fiddle Leaf Fig Planter
        items.push({
          id: 'house_dressing_plant',
          type: 'plant',
          name: 'Architectural Fiddle Leaf Fig Ceramic Planter',
          position: [0.4, 0, -0.8],
          rotation: [0, 0, 0],
          room: 'dressing',
          cost: 160
        });

        // 41. Plush Velvet Dressing Runner Rug
        items.push({
          id: 'house_dressing_rug',
          type: 'rug',
          name: 'Plush Silk-Velvet Dressing Suite Rug',
          position: [3.0, 0.005, -2.5],
          rotation: [0, 0, 0],
          dimensions: [2.8, 2.2],
          style: style,
          room: 'dressing',
          cost: 380
        });

        // 42. Minimalist Fashion Gallery Art (South entrance wall)
        items.push({
          id: 'house_dressing_art',
          type: 'wall_art',
          name: 'Curated Haute Couture Gallery Canvas',
          position: [0.8, 1.8, -0.44],
          rotation: [0, Math.PI, 0],
          dimensions: [1.2, 0.8],
          style: style,
          room: 'dressing',
          cost: 310
        });
      }

    } else if (roomType === 'living_room' || roomType.startsWith('living_room_')) {
      // Determine which of the 4 Living Room Design Types is selected
      let livingType = pref.livingRoomType || 1;
      if (roomType === 'living_room_zen' || roomType === 'living_room_type2') livingType = 2;
      else if (roomType === 'living_room_luxury' || roomType === 'living_room_type3') livingType = 3;
      else if (roomType === 'living_room_cozy' || roomType === 'living_room_type4') livingType = 4;
      else if (roomType === 'living_room' && pref.livingRoomType) livingType = parseInt(pref.livingRoomType, 10) || 1;

      if (livingType === 1) {
        // CONTEMPORARY MEDIA & CONVERSATION LOUNGE
        concept = `CONTEMPORARY MEDIA & CONVERSATION LOUNGE (${style.toUpperCase()})`;
        spatialRationale = `Engineered for effortless social hosting and cinematic immersion. The spacious seating zone is anchored by a deep designer sofa and accent armchair angled for face-to-face dialogue, with an expansive Missouri engineered wood TV entertainment unit providing a balanced architectural focal point.`;
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

        // Missouri Engineered Wood TV Entertainment Unit on front wall
        const tvZ = L / 2 - 0.45;
        items.push({
          id: 'tv_1',
          type: 'missouri_tv_unit',
          name: 'Missouri Classic Grand TV Unit',
          position: [0, 0, tvZ],
          rotation: [0, Math.PI, 0],
          style: style,
          design: 1,
          cost: 1450
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
        // MINIMALIST JAPANDI ZEN LOUNGE
        concept = `MINIMALIST JAPANDI ZEN LOUNGE (${style.toUpperCase()})`;
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

        // Missouri Floating Minimalist Fluted TV Console on front wall
        items.push({
          id: 'tv_1',
          type: 'missouri_tv_unit',
          name: 'Missouri Floating Minimalist TV Console',
          position: [0, 0, L / 2 - 0.45],
          rotation: [0, Math.PI, 0],
          style: 'minimalist',
          design: 2,
          cost: 1250
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
        // MODERN LUXURY PENTHOUSE SALON
        concept = `MODERN LUXURY PENTHOUSE SALON (${style.toUpperCase()})`;
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

        // Missouri Luxury Engineered Wood TV Entertainment Center
        items.push({
          id: 'tv_1',
          type: 'missouri_tv_unit',
          name: 'Missouri Luxury Dual-Tower TV Unit',
          position: [0, 0, L / 2 - 0.45],
          rotation: [0, Math.PI, 0],
          style: 'luxury',
          design: 3,
          cost: 1850
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
        // SCANDINAVIAN HYGGE FAMILY LIVING (WITH LIBRARY & LOUNGE NOOK)
        concept = `SCANDINAVIAN HYGGE FAMILY LIVING (${style.toUpperCase()})`;
        spatialRationale = `A versatile, warm family sanctuary that seamlessly combines relaxed communal lounging with an integrated library and credenza storage nook. The corner reading zone invites quiet afternoon reading, while the central sofa cluster provides comfortable movie and game nights.`;
        lightingPlan = `Cozy 2700K hygge illumination: directional reading lamp by the bookshelf nook, warm timber overhead pendant, and ambient sideboard glow.`;

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

        // Missouri Nordic Engineered Wood TV Entertainment Unit
        items.push({
          id: 'tv_1',
          type: 'missouri_tv_unit',
          name: 'Missouri Mid-Century Slatted TV Unit',
          position: [-0.35, 0, L / 2 - 0.45],
          rotation: [0, Math.PI, 0],
          style: style,
          design: 4,
          cost: 1380
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

        // Nordic Sideboard Credenza along right wall
        items.push({
          id: 'credenza_1',
          type: 'credenza',
          name: 'Nordic Lowline Sideboard Credenza',
          position: [W / 2 - 0.75, 0, 0.3],
          rotation: [0, -Math.PI / 2, 0],
          style: style,
          woodColor: palette.woodColor,
          cost: 560
        });

        // Cozy Accent Ottoman
        items.push({
          id: 'ottoman_1',
          type: 'ottoman',
          name: 'Bouclé Scandinavian Footstool Ottoman',
          position: [W / 2 - 1.45, 0, 0.3],
          rotation: [0, 0, 0],
          style: style,
          color: palette.accentColor,
          cost: 240
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
      // Determine which of the Bedroom Design Types is selected
      let bedType = pref.bedroomType || 1;
      if (roomType === 'bedroom_zen' || roomType === 'bedroom_type2') bedType = 2;
      else if (roomType === 'bedroom_hotel' || roomType === 'bedroom_type3') bedType = 3;
      else if (roomType === 'bedroom_scandi' || roomType === 'bedroom_type4') bedType = 4;
      else if (roomType === 'bedroom' && pref.bedroomType) bedType = parseInt(pref.bedroomType, 10) || 1;

      if (roomType === 'bedroom_single') {
        concept = `COZY COMPACT SUITE & SINGLE BED (${style.toUpperCase()})`;
        spatialRationale = `A high-efficiency single bedroom tailored for guests or compact modern living. Anchored by a comfortable single/twin platform bed against the perimeter, a chic vanity dressing table with accent armchair, bedside nightstand with reading lamp, and an integrated wardrobe.`;
        lightingPlan = `Warm flattering illumination at the vanity mirror paired with cozy bedside reading lamp and soft ambient overhead lighting.`;

        // Single Bed against back wall
        items.push({
          id: 'single_bed_1',
          type: 'single_bed',
          name: 'Comfort Single Bed',
          position: [-W / 2 + 1.0, 0, -L / 2 + 1.25],
          rotation: [0, 0, 0],
          style: style,
          cost: 750
        });

        // Nightstand
        items.push({
          id: 'nightstand_1',
          type: 'nightstand',
          name: 'Bedside Nightstand',
          position: [-W / 2 + 2.0, 0, -L / 2 + 0.6],
          rotation: [0, 0, 0],
          style: style,
          cost: 160
        });

        // Table Lamp
        items.push({
          id: 'table_lamp_1',
          type: 'table_lamp',
          name: 'Bedside Reading Lamp',
          position: [-W / 2 + 2.0, 0.58, -L / 2 + 0.6],
          rotation: [0, 0, 0],
          color: palette.accentColor,
          cost: 95
        });

        // Vanity Dressing Table
        items.push({
          id: 'vanity_1',
          type: 'credenza',
          name: 'Compact Dressing Vanity Table',
          position: [W / 2 - 1.2, 0, -L / 2 + 1.0],
          rotation: [0, 0, 0],
          style: style,
          cost: 580
        });

        // Velvet Vanity Accent Chair
        items.push({
          id: 'vanity_chair_1',
          type: 'armchair',
          name: 'Velvet Vanity Lounge Chair',
          position: [W / 2 - 1.2, 0, -L / 2 + 1.7],
          rotation: [0, 0, 0],
          color: palette.accentColor,
          cost: 320
        });

        // Wardrobe
        items.push({
          id: 'wardrobe_1',
          type: 'wardrobe',
          name: 'Compact 2-Door Wardrobe',
          position: [W / 2 - 0.7, 0, L / 2 - 1.2],
          rotation: [0, -Math.PI / 2, 0],
          style: style,
          color: palette.wardrobeColor || 0x2b2d42,
          cost: 850
        });

        // Area Rug
        items.push({
          id: 'rug_1',
          type: 'rug',
          name: 'Cozy Single Bedroom Rug',
          position: [0, 0.005, 0.2],
          rotation: [0, 0, 0],
          dimensions: [2.0, 1.6],
          style: style,
          cost: 180
        });

        // Wall Art
        items.push({
          id: 'art_1',
          type: 'wall_art',
          name: 'Curated Gallery Art Canvas',
          position: [0, 1.8, -L / 2 + 0.06],
          rotation: [0, 0, 0],
          dimensions: [1.2, 0.8],
          style: style,
          cost: 160
        });
      } else if (bedType === 1) {
        // LUXURY EXECUTIVE MASTER SUITE
        // King bed, mirrored double wardrobe, private lounge armchair & side table, brass floor lamp & chandelier
        concept = `LUXURY EXECUTIVE MASTER SUITE (${style.toUpperCase()})`;
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
        // MINIMALIST ZEN RETREAT
        // Low Japandi bed, low storage credenza, paper lantern lamp & orb pendant
        concept = `MINIMALIST ZEN MASTER RETREAT (${style.toUpperCase()})`;
        spatialRationale = `Inspired by Japandi and Wabi-Sabi philosophies, this layout prioritizes uncluttered horizontal horizons and generous floor breathing room. A low-profile platform bed is complemented by a low horizontal storage credenza and sliding wardrobe, creating an organic, grounding sanctuary that calms sensory overload.`;
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
        // MODERN HOTEL CHIC & VANITY
        // Designer bed, work/vanity desk + ergonomic chair, mirrored robe, task lamp
        concept = `MODERN HOTEL CHIC & VANITY SUITE (${style.toUpperCase()})`;
        spatialRationale = `A high-functioning master suite combining premium sleeping comfort with a dedicated grooming vanity and laptop workstation. By placing the bed on the left-center axis and positioning the vanity station along the opposite wall, two functional zones coexist with uninterrupted traffic flow. A full mirrored wardrobe optimizes morning preparation.`;
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

        // Floating Dressing Vanity along right wall
        items.push({
          id: 'vanity_1',
          type: 'credenza',
          name: 'Floating Dressing Vanity Table',
          position: [W / 2 - 0.75, 0, 0.4],
          rotation: [0, -Math.PI / 2, 0],
          style: style,
          woodColor: palette.woodColor,
          cost: 580
        });

        // Velvet Vanity Lounge Chair
        items.push({
          id: 'vanity_chair_1',
          type: 'armchair',
          name: 'Velvet Bouclé Vanity Lounge Chair',
          position: [W / 2 - 1.45, 0, 0.4],
          rotation: [0, Math.PI / 2, 0],
          style: style,
          color: palette.accentColor,
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
        // SCANDINAVIAN COZY HAVEN
        // Solid wood bed, library bookshelf, cozy reading armchair, timber table & reading lamp
        concept = `SCANDINAVIAN COZY MASTER HAVEN (${style.toUpperCase()})`;
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
    } else if (roomType === 'home_office' || roomType.startsWith('home_office_')) {
      // Home office / study room has been removed from platform; fallback cleanly to living room
      return this.generateAlgorithmicDesign({ ...pref, roomType: 'living_room' });
    } else if (roomType === 'dining_room' || roomType.startsWith('dining_room_')) {
      // Determine which of the 4 Dining Room Design Types is selected
      let diningType = pref.diningType || 1;
      if (roomType === 'dining_room_minimal' || roomType === 'dining_room_type2') diningType = 2;
      else if (roomType === 'dining_room_luxury' || roomType === 'dining_room_type3') diningType = 3;
      else if (roomType === 'dining_room_scandi' || roomType === 'dining_room_type4') diningType = 4;
      else if (roomType === 'dining_room' && pref.diningType) diningType = parseInt(pref.diningType, 10) || 1;

      if (diningType === 1) {
        // GRAND BANQUET & ENTERTAINING SUITE
        concept = `GRAND BANQUET & ENTERTAINING SUITE (${style.toUpperCase()})`;
        spatialRationale = `A stately formal dining hall designed around a central 6-seater dining ensemble with a minimum 1.1m pull-out clearance for all guests. The long perimeter buffet sideboard ensures seamless multi-course hospitality, while the opposite open display unit provides an elegant backdrop for glassware and fine ceramics.`;
        lightingPlan = `Warm intimate 2700K overhead illumination cast downward onto the dining surface via an architectural statement chandelier, balanced by subtle perimeter mood lighting from the floor lamp and buffet accent sconces.`;

        // 6-Seater Formal Dining Table in center
        items.push({
          id: 'dining_table_1',
          type: 'dining_table',
          name: 'Grand 6-Seater Banquet Table',
          position: [0, 0, 0],
          rotation: [0, 0, 0],
          style: style,
          color: palette.woodColor,
          cost: 750
        });

        // 6 Individual Symmetrical Dining Chairs
        const banquetChairs = [
          { id: 'chair_1', name: 'Banquet Dining Chair 1', pos: [-0.55, 0, 0.68], rot: Math.PI },
          { id: 'chair_2', name: 'Banquet Dining Chair 2', pos: [0.55, 0, 0.68], rot: Math.PI },
          { id: 'chair_3', name: 'Banquet Dining Chair 3', pos: [-0.55, 0, -0.68], rot: 0 },
          { id: 'chair_4', name: 'Banquet Dining Chair 4', pos: [0.55, 0, -0.68], rot: 0 },
          { id: 'chair_5', name: 'Host Captain Chair (W)', pos: [-1.15, 0, 0], rot: -Math.PI / 2 },
          { id: 'chair_6', name: 'Host Captain Chair (E)', pos: [1.15, 0, 0], rot: Math.PI / 2 }
        ];
        banquetChairs.forEach(c => {
          items.push({
            id: c.id,
            type: 'dining_chair',
            name: c.name,
            position: c.pos,
            rotation: [0, c.rot, 0],
            style: style,
            color: palette.accentColor,
            cost: 160
          });
        });

        // Curated Wall Canvas
        items.push({
          id: 'art_1',
          type: 'wall_art',
          name: 'Curated Banquet Fine Art',
          position: [0, 1.85, -L / 2 + 0.05],
          rotation: [0, 0, 0],
          style: style,
          cost: 190
        });

        // Large Wool Dining Area Rug
        items.push({
          id: 'rug_1',
          type: 'rug',
          name: 'Plush Dining Area Rug',
          position: [0, 0, 0],
          rotation: [0, 0, 0],
          style: style,
          dimensions: [3.0, 2.2],
          cost: 320
        });

        // Architectural Statement Chandelier
        items.push({
          id: 'pendant_1',
          type: 'pendant_light',
          name: 'Grand Banquet Chandelier',
          position: [0, 0, 0],
          rotation: [0, 0, 0],
          style: style,
          cost: 240
        });

        // Long Buffet Credenza / Sideboard along right wall
        items.push({
          id: 'credenza_1',
          type: 'credenza',
          name: 'Hospitality Buffet Sideboard',
          position: [W / 2 - 0.35, 0, 0],
          rotation: [0, -Math.PI / 2, 0],
          style: style,
          color: palette.woodColor,
          cost: 690
        });

        // Open China & Glassware Bookshelf along left wall
        items.push({
          id: 'bookshelf_1',
          type: 'bookshelf',
          name: 'Fine China & Glassware Shelving',
          position: [-W / 2 + 0.35, 0, -0.4],
          rotation: [0, Math.PI / 2, 0],
          style: style,
          cost: 480
        });

        // Sculptural Floor Lamp in corner
        items.push({
          id: 'lamp_1',
          type: 'floor_lamp',
          name: 'Sculptural Brass Floor Lamp',
          position: [W / 2 - 0.7, 0, -L / 2 + 0.7],
          rotation: [0, 0, 0],
          style: style,
          cost: 220
        });

        // Potted Mediterranean Olive Tree
        items.push({
          id: 'plant_1',
          type: 'plant',
          name: 'Potted Mediterranean Olive Tree',
          position: [-W / 2 + 0.7, 0, -L / 2 + 0.7],
          rotation: [0, 0, 0],
          style: style,
          cost: 110
        });

      } else if (diningType === 2) {
        // MINIMALIST ZEN TEA & DINING PAVILION
        concept = `MINIMALIST ZEN TEA & DINING PAVILION (${style.toUpperCase()})`;
        spatialRationale = `Rooted in Wabi-Sabi and Japandi values of simplicity and mindful dining. The central low-profile dining set is anchored by an organic flatweave rug, while flush perimeter credenzas preserve tranquil, unbroken sightlines throughout the dining pavilion.`;
        lightingPlan = `Soft 2500K twilight-diffused illumination: a glowing paper-lantern orb overhead paired with an ambient corner floor lantern, creating a tranquil sanctuary for slow meals and tea ceremonies.`;

        // Clean-lined Minimalist Wood Dining Table
        items.push({
          id: 'dining_table_1',
          type: 'dining_table',
          name: 'Minimalist Japandi Dining Table',
          position: [0, 0, 0],
          rotation: [0, 0, 0],
          style: 'minimalist',
          color: palette.woodColor,
          cost: 620
        });

        // 4 Minimalist Linen Dining Chairs
        const zenChairs = [
          { id: 'chair_1', name: 'Zen Dining Chair 1', pos: [-0.5, 0, 0.65], rot: Math.PI },
          { id: 'chair_2', name: 'Zen Dining Chair 2', pos: [0.5, 0, 0.65], rot: Math.PI },
          { id: 'chair_3', name: 'Zen Dining Chair 3', pos: [-0.5, 0, -0.65], rot: 0 },
          { id: 'chair_4', name: 'Zen Dining Chair 4', pos: [0.5, 0, -0.65], rot: 0 }
        ];
        zenChairs.forEach(c => {
          items.push({
            id: c.id,
            type: 'dining_chair',
            name: c.name,
            position: c.pos,
            rotation: [0, c.rot, 0],
            style: 'minimalist',
            color: palette.accentColor,
            cost: 140
          });
        });

        // Organic Flatweave Jute & Wool Rug
        items.push({
          id: 'rug_1',
          type: 'rug',
          name: 'Organic Jute Flatweave Rug',
          position: [0, 0, 0],
          rotation: [0, 0, 0],
          style: 'minimalist',
          dimensions: [2.7, 2.1],
          cost: 230
        });

        // Low Horizontal Floating Storage Credenza along left wall
        items.push({
          id: 'credenza_1',
          type: 'credenza',
          name: 'Low Horizon Tea Credenza',
          position: [-W / 2 + 0.38, 0, 0],
          rotation: [0, Math.PI / 2, 0],
          style: 'minimalist',
          color: palette.woodColor,
          cost: 580
        });

        // Zen Bauhaus Geometric Canvas Art
        items.push({
          id: 'art_1',
          type: 'wall_art',
          name: 'Zen Bauhaus Dining Canvas',
          position: [0, 1.9, -L / 2 + 0.05],
          rotation: [0, 0, 0],
          style: 'minimalist',
          cost: 160
        });

        // Paper Lantern Floor Lamp
        items.push({
          id: 'lamp_1',
          type: 'floor_lamp',
          name: 'Paper Lantern Floor Lamp',
          position: [-W / 2 + 0.65, 0, -L / 2 + 0.7],
          rotation: [0, 0, 0],
          style: 'minimalist',
          cost: 160
        });

        // Diffused Orb Pendant Light
        items.push({
          id: 'pendant_1',
          type: 'pendant_light',
          name: 'Diffused Orb Dining Pendant',
          position: [0, 0, 0],
          rotation: [0, 0, 0],
          style: 'minimalist',
          cost: 175
        });

        // Potted Zen Bamboo
        items.push({
          id: 'plant_1',
          type: 'plant',
          name: 'Potted Zen Bamboo',
          position: [W / 2 - 0.6, 0, -L / 2 + 0.7],
          rotation: [0, 0, 0],
          style: 'minimalist',
          cost: 85
        });

      } else if (diningType === 3) {
        // MODERN LUXURY PENTHOUSE DINING SALON
        concept = `MODERN LUXURY PENTHOUSE DINING SALON (${style.toUpperCase()})`;
        spatialRationale = `A glamorous penthouse dining salon configured for bespoke culinary experiences and private wine tastings. The dining quadrangle is flanked by a dedicated sommelier buffet credenza and an intimate pre-dinner cocktail lounge nook, creating multiple experiential zones in one harmonious space.`;
        lightingPlan = `Dramatic multi-tiered architectural lighting: a brilliant brass chandelier serves as the dining room's visual centerpiece, supported by warm dimmable accent downlighting and perimeter floor lamps.`;

        // Grand Luxury Dining Table in center
        items.push({
          id: 'dining_table_1',
          type: 'dining_table',
          name: 'Penthouse Marble Dining Table',
          position: [0, 0, 0],
          rotation: [0, 0, 0],
          style: 'luxury',
          color: palette.woodColor,
          cost: 950
        });

        // 6 Velvet Luxury Dining Chairs
        const luxuryChairs = [
          { id: 'chair_1', name: 'Velvet Dining Chair 1', pos: [-0.55, 0, 0.7], rot: Math.PI },
          { id: 'chair_2', name: 'Velvet Dining Chair 2', pos: [0.55, 0, 0.7], rot: Math.PI },
          { id: 'chair_3', name: 'Velvet Dining Chair 3', pos: [-0.55, 0, -0.7], rot: 0 },
          { id: 'chair_4', name: 'Velvet Dining Chair 4', pos: [0.55, 0, -0.7], rot: 0 },
          { id: 'chair_5', name: 'Velvet Host Chair (W)', pos: [-1.2, 0, 0], rot: -Math.PI / 2 },
          { id: 'chair_6', name: 'Velvet Host Chair (E)', pos: [1.2, 0, 0], rot: Math.PI / 2 }
        ];
        luxuryChairs.forEach(c => {
          items.push({
            id: c.id,
            type: 'dining_chair',
            name: c.name,
            position: c.pos,
            rotation: [0, c.rot, 0],
            style: 'luxury',
            color: palette.accentColor,
            cost: 180
          });
        });

        // Extra-large Plush Silk-Wool Dining Rug
        items.push({
          id: 'rug_1',
          type: 'rug',
          name: 'Plush Silk-Wool Dining Rug',
          position: [0, 0, 0],
          rotation: [0, 0, 0],
          style: 'luxury',
          dimensions: [3.2, 2.4],
          cost: 440
        });

        // Grand Brass Ring Chandelier
        items.push({
          id: 'pendant_1',
          type: 'pendant_light',
          name: 'Grand Brass Chandelier',
          position: [0, 0, 0],
          rotation: [0, 0, 0],
          style: 'luxury',
          cost: 340
        });

        // Sommelier Bar Buffet Credenza along right wall
        items.push({
          id: 'credenza_1',
          type: 'credenza',
          name: 'Sommelier Buffet Credenza',
          position: [W / 2 - 0.35, 0, 0],
          rotation: [0, -Math.PI / 2, 0],
          style: 'luxury',
          color: palette.woodColor,
          cost: 760
        });

        // Pre-Dinner Cocktail Lounge Corner: Velvet Club Chair
        items.push({
          id: 'chair_lounge',
          type: 'armchair',
          name: 'Velvet Pre-Dinner Club Chair',
          position: [-W / 2 + 1.15, 0, L / 2 - 1.1],
          rotation: [0, Math.PI / 4, 0],
          style: 'luxury',
          color: palette.accentColor,
          cost: 490
        });

        // Sculptural Side Table next to cocktail chair
        items.push({
          id: 'table_1',
          type: 'coffee_table',
          name: 'Marble Aperitif Side Table',
          position: [-W / 2 + 1.8, 0, L / 2 - 0.8],
          rotation: [0, 0, 0],
          style: 'luxury',
          color: palette.woodColor,
          cost: 260
        });

        // Executive Fine Art Canvas
        items.push({
          id: 'art_1',
          type: 'wall_art',
          name: 'Penthouse Salon Fine Art',
          position: [0, 1.9, -L / 2 + 0.05],
          rotation: [0, 0, 0],
          style: 'luxury',
          cost: 240
        });

        // Sculptural Brass Floor Lamp
        items.push({
          id: 'lamp_1',
          type: 'floor_lamp',
          name: 'Sculptural Brass Floor Lamp',
          position: [W / 2 - 0.7, 0, -L / 2 + 0.7],
          rotation: [0, 0, 0],
          style: 'luxury',
          cost: 250
        });

        // Statement Architectural Palm
        items.push({
          id: 'plant_1',
          type: 'plant',
          name: 'Statement Architectural Palm',
          position: [-W / 2 + 0.65, 0, -L / 2 + 0.7],
          rotation: [0, 0, 0],
          style: 'luxury',
          cost: 115
        });

      } else {
        // SCANDINAVIAN HYGGE FARMHOUSE DINING
        concept = `SCANDINAVIAN HYGGE FARMHOUSE DINING (${style.toUpperCase()})`;
        spatialRationale = `Celebrates Nordic communal dining and authentic hygge hospitality. Combines a solid oak dining table with an open pottery display hutch and perimeter serving sideboard, plus an integrated corner relaxation chair for conversational lingerings long after dessert.`;
        lightingPlan = `Cozy 2700K warm amber lighting: focused downward glow from a woven timber pendant directly over the dining table, accented by soft atmospheric corner illumination.`;

        // Solid Natural Oak Farmhouse Dining Table
        items.push({
          id: 'dining_table_1',
          type: 'dining_table',
          name: 'Solid Oak Farmhouse Dining Table',
          position: [0, 0, 0],
          rotation: [0, 0, 0],
          style: 'traditional',
          color: palette.woodColor,
          cost: 790
        });

        // 6 Warm Timber & Fabric Dining Chairs
        const scandiChairs = [
          { id: 'chair_1', name: 'Oak Farmhouse Chair 1', pos: [-0.55, 0, 0.68], rot: Math.PI },
          { id: 'chair_2', name: 'Oak Farmhouse Chair 2', pos: [0.55, 0, 0.68], rot: Math.PI },
          { id: 'chair_3', name: 'Oak Farmhouse Chair 3', pos: [-0.55, 0, -0.68], rot: 0 },
          { id: 'chair_4', name: 'Oak Farmhouse Chair 4', pos: [0.55, 0, -0.68], rot: 0 },
          { id: 'chair_5', name: 'Oak Farmhouse Host (W)', pos: [-1.15, 0, 0], rot: -Math.PI / 2 },
          { id: 'chair_6', name: 'Oak Farmhouse Host (E)', pos: [1.15, 0, 0], rot: Math.PI / 2 }
        ];
        scandiChairs.forEach(c => {
          items.push({
            id: c.id,
            type: 'dining_chair',
            name: c.name,
            position: c.pos,
            rotation: [0, c.rot, 0],
            style: 'traditional',
            color: palette.accentColor,
            cost: 155
          });
        });

        // Chunky Woven Wool Hygge Rug
        items.push({
          id: 'rug_1',
          type: 'rug',
          name: 'Chunky Wool Hygge Dining Rug',
          position: [0, 0, 0],
          rotation: [0, 0, 0],
          style: 'traditional',
          dimensions: [2.9, 2.2],
          cost: 290
        });

        // Open Nordic Pottery & Dinnerware Bookshelf along back wall
        items.push({
          id: 'bookshelf_1',
          type: 'bookshelf',
          name: 'Nordic Pottery & China Hutch',
          position: [0, 0, -L / 2 + 0.35],
          rotation: [0, 0, 0],
          style: 'traditional',
          cost: 490
        });

        // Warm Oak Serving Credenza along left wall
        items.push({
          id: 'credenza_1',
          type: 'credenza',
          name: 'Nordic Oak Serving Sideboard',
          position: [-W / 2 + 0.35, 0, 0.2],
          rotation: [0, Math.PI / 2, 0],
          style: 'traditional',
          color: palette.woodColor,
          cost: 650
        });

        // Hygge Reading & Relaxation Armchair in front corner
        items.push({
          id: 'chair_lounge',
          type: 'armchair',
          name: 'Hygge Corner Dining Lounge Chair',
          position: [W / 2 - 1.15, 0, L / 2 - 1.1],
          rotation: [0, -Math.PI / 4, 0],
          style: 'traditional',
          color: palette.accentColor,
          cost: 460
        });

        // Botanical Scandinavian Wall Canvas
        items.push({
          id: 'art_1',
          type: 'wall_art',
          name: 'Botanical Scandinavian Canvas',
          position: [W / 2 - 0.05, 1.9, 0.0],
          rotation: [0, -Math.PI / 2, 0],
          style: 'traditional',
          cost: 180
        });

        // Woven Timber Scandinavian Pendant Fixture
        items.push({
          id: 'pendant_1',
          type: 'pendant_light',
          name: 'Woven Timber Dining Pendant',
          position: [0, 0, 0],
          rotation: [0, 0, 0],
          style: 'traditional',
          cost: 195
        });

        // Timber Directional Floor Lamp
        items.push({
          id: 'lamp_1',
          type: 'floor_lamp',
          name: 'Timber Reading Floor Lamp',
          position: [W / 2 - 0.65, 0, -L / 2 + 0.7],
          rotation: [0, 0, 0],
          style: 'traditional',
          cost: 210
        });

        // Lush Monstera Deliciosa
        items.push({
          id: 'plant_1',
          type: 'plant',
          name: 'Lush Monstera Deliciosa',
          position: [-W / 2 + 0.65, 0, -L / 2 + 0.7],
          rotation: [0, 0, 0],
          style: 'traditional',
          cost: 85
        });
      }
    } else {
      // MODULAR KITCHEN (4 ARCHITECTURAL DESIGN TYPES)
      let kitchenType = pref.kitchenType || 1;
      if (roomType === 'kitchen_lshape' || roomType === 'kitchen_type2') kitchenType = 2;
      else if (roomType === 'kitchen_galley' || roomType === 'kitchen_type3') kitchenType = 3;
      else if (roomType === 'kitchen_ushape' || roomType === 'kitchen_type4') kitchenType = 4;
      else if (roomType === 'kitchen' && pref.kitchenType) kitchenType = parseInt(pref.kitchenType, 10) || 1;

      if (kitchenType === 1) {
        // ISLAND CHEF'S GOURMET KITCHEN (OPEN-CONCEPT ISLAND LAYOUT)
        concept = `ISLAND CHEF'S GOURMET KITCHEN (${style.toUpperCase()})`;
        spatialRationale = `Open-concept culinary showcase engineered around a golden work triangle: the smart refrigerator on the perimeter wall, the primary sink along the back wall, and an expansive waterfall island with cooktop facing into the room. 1.1m circulation aisles allow multiple cooks to collaborate smoothly.`;
        lightingPlan = `Bright 4000K daylight-balanced task illumination over prep surfaces with warm 2700K ambient statement pendants above the breakfast bar.`;

        // 1. Main Kitchen Cabinets & Counter with Double Sink & Gooseneck Faucet (back wall)
        items.push({
          id: 'cabinets_1',
          type: 'kitchen_cabinets',
          name: 'Kitchen Counter & Sink',
          position: [-0.4, 0, -L / 2 + 0.35],
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
          name: 'Waterfall Kitchen Island',
          position: [0, 0, 0.45],
          rotation: [0, 0, 0],
          style: style,
          color: palette.woodColor,
          cost: 1450
        });

        // 5. Counter-Height Bar Stools (3 individual moveable stools along island)
        const stoolConfigs = [
          { id: 'stool_1', name: 'Bar Stool 1', pos: [-0.6, 0, 1.05] },
          { id: 'stool_2', name: 'Bar Stool 2', pos: [0, 0, 1.05] },
          { id: 'stool_3', name: 'Bar Stool 3', pos: [0.6, 0, 1.05] }
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

        // 6. Coffee Bar & Pantry Sideboard
        items.push({
          id: 'credenza_1',
          type: 'credenza',
          name: 'Coffee Bar & Pantry Sideboard',
          position: [W / 2 - 0.35, 0, 0.6],
          rotation: [0, -Math.PI / 2, 0],
          style: style,
          color: palette.woodColor,
          cost: 680
        });

        // 7. Statement Pendant Light over Island
        items.push({
          id: 'pendant_1',
          type: 'pendant_light',
          name: 'Island Pendant Fixture',
          position: [0, 0, 0.45],
          rotation: [0, 0, 0],
          style: style,
          cost: 190
        });

        // 8. Culinary Canvas Wall Art
        items.push({
          id: 'art_1',
          type: 'wall_art',
          name: 'Gourmet Culinary Canvas',
          position: [W / 2 - 0.05, 1.85, 0.6],
          rotation: [0, -Math.PI / 2, 0],
          style: style,
          cost: 160
        });

        // 9. Indoor Herb Planter
        items.push({
          id: 'plant_1',
          type: 'plant',
          name: 'Fresh Herb Planter',
          position: [-W / 2 + 0.6, 0, L / 2 - 0.6],
          rotation: [0, 0, 0],
          style: style,
          cost: 65
        });

        // 10. Anti-fatigue Kitchen Runner Rug between counter and island
        items.push({
          id: 'rug_1',
          type: 'rug',
          name: 'Anti-Fatigue Kitchen Runner',
          position: [0, 0, -0.4],
          rotation: [0, 0, 0],
          style: style,
          dimensions: [2.8, 0.75],
          cost: 140
        });

      } else if (kitchenType === 2) {
        // L-SHAPED FAMILY KITCHEN WITH BREAKFAST NOOK
        concept = `L-SHAPED FAMILY KITCHEN & BREAKFAST NOOK (${style.toUpperCase()})`;
        spatialRationale = `Classic architectural L-layout consolidating wet prep and cooking across two perpendicular walls, freeing substantial open floor space for a dedicated family breakfast dining nook for morning meals and tea.`;
        lightingPlan = `Warm 2700K ambient illumination over the breakfast table paired with crisp 3500K LED task glow beneath perimeter wall cabinets.`;

        // 1. Main Kitchen Cabinets & Counter with Sink (back wall, right side)
        items.push({
          id: 'cabinets_1',
          type: 'kitchen_cabinets',
          name: 'Main L-Counter & Sink',
          position: [0.55, 0, -L / 2 + 0.35],
          rotation: [0, 0, 0],
          style: style,
          color: palette.sofaColor,
          cost: 1850
        });

        // 2. Smart Refrigerator (tucked in the corner where the two wings converge)
        items.push({
          id: 'fridge_1',
          type: 'refrigerator',
          name: 'Corner Smart Refrigerator',
          position: [-W / 2 + 0.55, 0, -L / 2 + 0.45],
          rotation: [0, 0, 0],
          style: style,
          cost: 1600
        });

        // 3. Oven Range & Chimney Hood (left wall forming the perpendicular L wing)
        items.push({
          id: 'range_1',
          type: 'kitchen_range',
          name: 'Oven Range & Chimney Hood',
          position: [-W / 2 + 0.35, 0, -L / 2 + 1.65],
          rotation: [0, Math.PI / 2, 0],
          style: style,
          cost: 1200
        });

        // 4. Pantry & Prep Credenza (completing left wall run)
        items.push({
          id: 'credenza_1',
          type: 'credenza',
          name: 'Perimeter Pantry Credenza',
          position: [-W / 2 + 0.35, 0, -L / 2 + 2.75],
          rotation: [0, Math.PI / 2, 0],
          style: style,
          color: palette.woodColor,
          cost: 720
        });

        // 5. Casual Eat-In Breakfast Nook Dining Table (in open right foreground)
        items.push({
          id: 'dining_table_1',
          type: 'dining_table',
          name: 'Family Breakfast Nook Table',
          position: [0.6, 0, 0.7],
          rotation: [0, 0, 0],
          style: style,
          color: palette.woodColor,
          cost: 750
        });

        // 6. 4 Breakfast Dining Chairs
        const breakfastChairs = [
          { id: 'dining_chair_1', name: 'Breakfast Chair 1', pos: [0.6, 0, 0.1], rot: 0 },
          { id: 'dining_chair_2', name: 'Breakfast Chair 2', pos: [0.6, 0, 1.3], rot: Math.PI },
          { id: 'dining_chair_3', name: 'Breakfast Chair 3', pos: [-0.15, 0, 0.7], rot: Math.PI / 2 },
          { id: 'dining_chair_4', name: 'Breakfast Chair 4', pos: [1.35, 0, 0.7], rot: -Math.PI / 2 }
        ];
        breakfastChairs.forEach((c, idx) => {
          items.push({
            id: c.id,
            type: 'dining_chair',
            name: c.name,
            chairIndex: idx + 1,
            position: c.pos,
            rotation: [0, c.rot, 0],
            style: style,
            color: palette.accentColor,
            cost: 140
          });
        });

        // 7. Breakfast Nook Pendant Fixture
        items.push({
          id: 'pendant_1',
          type: 'pendant_light',
          name: 'Breakfast Nook Pendant',
          position: [0.6, 0, 0.7],
          rotation: [0, 0, 0],
          style: style,
          cost: 190
        });

        // 8. L-Wing Anti-Fatigue Kitchen Runner
        items.push({
          id: 'rug_1',
          type: 'rug',
          name: 'Perimeter Kitchen Runner',
          position: [0.55, 0, -L / 2 + 1.1],
          rotation: [0, 0, 0],
          style: style,
          dimensions: [2.4, 0.75],
          cost: 130
        });

        // 9. Botanical Culinary Wall Art
        items.push({
          id: 'art_1',
          type: 'wall_art',
          name: 'Herbal Botanical Print',
          position: [W / 2 - 0.05, 1.85, 0.7],
          rotation: [0, -Math.PI / 2, 0],
          style: style,
          cost: 160
        });

        // 10. Potted Citrus Herb Tree
        items.push({
          id: 'plant_1',
          type: 'plant',
          name: 'Potted Meyer Lemon Tree',
          position: [W / 2 - 0.6, 0, -L / 2 + 0.6],
          rotation: [0, 0, 0],
          style: style,
          cost: 85
        });

      } else if (kitchenType === 3) {
        // PARALLEL GALLEY PROFESSIONAL KITCHEN (DOUBLE-BANK CHEF STUDIO)
        concept = `PARALLEL GALLEY PROFESSIONAL KITCHEN (${style.toUpperCase()})`;
        spatialRationale = `High-efficiency corridor layout favored by Michelin-starred culinary professionals. Two parallel counter banks establish an ergonomic 1.2m runway: the wet prep and refrigeration bank along the back wall directly opposes a dedicated cooking and plating island bank.`;
        lightingPlan = `Linear shadow-free 4500K daylight track pendants illuminating both prep banks simultaneously with warm toe-kick ambiance.`;

        // 1. Wet Bank: Main Counter & Double Sink (back wall)
        items.push({
          id: 'cabinets_1',
          type: 'kitchen_cabinets',
          name: 'Wet Prep Counter & Sink',
          position: [-0.35, 0, -L / 2 + 0.35],
          rotation: [0, 0, 0],
          style: style,
          color: palette.sofaColor,
          cost: 1850
        });

        // 2. Smart French-Door Refrigerator (terminating wet bank on right)
        items.push({
          id: 'fridge_1',
          type: 'refrigerator',
          name: 'Pro Smart Refrigerator',
          position: [W / 2 - 0.55, 0, -L / 2 + 0.45],
          rotation: [0, 0, 0],
          style: style,
          cost: 1600
        });

        // 3. Commercial Oven Range & Hood (back wall left)
        items.push({
          id: 'range_1',
          type: 'kitchen_range',
          name: 'Commercial Induction Range',
          position: [-W / 2 + 0.75, 0, -L / 2 + 0.35],
          rotation: [0, 0, 0],
          style: style,
          cost: 1350
        });

        // 4. Parallel Cooking & Plating Island (opposing bank)
        items.push({
          id: 'island_1',
          type: 'kitchen_island',
          name: 'Parallel Plating & Prep Bank',
          position: [-0.1, 0, 0.2],
          rotation: [0, 0, 0],
          style: style,
          color: palette.woodColor,
          cost: 1450
        });

        // 5. 2 Chef Tasting Bar Stools (on guest side of parallel bank)
        items.push({
          id: 'stool_1',
          type: 'bar_stool',
          name: 'Chef Tasting Stool 1',
          stoolIndex: 1,
          position: [-0.45, 0, 0.82],
          rotation: [0, Math.PI, 0],
          style: style,
          color: palette.accentColor,
          cost: 180
        });
        items.push({
          id: 'stool_2',
          type: 'bar_stool',
          name: 'Chef Tasting Stool 2',
          stoolIndex: 2,
          position: [0.35, 0, 0.82],
          rotation: [0, Math.PI, 0],
          style: style,
          color: palette.accentColor,
          cost: 180
        });

        // 6. Spice & Condiment Credenza (along right wall)
        items.push({
          id: 'credenza_1',
          type: 'credenza',
          name: 'Spice & Condiment Sideboard',
          position: [W / 2 - 0.35, 0, 0.7],
          rotation: [0, -Math.PI / 2, 0],
          style: style,
          color: palette.woodColor,
          cost: 720
        });

        // 7. Open Chef Recipe & Cookware Bookshelf (along left wall)
        items.push({
          id: 'bookshelf_1',
          type: 'bookshelf',
          name: 'Culinary Library Bookshelf',
          position: [-W / 2 + 0.35, 0, 0.7],
          rotation: [0, Math.PI / 2, 0],
          style: style,
          cost: 540
        });

        // 8. Dual Runway Overhead Pendant
        items.push({
          id: 'pendant_1',
          type: 'pendant_light',
          name: 'Linear Runway Pendant',
          position: [-0.1, 0, 0.2],
          rotation: [0, 0, 0],
          style: style,
          cost: 210
        });

        // 9. Central Chef Runway Runner Rug (between the two parallel banks)
        items.push({
          id: 'rug_1',
          type: 'rug',
          name: 'Chef Runway Runner Rug',
          position: [-0.1, 0, -0.45],
          rotation: [0, 0, 0],
          style: style,
          dimensions: [3.2, 0.8],
          cost: 150
        });

        // 10. Potted Culinary Herb Tree
        items.push({
          id: 'plant_1',
          type: 'plant',
          name: 'Potted Sweet Bay Leaf Tree',
          position: [-W / 2 + 0.6, 0, L / 2 - 0.6],
          rotation: [0, 0, 0],
          style: style,
          cost: 75
        });

      } else {
        // U-SHAPED LUXURY PENINSULA KITCHEN (CONTINUOUS WRAP & COCKTAIL BAR)
        concept = `U-SHAPED LUXURY PENINSULA KITCHEN (${style.toUpperCase()})`;
        spatialRationale = `Three-wall continuous culinary envelope delivering maximum contiguous preparation surface. Back wall wet sink connects to the left wall induction range, while a right-wing peninsula island counter projects into the space to create an integrated breakfast bar and evening cocktail lounge.`;
        lightingPlan = `Multi-zone 2800K dimmable pendant trio suspended above the peninsula bar with diffused warm under-cabinet cove LEDs.`;

        // 1. Back Wall: Main Counter & Double Sink
        items.push({
          id: 'cabinets_1',
          type: 'kitchen_cabinets',
          name: 'Back Wall Counter & Sink',
          position: [0.0, 0, -L / 2 + 0.35],
          rotation: [0, 0, 0],
          style: style,
          color: palette.sofaColor,
          cost: 1850
        });

        // 2. Left Wall Flank: Luxury Oven Range & Hood
        items.push({
          id: 'range_1',
          type: 'kitchen_range',
          name: 'Flank Induction Oven Range',
          position: [-W / 2 + 0.35, 0, -L / 2 + 1.45],
          rotation: [0, Math.PI / 2, 0],
          style: style,
          cost: 1250
        });

        // 3. Back-Left Corner: Smart Refrigerator
        items.push({
          id: 'fridge_1',
          type: 'refrigerator',
          name: 'Built-In Smart Refrigerator',
          position: [-W / 2 + 0.55, 0, -L / 2 + 0.45],
          rotation: [0, 0, 0],
          style: style,
          cost: 1600
        });

        // 4. Right Wall Peninsula Island Counter (extending outward into room)
        items.push({
          id: 'island_1',
          type: 'kitchen_island',
          name: 'Peninsula Cocktail Bar Counter',
          position: [W / 2 - 1.05, 0, 0.5],
          rotation: [0, Math.PI, 0],
          style: style,
          color: palette.woodColor,
          cost: 1550
        });

        // 5. 3 Peninsula Cocktail Bar Stools (on guest side)
        const penStoolConfigs = [
          { id: 'stool_1', name: 'Peninsula Stool 1', pos: [W / 2 - 1.6, 0, 1.08] },
          { id: 'stool_2', name: 'Peninsula Stool 2', pos: [W / 2 - 1.05, 0, 1.08] },
          { id: 'stool_3', name: 'Peninsula Stool 3', pos: [W / 2 - 0.5, 0, 1.08] }
        ];
        penStoolConfigs.forEach((s, idx) => {
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

        // 6. Pantry & Wine Service Credenza (along front-left perimeter)
        items.push({
          id: 'credenza_1',
          type: 'credenza',
          name: 'Pantry & Wine Service Credenza',
          position: [-W / 2 + 0.35, 0, 0.95],
          rotation: [0, Math.PI / 2, 0],
          style: style,
          color: palette.woodColor,
          cost: 760
        });

        // 7. Peninsula Trio Pendant Light
        items.push({
          id: 'pendant_1',
          type: 'pendant_light',
          name: 'Peninsula Trio Pendant Light',
          position: [W / 2 - 1.05, 0, 0.5],
          rotation: [0, 0, 0],
          style: style,
          cost: 220
        });

        // 8. U-Wrap Central Floor Runner Rug
        items.push({
          id: 'rug_1',
          type: 'rug',
          name: 'U-Wrap Central Kitchen Rug',
          position: [-0.2, 0, -0.2],
          rotation: [0, 0, 0],
          style: style,
          dimensions: [2.2, 1.4],
          cost: 180
        });

        // 9. Sommelier Canvas Wall Art
        items.push({
          id: 'art_1',
          type: 'wall_art',
          name: 'Sommelier Vintage Wine Print',
          position: [-W / 2 + 0.05, 1.85, 0.95],
          rotation: [0, Math.PI / 2, 0],
          style: style,
          cost: 170
        });

        // 10. Potted Tuscan Olive Tree
        items.push({
          id: 'plant_1',
          type: 'plant',
          name: 'Potted Tuscan Olive Tree',
          position: [W / 2 - 0.6, 0, -L / 2 + 0.6],
          rotation: [0, 0, 0],
          style: style,
          cost: 95
        });
      }
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
      : pref.roomType === 'dining_room_minimal' ? 'Minimalist Zen Tea & Dining Pavilion'
      : pref.roomType === 'dining_room_luxury' ? 'Modern Luxury Penthouse Dining Salon'
      : pref.roomType === 'dining_room_scandi' ? 'Scandinavian Hygge Farmhouse Dining Room'
      : pref.roomType.startsWith('dining_room') ? 'Grand Banquet & Entertaining Dining Suite'
      : pref.roomType === 'kitchen_lshape' ? 'L-Shaped Family Kitchen with Breakfast Nook'
      : pref.roomType === 'kitchen_galley' ? 'Parallel Galley Professional Kitchen Studio'
      : pref.roomType === 'kitchen_ushape' ? 'U-Shaped Luxury Peninsula Kitchen'
      : pref.roomType.startsWith('kitchen') ? "Island Chef's Gourmet Kitchen"
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
