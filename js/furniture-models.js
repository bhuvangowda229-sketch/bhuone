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
  static createSofa(style = 'modern', color = null) {
    const group = new THREE.Group();
    group.name = 'Sofa';
    group.userData = { type: 'sofa', name: 'Sofa', cost: 850 };

    const sofaColor = color || (style === 'luxury' ? 0x1e293b : (style === 'traditional' ? 0x5a3825 : (style === 'minimalist' ? 0xd1d5db : 0x3d4451)));

    const fabricMat = new THREE.MeshStandardMaterial({
      color: sofaColor,
      roughness: style === 'luxury' ? 0.45 : (style === 'traditional' ? 0.8 : 0.85),
      metalness: style === 'luxury' ? 0.15 : 0.05
    });

    const woodLegMat = new THREE.MeshStandardMaterial({
      color: style === 'luxury' ? 0xd4af37 : (style === 'traditional' ? 0x3e2723 : 0x2c1810),
      metalness: style === 'luxury' ? 0.8 : (style === 'traditional' ? 0.05 : 0.1),
      roughness: style === 'luxury' ? 0.3 : (style === 'traditional' ? 0.5 : 0.7)
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
    if (style === 'luxury') {
      topMat = new THREE.MeshPhysicalMaterial({
        color: 0xfbfbfb,
        transmission: 0.1,
        roughness: 0.1,
        metalness: 0.15
      });
    } else if (style === 'minimalist') {
      topMat = new THREE.MeshPhysicalMaterial({
        color: 0xe0e7ff,
        transmission: 0.85,
        opacity: 1,
        transparent: true,
        roughness: 0.1,
        metalness: 0.05
      });
    } else if (style === 'traditional') {
      topMat = new THREE.MeshStandardMaterial({
        color: 0x3e2723,
        roughness: 0.45,
        metalness: 0.05
      });
    } else {
      topMat = new THREE.MeshStandardMaterial({
        color: woodColor,
        roughness: 0.6,
        metalness: 0.1
      });
    }

    const legMat = new THREE.MeshStandardMaterial({
      color: style === 'luxury' ? 0xd4af37 : (style === 'minimalist' ? 0x111827 : (style === 'traditional' ? 0x2e1c12 : 0x3d2817)),
      metalness: style === 'luxury' ? 0.85 : (style === 'traditional' ? 0.05 : 0.3),
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

  // 3b. MISSOURI ENGINEERED WOOD TV ENTERTAINMENT UNIT (4 DISTINCT ARCHITECTURAL DESIGNS)
  static createMissouriTVUnit(style = 'modern', customColor = null, designType = 1) {
    const dType = parseInt(designType, 10) || (designType === 'floating' ? 2 : (designType === 'luxury' ? 3 : (designType === 'midcentury' ? 4 : 1)));

    const group = new THREE.Group();
    const designNames = {
      1: 'Missouri Classic Grand Entertainment Center',
      2: 'Missouri Floating Minimalist Fluted TV Console',
      3: 'Missouri Luxury Symmetrical Dual-Tower Center',
      4: 'Missouri Mid-Century Slatted Media Credenza'
    };
    const designCosts = { 1: 1450, 2: 1250, 3: 1850, 4: 1380 };

    group.name = designNames[dType] || 'Missouri TV Entertainment Unit';
    group.userData = {
      type: 'missouri_tv_unit',
      name: group.name,
      cost: designCosts[dType] || 1450,
      design: dType
    };

    // Color definitions based on design and style
    let darkWalnut = 0x362215;
    let lightWalnut = 0x935c36;

    if (customColor) {
      darkWalnut = typeof customColor === 'number' ? customColor : parseInt(customColor.replace('#', '0x'), 16);
      lightWalnut = darkWalnut;
    } else if (dType === 2) {
      // Floating Minimalist (Japandi Natural Ash & Honey Oak)
      darkWalnut = 0x5a3e28;
      lightWalnut = 0xb58257;
    } else if (dType === 3) {
      // Luxury Symmetrical (Deep Espresso & Champagne Gold)
      darkWalnut = 0x1f140e;
      lightWalnut = 0x7c4927;
    } else if (dType === 4) {
      // Mid-Century Modern (Warm Amber Honey Walnut)
      darkWalnut = 0x6e3d1f;
      lightWalnut = 0x9e5f32;
    } else if (style === 'luxury') {
      darkWalnut = 0x221812;
      lightWalnut = 0x8a532b;
    } else if (style === 'minimalist') {
      darkWalnut = 0xcab9a5;
      lightWalnut = 0xeee4d7;
    }

    const carcassMat = new THREE.MeshStandardMaterial({ color: darkWalnut, roughness: 0.38, metalness: 0.05 });
    const frontWoodMat = new THREE.MeshStandardMaterial({ color: lightWalnut, roughness: 0.35, metalness: 0.04 });
    const slatMat = new THREE.MeshStandardMaterial({ color: lightWalnut, roughness: 0.42, metalness: 0.06 });
    const handleMat = new THREE.MeshStandardMaterial({
      color: (dType === 3 || style === 'luxury') ? 0xd4af37 : (dType === 4 ? 0xb45309 : 0x27272a),
      metalness: 0.85,
      roughness: 0.25
    });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, transparent: true, opacity: 0.42, roughness: 0.08, metalness: 0.2 });
    const screenMat = new THREE.MeshStandardMaterial({ color: 0x080808, roughness: 0.08, metalness: 0.92 });
    const tvBezelMat = new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.8, roughness: 0.3 });
    const soundbarMat = new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.88, metalness: 0.05 });
    const ledGlowMat = new THREE.MeshBasicMaterial({ color: 0xffedd5, transparent: true, opacity: 0.45 });

    // ==============================================================
    // DESIGN 2: FLOATING MINIMALIST FLUTED CONSOLE (JAPANDI / CONTEMPORARY)
    // ==============================================================
    if (dType === 2) {
      const credW = 2.15;
      const credH = 0.36;
      const credD = 0.38;
      const groundElev = 0.26; // Floating above the floor!
      const credY = groundElev + credH / 2; // 0.44

      // Floating Credenza Body
      const floatingCarcass = this.createMesh(new THREE.BoxGeometry(credW, credH, credD), carcassMat, 'Floating Console Cabinet');
      floatingCarcass.position.set(0, credY, 0);
      group.add(floatingCarcass);

      // Under-Cabinet Warm Ambient LED Glow Strip
      const underGlow = this.createMesh(new THREE.BoxGeometry(credW - 0.1, 0.005, credD - 0.06), ledGlowMat, 'Under-Cabinet Ambient Glow Strip');
      underGlow.position.set(0, groundElev - 0.005, 0);
      group.add(underGlow);

      // Fluted Tambour Vertical Grooves across front
      const numFlutes = 26;
      const fluteStep = (credW - 0.12) / (numFlutes - 1);
      const fluteStartX = -credW / 2 + 0.06;
      for (let f = 0; f < numFlutes; f++) {
        const fx = fluteStartX + f * fluteStep;
        const flute = this.createMesh(new THREE.BoxGeometry(0.025, credH - 0.03, 0.015), frontWoodMat, `Fluted Front Slat ${f + 1}`);
        flute.position.set(fx, credY, credD / 2 + 0.008);
        group.add(flute);
      }

      // Minimalist Horizontal Slatted Back Panel
      const backW = 1.45;
      const backH = 1.05;
      const backY = groundElev + credH + backH / 2 + 0.04;
      const backZ = -0.15;
      const backdropX = 0.15;

      const backPanel = this.createMesh(new THREE.BoxGeometry(backW, backH, 0.025), carcassMat, 'Horizontal Slatted Backdrop');
      backPanel.position.set(backdropX, backY, backZ);
      group.add(backPanel);

      // 6 Horizontal Acoustic Slats
      for (let h = 0; h < 6; h++) {
        const hy = backY - backH / 2 + 0.10 + h * 0.17;
        const hSlat = this.createMesh(new THREE.BoxGeometry(backW - 0.04, 0.035, 0.015), slatMat, `Horizontal Acoustic Slat ${h + 1}`);
        hSlat.position.set(backdropX, hy, backZ + 0.018);
        group.add(hSlat);
      }

      // 65" Borderless OLED TV
      const tvW = 1.38;
      const tvH = 0.78;
      const tvY = backY;
      const tvZ = backZ + 0.045;

      const tvBezel = this.createMesh(new THREE.BoxGeometry(tvW, tvH, 0.025), tvBezelMat, 'OLED TV Frame');
      tvBezel.position.set(backdropX, tvY, tvZ);
      group.add(tvBezel);

      const tvScreen = this.createMesh(new THREE.BoxGeometry(tvW - 0.02, tvH - 0.02, 0.008), screenMat, '65-Inch Borderless OLED Display');
      tvScreen.position.set(backdropX, tvY, tvZ + 0.014);
      group.add(tvScreen);

      // Slim Recessed Soundbar
      const soundbar = this.createMesh(new THREE.BoxGeometry(0.85, 0.05, 0.06), soundbarMat, 'Recessed Slim Soundbar');
      soundbar.position.set(backdropX, groundElev + credH + 0.04, 0.02);
      group.add(soundbar);

      // Asymmetrical Left Floating Display Shelves
      const shelfW = 0.58;
      const shelfX = -0.75;
      const shelfD = 0.22;
      const shelfH = 0.03;

      const shelf1 = this.createMesh(new THREE.BoxGeometry(shelfW, shelfH, shelfD), frontWoodMat, 'Floating Display Shelf Upper');
      shelf1.position.set(shelfX, backY + 0.28, -0.06);
      group.add(shelf1);

      const shelf2 = this.createMesh(new THREE.BoxGeometry(shelfW, shelfH, shelfD), frontWoodMat, 'Floating Display Shelf Lower');
      shelf2.position.set(shelfX, backY - 0.16, -0.06);
      group.add(shelf2);

      // Decor on Upper Shelf: Sculptural White Ceramic Bowl & Zen Succulent
      const bowl = this.createMesh(new THREE.CylinderGeometry(0.08, 0.05, 0.06, 16), new THREE.MeshStandardMaterial({ color: 0xf5f5f4, roughness: 0.2 }), 'Zen Ceramic Bowl');
      bowl.position.set(shelfX - 0.14, backY + 0.28 + 0.045, -0.06);
      group.add(bowl);

      const succulentPot = this.createMesh(new THREE.CylinderGeometry(0.04, 0.035, 0.06, 12), new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.6 }), 'Potted Zen Succulent');
      succulentPot.position.set(shelfX + 0.14, backY + 0.28 + 0.045, -0.06);
      group.add(succulentPot);

      const succulentLeaf = this.createMesh(new THREE.SphereGeometry(0.045, 10, 8), new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.5 }), 'Succulent Foliage');
      succulentLeaf.position.set(shelfX + 0.14, backY + 0.28 + 0.08, -0.06);
      group.add(succulentLeaf);

      // Decor on Lower Shelf: 2 Stacked Architectural Monograph Books & Stone
      const b1 = this.createMesh(new THREE.BoxGeometry(0.24, 0.03, 0.18), new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.4 }), 'Design Monograph Volume 1');
      b1.position.set(shelfX - 0.08, backY - 0.16 + 0.03, -0.06);
      group.add(b1);

      const b2 = this.createMesh(new THREE.BoxGeometry(0.22, 0.025, 0.16), new THREE.MeshStandardMaterial({ color: 0xd4d4d8, roughness: 0.3 }), 'Design Monograph Volume 2');
      b2.position.set(shelfX - 0.08, backY - 0.16 + 0.057, -0.06);
      group.add(b2);

      const stoneSphere = this.createMesh(new THREE.SphereGeometry(0.04, 16, 16), new THREE.MeshStandardMaterial({ color: 0x71717a, roughness: 0.3 }), 'Sculpted River Stone Decor');
      stoneSphere.position.set(shelfX + 0.16, backY - 0.16 + 0.055, -0.06);
      group.add(stoneSphere);

      return group;
    }

    // ==============================================================
    // DESIGN 3: SYMMETRICAL GRAND SHOWCASE LUXURY CENTER (PENTHOUSE SALON)
    // ==============================================================
    if (dType === 3) {
      const centerW = 1.48;
      const baseH = 0.46;
      const baseD = 0.42;
      const baseY = 0.05 + baseH / 2;

      // Plinth
      const plinth = this.createMesh(new THREE.BoxGeometry(2.44, 0.05, 0.38), carcassMat, 'Grand Plinth Base');
      plinth.position.set(0, 0.025, 0);
      group.add(plinth);

      // Center Base Credenza
      const centerCred = this.createMesh(new THREE.BoxGeometry(centerW, baseH, baseD), carcassMat, 'Center Luxury Credenza Body');
      centerCred.position.set(0, baseY, 0);
      group.add(centerCred);

      // Gold Trim Divider Lines on Center Credenza (3 Drawer Fronts)
      const drawerW = centerW / 3 - 0.03;
      for (let dr = 0; dr < 3; dr++) {
        const dx = -centerW / 2 + 0.03 + drawerW / 2 + dr * (drawerW + 0.02);
        const drawerPanel = this.createMesh(new THREE.BoxGeometry(drawerW, baseH - 0.06, 0.02), frontWoodMat, `Luxury Fluted Drawer ${dr + 1}`);
        drawerPanel.position.set(dx, baseY, baseD / 2 + 0.01);
        group.add(drawerPanel);

        // Gold Handle Bar
        const handle = this.createMesh(new THREE.CylinderGeometry(0.007, 0.007, 0.18, 12), handleMat, `Gold Drawer Pull ${dr + 1}`);
        handle.rotation.z = Math.PI / 2;
        handle.position.set(dx, baseY, baseD / 2 + 0.025);
        group.add(handle);
      }

      // SYMMETRICAL DUAL GLASS CURIO TOWERS (LEFT & RIGHT)
      const towerW = 0.46;
      const towerH = 1.25;
      const towerD = 0.36;
      const towerY = 0.51 + towerH / 2;
      const towerDist = centerW / 2 + towerW / 2 + 0.01;

      [-towerDist, towerDist].forEach((tx, idx) => {
        const side = idx === 0 ? 'Left' : 'Right';
        const towerFrame = this.createMesh(new THREE.BoxGeometry(towerW, towerH, towerD), carcassMat, `${side} Glass Curio Tower Frame`);
        towerFrame.position.set(tx, towerY, 0);
        group.add(towerFrame);

        // Smoked Glass Door
        const gDoor = this.createMesh(new THREE.BoxGeometry(towerW - 0.04, towerH - 0.04, 0.01), glassMat, `${side} Smoked Glass Door`);
        gDoor.position.set(tx, towerY, towerD / 2 + 0.008);
        group.add(gDoor);

        // Luxury Gold Vertical Handle
        const gHandle = this.createMesh(new THREE.CylinderGeometry(0.006, 0.006, 0.22, 12), handleMat, `${side} Glass Door Gold Handle`);
        const hOffset = idx === 0 ? towerW / 2 - 0.04 : -towerW / 2 + 0.04;
        gHandle.position.set(tx + hOffset, towerY, towerD / 2 + 0.022);
        group.add(gHandle);

        // Interior Glass Shelves
        const s1 = this.createMesh(new THREE.BoxGeometry(towerW - 0.06, 0.015, towerD - 0.06), glassMat, `${side} Interior Glass Shelf Upper`);
        s1.position.set(tx, towerY + 0.22, 0);
        group.add(s1);

        const s2 = this.createMesh(new THREE.BoxGeometry(towerW - 0.06, 0.015, towerD - 0.06), glassMat, `${side} Interior Glass Shelf Lower`);
        s2.position.set(tx, towerY - 0.22, 0);
        group.add(s2);

        // Warm Interior LED Downlight Spotlight
        const spot = this.createMesh(new THREE.CylinderGeometry(0.03, 0.03, 0.01, 16), handleMat, `${side} Interior Downlight Housing`);
        spot.position.set(tx, towerY + towerH / 2 - 0.015, 0);
        group.add(spot);
      });

      // Left Tower Decor: Art Monograph Volumes & Geometric Pyramid
      const bookMatL = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.5 });
      const bL = this.createMesh(new THREE.BoxGeometry(0.06, 0.22, 0.24), bookMatL, 'Curated Art Book Monograph');
      bL.position.set(-towerDist - 0.06, towerY - 0.10, 0);
      group.add(bL);

      const pyramid = this.createMesh(new THREE.ConeGeometry(0.06, 0.14, 4), handleMat, 'Sculptural Brass Obelisk');
      pyramid.position.set(-towerDist + 0.06, towerY - 0.14, 0);
      group.add(pyramid);

      // Right Tower Decor: Crystal Decanter & Brass Mantle Clock
      const decanterMat = new THREE.MeshStandardMaterial({ color: 0xe0e7ff, transparent: true, opacity: 0.65, roughness: 0.05, metalness: 0.3 });
      const decanter = this.createMesh(new THREE.CylinderGeometry(0.03, 0.065, 0.18, 16), decanterMat, 'Crystal Decanter Curio');
      decanter.position.set(towerDist - 0.06, towerY - 0.12, 0);
      group.add(decanter);

      const clockMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.85, roughness: 0.2 });
      const mantleClock = this.createMesh(new THREE.CylinderGeometry(0.06, 0.06, 0.04, 24), clockMat, 'Brass Mantle Clock');
      mantleClock.rotation.x = Math.PI / 2;
      mantleClock.position.set(towerDist + 0.06, towerY + 0.28, 0);
      group.add(mantleClock);

      // Center Back Wall Accent Panel with Gold Inlay Strips
      const backH = 1.25;
      const backY = towerY;
      const backZ = -0.15;
      const backPanel = this.createMesh(new THREE.BoxGeometry(centerW, backH, 0.03), carcassMat, 'Luxury Dark Walnut Back Panel');
      backPanel.position.set(0, backY, backZ);
      group.add(backPanel);

      // 4 Vertical Brushed Gold Inlays
      [-0.50, -0.20, 0.20, 0.50].forEach((ix, i) => {
        const inlay = this.createMesh(new THREE.BoxGeometry(0.015, backH - 0.04, 0.008), handleMat, `Gold Vertical Inlay Strip ${i + 1}`);
        inlay.position.set(ix, backY, backZ + 0.018);
        group.add(inlay);
      });

      // 65" Luxury Smart TV with Gold Accent Edge
      const tvW = 1.36;
      const tvH = 0.76;
      const tvY = backY + 0.05;
      const tvZ = backZ + 0.05;

      const tvGoldBezel = this.createMesh(new THREE.BoxGeometry(tvW, tvH, 0.03), handleMat, 'Television Gold Bezel Frame');
      tvGoldBezel.position.set(0, tvY, tvZ);
      group.add(tvGoldBezel);

      const tvScreen = this.createMesh(new THREE.BoxGeometry(tvW - 0.03, tvH - 0.03, 0.008), screenMat, '65-Inch Cinema Display');
      tvScreen.position.set(0, tvY, tvZ + 0.018);
      group.add(tvScreen);

      // Curved Dolby Atmos Soundbar with Gold Badging
      const soundbar = this.createMesh(new THREE.BoxGeometry(0.96, 0.07, 0.08), soundbarMat, 'Luxury Curved Soundbar');
      soundbar.position.set(0, 0.51 + 0.08, 0.06);
      group.add(soundbar);

      // Overhead Crown Architectural Canopy
      const canopy = this.createMesh(new THREE.BoxGeometry(centerW + 0.02, 0.04, 0.36), carcassMat, 'Overhead Crown Canopy');
      canopy.position.set(0, towerY + towerH / 2 + 0.02, 0);
      group.add(canopy);

      return group;
    }

    // ==============================================================
    // DESIGN 4: MID-CENTURY MODERN SLATTED WITH TAPERED LEGS (SCANDI HYGGE)
    // ==============================================================
    if (dType === 4) {
      const credW = 2.10;
      const credH = 0.42;
      const credD = 0.42;
      const legH = 0.18;
      const credY = legH + credH / 2;

      // 4 ANGLED TAPERED WOODEN RETRO LEGS WITH BRASS FERRULES
      const legPositions = [
        [-credW / 2 + 0.14, legH / 2, -credD / 2 + 0.08],
        [credW / 2 - 0.14, legH / 2, -credD / 2 + 0.08],
        [-credW / 2 + 0.14, legH / 2, credD / 2 - 0.08],
        [credW / 2 - 0.14, legH / 2, credD / 2 - 0.08],
        [0, legH / 2, 0]
      ];

      legPositions.forEach((pos, idx) => {
        const legGroup = new THREE.Group();
        legGroup.position.set(...pos);

        // Tapered Wooden Leg
        const legGeom = new THREE.CylinderGeometry(0.018, 0.028, legH, 12);
        const leg = this.createMesh(legGeom, carcassMat, `Tapered Wooden Leg ${idx + 1}`);
        legGroup.add(leg);

        // Brushed Brass Cap / Ferrule at foot
        const ferruleGeom = new THREE.CylinderGeometry(0.019, 0.021, 0.04, 12);
        const ferrule = this.createMesh(ferruleGeom, handleMat, `Brass Leg Ferrule ${idx + 1}`);
        ferrule.position.set(0, -legH / 2 + 0.02, 0);
        legGroup.add(ferrule);

        // Splay angles outward
        if (pos[0] < 0) legGroup.rotation.z = 0.14;
        else if (pos[0] > 0) legGroup.rotation.z = -0.14;

        group.add(legGroup);
      });

      // Mid-Century Credenza Body with Warm Honey Walnut finish
      const credenza = this.createMesh(new THREE.BoxGeometry(credW, credH, credD), carcassMat, 'Mid-Century Credenza Body');
      credenza.position.set(0, credY, 0);
      group.add(credenza);

      // Slatted Tambour Sliding Doors (Left & Right)
      const doorW = 0.65;
      const doorH = credH - 0.06;
      [-0.62, 0.62].forEach((dx, didx) => {
        const door = this.createMesh(new THREE.BoxGeometry(doorW, doorH, 0.02), frontWoodMat, `Slatted Tambour Door ${didx + 1}`);
        door.position.set(dx, credY, credD / 2 + 0.01);
        group.add(door);

        // Vertical fine slat grooves
        for (let s = 0; s < 7; s++) {
          const sx = dx - doorW / 2 + 0.06 + s * 0.085;
          const vLine = this.createMesh(new THREE.BoxGeometry(0.012, doorH - 0.02, 0.01), slatMat, `Tambour Groove ${didx + 1}-${s + 1}`);
          vLine.position.set(sx, credY, credD / 2 + 0.018);
          group.add(vLine);
        }

        // Circular Recessed Finger Pull
        const ringPull = this.createMesh(new THREE.TorusGeometry(0.02, 0.005, 8, 16), handleMat, `Recessed Finger Pull ${didx + 1}`);
        ringPull.position.set(dx + (didx === 0 ? 0.22 : -0.22), credY, credD / 2 + 0.022);
        group.add(ringPull);
      });

      // Center Open Bay: Vintage Vinyl Turntable & Record Sleeves
      const turntableBase = this.createMesh(new THREE.BoxGeometry(0.36, 0.05, 0.30), frontWoodMat, 'Vintage Vinyl Turntable Base');
      turntableBase.position.set(0, credY - 0.08, 0.04);
      group.add(turntableBase);

      const platter = this.createMesh(new THREE.CylinderGeometry(0.12, 0.12, 0.015, 24), screenMat, 'Vinyl Platter & Record');
      platter.position.set(-0.02, credY - 0.045, 0.04);
      group.add(platter);

      const tonearm = this.createMesh(new THREE.CylinderGeometry(0.004, 0.004, 0.14, 8), handleMat, 'Brass Tonearm');
      tonearm.rotation.z = Math.PI / 3;
      tonearm.position.set(0.10, credY - 0.035, 0.06);
      group.add(tonearm);

      // Stacked Vinyl Records
      const vinylMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.6 });
      const recordStack = this.createMesh(new THREE.BoxGeometry(0.10, 0.24, 0.24), vinylMat, 'Vintage Vinyl LP Record Collection');
      recordStack.position.set(0, credY + 0.06, 0.04);
      group.add(recordStack);

      // Mounted 55" TV with Retro Wood Bezel
      const tvW = 1.28;
      const tvH = 0.74;
      const tvY = credY + credH / 2 + tvH / 2 + 0.14;
      const tvZ = -0.08;

      const tvWoodBezel = this.createMesh(new THREE.BoxGeometry(tvW, tvH, 0.035), carcassMat, 'Retro Wood Bezel Television Frame');
      tvWoodBezel.position.set(0, tvY, tvZ);
      group.add(tvWoodBezel);

      const tvScreen = this.createMesh(new THREE.BoxGeometry(tvW - 0.04, tvH - 0.04, 0.008), screenMat, '55-Inch Television Display');
      tvScreen.position.set(0, tvY, tvZ + 0.02);
      group.add(tvScreen);

      // Compact Soundbar
      const soundbar = this.createMesh(new THREE.BoxGeometry(0.80, 0.055, 0.07), soundbarMat, 'Mid-Century Fabric Soundbar');
      soundbar.position.set(0, credY + credH / 2 + 0.04, 0.04);
      group.add(soundbar);

      // OVERHEAD 3-BAY OPEN GRID BOOKSHELF BRIDGE
      const bridgeW = 1.60;
      const bridgeH = 0.34;
      const bridgeD = 0.24;
      const bridgeY = tvY + tvH / 2 + bridgeH / 2 + 0.06;
      const bridgeZ = -0.06;

      const gridBridge = this.createMesh(new THREE.BoxGeometry(bridgeW, bridgeH, bridgeD), carcassMat, 'Overhead 3-Bay Grid Bookshelf Bridge');
      gridBridge.position.set(0, bridgeY, bridgeZ);
      group.add(gridBridge);

      // 2 Vertical Bay Dividers inside grid
      [-0.26, 0.26].forEach((vx, i) => {
        const div = this.createMesh(new THREE.BoxGeometry(0.02, bridgeH - 0.03, bridgeD - 0.02), frontWoodMat, `Grid Shelf Divider ${i + 1}`);
        div.position.set(vx, bridgeY, bridgeZ);
        group.add(div);
      });

      // Bay 1: Leaning Books with Bookend
      const bookMat1 = new THREE.MeshStandardMaterial({ color: 0x0369a1, roughness: 0.6 });
      const b1 = this.createMesh(new THREE.BoxGeometry(0.12, 0.20, 0.18), bookMat1, 'Bookshelf Leaning Literature');
      b1.rotation.z = -0.12;
      b1.position.set(-0.52, bridgeY - 0.04, bridgeZ);
      group.add(b1);

      // Bay 2: Terracotta Planter with Trailing Monstera Leaf
      const potMat = new THREE.MeshStandardMaterial({ color: 0xc2410c, roughness: 0.7 });
      const pot = this.createMesh(new THREE.CylinderGeometry(0.05, 0.04, 0.08, 16), potMat, 'Terracotta Mini Planter');
      pot.position.set(0, bridgeY - 0.08, bridgeZ);
      group.add(pot);

      const leafMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.5 });
      const leaf = this.createMesh(new THREE.SphereGeometry(0.06, 10, 8), leafMat, 'Potted Foliage Canopy');
      leaf.position.set(0, bridgeY - 0.03, bridgeZ);
      group.add(leaf);

      // Bay 3: Vintage Analog Clock
      const clockMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.8, roughness: 0.25 });
      const analogClock = this.createMesh(new THREE.CylinderGeometry(0.05, 0.05, 0.03, 16), clockMat, 'Vintage Mid-Century Analog Desk Clock');
      analogClock.rotation.x = Math.PI / 2;
      analogClock.position.set(0.52, bridgeY - 0.06, bridgeZ);
      group.add(analogClock);

      return group;
    }

    // ==============================================================
    // DESIGN 1: CLASSIC GRAND WALNUT ENTERTAINMENT CENTER (SIGNATURE HOMETOWN MISSOURI)
    // ==============================================================
    // 1. BASE PLINTH
    const plinth = this.createMesh(new THREE.BoxGeometry(2.16, 0.05, 0.38), carcassMat, 'Media Console Plinth');
    plinth.position.set(0, 0.025, 0);
    group.add(plinth);

    // 2. MAIN CONSOLE CREDENZA
    const baseW = 2.20;
    const baseH = 0.44;
    const baseD = 0.42;
    const baseY = 0.05 + baseH / 2;
    const carcass = this.createMesh(new THREE.BoxGeometry(baseW, baseH, baseD), carcassMat, 'Media Console Cabinet');
    carcass.position.set(0, baseY, 0);
    group.add(carcass);

    // Top Surface Trim
    const topTrim = this.createMesh(new THREE.BoxGeometry(baseW + 0.02, 0.02, baseD + 0.02), carcassMat, 'Console Top Surface');
    topTrim.position.set(0, 0.05 + baseH + 0.01, 0);
    group.add(topTrim);

    // 3. STORAGE COMPARTMENTS & SHUTTER DOORS
    // 3a. Left Shutter Door
    const leftDoor = this.createMesh(new THREE.BoxGeometry(0.52, 0.38, 0.02), frontWoodMat, 'Left Cabinet Shutter Door');
    leftDoor.position.set(-0.78, baseY, baseD / 2 + 0.01);
    group.add(leftDoor);

    const leftHandle = this.createMesh(new THREE.CylinderGeometry(0.007, 0.007, 0.18, 12), handleMat, 'Left Door Handle');
    leftHandle.position.set(-0.57, baseY, baseD / 2 + 0.025);
    group.add(leftHandle);

    // 3b. Center Open Dual Media Deck
    const centerShelf = this.createMesh(new THREE.BoxGeometry(0.92, 0.02, baseD - 0.02), carcassMat, 'Center Media Shelf Divider');
    centerShelf.position.set(0, baseY, 0.01);
    group.add(centerShelf);

    // Set-top Box & Indicator LED
    const stb = this.createMesh(new THREE.BoxGeometry(0.24, 0.035, 0.20), soundbarMat, 'Set-Top Streaming Box');
    stb.position.set(-0.22, baseY + 0.04, 0.06);
    group.add(stb);

    const stbLed = this.createMesh(new THREE.CylinderGeometry(0.004, 0.004, 0.005, 8), new THREE.MeshBasicMaterial({ color: 0x06b6d4 }), 'Media Status LED');
    stbLed.rotation.x = Math.PI / 2;
    stbLed.position.set(-0.14, baseY + 0.04, 0.165);
    group.add(stbLed);

    // Gaming Console
    const consoleBox = this.createMesh(new THREE.BoxGeometry(0.30, 0.05, 0.22), soundbarMat, 'Next-Gen Gaming Console');
    consoleBox.position.set(0.22, 0.05 + 0.07, 0.06);
    group.add(consoleBox);

    const consoleGlow = this.createMesh(new THREE.BoxGeometry(0.28, 0.005, 0.005), new THREE.MeshBasicMaterial({ color: 0x60a5fa }), 'Console Accent Light');
    consoleGlow.position.set(0.22, 0.05 + 0.09, 0.172);
    group.add(consoleGlow);

    // 3c. Right Storage Drawers
    const drawerTop = this.createMesh(new THREE.BoxGeometry(0.52, 0.18, 0.02), frontWoodMat, 'Right Upper Storage Drawer');
    drawerTop.position.set(0.78, baseY + 0.10, baseD / 2 + 0.01);
    group.add(drawerTop);

    const handleR1 = this.createMesh(new THREE.CylinderGeometry(0.006, 0.006, 0.16, 12), handleMat, 'Upper Drawer Pull');
    handleR1.rotation.z = Math.PI / 2;
    handleR1.position.set(0.78, baseY + 0.10, baseD / 2 + 0.025);
    group.add(handleR1);

    const drawerBtm = this.createMesh(new THREE.BoxGeometry(0.52, 0.18, 0.02), frontWoodMat, 'Right Lower Storage Drawer');
    drawerBtm.position.set(0.78, baseY - 0.10, baseD / 2 + 0.01);
    group.add(drawerBtm);

    const handleR2 = this.createMesh(new THREE.CylinderGeometry(0.006, 0.006, 0.16, 12), handleMat, 'Lower Drawer Pull');
    handleR2.rotation.z = Math.PI / 2;
    handleR2.position.set(0.78, baseY - 0.10, baseD / 2 + 0.025);
    group.add(handleR2);

    // 4. VERTICAL SLATTED WOOD BACK PANEL & BACKDROP
    const backW = 1.48;
    const backH = 1.18;
    const backY = 0.50 + backH / 2;
    const backZ = -0.15;
    const backdropX = -0.22;

    const backPanel = this.createMesh(new THREE.BoxGeometry(backW, backH, 0.03), carcassMat, 'Engineered Wood Wall Backdrop');
    backPanel.position.set(backdropX, backY, backZ);
    group.add(backPanel);

    // Ambient LED Glow Strip behind back panel
    const ledGlow = this.createMesh(new THREE.BoxGeometry(backW + 0.06, backH + 0.06, 0.005), ledGlowMat, 'Ambient Backlight Strip');
    ledGlow.position.set(backdropX, backY, backZ - 0.02);
    group.add(ledGlow);

    // 14 Architectural Vertical Wood Slats
    const numSlats = 14;
    const slatStartX = backdropX - backW / 2 + 0.06;
    const slatStep = (backW - 0.12) / (numSlats - 1);
    for (let i = 0; i < numSlats; i++) {
      const slatX = slatStartX + i * slatStep;
      const slat = this.createMesh(new THREE.BoxGeometry(0.035, backH - 0.04, 0.02), slatMat, `Decorative Wood Slat ${i + 1}`);
      slat.position.set(slatX, backY, backZ + 0.02);
      group.add(slat);
    }

    // 5. 55" SMART WIDESCREEN TELEVISION & SOUNDBAR
    const tvW = 1.28;
    const tvH = 0.74;
    const tvY = backY + 0.06;
    const tvZ = backZ + 0.05;

    // Bezel Frame
    const tvBezel = this.createMesh(new THREE.BoxGeometry(tvW, tvH, 0.03), tvBezelMat, 'Smart TV Bezel Frame');
    tvBezel.position.set(backdropX, tvY, tvZ);
    group.add(tvBezel);

    // Screen
    const tvScreen = this.createMesh(new THREE.BoxGeometry(tvW - 0.03, tvH - 0.03, 0.008), screenMat, '55-Inch Obsidian Screen');
    tvScreen.position.set(backdropX, tvY, tvZ + 0.018);
    group.add(tvScreen);

    // Standby Power Indicator
    const pwrLed = this.createMesh(new THREE.SphereGeometry(0.004, 8, 8), new THREE.MeshBasicMaterial({ color: 0xef4444 }), 'TV Standby Power LED');
    pwrLed.position.set(backdropX + tvW / 2 - 0.04, tvY - tvH / 2 + 0.015, tvZ + 0.02);
    group.add(pwrLed);

    // Dolby Atmos Soundbar
    const soundbar = this.createMesh(new THREE.BoxGeometry(0.92, 0.065, 0.075), soundbarMat, 'Dolby Atmos Soundbar');
    soundbar.position.set(backdropX, 0.50 + 0.08, 0.08);
    group.add(soundbar);

    const soundbarLogo = this.createMesh(new THREE.BoxGeometry(0.04, 0.01, 0.002), handleMat, 'Soundbar Brand Plate');
    soundbarLogo.position.set(backdropX, 0.50 + 0.08, 0.12);
    group.add(soundbarLogo);

    // 6. SIDE CURIO DISPLAY TOWER WITH TEMPERED GLASS DOOR
    const towerX = 0.83;
    const towerW = 0.48;
    const towerH = 1.18;
    const towerD = 0.34;
    const towerY = backY;
    const towerZ = -0.04;

    const towerFrame = this.createMesh(new THREE.BoxGeometry(towerW, towerH, towerD), carcassMat, 'Curio Display Tower Frame');
    towerFrame.position.set(towerX, towerY, towerZ);
    group.add(towerFrame);

    // Interior Glass Shelves
    const gShelf1 = this.createMesh(new THREE.BoxGeometry(towerW - 0.06, 0.015, towerD - 0.06), glassMat, 'Curio Glass Shelf Upper');
    gShelf1.position.set(towerX, towerY + 0.20, towerZ);
    group.add(gShelf1);

    const gShelf2 = this.createMesh(new THREE.BoxGeometry(towerW - 0.06, 0.015, towerD - 0.06), glassMat, 'Curio Glass Shelf Lower');
    gShelf2.position.set(towerX, towerY - 0.20, towerZ);
    group.add(gShelf2);

    // Smoked Glass Door Front
    const glassDoor = this.createMesh(new THREE.BoxGeometry(towerW - 0.04, towerH - 0.04, 0.01), glassMat, 'Smoked Glass Curio Door');
    glassDoor.position.set(towerX, towerY, towerZ + towerD / 2 + 0.005);
    group.add(glassDoor);

    const glassDoorHandle = this.createMesh(new THREE.CylinderGeometry(0.006, 0.006, 0.14, 12), handleMat, 'Glass Door Handle');
    glassDoorHandle.position.set(towerX - towerW / 2 + 0.04, towerY, towerZ + towerD / 2 + 0.02);
    group.add(glassDoorHandle);

    // Curio Decor 1: Stack of 3 Art Books on Lower Shelf
    const bookColors = [0x991b1b, 0x1e40af, 0x166534];
    for (let b = 0; b < 3; b++) {
      const bookMat = new THREE.MeshStandardMaterial({ color: bookColors[b], roughness: 0.6 });
      const book = this.createMesh(new THREE.BoxGeometry(0.04, 0.16 + b * 0.02, 0.22), bookMat, `Curio Art Book ${b + 1}`);
      book.position.set(towerX - 0.06 + b * 0.055, towerY - 0.10, towerZ);
      group.add(book);
    }

    // Curio Decor 2: Minimalist Ivory Ceramic Vase on Middle Shelf
    const vaseMat = new THREE.MeshStandardMaterial({ color: 0xf5f5f4, roughness: 0.25 });
    const vase = this.createMesh(new THREE.CylinderGeometry(0.045, 0.065, 0.17, 16), vaseMat, 'Modern Ceramic Curio Vase');
    vase.position.set(towerX + 0.04, towerY + 0.30, towerZ);
    group.add(vase);

    const twigMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
    const twig = this.createMesh(new THREE.CylinderGeometry(0.005, 0.005, 0.22, 8), twigMat, 'Dried Botanical Accent Twig');
    twig.rotation.z = 0.15;
    twig.position.set(towerX + 0.05, towerY + 0.45, towerZ);
    group.add(twig);

    // Curio Decor 3: Brass Arch Sculpture on Upper Shelf
    const archMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.85, roughness: 0.2 });
    const arch = this.createMesh(new THREE.TorusGeometry(0.06, 0.012, 12, 24, Math.PI), archMat, 'Brass Curio Arch Sculpture');
    arch.position.set(towerX - 0.05, towerY + 0.24, towerZ);
    group.add(arch);

    // 7. OVERHEAD FLOATING BRIDGE DISPLAY SHELF
    const bridgeW = 1.54;
    const bridgeH = 0.035;
    const bridgeD = 0.24;
    const bridgeY = backY + backH / 2 + bridgeH / 2;
    const bridgeZ = -0.06;

    const bridgeShelf = this.createMesh(new THREE.BoxGeometry(bridgeW, bridgeH, bridgeD), carcassMat, 'Overhead Floating Bridge Shelf');
    bridgeShelf.position.set(backdropX, bridgeY, bridgeZ);
    group.add(bridgeShelf);

    // Overhead Decor: Potted Trailing Pothos Plant
    const potMat = new THREE.MeshStandardMaterial({ color: 0xc2410c, roughness: 0.65 });
    const pot = this.createMesh(new THREE.CylinderGeometry(0.055, 0.04, 0.08, 16), potMat, 'Bridge Trailing Plant Pot');
    pot.position.set(backdropX + 0.38, bridgeY + 0.05, bridgeZ);
    group.add(pot);

    const foliageMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.5 });
    const plantTop = this.createMesh(new THREE.SphereGeometry(0.065, 12, 10), foliageMat, 'Plant Canopy');
    plantTop.position.set(backdropX + 0.38, bridgeY + 0.09, bridgeZ);
    group.add(plantTop);

    // Trailing vine cascading down
    const vine1 = this.createMesh(new THREE.CylinderGeometry(0.008, 0.005, 0.26, 8), foliageMat, 'Trailing Foliage Vine');
    vine1.position.set(backdropX + 0.42, bridgeY - 0.08, bridgeZ + 0.06);
    vine1.rotation.x = 0.2;
    group.add(vine1);

    // Framed Art Memoir
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.4 });
    const photoFrame = this.createMesh(new THREE.BoxGeometry(0.14, 0.16, 0.02), frameMat, 'Framed Art Memoir');
    photoFrame.position.set(backdropX - 0.45, bridgeY + 0.09, bridgeZ);
    photoFrame.rotation.y = 0.1;
    group.add(photoFrame);

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
  static createBed(style = 'modern', frameColor = null) {
    const group = new THREE.Group();
    group.name = 'Bed';
    group.userData = { type: 'bed', name: 'King/Queen Platform Bed', cost: 1400 };

    const width = 2.0;
    const length = 2.2;
    const height = 0.35;

    const chosenFrameColor = frameColor || (style === 'luxury' ? 0x0f172a : (style === 'traditional' ? 0x3e2723 : (style === 'minimalist' ? 0xd1d5db : 0x2b2d42)));

    const frameMat = new THREE.MeshStandardMaterial({
      color: chosenFrameColor,
      roughness: style === 'luxury' ? 0.35 : (style === 'traditional' ? 0.5 : 0.6)
    });

    const mattressMat = new THREE.MeshStandardMaterial({
      color: 0xfafafa,
      roughness: 0.9
    });

    const duvetMat = new THREE.MeshStandardMaterial({
      color: style === 'luxury' ? 0x0f172a : (style === 'minimalist' ? 0xd1d5db : (style === 'traditional' ? 0x6b3e26 : 0x0284c7)),
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

  // 6b. SINGLE / TWIN BED
  static createSingleBed(style = 'modern', frameColor = null) {
    const group = new THREE.Group();
    group.name = 'SingleBed';
    group.userData = { type: 'single_bed', name: 'Single / Twin Comfort Bed', cost: 750 };

    const width = 1.15;
    const length = 2.1;
    const height = 0.35;

    const chosenFrameColor = frameColor || (style === 'luxury' ? 0x0f172a : (style === 'traditional' ? 0x3e2723 : (style === 'minimalist' ? 0xd1d5db : 0x2b2d42)));

    const frameMat = new THREE.MeshStandardMaterial({
      color: chosenFrameColor,
      roughness: style === 'luxury' ? 0.35 : (style === 'traditional' ? 0.5 : 0.6)
    });

    const mattressMat = new THREE.MeshStandardMaterial({ color: 0xfafafa, roughness: 0.9 });
    const duvetMat = new THREE.MeshStandardMaterial({
      color: style === 'luxury' ? 0x1e3a8a : (style === 'minimalist' ? 0x94a3b8 : (style === 'traditional' ? 0x78350f : 0x0ea5e9)),
      roughness: 0.85
    });

    // Bed frame base
    const base = this.createMesh(new THREE.BoxGeometry(width, height, length), frameMat, 'Single Bed Base');
    base.position.y = height / 2;
    group.add(base);

    // Mattress
    const mattress = this.createMesh(new THREE.BoxGeometry(width - 0.08, 0.24, length - 0.08), mattressMat, 'Single Mattress');
    mattress.position.set(0, height + 0.12, 0);
    group.add(mattress);

    // Duvet
    const duvet = this.createMesh(new THREE.BoxGeometry(width - 0.06, 0.26, length * 0.72), duvetMat, 'Single Duvet');
    duvet.position.set(0, height + 0.13, length * 0.12);
    group.add(duvet);

    // Headboard
    const headboardH = 0.85;
    const headboard = this.createMesh(new THREE.BoxGeometry(width + 0.08, headboardH, 0.1), frameMat, 'Single Headboard');
    headboard.position.set(0, headboardH / 2, -length / 2 - 0.05);
    group.add(headboard);

    // Single Pillow
    const pillowMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 });
    const pillow = this.createMesh(new THREE.BoxGeometry(0.7, 0.14, 0.38), pillowMat, 'Single Pillow');
    pillow.position.set(0, height + 0.28, -length / 2 + 0.35);
    pillow.rotation.x = -0.22;
    group.add(pillow);

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
      metalness: 0.85,
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
      metalness: 0.85,
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
  static renderArtworkCanvas(canvas, theme = 'geometric') {
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 512, 512);

    switch (theme) {
      case 'bauhaus': {
        // Bauhaus Minimal Modern
        ctx.fillStyle = '#f6f5f0';
        ctx.fillRect(0, 0, 512, 512);

        // Crimson large circle
        ctx.fillStyle = '#e63946';
        ctx.beginPath();
        ctx.arc(180, 240, 110, 0, Math.PI * 2);
        ctx.fill();

        // Cobalt blue wedge / arch
        ctx.fillStyle = '#1d3557';
        ctx.beginPath();
        ctx.arc(330, 290, 95, 0, Math.PI);
        ctx.fill();

        // Cadmium yellow triangle
        ctx.fillStyle = '#f4a261';
        ctx.beginPath();
        ctx.moveTo(270, 90);
        ctx.lineTo(390, 240);
        ctx.lineTo(210, 240);
        ctx.closePath();
        ctx.fill();

        // Sharp black Bauhaus grid line
        ctx.strokeStyle = '#1d2a44';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(80, 240);
        ctx.lineTo(440, 240);
        ctx.moveTo(270, 70);
        ctx.lineTo(270, 420);
        ctx.stroke();

        // Accent dot
        ctx.fillStyle = '#1d2a44';
        ctx.beginPath();
        ctx.arc(270, 240, 10, 0, Math.PI * 2);
        ctx.fill();
        break;
      }

      case 'sunset': {
        // Sunset Horizon Glow
        const grad = ctx.createLinearGradient(0, 0, 0, 512);
        grad.addColorStop(0, '#fde2e4');
        grad.addColorStop(0.4, '#fad2e1');
        grad.addColorStop(0.7, '#c5dedd');
        grad.addColorStop(1.0, '#99c1de');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 512, 512);

        // Radiant sun disc
        const sunGrad = ctx.createRadialGradient(256, 180, 10, 256, 180, 110);
        sunGrad.addColorStop(0, '#ffbe0b');
        sunGrad.addColorStop(0.7, '#fb5607');
        sunGrad.addColorStop(1, 'rgba(251, 86, 7, 0)');
        ctx.fillStyle = sunGrad;
        ctx.beginPath();
        ctx.arc(256, 180, 110, 0, Math.PI * 2);
        ctx.fill();

        // Layered mountain silhouettes
        ctx.fillStyle = '#6d597a';
        ctx.beginPath();
        ctx.moveTo(0, 360);
        ctx.bezierCurveTo(120, 280, 200, 340, 300, 300);
        ctx.bezierCurveTo(390, 260, 440, 310, 512, 280);
        ctx.lineTo(512, 512);
        ctx.lineTo(0, 512);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#355070';
        ctx.beginPath();
        ctx.moveTo(0, 410);
        ctx.bezierCurveTo(100, 380, 220, 430, 320, 380);
        ctx.bezierCurveTo(400, 340, 460, 390, 512, 360);
        ctx.lineTo(512, 512);
        ctx.lineTo(0, 512);
        ctx.closePath();
        ctx.fill();
        break;
      }

      case 'emerald': {
        // Emerald Botanic Organic
        ctx.fillStyle = '#f4f7f5';
        ctx.fillRect(0, 0, 512, 512);

        // Deep emerald oval
        ctx.fillStyle = '#1b4332';
        ctx.beginPath();
        ctx.ellipse(220, 280, 100, 150, Math.PI / 8, 0, Math.PI * 2);
        ctx.fill();

        // Sage circle
        ctx.fillStyle = '#52b788';
        ctx.beginPath();
        ctx.arc(320, 200, 85, 0, Math.PI * 2);
        ctx.fill();

        // Gold arch
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 14;
        ctx.beginPath();
        ctx.arc(256, 320, 110, Math.PI, 0);
        ctx.stroke();

        // Botanical stem
        ctx.strokeStyle = '#2d6a4f';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(256, 440);
        ctx.quadraticCurveTo(240, 250, 320, 110);
        ctx.stroke();
        break;
      }

      case 'monochrome': {
        // Monochrome Contemporary
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 512, 512);

        // Expressive sweeps
        ctx.fillStyle = '#111827';
        ctx.beginPath();
        ctx.arc(220, 220, 120, 0, Math.PI * 1.5);
        ctx.fill();

        ctx.fillStyle = '#374151';
        ctx.beginPath();
        ctx.rect(200, 220, 190, 170);
        ctx.fill();

        ctx.strokeStyle = '#111827';
        ctx.lineWidth = 12;
        ctx.beginPath();
        ctx.moveTo(100, 420);
        ctx.lineTo(412, 100);
        ctx.stroke();

        ctx.lineWidth = 3;
        ctx.strokeStyle = '#9ca3af';
        ctx.beginPath();
        ctx.moveTo(80, 256);
        ctx.lineTo(432, 256);
        ctx.stroke();
        break;
      }

      case 'terracotta': {
        // Warm Terracotta & Olive
        ctx.fillStyle = '#f8f4ed';
        ctx.fillRect(0, 0, 512, 512);

        // Terracotta archway
        ctx.fillStyle = '#c86443';
        ctx.beginPath();
        ctx.arc(230, 240, 120, Math.PI, 0);
        ctx.lineTo(350, 440);
        ctx.lineTo(110, 440);
        ctx.closePath();
        ctx.fill();

        // Olive circle
        ctx.fillStyle = '#606c38';
        ctx.beginPath();
        ctx.arc(330, 200, 75, 0, Math.PI * 2);
        ctx.fill();

        // Dusty blush circle
        ctx.fillStyle = '#dda15e';
        ctx.beginPath();
        ctx.arc(170, 360, 55, 0, Math.PI * 2);
        ctx.fill();
        break;
      }

      case 'geometric':
      default: {
        // Default modern geometric
        ctx.fillStyle = '#faf8f5';
        ctx.fillRect(0, 0, 512, 512);

        // Amber circle
        ctx.fillStyle = '#d97706';
        ctx.beginPath();
        ctx.arc(200, 260, 130, 0, Math.PI * 2);
        ctx.fill();

        // Deep blue block
        ctx.fillStyle = '#1e3a8a';
        ctx.beginPath();
        ctx.rect(220, 140, 180, 220);
        ctx.fill();

        // Emerald triangle
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.moveTo(100, 400);
        ctx.lineTo(256, 120);
        ctx.lineTo(412, 400);
        ctx.closePath();
        ctx.globalAlpha = 0.65;
        ctx.fill();
        ctx.globalAlpha = 1.0;

        ctx.strokeStyle = '#312e81';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(80, 320);
        ctx.lineTo(432, 320);
        ctx.stroke();
        break;
      }
    }
  }

  static createWallArt(style = 'modern', artTheme = 'geometric', width = 1.2, height = 0.9, frameColor = null) {
    const group = new THREE.Group();
    group.name = 'Abstract Wall Art';

    const chosenColor = frameColor || (style === 'luxury' ? 0xd4af37 : 0x18181b);
    const w = width || 1.2;
    const h = height || 0.9;
    const theme = artTheme || 'geometric';

    group.userData = {
      type: 'wall_art',
      name: 'Abstract Wall Art',
      cost: 160,
      isWallMounted: true,
      artTheme: theme,
      artWidth: w,
      artHeight: h,
      frameColor: chosenColor,
      wall: 'back'
    };

    const frameMat = new THREE.MeshStandardMaterial({
      color: chosenColor,
      metalness: style === 'luxury' ? 0.7 : 0.15,
      roughness: 0.35
    });

    const canvas = document.createElement('canvas');
    this.renderArtworkCanvas(canvas, theme);

    const artTex = new THREE.CanvasTexture(canvas);
    if (THREE.SRGBColorSpace) artTex.colorSpace = THREE.SRGBColorSpace;
    const artMat = new THREE.MeshBasicMaterial({ map: artTex });

    // Frame
    const frame = this.createMesh(new THREE.BoxGeometry(w + 0.08, h + 0.08, 0.03), frameMat, 'Picture Frame');
    group.add(frame);

    // Canvas face
    const artPlane = this.createMesh(new THREE.PlaneGeometry(w, h), artMat, 'Art Canvas');
    artPlane.position.z = 0.02;
    group.add(artPlane);

    group.userData.frameMesh = frame;
    group.userData.canvasMesh = artPlane;
    group.userData.canvasElement = canvas;
    group.userData.artTexture = artTex;

    return group;
  }

  static updateWallArtTheme(group, theme = 'geometric') {
    if (!group) return;
    group.userData.artTheme = theme;
    let canvas = group.userData.canvasElement;
    if (!canvas) {
      canvas = document.createElement('canvas');
      group.userData.canvasElement = canvas;
    }
    this.renderArtworkCanvas(canvas, theme);
    if (group.userData.artTexture) {
      group.userData.artTexture.needsUpdate = true;
    } else if (group.userData.canvasMesh && group.userData.canvasMesh.material) {
      const tex = new THREE.CanvasTexture(canvas);
      if (THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
      group.userData.canvasMesh.material.map = tex;
      group.userData.canvasMesh.material.needsUpdate = true;
      group.userData.artTexture = tex;
    }
  }

  static updateWallArtDimensions(group, width, height) {
    if (!group) return;
    const w = Math.max(0.4, width);
    const h = Math.max(0.4, height);
    group.userData.artWidth = w;
    group.userData.artHeight = h;

    if (group.userData.frameMesh) {
      group.userData.frameMesh.geometry.dispose();
      group.userData.frameMesh.geometry = new THREE.BoxGeometry(w + 0.08, h + 0.08, 0.03);
    }
    if (group.userData.canvasMesh) {
      group.userData.canvasMesh.geometry.dispose();
      group.userData.canvasMesh.geometry = new THREE.PlaneGeometry(w, h);
      group.userData.canvasMesh.position.z = 0.02;
    }
  }

  static updateWallArtFrameColor(group, color) {
    if (!group) return;
    group.userData.frameColor = color;
    if (group.userData.frameMesh && group.userData.frameMesh.material) {
      group.userData.frameMesh.material.color.set(color);
      group.userData.frameMesh.material.needsUpdate = true;
    }
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

  // 15b. MIRRORED DOUBLE WARDROBE
  static createMirroredWardrobe(style = 'modern', color = null) {
    const group = new THREE.Group();
    group.name = 'Mirrored Wardrobe';

    const wardrobeColor = color || (style === 'luxury' ? 0x1e293b : (style === 'traditional' ? 0x3e2723 : (style === 'minimalist' ? 0xf8fafc : 0x2b2d42)));

    group.userData = { type: 'mirrored_wardrobe', name: 'Mirrored Double Wardrobe', cost: 950, color: wardrobeColor };

    const bodyMat = new THREE.MeshStandardMaterial({
      color: wardrobeColor,
      roughness: style === 'luxury' ? 0.35 : (style === 'traditional' ? 0.5 : 0.7),
      metalness: style === 'luxury' ? 0.18 : 0.05
    });

    const mirrorMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.02,
      metalness: 0.98,
      side: THREE.DoubleSide
    });

    const mirrorFrameMat = new THREE.MeshStandardMaterial({
      color: style === 'luxury' ? 0xd4af37 : (style === 'traditional' ? 0x8b5a2b : 0x334155),
      metalness: style === 'luxury' ? 0.85 : 0.3,
      roughness: 0.3
    });

    const handleMat = new THREE.MeshStandardMaterial({
      color: style === 'luxury' ? 0xd4af37 : 0xd1d5db,
      metalness: 0.85,
      roughness: 0.2
    });

    const plinthMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.85
    });

    const width = 1.5;
    const height = 2.15;
    const depth = 0.62;
    const plinthH = 0.08;

    // Plinth base
    const plinth = this.createMesh(
      new THREE.BoxGeometry(width - 0.04, plinthH, depth - 0.04),
      plinthMat
    );
    plinth.position.y = plinthH / 2;
    group.add(plinth);

    // Main carcass body
    const bodyH = height - plinthH;
    const body = this.createMesh(
      new THREE.BoxGeometry(width, bodyH, depth),
      bodyMat
    );
    body.position.y = plinthH + bodyH / 2;
    group.add(body);

    // Double mirrored front doors
    const doorW = (width - 0.04) / 2;
    const doorH = bodyH - 0.06;

    [-1, 1].forEach(side => {
      // Door substrate / backing
      const doorGeom = new THREE.BoxGeometry(doorW - 0.01, doorH, 0.02);
      const door = this.createMesh(doorGeom, bodyMat);
      door.position.set(side * (doorW / 2 + 0.005), plinthH + bodyH / 2, depth / 2 + 0.01);
      group.add(door);

      // Mirror border frame on door
      const frameGeom = new THREE.BoxGeometry(doorW - 0.04, doorH - 0.06, 0.006);
      const mFrame = this.createMesh(frameGeom, mirrorFrameMat);
      mFrame.position.set(side * (doorW / 2 + 0.005), plinthH + bodyH / 2, depth / 2 + 0.022);
      group.add(mFrame);

      // High-reflection mirror pane
      const mirrorPaneGeom = new THREE.PlaneGeometry(doorW - 0.08, doorH - 0.1);
      const mirrorPane = this.createMesh(mirrorPaneGeom, mirrorMat, 'Mirror Door Glass');
      mirrorPane.position.set(side * (doorW / 2 + 0.005), plinthH + bodyH / 2, depth / 2 + 0.026);
      group.add(mirrorPane);

      // Vertical door handle
      const handleGeom = new THREE.CylinderGeometry(0.01, 0.01, 0.45, 16);
      const handle = this.createMesh(handleGeom, handleMat);
      handle.position.set(side * 0.07, plinthH + bodyH / 2, depth / 2 + 0.04);
      group.add(handle);
    });

    // Top crown molding
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

  // 19. KITCHEN CABINETS & COUNTER WITH INTEGRATED SINK & FAUCET
  static createKitchenCabinets(style = 'modern', color = 0x2c3e50) {
    const group = new THREE.Group();
    group.name = 'Kitchen Counter & Sink';
    group.userData = { type: 'kitchen_cabinets', name: 'Kitchen Counter & Sink', cost: 1850, color: color };

    const cabinetMat = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.6,
      metalness: 0.05
    });

    const counterMat = new THREE.MeshStandardMaterial({
      color: style === 'luxury' ? 0xf8fafc : 0xf1f5f9,
      roughness: 0.15,
      metalness: 0.05
    });

    const metalMat = new THREE.MeshStandardMaterial({
      color: style === 'luxury' ? 0xd4af37 : 0x94a3b8,
      metalness: 0.85,
      roughness: 0.2
    });

    const sinkMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.9,
      roughness: 0.2
    });

    const tileMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.3,
      metalness: 0.0
    });

    const totalW = 2.8, counterD = 0.65, counterH = 0.9, baseH = 0.86;

    // Base Cabinet Box
    const baseBox = this.createMesh(new THREE.BoxGeometry(totalW, baseH, counterD - 0.04), cabinetMat, 'Base Cabinets');
    baseBox.position.set(0, baseH / 2, 0);
    group.add(baseBox);

    // Toe Kick Recess
    const toeKick = this.createMesh(new THREE.BoxGeometry(totalW, 0.1, 0.06), new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 }), 'Toe Kick');
    toeKick.position.set(0, 0.05, counterD / 2 - 0.04);
    group.add(toeKick);

    // Countertop Slab
    const top = this.createMesh(new THREE.BoxGeometry(totalW + 0.04, 0.05, counterD + 0.02), counterMat, 'Quartz Countertop');
    top.position.set(0, counterH - 0.025, 0.01);
    group.add(top);

    // Double-basin Sink (recessed into countertop)
    const sinkLeft = this.createMesh(new THREE.BoxGeometry(0.38, 0.01, 0.4), sinkMat, 'Sink Basin Left');
    sinkLeft.position.set(-0.25, counterH + 0.001, 0);
    group.add(sinkLeft);

    const sinkRight = this.createMesh(new THREE.BoxGeometry(0.38, 0.01, 0.4), sinkMat, 'Sink Basin Right');
    sinkRight.position.set(0.2, counterH + 0.001, 0);
    group.add(sinkRight);

    // Sink Rim Trim
    const sinkRim = this.createMesh(new THREE.BoxGeometry(0.9, 0.02, 0.46), sinkMat, 'Sink Rim');
    sinkRim.position.set(-0.02, counterH + 0.01, 0);
    group.add(sinkRim);

    // Designer Gooseneck Faucet
    const faucetBase = this.createMesh(new THREE.CylinderGeometry(0.02, 0.025, 0.06, 16), metalMat, 'Faucet Base');
    faucetBase.position.set(-0.02, counterH + 0.03, -0.18);
    group.add(faucetBase);

    const faucetSpout = this.createMesh(new THREE.CylinderGeometry(0.012, 0.012, 0.32, 16), metalMat, 'Faucet Neck');
    faucetSpout.position.set(-0.02, counterH + 0.18, -0.16);
    faucetSpout.rotation.x = -0.15;
    group.add(faucetSpout);

    const faucetArch = this.createMesh(new THREE.TorusGeometry(0.07, 0.012, 12, 24, Math.PI), metalMat, 'Faucet Arch');
    faucetArch.position.set(-0.02, counterH + 0.32, -0.11);
    faucetArch.rotation.z = Math.PI;
    group.add(faucetArch);

    // Cabinet Handles
    const handleGeom = new THREE.BoxGeometry(0.14, 0.02, 0.02);
    [-1.0, -0.5, 0.5, 1.0].forEach((x, idx) => {
      const handle = this.createMesh(handleGeom, metalMat, `Cabinet Handle ${idx + 1}`);
      handle.position.set(x, counterH - 0.18, counterD / 2);
      group.add(handle);
    });

    // Tiled Backsplash Wall Panel
    const splashH = 0.65;
    const backsplash = this.createMesh(new THREE.BoxGeometry(totalW, splashH, 0.03), tileMat, 'Backsplash Tiles');
    backsplash.position.set(0, counterH + splashH / 2, -counterD / 2 + 0.01);
    group.add(backsplash);

    // Upper Wall Hanging Cabinets
    const upperH = 0.75, upperD = 0.35;
    const upper = this.createMesh(new THREE.BoxGeometry(totalW, upperH, upperD), cabinetMat, 'Upper Wall Cabinets');
    upper.position.set(0, counterH + splashH + upperH / 2, -counterD / 2 + upperD / 2);
    group.add(upper);

    // Under-Cabinet LED Glow Strip
    const ledMat = new THREE.MeshBasicMaterial({ color: 0xffedd5 });
    const ledStrip = new THREE.Mesh(new THREE.BoxGeometry(totalW - 0.1, 0.015, 0.04), ledMat);
    ledStrip.position.set(0, counterH + splashH, -counterD / 2 + upperD / 2);
    group.add(ledStrip);

    return group;
  }

  // 20. KITCHEN ISLAND WITH INDUCTION COOKTOP & SEATING OVERHANG
  static createKitchenIsland(style = 'modern', color = 0x334155) {
    const group = new THREE.Group();
    group.name = 'Kitchen Island';
    group.userData = { type: 'kitchen_island', name: 'Kitchen Island', cost: 1450, color: color };

    const islandW = 2.0, islandD = 1.0, islandH = 0.9;
    const baseW = 1.8, baseD = 0.7, baseH = 0.85;

    const baseMat = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.6,
      metalness: 0.05
    });

    const topMat = new THREE.MeshStandardMaterial({
      color: style === 'luxury' ? 0xf8fafc : 0xf1f5f9,
      roughness: 0.12,
      metalness: 0.05
    });

    const cooktopMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.1,
      metalness: 0.6
    });

    const metalMat = new THREE.MeshStandardMaterial({
      color: style === 'luxury' ? 0xd4af37 : 0x94a3b8,
      metalness: 0.85,
      roughness: 0.2
    });

    // Base Cabinet Box (Offset to allow seating overhang on one side)
    const base = this.createMesh(new THREE.BoxGeometry(baseW, baseH, baseD), baseMat, 'Island Base');
    base.position.set(0, baseH / 2, -0.1);
    group.add(base);

    // Waterfall / Beveled Quartz Countertop
    const top = this.createMesh(new THREE.BoxGeometry(islandW, 0.06, islandD), topMat, 'Island Countertop');
    top.position.set(0, islandH - 0.03, 0);
    group.add(top);

    // Flush Glass-Ceramic Induction Cooktop
    const cooktop = this.createMesh(new THREE.BoxGeometry(0.75, 0.008, 0.48), cooktopMat, 'Induction Cooktop');
    cooktop.position.set(-0.35, islandH + 0.005, -0.05);
    group.add(cooktop);

    // Cooktop Burner Ring Accents
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x64748b });
    [[-0.18, -0.1], [0.18, -0.1], [-0.18, 0.1], [0.18, 0.1]].forEach(([rx, rz]) => {
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.06, 0.075, 24), ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(-0.35 + rx, islandH + 0.01, -0.05 + rz);
      group.add(ring);
    });

    // Modern Pull Handles on island drawers
    [-0.5, 0, 0.5].forEach((hx, idx) => {
      const handle = this.createMesh(new THREE.BoxGeometry(0.18, 0.02, 0.02), metalMat, `Drawer Handle ${idx + 1}`);
      handle.position.set(hx, islandH - 0.2, -baseD / 2 - 0.1 - 0.01);
      group.add(handle);
    });

    return group;
  }

  // 21. FRENCH-DOOR SMART REFRIGERATOR
  static createRefrigerator(style = 'modern') {
    const group = new THREE.Group();
    group.name = 'Smart Refrigerator';
    group.userData = { type: 'refrigerator', name: 'Smart Refrigerator', cost: 1600 };

    const bodyMat = new THREE.MeshStandardMaterial({
      color: style === 'luxury' ? 0x0f172a : 0x94a3b8,
      metalness: style === 'luxury' ? 0.4 : 0.8,
      roughness: 0.25
    });

    const handleMat = new THREE.MeshStandardMaterial({
      color: style === 'luxury' ? 0xd4af37 : 0x334155,
      metalness: 0.9,
      roughness: 0.2
    });

    const dispMat = new THREE.MeshStandardMaterial({
      color: 0x020617,
      roughness: 0.1,
      metalness: 0.8
    });

    const w = 0.92, h = 1.88, d = 0.78;

    // Main Fridge Cabinet Body
    const body = this.createMesh(new THREE.BoxGeometry(w, h, d), bodyMat, 'Fridge Body');
    body.position.set(0, h / 2, 0);
    group.add(body);

    // Left Upper Door
    const leftDoor = this.createMesh(new THREE.BoxGeometry(w / 2 - 0.015, h * 0.58, 0.04), bodyMat, 'Left Upper Door');
    leftDoor.position.set(-w / 4 + 0.005, h * 0.68, d / 2 + 0.02);
    group.add(leftDoor);

    // Right Upper Door
    const rightDoor = this.createMesh(new THREE.BoxGeometry(w / 2 - 0.015, h * 0.58, 0.04), bodyMat, 'Right Upper Door');
    rightDoor.position.set(w / 4 - 0.005, h * 0.68, d / 2 + 0.02);
    group.add(rightDoor);

    // Lower Freezer Drawer
    const freezer = this.createMesh(new THREE.BoxGeometry(w - 0.02, h * 0.35, 0.04), bodyMat, 'Lower Freezer Drawer');
    freezer.position.set(0, h * 0.2, d / 2 + 0.02);
    group.add(freezer);

    // Vertical Door Handles
    const leftHandle = this.createMesh(new THREE.CylinderGeometry(0.012, 0.012, 0.6, 16), handleMat, 'Left Door Handle');
    leftHandle.position.set(-0.05, h * 0.66, d / 2 + 0.06);
    group.add(leftHandle);

    const rightHandle = this.createMesh(new THREE.CylinderGeometry(0.012, 0.012, 0.6, 16), handleMat, 'Right Door Handle');
    rightHandle.position.set(0.05, h * 0.66, d / 2 + 0.06);
    group.add(rightHandle);

    // Freezer Horizontal Handle
    const freezerHandle = this.createMesh(new THREE.BoxGeometry(0.55, 0.02, 0.03), handleMat, 'Freezer Handle');
    freezerHandle.position.set(0, h * 0.34, d / 2 + 0.06);
    group.add(freezerHandle);

    // Ice & Water Dispenser on Left Door
    const dispenser = this.createMesh(new THREE.BoxGeometry(0.2, 0.28, 0.01), dispMat, 'Ice & Water Dispenser');
    dispenser.position.set(-w / 4 + 0.005, h * 0.68, d / 2 + 0.045);
    group.add(dispenser);

    // Blue Indicator Light on Dispenser
    const indMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const indicator = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.01, 0.005), indMat);
    indicator.position.set(-w / 4 + 0.005, h * 0.79, d / 2 + 0.052);
    group.add(indicator);

    return group;
  }

  // 22. OVEN RANGE WITH CHIMNEY RANGE HOOD
  static createKitchenRange(style = 'modern') {
    const group = new THREE.Group();
    group.name = 'Oven Range & Hood';
    group.userData = { type: 'kitchen_range', name: 'Oven Range & Hood', cost: 1200 };

    const rangeMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.8,
      roughness: 0.25
    });

    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.1,
      metalness: 0.8
    });

    const grateMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.8,
      metalness: 0.5
    });

    const metalMat = new THREE.MeshStandardMaterial({
      color: style === 'luxury' ? 0xd4af37 : 0xe2e8f0,
      metalness: 0.9,
      roughness: 0.2
    });

    const w = 0.78, h = 0.9, d = 0.65;

    // Oven Body
    const body = this.createMesh(new THREE.BoxGeometry(w, h, d), rangeMat, 'Range Body');
    body.position.set(0, h / 2, 0);
    group.add(body);

    // Front Oven Glass Door
    const ovenDoor = this.createMesh(new THREE.BoxGeometry(w - 0.06, 0.45, 0.02), glassMat, 'Oven Glass Window');
    ovenDoor.position.set(0, 0.35, d / 2 + 0.01);
    group.add(ovenDoor);

    // Oven Handle Bar
    const handle = this.createMesh(new THREE.BoxGeometry(w - 0.18, 0.025, 0.04), metalMat, 'Oven Door Handle');
    handle.position.set(0, 0.6, d / 2 + 0.04);
    group.add(handle);

    // Control Panel Knobs
    [-0.24, -0.12, 0, 0.12, 0.24].forEach((kx, idx) => {
      const knob = this.createMesh(new THREE.CylinderGeometry(0.02, 0.02, 0.025, 16), metalMat, `Burner Knob ${idx + 1}`);
      knob.rotation.x = Math.PI / 2;
      knob.position.set(kx, h - 0.07, d / 2 + 0.015);
      group.add(knob);
    });

    // Cast Iron Cooktop Grates
    [-0.18, 0.18].forEach(gx => {
      const grate = this.createMesh(new THREE.BoxGeometry(0.32, 0.02, d - 0.1), grateMat, 'Cast Iron Grate');
      grate.position.set(gx, h + 0.01, 0);
      group.add(grate);
    });

    // Wall-Mounted Chimney Range Hood
    const hoodCanopy = this.createMesh(new THREE.BoxGeometry(w + 0.04, 0.1, d + 0.02), rangeMat, 'Range Hood Canopy');
    hoodCanopy.position.set(0, 1.7, 0.01);
    group.add(hoodCanopy);

    const chimney = this.createMesh(new THREE.BoxGeometry(0.28, 0.95, 0.26), rangeMat, 'Hood Chimney Duct');
    chimney.position.set(0, 2.2, -d / 2 + 0.15);
    group.add(chimney);

    return group;
  }

  // 23. COUNTER-HEIGHT BAR STOOL
  static createBarStool(style = 'modern', color = 0xd97706, stoolIndex = 1) {
    const group = new THREE.Group();
    group.name = stoolIndex ? `Bar Stool ${stoolIndex}` : 'Bar Stool';
    group.userData = { type: 'bar_stool', name: group.name, cost: 180, color: color };

    const seatMat = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.8
    });

    const metalMat = new THREE.MeshStandardMaterial({
      color: style === 'luxury' ? 0xd4af37 : 0x1e293b,
      metalness: 0.85,
      roughness: 0.25
    });

    const seatH = 0.65; // Counter height

    // Circular Cushioned Swivel Seat
    const seat = this.createMesh(new THREE.CylinderGeometry(0.19, 0.19, 0.07, 24), seatMat, 'Bar Stool Cushion');
    seat.position.y = seatH;
    group.add(seat);

    // Ergonomic Low Backrest Lip
    const backLip = this.createMesh(new THREE.CylinderGeometry(0.2, 0.2, 0.12, 24, 1, true, -Math.PI / 2, Math.PI), seatMat, 'Bar Stool Backrest');
    backLip.position.set(0, seatH + 0.08, 0);
    group.add(backLip);

    // 4 Slender Tapered Legs
    const legSpread = 0.15;
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([lx, lz], idx) => {
      const leg = this.createMesh(new THREE.CylinderGeometry(0.012, 0.018, seatH, 12), metalMat, `Stool Leg ${idx + 1}`);
      leg.position.set(lx * legSpread, seatH / 2, lz * legSpread);
      group.add(leg);
    });

    // Circular Footrest Ring
    const footrest = this.createMesh(new THREE.TorusGeometry(0.18, 0.012, 8, 24), metalMat, 'Footrest Ring');
    footrest.rotation.x = Math.PI / 2;
    footrest.position.set(0, 0.24, 0);
    group.add(footrest);

    return group;
  }

  // 24. FRONT-LOADING WASHING MACHINE (DAILY LAUNDRY)
  static createWashingMachine(style = 'modern', color = 0xf8fafc) {
    const group = new THREE.Group();
    group.name = 'Washing Machine';
    group.userData = { type: 'washing_machine', name: 'Front-Load Washing Machine', cost: 650, color: color };

    const w = 0.6, h = 0.85, d = 0.6;
    const bodyMat = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.35,
      metalness: 0.15
    });
    const darkMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.2,
      metalness: 0.7
    });
    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.9,
      roughness: 0.15
    });
    const screenMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });

    // Main Chassis Body
    const body = this.createMesh(new THREE.BoxGeometry(w, h - 0.04, d - 0.02), bodyMat, 'Washer Body');
    body.position.set(0, (h - 0.04) / 2 + 0.02, 0);
    group.add(body);

    // Top Worktop Lid
    const top = this.createMesh(new THREE.BoxGeometry(w + 0.01, 0.03, d + 0.01), bodyMat, 'Top Counter Lid');
    top.position.set(0, h - 0.015, 0);
    group.add(top);

    // Front Control Panel Band (top front)
    const panel = this.createMesh(new THREE.BoxGeometry(w - 0.02, 0.14, 0.02), darkMat, 'Control Panel');
    panel.position.set(0, h - 0.1, d / 2);
    group.add(panel);

    // Detergent Dispenser Drawer (top-left)
    const drawer = this.createMesh(new THREE.BoxGeometry(0.16, 0.09, 0.025), bodyMat, 'Detergent Drawer');
    drawer.position.set(-w / 2 + 0.11, h - 0.1, d / 2 + 0.005);
    group.add(drawer);

    // Central Rotary Program Selector Knob
    const knob = this.createMesh(new THREE.CylinderGeometry(0.035, 0.035, 0.025, 24), chromeMat, 'Program Dial');
    knob.rotation.x = Math.PI / 2;
    knob.position.set(0.04, h - 0.1, d / 2 + 0.015);
    group.add(knob);

    // Digital LED Timer Display (top-right)
    const screen = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.04, 0.01), screenMat);
    screen.position.set(w / 2 - 0.09, h - 0.09, d / 2 + 0.012);
    group.add(screen);

    // Front Loading Porthole Door Rim (circular chrome trim)
    const doorRim = this.createMesh(new THREE.TorusGeometry(0.2, 0.025, 16, 32), chromeMat, 'Door Rim');
    doorRim.position.set(0, 0.38, d / 2 + 0.005);
    group.add(doorRim);

    // Tinted Door Glass Window
    const doorGlass = this.createMesh(new THREE.CylinderGeometry(0.18, 0.18, 0.02, 24), darkMat, 'Porthole Glass');
    doorGlass.rotation.x = Math.PI / 2;
    doorGlass.position.set(0, 0.38, d / 2 + 0.005);
    group.add(doorGlass);

    // Integrated Door Latch Handle
    const handle = this.createMesh(new THREE.BoxGeometry(0.025, 0.09, 0.02), chromeMat, 'Door Latch Handle');
    handle.position.set(0.2, 0.38, d / 2 + 0.02);
    group.add(handle);

    // 4 Rubber Leveling Feet
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([fx, fz], idx) => {
      const foot = this.createMesh(new THREE.CylinderGeometry(0.025, 0.025, 0.02, 12), darkMat, `Leveling Foot ${idx + 1}`);
      foot.position.set(fx * (w / 2 - 0.05), 0.01, fz * (d / 2 - 0.05));
      group.add(foot);
    });

    return group;
  }

  // 25. COUNTERTOP MICROWAVE OVEN (DAILY COOKING & HEATING)
  static createMicrowave(style = 'modern', color = 0x1e293b) {
    const group = new THREE.Group();
    group.name = 'Microwave Oven';
    group.userData = { type: 'microwave', name: 'Digital Microwave Oven', cost: 220, color: color };

    const w = 0.54, h = 0.32, d = 0.38;
    const bodyMat = new THREE.MeshStandardMaterial({
      color: color,
      metalness: style === 'luxury' ? 0.8 : 0.4,
      roughness: 0.3
    });
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x020617,
      metalness: 0.9,
      roughness: 0.1
    });
    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.9,
      roughness: 0.15
    });
    const displayMat = new THREE.MeshBasicMaterial({ color: 0x22c55e });

    // Microwave Body Casing
    const body = this.createMesh(new THREE.BoxGeometry(w, h, d), bodyMat, 'Microwave Casing');
    body.position.set(0, h / 2, 0);
    group.add(body);

    // Front Glass Viewing Door (Left side of front)
    const doorW = 0.36;
    const door = this.createMesh(new THREE.BoxGeometry(doorW, h - 0.04, 0.015), glassMat, 'Microwave Glass Door');
    door.position.set(-w / 2 + doorW / 2 + 0.02, h / 2, d / 2 + 0.008);
    group.add(door);

    // Vertical Door Pull Handle
    const handle = this.createMesh(new THREE.BoxGeometry(0.02, h * 0.55, 0.025), chromeMat, 'Door Pull Handle');
    handle.position.set(-w / 2 + doorW - 0.01, h / 2, d / 2 + 0.02);
    group.add(handle);

    // Control Panel on Right side
    const panelW = w - doorW - 0.04;
    const panel = this.createMesh(new THREE.BoxGeometry(panelW, h - 0.04, 0.01), bodyMat, 'Touch Control Panel');
    panel.position.set(w / 2 - panelW / 2 - 0.015, h / 2, d / 2 + 0.006);
    group.add(panel);

    // Digital LED Clock Display
    const display = new THREE.Mesh(new THREE.BoxGeometry(panelW - 0.02, 0.04, 0.005), displayMat);
    display.position.set(w / 2 - panelW / 2 - 0.015, h - 0.07, d / 2 + 0.012);
    group.add(display);

    // Keypad Buttons & Dial
    const dial = this.createMesh(new THREE.CylinderGeometry(0.02, 0.02, 0.015, 16), chromeMat, 'Time Dial Knob');
    dial.rotation.x = Math.PI / 2;
    dial.position.set(w / 2 - panelW / 2 - 0.015, 0.1, d / 2 + 0.015);
    group.add(dial);

    // 4 Rubber Feet
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([fx, fz], idx) => {
      const foot = this.createMesh(new THREE.CylinderGeometry(0.018, 0.018, 0.015, 12), glassMat, `Foot ${idx + 1}`);
      foot.position.set(fx * (w / 2 - 0.04), 0.008, fz * (d / 2 - 0.04));
      group.add(foot);
    });

    return group;
  }

  // 26. WALL-MOUNTED SPLIT AIR CONDITIONER (DAILY CLIMATE CONTROL)
  static createAirConditioner(style = 'modern') {
    const group = new THREE.Group();
    group.name = 'Split Air Conditioner';
    group.userData = { type: 'air_conditioner', name: 'Smart Inverter Split AC', cost: 780, isWallMounted: true };

    const w = 0.92, h = 0.3, d = 0.22;
    const whiteMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.3,
      metalness: 0.1
    });
    const trimMat = new THREE.MeshStandardMaterial({
      color: style === 'luxury' ? 0xd4af37 : 0x94a3b8,
      metalness: 0.8,
      roughness: 0.2
    });
    const ledMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });

    // Main Curved Indoor AC Unit Body
    const body = this.createMesh(new THREE.BoxGeometry(w, h, d), whiteMat, 'AC Chassis');
    group.add(body);

    // Front Decorative Accent Trim Strip
    const trim = this.createMesh(new THREE.BoxGeometry(w + 0.005, 0.015, 0.01), trimMat, 'Chrome Trim Strip');
    trim.position.set(0, -0.05, d / 2 + 0.005);
    group.add(trim);

    // Bottom Air Discharge Louver Blade (slight tilt downward)
    const louver = this.createMesh(new THREE.BoxGeometry(w - 0.08, 0.04, 0.015), whiteMat, 'Airflow Louver Blade');
    louver.rotation.x = 0.25;
    louver.position.set(0, -h / 2 + 0.02, d / 2 - 0.02);
    group.add(louver);

    // Hidden Digital Temperature Glow Display (Right side showing 22°C)
    const tempDisplay = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.03, 0.005), ledMat);
    tempDisplay.position.set(w / 2 - 0.12, 0.02, d / 2 + 0.003);
    group.add(tempDisplay);

    // Power Indicator LED Dot
    const powerLed = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.005, 12), new THREE.MeshBasicMaterial({ color: 0x22c55e }));
    powerLed.rotation.x = Math.PI / 2;
    powerLed.position.set(w / 2 - 0.05, -0.05, d / 2 + 0.006);
    group.add(powerLed);

    return group;
  }

  // 27. CEILING FAN WITH INTEGRATED LIGHT (DAILY AIR CIRCULATION)
  static createCeilingFan(style = 'modern', color = 0x2c3e50) {
    const group = new THREE.Group();
    group.name = 'Ceiling Fan';
    group.userData = { type: 'ceiling_fan', name: 'Aero 4-Blade Ceiling Fan', cost: 190, color: color };

    const canopyY = 2.7; // Ceiling mounting level

    const motorMat = new THREE.MeshStandardMaterial({
      color: color,
      metalness: style === 'luxury' ? 0.85 : 0.5,
      roughness: 0.3
    });
    const bladeMat = new THREE.MeshStandardMaterial({
      color: style === 'luxury' ? 0x3e2723 : color,
      roughness: 0.6,
      metalness: 0.1
    });
    const lightMat = new THREE.MeshBasicMaterial({ color: 0xfff3d6 });
    const metalMat = new THREE.MeshStandardMaterial({
      color: style === 'luxury' ? 0xd4af37 : 0x64748b,
      metalness: 0.85,
      roughness: 0.2
    });

    // Ceiling Mount Canopy Plate
    const canopy = this.createMesh(new THREE.CylinderGeometry(0.12, 0.12, 0.03, 24), motorMat, 'Ceiling Canopy');
    canopy.position.y = canopyY;
    group.add(canopy);

    // Vertical Downrod Suspension Pipe
    const downrod = this.createMesh(new THREE.CylinderGeometry(0.015, 0.015, 0.28, 16), metalMat, 'Downrod');
    downrod.position.y = canopyY - 0.14;
    group.add(downrod);

    // Central Motor Housing
    const motorH = 0.12;
    const motor = this.createMesh(new THREE.CylinderGeometry(0.16, 0.14, motorH, 32), motorMat, 'Fan Motor Housing');
    motor.position.y = canopyY - 0.28;
    group.add(motor);

    // Integrated Bottom LED Light Dome
    const globe = new THREE.Mesh(new THREE.SphereGeometry(0.09, 24, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), lightMat);
    globe.position.y = canopyY - 0.34;
    group.add(globe);

    // 4 Aerodynamic Fan Blades radiating out
    const bladeL = 0.46, bladeW = 0.12;
    [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].forEach((angle, idx) => {
      const bladeArm = new THREE.Group();
      bladeArm.rotation.y = angle;
      bladeArm.position.y = canopyY - 0.28;

      // Chrome blade bracket
      const bracket = this.createMesh(new THREE.BoxGeometry(0.08, 0.015, 0.03), metalMat, `Blade Bracket ${idx + 1}`);
      bracket.position.x = 0.16;
      bladeArm.add(bracket);

      // Aerodynamic Tapered Blade
      const blade = this.createMesh(new THREE.BoxGeometry(bladeL, 0.008, bladeW), bladeMat, `Fan Blade ${idx + 1}`);
      blade.position.x = 0.16 + bladeL / 2;
      blade.rotation.x = 0.12; // Realistic aerodynamic pitch tilt
      bladeArm.add(blade);

      group.add(bladeArm);
    });

    return group;
  }

  // 28. ESPRESSO & COFFEE MACHINE STATION (DAILY MORNING COFFEE)
  static createCoffeeMachine(style = 'modern') {
    const group = new THREE.Group();
    group.name = 'Coffee Machine';
    group.userData = { type: 'coffee_machine', name: 'Barista Espresso Machine', cost: 350 };

    const w = 0.28, h = 0.38, d = 0.32;
    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      metalness: 0.9,
      roughness: 0.15
    });
    const darkMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.7,
      roughness: 0.3
    });
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.9,
      roughness: 0.2
    });

    // Main Espresso Machine Body
    const body = this.createMesh(new THREE.BoxGeometry(w, h, d), chromeMat, 'Espresso Body');
    body.position.set(0, h / 2, 0);
    group.add(body);

    // Top Warming Tray with Railing
    const rail = this.createMesh(new THREE.BoxGeometry(w - 0.02, 0.02, d - 0.04), chromeMat, 'Cup Warming Rail');
    rail.position.set(0, h + 0.01, 0);
    group.add(rail);

    // Group Head & Portafilter Collar
    const collar = this.createMesh(new THREE.CylinderGeometry(0.045, 0.045, 0.04, 24), chromeMat, 'Group Head');
    collar.position.set(0, 0.23, d / 2 + 0.02);
    group.add(collar);

    // Portafilter Handle extending forward
    const portafilter = this.createMesh(new THREE.CylinderGeometry(0.012, 0.012, 0.16, 12), darkMat, 'Portafilter Handle');
    portafilter.rotation.x = Math.PI / 2;
    portafilter.position.set(0, 0.22, d / 2 + 0.1);
    group.add(portafilter);

    // Dual Espresso Spouts
    [-0.015, 0.015].forEach((sx, idx) => {
      const spout = this.createMesh(new THREE.CylinderGeometry(0.005, 0.005, 0.025, 8), chromeMat, `Spout ${idx + 1}`);
      spout.position.set(sx, 0.19, d / 2 + 0.02);
      group.add(spout);
    });

    // Bottom Stainless Steel Drip Tray
    const drip = this.createMesh(new THREE.BoxGeometry(w - 0.02, 0.04, 0.12), chromeMat, 'Drip Tray Grille');
    drip.position.set(0, 0.02, d / 2 + 0.04);
    group.add(drip);

    // Analog Pressure Gauge Dial
    const gauge = this.createMesh(new THREE.CylinderGeometry(0.025, 0.025, 0.01, 16), brassMat, 'Pressure Gauge');
    gauge.rotation.x = Math.PI / 2;
    gauge.position.set(0, 0.31, d / 2 + 0.005);
    group.add(gauge);

    // Steaming Wand on side
    const wand = this.createMesh(new THREE.CylinderGeometry(0.006, 0.006, 0.18, 8), chromeMat, 'Milk Steam Wand');
    wand.rotation.z = -0.3;
    wand.position.set(w / 2 + 0.02, 0.2, d / 2 - 0.05);
    group.add(wand);

    return group;
  }

  // 29. ENTRYWAY SHOE RACK & BENCH (DAILY SHOE STORAGE)
  static createShoeRack(style = 'modern', woodColor = 0x5c4033) {
    const group = new THREE.Group();
    group.name = 'Shoe Rack & Bench';
    group.userData = { type: 'shoe_rack', name: 'Entryway Shoe Rack Bench', cost: 240, color: woodColor };

    const w = 0.95, h = 0.48, d = 0.35;
    const woodMat = new THREE.MeshStandardMaterial({
      color: woodColor,
      roughness: 0.65,
      metalness: 0.1
    });
    const cushionMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.85
    });
    const slatMat = new THREE.MeshStandardMaterial({
      color: style === 'luxury' ? 0xd4af37 : 0x1e293b,
      metalness: 0.8,
      roughness: 0.3
    });

    // 4 Corner Legs
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([lx, lz], idx) => {
      const leg = this.createMesh(new THREE.BoxGeometry(0.04, h - 0.05, 0.04), woodMat, `Shoe Rack Leg ${idx + 1}`);
      leg.position.set(lx * (w / 2 - 0.03), (h - 0.05) / 2, lz * (d / 2 - 0.03));
      group.add(leg);
    });

    // Top Bench Cushion
    const cushion = this.createMesh(new THREE.BoxGeometry(w, 0.06, d), cushionMat, 'Padded Bench Cushion');
    cushion.position.set(0, h - 0.03, 0);
    group.add(cushion);

    // 2 Tier Slatted Metal Shoe Shelves (Lower and Upper)
    [0.12, 0.26].forEach((shelfY, tier) => {
      [-0.1, 0, 0.1].forEach((slatZ, sIdx) => {
        const slat = this.createMesh(new THREE.BoxGeometry(w - 0.08, 0.015, 0.02), slatMat, `Tier ${tier + 1} Slat ${sIdx + 1}`);
        slat.position.set(0, shelfY, slatZ);
        group.add(slat);
      });
    });

    return group;
  }

  // 30. COAT RACK & HAT TREE STAND (DAILY ENTRYWAY ESSENTIAL)
  static createCoatRack(style = 'modern') {
    const group = new THREE.Group();
    group.name = 'Coat Rack Stand';
    group.userData = { type: 'coat_rack', name: 'Modern Coat & Hat Tree', cost: 140 };

    const totalH = 1.76;
    const metalMat = new THREE.MeshStandardMaterial({
      color: style === 'luxury' ? 0xd4af37 : 0x1e293b,
      metalness: 0.85,
      roughness: 0.25
    });
    const tipMat = new THREE.MeshStandardMaterial({
      color: 0x8b5a2b,
      roughness: 0.6
    });

    // Heavy Circular Base Disc
    const base = this.createMesh(new THREE.CylinderGeometry(0.18, 0.18, 0.04, 24), metalMat, 'Weighted Base');
    base.position.y = 0.02;
    group.add(base);

    // Central Vertical Pole
    const pole = this.createMesh(new THREE.CylinderGeometry(0.018, 0.022, totalH - 0.04, 16), metalMat, 'Central Pole');
    pole.position.y = totalH / 2;
    group.add(pole);

    // Umbrella Ring at lower height (0.65m)
    const ring = this.createMesh(new THREE.TorusGeometry(0.12, 0.01, 8, 24), metalMat, 'Umbrella Ring');
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.65;
    group.add(ring);

    // 6 Staggered Angled Peg Hooks
    const pegHeights = [1.25, 1.4, 1.55, 1.62, 1.68, 1.74];
    pegHeights.forEach((ph, idx) => {
      const angle = idx * (Math.PI / 3);
      const hookGroup = new THREE.Group();
      hookGroup.position.y = ph;
      hookGroup.rotation.y = angle;

      const hookPeg = this.createMesh(new THREE.CylinderGeometry(0.008, 0.008, 0.14, 8), metalMat, `Hook Arm ${idx + 1}`);
      hookPeg.rotation.z = -0.55;
      hookPeg.position.set(0.06, 0.03, 0);
      hookGroup.add(hookPeg);

      const tip = this.createMesh(new THREE.SphereGeometry(0.014, 12, 12), tipMat, `Hook Tip ${idx + 1}`);
      tip.position.set(0.12, 0.06, 0);
      hookGroup.add(tip);

      group.add(hookGroup);
    });

    return group;
  }

  // 31. STEP WASTE BIN / TRASH CAN (DAILY CLEANLINESS)
  static createTrashBin(style = 'modern') {
    const group = new THREE.Group();
    group.name = 'Trash Bin';
    group.userData = { type: 'trash_bin', name: 'Step Pedal Waste Bin', cost: 60 };

    const radius = 0.13, h = 0.42;
    const bodyMat = new THREE.MeshStandardMaterial({
      color: style === 'luxury' ? 0xd4af37 : 0xe2e8f0,
      metalness: 0.85,
      roughness: 0.2
    });
    const darkMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.7
    });

    // Cylinder Waste Bin Body
    const bin = this.createMesh(new THREE.CylinderGeometry(radius, radius, h, 24), bodyMat, 'Bin Cylinder');
    bin.position.y = h / 2;
    group.add(bin);

    // Domed Hinged Lid
    const lid = this.createMesh(new THREE.CylinderGeometry(radius + 0.005, radius + 0.005, 0.025, 24), bodyMat, 'Bin Lid');
    lid.position.y = h + 0.012;
    group.add(lid);

    // Step Foot Pedal at base
    const pedal = this.createMesh(new THREE.BoxGeometry(0.06, 0.015, 0.07), darkMat, 'Foot Pedal');
    pedal.position.set(0, 0.015, radius + 0.03);
    group.add(pedal);

    return group;
  }

  // 32. LAUNDRY HAMPER / CLOTHES BASKET (DAILY CLOTHES)
  static createLaundryBasket(style = 'modern', color = 0xdfd3c3) {
    const group = new THREE.Group();
    group.name = 'Laundry Hamper';
    group.userData = { type: 'laundry_basket', name: 'Woven Laundry Hamper', cost: 75, color: color };

    const w = 0.42, h = 0.62, d = 0.32;
    const basketMat = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.9,
      metalness: 0.05
    });
    const linerMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.95
    });
    const handleMat = new THREE.MeshStandardMaterial({
      color: 0x5c4033,
      roughness: 0.8
    });

    // Hamper Body
    const body = this.createMesh(new THREE.BoxGeometry(w, h, d), basketMat, 'Hamper Basket Body');
    body.position.set(0, h / 2, 0);
    group.add(body);

    // Fabric Top Liner Rim
    const liner = this.createMesh(new THREE.BoxGeometry(w + 0.02, 0.04, d + 0.02), linerMat, 'Fabric Liner Lip');
    liner.position.set(0, h - 0.02, 0);
    group.add(liner);

    // Hinged Lid
    const lid = this.createMesh(new THREE.BoxGeometry(w + 0.01, 0.03, d + 0.01), basketMat, 'Hamper Lid');
    lid.position.set(0, h + 0.015, 0);
    group.add(lid);

    // Top Leather Handle Loop
    const handle = this.createMesh(new THREE.BoxGeometry(0.08, 0.02, 0.025), handleMat, 'Lid Pull Handle');
    handle.position.set(0, h + 0.035, 0);
    group.add(handle);

    return group;
  }

  // 33. MINIMALIST WALL CLOCK (DAILY TIMEKEEPING)
  static createWallClock(style = 'modern') {
    const group = new THREE.Group();
    group.name = 'Wall Clock';
    group.userData = { type: 'wall_clock', name: 'Minimalist Wall Clock', cost: 85, isWallMounted: true };

    const radius = 0.22, depth = 0.03;
    const rimMat = new THREE.MeshStandardMaterial({
      color: style === 'luxury' ? 0xd4af37 : 0x1e293b,
      metalness: 0.85,
      roughness: 0.2
    });
    const faceMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.4
    });
    const handMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.8,
      roughness: 0.2
    });

    // Clock Face Dial (facing along Z)
    const face = this.createMesh(new THREE.CylinderGeometry(radius, radius, depth, 32), faceMat, 'Clock Dial');
    face.rotation.x = Math.PI / 2;
    group.add(face);

    // Outer Rim Bezel
    const rim = this.createMesh(new THREE.TorusGeometry(radius, 0.012, 12, 32), rimMat, 'Bezel Ring');
    rim.position.z = depth / 2;
    group.add(rim);

    // Hour Hand (pointing toward 10 o'clock)
    const hourHand = this.createMesh(new THREE.BoxGeometry(0.012, 0.09, 0.005), handMat, 'Hour Hand');
    hourHand.rotation.z = Math.PI / 3;
    hourHand.position.set(-0.04, 0.03, depth / 2 + 0.005);
    group.add(hourHand);

    // Minute Hand (pointing toward 2 o'clock)
    const minuteHand = this.createMesh(new THREE.BoxGeometry(0.008, 0.13, 0.005), handMat, 'Minute Hand');
    minuteHand.rotation.z = -Math.PI / 4;
    minuteHand.position.set(0.04, 0.05, depth / 2 + 0.007);
    group.add(minuteHand);

    // Center Chrome Cap
    const cap = this.createMesh(new THREE.CylinderGeometry(0.012, 0.012, 0.008, 16), rimMat, 'Center Cap');
    cap.rotation.x = Math.PI / 2;
    cap.position.z = depth / 2 + 0.01;
    group.add(cap);

    return group;
  }

  // 34. BEDSIDE / DESK TABLE LAMP (DAILY READING & AMBIENT LIGHT)
  static createTableLamp(style = 'modern', color = 0xd97706) {
    const group = new THREE.Group();
    group.name = 'Table Lamp';
    group.userData = { type: 'table_lamp', name: 'Bedside Table Lamp', cost: 95, color: color };

    const totalH = 0.52;
    const baseMat = new THREE.MeshStandardMaterial({
      color: style === 'luxury' ? 0xd4af37 : 0x1e293b,
      metalness: 0.85,
      roughness: 0.2
    });
    const shadeMat = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.8,
      metalness: 0.1
    });
    const glowMat = new THREE.MeshBasicMaterial({ color: 0xfff4db });

    // Lamp Base Pedestal
    const base = this.createMesh(new THREE.CylinderGeometry(0.09, 0.1, 0.03, 24), baseMat, 'Lamp Base');
    base.position.y = 0.015;
    group.add(base);

    // Slender Stem Column
    const stem = this.createMesh(new THREE.CylinderGeometry(0.01, 0.01, totalH * 0.55, 16), baseMat, 'Lamp Stem');
    stem.position.y = 0.16;
    group.add(stem);

    // Cylindrical Fabric Drum Shade
    const shadeH = 0.22, shadeR = 0.13;
    const shade = this.createMesh(new THREE.CylinderGeometry(shadeR, shadeR, shadeH, 24, 1, true), shadeMat, 'Fabric Drum Shade');
    shade.position.y = totalH - shadeH / 2;
    group.add(shade);

    // Internal Glowing Bulb
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.035, 16, 16), glowMat);
    bulb.position.y = totalH - shadeH / 2;
    group.add(bulb);

    return group;
  }

  // 35. COMFORT OTTOMAN / POUF FOOTREST (DAILY LIVING & RESTING)
  static createOttoman(style = 'modern', color = 0xd97706) {
    const group = new THREE.Group();
    group.name = 'Comfort Ottoman';
    group.userData = { type: 'ottoman', name: 'Comfort Ottoman Pouf', cost: 180, color: color };

    const radius = 0.32, h = 0.42;
    const fabricMat = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.85,
      metalness: 0.05
    });
    const woodMat = new THREE.MeshStandardMaterial({
      color: 0x3e2723,
      roughness: 0.7
    });

    // Low Wooden Base Plinth
    const plinth = this.createMesh(new THREE.CylinderGeometry(radius * 0.85, radius * 0.85, 0.04, 24), woodMat, 'Ottoman Base');
    plinth.position.y = 0.02;
    group.add(plinth);

    // Main Upholstered Cylinder Cushion
    const cushion = this.createMesh(new THREE.CylinderGeometry(radius, radius, h - 0.04, 32), fabricMat, 'Upholstered Pouf');
    cushion.position.y = (h - 0.04) / 2 + 0.03;
    group.add(cushion);

    // Domed Tufted Top
    const top = this.createMesh(new THREE.SphereGeometry(radius, 24, 12, 0, Math.PI * 2, 0, Math.PI / 4), fabricMat, 'Tufted Top');
    top.position.y = h - 0.08;
    group.add(top);

    return group;
  }

  // 36. WINDOW DRAPERY CURTAINS (DAILY PRIVACY & LIGHT CONTROL)
  static createCurtains(style = 'modern', color = 0xf1f5f9) {
    const group = new THREE.Group();
    group.name = 'Window Curtains';
    group.userData = { type: 'curtains', name: 'Tailored Window Drapes', cost: 210, isWallMounted: true, color: color };

    const rodW = 1.9, curH = 2.2;
    const rodMat = new THREE.MeshStandardMaterial({
      color: style === 'luxury' ? 0xd4af37 : 0x1e293b,
      metalness: 0.85,
      roughness: 0.2
    });
    const fabricMat = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.9,
      metalness: 0.05
    });

    // Top Horizontal Curtain Rod
    const rod = this.createMesh(new THREE.CylinderGeometry(0.015, 0.015, rodW, 16), rodMat, 'Curtain Rod');
    rod.rotation.z = Math.PI / 2;
    rod.position.y = curH / 2;
    group.add(rod);

    // Decorative Spherical Finials on Rod Ends
    [-rodW / 2 - 0.02, rodW / 2 + 0.02].forEach((fx, idx) => {
      const finial = this.createMesh(new THREE.SphereGeometry(0.025, 12, 12), rodMat, `Rod Finial ${idx + 1}`);
      finial.position.set(fx, curH / 2, 0);
      group.add(finial);
    });

    // Left and Right Pleated Curtain Panels
    [-0.55, 0.55].forEach((panelX, pIdx) => {
      const panelGroup = new THREE.Group();
      panelGroup.position.set(panelX, 0, 0.02);

      // Multiple vertical folds to simulate realistic drape pleating
      [-0.15, -0.05, 0.05, 0.15].forEach((foldX, fIdx) => {
        const fold = this.createMesh(new THREE.CylinderGeometry(0.04, 0.045, curH - 0.06, 12), fabricMat, `Pleat ${fIdx + 1}`);
        fold.position.set(foldX, 0, (fIdx % 2 === 0 ? 0.015 : -0.015));
        panelGroup.add(fold);
      });

      group.add(panelGroup);
    });

    return group;
  }

  // 37. WALL-MOUNTED RO WATER PURIFIER (DAILY CLEAN WATER)
  static createWaterPurifier(style = 'modern') {
    const group = new THREE.Group();
    group.name = 'Water Purifier';
    group.userData = { type: 'water_purifier', name: 'RO Water Purifier & Dispenser', cost: 320, isWallMounted: true };

    const w = 0.32, h = 0.46, d = 0.22;
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.3,
      metalness: 0.1
    });
    const tankMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.1,
      metalness: 0.8
    });
    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.9,
      roughness: 0.15
    });

    // Main Purifier Cabinet
    const body = this.createMesh(new THREE.BoxGeometry(w, h, d), bodyMat, 'Purifier Cabinet');
    group.add(body);

    // Front Transparent Water Reservoir Window
    const tank = this.createMesh(new THREE.BoxGeometry(w - 0.06, h * 0.45, 0.01), tankMat, 'Water Level Window');
    tank.position.set(0, 0.05, d / 2 + 0.005);
    group.add(tank);

    // Bottom Chrome Dispensing Spigot Tap
    const tap = this.createMesh(new THREE.CylinderGeometry(0.012, 0.012, 0.05, 12), chromeMat, 'Dispensing Tap');
    tap.position.set(0, -h / 2 + 0.05, d / 2 + 0.03);
    group.add(tap);

    // LED Status Indicator Dots
    const ledMat = new THREE.MeshBasicMaterial({ color: 0x22c55e });
    const led = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.01, 0.005), ledMat);
    led.position.set(0, -h / 2 + 0.12, d / 2 + 0.005);
    group.add(led);

    return group;
  }

  // 38. MODERN CERAMIC TOILET COMMODE (BATHROOM SUITE)
  static createToilet(style = 'modern') {
    const group = new THREE.Group();
    group.name = 'Modern Toilet';
    group.userData = { type: 'toilet', name: 'Ceramic Toilet Commode', cost: 280 };

    const porcelainMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.1,
      metalness: 0.05
    });
    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.9,
      roughness: 0.15
    });

    // Base pedestal
    const base = this.createMesh(new THREE.CylinderGeometry(0.16, 0.19, 0.38, 16), porcelainMat, 'Toilet Base');
    base.position.set(0, 0.19, 0);
    group.add(base);

    // Oval Bowl
    const bowl = this.createMesh(new THREE.CylinderGeometry(0.22, 0.18, 0.16, 16), porcelainMat, 'Toilet Bowl');
    bowl.position.set(0, 0.38, 0.08);
    bowl.scale.set(0.9, 1.0, 1.25);
    group.add(bowl);

    // Seat and Closed Lid
    const lidMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.15 });
    const lid = this.createMesh(new THREE.CylinderGeometry(0.23, 0.23, 0.03, 16), lidMat, 'Toilet Lid');
    lid.position.set(0, 0.47, 0.09);
    lid.scale.set(0.9, 1.0, 1.25);
    group.add(lid);

    // Cistern Tank
    const cistern = this.createMesh(new THREE.BoxGeometry(0.42, 0.44, 0.22), porcelainMat, 'Cistern Tank');
    cistern.position.set(0, 0.54, -0.16);
    group.add(cistern);

    // Dual Flush Chrome Buttons
    const flushBtn = this.createMesh(new THREE.CylinderGeometry(0.025, 0.025, 0.015, 12), chromeMat, 'Dual Flush Button');
    flushBtn.position.set(0, 0.765, -0.16);
    group.add(flushBtn);

    return group;
  }

  // 39. TEMPERED GLASS WALK-IN SHOWER CABIN
  static createShowerEnclosure(width = 1.1, depth = 1.0) {
    const group = new THREE.Group();
    group.name = 'Glass Shower Enclosure';
    group.userData = { type: 'shower', name: 'Walk-in Glass Shower Enclosure', cost: 650 };

    const trayMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.2 });
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x93c5fd,
      roughness: 0.05,
      metalness: 0.1,
      transparent: true,
      opacity: 0.4
    });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.15 });

    // Raised Slim Acrylic Shower Base Tray
    const tray = this.createMesh(new THREE.BoxGeometry(width, 0.06, depth), trayMat, 'Shower Tray');
    tray.position.set(0, 0.03, 0);
    group.add(tray);

    // Chrome Drain
    const drain = this.createMesh(new THREE.CylinderGeometry(0.04, 0.04, 0.01, 16), chromeMat, 'Shower Drain');
    drain.position.set(0, 0.065, 0);
    group.add(drain);

    // Transparent Glass Panels (Front & Side)
    const glassH = 2.0;
    const glassSide = this.createMesh(new THREE.BoxGeometry(0.015, glassH, depth), glassMat, 'Glass Screen Side');
    glassSide.position.set(-width / 2 + 0.01, glassH / 2 + 0.06, 0);
    group.add(glassSide);

    const glassFront = this.createMesh(new THREE.BoxGeometry(width * 0.6, glassH, 0.015), glassMat, 'Glass Screen Front');
    glassFront.position.set(width * 0.2, glassH / 2 + 0.06, depth / 2 - 0.01);
    group.add(glassFront);

    // Chrome Overhead Rain Shower Head & Arm
    const showerPole = this.createMesh(new THREE.CylinderGeometry(0.012, 0.012, 1.2, 10), chromeMat, 'Shower Riser');
    showerPole.position.set(0, 1.4, -depth / 2 + 0.04);
    group.add(showerPole);

    const showerArm = this.createMesh(new THREE.BoxGeometry(0.02, 0.02, 0.35), chromeMat, 'Shower Arm');
    showerArm.position.set(0, 2.0, -depth / 2 + 0.2);
    group.add(showerArm);

    const rainHead = this.createMesh(new THREE.CylinderGeometry(0.12, 0.12, 0.02, 20), chromeMat, 'Rain Shower Head');
    rainHead.position.set(0, 1.98, -depth / 2 + 0.36);
    group.add(rainHead);

    // Chrome Thermostatic Mixer Handle
    const mixer = this.createMesh(new THREE.CylinderGeometry(0.03, 0.03, 0.12, 12), chromeMat, 'Mixer Tap');
    mixer.position.set(0, 1.05, -depth / 2 + 0.05);
    mixer.rotation.z = Math.PI / 2;
    group.add(mixer);

    return group;
  }

  // 40. FLOATING BATHROOM VANITY WITH BASIN & LED MIRROR
  static createBathroomVanity(width = 0.9, style = 'modern') {
    const group = new THREE.Group();
    group.name = 'Bathroom Vanity';
    group.userData = { type: 'bathroom_vanity', name: 'Floating Bathroom Vanity & Basin', cost: 480 };

    const woodMat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.4 });
    const basinMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1 });
    const mirrorMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.05, metalness: 0.95 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.15 });

    const d = 0.48;
    const h = 0.42;

    // Floating vanity cabinet
    const cabinet = this.createMesh(new THREE.BoxGeometry(width, h, d), woodMat, 'Vanity Cabinet');
    cabinet.position.set(0, 0.55, 0);
    group.add(cabinet);

    // White Porcelain Washbasin
    const basin = this.createMesh(new THREE.BoxGeometry(width * 0.65, 0.12, d * 0.75), basinMat, 'Porcelain Basin');
    basin.position.set(0, 0.55 + h / 2 + 0.06, 0);
    group.add(basin);

    // Tall Chrome Mixer Faucet
    const faucet = this.createMesh(new THREE.CylinderGeometry(0.015, 0.015, 0.16, 12), chromeMat, 'Chrome Faucet');
    faucet.position.set(0, 0.55 + h / 2 + 0.16, -d * 0.25);
    group.add(faucet);

    // Illuminated LED Mirror (Wall-Mounted)
    const mirrorW = width * 0.85;
    const mirrorH = 0.75;
    const mirrorBack = this.createMesh(new THREE.BoxGeometry(mirrorW, mirrorH, 0.02), new THREE.MeshBasicMaterial({ color: 0xe0f2fe }), 'LED Mirror Backlight');
    mirrorBack.position.set(0, 1.45, -d / 2 - 0.01);
    group.add(mirrorBack);

    const mirrorGlass = this.createMesh(new THREE.BoxGeometry(mirrorW - 0.04, mirrorH - 0.04, 0.01), mirrorMat, 'Mirror Glass');
    mirrorGlass.position.set(0, 1.45, -d / 2);
    group.add(mirrorGlass);

    // Chrome Towel Bar with White Towel
    const towelBar = this.createMesh(new THREE.CylinderGeometry(0.008, 0.008, 0.35, 12), chromeMat, 'Towel Bar');
    towelBar.rotation.z = Math.PI / 2;
    towelBar.position.set(width / 2 + 0.04, 0.65, 0);
    group.add(towelBar);

    const towel = this.createMesh(new THREE.BoxGeometry(0.04, 0.28, 0.25), new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.8 }), 'Hand Towel');
    towel.position.set(width / 2 + 0.04, 0.56, 0);
    group.add(towel);

    return group;
  }

  // 41. COMPLETE PRE-ARRANGED BATHROOM SUITE
  static createBathroomSuite(type = 'common') {
    const group = new THREE.Group();
    group.name = type === 'master' ? 'Master Bathroom Suite' : 'Common Bathroom Suite';
    group.userData = { type: 'bathroom_suite', name: 'Designer En-Suite Bathroom Fixtures', cost: 1350 };

    // 1. Walk-in Glass Shower (Left corner)
    const shower = this.createShowerEnclosure(1.15, 1.05);
    shower.position.set(-0.85, 0, 0.55);
    group.add(shower);

    // 2. Modern Toilet (Center-back)
    const toilet = this.createToilet();
    toilet.position.set(0.15, 0, 0.85);
    group.add(toilet);

    // 3. Floating Vanity & LED Mirror (Right wall)
    const vanity = this.createBathroomVanity(0.85);
    vanity.position.set(1.1, 0, 0.25);
    vanity.rotation.y = -Math.PI / 2;
    group.add(vanity);

    return group;
  }

  // 42. ENTRANCE FOYER CONSOLE & BRASS ROUND MIRROR
  static createFoyerConsole() {
    const group = new THREE.Group();
    group.name = 'Entrance Foyer Console';
    group.userData = { type: 'foyer_console', name: 'Foyer Credenza, Round Mirror & Plant', cost: 420 };

    const woodMat = new THREE.MeshStandardMaterial({ color: 0x5c4033, roughness: 0.35 });
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.85, roughness: 0.2 });
    const mirrorMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.05, metalness: 0.95 });

    // Slim Wooden Console Table
    const tableTop = this.createMesh(new THREE.BoxGeometry(1.2, 0.04, 0.36), woodMat, 'Console Top');
    tableTop.position.set(0, 0.78, 0);
    group.add(tableTop);

    // Slim Legs
    const legMat = brassMat;
    const addLeg = (x, z) => {
      const leg = this.createMesh(new THREE.CylinderGeometry(0.012, 0.012, 0.76, 12), legMat, 'Console Leg');
      leg.position.set(x, 0.38, z);
      group.add(leg);
    };
    addLeg(-0.54, -0.14);
    addLeg(0.54, -0.14);
    addLeg(-0.54, 0.14);
    addLeg(0.54, 0.14);

    // Circular Round Brass Wall Mirror
    const mirrorRim = this.createMesh(new THREE.TorusGeometry(0.38, 0.02, 12, 32), brassMat, 'Brass Mirror Rim');
    mirrorRim.position.set(0, 1.45, -0.16);
    group.add(mirrorRim);

    const mirrorFace = this.createMesh(new THREE.CircleGeometry(0.37, 32), mirrorMat, 'Mirror Face');
    mirrorFace.position.set(0, 1.45, -0.155);
    group.add(mirrorFace);

    // Small Ceramic Catchall Bowl
    const bowl = this.createMesh(new THREE.CylinderGeometry(0.08, 0.05, 0.04, 16), new THREE.MeshStandardMaterial({ color: 0xf1f5f9 }), 'Key Dish');
    bowl.position.set(0.35, 0.82, 0);
    group.add(bowl);

    // Tabletop Miniature Orchid / Planter
    const pot = this.createMesh(new THREE.CylinderGeometry(0.06, 0.04, 0.1, 16), new THREE.MeshStandardMaterial({ color: 0xffffff }), 'Table Planter');
    pot.position.set(-0.38, 0.85, 0);
    group.add(pot);

    const plantMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.6 });
    for (let i = 0; i < 5; i++) {
      const leaf = this.createMesh(new THREE.SphereGeometry(0.04, 8, 8), plantMat, 'Plant Leaf');
      leaf.scale.set(0.5, 1.5, 0.2);
      leaf.position.set(-0.38 + (i - 2) * 0.02, 0.94 + i * 0.02, 0);
      leaf.rotation.z = (i - 2) * 0.25;
      group.add(leaf);
    }

    return group;
  }

  // 43. MASTER SUITE WALK-IN WARDROBE SYSTEM
  static createWalkInWardrobe() {
    const group = new THREE.Group();
    group.name = 'Walk-In Wardrobe';
    group.userData = { type: 'walk_in_wardrobe', name: 'Modular Walk-in Closet Organizer', cost: 890 };

    const woodMat = new THREE.MeshStandardMaterial({ color: 0x5c4033, roughness: 0.4 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.15 });

    const totalW = 1.9;
    const totalH = 2.4;
    const totalD = 0.55;

    // Upright dividers
    const uprightGeom = new THREE.BoxGeometry(0.03, totalH, totalD);
    const u1 = this.createMesh(uprightGeom, woodMat, 'Closet Frame Left');
    u1.position.set(-totalW / 2 + 0.015, totalH / 2, 0);
    group.add(u1);

    const u2 = this.createMesh(uprightGeom, woodMat, 'Closet Frame Center');
    u2.position.set(0, totalH / 2, 0);
    group.add(u2);

    const u3 = this.createMesh(uprightGeom, woodMat, 'Closet Frame Right');
    u3.position.set(totalW / 2 - 0.015, totalH / 2, 0);
    group.add(u3);

    // Shelves
    const shelfGeom = new THREE.BoxGeometry(totalW / 2 - 0.03, 0.025, totalD);
    [-totalW / 4, totalW / 4].forEach(posX => {
      [0.05, 0.45, 1.85, 2.35].forEach(posY => {
        const shelf = this.createMesh(shelfGeom, woodMat, 'Closet Shelf');
        shelf.position.set(posX, posY, 0);
        group.add(shelf);
      });
    });

    // Hanging Chrome Rails
    const railGeom = new THREE.CylinderGeometry(0.012, 0.012, totalW / 2 - 0.03, 12);
    const rail1 = this.createMesh(railGeom, chromeMat, 'Hanging Rail Left');
    rail1.rotation.z = Math.PI / 2;
    rail1.position.set(-totalW / 4, 1.75, 0);
    group.add(rail1);

    const rail2 = this.createMesh(railGeom, chromeMat, 'Hanging Rail Right');
    rail2.rotation.z = Math.PI / 2;
    rail2.position.set(totalW / 4, 1.75, 0);
    group.add(rail2);

    // Hanging Colorful Garments
    const shirtColors = [0x1e3a8a, 0xf8fafc, 0xb91c1c, 0x047857, 0x475569, 0xd97706];
    shirtColors.forEach((col, idx) => {
      const shirtMat = new THREE.MeshStandardMaterial({ color: col, roughness: 0.8 });
      const shirt = this.createMesh(new THREE.BoxGeometry(0.05, 0.65, 0.38), shirtMat, 'Hanging Garment ' + (idx + 1));
      const px = -totalW / 4 - 0.35 + idx * 0.14;
      shirt.position.set(px, 1.35, 0);
      group.add(shirt);
    });

    // Lower Storage Drawers
    const drawerMat = new THREE.MeshStandardMaterial({ color: 0x4a3525, roughness: 0.3 });
    for (let i = 0; i < 2; i++) {
      const drawer = this.createMesh(new THREE.BoxGeometry(totalW / 2 - 0.04, 0.16, totalD - 0.02), drawerMat, 'Closet Drawer ' + (i + 1));
      drawer.position.set(totalW / 4, 0.15 + i * 0.18, 0);
      group.add(drawer);
    }

    return group;
  }

  // 44. COGNAC CARAMEL LEATHER L-SHAPED LUXURY SECTIONAL SOFA
  static createCognacLeatherSectional() {
    const group = new THREE.Group();
    group.name = 'Cognac Leather Sectional';
    group.userData = { type: 'cognac_sectional', name: 'Cognac Leather L-Sectional Sofa', cost: 1650 };

    const leatherMat = new THREE.MeshStandardMaterial({
      color: 0xb45309, // Rich Caramel / Cognac warm leather
      roughness: 0.35,
      metalness: 0.05
    });
    const cushionMat = new THREE.MeshStandardMaterial({
      color: 0x9a3412,
      roughness: 0.4
    });
    const woodLegMat = new THREE.MeshStandardMaterial({ color: 0x2b1d0c, roughness: 0.5 });
    const pillowMat = new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.7 });

    // Main Sofa Base (Long section along North/South)
    const mainBase = this.createMesh(new THREE.BoxGeometry(1.0, 0.22, 2.6), leatherMat, 'Main Sofa Base');
    mainBase.position.set(0, 0.21, 0);
    group.add(mainBase);

    // Return Chaise Base (Short section along East/West)
    const chaiseBase = this.createMesh(new THREE.BoxGeometry(1.4, 0.22, 1.0), leatherMat, 'Chaise Sofa Base');
    chaiseBase.position.set(1.2, 0.21, -0.8);
    group.add(chaiseBase);

    // High Backrests
    const back1 = this.createMesh(new THREE.BoxGeometry(0.24, 0.55, 2.6), leatherMat, 'Main Sofa Backrest');
    back1.position.set(-0.38, 0.55, 0);
    group.add(back1);

    const back2 = this.createMesh(new THREE.BoxGeometry(1.4, 0.55, 0.24), leatherMat, 'Chaise Sofa Backrest');
    back2.position.set(1.2, 0.55, -1.18);
    group.add(back2);

    // Plush Seat Cushions
    for (let z = -0.85; z <= 0.95; z += 0.85) {
      const sc = this.createMesh(new THREE.BoxGeometry(0.72, 0.16, 0.8), cushionMat, 'Plush Seat Cushion');
      sc.position.set(0.08, 0.38, z);
      group.add(sc);
    }
    const cc = this.createMesh(new THREE.BoxGeometry(1.25, 0.16, 0.72), cushionMat, 'Chaise Seat Cushion');
    cc.position.set(1.15, 0.38, -0.72);
    group.add(cc);

    // Accent Throw Pillows
    const p1 = this.createMesh(new THREE.BoxGeometry(0.12, 0.32, 0.32), pillowMat, 'Cream Accent Pillow');
    p1.rotation.y = 0.2;
    p1.position.set(-0.15, 0.58, -0.9);
    group.add(p1);

    const p2 = this.createMesh(new THREE.BoxGeometry(0.32, 0.32, 0.12), pillowMat, 'Cream Accent Pillow');
    p2.rotation.y = -0.2;
    p2.position.set(1.6, 0.58, -0.95);
    group.add(p2);

    // Contemporary Stained Wood Legs
    const legGeom = new THREE.CylinderGeometry(0.025, 0.018, 0.12, 12);
    const legPositions = [
      [-0.45, -1.2], [0.45, -1.2],
      [-0.45, 1.2], [0.45, 1.2],
      [1.8, -1.2], [1.8, -0.35]
    ];
    legPositions.forEach((pos, idx) => {
      const leg = this.createMesh(legGeom, woodLegMat, 'Sofa Leg ' + (idx + 1));
      leg.position.set(pos[0], 0.06, pos[1]);
      group.add(leg);
    });

    return group;
  }

  // 45. GARDEN SHRUB & BUSH (LANDSCAPING)
  static createGardenBush(scale = 1.0, colorHex = 0x3f6212) {
    const group = new THREE.Group();
    group.name = 'Garden Shrub';
    group.userData = { type: 'garden_bush', name: 'Manicured Garden Shrub', cost: 45 };

    const foliageMat = new THREE.MeshStandardMaterial({
      color: colorHex,
      roughness: 0.85
    });

    // Cluster of rounded organic green spheres
    const mainSphere = this.createMesh(new THREE.SphereGeometry(0.35 * scale, 12, 12), foliageMat, 'Foliage Cluster');
    mainSphere.position.set(0, 0.32 * scale, 0);
    mainSphere.scale.set(1.2, 0.9, 1.1);
    group.add(mainSphere);

    const offsets = [
      [0.15, 0.28, 0.12, 0.28],
      [-0.14, 0.26, -0.1, 0.26],
      [0.08, 0.42, -0.08, 0.24],
      [-0.12, 0.35, 0.14, 0.25]
    ];
    offsets.forEach((o, idx) => {
      const s = this.createMesh(new THREE.SphereGeometry(o[3] * scale, 10, 10), foliageMat, 'Foliage Detail ' + (idx + 1));
      s.position.set(o[0] * scale, o[1] * scale, o[2] * scale);
      group.add(s);
    });

    return group;
  }

  // 46. PERIMETER GREEN HEDGE ROW (COMPOUND BOUNDARY)
  static createPerimeterHedge(length = 2.0, height = 0.85) {
    const group = new THREE.Group();
    group.name = 'Perimeter Hedge';
    group.userData = { type: 'perimeter_hedge', name: 'Manicured Perimeter Hedge Row', cost: 95 };

    const hedgeMat = new THREE.MeshStandardMaterial({ color: 0x365314, roughness: 0.9 });
    const hedge = this.createMesh(new THREE.BoxGeometry(0.4, height, length), hedgeMat, 'Hedge Bush');
    hedge.position.set(0, height / 2, 0);
    group.add(hedge);

    return group;
  }

  // 47. OUTDOOR SLATE STEPPING STONES
  static createSteppingStones(count = 4) {
    const group = new THREE.Group();
    group.name = 'Garden Stepping Stones';
    group.userData = { type: 'stepping_stones', name: 'Natural Slate Garden Pathway Stones', cost: 65 };

    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.85 });
    for (let i = 0; i < count; i++) {
      const stone = this.createMesh(new THREE.CylinderGeometry(0.24, 0.26, 0.025, 8), stoneMat, 'Stepping Stone ' + (i + 1));
      stone.position.set(0, 0.015, (i - count / 2) * 0.7);
      stone.scale.set(1.0 + (i % 2) * 0.15, 1.0, 0.9 + ((i + 1) % 2) * 0.2);
      group.add(stone);
    }
    return group;
  }

  // 48. SINGLE-WALL STRAIGHT MODULAR KITCHEN (RIGHT WALL ARCHITECTURAL RUN)
  static createStraightModularKitchen(style = 'modern', color = 0x2c3e50) {
    const group = new THREE.Group();
    group.name = 'Single-Wall Straight Modular Kitchen';
    group.userData = {
      type: 'straight_kitchen',
      name: 'Single-Wall Straight Modular Kitchen',
      cost: 4200,
      color: color
    };

    const totalW = 4.4;
    const baseH = 0.86;
    const counterH = 0.91;
    const counterD = 0.68;
    const splashH = 0.70;
    const upperH = 0.82;
    const upperD = 0.38;

    const cabinetMat = new THREE.MeshStandardMaterial({
      color: color || 0x2c3e50,
      roughness: 0.55,
      metalness: 0.08
    });

    const counterMat = new THREE.MeshStandardMaterial({
      color: 0xfcfcfc,
      roughness: 0.12,
      metalness: 0.06
    });

    const backsplashMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.25,
      metalness: 0.02
    });

    const stainlessMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.9,
      roughness: 0.2
    });

    const cooktopMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.1,
      metalness: 0.65
    });

    const warmLedMat = new THREE.MeshBasicMaterial({
      color: 0xffedd5
    });

    // 1. Dark Recessed Toe-Kick along full run
    const toeKick = this.createMesh(new THREE.BoxGeometry(totalW, 0.1, 0.08), new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 }), 'Toe Kick');
    toeKick.position.set(0, 0.05, counterD / 2 - 0.05);
    group.add(toeKick);

    // 2. Base Cabinets Body
    const baseBox = this.createMesh(new THREE.BoxGeometry(totalW, baseH - 0.1, counterD - 0.04), cabinetMat, 'Base Cabinets');
    baseBox.position.set(0, 0.1 + (baseH - 0.1) / 2, 0);
    group.add(baseBox);

    // 3. Polished Engineered Quartz Countertop Slab
    const top = this.createMesh(new THREE.BoxGeometry(totalW + 0.02, 0.05, counterD + 0.02), counterMat, 'Quartz Countertop');
    top.position.set(0, counterH - 0.025, 0.01);
    group.add(top);

    // 4. Undermount Dual-Basin Deep Stainless Steel Sink (Positioned at X = -0.7)
    const sinkSinkLeft = this.createMesh(new THREE.BoxGeometry(0.42, 0.01, 0.42), stainlessMat, 'Sink Basin Left');
    sinkSinkLeft.position.set(-0.95, counterH + 0.002, 0);
    group.add(sinkSinkLeft);

    const sinkSinkRight = this.createMesh(new THREE.BoxGeometry(0.38, 0.01, 0.42), stainlessMat, 'Sink Basin Right');
    sinkSinkRight.position.set(-0.50, counterH + 0.002, 0);
    group.add(sinkSinkRight);

    // Rim
    const sinkRim = this.createMesh(new THREE.BoxGeometry(0.96, 0.015, 0.48), stainlessMat, 'Sink Rim');
    sinkRim.position.set(-0.725, counterH + 0.008, 0);
    group.add(sinkRim);

    // Architectural Gooseneck Pull-Down Faucet
    const faucetBase = this.createMesh(new THREE.CylinderGeometry(0.022, 0.026, 0.06, 16), stainlessMat, 'Faucet Base');
    faucetBase.position.set(-0.725, counterH + 0.03, -0.20);
    group.add(faucetBase);

    const faucetSpout = this.createMesh(new THREE.CylinderGeometry(0.013, 0.013, 0.35, 16), stainlessMat, 'Faucet Spout');
    faucetSpout.position.set(-0.725, counterH + 0.20, -0.18);
    faucetSpout.rotation.x = -0.12;
    group.add(faucetSpout);

    const faucetArch = this.createMesh(new THREE.TorusGeometry(0.08, 0.013, 12, 24, Math.PI), stainlessMat, 'Faucet Arch');
    faucetArch.position.set(-0.725, counterH + 0.35, -0.12);
    faucetArch.rotation.z = Math.PI;
    group.add(faucetArch);

    // 5. 4-Zone Induction Glass Cooktop (Positioned at X = 0.95)
    const cooktop = this.createMesh(new THREE.BoxGeometry(0.82, 0.01, 0.52), cooktopMat, 'Induction Cooktop');
    cooktop.position.set(0.95, counterH + 0.006, 0);
    group.add(cooktop);

    // Cooktop Burner Rings
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x94a3b8 });
    [[-0.22, -0.12], [0.22, -0.12], [-0.22, 0.12], [0.22, 0.12]].forEach(([rx, rz]) => {
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.065, 0.08, 24), ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(0.95 + rx, counterH + 0.012, rz);
      group.add(ring);
    });

    // 6. Stainless Steel Chimney Range Hood (Above Cooktop)
    const hoodChimney = this.createMesh(new THREE.BoxGeometry(0.36, 0.72, 0.28), stainlessMat, 'Range Hood Flue');
    hoodChimney.position.set(0.95, counterH + splashH + upperH - 0.36, -counterD / 2 + 0.16);
    group.add(hoodChimney);

    const hoodCanopy = this.createMesh(new THREE.BoxGeometry(0.90, 0.10, 0.54), stainlessMat, 'Range Hood Canopy');
    hoodCanopy.position.set(0.95, counterH + splashH + 0.12, -counterD / 2 + 0.28);
    group.add(hoodCanopy);

    // 7. Full-Height Backsplash Wall Panel
    const backsplash = this.createMesh(new THREE.BoxGeometry(totalW, splashH, 0.03), backsplashMat, 'Porcelain Backsplash');
    backsplash.position.set(0, counterH + splashH / 2, -counterD / 2 + 0.015);
    group.add(backsplash);

    // 8. Overhead Upper Cabinets (excluding range hood center)
    const leftUpperW = 2.4;
    const leftUpper = this.createMesh(new THREE.BoxGeometry(leftUpperW, upperH, upperD), cabinetMat, 'Left Upper Cabinets');
    leftUpper.position.set(-totalW / 2 + leftUpperW / 2, counterH + splashH + upperH / 2, -counterD / 2 + upperD / 2);
    group.add(leftUpper);

    const rightUpperW = 1.0;
    const rightUpper = this.createMesh(new THREE.BoxGeometry(rightUpperW, upperH, upperD), cabinetMat, 'Right Upper Cabinets');
    rightUpper.position.set(totalW / 2 - rightUpperW / 2, counterH + splashH + upperH / 2, -counterD / 2 + upperD / 2);
    group.add(rightUpper);

    // 9. Continuous 3000K Warm Under-Cabinet LED Lighting Strip
    const underLed = new THREE.Mesh(new THREE.BoxGeometry(totalW - 0.2, 0.012, 0.04), warmLedMat);
    underLed.position.set(0, counterH + splashH + 0.006, -counterD / 2 + upperD / 2);
    group.add(underLed);

    // 10. Warm 3000K Local Spot/Point Light
    const warmTaskLight = new THREE.PointLight(0xffecd2, 0.85, 4.0, 2);
    warmTaskLight.position.set(0, counterH + splashH - 0.05, 0.1);
    group.add(warmTaskLight);

    // 11. Minimalist Brushed Brass / Satin Nickel Handle Edge Pulls
    const handleMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.85, roughness: 0.25 });
    for (let x = -totalW / 2 + 0.35; x <= totalW / 2 - 0.35; x += 0.65) {
      const h1 = this.createMesh(new THREE.BoxGeometry(0.18, 0.02, 0.025), handleMat, 'Cabinet Handle');
      h1.position.set(x, counterH - 0.18, counterD / 2);
      group.add(h1);
    }

    return group;
  }
}
