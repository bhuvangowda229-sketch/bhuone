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
  buildCompleteHouse(wallColorHex = 0xfaf5ee, flooringType = 'porcelain_tile', houseType = '1bhk') {
    this.isCompleteHouse = true;
    this.houseType = houseType || '1bhk';
    const isDuplex = (this.houseType === 'duplex' || this.houseType === 'duplex_villa');
    const is3BHK = (this.houseType === '3bhk' || this.houseType === 'complete_house_3bhk');
    const isVilla = (this.houseType === 'villa_2bhk' || this.houseType === 'villa' || this.houseType === '2bhk' || this.houseType === 'complete_house_2bhk');
    
    if (isDuplex) {
      this.currentDimensions = { width: 16.0, length: 16.0, height: 5.6 };
    } else if (is3BHK) {
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

    if (isDuplex) {
      // Modern Duplex Villa (Double-Height living, floating stairs, mezzanine)
      this.buildDuplexFloors(flooringType);
      this.buildDuplexWalls(H, wallColorHex);
      this.buildDuplexWindowsAndDoors(H);
      this.buildDuplexBadges();
      this.buildFloorGrid(16.0, 16.0);
    } else if (is3BHK) {
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
  // LUXURY 3 BHK RESIDENCE ARCHITECTURE
  // ==========================================
  buildThreeBhkFloors(flooringType) {
    const makeFloorMesh = (W, L, posX, posZ, floorType, zoneKey, posY = 0) => {
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
        case 'herringbone_wood':
        case 'herringbone':
          floorTexture = TextureGenerator.createHerringboneWoodTexture(0xb8824f, 0x6e4321);
          roughness = 0.42;
          metalness = 0.04;
          break;
        case 'porcelain_tile':
        case 'porcelain':
          floorTexture = TextureGenerator.createPorcelainTileTexture(0xf8f9fa, 0xd1d5db);
          roughness = 0.16;
          metalness = 0.08;
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
      mesh.position.set(posX, posY, posZ);
      mesh.receiveShadow = true;
      mesh.name = `HouseFloor_${zoneKey}`;
      mesh.userData = { isFloor: true, roomZone: zoneKey, zone: zoneKey };
      this.houseFloors.push(mesh);
      this.roomGroup.add(mesh);
      return mesh;
    };

    const isTileVariant = ['porcelain_tile', 'marble_white', 'tile', 'terrazzo', 'paving'].includes(flooringType);
    const commonFlooring = isTileVariant ? flooringType : 'porcelain_tile';
    const bedFlooring = (!isTileVariant && flooringType) ? flooringType : 'wood_oak';

    // 1. Entrance Foyer (Front-Left)
    makeFloorMesh(3.0, 3.0, -5.0, 4.95, commonFlooring, 'foyer');

    // 2. Living Room Lounge (Front-Center)
    makeFloorMesh(6.0, 4.6, -0.5, 4.15, commonFlooring, 'living');

    // 3. Dining Room Pavilion (Front-Right)
    makeFloorMesh(5.0, 4.6, 5.0, 4.15, commonFlooring, 'dining');

    // 4. Modular Kitchen & Breakfast Bar (Mid-Right)
    makeFloorMesh(5.0, 4.4, 5.0, -0.35, commonFlooring, 'kitchen');

    // 5. Master Bedroom Suite (Bed 1 - Rear-Right)
    makeFloorMesh(5.0, 5.4, 5.0, -5.25, 'herringbone_wood', 'bedroom');

    // 6. Master En-Suite Bathroom (Mid-Far-Right)
    makeFloorMesh(2.4, 2.8, 6.3, -1.15, 'blue_tile', 'master_bath');

    // 7. Second Bedroom Suite (Bed 2 - Rear-Left)
    makeFloorMesh(5.0, 5.4, -5.0, -5.25, bedFlooring, 'bedroom2');

    // 8. Third Bedroom Suite (Bed 3 - Mid-Left)
    makeFloorMesh(4.0, 4.4, -5.5, -0.35, bedFlooring, 'bedroom3');

    // 9. Common Bathroom (Central Corridor)
    makeFloorMesh(2.5, 2.8, -2.25, -1.15, 'blue_tile', 'common_bath');

    // 10. Central Hallway Circulation
    makeFloorMesh(3.5, 4.4, 0.75, -0.35, commonFlooring, 'hallway');

    // 11. Front Balcony Deck
    makeFloorMesh(6.0, 2.0, -0.5, 7.45, 'dark_walnut', 'balcony');

    // 12. Exterior Lawn & Garden Buffers
    makeFloorMesh(5.0, 2.0, 5.0, 7.45, 'grass', 'front_lawn');
    makeFloorMesh(3.0, 2.0, -5.0, 7.45, 'paving', 'driveway');
    makeFloorMesh(17.0, 3.0, 0, -8.2, 'grass', 'backyard');
  }

  buildThreeBhkWalls(H, wallColorHex) {
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
        this.frontWalls.push(mesh);
      } else {
        this.houseWalls.push(mesh);
      }
      this.roomGroup.add(mesh);
      return mesh;
    };

    // Exterior Perimeter Walls
    addWall(17.2, H, 0.18, 0, H / 2, -7.95, 'Back Exterior Wall North');
    addWall(0.18, H, 14.4, -7.5, H / 2, -0.75, 'Left Exterior Wall West');
    addWall(0.18, H, 14.4, 7.5, H / 2, -0.75, 'Right Exterior Wall East');

    // South Front Cutaway Walls (Z = 6.45)
    addWall(3.2, H, 0.18, -5.0, H / 2, 6.45, 'Foyer Front Wall (Doorway)', false);
    addWall(6.0, H, 0.18, -0.5, H / 2, 6.45, 'Living Front Wall Cutaway', true);
    addWall(5.0, H, 0.18, 5.0, H / 2, 6.45, 'Dining Front Wall Cutaway', true);

    // Interior Dividing Walls
    addWall(4.0, H, 0.14, -5.5, H / 2, 1.85, 'Bed3 Front Wall');
    addWall(5.0, H, 0.14, 5.0, H / 2, 1.85, 'Kitchen Dining Open Divider Wall');
    addWall(5.0, H, 0.14, -5.0, H / 2, -2.55, 'Bed2 Front Wall');
    addWall(5.0, H, 0.14, 5.0, H / 2, -2.55, 'Master Bed Front Wall');

    // North-South Dividing Walls
    addWall(0.14, H, 10.5, -3.5, H / 2, -2.7, 'Bed3 & Bed2 East Divider Wall');
    addWall(0.14, H, 10.5, 2.5, H / 2, -2.7, 'Kitchen & Master West Divider Wall');
    addWall(0.14, H, 5.4, 0, H / 2, -5.25, 'Bed2 & Master Center Rear Wall');

    // Slatted wood divider between Foyer & Living
    const slatMat = new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.5 });
    for (let s = 0; s < 7; s++) {
      const slat = new THREE.Mesh(new THREE.BoxGeometry(0.05, H - 0.2, 0.08), slatMat);
      slat.position.set(-3.5, H / 2, 3.8 + s * 0.35);
      this.roomGroup.add(slat);
    }

    // Balcony modern glass railing
    const railMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.4, roughness: 0.1 });
    const railFrameMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.2 });
    const bRail = new THREE.Mesh(new THREE.BoxGeometry(6.0, 1.05, 0.04), railMat);
    bRail.position.set(-0.5, 0.55, 8.45);
    this.roomGroup.add(bRail);
    const bCap = new THREE.Mesh(new THREE.BoxGeometry(6.04, 0.05, 0.08), railFrameMat);
    bCap.position.set(-0.5, 1.1, 8.45);
    this.roomGroup.add(bCap);
  }

  buildThreeBhkWindowsAndDoors(H) {
    const createArchitecturalWindow = (w, h, posX, posY, posZ, rotY = 0, isCutaway = false) => {
      const winGroup = new THREE.Group();
      const fMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3, metalness: 0.7 });
      const gMat = new THREE.MeshStandardMaterial({ color: 0x93c5fd, roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.45 });
      const frameTop = new THREE.Mesh(new THREE.BoxGeometry(w, 0.08, 0.12), fMat);
      frameTop.position.set(0, h / 2 - 0.04, 0);
      winGroup.add(frameTop);
      const frameBot = new THREE.Mesh(new THREE.BoxGeometry(w, 0.08, 0.12), fMat);
      frameBot.position.set(0, -h / 2 + 0.04, 0);
      winGroup.add(frameBot);
      const frameL = new THREE.Mesh(new THREE.BoxGeometry(0.08, h, 0.12), fMat);
      frameL.position.set(-w / 2 + 0.04, 0, 0);
      winGroup.add(frameL);
      const frameR = new THREE.Mesh(new THREE.BoxGeometry(0.08, h, 0.12), fMat);
      frameR.position.set(w / 2 - 0.04, 0, 0);
      winGroup.add(frameR);
      const glass = new THREE.Mesh(new THREE.BoxGeometry(w - 0.16, h - 0.16, 0.02), gMat);
      winGroup.add(glass);
      winGroup.position.set(posX, posY, posZ);
      winGroup.rotation.y = rotY;
      this.roomGroup.add(winGroup);
      return winGroup;
    };

    // Master Bedroom Rear North Window
    createArchitecturalWindow(2.4, 1.4, 5.0, 1.6, -7.88, -Math.PI / 2, false);
    // Bed 2 Rear North Window
    createArchitecturalWindow(2.4, 1.4, -5.0, 1.6, -7.88, -Math.PI / 2, false);
    // Bed 3 West Window
    createArchitecturalWindow(2.0, 1.3, -7.42, 1.6, -0.35, 0, false);
    // Kitchen East Window
    createArchitecturalWindow(2.0, 1.2, 7.42, 1.6, -0.35, 0, false);
    // Balcony Sliding Glass Door from Living
    createArchitecturalWindow(3.4, 2.2, -0.5, 1.15, 6.42, -Math.PI / 2, false);

    // Foyer Front Door
    this.buildVillaEntryDoor(H);
  }

  buildThreeBhkBadges() {
    this.createRoomBadge('ENTRANCE FOYER', '🚪', -5.0, 4.95, 'foyer');
    this.createRoomBadge('LIVING ROOM', '🛋️', -0.5, 4.15, 'living');
    this.createRoomBadge('DINING PAVILION', '🍽️', 5.0, 4.15, 'dining');
    this.createRoomBadge('MODULAR KITCHEN', '🍳', 5.0, -0.35, 'kitchen');
    this.createRoomBadge('MASTER SUITE (BED 1)', '👑', 5.0, -5.25, 'bedroom');
    this.createRoomBadge('MASTER EN-SUITE', '🛁', 6.3, -1.15, 'master_bath');
    this.createRoomBadge('SECOND BEDROOM (BED 2)', '🛏️', -5.0, -5.25, 'bedroom2');
    this.createRoomBadge('THIRD BEDROOM (BED 3)', '🧸', -5.5, -0.35, 'bedroom3');
    this.createRoomBadge('COMMON BATHROOM', '🚿', -2.25, -1.15, 'common_bath');
    this.createRoomBadge('BALCONY DECK', '🌅', -0.5, 7.45, 'balcony');
  }

  // ==========================================
  // MODERN DUPLEX VILLA ARCHITECTURE
  // ==========================================
  buildDuplexFloors(flooringType) {
    const makeFloorMesh = (W, L, posX, posZ, floorType, zoneKey, posY = 0) => {
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
        case 'dark_walnut':
          floorTexture = TextureGenerator.createWoodTexture(0x4a2e18);
          roughness = 0.5;
          break;
        case 'herringbone_wood':
        case 'herringbone':
          floorTexture = TextureGenerator.createHerringboneWoodTexture(0xb8824f, 0x6e4321);
          roughness = 0.42;
          metalness = 0.04;
          break;
        case 'porcelain_tile':
        case 'porcelain':
          floorTexture = TextureGenerator.createPorcelainTileTexture(0xf8f9fa, 0xd1d5db);
          roughness = 0.16;
          metalness = 0.08;
          break;
        case 'marble':
          floorTexture = TextureGenerator.createMarbleTexture(0xf8fafc, 0x94a3b8);
          roughness = 0.15;
          metalness = 0.1;
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
      mesh.position.set(posX, posY, posZ);
      mesh.receiveShadow = true;
      mesh.name = `HouseFloor_${zoneKey}`;
      mesh.userData = { isFloor: true, roomZone: zoneKey, zone: zoneKey };
      this.houseFloors.push(mesh);
      this.roomGroup.add(mesh);
      return mesh;
    };

    // GROUND LEVEL (Y = 0)
    // 1. Grand Foyer (Front-Left)
    makeFloorMesh(2.8, 3.2, -4.6, 4.8, 'marble', 'foyer');

    // 2. Double-Height Living Lounge (Front-Center)
    makeFloorMesh(5.4, 5.4, -0.5, 3.7, 'marble', 'living');

    // 3. Formal Dining Area (Front-Right)
    makeFloorMesh(4.3, 4.6, 4.35, 4.1, 'marble', 'dining');

    // 4. Gourmet Modular Kitchen Island (Rear-Right)
    makeFloorMesh(4.3, 4.6, 4.35, -0.5, 'porcelain_tile', 'kitchen');

    // 5. Ground Guest Suite (Rear-Left)
    makeFloorMesh(4.7, 5.0, -4.15, -3.5, 'wood_oak', 'bedroom');

    // 6. Ground Guest Bathroom
    makeFloorMesh(2.6, 3.0, -0.5, -3.0, 'blue_tile', 'common_bath');

    // 7. Outdoor Pool Deck & Sunken Terrace (Front-Right Outdoor)
    makeFloorMesh(4.3, 2.0, 4.35, 7.4, 'dark_walnut', 'terrace');

    // UPPER LEVEL MEZZANINE (Y = 2.8)
    // 8. Mezzanine Gallery & Walkway
    makeFloorMesh(1.8, 4.8, 1.4, 3.2, 'herringbone_wood', 'mezzanine', 2.8);

    // 9. Master Penthouse Suite (Upper Level Bed 2)
    makeFloorMesh(4.3, 5.4, 4.35, 0.0, 'herringbone_wood', 'bedroom2', 2.8);

    // 10. Master Luxury Spa Bathroom (Upper Level)
    makeFloorMesh(4.3, 3.0, 4.35, -4.5, 'blue_tile', 'master_bath', 2.8);

    // 11. Upper Loft Sky Lounge & Executive Study (Upper Level)
    makeFloorMesh(6.0, 6.0, -3.5, -2.75, 'herringbone_wood', 'sky_lounge', 2.8);

    // Exterior Grounds
    makeFloorMesh(5.4, 2.0, -0.5, 7.4, 'grass', 'front_lawn');
    makeFloorMesh(14.0, 2.5, 0, -7.5, 'grass', 'backyard');
  }

  buildDuplexWalls(H, wallColorHex) {
    const totalH = H * 2; // 5.6m double-height
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
        this.frontWalls.push(mesh);
      } else {
        this.houseWalls.push(mesh);
      }
      this.roomGroup.add(mesh);
      return mesh;
    };

    // Full double-height exterior perimeter walls (5.6m high)
    addWall(14.2, totalH, 0.18, 0, totalH / 2, -6.5, 'North Double-Height Wall');
    addWall(0.18, totalH, 13.0, -6.5, totalH / 2, 0, 'West Double-Height Wall');
    addWall(0.18, totalH, 13.0, 6.5, totalH / 2, 0, 'East Double-Height Wall');

    // South Front Cutaway Walls
    addWall(2.8, totalH, 0.18, -4.6, totalH / 2, 6.45, 'Foyer Front Wall', false);
    addWall(5.4, totalH, 0.18, -0.5, totalH / 2, 6.45, 'Living Front Double-Height Cutaway', true);
    addWall(4.3, totalH, 0.18, 4.35, totalH / 2, 6.45, 'Dining Front Cutaway', true);

    // Ground Interior Dividing Walls (H = 2.8)
    addWall(4.7, H, 0.14, -4.15, H / 2, -1.0, 'Guest Bed Wall');
    addWall(4.3, H, 0.14, 4.35, H / 2, 1.8, 'Kitchen Dining Open Divider');
    addWall(0.14, H, 5.0, -1.8, H / 2, -3.5, 'Guest Bed Living Divider');

    // Upper Mezzanine Glass Railing (along X = 0.5, Y = 2.8, overlooking Living Lounge)
    const glassRailMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.45, roughness: 0.1 });
    const brassCapMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.85, roughness: 0.2 });
    
    // Mezzanine overlook railing
    const mRail = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.05, 4.8), glassRailMat);
    mRail.position.set(0.5, 2.8 + 0.55, 3.2);
    this.roomGroup.add(mRail);
    const mCap = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.05, 4.84), brassCapMat);
    mCap.position.set(0.5, 2.8 + 1.1, 3.2);
    this.roomGroup.add(mCap);

    // Build Architectural Modern Floating Cantilevered Staircase
    this.buildDuplexFloatingStairs();
  }

  buildDuplexFloatingStairs() {
    const stairGroup = new THREE.Group();
    stairGroup.name = 'Architectural Floating Staircase';

    const numSteps = 14;
    const totalHeight = 2.8;
    const stepRise = totalHeight / numSteps;
    const stepRun = 0.28;
    const stepWidth = 1.05;
    const stepThick = 0.06;

    const treadMat = new THREE.MeshStandardMaterial({ color: 0xc89d6c, roughness: 0.4 });
    const steelMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.3 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x93c5fd, transparent: true, opacity: 0.5, roughness: 0.1 });
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.2 });

    const startZ = 5.4;
    const stairX = 1.0;

    for (let i = 0; i < numSteps; i++) {
      const stepY = i * stepRise + stepRise / 2;
      const stepZ = startZ - i * stepRun;

      // Cantilevered Wood Tread
      const tread = new THREE.Mesh(new THREE.BoxGeometry(stepWidth, stepThick, stepRun), treadMat);
      tread.position.set(stairX, stepY, stepZ);
      tread.castShadow = true;
      tread.receiveShadow = true;
      stairGroup.add(tread);

      // Steel Wall Cantilever Bracket
      const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.14, 0.08), steelMat);
      bracket.position.set(stairX + stepWidth / 2 - 0.04, stepY - 0.06, stepZ);
      stairGroup.add(bracket);

      // Soft Warm LED Under-Step Glow Strip
      const led = new THREE.Mesh(new THREE.BoxGeometry(stepWidth - 0.1, 0.01, 0.02), new THREE.MeshBasicMaterial({ color: 0xfef08a }));
      led.position.set(stairX, stepY - stepThick / 2 - 0.005, stepZ + stepRun / 3);
      stairGroup.add(led);
    }

    // Modern Glass Stair Handrail running diagonally along open edge
    const length = Math.sqrt(Math.pow(numSteps * stepRun, 2) + Math.pow(totalHeight, 2));
    const angle = Math.atan2(totalHeight, numSteps * stepRun);

    const railGlass = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.9, length), glassMat);
    railGlass.position.set(stairX - stepWidth / 2 + 0.02, totalHeight / 2 + 0.45, startZ - (numSteps * stepRun) / 2);
    railGlass.rotation.x = angle;
    stairGroup.add(railGlass);

    const handrail = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, length + 0.2, 16), brassMat);
    handrail.position.set(stairX - stepWidth / 2 + 0.02, totalHeight / 2 + 0.95, startZ - (numSteps * stepRun) / 2);
    handrail.rotation.x = angle + Math.PI / 2;
    stairGroup.add(handrail);

    this.roomGroup.add(stairGroup);
  }

  buildDuplexWindowsAndDoors(H) {
    const createArchitecturalWindow = (w, h, posX, posY, posZ, rotY = 0) => {
      const winGroup = new THREE.Group();
      const fMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3, metalness: 0.7 });
      const gMat = new THREE.MeshStandardMaterial({ color: 0x93c5fd, roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.45 });
      const frameTop = new THREE.Mesh(new THREE.BoxGeometry(w, 0.08, 0.12), fMat);
      frameTop.position.set(0, h / 2 - 0.04, 0);
      winGroup.add(frameTop);
      const frameBot = new THREE.Mesh(new THREE.BoxGeometry(w, 0.08, 0.12), fMat);
      frameBot.position.set(0, -h / 2 + 0.04, 0);
      winGroup.add(frameBot);
      const frameL = new THREE.Mesh(new THREE.BoxGeometry(0.08, h, 0.12), fMat);
      frameL.position.set(-w / 2 + 0.04, 0, 0);
      winGroup.add(frameL);
      const frameR = new THREE.Mesh(new THREE.BoxGeometry(0.08, h, 0.12), fMat);
      frameR.position.set(w / 2 - 0.04, 0, 0);
      winGroup.add(frameR);
      const glass = new THREE.Mesh(new THREE.BoxGeometry(w - 0.16, h - 0.16, 0.02), gMat);
      winGroup.add(glass);
      winGroup.position.set(posX, posY, posZ);
      winGroup.rotation.y = rotY;
      this.roomGroup.add(winGroup);
      return winGroup;
    };

    // Double-Height 4.5m Grand Curtain Wall Window for Living Room
    createArchitecturalWindow(4.8, 4.5, -0.5, 2.5, 6.42, -Math.PI / 2);
    // Upper Penthouse Master Window
    createArchitecturalWindow(3.2, 1.8, 4.35, 4.2, 6.42, -Math.PI / 2);
    // Upper Sky Lounge North Panoramic Window
    createArchitecturalWindow(3.6, 2.0, -3.5, 4.2, -6.42, -Math.PI / 2);
    // Guest Suite Rear Window
    createArchitecturalWindow(2.4, 1.4, -4.15, 1.6, -6.42, -Math.PI / 2);

    this.buildVillaEntryDoor(H);
  }

  buildDuplexBadges() {
    this.createRoomBadge('GRAND FOYER', '🚪', -4.6, 4.8, 'foyer');
    this.createRoomBadge('DOUBLE-HEIGHT LIVING', '🛋️', -0.5, 3.7, 'living');
    this.createRoomBadge('FORMAL DINING', '🍽️', 4.35, 4.1, 'dining');
    this.createRoomBadge('GOURMET KITCHEN', '🍳', 4.35, -0.5, 'kitchen');
    this.createRoomBadge('GUEST SUITE (GROUND)', '🛏️', -4.15, -3.5, 'bedroom');
    this.createRoomBadge('GUEST BATHROOM', '🚿', -0.5, -3.0, 'common_bath');
    this.createRoomBadge('FLOATING STAIRS', '🪜', 1.0, 3.5, 'staircase');
    this.createRoomBadge('MEZZANINE (LVL 2)', '✨', 1.4, 3.2, 'mezzanine');
    this.createRoomBadge('MASTER PENTHOUSE (LVL 2)', '👑', 4.35, 0.0, 'bedroom2');
    this.createRoomBadge('MASTER SPA BATH (LVL 2)', '🛁', 4.35, -4.5, 'master_bath');
    this.createRoomBadge('UPPER SKY LOUNGE (LVL 2)', '🌆', -3.5, -2.75, 'sky_lounge');
    this.createRoomBadge('TERRACE DECK', '🌿', 4.35, 7.4, 'terrace');
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

    if (roomType === 'complete_house' || roomType === 'complete_house_2bhk' || roomType === 'villa_2bhk' || roomType === 'complete_house_3bhk' || roomType === '3bhk' || roomType === 'duplex' || roomType === 'duplex_villa' || roomType === 'whole_house' || roomType === 'house') {
      const isDuplex = (roomType === 'duplex' || roomType === 'duplex_villa' || pref.houseType === 'duplex' || pref.houseType === 'duplex_villa');
      const is3BHK = (roomType === 'complete_house_3bhk' || roomType === '3bhk' || pref.houseType === '3bhk' || pref.houseType === 'complete_house_3bhk');
      const isVilla = (roomType === 'villa_2bhk' || roomType === 'complete_house_2bhk' || pref.houseType === 'villa_2bhk' || pref.houseType === 'villa' || pref.houseType === '2bhk');
      const is2BHK = isVilla;

      if (isDuplex) {
        concept = `MODERN DUPLEX VILLA WITH DOUBLE-HEIGHT LIVING & MEZZANINE (${style.toUpperCase()})`;
        spatialRationale = `A prestigious multi-level architectural Duplex Villa featuring a dramatic 5.6m double-height Grand Living Lounge with monumental floor-to-ceiling glass, an architectural floating cantilevered staircase with solid oak steps and tempered glass railings, an open-concept formal dining room and gourmet kitchen with waterfall island and counter bar stools, a private ground-level guest bedroom suite with dedicated guest bathroom, a sunken outdoor terrace pool deck, and an upper mezzanine level featuring an elevated walkway gallery overlooking the living room below, a penthouse master suite with private views, a luxury spa master bathroom, and an upper loft sky lounge and executive study.`;
        lightingPlan = `Dramatic multi-tier architectural illumination: grand multi-ring celestial pendant chandelier suspended through the 5.6m double-height living void, under-step LED glow channels along the floating staircase, recessed mezzanine ceiling washes, illuminated anti-fog mirrors in all bathrooms, and under-cabinet warm 3000K kitchen task lighting.`;

        // ==========================================
        // DUPLEX: 1. GRAND ENTRANCE FOYER (GROUND)
        // ==========================================
        items.push({
          id: 'duplex_foyer_console',
          type: 'foyer_console',
          name: 'Grand Foyer Fluted Marble Console Table',
          position: [-4.6, 0, 3.5],
          rotation: [0, 0, 0],
          room: 'foyer',
          cost: 620
        });
        items.push({
          id: 'duplex_foyer_plant',
          type: 'plant',
          name: 'Grand Foyer Architectural Fiddle Leaf Fig',
          position: [-3.6, 0, 5.8],
          rotation: [0, 0, 0],
          room: 'foyer',
          cost: 180
        });
        items.push({
          id: 'duplex_foyer_rug',
          type: 'rug',
          name: 'Grand Foyer Geometric Welcome Runner',
          position: [-4.6, 0.005, 4.8],
          rotation: [0, 0, 0],
          dimensions: [2.0, 1.4],
          style: style,
          room: 'foyer',
          cost: 240
        });

        // ==========================================
        // DUPLEX: 2. DOUBLE-HEIGHT LIVING LOUNGE (GROUND)
        // ==========================================
        items.push({
          id: 'duplex_living_tv_unit',
          type: 'missouri_tv_unit',
          name: 'Missouri Engineered Wood TV Unit with Slat Accents',
          position: [-3.0, 0, 3.7],
          rotation: [0, Math.PI / 2, 0],
          style: style,
          room: 'living',
          cost: 1550
        });
        items.push({
          id: 'duplex_living_sofa',
          type: 'sofa',
          name: 'Luxury Modular Deep Lounge Sectional Sofa',
          position: [0.2, 0, 3.7],
          rotation: [0, -Math.PI / 2, 0],
          style: style,
          color: palette.sofaColor,
          room: 'living',
          cost: 1850
        });
        items.push({
          id: 'duplex_living_coffee_table',
          type: 'coffee_table',
          name: 'Sculptural Marble & Smoked Glass Coffee Table',
          position: [-1.2, 0, 3.7],
          rotation: [0, 0, 0],
          style: style,
          woodColor: palette.woodColor,
          room: 'living',
          cost: 520
        });
        items.push({
          id: 'duplex_living_rug',
          type: 'rug',
          name: 'Double-Height Living Large Plush Area Rug',
          position: [-0.8, 0.005, 3.7],
          rotation: [0, 0, 0],
          dimensions: [3.8, 3.0],
          style: style,
          room: 'living',
          cost: 480
        });
        items.push({
          id: 'duplex_living_armchair',
          type: 'armchair',
          name: 'Designer Swivel Accent Armchair',
          position: [-0.5, 0, 1.6],
          rotation: [0, Math.PI, 0],
          style: style,
          room: 'living',
          cost: 410
        });
        items.push({
          id: 'duplex_living_lamp',
          type: 'floor_lamp',
          name: 'Curved Brass Architectural Floor Lamp',
          position: [-2.6, 0, 5.8],
          rotation: [0, 0, 0],
          style: style,
          room: 'living',
          cost: 320
        });

        // ==========================================
        // DUPLEX: 3. FORMAL DINING ROOM (GROUND)
        // ==========================================
        items.push({
          id: 'duplex_dining_table',
          type: 'dining_set',
          name: 'Solid Walnut Dining Table with 6 Velvet Chairs',
          position: [4.35, 0, 4.1],
          rotation: [0, 0, 0],
          style: style,
          woodColor: palette.woodColor,
          room: 'dining',
          cost: 1800
        });
        items.push({
          id: 'duplex_dining_credenza',
          type: 'credenza',
          name: 'Modern Fluted Buffet Credenza',
          position: [6.2, 0, 4.1],
          rotation: [0, -Math.PI / 2, 0],
          style: style,
          woodColor: palette.woodColor,
          room: 'dining',
          cost: 720
        });

        // ==========================================
        // DUPLEX: 4. GOURMET MODULAR KITCHEN (GROUND)
        // ==========================================
        items.push({
          id: 'duplex_kitchen_main',
          type: 'kitchen_counter',
          name: 'Gourmet Kitchen Quartz Counter & Under-Mount Sink',
          position: [4.35, 0, -2.4],
          rotation: [0, 0, 0],
          room: 'kitchen',
          cost: 2100
        });
        items.push({
          id: 'duplex_kitchen_island',
          type: 'kitchen_island',
          name: 'Calacatta Marble Waterfall Island & Induction Cooktop',
          position: [4.35, 0, -0.2],
          rotation: [0, 0, 0],
          room: 'kitchen',
          cost: 1650
        });
        items.push({
          id: 'duplex_kitchen_stools',
          type: 'bar_stool',
          name: 'Contemporary Velvet Bar Stools (Trio)',
          position: [4.35, 0, 0.8],
          rotation: [0, 0, 0],
          room: 'kitchen',
          cost: 390
        });
        items.push({
          id: 'duplex_kitchen_fridge',
          type: 'refrigerator',
          name: 'French Door Smart Stainless Refrigerator',
          position: [6.1, 0, -2.3],
          rotation: [0, -Math.PI / 2, 0],
          room: 'kitchen',
          cost: 1400
        });

        // ==========================================
        // DUPLEX: 5. GROUND GUEST BEDROOM SUITE
        // ==========================================
        items.push({
          id: 'duplex_guest_bed',
          type: 'bed',
          name: 'Guest Suite Upholstered Queen Bed',
          position: [-4.15, 0, -5.5],
          rotation: [0, 0, 0],
          style: style,
          room: 'bedroom',
          cost: 1100
        });
        items.push({
          id: 'duplex_guest_nightstand',
          type: 'nightstand',
          name: 'Floating Bedside Nightstand',
          position: [-5.6, 0, -5.5],
          rotation: [0, 0, 0],
          style: style,
          room: 'bedroom',
          cost: 220
        });
        items.push({
          id: 'duplex_guest_wardrobe',
          type: 'walk_in_wardrobe',
          name: 'Built-In Sliding Mirror Wardrobe',
          position: [-6.2, 0, -3.5],
          rotation: [0, Math.PI / 2, 0],
          style: style,
          room: 'bedroom',
          cost: 1200
        });
        items.push({
          id: 'duplex_guest_rug',
          type: 'rug',
          name: 'Guest Bedroom Plush Wool Rug',
          position: [-4.15, 0.005, -3.5],
          rotation: [0, 0, 0],
          dimensions: [2.6, 2.0],
          style: style,
          room: 'bedroom',
          cost: 290
        });

        // ==========================================
        // DUPLEX: 6. GROUND GUEST BATHROOM
        // ==========================================
        items.push({
          id: 'duplex_guest_shower',
          type: 'shower',
          name: 'Ground Bath Frameless Glass Shower',
          position: [-1.4, 0, -3.8],
          rotation: [0, 0, 0],
          room: 'common_bath',
          cost: 620
        });
        items.push({
          id: 'duplex_guest_vanity',
          type: 'bathroom_vanity',
          name: 'Floating Vanity with Lighted LED Mirror',
          position: [-0.5, 0, -1.8],
          rotation: [0, Math.PI, 0],
          room: 'common_bath',
          cost: 510
        });
        items.push({
          id: 'duplex_guest_toilet',
          type: 'toilet',
          name: 'Modern Wall-Hung Ceramic Toilet',
          position: [0.3, 0, -3.8],
          rotation: [0, 0, 0],
          room: 'common_bath',
          cost: 310
        });

        // ==========================================
        // DUPLEX: 7. OUTDOOR SUNKEN TERRACE & DECK
        // ==========================================
        items.push({
          id: 'duplex_terrace_loungers',
          type: 'armchair',
          name: 'Teak Wood Outdoor Sun Lounger Pair',
          position: [4.35, 0, 7.4],
          rotation: [0, Math.PI, 0],
          room: 'terrace',
          cost: 450
        });
        items.push({
          id: 'duplex_terrace_plant',
          type: 'plant',
          name: 'Terrace Architectural Bird of Paradise',
          position: [6.1, 0, 7.4],
          rotation: [0, 0, 0],
          room: 'terrace',
          cost: 190
        });

        // ==========================================
        // DUPLEX: 8. UPPER PENTHOUSE MASTER SUITE (LEVEL 2, Y = 2.8)
        // ==========================================
        items.push({
          id: 'duplex_master_bed',
          type: 'bed',
          name: 'Penthouse Master Platform King Bed',
          position: [4.35, 2.8, -2.3],
          rotation: [0, 0, 0],
          style: style,
          room: 'bedroom2',
          cost: 1950
        });
        items.push({
          id: 'duplex_master_nightstand_l',
          type: 'nightstand',
          name: 'Designer Nightstand (Left)',
          position: [2.8, 2.8, -2.3],
          rotation: [0, 0, 0],
          style: style,
          room: 'bedroom2',
          cost: 260
        });
        items.push({
          id: 'duplex_master_nightstand_r',
          type: 'nightstand',
          name: 'Designer Nightstand (Right)',
          position: [5.9, 2.8, -2.3],
          rotation: [0, 0, 0],
          style: style,
          room: 'bedroom2',
          cost: 260
        });
        items.push({
          id: 'duplex_master_wardrobe',
          type: 'walk_in_wardrobe',
          name: 'Penthouse Full-Span Glass Dressing Wardrobe',
          position: [6.1, 2.8, 0.5],
          rotation: [0, -Math.PI / 2, 0],
          style: style,
          room: 'bedroom2',
          cost: 1800
        });
        items.push({
          id: 'duplex_master_rug',
          type: 'rug',
          name: 'Penthouse Master Plush Silk & Wool Rug',
          position: [4.35, 2.805, -0.8],
          rotation: [0, 0, 0],
          dimensions: [3.4, 2.6],
          style: style,
          room: 'bedroom2',
          cost: 440
        });

        // ==========================================
        // DUPLEX: 9. UPPER MASTER SPA BATHROOM (LEVEL 2, Y = 2.8)
        // ==========================================
        items.push({
          id: 'duplex_spa_shower',
          type: 'shower',
          name: 'Master Spa Double Glass Rain Shower',
          position: [5.8, 2.8, -5.4],
          rotation: [0, 0, 0],
          room: 'master_bath',
          cost: 850
        });
        items.push({
          id: 'duplex_spa_vanity',
          type: 'bathroom_vanity',
          name: 'Master Spa Dual Basin Floating Vanity',
          position: [3.2, 2.8, -3.3],
          rotation: [0, Math.PI, 0],
          room: 'master_bath',
          cost: 680
        });
        items.push({
          id: 'duplex_spa_toilet',
          type: 'toilet',
          name: 'Smart Bidet Master Ceramic Toilet',
          position: [5.5, 2.8, -3.3],
          rotation: [0, Math.PI, 0],
          room: 'master_bath',
          cost: 420
        });

        // ==========================================
        // DUPLEX: 10. UPPER LOFT SKY LOUNGE & STUDY (LEVEL 2, Y = 2.8)
        // ==========================================
        items.push({
          id: 'duplex_sky_sofa',
          type: 'sofa',
          name: 'Sky Lounge Low-Profile Velvet Sofa',
          position: [-3.5, 2.8, -4.5],
          rotation: [0, 0, 0],
          style: style,
          color: palette.sofaColor,
          room: 'sky_lounge',
          cost: 1200
        });
        items.push({
          id: 'duplex_sky_coffee_table',
          type: 'coffee_table',
          name: 'Sky Lounge Minimalist Oak Coffee Table',
          position: [-3.5, 2.8, -3.2],
          rotation: [0, 0, 0],
          style: style,
          room: 'sky_lounge',
          cost: 340
        });
        items.push({
          id: 'duplex_sky_desk',
          type: 'desk',
          name: 'Executive Mezzanine Workstation Desk',
          position: [-6.0, 2.8, -1.5],
          rotation: [0, Math.PI / 2, 0],
          style: style,
          room: 'sky_lounge',
          cost: 650
        });
        items.push({
          id: 'duplex_sky_bookshelf',
          type: 'bookshelf',
          name: 'Sky Lounge Architectural Library Bookshelf',
          position: [-6.0, 2.8, -4.0],
          rotation: [0, Math.PI / 2, 0],
          style: style,
          room: 'sky_lounge',
          cost: 580
        });
        items.push({
          id: 'duplex_sky_rug',
          type: 'rug',
          name: 'Sky Lounge Geometric Low-Pile Rug',
          position: [-3.5, 2.805, -3.5],
          rotation: [0, 0, 0],
          dimensions: [3.2, 2.4],
          style: style,
          room: 'sky_lounge',
          cost: 360
        });

      } else if (is3BHK) {
        concept = `LUXURY 3 BHK RESIDENCE (10 CONNECTED SPACES & BALCONY) (${style.toUpperCase()})`;
        spatialRationale = `A prestigious 19m × 18.5m architectural 3 BHK layout master-engineered with flawless circular circulation flow. Features a welcoming Entrance Foyer with slatted teak divider screen, expansive Open Living Room Lounge with Missouri 4K TV backdrop and deep sectional sofa, interconnected Formal Dining Pavilion with 6-seater dining table & credenza, modern Modular Kitchen with quartz prep island and bar stools, private Master Bedroom Suite (Bed 1) with King bed, dressing vanity, walk-in wardrobe and en-suite designer bathroom, a peaceful Second Bedroom Suite (Bed 2) with Queen bed, study desk and wardrobe, an agile Third Bedroom Suite (Bed 3) tailored for kids or executive remote study, central designer Common Bathroom, and a front Private Balcony Deck with teak outdoor leisure seating.`;
        lightingPlan = `Harmonious 3000K multi-zone lighting scheme: soft living ambient coves, statement pendant dining chandelier, recessed under-cabinet LED task strips in kitchen, backlit bathroom mirrors, study task illumination, and exterior balcony warm downlights.`;

        // ==========================================
        // 3 BHK: 1. ENTRANCE FOYER
        // ==========================================
        items.push({
          id: 'threebhk_foyer_console',
          type: 'foyer_console',
          name: 'Entrance Foyer Console Table & Vanity Mirror',
          position: [-5.0, 0, 3.65],
          rotation: [0, 0, 0],
          room: 'foyer',
          cost: 510
        });
        items.push({
          id: 'threebhk_foyer_plant',
          type: 'plant',
          name: 'Entrance Foyer Potted Olive Tree',
          position: [-3.8, 0, 6.0],
          rotation: [0, 0, 0],
          room: 'foyer',
          cost: 170
        });
        items.push({
          id: 'threebhk_foyer_rug',
          type: 'rug',
          name: 'Entrance Foyer Welcome Runner',
          position: [-5.0, 0.005, 4.9],
          rotation: [0, 0, 0],
          dimensions: [2.0, 1.2],
          style: style,
          room: 'foyer',
          cost: 220
        });

        // ==========================================
        // 3 BHK: 2. LIVING ROOM LOUNGE
        // ==========================================
        items.push({
          id: 'threebhk_living_tv_unit',
          type: 'missouri_tv_unit',
          name: 'Missouri Engineered Wood TV Unit with Fluted Slat Backdrop',
          position: [-3.25, 0, 4.15],
          rotation: [0, Math.PI / 2, 0],
          style: style,
          room: 'living',
          cost: 1450
        });
        items.push({
          id: 'threebhk_living_sofa',
          type: 'sofa',
          name: 'Plush Ergonomic Living Lounge Sectional Sofa',
          position: [0.6, 0, 4.15],
          rotation: [0, -Math.PI / 2, 0],
          style: style,
          color: palette.sofaColor,
          room: 'living',
          cost: 1600
        });
        items.push({
          id: 'threebhk_living_coffee_table',
          type: 'coffee_table',
          name: 'Architectural Wood & Glass Coffee Table',
          position: [-1.2, 0, 4.15],
          rotation: [0, 0, 0],
          style: style,
          woodColor: palette.woodColor,
          room: 'living',
          cost: 450
        });
        items.push({
          id: 'threebhk_living_rug',
          type: 'rug',
          name: 'Living Room Plush Wool Area Rug',
          position: [-0.6, 0.005, 4.15],
          rotation: [0, 0, 0],
          dimensions: [3.6, 2.8],
          style: style,
          room: 'living',
          cost: 410
        });
        items.push({
          id: 'threebhk_living_armchair',
          type: 'armchair',
          name: 'Scandinavian Accent Armchair',
          position: [-0.5, 0, 2.4],
          rotation: [0, Math.PI, 0],
          style: style,
          room: 'living',
          cost: 380
        });
        items.push({
          id: 'threebhk_living_lamp',
          type: 'floor_lamp',
          name: 'Sculptural Brass Arc Floor Lamp',
          position: [1.8, 0, 5.8],
          rotation: [0, 0, 0],
          style: style,
          room: 'living',
          cost: 290
        });

        // ==========================================
        // 3 BHK: 3. DINING PAVILION
        // ==========================================
        items.push({
          id: 'threebhk_dining_table',
          type: 'dining_set',
          name: 'Solid Hardwood Dining Table & 6 Designer Chairs',
          position: [5.0, 0, 4.15],
          rotation: [0, 0, 0],
          style: style,
          woodColor: palette.woodColor,
          room: 'dining',
          cost: 1550
        });
        items.push({
          id: 'threebhk_dining_credenza',
          type: 'credenza',
          name: 'Dining Buffet Credenza & Crockery Cabinet',
          position: [7.2, 0, 4.15],
          rotation: [0, -Math.PI / 2, 0],
          style: style,
          woodColor: palette.woodColor,
          room: 'dining',
          cost: 650
        });
        items.push({
          id: 'threebhk_dining_plant',
          type: 'plant',
          name: 'Dining Room Potted Palm Plant',
          position: [2.8, 0, 5.8],
          rotation: [0, 0, 0],
          room: 'dining',
          cost: 150
        });

        // ==========================================
        // 3 BHK: 4. MODULAR KITCHEN & BREAKFAST ISLAND
        // ==========================================
        items.push({
          id: 'threebhk_kitchen_main',
          type: 'kitchen_counter',
          name: 'Modular Kitchen Cabinets & Counter with Double Sink',
          position: [5.0, 0, -2.2],
          rotation: [0, 0, 0],
          room: 'kitchen',
          cost: 1950
        });
        items.push({
          id: 'threebhk_kitchen_island',
          type: 'kitchen_island',
          name: 'Quartz Countertop Prep Island & Induction Range',
          position: [5.0, 0, 0.2],
          rotation: [0, 0, 0],
          room: 'kitchen',
          cost: 1450
        });
        items.push({
          id: 'threebhk_kitchen_stools',
          type: 'bar_stool',
          name: 'Counter-Height Bar Stools (Trio)',
          position: [5.0, 0, 1.2],
          rotation: [0, 0, 0],
          room: 'kitchen',
          cost: 360
        });
        items.push({
          id: 'threebhk_kitchen_fridge',
          type: 'refrigerator',
          name: 'Smart French-Door Refrigerator',
          position: [7.1, 0, -2.1],
          rotation: [0, -Math.PI / 2, 0],
          room: 'kitchen',
          cost: 1350
        });

        // ==========================================
        // 3 BHK: 5. MASTER BEDROOM SUITE (BED 1)
        // ==========================================
        items.push({
          id: 'threebhk_master_bed',
          type: 'bed',
          name: 'Master Suite Luxury King Platform Bed',
          position: [5.0, 0, -7.1],
          rotation: [0, 0, 0],
          style: style,
          room: 'bedroom',
          cost: 1750
        });
        items.push({
          id: 'threebhk_master_nightstand_l',
          type: 'nightstand',
          name: 'Master Nightstand (Left)',
          position: [3.3, 0, -7.1],
          rotation: [0, 0, 0],
          style: style,
          room: 'bedroom',
          cost: 240
        });
        items.push({
          id: 'threebhk_master_nightstand_r',
          type: 'nightstand',
          name: 'Master Nightstand (Right)',
          position: [6.7, 0, -7.1],
          rotation: [0, 0, 0],
          style: style,
          room: 'bedroom',
          cost: 240
        });
        items.push({
          id: 'threebhk_master_wardrobe',
          type: 'walk_in_wardrobe',
          name: 'Master Built-In Mirrored Wardrobe System',
          position: [2.8, 0, -5.25],
          rotation: [0, Math.PI / 2, 0],
          style: style,
          room: 'bedroom',
          cost: 1600
        });
        items.push({
          id: 'threebhk_master_vanity',
          type: 'bathroom_vanity',
          name: 'Master Dressing Vanity Console & Mirror',
          position: [7.2, 0, -5.25],
          rotation: [0, -Math.PI / 2, 0],
          style: style,
          room: 'bedroom',
          cost: 590
        });
        items.push({
          id: 'threebhk_master_rug',
          type: 'rug',
          name: 'Master Bedroom Plush Wool Rug',
          position: [5.0, 0.005, -5.4],
          rotation: [0, 0, 0],
          dimensions: [3.4, 2.6],
          style: style,
          room: 'bedroom',
          cost: 420
        });

        // ==========================================
        // 3 BHK: 6. MASTER EN-SUITE BATHROOM
        // ==========================================
        items.push({
          id: 'threebhk_master_shower',
          type: 'shower',
          name: 'Master En-Suite Frameless Glass Rain Shower',
          position: [6.9, 0, -2.0],
          rotation: [0, -Math.PI / 2, 0],
          room: 'master_bath',
          cost: 720
        });
        items.push({
          id: 'threebhk_master_vanity_bath',
          type: 'bathroom_vanity',
          name: 'Master Floating Basin Vanity with LED Mirror',
          position: [5.6, 0, -0.4],
          rotation: [0, Math.PI, 0],
          room: 'master_bath',
          cost: 560
        });
        items.push({
          id: 'threebhk_master_toilet',
          type: 'toilet',
          name: 'Master Wall-Hung Smart Ceramic Toilet',
          position: [7.0, 0, -0.4],
          rotation: [0, Math.PI, 0],
          room: 'master_bath',
          cost: 340
        });

        // ==========================================
        // 3 BHK: 7. SECOND BEDROOM SUITE (BED 2)
        // ==========================================
        items.push({
          id: 'threebhk_bed2_bed',
          type: 'bed',
          name: 'Second Bedroom Queen Upholstered Bed',
          position: [-5.0, 0, -7.1],
          rotation: [0, 0, 0],
          style: style,
          room: 'bedroom2',
          cost: 1250
        });
        items.push({
          id: 'threebhk_bed2_nightstand_l',
          type: 'nightstand',
          name: 'Nightstand Left',
          position: [-6.4, 0, -7.1],
          rotation: [0, 0, 0],
          style: style,
          room: 'bedroom2',
          cost: 210
        });
        items.push({
          id: 'threebhk_bed2_nightstand_r',
          type: 'nightstand',
          name: 'Nightstand Right',
          position: [-3.6, 0, -7.1],
          rotation: [0, 0, 0],
          style: style,
          room: 'bedroom2',
          cost: 210
        });
        items.push({
          id: 'threebhk_bed2_wardrobe',
          type: 'walk_in_wardrobe',
          name: 'Sliding Wardrobe System',
          position: [-7.2, 0, -5.25],
          rotation: [0, Math.PI / 2, 0],
          style: style,
          room: 'bedroom2',
          cost: 1100
        });
        items.push({
          id: 'threebhk_bed2_desk',
          type: 'desk',
          name: 'Study Workstation & Chair',
          position: [-3.8, 0, -3.2],
          rotation: [0, Math.PI, 0],
          style: style,
          room: 'bedroom2',
          cost: 490
        });
        items.push({
          id: 'threebhk_bed2_rug',
          type: 'rug',
          name: 'Bed 2 Cozy Wool Rug',
          position: [-5.0, 0.005, -5.5],
          rotation: [0, 0, 0],
          dimensions: [2.8, 2.2],
          style: style,
          room: 'bedroom2',
          cost: 320
        });

        // ==========================================
        // 3 BHK: 8. THIRD BEDROOM / KIDS / STUDY (BED 3)
        // ==========================================
        items.push({
          id: 'threebhk_bed3_bed',
          type: 'bed',
          name: 'Bed 3 Contemporary Daybed Suite',
          position: [-5.5, 0, -2.0],
          rotation: [0, 0, 0],
          style: style,
          room: 'bedroom3',
          cost: 950
        });
        items.push({
          id: 'threebhk_bed3_desk',
          type: 'desk',
          name: 'Ergonomic Executive Study Desk & Task Chair',
          position: [-7.1, 0, -0.35],
          rotation: [0, Math.PI / 2, 0],
          style: style,
          room: 'bedroom3',
          cost: 540
        });
        items.push({
          id: 'threebhk_bed3_bookshelf',
          type: 'bookshelf',
          name: 'Study Bookshelf & Display Storage',
          position: [-7.1, 0, 1.2],
          rotation: [0, Math.PI / 2, 0],
          style: style,
          room: 'bedroom3',
          cost: 420
        });
        items.push({
          id: 'threebhk_bed3_wardrobe',
          type: 'walk_in_wardrobe',
          name: 'Double Wardrobe Closet',
          position: [-3.8, 0, -0.35],
          rotation: [0, -Math.PI / 2, 0],
          style: style,
          room: 'bedroom3',
          cost: 980
        });
        items.push({
          id: 'threebhk_bed3_rug',
          type: 'rug',
          name: 'Study Low-Pile Pattern Rug',
          position: [-5.5, 0.005, -0.35],
          rotation: [0, 0, 0],
          dimensions: [2.4, 1.8],
          style: style,
          room: 'bedroom3',
          cost: 260
        });

        // ==========================================
        // 3 BHK: 9. COMMON FAMILY BATHROOM
        // ==========================================
        items.push({
          id: 'threebhk_common_shower',
          type: 'shower',
          name: 'Common Bath Walk-In Shower',
          position: [-3.0, 0, -2.1],
          rotation: [0, 0, 0],
          room: 'common_bath',
          cost: 580
        });
        items.push({
          id: 'threebhk_common_vanity',
          type: 'bathroom_vanity',
          name: 'Common Bath Vanity & Mirror',
          position: [-1.5, 0, -0.4],
          rotation: [0, Math.PI, 0],
          room: 'common_bath',
          cost: 480
        });
        items.push({
          id: 'threebhk_common_toilet',
          type: 'toilet',
          name: 'Wall-Hung Ceramic Toilet',
          position: [-2.5, 0, -0.4],
          rotation: [0, Math.PI, 0],
          room: 'common_bath',
          cost: 290
        });

        // ==========================================
        // 3 BHK: 10. FRONT BALCONY DECK
        // ==========================================
        items.push({
          id: 'threebhk_balcony_chair1',
          type: 'armchair',
          name: 'Outdoor Teak & Rope Lounge Armchair',
          position: [-1.4, 0, 7.45],
          rotation: [0, Math.PI / 2, 0],
          room: 'balcony',
          cost: 310
        });
        items.push({
          id: 'threebhk_balcony_chair2',
          type: 'armchair',
          name: 'Outdoor Teak & Rope Lounge Armchair',
          position: [0.4, 0, 7.45],
          rotation: [0, -Math.PI / 2, 0],
          room: 'balcony',
          cost: 310
        });
        items.push({
          id: 'threebhk_balcony_table',
          type: 'coffee_table',
          name: 'Outdoor Terrazzo Bistro Table',
          position: [-0.5, 0, 7.45],
          rotation: [0, 0, 0],
          room: 'balcony',
          cost: 240
        });
        items.push({
          id: 'threebhk_balcony_planter1',
          type: 'plant',
          name: 'Balcony Architectural Planter Box',
          position: [-3.1, 0, 7.45],
          rotation: [0, 0, 0],
          room: 'balcony',
          cost: 140
        });
        items.push({
          id: 'threebhk_balcony_planter2',
          type: 'plant',
          name: 'Balcony Architectural Planter Box',
          position: [2.1, 0, 7.45],
          rotation: [0, 0, 0],
          room: 'balcony',
          cost: 140
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

  // 5. App Coordinator
// AI Interior Studio - Application Coordinator

class App {
  constructor() {
    // Authentication Guard & Guest Auto-Init
    try {
      const stored = localStorage.getItem('ai_interior_user');
      if (!stored) {
        const guestUser = {
          id: 'guest_' + Date.now(),
          name: 'Guest Designer',
          email: 'guest@aiinterior.local',
          role: 'user',
          loginTime: new Date().toISOString()
        };
        localStorage.setItem('ai_interior_user', JSON.stringify(guestUser));
      }
    } catch (e) {
      console.warn('LocalStorage unavailable in current environment:', e);
    }

    this.canvas = document.getElementById('canvas3d');
    if (!this.canvas) return;
    window.appInstance = this;
    this.furnitureGroup = new THREE.Group();
    this.furnitureGroup.name = 'FurnitureGroup';
    this.furnitureList = [];
    this.selectedRoot = null;
    this.selectedPart = null;
    this.selectedTarget = null;
    this.selectedObject = null;
    this.editMode = 'whole'; // 'whole' | 'part'
    this.isDragging = false;
    this.dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    this.dragOffset = new THREE.Vector3();
    this.isDaylight = true;
    this.currentStyle = 'modern';
    this.geminiApiKey = localStorage.getItem('ai_interior_gemini_key') || '';
    this.isWalkthrough = false;
    this.keysDown = {};
    this.currentRoomDimensions = { width: 5.0, length: 4.5, height: 2.8 };

    // Complete House Multi-Room Navigation & State
    this.currentHouseZone = 'all';
    this.currentHouseType = '1bhk'; // '1bhk' (Single Bedroom House) or '2bhk' (Double Bedroom House)
    this.currentHouseRoomTypes = { living: 1, dining: 1, kitchen: 1, bedroom: 1, dressing: 1 };
    this.cameraAnimation = null;

    // Sun Study & Solar Daylighting Simulation State
    this.currentSunHour = 10.0;
    // Laser Tape Measurement State
    this.isMeasuring = false;
    this.measureStartPoint = null;
    this.measureMarkers = [];
    this.measureLines = [];
    this.measureSprites = [];
    this.tempMeasureLine = null;
    // Room Area Schedule State
    this.scheduleUnit = 'metric';
    this.show3DAreaBadges = false;

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

    // Bounding Box Selection Highlight Helper
    this.selectionHelper = new THREE.BoxHelper(new THREE.Mesh(), 0x38bdf8);
    this.selectionHelper.name = 'SelectionBox';
    this.selectionHelper.material.depthTest = false;
    this.selectionHelper.material.transparent = true;
    this.selectionHelper.material.opacity = 0.9;
    this.selectionHelper.visible = false;
    this.scene.add(this.selectionHelper);

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
    // Ambient light - warm balanced illumination
    this.ambientLight = new THREE.AmbientLight(0xfff6ec, 0.65);
    this.scene.add(this.ambientLight);

    // Sun / Natural Morning Directional Light with full-villa shadow coverage
    this.sunLight = new THREE.DirectionalLight(0xfffaed, 1.25);
    this.sunLight.position.set(-12, 16, 10);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 0.5;
    this.sunLight.shadow.camera.far = 42;
    this.sunLight.shadow.camera.left = -16;
    this.sunLight.shadow.camera.right = 16;
    this.sunLight.shadow.camera.top = 16;
    this.sunLight.shadow.camera.bottom = -16;
    this.sunLight.shadow.bias = -0.0003;
    this.scene.add(this.sunLight);

    // Soft ceiling fill light
    this.ceilingLight = new THREE.PointLight(0xfff7ed, 0.6, 25, 1.5);
    this.ceilingLight.position.set(0, 2.7, 0);
    this.scene.add(this.ceilingLight);
  }

  // 3. ROOM BUILDER INITIALIZATION
  initRoom() {
    this.roomBuilder = new RoomBuilder(this.scene);
  }

  // 4. RAYCASTING, 3D MOUSE DRAGGING & SELECTION
  initRaycasting() {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.canvas.addEventListener('pointerdown', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      this.raycaster.setFromCamera(this.mouse, this.camera);

      // In Laser Measurement mode, route click to laser tape logic
      if (this.isMeasuring) {
        this.handleMeasureClick(e);
        return;
      }

      // In walkthrough mode, clicking door opens/shuts it
      if (this.isWalkthrough) {
        if (this.roomBuilder.doorGroup) {
          const doorHits = this.raycaster.intersectObjects([this.roomBuilder.doorGroup], true);
          if (doorHits.length > 0) {
            const currentSwing = this.roomBuilder.doorConfig.openAngle || 0;
            const nextSwing = currentSwing > 15 ? 0 : 80;
            this.roomBuilder.setDoorSwing(nextSwing);
            const swingSlider = document.getElementById('door-swing-slider');
            if (swingSlider) swingSlider.value = nextSwing;
            const swingVal = document.getElementById('door-swing-val');
            if (swingVal) swingVal.textContent = `${nextSwing}°`;
            const doorPill = document.getElementById('door-status-pill');
            if (doorPill) {
              doorPill.textContent = nextSwing === 0 ? '🔒 Closed (0°)' : (nextSwing >= 75 ? `✨ Open (${nextSwing}°)` : `🚪 Ajar (${nextSwing}°)`);
            }
            this.showToast(nextSwing > 0 ? `✨ Entry Door opened (${nextSwing}°)` : '🔒 Entry Door closed (0°)');
          }
        }
        return;
      }

      const interactiveTargets = [
        ...this.furnitureGroup.children,
        ...(this.roomBuilder.windowGroup ? [this.roomBuilder.windowGroup] : []),
        ...(this.roomBuilder.doorGroup ? [this.roomBuilder.doorGroup] : []),
        ...(this.roomBuilder.roomBadges || [])
      ];
      const intersects = this.raycaster.intersectObjects(interactiveTargets, true);

      if (intersects.length > 0) {
        const clickedMesh = intersects[0].object;

        // Check if clicked 3D Room Badge
        if (clickedMesh.userData && clickedMesh.userData.isRoomBadge) {
          this.focusRoom(clickedMesh.userData.roomZone);
          return;
        }

        // Check if clicked an architectural element (Window or Door)
        let isArch = null;
        let pCheck = clickedMesh;
        while (pCheck) {
          if (pCheck === this.roomBuilder.windowGroup) { isArch = 'window'; break; }
          if (pCheck === this.roomBuilder.doorGroup) { isArch = 'door'; break; }
          pCheck = pCheck.parent;
        }

        if (isArch === 'window') {
          this.deselectObject();
          this.showToast('🪟 Picture Window selected - Adjust placement in Setup');
          document.querySelector('[data-tab="tab-setup"]')?.click();
          document.getElementById('card-door-window')?.scrollIntoView({ behavior: 'smooth' });
          return;
        }

        if (isArch === 'door') {
          this.deselectObject();
          const currentSwing = this.roomBuilder.doorConfig.openAngle || 0;
          const nextSwing = currentSwing > 15 ? 0 : 80;
          this.roomBuilder.setDoorSwing(nextSwing);
          const swingSlider = document.getElementById('door-swing-slider');
          if (swingSlider) swingSlider.value = nextSwing;
          const swingVal = document.getElementById('door-swing-val');
          if (swingVal) swingVal.textContent = `${nextSwing}°`;
          const doorPill = document.getElementById('door-status-pill');
          if (doorPill) {
            doorPill.textContent = nextSwing === 0 ? '🔒 Closed (0°)' : (nextSwing >= 75 ? `✨ Open (${nextSwing}°)` : `🚪 Ajar (${nextSwing}°)`);
          }
          this.showToast(nextSwing > 0 ? `✨ Entry Door opened (${nextSwing}°)` : '🔒 Entry Door closed (0°)');
          document.querySelector('[data-tab="tab-setup"]')?.click();
          document.getElementById('card-door-window')?.scrollIntoView({ behavior: 'smooth' });
          return;
        }

        let rootObj = clickedMesh;
        let chairSubGroup = null;
        let curr = clickedMesh;

        // Climb up the hierarchy to find the root furniture item or nested chair/stool group
        while (curr.parent && curr.parent !== this.furnitureGroup) {
          if (curr.type === 'Group' && (curr.userData?.type === 'dining_chair' || curr.userData?.type === 'office_chair' || curr.userData?.type === 'bar_stool' || (curr.name && (curr.name.toLowerCase().includes('chair') || curr.name.toLowerCase().includes('stool')) && !curr.isMesh))) {
            chairSubGroup = curr;
          }
          curr = curr.parent;
        }
        rootObj = chairSubGroup || curr;

        this.selectTarget(rootObj, clickedMesh);

        // Initiate 3D Plane Dragging
        this.isDragging = true;
        this.controls.enabled = false;

        const targetWorldPos = new THREE.Vector3();
        this.selectedTarget.getWorldPosition(targetWorldPos);

        const isWallMounted = this.selectedRoot?.userData?.isWallMounted || this.selectedRoot?.userData?.type === 'wall_art';
        if (isWallMounted) {
          const rotY = this.selectedRoot.rotation.y;
          const isSideWall = Math.abs(Math.sin(rotY)) > 0.5;
          if (isSideWall) {
            this.dragPlane.set(new THREE.Vector3(1, 0, 0), -targetWorldPos.x);
          } else {
            this.dragPlane.set(new THREE.Vector3(0, 0, 1), -targetWorldPos.z);
          }
        } else {
          this.dragPlane.set(new THREE.Vector3(0, 1, 0), -targetWorldPos.y);
        }

        const planeIntersect = new THREE.Vector3();
        if (this.raycaster.ray.intersectPlane(this.dragPlane, planeIntersect)) {
          this.dragOffset.copy(planeIntersect).sub(targetWorldPos);
        }
      } else {
        // No furniture hit! Check if user clicked a wall to customize its color
        const wallTargets = [
          this.roomBuilder?.walls?.back,
          this.roomBuilder?.walls?.left,
          this.roomBuilder?.walls?.right
        ].filter(Boolean);

        const wallHits = this.raycaster.intersectObjects(wallTargets, false);
        if (wallHits.length > 0) {
          const clickedWall = wallHits[0].object;
          this.selectWall(clickedWall);
          return;
        }

        if (!this.isDragging) {
          this.deselectObject();
        }
      }
    });

    this.canvas.addEventListener('pointermove', (e) => {
      // In Laser Measurement mode, route hover move to live measurement preview
      if (this.isMeasuring) {
        this.handleMeasureMove(e);
        return;
      }

      if (!this.isDragging || !this.selectedTarget || this.isWalkthrough) return;

      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      const planeIntersect = new THREE.Vector3();

      if (this.raycaster.ray.intersectPlane(this.dragPlane, planeIntersect)) {
        const targetWorld = planeIntersect.sub(this.dragOffset);

        const isWallMounted = this.selectedRoot?.userData?.isWallMounted || this.selectedRoot?.userData?.type === 'wall_art';
        if (isWallMounted) {
          const roomW = this.currentRoomDimensions?.width || 5.0;
          const roomL = this.currentRoomDimensions?.length || 4.5;
          const roomH = this.currentRoomDimensions?.height || 2.8;
          const halfW = roomW / 2;
          const halfL = roomL / 2;

          const isSideWall = Math.abs(Math.sin(this.selectedRoot.rotation.y)) > 0.5;
          const isRightWall = this.selectedRoot.position.x > 0;

          // Height / Elevation clamp
          const clampedY = Math.max(0.6, Math.min(roomH - 0.4, targetWorld.y));
          this.selectedRoot.position.y = clampedY;

          if (isSideWall) {
            const clampedZ = Math.max(-halfL + 0.7, Math.min(halfL - 0.7, targetWorld.z));
            this.selectedRoot.position.z = clampedZ;
            this.selectedRoot.position.x = isRightWall ? (halfW - 0.04) : (-halfW + 0.04);
          } else {
            const clampedX = Math.max(-halfW + 0.7, Math.min(halfW - 0.7, targetWorld.x));
            this.selectedRoot.position.x = clampedX;
            this.selectedRoot.position.z = -halfL + 0.04;
          }
        } else if (this.editMode === 'whole' || this.selectedTarget === this.selectedRoot) {
          let posX = targetWorld.x;
          let posZ = targetWorld.z;
          if (this.selectedTarget.parent && this.selectedTarget.parent !== this.furnitureGroup && this.selectedTarget.parent !== this.scene) {
            const localPos = this.selectedTarget.parent.worldToLocal(targetWorld.clone());
            posX = localPos.x;
            posZ = localPos.z;
          }
          // Constrain within room bounds
          const halfW = (this.currentRoomDimensions?.width || 5.0) / 2 - 0.25;
          const halfL = (this.currentRoomDimensions?.length || 4.5) / 2 - 0.25;
          this.selectedTarget.position.x = Math.max(-halfW, Math.min(halfW, posX));
          this.selectedTarget.position.z = Math.max(-halfL, Math.min(halfL, posZ));
        } else {
          // Convert world pos to parent local coordinates for single part
          if (this.selectedTarget.parent) {
            const localPos = this.selectedTarget.parent.worldToLocal(targetWorld.clone());
            this.selectedTarget.position.x = localPos.x;
            this.selectedTarget.position.z = localPos.z;
          }
        }

        this.syncInspectorPosition();
        if (this.selectionHelper) this.selectionHelper.update();
      }
    });

    const stopDrag = () => {
      if (this.isDragging) {
        this.isDragging = false;
        if (!this.isWalkthrough) this.controls.enabled = true;
      }
    };

    this.canvas.addEventListener('pointerup', stopDrag);
    this.canvas.addEventListener('pointercancel', stopDrag);
  }

  // 4b. SELECTION COORDINATOR
  selectTarget(rootObj, clickedMesh) {
    if (this.selectedRoot !== rootObj) {
      this.editMode = 'whole';
    }
    this.selectedRoot = rootObj;
    this.selectedPart = clickedMesh;
    this.selectedObject = rootObj; // compatibility

    // Cache original local position on part for reset capability
    if (!clickedMesh.userData.origPos) {
      clickedMesh.userData.origPos = clickedMesh.position.clone();
    }

    this.updateTargetByMode();
  }

  updateTargetByMode() {
    if (!this.selectedRoot) return;

    this.selectedWall = null;
    this.selectedTarget = (this.editMode === 'part' && this.selectedPart) ? this.selectedPart : this.selectedRoot;
    this.selectedObject = this.selectedTarget;

    const popup = document.getElementById('inspector-popup');
    const title = document.getElementById('inspector-title');
    const subtitle = document.getElementById('inspector-subtitle');
    const btnPart = document.getElementById('btn-mode-part');
    const btnWhole = document.getElementById('btn-mode-whole');

    popup.style.display = 'flex';
    title.textContent = this.selectedRoot.name || 'Furniture Item';
    if (subtitle) {
      const partName = this.getPartName(this.selectedPart);
      subtitle.textContent = this.editMode === 'part'
        ? `Editing Part: ${partName}`
        : `Editing Entire: ${this.selectedRoot.name}`;
      subtitle.style.color = this.editMode === 'part' ? '#10b981' : '#6366f1';
    }

    if (btnPart) btnPart.classList.toggle('active', this.editMode === 'part');
    if (btnWhole) btnWhole.classList.toggle('active', this.editMode === 'whole');

    const modeToggle = document.getElementById('inspector-mode-toggle');
    const wallPanel = document.getElementById('inspector-wall-panel');
    const actions = document.getElementById('inspector-actions');
    const shortcutsTip = document.getElementById('inspector-shortcuts-tip');
    if (modeToggle) modeToggle.style.display = 'flex';
    if (wallPanel) wallPanel.style.display = 'none';
    if (actions) actions.style.display = 'grid';
    if (shortcutsTip) shortcutsTip.style.display = 'block';

    const isWallArt = this.selectedRoot?.userData?.type === 'wall_art';
    const wallartPanel = document.getElementById('inspector-wallart-panel');
    const stdControls = document.getElementById('inspector-standard-controls');
    if (wallartPanel && stdControls) {
      if (isWallArt) {
        wallartPanel.style.display = 'block';
        stdControls.style.display = 'none';
        this.syncWallArtInspector();
      } else {
        wallartPanel.style.display = 'none';
        stdControls.style.display = 'block';
      }
    }

    // Missouri TV Entertainment Unit Design Switcher Panel
    const isMissouriTV = this.selectedRoot?.userData?.type === 'missouri_tv_unit';
    const tvPanel = document.getElementById('inspector-tv-panel');
    if (tvPanel) {
      tvPanel.style.display = isMissouriTV ? 'block' : 'none';
      if (isMissouriTV) {
        const currentDesign = this.selectedRoot?.userData?.design || 1;
        const badge = document.getElementById('tv-design-badge');
        if (badge) badge.textContent = `Design ${currentDesign}`;
        document.querySelectorAll('.tv-design-btn').forEach(b => {
          b.classList.toggle('active', parseInt(b.dataset.design, 10) === currentDesign);
        });
      }
    }

    // Update 3D Selection Box
    if (this.selectionHelper) {
      this.selectionHelper.setFromObject(this.selectedTarget);
      this.selectionHelper.visible = true;
      this.selectionHelper.update();
    }

    this.syncInspectorPosition();
    this.syncInspectorColor();
  }

  getPartName(mesh) {
    if (!mesh) return 'Part';
    if (mesh.name && mesh.name !== 'Part' && mesh.name !== '') return mesh.name;
    if (mesh.geometry) {
      if (mesh.geometry.type === 'CylinderGeometry') return 'Leg / Pillar';
      if (mesh.geometry.type === 'SphereGeometry') return 'Bulb / Sphere';
      if (mesh.geometry.type === 'PlaneGeometry') return 'Surface / Cushion';
      if (mesh.geometry.type === 'BoxGeometry') {
        const p = mesh.geometry.parameters;
        if (p && p.height < 0.1 && p.width > 0.5) return 'Top / Base Panel';
        if (p && p.height > 0.4 && p.depth < 0.25) return 'Backrest / Door';
        return 'Cushion / Block';
      }
    }
    return 'Component';
  }

  syncInspectorPosition() {
    if (!this.selectedTarget) return;

    if (this.selectedRoot?.userData?.type === 'wall_art') {
      this.syncWallArtInspector();
    }

    const posX = document.getElementById('inspect-pos-x');
    const posY = document.getElementById('inspect-pos-y');
    const posZ = document.getElementById('inspect-pos-z');
    const valX = document.getElementById('val-pos-x');
    const valY = document.getElementById('val-pos-y');
    const valZ = document.getElementById('val-pos-z');

    const x = this.selectedTarget.position.x;
    const y = this.selectedTarget.position.y;
    const z = this.selectedTarget.position.z;

    if (posX) posX.value = x;
    if (posY) posY.value = y;
    if (posZ) posZ.value = z;

    if (valX) valX.textContent = `${x >= 0 ? '+' : ''}${x.toFixed(2)}m`;
    if (valY) valY.textContent = `${y >= 0 ? '+' : ''}${y.toFixed(2)}m`;
    if (valZ) valZ.textContent = `${z >= 0 ? '+' : ''}${z.toFixed(2)}m`;
  }

  syncInspectorColor() {
    if (!this.selectedTarget) return;
    const colorInput = document.getElementById('inspect-item-color');
    const colorHex = document.getElementById('inspect-item-color-hex');

    let hexStr = '#6366F1';
    let targetMesh = this.editMode === 'part' ? this.selectedPart : null;

    if (!targetMesh) {
      this.selectedRoot.traverse(child => {
        if (!targetMesh && child.isMesh && child.material && child.material.color && child.material.metalness < 0.7 && !child.material.map) {
          targetMesh = child;
        }
      });
    }

    if (targetMesh && targetMesh.material) {
      const mat = Array.isArray(targetMesh.material) ? targetMesh.material[0] : targetMesh.material;
      if (mat && mat.color) {
        hexStr = '#' + mat.color.getHexString().toUpperCase();
      }
    }

    if (colorInput) colorInput.value = hexStr.toLowerCase();
    if (colorHex) colorHex.textContent = hexStr.toUpperCase();

    // Update active state on quick swatches
    document.querySelectorAll('.quick-swatch').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.color.toUpperCase() === hexStr.toUpperCase());
    });
  }

  applyColorToTarget(hex) {
    if (!this.selectedTarget) return;
    const threeColor = new THREE.Color(hex);
    const colorInput = document.getElementById('inspect-item-color');
    const colorHex = document.getElementById('inspect-item-color-hex');

    if (colorInput) colorInput.value = hex.toLowerCase();
    if (colorHex) colorHex.textContent = hex.toUpperCase();

    document.querySelectorAll('.quick-swatch').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.color.toUpperCase() === hex.toUpperCase());
    });

    if (this.editMode === 'part' && this.selectedPart) {
      // Clone material so only THIS single part gets recolored
      if (this.selectedPart.material) {
        if (Array.isArray(this.selectedPart.material)) {
          this.selectedPart.material = this.selectedPart.material.map(m => m.clone());
          this.selectedPart.material.forEach(m => m.color.copy(threeColor));
        } else {
          this.selectedPart.material = this.selectedPart.material.clone();
          this.selectedPart.material.color.copy(threeColor);
        }
        this.selectedPart.userData.customColor = hex;
      }
      this.showToast(`Color changed: ${this.getPartName(this.selectedPart)} (${hex.toUpperCase()})`);
    } else if (this.selectedRoot) {
      // Recolor entire piece
      this.selectedRoot.userData.color = hex;
      this.selectedRoot.traverse(child => {
        if (child.isMesh && child.material) {
          const mat = child.material;
          if (mat.metalness > 0.75 || mat.isMeshBasicMaterial || mat.map) return;
          child.material = child.material.clone();
          child.material.color.copy(threeColor);
          child.userData.customColor = hex;
        }
      });
      this.showToast(`Color changed: ${this.selectedRoot.name} (${hex.toUpperCase()})`);
    }
  }

  deleteSelectedTarget() {
    if (!this.selectedTarget) return;
    if (this.editMode === 'part' && this.selectedPart && this.selectedPart.parent) {
      const pName = this.getPartName(this.selectedPart);
      this.selectedPart.parent.remove(this.selectedPart);
      this.deselectObject();
      this.showToast(`Removed part: ${pName}`);
    } else if (this.selectedRoot) {
      const rName = this.selectedRoot.name;
      if (this.selectedRoot.parent) {
        this.selectedRoot.parent.remove(this.selectedRoot);
      } else {
        this.furnitureGroup.remove(this.selectedRoot);
      }
      this.deselectObject();
      this.showToast(`Removed item: ${rName}`);
    }
  }

  rotateSelected() {
    if (!this.selectedTarget) return;

    const isWallArt = this.selectedRoot?.userData?.type === 'wall_art';
    if (isWallArt) {
      const rotY = this.selectedRoot.rotation.y;
      const isSideWall = Math.abs(Math.sin(rotY)) > 0.5;
      const isRightWall = this.selectedRoot.position.x > 0;

      if (!isSideWall) {
        // From Back wall -> move to Right wall
        this.setWallArtPlacement(this.selectedRoot, 'right', 0, this.selectedRoot.position.y);
        this.showToast('🖼️ Wall Art moved to Right Wall');
      } else if (isRightWall) {
        // From Right wall -> move to Left wall
        this.setWallArtPlacement(this.selectedRoot, 'left', 0, this.selectedRoot.position.y);
        this.showToast('🖼️ Wall Art moved to Left Wall');
      } else {
        // From Left wall -> move to Back wall
        this.setWallArtPlacement(this.selectedRoot, 'back', 0, this.selectedRoot.position.y);
        this.showToast('🖼️ Wall Art moved to Back Wall');
      }
      this.syncWallArtInspector();
    } else {
      this.selectedTarget.rotation.y += Math.PI / 4;
      this.syncInspectorPosition();
    }

    this.syncInspectorPosition();
    if (this.selectionHelper) this.selectionHelper.update();
  }

  deselectObject() {
    this.selectedRoot = null;
    this.selectedPart = null;
    this.selectedTarget = null;
    this.selectedObject = null;
    this.selectedWall = null;
    if (this.selectionHelper) this.selectionHelper.visible = false;
    const popup = document.getElementById('inspector-popup');
    if (popup) popup.style.display = 'none';
    const modeToggle = document.getElementById('inspector-mode-toggle');
    const wallartPanel = document.getElementById('inspector-wallart-panel');
    const wallPanel = document.getElementById('inspector-wall-panel');
    const stdControls = document.getElementById('inspector-standard-controls');
    const actions = document.getElementById('inspector-actions');
    const shortcutsTip = document.getElementById('inspector-shortcuts-tip');

    if (modeToggle) modeToggle.style.display = 'flex';
    if (wallartPanel) wallartPanel.style.display = 'none';
    if (wallPanel) wallPanel.style.display = 'none';
    if (stdControls) stdControls.style.display = 'block';
    if (actions) actions.style.display = 'grid';
    if (shortcutsTip) shortcutsTip.style.display = 'block';
  }

  // 4b-i. DIRECT 3D SINGLE WALL SELECTION
  selectWall(wallMesh) {
    if (!wallMesh) return;
    this.selectedWall = wallMesh;
    this.selectedRoot = null;
    this.selectedPart = null;
    this.selectedTarget = null;
    this.selectedObject = null;
    this.isDragging = false;
    this.controls.enabled = true;

    const popup = document.getElementById('inspector-popup');
    const title = document.getElementById('inspector-title');
    const subtitle = document.getElementById('inspector-subtitle');
    const modeToggle = document.getElementById('inspector-mode-toggle');
    const wallartPanel = document.getElementById('inspector-wallart-panel');
    const wallPanel = document.getElementById('inspector-wall-panel');
    const stdControls = document.getElementById('inspector-standard-controls');
    const actions = document.getElementById('inspector-actions');
    const shortcutsTip = document.getElementById('inspector-shortcuts-tip');

    if (popup) popup.style.display = 'flex';
    if (title) title.textContent = `🧱 ${wallMesh.name}`;
    if (subtitle) {
      subtitle.textContent = `Single Wall Color & Accent Finish`;
      subtitle.style.color = '#38bdf8';
    }
    if (modeToggle) modeToggle.style.display = 'none';
    if (wallartPanel) wallartPanel.style.display = 'none';
    if (stdControls) stdControls.style.display = 'none';
    if (wallPanel) wallPanel.style.display = 'block';
    if (actions) actions.style.display = 'none';
    if (shortcutsTip) shortcutsTip.style.display = 'none';

    if (this.selectionHelper) {
      this.selectionHelper.setFromObject(wallMesh);
      this.selectionHelper.visible = true;
      this.selectionHelper.update();
    }

    this.syncWallInspector(wallMesh);
    this.showToast(`Selected ${wallMesh.name} - Choose a paint finish`);
  }

  syncWallInspector(wallMesh) {
    const wall = wallMesh || this.selectedWall;
    if (!wall || !wall.material) return;
    const hex = '#' + wall.material.color.getHexString().toUpperCase();
    const heading = document.getElementById('inspector-wall-heading');
    const badge = document.getElementById('inspector-wall-color-badge');
    const hexSpan = document.getElementById('inspector-wall-color-hex');
    const colorPicker = document.getElementById('inspector-wall-color-picker');
    const targetSelect = document.getElementById('inspector-wall-target-select');

    if (heading) heading.textContent = `🧱 ${wall.name || 'Room Wall'}`;
    if (badge) badge.textContent = hex;
    if (hexSpan) hexSpan.textContent = hex;
    if (colorPicker) colorPicker.value = hex.toLowerCase();
    if (targetSelect) targetSelect.value = 'current';

    document.querySelectorAll('.wall-swatch-inspect').forEach(b => {
      b.classList.toggle('active', b.dataset.color.toUpperCase() === hex.toUpperCase());
    });
  }

  // 4b-ii. WALL ART SPATIAL & STYLING HELPERS
  getWallArtInfo(artObj) {
    if (!artObj) return null;
    const roomW = this.currentRoomDimensions?.width || 5.0;
    const roomL = this.currentRoomDimensions?.length || 4.5;
    const rotY = artObj.rotation.y;
    const isSideWall = Math.abs(Math.sin(rotY)) > 0.5;
    const isRightWall = artObj.position.x > 0;

    let wall = 'back';
    let slide = artObj.position.x;
    if (isSideWall) {
      wall = isRightWall ? 'right' : 'left';
      slide = artObj.position.z;
    }

    return {
      wall,
      slide,
      height: artObj.position.y,
      width: artObj.userData.artWidth || 1.2,
      artHeight: artObj.userData.artHeight || 0.9,
      theme: artObj.userData.artTheme || 'geometric',
      frameColor: artObj.userData.frameColor || '#18181b'
    };
  }

  setWallArtPlacement(artObj, wall, slide, height) {
    if (!artObj) return;
    const roomW = this.currentRoomDimensions?.width || 5.0;
    const roomL = this.currentRoomDimensions?.length || 4.5;
    const halfW = roomW / 2;
    const halfL = roomL / 2;

    if (height !== undefined && height !== null) {
      artObj.position.y = parseFloat(height);
    }

    if (wall === 'back') {
      artObj.rotation.set(0, 0, 0);
      artObj.position.z = -halfL + 0.04;
      if (slide !== undefined && slide !== null) {
        artObj.position.x = Math.max(-halfW + 0.7, Math.min(halfW - 0.7, parseFloat(slide)));
      }
    } else if (wall === 'left') {
      artObj.rotation.set(0, Math.PI / 2, 0);
      artObj.position.x = -halfW + 0.04;
      if (slide !== undefined && slide !== null) {
        artObj.position.z = Math.max(-halfL + 0.7, Math.min(halfL - 0.7, parseFloat(slide)));
      }
    } else if (wall === 'right') {
      artObj.rotation.set(0, -Math.PI / 2, 0);
      artObj.position.x = halfW - 0.04;
      if (slide !== undefined && slide !== null) {
        artObj.position.z = Math.max(-halfL + 0.7, Math.min(halfL - 0.7, parseFloat(slide)));
      }
    }
    artObj.userData.wall = wall;
    if (this.selectionHelper && this.selectedTarget === artObj) {
      this.selectionHelper.update();
    }
  }

  getOrCreateWallArt() {
    let artObj = null;
    this.furnitureGroup.traverse(child => {
      if (!artObj && (child.userData?.type === 'wall_art' || child.userData?.isWallMounted)) {
        artObj = child;
      }
    });
    if (!artObj) {
      artObj = FurnitureFactory.createWallArt(this.currentStyle, 'geometric', 1.2, 0.9);
      const halfL = (this.currentRoomDimensions?.length || 4.5) / 2;
      artObj.position.set(0, 1.8, -halfL + 0.04);
      this.furnitureGroup.add(artObj);
      this.currentFurniture.push(artObj);
    }
    return artObj;
  }

  syncWallArtInspector() {
    if (!this.selectedRoot || this.selectedRoot.userData?.type !== 'wall_art') return;
    const info = this.getWallArtInfo(this.selectedRoot);
    if (!info) return;

    const wallSelect = document.getElementById('wallart-wall-select');
    const wallBadge = document.getElementById('wallart-wall-badge');
    const slideSlider = document.getElementById('wallart-slide-slider');
    const slideVal = document.getElementById('wallart-slide-val');
    const heightSlider = document.getElementById('wallart-height-slider');
    const heightVal = document.getElementById('wallart-height-val');
    const wSlider = document.getElementById('wallart-w-slider');
    const wVal = document.getElementById('wallart-w-val');
    const hSlider = document.getElementById('wallart-h-slider');
    const hVal = document.getElementById('wallart-h-val');
    const themeSelect = document.getElementById('wallart-theme-select');

    if (wallSelect) wallSelect.value = info.wall;
    if (wallBadge) {
      wallBadge.textContent = info.wall === 'back' ? 'Back Wall' : (info.wall === 'left' ? 'Left Wall' : 'Right Wall');
    }
    if (slideSlider) slideSlider.value = info.slide;
    if (slideVal) slideVal.textContent = `${info.slide >= 0 ? '+' : ''}${info.slide.toFixed(2)}m`;
    if (heightSlider) heightSlider.value = info.height;
    if (heightVal) heightVal.textContent = `${info.height.toFixed(2)}m`;
    if (wSlider) wSlider.value = info.width;
    if (wVal) wVal.textContent = `${info.width.toFixed(1)}m`;
    if (hSlider) hSlider.value = info.artHeight;
    if (hVal) hVal.textContent = `${info.artHeight.toFixed(1)}m`;
    if (themeSelect) themeSelect.value = info.theme;

    this.syncWallArtSetupTab(info);
  }

  syncWallArtSetupTab(info) {
    if (!info) {
      let artObj = null;
      this.furnitureGroup.traverse(child => {
        if (!artObj && (child.userData?.type === 'wall_art' || child.userData?.isWallMounted)) {
          artObj = child;
        }
      });
      if (artObj) info = this.getWallArtInfo(artObj);
    }
    if (!info) return;

    const setupWall = document.getElementById('setup-art-wall-select');
    const setupPill = document.getElementById('setup-art-status-pill');
    const setupSlide = document.getElementById('setup-art-pos-slider');
    const setupSlideVal = document.getElementById('setup-art-pos-val');
    const setupHeight = document.getElementById('setup-art-height-slider');
    const setupHeightVal = document.getElementById('setup-art-height-val');
    const setupTheme = document.getElementById('setup-art-theme-select');
    const setupW = document.getElementById('setup-art-w-slider');
    const setupWVal = document.getElementById('setup-art-w-val');
    const setupH = document.getElementById('setup-art-h-slider');
    const setupHVal = document.getElementById('setup-art-h-val');

    const wallName = info.wall === 'back' ? 'Back Wall' : (info.wall === 'left' ? 'Left Wall' : 'Right Wall');
    if (setupWall) setupWall.value = info.wall;
    if (setupPill) setupPill.textContent = wallName;
    if (setupSlide) setupSlide.value = info.slide;
    if (setupSlideVal) setupSlideVal.textContent = `${info.slide >= 0 ? '+' : ''}${info.slide.toFixed(1)}m`;
    if (setupHeight) setupHeight.value = info.height;
    if (setupHeightVal) setupHeightVal.textContent = `${info.height.toFixed(2)}m`;
    if (setupTheme) setupTheme.value = info.theme;
    if (setupW) setupW.value = info.width;
    if (setupWVal) setupWVal.textContent = `${info.width.toFixed(1)}m`;
    if (setupH) setupH.value = info.artHeight;
    if (setupHVal) setupHVal.textContent = `${info.artHeight.toFixed(1)}m`;
  }

  // 4c. KEYBOARD CONTROLS FOR OBJECT & PART NUDGE & ROTATION
  initKeyboardControls() {
    window.addEventListener('keydown', (e) => {
      this.keysDown[e.code] = true;

      // Ignore hotkeys when typing in input/textarea/select
      const activeEl = document.activeElement;
      const tag = activeEl ? activeEl.tagName.toLowerCase() : '';
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

      if (this.selectedTarget && !this.isWalkthrough) {
        let step = e.shiftKey ? 0.2 : 0.05;
        const isWallMounted = this.selectedRoot?.userData?.isWallMounted || this.selectedRoot?.userData?.type === 'wall_art';

        if (isWallMounted) {
          const roomW = this.currentRoomDimensions?.width || 5.0;
          const roomL = this.currentRoomDimensions?.length || 4.5;
          const roomH = this.currentRoomDimensions?.height || 2.8;
          const halfW = roomW / 2;
          const halfL = roomL / 2;
          const isSideWall = Math.abs(Math.sin(this.selectedRoot.rotation.y)) > 0.5;

          if (e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'KeyE') {
            e.preventDefault();
            this.selectedRoot.position.y = Math.min(roomH - 0.4, this.selectedRoot.position.y + step);
            this.syncInspectorPosition();
            if (this.selectionHelper) this.selectionHelper.update();
          } else if (e.code === 'ArrowDown' || e.code === 'KeyS' || e.code === 'KeyQ') {
            e.preventDefault();
            this.selectedRoot.position.y = Math.max(0.6, this.selectedRoot.position.y - step);
            this.syncInspectorPosition();
            if (this.selectionHelper) this.selectionHelper.update();
          } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
            e.preventDefault();
            if (isSideWall) {
              this.selectedRoot.position.z = Math.max(-halfL + 0.7, this.selectedRoot.position.z - step);
            } else {
              this.selectedRoot.position.x = Math.max(-halfW + 0.7, this.selectedRoot.position.x - step);
            }
            this.syncInspectorPosition();
            if (this.selectionHelper) this.selectionHelper.update();
          } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
            e.preventDefault();
            if (isSideWall) {
              this.selectedRoot.position.z = Math.min(halfL - 0.7, this.selectedRoot.position.z + step);
            } else {
              this.selectedRoot.position.x = Math.min(halfW - 0.7, this.selectedRoot.position.x + step);
            }
            this.syncInspectorPosition();
            if (this.selectionHelper) this.selectionHelper.update();
          } else if (e.code === 'KeyR') {
            e.preventDefault();
            this.rotateSelected();
          } else if (e.code === 'Delete' || e.code === 'Backspace') {
            e.preventDefault();
            this.deleteSelectedTarget();
          } else if (e.code === 'Escape') {
            e.preventDefault();
            this.deselectObject();
          }
        } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
          e.preventDefault();
          this.selectedTarget.position.x -= step;
          this.syncInspectorPosition();
          if (this.selectionHelper) this.selectionHelper.update();
        } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
          e.preventDefault();
          this.selectedTarget.position.x += step;
          this.syncInspectorPosition();
          if (this.selectionHelper) this.selectionHelper.update();
        } else if (e.code === 'ArrowUp' || e.code === 'KeyW') {
          e.preventDefault();
          this.selectedTarget.position.z -= step;
          this.syncInspectorPosition();
          if (this.selectionHelper) this.selectionHelper.update();
        } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
          e.preventDefault();
          this.selectedTarget.position.z += step;
          this.syncInspectorPosition();
          if (this.selectionHelper) this.selectionHelper.update();
        } else if (e.code === 'KeyQ') {
          // Height Down
          e.preventDefault();
          this.selectedTarget.position.y -= step;
          this.syncInspectorPosition();
          if (this.selectionHelper) this.selectionHelper.update();
        } else if (e.code === 'KeyE') {
          // Height Up
          e.preventDefault();
          this.selectedTarget.position.y += step;
          this.syncInspectorPosition();
          if (this.selectionHelper) this.selectionHelper.update();
        } else if (e.code === 'KeyR') {
          e.preventDefault();
          this.rotateSelected();
        } else if (e.code === 'Delete' || e.code === 'Backspace') {
          e.preventDefault();
          this.deleteSelectedTarget();
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

    // Style Card Selection & Instant Real-Time 3D Generation
    const stylePresets = {
      modern: {
        colorScheme: 'warm_neutral',
        flooring: 'wood_oak',
        label: 'Modern'
      },
      minimalist: {
        colorScheme: 'cool_scandi',
        flooring: 'tile',
        label: 'Minimalist'
      },
      luxury: {
        colorScheme: 'dark_luxury',
        flooring: 'marble',
        label: 'Luxury'
      },
      traditional: {
        colorScheme: 'earthy_terracotta',
        flooring: 'dark_walnut',
        label: 'Traditional'
      }
    };

    document.querySelectorAll('.style-card').forEach(card => {
      card.addEventListener('click', () => {
        const style = card.dataset.style;
        document.querySelectorAll('.style-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        this.currentStyle = style;

        // Auto-configure matching Color Palette & Flooring in the UI
        const preset = stylePresets[style];
        if (preset) {
          const colorSelect = document.getElementById('color-scheme');
          const floorSelect = document.getElementById('flooring-select');
          if (colorSelect) colorSelect.value = preset.colorScheme;
          if (floorSelect) floorSelect.value = preset.flooring;
        }

        // Immediately re-generate room with the selected style
        this.triggerAIGeneration();
        this.showToast(`✨ Applied ${preset ? preset.label : style} Design Style`);
      });
    });

    // Complete House Navigator Bar buttons (Whole House, Living, Dining, Kitchen, Bedroom, Bed 2 / Dressing)
    document.querySelectorAll('.house-nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const roomSelect = document.getElementById('room-type');
        const currentVal = roomSelect ? roomSelect.value : '';
        const isAlreadyHouse = currentVal === 'complete_house' || currentVal === 'complete_house_2bhk' || currentVal === 'complete_house_3bhk' || currentVal === 'duplex';
        if (roomSelect && !isAlreadyHouse) {
          let targetHouseVal = 'complete_house';
          if (this.currentHouseType === 'duplex') targetHouseVal = 'duplex';
          else if (this.currentHouseType === '3bhk') targetHouseVal = 'complete_house_3bhk';
          else if (this.currentHouseType === '2bhk') targetHouseVal = 'complete_house_2bhk';
          roomSelect.value = targetHouseVal;
          this.syncRoomVariantsUI(targetHouseVal);
          this.triggerAIGeneration().then(() => {
            this.focusRoom(btn.dataset.targetRoom);
          });
        } else {
          this.focusRoom(btn.dataset.targetRoom);
        }
      });
    });

    // Complete House Zone Hub buttons in sidebar
    document.querySelectorAll('.house-zone-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const roomSelect = document.getElementById('room-type');
        const currentVal = roomSelect ? roomSelect.value : '';
        const isAlreadyHouse = currentVal === 'complete_house' || currentVal === 'complete_house_2bhk' || currentVal === 'complete_house_3bhk' || currentVal === 'duplex';
        if (roomSelect && !isAlreadyHouse) {
          let targetHouseVal = 'complete_house';
          if (this.currentHouseType === 'duplex') targetHouseVal = 'duplex';
          else if (this.currentHouseType === '3bhk') targetHouseVal = 'complete_house_3bhk';
          else if (this.currentHouseType === '2bhk') targetHouseVal = 'complete_house_2bhk';
          roomSelect.value = targetHouseVal;
          this.syncRoomVariantsUI(targetHouseVal);
          this.triggerAIGeneration().then(() => {
            this.focusRoom(btn.dataset.zone);
          });
        } else {
          this.focusRoom(btn.dataset.zone);
        }
      });
    });

    // 1 BHK vs 2 BHK vs 3 BHK vs Duplex House Toggle Pills
    document.querySelectorAll('.house-type-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const hType = btn.getAttribute('data-house-type') || '1bhk';
        this.currentHouseType = hType;
        let targetVal = 'complete_house';
        if (hType === 'duplex') targetVal = 'duplex';
        else if (hType === '3bhk') targetVal = 'complete_house_3bhk';
        else if (hType === '2bhk') targetVal = 'complete_house_2bhk';

        const roomSelect = document.getElementById('room-type');
        if (roomSelect) {
          roomSelect.value = targetVal;
        }
        this.syncRoomVariantsUI(targetVal);
        this.triggerAIGeneration();
        if (hType === 'duplex') {
          this.showToast('🏙️ Switched to Modern Duplex Villa (Double-Height Living & Mezzanine)');
        } else if (hType === '3bhk') {
          this.showToast('🏰 Switched to Luxury 3 BHK Residence (10 Connected Spaces & Balcony)');
        } else if (hType === '2bhk') {
          this.showToast('🏛️ Switched to Architectural 2 BHK Residence');
        } else {
          this.showToast('🏠 Switched to Single Bedroom House (1 BHK)');
        }
      });
    });

    // Instant Room Type Switching
    document.getElementById('room-type')?.addEventListener('change', (e) => {
      const selectedType = e.target.value;
      if (selectedType === 'complete_house') this.currentHouseType = '1bhk';
      else if (selectedType === 'complete_house_2bhk') this.currentHouseType = '2bhk';
      else if (selectedType === 'complete_house_3bhk') this.currentHouseType = '3bhk';
      else if (selectedType === 'duplex') this.currentHouseType = 'duplex';
      this.syncRoomVariantsUI(selectedType);
      this.triggerAIGeneration();
      const rName = e.target.options[e.target.selectedIndex]?.text || 'Space';
      this.showToast(`Switched space to ${rName}`);
    });

    // Instant Color Scheme Switching
    document.getElementById('color-scheme')?.addEventListener('change', () => {
      this.triggerAIGeneration();
      const cName = document.getElementById('color-scheme').options[document.getElementById('color-scheme').selectedIndex]?.text || 'Palette';
      this.showToast(`Applied ${cName}`);
    });

    // Instant Flooring Switching
    document.getElementById('flooring-select')?.addEventListener('change', (e) => {
      this.roomBuilder.setFlooring(e.target.value);
      const fName = e.target.options[e.target.selectedIndex]?.text || 'Flooring';
      this.showToast(`Flooring set to ${fName}`);
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

    // Daylight & Warm 3000K Lighting Mode Cycle
    this.lightingModeIndex = 0;
    const lightingModes = [
      { id: 'morning_3000k', label: '☀️ 3000K Morning', toast: 'Warm 3000K interior lighting & natural morning daylight enabled', bg: 0x0a0e17, ambColor: 0xfff3e3, ambInt: 0.62, sunColor: 0xffebd2, sunInt: 1.30, sunPos: [-9, 6.2, 5.2], ceilColor: 0xffdfba, ceilInt: 0.70 },
      { id: 'midday_day', label: '🌤️ Midday Daylight', toast: 'Bright midday daylight simulation enabled', bg: 0x0f172a, ambColor: 0xffffff, ambInt: 0.55, sunColor: 0xfffaed, sunInt: 1.20, sunPos: [-8, 9.0, 4.0], ceilColor: 0xfff7ed, ceilInt: 0.55 },
      { id: 'evening_moody', label: '🌙 Evening Warm', toast: 'Moody evening lighting & warm LEDs enabled', bg: 0x020408, ambColor: 0xffe2c4, ambInt: 0.18, sunColor: 0xff8c42, sunInt: 0.08, sunPos: [-10, 3.0, 6.0], ceilColor: 0xffb770, ceilInt: 1.35 }
    ];

    const daylightBtn = document.getElementById('btn-toggle-daylight');
    if (daylightBtn) {
      daylightBtn.innerHTML = '☀️ 3000K Morning';
      daylightBtn.addEventListener('click', () => {
        this.lightingModeIndex = (this.lightingModeIndex + 1) % lightingModes.length;
        const mode = lightingModes[this.lightingModeIndex];
        daylightBtn.innerHTML = mode.label;
        daylightBtn.classList.toggle('active', mode.id !== 'evening_moody');

        this.scene.background.set(mode.bg);
        this.ambientLight.color.setHex(mode.ambColor);
        this.ambientLight.intensity = mode.ambInt;
        this.sunLight.color.setHex(mode.sunColor);
        this.sunLight.intensity = mode.sunInt;
        this.sunLight.position.set(mode.sunPos[0], mode.sunPos[1], mode.sunPos[2]);
        this.ceilingLight.color.setHex(mode.ceilColor);
        this.ceilingLight.intensity = mode.ceilInt;

        this.showToast(mode.toast);
      });
    }

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
    document.getElementById('btn-close-inspector')?.addEventListener('click', () => {
      this.deselectObject();
    });

    // Mode Toggle: Single Part vs Entire Piece
    document.getElementById('btn-mode-part')?.addEventListener('click', () => {
      this.editMode = 'part';
      this.updateTargetByMode();
      this.showToast(`Mode: Single Part (${this.getPartName(this.selectedPart)})`);
    });

    document.getElementById('btn-mode-whole')?.addEventListener('click', () => {
      this.editMode = 'whole';
      this.updateTargetByMode();
      this.showToast(`Mode: Entire Piece (${this.selectedRoot?.name})`);
    });

    // Position X, Y, Z sliders
    document.getElementById('inspect-pos-x')?.addEventListener('input', (e) => {
      if (this.selectedTarget) {
        this.selectedTarget.position.x = parseFloat(e.target.value);
        this.syncInspectorPosition();
        if (this.selectionHelper) this.selectionHelper.update();
      }
    });

    document.getElementById('inspect-pos-y')?.addEventListener('input', (e) => {
      if (this.selectedTarget) {
        this.selectedTarget.position.y = parseFloat(e.target.value);
        this.syncInspectorPosition();
        if (this.selectionHelper) this.selectionHelper.update();
      }
    });

    document.getElementById('inspect-pos-z')?.addEventListener('input', (e) => {
      if (this.selectedTarget) {
        this.selectedTarget.position.z = parseFloat(e.target.value);
        this.syncInspectorPosition();
        if (this.selectionHelper) this.selectionHelper.update();
      }
    });

    // 1-Click Quick Color Swatches
    document.querySelectorAll('.quick-swatch').forEach(btn => {
      btn.addEventListener('click', () => {
        const hex = btn.dataset.color;
        this.applyColorToTarget(hex);
      });
    });

    // Custom Color Picker input
    const inspectColor = document.getElementById('inspect-item-color');
    if (inspectColor) {
      inspectColor.addEventListener('input', (e) => {
        this.applyColorToTarget(e.target.value);
      });
    }

    // Random Color Generator
    document.getElementById('btn-random-color')?.addEventListener('click', () => {
      const palette = [
        '#FFFFFF', '#F5F5F0', '#D1D5DB', '#4B5563', '#111827',
        '#8B5A2B', '#3E2723', '#D4AF37', '#1B4332', '#52796F',
        '#1E3A8A', '#3B82F6', '#C2410C', '#D97706', '#DB2777'
      ];
      const randomColor = palette[Math.floor(Math.random() * palette.length)];
      this.applyColorToTarget(randomColor);
    });

    // Rotate button
    document.getElementById('btn-rotate-object')?.addEventListener('click', () => {
      this.rotateSelected();
    });

    // Reset part position button
    document.getElementById('btn-reset-part')?.addEventListener('click', () => {
      if (this.editMode === 'part' && this.selectedPart && this.selectedPart.userData.origPos) {
        this.selectedPart.position.copy(this.selectedPart.userData.origPos);
        this.selectedPart.rotation.set(0, 0, 0);
        this.syncInspectorPosition();
        if (this.selectionHelper) this.selectionHelper.update();
        this.showToast('Reset part to original position');
      } else if (this.selectedRoot) {
        const isWall = this.selectedRoot.userData?.type === 'wall_art' || this.selectedRoot.userData?.isWallMounted;
        const halfL = (this.currentRoomDimensions?.length || 4.5) / 2;
        if (isWall) {
          this.selectedRoot.position.set(0, 1.8, -halfL + 0.04);
          this.selectedRoot.rotation.set(0, 0, 0);
          this.showToast('Reset Wall Art to Back Wall');
        } else {
          this.selectedRoot.position.set(0, 0, 0);
          this.selectedRoot.rotation.set(0, 0, 0);
          this.showToast('Reset item to room center');
        }
        this.syncInspectorPosition();
        if (this.selectionHelper) this.selectionHelper.update();
      }
    });

    // Delete button
    document.getElementById('btn-delete-object')?.addEventListener('click', () => {
      this.deleteSelectedTarget();
    });

    // Missouri TV Entertainment Unit Design Switcher
    document.querySelectorAll('.tv-design-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!this.selectedRoot || this.selectedRoot.userData?.type !== 'missouri_tv_unit') return;
        const targetDesign = parseInt(btn.dataset.design, 10) || 1;
        const pos = this.selectedRoot.position.clone();
        const rot = this.selectedRoot.rotation.clone();
        const col = this.selectedRoot.userData?.color || null;

        this.furnitureGroup.remove(this.selectedRoot);

        const newUnit = FurnitureFactory.createMissouriTVUnit(this.currentStyle, col, targetDesign);
        newUnit.position.copy(pos);
        newUnit.rotation.copy(rot);
        this.furnitureGroup.add(newUnit);

        this.selectTarget(newUnit, newUnit);
        this.updateTargetByMode();
        this.showToast(`Switched to ${newUnit.name}`);
      });
    });

    // Add items from catalog
    document.querySelectorAll('.add-catalog-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.type;
        const isWall = type === 'wall_art' || type === 'wall_clock' || type === 'air_conditioner' || type === 'curtains' || type === 'water_purifier';
        const isCeiling = type === 'ceiling_fan' || type === 'pendant_light';
        const halfL = (this.currentRoomDimensions?.length || 4.5) / 2;

        let initialPos = [0, 0, 0];
        let initialRot = [0, 0, 0];
        if (isWall) {
          const wallY = type === 'air_conditioner' ? 2.3 : (type === 'curtains' ? 1.1 : (type === 'wall_clock' ? 2.0 : (type === 'water_purifier' ? 1.6 : 1.85)));
          initialPos = [0, wallY, -halfL + 0.04];
        } else if (isCeiling) {
          initialPos = [0, 0, 0];
        } else if (type === 'missouri_tv_unit' || type === 'tv_unit') {
          initialPos = [0, 0, halfL - 0.45];
          initialRot = [0, Math.PI, 0];
        }

        const itemName = btn.textContent.trim();
        const variant = btn.dataset.variant ? parseInt(btn.dataset.variant, 10) : 1;
        this.addFurnitureItem({
          type: type,
          name: itemName,
          style: this.currentStyle,
          position: initialPos,
          rotation: initialRot,
          design: variant
        });

        if (isWall) {
          this.showToast(`🧱 Added ${itemName} to Back Wall`);
        } else if (isCeiling) {
          this.showToast(`💡 Added ${itemName} to Ceiling`);
        } else {
          this.showToast(`✨ Added ${itemName} to room`);
        }
      });
    });

    // Real-time Catalog Search & Category Filter
    const catSearch = document.getElementById('catalog-search');
    const catPills = document.querySelectorAll('.catalog-filter-pill');
    let activeCategory = 'all';

    const filterCatalog = () => {
      const q = (catSearch?.value || '').toLowerCase().trim();
      document.querySelectorAll('.catalog-category-group').forEach(group => {
        const groupCat = group.dataset.category;
        const matchesCategory = activeCategory === 'all' || groupCat === activeCategory;
        let visibleCount = 0;

        group.querySelectorAll('.add-catalog-item').forEach(item => {
          const text = (item.textContent || '').toLowerCase();
          const matchesSearch = !q || text.includes(q);
          const show = matchesCategory && matchesSearch;
          item.classList.toggle('hidden', !show);
          item.style.display = show ? 'flex' : 'none';
          if (show) visibleCount++;
        });

        const showGroup = matchesCategory && visibleCount > 0;
        group.classList.toggle('hidden', !showGroup);
        group.style.display = showGroup ? 'block' : 'none';
      });
    };

    catSearch?.addEventListener('input', filterCatalog);

    catPills.forEach(pill => {
      pill.addEventListener('click', () => {
        catPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        activeCategory = pill.dataset.filter || 'all';
        filterCatalog();
      });
    });

    // Flooring in Catalog tab
    const catFlooring = document.getElementById('catalog-flooring');
    catFlooring?.addEventListener('change', (e) => {
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

    // Architectural 3D Renders Modal Handlers
    const rendersModal = document.getElementById('renders-modal');
    document.getElementById('btn-view-renders')?.addEventListener('click', () => {
      if (rendersModal) rendersModal.classList.add('open');
    });

    document.getElementById('btn-close-renders')?.addEventListener('click', () => {
      if (rendersModal) rendersModal.classList.remove('open');
    });

    const tabCutaway = document.getElementById('tab-render-cutaway');
    const tabTopdown = document.getElementById('tab-render-topdown');
    const tabEyelevel = document.getElementById('tab-render-eyelevel');
    const viewCutaway = document.getElementById('view-render-cutaway');
    const viewTopdown = document.getElementById('view-render-topdown');
    const viewEyelevel = document.getElementById('view-render-eyelevel');

    tabCutaway?.addEventListener('click', () => {
      tabCutaway.classList.add('active');
      tabTopdown?.classList.remove('active');
      tabEyelevel?.classList.remove('active');
      if (viewCutaway) viewCutaway.style.display = 'block';
      if (viewTopdown) viewTopdown.style.display = 'none';
      if (viewEyelevel) viewEyelevel.style.display = 'none';
    });

    tabTopdown?.addEventListener('click', () => {
      tabTopdown.classList.add('active');
      tabCutaway?.classList.remove('active');
      tabEyelevel?.classList.remove('active');
      if (viewTopdown) viewTopdown.style.display = 'block';
      if (viewCutaway) viewCutaway.style.display = 'none';
      if (viewEyelevel) viewEyelevel.style.display = 'none';
    });

    tabEyelevel?.addEventListener('click', () => {
      tabEyelevel.classList.add('active');
      tabCutaway?.classList.remove('active');
      tabTopdown?.classList.remove('active');
      if (viewEyelevel) viewEyelevel.style.display = 'block';
      if (viewCutaway) viewCutaway.style.display = 'none';
      if (viewTopdown) viewTopdown.style.display = 'none';
    });

    // 1-Click Load Presets from Renders Modal
    document.getElementById('btn-apply-3bhk-preset')?.addEventListener('click', () => {
      if (rendersModal) rendersModal.classList.remove('open');
      const roomSelect = document.getElementById('room-type');
      if (roomSelect) roomSelect.value = 'complete_house_3bhk';
      this.currentHouseType = '3bhk';
      this.syncRoomVariantsUI('complete_house_3bhk');
      this.triggerAIGeneration();
      this.setCameraPreset('3d');
      this.showToast('🏰 Loaded Luxury 3 BHK Residence Layout');
    });

    document.getElementById('btn-apply-duplex-preset')?.addEventListener('click', () => {
      if (rendersModal) rendersModal.classList.remove('open');
      const roomSelect = document.getElementById('room-type');
      if (roomSelect) roomSelect.value = 'duplex';
      this.currentHouseType = 'duplex';
      this.syncRoomVariantsUI('duplex');
      this.triggerAIGeneration();
      this.setCameraPreset('3d');
      this.showToast('🏙️ Loaded Modern Duplex Villa Layout');
    });

    // Studio Sign Out button
    document.getElementById('btn-studio-signout')?.addEventListener('click', () => {
      localStorage.removeItem('ai_interior_user');
      window.location.href = 'login.html?redirect=studio.html';
    });

    // Display user session in studio navbar if signed in
    try {
      const stored = localStorage.getItem('ai_interior_user');
      if (stored) {
        const user = JSON.parse(stored);
        const label = document.getElementById('studio-auth-label');
        if (label && user && user.name) {
          label.textContent = user.name.split(' ')[0];
          const icon = document.getElementById('studio-auth-icon');
          if (icon && user.avatarInitial) {
            icon.textContent = '✨';
          }
          const link = document.getElementById('studio-auth-link');
          if (link) {
            link.title = `Signed in as ${user.name} (${user.email || ''})`;
          }
        }
        // Only show Admin portal link if user is bhuvan@gmail.com
        const adminBtn = document.getElementById('btn-studio-admin');
        if (adminBtn) {
          if (user.role === 'admin' && user.email && user.email.toLowerCase() === 'bhuvan@gmail.com') {
            adminBtn.style.display = 'inline-flex';
          } else {
            adminBtn.style.display = 'none';
          }
        }
      }
    } catch (e) {}

    // Initialize Door, Window, Wall Art, and Single Wall Color controls
    this.initArchitecturalControls();
    this.initWallArtControls();
    this.initWallColorControls();

    // Initialize Sun Study, Measure Tool, Room Schedule, and Advanced Exports
    this.initSunStudy();
    this.initMeasureTool();
    this.initRoomSchedule();
    this.initExportTools();
  }

  initWallArtControls() {
    // --- INSPECTOR POPUP WALL ART CONTROLS ---
    const wallSelect = document.getElementById('wallart-wall-select');
    const wallBadge = document.getElementById('wallart-wall-badge');
    const slideSlider = document.getElementById('wallart-slide-slider');
    const slideVal = document.getElementById('wallart-slide-val');
    const heightSlider = document.getElementById('wallart-height-slider');
    const heightVal = document.getElementById('wallart-height-val');
    const wSlider = document.getElementById('wallart-w-slider');
    const wVal = document.getElementById('wallart-w-val');
    const hSlider = document.getElementById('wallart-h-slider');
    const hVal = document.getElementById('wallart-h-val');
    const themeSelect = document.getElementById('wallart-theme-select');

    wallSelect?.addEventListener('change', (e) => {
      if (!this.selectedRoot || (!this.selectedRoot.userData?.isWallMounted && this.selectedRoot.userData?.type !== 'wall_art')) return;
      const wall = e.target.value;
      const info = this.getWallArtInfo(this.selectedRoot);
      this.setWallArtPlacement(this.selectedRoot, wall, info ? info.slide : 0, info ? info.height : 1.8);
      if (wallBadge) {
        wallBadge.textContent = wall === 'back' ? 'Back Wall' : (wall === 'left' ? 'Left Wall' : 'Right Wall');
      }
      this.syncWallArtInspector();
      this.showToast(`🖼️ Art moved to ${wall === 'back' ? 'Back' : (wall === 'left' ? 'Left' : 'Right')} Wall`);
    });

    slideSlider?.addEventListener('input', (e) => {
      if (!this.selectedRoot || (!this.selectedRoot.userData?.isWallMounted && this.selectedRoot.userData?.type !== 'wall_art')) return;
      const val = parseFloat(e.target.value);
      if (slideVal) slideVal.textContent = `${val >= 0 ? '+' : ''}${val.toFixed(2)}m`;
      const info = this.getWallArtInfo(this.selectedRoot);
      this.setWallArtPlacement(this.selectedRoot, info ? info.wall : 'back', val, info ? info.height : 1.8);
      this.syncWallArtSetupTab();
    });

    heightSlider?.addEventListener('input', (e) => {
      if (!this.selectedRoot || (!this.selectedRoot.userData?.isWallMounted && this.selectedRoot.userData?.type !== 'wall_art')) return;
      const val = parseFloat(e.target.value);
      if (heightVal) heightVal.textContent = `${val.toFixed(2)}m`;
      this.selectedRoot.position.y = val;
      this.syncWallArtSetupTab();
      if (this.selectionHelper) this.selectionHelper.update();
    });

    wSlider?.addEventListener('input', (e) => {
      if (!this.selectedRoot || (!this.selectedRoot.userData?.isWallMounted && this.selectedRoot.userData?.type !== 'wall_art')) return;
      const w = parseFloat(e.target.value);
      const h = parseFloat(hSlider ? hSlider.value : 0.9);
      if (wVal) wVal.textContent = `${w.toFixed(1)}m`;
      FurnitureFactory.updateWallArtDimensions(this.selectedRoot, w, h);
      this.syncWallArtSetupTab();
      if (this.selectionHelper) this.selectionHelper.update();
    });

    hSlider?.addEventListener('input', (e) => {
      if (!this.selectedRoot || (!this.selectedRoot.userData?.isWallMounted && this.selectedRoot.userData?.type !== 'wall_art')) return;
      const h = parseFloat(e.target.value);
      const w = parseFloat(wSlider ? wSlider.value : 1.2);
      if (hVal) hVal.textContent = `${h.toFixed(1)}m`;
      FurnitureFactory.updateWallArtDimensions(this.selectedRoot, w, h);
      this.syncWallArtSetupTab();
      if (this.selectionHelper) this.selectionHelper.update();
    });

    themeSelect?.addEventListener('change', (e) => {
      if (!this.selectedRoot || (!this.selectedRoot.userData?.isWallMounted && this.selectedRoot.userData?.type !== 'wall_art')) return;
      const theme = e.target.value;
      FurnitureFactory.updateWallArtTheme(this.selectedRoot, theme);
      this.syncWallArtSetupTab();
      this.showToast(`Artwork theme updated: ${e.target.options[e.target.selectedIndex].text}`);
    });

    document.querySelectorAll('.btn-frame-swatch').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!this.selectedRoot || (!this.selectedRoot.userData?.isWallMounted && this.selectedRoot.userData?.type !== 'wall_art')) return;
        const color = btn.dataset.frameColor;
        FurnitureFactory.updateWallArtFrameColor(this.selectedRoot, color);
        this.showToast(`Frame finish updated: ${btn.title}`);
      });
    });

    // --- SETUP TAB WALL ART CONTROLS ---
    const setupWall = document.getElementById('setup-art-wall-select');
    const setupPill = document.getElementById('setup-art-status-pill');
    const setupSlide = document.getElementById('setup-art-pos-slider');
    const setupSlideVal = document.getElementById('setup-art-pos-val');
    const setupHeight = document.getElementById('setup-art-height-slider');
    const setupHeightVal = document.getElementById('setup-art-height-val');
    const setupTheme = document.getElementById('setup-art-theme-select');
    const setupW = document.getElementById('setup-art-w-slider');
    const setupWVal = document.getElementById('setup-art-w-val');
    const setupH = document.getElementById('setup-art-h-slider');
    const setupHVal = document.getElementById('setup-art-h-val');

    setupWall?.addEventListener('change', (e) => {
      const art = this.getOrCreateWallArt();
      const wall = e.target.value;
      const info = this.getWallArtInfo(art);
      this.setWallArtPlacement(art, wall, info ? info.slide : 0, info ? info.height : 1.8);
      const wallName = e.target.options[e.target.selectedIndex].text;
      if (setupPill) setupPill.textContent = wallName;
      if (this.selectedRoot === art) this.syncWallArtInspector();
      this.showToast(`🖼️ Art placed on ${wallName}`);
    });

    setupSlide?.addEventListener('input', (e) => {
      const art = this.getOrCreateWallArt();
      const val = parseFloat(e.target.value);
      if (setupSlideVal) setupSlideVal.textContent = `${val >= 0 ? '+' : ''}${val.toFixed(1)}m`;
      const info = this.getWallArtInfo(art);
      this.setWallArtPlacement(art, info ? info.wall : 'back', val, info ? info.height : 1.8);
      if (this.selectedRoot === art) this.syncWallArtInspector();
    });

    setupHeight?.addEventListener('input', (e) => {
      const art = this.getOrCreateWallArt();
      const val = parseFloat(e.target.value);
      if (setupHeightVal) setupHeightVal.textContent = `${val.toFixed(2)}m`;
      art.position.y = val;
      if (this.selectedRoot === art) this.syncWallArtInspector();
      if (this.selectionHelper && this.selectedTarget === art) this.selectionHelper.update();
    });

    setupTheme?.addEventListener('change', (e) => {
      const art = this.getOrCreateWallArt();
      const theme = e.target.value;
      FurnitureFactory.updateWallArtTheme(art, theme);
      if (this.selectedRoot === art) this.syncWallArtInspector();
      this.showToast(`Artwork theme: ${e.target.options[e.target.selectedIndex].text}`);
    });

    setupW?.addEventListener('input', (e) => {
      const art = this.getOrCreateWallArt();
      const w = parseFloat(e.target.value);
      const h = parseFloat(setupH ? setupH.value : 0.9);
      if (setupWVal) setupWVal.textContent = `${w.toFixed(1)}m`;
      FurnitureFactory.updateWallArtDimensions(art, w, h);
      if (this.selectedRoot === art) this.syncWallArtInspector();
      if (this.selectionHelper && this.selectedTarget === art) this.selectionHelper.update();
    });

    setupH?.addEventListener('input', (e) => {
      const art = this.getOrCreateWallArt();
      const h = parseFloat(e.target.value);
      const w = parseFloat(setupW ? setupW.value : 1.2);
      if (setupHVal) setupHVal.textContent = `${h.toFixed(1)}m`;
      FurnitureFactory.updateWallArtDimensions(art, w, h);
      if (this.selectedRoot === art) this.syncWallArtInspector();
      if (this.selectionHelper && this.selectedTarget === art) this.selectionHelper.update();
    });
  }

  // 4b-iii. SINGLE WALL & ALL WALLS PAINT & ACCENT CUSTOMIZER
  initWallColorControls() {
    const designerAccents = [
      '#FFFFFF', '#F5F5F0', '#E8DFD8', '#A3B19B',
      '#B85D43', '#D8A49B', '#1E293B', '#1F242D',
      '#354F42', '#A5B4C4', '#C5BCB3', '#C8963E',
      '#2B3A42', '#3D405B', '#81B29A', '#E07A5F'
    ];

    // --- SETUP TAB WALL CONTROLS ---
    const setupTarget = document.getElementById('setup-wall-target-select');
    const setupPill = document.getElementById('setup-wall-status-pill');
    const setupColor = document.getElementById('setup-single-wall-color');
    const btnRandomSetup = document.getElementById('btn-random-wall-accent');

    const updateSetupColorValue = () => {
      const target = setupTarget ? setupTarget.value : 'all';
      const key = (target === 'all') ? 'back' : target;
      const hex = this.roomBuilder.getWallColor(key);
      if (setupColor) setupColor.value = hex.toLowerCase();
      document.querySelectorAll('.wall-swatch').forEach(b => {
        b.classList.toggle('active', b.dataset.color.toUpperCase() === hex.toUpperCase());
      });
    };

    setupTarget?.addEventListener('change', (e) => {
      const target = e.target.value;
      const targetName = e.target.options[e.target.selectedIndex].text;
      if (setupPill) setupPill.textContent = target === 'all' ? 'All Walls' : targetName.split(' ')[0] + ' Wall';
      updateSetupColorValue();
    });

    setupColor?.addEventListener('input', (e) => {
      const target = setupTarget ? setupTarget.value : 'all';
      const hex = parseInt(e.target.value.replace('#', '0x'), 16);
      this.roomBuilder.setSingleWallColor(target, hex);
      if (this.selectedWall) this.syncWallInspector(this.selectedWall);
    });

    btnRandomSetup?.addEventListener('click', () => {
      const randomColor = designerAccents[Math.floor(Math.random() * designerAccents.length)];
      const target = setupTarget ? setupTarget.value : 'all';
      const hex = parseInt(randomColor.replace('#', '0x'), 16);
      this.roomBuilder.setSingleWallColor(target, hex);
      if (setupColor) setupColor.value = randomColor.toLowerCase();
      if (this.selectedWall) this.syncWallInspector(this.selectedWall);
      const targetName = setupTarget?.options[setupTarget.selectedIndex]?.text || 'wall';
      this.showToast(`Applied accent ${randomColor} to ${targetName}`);
    });

    document.querySelectorAll('.wall-swatch').forEach(btn => {
      btn.addEventListener('click', () => {
        const color = btn.dataset.color;
        const target = setupTarget ? setupTarget.value : 'all';
        const hex = parseInt(color.replace('#', '0x'), 16);
        this.roomBuilder.setSingleWallColor(target, hex);
        if (setupColor) setupColor.value = color.toLowerCase();
        document.querySelectorAll('.wall-swatch').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (this.selectedWall) this.syncWallInspector(this.selectedWall);
        const targetName = setupTarget?.options[setupTarget.selectedIndex]?.text || 'wall';
        this.showToast(`Applied ${btn.title || color} to ${targetName}`);
      });
    });

    // --- CATALOG TAB SURFACE CONTROLS ---
    const catalogTarget = document.getElementById('catalog-wall-target-select');
    const catalogColor = document.getElementById('wall-color-picker');

    catalogTarget?.addEventListener('change', (e) => {
      const target = e.target.value;
      const key = (target === 'all') ? 'back' : target;
      const hex = this.roomBuilder.getWallColor(key);
      if (catalogColor) catalogColor.value = hex.toLowerCase();
    });

    catalogColor?.addEventListener('input', (e) => {
      const target = catalogTarget ? catalogTarget.value : 'all';
      const hex = parseInt(e.target.value.replace('#', '0x'), 16);
      this.roomBuilder.setSingleWallColor(target, hex);
      if (this.selectedWall) this.syncWallInspector(this.selectedWall);
      updateSetupColorValue();
    });

    // --- INSPECTOR POPUP WALL CONTROLS ---
    const inspectTarget = document.getElementById('inspector-wall-target-select');
    const inspectColor = document.getElementById('inspector-wall-color-picker');
    const btnRandomInspect = document.getElementById('btn-random-single-wall');

    const applyInspectorWallColor = (hexStr) => {
      const hex = parseInt(hexStr.replace('#', '0x'), 16);
      let target = inspectTarget ? inspectTarget.value : 'current';
      if (target === 'current' && this.selectedWall) {
        target = this.selectedWall.userData.wallKey || 'back';
      }
      this.roomBuilder.setSingleWallColor(target, hex);
      this.syncWallInspector(this.selectedWall);
      updateSetupColorValue();
    };

    inspectColor?.addEventListener('input', (e) => {
      applyInspectorWallColor(e.target.value);
    });

    btnRandomInspect?.addEventListener('click', () => {
      const randomColor = designerAccents[Math.floor(Math.random() * designerAccents.length)];
      applyInspectorWallColor(randomColor);
      this.showToast(`Applied accent ${randomColor}`);
    });

    document.querySelectorAll('.wall-swatch-inspect').forEach(btn => {
      btn.addEventListener('click', () => {
        applyInspectorWallColor(btn.dataset.color);
        this.showToast(`Applied ${btn.title || btn.dataset.color}`);
      });
    });
  }

  initArchitecturalControls() {
    // Window Controls
    const winWall = document.getElementById('window-wall-select');
    const winPos = document.getElementById('window-pos-slider');
    const winPosVal = document.getElementById('window-pos-val');
    const winW = document.getElementById('window-w-slider');
    const winWVal = document.getElementById('window-w-val');
    const winH = document.getElementById('window-h-slider');
    const winHVal = document.getElementById('window-h-val');
    const winPill = document.getElementById('window-status-pill');

    winWall?.addEventListener('change', (e) => {
      this.roomBuilder.updateWindow({ wall: e.target.value });
      if (winPill) {
        winPill.textContent = e.target.options[e.target.selectedIndex].text;
      }
      this.showToast(`Window moved to ${e.target.options[e.target.selectedIndex].text}`);
    });

    winPos?.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      if (winPosVal) winPosVal.textContent = `${val >= 0 ? '+' : ''}${val.toFixed(1)}m`;
      this.roomBuilder.updateWindow({ offset: val });
    });

    winW?.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      if (winWVal) winWVal.textContent = `${val.toFixed(1)}m`;
      this.roomBuilder.updateWindow({ width: val });
    });

    winH?.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      if (winHVal) winHVal.textContent = `${val.toFixed(1)}m`;
      this.roomBuilder.updateWindow({ height: val });
    });

    // Door Controls
    const doorWall = document.getElementById('door-wall-select');
    const doorFinish = document.getElementById('door-finish-select');
    const doorPos = document.getElementById('door-pos-slider');
    const doorPosVal = document.getElementById('door-pos-val');
    const doorW = document.getElementById('door-w-slider');
    const doorWVal = document.getElementById('door-w-val');
    const doorSwing = document.getElementById('door-swing-slider');
    const doorSwingVal = document.getElementById('door-swing-val');
    const doorPill = document.getElementById('door-status-pill');

    doorWall?.addEventListener('change', (e) => {
      this.roomBuilder.updateDoor({ wall: e.target.value });
      if (doorPill) {
        doorPill.textContent = e.target.options[e.target.selectedIndex].text;
      }
      this.showToast(`Door moved to ${e.target.options[e.target.selectedIndex].text}`);
    });

    doorFinish?.addEventListener('change', (e) => {
      this.roomBuilder.updateDoor({ finish: e.target.value });
      this.showToast(`Door finish changed to ${e.target.options[e.target.selectedIndex].text}`);
    });

    doorPos?.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      if (doorPosVal) doorPosVal.textContent = `${val >= 0 ? '+' : ''}${val.toFixed(2)}m`;
      this.roomBuilder.updateDoor({ offset: val });
    });

    doorW?.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      if (doorWVal) doorWVal.textContent = `${val.toFixed(2)}m`;
      this.roomBuilder.updateDoor({ width: val });
    });

    doorSwing?.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      if (doorSwingVal) doorSwingVal.textContent = `${val}°`;
      if (doorPill) {
        doorPill.textContent = val === 0 ? '🔒 Closed (0°)' : (val >= 75 ? `✨ Open (${val}°)` : `🚪 Ajar (${val}°)`);
      }
      this.roomBuilder.setDoorSwing(val);
    });

    document.querySelectorAll('.btn-door-quick-swing').forEach(btn => {
      btn.addEventListener('click', () => {
        const angle = parseInt(btn.dataset.angle, 10);
        this.roomBuilder.setDoorSwing(angle);
        if (doorSwing) doorSwing.value = angle;
        if (doorSwingVal) doorSwingVal.textContent = `${angle}°`;
        if (doorPill) {
          doorPill.textContent = angle === 0 ? '🔒 Closed (0°)' : (angle >= 75 ? `✨ Open (${angle}°)` : `🚪 Ajar (${angle}°)`);
        }
        this.showToast(angle === 0 ? '🔒 Door closed (0°)' : (angle >= 75 ? `✨ Door fully opened (${angle}°)` : `🚪 Door set ajar (${angle}°)`));
      });
    });

    this.syncRoomVariantsUI(document.getElementById('room-type')?.value || 'bedroom');
  }

  // Complete House Navigation & Active Room Synchronizer
  syncRoomVariantsUI(currentRoomType) {
    const isDuplex = (currentRoomType === 'duplex' || currentRoomType === 'duplex_villa' || this.currentHouseType === 'duplex');
    const is3BHK = (currentRoomType === 'complete_house_3bhk' || currentRoomType === '3bhk' || this.currentHouseType === '3bhk');
    const is2BHK = (currentRoomType === 'complete_house_2bhk' || this.currentHouseType === '2bhk');
    const isHouse = (currentRoomType === 'complete_house' || is2BHK || is3BHK || isDuplex);
    if (isHouse) {
      this.currentHouseType = isDuplex ? 'duplex' : (is3BHK ? '3bhk' : (is2BHK ? '2bhk' : '1bhk'));
    }
    const houseHub = document.getElementById('house-hub-wrapper');
    const houseNav = document.getElementById('house-navigator-bar');
    if (houseHub) houseHub.style.display = isHouse ? 'block' : 'none';
    if (houseNav) houseNav.style.display = isHouse ? 'flex' : 'none';

    // Synchronize Architectural Door UI
    const doorWall = document.getElementById('door-wall-select');
    const doorPos = document.getElementById('door-pos-slider');
    const doorPosVal = document.getElementById('door-pos-val');
    const doorW = document.getElementById('door-w-slider');
    const doorWVal = document.getElementById('door-w-val');
    const doorSwing = document.getElementById('door-swing-slider');
    const doorSwingVal = document.getElementById('door-swing-val');
    const doorPill = document.getElementById('door-status-pill');
    const doorFinish = document.getElementById('door-finish-select');

    if (isHouse) {
      if (doorWall) {
        doorWall.innerHTML = '<option value="front" selected>🚪 Foyer Front Entrance</option>';
        doorWall.disabled = true;
      }
      if (doorPos) {
        doorPos.min = "-0.35";
        doorPos.max = "0.35";
        doorPos.step = "0.05";
        doorPos.value = (this.roomBuilder?.doorConfig?.offset || 0).toString();
      }
      if (doorPosVal) {
        const off = this.roomBuilder?.doorConfig?.offset || 0;
        doorPosVal.textContent = `${off >= 0 ? '+' : ''}${off.toFixed(2)}m`;
      }
      if (doorW) {
        doorW.min = "0.85";
        doorW.max = "1.25";
        doorW.step = "0.05";
        doorW.value = (this.roomBuilder?.doorConfig?.width || 1.05).toString();
      }
      if (doorWVal) {
        doorWVal.textContent = `${(this.roomBuilder?.doorConfig?.width || 1.05).toFixed(2)}m`;
      }
    } else {
      if (doorWall) {
        doorWall.disabled = false;
        doorWall.innerHTML = `
          <option value="right"${this.roomBuilder?.doorConfig?.wall === 'right' ? ' selected' : ''}>Right Wall</option>
          <option value="back"${this.roomBuilder?.doorConfig?.wall === 'back' ? ' selected' : ''}>Back Wall</option>
          <option value="left"${this.roomBuilder?.doorConfig?.wall === 'left' ? ' selected' : ''}>Left Wall</option>
        `;
      }
      if (doorPos) {
        doorPos.min = "-2.0";
        doorPos.max = "2.0";
        doorPos.step = "0.1";
        doorPos.value = (this.roomBuilder?.doorConfig?.offset || 0).toString();
      }
      if (doorW) {
        doorW.min = "0.7";
        doorW.max = "1.3";
        doorW.step = "0.05";
        doorW.value = (this.roomBuilder?.doorConfig?.width || 0.9).toString();
      }
    }

    if (doorFinish && this.roomBuilder?.doorConfig?.finish) {
      doorFinish.value = this.roomBuilder.doorConfig.finish;
    }
    const currentAngle = this.roomBuilder?.doorConfig?.openAngle || 0;
    if (doorSwing) doorSwing.value = currentAngle;
    if (doorSwingVal) doorSwingVal.textContent = `${currentAngle}°`;
    if (doorPill) {
      doorPill.textContent = currentAngle === 0 ? '🔒 Closed (0°)' : (currentAngle >= 75 ? `✨ Open (${currentAngle}°)` : `🚪 Ajar (${currentAngle}°)`);
    }

    if (isHouse) {
      document.querySelectorAll('.house-type-toggle-btn').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-house-type') === this.currentHouseType);
      });
      const housePill = document.getElementById('house-active-room-pill');
      if (housePill) {
        if (isDuplex) {
          housePill.textContent = 'Modern Duplex Villa Active';
        } else if (is3BHK) {
          housePill.textContent = 'Luxury 3 BHK Residence Active';
        } else if (is2BHK) {
          housePill.textContent = 'Architectural 2 BHK Residence Active';
        } else {
          housePill.textContent = 'Single Bedroom House (1 BHK) Active';
        }
      }

      // Hub & Nav elements
      const hubFoyerBtn = document.getElementById('hub-zone-foyer');
      const navFoyerBtn = document.getElementById('nav-btn-foyer');
      const hubRearBtn = document.getElementById('hub-zone-rear');
      const navRearBtn = document.getElementById('nav-btn-rear');
      const hubBed3Btn = document.getElementById('hub-zone-bed3');
      const navBed3Btn = document.getElementById('nav-btn-bed3');
      const hubBalconyBtn = document.getElementById('hub-zone-balcony');
      const navBalconyBtn = document.getElementById('nav-btn-balcony');
      const hubStaircaseBtn = document.getElementById('hub-zone-staircase');
      const navStairsBtn = document.getElementById('nav-btn-stairs');
      const hubMezzanineBtn = document.getElementById('hub-zone-mezzanine');
      const navMezzanineBtn = document.getElementById('nav-btn-mezzanine');
      const hubSkyLoungeBtn = document.getElementById('hub-zone-skylounge');
      const navSkyLoungeBtn = document.getElementById('nav-btn-sky-lounge');
      const hubTerraceBtn = document.getElementById('hub-zone-terrace');
      const hubBathBtn = document.getElementById('hub-zone-bath');
      const navBathBtn = document.getElementById('nav-btn-bath');
      const hubMasterBathBtn = document.getElementById('hub-zone-master-bath');
      const navMasterBathBtn = document.getElementById('nav-btn-master-bath');
      const navYardBtn = document.getElementById('nav-btn-yard');

      // Reset specific elements
      [hubBed3Btn, navBed3Btn, hubBalconyBtn, navBalconyBtn, hubStaircaseBtn, navStairsBtn, hubMezzanineBtn, navMezzanineBtn, hubSkyLoungeBtn, navSkyLoungeBtn, hubTerraceBtn].forEach(el => {
        if (el) el.style.display = 'none';
      });

      if (isDuplex) {
        if (hubFoyerBtn) hubFoyerBtn.style.display = 'inline-flex';
        if (navFoyerBtn) navFoyerBtn.style.display = 'inline-flex';
        if (hubRearBtn) {
          hubRearBtn.style.display = 'inline-flex';
          hubRearBtn.innerHTML = '👑 Penthouse (L2)';
          hubRearBtn.setAttribute('data-zone', 'bedroom2');
        }
        if (navRearBtn) {
          navRearBtn.style.display = 'inline-flex';
          navRearBtn.innerHTML = '<span>👑</span> Penthouse (L2)';
          navRearBtn.setAttribute('data-target-room', 'bedroom2');
        }
        if (hubStaircaseBtn) hubStaircaseBtn.style.display = 'inline-flex';
        if (navStairsBtn) navStairsBtn.style.display = 'inline-flex';
        if (hubMezzanineBtn) hubMezzanineBtn.style.display = 'inline-flex';
        if (navMezzanineBtn) navMezzanineBtn.style.display = 'inline-flex';
        if (hubSkyLoungeBtn) hubSkyLoungeBtn.style.display = 'inline-flex';
        if (navSkyLoungeBtn) navSkyLoungeBtn.style.display = 'inline-flex';
        if (hubTerraceBtn) hubTerraceBtn.style.display = 'inline-flex';
        if (hubBathBtn) hubBathBtn.style.display = 'inline-flex';
        if (navBathBtn) navBathBtn.style.display = 'inline-flex';
        if (hubMasterBathBtn) {
          hubMasterBathBtn.style.display = 'inline-flex';
          hubMasterBathBtn.innerHTML = '🛁 Spa Bath (L2)';
        }
        if (navMasterBathBtn) {
          navMasterBathBtn.style.display = 'inline-flex';
          navMasterBathBtn.innerHTML = '<span>🛁</span> Spa Bath';
        }
        if (navYardBtn) navYardBtn.style.display = 'none';
      } else if (is3BHK) {
        if (hubFoyerBtn) hubFoyerBtn.style.display = 'inline-flex';
        if (navFoyerBtn) navFoyerBtn.style.display = 'inline-flex';
        if (hubRearBtn) {
          hubRearBtn.style.display = 'inline-flex';
          hubRearBtn.innerHTML = '🛏️ Bed 2';
          hubRearBtn.setAttribute('data-zone', 'bedroom2');
        }
        if (navRearBtn) {
          navRearBtn.style.display = 'inline-flex';
          navRearBtn.innerHTML = '<span>🛏️</span> Bed 2';
          navRearBtn.setAttribute('data-target-room', 'bedroom2');
        }
        if (hubBed3Btn) hubBed3Btn.style.display = 'inline-flex';
        if (navBed3Btn) navBed3Btn.style.display = 'inline-flex';
        if (hubBalconyBtn) hubBalconyBtn.style.display = 'inline-flex';
        if (navBalconyBtn) navBalconyBtn.style.display = 'inline-flex';
        if (hubBathBtn) hubBathBtn.style.display = 'inline-flex';
        if (navBathBtn) navBathBtn.style.display = 'inline-flex';
        if (hubMasterBathBtn) {
          hubMasterBathBtn.style.display = 'inline-flex';
          hubMasterBathBtn.innerHTML = '🛁 Master Bath';
        }
        if (navMasterBathBtn) {
          navMasterBathBtn.style.display = 'inline-flex';
          navMasterBathBtn.innerHTML = '<span>🛁</span> Master Bath';
        }
        if (navYardBtn) navYardBtn.style.display = 'none';
      } else if (is2BHK) {
        if (hubFoyerBtn) hubFoyerBtn.style.display = 'inline-flex';
        if (navFoyerBtn) navFoyerBtn.style.display = 'inline-flex';
        if (hubRearBtn) {
          hubRearBtn.style.display = 'inline-flex';
          hubRearBtn.innerHTML = '🛏️ Bed 2';
          hubRearBtn.setAttribute('data-zone', 'bedroom2');
        }
        if (navRearBtn) {
          navRearBtn.style.display = 'inline-flex';
          navRearBtn.innerHTML = '<span>🛏️</span> Bed 2';
          navRearBtn.setAttribute('data-target-room', 'bedroom2');
        }
        if (hubBathBtn) hubBathBtn.style.display = 'inline-flex';
        if (navBathBtn) navBathBtn.style.display = 'inline-flex';
        if (hubMasterBathBtn) {
          hubMasterBathBtn.style.display = 'inline-flex';
          hubMasterBathBtn.innerHTML = '🛁 Master Bath';
        }
        if (navMasterBathBtn) {
          navMasterBathBtn.style.display = 'inline-flex';
          navMasterBathBtn.innerHTML = '<span>🛁</span> Master Bath';
        }
        if (navYardBtn) navYardBtn.style.display = 'inline-flex';
      } else {
        // 1 BHK
        if (hubFoyerBtn) hubFoyerBtn.style.display = 'inline-flex';
        if (navFoyerBtn) navFoyerBtn.style.display = 'inline-flex';
        if (hubRearBtn) hubRearBtn.style.display = 'none';
        if (navRearBtn) navRearBtn.style.display = 'none';
        if (hubBathBtn) hubBathBtn.style.display = 'none';
        if (navBathBtn) navBathBtn.style.display = 'none';
        if (hubMasterBathBtn) {
          hubMasterBathBtn.style.display = 'inline-flex';
          hubMasterBathBtn.innerHTML = '🛁 Master Bath';
        }
        if (navMasterBathBtn) {
          navMasterBathBtn.style.display = 'inline-flex';
          navMasterBathBtn.innerHTML = '<span>🛁</span> Master Bath';
        }
        if (navYardBtn) navYardBtn.style.display = 'none';
      }
    }
  }

  // Backward compatibility alias
  syncBedroomVariantsUI(currentRoomType) {
    this.syncRoomVariantsUI(currentRoomType);
  }

  // Complete House Room Navigator Focus & Camera Transition
  focusRoom(zoneKey, animate = true) {
    this.currentHouseZone = zoneKey;

    // Update buttons in #house-navigator-bar
    document.querySelectorAll('.house-nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.targetRoom === zoneKey);
    });

    // Update buttons in #house-hub-wrapper
    document.querySelectorAll('.house-zone-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.zone === zoneKey);
    });

    const pill = document.getElementById('house-active-room-pill');
    const isDuplex = (this.currentHouseType === 'duplex') || (document.getElementById('room-type')?.value === 'duplex');
    const is3BHK = (this.currentHouseType === '3bhk') || (document.getElementById('room-type')?.value === 'complete_house_3bhk');
    const is2BHK = (this.currentHouseType === '2bhk') || (document.getElementById('room-type')?.value === 'complete_house_2bhk');
    const titles = {
      all: isDuplex ? 'Modern Duplex Villa' : (is3BHK ? 'Luxury 3 BHK Residence' : (is2BHK ? 'Architectural 2 BHK Residence' : 'Single Bedroom House (1 BHK)')),
      living: isDuplex ? 'Double-Height Living Lounge' : 'Living Room Lounge',
      dining: 'Dining Area',
      kitchen: isDuplex ? 'Gourmet Island Kitchen' : 'Modular Kitchen',
      bedroom: isDuplex ? 'Guest Bedroom Suite' : (is3BHK || is2BHK ? 'Master Bedroom Suite' : 'Master Bedroom'),
      bedroom2: isDuplex ? 'Penthouse Master Suite (L2)' : 'Second Bedroom',
      bedroom3: 'Third Bedroom / Study',
      foyer: isDuplex ? 'Grand Entrance Foyer' : 'Entrance Foyer',
      common_bath: isDuplex ? 'Guest Bathroom' : 'Common Bathroom',
      master_bath: isDuplex ? 'Master Spa Bathroom (L2)' : 'Master En-Suite Bathroom',
      staircase: 'Floating Cantilevered Staircase',
      mezzanine: 'Mezzanine Gallery (L2)',
      sky_lounge: 'Upper Loft Sky Lounge (L2)',
      balcony: 'Front Balcony Deck',
      terrace: 'Sunken Terrace & Pool Deck',
      backyard: 'Backyard Garden & Patio'
    };
    if (pill) pill.textContent = (titles[zoneKey] || 'Room') + ' Active';

    // Show corresponding room variant selector in sidebar
    this.syncRoomVariantsUI(document.getElementById('room-type')?.value || 'complete_house');

    // Camera target positions
    let targetPos, targetLook;
    if (isDuplex) {
      switch (zoneKey) {
        case 'foyer':
          targetPos = new THREE.Vector3(-4.6, 3.8, 8.8);
          targetLook = new THREE.Vector3(-4.6, 1.2, 4.8);
          this.showToast('🚪 Viewing Grand Entrance Foyer');
          break;
        case 'living':
          targetPos = new THREE.Vector3(-0.5, 5.0, 9.2);
          targetLook = new THREE.Vector3(-0.5, 2.0, 3.7);
          this.showToast('🛋️ Viewing Double-Height Grand Living Lounge');
          break;
        case 'dining':
          targetPos = new THREE.Vector3(4.35, 4.5, 8.5);
          targetLook = new THREE.Vector3(4.35, 1.2, 4.1);
          this.showToast('🍽️ Viewing Formal Dining Area');
          break;
        case 'kitchen':
          targetPos = new THREE.Vector3(4.35, 4.5, 3.5);
          targetLook = new THREE.Vector3(4.35, 1.2, -0.5);
          this.showToast('🍳 Viewing Gourmet Modular Kitchen');
          break;
        case 'bedroom':
          targetPos = new THREE.Vector3(-4.15, 4.5, 1.2);
          targetLook = new THREE.Vector3(-4.15, 1.2, -3.5);
          this.showToast('🛏️ Viewing Ground Guest Suite');
          break;
        case 'common_bath':
          targetPos = new THREE.Vector3(-0.5, 4.0, 0.5);
          targetLook = new THREE.Vector3(-0.5, 1.2, -3.0);
          this.showToast('🚿 Viewing Ground Guest Bathroom');
          break;
        case 'staircase':
          targetPos = new THREE.Vector3(-1.8, 4.2, 7.2);
          targetLook = new THREE.Vector3(1.0, 2.0, 3.5);
          this.showToast('🪜 Viewing Architectural Floating Staircase');
          break;
        case 'mezzanine':
          targetPos = new THREE.Vector3(0.0, 6.0, 6.8);
          targetLook = new THREE.Vector3(1.4, 3.8, 3.2);
          this.showToast('✨ Viewing Mezzanine Gallery & Walkway (Level 2)');
          break;
        case 'bedroom2':
          targetPos = new THREE.Vector3(4.35, 6.2, 4.8);
          targetLook = new THREE.Vector3(4.35, 3.8, 0.0);
          this.showToast('👑 Viewing Penthouse Master Suite (Level 2)');
          break;
        case 'master_bath':
          targetPos = new THREE.Vector3(4.35, 6.0, -1.0);
          targetLook = new THREE.Vector3(4.35, 3.8, -4.5);
          this.showToast('🛁 Viewing Master Spa Bathroom (Level 2)');
          break;
        case 'sky_lounge':
          targetPos = new THREE.Vector3(-3.5, 6.2, 1.5);
          targetLook = new THREE.Vector3(-3.5, 3.8, -2.75);
          this.showToast('🌆 Viewing Upper Loft Sky Lounge & Study (Level 2)');
          break;
        case 'terrace':
          targetPos = new THREE.Vector3(4.35, 4.5, 10.5);
          targetLook = new THREE.Vector3(4.35, 1.0, 7.4);
          this.showToast('🌿 Viewing Outdoor Sunken Terrace & Pool Deck');
          break;
        case 'all':
        default:
          targetPos = new THREE.Vector3(0, 19.0, 20.0);
          targetLook = new THREE.Vector3(0, 1.4, 0.5);
          this.showToast('🏙️ Viewing Modern Duplex Villa (Double-Height Architecture)');
          break;
      }
    } else if (is3BHK) {
      switch (zoneKey) {
        case 'foyer':
          targetPos = new THREE.Vector3(-5.0, 3.8, 8.8);
          targetLook = new THREE.Vector3(-5.0, 1.2, 4.95);
          this.showToast('🚪 Viewing Entrance Foyer');
          break;
        case 'living':
          targetPos = new THREE.Vector3(-0.5, 4.2, 8.5);
          targetLook = new THREE.Vector3(-0.5, 1.2, 4.15);
          this.showToast('🛋️ Viewing Living Room Lounge');
          break;
        case 'dining':
          targetPos = new THREE.Vector3(5.0, 4.2, 8.5);
          targetLook = new THREE.Vector3(5.0, 1.2, 4.15);
          this.showToast('🍽️ Viewing Dining Pavilion');
          break;
        case 'kitchen':
          targetPos = new THREE.Vector3(5.0, 4.2, 3.5);
          targetLook = new THREE.Vector3(5.0, 1.2, -0.35);
          this.showToast('🍳 Viewing Modular Kitchen & Island');
          break;
        case 'bedroom':
          targetPos = new THREE.Vector3(5.0, 4.2, -1.0);
          targetLook = new THREE.Vector3(5.0, 1.2, -5.25);
          this.showToast('👑 Viewing Master Bedroom Suite (Bed 1)');
          break;
        case 'master_bath':
          targetPos = new THREE.Vector3(6.3, 3.8, 2.5);
          targetLook = new THREE.Vector3(6.3, 1.2, -1.15);
          this.showToast('🛁 Viewing Master En-Suite Bathroom');
          break;
        case 'bedroom2':
          targetPos = new THREE.Vector3(-5.0, 4.2, -1.0);
          targetLook = new THREE.Vector3(-5.0, 1.2, -5.25);
          this.showToast('🛏️ Viewing Second Bedroom (Bed 2)');
          break;
        case 'bedroom3':
          targetPos = new THREE.Vector3(-5.5, 4.2, 3.5);
          targetLook = new THREE.Vector3(-5.5, 1.2, -0.35);
          this.showToast('🧸 Viewing Third Bedroom / Executive Study (Bed 3)');
          break;
        case 'common_bath':
          targetPos = new THREE.Vector3(-2.25, 3.8, 2.5);
          targetLook = new THREE.Vector3(-2.25, 1.2, -1.15);
          this.showToast('🚿 Viewing Common Bathroom');
          break;
        case 'balcony':
          targetPos = new THREE.Vector3(-0.5, 3.5, 10.5);
          targetLook = new THREE.Vector3(-0.5, 1.0, 7.45);
          this.showToast('🌅 Viewing Private Balcony Deck');
          break;
        case 'all':
        default:
          targetPos = new THREE.Vector3(0, 18.0, 21.0);
          targetLook = new THREE.Vector3(0, 0.8, 0.5);
          this.showToast('🏰 Viewing Luxury 3 BHK Residence (All 10 Connected Spaces)');
          break;
      }
    } else if (is2BHK) {
      switch (zoneKey) {
        case 'living':
          targetPos = new THREE.Vector3(-0.4, 4.2, 8.5);
          targetLook = new THREE.Vector3(-0.4, 1.2, 4.1);
          this.showToast('🛋️ Viewing Living Room Lounge');
          break;
        case 'dining':
          targetPos = new THREE.Vector3(0.3, 4.2, 5.0);
          targetLook = new THREE.Vector3(0.3, 1.1, 0.1);
          this.showToast('🍽️ Viewing Dining Area');
          break;
        case 'kitchen':
          targetPos = new THREE.Vector3(0.3, 4.2, 1.0);
          targetLook = new THREE.Vector3(0.3, 1.1, -3.8);
          this.showToast('🍳 Viewing Modular Kitchen');
          break;
        case 'bedroom':
          targetPos = new THREE.Vector3(4.4, 4.2, 8.2);
          targetLook = new THREE.Vector3(4.4, 1.2, 3.7);
          this.showToast('👑 Viewing Master Bedroom Suite');
          break;
        case 'bedroom2':
          targetPos = new THREE.Vector3(-4.0, 4.2, 2.5);
          targetLook = new THREE.Vector3(-4.0, 1.2, -2.7);
          this.showToast('🛏️ Viewing Second Bedroom');
          break;
        case 'foyer':
          targetPos = new THREE.Vector3(-4.7, 3.8, 8.8);
          targetLook = new THREE.Vector3(-4.7, 1.2, 4.9);
          this.showToast('🚪 Viewing Entrance Foyer');
          break;
        case 'common_bath':
          targetPos = new THREE.Vector3(-4.7, 3.8, 5.8);
          targetLook = new THREE.Vector3(-4.7, 1.2, 2.0);
          this.showToast('🚿 Viewing Common Bathroom');
          break;
        case 'master_bath':
          targetPos = new THREE.Vector3(5.4, 3.8, 3.0);
          targetLook = new THREE.Vector3(5.4, 1.2, -0.5);
          this.showToast('🛁 Viewing Master En-Suite Bathroom');
          break;
        case 'walk_in_closet':
          targetPos = new THREE.Vector3(3.4, 3.8, 3.0);
          targetLook = new THREE.Vector3(3.4, 1.2, -0.5);
          this.showToast('👗 Viewing Walk-In Wardrobe');
          break;
        case 'backyard':
          targetPos = new THREE.Vector3(4.4, 6.5, -3.5);
          targetLook = new THREE.Vector3(4.4, 1.0, -7.5);
          this.showToast('🌿 Viewing Backyard Garden & Patio');
          break;
        case 'all':
        default:
          targetPos = new THREE.Vector3(0, 16.5, 19.5);
          targetLook = new THREE.Vector3(0, 0.8, 0.5);
          this.showToast('🏛️ Viewing Architectural 2 BHK Residence (All Rooms)');
          break;
      }
    } else {
      // 1 BHK (Single Bedroom House - 6 Rooms: Foyer, Living, Dining, Kitchen, Master Bedroom, Master Bathroom)
      switch (zoneKey) {
        case 'foyer':
          targetPos = new THREE.Vector3(-4.7, 3.8, 8.8);
          targetLook = new THREE.Vector3(-4.7, 1.2, 4.6);
          this.showToast('🚪 Viewing Entrance Foyer');
          break;
        case 'living':
          targetPos = new THREE.Vector3(-0.1, 4.2, 8.5);
          targetLook = new THREE.Vector3(-0.1, 1.2, 4.1);
          this.showToast('🛋️ Viewing Living Room Lounge');
          break;
        case 'dining':
          targetPos = new THREE.Vector3(4.9, 4.2, 8.5);
          targetLook = new THREE.Vector3(4.9, 1.2, 4.1);
          this.showToast('🍽️ Viewing Dining Area');
          break;
        case 'kitchen':
          targetPos = new THREE.Vector3(4.9, 4.2, 2.0);
          targetLook = new THREE.Vector3(4.9, 1.2, -2.2);
          this.showToast('🍳 Viewing Modular Kitchen');
          break;
        case 'bedroom':
          targetPos = new THREE.Vector3(-3.5, 4.2, 2.5);
          targetLook = new THREE.Vector3(-3.5, 1.2, -2.0);
          this.showToast('👑 Viewing Master Bedroom Suite');
          break;
        case 'master_bath':
          targetPos = new THREE.Vector3(1.1, 3.8, 0.5);
          targetLook = new THREE.Vector3(1.1, 1.2, -3.6);
          this.showToast('🛁 Viewing Master En-Suite Bathroom');
          break;
        case 'all':
        default:
          targetPos = new THREE.Vector3(0, 16.5, 18.5);
          targetLook = new THREE.Vector3(0, 0.8, 0.5);
          this.showToast('🏠 Viewing Single Bedroom House (All 6 Connected Rooms)');
          break;
      }
    }

    if (animate) {
      this.cameraAnimation = {
        targetPos: targetPos,
        targetLook: targetLook
      };
    } else {
      this.cameraAnimation = null;
      this.camera.position.copy(targetPos);
      this.controls.target.copy(targetLook);
      this.controls.update();
    }
  }

  // 6. CAMERA PRESETS & WALKTHROUGH
  setCameraPreset(mode) {
    if (mode === 'flow') {
      this.startRealTimeRoomFlowTour();
      return;
    }

    if (this.isTouring) {
      this.stopRealTimeRoomFlowTour();
    }

    const hud = document.getElementById('walkthrough-hud');
    if (mode === 'walk') {
      this.isWalkthrough = true;
      if (hud) hud.style.display = 'block';
      if (this.roomBuilder.isCompleteHouse) {
        this.camera.position.set(-4.0, 1.6, 4.5);
        this.controls.target.set(-4.0, 1.55, 2.0);
      } else {
        this.camera.position.set(0, 1.6, 1.6);
        this.controls.target.set(0, 1.55, -0.6);
      }
      this.controls.maxPolarAngle = Math.PI - 0.05;
      this.controls.minDistance = 0.05;
      this.showToast('Walkthrough active! Use WASD or Arrow Keys to walk through the house');
    } else {
      this.isWalkthrough = false;
      if (hud) hud.style.display = 'none';
      this.controls.maxPolarAngle = Math.PI / 2 - 0.02;
      this.controls.minDistance = 2.0;
      this.cameraAnimation = null;

      if (this.roomBuilder.isCompleteHouse) {
        this.controls.maxDistance = 45.0;
        switch (mode) {
          case 'top':
            this.camera.position.set(0, 22.0, 0.001);
            this.controls.target.set(0, 0, 0.25);
            this.showToast('🗺️ Viewing Top-Down 3D Floor Plan');
            break;
          case 'front':
            this.camera.position.set(0, 3.5, 17.5);
            this.controls.target.set(0, 1.4, 0.5);
            this.showToast('🏛️ Viewing Front Perspective House View');
            break;
          case 'living':
            this.focusRoom('living', false);
            return;
          case 'bedroom':
            this.focusRoom('bedroom', false);
            return;
          case 'kitchen':
            this.focusRoom('kitchen', false);
            return;
          case 'dining':
            this.focusRoom('dining', false);
            return;
          case 'bathroom':
            this.focusRoom('common_bath', false);
            return;
          case '3d':
          default:
            this.camera.position.set(0, 14.5, 17.5);
            this.controls.target.set(0, 1.0, 0.5);
            this.showToast('📐 Viewing Free 3D House Overview');
            break;
        }
      } else {
        this.controls.maxDistance = 20.0;
        switch (mode) {
          case 'top':
            this.camera.position.set(0, 9.0, 0.001);
            this.controls.target.set(0, 0, 0);
            break;
          case 'front':
            this.camera.position.set(0, 1.8, 6.5);
            this.controls.target.set(0, 1.4, 0);
            break;
          case '3d':
          default:
            this.camera.position.set(0, 4.5, 6.8);
            this.controls.target.set(0, 1.0, 0);
            break;
        }
      }
    }
    this.controls.update();
  }

  // REAL-TIME ROOM FLOW ANIMATED WALKTHROUGH TOUR
  startRealTimeRoomFlowTour() {
    this.isTouring = true;
    this.isWalkthrough = true;
    const isDuplex = (this.currentHouseType === 'duplex') || (document.getElementById('room-type')?.value === 'duplex');
    const is3BHK = (this.currentHouseType === '3bhk') || (document.getElementById('room-type')?.value === 'complete_house_3bhk');
    const is2BHK = (this.currentHouseType === '2bhk') || (document.getElementById('room-type')?.value === 'complete_house_2bhk');
    const hud = document.getElementById('walkthrough-hud');
    if (hud) {
      hud.style.display = 'block';
      const pill = hud.querySelector('.hud-pill span');
      if (pill) {
        if (isDuplex) {
          pill.innerHTML = '🌊 <strong>Room Flow Tour Active</strong>: Foyer → Double-Height Living → Dining → Kitchen → Guest Suite → Floating Stairs → Mezzanine → Penthouse Master → Spa Bath → Sky Lounge';
        } else if (is3BHK) {
          pill.innerHTML = '🌊 <strong>Room Flow Tour Active</strong>: Foyer → Living → Balcony → Dining → Kitchen → Master Suite & Bath → Bed 2 → Bed 3 → Common Bath';
        } else if (is2BHK) {
          pill.innerHTML = '🌊 <strong>Room Flow Tour Active</strong>: Foyer → Living → Dining → Kitchen → Master Suite & Bath → Bed 2 & Common Bath';
        } else {
          pill.innerHTML = '🌊 <strong>Room Flow Tour Active</strong>: Foyer → Living → Dining → Modular Kitchen → Master Suite → En-Suite Bath';
        }
      }
    }
    this.showToast(isDuplex
      ? '🌊 Real-time tour started: Foyer → Living → Kitchen → Floating Stairs → Penthouse Master'
      : (is3BHK
        ? '🌊 Real-time tour started: Foyer → Living → Balcony → Dining → Master Suite → Bed 2 & 3'
        : (is2BHK
          ? '🌊 Real-time architectural tour started: Foyer → Living → Dining → Kitchen → Master Suite → Bed 2'
          : '🌊 Real-time tour started: Foyer → Living → Dining → Kitchen → Master Suite → Master Bath')));

    const waypoints = isDuplex ? [
      { pos: new THREE.Vector3(-4.6, 1.55, 5.8), target: new THREE.Vector3(-4.6, 1.35, 3.5), duration: 4000, desc: '🚪 Grand Entrance Foyer with Fluted Marble Console' },
      { pos: new THREE.Vector3(-0.5, 1.8, 5.2), target: new THREE.Vector3(-3.0, 2.0, 3.7), duration: 4500, desc: '🛋️ Double-Height 5.6m Grand Living Lounge with 4K Entertainment' },
      { pos: new THREE.Vector3(4.35, 1.55, 5.2), target: new THREE.Vector3(4.35, 1.35, 3.5), duration: 4000, desc: '🍽️ Formal Dining Area with Solid Walnut Table & Chandelier' },
      { pos: new THREE.Vector3(4.35, 1.55, 1.5), target: new THREE.Vector3(4.35, 1.35, -1.5), duration: 4500, desc: '🍳 Gourmet Modular Kitchen with Waterfall Prep Island & Stools' },
      { pos: new THREE.Vector3(-4.15, 1.55, -1.5), target: new THREE.Vector3(-4.15, 1.35, -5.5), duration: 4500, desc: '🛏️ Ground Guest Bedroom Suite with Wardrobe & Garden View' },
      { pos: new THREE.Vector3(1.0, 1.6, 5.2), target: new THREE.Vector3(1.0, 3.2, 2.0), duration: 4000, desc: '🪜 Floating Cantilevered Staircase with Glass Railing & Under-Step Glow' },
      { pos: new THREE.Vector3(1.4, 4.3, 3.8), target: new THREE.Vector3(-0.5, 2.0, 3.7), duration: 4500, desc: '✨ Elevated Mezzanine Gallery Walkway Overlooking Living Void' },
      { pos: new THREE.Vector3(4.35, 4.35, 2.0), target: new THREE.Vector3(4.35, 4.15, -1.8), duration: 5000, desc: '👑 Penthouse Master Suite (Level 2) with King Bed & Glass Wardrobe' },
      { pos: new THREE.Vector3(4.35, 4.35, -2.5), target: new THREE.Vector3(4.35, 4.15, -4.5), duration: 4000, desc: '🛁 Master Spa Bathroom (Level 2) with Double Shower & Dual Vanity' },
      { pos: new THREE.Vector3(-3.5, 4.35, -0.5), target: new THREE.Vector3(-3.5, 4.15, -3.5), duration: 4500, desc: '🌆 Upper Loft Sky Lounge & Executive Mezzanine Study (Level 2)' }
    ] : (is3BHK ? [
      { pos: new THREE.Vector3(-5.0, 1.55, 5.8), target: new THREE.Vector3(-5.0, 1.35, 3.8), duration: 4000, desc: '🚪 Entrance Foyer with Slatted Teak Screen & Console' },
      { pos: new THREE.Vector3(-0.5, 1.55, 5.0), target: new THREE.Vector3(-3.25, 1.35, 4.15), duration: 4500, desc: '🛋️ Open Living Lounge with Missouri TV Unit Facing Sectional Sofa' },
      { pos: new THREE.Vector3(-0.5, 1.45, 7.2), target: new THREE.Vector3(-0.5, 1.25, 8.0), duration: 4000, desc: '🌅 Front Balcony Deck with Outdoor Teak Lounge Armchairs & Planters' },
      { pos: new THREE.Vector3(5.0, 1.55, 5.0), target: new THREE.Vector3(5.0, 1.35, 3.8), duration: 4000, desc: '🍽️ Dining Pavilion with Solid Hardwood Table & Chandelier' },
      { pos: new THREE.Vector3(5.0, 1.55, 1.5), target: new THREE.Vector3(5.0, 1.35, -1.5), duration: 4500, desc: '🍳 Modular Kitchen with Prep Island, Breakfast Stools & Double Sink' },
      { pos: new THREE.Vector3(5.0, 1.55, -3.2), target: new THREE.Vector3(5.0, 1.35, -6.8), duration: 5000, desc: '👑 Master Bedroom Suite (Bed 1) with King Bed, Wardrobe & Vanity' },
      { pos: new THREE.Vector3(6.3, 1.55, -0.2), target: new THREE.Vector3(6.3, 1.35, -1.5), duration: 4000, desc: '🛁 Master En-Suite Bathroom with Glass Rain Shower & Floating Vanity' },
      { pos: new THREE.Vector3(-5.0, 1.55, -3.2), target: new THREE.Vector3(-5.0, 1.35, -6.8), duration: 4500, desc: '🛏️ Quiet Second Bedroom Suite (Bed 2) with Queen Bed & Study Desk' },
      { pos: new THREE.Vector3(-5.5, 1.55, 1.2), target: new THREE.Vector3(-5.5, 1.35, -1.2), duration: 4500, desc: '🧸 Third Bedroom / Executive Study (Bed 3) with Workstation & Bookshelf' },
      { pos: new THREE.Vector3(-2.25, 1.55, 0.2), target: new THREE.Vector3(-2.25, 1.35, -1.5), duration: 4000, desc: '🚿 Designer Common Family Bathroom with Shower & Vanity' }
    ] : (is2BHK ? [
      { pos: new THREE.Vector3(-4.7, 1.55, 5.6), target: new THREE.Vector3(-4.7, 1.35, 3.6), duration: 4000, desc: '🚪 Grand Entrance Foyer with Pivot Door & Slat Divider' },
      { pos: new THREE.Vector3(-0.4, 1.55, 4.6), target: new THREE.Vector3(-2.95, 1.35, 4.1), duration: 4500, desc: '🛋️ Open Living Lounge with Missouri TV Unit Facing Sectional Sofa' },
      { pos: new THREE.Vector3(0.3, 1.55, 1.4), target: new THREE.Vector3(0.3, 1.35, 0.1), duration: 4000, desc: '🍽️ Seamless transition to Central Dining Pavilion with Crockery Credenza' },
      { pos: new THREE.Vector3(0.3, 1.55, -2.0), target: new THREE.Vector3(0.3, 1.35, -5.6), duration: 4500, desc: '🍳 High-Efficiency Modular Kitchen, Waterfall Island & Range Hood' },
      { pos: new THREE.Vector3(3.4, 1.55, 3.7), target: new THREE.Vector3(5.3, 1.35, 3.7), duration: 4500, desc: '👑 Master Bedroom Suite with King Bed on East Wall & Dressing Vanity' },
      { pos: new THREE.Vector3(3.4, 1.55, -0.2), target: new THREE.Vector3(2.75, 1.35, -0.5), duration: 4000, desc: '👗 Walk-In Dressing Room with Sliding Mirrored Wardrobes' },
      { pos: new THREE.Vector3(4.9, 1.55, -0.2), target: new THREE.Vector3(5.7, 1.35, -1.3), duration: 4000, desc: '🛁 Master En-Suite Designer Bathroom with Glass Rain Shower' },
      { pos: new THREE.Vector3(-3.2, 1.55, -1.2), target: new THREE.Vector3(-5.1, 1.35, -2.7), duration: 4500, desc: '🛏️ Quiet Second Bedroom Suite with Terracotta Accent Wall & Study Desk' },
      { pos: new THREE.Vector3(-3.8, 1.55, 2.1), target: new THREE.Vector3(-5.5, 1.35, 1.4), duration: 4000, desc: '🚿 Designer Common Bathroom with Walk-In Shower & Floating Vanity' }
    ] : [
      { pos: new THREE.Vector3(-4.7, 1.55, 5.6), target: new THREE.Vector3(-4.7, 1.35, 3.8), duration: 4000, desc: '🚪 Entrance Foyer with Adjustable Door, Slat Screen & Console' },
      { pos: new THREE.Vector3(-0.1, 1.55, 4.6), target: new THREE.Vector3(-0.1, 1.35, 1.8), duration: 4500, desc: '🛋️ Open Living Lounge with Missouri 4K TV & Plush Sofa' },
      { pos: new THREE.Vector3(4.9, 1.55, 4.6), target: new THREE.Vector3(4.9, 1.35, 3.2), duration: 4000, desc: '🍽️ Formal Dining Area with Solid Hardwood Table & Chandelier' },
      { pos: new THREE.Vector3(4.9, 1.55, 0.5), target: new THREE.Vector3(4.9, 1.35, -3.2), duration: 4500, desc: '🍳 Modular Kitchen with Prep Island, Range Hood & French Refrigerator' },
      { pos: new THREE.Vector3(-3.5, 1.55, 0.5), target: new THREE.Vector3(-3.5, 1.35, -3.5), duration: 5000, desc: '👑 Master Bedroom Suite with King Bed, Dressing Vanity & Split AC' },
      { pos: new THREE.Vector3(1.1, 1.55, -2.0), target: new THREE.Vector3(1.1, 1.35, -4.5), duration: 4000, desc: '🛁 Master En-Suite Bathroom with Frameless Shower & Lighted Mirror' }
    ]));

    let currentWaypointIdx = 0;
    let startTime = performance.now();
    let startPos = this.camera.position.clone();
    let startTarget = this.controls.target.clone();

    if (this.tourAnimId) cancelAnimationFrame(this.tourAnimId);

    const step = (now) => {
      if (!this.isTouring) return;

      const wp = waypoints[currentWaypointIdx];
      const elapsed = now - startTime;
      const progress = Math.min(1.0, elapsed / wp.duration);
      const ease = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      this.camera.position.lerpVectors(startPos, wp.pos, ease);
      this.controls.target.lerpVectors(startTarget, wp.target, ease);
      this.camera.lookAt(this.controls.target);

      if (progress >= 1.0) {
        currentWaypointIdx = (currentWaypointIdx + 1) % waypoints.length;
        startTime = performance.now();
        startPos = this.camera.position.clone();
        startTarget = this.controls.target.clone();
        this.showToast(waypoints[currentWaypointIdx].desc);
      }

      this.tourAnimId = requestAnimationFrame(step);
    };

    this.tourAnimId = requestAnimationFrame(step);
  }

  stopRealTimeRoomFlowTour() {
    this.isTouring = false;
    if (this.tourAnimId) cancelAnimationFrame(this.tourAnimId);
    const hud = document.getElementById('walkthrough-hud');
    if (hud) hud.style.display = 'none';
  }

  // 7. AI DESIGN GENERATION
  async triggerAIGeneration() {
    this.showToast('AI is optimizing spatial layout...');

    const currentRoomType = document.getElementById('room-type')?.value || 'complete_house';
    const isDuplex = (currentRoomType === 'duplex' || currentRoomType === 'duplex_villa' || this.currentHouseType === 'duplex');
    const is3BHK = (currentRoomType === 'complete_house_3bhk' || currentRoomType === '3bhk' || this.currentHouseType === '3bhk');
    const is2BHK = (currentRoomType === 'complete_house_2bhk' || this.currentHouseType === '2bhk');
    const isHouse = (currentRoomType === 'complete_house' || is2BHK || is3BHK || isDuplex);
    if (isHouse) {
      this.currentHouseType = isDuplex ? 'duplex' : (is3BHK ? '3bhk' : (is2BHK ? '2bhk' : '1bhk'));
    }

    let bedType = isHouse ? (this.currentHouseRoomTypes.bedroom || 1) : 1;
    if (currentRoomType === 'bedroom_zen') bedType = 2;
    else if (currentRoomType === 'bedroom_hotel') bedType = 3;
    else if (currentRoomType === 'bedroom_scandi') bedType = 4;

    let livingType = isHouse ? (this.currentHouseRoomTypes.living || 1) : 1;
    if (currentRoomType === 'living_room_zen') livingType = 2;
    else if (currentRoomType === 'living_room_luxury') livingType = 3;
    else if (currentRoomType === 'living_room_cozy') livingType = 4;

    let diningType = isHouse ? (this.currentHouseRoomTypes.dining || 1) : 1;
    if (currentRoomType === 'dining_room_minimal') diningType = 2;
    else if (currentRoomType === 'dining_room_luxury') diningType = 3;
    else if (currentRoomType === 'dining_room_scandi') diningType = 4;

    let kitchenType = isHouse ? (this.currentHouseRoomTypes.kitchen || 1) : 1;
    if (currentRoomType === 'kitchen_lshape') kitchenType = 2;
    else if (currentRoomType === 'kitchen_galley') kitchenType = 3;
    else if (currentRoomType === 'kitchen_ushape') kitchenType = 4;

    this.syncRoomVariantsUI(currentRoomType);

    const duplexDims = { width: 16.0, length: 16.0, height: 5.6 };
    const threeBhkDims = { width: 19.0, length: 18.5, height: 2.8 };
    const villaDims = { width: 16.0, length: 18.5, height: 2.8 };
    const houseDims = isDuplex ? duplexDims : (is3BHK ? threeBhkDims : (is2BHK ? villaDims : { width: 14.0, length: 13.0, height: 2.8 }));
    const singleDims = {
      width: parseFloat(document.getElementById('room-w').value) || 5.0,
      length: parseFloat(document.getElementById('room-l').value) || 4.5,
      height: parseFloat(document.getElementById('room-h').value) || 2.8
    };

    const pref = {
      roomType: currentRoomType,
      houseType: this.currentHouseType || (is2BHK ? '2bhk' : '1bhk'),
      bedroomType: bedType,
      livingRoomType: livingType,
      diningType: diningType,
      kitchenType: kitchenType,
      dimensions: isHouse ? houseDims : singleDims,
      style: this.currentStyle,
      colorScheme: document.getElementById('color-scheme').value,
      flooring: document.getElementById('flooring-select').value,
      lighting: 'warm_ambient',
      customNotes: ''
    };

    // 1. Rebuild room architecture with new dimensions and style
    this.currentRoomDimensions = pref.dimensions;
    if (isHouse) {
      const rw = document.getElementById('room-w');
      const rl = document.getElementById('room-l');
      const rh = document.getElementById('room-h');
      if (rw) rw.value = is2BHK ? '16.0' : '14.0';
      if (rl) rl.value = is2BHK ? '18.5' : '13.0';
      if (rh) rh.value = '2.8';
      this.roomBuilder.buildCompleteHouse(0xfaf5ee, pref.flooring, this.currentHouseType);
    } else {
      this.roomBuilder.buildRoom(pref.dimensions, 0xfaf5ee, pref.flooring);
    }

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
      const colHex = designPlan.palette?.wallColorHex || ('#' + Number(designPlan.wallColorHex).toString(16).padStart(6, '0'));
      const wallPicker = document.getElementById('wall-color-picker');
      if (wallPicker) wallPicker.value = colHex;
      const setupColor = document.getElementById('setup-single-wall-color');
      if (setupColor) setupColor.value = colHex;
    }

    // 4. Populate 3D furniture
    designPlan.items.forEach(item => {
      this.addFurnitureItem(item);
    });

    // 5. Initial Camera Setup for Complete House
    if (isHouse && !this.initialHouseLoaded) {
      this.initialHouseLoaded = true;
      this.setCameraPreset('3d');
    }

    // 5. Update AI Insights Tab UI
    document.getElementById('ai-concept-title').textContent = designPlan.conceptName;
    document.getElementById('ai-concept-desc').textContent = designPlan.description;
    document.getElementById('ai-spatial-text').textContent = designPlan.spatialRationale;
    document.getElementById('ai-lighting-text').textContent = designPlan.lightingPlan;
    const budgetEl = document.getElementById('ai-total-budget');
    if (budgetEl) budgetEl.textContent = '';

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

    // Items Checklist (Display item name and placement category without costs)
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
        <span class="badge" style="background: rgba(99, 102, 241, 0.2); color: #a5b4fc; text-transform: capitalize;">${(item.type || 'fixture').replace('_', ' ')}</span>
      `;
      checklist.appendChild(row);
    });

    this.syncWallArtSetupTab();
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
      case 'missouri_tv_unit':
        meshGroup = FurnitureFactory.createMissouriTVUnit(style, itemData.color, itemData.design || itemData.variant || 1);
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
      case 'single_bed':
        meshGroup = FurnitureFactory.createSingleBed(style, itemData.color);
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
      case 'dining_table':
        meshGroup = FurnitureFactory.createDiningTable(style, itemData.color);
        break;
      case 'dining_chair':
        meshGroup = FurnitureFactory.createDiningChair(style, itemData.color, itemData.chairIndex || 1);
        break;
      case 'dining_set':
        // Decompose dining set into separate individual dining table and individual dining chairs
        const tablePos = itemData.position || [0, 0, 0];
        const table = FurnitureFactory.createDiningTable(style, itemData.color);
        table.position.set(...tablePos);
        if (itemData.rotation) table.rotation.set(...itemData.rotation);
        table.userData = { id: itemData.id || 'house_dining_set', type: 'dining_table', name: itemData.name || 'Dining Table', cost: 650, room: itemData.room };
        this.furnitureGroup.add(table);

        const chairConfigs = [
          { x: -0.55, z: 0.68, rotY: Math.PI, name: 'Dining Chair 1' },
          { x: 0.55, z: 0.68, rotY: Math.PI, name: 'Dining Chair 2' },
          { x: -0.55, z: -0.68, rotY: 0, name: 'Dining Chair 3' },
          { x: 0.55, z: -0.68, rotY: 0, name: 'Dining Chair 4' },
          { x: -1.15, z: 0, rotY: -Math.PI / 2, name: 'Dining Chair 5' },
          { x: 1.15, z: 0, rotY: Math.PI / 2, name: 'Dining Chair 6' }
        ];

        chairConfigs.forEach((cfg, idx) => {
          const chair = FurnitureFactory.createDiningChair(style, itemData.chairColor || 0xd97706, idx + 1);
          chair.name = cfg.name;
          chair.userData = { type: 'dining_chair', name: cfg.name, cost: 150 };
          chair.position.set(tablePos[0] + cfg.x, tablePos[1], tablePos[2] + cfg.z);
          chair.rotation.y = cfg.rotY;
          this.furnitureGroup.add(chair);
        });

        this.showToast('Added Dining Table and 6 separate moveable Dining Chairs!');
        return;
      case 'bookshelf':
        meshGroup = FurnitureFactory.createBookshelf(style);
        break;
      case 'plant':
        meshGroup = FurnitureFactory.createPlant();
        break;
      case 'wall_art':
        meshGroup = FurnitureFactory.createWallArt(
          style,
          itemData.artTheme || 'geometric',
          itemData.artWidth || 1.2,
          itemData.artHeight || 0.9,
          itemData.frameColor
        );
        break;
      case 'rug':
        const [w, l] = itemData.dimensions || [2.4, 1.8];
        meshGroup = FurnitureFactory.createRug(w, l, style);
        break;
      case 'wardrobe':
        meshGroup = FurnitureFactory.createWardrobe(style, itemData.color);
        break;
      case 'mirrored_wardrobe':
        meshGroup = FurnitureFactory.createMirroredWardrobe(style, itemData.color);
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
      case 'kitchen_cabinets':
        meshGroup = FurnitureFactory.createKitchenCabinets(style, itemData.color);
        break;
      case 'straight_kitchen':
      case 'single_wall_kitchen':
        meshGroup = FurnitureFactory.createStraightModularKitchen(style, itemData.color);
        break;
      case 'kitchen_island':
        meshGroup = FurnitureFactory.createKitchenIsland(style, itemData.color);
        break;
      case 'refrigerator':
        meshGroup = FurnitureFactory.createRefrigerator(style);
        break;
      case 'kitchen_range':
        meshGroup = FurnitureFactory.createKitchenRange(style);
        break;
      case 'bar_stool':
        meshGroup = FurnitureFactory.createBarStool(style, itemData.color, itemData.stoolIndex || 1);
        break;
      case 'washing_machine':
        meshGroup = FurnitureFactory.createWashingMachine(style, itemData.color);
        break;
      case 'microwave':
        meshGroup = FurnitureFactory.createMicrowave(style, itemData.color);
        break;
      case 'air_conditioner':
        meshGroup = FurnitureFactory.createAirConditioner(style);
        break;
      case 'ceiling_fan':
        meshGroup = FurnitureFactory.createCeilingFan(style, itemData.color);
        break;
      case 'coffee_machine':
        meshGroup = FurnitureFactory.createCoffeeMachine(style);
        break;
      case 'shoe_rack':
        meshGroup = FurnitureFactory.createShoeRack(style, itemData.color);
        break;
      case 'coat_rack':
        meshGroup = FurnitureFactory.createCoatRack(style);
        break;
      case 'trash_bin':
        meshGroup = FurnitureFactory.createTrashBin(style);
        break;
      case 'laundry_basket':
        meshGroup = FurnitureFactory.createLaundryBasket(style, itemData.color);
        break;
      case 'wall_clock':
        meshGroup = FurnitureFactory.createWallClock(style);
        break;
      case 'table_lamp':
        meshGroup = FurnitureFactory.createTableLamp(style, itemData.color);
        break;
      case 'ottoman':
        meshGroup = FurnitureFactory.createOttoman(style, itemData.color);
        break;
      case 'curtains':
        meshGroup = FurnitureFactory.createCurtains(style, itemData.color);
        break;
      case 'water_purifier':
        meshGroup = FurnitureFactory.createWaterPurifier(style);
        break;
      case 'toilet':
        meshGroup = FurnitureFactory.createToilet(style);
        break;
      case 'shower':
        meshGroup = FurnitureFactory.createShowerEnclosure(itemData.width || 1.1, itemData.depth || 1.0);
        break;
      case 'bathroom_vanity':
        meshGroup = FurnitureFactory.createBathroomVanity(itemData.width || 0.9, style);
        break;
      case 'bathroom_suite':
        meshGroup = FurnitureFactory.createBathroomSuite(itemData.suiteType || 'common');
        break;
      case 'foyer_console':
        meshGroup = FurnitureFactory.createFoyerConsole();
        break;
      case 'walk_in_wardrobe':
        meshGroup = FurnitureFactory.createWalkInWardrobe();
        break;
      case 'cognac_sectional':
        meshGroup = FurnitureFactory.createCognacLeatherSectional();
        break;
      case 'garden_bush':
        meshGroup = FurnitureFactory.createGardenBush(itemData.scale || 1.0, itemData.colorHex || 0x3f6212);
        break;
      case 'perimeter_hedge':
        meshGroup = FurnitureFactory.createPerimeterHedge(itemData.length || 2.0);
        break;
      case 'stepping_stones':
        meshGroup = FurnitureFactory.createSteppingStones(itemData.count || 4);
        break;
      case 'patio_set':
        meshGroup = FurnitureFactory.createPatioSet();
        break;
      case 'straight_kitchen':
        meshGroup = FurnitureFactory.createStraightModularKitchen(style, itemData.color);
        break;
      case 'courtyard_sectional':
        meshGroup = FurnitureFactory.createCourtyardSectional();
        break;
      case 'courtyard_fire_table':
        meshGroup = FurnitureFactory.createCourtyardFireTable();
        break;
      case 'courtyard_chair':
        meshGroup = FurnitureFactory.createCourtyardLoungeChair();
        break;
      case 'courtyard_pergola':
        meshGroup = FurnitureFactory.createPergolaStructure(itemData.width || 3.6, itemData.depth || 3.4, itemData.height || 2.75);
        break;
      case 'courtyard_greenwall':
        meshGroup = FurnitureFactory.createVerticalGreenWall(itemData.width || 2.4, itemData.height || 2.0);
        break;
      case 'courtyard_tree':
        meshGroup = FurnitureFactory.createCourtyardPlanterTree();
        break;
      case 'courtyard_fountain':
        meshGroup = FurnitureFactory.createBasaltWaterFeature();
        break;
      case 'courtyard_lanterns':
        meshGroup = FurnitureFactory.createOutdoorFloorLanterns();
        break;
      default:
        meshGroup = FurnitureFactory.createCoffeeTable(style);
        break;
    }

    if (meshGroup) {
      if (itemData.position) meshGroup.position.set(...itemData.position);
      if (itemData.rotation) meshGroup.rotation.set(...itemData.rotation);
      if (itemData.name) meshGroup.name = itemData.name;
      meshGroup.userData = { ...meshGroup.userData, ...itemData };
      this.furnitureGroup.add(meshGroup);
      if (itemData.type === 'wall_art') {
        this.syncWallArtSetupTab();
      }
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

    const conceptTitle = `${this.currentStyle.toUpperCase()} Interior Layout`;
    const roomType = document.getElementById('room-type')?.value || 'bedroom';
    const roomLabels = {
      duplex: 'Modern Duplex Villa (Double-Height & Mezzanine)',
      complete_house_3bhk: 'Luxury 3 BHK Residence',
      complete_house_2bhk: 'Architectural 2 BHK Residence',
      complete_house: 'Single Bedroom House (1 BHK)',
      bedroom: 'Master Bedroom Suite',
      bedroom_single: 'Single Bedroom (Compact Suite)',
      living_room: 'Living Room Lounge',
      dining_room: 'Dining Room Pavilion',
      kitchen: 'Modular Kitchen'
    };
    const roomTypeLabel = roomLabels[roomType] || roomType.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
    const w = parseFloat(document.getElementById('room-w')?.value) || 5.0;
    const l = parseFloat(document.getElementById('room-l')?.value) || 4.5;
    const h = parseFloat(document.getElementById('room-h')?.value) || 2.8;
    const areaSqM = (w * l).toFixed(1);
    const areaSqFt = ((w * l) * 10.7639).toFixed(0);
    const flooring = document.getElementById('flooring-select')?.value || 'wood_oak';
    const flooringLabel = flooring.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
    const lighting = 'warm_ambient';
    const lightingLabel = 'Warm Ambient';
    const wallColor = document.getElementById('wall-color-picker')?.value || '#faf5ee';

    // Schedule of all placed furniture
    const itemsList = this.furnitureGroup.children.map((child, idx) => {
      return {
        id: idx + 1,
        name: child.name || child.userData?.name || 'Furniture Item',
        type: (child.userData?.type || 'furniture').replace('_', ' '),
        posX: child.position.x.toFixed(2),
        posZ: child.position.z.toFixed(2)
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
            <tr><td>Design Concept</td><td>${conceptTitle}</td></tr>
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
        </div>
        <table class="report-items-table">
          <thead>
            <tr>
              <th style="width: 40px;">#</th>
              <th>Item Name</th>
              <th>Category</th>
              <th>Room Coordinates (X, Z)</th>
            </tr>
          </thead>
          <tbody>
            ${itemsList.map(item => `
              <tr>
                <td>${item.id}</td>
                <td><strong>${item.name}</strong></td>
                <td style="text-transform: capitalize;">${item.type}</td>
                <td>X: ${item.posX}m, Z: ${item.posZ}m</td>
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

    // Save as new design
    document.getElementById('btn-save-as-new')?.addEventListener('click', () => {
      const name = document.getElementById('project-name-input')?.value?.trim() || 'My Interior Design';
      this.saveProject(name);
    });

    document.getElementById('btn-save-project')?.addEventListener('click', () => {
      const name = document.getElementById('project-name-input')?.value?.trim() || 'My Interior Design';
      this.saveProject(name);
    });

    // Import JSON
    const fileInput = document.getElementById('file-import-json');
    document.getElementById('btn-trigger-import')?.addEventListener('click', () => {
      fileInput?.click();
    });
    fileInput?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          this.loadProjectData(data);
          this.showToast('Imported design successfully!');
        } catch (err) {
          this.showToast('Failed to parse JSON file');
        }
      };
      reader.readAsText(file);
    });
  }

  getCurrentProjectData() {
    return {
      name: document.getElementById('project-name-input')?.value || 'My Interior Design',
      roomType: document.getElementById('room-type')?.value || 'living_room',
      dimensions: {
        width: parseFloat(document.getElementById('room-w')?.value) || 5.0,
        length: parseFloat(document.getElementById('room-l')?.value) || 4.5,
        height: parseFloat(document.getElementById('room-h')?.value) || 2.8
      },
      style: this.currentStyle,
      colorScheme: document.getElementById('color-scheme')?.value || 'warm_neutral',
      flooring: document.getElementById('flooring-select')?.value || 'wood_oak',
      lighting: 'warm_ambient',
      wallColor: this.roomBuilder?.getWallColor('back') || '#faf5ee',
      singleWallColors: {
        back: this.roomBuilder?.getWallColor('back'),
        left: this.roomBuilder?.getWallColor('left'),
        right: this.roomBuilder?.getWallColor('right')
      },
      furniture: this.furnitureGroup.children.map(child => ({
        type: child.userData?.type || 'furniture',
        name: child.name,
        position: [child.position.x, child.position.y, child.position.z],
        rotation: [child.rotation.x, child.rotation.y, child.rotation.z]
      }))
    };
  }

  saveProject(name) {
    const projects = JSON.parse(localStorage.getItem('ai_interior_projects') || '{}');
    projects[name] = this.getCurrentProjectData();
    localStorage.setItem('ai_interior_projects', JSON.stringify(projects));
    this.renderSavedProjectsList();
    this.showToast(`Saved design: "${name}"`);
  }

  renderSavedProjectsList() {
    const container = document.getElementById('saved-projects-list');
    if (!container) return;
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
    if (data.roomType) {
      document.getElementById('room-type').value = data.roomType;
      this.syncRoomVariantsUI(data.roomType);
    }
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
    if (data.singleWallColors) {
      if (data.singleWallColors.back) this.roomBuilder.setSingleWallColor('back', parseInt(data.singleWallColors.back.replace('#', '0x'), 16));
      if (data.singleWallColors.left) this.roomBuilder.setSingleWallColor('left', parseInt(data.singleWallColors.left.replace('#', '0x'), 16));
      if (data.singleWallColors.right) this.roomBuilder.setSingleWallColor('right', parseInt(data.singleWallColors.right.replace('#', '0x'), 16));
    } else if (data.wallColor) {
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

    // Smooth Camera Transition Lerp
    if (this.cameraAnimation) {
      this.camera.position.lerp(this.cameraAnimation.targetPos, 0.08);
      this.controls.target.lerp(this.cameraAnimation.targetLook, 0.08);
      if (this.camera.position.distanceTo(this.cameraAnimation.targetPos) < 0.05) {
        this.camera.position.copy(this.cameraAnimation.targetPos);
        this.controls.target.copy(this.cameraAnimation.targetLook);
        this.cameraAnimation = null;
      }
    }

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

    if (this.selectionHelper && this.selectionHelper.visible) {
      this.selectionHelper.update();
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  // ==========================================
  // 12. SOLAR STUDY & DYNAMIC DAYLIGHT SIMULATION
  // ==========================================
  initSunStudy() {
    const btnToggle = document.getElementById('btn-toggle-sun-study');
    const hud = document.getElementById('sun-study-hud');
    const btnClose = document.getElementById('btn-close-sun-study');
    const timeSlider = document.getElementById('sun-time-slider');
    const presetBtns = document.querySelectorAll('.sun-preset-btn');

    if (!hud) return;

    btnToggle?.addEventListener('click', () => {
      const isVisible = hud.style.display !== 'none';
      hud.style.display = isVisible ? 'none' : 'block';
      btnToggle.classList.toggle('active', !isVisible);
    });

    btnClose?.addEventListener('click', () => {
      hud.style.display = 'none';
      btnToggle?.classList.remove('active');
    });

    timeSlider?.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      this.setTimeOfDay(val);
      presetBtns.forEach(b => b.classList.toggle('active', Math.abs(parseFloat(b.dataset.time) - val) < 0.6));
    });

    presetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const t = parseFloat(btn.dataset.time);
        if (timeSlider) timeSlider.value = t;
        presetBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.setTimeOfDay(t);
      });
    });

    // Default to morning daylight (10:00 AM)
    this.setTimeOfDay(10.0);
  }

  setTimeOfDay(hour) {
    this.currentSunHour = hour;
    const timeDisplay = document.getElementById('sun-time-display');

    // Format display string (e.g. "10:30 AM — Morning Daylight")
    const hInt = Math.floor(hour);
    const mInt = Math.round((hour - hInt) * 60);
    const mStr = mInt < 10 ? `0${mInt}` : `${mInt}`;
    const period = hInt >= 12 ? 'PM' : 'AM';
    const displayH = hInt > 12 ? hInt - 12 : (hInt === 0 ? 12 : hInt);
    let phaseName = 'Daylight';

    // Solar orbit geometry:
    // Sun rises from East (-X), arcs across South (+Z), sets in West (+X)
    const normalized = Math.max(0, Math.min(1, (hour - 6) / 14)); // 0 at 6 AM, 1 at 8 PM
    const sunAngle = normalized * Math.PI;

    const sunDist = 24.0;
    const sunX = -Math.cos(sunAngle) * sunDist;
    const sunY = Math.max(0.8, Math.sin(sunAngle) * 22.0);
    const sunZ = 12.0 * Math.sin(sunAngle) + 6.0 * Math.cos(sunAngle);

    if (this.sunLight) {
      this.sunLight.position.set(sunX, sunY, sunZ);
    }

    if (hour < 7.5) {
      // Dawn / Early Sunrise (6:00 - 7:30)
      phaseName = 'Dawn Warm Sunrise';
      if (this.sunLight) {
        this.sunLight.color.setHex(0xff9944);
        this.sunLight.intensity = 0.85;
      }
      if (this.ambientLight) {
        this.ambientLight.color.setHex(0xd4bca8);
        this.ambientLight.intensity = 0.50;
      }
      if (this.ceilingLight) {
        this.ceilingLight.color.setHex(0xffe8c6);
        this.ceilingLight.intensity = 0.6;
      }
      this.scene.background = new THREE.Color(0x181728);
    } else if (hour < 11.5) {
      // Morning Daylight (7:30 - 11:30)
      phaseName = 'Morning Natural Daylight';
      if (this.sunLight) {
        this.sunLight.color.setHex(0xfffaec);
        this.sunLight.intensity = 1.25;
      }
      if (this.ambientLight) {
        this.ambientLight.color.setHex(0xfff6ec);
        this.ambientLight.intensity = 0.65;
      }
      if (this.ceilingLight) {
        this.ceilingLight.color.setHex(0xfff7ed);
        this.ceilingLight.intensity = 0.45;
      }
      this.scene.background = new THREE.Color(0x0a0e17);
    } else if (hour < 15.5) {
      // Midday Peak Sun (11:30 - 15:30)
      phaseName = 'Midday Peak Sun';
      if (this.sunLight) {
        this.sunLight.color.setHex(0xffffff);
        this.sunLight.intensity = 1.35;
      }
      if (this.ambientLight) {
        this.ambientLight.color.setHex(0xf8fafc);
        this.ambientLight.intensity = 0.70;
      }
      if (this.ceilingLight) {
        this.ceilingLight.intensity = 0.4;
      }
      this.scene.background = new THREE.Color(0x0a0e17);
    } else if (hour < 18.5) {
      // Golden Hour / Dusk (15:30 - 18:30)
      phaseName = 'Golden Hour Warm Glow';
      if (this.sunLight) {
        this.sunLight.color.setHex(0xf59e0b);
        this.sunLight.intensity = 1.05;
      }
      if (this.ambientLight) {
        this.ambientLight.color.setHex(0xfde68a);
        this.ambientLight.intensity = 0.52;
      }
      if (this.ceilingLight) {
        this.ceilingLight.color.setHex(0xffeedd);
        this.ceilingLight.intensity = 0.75;
      }
      this.scene.background = new THREE.Color(0x1a1524);
    } else {
      // Night Moonlight & Interior Ambience (18:30 - 22:00+)
      phaseName = 'Night Moonlight & Interior Ambience';
      if (this.sunLight) {
        this.sunLight.color.setHex(0x60a5fa);
        this.sunLight.intensity = 0.18;
      }
      if (this.ambientLight) {
        this.ambientLight.color.setHex(0x1e293b);
        this.ambientLight.intensity = 0.32;
      }
      if (this.ceilingLight) {
        this.ceilingLight.color.setHex(0xffe2b0);
        this.ceilingLight.intensity = 1.15; // Cozy glowing interior pendant and recessed lights
      }
      this.scene.background = new THREE.Color(0x060911);
    }

    if (timeDisplay) {
      timeDisplay.textContent = `${displayH}:${mStr} ${period} — ${phaseName}`;
    }

    // Sync Day/Night mode button icon/text
    const dayNightBtn = document.getElementById('btn-toggle-daylight');
    if (dayNightBtn) {
      if (hour >= 18.5 || hour < 6.5) {
        dayNightBtn.textContent = '🌙 Night';
        dayNightBtn.classList.remove('active');
      } else {
        dayNightBtn.textContent = '☀️ Day';
        dayNightBtn.classList.add('active');
      }
    }
  }

  // ==========================================
  // 13. REAL-TIME LASER MEASUREMENT TAPE TOOL
  // ==========================================
  initMeasureTool() {
    const btnToggle = document.getElementById('btn-toggle-measure');
    const hud = document.getElementById('measure-hud');
    const btnClear = document.getElementById('btn-clear-measures');
    const btnExit = document.getElementById('btn-exit-measure');

    btnToggle?.addEventListener('click', () => {
      this.toggleMeasureMode();
    });

    btnExit?.addEventListener('click', () => {
      this.toggleMeasureMode(false);
    });

    btnClear?.addEventListener('click', () => {
      this.clearAllMeasurements();
    });
  }

  toggleMeasureMode(forceState = null) {
    const btnToggle = document.getElementById('btn-toggle-measure');
    const hud = document.getElementById('measure-hud');
    const instruction = document.getElementById('measure-instruction');
    const liveDist = document.getElementById('measure-live-dist');

    this.isMeasuring = forceState !== null ? forceState : !this.isMeasuring;

    if (this.isMeasuring) {
      this.deselectObject();
      this.canvas.classList.add('measuring');
      if (hud) hud.style.display = 'flex';
      btnToggle?.classList.add('active');
      if (instruction) instruction.textContent = 'Click Point A on any wall, floor or furniture';
      if (liveDist) liveDist.style.display = 'none';
      this.measureStartPoint = null;
      this.showToast('📏 Laser Measure active: Click any point to measure');
    } else {
      this.canvas.classList.remove('measuring');
      if (hud) hud.style.display = 'none';
      btnToggle?.classList.remove('active');
      this.measureStartPoint = null;
      if (this.tempMeasureLine) {
        this.scene.remove(this.tempMeasureLine);
        this.tempMeasureLine = null;
      }
    }
  }

  getMeasurementRaycastHit(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, this.camera);

    const targets = [];
    if (this.furnitureGroup) targets.push(...this.furnitureGroup.children);
    if (this.roomBuilder) {
      if (this.roomBuilder.roomGroup) targets.push(this.roomBuilder.roomGroup);
      if (this.roomBuilder.houseFloors) targets.push(...this.roomBuilder.houseFloors);
      if (this.roomBuilder.houseWalls) targets.push(...this.roomBuilder.houseWalls);
      if (this.roomBuilder.floor) targets.push(this.roomBuilder.floor);
      if (this.roomBuilder.walls) {
        Object.values(this.roomBuilder.walls).forEach(w => { if (w) targets.push(w); });
      }
    }

    const hits = this.raycaster.intersectObjects(targets, true).filter(h => {
      return !h.object.userData?.isMeasureElement && !h.object.userData?.isRoomBadge;
    });

    return hits.length > 0 ? hits[0].point : null;
  }

  handleMeasureClick(e) {
    const hitPoint = this.getMeasurementRaycastHit(e);
    if (!hitPoint) return;

    const instruction = document.getElementById('measure-instruction');
    const liveDist = document.getElementById('measure-live-dist');

    if (!this.measureStartPoint) {
      // First click (Point A)
      this.measureStartPoint = hitPoint.clone();
      const markerA = this.createMeasurePointMarker(this.measureStartPoint, 0x10b981);
      this.measureMarkers.push(markerA);
      this.scene.add(markerA);

      if (instruction) instruction.textContent = 'Move mouse to Point B and click to finish';
    } else {
      // Second click (Point B)
      const endPoint = hitPoint.clone();
      const markerB = this.createMeasurePointMarker(endPoint, 0x38bdf8);
      this.measureMarkers.push(markerB);
      this.scene.add(markerB);

      const distance = this.measureStartPoint.distanceTo(endPoint);
      this.createCompletedMeasureLine(this.measureStartPoint, endPoint, distance);

      const mStr = `${distance.toFixed(2)} m`;
      const ftTotal = distance * 3.28084;
      const ft = Math.floor(ftTotal);
      const inches = Math.round((ftTotal - ft) * 12);
      const ftStr = `${ft}' ${inches}"`;

      this.showToast(`📏 Dimension Recorded: ${mStr} (${ftStr})`);

      if (instruction) instruction.textContent = `Measured: ${mStr} (${ftStr}) — Click next Point A`;
      if (liveDist) liveDist.style.display = 'none';

      if (this.tempMeasureLine) {
        this.scene.remove(this.tempMeasureLine);
        this.tempMeasureLine = null;
      }
      this.measureStartPoint = null;
    }
  }

  handleMeasureMove(e) {
    if (!this.measureStartPoint) return;

    const hitPoint = this.getMeasurementRaycastHit(e);
    if (!hitPoint) return;

    const distance = this.measureStartPoint.distanceTo(hitPoint);
    const liveDist = document.getElementById('measure-live-dist');
    if (liveDist) {
      liveDist.style.display = 'inline';
      const mStr = `${distance.toFixed(2)} m`;
      const ftTotal = distance * 3.28084;
      const ft = Math.floor(ftTotal);
      const inches = Math.round((ftTotal - ft) * 12);
      liveDist.textContent = `${mStr} (${ft}' ${inches}")`;
    }

    this.updateTempMeasureLine(this.measureStartPoint, hitPoint);
  }

  createMeasurePointMarker(pos, colorHex = 0x10b981) {
    const geom = new THREE.SphereGeometry(0.045, 16, 16);
    const mat = new THREE.MeshBasicMaterial({ color: colorHex, depthTest: false });
    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.copy(pos);
    mesh.renderOrder = 999;
    mesh.userData = { isMeasureElement: true };
    return mesh;
  }

  updateTempMeasureLine(start, end) {
    if (this.tempMeasureLine) {
      this.scene.remove(this.tempMeasureLine);
    }
    const geom = new THREE.BufferGeometry().setFromPoints([start, end]);
    const mat = new THREE.LineDashedMaterial({
      color: 0x38bdf8,
      dashSize: 0.1,
      gapSize: 0.05,
      depthTest: false
    });
    this.tempMeasureLine = new THREE.Line(geom, mat);
    this.tempMeasureLine.computeLineDistances();
    this.tempMeasureLine.renderOrder = 998;
    this.tempMeasureLine.userData = { isMeasureElement: true };
    this.scene.add(this.tempMeasureLine);
  }

  createCompletedMeasureLine(start, end, distance) {
    // 3D Laser Dimension Line
    const geom = new THREE.BufferGeometry().setFromPoints([start, end]);
    const mat = new THREE.LineBasicMaterial({ color: 0x10b981, linewidth: 2, depthTest: false });
    const line = new THREE.Line(geom, mat);
    line.renderOrder = 998;
    line.userData = { isMeasureElement: true };
    this.scene.add(line);
    this.measureLines.push(line);

    // Dimension Label Sprite at Midpoint
    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    mid.y += 0.08; // Slight elevation so it floats clearly above surface

    const mStr = `${distance.toFixed(2)} m`;
    const ftTotal = distance * 3.28084;
    const ft = Math.floor(ftTotal);
    const inches = Math.round((ftTotal - ft) * 12);
    const labelText = `${mStr} (${ft}' ${inches}")`;

    const sprite = this.createMeasureLabelSprite(labelText);
    sprite.position.copy(mid);
    this.scene.add(sprite);
    this.measureSprites.push(sprite);
  }

  createMeasureLabelSprite(text) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(3, 3, 250, 58, 10);
    else ctx.rect(3, 3, 250, 58);
    ctx.fill();
    ctx.stroke();

    ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = '#6ee7b7';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 128, 32);

    const texture = new THREE.CanvasTexture(canvas);
    const mat = new THREE.SpriteMaterial({ map: texture, depthTest: false, transparent: true });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(0.85, 0.22, 1.0);
    sprite.renderOrder = 999;
    sprite.userData = { isMeasureElement: true };
    return sprite;
  }

  clearAllMeasurements() {
    this.measureMarkers.forEach(m => this.scene.remove(m));
    this.measureLines.forEach(l => this.scene.remove(l));
    this.measureSprites.forEach(s => this.scene.remove(s));
    if (this.tempMeasureLine) {
      this.scene.remove(this.tempMeasureLine);
      this.tempMeasureLine = null;
    }
    this.measureMarkers = [];
    this.measureLines = [];
    this.measureSprites = [];
    this.measureStartPoint = null;

    const instruction = document.getElementById('measure-instruction');
    const liveDist = document.getElementById('measure-live-dist');
    if (instruction) instruction.textContent = 'All measurements cleared. Click Point A to start';
    if (liveDist) liveDist.style.display = 'none';
    this.showToast('🗑️ Measurement lines cleared');
  }

  // ==========================================
  // 14. ROOM DIMENSIONS & AREA SCHEDULE
  // ==========================================
  initRoomSchedule() {
    const btnOpen = document.getElementById('btn-room-schedule');
    const modal = document.getElementById('schedule-modal');
    const btnClose = document.getElementById('btn-close-schedule');
    const btnDismiss = document.getElementById('btn-dismiss-schedule');
    const btnMetric = document.getElementById('btn-unit-metric');
    const btnImperial = document.getElementById('btn-unit-imperial');
    const chk3DAreas = document.getElementById('chk-show-3d-areas');

    btnOpen?.addEventListener('click', () => {
      this.updateRoomScheduleData();
      if (modal) modal.style.display = 'flex';
    });

    const closeModal = () => {
      if (modal) modal.style.display = 'none';
    };

    btnClose?.addEventListener('click', closeModal);
    btnDismiss?.addEventListener('click', closeModal);
    modal?.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    btnMetric?.addEventListener('click', () => {
      this.scheduleUnit = 'metric';
      btnMetric.classList.add('active');
      btnImperial?.classList.remove('active');
      this.updateRoomScheduleData();
      if (this.show3DAreaBadges) this.toggleFloorAreaBadges(true);
    });

    btnImperial?.addEventListener('click', () => {
      this.scheduleUnit = 'imperial';
      btnImperial.classList.add('active');
      btnMetric?.classList.remove('active');
      this.updateRoomScheduleData();
      if (this.show3DAreaBadges) this.toggleFloorAreaBadges(true);
    });

    chk3DAreas?.addEventListener('change', (e) => {
      this.show3DAreaBadges = e.target.checked;
      this.toggleFloorAreaBadges(this.show3DAreaBadges);
    });
  }

  getRoomScheduleList() {
    const isDuplex = this.roomBuilder && (this.roomBuilder.houseType === 'duplex' || this.roomBuilder.houseType === 'duplex_villa');
    const is3BHK = this.roomBuilder && (this.roomBuilder.houseType === '3bhk' || this.roomBuilder.houseType === 'complete_house_3bhk');
    const isVilla = this.roomBuilder && (this.roomBuilder.houseType === 'villa_2bhk' || this.roomBuilder.houseType === '2bhk' || this.roomBuilder.houseType === 'villa');
    
    // Flooring label lookup
    const floorSelect = document.getElementById('flooring-select');
    const currentFloorText = floorSelect ? floorSelect.options[floorSelect.selectedIndex]?.text : 'Continuous Light Porcelain Tile';

    if (isDuplex) {
      return {
        houseType: 'Modern Duplex Villa (Double-Height Living & Mezzanine Penthouse)',
        totalBuiltUp: 240.0,
        carpetArea: 168.5,
        rooms: [
          { name: '🚪 Grand Entrance Foyer', width: 2.8, length: 3.2, height: 2.8, floor: 'Polished Marble' },
          { name: '🛋️ Double-Height Living Lounge', width: 5.4, length: 5.4, height: 5.6, floor: 'Polished Marble' },
          { name: '🍽️ Formal Dining Room', width: 4.3, length: 4.6, height: 2.8, floor: 'Polished Marble' },
          { name: '🍳 Gourmet Island Kitchen', width: 4.3, length: 4.6, height: 2.8, floor: 'Light Porcelain Tile' },
          { name: '🛏️ Ground Guest Suite', width: 4.7, length: 5.0, height: 2.8, floor: 'Warm Oak Wood' },
          { name: '🚿 Ground Guest Bathroom', width: 2.6, length: 3.0, height: 2.8, floor: 'Blue Designer Tile' },
          { name: '🪜 Floating Cantilevered Stairs', width: 1.1, length: 4.2, height: 2.8, floor: 'Solid Oak Treads & Glass Rail' },
          { name: '✨ Mezzanine Walkway Gallery (Lvl 2)', width: 1.8, length: 4.8, height: 2.8, floor: 'Herringbone Parquet' },
          { name: '👑 Penthouse Master Suite (Lvl 2)', width: 4.3, length: 5.4, height: 2.8, floor: 'Herringbone Parquet' },
          { name: '🛁 Master Spa Bathroom (Lvl 2)', width: 4.3, length: 3.0, height: 2.8, floor: 'Polished Marble Tile' },
          { name: '🌆 Upper Loft Sky Lounge (Lvl 2)', width: 6.0, length: 6.0, height: 2.8, floor: 'Herringbone Parquet' },
          { name: '🌿 Sunken Terrace & Deck', width: 4.3, length: 2.0, height: 2.8, floor: 'Outdoor Teak Decking' }
        ]
      };
    } else if (is3BHK) {
      return {
        houseType: 'Luxury 3 BHK Residence (10 Connected Spaces & Balcony)',
        totalBuiltUp: 215.0,
        carpetArea: 148.2,
        rooms: [
          { name: '🚪 Entrance Foyer', width: 3.0, length: 3.0, height: 2.8, floor: currentFloorText },
          { name: '🛋️ Living Room Lounge', width: 6.0, length: 4.6, height: 2.8, floor: currentFloorText },
          { name: '🍽️ Dining Pavilion', width: 5.0, length: 4.6, height: 2.8, floor: currentFloorText },
          { name: '🍳 Modular Kitchen & Island', width: 5.0, length: 4.4, height: 2.8, floor: currentFloorText },
          { name: '👑 Master Suite (Bed 1)', width: 5.0, length: 5.4, height: 2.8, floor: 'Herringbone Parquet' },
          { name: '🛁 Master En-Suite Bathroom', width: 2.4, length: 2.8, height: 2.8, floor: 'Blue Designer Tile' },
          { name: '🛏️ Second Bedroom (Bed 2)', width: 5.0, length: 5.4, height: 2.8, floor: 'Warm Oak Wood' },
          { name: '🧸 Third Bedroom / Study (Bed 3)', width: 4.0, length: 4.4, height: 2.8, floor: 'Warm Oak Wood' },
          { name: '🚿 Common Family Bathroom', width: 2.5, length: 2.8, height: 2.8, floor: 'Blue Designer Tile' },
          { name: '🚶 Central Hallway Corridor', width: 3.5, length: 4.4, height: 2.8, floor: currentFloorText },
          { name: '🌅 Private Balcony Deck', width: 6.0, length: 2.0, height: 2.8, floor: 'Teak Wood Decking' }
        ]
      };
    } else if (isVilla) {
      return {
        houseType: 'Complete House Residence (2 BHK Villa)',
        totalBuiltUp: 182.0,
        carpetArea: 117.8,
        rooms: [
          { name: '🚪 Entrance Foyer', width: 2.4, length: 2.8, height: 2.8, floor: currentFloorText },
          { name: '🛋️ Living Room Suite', width: 5.4, length: 4.8, height: 2.8, floor: currentFloorText },
          { name: '🍽️ Dining Area', width: 3.8, length: 3.4, height: 2.8, floor: currentFloorText },
          { name: '🍳 Modular Kitchen', width: 3.8, length: 3.6, height: 2.8, floor: 'Modern Ceramic Tile' },
          { name: '👑 Master Bedroom Suite', width: 4.6, length: 4.2, height: 2.8, floor: 'Light Oak Wood Parquet' },
          { name: '🛁 Master Ensuite Bathroom', width: 2.8, length: 2.4, height: 2.8, floor: 'Porcelain Marble Tile' },
          { name: '🛏️ Second Bedroom', width: 4.0, length: 3.6, height: 2.8, floor: 'Light Oak Wood Parquet' },
          { name: '🚿 Common Bathroom', width: 2.4, length: 2.2, height: 2.8, floor: 'Porcelain Marble Tile' },
          { name: '🌿 Terrace & Garden', width: 5.2, length: 3.5, height: 2.8, floor: 'Outdoor Paving & Turf' }
        ]
      };
    } else {
      return {
        houseType: 'Single Bedroom House (1 BHK Planned Architecture)',
        totalBuiltUp: 105.0,
        carpetArea: 88.1,
        rooms: [
          { name: '🚪 Entrance Foyer', width: 2.4, length: 2.8, height: 2.8, floor: currentFloorText },
          { name: '🛋️ Living Room', width: 5.2, length: 4.8, height: 2.8, floor: currentFloorText },
          { name: '🍽️ Dining Area', width: 3.8, length: 3.2, height: 2.8, floor: currentFloorText },
          { name: '🍳 Modular Kitchen', width: 3.8, length: 3.6, height: 2.8, floor: currentFloorText },
          { name: '👑 Master Bedroom Suite', width: 4.5, length: 4.0, height: 2.8, floor: currentFloorText },
          { name: '🛁 Master Bathroom', width: 2.8, length: 2.4, height: 2.8, floor: 'Waterproof Floor Tile' },
          { name: '🚶 Internal Hallway & Privacy Corridor', width: 1.4, length: 4.2, height: 2.8, floor: currentFloorText }
        ]
      };
    }
  }

  updateRoomScheduleData() {
    const data = this.getRoomScheduleList();
    const isMetric = this.scheduleUnit === 'metric';

    // Update house type badge
    const badge = document.getElementById('schedule-house-type-badge');
    if (badge) badge.textContent = data.houseType;

    // Convert areas
    const formatArea = (sqm) => {
      if (isMetric) return `${sqm.toFixed(1)} m²`;
      const sqft = sqm * 10.7639;
      return `${sqft.toFixed(0)} sq ft`;
    };

    const formatDim = (m) => {
      if (isMetric) return `${m.toFixed(2)}m`;
      const ftTotal = m * 3.28084;
      const ft = Math.floor(ftTotal);
      const inc = Math.round((ftTotal - ft) * 12);
      return `${ft}' ${inc}"`;
    };

    // Summary stats
    const totalEl = document.getElementById('sched-stat-total');
    const carpetEl = document.getElementById('sched-stat-carpet');
    const roomsEl = document.getElementById('sched-stat-rooms');

    if (totalEl) totalEl.textContent = formatArea(data.totalBuiltUp);
    if (carpetEl) carpetEl.textContent = formatArea(data.carpetArea);
    if (roomsEl) roomsEl.textContent = `${data.rooms.length} Spaces`;

    // Table rows
    const tbody = document.getElementById('schedule-table-rows');
    if (!tbody) return;
    tbody.innerHTML = '';

    data.rooms.forEach(r => {
      const area = r.width * r.length;
      const row = document.createElement('tr');
      row.innerHTML = `
        <td style="font-weight: 600; color: #f1f5f9;">${r.name}</td>
        <td>${formatDim(r.width)} &times; ${formatDim(r.length)}</td>
        <td style="font-weight: 600; color: #38bdf8;">${formatArea(area)}</td>
        <td>${formatDim(r.height)}</td>
        <td style="color: #94a3b8; font-size: 11px;">${r.floor}</td>
      `;
      tbody.appendChild(row);
    });
  }

  toggleFloorAreaBadges(enabled) {
    if (!this.roomBuilder || !this.roomBuilder.roomBadges) return;
    const isMetric = this.scheduleUnit === 'metric';

    const roomAreaMap = {
      foyer: 6.7,
      living: 25.0,
      dining: 12.2,
      kitchen: 13.7,
      bedroom: 18.0,
      bedroom2: 14.4,
      master_bath: 6.7,
      common_bath: 5.3,
      backyard: 18.2
    };

    this.roomBuilder.roomBadges.forEach(badge => {
      const zoneKey = badge.userData?.roomZone;
      const baseTitle = badge.userData?.title || '';
      const areaM2 = roomAreaMap[zoneKey];
      if (!areaM2) return;

      const areaStr = isMetric ? `${areaM2.toFixed(1)} m²` : `${Math.round(areaM2 * 10.7639)} sq ft`;
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 140;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
      ctx.strokeStyle = enabled ? '#10b981' : 'rgba(99, 102, 241, 0.85)';
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

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      if (enabled) {
        ctx.fillText(baseTitle, 256, 50);
        ctx.fillStyle = '#34d399';
        ctx.font = '600 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillText(areaStr, 256, 95);
      } else {
        ctx.font = 'bold 44px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillText(baseTitle, 256, 70);
      }

      if (badge.material && badge.material.map) {
        badge.material.map.dispose();
        badge.material.map = new THREE.CanvasTexture(canvas);
        badge.material.map.needsUpdate = true;
      }
    });

    this.showToast(enabled ? '📐 3D Room Area Badges enabled' : '📐 3D Room Area Badges hidden');
  }

  // ==========================================
  // 15. ADVANCED EXPORTS: 360° VR PANORAMA & .OBJ + .MTL
  // ==========================================
  initExportTools() {
    const btnObj = document.getElementById('btn-export-obj');
    const btnPano = document.getElementById('btn-export-panorama');

    btnObj?.addEventListener('click', () => {
      this.export3DModelOBJ();
    });

    btnPano?.addEventListener('click', () => {
      this.export360Panorama();
    });
  }

  downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 1000);
  }

  export360Panorama() {
    this.showToast('🌐 Generating 360° Equirectangular Panorama render...');

    try {
      // Hide helpers and selection highlights during render
      const selVisible = this.selectionHelper ? this.selectionHelper.visible : false;
      if (this.selectionHelper) this.selectionHelper.visible = false;
      const badgesVisible = (this.roomBuilder?.roomBadges || []).map(b => {
        const v = b.visible;
        b.visible = false;
        return { badge: b, visible: v };
      });

      // 1. Setup CubeCamera at eye level in the center of current space
      const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(1024, {
        generateMipmaps: true,
        minFilter: THREE.LinearMipmapLinearFilter,
        magFilter: THREE.LinearFilter
      });
      const cubeCamera = new THREE.CubeCamera(0.1, 100, cubeRenderTarget);

      // Camera position: use current camera x/z, clamped inside house at eye level (y = 1.6)
      cubeCamera.position.set(this.camera.position.x, 1.6, this.camera.position.z);
      this.scene.add(cubeCamera);
      cubeCamera.update(this.renderer, this.scene);

      // 2. Render CubeMap into Equirectangular 2:1 Texture (2048 x 1024)
      const panoWidth = 2048;
      const panoHeight = 1024;
      const panoRenderTarget = new THREE.WebGLRenderTarget(panoWidth, panoHeight);

      // Equirectangular projection camera & scene
      const panoScene = new THREE.Scene();
      const panoCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

      const panoVertexShader = `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `;

      const panoFragmentShader = `
        uniform samplerCube tCube;
        varying vec2 vUv;
        #define M_PI 3.1415926535897932384626433832795
        void main() {
          float phi = (vUv.x - 0.5) * 2.0 * M_PI;
          float theta = (0.5 - vUv.y) * M_PI;
          vec3 dir = vec3(sin(phi) * cos(theta), sin(theta), -cos(phi) * cos(theta));
          gl_FragColor = textureCube(tCube, dir);
        }
      `;

      const panoMaterial = new THREE.ShaderMaterial({
        vertexShader: panoVertexShader,
        fragmentShader: panoFragmentShader,
        uniforms: {
          tCube: { value: cubeRenderTarget.texture }
        }
      });

      const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), panoMaterial);
      panoScene.add(quad);

      // Render to panoRenderTarget
      this.renderer.setRenderTarget(panoRenderTarget);
      this.renderer.render(panoScene, panoCamera);

      // Read back pixels
      const pixelBuffer = new Uint8Array(panoWidth * panoHeight * 4);
      this.renderer.readRenderTargetPixels(panoRenderTarget, 0, 0, panoWidth, panoHeight, pixelBuffer);

      // Reset renderer target
      this.renderer.setRenderTarget(null);

      // Copy pixels into an offscreen HTML5 canvas to export as JPEG
      const canvas = document.createElement('canvas');
      canvas.width = panoWidth;
      canvas.height = panoHeight;
      const ctx = canvas.getContext('2d');
      const imgData = ctx.createImageData(panoWidth, panoHeight);

      // Invert vertical rows (WebGL coordinates are Y-flipped)
      for (let y = 0; y < panoHeight; y++) {
        const srcRow = (panoHeight - 1 - y) * panoWidth * 4;
        const dstRow = y * panoWidth * 4;
        for (let x = 0; x < panoWidth * 4; x++) {
          imgData.data[dstRow + x] = pixelBuffer[srcRow + x];
        }
      }
      ctx.putImageData(imgData, 0, 0);

      // Trigger download
      canvas.toBlob((blob) => {
        if (blob) {
          this.downloadBlob(blob, `interior-360-panorama-${new Date().toISOString().slice(0, 10)}.jpg`);
          this.showToast('✨ 360° VR Panorama downloaded! (Ready for VR & Facebook 360)');
        }
      }, 'image/jpeg', 0.95);

      // Cleanup
      this.scene.remove(cubeCamera);
      cubeRenderTarget.dispose();
      panoRenderTarget.dispose();
      panoMaterial.dispose();
      quad.geometry.dispose();

      // Restore hidden helpers
      if (this.selectionHelper) this.selectionHelper.visible = selVisible;
      badgesVisible.forEach(item => { item.badge.visible = item.visible; });
    } catch (err) {
      console.error('Panorama export failed:', err);
      this.showToast('⚠️ Could not complete 360° export: ' + err.message);
    }
  }

  export3DModelOBJ() {
    this.showToast('📦 Serializing complete 3D scene to Wavefront (.OBJ + .MTL)...');

    try {
      let objOutput = '# AI Interior Studio - Architectural 3D House Export\n';
      objOutput += '# Exported from Three.js scene\n';
      objOutput += 'mtllib interior-materials.mtl\n\n';

      let mtlOutput = '# Materials library for AI Interior Studio\n\n';

      const materialsMap = new Map();
      let vertexOffset = 1;
      let normalOffset = 1;
      let uvOffset = 1;

      // Meshes to export: room geometry + furniture geometry
      const exportRoots = [this.furnitureGroup, this.roomBuilder?.roomGroup].filter(Boolean);

      exportRoots.forEach(root => {
        root.updateMatrixWorld(true);
        root.traverse(child => {
          if (!child.isMesh || !child.geometry) return;
          if (child.userData?.isMeasureElement || child.userData?.isRoomBadge) return;
          if (child.name === 'SelectionBox' || child.name === 'MeasurementGrid') return;

          const geom = child.geometry.clone();
          geom.applyMatrix4(child.matrixWorld);

          const positions = geom.attributes.position;
          const normals = geom.attributes.normal;
          const uvs = geom.attributes.uv;

          if (!positions) return;

          // Material export
          const mat = Array.isArray(child.material) ? child.material[0] : child.material;
          const matName = mat ? (mat.name || `Mat_${mat.id || 'std'}`) : 'DefaultMaterial';

          if (mat && !materialsMap.has(matName)) {
            materialsMap.set(matName, true);
            const col = mat.color ? mat.color : { r: 0.8, g: 0.8, b: 0.8 };
            const op = mat.opacity !== undefined ? mat.opacity : 1.0;
            mtlOutput += `newmtl ${matName}\n`;
            mtlOutput += `Kd ${col.r.toFixed(4)} ${col.g.toFixed(4)} ${col.b.toFixed(4)}\n`;
            mtlOutput += `Ks 0.2000 0.2000 0.2000\n`;
            mtlOutput += `Ns 25.0\n`;
            mtlOutput += `d ${op.toFixed(2)}\n`;
            mtlOutput += `illum 2\n\n`;
          }

          objOutput += `o ${child.name || 'HouseMesh_' + child.id}\n`;
          objOutput += `usemtl ${matName}\n`;

          // Write vertices
          for (let i = 0; i < positions.count; i++) {
            objOutput += `v ${positions.getX(i).toFixed(4)} ${positions.getY(i).toFixed(4)} ${positions.getZ(i).toFixed(4)}\n`;
          }

          // Write normals
          if (normals) {
            for (let i = 0; i < normals.count; i++) {
              objOutput += `vn ${normals.getX(i).toFixed(4)} ${normals.getY(i).toFixed(4)} ${normals.getZ(i).toFixed(4)}\n`;
            }
          }

          // Write UVs
          if (uvs) {
            for (let i = 0; i < uvs.count; i++) {
              objOutput += `vt ${uvs.getX(i).toFixed(4)} ${uvs.getY(i).toFixed(4)}\n`;
            }
          }

          // Write faces
          const hasNormals = Boolean(normals);
          const hasUvs = Boolean(uvs);

          if (geom.index) {
            const indices = geom.index.array;
            for (let i = 0; i < indices.length; i += 3) {
              const a = indices[i] + vertexOffset;
              const b = indices[i + 1] + vertexOffset;
              const c = indices[i + 2] + vertexOffset;
              if (hasNormals && hasUvs) {
                const na = indices[i] + normalOffset;
                const nb = indices[i + 1] + normalOffset;
                const nc = indices[i + 2] + normalOffset;
                const ua = indices[i] + uvOffset;
                const ub = indices[i + 1] + uvOffset;
                const uc = indices[i + 2] + uvOffset;
                objOutput += `f ${a}/${ua}/${na} ${b}/${ub}/${nb} ${c}/${uc}/${nc}\n`;
              } else if (hasNormals) {
                const na = indices[i] + normalOffset;
                const nb = indices[i + 1] + normalOffset;
                const nc = indices[i + 2] + normalOffset;
                objOutput += `f ${a}//${na} ${b}//${nb} ${c}//${nc}\n`;
              } else {
                objOutput += `f ${a} ${b} ${c}\n`;
              }
            }
          } else {
            for (let i = 0; i < positions.count; i += 3) {
              const a = i + vertexOffset;
              const b = i + 1 + vertexOffset;
              const c = i + 2 + vertexOffset;
              if (hasNormals && hasUvs) {
                const na = i + normalOffset;
                const nb = i + 1 + normalOffset;
                const nc = i + 2 + normalOffset;
                const ua = i + uvOffset;
                const ub = i + 1 + uvOffset;
                const uc = i + 2 + uvOffset;
                objOutput += `f ${a}/${ua}/${na} ${b}/${ub}/${nb} ${c}/${uc}/${nc}\n`;
              } else if (hasNormals) {
                const na = i + normalOffset;
                const nb = i + 1 + normalOffset;
                const nc = i + 2 + normalOffset;
                objOutput += `f ${a}//${na} ${b}//${nb} ${c}//${nc}\n`;
              } else {
                objOutput += `f ${a} ${b} ${c}\n`;
              }
            }
          }

          vertexOffset += positions.count;
          if (normals) normalOffset += normals.count;
          if (uvs) uvOffset += uvs.count;

          geom.dispose();
        });
      });

      // Download both OBJ and MTL
      const objBlob = new Blob([objOutput], { type: 'text/plain' });
      const mtlBlob = new Blob([mtlOutput], { type: 'text/plain' });

      this.downloadBlob(objBlob, 'interior-architecture-model.obj');
      setTimeout(() => {
        this.downloadBlob(mtlBlob, 'interior-materials.mtl');
      }, 300);

      this.showToast('✅ 3D Model (.OBJ + .MTL) exported for Blender / 3ds Max / SketchUp!');
    } catch (err) {
      console.error('OBJ Export failed:', err);
      this.showToast('⚠️ Export failed: ' + err.message);
    }
  }
}

// Instantiate App once DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  window.interiorAppInstance = new App();
});

  window.App = App;

})();
