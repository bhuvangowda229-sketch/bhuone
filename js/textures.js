// Procedural texture generators using HTML5 Canvas
// Generates realistic textures with zero external asset dependencies

export class TextureGenerator {
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
