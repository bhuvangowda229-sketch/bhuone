// Procedural 3D Furniture Models using Three.js
// Supports multiple design styles: Modern, Minimalist, Luxury, Traditional

import { TextureGenerator } from './textures.js';

export class FurnitureFactory {
  // Helper: Create a standard PBR mesh
  static createMesh(geom, mat, name = 'Part') {
    const mesh = new THREE.Mesh(geom, mat);
    mesh.name = name;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }

  // 1. SOFA
  static createSofa(style = 'modern', color = 0x3d4451) {
    const group = new THREE.Group();
    group.name = 'Sofa';
    group.userData = { type: 'sofa', name: 'Sofa', cost: 850 };

    const fabricMat = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.85,
      metalness: 0.05
    });

    const woodLegMat = new THREE.MeshStandardMaterial({
      color: style === 'luxury' ? 0xd4af37 : 0x2c1810,
      metalness: style === 'luxury' ? 0.8 : 0.1,
      roughness: style === 'luxury' ? 0.3 : 0.7
    });

    const width = style === 'minimalist' ? 2.0 : 2.4;
    const depth = 0.9;
    const seatHeight = 0.42;

    // Base frame
    const baseGeom = new THREE.BoxGeometry(width, 0.15, depth);
    const base = this.createMesh(baseGeom, fabricMat, 'Base Frame');
    base.position.y = 0.18;
    group.add(base);

    // Seat cushions (2 or 3 segments)
    const cushionCount = style === 'minimalist' ? 2 : 3;
    const cushionW = (width - 0.04) / cushionCount;
    for (let i = 0; i < cushionCount; i++) {
      const cGeom = new THREE.BoxGeometry(cushionW - 0.02, 0.16, depth - 0.15);
      const cushion = this.createMesh(cGeom, fabricMat, `Seat Cushion ${i + 1}`);
      cushion.position.set(-width / 2 + cushionW / 2 + i * cushionW, 0.32, 0.05);
      group.add(cushion);
    }

    // Backrest
    const backH = style === 'luxury' ? 0.65 : 0.55;
    const backGeom = new THREE.BoxGeometry(width, backH, 0.22);
    const back = this.createMesh(backGeom, fabricMat, 'Backrest');
    back.position.set(0, 0.25 + backH / 2, -depth / 2 + 0.11);
    group.add(back);

    // Armrests
    const armW = style === 'minimalist' ? 0.12 : 0.18;
    const armH = 0.45;
    [-1, 1].forEach(side => {
      const armGeom = new THREE.BoxGeometry(armW, armH, depth);
      const arm = this.createMesh(armGeom, fabricMat, side === -1 ? 'Left Armrest' : 'Right Armrest');
      arm.position.set(side * (width / 2 - armW / 2), 0.2 + armH / 2, 0);
      group.add(arm);
    });

    // Legs (4 corners)
    const legRadius = style === 'luxury' ? 0.025 : 0.03;
    const legH = 0.12;
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([xDir, zDir]) => {
      const legGeom = new THREE.CylinderGeometry(legRadius * 0.8, legRadius, legH, 16);
      const leg = this.createMesh(legGeom, woodLegMat, 'Sofa Leg');
      leg.position.set(xDir * (width / 2 - 0.15), legH / 2, zDir * (depth / 2 - 0.15));
      group.add(leg);
    });

    // Throw pillows for luxury / modern
    if (style !== 'minimalist') {
      const pillowMat = new THREE.MeshStandardMaterial({
        color: style === 'luxury' ? 0xc5a059 : 0xd17b49,
        roughness: 0.9
      });
      [-1, 1].forEach(side => {
        const pGeom = new THREE.BoxGeometry(0.35, 0.35, 0.12);
        const pillow = this.createMesh(pGeom, pillowMat, side === -1 ? 'Left Throw Pillow' : 'Right Throw Pillow');
        pillow.position.set(side * (width / 2 - 0.35), 0.52, -depth / 4);
        pillow.rotation.y = side * 0.3;
        pillow.rotation.z = -side * 0.2;
        group.add(pillow);
      });
    }

    return group;
  }

  // 2. COFFEE TABLE
  static createCoffeeTable(style = 'modern', woodColor = 0x8b5a2b) {
    const group = new THREE.Group();
    group.name = 'Coffee Table';
    group.userData = { type: 'coffee_table', name: 'Coffee Table', cost: 280 };

    let topMat;
    if (style === 'minimalist' || style === 'luxury') {
      topMat = new THREE.MeshPhysicalMaterial({
        color: style === 'luxury' ? 0xfbfbfb : 0xe0e7ff,
        transmission: style === 'luxury' ? 0.1 : 0.85,
        opacity: 1,
        transparent: style !== 'luxury',
        roughness: 0.1,
        metalness: 0.1
      });
    } else {
      topMat = new THREE.MeshStandardMaterial({
        color: woodColor,
        roughness: 0.6,
        metalness: 0.1
      });
    }

    const legMat = new THREE.MeshStandardMaterial({
      color: style === 'luxury' ? 0xd4af37 : (style === 'minimalist' ? 0x111827 : 0x3d2817),
      metalness: style === 'luxury' ? 0.85 : 0.3,
      roughness: 0.3
    });

    // Circular or Rectangular based on style
    if (style === 'minimalist' || style === 'luxury') {
      // Round table
      const radius = 0.5;
      const topGeom = new THREE.CylinderGeometry(radius, radius, 0.04, 32);
      const top = this.createMesh(topGeom, topMat, 'Round Table Top');
      top.position.y = 0.42;
      group.add(top);

      // 3 or 4 legs or pedestal
      const legGeom = new THREE.CylinderGeometry(0.02, 0.02, 0.4, 16);
      for (let i = 0; i < 3; i++) {
        const angle = (i * Math.PI * 2) / 3;
        const leg = this.createMesh(legGeom, legMat, `Table Leg ${i + 1}`);
        leg.position.set(Math.cos(angle) * (radius - 0.08), 0.2, Math.sin(angle) * (radius - 0.08));
        group.add(leg);
      }
    } else {
      // Rectangular table
      const width = 1.1;
      const depth = 0.6;
      const topGeom = new THREE.BoxGeometry(width, 0.04, depth);
      const top = this.createMesh(topGeom, topMat, 'Table Top');
      top.position.y = 0.42;
      group.add(top);

      // Legs
      [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([xDir, zDir], idx) => {
        const legGeom = new THREE.CylinderGeometry(0.025, 0.02, 0.4, 16);
        const leg = this.createMesh(legGeom, legMat, `Table Leg ${idx + 1}`);
        leg.position.set(xDir * (width / 2 - 0.06), 0.2, zDir * (depth / 2 - 0.06));
        group.add(leg);
      });
    }

    // Decor on top (decorative bowl / book)
    const bookGeom = new THREE.BoxGeometry(0.22, 0.03, 0.16);
    const bookMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.5 });
    const book = this.createMesh(bookGeom, bookMat, 'Tabletop Book');
    book.position.set(0.05, 0.455, -0.05);
    book.rotation.y = 0.2;
    group.add(book);

    return group;
  }

  // 3. TV UNIT & WALL TV
  static createTVUnit(style = 'modern') {
    const group = new THREE.Group();
    group.name = 'TV Console & Screen';
    group.userData = { type: 'tv_unit', name: 'TV Unit & Display', cost: 1100 };

    const cabinetMat = new THREE.MeshStandardMaterial({
      color: style === 'luxury' ? 0x1e293b : (style === 'traditional' ? 0x5c3317 : 0xe2e8f0),
      roughness: 0.4
    });

    const screenMat = new THREE.MeshStandardMaterial({
      color: 0x050505,
      roughness: 0.1,
      metalness: 0.8
    });

    // Console Credenza
    const width = 2.0;
    const depth = 0.45;
    const height = 0.45;
    const credenza = this.createMesh(new THREE.BoxGeometry(width, height, depth), cabinetMat, 'Media Console Cabinet');
    credenza.position.set(0, height / 2, 0);
    group.add(credenza);

    // Accent slats / shelves
    const shelfMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.7, roughness: 0.3 });
    const lineGeom = new THREE.BoxGeometry(width * 0.96, 0.02, depth + 0.01);
    const line = this.createMesh(lineGeom, shelfMat, 'Gold Accent Trim');
    line.position.set(0, height * 0.7, 0);
    group.add(line);

    // TV Screen (55-65 inch mounted or stood)
    const tvW = 1.4;
    const tvH = 0.8;
    const tvGeom = new THREE.BoxGeometry(tvW, tvH, 0.04);
    const tv = this.createMesh(tvGeom, screenMat, 'Flat Screen TV');
    tv.position.set(0, height + 0.55, 0);
    group.add(tv);

    // TV Bezel frame
    const bezelMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, metalness: 0.9, roughness: 0.2 });
    const tvStand = this.createMesh(new THREE.CylinderGeometry(0.04, 0.04, 0.15, 16), bezelMat, 'TV Pedestal Stand');
    tvStand.position.set(0, height + 0.075, 0);
    group.add(tvStand);

    return group;
  }

  // 4. ARMCHAIR
  static createArmchair(style = 'modern', color = 0xd97706) {
    const group = new THREE.Group();
    group.name = 'Armchair';
    group.userData = { type: 'armchair', name: 'Lounge Armchair', cost: 420 };

    const fabricMat = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.8
    });

    const legMat = new THREE.MeshStandardMaterial({
      color: style === 'luxury' ? 0xd4af37 : 0x1f2937,
      metalness: style === 'luxury' ? 0.8 : 0.2,
      roughness: 0.3
    });

    // Seat cushion
    const seat = this.createMesh(new THREE.BoxGeometry(0.75, 0.16, 0.75), fabricMat, 'Lounge Seat Cushion');
    seat.position.y = 0.38;
    group.add(seat);

    // Backrest
    const back = this.createMesh(new THREE.BoxGeometry(0.75, 0.55, 0.15), fabricMat, 'Lounge Backrest');
    back.position.set(0, 0.65, -0.3);
    group.add(back);

    // Side arms
    [-1, 1].forEach(side => {
      const arm = this.createMesh(new THREE.BoxGeometry(0.12, 0.35, 0.75), fabricMat, side === -1 ? 'Left Armrest' : 'Right Armrest');
      arm.position.set(side * 0.38, 0.5, 0);
      group.add(arm);
    });

    // Angled splayed legs
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([xDir, zDir], idx) => {
      const leg = this.createMesh(new THREE.CylinderGeometry(0.02, 0.015, 0.32, 16), legMat, `Armchair Leg ${idx + 1}`);
      leg.position.set(xDir * 0.28, 0.16, zDir * 0.28);
      leg.rotation.z = -xDir * 0.12;
      leg.rotation.x = zDir * 0.12;
      group.add(leg);
    });

    return group;
  }

  // 5. FLOOR LAMP
  static createFloorLamp(style = 'modern') {
    const group = new THREE.Group();
    group.name = 'Floor Lamp';
    group.userData = { type: 'floor_lamp', name: 'Designer Floor Lamp', cost: 195 };

    const poleMat = new THREE.MeshStandardMaterial({
      color: style === 'luxury' ? 0xd4af37 : 0x1f2937,
      metalness: 0.8,
      roughness: 0.3
    });

    const shadeMat = new THREE.MeshStandardMaterial({
      color: 0xfef3c7,
      roughness: 0.5,
      emissive: 0xffedd5,
      emissiveIntensity: 0.4
    });

    // Base
    const base = this.createMesh(new THREE.CylinderGeometry(0.2, 0.22, 0.03, 32), poleMat, 'Lamp Base');
    base.position.y = 0.015;
    group.add(base);

    // Tall pole
    const pole = this.createMesh(new THREE.CylinderGeometry(0.015, 0.015, 1.5, 16), poleMat, 'Lamp Pole Stem');
    pole.position.y = 0.78;
    group.add(pole);

    // Lampshade (cone or cylinder)
    const shade = this.createMesh(new THREE.CylinderGeometry(0.18, 0.25, 0.3, 32, 1, true), shadeMat, 'Lamp Shade');
    shade.position.y = 1.55;
    group.add(shade);

    // Point Light source inside shade
    const lampLight = new THREE.PointLight(0xffecd2, 1.2, 5, 2);
    lampLight.position.set(0, 1.52, 0);
    lampLight.castShadow = true;
    lampLight.shadow.bias = -0.002;
    group.add(lampLight);

    return group;
  }

  // 6. BED (For Bedroom)
  static createBed(style = 'modern', frameColor = 0x2b2d42) {
    const group = new THREE.Group();
    group.name = 'Bed';
    group.userData = { type: 'bed', name: 'King/Queen Platform Bed', cost: 1400 };

    const width = 2.0;
    const length = 2.2;
    const height = 0.35;

    const frameMat = new THREE.MeshStandardMaterial({
      color: frameColor,
      roughness: 0.6
    });

    const mattressMat = new THREE.MeshStandardMaterial({
      color: 0xfafafa,
      roughness: 0.9
    });

    const duvetMat = new THREE.MeshStandardMaterial({
      color: style === 'luxury' ? 0x0f172a : (style === 'minimalist' ? 0xd1d5db : 0x0284c7),
      roughness: 0.85
    });

    // Bed frame base
    const base = this.createMesh(new THREE.BoxGeometry(width, height, length), frameMat, 'Bed Frame Base');
    base.position.y = height / 2;
    group.add(base);

    // Mattress
    const mattress = this.createMesh(new THREE.BoxGeometry(width - 0.1, 0.25, length - 0.1), mattressMat, 'Comfort Mattress');
    mattress.position.set(0, height + 0.125, 0);
    group.add(mattress);

    // Duvet / Bedspread (covers 70% of bed)
    const duvet = this.createMesh(new THREE.BoxGeometry(width - 0.08, 0.27, length * 0.72), duvetMat, 'Duvet Comforter');
    duvet.position.set(0, height + 0.135, length * 0.12);
    group.add(duvet);

    // Headboard
    const headboardH = style === 'luxury' ? 1.2 : 0.85;
    const headboard = this.createMesh(new THREE.BoxGeometry(width + 0.1, headboardH, 0.12), frameMat, 'Upholstered Headboard');
    headboard.position.set(0, headboardH / 2, -length / 2 - 0.06);
    group.add(headboard);

    // Pillows (2 large, 2 accent)
    const pillowMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 });
    [-0.5, 0.5].forEach((x, idx) => {
      const p1 = this.createMesh(new THREE.BoxGeometry(0.65, 0.15, 0.4), pillowMat, idx === 0 ? 'Left Bed Pillow' : 'Right Bed Pillow');
      p1.position.set(x, height + 0.3, -length / 2 + 0.35);
      p1.rotation.x = -0.25;
      group.add(p1);
    });

    return group;
  }

  // 7. NIGHTSTAND
  static createNightstand(style = 'modern') {
    const group = new THREE.Group();
    group.name = 'Nightstand';
    group.userData = { type: 'nightstand', name: 'Bedside Nightstand', cost: 160 };

    const bodyMat = new THREE.MeshStandardMaterial({
      color: style === 'luxury' ? 0x1e293b : 0x475569,
      roughness: 0.5
    });

    const w = 0.5, h = 0.5, d = 0.4;
    const body = this.createMesh(new THREE.BoxGeometry(w, h, d), bodyMat);
    body.position.y = h / 2;
    group.add(body);

    // Small table lamp on top
    const lampStem = this.createMesh(new THREE.CylinderGeometry(0.015, 0.015, 0.25, 16),
      new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.8, roughness: 0.3 }));
    lampStem.position.set(0, h + 0.125, 0);
    group.add(lampStem);

    const shade = this.createMesh(new THREE.CylinderGeometry(0.1, 0.15, 0.18, 24),
      new THREE.MeshStandardMaterial({ color: 0xffedd5, emissive: 0xfef08a, emissiveIntensity: 0.2 }));
    shade.position.set(0, h + 0.28, 0);
    group.add(shade);

    return group;
  }

  // 8. DESK (Home Office)
  static createDesk(style = 'modern') {
    const group = new THREE.Group();
    group.name = 'Office Desk';
    group.userData = { type: 'desk', name: 'Executive Workstation', cost: 580 };

    const topMat = new THREE.MeshStandardMaterial({
      color: style === 'minimalist' ? 0xf8fafc : 0x3e2723,
      roughness: 0.5
    });

    const legMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.7,
      roughness: 0.3
    });

    const w = 1.6, d = 0.8, h = 0.75;
    // Desk top
    const top = this.createMesh(new THREE.BoxGeometry(w, 0.04, d), topMat);
    top.position.y = h;
    group.add(top);

    // Sturdy metallic frame legs
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([xDir, zDir]) => {
      const leg = this.createMesh(new THREE.BoxGeometry(0.05, h, 0.05), legMat);
      leg.position.set(xDir * (w / 2 - 0.08), h / 2, zDir * (d / 2 - 0.08));
      group.add(leg);
    });

    // Computer Monitor
    const monStand = this.createMesh(new THREE.CylinderGeometry(0.02, 0.08, 0.15, 16), legMat);
    monStand.position.set(0, h + 0.075, -0.15);
    group.add(monStand);

    const screenGeom = new THREE.BoxGeometry(0.7, 0.42, 0.03);
    const screenMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2 });
    const screen = this.createMesh(screenGeom, screenMat);
    screen.position.set(0, h + 0.32, -0.15);
    group.add(screen);

    // Keyboard & Mouse
    const kb = this.createMesh(new THREE.BoxGeometry(0.42, 0.015, 0.14),
      new THREE.MeshStandardMaterial({ color: 0x334155 }));
    kb.position.set(0, h + 0.01, 0.12);
    group.add(kb);

    return group;
  }

  // 9. OFFICE CHAIR
  static createOfficeChair() {
    const group = new THREE.Group();
    group.name = 'Ergonomic Chair';
    group.userData = { type: 'office_chair', name: 'Ergonomic Mesh Chair', cost: 320 };

    const meshMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.9, roughness: 0.2 });

    // Seat
    const seat = this.createMesh(new THREE.BoxGeometry(0.5, 0.08, 0.5), meshMat);
    seat.position.y = 0.48;
    group.add(seat);

    // Backrest
    const back = this.createMesh(new THREE.BoxGeometry(0.48, 0.55, 0.06), meshMat);
    back.position.set(0, 0.78, -0.22);
    group.add(back);

    // Stem & Star Base
    const stem = this.createMesh(new THREE.CylinderGeometry(0.03, 0.03, 0.45, 16), chromeMat);
    stem.position.y = 0.24;
    group.add(stem);

    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5;
      const leg = this.createMesh(new THREE.BoxGeometry(0.04, 0.03, 0.28), chromeMat);
      leg.position.set(Math.sin(angle) * 0.14, 0.05, Math.cos(angle) * 0.14);
      leg.rotation.y = angle;
      group.add(leg);
    }

    return group;
  }

  // 10a. INDEPENDENT DINING TABLE
  static createDiningTable(style = 'modern', woodColor = 0x4a3525) {
    const group = new THREE.Group();
    group.name = 'Dining Table';
    group.userData = { type: 'dining_table', name: 'Dining Table', cost: 650, color: woodColor };

    const tableMat = new THREE.MeshStandardMaterial({
      color: style === 'luxury' ? 0xf5f5f4 : woodColor,
      roughness: style === 'luxury' ? 0.2 : 0.6,
      metalness: style === 'luxury' ? 0.1 : 0.0
    });

    const legMat = new THREE.MeshStandardMaterial({
      color: style === 'luxury' ? 0xd4af37 : 0x1f2937,
      metalness: 0.6,
      roughness: 0.3
    });

    // Table Top
    const w = 1.8, d = 0.9, h = 0.76;
    const top = this.createMesh(new THREE.BoxGeometry(w, 0.05, d), tableMat, 'Dining Table Top');
    top.position.y = h;
    group.add(top);

    // Table Legs
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([xDir, zDir], idx) => {
      const leg = this.createMesh(new THREE.CylinderGeometry(0.03, 0.02, h, 16), legMat, `Table Leg ${idx + 1}`);
      leg.position.set(xDir * (w / 2 - 0.1), h / 2, zDir * (d / 2 - 0.1));
      group.add(leg);
    });

    // Centerpiece Bowl
    const bowlMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.7, roughness: 0.3 });
    const bowl = this.createMesh(new THREE.CylinderGeometry(0.14, 0.08, 0.06, 24), bowlMat, 'Centerpiece Bowl');
    bowl.position.set(0, h + 0.03, 0);
    group.add(bowl);

    return group;
  }

  // 10b. INDEPENDENT DINING CHAIR
  static createDiningChair(style = 'modern', color = 0xd97706, chairIndex = 1) {
    const group = new THREE.Group();
    group.name = chairIndex ? `Dining Chair ${chairIndex}` : 'Dining Chair';
    group.userData = { type: 'dining_chair', name: group.name, cost: 150, color: color };

    const chairMat = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.8
    });

    const legMat = new THREE.MeshStandardMaterial({
      color: style === 'luxury' ? 0xd4af37 : 0x1f2937,
      metalness: 0.6,
      roughness: 0.3
    });

    // Seat cushion
    const cSeat = this.createMesh(new THREE.BoxGeometry(0.44, 0.06, 0.44), chairMat, 'Chair Seat Cushion');
    cSeat.position.y = 0.45;
    group.add(cSeat);

    // Ergonomic backrest
    const cBack = this.createMesh(new THREE.BoxGeometry(0.44, 0.42, 0.04), chairMat, 'Chair Backrest');
    cBack.position.set(0, 0.66, -0.2);
    group.add(cBack);

    // 4 Legs
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([lx, lz], idx) => {
      const cLeg = this.createMesh(new THREE.CylinderGeometry(0.015, 0.015, 0.45, 12), legMat, `Chair Leg ${idx + 1}`);
      cLeg.position.set(lx * 0.17, 0.225, lz * 0.17);
      group.add(cLeg);
    });

    return group;
  }

  // 10c. DINING SET (Composite helper)
  static createDiningSet(style = 'modern', woodColor = 0x4a3525) {
    const group = this.createDiningTable(style, woodColor);
    group.name = 'Dining Table';

    // Add 4 individual chair groups inside for standalone compatibility
    const chairX = [-0.55, 0.55];
    let idx = 1;
    chairX.forEach(x => {
      [0.68, -0.68].forEach(z => {
        const chair = this.createDiningChair(style, style === 'luxury' ? 0x1e293b : 0xd97706, idx++);
        chair.position.set(x, 0, z);
        chair.rotation.y = z > 0 ? Math.PI : 0;
        group.add(chair);
      });
    });

    return group;
  }

  // 11. BOOKSHELF / STORAGE
  static createBookshelf(style = 'modern') {
    const group = new THREE.Group();
    group.name = 'Bookshelf';
    group.userData = { type: 'bookshelf', name: 'Open Display Bookshelf', cost: 450 };

    const woodMat = new THREE.MeshStandardMaterial({
      color: style === 'minimalist' ? 0xffffff : 0x3d2817,
      roughness: 0.6
    });

    const w = 1.0, h = 1.8, d = 0.35;
    // Outer frame
    const sideGeom = new THREE.BoxGeometry(0.04, h, d);
    [-1, 1].forEach(s => {
      const side = this.createMesh(sideGeom, woodMat);
      side.position.set(s * (w / 2 - 0.02), h / 2, 0);
      group.add(side);
    });

    // Shelves (5 levels)
    const shelfLevels = 5;
    for (let i = 0; i <= shelfLevels; i++) {
      const shelfY = (h / shelfLevels) * i;
      const shelf = this.createMesh(new THREE.BoxGeometry(w, 0.03, d), woodMat);
      shelf.position.set(0, shelfY, 0);
      group.add(shelf);

      // Books/decor on shelves
      if (i > 0 && i < shelfLevels) {
        const bookCount = 4 + (i % 3);
        for (let b = 0; b < bookCount; b++) {
          const colors = [0xd97706, 0x2563eb, 0x16a34a, 0x9333ea, 0x475569];
          const bMat = new THREE.MeshStandardMaterial({ color: colors[b % colors.length] });
          const book = this.createMesh(new THREE.BoxGeometry(0.04, 0.2 + (b % 3) * 0.04, 0.22), bMat);
          book.position.set(-0.35 + b * 0.05, shelfY + 0.12, 0);
          group.add(book);
        }
      }
    }

    return group;
  }

  // 12. POTTED PLANT
  static createPlant() {
    const group = new THREE.Group();
    group.name = 'Indoor Plant';
    group.userData = { type: 'plant', name: 'Monstera in Ceramic Pot', cost: 75 };

    // Pot
    const potMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.4 });
    const pot = this.createMesh(new THREE.CylinderGeometry(0.2, 0.15, 0.4, 24), potMat);
    pot.position.y = 0.2;
    group.add(pot);

    // Soil
    const soilMat = new THREE.MeshStandardMaterial({ color: 0x3e2723, roughness: 0.95 });
    const soil = this.createMesh(new THREE.CylinderGeometry(0.19, 0.19, 0.05, 24), soilMat);
    soil.position.y = 0.38;
    group.add(soil);

    // Leaves / foliage
    const leafMat = new THREE.MeshStandardMaterial({
      color: 0x2e7d32,
      roughness: 0.6,
      side: THREE.DoubleSide
    });

    const leafCount = 9;
    for (let i = 0; i < leafCount; i++) {
      const angle = (i * Math.PI * 2) / leafCount;
      const leafStem = new THREE.Group();

      const geom = new THREE.SphereGeometry(0.18, 16, 8);
      geom.scale(1.2, 0.08, 0.6);
      const leaf = this.createMesh(geom, leafMat);
      leaf.position.set(0.28, 0.35, 0);
      leaf.rotation.z = -0.5;

      leafStem.add(leaf);
      leafStem.position.set(0, 0.38, 0);
      leafStem.rotation.y = angle;
      leafStem.rotation.x = 0.2 + (i % 3) * 0.1;
      group.add(leafStem);
    }

    return group;
  }

  // 13. AREA RUG
  static createRug(width = 2.4, length = 1.8, style = 'modern') {
    const group = new THREE.Group();
    group.name = 'Area Rug';
    group.userData = { type: 'rug', name: 'Designer Area Rug', cost: 220 };

    const rugTexture = TextureGenerator.createRugTexture(style);
    const rugMat = new THREE.MeshStandardMaterial({
      map: rugTexture,
      roughness: 0.95,
      metalness: 0.0
    });

    const rugGeom = new THREE.PlaneGeometry(width, length);
    const rug = this.createMesh(rugGeom, rugMat);
    rug.rotation.x = -Math.PI / 2;
    rug.position.y = 0.005; // Slightly above floor
    group.add(rug);

    return group;
  }

  // 14. WALL ART
  static createWallArt(style = 'modern') {
    const group = new THREE.Group();
    group.name = 'Wall Art';
    group.userData = { type: 'wall_art', name: 'Gallery Framed Art', cost: 150 };

    const frameMat = new THREE.MeshStandardMaterial({
      color: style === 'luxury' ? 0xd4af37 : 0x111827,
      metalness: style === 'luxury' ? 0.7 : 0.1,
      roughness: 0.4
    });

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#faf8f5';
    ctx.fillRect(0, 0, 512, 512);

    // Abstract artwork
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.arc(200, 260, 130, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#1e3a8a';
    ctx.beginPath();
    ctx.rect(220, 140, 180, 220);
    ctx.fill();

    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.moveTo(100, 400);
    ctx.lineTo(256, 120);
    ctx.lineTo(412, 400);
    ctx.closePath();
    ctx.globalAlpha = 0.6;
    ctx.fill();
    ctx.globalAlpha = 1.0;

    const artTex = new THREE.CanvasTexture(canvas);
    const artMat = new THREE.MeshBasicMaterial({ map: artTex });

    const w = 1.2, h = 0.9;
    // Frame
    const frame = this.createMesh(new THREE.BoxGeometry(w + 0.08, h + 0.08, 0.03), frameMat);
    group.add(frame);

    // Canvas face
    const artPlane = new THREE.Mesh(new THREE.PlaneGeometry(w, h), artMat);
    artPlane.position.z = 0.02;
    group.add(artPlane);

    return group;
  }

  // 15. WARDROBE / CLOSET
  static createWardrobe(style = 'modern', color = 0x2b2d42) {
    const group = new THREE.Group();
    group.name = 'Wardrobe';
    group.userData = { type: 'wardrobe', name: 'Double Wardrobe', cost: 850, color: color };

    const bodyMat = new THREE.MeshStandardMaterial({
      color: color,
      roughness: style === 'luxury' ? 0.4 : 0.75,
      metalness: style === 'luxury' ? 0.15 : 0.05
    });

    const handleMat = new THREE.MeshStandardMaterial({
      color: style === 'luxury' ? 0xd4af37 : 0x1f2937,
      metalness: style === 'luxury' ? 0.85 : 0.4,
      roughness: 0.3
    });

    const plinthMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a24,
      roughness: 0.8
    });

    const width = 1.4;
    const height = 2.1;
    const depth = 0.6;
    const plinthH = 0.08;

    // Plinth base
    const plinth = this.createMesh(
      new THREE.BoxGeometry(width - 0.04, plinthH, depth - 0.04),
      plinthMat
    );
    plinth.position.y = plinthH / 2;
    group.add(plinth);

    // Main cabinet body
    const bodyH = height - plinthH;
    const body = this.createMesh(
      new THREE.BoxGeometry(width, bodyH, depth),
      bodyMat
    );
    body.position.y = plinthH + bodyH / 2;
    group.add(body);

    // Double front doors with bevel accent
    const doorW = (width - 0.04) / 2;
    const doorH = bodyH - 0.06;
    [-1, 1].forEach(side => {
      const doorGeom = new THREE.BoxGeometry(doorW - 0.01, doorH, 0.02);
      const door = this.createMesh(doorGeom, bodyMat);
      door.position.set(side * (doorW / 2 + 0.005), plinthH + bodyH / 2, depth / 2 + 0.01);
      group.add(door);

      // Vertical door handles
      const handleGeom = new THREE.CylinderGeometry(0.01, 0.01, 0.4, 16);
      const handle = this.createMesh(handleGeom, handleMat);
      handle.position.set(side * 0.06, plinthH + bodyH / 2, depth / 2 + 0.03);
      group.add(handle);
    });

    // Top crown trim
    const trimGeom = new THREE.BoxGeometry(width + 0.04, 0.04, depth + 0.04);
    const trim = this.createMesh(trimGeom, bodyMat);
    trim.position.y = height + 0.02;
    group.add(trim);

    return group;
  }

  // 16. PENDANT CEILING LIGHT
  static createPendantLight(style = 'modern') {
    const group = new THREE.Group();
    group.name = 'Pendant Light';
    group.userData = { type: 'pendant_light', name: 'Pendant Ceiling Lamp', cost: 180 };

    const metalMat = new THREE.MeshStandardMaterial({
      color: style === 'luxury' ? 0xd4af37 : 0x1f2937,
      metalness: style === 'luxury' ? 0.9 : 0.6,
      roughness: 0.25
    });

    const shadeMat = new THREE.MeshStandardMaterial({
      color: style === 'luxury' ? 0x1a1a24 : 0xf8fafc,
      roughness: 0.6,
      metalness: 0.1
    });

    const glowMat = new THREE.MeshBasicMaterial({ color: 0xfff4db });

    // Ceiling canopy plate (at ceiling height ~2.7m)
    const canopy = this.createMesh(new THREE.CylinderGeometry(0.1, 0.1, 0.02, 24), metalMat);
    canopy.position.y = 2.7;
    group.add(canopy);

    // Slim suspension cord
    const cord = this.createMesh(new THREE.CylinderGeometry(0.004, 0.004, 0.9, 8), metalMat);
    cord.position.y = 2.25;
    group.add(cord);

    // Lamp shade
    const shade = this.createMesh(new THREE.CylinderGeometry(0.12, 0.32, 0.28, 32, 1, true), shadeMat);
    shade.position.y = 1.72;
    group.add(shade);

    // Glowing bulb core
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 16), glowMat);
    bulb.position.y = 1.68;
    group.add(bulb);

    // Actual PointLight illuminating the room below
    const light = new THREE.PointLight(0xfff1dc, 0.85, 4.5, 1.6);
    light.position.y = 1.64;
    light.castShadow = true;
    light.shadow.bias = -0.001;
    group.add(light);

    return group;
  }

  // 17. STANDING FLOOR MIRROR
  static createFloorMirror(style = 'modern') {
    const group = new THREE.Group();
    group.name = 'Floor Mirror';
    group.userData = { type: 'floor_mirror', name: 'Full-Length Floor Mirror', cost: 240 };

    const frameMat = new THREE.MeshStandardMaterial({
      color: style === 'luxury' ? 0xd4af37 : 0x27272a,
      metalness: style === 'luxury' ? 0.85 : 0.3,
      roughness: 0.35
    });

    const mirrorMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.04,
      metalness: 0.95
    });

    const tiltAngle = 0.12; // ~7 degree lean
    const mirrorW = 0.72;
    const mirrorH = 1.85;

    const frameGroup = new THREE.Group();

    // Outer frame border
    const frame = this.createMesh(
      new THREE.BoxGeometry(mirrorW, mirrorH, 0.04),
      frameMat
    );
    frameGroup.add(frame);

    // Reflective mirror face
    const pane = new THREE.Mesh(
      new THREE.PlaneGeometry(mirrorW - 0.08, mirrorH - 0.08),
      mirrorMat
    );
    pane.position.z = 0.021;
    frameGroup.add(pane);

    // Rear easel kickstand strut
    const kickstand = this.createMesh(
      new THREE.CylinderGeometry(0.012, 0.012, 1.4, 12),
      frameMat
    );
    kickstand.position.set(0, -0.2, -0.3);
    kickstand.rotation.x = -0.38;
    frameGroup.add(kickstand);

    // Apply lean tilt and lift to ground
    frameGroup.rotation.x = -tiltAngle;
    frameGroup.position.set(0, (mirrorH / 2) * Math.cos(tiltAngle), 0.1);
    group.add(frameGroup);

    return group;
  }

  // 18. CREDENZA / SIDEBOARD
  static createCredenza(style = 'modern', woodColor = 0x5c4033) {
    const group = new THREE.Group();
    group.name = 'Credenza';
    group.userData = { type: 'credenza', name: 'Credenza Sideboard', cost: 650, color: woodColor };

    const woodMat = new THREE.MeshStandardMaterial({
      color: woodColor,
      roughness: 0.65,
      metalness: 0.1
    });

    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.85,
      roughness: 0.3
    });

    const width = 1.8;
    const height = 0.65;
    const depth = 0.44;
    const legH = 0.2;

    // Main cabinet body
    const cabinet = this.createMesh(
      new THREE.BoxGeometry(width, height, depth),
      woodMat
    );
    cabinet.position.y = legH + height / 2;
    group.add(cabinet);

    // 3 Front panel doors
    const doorW = (width - 0.04) / 3;
    const doorH = height - 0.04;
    [-1, 0, 1].forEach(i => {
      const panel = this.createMesh(
        new THREE.BoxGeometry(doorW - 0.01, doorH, 0.015),
        woodMat
      );
      panel.position.set(i * doorW, legH + height / 2, depth / 2 + 0.01);
      group.add(panel);

      // Minimalist brass pull
      const pull = this.createMesh(
        new THREE.CylinderGeometry(0.008, 0.008, 0.06, 12),
        brassMat
      );
      pull.rotation.x = Math.PI / 2;
      pull.position.set(i * doorW + (i === 1 ? 0 : (i === -1 ? 0.15 : -0.15)), legH + height / 2, depth / 2 + 0.025);
      group.add(pull);
    });

    // 4 Mid-century tapered legs
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([xDir, zDir]) => {
      const leg = this.createMesh(
        new THREE.CylinderGeometry(0.015, 0.025, legH, 16),
        brassMat
      );
      leg.position.set(xDir * (width / 2 - 0.12), legH / 2, zDir * (depth / 2 - 0.08));
      leg.rotation.z = xDir * -0.08;
      group.add(leg);
    });

    // Decorative ceramic vase on top
    const vaseMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.3 });
    const vase = this.createMesh(new THREE.CylinderGeometry(0.04, 0.08, 0.24, 16), vaseMat);
    vase.position.set(-width / 3, legH + height + 0.12, 0);
    group.add(vase);

    return group;
  }

  // 19. DUAL MONITOR GAMING DESK
  static createGamingDesk(style = 'modern') {
    const group = new THREE.Group();
    group.name = 'Gaming Desk';
    group.userData = { type: 'gaming_desk', name: 'Dual Monitor Gaming Desk', cost: 980 };

    const topMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.5,
      metalness: 0.2
    });

    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x27272a,
      metalness: 0.7,
      roughness: 0.4
    });

    const screenMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      emissive: 0x1e293b,
      roughness: 0.3,
      metalness: 0.1
    });

    const rgbMat = new THREE.MeshBasicMaterial({ color: 0x6366f1 });

    const deskW = 1.5;
    const deskD = 0.75;
    const deskH = 0.74;

    // Desktop surface
    const top = this.createMesh(new THREE.BoxGeometry(deskW, 0.035, deskD), topMat);
    top.position.y = deskH;
    group.add(top);

    // Sturdy steel K-legs
    [-1, 1].forEach(side => {
      const legGeom = new THREE.BoxGeometry(0.05, deskH, deskD - 0.1);
      const leg = this.createMesh(legGeom, frameMat);
      leg.position.set(side * (deskW / 2 - 0.06), deskH / 2, 0);
      group.add(leg);

      const foot = this.createMesh(new THREE.BoxGeometry(0.06, 0.02, deskD), frameMat);
      foot.position.set(side * (deskW / 2 - 0.06), 0.01, 0);
      group.add(foot);
    });

    // Cross brace
    const brace = this.createMesh(new THREE.BoxGeometry(deskW - 0.15, 0.04, 0.04), frameMat);
    brace.position.set(0, deskH * 0.4, -deskD / 2 + 0.1);
    group.add(brace);

    // Dual Monitor Mount Pole & Crossbar
    const pole = this.createMesh(new THREE.CylinderGeometry(0.02, 0.02, 0.45, 16), frameMat);
    pole.position.set(0, deskH + 0.22, -deskD / 2 + 0.12);
    group.add(pole);

    const crossArm = this.createMesh(new THREE.BoxGeometry(0.8, 0.03, 0.03), frameMat);
    crossArm.position.set(0, deskH + 0.32, -deskD / 2 + 0.14);
    group.add(crossArm);

    // Dual 27-inch monitors angled slightly inward
    [-1, 1].forEach(side => {
      const monGroup = new THREE.Group();
      // Monitor bezel
      const bezel = this.createMesh(new THREE.BoxGeometry(0.55, 0.33, 0.02), frameMat);
      monGroup.add(bezel);
      // Screen
      const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.53, 0.31), screenMat);
      screen.position.z = 0.012;
      monGroup.add(screen);

      monGroup.position.set(side * 0.3, deskH + 0.32, -deskD / 2 + 0.17);
      monGroup.rotation.y = -side * 0.14; // Inward curved angle
      group.add(monGroup);
    });

    // Desk Mat
    const matGeom = new THREE.BoxGeometry(0.8, 0.005, 0.35);
    const deskMat = this.createMesh(matGeom, new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.9 }));
    deskMat.position.set(0, deskH + 0.02, 0.08);
    group.add(deskMat);

    // Mechanical Keyboard
    const kbGeom = new THREE.BoxGeometry(0.35, 0.015, 0.13);
    const kb = this.createMesh(kbGeom, new THREE.MeshStandardMaterial({ color: 0x374151, roughness: 0.5 }));
    kb.position.set(-0.06, deskH + 0.03, 0.08);
    group.add(kb);

    // Mouse
    const mouseGeom = new THREE.BoxGeometry(0.06, 0.025, 0.1);
    const mouse = this.createMesh(mouseGeom, new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.4 }));
    mouse.position.set(0.22, deskH + 0.03, 0.08);
    group.add(mouse);

    // PC Tower on side floor stand
    const pcGroup = new THREE.Group();
    const pcCase = this.createMesh(new THREE.BoxGeometry(0.22, 0.45, 0.46), frameMat);
    pcCase.position.set(deskW / 2 + 0.16, 0.23, 0);
    pcGroup.add(pcCase);

    // RGB Light accent strip on PC
    const rgbStrip = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.4, 0.01), rgbMat);
    rgbStrip.position.set(deskW / 2 + 0.27, 0.23, 0.2);
    pcGroup.add(rgbStrip);
    group.add(pcGroup);

    return group;
  }
}
