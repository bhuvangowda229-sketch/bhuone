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
