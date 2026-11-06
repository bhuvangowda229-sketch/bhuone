// AI Interior Studio Landing Demo Bundle (Zero-CORS, Works on file:// and http://)
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

  // Large Format Continuous Light Porcelain Tile Texture
  static createPorcelainTileTexture(colorHex = 0xf8f9fa, groutHex = 0xd5d9dc) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Base light porcelain tone
    ctx.fillStyle = '#' + colorHex.toString(16).padStart(6, '0');
    ctx.fillRect(0, 0, 512, 512);

    // Subtle stone micro-clouding and natural porcelain mottling
    for (let i = 0; i < 24; i++) {
      const cx = Math.random() * 512;
      const cy = Math.random() * 512;
      const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 60 + Math.random() * 80);
      const isLighter = Math.random() > 0.5;
      grad.addColorStop(0, isLighter ? 'rgba(255, 255, 255, 0.28)' : 'rgba(215, 220, 225, 0.22)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, 140, 0, Math.PI * 2);
      ctx.fill();
    }

    // Large-format rectangular slabs (e.g., 256x128px representing 120cm x 60cm porcelain slabs)
    const slabW = 256;
    const slabH = 128;
    ctx.strokeStyle = '#' + groutHex.toString(16).padStart(6, '0');
    ctx.lineWidth = 1.5;

    for (let y = 0; y <= 512; y += slabH) {
      const offset = ((y / slabH) % 2 === 0) ? 0 : slabW / 2;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(512, y);
      ctx.stroke();

      for (let x = -slabW; x <= 512 + slabW; x += slabW) {
        ctx.beginPath();
        ctx.moveTo(x + offset, y);
        ctx.lineTo(x + offset, y + slabH);
        ctx.stroke();
      }
    }

    // Very faint fine mineral veins (ultra-subtle Carrara/Calacatta porcelain glaze)
    ctx.strokeStyle = 'rgba(160, 165, 175, 0.12)';
    ctx.lineWidth = 0.8;
    for (let v = 0; v < 3; v++) {
      ctx.beginPath();
      let vx = Math.random() * 512;
      let vy = 0;
      ctx.moveTo(vx, vy);
      while (vy < 512) {
        vx += (Math.random() - 0.48) * 35;
        vy += 25 + Math.random() * 30;
        ctx.lineTo(vx, vy);
      }
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }

  // Authentic Herringbone Parquet Wood Flooring Texture
  static createHerringboneWoodTexture(baseWoodHex = 0xb8824f, darkGrainHex = 0x6e4321) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Base background
    ctx.fillStyle = '#' + darkGrainHex.toString(16).padStart(6, '0');
    ctx.fillRect(0, 0, 512, 512);

    const pw = 28;
    const pl = 112;

    const oakTones = [
      '#c28f5b', '#b98552', '#a87343', '#c99763', '#9e6a3a', '#b37d4a', '#caa06d'
    ];

    ctx.save();
    for (let by = -pl; by <= 512 + pl; by += 56) {
      for (let bx = -pl; bx <= 512 + pl; bx += 56) {
        // Plank A (45 degrees)
        ctx.save();
        ctx.translate(bx, by);
        ctx.rotate(Math.PI / 4);

        const colorA = oakTones[Math.abs(Math.floor(bx * 7 + by * 13)) % oakTones.length];
        ctx.fillStyle = colorA;
        ctx.fillRect(0, 0, pl, pw);

        ctx.strokeStyle = 'rgba(70, 35, 12, 0.14)';
        for (let g = 3; g < pw - 3; g += 5) {
          ctx.lineWidth = 0.8 + Math.random() * 0.8;
          ctx.beginPath();
          ctx.moveTo(0, g);
          ctx.lineTo(pl, g + (Math.random() - 0.5) * 4);
          ctx.stroke();
        }

        ctx.strokeStyle = 'rgba(35, 18, 6, 0.45)';
        ctx.lineWidth = 1.2;
        ctx.strokeRect(0, 0, pl, pw);
        ctx.restore();

        // Plank B (-45 degrees)
        ctx.save();
        ctx.translate(bx + 40, by);
        ctx.rotate(-Math.PI / 4);

        const colorB = oakTones[Math.abs(Math.floor(bx * 11 + by * 17 + 5)) % oakTones.length];
        ctx.fillStyle = colorB;
        ctx.fillRect(0, 0, pl, pw);

        ctx.strokeStyle = 'rgba(70, 35, 12, 0.14)';
        for (let g = 3; g < pw - 3; g += 5) {
          ctx.lineWidth = 0.8 + Math.random() * 0.8;
          ctx.beginPath();
          ctx.moveTo(0, g);
          ctx.lineTo(pl, g + (Math.random() - 0.5) * 4);
          ctx.stroke();
        }

        ctx.strokeStyle = 'rgba(35, 18, 6, 0.45)';
        ctx.lineWidth = 1.2;
        ctx.strokeRect(0, 0, pl, pw);
        ctx.restore();
      }
    }
    ctx.restore();

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

  // Lush Garden Grass Texture
  static createGrassTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#4d7c0f';
    ctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 3500; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      const h = 3 + Math.random() * 5;
      const colors = ['#65a30d', '#3f6212', '#84cc16', '#365314', '#558b2f'];
      ctx.strokeStyle = colors[Math.floor(Math.random() * colors.length)];
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + (Math.random() - 0.5) * 2, y - h);
      ctx.stroke();
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }

  // Driveway & Patio Stone Paving Texture
  static createPavingTexture(colorHex = 0xd1d5db) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#' + colorHex.toString(16).padStart(6, '0');
    ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 2;
    const s = 64;
    for (let y = 0; y <= 256; y += s) {
      const offset = (y / s) % 2 === 0 ? 0 : s / 2;
      for (let x = -s; x <= 256 + s; x += s) {
        ctx.strokeRect(x + offset, y, s, s);
      }
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }

  // Aqua / Sky Blue Bathroom Designer Tile Texture
  static createBlueTileTexture(colorHex = 0x38bdf8, groutHex = 0x0284c7) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#' + colorHex.toString(16).padStart(6, '0');
    ctx.fillRect(0, 0, 256, 256);
    const tileSize = 48;
    ctx.strokeStyle = '#' + groutHex.toString(16).padStart(6, '0');
    ctx.lineWidth = 2;
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

  // Rustic Exposed Red Brick Wall Texture
  static createBrickTexture(brickHex = 0xa34129, mortarHex = 0xd6c7b2) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Mortar background
    ctx.fillStyle = '#' + mortarHex.toString(16).padStart(6, '0');
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const rows = 16;
    const cols = 6;
    const rowH = canvas.height / rows;
    const colW = canvas.width / cols;
    const mortar = 4;

    for (let r = 0; r < rows; r++) {
      const isOffset = (r % 2 === 1);
      const startCol = isOffset ? -1 : 0;
      const endCol = isOffset ? cols : cols - 1;

      for (let c = startCol; c <= endCol; c++) {
        const x = c * colW + (isOffset ? colW / 2 : 0) + mortar / 2;
        const y = r * rowH + mortar / 2;
        const w = colW - mortar;
        const h = rowH - mortar;

        // Brick base color variation
        const varR = (Math.random() - 0.5) * 35;
        const varG = (Math.random() - 0.5) * 20;
        const baseR = Math.min(255, Math.max(0, 163 + varR));
        const baseG = Math.min(255, Math.max(0, 65 + varG));
        const baseB = Math.min(255, Math.max(0, 41 + (Math.random() - 0.5) * 15));

        ctx.fillStyle = `rgb(${Math.round(baseR)}, ${Math.round(baseG)}, ${Math.round(baseB)})`;
        ctx.fillRect(x, y, w, h);

        // Brick surface grain / texture specks
        for (let s = 0; s < 18; s++) {
          const sx = x + Math.random() * w;
          const sy = y + Math.random() * h;
          ctx.fillStyle = Math.random() > 0.5 ? 'rgba(0,0,0,0.18)' : 'rgba(255,255,255,0.15)';
          ctx.fillRect(sx, sy, 2 + Math.random() * 3, 2 + Math.random() * 2);
        }
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
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

    // Adjustable configurations for Window and Door
    this.windowConfig = {
      wall: 'left',      // 'left' | 'back' | 'right'
      offset: 0.0,       // position along the wall in meters
      width: 1.6,        // window width
      height: 1.4,       // window height
      elevation: 1.5     // center height from floor
    };

    this.doorConfig = {
      wall: 'right',     // 'right' | 'back' | 'left'
      offset: 0,         // position along the wall in meters
      width: 1.05,       // door width
      height: 2.2,       // door height
      openAngle: 0,      // 0 to 90 degrees swing
      finish: 'teak'     // 'teak' | 'walnut' | 'charcoal' | 'white'
    };

    this.windowGroup = null;
    this.doorGroup = null;
    this.doorHinge = null;

    // Complete House Multi-Room Architecture Properties
    this.isCompleteHouse = false;
    this.houseFloors = [];
    this.houseWalls = [];
    this.frontWalls = [];
    this.roomBadges = [];
  }

  buildRoom(dimensions, wallColorHex = 0xf3f4f6, flooringType = 'wood_oak') {
    this.isCompleteHouse = false;
    this.houseFloors = [];
    this.houseWalls = [];
    this.frontWalls = [];
    this.roomBadges = [];
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
      case 'porcelain_tile':
      case 'porcelain':
        floorTexture = TextureGenerator.createPorcelainTileTexture(0xf8f9fa, 0xd1d5db);
        roughness = 0.16;
        metalness = 0.08;
        break;
      case 'herringbone_wood':
      case 'herringbone':
        floorTexture = TextureGenerator.createHerringboneWoodTexture(0xb8824f, 0x6e4321);
        roughness = 0.42;
        metalness = 0.04;
        break;
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

    const createWallMat = (key) => new THREE.MeshStandardMaterial({
      color: wallColorHex,
      roughness: 0.85,
      side: THREE.DoubleSide
    });

    // Back Wall (-Z)
    const backGeom = new THREE.BoxGeometry(W, H, wallThickness);
    this.walls.back = new THREE.Mesh(backGeom, createWallMat('back'));
    this.walls.back.name = 'Back Wall';
    this.walls.back.userData = { type: 'wall', wallKey: 'back', name: 'Back Wall' };
    this.walls.back.position.set(0, H / 2, -L / 2 - wallThickness / 2);
    this.walls.back.receiveShadow = true;
    this.walls.back.castShadow = true;
    this.roomGroup.add(this.walls.back);

    // Left Wall (-X)
    const leftGeom = new THREE.BoxGeometry(wallThickness, H, L);
    this.walls.left = new THREE.Mesh(leftGeom, createWallMat('left'));
    this.walls.left.name = 'Left Wall';
    this.walls.left.userData = { type: 'wall', wallKey: 'left', name: 'Left Wall' };
    this.walls.left.position.set(-W / 2 - wallThickness / 2, H / 2, 0);
    this.walls.left.receiveShadow = true;
    this.walls.left.castShadow = true;
    this.roomGroup.add(this.walls.left);

    // Right Wall (+X)
    const rightGeom = new THREE.BoxGeometry(wallThickness, H, L);
    this.walls.right = new THREE.Mesh(rightGeom, createWallMat('right'));
    this.walls.right.name = 'Right Wall';
    this.walls.right.userData = { type: 'wall', wallKey: 'right', name: 'Right Wall' };
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
    this.walls.front.name = 'Front Wall';
    this.walls.front.userData = { type: 'wall', wallKey: 'front', name: 'Front Wall' };
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
    this.rebuildWindow(W, L, H);
    this.rebuildDoor(W, L, H);
  }

  rebuildWindow(W, L, H) {
    if (this.windowGroup) {
      this.roomGroup.remove(this.windowGroup);
      this.windowGroup.traverse(child => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
          else child.material.dispose();
        }
      });
      this.windowGroup = null;
    }

    const cfg = this.windowConfig;
    const wallSpan = (cfg.wall === 'back') ? W : L;
    const winW = Math.max(0.6, Math.min(wallSpan - 0.4, cfg.width));
    const winH = Math.max(0.6, Math.min(H - 0.3, cfg.height));
    const winDepth = 0.06;

    // Clamp offset along wall so window stays safely on wall
    const maxOffset = Math.max(0.1, (wallSpan / 2) - (winW / 2) - 0.15);
    const minOffset = -maxOffset;
    const clampedOffset = Math.max(minOffset, Math.min(maxOffset, cfg.offset));
    cfg.offset = clampedOffset;

    const elev = Math.max(winH / 2 + 0.3, Math.min(H - winH / 2 - 0.1, cfg.elevation));
    cfg.elevation = elev;

    this.windowGroup = new THREE.Group();
    this.windowGroup.name = 'Picture Window';
    this.windowGroup.userData = { isArchitecture: true, type: 'window', name: 'Picture Window' };

    const frameMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.3 });
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xbae6fd,
      transmission: 0.9,
      opacity: 0.4,
      transparent: true,
      roughness: 0.1
    });

    // Window frame (outer)
    const frame = new THREE.Mesh(new THREE.BoxGeometry(winDepth, winH, winW), frameMat);
    frame.name = 'Window Frame';
    this.windowGroup.add(frame);

    // Glass pane
    const glass = new THREE.Mesh(new THREE.BoxGeometry(0.01, winH - 0.1, winW - 0.1), glassMat);
    glass.name = 'Window Glass';
    this.windowGroup.add(glass);

    // Window mullions (crossbars)
    const crossV = new THREE.Mesh(new THREE.BoxGeometry(winDepth + 0.01, winH - 0.1, 0.03), frameMat);
    crossV.name = 'Window Mullion Vertical';
    const crossH = new THREE.Mesh(new THREE.BoxGeometry(winDepth + 0.01, 0.03, winW - 0.1), frameMat);
    crossH.name = 'Window Mullion Horizontal';
    this.windowGroup.add(crossV);
    this.windowGroup.add(crossH);

    // Position based on selected wall
    if (cfg.wall === 'left') {
      this.windowGroup.position.set(-W / 2 + 0.02, elev, clampedOffset);
      this.windowGroup.rotation.y = 0;
    } else if (cfg.wall === 'right') {
      this.windowGroup.position.set(W / 2 - 0.02, elev, clampedOffset);
      this.windowGroup.rotation.y = Math.PI;
    } else if (cfg.wall === 'back') {
      this.windowGroup.position.set(clampedOffset, elev, -L / 2 + 0.02);
      this.windowGroup.rotation.y = -Math.PI / 2;
    }

    this.windowGroup.traverse(child => {
      child.userData.rootGroup = this.windowGroup;
    });

    this.roomGroup.add(this.windowGroup);
  }

  getDoorFinishMaterials(finish = 'teak') {
    switch (finish) {
      case 'walnut':
        return {
          frameColor: 0x1f2937,
          panelColor: 0x3e2723,
          slatColor: 0x271916,
          handleColor: 0xd4af37,
          roughness: 0.38,
          metalness: 0.05
        };
      case 'charcoal':
        return {
          frameColor: 0x0f172a,
          panelColor: 0x1e293b,
          slatColor: 0x0f172a,
          handleColor: 0xe2b755,
          roughness: 0.35,
          metalness: 0.08
        };
      case 'white':
        return {
          frameColor: 0x334155,
          panelColor: 0xf8fafc,
          slatColor: 0xe2e8f0,
          handleColor: 0x1e293b,
          roughness: 0.45,
          metalness: 0.02
        };
      case 'teak':
      default:
        return {
          frameColor: 0x1e293b,
          panelColor: 0x9a3412,
          slatColor: 0x451a03,
          handleColor: 0xd4af37,
          roughness: 0.35,
          metalness: 0.05
        };
    }
  }

  rebuildDoor(W, L, H) {
    if (this.doorGroup) {
      this.roomGroup.remove(this.doorGroup);
      this.doorGroup.traverse(child => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
          else child.material.dispose();
        }
      });
      this.doorGroup = null;
      this.doorHinge = null;
    }

    const cfg = this.doorConfig;
    const matInfo = this.getDoorFinishMaterials(cfg.finish || 'teak');
    const wallSpan = (cfg.wall === 'back') ? W : L;
    const doorW = Math.max(0.65, Math.min(1.4, cfg.width));
    const doorH = Math.max(1.8, Math.min(H - 0.05, cfg.height));

    // Clamp offset along wall
    const maxOffset = Math.max(0.1, (wallSpan / 2) - (doorW / 2) - 0.15);
    const minOffset = -maxOffset;
    const clampedOffset = Math.max(minOffset, Math.min(maxOffset, cfg.offset));
    cfg.offset = clampedOffset;

    this.doorGroup = new THREE.Group();
    this.doorGroup.name = 'Room Door';
    this.doorGroup.userData = { isArchitecture: true, type: 'door', name: 'Room Door' };

    const doorFrameMat = new THREE.MeshStandardMaterial({ color: matInfo.frameColor, roughness: 0.5 });
    const doorMat = new THREE.MeshStandardMaterial({ color: matInfo.panelColor, roughness: matInfo.roughness, metalness: matInfo.metalness });

    // Outer door jamb / frame
    const frameTop = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, doorW + 0.08), doorFrameMat);
    frameTop.position.set(0, doorH + 0.02, 0);
    const frameLeft = new THREE.Mesh(new THREE.BoxGeometry(0.06, doorH, 0.04), doorFrameMat);
    frameLeft.position.set(0, doorH / 2, -doorW / 2 - 0.02);
    const frameRight = new THREE.Mesh(new THREE.BoxGeometry(0.06, doorH, 0.04), doorFrameMat);
    frameRight.position.set(0, doorH / 2, doorW / 2 + 0.02);

    this.doorGroup.add(frameTop);
    this.doorGroup.add(frameLeft);
    this.doorGroup.add(frameRight);

    // Floor sill
    const sill = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.015, doorW + 0.09), new THREE.MeshStandardMaterial({ color: 0xb49144, metalness: 0.8, roughness: 0.25 }));
    sill.position.set(0, 0.008, 0);
    this.doorGroup.add(sill);

    // Door hinge pivot located at side of opening
    this.doorHinge = new THREE.Group();
    this.doorHinge.name = 'Door Hinge';
    this.doorHinge.position.set(0, 0, -doorW / 2);

    // Door panel centered inside hinge pivot
    const doorPanel = new THREE.Mesh(new THREE.BoxGeometry(0.04, doorH - 0.02, doorW - 0.02), doorMat);
    doorPanel.position.set(0, (doorH - 0.02) / 2, doorW / 2);
    doorPanel.castShadow = true;
    doorPanel.receiveShadow = true;
    doorPanel.name = 'Door Panel';
    this.doorHinge.add(doorPanel);

    // Door handle (brass / designer)
    const handleMat = new THREE.MeshStandardMaterial({ color: matInfo.handleColor, metalness: 0.85, roughness: 0.2 });
    const handleCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.12, 12), handleMat);
    handleCyl.rotation.x = Math.PI / 2;
    handleCyl.position.set(-0.035, 1.0, doorW - 0.12);
    const handleLever = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.015, 0.1), handleMat);
    handleLever.position.set(-0.05, 1.0, doorW - 0.07);
    this.doorHinge.add(handleCyl);
    this.doorHinge.add(handleLever);

    // Apply swing angle
    const rad = (cfg.openAngle || 0) * (Math.PI / 180);
    this.doorHinge.rotation.y = rad;

    this.doorGroup.add(this.doorHinge);

    // Position based on selected wall
    if (cfg.wall === 'right') {
      this.doorGroup.position.set(W / 2 - 0.02, 0, clampedOffset);
      this.doorGroup.rotation.y = 0;
    } else if (cfg.wall === 'left') {
      this.doorGroup.position.set(-W / 2 + 0.02, 0, clampedOffset);
      this.doorGroup.rotation.y = Math.PI;
    } else if (cfg.wall === 'back') {
      this.doorGroup.position.set(clampedOffset, 0, -L / 2 + 0.02);
      this.doorGroup.rotation.y = -Math.PI / 2;
    }

    this.doorGroup.traverse(child => {
      child.userData.isDoor = true;
      child.userData.isArchitecture = true;
      child.userData.type = 'door';
      child.userData.rootGroup = this.doorGroup;
    });

    this.roomGroup.add(this.doorGroup);
  }

  buildVillaEntryDoor(H = 2.8) {
    if (this.doorGroup) {
      this.roomGroup.remove(this.doorGroup);
      this.doorGroup.traverse(child => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
          else child.material.dispose();
        }
      });
      this.doorGroup = null;
      this.doorHinge = null;
    }

    const cfg = this.doorConfig;
    const finish = cfg.finish || 'teak';
    const matInfo = this.getDoorFinishMaterials(finish);

    const doorW = Math.max(0.85, Math.min(1.25, cfg.width || 1.05));
    const doorH = Math.max(2.0, Math.min(2.35, cfg.height || 2.25));
    const offset = Math.max(-0.4, Math.min(0.4, typeof cfg.offset === 'number' ? cfg.offset : 0));
    cfg.offset = offset;
    cfg.width = doorW;
    cfg.height = doorH;

    this.doorGroup = new THREE.Group();
    this.doorGroup.name = 'Entrance Foyer Door';
    this.doorGroup.userData = { isArchitecture: true, type: 'door', name: 'Architectural Entry Door' };

    const frameMat = new THREE.MeshStandardMaterial({ color: matInfo.frameColor, roughness: 0.4 });
    const leafMat = new THREE.MeshStandardMaterial({ color: matInfo.panelColor, roughness: matInfo.roughness, metalness: matInfo.metalness });
    const slatMat = new THREE.MeshStandardMaterial({ color: matInfo.slatColor, roughness: matInfo.roughness + 0.05 });
    const brassHandleMat = new THREE.MeshStandardMaterial({ color: matInfo.handleColor, metalness: 0.85, roughness: 0.18 });
    const sillMat = new THREE.MeshStandardMaterial({ color: 0xb49144, metalness: 0.8, roughness: 0.25 });
    const lockMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2, metalness: 0.5 });
    const ledAccentMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });

    // 1. Satin Brass Floor Sill / Threshold
    const sillMesh = new THREE.Mesh(new THREE.BoxGeometry(doorW + 0.12, 0.015, 0.18), sillMat);
    sillMesh.position.set(0, 0.008, 0);
    this.doorGroup.add(sillMesh);

    // 2. Door Frame / Jambs (Header & Side Stiles)
    const jambThickness = 0.05;
    const jambDepth = 0.16;
    const frameHeader = new THREE.Mesh(new THREE.BoxGeometry(doorW + 0.12, jambThickness, jambDepth), frameMat);
    frameHeader.position.set(0, doorH + jambThickness / 2, 0);
    this.doorGroup.add(frameHeader);

    const frameLeft = new THREE.Mesh(new THREE.BoxGeometry(jambThickness, doorH, jambDepth), frameMat);
    frameLeft.position.set(-doorW / 2 - jambThickness / 2, doorH / 2, 0);
    this.doorGroup.add(frameLeft);

    const frameRight = new THREE.Mesh(new THREE.BoxGeometry(jambThickness, doorH, jambDepth), frameMat);
    frameRight.position.set(doorW / 2 + jambThickness / 2, doorH / 2, 0);
    this.doorGroup.add(frameRight);

    // 3. Door Hinge Pivot Assembly
    this.doorHinge = new THREE.Group();
    this.doorHinge.name = 'Door Hinge Assembly';
    const hingeX = -doorW / 2 + 0.02;
    this.doorHinge.position.set(hingeX, 0, 0);

    // Door Leaf panel
    const leafW = doorW - 0.04;
    const leafH = doorH - 0.02;
    const leafThickness = 0.055;
    const leafMesh = new THREE.Mesh(new THREE.BoxGeometry(leafW, leafH, leafThickness), leafMat);
    leafMesh.position.set(leafW / 2, leafH / 2 + 0.01, 0);
    leafMesh.castShadow = true;
    leafMesh.receiveShadow = true;
    leafMesh.name = 'Door Leaf';
    this.doorHinge.add(leafMesh);

    // 4. Vertical Fluted Architectural Slats on Exterior Face (Z > 0)
    const slatSpacing = 0.09;
    const numSlats = Math.floor((leafW - 0.08) / slatSpacing);
    const startX = 0.04;
    for (let i = 0; i <= numSlats; i++) {
      const sx = startX + i * slatSpacing;
      if (sx < leafW - 0.02) {
        const slat = new THREE.Mesh(new THREE.BoxGeometry(0.024, leafH - 0.04, 0.014), slatMat);
        slat.position.set(sx, leafH / 2 + 0.01, leafThickness / 2 + 0.007);
        slat.castShadow = true;
        this.doorHinge.add(slat);
      }
    }

    // 5. Exterior Designer 95cm Vertical Pull Handle
    const handleDistFromLatch = 0.12;
    const handleX = leafW - handleDistFromLatch;
    const handleY = 1.15;
    const handleZ = leafThickness / 2 + 0.045;
    const pullBar = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.95, 16), brassHandleMat);
    pullBar.position.set(handleX, handleY, handleZ);
    pullBar.castShadow = true;
    this.doorHinge.add(pullBar);

    // Pull bar stand-offs / mounting brackets
    const bracketTop = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.04, 12), brassHandleMat);
    bracketTop.rotation.x = Math.PI / 2;
    bracketTop.position.set(handleX, handleY + 0.40, leafThickness / 2 + 0.02);
    this.doorHinge.add(bracketTop);

    const bracketBottom = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.04, 12), brassHandleMat);
    bracketBottom.rotation.x = Math.PI / 2;
    bracketBottom.position.set(handleX, handleY - 0.40, leafThickness / 2 + 0.02);
    this.doorHinge.add(bracketBottom);

    // 6. Exterior Keyless Smart Lock Escutcheon & Keypad
    const lockBody = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.16, 0.02), lockMat);
    lockBody.position.set(handleX, handleY + 0.58, leafThickness / 2 + 0.012);
    this.doorHinge.add(lockBody);

    const lockLed = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.006, 0.002), ledAccentMat);
    lockLed.position.set(handleX, handleY + 0.63, leafThickness / 2 + 0.023);
    this.doorHinge.add(lockLed);

    // 7. Interior Modern Lever Handle & Rose
    const rosePlate = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.008, 16), brassHandleMat);
    rosePlate.rotation.x = Math.PI / 2;
    rosePlate.position.set(handleX, 1.05, -leafThickness / 2 - 0.004);
    this.doorHinge.add(rosePlate);

    const leverStem = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.04, 12), brassHandleMat);
    leverStem.rotation.x = Math.PI / 2;
    leverStem.position.set(handleX, 1.05, -leafThickness / 2 - 0.02);
    this.doorHinge.add(leverStem);

    const leverHandle = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.016, 0.02), brassHandleMat);
    leverHandle.position.set(handleX - 0.05, 1.05, -leafThickness / 2 - 0.04);
    this.doorHinge.add(leverHandle);

    // 8. Apply Inward Swing (negative Y rotation into foyer)
    const angleDeg = cfg.openAngle || 0;
    this.doorHinge.rotation.y = -(angleDeg * Math.PI / 180);

    this.doorGroup.add(this.doorHinge);

    // Position at foyer front entrance wall (X = -4.7 + offset, Y = 0, Z = 6.4)
    this.doorGroup.position.set(-4.7 + offset, 0, 6.4);

    this.doorGroup.traverse(child => {
      child.userData.isDoor = true;
      child.userData.isArchitecture = true;
      child.userData.type = 'door';
      child.userData.rootGroup = this.doorGroup;
    });

    this.roomGroup.add(this.doorGroup);
  }

  createInteriorDoor(w, h, depth, x, y, z, rotY = 0, name = 'Interior Door', isBath = false) {
    const doorGroup = new THREE.Group();
    doorGroup.name = name;
    doorGroup.userData = { isArchitecture: true, type: 'door', name: name };

    const frameColor = 0x3e2723;
    const frameMat = new THREE.MeshStandardMaterial({ color: frameColor, roughness: 0.5 });
    const leafColor = isBath ? 0xf8fafc : 0x5c4033;
    const leafMat = new THREE.MeshStandardMaterial({
      color: leafColor,
      roughness: isBath ? 0.2 : 0.45,
      metalness: isBath ? 0.05 : 0.0
    });
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.85, roughness: 0.2 });
    const sillMat = new THREE.MeshStandardMaterial({ color: 0xb49144, metalness: 0.8, roughness: 0.25 });

    // 1. Satin brass sill threshold
    const sill = new THREE.Mesh(new THREE.BoxGeometry(w + 0.08, 0.012, depth + 0.04), sillMat);
    sill.position.set(0, 0.006, 0);
    doorGroup.add(sill);

    // 2. Door Frame Jambs
    const jambT = 0.04;
    const header = new THREE.Mesh(new THREE.BoxGeometry(w + 0.08, jambT, depth), frameMat);
    header.position.set(0, h - jambT / 2, 0);
    doorGroup.add(header);

    const stileL = new THREE.Mesh(new THREE.BoxGeometry(jambT, h, depth), frameMat);
    stileL.position.set(-w / 2 - jambT / 2, h / 2, 0);
    doorGroup.add(stileL);

    const stileR = new THREE.Mesh(new THREE.BoxGeometry(jambT, h, depth), frameMat);
    stileR.position.set(w / 2 + jambT / 2, h / 2, 0);
    doorGroup.add(stileR);

    // 3. Hinged Door Leaf (set invitingly ajar at ~20 degrees)
    const hinge = new THREE.Group();
    hinge.name = `${name} Hinge`;
    hinge.position.set(-w / 2 + 0.02, 0, 0);
    hinge.rotation.y = isBath ? 0.35 : -0.35;

    const leafW = w - 0.04;
    const leafH = h - 0.04;
    const leafT = 0.045;
    const leaf = new THREE.Mesh(new THREE.BoxGeometry(leafW, leafH, leafT), leafMat);
    leaf.position.set(leafW / 2, leafH / 2 + 0.01, 0);
    leaf.castShadow = true;
    hinge.add(leaf);

    // Architectural Door Panel Molding Insets
    const insetMat = new THREE.MeshStandardMaterial({ color: isBath ? 0xe2e8f0 : 0x4a3525, roughness: 0.5 });
    [-leafH * 0.22, leafH * 0.22].forEach(py => {
      const inset = new THREE.Mesh(new THREE.BoxGeometry(leafW * 0.75, leafH * 0.35, 0.008), insetMat);
      inset.position.set(leafW / 2, leafH / 2 + py + 0.01, leafT / 2 + 0.004);
      hinge.add(inset);
    });

    // Satin Brass Lever Handle with Rosette on Both Sides
    const handleH = 0.95;
    const rosetteGeom = new THREE.CylinderGeometry(0.028, 0.028, 0.01, 16);
    rosetteGeom.rotateX(Math.PI / 2);
    const leverGeom = new THREE.BoxGeometry(0.12, 0.02, 0.02);

    [-1, 1].forEach(side => {
      const zOffset = side * (leafT / 2 + 0.015);
      const rosette = new THREE.Mesh(rosetteGeom, brassMat);
      rosette.position.set(leafW - 0.08, handleH, side * (leafT / 2 + 0.005));
      hinge.add(rosette);

      const lever = new THREE.Mesh(leverGeom, brassMat);
      lever.position.set(leafW - 0.08 - 0.04, handleH, zOffset);
      hinge.add(lever);
    });

    doorGroup.add(hinge);
    doorGroup.position.set(x, y, z);
    doorGroup.rotation.y = rotY;

    doorGroup.traverse(child => {
      child.userData.isDoor = true;
      child.userData.isArchitecture = true;
      child.userData.type = 'door';
      child.userData.rootGroup = doorGroup;
    });

    this.roomGroup.add(doorGroup);
    return doorGroup;
  }

  setDoorSwing(angleDegrees) {
    this.doorConfig.openAngle = angleDegrees;
    if (this.doorHinge) {
      if (this.isCompleteHouse) {
        this.doorHinge.rotation.y = -((angleDegrees || 0) * (Math.PI / 180));
      } else {
        this.doorHinge.rotation.y = (angleDegrees || 0) * (Math.PI / 180);
      }
    }
  }

  updateWindow(newConfig) {
    Object.assign(this.windowConfig, newConfig);
    const { width: W, length: L, height: H } = this.currentDimensions;
    this.rebuildWindow(W, L, H);
  }

  updateDoor(newConfig) {
    Object.assign(this.doorConfig, newConfig);
    if (this.isCompleteHouse) {
      const H = (this.currentDimensions && this.currentDimensions.height) ? this.currentDimensions.height : 2.8;
      this.buildVillaEntryDoor(H);
    } else {
      const { width: W, length: L, height: H } = this.currentDimensions || { width: 4.8, length: 5.2, height: 2.8 };
      this.rebuildDoor(W, L, H);
    }
  }

  buildFloorGrid(W, L) {
    if (!this.showGrid) return;
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
    if (this.frontWalls && this.frontWalls.length > 0) {
      this.frontWalls.forEach(wall => {
        wall.visible = !enabled;
        if (wall.material) wall.material.opacity = enabled ? 0.0 : 0.95;
      });
    }
  }

  setWallColor(hex) {
    this.currentWallColor = hex;
    ['back', 'left', 'right', 'front'].forEach(w => {
      if (this.walls[w] && this.walls[w].material) {
        this.walls[w].material.color.set(hex);
      }
    });
    if (this.houseWalls && this.houseWalls.length > 0) {
      this.houseWalls.forEach(w => {
        if (w.material) {
          if (Array.isArray(w.material)) w.material.forEach(m => m.color.set(hex));
          else w.material.color.set(hex);
        }
      });
    }
  }

  setSingleWallColor(wallKey, hex) {
    if (!wallKey || wallKey === 'all') {
      this.setWallColor(hex);
      return;
    }
    if (this.walls[wallKey] && this.walls[wallKey].material) {
      this.walls[wallKey].material.color.set(hex);
    }
  }

  getWallColor(wallKey = 'back') {
    if (this.walls[wallKey] && this.walls[wallKey].material && this.walls[wallKey].material.color) {
      return '#' + this.walls[wallKey].material.color.getHexString().toUpperCase();
    }
    return '#F3F4F6';
  }

  setFlooring(type) {
    if (this.isCompleteHouse) {
      this.buildCompleteHouse(this.currentWallColor, type, this.houseType);
    } else {
      this.buildFloor(this.currentDimensions.width, this.currentDimensions.length, type);
    }
  }

  // ==========================================
  // COMPLETE HOUSE ARCHITECTURAL BUILDER
  // ==========================================
  buildCompleteHouse(wallColorHex = 0xfaf5ee, flooringType = 'porcelain_tile', houseType = '3bhk') {
    this.isCompleteHouse = true;
    this.houseType = houseType || '3bhk';
    const is3BHK = (this.houseType === '3bhk' || this.houseType === 'complete_house_3bhk');
    const isVilla = (this.houseType === 'villa_2bhk' || this.houseType === 'villa' || this.houseType === '2bhk' || this.houseType === 'complete_house_2bhk');
    
    if (is3BHK) {
      this.currentDimensions = { width: 19.0, length: 18.5, height: 2.8 };
    } else if (isVilla) {
      this.currentDimensions = { width: 16.0, length: 18.5, height: 2.8 };
    } else {
      this.currentDimensions = { width: 14.0, length: 13.0, height: 2.8 };
    }
    this.currentWallColor = wallColorHex;
    this.currentFlooring = flooringType;

    // Reset and clear any existing architectural elements
    this.doorPlacement = { x: -4.7, z: 6.4 };
    this.doorGroup = null;
    this.doorHinge = null;

    // 1. Clear previous room geometry
    while (this.roomGroup.children.length > 0) {
      const obj = this.roomGroup.children[0];
      this.roomGroup.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
        else obj.material.dispose();
      }
    }
    this.walls = {};
    this.floor = null;
    this.baseboards = [];
    this.houseFloors = [];
    this.houseWalls = [];
    this.frontWalls = [];
    this.roomBadges = [];

    const H = 2.8;

    if (is3BHK) {
      // Luxury 3 BHK Residence (10 connected zones + balcony)
      this.buildThreeBhkFloors(flooringType);
      this.buildThreeBhkWalls(H, wallColorHex);
      this.buildThreeBhkWindowsAndDoors(H);
      this.buildThreeBhkBadges();
      this.buildFloorGrid(19.0, 18.5);
    } else if (isVilla) {
      // Architectural 2 BHK Residence (8 rooms)
      this.buildVillaFloors(flooringType);
      this.buildVillaWalls(H, wallColorHex);
      this.buildVillaWindowsAndDoors(H);
      this.buildVillaBadges();
      this.buildFloorGrid(16.0, 18.5);
    } else {
      // Architectural Single Bedroom House (1 BHK - 6 rooms)
      this.buildHouseFloors(flooringType);
      this.buildHouseWalls(H, wallColorHex);
      this.buildHouseWindowsAndDoors(H);
      this.buildHouseRoomBadges();
      this.buildFloorGrid(15.0, 16.0);
    }
  }

  buildHouseFloors(flooringType) {
    const makeFloorMesh = (W, L, posX, posZ, floorType, zoneKey) => {
      let floorTexture;
      let roughness = 0.4;
      let metalness = 0.05;

      switch (floorType) {
        case 'porcelain_tile':
        case 'porcelain':
          floorTexture = TextureGenerator.createPorcelainTileTexture(0xf8f9fa, 0xd1d5db);
          roughness = 0.16;
          metalness = 0.08;
          break;
        case 'herringbone_wood':
        case 'herringbone':
          floorTexture = TextureGenerator.createHerringboneWoodTexture(0xb8824f, 0x6e4321);
          roughness = 0.42;
          metalness = 0.04;
          break;
        case 'blue_tile':
          floorTexture = TextureGenerator.createBlueTileTexture(0x38bdf8, 0x0284c7);
          roughness = 0.2;
          metalness = 0.05;
          break;
        case 'grass':
          floorTexture = TextureGenerator.createGrassTexture();
          roughness = 0.95;
          metalness = 0.0;
          break;
        case 'paving':
          floorTexture = TextureGenerator.createPavingTexture(0xd1d5db);
          roughness = 0.65;
          metalness = 0.05;
          break;
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
          floorTexture = TextureGenerator.createTileTexture(0xf8fafc, 0xcfd4dc);
          roughness = 0.25;
          break;
        case 'wood_oak':
        default:
          floorTexture = TextureGenerator.createWoodTexture(0xd4a373);
          roughness = 0.5;
          break;
      }

      floorTexture.repeat.set(Math.max(1, Math.round(W / 2)), Math.max(1, Math.round(L / 2)));

      const floorMat = new THREE.MeshStandardMaterial({
        map: floorTexture,
        roughness: roughness,
        metalness: metalness
      });

      const floorGeom = new THREE.PlaneGeometry(W, L);
      const mesh = new THREE.Mesh(floorGeom, floorMat);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.set(posX, 0, posZ);
      mesh.receiveShadow = true;
      mesh.name = `HouseFloor_${zoneKey}`;
      mesh.userData = { isFloor: true, roomZone: zoneKey, zone: zoneKey };
      this.houseFloors.push(mesh);
      this.roomGroup.add(mesh);
      return mesh;
    };

    const isTileVariant = ['porcelain_tile', 'marble_white', 'tile', 'terrazzo', 'paving'].includes(flooringType);
    const commonFlooring = isTileVariant ? flooringType : 'tile';
    const bedFlooring = (!isTileVariant && flooringType) ? flooringType : 'herringbone_wood';

    // 1. Entrance Foyer (Front-Left - Polished Tiles)
    makeFloorMesh(3.2, 3.6, -4.7, 4.6, commonFlooring, 'foyer');

    // 2. Living Room Lounge (Front-Center - Light Porcelain Tile)
    makeFloorMesh(6.0, 4.6, -0.1, 4.1, commonFlooring, 'living');

    // 3. Dining Area (Front-Right - Light Porcelain Tile)
    makeFloorMesh(4.0, 4.6, 4.9, 4.1, commonFlooring, 'dining');

    // 4. Modular Kitchen (Rear-Right - Polished Porcelain Tile)
    makeFloorMesh(4.0, 6.0, 4.9, -2.2, commonFlooring, 'kitchen');

    // 5. Master Bedroom Suite (Rear-Left - Herringbone Wood Flooring)
    makeFloorMesh(5.6, 7.6, -3.5, -2.0, bedFlooring, 'bedroom');

    // 6. Master Bathroom En-Suite (Rear-Center - Sky-Blue Designer Tiles)
    makeFloorMesh(3.6, 4.4, 1.1, -3.6, 'blue_tile', 'master_bath');

    // 7. Central Hallway Circulation Floor (Light Porcelain Tile / Wood)
    makeFloorMesh(3.6, 3.2, 1.1, 0.2, commonFlooring, 'hallway');

    // 8. Foyer-Living Vestibule Floor
    makeFloorMesh(3.2, 1.0, -4.7, 2.3, commonFlooring, 'foyer_hallway');

    // Outdoor Environment: Front Porch Entrance Steps
    const stepMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.7 });
    const step1 = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.08, 0.45), stepMat);
    step1.position.set(-4.7, 0.04, 6.55);
    this.roomGroup.add(step1);
    const step2 = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.08, 0.4), stepMat);
    step2.position.set(-4.7, 0.12, 6.45);
    this.roomGroup.add(step2);

    // Front Paved Driveway Approach, Front Lawn & Gardens
    makeFloorMesh(4.8, 2.8, -3.8, 7.8, 'paving', 'driveway');
    makeFloorMesh(5.4, 2.8, 3.7, 7.8, 'grass', 'front_lawn');
    makeFloorMesh(1.6, 17.0, -7.2, 0.25, 'grass', 'left_garden');
    makeFloorMesh(1.6, 17.0, 7.2, 0.25, 'grass', 'right_garden');

    // Front Entrance Path from lawn/green area to foyer door with defined boundary
    makeFloorMesh(2.2, 3.2, -4.7, 8.0, 'paving', 'entrance_path');

    // Defined Stone Border Curbs flanking the Entrance Path
    const curbMat2 = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.8 });
    const curbL = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.14, 3.2), curbMat2);
    curbL.position.set(-5.85, 0.07, 8.0);
    curbL.name = 'Entrance Path Border Left';
    this.roomGroup.add(curbL);

    const curbR = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.14, 3.2), curbMat2);
    curbR.position.set(-3.55, 0.07, 8.0);
    curbR.name = 'Entrance Path Border Right';
    this.roomGroup.add(curbR);

    // Satin Brass Doorway Threshold Transitions
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.85, roughness: 0.25 });
    const addThreshold = (w, d, x, z) => {
      const geom = new THREE.BoxGeometry(w, 0.008, d);
      const strip = new THREE.Mesh(geom, brassMat);
      strip.position.set(x, 0.004, z);
      strip.name = 'DoorwayThreshold';
      this.roomGroup.add(strip);
    };

    // Transition from Foyer into Living Room
    addThreshold(0.08, 1.4, -3.1, 3.4);
    // Transition from Living Room into Dining Area
    addThreshold(0.08, 3.2, 2.9, 4.1);
    // Transition from Dining Area into Modular Kitchen
    addThreshold(3.2, 0.08, 4.9, 1.8);
    // Transition into Master Bedroom suite
    addThreshold(1.1, 0.08, -1.0, 1.8);
    // Transition from Master Bedroom into Master Bathroom En-Suite
    addThreshold(0.08, 1.1, -0.7, -3.6);
  }

  buildHouseWalls(H, wallColorHex) {
    const createWallMat = (isCutaway = false, colorHex = wallColorHex) => new THREE.MeshStandardMaterial({
      color: colorHex,
      roughness: 0.85,
      side: THREE.DoubleSide,
      transparent: isCutaway,
      opacity: isCutaway ? (this.cutawayEnabled ? 0.0 : 0.95) : 1.0
    });

    const addWall = (w, h, d, x, y, z, name = 'Wall', isCutaway = false, customColor = null) => {
      const geom = new THREE.BoxGeometry(w, h, d);
      const mat = createWallMat(isCutaway, customColor || wallColorHex);
      const mesh = new THREE.Mesh(geom, mat);
      mesh.name = name;
      mesh.position.set(x, y, z);
      mesh.castShadow = !isCutaway;
      mesh.receiveShadow = true;
      mesh.userData = { type: 'wall', isCutawayWall: isCutaway, name: name };
      if (isCutaway) {
        mesh.visible = !this.cutawayEnabled;
        this.frontWalls.push(mesh);
      }
      this.houseWalls.push(mesh);
      this.roomGroup.add(mesh);
      return mesh;
    };

    // A. EXTERIOR PERIMETER WALLS (Continuous enclosure, zero corner gaps, embedded window cutouts)
    // 1. North Back Exterior Wall (Z = -6.0) with cutouts for Master Bedroom and Master Bathroom windows
    addWall(2.0, H, 0.15, -5.5, H / 2, -6.0, 'Exterior Back Wall Left');
    addWall(2.0, 0.95, 0.15, -3.5, 0.475, -6.0, 'Master Bed North Window Sill');
    addWall(2.0, 0.55, 0.15, -3.5, 2.525, -6.0, 'Master Bed North Window Lintel');
    this.walls.back = addWall(3.0, H, 0.15, -1.0, H / 2, -6.0, 'Exterior Back Wall');
    addWall(1.2, 1.3, 0.15, 1.1, 0.65, -6.0, 'Master Bath North Window Sill');
    addWall(1.2, 0.5, 0.15, 1.1, 2.55, -6.0, 'Master Bath North Window Lintel');
    addWall(5.2, H, 0.15, 4.3, H / 2, -6.0, 'Exterior Back Wall Right');

    // 2. West Left Exterior Wall (X = -6.5) with cutout for Master Bedroom picture window
    addWall(0.15, H, 2.9, -6.5, H / 2, -4.55, 'Exterior Left Wall North');
    addWall(0.15, 0.75, 2.2, -6.5, 0.375, -2.0, 'Master Bed West Window Sill');
    addWall(0.15, 0.55, 2.2, -6.5, 2.525, -2.0, 'Master Bed West Window Lintel');
    this.walls.left = addWall(0.15, H, 7.3, -6.5, H / 2, 2.75, 'Exterior Left Wall');

    // 3. East Right Exterior Wall (X = 6.9) with cutout for Kitchen casement window
    addWall(0.15, H, 2.9, 6.9, H / 2, -4.55, 'Exterior Right Wall North');
    addWall(0.15, 1.05, 1.8, 6.9, 0.525, -2.2, 'Kitchen East Window Sill');
    addWall(0.15, 0.55, 1.8, 6.9, 2.525, -2.2, 'Kitchen East Window Lintel');
    this.walls.right = addWall(0.15, H, 7.7, 6.9, H / 2, 2.55, 'Exterior Right Wall');

    // 4. South Front Exterior Walls (Z = 6.4 - Cutaway View Enabled, closed perimeter corners)
    // Foyer Front Wall Left (extends from X = -6.5 to X = -5.3, closing corner gap)
    addWall(1.2, H, 0.15, -5.9, H / 2, 6.4, 'Foyer Front Wall Left', true);
    // Foyer Front Door Lintel (X = -5.3 to -4.1)
    addWall(1.2, 0.6, 0.15, -4.7, 2.5, 6.4, 'Foyer Front Door Lintel', true);
    // Foyer Front Wall Right (X = -4.1 to -3.1)
    addWall(1.0, H, 0.15, -3.6, H / 2, 6.4, 'Foyer Front Wall Right', true);
    // Living Room Front Wall with window cutout
    addWall(1.2, H, 0.15, -2.5, H / 2, 6.4, 'Living Front Wall Left', true);
    addWall(3.6, 0.2, 0.15, -0.1, 0.1, 6.4, 'Living Front Window Sill', true);
    addWall(3.6, 0.6, 0.15, -0.1, 2.5, 6.4, 'Living Front Window Lintel', true);
    addWall(1.2, H, 0.15, 2.3, H / 2, 6.4, 'Living Front Wall Right', true);
    // Dining Room Front Wall with window cutout (meets East wall at X = 6.9, closing corner gap)
    addWall(0.8, H, 0.15, 3.3, H / 2, 6.4, 'Dining Front Wall Left', true);
    addWall(2.4, 0.6, 0.15, 4.9, 0.3, 6.4, 'Dining Front Window Sill', true);
    addWall(2.4, 0.6, 0.15, 4.9, 2.5, 6.4, 'Dining Front Window Lintel', true);
    addWall(0.8, H, 0.15, 6.5, H / 2, 6.4, 'Dining Front Wall Right', true);

    // Front Architectural Floor Curb
    const curbMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.7 });
    const curb = new THREE.Mesh(new THREE.BoxGeometry(13.6, 0.12, 0.15), curbMat);
    curb.position.set(0.1, 0.06, 6.4);
    this.roomGroup.add(curb);

    // B. INTERIOR DIVIDING WALLS (Connected with zero loose ends)
    // 1. Slatted wood vertical screen between Foyer and Living Room at X = -3.1
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.4 });
    for (let sz = 3.6; sz <= 5.8; sz += 0.28) {
      const slat = new THREE.Mesh(new THREE.BoxGeometry(0.08, H, 0.08), woodMat);
      slat.position.set(-3.1, H / 2, sz);
      slat.castShadow = true;
      slat.name = 'FoyerSlattedScreen';
      this.roomGroup.add(slat);
    }
    // Foyer entry portal header beam
    const portalBeam = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.35, 1.4), woodMat);
    portalBeam.position.set(-3.1, H - 0.175, 3.4);
    this.roomGroup.add(portalBeam);

    // 2. East-West Dividing Wall at Z = 1.8 (separating Front Living/Dining from Rear Master Suite/Bath/Kitchen)
    // Master Bedroom South Wall
    addWall(5.4, H, 0.12, -3.8, H / 2, 1.8, 'Master Bedroom South Wall');
    // Master Bedroom Door Lintel
    addWall(1.1, 0.6, 0.12, -1.0, 2.5, 1.8, 'Bedroom Door Lintel');
    // Hallway corridor archway lintel
    addWall(2.0, 0.45, 0.12, 0.8, 2.575, 1.8, 'Hallway Arch Lintel');
    // Dining to Kitchen counter pass lintel
    addWall(3.6, 0.45, 0.12, 4.9, 2.575, 1.8, 'Dining-Kitchen Pass Lintel');

    // 3. North-South Dividing Wall between Master Bedroom and Master Bathroom at X = -0.7
    // North section of dividing wall
    addWall(0.12, H, 2.4, -0.7, H / 2, -4.8, 'Master Suite-Bath Wall North');
    // En-Suite Door Lintel
    addWall(0.12, 0.6, 1.1, -0.7, 2.5, -3.6, 'Master En-Suite Door Lintel');
    // South section of dividing wall (meets Z = 1.8 dividing wall)
    addWall(0.12, H, 4.8, -0.7, H / 2, -0.6, 'Master Suite-Bath Wall South');

    // 4. North-South Dividing Wall between Master Bathroom and Modular Kitchen at X = 2.9 (Extended to Z = 1.8, no loose ends)
    addWall(0.12, H, 4.4, 2.9, H / 2, -3.8, 'Bath-Kitchen Dividing Wall North');
    addWall(0.12, 0.6, 1.2, 2.9, 2.5, -1.0, 'Kitchen Entrance Lintel');
    addWall(0.12, H, 2.2, 2.9, H / 2, 0.7, 'Bath-Kitchen Dividing Wall South');

    // 5. Covered Architectural Pergola Structure over Living Room (providing overhead support for ceiling fan)
    const timberMat = new THREE.MeshStandardMaterial({ color: 0x4a3728, roughness: 0.5 });
    for (let rz = 2.1; rz <= 6.1; rz += 0.8) {
      const rafter = new THREE.Mesh(new THREE.BoxGeometry(6.0, 0.12, 0.08), timberMat);
      rafter.position.set(-0.1, H - 0.06, rz);
      rafter.name = 'LivingPergolaRafter';
      rafter.castShadow = true;
      this.roomGroup.add(rafter);
    }
    for (let rx = -2.7; rx <= 2.5; rx += 1.3) {
      const purlin = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 4.4), timberMat);
      purlin.position.set(rx, H + 0.04, 4.1);
      purlin.name = 'LivingPergolaPurlin';
      purlin.castShadow = true;
      this.roomGroup.add(purlin);
    }
  }

  buildHouseWindowsAndDoors(H) {
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.3 });
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x93c5fd,
      transmission: 0.75,
      opacity: 0.65,
      transparent: true,
      roughness: 0.05,
      ior: 1.5,
      thickness: 0.04
    });

    const createArchitecturalWindow = (w, h, x, y, z, rotY = 0, hasCutaway = false) => {
      const winGroup = new THREE.Group();
      winGroup.name = 'HouseWindow';
      const frameGeom = new THREE.BoxGeometry(w, h, 0.06);
      const frame = new THREE.Mesh(frameGeom, frameMat);
      winGroup.add(frame);
      const glass = new THREE.Mesh(new THREE.BoxGeometry(w - 0.12, h - 0.12, 0.02), glassMat);
      winGroup.add(glass);
      const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.03, h - 0.12, 0.04), frameMat);
      const crossH = new THREE.Mesh(new THREE.BoxGeometry(w - 0.12, 0.03, 0.04), frameMat);
      winGroup.add(crossV);
      winGroup.add(crossH);
      winGroup.position.set(x, y, z);
      winGroup.rotation.y = rotY;
      if (hasCutaway) {
        winGroup.userData.isCutawayWindow = true;
        this.frontWalls.push(winGroup);
      }
      this.roomGroup.add(winGroup);
      return winGroup;
    };

    // 1. Master Bedroom West Picture Window (embedded in West Wall cutout)
    createArchitecturalWindow(2.2, 1.5, -6.5, 1.5, -2.0, Math.PI / 2);

    // 2. Master Bedroom North Window (embedded in North Wall cutout)
    createArchitecturalWindow(2.0, 1.3, -3.5, 1.6, -6.0, 0, false);

    // 3. Master Bathroom North Window (embedded in North Wall cutout)
    createArchitecturalWindow(1.2, 1.0, 1.1, 1.8, -6.0, 0, false);

    // 4. Modular Kitchen Casement Window on East Wall (embedded in East Wall cutout)
    createArchitecturalWindow(1.8, 1.2, 6.9, 1.65, -2.2, Math.PI / 2);

    // 5. Living Room Front Panoramic Window (embedded in Front Wall cutout)
    createArchitecturalWindow(3.6, 2.0, -0.1, 1.2, 6.4, 0, true);

    // 6. Dining Room Front Window (embedded in Front Wall cutout)
    createArchitecturalWindow(2.4, 1.6, 4.9, 1.4, 6.4, 0, true);

    // 7. Architectural Adjustable Front Entrance Door at Foyer
    this.buildVillaEntryDoor(H);

    // 8. Proper Door from Hallway into Master Bedroom
    this.createInteriorDoor(1.0, 2.2, 0.12, -1.0, 0, 1.8, 0, 'Master Bedroom Entry Door', false);

    // 9. Proper Privacy Door between Master Bedroom and Master Bathroom
    this.createInteriorDoor(0.9, 2.2, 0.12, -0.7, 0, -3.6, Math.PI / 2, 'Master Bathroom Privacy Door', true);
  }

  buildHouseRoomBadges() {
    this.createRoomBadge('ENTRANCE FOYER', '🚪', -4.7, 4.6, 'foyer');
    this.createRoomBadge('LIVING ROOM', '🛋️', -0.1, 4.1, 'living');
    this.createRoomBadge('DINING AREA', '🍽️', 4.9, 4.1, 'dining');
    this.createRoomBadge('MODULAR KITCHEN', '🍳', 4.9, -2.2, 'kitchen');
    this.createRoomBadge('MASTER BEDROOM', '👑', -3.5, -2.0, 'bedroom');
    this.createRoomBadge('MASTER BATHROOM', '🛁', 1.1, -3.6, 'master_bath');
  }

  createRoomBadge(title, icon, x, z, roomKey) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 140;
    const ctx = canvas.getContext('2d');

    // Rounded rectangle dark glass pill background
    ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.85)';
    ctx.lineWidth = 6;

    const r = 26;
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.lineTo(512 - r, 0);
    ctx.quadraticCurveTo(512, 0, 512, r);
    ctx.lineTo(512, 140 - r);
    ctx.quadraticCurveTo(512, 140, 512 - r, 140);
    ctx.lineTo(r, 140);
    ctx.quadraticCurveTo(0, 140, 0, 140 - r);
    ctx.lineTo(0, r);
    ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Text & Icon
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${icon} ${title}`, 256, 70);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const spriteMat = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
      depthTest: false
    });

    const badge = new THREE.Sprite(spriteMat);
    badge.scale.set(1.9, 0.52, 1.0);
    badge.position.set(x, 0.45, z);
    badge.renderOrder = 999;
    badge.name = `RoomBadge_${roomKey}`;
    badge.userData = { isRoomBadge: true, roomZone: roomKey, title: title };
    this.roomBadges.push(badge);
    this.roomGroup.add(badge);
    return badge;
  }

  // ==========================================
  // CONTEMPORARY VILLA ARCHITECTURE (MATCHING USER PHOTOGRAPH)
  // ==========================================
  buildVillaFloors(flooringType) {
    const makeFloorMesh = (W, L, posX, posZ, floorType, zoneKey) => {
      let floorTexture;
      let roughness = 0.4;
      let metalness = 0.05;

      switch (floorType) {
        case 'blue_tile':
          floorTexture = TextureGenerator.createBlueTileTexture(0x38bdf8, 0x0284c7);
          roughness = 0.2;
          metalness = 0.05;
          break;
        case 'grass':
          floorTexture = TextureGenerator.createGrassTexture();
          roughness = 0.95;
          metalness = 0.0;
          break;
        case 'paving':
          floorTexture = TextureGenerator.createPavingTexture(0xd1d5db);
          roughness = 0.65;
          metalness = 0.05;
          break;
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
          floorTexture = TextureGenerator.createTileTexture(0xf8fafc, 0xcfd4dc);
          roughness = 0.25;
          break;
        case 'wood_oak':
        default:
          floorTexture = TextureGenerator.createWoodTexture(0xd4a373);
          roughness = 0.5;
          break;
      }

      floorTexture.repeat.set(Math.max(1, Math.round(W / 2)), Math.max(1, Math.round(L / 2)));

      const floorMat = new THREE.MeshStandardMaterial({
        map: floorTexture,
        roughness: roughness,
        metalness: metalness
      });

      const floorGeom = new THREE.PlaneGeometry(W, L);
      const mesh = new THREE.Mesh(floorGeom, floorMat);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.set(posX, 0, posZ);
      mesh.receiveShadow = true;
      mesh.name = `HouseFloor_${zoneKey}`;
      mesh.userData = { isFloor: true, roomZone: zoneKey, zone: zoneKey };
      this.houseFloors.push(mesh);
      this.roomGroup.add(mesh);
      return mesh;
    };

    const isTileVariant = ['porcelain_tile', 'marble_white', 'tile', 'terrazzo', 'paving'].includes(flooringType);
    const commonFlooring = isTileVariant ? flooringType : 'tile';
    const bedFlooring = (!isTileVariant && flooringType) ? flooringType : 'wood_oak';

    // 1. Entrance Foyer (Front-Left)
    makeFloorMesh(3.0, 3.0, -4.7, 4.9, commonFlooring, 'foyer');

    // 2. Common Bathroom 1 (Mid-Left - Sky Blue Designer Tiles)
    makeFloorMesh(3.0, 2.8, -4.7, 2.0, 'blue_tile', 'common_bath');

    // 3. Second Bedroom (Back-Left - Warm Oak Wood)
    makeFloorMesh(4.4, 6.6, -4.0, -2.7, bedFlooring, 'bedroom2');

    // 4. Living Room Lounge (Center-Front - Polished Ivory Tile)
    makeFloorMesh(5.6, 4.6, -0.4, 4.1, commonFlooring, 'living');

    // 5. Dining Area (Center-Mid - Polished Ivory Tile)
    makeFloorMesh(4.2, 3.4, 0.3, 0.1, commonFlooring, 'dining');

    // 6. Modular Kitchen (Center-Back - Polished Tile)
    makeFloorMesh(4.2, 4.4, 0.3, -3.8, commonFlooring, 'kitchen');

    // 7. Master Bedroom (Front-Right - Warm Oak Wood)
    makeFloorMesh(4.0, 5.4, 4.4, 3.7, bedFlooring, 'bedroom');

    // 8. Walk-in Wardrobe / Dressing Area (Mid-Right)
    makeFloorMesh(2.0, 3.0, 3.4, -0.5, bedFlooring, 'walk_in_closet');

    // 9. Master En-Suite Bathroom (Mid-Right Outer - Sky Blue Tiles)
    makeFloorMesh(2.0, 3.0, 5.4, -0.5, 'blue_tile', 'master_bath');

    // 10. Backyard Lawn & Garden (Rear-Right Outdoor)
    makeFloorMesh(4.0, 3.0, 4.4, -7.5, 'grass', 'backyard');

    // 11. Front Lawn (Front-Right Outdoor)
    makeFloorMesh(5.4, 2.8, 3.7, 7.8, 'grass', 'front_lawn');

    // 12. Front Paved Driveway & Porch Approach (Front-Left Outdoor)
    makeFloorMesh(4.8, 2.8, -3.8, 7.8, 'paving', 'driveway');

    // 13. Left Garden Landscape Buffer
    makeFloorMesh(1.6, 18.0, -7.2, 0.25, 'grass', 'left_garden');

    // 14. Right Garden Landscape Buffer
    makeFloorMesh(1.6, 18.0, 7.2, 0.25, 'grass', 'right_garden');

    // 15. Rear Garden Buffer (Behind Second Bed & Kitchen)
    makeFloorMesh(8.6, 3.0, -1.9, -7.5, 'grass', 'rear_garden');

    // Front Entrance Path from lawn/green area to foyer door with defined boundary
    makeFloorMesh(2.2, 3.2, -4.7, 8.0, 'paving', 'entrance_path');

    // Defined Stone Border Curbs flanking the Entrance Path
    const curbMat2 = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.8 });
    const curbL = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.14, 3.2), curbMat2);
    curbL.position.set(-5.85, 0.07, 8.0);
    curbL.name = 'Entrance Path Border Left';
    this.roomGroup.add(curbL);

    const curbR = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.14, 3.2), curbMat2);
    curbR.position.set(-3.55, 0.07, 8.0);
    curbR.name = 'Entrance Path Border Right';
    this.roomGroup.add(curbR);

    // Front Porch Concrete Entrance Steps (at Entrance Foyer Door)
    const stepMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.7 });
    const step1 = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.08, 0.45), stepMat);
    step1.position.set(-4.7, 0.04, 6.55);
    this.roomGroup.add(step1);

    const step2 = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.08, 0.4), stepMat);
    step2.position.set(-4.7, 0.12, 6.45);
    this.roomGroup.add(step2);

    // Satin Brass Transition Strips
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.85, roughness: 0.25 });
    const addThreshold = (w, d, x, z) => {
      const geom = new THREE.BoxGeometry(w, 0.008, d);
      const strip = new THREE.Mesh(geom, brassMat);
      strip.position.set(x, 0.004, z);
      this.roomGroup.add(strip);
    };
    addThreshold(0.06, 1.4, -3.2, 5.7);
    addThreshold(0.06, 1.0, -3.2, 2.1);
    addThreshold(1.2, 0.06, -2.5, 0.6);
    addThreshold(0.06, 1.2, 2.4, 3.4);
    addThreshold(1.4, 0.06, 4.1, 1.0);
    addThreshold(0.06, 1.1, 4.4, -0.45);
    addThreshold(1.8, 0.06, 4.4, -2.0);
  }

  buildVillaWalls(H, wallColorHex) {
    const createWallMat = (isCutaway = false, customColor = null) => new THREE.MeshStandardMaterial({
      color: customColor || wallColorHex,
      roughness: 0.85,
      side: THREE.DoubleSide,
      transparent: isCutaway,
      opacity: isCutaway ? (this.cutawayEnabled ? 0.0 : 0.95) : 1.0
    });

    const addWall = (w, h, d, x, y, z, name = 'Wall', isCutaway = false, customColor = null) => {
      const geom = new THREE.BoxGeometry(w, h, d);
      const mat = createWallMat(isCutaway, customColor);
      const mesh = new THREE.Mesh(geom, mat);
      mesh.name = name;
      mesh.position.set(x, y, z);
      mesh.castShadow = !isCutaway;
      mesh.receiveShadow = true;
      mesh.userData = { type: 'wall', isCutawayWall: isCutaway, name: name };
      if (isCutaway) {
        mesh.visible = !this.cutawayEnabled;
        this.frontWalls.push(mesh);
      }
      this.houseWalls.push(mesh);
      this.roomGroup.add(mesh);
      return mesh;
    };

    // A. EXTERIOR BOUNDARY COMPOUND WALL (Around 16.0m x 18.5m property)
    const boundColor = 0xe7e5e4; // Warm stone perimeter wall
    const boundH = 1.1; // Low boundary wall for perfect 3D dollhouse perspective
    addWall(16.3, boundH, 0.15, 0, boundH / 2, -9.0, 'Perimeter Rear Boundary Wall', false, boundColor);
    addWall(0.15, boundH, 18.3, -8.0, boundH / 2, 0.25, 'Perimeter Left Boundary Wall', false, boundColor);
    addWall(0.15, boundH, 18.3, 8.0, boundH / 2, 0.25, 'Perimeter Right Boundary Wall', false, boundColor);
    addWall(7.5, boundH, 0.15, 4.25, boundH / 2, 9.25, 'Perimeter Front Garden Wall', true, boundColor);
    addWall(2.5, boundH, 0.15, -6.75, boundH / 2, 9.25, 'Perimeter Front Gate Left Wall', true, boundColor);

    // Boundary Wall Dark Trim Capping
    const capMat = new THREE.MeshStandardMaterial({ color: 0x44403c, roughness: 0.6 });
    const addCap = (w, d, x, z) => {
      const cap = new THREE.Mesh(new THREE.BoxGeometry(w, 0.05, d), capMat);
      cap.position.set(x, boundH + 0.025, z);
      this.roomGroup.add(cap);
    };
    addCap(16.35, 0.2, 0, -9.0);
    addCap(0.2, 18.35, -8.0, 0.25);
    addCap(0.2, 18.35, 8.0, 0.25);

    // B. VILLA EXTERIOR BUILDING WALLS (Height H = 2.8m, with embedded window openings)
    addWall(1.2, H, 0.15, -5.6, H / 2, -6.0, 'Second Bed North Wall West');
    addWall(2.0, 0.95, 0.15, -4.0, 0.475, -6.0, 'Second Bed North Window Sill');
    addWall(2.0, 0.55, 0.15, -4.0, 2.525, -6.0, 'Second Bed North Window Lintel');
    addWall(2.5, H, 0.15, -1.75, H / 2, -6.0, 'Second Bed & Kitchen North Wall');
    addWall(1.8, 1.1, 0.15, 0.3, 0.55, -6.0, 'Modular Kitchen North Window Sill');
    addWall(1.8, 0.5, 0.15, 0.3, 2.55, -6.0, 'Modular Kitchen North Window Lintel');
    addWall(1.5, H, 0.15, 1.95, H / 2, -6.0, 'Modular Kitchen North Wall East');
    // Master Suite Backyard Wall at Z = -2.0 with 1.8m Sliding Glass Door Opening
    addWall(1.2, H, 0.15, 2.9, H / 2, -2.0, 'Master Suite Backyard Wall West');
    addWall(1.8, 0.6, 0.15, 4.4, 2.5, -2.0, 'Master Suite Backyard Sliding Door Lintel');
    addWall(1.2, H, 0.15, 5.9, H / 2, -2.0, 'Master Suite Backyard Wall East');
    addWall(0.15, H, 7.2, 6.4, H / 2, -5.6, 'Backyard & Master East Exterior Wall');

    // Second Bed West Wall with Terracotta Accent
    const terracotta = 0xc2410c;
    addWall(0.15, H, 6.6, -6.2, H / 2, -2.7, 'Second Bed Terracotta Accent Wall', false, terracotta);
    addWall(0.15, H, 5.8, -6.2, H / 2, 3.5, 'Common Bath & Foyer West Wall');
    addWall(0.15, H, 5.4, 6.4, H / 2, 3.7, 'Master Bedroom East Exterior Wall');

    // Front Exterior Walls (Cutaway View Enabled, closed perimeter corners)
    addWall(1.35, H, 0.15, -5.525, H / 2, 6.4, 'Foyer Front Wall Left', true);
    addWall(1.2, 0.6, 0.15, -4.7, 2.5, 6.4, 'Foyer Front Door Lintel', true);
    addWall(0.9, H, 0.15, -3.65, H / 2, 6.4, 'Foyer Front Wall Right', true);
    addWall(5.6, H, 0.15, -0.4, H / 2, 6.4, 'Living Room Front Wall (Cutaway)', true);
    addWall(4.0, H, 0.15, 4.4, H / 2, 6.4, 'Master Bedroom Front Wall (Cutaway)', true);

    // Front Architectural Floor Curb
    const curbMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.7 });
    const curb = new THREE.Mesh(new THREE.BoxGeometry(12.8, 0.12, 0.15), curbMat);
    curb.position.set(0.1, 0.06, 6.4);
    this.roomGroup.add(curb);

    // C. INTERIOR DIVIDING WALLS
    // 1. Common Bath East Wall with Hallway Doorway (X = -3.2)
    addWall(0.12, H, 1.0, -3.2, H / 2, 1.1, 'Common Bath East Wall North');
    addWall(0.12, 0.6, 1.0, -3.2, 2.5, 2.1, 'Common Bath Door Lintel');
    addWall(0.12, H, 0.8, -3.2, H / 2, 3.0, 'Common Bath East Wall South');

    // 2. Foyer Partition & Slatted Wood Screen (X = -3.2)
    addWall(0.12, H, 1.0, -3.2, H / 2, 4.1, 'Foyer TV Partition Wall');
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.4 });
    for (let sz = 3.6; sz <= 4.8; sz += 0.25) {
      const slat = new THREE.Mesh(new THREE.BoxGeometry(0.04, H, 0.08), woodMat);
      slat.position.set(-3.2, H / 2, sz);
      slat.name = 'FoyerSlattedScreen';
      this.roomGroup.add(slat);
    }
    // Foyer open portal header beam
    const portalBeam = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.35, 1.4), woodMat);
    portalBeam.position.set(-3.2, H - 0.175, 5.7);
    portalBeam.name = 'FoyerPortalBeam';
    this.roomGroup.add(portalBeam);

    // 3. Common Bath Solid Partition Walls
    addWall(3.0, H, 0.12, -4.7, H / 2, 3.4, 'Common Bath-Foyer Privacy Wall');
    addWall(3.0, H, 0.12, -4.7, H / 2, 0.6, 'Common Bath-Second Bed Wall');

    // 4. Hallway Corridor Opening to Second Bedroom at Z = 0.6
    addWall(1.4, 0.6, 0.12, -2.5, 2.5, 0.6, 'Second Bed Entrance Lintel');

    // 5. Second Bed-Kitchen North-South Dividing Wall at X = -1.8
    addWall(0.12, H, 6.6, -1.8, H / 2, -2.7, 'Second Bed-Kitchen Dividing Wall');

    // 6. Master Bedroom - Living Dividing Wall at X = 2.4 (with 1.2m entrance doorway)
    addWall(0.12, H, 1.8, 2.4, H / 2, 1.9, 'Master Bed-Living Wall North');
    addWall(0.12, 0.6, 1.2, 2.4, 2.5, 3.4, 'Master Bed Entrance Lintel');
    addWall(0.12, H, 2.4, 2.4, H / 2, 5.2, 'Master Bed-Living Wall South');

    // 7. Walk-in Closet-Dining Wall at X = 2.4
    addWall(0.12, H, 3.0, 2.4, H / 2, -0.5, 'Walk-in Closet-Dining Wall');

    // 8. Master Bedroom to Walk-In Dressing Portal Wall at Z = 1.0
    addWall(1.0, H, 0.12, 2.9, H / 2, 1.0, 'Closet-Bed Wall Left');
    addWall(1.4, 0.6, 0.12, 4.1, 2.5, 1.0, 'Closet Doorway Lintel');
    addWall(1.6, H, 0.12, 5.6, H / 2, 1.0, 'Closet-Bed Wall Right');

    // 9. Walk-In Dressing to Master En-Suite Bathroom Dividing Wall at X = 4.4 (with 1.1m doorway)
    addWall(0.12, H, 0.9, 4.4, H / 2, 0.55, 'Closet-Bath Dividing Wall South');
    addWall(0.12, 0.6, 1.1, 4.4, 2.5, -0.45, 'Master En-Suite Door Lintel');
    addWall(0.12, H, 1.0, 4.4, H / 2, -1.5, 'Closet-Bath Dividing Wall North');
  }

  buildVillaWindowsAndDoors(H) {
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.3 });
    const woodTrimMat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.4 });
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xbae6fd,
      transmission: 0.9,
      opacity: 0.4,
      transparent: true,
      roughness: 0.1
    });

    const createArchitecturalWindow = (w, h, posX, posY, posZ, rotY = 0, isWoodTrim = false) => {
      const winGroup = new THREE.Group();
      winGroup.name = 'HouseWindow';
      const fMat = isWoodTrim ? woodTrimMat : frameMat;
      const frame = new THREE.Mesh(new THREE.BoxGeometry(0.06, h, w), fMat);
      winGroup.add(frame);
      const glass = new THREE.Mesh(new THREE.BoxGeometry(0.01, h - 0.1, w - 0.1), glassMat);
      winGroup.add(glass);
      const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.07, h - 0.1, 0.03), fMat);
      const crossH = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.03, w - 0.1), fMat);
      winGroup.add(crossV);
      winGroup.add(crossH);
      winGroup.position.set(posX, posY, posZ);
      winGroup.rotation.y = rotY;
      this.roomGroup.add(winGroup);
      return winGroup;
    };

    // 1. Second Bedroom North Window (overlooking rear garden)
    createArchitecturalWindow(2.0, 1.3, -4.0, 1.6, -5.92, -Math.PI / 2, true);

    // 2. Modular Kitchen North Window (above counter)
    createArchitecturalWindow(1.8, 1.2, 0.3, 1.7, -5.92, -Math.PI / 2, true);

    // 3. Backyard Sliding Glass Door from Master/Kitchen Corridor (Z = -2.0)
    createArchitecturalWindow(1.8, 2.2, 4.4, 1.15, -1.95, -Math.PI / 2, false);

    // 4. Living Room Front Panoramic Window (Cutaway)
    createArchitecturalWindow(3.6, 2.0, -0.4, 1.2, 6.35, -Math.PI / 2, true);

    // 5. Master Bedroom Front Picture Window (Cutaway)
    createArchitecturalWindow(2.6, 1.6, 4.4, 1.4, 6.35, -Math.PI / 2, true);

    // 6. Common Bathroom West Transom Ventilation Window
    createArchitecturalWindow(0.8, 0.6, -6.18, 2.2, 2.0, 0, false);

    // 7. Master En-Suite Bathroom East Transom Ventilation Window
    createArchitecturalWindow(0.8, 0.6, 6.38, 2.2, -0.5, 0, false);

    // Architectural Adjustable Front Entrance Door at Foyer
    this.buildVillaEntryDoor(H);
  }

  buildVillaBadges() {
    this.createRoomBadge('ENTRANCE FOYER', '🚪', -4.7, 4.9, 'foyer');
    this.createRoomBadge('LIVING ROOM', '🛋️', -0.4, 4.1, 'living');
    this.createRoomBadge('DINING AREA', '🍽️', 0.3, 0.1, 'dining');
    this.createRoomBadge('MODULAR KITCHEN', '🍳', 0.3, -3.8, 'kitchen');
    this.createRoomBadge('SECOND BEDROOM', '🛏️', -4.0, -2.7, 'bedroom2');
    this.createRoomBadge('COMMON BATHROOM', '🚿', -4.7, 2.0, 'common_bath');
    this.createRoomBadge('MASTER BEDROOM', '👑', 4.4, 3.7, 'bedroom');
    this.createRoomBadge('MASTER BATHROOM', '🛁', 5.4, -0.5, 'master_bath');
    this.createRoomBadge('BACKYARD GARDEN', '🌿', 4.4, -7.5, 'backyard');
  }

  // ==========================================
  // LUXURY 3 BHK RESIDENCE ARCHITECTURE (EXACT MATCH TO ARCHITECTURAL CUTAWAY)
  // ==========================================
  buildThreeBhkFloors(flooringType) {
    const makeFloorMesh = (W, L, posX, posZ, floorType, zoneKey, posY = 0) => {
      let floorTexture;
      let roughness = 0.45;
      let metalness = 0.04;

      switch (floorType) {
        case 'brick':
          floorTexture = TextureGenerator.createBrickTexture(0xa34129, 0xd6c7b2);
          roughness = 0.85;
          break;
        case 'marble':
          floorTexture = TextureGenerator.createMarbleTexture(0xf8fafc, 0x94a3b8);
          roughness = 0.15;
          metalness = 0.1;
          break;
        case 'tile':
          floorTexture = TextureGenerator.createTileTexture(0xe2e8f0, 0x94a3b8);
          roughness = 0.25;
          break;
        case 'decking':
        case 'dark_walnut':
          floorTexture = TextureGenerator.createWoodTexture(0x8b5a2b, 48, 256);
          roughness = 0.6;
          break;
        case 'wood_oak':
        default:
          floorTexture = TextureGenerator.createWoodTexture(0xd4a373, 56, 256);
          roughness = 0.45;
          break;
      }

      floorTexture.repeat.set(Math.max(1, Math.round(W / 2)), Math.max(1, Math.round(L / 2)));

      const floorMat = new THREE.MeshStandardMaterial({
        map: floorTexture,
        roughness: roughness,
        metalness: metalness
      });

      const floorGeom = new THREE.PlaneGeometry(W, L);
      const mesh = new THREE.Mesh(floorGeom, floorMat);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.set(posX, posY, posZ);
      mesh.receiveShadow = true;
      mesh.name = `HouseFloor_${zoneKey}`;
      mesh.userData = { isFloor: true, roomZone: zoneKey, zone: zoneKey };
      this.houseFloors.push(mesh);
      this.roomGroup.add(mesh);
      return mesh;
    };

    // 1. Great Room Living Hall (Oak Wood: X [-3.4, 1.8], Z [1.2, 5.0])
    makeFloorMesh(5.2, 3.8, -0.8, 3.1, 'wood_oak', 'living');

    // 2. Front Balcony Deck (Exterior Teak Decking: X [-3.4, 1.8], Z [5.0, 6.8])
    makeFloorMesh(5.2, 1.8, -0.8, 5.9, 'decking', 'balcony');

    // 3. Entrance Foyer (Oak Wood: X [1.8, 3.8], Z [4.0, 6.2])
    makeFloorMesh(2.0, 2.2, 2.8, 5.1, 'wood_oak', 'foyer');

    // 4. Central Dining Pavilion (Oak Wood: X [-1.2, 2.4], Z [-2.6, 1.2])
    makeFloorMesh(3.6, 3.8, 0.6, -0.7, 'wood_oak', 'dining');

    // 5. Open Modern Kitchen (Oak Wood: X [2.4, 7.6], Z [1.2, 5.0])
    makeFloorMesh(5.2, 3.8, 5.0, 3.1, 'wood_oak', 'kitchen');

    // 6. Common Bathroom (Light Grey Ceramic Stone Tile: X [-1.2, 2.0], Z [-6.4, -2.6])
    makeFloorMesh(3.2, 3.8, 0.4, -4.5, 'tile', 'common_bath');

    // 7. Master Bedroom Suite (Oak Wood: X [2.0, 7.6], Z [-6.4, -2.2])
    makeFloorMesh(5.6, 4.2, 4.8, -4.3, 'wood_oak', 'bedroom');

    // 8. Master En-Suite Bathroom (Marble Tile: X [5.6, 7.6], Z [-3.8, -1.8])
    makeFloorMesh(2.0, 2.0, 6.6, -2.8, 'marble', 'master_bath');

    // 9. Bedroom 2 (Oak Wood: X [-7.8, -3.4], Z [-2.6, 1.8] - Solidly separated from Living Room)
    makeFloorMesh(4.4, 4.4, -5.6, -0.4, 'wood_oak', 'bedroom2');

    // 10. Bedroom 3 / Twin Bed Suite (Oak Wood: X [-7.8, -3.4], Z [-6.4, -2.6])
    makeFloorMesh(4.4, 3.8, -5.6, -4.5, 'wood_oak', 'bedroom3');

    // 11. Central Bedroom Hallway Connector (Oak Wood: X [-3.4, -1.2], Z [-2.6, 1.2])
    makeFloorMesh(2.2, 3.8, -2.3, -0.7, 'wood_oak', 'hallway');
  }

  buildThreeBhkWalls(H, wallColorHex) {
    const defaultWallMat = new THREE.MeshStandardMaterial({
      color: 0xf5f3ee, // Warm Scandinavian Ivory
      roughness: 0.88,
      side: THREE.DoubleSide
    });

    const brickTex = TextureGenerator.createBrickTexture(0xa34129, 0xd6c7b2);
    brickTex.repeat.set(2, 1);
    const brickMat = new THREE.MeshStandardMaterial({
      map: brickTex,
      roughness: 0.8,
      side: THREE.DoubleSide
    });

    const woodSlatMat = new THREE.MeshStandardMaterial({
      color: 0xb45309,
      roughness: 0.5
    });

    const addWall = (w, h, d, x, y, z, name = 'Wall', customMat = null) => {
      const geom = new THREE.BoxGeometry(w, h, d);
      const mat = customMat || defaultWallMat;
      const mesh = new THREE.Mesh(geom, mat);
      mesh.name = name;
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = { type: 'wall', isCutawayWall: false, name: name };
      this.houseWalls.push(mesh);
      this.roomGroup.add(mesh);
      return mesh;
    };

    const wallH = 1.35; // Clean 3D cutaway wall height

    // ==========================================
    // EXTERIOR PERIMETER WALLS
    // ==========================================
    // North Exterior Walls (Back)
    addWall(4.4, wallH, 0.18, -5.6, wallH / 2, -6.4, 'Bed3 North Exterior Wall');
    addWall(3.2, wallH, 0.18, 0.4, wallH / 2, -6.4, 'Common Bath North Exterior Wall');
    addWall(5.6, wallH, 0.18, 4.8, wallH / 2, -6.4, 'Master Bed North Exterior Wall');

    // West Exterior Wall (Left Wing: Bed 3 & Bed 2)
    addWall(0.18, wallH, 8.2, -7.8, wallH / 2, -2.3, 'West Exterior Wall');

    // East Exterior Wall (Right Wing: Master Bed & Kitchen)
    addWall(0.18, wallH, 11.4, 7.6, wallH / 2, -0.7, 'East Exterior Wall');

    // South Exterior Walls
    addWall(4.4, wallH, 0.18, -5.6, wallH / 2, 1.8, 'Bed2 South Exterior Wall');
    addWall(3.8, wallH, 0.18, 5.7, wallH / 2, 5.0, 'Kitchen South Exterior Wall');
    addWall(2.0, wallH, 0.18, 2.8, wallH / 2, 6.2, 'Foyer South Front Step');

    // ==========================================
    // BEDROOM 2 & LIVING ROOM SOLID SEPARATION WALL (X = -3.4)
    // ==========================================
    // Continuous solid dividing wall that physically prevents living room and bedroom from merging!
    // Spans from Z = 1.2 to Z = 5.0 (Living Room West Wall / TV Wall)
    addWall(0.18, wallH, 3.8, -3.4, wallH / 2, 3.1, 'Living-Bed2 Dividing TV Wall');

    // Hallway / Bedroom 2 Dividing Wall Segment (with entry doorway into Bed 2)
    addWall(0.16, wallH, 3.0, -3.4, wallH / 2, 0.3, 'Bed2 East Wall to Hallway');

    // Bedroom 3 / Hallway Wall (with entry doorway into Bed 3)
    addWall(0.16, wallH, 2.7, -3.4, wallH / 2, -5.05, 'Bed3 East Wall to Hallway');

    // Bedroom 2 / Bedroom 3 Internal Partition Wall
    addWall(4.4, wallH, 0.16, -5.6, wallH / 2, -2.6, 'Bed2 & Bed3 Divider Wall');

    // ==========================================
    // EXPOSED RED BRICK FEATURE WALL (Common Bath / Dining Barrier)
    // ==========================================
    // Exactly matches reference image: Rustic red brick wall facing Dining area
    addWall(3.2, wallH + 0.15, 0.18, 0.4, (wallH + 0.15) / 2, -2.6, 'Common Bath Exposed Brick Accent Wall', brickMat);

    // Common Bath Side Walls
    addWall(0.16, wallH, 2.8, -1.2, wallH / 2, -5.0, 'Bath West Wall (North Section)');
    addWall(0.16, wallH, 3.8, 2.0, wallH / 2, -4.5, 'Bath East Wall');

    // Master Bedroom Dividing Walls
    addWall(0.16, wallH, 4.2, 2.0, wallH / 2, -4.3, 'Master Bed West Divider');
    addWall(4.6, wallH, 0.16, 4.7, wallH / 2, -1.8, 'Master Bed South Wall');
    addWall(0.16, wallH, 2.0, 5.6, wallH / 2, -2.8, 'Master Ensuite West Partition');

    // Living Room Balcony Wall Jambs (at Z = 5.0)
    addWall(0.4, wallH, 0.18, -3.2, wallH / 2, 5.0, 'Living Balcony Left Jamb');
    addWall(0.4, wallH, 0.18, 1.6, wallH / 2, 5.0, 'Living Balcony Right Jamb');

    // ==========================================
    // VERTICAL TIMBER SLAT SCREENS (Foyer & Master Bedroom)
    // ==========================================
    // 1. Foyer Slat Screen (Front Entry Feature)
    for (let s = 0; s < 6; s++) {
      const slat = new THREE.Mesh(new THREE.BoxGeometry(0.04, wallH + 0.25, 0.06), woodSlatMat);
      slat.position.set(1.9 + s * 0.16, (wallH + 0.25) / 2, 4.0);
      this.roomGroup.add(slat);
    }
    for (let s = 0; s < 5; s++) {
      const slat = new THREE.Mesh(new THREE.BoxGeometry(0.06, wallH + 0.25, 0.04), woodSlatMat);
      slat.position.set(3.8, (wallH + 0.25) / 2, 4.4 + s * 0.18);
      this.roomGroup.add(slat);
    }

    // 2. Master Bedroom Fluted Timber Headboard Slat Wall
    for (let s = 0; s < 22; s++) {
      const slat = new THREE.Mesh(new THREE.BoxGeometry(0.04, wallH + 0.35, 0.03), woodSlatMat);
      slat.position.set(2.4 + s * 0.14, (wallH + 0.35) / 2, -6.3);
      this.roomGroup.add(slat);
    }

    // ==========================================
    // BALCONY GLASS RAILING & TIMBER DECK
    // ==========================================
    const railMat = new THREE.MeshStandardMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.45,
      roughness: 0.1
    });
    const railFrameMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      metalness: 0.85,
      roughness: 0.25
    });

    // South Railing
    const bRailSouth = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.95, 0.03), railMat);
    bRailSouth.position.set(-0.8, 0.52, 6.8);
    this.roomGroup.add(bRailSouth);
    const bCapSouth = new THREE.Mesh(new THREE.BoxGeometry(5.22, 0.04, 0.06), railFrameMat);
    bCapSouth.position.set(-0.8, 1.0, 6.8);
    this.roomGroup.add(bCapSouth);

    // West Railing
    const bRailWest = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.95, 1.8), railMat);
    bRailWest.position.set(-3.4, 0.52, 5.9);
    this.roomGroup.add(bRailWest);
    const bCapWest = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, 1.82), railFrameMat);
    bCapWest.position.set(-3.4, 1.0, 5.9);
    this.roomGroup.add(bCapWest);
  }

  buildThreeBhkWindowsAndDoors(H) {
    const createArchitecturalWindow = (w, h, posX, posY, posZ, rotY = 0) => {
      const winGroup = new THREE.Group();
      const fMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.3, metalness: 0.85 });
      const gMat = new THREE.MeshStandardMaterial({ color: 0x93c5fd, roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.45 });

      const frameTop = new THREE.Mesh(new THREE.BoxGeometry(w, 0.06, 0.1), fMat);
      frameTop.position.set(0, h / 2 - 0.03, 0);
      winGroup.add(frameTop);
      const frameBot = new THREE.Mesh(new THREE.BoxGeometry(w, 0.06, 0.1), fMat);
      frameBot.position.set(0, -h / 2 + 0.03, 0);
      winGroup.add(frameBot);
      const frameL = new THREE.Mesh(new THREE.BoxGeometry(0.06, h, 0.1), fMat);
      frameL.position.set(-w / 2 + 0.03, 0, 0);
      winGroup.add(frameL);
      const frameR = new THREE.Mesh(new THREE.BoxGeometry(0.06, h, 0.1), fMat);
      frameR.position.set(w / 2 - 0.03, 0, 0);
      winGroup.add(frameR);
      const frameCenter = new THREE.Mesh(new THREE.BoxGeometry(0.04, h, 0.08), fMat);
      winGroup.add(frameCenter);

      const glass = new THREE.Mesh(new THREE.BoxGeometry(w - 0.12, h - 0.12, 0.015), gMat);
      winGroup.add(glass);
      winGroup.position.set(posX, posY, posZ);
      winGroup.rotation.y = rotY;
      this.roomGroup.add(winGroup);
      return winGroup;
    };

    // Master Bedroom North Window (Behind Bed)
    createArchitecturalWindow(2.2, 1.3, 4.0, 1.25, -6.32, 0);
    // Bedroom 3 North Window
    createArchitecturalWindow(2.0, 1.3, -5.6, 1.25, -6.32, 0);
    // Bedroom 2 West Window
    createArchitecturalWindow(2.2, 1.3, -7.72, 1.25, -0.4, Math.PI / 2);
    // Kitchen East Window
    createArchitecturalWindow(2.0, 1.1, 7.52, 1.25, 3.1, Math.PI / 2);
    // Common Bathroom Frosted High Window
    createArchitecturalWindow(1.0, 0.8, 0.4, 1.4, -6.32, 0);
  }

  buildThreeBhkBadges() {
    this.createRoomBadge('FOYER', '🚪', 2.8, 5.1, 'foyer');
    this.createRoomBadge('LIVING ROOM', '🛋️', -0.8, 3.1, 'living');
    this.createRoomBadge('BALCONY', '🌿', -0.8, 5.9, 'balcony');
    this.createRoomBadge('DINING', '🍽️', 0.6, -0.7, 'dining');
    this.createRoomBadge('KITCHEN', '🍳', 5.0, 3.1, 'kitchen');
    this.createRoomBadge('MASTER BEDROOM', '👑', 4.8, -4.3, 'bedroom');
    this.createRoomBadge('BATHROOM', '🛁', 0.4, -4.5, 'common_bath');
    this.createRoomBadge('BEDROOM 2', '🛏️', -5.6, -0.4, 'bedroom2');
    this.createRoomBadge('BEDROOM 3', '🧸', -5.6, -4.5, 'bedroom3');
  }

}

  window.RoomBuilder = RoomBuilder;

  // 3. Furniture Models
// Procedural 3D Furniture Models using Three.js
// Supports multiple design styles: Modern, Minimalist, Luxury, Traditional
class FurnitureFactory {
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

    // Designer Ceramic Induction Cooktop with Countertop Clearance
    const cooktopMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1, metalness: 0.6 });
    const cooktop = this.createMesh(new THREE.BoxGeometry(0.72, 0.008, 0.46), cooktopMat, 'Counter Cooktop');
    cooktop.position.set(0.85, counterH + 0.005, 0.01);
    group.add(cooktop);

    // Cooktop Burner Ring Accents
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x64748b });
    [[-0.18, -0.1], [0.18, -0.1], [-0.18, 0.1], [0.18, 0.1]].forEach(([rx, rz]) => {
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.055, 0.07, 24), ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(0.85 + rx, counterH + 0.01, 0.01 + rz);
      group.add(ring);
    });

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

  // 49. OUTDOOR TEAK & WICKER PATIO BISTRO SET
  static createPatioSet() {
    const group = new THREE.Group();
    group.name = 'Outdoor Patio Bistro Set';
    group.userData = { type: 'patio_set', name: 'Outdoor Teak & Wicker Bistro Set', cost: 420 };

    const teakMat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.6 });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4, metalness: 0.8 });
    const fabricMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.8 });

    // Round Bistro Table (Diameter 0.8m, Height 0.72m)
    const tableTop = this.createMesh(new THREE.CylinderGeometry(0.4, 0.4, 0.03, 24), teakMat, 'Patio Table Top');
    tableTop.position.set(0, 0.71, 0);
    group.add(tableTop);

    // Pedestal Metal Base
    const pole = this.createMesh(new THREE.CylinderGeometry(0.025, 0.025, 0.68, 16), metalMat, 'Patio Table Pole');
    pole.position.set(0, 0.35, 0);
    group.add(pole);
    const base = this.createMesh(new THREE.CylinderGeometry(0.24, 0.26, 0.02, 24), metalMat, 'Patio Table Base');
    base.position.set(0, 0.01, 0);
    group.add(base);

    // 2 Outdoor Wicker Armchairs
    [-0.6, 0.6].forEach((xOff, idx) => {
      const chair = new THREE.Group();
      chair.name = `Patio Chair ${idx + 1}`;
      // Seat Cushion
      const seat = this.createMesh(new THREE.CylinderGeometry(0.22, 0.22, 0.05, 16), fabricMat, 'Seat Cushion');
      seat.position.set(0, 0.44, 0);
      chair.add(seat);
      // Curved Backrest
      const back = this.createMesh(new THREE.CylinderGeometry(0.23, 0.23, 0.38, 16, 1, true, -Math.PI / 2, Math.PI), teakMat, 'Wicker Back');
      back.position.set(0, 0.62, 0);
      chair.add(back);
      // Legs
      [[-0.15, -0.15], [0.15, -0.15], [-0.15, 0.15], [0.15, 0.15]].forEach(([lx, lz]) => {
        const leg = this.createMesh(new THREE.CylinderGeometry(0.012, 0.01, 0.42, 8), metalMat, 'Chair Leg');
        leg.position.set(lx, 0.21, lz);
        chair.add(leg);
      });
      chair.position.set(xOff, 0, 0);
      chair.rotation.y = idx === 0 ? Math.PI / 2 : -Math.PI / 2;
      group.add(chair);
    });

    return group;
  }

  // 50. MODERN CREAM L-SECTIONAL SOFA
  static createSectionalLSofa(color = 0xf1efe9) {
    const group = new THREE.Group();
    group.name = 'Cream L-Sectional Sofa';
    group.userData = { type: 'l_sectional_sofa', name: 'Cream L-Sectional Lounge Sofa', cost: 1850 };

    const fabricMat = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.75,
      metalness: 0.02
    });
    const cushionMat = new THREE.MeshStandardMaterial({
      color: 0xdedcd5,
      roughness: 0.8
    });
    const legMat = new THREE.MeshStandardMaterial({ color: 0x3d2817, roughness: 0.5 });
    const pillowMat = new THREE.MeshStandardMaterial({ color: 0xd4a373, roughness: 0.8 });

    // Main 3-seat sofa base (Width 2.2m, Depth 0.95m)
    const mainBase = this.createMesh(new THREE.BoxGeometry(2.2, 0.22, 0.95), fabricMat, 'Main Sofa Base');
    mainBase.position.set(0, 0.21, 0);
    group.add(mainBase);

    // Chaise section base (Width 0.95m, Length 1.5m) extending along +Z
    const chaiseBase = this.createMesh(new THREE.BoxGeometry(0.95, 0.22, 1.5), fabricMat, 'Chaise Base');
    chaiseBase.position.set(1.075, 0.21, 0.75);
    group.add(chaiseBase);

    // Backrests
    const mainBack = this.createMesh(new THREE.BoxGeometry(2.2, 0.52, 0.22), fabricMat, 'Main Backrest');
    mainBack.position.set(0, 0.56, -0.37);
    group.add(mainBack);

    const chaiseArm = this.createMesh(new THREE.BoxGeometry(0.22, 0.45, 1.5), fabricMat, 'Chaise Armrest');
    chaiseArm.position.set(1.44, 0.52, 0.75);
    group.add(chaiseArm);

    const leftArm = this.createMesh(new THREE.BoxGeometry(0.22, 0.45, 0.95), fabricMat, 'Left Armrest');
    leftArm.position.set(-1.1, 0.52, 0);
    group.add(leftArm);

    // Cushions
    [-0.55, 0.15].forEach((cx, idx) => {
      const seat = this.createMesh(new THREE.BoxGeometry(0.68, 0.14, 0.72), cushionMat, `Seat Cushion ${idx + 1}`);
      seat.position.set(cx, 0.36, 0.05);
      group.add(seat);
    });

    const chaiseSeat = this.createMesh(new THREE.BoxGeometry(0.72, 0.14, 1.35), cushionMat, 'Chaise Cushion');
    chaiseSeat.position.set(0.98, 0.36, 0.7);
    group.add(chaiseSeat);

    // Accent throw pillows
    const p1 = this.createMesh(new THREE.BoxGeometry(0.35, 0.35, 0.1), pillowMat, 'Throw Pillow 1');
    p1.rotation.y = 0.25;
    p1.position.set(-0.85, 0.55, -0.15);
    group.add(p1);

    const p2 = this.createMesh(new THREE.BoxGeometry(0.32, 0.32, 0.1), pillowMat, 'Throw Pillow 2');
    p2.rotation.y = -0.3;
    p2.position.set(1.2, 0.55, 0.2);
    group.add(p2);

    // Wooden legs
    const legGeom = new THREE.CylinderGeometry(0.022, 0.016, 0.12, 12);
    [
      [-1.1, -0.4], [1.5, -0.4],
      [-1.1, 0.4], [0.55, 0.4],
      [1.5, 1.45], [0.55, 1.45]
    ].forEach(([lx, lz], idx) => {
      const leg = this.createMesh(legGeom, legMat, `Sofa Leg ${idx + 1}`);
      leg.position.set(lx, 0.06, lz);
      group.add(leg);
    });

    return group;
  }

  // 51. CALACATTA MARBLE WATERFALL KITCHEN ISLAND WITH 3 STOOLS
  static createWaterfallKitchenIsland() {
    const group = new THREE.Group();
    group.name = 'Waterfall Marble Island';
    group.userData = { type: 'waterfall_island', name: 'Calacatta Marble Waterfall Island & Stools', cost: 2400 };

    const marbleTex = TextureGenerator.createMarbleTexture(0xfafafa, 0x78716c);
    marbleTex.repeat.set(2, 1);
    const marbleMat = new THREE.MeshStandardMaterial({
      map: marbleTex,
      roughness: 0.15,
      metalness: 0.08
    });
    const cabinetMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3 }); // Charcoal dark wood
    const cooktopMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.1, metalness: 0.9 });
    const woodStoolMat = new THREE.MeshStandardMaterial({ color: 0xd4a373, roughness: 0.6 });
    const metalLegMat = new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.8, roughness: 0.3 });

    const W = 2.4;  // Length
    const D = 1.0;  // Width
    const H = 0.92; // Countertop height
    const thick = 0.06;

    // Top marble slab
    const topSlab = this.createMesh(new THREE.BoxGeometry(W, thick, D), marbleMat, 'Marble Island Top');
    topSlab.position.set(0, H - thick / 2, 0);
    group.add(topSlab);

    // Left waterfall slab
    const leftWaterfall = this.createMesh(new THREE.BoxGeometry(thick, H - thick, D), marbleMat, 'Left Waterfall Leg');
    leftWaterfall.position.set(-W / 2 + thick / 2, (H - thick) / 2, 0);
    group.add(leftWaterfall);

    // Right waterfall slab
    const rightWaterfall = this.createMesh(new THREE.BoxGeometry(thick, H - thick, D), marbleMat, 'Right Waterfall Leg');
    rightWaterfall.position.set(W / 2 - thick / 2, (H - thick) / 2, 0);
    group.add(rightWaterfall);

    // Internal under-counter cabinetry (charcoal)
    const innerCabinet = this.createMesh(new THREE.BoxGeometry(W - thick * 2 - 0.02, H - thick - 0.04, D * 0.65), cabinetMat, 'Inner Island Cabinets');
    innerCabinet.position.set(0, (H - thick) / 2, -D * 0.15);
    group.add(innerCabinet);

    // Induction cooktop surface
    const cooktop = this.createMesh(new THREE.BoxGeometry(0.75, 0.008, 0.48), cooktopMat, 'Induction Cooktop');
    cooktop.position.set(-0.35, H + 0.004, -0.05);
    group.add(cooktop);

    // Induction burner rings
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x52525b });
    [-0.18, 0.18].forEach(rx => {
      const ring = this.createMesh(new THREE.RingGeometry(0.06, 0.08, 20), ringMat, 'Burner Ring');
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(-0.35 + rx, H + 0.009, -0.05);
      group.add(ring);
    });

    // 3 Modern Scandinavian Bar Stools on breakfast side
    [-0.65, 0, 0.65].forEach((sx, idx) => {
      const stool = new THREE.Group();
      stool.name = `Bar Stool ${idx + 1}`;
      // Curved wooden seat
      const seat = this.createMesh(new THREE.BoxGeometry(0.38, 0.03, 0.32), woodStoolMat, 'Stool Seat');
      seat.position.set(0, 0.66, 0);
      stool.add(seat);
      // Low curved back lip
      const backLip = this.createMesh(new THREE.BoxGeometry(0.36, 0.1, 0.03), woodStoolMat, 'Stool Back');
      backLip.position.set(0, 0.72, 0.14);
      stool.add(backLip);
      // Slender black metal legs
      const stoolLegGeom = new THREE.CylinderGeometry(0.012, 0.009, 0.65, 10);
      [[-0.14, -0.12], [0.14, -0.12], [-0.14, 0.12], [0.14, 0.12]].forEach(([lx, lz]) => {
        const leg = this.createMesh(stoolLegGeom, metalLegMat, 'Stool Leg');
        leg.position.set(lx, 0.33, lz);
        stool.add(leg);
      });
      stool.position.set(sx, 0, D / 2 + 0.28);
      group.add(stool);
    });

    return group;
  }

  // 52. TWIN BEDS SET FOR BEDROOM 3
  static createTwinBedsSet() {
    const group = new THREE.Group();
    group.name = 'Twin Beds Bedroom Set';
    group.userData = { type: 'twin_beds', name: 'Matching Twin Single Beds & Nightstand', cost: 1350 };

    [-1.2, 1.2].forEach((bx, idx) => {
      const bed = this.createSingleBed('modern', 0xd4a373);
      bed.name = `Twin Bed ${idx + 1}`;
      bed.position.set(bx, 0, 0);
      group.add(bed);
    });

    // Shared center nightstand
    const stand = this.createNightstand('modern');
    stand.name = 'Center Nightstand';
    stand.position.set(0, 0, -0.6);
    group.add(stand);

    // Lamp on center nightstand
    const lamp = this.createTableLamp('modern', 0xd4a373);
    lamp.position.set(0, 0.52, -0.6);
    group.add(lamp);

    return group;
  }

  // 53. 4-PANEL BLACK ALUMINUM SLIDING BALCONY DOOR
  static createSlidingBalconyDoor(width = 3.8, height = 2.2) {
    const group = new THREE.Group();
    group.name = 'Black-Framed Balcony Sliding Doors';
    group.userData = { type: 'sliding_balcony_door', name: '4-Panel Black Metal Sliding Glass Door System', cost: 1600 };

    const fMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.3, metalness: 0.85 }); // Matt black aluminum
    const gMat = new THREE.MeshStandardMaterial({
      color: 0xbae6fd,
      roughness: 0.05,
      metalness: 0.1,
      transparent: true,
      opacity: 0.4
    });

    // Outer frame perimeter
    const topFrame = this.createMesh(new THREE.BoxGeometry(width, 0.08, 0.14), fMat, 'Top Header Frame');
    topFrame.position.set(0, height - 0.04, 0);
    group.add(topFrame);

    const botTrack = this.createMesh(new THREE.BoxGeometry(width, 0.04, 0.16), fMat, 'Bottom Floor Track');
    botTrack.position.set(0, 0.02, 0);
    group.add(botTrack);

    const leftJamb = this.createMesh(new THREE.BoxGeometry(0.08, height, 0.14), fMat, 'Left Wall Jamb');
    leftJamb.position.set(-width / 2 + 0.04, height / 2, 0);
    group.add(leftJamb);

    const rightJamb = this.createMesh(new THREE.BoxGeometry(0.08, height, 0.14), fMat, 'Right Wall Jamb');
    rightJamb.position.set(width / 2 - 0.04, height / 2, 0);
    group.add(rightJamb);

    // 4 vertical glass leaves
    const leafW = (width - 0.16) / 4;
    for (let i = 0; i < 4; i++) {
      const panel = new THREE.Group();
      panel.name = `Door Leaf ${i + 1}`;
      // Black panel sub-frame
      const pt = this.createMesh(new THREE.BoxGeometry(leafW, 0.05, 0.05), fMat, 'Leaf Top');
      pt.position.set(0, height - 0.09, 0);
      panel.add(pt);
      const pb = this.createMesh(new THREE.BoxGeometry(leafW, 0.05, 0.05), fMat, 'Leaf Bot');
      pb.position.set(0, 0.06, 0);
      panel.add(pb);
      const pl = this.createMesh(new THREE.BoxGeometry(0.05, height - 0.14, 0.05), fMat, 'Leaf Left');
      pl.position.set(-leafW / 2 + 0.025, height / 2, 0);
      panel.add(pl);
      const pr = this.createMesh(new THREE.BoxGeometry(0.05, height - 0.14, 0.05), fMat, 'Leaf Right');
      pr.position.set(leafW / 2 - 0.025, height / 2, 0);
      panel.add(pr);

      // Glass pane
      const glass = this.createMesh(new THREE.BoxGeometry(leafW - 0.08, height - 0.22, 0.015), gMat, 'Door Glass');
      glass.position.set(0, height / 2, 0);
      panel.add(glass);

      // Handle on sliding panels
      if (i === 1 || i === 2) {
        const handle = this.createMesh(new THREE.BoxGeometry(0.02, 0.45, 0.04), fMat, 'Door Pull Handle');
        handle.position.set(i === 1 ? leafW / 2 - 0.06 : -leafW / 2 + 0.06, height * 0.48, 0.04);
        panel.add(handle);
      }

      // Stagger panel positions along track (panel 2 slightly slid open for natural walk-through!)
      const posX = -width / 2 + 0.08 + leafW / 2 + i * leafW;
      const posZ = (i % 2 === 0) ? -0.03 : 0.03;
      // Slight open offset on panel 1 to showcase open circulation!
      panel.position.set(i === 1 ? posX + 0.25 : posX, 0, posZ);
      group.add(panel);
    }

    return group;
  }

  // 54. FLUTED VERTICAL TIMBER SLAT HEADBOARD ACCENT WALL
  static createFlutedHeadboardWall(width = 3.6, height = 2.4) {
    const group = new THREE.Group();
    group.name = 'Fluted Wood Slat Accent Wall';
    group.userData = { type: 'fluted_slat_wall', name: 'Master Bed Fluted Oak Slat Feature Wall', cost: 1100 };

    const backerMat = new THREE.MeshStandardMaterial({ color: 0xc89d6c, roughness: 0.6 });
    const slatMat = new THREE.MeshStandardMaterial({ color: 0x9a6534, roughness: 0.5 });
    const sconceMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.85, roughness: 0.2 });

    // Backing panel
    const backer = this.createMesh(new THREE.BoxGeometry(width, height, 0.02), backerMat, 'Backing Panel');
    backer.position.set(0, height / 2, 0);
    group.add(backer);

    // Vertical timber fluted slats
    const slatW = 0.04;
    const gap = 0.03;
    const numSlats = Math.floor(width / (slatW + gap));
    for (let s = 0; s < numSlats; s++) {
      const slat = this.createMesh(new THREE.BoxGeometry(slatW, height, 0.03), slatMat, `Fluted Slat ${s + 1}`);
      slat.position.set(-width / 2 + slatW / 2 + s * (slatW + gap), height / 2, 0.025);
      group.add(slat);
    }

    // Brass bedside reading sconces on left and right
    [-width * 0.4, width * 0.4].forEach((sx, idx) => {
      const sconce = this.createMesh(new THREE.CylinderGeometry(0.04, 0.05, 0.16, 12), sconceMat, `Wall Sconce ${idx + 1}`);
      sconce.position.set(sx, 1.45, 0.08);
      group.add(sconce);
    });

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

    if (roomType === 'complete_house' || roomType === 'complete_house_2bhk' || roomType === 'villa_2bhk' || roomType === 'complete_house_3bhk' || roomType === '3bhk' || roomType === 'whole_house' || roomType === 'house') {
      const is3BHK = (roomType === 'complete_house_3bhk' || roomType === '3bhk' || pref.houseType === '3bhk' || pref.houseType === 'complete_house_3bhk');
      const isVilla = (roomType === 'villa_2bhk' || roomType === 'complete_house_2bhk' || pref.houseType === 'villa_2bhk' || pref.houseType === 'villa' || pref.houseType === '2bhk');
      const is2BHK = isVilla;

      if (is3BHK) {

        concept = `SCANDINAVIAN LUXURY 3 BHK RESIDENCE (${style.toUpperCase()})`;
        spatialRationale = `A master-crafted 3 BHK architectural cutaway residence matching the exact reference structure. Features a screened Entrance Foyer with vertical fluted oak slat partitions, an expansive Great Room Living Hall with a cream L-shaped sectional sofa facing a minimalist oak media console, 4-panel black-framed sliding glass doors opening directly onto a timber-decked Balcony with glass railings and planters, an open central Dining Pavilion with a 6-seater Scandinavian table set against an exposed rustic red brick feature wall, a state-of-the-art Kitchen with a Calacatta marble waterfall island & trio of barstools, an enclosed Common Family Bathroom with floating double vanity and glass rain shower completely shielded from dining sightlines, a private Master Bedroom Suite with a full fluted oak slat headboard wall, King bed, and connected en-suite bath, a peaceful Bedroom 2 with Queen bed and open-niche wardrobe, and Bedroom 3 configured with twin single beds and study workstation.`;
        lightingPlan = `Layered 3000K warm architectural lighting: soft living cove glow, dimmable LED strips under kitchen cabinets and island overhang, backlit bathroom mirrors, fluted headboard brass reading sconces, and natural sunlight pouring through the wide black-framed balcony glass sliders.`;

        // ==========================================
        // 3 BHK: 1. ENTRANCE FOYER
        // ==========================================
        items.push({
          id: 'threebhk_foyer_rug',
          type: 'rug',
          name: 'Entrance Foyer Welcome Runner',
          position: [2.8, 0.005, 5.1],
          rotation: [0, 0, 0],
          dimensions: [1.8, 1.2],
          style: style,
          room: 'foyer',
          cost: 210
        });
        items.push({
          id: 'threebhk_foyer_console',
          type: 'foyer_console',
          name: 'Minimalist Entry Console & Key Tray',
          position: [3.6, 0, 5.3],
          rotation: [0, -Math.PI / 2, 0],
          room: 'foyer',
          cost: 480
        });
        items.push({
          id: 'threebhk_foyer_plant',
          type: 'plant',
          name: 'Foyer Potted Olive Tree',
          position: [2.0, 0, 5.8],
          rotation: [0, 0, 0],
          room: 'foyer',
          cost: 160
        });

        // ==========================================
        // 3 BHK: 2. LIVING ROOM GREAT HALL
        // ==========================================
        // TV Console mounted flush against the solid dividing wall (X = -3.4) facing East (+X)
        items.push({
          id: 'threebhk_living_tv_unit',
          type: 'missouri_tv_unit',
          name: 'Low Oak Media Console with 65" 4K TV',
          position: [-3.25, 0, 3.1],
          rotation: [0, Math.PI / 2, 0],
          design: 2,
          room: 'living',
          cost: 1250
        });
        items.push({
          id: 'threebhk_living_plant_n',
          type: 'plant',
          name: 'Living Room Flanking Ficus Tree (North)',
          position: [-3.1, 0, 1.8],
          rotation: [0, 0, 0],
          room: 'living',
          cost: 180
        });
        items.push({
          id: 'threebhk_living_ficus_tree',
          type: 'plant',
          name: 'Living Room Flanking Olive Tree (South)',
          position: [-3.1, 0, 4.4],
          rotation: [0, 0, 0],
          room: 'living',
          cost: 190
        });
        // Cream L-Sectional Lounge Sofa: seated viewers face West directly towards the TV!
        items.push({
          id: 'threebhk_living_sectional',
          type: 'l_sectional_sofa',
          name: 'Cream L-Sectional Lounge Sofa with Chaise',
          position: [0.4, 0, 3.1],
          rotation: [0, Math.PI / 2, 0],
          color: 0xf5f3ee,
          room: 'living',
          cost: 1850
        });
        items.push({
          id: 'threebhk_living_coffee_table',
          type: 'coffee_table',
          name: 'Scandinavian Oak Rectangular Coffee Table',
          position: [-1.3, 0, 3.1],
          rotation: [0, 0, 0],
          woodColor: 0xd4a373,
          room: 'living',
          cost: 420
        });
        items.push({
          id: 'threebhk_living_rug',
          type: 'rug',
          name: 'Textured Jute & Wool Area Rug',
          position: [-0.8, 0.005, 3.1],
          rotation: [0, 0, 0],
          dimensions: [3.4, 2.6],
          style: style,
          room: 'living',
          cost: 450
        });
        items.push({
          id: 'threebhk_balcony_slider',
          type: 'sliding_balcony_door',
          name: '4-Panel Black Metal Sliding Glass Door System',
          position: [-0.8, 0, 5.0],
          rotation: [0, 0, 0],
          width: 4.8,
          height: 2.2,
          room: 'living',
          cost: 1600
        });

        // ==========================================
        // 3 BHK: 3. SUNSET BALCONY DECK
        // ==========================================
        items.push({
          id: 'threebhk_balcony_chair1',
          type: 'patio_set',
          name: 'Outdoor Teak & Wicker Bistro Set',
          position: [-1.2, 0, 5.9],
          rotation: [0, 0, 0],
          room: 'balcony',
          cost: 420
        });
        items.push({
          id: 'threebhk_balcony_planters_w',
          type: 'plant',
          name: 'Balcony Architectural Evergreen Planter (West)',
          position: [-3.0, 0, 6.4],
          rotation: [0, 0, 0],
          room: 'balcony',
          cost: 140
        });
        items.push({
          id: 'threebhk_balcony_planters_e',
          type: 'plant',
          name: 'Balcony Architectural Evergreen Planter (East)',
          position: [1.4, 0, 6.4],
          rotation: [0, 0, 0],
          room: 'balcony',
          cost: 140
        });

        // ==========================================
        // 3 BHK: 4. CENTRAL DINING PAVILION
        // ==========================================
        items.push({
          id: 'threebhk_dining_table_set',
          type: 'dining_set',
          name: 'Solid Oak Dining Table & 6 Wishbone Scandinavian Chairs',
          position: [0.6, 0, -0.6],
          rotation: [0, 0, 0],
          woodColor: 0xd4a373,
          chairColor: 0xd4a373,
          room: 'dining',
          cost: 1650
        });
        items.push({
          id: 'threebhk_dining_plant',
          type: 'plant',
          name: 'Dining Side Potted Ficus Plant',
          position: [2.1, 0, 0.2],
          rotation: [0, 0, 0],
          room: 'dining',
          cost: 160
        });

        // ==========================================
        // 3 BHK: 5. MODERN KITCHEN & WATERFALL ISLAND
        // ==========================================
        items.push({
          id: 'threebhk_kitchen_waterfall_island',
          type: 'waterfall_island',
          name: 'Calacatta Marble Waterfall Island with Induction Cooktop & 3 Stools',
          position: [4.4, 0, 2.4],
          rotation: [0, 0, 0],
          room: 'kitchen',
          cost: 2400
        });
        items.push({
          id: 'threebhk_kitchen_main_run',
          type: 'straight_kitchen',
          name: 'Dark Charcoal Modular Kitchen Run with Undermount Sink & Ovens',
          position: [7.4, 0, 3.1],
          rotation: [0, -Math.PI / 2, 0],
          color: 0x1e293b,
          room: 'kitchen',
          cost: 2100
        });
        items.push({
          id: 'threebhk_kitchen_fridge',
          type: 'refrigerator',
          name: 'Black Stainless Smart French-Door Refrigerator',
          position: [7.4, 0, 4.4],
          rotation: [0, -Math.PI / 2, 0],
          room: 'kitchen',
          cost: 1400
        });

        // ==========================================
        // 3 BHK: 6. COMMON BATHROOM (ENCLOSED BEHIND BRICK ACCENT WALL)
        // ==========================================
        items.push({
          id: 'threebhk_common_shower',
          type: 'shower',
          name: 'Frameless Glass Walk-In Rain Shower Cabin',
          position: [1.3, 0, -5.5],
          rotation: [0, 0, 0],
          width: 1.2,
          depth: 1.1,
          room: 'common_bath',
          cost: 720
        });
        items.push({
          id: 'threebhk_common_vanity',
          type: 'bathroom_vanity',
          name: 'Double Floating Basin Vanity with LED Illuminated Mirror',
          position: [-0.3, 0, -5.5],
          rotation: [0, Math.PI, 0],
          width: 1.2,
          room: 'common_bath',
          cost: 650
        });
        items.push({
          id: 'threebhk_common_toilet',
          type: 'toilet',
          name: 'Wall-Hung Smart Ceramic Toilet',
          position: [1.4, 0, -3.4],
          rotation: [0, -Math.PI / 2, 0],
          room: 'common_bath',
          cost: 320
        });

        // ==========================================
        // 3 BHK: 7. MASTER BEDROOM SUITE
        // ==========================================
        items.push({
          id: 'threebhk_master_fluted_wall',
          type: 'fluted_slat_wall',
          name: 'Fluted Oak Timber Slat Feature Headboard Wall',
          position: [4.0, 0, -6.3],
          rotation: [0, 0, 0],
          width: 3.6,
          height: 2.4,
          room: 'bedroom',
          cost: 1100
        });
        items.push({
          id: 'threebhk_master_bed',
          type: 'bed',
          name: 'Master Suite Luxury King Platform Bed with Linen Duvet',
          position: [4.0, 0, -5.1],
          rotation: [0, 0, 0],
          style: style,
          room: 'bedroom',
          cost: 1800
        });
        items.push({
          id: 'threebhk_master_stand_l',
          type: 'nightstand',
          name: 'Master Bedside Floating Oak Nightstand (Left)',
          position: [2.6, 0, -5.6],
          rotation: [0, 0, 0],
          room: 'bedroom',
          cost: 240
        });
        items.push({
          id: 'threebhk_master_stand_r',
          type: 'nightstand',
          name: 'Master Bedside Floating Oak Nightstand (Right)',
          position: [5.4, 0, -5.6],
          rotation: [0, 0, 0],
          room: 'bedroom',
          cost: 240
        });
        items.push({
          id: 'threebhk_master_rug',
          type: 'rug',
          name: 'Master Suite Soft Neutral Wool Rug',
          position: [4.0, 0.005, -4.8],
          rotation: [0, 0, 0],
          dimensions: [3.2, 2.4],
          style: style,
          room: 'bedroom',
          cost: 420
        });
        // Master En-suite Bath Fixtures
        items.push({
          id: 'threebhk_ensuite_shower',
          type: 'shower',
          name: 'Master En-Suite Glass Shower Enclosure',
          position: [6.8, 0, -3.2],
          rotation: [0, -Math.PI / 2, 0],
          room: 'master_bath',
          cost: 680
        });
        items.push({
          id: 'threebhk_ensuite_vanity',
          type: 'bathroom_vanity',
          name: 'Master En-Suite Single Basin Vanity',
          position: [6.0, 0, -2.1],
          rotation: [0, Math.PI, 0],
          room: 'master_bath',
          cost: 520
        });
        items.push({
          id: 'threebhk_ensuite_toilet',
          type: 'toilet',
          name: 'Master En-Suite Wall-Hung Toilet',
          position: [7.1, 0, -2.1],
          rotation: [0, Math.PI, 0],
          room: 'master_bath',
          cost: 320
        });

        // ==========================================
        // 3 BHK: 8. BEDROOM 2 (FULLY ENCLOSED & SEPARATED QUEEN SUITE)
        // ==========================================
        // Placed completely inside West Wing (X: [-7.8, -3.4], Z: [-2.6, 1.8])
        items.push({
          id: 'threebhk_bed2_bed',
          type: 'bed',
          name: 'Bedroom 2 Scandinavian Queen Upholstered Bed',
          position: [-6.4, 0, -0.4],
          rotation: [0, Math.PI / 2, 0],
          style: style,
          room: 'bedroom2',
          cost: 1350
        });
        items.push({
          id: 'threebhk_bed2_nightstand_l',
          type: 'nightstand',
          name: 'Bedroom 2 Oak Nightstand (Left)',
          position: [-7.2, 0, 0.7],
          rotation: [0, Math.PI / 2, 0],
          room: 'bedroom2',
          cost: 220
        });
        items.push({
          id: 'threebhk_bed2_nightstand_r',
          type: 'nightstand',
          name: 'Bedroom 2 Oak Nightstand (Right)',
          position: [-7.2, 0, -1.5],
          rotation: [0, Math.PI / 2, 0],
          room: 'bedroom2',
          cost: 220
        });
        items.push({
          id: 'threebhk_bed2_wardrobe',
          type: 'wardrobe',
          name: 'Light Oak Built-in Wardrobe with Hanging Niche',
          position: [-3.8, 0, -0.4],
          rotation: [0, -Math.PI / 2, 0],
          room: 'bedroom2',
          cost: 1200
        });
        items.push({
          id: 'threebhk_bed2_rug',
          type: 'rug',
          name: 'Bedroom 2 Soft Pile Bedside Rug',
          position: [-5.8, 0.005, -0.4],
          rotation: [0, 0, 0],
          dimensions: [2.4, 2.0],
          style: style,
          room: 'bedroom2',
          cost: 290
        });

        // ==========================================
        // 3 BHK: 9. BEDROOM 3 (TWIN BEDS / KIDS SUITE & STUDY)
        // ==========================================
        // Placed completely inside West-North Wing (X: [-7.8, -3.4], Z: [-6.4, -2.6])
        items.push({
          id: 'threebhk_bed3_twin_beds',
          type: 'twin_beds',
          name: 'Bedroom 3 Matching Twin Single Beds with Center Lamp',
          position: [-5.6, 0, -5.1],
          rotation: [0, 0, 0],
          room: 'bedroom3',
          cost: 1450
        });
        items.push({
          id: 'threebhk_bed3_desk',
          type: 'desk',
          name: 'Study Desk & Minimalist Chair by North Window',
          position: [-7.2, 0, -3.5],
          rotation: [0, Math.PI / 2, 0],
          room: 'bedroom3',
          cost: 510
        });
        items.push({
          id: 'threebhk_bed3_rug',
          type: 'rug',
          name: 'Bedroom 3 Geometric Floor Rug',
          position: [-5.6, 0.005, -4.5],
          rotation: [0, 0, 0],
          dimensions: [2.8, 2.0],
          style: style,
          room: 'bedroom3',
          cost: 260
        });

      } else if (isVilla) {
        concept = `ARCHITECTURAL 2 BHK RESIDENCE (CORRECTED & OPTIMIZED ${style.toUpperCase()})`;
        spatialRationale = `A master-crafted 16m × 18.5m architectural residence optimized for real-time room flow, generous walking clearances, and zero furniture-wall collisions. Features a grand entrance foyer with pivot wooden door & slatted divider, open-concept living lounge with Missouri TV unit facing the sectional lounge sofa, seamlessly connected dining area with solid hardwood table, 6 chairs & china credenza, high-efficiency L-shaped modular kitchen with quartz prep island, private master bedroom suite with king bed on the solid east wall, dressing vanity with mirror, walk-in dressing room with sliding mirrored wardrobe, luxury sky-blue master en-suite bathroom with walk-in glass shower, peaceful second bedroom suite with queen bed, study workstation & sliding wardrobe, and a discreetly accessible designer common bathroom.`;
        lightingPlan = `Layered architectural illumination with warm 3000K interior ambiance: recessed living cove glows, statement linear brass chandelier above the dining table, under-cabinet task LED strips in modular kitchen, illuminated anti-fog LED mirrors in both bathrooms, dimmable bedside luminaires, and study task lighting.`;

        // ==========================================
        // 1. ENTRANCE FOYER (X: -6.2 to -3.2, Z: 3.4 to 6.4)
        // ==========================================
        items.push({
          id: 'house_foyer_console',
          type: 'foyer_console',
          name: 'Entrance Foyer Console Table & Round Mirror',
          position: [-4.7, 0, 3.65],
          rotation: [0, 0, 0],
          room: 'foyer',
          cost: 480
        });

        items.push({
          id: 'house_foyer_plant',
          type: 'plant',
          name: 'Entrance Foyer Potted Fig Tree',
          position: [-3.6, 0, 6.0],
          rotation: [0, 0, 0],
          room: 'foyer',
          cost: 160
        });

        items.push({
          id: 'house_foyer_rug',
          type: 'rug',
          name: 'Entrance Foyer Low-Pile Welcome Runner',
          position: [-4.7, 0.005, 4.9],
          rotation: [0, 0, 0],
          dimensions: [1.8, 1.2],
          style: style,
          room: 'foyer',
          cost: 210
        });

        // ==========================================
        // 2. LIVING ROOM LOUNGE (X: -3.2 to 2.4, Z: 1.8 to 6.4)
        // ==========================================
        items.push({
          id: 'house_living_tv_unit',
          type: 'missouri_tv_unit',
          name: 'Missouri Engineered Wood TV Unit with Fluted Slat Backdrop',
          position: [-2.95, 0, 4.1],
          rotation: [0, Math.PI / 2, 0],
          style: style,
          room: 'living',
          cost: 1350
        });

        items.push({
          id: 'house_living_sofa',
          type: 'sofa',
          name: 'Plush Ergonomic Living Lounge Sofa Facing TV Unit',
          position: [0.3, 0, 4.1],
          rotation: [0, -Math.PI / 2, 0],
          style: style,
          color: palette.sofaColor,
          room: 'living',
          cost: 1400
        });

        items.push({
          id: 'house_living_coffee_table',
          type: 'coffee_table',
          name: 'Architectural Wood & Glass Centre Table',
          position: [-1.2, 0, 4.1],
          rotation: [0, 0, 0],
          style: style,
          woodColor: palette.woodColor,
          room: 'living',
          cost: 420
        });

        items.push({
          id: 'house_living_armchair',
          type: 'armchair',
          name: 'Designer Lounge Accent Chair',
          position: [0.4, 0, 2.3],
          rotation: [0, -2.4, 0],
          style: style,
          color: palette.accentColor,
          room: 'living',
          cost: 580
        });

        items.push({
          id: 'house_living_rug',
          type: 'rug',
          name: 'Living Room Plush Wool Area Rug',
          position: [-0.6, 0.005, 4.1],
          rotation: [0, 0, 0],
          dimensions: [3.6, 2.8],
          style: style,
          room: 'living',
          cost: 380
        });

        items.push({
          id: 'house_living_lamp',
          type: 'floor_lamp',
          name: 'Sculptural Brass Arc Floor Lamp',
          position: [1.8, 0, 5.8],
          rotation: [0, 0, 0],
          style: style,
          room: 'living',
          cost: 290
        });

        items.push({
          id: 'house_living_plant',
          type: 'plant',
          name: 'Living Room Ceramic Planter',
          position: [-2.8, 0, 2.2],
          rotation: [0, 0, 0],
          room: 'living',
          cost: 140
        });

        items.push({
          id: 'house_living_fan',
          type: 'ceiling_fan',
          name: 'Aero Minimalist Ceiling Fan',
          position: [-0.4, 2.75, 4.1],
          rotation: [0, 0, 0],
          room: 'living',
          cost: 280
        });

        items.push({
          id: 'house_living_art',
          type: 'wall_art',
          name: 'Living Room Curated Abstract Canvas Art',
          position: [-3.14, 1.8, 5.6],
          rotation: [0, Math.PI / 2, 0],
          dimensions: [1.4, 0.9],
          style: style,
          room: 'living',
          cost: 320
        });

        // ==========================================
        // 3. DINING AREA (X: -1.8 to 2.4, Z: -1.6 to 1.8)
        // ==========================================
        items.push({
          id: 'house_dining_set',
          type: 'dining_set',
          name: 'Solid Hardwood Dining Table & 6 Designer Chairs',
          position: [0.3, 0, 0.1],
          rotation: [0, 0, 0],
          style: style,
          woodColor: palette.woodColor,
          room: 'dining',
          cost: 1850
        });

        items.push({
          id: 'house_dining_pendant',
          type: 'pendant_light',
          name: 'Linear Brass Dining Chandelier',
          position: [0.3, 2.7, 0.1],
          rotation: [0, 0, 0],
          style: style,
          room: 'dining',
          cost: 450
        });

        items.push({
          id: 'house_dining_rug',
          type: 'rug',
          name: 'Dining Area Low-Pile Defined Rug',
          position: [0.3, 0.005, 0.1],
          rotation: [0, 0, 0],
          dimensions: [2.8, 2.2],
          style: style,
          room: 'dining',
          cost: 310
        });

        items.push({
          id: 'house_dining_credenza',
          type: 'credenza',
          name: 'Crockery Unit & China Buffet Sideboard',
          position: [-1.52, 0, 0.1],
          rotation: [0, Math.PI / 2, 0],
          style: style,
          woodColor: palette.woodColor,
          room: 'dining',
          cost: 720
        });

        items.push({
          id: 'house_dining_clock',
          type: 'wall_clock',
          name: 'Architectural Minimalist Wall Clock',
          position: [2.35, 2.2, 0.1],
          rotation: [0, -Math.PI / 2, 0],
          room: 'dining',
          cost: 110
        });

        items.push({
          id: 'house_dining_plant',
          type: 'plant',
          name: 'Dining Pavilion Tall Fiddle Leaf Planter',
          position: [1.9, 0, 1.4],
          rotation: [0, 0, 0],
          room: 'dining',
          cost: 150
        });

        // ==========================================
        // 4. MODULAR KITCHEN (X: -1.8 to 2.4, Z: -6.0 to -1.6)
        // ==========================================
        items.push({
          id: 'house_kitchen_cabinets',
          type: 'kitchen_cabinets',
          name: 'Modular Shaker Cabinets with Double Sink & Casement Window',
          position: [0.3, 0, -5.6],
          rotation: [0, 0, 0],
          style: style,
          color: palette.kitchenColor || 0x2c3e50,
          room: 'kitchen',
          cost: 2600
        });

        items.push({
          id: 'house_kitchen_range',
          type: 'kitchen_range',
          name: '4-Burner Induction Range with Chimney Hood',
          position: [-1.5, 0, -4.4],
          rotation: [0, Math.PI / 2, 0],
          style: style,
          room: 'kitchen',
          cost: 1250
        });

        items.push({
          id: 'house_kitchen_fridge',
          type: 'refrigerator',
          name: 'Stainless Steel French-Door Refrigerator',
          position: [-1.45, 0, -2.8],
          rotation: [0, Math.PI / 2, 0],
          room: 'kitchen',
          cost: 1550
        });

        items.push({
          id: 'house_kitchen_island',
          type: 'kitchen_island',
          name: 'Quartz Waterfall Prep Island & Breakfast Bar',
          position: [0.3, 0, -2.6],
          rotation: [0, 0, 0],
          style: style,
          color: palette.kitchenIslandColor || 0x334155,
          room: 'kitchen',
          cost: 1450
        });

        items.push({
          id: 'house_kitchen_stool_1',
          type: 'bar_stool',
          name: 'Designer Swivel Bar Stool #1',
          position: [-0.3, 0, -1.9],
          rotation: [0, Math.PI, 0],
          style: style,
          color: palette.accentColor,
          room: 'kitchen',
          cost: 180
        });

        items.push({
          id: 'house_kitchen_stool_2',
          type: 'bar_stool',
          name: 'Designer Swivel Bar Stool #2',
          position: [0.7, 0, -1.9],
          rotation: [0, Math.PI, 0],
          style: style,
          color: palette.accentColor,
          room: 'kitchen',
          cost: 180
        });

        items.push({
          id: 'house_kitchen_coffee',
          type: 'coffee_machine',
          name: 'Artisan Espresso Coffee Machine',
          position: [1.5, 0.92, -5.5],
          rotation: [0, 0, 0],
          room: 'kitchen',
          cost: 320
        });

        items.push({
          id: 'house_kitchen_purifier',
          type: 'water_purifier',
          name: 'RO UV Alkaline Water Purifier',
          position: [-0.8, 1.5, -5.9],
          rotation: [0, 0, 0],
          room: 'kitchen',
          cost: 290
        });

        items.push({
          id: 'house_kitchen_trash',
          type: 'trash_bin',
          name: 'Stainless Step Trash Bin',
          position: [-1.5, 0, -5.5],
          rotation: [0, 0, 0],
          room: 'kitchen',
          cost: 95
        });

        // ==========================================
        // 5. MASTER BEDROOM SUITE (X: 2.4 to 6.4, Z: 1.0 to 6.4)
        // ==========================================
        // Corrected Placement: King Bed on solid East wall (X = 6.4) facing West,
        // fully clearing the doorway into Walk-in Closet (Z = 1.0) and Living entrance (X = 2.4, Z = 3.4)
        items.push({
          id: 'house_bed_king',
          type: 'bed',
          name: 'King Size Designer Platform Bed with Acoustic Headboard',
          position: [5.3, 0, 3.7],
          rotation: [0, -Math.PI / 2, 0],
          style: style,
          color: palette.woodColor,
          room: 'bedroom',
          cost: 1750
        });

        items.push({
          id: 'house_bed_nightstand_l',
          type: 'nightstand',
          name: 'Bedside Nightstand (Left)',
          position: [5.9, 0, 5.1],
          rotation: [0, -Math.PI / 2, 0],
          style: style,
          room: 'bedroom',
          cost: 240
        });

        items.push({
          id: 'house_bed_nightstand_r',
          type: 'nightstand',
          name: 'Bedside Nightstand (Right)',
          position: [5.9, 0, 2.3],
          rotation: [0, -Math.PI / 2, 0],
          style: style,
          room: 'bedroom',
          cost: 240
        });

        items.push({
          id: 'house_bed_lamp_l',
          type: 'table_lamp',
          name: 'Bedside Table Lamp (Left)',
          position: [5.9, 0.58, 5.1],
          rotation: [0, 0, 0],
          color: palette.accentColor,
          room: 'bedroom',
          cost: 110
        });

        items.push({
          id: 'house_bed_lamp_r',
          type: 'table_lamp',
          name: 'Bedside Table Lamp (Right)',
          position: [5.9, 0.58, 2.3],
          rotation: [0, 0, 0],
          color: palette.accentColor,
          room: 'bedroom',
          cost: 110
        });

        items.push({
          id: 'house_bed_rug',
          type: 'rug',
          name: 'Plush Silk-Wool Master Suite Rug',
          position: [4.6, 0.005, 3.7],
          rotation: [0, 0, 0],
          dimensions: [2.8, 3.2],
          style: style,
          room: 'bedroom',
          cost: 360
        });

        items.push({
          id: 'house_bed_vanity',
          type: 'credenza',
          name: 'Master Dressing Table Console with Integrated LED Mirror',
          position: [2.7, 0, 5.2],
          rotation: [0, Math.PI / 2, 0],
          style: style,
          woodColor: palette.woodColor,
          room: 'bedroom',
          cost: 650
        });

        items.push({
          id: 'house_bed_vanity_chair',
          type: 'armchair',
          name: 'Boucle Vanity Stool & Dressing Lounge Chair',
          position: [3.3, 0, 5.2],
          rotation: [0, -Math.PI / 2, 0],
          style: style,
          color: palette.accentColor,
          room: 'bedroom',
          cost: 380
        });

        items.push({
          id: 'house_bed_art',
          type: 'wall_art',
          name: 'Master Suite Curated Canvas Art',
          position: [2.46, 1.8, 3.7],
          rotation: [0, Math.PI / 2, 0],
          dimensions: [1.4, 0.9],
          style: style,
          room: 'bedroom',
          cost: 320
        });

        items.push({
          id: 'house_bed_ac',
          type: 'air_conditioner',
          name: 'Master Bedroom Inverter Split AC',
          position: [2.46, 2.4, 2.2],
          rotation: [0, Math.PI / 2, 0],
          room: 'bedroom',
          cost: 650
        });

        items.push({
          id: 'house_bed_pendant',
          type: 'pendant_light',
          name: 'Master Bedroom Warm Ambient Luminaire',
          position: [4.4, 2.7, 3.7],
          rotation: [0, 0, 0],
          style: style,
          room: 'bedroom',
          cost: 350
        });

        // ==========================================
        // 6. MASTER EN-SUITE BATHROOM & WALK-IN CLOSET
        // ==========================================
        items.push({
          id: 'house_walk_in_wardrobe',
          type: 'mirrored_wardrobe',
          name: 'Master Suite Sliding-Door Wardrobe System',
          position: [2.75, 0, -0.5],
          rotation: [0, Math.PI / 2, 0],
          style: style,
          color: palette.wardrobeColor || 0x2b2d42,
          room: 'walk_in_closet',
          cost: 1100
        });

        items.push({
          id: 'house_dressing_mirror',
          type: 'floor_mirror',
          name: 'Full-Length Illuminated Dressing Mirror',
          position: [3.4, 0, -1.8],
          rotation: [0, 0, 0],
          room: 'walk_in_closet',
          cost: 260
        });

        items.push({
          id: 'house_master_shower',
          type: 'shower',
          name: 'Master En-Suite Walk-In Glass Shower Enclosure',
          position: [5.7, 0, -1.3],
          rotation: [0, -Math.PI / 2, 0],
          room: 'master_bath',
          cost: 650
        });

        items.push({
          id: 'house_master_toilet',
          type: 'toilet',
          name: 'Concealed Cistern Wall-Hung Ceramic Toilet',
          position: [4.8, 0, -1.5],
          rotation: [0, 0, 0],
          room: 'master_bath',
          cost: 320
        });

        items.push({
          id: 'house_master_vanity',
          type: 'bathroom_vanity',
          name: 'Master En-Suite Floating Vanity & LED Mirror',
          position: [5.4, 0, 0.5],
          rotation: [0, Math.PI, 0],
          room: 'master_bath',
          cost: 540
        });

        // ==========================================
        // 7. SECOND BEDROOM SUITE (X: -6.2 to -1.8, Z: -6.0 to 0.6)
        // ==========================================
        items.push({
          id: 'house_bed2_twin',
          type: 'bed',
          name: 'Second Bedroom Queen Platform Bed',
          position: [-5.1, 0, -2.7],
          rotation: [0, Math.PI / 2, 0],
          style: style,
          color: palette.woodColor,
          room: 'bedroom2',
          cost: 1250
        });

        items.push({
          id: 'house_bed2_nightstand_l',
          type: 'nightstand',
          name: 'Second Bedroom Nightstand (Left)',
          position: [-5.1, 0, -1.6],
          rotation: [0, Math.PI / 2, 0],
          style: style,
          room: 'bedroom2',
          cost: 220
        });

        items.push({
          id: 'house_bed2_nightstand_r',
          type: 'nightstand',
          name: 'Second Bedroom Nightstand (Right)',
          position: [-5.1, 0, -3.8],
          rotation: [0, Math.PI / 2, 0],
          style: style,
          room: 'bedroom2',
          cost: 220
        });

        items.push({
          id: 'house_bed2_lamp_l',
          type: 'table_lamp',
          name: 'Bedside Reading Table Lamp (Left)',
          position: [-5.1, 0.58, -1.6],
          rotation: [0, 0, 0],
          color: palette.accentColor,
          room: 'bedroom2',
          cost: 110
        });

        items.push({
          id: 'house_bed2_lamp_r',
          type: 'table_lamp',
          name: 'Bedside Reading Table Lamp (Right)',
          position: [-5.1, 0.58, -3.8],
          rotation: [0, 0, 0],
          color: palette.accentColor,
          room: 'bedroom2',
          cost: 110
        });

        items.push({
          id: 'house_bed2_wardrobe',
          type: 'wardrobe',
          name: 'Second Bedroom Built-In Sliding Door Wardrobe',
          position: [-2.15, 0, -1.2],
          rotation: [0, -Math.PI / 2, 0],
          style: style,
          color: palette.wardrobeColor || 0x2b2d42,
          room: 'bedroom2',
          cost: 1200
        });

        // Ergonomic Study Desk & Swivel Office Chair
        items.push({
          id: 'house_bed2_desk',
          type: 'desk',
          name: 'Second Bedroom Ergonomic Study Workstation',
          position: [-2.6, 0, -5.0],
          rotation: [0, 0, 0],
          style: style,
          room: 'bedroom2',
          cost: 580
        });

        items.push({
          id: 'house_bed2_chair',
          type: 'office_chair',
          name: 'Ergonomic Swivel Study Chair',
          position: [-2.6, 0, -4.3],
          rotation: [0, 0, 0],
          room: 'bedroom2',
          cost: 280
        });

        items.push({
          id: 'house_bed2_rug',
          type: 'rug',
          name: 'Bedroom 2 Plush Area Rug',
          position: [-4.0, 0.005, -2.7],
          rotation: [0, 0, 0],
          dimensions: [2.8, 2.2],
          style: style,
          room: 'bedroom2',
          cost: 320
        });

        items.push({
          id: 'house_bed2_art',
          type: 'wall_art',
          name: 'Curated Bedroom Modern Graphic Art',
          position: [-1.86, 1.8, -3.2],
          rotation: [0, -Math.PI / 2, 0],
          dimensions: [1.4, 0.9],
          style: style,
          room: 'bedroom2',
          cost: 260
        });

        items.push({
          id: 'house_bed2_ac',
          type: 'air_conditioner',
          name: 'Bedroom 2 Inverter Split AC',
          position: [-4.0, 2.4, -5.94],
          rotation: [0, 0, 0],
          room: 'bedroom2',
          cost: 650
        });

        // ==========================================
        // 8. COMMON BATHROOM (X: -6.2 to -3.2, Z: 0.6 to 3.4)
        // ==========================================
        items.push({
          id: 'house_bath1_shower',
          type: 'shower',
          name: 'Common Bathroom Walk-In Glass Shower Enclosure',
          position: [-5.5, 0, 1.4],
          rotation: [0, 0, 0],
          room: 'common_bath',
          cost: 650
        });

        items.push({
          id: 'house_bath1_toilet',
          type: 'toilet',
          name: 'Common Bathroom Ceramic Toilet with Concealed Cistern',
          position: [-4.0, 0, 0.95],
          rotation: [0, 0, 0],
          room: 'common_bath',
          cost: 280
        });

        items.push({
          id: 'house_bath1_vanity',
          type: 'bathroom_vanity',
          name: 'Common Bathroom Floating Vanity & Backlit Mirror',
          position: [-3.55, 0, 2.4],
          rotation: [0, -Math.PI / 2, 0],
          room: 'common_bath',
          cost: 480
        });

        // ==========================================
        // 9. BACKYARD GARDEN & FRONT LAWN
        // ==========================================
        items.push({
          id: 'house_garden_stones',
          type: 'stepping_stones',
          name: 'Backyard Garden Slate Pathway Stones',
          position: [4.4, 0, -7.5],
          rotation: [0, 0, 0],
          room: 'backyard',
          cost: 65
        });

        items.push({
          id: 'house_garden_patio',
          type: 'patio_set',
          name: 'Backyard Outdoor Teak & Wicker Bistro Set',
          position: [4.4, 0, -6.8],
          rotation: [0, 0, 0],
          room: 'backyard',
          cost: 420
        });

        items.push({
          id: 'house_garden_bush_1',
          type: 'garden_bush',
          name: 'Backyard Flowering Garden Shrub #1',
          position: [5.8, 0, -8.2],
          rotation: [0, 0, 0],
          room: 'backyard',
          cost: 45
        });

        items.push({
          id: 'house_garden_bush_2',
          type: 'garden_bush',
          name: 'Backyard Flowering Garden Shrub #2',
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

        items.push({
          id: 'house_porch_planter_l',
          type: 'plant',
          name: 'Front Porch Architectural Planter (Left)',
          position: [-5.8, 0, 6.7],
          rotation: [0, 0, 0],
          room: 'front_lawn',
          cost: 110
        });

        items.push({
          id: 'house_porch_planter_r',
          type: 'plant',
          name: 'Front Porch Architectural Planter (Right)',
          position: [-3.6, 0, 6.7],
          rotation: [0, 0, 0],
          room: 'front_lawn',
          cost: 110
        });
      } else {
        concept = `ARCHITECTURAL 1 BHK SINGLE BEDROOM RESIDENCE (${style.toUpperCase()})`;
          spatialRationale = `A perfectly planned 14m × 13m architectural Single Bedroom House featuring a dedicated Entrance Foyer with customizable fluted entry door & slatted wooden divider, an open-concept Living Room lounge with Missouri TV entertainment center, interconnected Formal Dining Area with linear brass chandelier, high-efficiency Modular Kitchen with waterfall prep island and breakfast counter bar stools, private secluded Master Bedroom Suite with king platform bed, built-in wardrobe, and vanity console, and a luxury direct En-Suite Master Bathroom with frameless glass walk-in shower, floating vanity, and lighted mirror.`;
          lightingPlan = `Layered warm 3000K architectural illumination: warm LED ambient cove lighting in the living lounge, suspended linear multi-pendant dining chandelier, high-CRI under-cabinet task lighting in the kitchen, illuminated LED anti-fog mirror in the master bathroom, and dual dimmable bedside reading sconces in the master suite.`;

          // ==========================================
          // 1. ENTRANCE FOYER (X: -6.3 to -3.1, Z: 2.8 to 6.4)
          // ==========================================
          items.push({
            id: 'house_foyer_console',
            type: 'foyer_console',
            name: 'Entrance Foyer Console Table & Round Mirror',
            position: [-4.7, 0, 3.4],
            rotation: [0, 0, 0],
            room: 'foyer',
            cost: 480
          });

          items.push({
            id: 'house_foyer_plant',
            type: 'plant',
            name: 'Entrance Foyer Potted Fig Tree',
            position: [-3.6, 0, 6.0],
            rotation: [0, 0, 0],
            room: 'foyer',
            cost: 160
          });

          items.push({
            id: 'house_foyer_rug',
            type: 'rug',
            name: 'Entrance Foyer Welcome Runner',
            position: [-4.7, 0.005, 4.6],
            rotation: [0, 0, 0],
            dimensions: [1.8, 1.2],
            style: style,
            room: 'foyer',
            cost: 210
          });

          // ==========================================
          // 2. LIVING ROOM LOUNGE (X: -3.1 to 2.9, Z: 1.8 to 6.4)
          // ==========================================
          items.push({
            id: 'house_living_tv_unit',
            type: 'missouri_tv_unit',
            name: 'Missouri Engineered Wood TV Unit',
            position: [-2.85, 0, 4.1],
            rotation: [0, Math.PI / 2, 0],
            style: style,
            room: 'living',
            cost: 1350
          });

          items.push({
            id: 'house_living_sofa',
            type: 'sofa',
            name: 'Plush Ergonomic Living Lounge Sofa',
            position: [0.5, 0, 4.1],
            rotation: [0, -Math.PI / 2, 0],
            style: style,
            color: palette.sofaColor,
            room: 'living',
            cost: 1400
          });

          items.push({
            id: 'house_living_coffee_table',
            type: 'coffee_table',
            name: 'Architectural Wood & Glass Coffee Table',
            position: [-1.2, 0, 4.1],
            rotation: [0, 0, 0],
            style: style,
            woodColor: palette.woodColor,
            room: 'living',
            cost: 420
          });

          items.push({
            id: 'house_living_armchair',
            type: 'armchair',
            name: 'Designer Lounge Accent Chair',
            position: [0.35, 0, 2.5],
            rotation: [0, -2.4, 0],
            style: style,
            color: palette.accentColor,
            room: 'living',
            cost: 580
          });

          items.push({
            id: 'house_living_rug',
            type: 'rug',
            name: 'Living Room Plush Wool Rug',
            position: [-0.6, 0.005, 4.1],
            rotation: [0, 0, 0],
            dimensions: [3.4, 2.6],
            style: style,
            room: 'living',
            cost: 380
          });

          items.push({
            id: 'house_living_lamp',
            type: 'floor_lamp',
            name: 'Sculptural Brass Arc Floor Lamp',
            position: [1.8, 0, 5.8],
            rotation: [0, 0, 0],
            style: style,
            room: 'living',
            cost: 290
          });

          items.push({
            id: 'house_living_plant',
            type: 'plant',
            name: 'Living Room Ceramic Planter',
            position: [-2.8, 0, 2.2],
            rotation: [0, 0, 0],
            room: 'living',
            cost: 140
          });

          items.push({
            id: 'house_living_fan',
            type: 'ceiling_fan',
            name: 'Aero Minimalist Ceiling Fan',
            position: [-0.1, 2.75, 4.1],
            rotation: [0, 0, 0],
            room: 'living',
            cost: 280
          });

          // ==========================================
          // 3. DINING AREA (X: 2.9 to 6.9, Z: 1.8 to 6.4)
          // ==========================================
          items.push({
            id: 'house_dining_set',
            type: 'dining_set',
            name: 'Solid Hardwood Dining Table & 6 Chairs',
            position: [4.9, 0, 2.7],
            rotation: [0, 0, 0],
            style: style,
            woodColor: palette.woodColor,
            room: 'dining',
            cost: 1850
          });

          items.push({
            id: 'house_dining_pendant',
            type: 'pendant_light',
            name: 'Linear Brass Dining Chandelier',
            position: [4.9, 2.7, 2.7],
            rotation: [0, 0, 0],
            style: style,
            room: 'dining',
            cost: 450
          });

          items.push({
            id: 'house_dining_rug',
            type: 'rug',
            name: 'Dining Area Low-Pile Defined Rug',
            position: [4.9, 0.005, 2.7],
            rotation: [0, 0, 0],
            dimensions: [3.0, 2.4],
            style: style,
            room: 'dining',
            cost: 320
          });

          items.push({
            id: 'house_dining_credenza',
            type: 'credenza',
            name: 'Crockery Unit & China Buffet Sideboard',
            position: [6.6, 0, 2.7],
            rotation: [0, -Math.PI / 2, 0],
            style: style,
            woodColor: palette.woodColor,
            room: 'dining',
            cost: 720
          });

          items.push({
            id: 'house_dining_plant',
            type: 'plant',
            name: 'Dining Area Tall Fiddle Leaf Planter',
            position: [6.5, 0, 4.8],
            rotation: [0, 0, 0],
            room: 'dining',
            cost: 160
          });

          // ==========================================
          // 4. MODULAR KITCHEN (X: 2.9 to 6.9, Z: -6.0 to 1.8)
          // ==========================================
          items.push({
            id: 'house_kitchen_cabinets',
            type: 'kitchen_cabinets',
            name: 'Modular Kitchen Cabinets with Sink & Cooktop',
            position: [4.9, 0, -5.6],
            rotation: [0, 0, 0],
            style: style,
            color: palette.kitchenColor || 0x2c3e50,
            room: 'kitchen',
            cost: 2600
          });

          items.push({
            id: 'house_kitchen_island',
            type: 'kitchen_island',
            name: 'Quartz Waterfall Prep Island & Breakfast Bar',
            position: [4.9, 0, -2.2],
            rotation: [0, 0, 0],
            style: style,
            color: palette.kitchenIslandColor || 0x334155,
            room: 'kitchen',
            cost: 1450
          });

          items.push({
            id: 'house_kitchen_stool_1',
            type: 'bar_stool',
            name: 'Designer Swivel Bar Stool #1',
            position: [4.3, 0, -1.5],
            rotation: [0, Math.PI, 0],
            style: style,
            color: palette.accentColor,
            room: 'kitchen',
            cost: 180
          });

          items.push({
            id: 'house_kitchen_stool_2',
            type: 'bar_stool',
            name: 'Designer Swivel Bar Stool #2',
            position: [5.5, 0, -1.5],
            rotation: [0, Math.PI, 0],
            style: style,
            color: palette.accentColor,
            room: 'kitchen',
            cost: 180
          });

          items.push({
            id: 'house_kitchen_fridge',
            type: 'refrigerator',
            name: 'Stainless Steel French-Door Refrigerator',
            position: [6.5, 0, -4.6],
            rotation: [0, -Math.PI / 2, 0],
            room: 'kitchen',
            cost: 1550
          });

          items.push({
            id: 'house_kitchen_coffee',
            type: 'coffee_machine',
            name: 'Artisan Espresso Coffee Machine',
            position: [3.6, 0.92, -5.5],
            rotation: [0, 0, 0],
            room: 'kitchen',
            cost: 320
          });

          items.push({
            id: 'house_kitchen_purifier',
            type: 'water_purifier',
            name: 'RO UV Alkaline Water Purifier',
            position: [5.9, 1.5, -5.9],
            rotation: [0, 0, 0],
            room: 'kitchen',
            cost: 290
          });

          items.push({
            id: 'house_kitchen_trash',
            type: 'trash_bin',
            name: 'Stainless Step Trash Bin',
            position: [3.2, 0, -5.5],
            rotation: [0, 0, 0],
            room: 'kitchen',
            cost: 95
          });

          // ==========================================
          // 5. MASTER BEDROOM SUITE (X: -6.3 to -0.7, Z: -5.8 to 1.8)
          // ==========================================
          items.push({
            id: 'house_bed_king',
            type: 'bed',
            name: 'King Size Designer Platform Bed',
            position: [-3.5, 0, -4.7],
            rotation: [0, 0, 0],
            style: style,
            color: palette.woodColor,
            room: 'bedroom',
            cost: 1750
          });

          items.push({
            id: 'house_bed_nightstand_l',
            type: 'nightstand',
            name: 'Bedside Nightstand (Left)',
            position: [-4.9, 0, -5.6],
            rotation: [0, 0, 0],
            style: style,
            room: 'bedroom',
            cost: 240
          });

          items.push({
            id: 'house_bed_nightstand_r',
            type: 'nightstand',
            name: 'Bedside Nightstand (Right)',
            position: [-2.1, 0, -5.6],
            rotation: [0, 0, 0],
            style: style,
            room: 'bedroom',
            cost: 240
          });

          items.push({
            id: 'house_bed_lamp_l',
            type: 'table_lamp',
            name: 'Bedside Table Lamp (Left)',
            position: [-4.9, 0.58, -5.6],
            rotation: [0, 0, 0],
            color: palette.accentColor,
            room: 'bedroom',
            cost: 110
          });

          items.push({
            id: 'house_bed_lamp_r',
            type: 'table_lamp',
            name: 'Bedside Table Lamp (Right)',
            position: [-2.1, 0.58, -5.6],
            rotation: [0, 0, 0],
            color: palette.accentColor,
            room: 'bedroom',
            cost: 110
          });

          items.push({
            id: 'house_bed_wardrobe',
            type: 'walk_in_wardrobe',
            name: 'Full-Height Master Wardrobe System',
            position: [-1.0, 0, -0.6],
            rotation: [0, -Math.PI / 2, 0],
            style: style,
            color: palette.wardrobeColor || 0x2b2d42,
            room: 'bedroom',
            cost: 1650
          });

          items.push({
            id: 'house_bed_vanity',
            type: 'credenza',
            name: 'Bedroom Dressing Vanity Console',
            position: [-5.9, 0, 0.4],
            rotation: [0, Math.PI / 2, 0],
            style: style,
            room: 'bedroom',
            cost: 650
          });

          items.push({
            id: 'house_bed_chair',
            type: 'armchair',
            name: 'Velvet Bedroom Vanity Lounge Chair',
            position: [-5.2, 0, 0.4],
            rotation: [0, -Math.PI / 2, 0],
            style: style,
            room: 'bedroom',
            cost: 380
          });

          items.push({
            id: 'house_bed_rug',
            type: 'rug',
            name: 'Plush High-Pile Bedroom Rug',
            position: [-3.5, 0.005, -3.5],
            rotation: [0, 0, 0],
            dimensions: [3.2, 2.2],
            style: style,
            room: 'bedroom',
            cost: 360
          });

          items.push({
            id: 'house_bed_lounge',
            type: 'armchair',
            name: 'Velvet Bedroom Relaxation Armchair',
            position: [-5.6, 0, 1.4],
            rotation: [0, -2.4, 0],
            style: style,
            color: palette.sofaColor,
            room: 'bedroom',
            cost: 520
          });

          items.push({
            id: 'house_bed_art',
            type: 'wall_art',
            name: 'Curated Gallery Wall Art',
            position: [-3.5, 1.8, -5.74],
            rotation: [0, 0, 0],
            dimensions: [1.6, 1.0],
            style: style,
            room: 'bedroom',
            cost: 320
          });

          items.push({
            id: 'house_bed_ac',
            type: 'air_conditioner',
            name: 'Master Bedroom Inverter Split AC',
            position: [-5.9, 2.4, -2.0],
            rotation: [0, Math.PI / 2, 0],
            room: 'bedroom',
            cost: 650
          });

          // ==========================================
          // 6. MASTER BATHROOM EN-SUITE (X: -0.7 to 2.9, Z: -5.8 to -1.4)
          // ==========================================
          items.push({
            id: 'house_master_shower',
            type: 'shower',
            name: 'Master En-Suite Walk-In Glass Shower',
            position: [2.4, 0, -5.0],
            rotation: [0, -Math.PI / 2, 0],
            room: 'master_bath',
            cost: 650
          });

          items.push({
            id: 'house_master_toilet',
            type: 'toilet',
            name: 'Master En-Suite Wall-Hung Toilet',
            position: [1.1, 0, -5.2],
            rotation: [0, 0, 0],
            room: 'master_bath',
            cost: 320
          });

          items.push({
            id: 'house_master_vanity',
            type: 'bathroom_vanity',
            name: 'Master En-Suite Vanity & Lighted Mirror',
            position: [1.1, 0, -1.8],
            rotation: [0, Math.PI, 0],
            room: 'master_bath',
            cost: 540
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

  window.AIEngine = AIEngine;

  // 5. Landing Showcase
// Interactive Live 3D Hero Demo for Landing Page

class HeroDemo {
  constructor() {
    this.canvas = document.getElementById('heroCanvas');
    if (!this.canvas) return;

    this.furnitureGroup = new THREE.Group();
    this.currentStyle = 'modern';
    this.isDay = true;

    this.initScene();
    this.initLights();
    this.initRoom();
    this.loadStyle('modern');
    this.initEvents();

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initScene() {
    const width = this.canvas.parentElement.clientWidth;
    const height = this.canvas.parentElement.clientHeight || 520;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0f1d);

    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    this.camera.position.set(0, 4.2, 6.2);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;

    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.05;
    this.controls.minDistance = 3.0;
    this.controls.maxDistance = 14.0;
    this.controls.target.set(0, 0.9, 0);

    this.scene.add(this.furnitureGroup);

    window.addEventListener('resize', () => {
      const w = this.canvas.parentElement.clientWidth;
      const h = this.canvas.parentElement.clientHeight || 520;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    });
  }

  initLights() {
    this.ambient = new THREE.AmbientLight(0xffffff, 0.55);
    this.scene.add(this.ambient);

    this.sun = new THREE.DirectionalLight(0xfff7ed, 1.2);
    this.sun.position.set(-6, 8, 4);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(1024, 1024);
    this.sun.shadow.bias = -0.0005;
    this.scene.add(this.sun);

    this.point = new THREE.PointLight(0xffedd5, 0.5, 10);
    this.point.position.set(0, 2.5, 0);
    this.scene.add(this.point);
  }

  initRoom() {
    this.roomBuilder = new RoomBuilder(this.scene);
  }

  loadStyle(style) {
    this.currentStyle = style;

    // Clear previous
    while (this.furnitureGroup.children.length > 0) {
      this.furnitureGroup.remove(this.furnitureGroup.children[0]);
    }

    const pref = {
      roomType: 'living_room',
      dimensions: { width: 5.0, length: 4.2, height: 2.8 },
      style: style,
      colorScheme: style === 'luxury' ? 'dark_luxury' : (style === 'minimalist' ? 'cool_scandi' : 'warm_neutral'),
      flooring: style === 'luxury' ? 'marble' : (style === 'minimalist' ? 'tile' : 'wood_oak'),
      lighting: 'warm_ambient'
    };

    this.roomBuilder.buildRoom(pref.dimensions, 0xf8fafc, pref.flooring);
    const plan = AIEngine.generateAlgorithmicDesign(pref);
    this.roomBuilder.setWallColor(plan.wallColorHex);

    plan.items.forEach(item => {
      let mesh = null;
      switch (item.type) {
        case 'sofa': mesh = FurnitureFactory.createSofa(style, item.color); break;
        case 'coffee_table': mesh = FurnitureFactory.createCoffeeTable(style, item.color); break;
        case 'tv_unit': mesh = FurnitureFactory.createTVUnit(style); break;
        case 'missouri_tv_unit': mesh = FurnitureFactory.createMissouriTVUnit(style, item.color); break;
        case 'armchair': mesh = FurnitureFactory.createArmchair(style, item.color); break;
        case 'floor_lamp': mesh = FurnitureFactory.createFloorLamp(style); break;
        case 'plant': mesh = FurnitureFactory.createPlant(); break;
        case 'wall_art': mesh = FurnitureFactory.createWallArt(style); break;
        case 'bookshelf': mesh = FurnitureFactory.createBookshelf(style); break;
        case 'rug': mesh = FurnitureFactory.createRug(2.4, 1.8, style); break;
      }
      if (mesh) {
        if (item.position) mesh.position.set(...item.position);
        if (item.rotation) mesh.rotation.set(...item.rotation);
        this.furnitureGroup.add(mesh);
      }
    });
  }

  initEvents() {
    // Style toggle buttons in demo header
    document.querySelectorAll('[data-demo-style]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-demo-style]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.loadStyle(btn.dataset.demoStyle);

        // Also sync style preview cards below
        document.querySelectorAll('.style-preview-card').forEach(card => {
          card.classList.toggle('active', card.dataset.style === btn.dataset.demoStyle);
        });
      });
    });

    // Style preview cards in the showcase section
    document.querySelectorAll('.style-preview-card').forEach(card => {
      card.addEventListener('click', () => {
        const style = card.dataset.style;
        document.querySelectorAll('.style-preview-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');

        document.querySelectorAll('[data-demo-style]').forEach(b => {
          b.classList.toggle('active', b.dataset.demoStyle === style);
        });

        this.loadStyle(style);

        // Smoothly scroll to demo
        document.getElementById('demo-section').scrollIntoView({ behavior: 'smooth' });
      });
    });

    // Day/Night toggle
    const toggleDay = document.getElementById('demo-day-toggle');
    if (toggleDay) {
      toggleDay.addEventListener('click', () => {
        this.isDay = !this.isDay;
        toggleDay.classList.toggle('active', this.isDay);
        toggleDay.textContent = this.isDay ? '☀️ Day' : '🌙 Night';
        if (this.isDay) {
          this.scene.background.set(0x0a0f1d);
          this.ambient.intensity = 0.55;
          this.sun.intensity = 1.2;
        } else {
          this.scene.background.set(0x020408);
          this.ambient.intensity = 0.15;
          this.sun.intensity = 0.05;
        }
      });
    }

    // Top view toggle
    const topBtn = document.getElementById('demo-top-toggle');
    if (topBtn) {
      topBtn.addEventListener('click', () => {
        topBtn.classList.toggle('active');
        if (topBtn.classList.contains('active')) {
          this.camera.position.set(0, 8.5, 0.001);
          this.controls.target.set(0, 0, 0);
        } else {
          this.camera.position.set(0, 4.2, 6.2);
          this.controls.target.set(0, 0.9, 0);
        }
        this.controls.update();
      });
    }

    // Require login before proceeding to 3D studio
    document.querySelectorAll('a[href*="studio.html"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const user = localStorage.getItem('ai_interior_user');
        if (!user) {
          e.preventDefault();
          window.location.href = 'login.html?redirect=studio.html';
        }
      });
    });

    // Check user session and adjust navbar
    try {
      const stored = localStorage.getItem('ai_interior_user');
      const userLoginLink = document.getElementById('nav-user-login-link');
      const adminLoginLink = document.getElementById('nav-admin-login-link');
      const signupLink = document.getElementById('nav-signup-link');

      if (stored) {
        const user = JSON.parse(stored);
        const isAdmin = user.role === 'admin' && user.email && user.email.toLowerCase() === 'bhuvan@gmail.com';

        if (userLoginLink) {
          userLoginLink.innerHTML = `${isAdmin ? '👑' : '👤'} Hi, ${user.name.split(' ')[0]}`;
          userLoginLink.href = isAdmin ? 'admin.html' : 'studio.html';
          userLoginLink.title = `Signed in as ${user.name} (${user.email || ''})`;
          userLoginLink.style.borderColor = isAdmin ? 'rgba(245, 158, 11, 0.4)' : 'rgba(99, 102, 241, 0.4)';
          userLoginLink.style.color = isAdmin ? '#fbbf24' : '#fff';
        }

        if (adminLoginLink) {
          if (isAdmin) {
            adminLoginLink.innerHTML = '<span>⚙️</span> Dashboard';
            adminLoginLink.href = 'admin.html';
            adminLoginLink.style.display = 'inline-flex';
          } else {
            adminLoginLink.style.display = 'none';
          }
        }

        if (signupLink) {
          signupLink.innerHTML = '<span>🚪</span> Sign Out';
          signupLink.href = '#';
          signupLink.style.borderColor = 'rgba(239, 68, 68, 0.3)';
          signupLink.style.background = 'rgba(239, 68, 68, 0.08)';
          signupLink.style.color = '#fca5a5';
          signupLink.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('ai_interior_user');
            window.location.reload();
          });
        }
      } else {
        if (userLoginLink) userLoginLink.style.display = 'inline-flex';
        if (adminLoginLink) adminLoginLink.style.display = 'inline-flex';
        if (signupLink) signupLink.style.display = 'inline-flex';
      }
    } catch (e) {}
  }

  animate() {
    requestAnimationFrame(this.animate);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new HeroDemo();
});


})();
