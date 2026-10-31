// AI Interior Studio Standalone Bundle (Zero-CORS, Works on file:// and http://)
(function() {
  'use strict';

  // 1. Textures
// Procedural texture generators using HTML5 Canvas
// Generates realistic textures with zero external asset dependencies
class TextureGenerator {
  // Wood floor plank texture
  static createWoodTexture(colorHex = 0xc89d6c, plankWidth = 64, plankHeight = 256) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Base color
    ctx.fillStyle = '#' + colorHex.toString(16).padStart(6, '0');
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Plank lines and wood grain
    const rows = 8;
    const cols = 4;
    const rowH = canvas.height / rows;
    const colW = canvas.width / cols;

    for (let r = 0; r < rows; r++) {
      const offset = (r % 2) * (colW / 2);
      for (let c = -1; c <= cols; c++) {
        const x = c * colW + offset;
        const y = r * rowH;

        // Subtle plank tone variation
        const toneVar = (Math.random() - 0.5) * 20;
        ctx.fillStyle = `rgba(0, 0, 0, ${0.05 + Math.random() * 0.05})`;
        ctx.fillRect(x, y, colW, rowH);

        // Wood grain streaks
        for (let g = 0; g < 12; g++) {
          const gy = y + Math.random() * rowH;
          ctx.strokeStyle = `rgba(50, 25, 10, ${0.03 + Math.random() * 0.05})`;
          ctx.lineWidth = 1 + Math.random() * 2;
          ctx.beginPath();
          ctx.moveTo(x, gy);
          ctx.bezierCurveTo(
            x + colW * 0.33, gy + (Math.random() - 0.5) * 6,
            x + colW * 0.66, gy + (Math.random() - 0.5) * 6,
            x + colW, gy
          );
          ctx.stroke();
        }

        // Plank border
        ctx.strokeStyle = 'rgba(20, 10, 5, 0.4)';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, colW, rowH);
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }

  // Polished Marble tile texture
  static createMarbleTexture(baseHex = 0xf0efe9, veinHex = 0x858079) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#' + baseHex.toString(16).padStart(6, '0');
    ctx.fillRect(0, 0, 512, 512);

    // Marble veins
    ctx.strokeStyle = '#' + veinHex.toString(16).padStart(6, '0');
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      let x = Math.random() * 512;
      let y = 0;
      ctx.moveTo(x, y);
      while (y < 512) {
        x += (Math.random() - 0.5) * 40;
        y += 20 + Math.random() * 30;
        ctx.lineWidth = Math.random() * 3 + 0.5;
        ctx.globalAlpha = 0.15 + Math.random() * 0.2;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1.0;

    // Tile seams (large slabs 2x2)
    ctx.strokeStyle = 'rgba(120, 120, 120, 0.3)';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, 256, 256);
    ctx.strokeRect(256, 0, 256, 256);
    ctx.strokeRect(0, 256, 256, 256);
    ctx.strokeRect(256, 256, 256, 256);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }

  // Ceramic tile texture
  static createTileTexture(colorHex = 0xe5e7eb, groutHex = 0x9ca3af) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#' + colorHex.toString(16).padStart(6, '0');
    ctx.fillRect(0, 0, 256, 256);

    // Grid grout lines
    const tileSize = 64;
    ctx.strokeStyle = '#' + groutHex.toString(16).padStart(6, '0');
    ctx.lineWidth = 3;

    for (let x = 0; x <= 256; x += tileSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 256);
      ctx.stroke();
    }
    for (let y = 0; y <= 256; y += tileSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(256, y);
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }

  // Fabric weave texture (for sofas, chairs, cushions)
  static createFabricTexture(colorHex = 0x5a6268) {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#' + colorHex.toString(16).padStart(6, '0');
    ctx.fillRect(0, 0, 128, 128);

    // Cross-stitch noise
    for (let x = 0; x < 128; x += 4) {
      for (let y = 0; y < 128; y += 4) {
        const shade = (Math.random() - 0.5) * 25;
        ctx.fillStyle = `rgba(0, 0, 0, ${0.05 + Math.random() * 0.08})`;
        ctx.fillRect(x, y, 2, 2);
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }

  // Rug pattern texture
  static createRugTexture(style = 'modern', baseColor = '#e2d9cc', accentColor = '#3b434c') {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, 512, 512);

    // Outer border
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 16;
    ctx.strokeRect(16, 16, 480, 480);

    if (style === 'minimalist') {
      // Subtle linear gradient or minimal thin line
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 2;
      for (let i = 64; i < 448; i += 32) {
        ctx.beginPath();
        ctx.moveTo(48, i);
        ctx.lineTo(464, i);
        ctx.stroke();
      }
    } else if (style === 'luxury') {
      // Diamond / Geometric lattice
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 4;
      const step = 64;
      for (let x = 0; x <= 512; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + 256, 512);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x - 256, 512);
        ctx.stroke();
      }
    } else if (style === 'traditional') {
      // Classic oriental concentric medallion
      ctx.fillStyle = accentColor;
      ctx.beginPath();
      ctx.arc(256, 256, 120, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = baseColor;
      ctx.beginPath();
      ctx.arc(256, 256, 90, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = accentColor;
      ctx.beginPath();
      ctx.arc(256, 256, 50, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Modern abstract geometric blocks
      ctx.fillStyle = accentColor;
      ctx.globalAlpha = 0.4;
      ctx.beginPath();
      ctx.arc(180, 200, 110, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(240, 220, 180, 140);
      ctx.globalAlpha = 1.0;
    }

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }
}

  window.TextureGenerator = TextureGenerator;

  // 2. Room Architecture
// 3D Room Builder with dynamic dimensions, cutaway walls, windows, and floors
class RoomBuilder {
  constructor(scene) {
    this.scene = scene;
    this.roomGroup = new THREE.Group();
    this.roomGroup.name = 'RoomStructure';
    this.scene.add(this.roomGroup);

    this.walls = {};
    this.floor = null;
    this.baseboards = [];
    this.dimensionMarkers = [];
    this.cutawayEnabled = true;

    this.currentDimensions = { width: 5.0, length: 4.5, height: 2.8 };
    this.currentWallColor = 0xf3f4f6;
    this.currentFlooring = 'wood_oak';
  }

  buildRoom(dimensions, wallColorHex = 0xf3f4f6, flooringType = 'wood_oak') {
    this.currentDimensions = dimensions;
    this.currentWallColor = wallColorHex;
    this.currentFlooring = flooringType;

    // Clear previous room geometry
    while (this.roomGroup.children.length > 0) {
      const obj = this.roomGroup.children[0];
      this.roomGroup.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
        else obj.material.dispose();
      }
    }

    const { width: W, length: L, height: H } = dimensions;

    // 1. FLOOR
    this.buildFloor(W, L, flooringType);

    // 2. WALLS
    this.buildWalls(W, L, H, wallColorHex);

    // 3. BASEBOARDS
    this.buildBaseboards(W, L);

    // 4. WINDOW & DOOR ARCHITECTURE
    this.buildArchitecturalDetails(W, L, H);

    // 5. DIMENSION GRID / MARKERS
    this.buildFloorGrid(W, L);
  }

  buildFloor(W, L, flooringType) {
    let floorTexture;
    let roughness = 0.4;
    let metalness = 0.05;

    switch (flooringType) {
      case 'dark_walnut':
        floorTexture = TextureGenerator.createWoodTexture(0x4a2e18);
        roughness = 0.5;
        break;
      case 'marble':
        floorTexture = TextureGenerator.createMarbleTexture(0xf8fafc, 0x94a3b8);
        roughness = 0.15;
        metalness = 0.1;
        break;
      case 'tile':
        floorTexture = TextureGenerator.createTileTexture(0xe2e8f0, 0x64748b);
        roughness = 0.3;
        break;
      case 'carpet':
        floorTexture = TextureGenerator.createFabricTexture(0xd6d3d1);
        roughness = 0.95;
        metalness = 0.0;
        break;
      case 'wood_oak':
      default:
        floorTexture = TextureGenerator.createWoodTexture(0xd4a373);
        roughness = 0.5;
        break;
    }

    // Repeat texture to fit room size
    floorTexture.repeat.set(W / 2, L / 2);

    const floorMat = new THREE.MeshStandardMaterial({
      map: floorTexture,
      roughness: roughness,
      metalness: metalness
    });

    const floorGeom = new THREE.PlaneGeometry(W, L);
    this.floor = new THREE.Mesh(floorGeom, floorMat);
    this.floor.rotation.x = -Math.PI / 2;
    this.floor.receiveShadow = true;
    this.floor.name = 'RoomFloor';
    this.roomGroup.add(this.floor);
  }

  buildWalls(W, L, H, wallColorHex) {
    const wallThickness = 0.12;
    const wallMat = new THREE.MeshStandardMaterial({
      color: wallColorHex,
      roughness: 0.85,
      side: THREE.DoubleSide
    });

    // Back Wall (-Z)
    const backGeom = new THREE.BoxGeometry(W, H, wallThickness);
    this.walls.back = new THREE.Mesh(backGeom, wallMat);
    this.walls.back.position.set(0, H / 2, -L / 2 - wallThickness / 2);
    this.walls.back.receiveShadow = true;
    this.walls.back.castShadow = true;
    this.roomGroup.add(this.walls.back);

    // Left Wall (-X)
    const leftGeom = new THREE.BoxGeometry(wallThickness, H, L);
    this.walls.left = new THREE.Mesh(leftGeom, wallMat);
    this.walls.left.position.set(-W / 2 - wallThickness / 2, H / 2, 0);
    this.walls.left.receiveShadow = true;
    this.walls.left.castShadow = true;
    this.roomGroup.add(this.walls.left);

    // Right Wall (+X)
    const rightGeom = new THREE.BoxGeometry(wallThickness, H, L);
    this.walls.right = new THREE.Mesh(rightGeom, wallMat);
    this.walls.right.position.set(W / 2 + wallThickness / 2, H / 2, 0);
    this.walls.right.receiveShadow = true;
    this.walls.right.castShadow = true;
    this.roomGroup.add(this.walls.right);

    // Front Wall (+Z) - Cutaway wall for easy viewing
    const frontMat = new THREE.MeshStandardMaterial({
      color: wallColorHex,
      roughness: 0.85,
      transparent: true,
      opacity: this.cutawayEnabled ? 0.0 : 0.95
    });
    const frontGeom = new THREE.BoxGeometry(W, H, wallThickness);
    this.walls.front = new THREE.Mesh(frontGeom, frontMat);
    this.walls.front.position.set(0, H / 2, L / 2 + wallThickness / 2);
    this.walls.front.receiveShadow = true;
    this.walls.front.visible = !this.cutawayEnabled;
    this.roomGroup.add(this.walls.front);
  }

  buildBaseboards(W, L) {
    const bbMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
    const bbH = 0.1;
    const bbD = 0.02;

    // Back baseboard
    const bbBack = new THREE.Mesh(new THREE.BoxGeometry(W, bbH, bbD), bbMat);
    bbBack.position.set(0, bbH / 2, -L / 2 + bbD / 2);
    this.roomGroup.add(bbBack);

    // Left baseboard
    const bbLeft = new THREE.Mesh(new THREE.BoxGeometry(bbD, bbH, L), bbMat);
    bbLeft.position.set(-W / 2 + bbD / 2, bbH / 2, 0);
    this.roomGroup.add(bbLeft);

    // Right baseboard
    const bbRight = new THREE.Mesh(new THREE.BoxGeometry(bbD, bbH, L), bbMat);
    bbRight.position.set(W / 2 - bbD / 2, bbH / 2, 0);
    this.roomGroup.add(bbRight);
  }

  buildArchitecturalDetails(W, L, H) {
    // 1. Picture Window on the Left Wall
    const windowGroup = new THREE.Group();
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.3 });
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xbae6fd,
      transmission: 0.9,
      opacity: 0.4,
      transparent: true,
      roughness: 0.1
    });

    const winW = 1.6;
    const winH = 1.4;
    const winDepth = 0.06;

    // Window frame
    const frame = new THREE.Mesh(new THREE.BoxGeometry(winDepth, winH, winW), frameMat);
    windowGroup.add(frame);

    // Glass pane
    const glass = new THREE.Mesh(new THREE.BoxGeometry(0.01, winH - 0.1, winW - 0.1), glassMat);
    windowGroup.add(glass);

    // Window mullions (crossbars)
    const crossV = new THREE.Mesh(new THREE.BoxGeometry(winDepth + 0.01, winH - 0.1, 0.03), frameMat);
    const crossH = new THREE.Mesh(new THREE.BoxGeometry(winDepth + 0.01, 0.03, winW - 0.1), frameMat);
    windowGroup.add(crossV);
    windowGroup.add(crossH);

    windowGroup.position.set(-W / 2 + 0.02, H * 0.55, 0);
    this.roomGroup.add(windowGroup);

    // 2. Doorway hint on the Right Wall (back corner)
    const doorGroup = new THREE.Group();
    const doorFrameMat = new THREE.MeshStandardMaterial({ color: 0x334155 });
    const doorMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7 });

    const doorW = 0.9;
    const doorH = 2.1;
    const doorFrame = new THREE.Mesh(new THREE.BoxGeometry(0.04, doorH, doorW), doorFrameMat);
    const doorPanel = new THREE.Mesh(new THREE.BoxGeometry(0.02, doorH - 0.05, doorW - 0.05), doorMat);
    doorPanel.position.x = -0.01;

    // Brass door handle
    const handleMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.8, roughness: 0.2 });
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.12, 12), handleMat);
    handle.rotation.x = Math.PI / 2;
    handle.position.set(-0.03, 0, -doorW / 3);

    doorGroup.add(doorFrame);
    doorGroup.add(doorPanel);
    doorGroup.add(handle);
    doorGroup.position.set(W / 2 - 0.02, doorH / 2, L / 2 - 0.8);
    this.roomGroup.add(doorGroup);
  }

  buildFloorGrid(W, L) {
    const grid = new THREE.GridHelper(Math.max(W, L), Math.round(Math.max(W, L) * 2), 0x94a3b8, 0xe2e8f0);
    grid.position.y = 0.002;
    grid.name = 'MeasurementGrid';
    grid.material.opacity = 0.35;
    grid.material.transparent = true;
    this.roomGroup.add(grid);
  }

  setCutaway(enabled) {
    this.cutawayEnabled = enabled;
    if (this.walls.front) {
      this.walls.front.visible = !enabled;
      this.walls.front.material.opacity = enabled ? 0.0 : 0.95;
    }
  }

  setWallColor(hex) {
    this.currentWallColor = hex;
    ['back', 'left', 'right', 'front'].forEach(w => {
      if (this.walls[w]) {
        this.walls[w].material.color.set(hex);
      }
    });
  }

  setFlooring(type) {
    this.buildFloor(this.currentDimensions.width, this.currentDimensions.length, type);
  }
}

  window.RoomBuilder = RoomBuilder;

  // 3. Furniture Models
