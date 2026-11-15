// Shared effects for the entry page and the developer portfolio.
window.FX = (function () {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const POOL = "アカサタナハマヤラワ01<>/{}[]#$&*+=_".split("");

  // Decode text: every character cycles through random glyphs, then locks in left to right.
  function scramble(el, text, dur = 900) {
    text = text ?? el.dataset.text ?? el.textContent;
    el.dataset.text = text;
    if (reduce) { el.textContent = text; return Promise.resolve(); }
    cancelAnimationFrame(el._sc);
    return new Promise((res) => {
      const t0 = performance.now();
      const lock = [...text].map((_, i) => (i / text.length) * 0.7 + Math.random() * 0.3);
      (function tick(now) {
        const p = Math.min(1, (now - t0) / dur);
        let out = "";
        for (let i = 0; i < text.length; i++) {
          const ch = text[i];
          out += ch === " " || ch === "\n" || p >= lock[i] ? ch : POOL[(Math.random() * POOL.length) | 0];
        }
        el.textContent = out;
        if (p < 1) el._sc = requestAnimationFrame(tick); else res();
      })(t0);
    });
  }

  // Type text into an element, one character at a time.
  function type(el, text, cps = 45) {
    if (reduce) { el.textContent = text; return Promise.resolve(); }
    return new Promise((res) => {
      let i = 0;
      const iv = setInterval(() => { el.textContent = text.slice(0, ++i); if (i >= text.length) { clearInterval(iv); res(); } }, 1000 / cps);
    });
  }

  // 3D tilt + a spotlight that follows the pointer (uses --mx / --my in CSS).
  function tilt(el, max = 7) {
    if (!fine || reduce) return;
    let raf = 0, ev = null;
    const apply = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const x = (ev.clientX - r.left) / r.width, y = (ev.clientY - r.top) / r.height;
      el.style.setProperty("--mx", x * 100 + "%"); el.style.setProperty("--my", y * 100 + "%");
      el.style.transform = `perspective(900px) rotateX(${(0.5 - y) * max}deg) rotateY(${(x - 0.5) * max}deg) translateZ(0)`;
    };
    el.addEventListener("pointermove", (e) => { ev = e; if (!raf) raf = requestAnimationFrame(apply); });
    el.addEventListener("pointerleave", () => { cancelAnimationFrame(raf); raf = 0; el.style.transform = ""; });
  }

  // Buttons that lean toward the pointer.
  function magnetic(el, k = 0.28) {
    if (!fine || reduce) return;
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * k}px, ${(e.clientY - r.top - r.height / 2) * k}px)`;
    });
    el.addEventListener("pointerleave", () => { el.style.transform = ""; });
  }

  // Custom cursor: a dot plus a trailing ring that grows over interactive things.
  function cursor() {
    if (!fine || reduce) return;
    const dot = document.createElement("div"), ring = document.createElement("div");
    dot.className = "cur-dot"; ring.className = "cur-ring";
    document.body.append(ring, dot);
    document.documentElement.classList.add("has-cursor");
    let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y, shown = false;
    addEventListener("pointermove", (e) => {
      x = e.clientX; y = e.clientY;
      if (!shown) { shown = true; rx = x; ry = y; dot.style.opacity = ring.style.opacity = 1; }
      ring.classList.toggle("hot", !!e.target.closest?.("a, button, [data-hot], input"));
    }, { passive: true });
    document.addEventListener("pointerleave", () => { shown = false; dot.style.opacity = ring.style.opacity = 0; });
    (function loop() {
      rx += (x - rx) * 0.18; ry += (y - ry) * 0.18;
      dot.style.transform = `translate(${x}px, ${y}px)`;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      requestAnimationFrame(loop);
    })();
  }

  // Reveal on scroll; elements with [data-scramble] also decode their text once.
  function reveal(root = document) {
    const els = root.querySelectorAll("[data-reveal]");
    if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("in")); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        en.target.classList.add("in");
        en.target.querySelectorAll("[data-scramble]").forEach((s) => scramble(s, s.dataset.text || s.textContent, 800));
        if (en.target.matches("[data-scramble]")) scramble(en.target);
      });
    }, { threshold: 0, rootMargin: "0px 0px -30px 0px" });
    els.forEach((e) => io.observe(e));
  }

  // Leave the page behind a wipe of falling green bars.
  function leave(href, rain) {
    if (reduce) { location.href = href; return; }
    rain?.burst(1);
    const wipe = document.createElement("div");
    wipe.className = "wipe";
    const n = innerWidth < 700 ? 10 : 18;
    for (let i = 0; i < n; i++) {
      const b = document.createElement("i");
      b.style.animationDelay = (Math.abs(i - n / 2) * 22 + Math.random() * 70) + "ms";
      wipe.appendChild(b);
    }
    document.body.appendChild(wipe);
    setTimeout(() => { location.href = href; }, 620);
  }
  // Coming back with the browser's Back button must not leave the wipe on screen.
  addEventListener("pageshow", () => document.querySelectorAll(".wipe").forEach((w) => w.remove()));

  return { scramble, type, tilt, magnetic, cursor, reveal, leave, reduce, fine };
})();
