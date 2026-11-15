// Matrix digital rain, shared by the entry page and the developer portfolio.
// Two depth layers (far = small/dim, near = large/bright), white-hot heads, glyphs that
// mutate in place, and columns that light up near the pointer.
window.MatrixRain = function (canvas, opts) {
  const o = Object.assign({ color: [0, 255, 132], fade: 0.075, fps: 30, density: 1 }, opts || {});
  const ctx = canvas.getContext("2d", { alpha: false });
  const GLYPHS = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789<>/{}[]();=+*#$&|_".split("");
  const pick = () => GLYPHS[(Math.random() * GLYPHS.length) | 0];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const BG = "3,7,5";
  let W = 0, H = 0, dpr = 1, layers = [], raf = 0, last = 0, running = false;
  let px = -9999, py = -9999, boost = 0; // pointer + burst intensity (0..1)

  function makeLayer(size, alpha, speed) {
    const cols = Math.ceil(W / size);
    const drops = [];
    for (let i = 0; i < cols; i++) {
      if (Math.random() > o.density) { drops.push(null); continue; }
      drops.push({ y: -Math.random() * (H / size) * 1.5, v: speed * (0.55 + Math.random() * 0.9), len: 8 + ((Math.random() * 22) | 0) });
    }
    return { size, alpha, drops };
  }

  function resize() {
    dpr = Math.min(devicePixelRatio || 1, 1.5);
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = `rgb(${BG})`; ctx.fillRect(0, 0, W, H);
    const near = W < 700 ? 15 : 18;
    layers = [makeLayer(near - 6, 0.34, 0.5), makeLayer(near, 1, 0.85)];
    if (reduce) drawStatic();
  }

  // Reduced motion: one calm, static frame instead of an animation.
  function drawStatic() {
    const [r, g, b] = o.color, s = 18;
    ctx.font = `${s}px ui-monospace, Menlo, Consolas, monospace`;
    for (let x = 0; x < W; x += s) {
      const n = 4 + ((Math.random() * 14) | 0), y0 = Math.random() * H;
      for (let k = 0; k < n; k++) {
        ctx.fillStyle = `rgba(${r},${g},${b},${0.05 + 0.25 * (k / n)})`;
        ctx.fillText(pick(), x, (y0 + k * s) % H);
      }
    }
  }

  function frame(t) {
    raf = requestAnimationFrame(frame);
    if (t - last < 1000 / o.fps) return;
    last = t;
    const [r, g, b] = o.color;
    ctx.fillStyle = `rgba(${BG},${o.fade})`;
    ctx.fillRect(0, 0, W, H);
    boost *= 0.965;
    for (const L of layers) {
      const s = L.size;
      ctx.font = `${s}px ui-monospace, Menlo, Consolas, monospace`;
      ctx.textBaseline = "top";
      for (let i = 0; i < L.drops.length; i++) {
        const d = L.drops[i]; if (!d) continue;
        const x = i * s, y = d.y * s;
        const dx = x - px, dy = y - py;
        const nearP = Math.max(0, 1 - (dx * dx + dy * dy) / 32400); // 180px radius
        const a = Math.min(1, L.alpha * (0.72 + nearP * 0.9 + boost * 0.5));
        // body glyph one step behind the head keeps the trail solid green
        ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
        ctx.fillText(pick(), x, y - s);
        // white-hot head
        ctx.fillStyle = `rgba(${200 + nearP * 55},255,${225 + nearP * 30},${Math.min(1, a + 0.15)})`;
        ctx.fillText(pick(), x, y);
        // random in-place mutation somewhere up the trail
        if (Math.random() < 0.06) {
          const k = 2 + ((Math.random() * d.len) | 0);
          ctx.fillStyle = `rgba(${BG},1)`; ctx.fillRect(x, y - k * s, s, s);
          ctx.fillStyle = `rgba(${r},${g},${b},${a * 0.55})`;
          ctx.fillText(pick(), x, y - k * s);
        }
        d.y += d.v * (1 + boost * 2.2);
        if (y > H + d.len * s && Math.random() > 0.4) {
          d.y = -Math.random() * 20; d.v = (L.alpha < 1 ? 0.5 : 0.85) * (0.55 + Math.random() * 0.9); d.len = 8 + ((Math.random() * 22) | 0);
        }
      }
    }
  }

  function start() { if (running || reduce) return; running = true; last = 0; raf = requestAnimationFrame(frame); }
  function stop() { running = false; cancelAnimationFrame(raf); }

  let rt = 0;
  addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(resize, 150); });
  addEventListener("pointermove", (e) => { px = e.clientX; py = e.clientY; }, { passive: true });
  addEventListener("pointerleave", () => { px = py = -9999; });
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
  resize(); start();

  return { burst: (v = 1) => { boost = Math.max(boost, v); }, stop, start };
};
