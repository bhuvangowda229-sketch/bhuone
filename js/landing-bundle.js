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
      offset: 1.4,       // position along the wall in meters
      width: 0.9,        // door width
      height: 2.1,       // door height
      openAngle: 0       // 0 to 90 degrees swing
    };

    this.windowGroup = null;
    this.doorGroup = null;
    this.doorHinge = null;
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

    const doorFrameMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6 });
    const doorMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.7 });

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

    // Door hinge pivot located at side of opening
    this.doorHinge = new THREE.Group();
    this.doorHinge.name = 'Door Hinge';
    this.doorHinge.position.set(0, 0, -doorW / 2);

    // Door panel centered inside hinge pivot
    const doorPanel = new THREE.Mesh(new THREE.BoxGeometry(0.035, doorH - 0.02, doorW - 0.02), doorMat);
    doorPanel.position.set(0, (doorH - 0.02) / 2, doorW / 2);
    doorPanel.castShadow = true;
    doorPanel.receiveShadow = true;
    doorPanel.name = 'Door Panel';
    this.doorHinge.add(doorPanel);

    // Door handle (brass)
    const handleMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.85, roughness: 0.2 });
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
      child.userData.rootGroup = this.doorGroup;
    });

    this.roomGroup.add(this.doorGroup);
  }

  setDoorSwing(angleDegrees) {
    this.doorConfig.openAngle = angleDegrees;
    if (this.doorHinge) {
      this.doorHinge.rotation.y = (angleDegrees || 0) * (Math.PI / 180);
    }
  }

  updateWindow(newConfig) {
    Object.assign(this.windowConfig, newConfig);
    const { width: W, length: L, height: H } = this.currentDimensions;
    this.rebuildWindow(W, L, H);
  }

  updateDoor(newConfig) {
    Object.assign(this.doorConfig, newConfig);
    const { width: W, length: L, height: H } = this.currentDimensions;
    this.rebuildDoor(W, L, H);
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
      if (this.walls[w] && this.walls[w].material) {
        this.walls[w].material.color.set(hex);
      }
    });
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
    this.buildFloor(this.currentDimensions.width, this.currentDimensions.length, type);
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

      // Built-in Mirrored Wardrobe along right wall
      items.push({
        id: 'wardrobe_1',
        type: 'mirrored_wardrobe',
        name: 'Mirrored Double Wardrobe',
        position: [W / 2 - 0.36, 0, 0.0],
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

  // 5. Landing Hero Demo
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
          window.location.href = 'signin.html?redirect=studio.html';
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

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', () => { new HeroDemo(); });
} else {
  new HeroDemo();
}


})();