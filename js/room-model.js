// 3D Room Builder with dynamic dimensions, cutaway walls, windows, and floors
import { TextureGenerator } from './textures.js';

export class RoomBuilder {
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
      this.buildCompleteHouse(this.currentWallColor, type);
    } else {
      this.buildFloor(this.currentDimensions.width, this.currentDimensions.length, type);
    }
  }

  // ==========================================
  // COMPLETE HOUSE ARCHITECTURAL BUILDER
  // ==========================================
  buildCompleteHouse(wallColorHex = 0xfaf5ee, flooringType = 'wood_oak') {
    this.isCompleteHouse = true;
    this.currentDimensions = { width: 14.0, length: 11.5, height: 2.8 };
    this.currentWallColor = wallColorHex;
    this.currentFlooring = flooringType;

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

    // 2. Multi-Room Floors with Transitions
    this.buildHouseFloors(flooringType);

    // 3. Complete House Perimeter & Interior Dividing Walls
    this.buildHouseWalls(H, wallColorHex);

    // 4. Exterior Windows & Interior Passages/Doors
    this.buildHouseWindowsAndDoors(H);

    // 5. Baseboards along walls
    this.buildHouseBaseboards(H);

    // 6. 3D Interactive Room Pin Badges
    this.buildHouseRoomBadges();

    // 7. Measurement Floor Grid for Complete House
    this.buildFloorGrid(14.0, 11.5);
  }

  buildHouseFloors(flooringType) {
    const makeFloorMesh = (W, L, posX, posZ, floorType, zoneKey) => {
      let floorTexture;
      let roughness = 0.4;
      let metalness = 0.05;

      switch (floorType) {
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
      const mesh = new THREE.Mesh(floorGeom, floorMat);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.set(posX, 0, posZ);
      mesh.receiveShadow = true;
      mesh.name = `HouseFloor_${zoneKey}`;
      mesh.userData = { isFloor: true, roomZone: zoneKey };
      this.houseFloors.push(mesh);
      this.roomGroup.add(mesh);
      return mesh;
    };

    // 1. Living Room Floor (Front-Left)
    makeFloorMesh(6.0, 5.5, -4.0, 3.25, flooringType, 'living');

    // 2. Dining Room Floor (Front-Center)
    makeFloorMesh(4.0, 5.5, 1.0, 3.25, flooringType, 'dining');

    // 3. Modular Kitchen Floor (Front-Right - Polished Porcelain Tile)
    const kitchenFlooring = (flooringType === 'marble') ? 'marble' : 'tile';
    makeFloorMesh(4.0, 5.5, 5.0, 3.25, kitchenFlooring, 'kitchen');

    // 4. Master Bedroom Floor (Back-Left)
    makeFloorMesh(6.5, 6.0, -3.75, -2.5, flooringType, 'bedroom');

    // 5. Home Office Floor (Back-Right - Elegant Hardwood)
    const officeFlooring = (flooringType === 'wood_oak' || flooringType === 'dark_walnut') ? flooringType : 'dark_walnut';
    makeFloorMesh(7.5, 6.0, 3.25, -2.5, officeFlooring, 'office');

    // Decorative Satin Brass Doorway Threshold Strips
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.85, roughness: 0.25 });
    const addThreshold = (w, d, x, z) => {
      const geom = new THREE.BoxGeometry(w, 0.008, d);
      const strip = new THREE.Mesh(geom, brassMat);
      strip.position.set(x, 0.004, z);
      strip.name = 'DoorwayThreshold';
      this.roomGroup.add(strip);
    };

    // Archway transition between Living and Dining
    addThreshold(0.08, 2.6, -1.0, 3.1);
    // Counter pass transition between Dining and Kitchen
    addThreshold(0.08, 3.0, 3.0, 3.1);
    // Master Bedroom doorway threshold
    addThreshold(1.1, 0.08, -1.85, 0.5);
    // Home Office doorway threshold
    addThreshold(1.1, 0.08, 1.95, 0.5);
  }

  buildHouseWalls(H, wallColorHex) {
    const createWallMat = (isCutaway = false) => new THREE.MeshStandardMaterial({
      color: wallColorHex,
      roughness: 0.85,
      side: THREE.DoubleSide,
      transparent: isCutaway,
      opacity: isCutaway ? (this.cutawayEnabled ? 0.0 : 0.95) : 1.0
    });

    const addWall = (w, h, d, x, y, z, name = 'Wall', isCutaway = false) => {
      const geom = new THREE.BoxGeometry(w, h, d);
      const mat = createWallMat(isCutaway);
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

    // A. EXTERIOR PERIMETER WALLS (14.0m x 11.5m Footprint)
    // 1. Back Exterior Wall (North, Z = -5.575)
    this.walls.back = addWall(14.3, H, 0.15, 0, H / 2, -5.575, 'Exterior Back Wall');

    // 2. Left Exterior Wall (West, X = -7.075)
    this.walls.left = addWall(0.15, H, 11.8, -7.075, H / 2, 0.25, 'Exterior Left Wall');

    // 3. Right Exterior Wall (East, X = 7.075)
    this.walls.right = addWall(0.15, H, 11.8, 7.075, H / 2, 0.25, 'Exterior Right Wall');

    // 4. Front Exterior Wall (South, Z = 6.075 - Cutaway View Enabled)
    this.walls.front = addWall(14.3, H, 0.15, 0, H / 2, 6.075, 'Exterior Front Wall (Cutaway)', true);

    // Front Architectural Base Curb (0.12m high border always visible to frame floor)
    const curbMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.7 });
    const curb = new THREE.Mesh(new THREE.BoxGeometry(14.3, 0.12, 0.15), curbMat);
    curb.position.set(0, 0.06, 6.075);
    this.roomGroup.add(curb);

    // B. INTERIOR DIVIDING WALLS WITH OPENINGS & PASSAGES
    // 1. East-West Dividing Spine Wall at Z = 0.5 (separating Front & Rear Wings)
    // Master Bedroom South Wall (-7.0 to -2.4m)
    addWall(4.6, H, 0.12, -4.7, H / 2, 0.5, 'Bedroom South Wall');
    // Master Bedroom Door Lintel (overhead beam above 1.1m door opening)
    addWall(1.1, 0.6, 0.12, -1.85, 2.5, 0.5, 'Bedroom Door Lintel');
    // Central Hallway Corridor Arch Lintel (overhead beam above 2.7m open passage)
    addWall(2.7, 0.45, 0.12, 0.05, 2.575, 0.5, 'Hallway Arch Lintel');
    // Home Office Door Lintel (overhead beam above 1.1m door opening)
    addWall(1.1, 0.6, 0.12, 1.95, 2.5, 0.5, 'Office Door Lintel');
    // Modular Kitchen North Wall (2.5 to 7.0m)
    addWall(4.5, H, 0.12, 4.75, H / 2, 0.5, 'Kitchen North Wall');

    // 2. North-South Dividing Wall in Rear Wing at X = -0.5 (Acoustic Partition Bedroom & Office)
    addWall(0.12, H, 6.0, -0.5, H / 2, -2.5, 'Bedroom-Office Acoustic Partition');

    // 3. North-South Dividing Wall in Front Wing at X = -1.0 (Living Room & Dining Room)
    // Back stub wall (0.5m to 1.8m)
    addWall(0.12, H, 1.3, -1.0, H / 2, 1.15, 'Living-Dining Partition Back');
    // Grand Open Archway Lintel (overhead beam above 2.6m wide arch opening)
    addWall(0.12, 0.45, 2.6, -1.0, 2.575, 3.1, 'Living-Dining Arch Lintel');
    // Front stub wall (4.4m to 6.0m)
    addWall(0.12, H, 1.6, -1.0, H / 2, 5.2, 'Living-Dining Partition Front');

    // 4. North-South Dividing Wall in Front Wing at X = 3.0 (Dining Room & Modular Kitchen)
    // Back stub wall (0.5m to 1.6m)
    addWall(0.12, H, 1.1, 3.0, H / 2, 1.05, 'Dining-Kitchen Partition Back');
    // Open Counter / Serving Arch Lintel (overhead beam above 3.0m wide open pass)
    addWall(0.12, 0.45, 3.0, 3.0, 2.575, 3.1, 'Dining-Kitchen Pass Lintel');
    // Front stub wall (4.6m to 6.0m)
    addWall(0.12, H, 1.4, 3.0, H / 2, 5.3, 'Dining-Kitchen Partition Front');
  }

  buildHouseWindowsAndDoors(H) {
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.3 });
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xbae6fd,
      transmission: 0.9,
      opacity: 0.4,
      transparent: true,
      roughness: 0.1
    });
    const doorFrameMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6 });
    const doorMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.7 });
    const handleMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.85, roughness: 0.2 });

    const createArchitecturalWindow = (w, h, posX, posY, posZ, rotY) => {
      const winGroup = new THREE.Group();
      winGroup.name = 'HouseWindow';
      // Frame
      const frame = new THREE.Mesh(new THREE.BoxGeometry(0.06, h, w), frameMat);
      winGroup.add(frame);
      // Glass
      const glass = new THREE.Mesh(new THREE.BoxGeometry(0.01, h - 0.1, w - 0.1), glassMat);
      winGroup.add(glass);
      // Mullions
      const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.07, h - 0.1, 0.03), frameMat);
      const crossH = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.03, w - 0.1), frameMat);
      winGroup.add(crossV);
      winGroup.add(crossH);

      winGroup.position.set(posX, posY, posZ);
      winGroup.rotation.y = rotY;
      this.roomGroup.add(winGroup);
      return winGroup;
    };

    // 1. Master Bedroom Window on West Exterior Wall
    createArchitecturalWindow(1.8, 1.4, -6.98, 1.5, -2.5, 0);

    // 2. Living Room Picture Window on West Exterior Wall
    createArchitecturalWindow(2.2, 1.5, -6.98, 1.5, 3.25, 0);

    // 3. Home Office Panoramic Double Window on East Exterior Wall
    createArchitecturalWindow(2.4, 1.4, 6.98, 1.5, -2.5, Math.PI);

    // 4. Modular Kitchen Casement Window on East Exterior Wall
    createArchitecturalWindow(1.6, 1.2, 6.98, 1.65, 3.25, Math.PI);

    // 5. Bedroom Window on North Exterior Wall
    createArchitecturalWindow(1.8, 1.3, -3.75, 1.6, -5.48, -Math.PI / 2);

    // Architectural Interior Doors with Casings and Handles
    const createInteriorDoor = (posX, posZ, swingDeg, isLeftSwing = false) => {
      const doorGroup = new THREE.Group();
      doorGroup.name = 'InteriorDoor';
      const dW = 0.95;
      const dH = 2.15;

      // Frame
      const fTop = new THREE.Mesh(new THREE.BoxGeometry(dW + 0.08, 0.04, 0.08), doorFrameMat);
      fTop.position.set(0, dH + 0.02, 0);
      const fL = new THREE.Mesh(new THREE.BoxGeometry(0.04, dH, 0.08), doorFrameMat);
      fL.position.set(-dW / 2 - 0.02, dH / 2, 0);
      const fR = new THREE.Mesh(new THREE.BoxGeometry(0.04, dH, 0.08), doorFrameMat);
      fR.position.set(dW / 2 + 0.02, dH / 2, 0);
      doorGroup.add(fTop);
      doorGroup.add(fL);
      doorGroup.add(fR);

      // Hinged Panel
      const hinge = new THREE.Group();
      hinge.position.set(-dW / 2, 0, 0);
      const panel = new THREE.Mesh(new THREE.BoxGeometry(dW - 0.02, dH - 0.02, 0.038), doorMat);
      panel.position.set(dW / 2, (dH - 0.02) / 2, 0);
      panel.castShadow = true;
      hinge.add(panel);

      // Brass Handle
      const hCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.12, 12), handleMat);
      hCyl.rotation.z = Math.PI / 2;
      hCyl.position.set(dW - 0.1, 1.0, 0.03);
      hinge.add(hCyl);

      hinge.rotation.y = (swingDeg || 0) * (Math.PI / 180);
      doorGroup.add(hinge);

      doorGroup.position.set(posX, 0, posZ);
      this.roomGroup.add(doorGroup);
      return doorGroup;
    };

    // Master Bedroom Door (swings 20 degrees into bedroom)
    createInteriorDoor(-1.85, 0.5, 20);
    // Home Office Door (swings 20 degrees into office)
    createInteriorDoor(1.95, 0.5, 20);
  }

  buildHouseBaseboards(H) {
    const bbMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
    const bbH = 0.1;
    const bbD = 0.02;

    const addBB = (w, d, x, z) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, bbH, d), bbMat);
      mesh.position.set(x, bbH / 2, z);
      this.baseboards.push(mesh);
      this.roomGroup.add(mesh);
    };

    // Perimeter Back
    addBB(14.0, bbD, 0, -5.5 + bbD / 2);
    // Perimeter Left
    addBB(bbD, 11.5, -7.0 + bbD / 2, 0.25);
    // Perimeter Right
    addBB(bbD, 11.5, 7.0 - bbD / 2, 0.25);
  }

  buildHouseRoomBadges() {
    this.createRoomBadge('LIVING LOUNGE', '🛋️', -4.0, 3.25, 'living');
    this.createRoomBadge('DINING PAVILION', '🍽️', 1.0, 3.25, 'dining');
    this.createRoomBadge('MODULAR KITCHEN', '🍳', 5.0, 3.25, 'kitchen');
    this.createRoomBadge('MASTER BEDROOM', '🛏️', -3.75, -2.5, 'bedroom');
    this.createRoomBadge('HOME OFFICE & STUDY', '💼', 3.25, -2.5, 'office');
  }

  createRoomBadge(title, icon, x, z, roomKey) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 140;
    const ctx = canvas.getContext('2d');

    // Rounded rectangle dark glass pill background
    ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.75)';
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
    const badgeMat = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide
    });

    const badgeGeom = new THREE.PlaneGeometry(1.6, 0.44);
    const badge = new THREE.Mesh(badgeGeom, badgeMat);
    badge.rotation.x = -Math.PI / 2;
    badge.position.set(x, 0.04, z);
    badge.name = `RoomBadge_${roomKey}`;
    badge.userData = { isRoomBadge: true, roomZone: roomKey, title: title };
    this.roomBadges.push(badge);
    this.roomGroup.add(badge);
    return badge;
  }
}