// Procedural 3D Furniture Models using Three.js
// Supports multiple design styles: Modern, Minimalist, Luxury, Traditional
class FurnitureFactory {
  // Helper: Create a standard PBR mesh
  static createMesh(geom, mat) {
    const mesh = new THREE.Mesh(geom, mat);
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
    const base = this.createMesh(baseGeom, fabricMat);
    base.position.y = 0.18;
    group.add(base);

    // Seat cushions (2 or 3 segments)
    const cushionCount = style === 'minimalist' ? 2 : 3;
    const cushionW = (width - 0.04) / cushionCount;
    for (let i = 0; i < cushionCount; i++) {
      const cGeom = new THREE.BoxGeometry(cushionW - 0.02, 0.16, depth - 0.15);
      const cushion = this.createMesh(cGeom, fabricMat);
      cushion.position.set(-width / 2 + cushionW / 2 + i * cushionW, 0.32, 0.05);
      group.add(cushion);
    }

    // Backrest
    const backH = style === 'luxury' ? 0.65 : 0.55;
    const backGeom = new THREE.BoxGeometry(width, backH, 0.22);
    const back = this.createMesh(backGeom, fabricMat);
    back.position.set(0, 0.25 + backH / 2, -depth / 2 + 0.11);
    group.add(back);

    // Armrests
    const armW = style === 'minimalist' ? 0.12 : 0.18;
    const armH = 0.45;
    [-1, 1].forEach(side => {
      const armGeom = new THREE.BoxGeometry(armW, armH, depth);
      const arm = this.createMesh(armGeom, fabricMat);
      arm.position.set(side * (width / 2 - armW / 2), 0.2 + armH / 2, 0);
      group.add(arm);
    });

    // Legs (4 corners)
    const legRadius = style === 'luxury' ? 0.025 : 0.03;
    const legH = 0.12;
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([xDir, zDir]) => {
      const legGeom = new THREE.CylinderGeometry(legRadius * 0.8, legRadius, legH, 16);
      const leg = this.createMesh(legGeom, woodLegMat);
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
        const pillow = this.createMesh(pGeom, pillowMat);
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
      const top = this.createMesh(topGeom, topMat);
      top.position.y = 0.42;
      group.add(top);

      // 3 or 4 legs or pedestal
      const legGeom = new THREE.CylinderGeometry(0.02, 0.02, 0.4, 16);
      for (let i = 0; i < 3; i++) {
        const angle = (i * Math.PI * 2) / 3;
        const leg = this.createMesh(legGeom, legMat);
        leg.position.set(Math.cos(angle) * (radius - 0.08), 0.2, Math.sin(angle) * (radius - 0.08));
        group.add(leg);
      }
    } else {
      // Rectangular table
      const width = 1.1;
      const depth = 0.6;
      const topGeom = new THREE.BoxGeometry(width, 0.04, depth);
      const top = this.createMesh(topGeom, topMat);
      top.position.y = 0.42;
      group.add(top);

      // Legs
      [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([xDir, zDir]) => {
        const legGeom = new THREE.CylinderGeometry(0.025, 0.02, 0.4, 16);
        const leg = this.createMesh(legGeom, legMat);
        leg.position.set(xDir * (width / 2 - 0.06), 0.2, zDir * (depth / 2 - 0.06));
        group.add(leg);
      });
    }

    // Decor on top (decorative bowl / book)
    const bookGeom = new THREE.BoxGeometry(0.22, 0.03, 0.16);
    const bookMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.5 });
    const book = this.createMesh(bookGeom, bookMat);
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
    const credenza = this.createMesh(new THREE.BoxGeometry(width, height, depth), cabinetMat);
    credenza.position.set(0, height / 2, 0);
    group.add(credenza);

    // Accent slats / shelves
    const shelfMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.7, roughness: 0.3 });
    const lineGeom = new THREE.BoxGeometry(width * 0.96, 0.02, depth + 0.01);
    const line = this.createMesh(lineGeom, shelfMat);
    line.position.set(0, height * 0.7, 0);
    group.add(line);

    // TV Screen (55-65 inch mounted or stood)
    const tvW = 1.4;
    const tvH = 0.8;
    const tvGeom = new THREE.BoxGeometry(tvW, tvH, 0.04);
    const tv = this.createMesh(tvGeom, screenMat);
    tv.position.set(0, height + 0.55, 0);
    group.add(tv);

    // TV Bezel frame
    const bezelMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, metalness: 0.9, roughness: 0.2 });
    const tvStand = this.createMesh(new THREE.CylinderGeometry(0.04, 0.04, 0.15, 16), bezelMat);
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
    const seat = this.createMesh(new THREE.BoxGeometry(0.75, 0.16, 0.75), fabricMat);
    seat.position.y = 0.38;
    group.add(seat);

    // Backrest
    const back = this.createMesh(new THREE.BoxGeometry(0.75, 0.55, 0.15), fabricMat);
    back.position.set(0, 0.65, -0.3);
    group.add(back);

    // Side arms
    [-1, 1].forEach(side => {
      const arm = this.createMesh(new THREE.BoxGeometry(0.12, 0.35, 0.75), fabricMat);
      arm.position.set(side * 0.38, 0.5, 0);
      group.add(arm);
    });

    // Angled splayed legs
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([xDir, zDir]) => {
      const leg = this.createMesh(new THREE.CylinderGeometry(0.02, 0.015, 0.32, 16), legMat);
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
    const base = this.createMesh(new THREE.CylinderGeometry(0.2, 0.22, 0.03, 32), poleMat);
    base.position.y = 0.015;
    group.add(base);

    // Tall pole
    const pole = this.createMesh(new THREE.CylinderGeometry(0.015, 0.015, 1.5, 16), poleMat);
    pole.position.y = 0.78;
    group.add(pole);

    // Lampshade (cone or cylinder)
    const shade = this.createMesh(new THREE.CylinderGeometry(0.18, 0.25, 0.3, 32, 1, true), shadeMat);
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
    const base = this.createMesh(new THREE.BoxGeometry(width, height, length), frameMat);
    base.position.y = height / 2;
    group.add(base);

    // Mattress
    const mattress = this.createMesh(new THREE.BoxGeometry(width - 0.1, 0.25, length - 0.1), mattressMat);
    mattress.position.set(0, height + 0.125, 0);
    group.add(mattress);

    // Duvet / Bedspread (covers 70% of bed)
    const duvet = this.createMesh(new THREE.BoxGeometry(width - 0.08, 0.27, length * 0.72), duvetMat);
    duvet.position.set(0, height + 0.135, length * 0.12);
    group.add(duvet);

    // Headboard
    const headboardH = style === 'luxury' ? 1.2 : 0.85;
    const headboard = this.createMesh(new THREE.BoxGeometry(width + 0.1, headboardH, 0.12), frameMat);
    headboard.position.set(0, headboardH / 2, -length / 2 - 0.06);
    group.add(headboard);

    // Pillows (2 large, 2 accent)
    const pillowMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 });
    [-0.5, 0.5].forEach(x => {
      const p1 = this.createMesh(new THREE.BoxGeometry(0.65, 0.15, 0.4), pillowMat);
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

  // 10. DINING TABLE & CHAIRS
  static createDiningSet(style = 'modern', woodColor = 0x4a3525) {
    const group = new THREE.Group();
    group.name = 'Dining Table Set';
    group.userData = { type: 'dining_set', name: '6-Seater Dining Set', cost: 1250 };

    const tableMat = new THREE.MeshStandardMaterial({
      color: style === 'luxury' ? 0xf5f5f4 : woodColor,
      roughness: style === 'luxury' ? 0.2 : 0.6,
      metalness: style === 'luxury' ? 0.1 : 0.0
    });

    const chairMat = new THREE.MeshStandardMaterial({
      color: style === 'luxury' ? 0x1e293b : 0xd97706,
      roughness: 0.8
    });

    const legMat = new THREE.MeshStandardMaterial({
      color: style === 'luxury' ? 0xd4af37 : 0x1f2937,
      metalness: 0.6,
      roughness: 0.3
    });

    // Table Top
    const w = 1.8, d = 0.9, h = 0.76;
    const top = this.createMesh(new THREE.BoxGeometry(w, 0.05, d), tableMat);
    top.position.y = h;
    group.add(top);

    // Table Legs
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([xDir, zDir]) => {
      const leg = this.createMesh(new THREE.CylinderGeometry(0.03, 0.02, h, 16), legMat);
      leg.position.set(xDir * (w / 2 - 0.1), h / 2, zDir * (d / 2 - 0.1));
      group.add(leg);
    });

    // 4 Chairs arranged along the long sides
    const chairX = [-0.5, 0.5];
    chairX.forEach(x => {
      [0.65, -0.65].forEach(z => {
        const chair = new THREE.Group();
        const cSeat = this.createMesh(new THREE.BoxGeometry(0.42, 0.05, 0.42), chairMat);
        cSeat.position.y = 0.45;
        chair.add(cSeat);

        const cBack = this.createMesh(new THREE.BoxGeometry(0.42, 0.4, 0.04), chairMat);
        cBack.position.set(0, 0.65, z > 0 ? 0.19 : -0.19);
        chair.add(cBack);

        // Legs
        [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([lx, lz]) => {
          const cLeg = this.createMesh(new THREE.CylinderGeometry(0.015, 0.015, 0.45, 12), legMat);
          cLeg.position.set(lx * 0.16, 0.225, lz * 0.16);
          chair.add(cLeg);
        });

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

  window.FurnitureFactory = FurnitureFactory;

  // 4. AI Engine
// AI Interior Design Suggester & Spatial Arrangement Engine
// Provides heuristic algorithmic spatial planning + optional Gemini Generative AI integration
class AIEngine {
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

      // Built-in Double Wardrobe along right wall
      items.push({
        id: 'wardrobe_1',
        type: 'wardrobe',
        name: 'Double Wardrobe',
        position: [W / 2 - 0.4, 0, 0.3],
        rotation: [0, -Math.PI / 2, 0],
        style: style,
        color: palette.sofaColor,
        cost: 850
      });

      // Standing Floor Mirror in corner
      items.push({
        id: 'mirror_1',
        type: 'floor_mirror',
        name: 'Full-Length Floor Mirror',
        position: [-W / 2 + 0.8, 0, L / 2 - 0.8],
        rotation: [0, Math.PI / 4, 0],
        style: style,
        cost: 240
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
    } else {
      // Dining Room
      concept = `${style.toUpperCase()} ELEVATED DINING SUITE`;
      spatialRationale = `The 6-seater dining table takes center stage with a minimum 1.0m pull-out clearance for all chairs. A low credenza / storage unit lines the perimeter for dinnerware.`;
      lightingPlan = `Warm, intimate overhead pendant lighting (2700K) cast directly onto the dining surface to create a cozy gathering ambiance.`;

      // Dining Set in center
      items.push({
        id: 'dining_set_1',
        type: 'dining_set',
        name: '6-Seater Dining Set',
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        style: style,
        color: palette.woodColor,
        cost: 1350
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

  window.AIEngine = AIEngine;

  // 5. App Coordinator
// AI Interior Studio - Application Coordinator



class App {
  constructor() {
    this.canvas = document.getElementById('canvas3d');
    this.furnitureGroup = new THREE.Group();
    this.furnitureGroup.name = 'FurnitureGroup';
    this.furnitureList = [];
    this.selectedObject = null;
    this.isDaylight = true;
    this.currentStyle = 'modern';
    this.geminiApiKey = localStorage.getItem('ai_interior_gemini_key') || '';
    this.isWalkthrough = false;
    this.keysDown = {};
    this.currentRoomDimensions = { width: 5.0, length: 4.5, height: 2.8 };

    this.initScene();
    this.initLights();
    this.initRoom();
    this.initRaycasting();
    this.initKeyboardControls();
    this.initUI();
    this.initProjects();

    // Generate initial default design
    this.triggerAIGeneration();

    // Start animation loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  // 1. SCENE SETUP
  initScene() {
    const width = this.canvas.clientWidth || window.innerWidth - 440;
    const height = this.canvas.clientHeight || window.innerHeight - 60;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0e17);

    this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    this.camera.position.set(0, 4.5, 6.8);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      preserveDrawingBuffer: true
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;

    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.02; // Prevent going beneath floor
    this.controls.minDistance = 2.0;
    this.controls.maxDistance = 18.0;
    this.controls.target.set(0, 1.0, 0);

    this.scene.add(this.furnitureGroup);

    window.addEventListener('resize', () => {
      const w = this.canvas.clientWidth;
      const h = this.canvas.clientHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    });
  }

  // 2. LIGHTING SETUP
  initLights() {
    // Ambient light
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.55);
    this.scene.add(this.ambientLight);

    // Sun / Window Directional Light
    this.sunLight = new THREE.DirectionalLight(0xfffaed, 1.2);
    this.sunLight.position.set(-8, 9, 4);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 0.5;
    this.sunLight.shadow.camera.far = 25;
    this.sunLight.shadow.camera.left = -6;
    this.sunLight.shadow.camera.right = 6;
    this.sunLight.shadow.camera.top = 6;
    this.sunLight.shadow.camera.bottom = -6;
    this.sunLight.shadow.bias = -0.0005;
    this.scene.add(this.sunLight);

    // Soft ceiling fill light
    this.ceilingLight = new THREE.PointLight(0xfff7ed, 0.6, 12, 1.5);
    this.ceilingLight.position.set(0, 2.7, 0);
    this.scene.add(this.ceilingLight);
  }

  // 3. ROOM BUILDER INITIALIZATION
  initRoom() {
    this.roomBuilder = new RoomBuilder(this.scene);
  }

  // 4. RAYCASTING & OBJECT SELECTION
  initRaycasting() {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.canvas.addEventListener('pointerdown', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.furnitureGroup.children, true);

      if (intersects.length > 0) {
        // Find top-level furniture group
        let obj = intersects[0].object;
        while (obj.parent && obj.parent !== this.furnitureGroup) {
          obj = obj.parent;
        }
        this.selectObject(obj);
      } else {
        // Clicked empty space
        this.deselectObject();
      }
    });
  }

  // 4b. KEYBOARD CONTROLS FOR OBJECT NUDGE & ROTATION
  initKeyboardControls() {
    window.addEventListener('keydown', (e) => {
      this.keysDown[e.code] = true;

      // Ignore hotkeys when typing in input/textarea/select
      const activeEl = document.activeElement;
      const tag = activeEl ? activeEl.tagName.toLowerCase() : '';
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

      if (this.selectedObject && !this.isWalkthrough) {
        let step = e.shiftKey ? 0.25 : 0.1;

        if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
          e.preventDefault();
          this.selectedObject.position.x -= step;
          this.syncInspectorPosition();
        } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
          e.preventDefault();
          this.selectedObject.position.x += step;
          this.syncInspectorPosition();
        } else if (e.code === 'ArrowUp' || e.code === 'KeyW') {
          e.preventDefault();
          this.selectedObject.position.z -= step;
          this.syncInspectorPosition();
        } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
          e.preventDefault();
          this.selectedObject.position.z += step;
          this.syncInspectorPosition();
        } else if (e.code === 'KeyR') {
          e.preventDefault();
          this.selectedObject.rotation.y += Math.PI / 4;
        } else if (e.code === 'Delete' || e.code === 'Backspace') {
          e.preventDefault();
          this.deleteSelectedObject();
        } else if (e.code === 'Escape') {
          e.preventDefault();
          this.deselectObject();
        }
      } else if (e.code === 'Escape' && this.isWalkthrough) {
        this.setCameraPreset('3d');
        document.querySelectorAll('[data-view]').forEach(b => b.classList.remove('active'));
        document.querySelector('[data-view="3d"]')?.classList.add('active');
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keysDown[e.code] = false;
    });
  }

  syncInspectorPosition() {
    if (!this.selectedObject) return;
    const posX = document.getElementById('inspect-pos-x');
    const posZ = document.getElementById('inspect-pos-z');
    if (posX) posX.value = this.selectedObject.position.x;
    if (posZ) posZ.value = this.selectedObject.position.z;
  }

  deleteSelectedObject() {
    if (this.selectedObject) {
      this.furnitureGroup.remove(this.selectedObject);
      this.deselectObject();
      this.showToast('Object removed from room');
    }
  }

  selectObject(obj) {
    this.deselectObject();
    this.selectedObject = obj;

    // Show popup
    const popup = document.getElementById('inspector-popup');
    const title = document.getElementById('inspector-title');
    const posX = document.getElementById('inspect-pos-x');
    const posZ = document.getElementById('inspect-pos-z');
    const colorInput = document.getElementById('inspect-item-color');
    const colorHex = document.getElementById('inspect-item-color-hex');

    popup.style.display = 'flex';
    title.textContent = obj.name || 'Selected Object';
    posX.value = obj.position.x;
    posZ.value = obj.position.z;

    // Extract current color
    let hexStr = '#6366f1';
    if (obj.userData?.color) {
      if (typeof obj.userData.color === 'string') {
        hexStr = obj.userData.color.startsWith('#') ? obj.userData.color : `#${obj.userData.color}`;
      } else if (typeof obj.userData.color === 'number') {
        hexStr = `#${obj.userData.color.toString(16).padStart(6, '0')}`;
      }
    } else {
      obj.traverse(child => {
        if (child.isMesh && child.material && child.material.color && child.material.metalness < 0.6 && !child.material.map) {
          hexStr = `#${child.material.color.getHexString()}`;
        }
      });
    }

    if (colorInput) colorInput.value = hexStr;
    if (colorHex) colorHex.textContent = hexStr.toUpperCase();

    this.showToast(`Selected: ${obj.name}`);
  }

  deselectObject() {
    this.selectedObject = null;
    document.getElementById('inspector-popup').style.display = 'none';
  }

  // 5. USER INTERFACE & EVENT HANDLERS
  initUI() {
    // Tabs Navigation
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const target = document.getElementById(btn.dataset.tab);
        if (target) target.classList.add('active');
      });
    });

    // Style Card Selection
    document.querySelectorAll('.style-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.style-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        this.currentStyle = card.dataset.style;
      });
    });

    // Generate AI Design Button
    document.getElementById('btn-generate-ai').addEventListener('click', () => {
      this.triggerAIGeneration();
    });

    // Camera View Presets
    document.querySelectorAll('[data-view]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-view]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.setCameraPreset(btn.dataset.view);
      });
    });

    // Cutaway Wall Toggle
    const cutawayBtn = document.getElementById('btn-toggle-cutaway');
    cutawayBtn.addEventListener('click', () => {
      cutawayBtn.classList.toggle('active');
      const isCutaway = cutawayBtn.classList.contains('active');
      this.roomBuilder.setCutaway(isCutaway);
      this.showToast(isCutaway ? 'Cutaway front wall active' : 'Full walls visible');
    });

    // Daylight / Night Toggle
    const daylightBtn = document.getElementById('btn-toggle-daylight');
    daylightBtn.addEventListener('click', () => {
      this.isDaylight = !this.isDaylight;
      daylightBtn.classList.toggle('active', this.isDaylight);
      daylightBtn.innerHTML = this.isDaylight ? '☀️ Day' : '🌙 Night';

      if (this.isDaylight) {
        this.scene.background.set(0x0a0e17);
        this.ambientLight.intensity = 0.55;
        this.sunLight.intensity = 1.2;
        this.ceilingLight.intensity = 0.6;
        this.showToast('Daylight simulation enabled');
      } else {
        this.scene.background.set(0x020408);
        this.ambientLight.intensity = 0.15;
        this.sunLight.intensity = 0.05;
        this.ceilingLight.intensity = 1.3;
        this.showToast('Moody evening lighting enabled');
      }
    });

    // Measurement Grid Toggle
    const gridBtn = document.getElementById('btn-toggle-grid');
    gridBtn.addEventListener('click', () => {
      gridBtn.classList.toggle('active');
      const grid = this.scene.getObjectByName('MeasurementGrid');
      if (grid) {
        grid.visible = gridBtn.classList.contains('active');
      }
    });

    // Reset Camera
    document.getElementById('btn-reset-cam').addEventListener('click', () => {
      this.setCameraPreset('3d');
    });

    // Inspector Popup Controls
    document.getElementById('btn-close-inspector').addEventListener('click', () => {
      this.deselectObject();
    });

    document.getElementById('inspect-pos-x').addEventListener('input', (e) => {
      if (this.selectedObject) this.selectedObject.position.x = parseFloat(e.target.value);
    });

    document.getElementById('inspect-pos-z').addEventListener('input', (e) => {
      if (this.selectedObject) this.selectedObject.position.z = parseFloat(e.target.value);
    });

    // Inspector Color Customizer
    const inspectColor = document.getElementById('inspect-item-color');
    if (inspectColor) {
      inspectColor.addEventListener('input', (e) => {
        if (!this.selectedObject) return;
        const hex = e.target.value;
        const hexLabel = document.getElementById('inspect-item-color-hex');
        if (hexLabel) hexLabel.textContent = hex.toUpperCase();
        this.selectedObject.userData.color = hex;

        const newColor = new THREE.Color(hex);
        this.selectedObject.traverse(child => {
          if (child.isMesh && child.material) {
            const mat = child.material;
            // Recolor body/upholstery/wood materials; leave metal/glass/bulbs intact
            if (mat.metalness > 0.75 || mat.isMeshBasicMaterial || mat.map) return;
            mat.color.copy(newColor);
          }
        });
      });
    }

    document.getElementById('btn-rotate-object').addEventListener('click', () => {
      if (this.selectedObject) {
        this.selectedObject.rotation.y += Math.PI / 4;
      }
    });

    document.getElementById('btn-delete-object').addEventListener('click', () => {
      if (this.selectedObject) {
        this.furnitureGroup.remove(this.selectedObject);
        this.deselectObject();
        this.showToast('Object removed from room');
      }
    });

    // Add items from catalog
    document.querySelectorAll('.add-catalog-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.type;
        this.addFurnitureItem({
          type: type,
          style: this.currentStyle,
          position: [0, 0, 0],
          rotation: [0, 0, 0]
        });
        this.showToast(`Added ${type.replace('_', ' ')} to center`);
      });
    });

    // Wall Color Picker & Flooring in Catalog tab
    const wallPicker = document.getElementById('wall-color-picker');
    wallPicker.addEventListener('input', (e) => {
      const hex = parseInt(e.target.value.replace('#', '0x'), 16);
      this.roomBuilder.setWallColor(hex);
    });

    const catFlooring = document.getElementById('catalog-flooring');
    catFlooring.addEventListener('change', (e) => {
      this.roomBuilder.setFlooring(e.target.value);
      this.showToast(`Flooring set to ${e.target.value}`);
    });

    // Clear all furniture
    document.getElementById('btn-clear-furniture').addEventListener('click', () => {
      while (this.furnitureGroup.children.length > 0) {
        this.furnitureGroup.remove(this.furnitureGroup.children[0]);
      }
      this.deselectObject();
      this.showToast('Cleared all furniture');
    });

    // Snapshot Button
    document.getElementById('btn-quick-screenshot').addEventListener('click', () => {
      this.captureSnapshot();
    });

    // Exit Walkthrough HUD Button
    const exitWalkBtn = document.getElementById('btn-exit-walk');
    if (exitWalkBtn) {
      exitWalkBtn.addEventListener('click', () => {
        this.setCameraPreset('3d');
        document.querySelectorAll('[data-view]').forEach(b => b.classList.remove('active'));
        document.querySelector('[data-view="3d"]')?.classList.add('active');
      });
    }

    // Design Specification Report Modal Handlers
    const reportModal = document.getElementById('report-modal');
    document.getElementById('btn-export-report')?.addEventListener('click', () => {
      this.openDesignReport();
    });

    document.getElementById('btn-print-report')?.addEventListener('click', () => {
      window.print();
    });

    document.getElementById('btn-close-report')?.addEventListener('click', () => {
      reportModal?.classList.remove('open');
    });

    // Gemini API Modal
    const apiModal = document.getElementById('api-modal');
    document.getElementById('btn-api-key').addEventListener('click', () => {
      document.getElementById('gemini-key-input').value = this.geminiApiKey;
      apiModal.classList.add('open');
    });
    document.getElementById('btn-close-modal').addEventListener('click', () => {
      apiModal.classList.remove('open');
    });
    document.getElementById('btn-save-key').addEventListener('click', () => {
      this.geminiApiKey = document.getElementById('gemini-key-input').value.trim();
      localStorage.setItem('ai_interior_gemini_key', this.geminiApiKey);
      apiModal.classList.remove('open');
      this.showToast(this.geminiApiKey ? 'Gemini API key saved!' : 'Cleared API key');
    });
  }

  // 6. CAMERA PRESETS & WALKTHROUGH
  setCameraPreset(mode) {
    const hud = document.getElementById('walkthrough-hud');
    if (mode === 'walk') {
      this.isWalkthrough = true;
      if (hud) hud.style.display = 'block';
      this.camera.position.set(0, 1.6, 1.6);
      this.controls.target.set(0, 1.55, -0.6);
      this.controls.maxPolarAngle = Math.PI - 0.05;
      this.controls.minDistance = 0.05;
      this.showToast('Walkthrough active! Use WASD or Arrow Keys to walk');
    } else {
      this.isWalkthrough = false;
      if (hud) hud.style.display = 'none';
      this.controls.maxPolarAngle = Math.PI / 2 - 0.02;
      this.controls.minDistance = 2.0;

      switch (mode) {
        case 'top':
          // Top-down Floor Plan
          this.camera.position.set(0, 9.0, 0.001);
          this.controls.target.set(0, 0, 0);
          break;
        case 'front':
          // Front elevation
          this.camera.position.set(0, 1.8, 6.5);
          this.controls.target.set(0, 1.4, 0);
          break;
        case '3d':
        default:
          // Free 3D Orbit
          this.camera.position.set(0, 4.5, 6.8);
          this.controls.target.set(0, 1.0, 0);
          break;
      }
    }
    this.controls.update();
  }

  // 7. AI DESIGN GENERATION
  async triggerAIGeneration() {
    this.showToast('AI is optimizing spatial layout...');

    const pref = {
      roomType: document.getElementById('room-type').value,
      dimensions: {
        width: parseFloat(document.getElementById('room-w').value) || 5.0,
        length: parseFloat(document.getElementById('room-l').value) || 4.5,
        height: parseFloat(document.getElementById('room-h').value) || 2.8
      },
      style: this.currentStyle,
      colorScheme: document.getElementById('color-scheme').value,
      flooring: document.getElementById('flooring-select').value,
      lighting: document.getElementById('lighting-select').value,
      customNotes: document.getElementById('custom-notes').value
    };

    // 1. Rebuild room architecture with new dimensions and style
    this.currentRoomDimensions = pref.dimensions;
    this.roomBuilder.buildRoom(pref.dimensions, 0xfaf5ee, pref.flooring);

    // 2. Clear old furniture
    while (this.furnitureGroup.children.length > 0) {
      this.furnitureGroup.remove(this.furnitureGroup.children[0]);
    }
    this.deselectObject();

    // 3. Generate AI recommendations
    const designPlan = await AIEngine.generateDesign(pref, this.geminiApiKey);
    this.lastDesignPlan = designPlan;

    // Apply wall color from plan
    if (designPlan.wallColorHex) {
      this.roomBuilder.setWallColor(designPlan.wallColorHex);
      document.getElementById('wall-color-picker').value = designPlan.palette.wallColorHex;
    }

    // 4. Populate 3D furniture
    designPlan.items.forEach(item => {
      this.addFurnitureItem(item);
    });

    // 5. Update AI Insights Tab UI
    document.getElementById('ai-concept-title').textContent = designPlan.conceptName;
    document.getElementById('ai-concept-desc').textContent = designPlan.description;
    document.getElementById('ai-spatial-text').textContent = designPlan.spatialRationale;
    document.getElementById('ai-lighting-text').textContent = designPlan.lightingPlan;
    document.getElementById('ai-total-budget').textContent = `$${designPlan.totalEstimatedCost.toLocaleString()}`;

    // Color Swatches
    const chipsContainer = document.getElementById('palette-chips-container');
    chipsContainer.innerHTML = '';
    const swatches = [
      { name: 'Walls', hex: designPlan.palette.wallColorHex },
      { name: 'Accent', hex: designPlan.palette.accentColorHex },
      { name: 'Furniture', hex: designPlan.palette.sofaColorHex },
      { name: 'Wood/Trim', hex: designPlan.palette.woodColorHex }
    ];
    swatches.forEach(sw => {
      const chip = document.createElement('div');
      chip.className = 'color-chip';
      chip.style.backgroundColor = sw.hex;
      chip.title = `${sw.name}: ${sw.hex}`;
      chipsContainer.appendChild(chip);
    });

    // Items Checklist
    const checklist = document.getElementById('ai-items-checklist');
    checklist.innerHTML = '';
    designPlan.items.forEach(item => {
      const row = document.createElement('div');
      row.className = 'item-row';
      row.innerHTML = `
        <div>
          <strong>${item.name}</strong>
          <span style="color: var(--text-dim); margin-left: 6px;">${item.style}</span>
        </div>
        <span class="badge">$${item.cost}</span>
      `;
      checklist.appendChild(row);
    });

    this.showToast('Design generated & 3D space rendered!');
  }

  // 8. ADD FURNITURE ITEM FACTORY HELPER
  addFurnitureItem(itemData) {
    let meshGroup = null;
    const style = itemData.style || this.currentStyle;

    switch (itemData.type) {
      case 'sofa':
        meshGroup = FurnitureFactory.createSofa(style, itemData.color);
        break;
      case 'coffee_table':
        meshGroup = FurnitureFactory.createCoffeeTable(style, itemData.color);
        break;
      case 'tv_unit':
        meshGroup = FurnitureFactory.createTVUnit(style);
        break;
      case 'armchair':
        meshGroup = FurnitureFactory.createArmchair(style, itemData.color);
        break;
      case 'floor_lamp':
        meshGroup = FurnitureFactory.createFloorLamp(style);
        break;
      case 'bed':
        meshGroup = FurnitureFactory.createBed(style, itemData.color);
        break;
      case 'nightstand':
        meshGroup = FurnitureFactory.createNightstand(style);
        break;
      case 'desk':
        meshGroup = FurnitureFactory.createDesk(style);
        break;
      case 'office_chair':
        meshGroup = FurnitureFactory.createOfficeChair();
        break;
      case 'dining_set':
        meshGroup = FurnitureFactory.createDiningSet(style, itemData.color);
        break;
      case 'bookshelf':
        meshGroup = FurnitureFactory.createBookshelf(style);
        break;
      case 'plant':
        meshGroup = FurnitureFactory.createPlant();
        break;
      case 'wall_art':
        meshGroup = FurnitureFactory.createWallArt(style);
        break;
      case 'rug':
        const [w, l] = itemData.dimensions || [2.4, 1.8];
        meshGroup = FurnitureFactory.createRug(w, l, style);
        break;
      case 'wardrobe':
        meshGroup = FurnitureFactory.createWardrobe(style, itemData.color);
        break;
      case 'pendant_light':
        meshGroup = FurnitureFactory.createPendantLight(style);
        break;
      case 'floor_mirror':
        meshGroup = FurnitureFactory.createFloorMirror(style);
        break;
      case 'credenza':
        meshGroup = FurnitureFactory.createCredenza(style, itemData.color);
        break;
      case 'gaming_desk':
        meshGroup = FurnitureFactory.createGamingDesk(style);
        break;
      default:
        meshGroup = FurnitureFactory.createCoffeeTable(style);
        break;
    }

    if (meshGroup) {
      if (itemData.position) meshGroup.position.set(...itemData.position);
      if (itemData.rotation) meshGroup.rotation.set(...itemData.rotation);
      meshGroup.userData = { ...meshGroup.userData, ...itemData };
      this.furnitureGroup.add(meshGroup);
    }
  }

  // 9. SNAPSHOT & DESIGN REPORT EXPORT
  captureSnapshot() {
    this.renderer.render(this.scene, this.camera);
    const dataURL = this.canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `ai-interior-design-${Date.now()}.png`;
    link.href = dataURL;
    link.click();
    this.showToast('High-resolution 3D snapshot saved!');
  }

  openDesignReport() {
    const reportModal = document.getElementById('report-modal');
    const reportBody = document.getElementById('report-body-content');
    if (!reportModal || !reportBody) return;

    // Capture current 3D canvas snapshot
    this.renderer.render(this.scene, this.camera);
    const snapshotUrl = this.canvas.toDataURL('image/png');

    const projectName = document.getElementById('project-name-input')?.value || 'Interior Design Project';
    const roomType = document.getElementById('room-type')?.value || 'living_room';
    const roomTypeLabel = roomType.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
    const w = parseFloat(document.getElementById('room-w')?.value) || 5.0;
    const l = parseFloat(document.getElementById('room-l')?.value) || 4.5;
    const h = parseFloat(document.getElementById('room-h')?.value) || 2.8;
    const areaSqM = (w * l).toFixed(1);
    const areaSqFt = ((w * l) * 10.7639).toFixed(0);
    const flooring = document.getElementById('flooring-select')?.value || 'wood_oak';
    const flooringLabel = flooring.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
    const lighting = document.getElementById('lighting-select')?.value || 'warm_ambient';
    const lightingLabel = lighting.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
    const wallColor = document.getElementById('wall-color-picker')?.value || '#faf5ee';

    // Compute total cost and schedule of all placed furniture
    let totalCost = 0;
    const itemsList = this.furnitureGroup.children.map((child, idx) => {
      const cost = child.userData?.cost || 150;
      totalCost += cost;
      return {
        id: idx + 1,
        name: child.name || child.userData?.name || 'Furniture Item',
        type: (child.userData?.type || 'furniture').replace('_', ' '),
        posX: child.position.x.toFixed(2),
        posZ: child.position.z.toFixed(2),
        cost: cost
      };
    });

    const dateStr = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

    reportBody.innerHTML = `
      <div class="report-grid-top">
        <div class="report-preview-box">
          <img src="${snapshotUrl}" alt="3D Space Snapshot" class="report-preview-img">
        </div>
        <div>
          <table class="report-specs-table">
            <tr><td>Project Name</td><td>${projectName}</td></tr>
            <tr><td>Date Created</td><td>${dateStr}</td></tr>
            <tr><td>Room Classification</td><td>${roomTypeLabel} (${this.currentStyle.toUpperCase()})</td></tr>
            <tr><td>Dimensions (W × L × H)</td><td>${w}m × ${l}m × ${h}m</td></tr>
            <tr><td>Floor Area</td><td>${areaSqM} m² (${areaSqFt} sq ft)</td></tr>
            <tr><td>Flooring Surface</td><td>${flooringLabel}</td></tr>
            <tr><td>Lighting Strategy</td><td>${lightingLabel}</td></tr>
          </table>
        </div>
      </div>

      <div>
        <h4 style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-muted); margin-bottom: 6px;">Palette & Material Accent Swatches</h4>
        <div class="report-swatch-list">
          <div class="report-swatch-card">
            <div class="report-swatch-color" style="background: ${wallColor};"></div>
            <div><div style="font-size: 11px; font-weight: 600;">Wall Paint</div><div style="font-size: 10px; color: var(--text-dim);">${wallColor}</div></div>
          </div>
          <div class="report-swatch-card">
            <div class="report-swatch-color" style="background: #3d4451;"></div>
            <div><div style="font-size: 11px; font-weight: 600;">Primary Fabric</div><div style="font-size: 10px; color: var(--text-dim);">#3D4451</div></div>
          </div>
          <div class="report-swatch-card">
            <div class="report-swatch-color" style="background: #8b5a2b;"></div>
            <div><div style="font-size: 11px; font-weight: 600;">Wood Grain</div><div style="font-size: 10px; color: var(--text-dim);">#8B5A2B</div></div>
          </div>
          <div class="report-swatch-card">
            <div class="report-swatch-color" style="background: #d4af37;"></div>
            <div><div style="font-size: 11px; font-weight: 600;">Metallic Accents</div><div style="font-size: 10px; color: var(--text-dim);">#D4AF37</div></div>
          </div>
        </div>
      </div>

      <div>
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-top: 10px;">
          <h4 style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-muted);">Itemized Fixture Schedule (${itemsList.length} Items)</h4>
          <div style="font-size: 16px; font-weight: 700; color: #10b981;">Total: $${totalCost.toLocaleString()}</div>
        </div>
        <table class="report-items-table">
          <thead>
            <tr>
              <th style="width: 40px;">#</th>
              <th>Item Name</th>
              <th>Category</th>
              <th>Room Coordinates (X, Z)</th>
              <th style="text-align: right;">Est. Cost</th>
            </tr>
          </thead>
          <tbody>
            ${itemsList.map(item => `
              <tr>
                <td>${item.id}</td>
                <td><strong>${item.name}</strong></td>
                <td style="text-transform: capitalize;">${item.type}</td>
                <td>X: ${item.posX}m, Z: ${item.posZ}m</td>
                <td style="text-align: right; font-weight: 600;">$${item.cost}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    reportModal.classList.add('open');
  }

  // 10. PROJECT STORAGE & PERSISTENCE
  initProjects() {
    this.renderSavedProjectsList();

    // Save as new project
    document.getElementById('btn-save-as-new').addEventListener('click', () => {
      const name = document.getElementById('project-name-input').value.trim() || 'My Interior Project';
      this.saveProject(name);
    });

    document.getElementById('btn-save-project').addEventListener('click', () => {
      const name = document.getElementById('project-name-input').value.trim() || 'My Interior Project';
      this.saveProject(name);
    });

    // Export JSON
    document.getElementById('btn-export-json').addEventListener('click', () => {
      const projectData = this.getCurrentProjectData();
      const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `interior-project-${Date.now()}.json`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      this.showToast('Exported project JSON');
    });

    // Import JSON
    const fileInput = document.getElementById('file-import-json');
    document.getElementById('btn-trigger-import').addEventListener('click', () => {
      fileInput.click();
    });
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          this.loadProjectData(data);
          this.showToast('Imported project successfully!');
        } catch (err) {
          this.showToast('Failed to parse JSON file');
        }
      };
      reader.readAsText(file);
    });
  }

  getCurrentProjectData() {
    return {
      name: document.getElementById('project-name-input').value,
      roomType: document.getElementById('room-type').value,
      dimensions: {
        width: parseFloat(document.getElementById('room-w').value),
        length: parseFloat(document.getElementById('room-l').value),
        height: parseFloat(document.getElementById('room-h').value)
      },
      style: this.currentStyle,
      colorScheme: document.getElementById('color-scheme').value,
      flooring: document.getElementById('flooring-select').value,
      lighting: document.getElementById('lighting-select').value,
      wallColor: document.getElementById('wall-color-picker').value,
      furniture: this.furnitureGroup.children.map(child => ({
        type: child.userData?.type || 'furniture',
        name: child.name,
        position: [child.position.x, child.position.y, child.position.z],
        rotation: [child.rotation.x, child.rotation.y, child.rotation.z],
        cost: child.userData?.cost || 0
      }))
    };
  }

  saveProject(name) {
    const projects = JSON.parse(localStorage.getItem('ai_interior_projects') || '{}');
    projects[name] = this.getCurrentProjectData();
    localStorage.setItem('ai_interior_projects', JSON.stringify(projects));
    this.renderSavedProjectsList();
    this.showToast(`Saved project: "${name}"`);
  }

  renderSavedProjectsList() {
    const container = document.getElementById('saved-projects-list');
    container.innerHTML = '';
    const projects = JSON.parse(localStorage.getItem('ai_interior_projects') || '{}');
    const names = Object.keys(projects);

    if (names.length === 0) {
      container.innerHTML = '<span style="font-size: 11px; color: var(--text-dim);">No saved projects yet.</span>';
      return;
    }

    names.forEach(name => {
      const item = document.createElement('div');
      item.className = 'item-row';
      item.innerHTML = `
        <span style="font-weight: 600; cursor: pointer;">${name}</span>
        <div style="display: flex; gap: 6px;">
          <button class="btn btn-sm load-proj" style="padding: 3px 8px;">Load</button>
          <button class="btn btn-sm btn-danger del-proj" style="padding: 3px 6px;">&times;</button>
        </div>
      `;

      item.querySelector('.load-proj').addEventListener('click', () => {
        this.loadProjectData(projects[name]);
        this.showToast(`Loaded: ${name}`);
      });

      item.querySelector('.del-proj').addEventListener('click', () => {
        delete projects[name];
        localStorage.setItem('ai_interior_projects', JSON.stringify(projects));
        this.renderSavedProjectsList();
        this.showToast(`Deleted: ${name}`);
      });

      container.appendChild(item);
    });
  }

  loadProjectData(data) {
    if (!data) return;
    if (data.name) document.getElementById('project-name-input').value = data.name;
    if (data.roomType) document.getElementById('room-type').value = data.roomType;
    if (data.dimensions) {
      document.getElementById('room-w').value = data.dimensions.width;
      document.getElementById('room-l').value = data.dimensions.length;
      document.getElementById('room-h').value = data.dimensions.height;
    }
    if (data.style) {
      this.currentStyle = data.style;
      document.querySelectorAll('.style-card').forEach(c => {
        c.classList.toggle('selected', c.dataset.style === data.style);
      });
    }

    this.roomBuilder.buildRoom(data.dimensions, 0xfaf5ee, data.flooring || 'wood_oak');
    if (data.wallColor) {
      this.roomBuilder.setWallColor(parseInt(data.wallColor.replace('#', '0x'), 16));
    }

    while (this.furnitureGroup.children.length > 0) {
      this.furnitureGroup.remove(this.furnitureGroup.children[0]);
    }

    if (Array.isArray(data.furniture)) {
      data.furniture.forEach(item => this.addFurnitureItem(item));
    }
  }

  // 11. TOAST NOTIFICATION
  showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>✨</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  // 12. ANIMATION LOOP WITH INTERACTIVE WALKTHROUGH
  animate() {
    requestAnimationFrame(this.animate);

    if (this.isWalkthrough) {
      const moveSpeed = 0.05;
      const forward = new THREE.Vector3();
      this.camera.getWorldDirection(forward);
      forward.y = 0;
      forward.normalize();

      const right = new THREE.Vector3();
      right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

      let moved = false;
      if (this.keysDown['KeyW'] || this.keysDown['ArrowUp']) {
        this.camera.position.addScaledVector(forward, moveSpeed);
        moved = true;
      }
      if (this.keysDown['KeyS'] || this.keysDown['ArrowDown']) {
        this.camera.position.addScaledVector(forward, -moveSpeed);
        moved = true;
      }
      if (this.keysDown['KeyA'] || this.keysDown['ArrowLeft']) {
        this.camera.position.addScaledVector(right, -moveSpeed);
        moved = true;
      }
      if (this.keysDown['KeyD'] || this.keysDown['ArrowRight']) {
        this.camera.position.addScaledVector(right, moveSpeed);
        moved = true;
      }

      // Constrain within room boundary
      const halfW = ((this.currentRoomDimensions && this.currentRoomDimensions.width) || 5.0) / 2 - 0.4;
      const halfL = ((this.currentRoomDimensions && this.currentRoomDimensions.length) || 4.5) / 2 - 0.4;
      this.camera.position.x = Math.max(-halfW, Math.min(halfW, this.camera.position.x));
      this.camera.position.z = Math.max(-halfL, Math.min(halfL, this.camera.position.z));
      this.camera.position.y = 1.6; // Constant eye level

      if (moved) {
        this.controls.target.copy(this.camera.position).add(forward.clone().multiplyScalar(2.0));
      }
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}

// Instantiate App once DOM is loaded
if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', () => { new App(); });
} else {
  new App();
}


})();