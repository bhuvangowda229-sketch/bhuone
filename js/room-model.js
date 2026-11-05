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
      this.buildCompleteHouse(this.currentWallColor, type);
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
    const isVilla = (this.houseType === 'villa_2bhk' || this.houseType === 'villa' || this.houseType === '2bhk' || this.houseType === 'complete_house_2bhk');
    this.currentDimensions = isVilla ? { width: 16.0, length: 18.5, height: 2.8 } : { width: 14.0, length: 13.0, height: 2.8 };
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

    if (isVilla) {
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

    // 1. Entrance Foyer (Front-Left - Polished Tiles)
    makeFloorMesh(3.2, 3.6, -4.7, 4.6, 'tile', 'foyer');

    // 2. Living Room Lounge (Front-Center - Light Porcelain Tile)
    makeFloorMesh(6.0, 4.6, -0.1, 4.1, 'tile', 'living');

    // 3. Dining Area (Front-Right - Light Porcelain Tile)
    makeFloorMesh(4.0, 4.6, 4.9, 4.1, 'tile', 'dining');

    // 4. Modular Kitchen (Rear-Right - Polished Porcelain Tile)
    makeFloorMesh(4.0, 6.0, 4.9, -2.2, 'tile', 'kitchen');

    // 5. Master Bedroom Suite (Rear-Left - Herringbone Wood Flooring)
    makeFloorMesh(5.6, 7.6, -3.5, -2.0, 'herringbone_wood', 'bedroom');

    // 6. Master Bathroom En-Suite (Rear-Center - Sky-Blue Designer Tiles)
    makeFloorMesh(3.6, 4.4, 1.1, -3.6, 'blue_tile', 'master_bath');

    // Outdoor Environment: Front Porch Entrance Steps
    const stepMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.7 });
    const step1 = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.08, 0.45), stepMat);
    step1.position.set(-4.7, 0.04, 6.55);
    this.roomGroup.add(step1);
    const step2 = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.08, 0.4), stepMat);
    step2.position.set(-4.7, 0.12, 6.45);
    this.roomGroup.add(step2);

    // Front Paved Driveway Approach & Front Lawn
    makeFloorMesh(4.8, 2.8, -3.8, 7.8, 'paving', 'driveway');
    makeFloorMesh(5.4, 2.8, 3.7, 7.8, 'grass', 'front_lawn');
    makeFloorMesh(1.6, 17.0, -7.2, 0.25, 'grass', 'left_garden');
    makeFloorMesh(1.6, 17.0, 7.2, 0.25, 'grass', 'right_garden');

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

    // A. EXTERIOR PERIMETER WALLS
    // 1. North Back Exterior Wall (Z = -6.0)
    this.walls.back = addWall(14.2, H, 0.15, 0.1, H / 2, -6.0, 'Exterior Back Wall');

    // 2. West Left Exterior Wall (X = -6.5)
    this.walls.left = addWall(0.15, H, 12.8, -6.5, H / 2, 0.2, 'Exterior Left Wall');

    // 3. East Right Exterior Wall (X = 6.9)
    this.walls.right = addWall(0.15, H, 12.8, 6.9, H / 2, 0.2, 'Exterior Right Wall');

    // 4. South Front Exterior Walls (Z = 6.4 - Cutaway View Enabled)
    // Foyer Front Wall Left
    addWall(0.9, H, 0.15, -5.75, H / 2, 6.4, 'Foyer Front Wall Left', true);
    // Foyer Front Door Lintel
    addWall(1.2, 0.6, 0.15, -4.7, 2.5, 6.4, 'Foyer Front Door Lintel', true);
    // Foyer Front Wall Right
    addWall(0.9, H, 0.15, -3.65, H / 2, 6.4, 'Foyer Front Wall Right', true);
    // Living Room Front Wall
    addWall(6.0, H, 0.15, -0.1, H / 2, 6.4, 'Living Room Front Wall (Cutaway)', true);
    // Dining Room Front Wall
    addWall(4.0, H, 0.15, 4.9, H / 2, 6.4, 'Dining Room Front Wall (Cutaway)', true);

    // Front Architectural Floor Curb
    const curbMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.7 });
    const curb = new THREE.Mesh(new THREE.BoxGeometry(13.6, 0.12, 0.15), curbMat);
    curb.position.set(0.1, 0.06, 6.4);
    this.roomGroup.add(curb);

    // B. INTERIOR DIVIDING WALLS
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
    addWall(0.12, H, 2.8, -0.7, H / 2, -4.6, 'Master Suite-Bath Wall North');
    // En-Suite Door Lintel
    addWall(0.12, 0.6, 1.1, -0.7, 2.5, -3.6, 'Master En-Suite Door Lintel');
    // South section of dividing wall
    addWall(0.12, H, 1.6, -0.7, H / 2, -2.4, 'Master Suite-Bath Wall South');

    // 4. North-South Dividing Wall between Master Bathroom and Modular Kitchen at X = 2.9
    addWall(0.12, H, 4.4, 2.9, H / 2, -3.6, 'Bath-Kitchen Dividing Wall');
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

    // 1. Master Bedroom West Picture Window
    createArchitecturalWindow(2.2, 1.5, -6.42, 1.5, -2.0, Math.PI / 2);

    // 2. Master Bedroom North Window (rear garden view)
    createArchitecturalWindow(2.0, 1.3, -3.5, 1.6, -5.92, -Math.PI / 2, true);

    // 3. Master Bathroom North Window (frosted privacy glass)
    createArchitecturalWindow(1.2, 1.0, 1.1, 1.8, -5.92, -Math.PI / 2, true);

    // 4. Modular Kitchen Casement Window on East Wall
    createArchitecturalWindow(1.8, 1.2, 6.82, 1.65, -2.2, -Math.PI / 2);

    // 5. Living Room Front Panoramic Window (Cutaway)
    createArchitecturalWindow(3.6, 2.0, -0.1, 1.2, 6.35, -Math.PI / 2, true);

    // 6. Dining Room Front Window (Cutaway)
    createArchitecturalWindow(2.4, 1.6, 4.9, 1.4, 6.35, -Math.PI / 2, true);

    // 7. Architectural Adjustable Front Entrance Door at Foyer
    this.buildVillaEntryDoor(H);
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

    // 1. Entrance Foyer (Front-Left)
    makeFloorMesh(3.0, 3.0, -4.7, 4.9, 'tile', 'foyer');

    // 2. Common Bathroom 1 (Mid-Left - Sky Blue Designer Tiles)
    makeFloorMesh(3.0, 2.8, -4.7, 2.0, 'blue_tile', 'common_bath');

    // 3. Second Bedroom (Back-Left - Warm Oak Wood)
    makeFloorMesh(4.4, 6.6, -4.0, -2.7, flooringType || 'wood_oak', 'bedroom2');

    // 4. Living Room Lounge (Center-Front - Polished Ivory Tile)
    makeFloorMesh(5.6, 4.6, -0.4, 4.1, 'tile', 'living');

    // 5. Dining Area (Center-Mid - Polished Ivory Tile)
    makeFloorMesh(4.2, 3.4, 0.3, 0.1, 'tile', 'dining');

    // 6. Modular Kitchen (Center-Back - Polished Tile)
    makeFloorMesh(4.2, 4.4, 0.3, -3.8, 'tile', 'kitchen');

    // 7. Master Bedroom (Front-Right - Warm Oak Wood)
    makeFloorMesh(4.0, 5.4, 4.4, 3.7, flooringType || 'wood_oak', 'bedroom');

    // 8. Walk-in Wardrobe / Dressing Area (Mid-Right)
    makeFloorMesh(2.0, 3.0, 3.4, -0.5, flooringType || 'wood_oak', 'walk_in_closet');

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
    addThreshold(0.06, 2.4, -3.2, 4.9);
    addThreshold(1.0, 0.06, -4.7, 3.4);
    addThreshold(1.0, 0.06, -4.0, 0.6);
    addThreshold(0.06, 2.6, 2.4, 3.7);
    addThreshold(1.2, 0.06, 3.4, 1.0);
    addThreshold(0.06, 1.0, 4.4, -0.5);
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

    // B. VILLA EXTERIOR BUILDING WALLS (Height H = 2.8m)
    addWall(8.8, H, 0.15, -1.8, H / 2, -6.0, 'Second Bed & Kitchen North Wall');
    addWall(4.2, H, 0.15, 4.4, H / 2, -2.0, 'Master Suite Backyard Wall');
    addWall(0.15, H, 7.2, 6.4, H / 2, -5.6, 'Backyard & Master East Exterior Wall');

    // Second Bed West Wall with Terracotta Accent
    const terracotta = 0xc2410c;
    addWall(0.15, H, 6.6, -6.2, H / 2, -2.7, 'Second Bed Terracotta Accent Wall', false, terracotta);
    addWall(0.15, H, 5.8, -6.2, H / 2, 3.5, 'Common Bath & Foyer West Wall');
    addWall(0.15, H, 5.4, 6.4, H / 2, 3.7, 'Master Bedroom East Exterior Wall');

    // Front Exterior Walls (Cutaway View Enabled)
    addWall(0.9, H, 0.15, -5.75, H / 2, 6.4, 'Foyer Front Wall Left', true);
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
    addWall(0.12, H, 2.8, -3.2, H / 2, 2.0, 'Common Bath East Wall');
    addWall(0.12, H, 1.2, -3.2, H / 2, 5.8, 'Foyer TV Partition Wall');

    // Slatted wood vertical screen between Foyer and Living Room
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.4 });
    for (let sz = 3.6; sz <= 5.0; sz += 0.28) {
      const slat = new THREE.Mesh(new THREE.BoxGeometry(0.04, H, 0.08), woodMat);
      slat.position.set(-3.2, H / 2, sz);
      this.roomGroup.add(slat);
    }

    addWall(3.0, H, 0.12, -4.7, H / 2, 3.4, 'Common Bath-Foyer Wall');
    addWall(3.0, H, 0.12, -4.7, H / 2, 0.6, 'Common Bath-Second Bed Wall');
    addWall(0.12, H, 6.6, -1.8, H / 2, -2.7, 'Second Bed-Kitchen Dividing Wall');
    addWall(0.12, H, 5.4, 2.4, H / 2, 3.7, 'Master Bed-Living Dividing Wall');
    addWall(0.12, H, 3.0, 2.4, H / 2, -0.5, 'Walk-in Closet-Dining Wall');
    addWall(1.0, H, 0.12, 2.9, H / 2, 1.0, 'Closet-Bed Wall Left');
    addWall(1.4, 0.6, 0.12, 4.1, 2.5, 1.0, 'Closet Doorway Lintel');
    addWall(1.0, H, 0.12, 5.9, H / 2, 1.0, 'Closet-Bed Wall Right');
    addWall(0.12, H, 3.0, 4.4, H / 2, -0.5, 'Closet-Bath Dividing Wall');
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
}
