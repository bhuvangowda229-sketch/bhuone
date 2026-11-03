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
        // Low Japandi bed, low storage credenza, paper lantern lamp & orb pendant
        concept = `TYPE 2: MINIMALIST ZEN MASTER RETREAT (${style.toUpperCase()})`;
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
        // TYPE 3: MODERN HOTEL CHIC & VANITY
        // Designer bed, work/vanity desk + ergonomic chair, mirrored robe, task lamp
        concept = `TYPE 3: MODERN HOTEL CHIC & VANITY SUITE (${style.toUpperCase()})`;
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
    } else if (roomType === 'home_office' || roomType.startsWith('home_office_')) {
      // Determine which of the 4 Home Office / Study Design Types is selected
      let officeType = pref.officeType || 1;
      if (roomType === 'home_office_minimal' || roomType === 'home_office_type2') officeType = 2;
      else if (roomType === 'home_office_creative' || roomType === 'home_office_type3') officeType = 3;
      else if (roomType === 'home_office_academic' || roomType === 'home_office_type4') officeType = 4;
      else if (roomType === 'home_office' && pref.officeType) officeType = parseInt(pref.officeType, 10) || 1;

      if (officeType === 1) {
        // TYPE 1: EXECUTIVE SUITE & LIBRARY
        concept = `TYPE 1: EXECUTIVE SUITE & LIBRARY (${style.toUpperCase()})`;
        spatialRationale = `Follows the classic 'Commanding Position' principle with an executive desk facing the room entrance backed by expansive library shelving. A dedicated visitor/reading armchair and storage credenza create a professional, authoritative environment for high-level decision making.`;
        lightingPlan = `Dual-circuit illumination: balanced 4000K shadowless task lighting across the executive desk surface complemented by 3000K warm vertical book-washing illumination across reference shelves.`;

        // Executive Workstation Desk in commanding position
        items.push({
          id: 'desk_1',
          type: 'desk',
          name: 'Executive Workstation Desk',
          position: [0, 0, 0.1],
          rotation: [0, 0, 0],
          style: style,
          color: palette.woodColor,
          cost: 850
        });

        // Ergonomic High-Back Executive Chair behind desk
        items.push({
          id: 'office_chair_1',
          type: 'office_chair',
          name: 'High-Back Ergonomic Executive Chair',
          position: [0, 0, -0.65],
          rotation: [0, 0, 0],
          style: style,
          cost: 390
        });

        // Floor-to-Ceiling Reference Library Bookshelf
        items.push({
          id: 'bookshelf_1',
          type: 'bookshelf',
          name: 'Reference Library Shelving',
          position: [0, 0, -L / 2 + 0.35],
          rotation: [0, 0, 0],
          style: style,
          cost: 520
        });

        // Executive Filing & Storage Credenza along right wall
        items.push({
          id: 'credenza_1',
          type: 'credenza',
          name: 'Executive Storage Credenza',
          position: [W / 2 - 0.35, 0, 0.3],
          rotation: [0, -Math.PI / 2, 0],
          style: style,
          color: palette.woodColor,
          cost: 680
        });

        // Visitor / Client Lounge Accent Armchair
        items.push({
          id: 'chair_1',
          type: 'armchair',
          name: 'Executive Lounge Club Chair',
          position: [-W / 2 + 1.2, 0, 0.85],
          rotation: [0, Math.PI / 3, 0],
          style: style,
          color: palette.accentColor,
          cost: 480
        });

        // Low Round Side Table next to armchair
        items.push({
          id: 'table_1',
          type: 'coffee_table',
          name: 'Marble & Brass Side Table',
          position: [-W / 2 + 1.85, 0, 0.55],
          rotation: [0, 0, 0],
          style: style,
          color: palette.woodColor,
          cost: 260
        });

        // Wall Art above credenza
        items.push({
          id: 'art_1',
          type: 'wall_art',
          name: 'Executive Fine Art Canvas',
          position: [-W / 2 + 0.05, 1.9, -0.2],
          rotation: [0, Math.PI / 2, 0],
          style: style,
          cost: 190
        });

        // Brass Task Floor Lamp
        items.push({
          id: 'lamp_1',
          type: 'floor_lamp',
          name: 'Sculptural Brass Task Lamp',
          position: [W / 2 - 0.75, 0, -L / 2 + 0.8],
          rotation: [0, 0, 0],
          style: style,
          cost: 230
        });

        // Overhead Pendant Light
        items.push({
          id: 'pendant_1',
          type: 'pendant_light',
          name: 'Architectural Linear Pendant',
          position: [0, 0, 0.1],
          rotation: [0, 0, 0],
          style: style,
          cost: 210
        });

        // Potted Fiddle Leaf Fig
        items.push({
          id: 'plant_1',
          type: 'plant',
          name: 'Potted Fiddle Leaf Fig',
          position: [-W / 2 + 0.65, 0, -L / 2 + 0.7],
          rotation: [0, 0, 0],
          style: style,
          cost: 95
        });

        // Low-pile Executive Area Rug
        items.push({
          id: 'rug_1',
          type: 'rug',
          name: 'Executive Wool Area Rug',
          position: [0, 0, -0.15],
          rotation: [0, 0, 0],
          style: style,
          dimensions: [2.6, 2.0],
          cost: 290
        });

      } else if (officeType === 2) {
        // TYPE 2: MINIMALIST ZEN FOCUS STUDIO
        concept = `TYPE 2: MINIMALIST ZEN FOCUS STUDIO (${style.toUpperCase()})`;
        spatialRationale = `Optimized for deep unbroken focus and cognitive tranquility. Employs low-horizon storage and floating lines to minimize visual clutter. Unobstructed sightlines and ample negative floor space prevent mental fatigue during long working sprints.`;
        lightingPlan = `Gentle, indirect daylight-balanced illumination (3500K) that reduces eye strain, paired with a warm twilight paper-lantern floor lamp for calm evening reflection.`;

        // Clean-lined Minimalist Desk
        items.push({
          id: 'desk_1',
          type: 'desk',
          name: 'Minimalist Japandi Work Desk',
          position: [0, 0, -L / 2 + 0.95],
          rotation: [0, 0, 0],
          style: 'minimalist',
          color: palette.woodColor,
          cost: 580
        });

        // Sleek Ergonomic Chair
        items.push({
          id: 'office_chair_1',
          type: 'office_chair',
          name: 'Sleek Ergonomic Task Chair',
          position: [0, 0, -L / 2 + 1.6],
          rotation: [0, Math.PI, 0],
          style: 'minimalist',
          cost: 320
        });

        // Low Horizontal Floating Storage Credenza along left wall
        items.push({
          id: 'credenza_1',
          type: 'credenza',
          name: 'Low Horizon Storage Credenza',
          position: [-W / 2 + 0.38, 0, 0.2],
          rotation: [0, Math.PI / 2, 0],
          style: 'minimalist',
          color: palette.woodColor,
          cost: 590
        });

        // Minimalist Bauhaus Canvas
        items.push({
          id: 'art_1',
          type: 'wall_art',
          name: 'Zen Bauhaus Minimal Canvas',
          position: [0, 1.9, -L / 2 + 0.05],
          rotation: [0, 0, 0],
          style: 'minimalist',
          cost: 160
        });

        // Paper Lantern Floor Lamp
        items.push({
          id: 'lamp_1',
          type: 'floor_lamp',
          name: 'Zen Paper Lantern Lamp',
          position: [-W / 2 + 0.65, 0, -L / 2 + 0.75],
          rotation: [0, 0, 0],
          style: 'minimalist',
          cost: 160
        });

        // Diffused Orb Pendant Light
        items.push({
          id: 'pendant_1',
          type: 'pendant_light',
          name: 'Diffused Orb Pendant Light',
          position: [0, 0, -L / 2 + 1.25],
          rotation: [0, 0, 0],
          style: 'minimalist',
          cost: 175
        });

        // Potted Zen Bamboo
        items.push({
          id: 'plant_1',
          type: 'plant',
          name: 'Potted Zen Bamboo',
          position: [W / 2 - 0.6, 0, -L / 2 + 0.75],
          rotation: [0, 0, 0],
          style: 'minimalist',
          cost: 85
        });

        // Organic Jute & Wool Low-pile Rug
        items.push({
          id: 'rug_1',
          type: 'rug',
          name: 'Organic Jute & Wool Rug',
          position: [0, 0, -L / 2 + 1.3],
          rotation: [0, 0, 0],
          style: 'minimalist',
          dimensions: [2.5, 1.9],
          cost: 220
        });

      } else if (officeType === 3) {
        // TYPE 3: CREATIVE DUAL-SCREEN TECH BATTLESTATION
        concept = `TYPE 3: CREATIVE TECH BATTLESTATION (${style.toUpperCase()})`;
        spatialRationale = `Specially calibrated for software engineers, designers, and multimedia creators. Centers on a wide-format dual-monitor battlestation with ergonomic caster clearances, supplemented by a secondary breakout armchair for creative brainstorming away from screens.`;
        lightingPlan = `Crisp 4000K-4500K circadian-tuned task lighting designed to banish screen glare, backed by warm ambient fill lighting to eliminate contrast eye fatigue during nighttime builds.`;

        // Dual Monitor Battlestation
        items.push({
          id: 'desk_1',
          type: 'gaming_desk',
          name: 'Dual-Monitor Battlestation Desk',
          position: [0, 0, -L / 2 + 0.95],
          rotation: [0, 0, 0],
          style: style,
          cost: 1050
        });

        // High-Performance Ergonomic Task Chair
        items.push({
          id: 'office_chair_1',
          type: 'office_chair',
          name: 'Pro Mesh Ergonomic Task Chair',
          position: [0, 0, -L / 2 + 1.65],
          rotation: [0, Math.PI, 0],
          style: style,
          cost: 380
        });

        // Tech Bookshelf & Component Tower along right wall
        items.push({
          id: 'bookshelf_1',
          type: 'bookshelf',
          name: 'Tech Reference & Component Shelf',
          position: [W / 2 - 0.35, 0, -0.2],
          rotation: [0, -Math.PI / 2, 0],
          style: style,
          cost: 460
        });

        // Hardware & Media Credenza along left wall
        items.push({
          id: 'credenza_1',
          type: 'credenza',
          name: 'Hardware & Media Credenza',
          position: [-W / 2 + 0.35, 0, -0.2],
          rotation: [0, Math.PI / 2, 0],
          style: style,
          color: palette.woodColor,
          cost: 640
        });

        // Creative Breakout Lounge Armchair
        items.push({
          id: 'chair_1',
          type: 'armchair',
          name: 'Creative Breakout Lounge Chair',
          position: [-W / 2 + 1.15, 0, L / 2 - 1.1],
          rotation: [0, Math.PI / 4, 0],
          style: style,
          color: palette.accentColor,
          cost: 440
        });

        // Contemporary Geometric Wall Art
        items.push({
          id: 'art_1',
          type: 'wall_art',
          name: 'Geometric Modern Tech Canvas',
          position: [0, 1.9, -L / 2 + 0.05],
          rotation: [0, 0, 0],
          style: style,
          cost: 180
        });

        // Articulated Arc Floor Task Lamp
        items.push({
          id: 'lamp_1',
          type: 'floor_lamp',
          name: 'Articulated Arc Task Lamp',
          position: [W / 2 - 0.65, 0, L / 2 - 1.2],
          rotation: [0, 0, 0],
          style: style,
          cost: 230
        });

        // Modern Articulated Overhead Pendant Light
        items.push({
          id: 'pendant_1',
          type: 'pendant_light',
          name: 'Modern Articulated Pendant',
          position: [0, 0, -L / 2 + 1.25],
          rotation: [0, 0, 0],
          style: style,
          cost: 210
        });

        // Low-friction Tech Area Rug
        items.push({
          id: 'rug_1',
          type: 'rug',
          name: 'Low-Friction Caster Office Rug',
          position: [0, 0, -L / 2 + 1.3],
          rotation: [0, 0, 0],
          style: style,
          dimensions: [2.6, 2.0],
          cost: 240
        });

        // Air-Purifying Snake Plant
        items.push({
          id: 'plant_1',
          type: 'plant',
          name: 'Air-Filtering Snake Plant',
          position: [W / 2 - 0.6, 0, -L / 2 + 0.7],
          rotation: [0, 0, 0],
          style: style,
          cost: 85
        });

      } else {
        // TYPE 4: ACADEMIC SCHOLAR & READING SANCTUARY
        concept = `TYPE 4: ACADEMIC SCHOLAR & READING SANCTUARY (${style.toUpperCase()})`;
        spatialRationale = `A quiet, reflective intellectual haven inspired by historic university libraries. Features expansive reference wall shelving, a dedicated writing desk oriented for natural daylight, and an intimate reading armchair corner for immersive study and deep literature review.`;
        lightingPlan = `Warm, atmospheric 2700K incandescent-style lighting: dedicated directional reading illumination beside the wing armchair, soft vertical shelf uplighting, and a cozy central timber pendant fixture.`;

        // Solid Natural Wood Writing Desk along right wall
        items.push({
          id: 'desk_1',
          type: 'desk',
          name: 'Solid Oak Scholar Writing Desk',
          position: [W / 2 - 0.85, 0, 0.0],
          rotation: [0, -Math.PI / 2, 0],
          style: 'traditional',
          color: palette.woodColor,
          cost: 780
        });

        // Ergonomic Scholar Desk Chair
        items.push({
          id: 'office_chair_1',
          type: 'office_chair',
          name: 'Classic Ergonomic Study Chair',
          position: [W / 2 - 1.55, 0, 0.0],
          rotation: [0, Math.PI / 2, 0],
          style: 'traditional',
          cost: 340
        });

        // Expansive Open Library Bookshelf along back wall
        items.push({
          id: 'bookshelf_1',
          type: 'bookshelf',
          name: 'Grand Scholar Library Bookshelf',
          position: [0, 0, -L / 2 + 0.35],
          rotation: [0, 0, 0],
          style: 'traditional',
          cost: 580
        });

        // Deep Hygge Reading Armchair in left corner
        items.push({
          id: 'chair_1',
          type: 'armchair',
          name: 'Scholar Wingback Reading Chair',
          position: [-W / 2 + 1.15, 0, 0.5],
          rotation: [0, Math.PI / 4, 0],
          style: 'traditional',
          color: palette.accentColor,
          cost: 490
        });

        // Round Timber Reading Table
        items.push({
          id: 'table_1',
          type: 'coffee_table',
          name: 'Round Timber Reading Table',
          position: [-W / 2 + 1.8, 0, 0.25],
          rotation: [0, 0, 0],
          style: 'traditional',
          color: palette.woodColor,
          cost: 220
        });

        // Directional Timber Reading Floor Lamp
        items.push({
          id: 'lamp_1',
          type: 'floor_lamp',
          name: 'Nordic Timber Reading Lamp',
          position: [-W / 2 + 0.6, 0, 1.2],
          rotation: [0, 0, 0],
          style: 'traditional',
          cost: 210
        });

        // Botanical Historical Canvas
        items.push({
          id: 'art_1',
          type: 'wall_art',
          name: 'Botanical Scholar Canvas',
          position: [W / 2 - 0.05, 1.9, 0.0],
          rotation: [0, -Math.PI / 2, 0],
          style: 'traditional',
          cost: 180
        });

        // Woven Timber Overhead Pendant
        items.push({
          id: 'pendant_1',
          type: 'pendant_light',
          name: 'Woven Timber Pendant Light',
          position: [0, 0, 0.1],
          rotation: [0, 0, 0],
          style: 'traditional',
          cost: 190
        });

        // Plush Wool Scholar Area Rug
        items.push({
          id: 'rug_1',
          type: 'rug',
          name: 'Plush Wool Scholar Rug',
          position: [0, 0, 0.1],
          rotation: [0, 0, 0],
          style: 'traditional',
          dimensions: [2.8, 2.2],
          cost: 320
        });

        // Potted Ficus Tree
        items.push({
          id: 'plant_1',
          type: 'plant',
          name: 'Potted Scholar Ficus Tree',
          position: [-W / 2 + 0.65, 0, -L / 2 + 0.7],
          rotation: [0, 0, 0],
          style: 'traditional',
          cost: 95
        });
      }
    } else if (roomType === 'dining_room' || roomType.startsWith('dining_room_')) {
      // Determine which of the 4 Dining Room Design Types is selected
      let diningType = pref.diningType || 1;
      if (roomType === 'dining_room_minimal' || roomType === 'dining_room_type2') diningType = 2;
      else if (roomType === 'dining_room_luxury' || roomType === 'dining_room_type3') diningType = 3;
      else if (roomType === 'dining_room_scandi' || roomType === 'dining_room_type4') diningType = 4;
      else if (roomType === 'dining_room' && pref.diningType) diningType = parseInt(pref.diningType, 10) || 1;

      if (diningType === 1) {
        // TYPE 1: GRAND BANQUET & ENTERTAINING SUITE
        concept = `TYPE 1: GRAND BANQUET & ENTERTAINING SUITE (${style.toUpperCase()})`;
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
        // TYPE 2: MINIMALIST ZEN TEA & DINING PAVILION
        concept = `TYPE 2: MINIMALIST ZEN TEA & DINING PAVILION (${style.toUpperCase()})`;
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
        // TYPE 3: MODERN LUXURY PENTHOUSE DINING SALON
        concept = `TYPE 3: MODERN LUXURY PENTHOUSE DINING SALON (${style.toUpperCase()})`;
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
        // TYPE 4: SCANDINAVIAN HYGGE FARMHOUSE DINING
        concept = `TYPE 4: SCANDINAVIAN HYGGE FARMHOUSE DINING (${style.toUpperCase()})`;
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
        // TYPE 1: ISLAND CHEF'S GOURMET KITCHEN (OPEN-CONCEPT ISLAND LAYOUT)
        concept = `TYPE 1: ISLAND CHEF'S GOURMET KITCHEN (${style.toUpperCase()})`;
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
        // TYPE 2: L-SHAPED FAMILY KITCHEN WITH BREAKFAST NOOK
        concept = `TYPE 2: L-SHAPED FAMILY KITCHEN & BREAKFAST NOOK (${style.toUpperCase()})`;
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
        // TYPE 3: PARALLEL GALLEY PROFESSIONAL KITCHEN (DOUBLE-BANK CHEF STUDIO)
        concept = `TYPE 3: PARALLEL GALLEY PROFESSIONAL KITCHEN (${style.toUpperCase()})`;
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
        // TYPE 4: U-SHAPED LUXURY PENINSULA KITCHEN (CONTINUOUS WRAP & COCKTAIL BAR)
        concept = `TYPE 4: U-SHAPED LUXURY PENINSULA KITCHEN (${style.toUpperCase()})`;
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
      : pref.roomType === 'home_office_minimal' ? 'Minimalist Zen Focus Home Office'
      : pref.roomType === 'home_office_creative' ? 'Creative Tech Battlestation Studio'
      : pref.roomType === 'home_office_academic' ? 'Academic Scholar & Reading Sanctuary Study'
      : pref.roomType.startsWith('home_office') ? 'Executive Suite & Library Home Office'
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
    // Authentication Guard
    try {
      const stored = localStorage.getItem('ai_interior_user');
      if (!stored) {
        window.location.replace('login.html?redirect=studio.html');
        return;
      }
    } catch (e) {
      window.location.replace('login.html?redirect=studio.html');
      return;
    }

    this.canvas = document.getElementById('canvas3d');
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

  // 4. RAYCASTING, 3D MOUSE DRAGGING & SELECTION
  initRaycasting() {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.canvas.addEventListener('pointerdown', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      this.raycaster.setFromCamera(this.mouse, this.camera);

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
            this.showToast(nextSwing > 0 ? '🚪 Room Door opened' : '🚪 Room Door closed');
          }
        }
        return;
      }

      const interactiveTargets = [
        ...this.furnitureGroup.children,
        ...(this.roomBuilder.windowGroup ? [this.roomBuilder.windowGroup] : []),
        ...(this.roomBuilder.doorGroup ? [this.roomBuilder.doorGroup] : [])
      ];
      const intersects = this.raycaster.intersectObjects(interactiveTargets, true);

      if (intersects.length > 0) {
        const clickedMesh = intersects[0].object;

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
          this.showToast(nextSwing > 0 ? '🚪 Room Door opened (80°)' : '🚪 Room Door closed (0°)');
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

    const isWallArt = this.selectedRoot?.userData?.type === 'wall_art' || this.selectedRoot?.userData?.isWallMounted;
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

    if (this.selectedRoot?.userData?.type === 'wall_art' || this.selectedRoot?.userData?.isWallMounted) {
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

    const isWallMounted = this.selectedRoot?.userData?.isWallMounted || this.selectedRoot?.userData?.type === 'wall_art';
    if (isWallMounted) {
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
    if (!this.selectedRoot || (this.selectedRoot.userData?.type !== 'wall_art' && !this.selectedRoot.userData?.isWallMounted)) return;
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

    // Master Bedroom 4 Design Types Selector Buttons
    document.querySelectorAll('.bedroom-type-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetType = btn.getAttribute('data-bedroom-type');
        const roomSelect = document.getElementById('room-type');
        if (roomSelect) {
          roomSelect.value = targetType;
        }
        this.syncRoomVariantsUI(targetType);
        this.triggerAIGeneration();
        const typeTitle = btn.querySelector('strong')?.textContent || 'Master Bedroom Type';
        this.showToast(`✨ Switched to ${typeTitle}`);
      });
    });

    // Living Room 4 Design Types Selector Buttons
    document.querySelectorAll('.living-type-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetType = btn.getAttribute('data-living-type');
        const roomSelect = document.getElementById('room-type');
        if (roomSelect) {
          roomSelect.value = targetType;
        }
        this.syncRoomVariantsUI(targetType);
        this.triggerAIGeneration();
        const typeTitle = btn.querySelector('strong')?.textContent || 'Living Room Type';
        this.showToast(`✨ Switched to ${typeTitle}`);
      });
    });

    // Home Office 4 Design Types Selector Buttons
    document.querySelectorAll('.office-type-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetType = btn.getAttribute('data-office-type');
        const roomSelect = document.getElementById('room-type');
        if (roomSelect) {
          roomSelect.value = targetType;
        }
        this.syncRoomVariantsUI(targetType);
        this.triggerAIGeneration();
        const typeTitle = btn.querySelector('strong')?.textContent || 'Home Office Type';
        this.showToast(`✨ Switched to ${typeTitle}`);
      });
    });

    // Dining Room 4 Design Types Selector Buttons
    document.querySelectorAll('.dining-type-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetType = btn.getAttribute('data-dining-type');
        const roomSelect = document.getElementById('room-type');
        if (roomSelect) {
          roomSelect.value = targetType;
        }
        this.syncRoomVariantsUI(targetType);
        this.triggerAIGeneration();
        const typeTitle = btn.querySelector('strong')?.textContent || 'Dining Room Type';
        this.showToast(`✨ Switched to ${typeTitle}`);
      });
    });

    // Modular Kitchen 4 Design Types Selector Buttons
    document.querySelectorAll('.kitchen-type-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetType = btn.getAttribute('data-kitchen-type');
        const roomSelect = document.getElementById('room-type');
        if (roomSelect) {
          roomSelect.value = targetType;
        }
        this.syncRoomVariantsUI(targetType);
        this.triggerAIGeneration();
        const typeTitle = btn.querySelector('strong')?.textContent || 'Modular Kitchen Type';
        this.showToast(`✨ Switched to ${typeTitle}`);
      });
    });

    // Instant Room Type Switching
    document.getElementById('room-type')?.addEventListener('change', (e) => {
      const selectedType = e.target.value;
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

    // Add items from catalog
    document.querySelectorAll('.add-catalog-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.type;
        const isWall = type === 'wall_art';
        const halfL = (this.currentRoomDimensions?.length || 4.5) / 2;
        this.addFurnitureItem({
          type: type,
          style: this.currentStyle,
          position: isWall ? [0, 1.8, -halfL + 0.04] : [0, 0, 0],
          rotation: [0, 0, 0]
        });
        this.showToast(isWall ? '🖼️ Added Wall Art to Back Wall' : `Added ${type.replace('_', ' ')} to center`);
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

    doorPos?.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      if (doorPosVal) doorPosVal.textContent = `${val >= 0 ? '+' : ''}${val.toFixed(1)}m`;
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
      this.roomBuilder.setDoorSwing(val);
    });

    this.syncRoomVariantsUI(document.getElementById('room-type')?.value || 'bedroom');
  }

  // Master Bedroom & Living Room Variants UI Synchronizer
  syncRoomVariantsUI(currentRoomType) {
    // 1. Bedroom Variants
    const bedWrapper = document.getElementById('bedroom-variants-wrapper');
    const bedPill = document.getElementById('bedroom-type-pill');
    const bedButtons = document.querySelectorAll('.bedroom-type-btn');
    const isBedroom = currentRoomType === 'bedroom' || (currentRoomType && currentRoomType.startsWith('bedroom_'));

    if (bedWrapper) {
      bedWrapper.style.display = isBedroom ? 'block' : 'none';
      if (isBedroom) {
        bedButtons.forEach(btn => {
          const type = btn.getAttribute('data-bedroom-type');
          btn.classList.toggle('active', type === currentRoomType);
        });
        if (bedPill) {
          if (currentRoomType === 'bedroom_zen') bedPill.textContent = 'Type 2 Active';
          else if (currentRoomType === 'bedroom_hotel') bedPill.textContent = 'Type 3 Active';
          else if (currentRoomType === 'bedroom_scandi') bedPill.textContent = 'Type 4 Active';
          else bedPill.textContent = 'Type 1 Active';
        }
      }
    }

    // 2. Living Room Variants
    const livingWrapper = document.getElementById('living-variants-wrapper');
    const livingPill = document.getElementById('living-type-pill');
    const livingButtons = document.querySelectorAll('.living-type-btn');
    const isLiving = currentRoomType === 'living_room' || (currentRoomType && currentRoomType.startsWith('living_room_'));

    if (livingWrapper) {
      livingWrapper.style.display = isLiving ? 'block' : 'none';
      if (isLiving) {
        livingButtons.forEach(btn => {
          const type = btn.getAttribute('data-living-type');
          btn.classList.toggle('active', type === currentRoomType);
        });
        if (livingPill) {
          if (currentRoomType === 'living_room_zen') livingPill.textContent = 'Type 2 Active';
          else if (currentRoomType === 'living_room_luxury') livingPill.textContent = 'Type 3 Active';
          else if (currentRoomType === 'living_room_cozy') livingPill.textContent = 'Type 4 Active';
          else livingPill.textContent = 'Type 1 Active';
        }
      }
    }

    // 3. Home Office Variants
    const officeWrapper = document.getElementById('office-variants-wrapper');
    const officePill = document.getElementById('office-type-pill');
    const officeButtons = document.querySelectorAll('.office-type-btn');
    const isOffice = currentRoomType === 'home_office' || (currentRoomType && currentRoomType.startsWith('home_office_'));

    if (officeWrapper) {
      officeWrapper.style.display = isOffice ? 'block' : 'none';
      if (isOffice) {
        officeButtons.forEach(btn => {
          const type = btn.getAttribute('data-office-type');
          btn.classList.toggle('active', type === currentRoomType);
        });
        if (officePill) {
          if (currentRoomType === 'home_office_minimal') officePill.textContent = 'Type 2 Active';
          else if (currentRoomType === 'home_office_creative') officePill.textContent = 'Type 3 Active';
          else if (currentRoomType === 'home_office_academic') officePill.textContent = 'Type 4 Active';
          else officePill.textContent = 'Type 1 Active';
        }
      }
    }

    // 4. Dining Room Variants
    const diningWrapper = document.getElementById('dining-variants-wrapper');
    const diningPill = document.getElementById('dining-type-pill');
    const diningButtons = document.querySelectorAll('.dining-type-btn');
    const isDining = currentRoomType === 'dining_room' || (currentRoomType && currentRoomType.startsWith('dining_room_'));

    if (diningWrapper) {
      diningWrapper.style.display = isDining ? 'block' : 'none';
      if (isDining) {
        diningButtons.forEach(btn => {
          const type = btn.getAttribute('data-dining-type');
          btn.classList.toggle('active', type === currentRoomType);
        });
        if (diningPill) {
          if (currentRoomType === 'dining_room_minimal') diningPill.textContent = 'Type 2 Active';
          else if (currentRoomType === 'dining_room_luxury') diningPill.textContent = 'Type 3 Active';
          else if (currentRoomType === 'dining_room_scandi') diningPill.textContent = 'Type 4 Active';
          else diningPill.textContent = 'Type 1 Active';
        }
      }
    }

    // 5. Modular Kitchen Variants
    const kitchenWrapper = document.getElementById('kitchen-variants-wrapper');
    const kitchenPill = document.getElementById('kitchen-type-pill');
    const kitchenButtons = document.querySelectorAll('.kitchen-type-btn');
    const isKitchen = currentRoomType === 'kitchen' || (currentRoomType && currentRoomType.startsWith('kitchen_'));

    if (kitchenWrapper) {
      kitchenWrapper.style.display = isKitchen ? 'block' : 'none';
      if (isKitchen) {
        kitchenButtons.forEach(btn => {
          const type = btn.getAttribute('data-kitchen-type');
          btn.classList.toggle('active', type === currentRoomType);
        });
        if (kitchenPill) {
          if (currentRoomType === 'kitchen_lshape') kitchenPill.textContent = 'Type 2 Active';
          else if (currentRoomType === 'kitchen_galley') kitchenPill.textContent = 'Type 3 Active';
          else if (currentRoomType === 'kitchen_ushape') kitchenPill.textContent = 'Type 4 Active';
          else kitchenPill.textContent = 'Type 1 Active';
        }
      }
    }
  }

  // Backward compatibility alias
  syncBedroomVariantsUI(currentRoomType) {
    this.syncRoomVariantsUI(currentRoomType);
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

    const currentRoomType = document.getElementById('room-type')?.value || 'bedroom';
    let bedType = 1;
    if (currentRoomType === 'bedroom_zen') bedType = 2;
    else if (currentRoomType === 'bedroom_hotel') bedType = 3;
    else if (currentRoomType === 'bedroom_scandi') bedType = 4;

    let livingType = 1;
    if (currentRoomType === 'living_room_zen') livingType = 2;
    else if (currentRoomType === 'living_room_luxury') livingType = 3;
    else if (currentRoomType === 'living_room_cozy') livingType = 4;

    let officeType = 1;
    if (currentRoomType === 'home_office_minimal') officeType = 2;
    else if (currentRoomType === 'home_office_creative') officeType = 3;
    else if (currentRoomType === 'home_office_academic') officeType = 4;

    let diningType = 1;
    if (currentRoomType === 'dining_room_minimal') diningType = 2;
    else if (currentRoomType === 'dining_room_luxury') diningType = 3;
    else if (currentRoomType === 'dining_room_scandi') diningType = 4;

    let kitchenType = 1;
    if (currentRoomType === 'kitchen_lshape') kitchenType = 2;
    else if (currentRoomType === 'kitchen_galley') kitchenType = 3;
    else if (currentRoomType === 'kitchen_ushape') kitchenType = 4;

    this.syncRoomVariantsUI(currentRoomType);

    const pref = {
      roomType: currentRoomType,
      bedroomType: bedType,
      livingRoomType: livingType,
      officeType: officeType,
      diningType: diningType,
      kitchenType: kitchenType,
      dimensions: {
        width: parseFloat(document.getElementById('room-w').value) || 5.0,
        length: parseFloat(document.getElementById('room-l').value) || 4.5,
        height: parseFloat(document.getElementById('room-h').value) || 2.8
      },
      style: this.currentStyle,
      colorScheme: document.getElementById('color-scheme').value,
      flooring: document.getElementById('flooring-select').value,
      lighting: 'warm_ambient',
      customNotes: ''
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
        table.userData = { type: 'dining_table', name: 'Dining Table', cost: 650 };
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
      bedroom: 'Master Bedroom (Type 1: Luxury Suite)',
      bedroom_zen: 'Master Bedroom (Type 2: Minimalist Zen)',
      bedroom_hotel: 'Master Bedroom (Type 3: Hotel Chic & Vanity)',
      bedroom_scandi: 'Master Bedroom (Type 4: Scandinavian Haven)',
      living_room: 'Living Room (Type 1: Media Lounge)',
      living_room_zen: 'Living Room (Type 2: Japandi Zen)',
      living_room_luxury: 'Living Room (Type 3: Luxury Penthouse)',
      living_room_cozy: 'Living Room (Type 4: Scandi Hygge)',
      home_office: 'Home Office (Type 1: Executive Suite)',
      home_office_minimal: 'Home Office (Type 2: Zen Focus Studio)',
      home_office_creative: 'Home Office (Type 3: Tech Battlestation)',
      home_office_academic: 'Home Office (Type 4: Academic Scholar Nook)',
      dining_room: 'Dining Room (Type 1: Grand Banquet)',
      dining_room_minimal: 'Dining Room (Type 2: Zen Tea Pavilion)',
      dining_room_luxury: 'Dining Room (Type 3: Luxury Penthouse Salon)',
      dining_room_scandi: 'Dining Room (Type 4: Scandi Farmhouse)',
      kitchen: "Modular Kitchen (Type 1: Island Chef's Gourmet)",
      kitchen_lshape: "Modular Kitchen (Type 2: L-Shaped Family Nook)",
      kitchen_galley: "Modular Kitchen (Type 3: Parallel Galley Studio)",
      kitchen_ushape: "Modular Kitchen (Type 4: U-Shaped Luxury Peninsula)"
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
}

// Instantiate App once DOM is loaded
if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', () => { new App(); });
} else {
  new App();
}


})();