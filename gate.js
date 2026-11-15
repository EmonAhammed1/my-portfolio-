(function () {
  const P = window.PORTFOLIO;
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const norm = (deg) => ((((deg + 180) % 360) + 360) % 360) - 180; // → [-180, 180)

  FX.cursor();

  // Clock in the top bar
  const clock = $("clock");
  const tick = () => { clock.textContent = new Date().toLocaleTimeString("en-GB"); };
  tick(); setInterval(tick, 1000);

  /* ---------- Build the rings ---------- */
  const stage = $("stage"), slidesEl = $("slides"), topEl = $("words-top"), botEl = $("words-bot");
  const M = P.modes.length;
  const N = M * Math.ceil(6 / M);        // previews repeat around the circle so it never looks empty
  const STEP = 360 / N;
  const slides = [];
  for (let i = 0; i < N; i++) {
    const m = P.modes[i % M];
    const a = document.createElement("a");
    a.className = "slide"; a.href = m.href; a.tabIndex = -1; a.draggable = false;
    a.setAttribute("aria-label", m.name + " portfolio");
    a.innerHTML = `<div class="bar"><i></i><i></i><i></i><span>emon / ${esc(m.key)}</span></div>
      <img src="${esc(m.preview)}" alt="" draggable="false"><span class="shine"></span>`;
    slidesEl.appendChild(a); slides.push(a);
  }
  const wordSets = [[topEl, P.words.filter((_, i) => i % 2 === 0)], [botEl, P.words.filter((_, i) => i % 2 === 1)]];
  wordSets.forEach(([el, list]) => { el.innerHTML = list.map((w) => `<span>${esc(w)}</span>`).join(""); });

  let R = 300;
  function size() {
    const w = parseFloat(getComputedStyle(stage).getPropertyValue("--w")) || 300;
    R = w / 2 / Math.tan(Math.PI / N) + w * 0.2;
    stage.style.setProperty("--r", R + "px");
    slides.forEach((s, i) => { s.style.transform = `rotateY(${i * STEP}deg) translateZ(${R}px)`; });
    wordSets.forEach(([el, list]) => {
      [...el.children].forEach((sp, j) => { sp.style.transform = `rotateY(${(j * 360) / list.length}deg) translateZ(${R * 1.2}px)`; });
    });
  }
  size();
  let rt = 0;
  addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(size, 150); });

  /* ---------- Caption ---------- */
  const cap = { no: $("cap-no"), tag: $("cap-tag"), name: $("cap-name"), desc: $("cap-desc"), enter: $("enter") };
  const dots = $("dots");
  dots.innerHTML = P.modes.map(() => "<i></i>").join("");
  let frontSlide = -1, frontMode = -1;
  function setCaption(mi) {
    const m = P.modes[mi];
    cap.no.textContent = `[0${mi + 1}]`; cap.tag.textContent = m.tag;
    cap.desc.textContent = m.desc; cap.enter.href = m.href;
    [...dots.children].forEach((d, i) => d.classList.toggle("on", i === mi));
    FX.scramble(cap.name, m.name, 450);
  }

  /* ---------- Motion ---------- */
  const BASE = FX.reduce ? 0 : -9;       // idle spin, degrees per second
  let angle = 0, vel = FX.reduce ? 0 : -300, target = null, holdUntil = 0, hover = false, dragging = false;
  let last = performance.now();

  function render() {
    slidesEl.style.transform = `rotateY(${angle}deg)`;
    topEl.style.transform = `rotateY(${-angle * 0.7}deg)`;
    botEl.style.transform = `rotateY(${angle * 0.5 + 20}deg)`;
    let best = 0, bestAbs = 999;
    for (let i = 0; i < N; i++) {
      const eff = norm(i * STEP + angle), abs = Math.abs(eff);
      if (abs < bestAbs) { bestAbs = abs; best = i; }
      const d = (1 - Math.cos((eff * Math.PI) / 180)) / 2;
      if (Math.abs(d - (slides[i]._d ?? -1)) > 0.01) { slides[i]._d = d; slides[i].style.setProperty("--d", d.toFixed(3)); }
    }
    if (best !== frontSlide) {
      slides[frontSlide]?.classList.remove("front");
      slides[best].classList.add("front");
      frontSlide = best;
      if (best % M !== frontMode) { frontMode = best % M; setCaption(frontMode); }
    }
  }

  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (!dragging) {
      if (target !== null) {
        angle += (target - angle) * Math.min(1, dt * 7);
        if (Math.abs(target - angle) < 0.08) { angle = target; target = null; vel = 0; holdUntil = now + 2600; }
      } else {
        const want = hover || now < holdUntil ? 0 : BASE;
        vel += (want - vel) * Math.min(1, dt * 1.7);
        angle += vel * dt;
      }
    }
    render();
    requestAnimationFrame(frame);
  }

  // Turn so that slide i faces the viewer, going the short way round.
  function face(i) {
    const t = -i * STEP;
    target = t + 360 * Math.round((angle - t) / 360);
  }
  const stepBy = (dir) => face(((frontSlide + dir) % N + N) % N);
  const enterFront = () => FX.leave(P.modes[frontMode].href);

  /* ---------- Input ---------- */
  let down = null;
  stage.addEventListener("pointerdown", (e) => {
    if (e.button !== 0) return;
    down = { x: e.clientX, a: angle, t: performance.now(), lastX: e.clientX, lastT: performance.now(), v: 0, moved: false, slide: e.target.closest(".slide") };
    stage.setPointerCapture(e.pointerId);
  });
  stage.addEventListener("pointermove", (e) => {
    if (!down) return;
    const dx = e.clientX - down.x;
    if (!down.moved && Math.abs(dx) < 6) return;
    down.moved = true; dragging = true; target = null; stage.classList.add("grabbing");
    angle = down.a + dx * 0.28;
    const now = performance.now();
    if (now > down.lastT) down.v = ((e.clientX - down.lastX) * 0.28) / ((now - down.lastT) / 1000);
    down.lastX = e.clientX; down.lastT = now;
  });
  const up = () => {
    if (!down) return;
    stage.classList.remove("grabbing");
    if (down.moved) { vel = Math.max(-700, Math.min(700, down.v)); dragging = false; }
    else if (down.slide) {
      const i = slides.indexOf(down.slide);
      if (i === frontSlide) enterFront(); else face(i);
    }
    down = null;
  };
  stage.addEventListener("pointerup", up);
  stage.addEventListener("pointercancel", () => { dragging = false; down = null; stage.classList.remove("grabbing"); });
  slidesEl.addEventListener("click", (e) => e.preventDefault());           // navigation goes through the wipe
  slidesEl.addEventListener("dragstart", (e) => e.preventDefault());
  slidesEl.addEventListener("pointerover", (e) => { if (FX.fine && e.target.closest(".slide.front")) hover = true; });
  slidesEl.addEventListener("pointerout", () => { hover = false; });

  $("prev").addEventListener("click", () => stepBy(-1));
  $("next").addEventListener("click", () => stepBy(1));
  cap.enter.addEventListener("click", (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault(); enterFront();
  });
  FX.magnetic(cap.enter, 0.2);
  addEventListener("keydown", (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === "ArrowLeft") stepBy(-1);
    else if (e.key === "ArrowRight") stepBy(1);
    else if (e.key === "Enter" && document.activeElement?.tagName !== "BUTTON" && document.activeElement?.tagName !== "A") enterFront();
    else if (P.modes[+e.key - 1]) FX.leave(P.modes[+e.key - 1].href);
  });

  // Matrix lens: faint rain runs behind the whole page, but only shows in a soft circle around the pointer.
  (function lens() {
    if (FX.reduce) return;
    const cv = $("trail"), ctx = cv.getContext("2d");
    const GLYPHS = "アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789<>/{}[]=+*#$".split("");
    const pick = () => GLYPHS[(Math.random() * GLYPHS.length) | 0];
    const S = 15, RADIUS = 180, PEAK = 0.7;   // glyph size, lens radius, strongest opacity (at the pointer)
    let W = 0, H = 0, rows = 0, cols = [], running = false, lastStep = 0, px = -9999, py = -9999, inside = false, leftAt = 0;
    function fit() {
      const dpr = Math.min(devicePixelRatio || 1, 1.5);
      W = innerWidth; H = innerHeight; rows = Math.ceil(H / S);
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${S}px "JetBrains Mono", ui-monospace, monospace`; ctx.textBaseline = "top";
      // every column has its own stream position and speed; ~70% of columns carry a stream
      cols = Array.from({ length: Math.ceil(W / S) }, () => (Math.random() < 0.7 ? { y: Math.random() * rows, v: 0.45 + Math.random() * 0.5 } : null));
    }
    fit(); addEventListener("resize", fit);

    function step(now) {
      if (!running) return;
      requestAnimationFrame(step);
      if (now - lastStep < 48) return;
      lastStep = now;
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,.045)"; ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = "source-over";
      const c0 = Math.max(0, Math.floor((px - RADIUS) / S)), c1 = Math.min(cols.length - 1, Math.ceil((px + RADIUS) / S));
      for (let i = 0; i < cols.length; i++) {
        const c = cols[i]; if (!c) continue;
        const prev = Math.floor(c.y);
        c.y += c.v; if (c.y > rows + 6) c.y = -Math.random() * 8;
        const row = Math.floor(c.y);
        if (!inside || i < c0 || i > c1 || row === prev) continue;   // draw only near the pointer, one glyph per row
        const x = i * S, y = row * S;
        const dist = Math.hypot(x + S / 2 - px, y + S / 2 - py);
        if (dist > RADIUS) continue;
        const a = Math.pow(1 - dist / RADIUS, 0.9) * PEAK;
        ctx.fillStyle = `rgba(110,255,185,${a.toFixed(3)})`;
        ctx.fillText(pick(), x, y);
      }
      if (!inside && now - leftAt > 1500) { running = false; ctx.clearRect(0, 0, W, H); }
    }
    const wake = () => { if (!running) { running = true; requestAnimationFrame(step); } };
    addEventListener("pointermove", (e) => { px = e.clientX; py = e.clientY; inside = true; wake(); }, { passive: true });
    const leave = () => { inside = false; leftAt = performance.now(); };
    document.addEventListener("pointerleave", leave);
    addEventListener("pointerup", (e) => { if (e.pointerType === "touch") leave(); });
    addEventListener("blur", leave);
  })();

  /* ---------- Intro: name decodes, the ring spins in fast and settles ---------- */
  const name = $("name");
  name.textContent = "";
  render();
  setTimeout(async () => {
    stage.classList.add("in");
    last = performance.now();
    requestAnimationFrame(frame);
    await FX.scramble(name, P.name.toUpperCase(), 1000);
    name.classList.add("go");
    FX.type($("role"), P.role + " · 1+ year building for the web", 60);
    $("cap").classList.add("in");
  }, FX.reduce ? 0 : 200);
})();
