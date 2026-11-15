(() => {
  const P = window.PORTFOLIO;
  const desktop = document.getElementById("desktop");
  const dock = document.getElementById("dock");
  const cover = window.renderCover;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const isTall = (key) => key === "photo" || window.COVERS[key]?.().h > window.COVERS[key]?.().w;
  const coverHtml = (key, cls) => cover(key, cls + (isTall(key) ? " tall" : ""));
  const mobile = () => innerWidth < 810;

  /* ======================= Dock icons (SVG) ======================= */
  const tile = (bg, stroke, txt, color, size = 17) => `
    <svg viewBox="0 0 40 40"><rect x="1" y="1" width="38" height="38" rx="9" fill="${bg}" stroke="${stroke}" stroke-width="1.6"/>
    <text x="20" y="${20 + size * 0.36}" text-anchor="middle" font-family="-apple-system,Helvetica,Arial,sans-serif" font-weight="700" font-size="${size}" fill="${color}">${txt}</text></svg>`;
  const ICONS = {
    wp: tile("#0b1d33", "#2c7fb8", "Wp", "#5bbcf0"),
    shopify: tile("#082a1b", "#5e8e3e", "Sh", "#9ad153"),
    code: tile("#13253d", "#3d6fa3", "Py", "#ffd43b"),
    ai: tile("#2a0d18", "#a8324f", "n8n", "#ff6d8a", 13),
    warn: `<svg viewBox="0 0 40 40"><path d="M20 4 L38 35 H2Z" fill="#ffcc00" stroke="#e0a800" stroke-width="1.5" stroke-linejoin="round"/><rect x="18.3" y="14" width="3.4" height="12" rx="1.7" fill="#1d1d1f"/><circle cx="20" cy="30" r="2" fill="#1d1d1f"/></svg>`,
    finder: `<svg viewBox="0 0 40 40"><defs><linearGradient id="fd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6ec1ff"/><stop offset="1" stop-color="#2b8cf0"/></linearGradient></defs><path d="M3 10a3 3 0 0 1 3-3h9l3 3h16a3 3 0 0 1 3 3v19a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3Z" fill="#1f78d6"/><path d="M3 15a3 3 0 0 1 3-3h28a3 3 0 0 1 3 3v17a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3Z" fill="url(#fd)"/><path d="M9 21h22M9 26h15" stroke="#fff" stroke-width="2.2" stroke-linecap="round" opacity=".85"/></svg>`,
    github: `<svg viewBox="0 0 40 40"><rect x="1" y="1" width="38" height="38" rx="9" fill="#1d1d1f" stroke="#3a3a3c"/><g transform="translate(8 8)"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" fill="#fff"/></g></svg>`,
    notes: `<svg viewBox="0 0 40 40"><rect x="1" y="1" width="38" height="38" rx="9" fill="#fff" stroke="#ddd"/><path d="M1 10 V10 a9 9 0 0 1 9-9 h20 a9 9 0 0 1 9 9Z" fill="#ffd52e"/><rect x="1" y="10" width="38" height="3" fill="#f5c400"/>${[19, 25, 31].map((y) => `<rect x="7" y="${y}" width="26" height="1.3" fill="#d9d9d9"/>`).join("")}</svg>`,
    photos: `<svg viewBox="0 0 40 40"><rect x="1" y="1" width="38" height="38" rx="9" fill="#fff" stroke="#e5e5e5"/>${["#f5a623", "#f8e71c", "#7ed321", "#50e3c2", "#4a90e2", "#9013fe", "#e91e63", "#ff5e3a"].map((c, i) => `<ellipse cx="20" cy="12.5" rx="4.6" ry="7.5" fill="${c}" opacity=".78" transform="rotate(${i * 45} 20 20)"/>`).join("")}</svg>`,
    web: `<svg viewBox="0 0 40 40"><defs><linearGradient id="sf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5ac8fa"/><stop offset="1" stop-color="#0a60ff"/></linearGradient></defs><rect x="1" y="1" width="38" height="38" rx="9" fill="#fff" stroke="#e5e5e5"/><circle cx="20" cy="20" r="15" fill="url(#sf)"/>${Array.from({ length: 12 }, (_, i) => `<line x1="20" y1="6.5" x2="20" y2="8.5" stroke="#fff" stroke-width="1" transform="rotate(${i * 30} 20 20)"/>`).join("")}<path d="M27 13 L21.5 21.5 L13 27 L18.5 18.5Z" fill="#fff"/><path d="M27 13 L21.5 21.5 L18.5 18.5Z" fill="#ff3b30"/></svg>`,
    mail: `<svg viewBox="0 0 40 40"><defs><linearGradient id="ml" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3ab0ff"/><stop offset="1" stop-color="#1a73f0"/></linearGradient></defs><rect x="1" y="1" width="38" height="38" rx="9" fill="url(#ml)"/><rect x="8" y="12" width="24" height="16" rx="2" fill="#fff"/><path d="M8.6 12.8 L20 21.5 L31.4 12.8" fill="none" stroke="#1a73f0" stroke-width="1.6"/></svg>`,
    trash: (full) => `<svg viewBox="0 0 40 46"><path d="M7 9 H33 L30.5 43 a2 2 0 0 1 -2 1.8 H11.5 a2 2 0 0 1 -2 -1.8Z" fill="rgba(235,238,242,.75)" stroke="#a9b0b8" stroke-width="1"/>${full ? `<path d="M10 9 L13 2 L20 6 L26 1 L31 9Z" fill="#fff" stroke="#c9ccd1" stroke-width=".8"/><rect x="14" y="3" width="9" height="7" fill="#f2d675" transform="rotate(-12 18 6)"/>` : ""}<ellipse cx="20" cy="9" rx="13" ry="2.4" fill="#d5dade" stroke="#a9b0b8" stroke-width="1"/>${[13, 20, 27].map((x) => `<line x1="${x}" y1="14" x2="${x + (x - 20) * 0.1}" y2="40" stroke="#b9c0c7" stroke-width="1"/>`).join("")}</svg>`,
  };

  const dockSpec = [
    { id: "code", label: "Custom Dev", fn: () => appAlert("code") },
    { id: "wp", label: "WordPress", fn: () => appAlert("wp") },
    { id: "shopify", label: "Shopify", fn: () => appAlert("shopify") },
    { id: "ai", label: "n8n", fn: () => appAlert("ai") },
    { id: "warn", label: "Warning", fn: () => appAlert("warn") },
    "sep",
    { id: "finder", label: "Projects", fn: openProjects },
    { id: "notes", label: "Notes", fn: openNotes },
    { id: "photos", label: "Photos", fn: openPhotos },
    "sep",
    { id: "github", label: "GitHub", fn: () => window.open(P.github, "_blank", "noopener") },
    { id: "mail", label: "Mail", fn: openMail },
    "sep",
    { id: "trash", label: "Trash", fn: openTrash },
  ];
  const dockBtns = {};
  dockSpec.forEach((d) => {
    if (d === "sep") { dock.insertAdjacentHTML("beforeend", '<div class="sep"></div>'); return; }
    const b = document.createElement("button");
    b.className = "app"; b.dataset.label = d.label; b.setAttribute("aria-label", d.label);
    b.innerHTML = d.id === "trash" ? ICONS.trash(false) : ICONS[d.id];
    if (d.id === "trash") b.classList.add("bin");
    b.addEventListener("click", () => {
      // macOS-style launch bounce for apps that open a window
      if (["finder", "notes", "photos", "mail"].includes(d.id) && !wins.has(d.id)) {
        b.classList.remove("bounce"); void b.offsetWidth; b.classList.add("bounce");
      }
      d.fn(b);
    });
    dock.appendChild(b); dockBtns[d.id] = b;
  });

  /* ---- Dock magnification (fisheye, like macOS) ---- */
  // Each icon's size follows a spring toward its target, one frame at a time (no CSS transitions),
  // so the wave glides with the cursor instead of stepping.
  const dockApps = () => [...dock.querySelectorAll(".app")];
  const springs = new WeakMap();
  let mouseX = null, magRaf = 0;
  function magTick() {
    magRaf = 0;
    const apps = dockApps();
    const centers = apps.map((b) => { const r = b.getBoundingClientRect(); return r.left + r.width / 2; }); // read all first
    let busy = false;
    apps.forEach((b, i) => {
      let st = springs.get(b);
      if (!st) springs.set(b, (st = { s: 1, v: 0 }));
      let t = 1;
      if (mouseX !== null) {
        const d = Math.abs(mouseX - centers[i]);
        t = 1 + 0.75 * Math.pow(Math.cos(Math.min(d, 150) / 150 * Math.PI / 2), 1.6);
      }
      st.v = st.v * 0.62 + (t - st.s) * 0.24;
      st.s += st.v;
      if (Math.abs(t - st.s) > 0.0008 || Math.abs(st.v) > 0.0008) busy = true;
      else { st.s = t; st.v = 0; }
      b.style.setProperty("--s", st.s.toFixed(4)); // then write all
    });
    if (busy) magRaf = requestAnimationFrame(magTick);
  }
  const kick = () => { if (!magRaf) magRaf = requestAnimationFrame(magTick); };
  dock.addEventListener("mousemove", (e) => { if (mobile()) return; mouseX = e.clientX; kick(); });
  dock.addEventListener("mouseleave", () => { mouseX = null; kick(); });

  /* ======================= Windows ======================= */
  let z = 100;
  const wins = new Map();       // key -> window element
  const minimized = new Map();  // key -> dock tile
  const runningFor = { projects: "finder", notes: "notes", photos: "photos", mail: "mail", trash: "trash" };
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const EASE_OPEN = "cubic-bezier(.16,.9,.3,1)";
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeInOut = (t) => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const smooth = (t) => t * t * (3 - 2 * t);
  const rectTf = (S, F) => `translate(${S.left - F.left}px, ${S.top - F.top}px) scale(${S.width / F.width}, ${S.height / F.height})`;

  function focusWin(w) {
    w.style.zIndex = ++z;
    document.querySelectorAll(".win.focused").forEach((x) => x !== w && x.classList.remove("focused"));
    w.classList.add("focused");
  }
  function focusTopmost() {
    let top = null;
    wins.forEach((w, k) => { if (!minimized.has(k) && (!top || +w.style.zIndex > +top.style.zIndex)) top = w; });
    if (top) top.classList.add("focused");
  }

  function makeWin(key, title, html, cls = "", src = null) {
    if (minimized.has(key)) { restoreWin(key); return wins.get(key); }
    if (wins.has(key)) {
      const w = wins.get(key); focusWin(w);
      w.animate([{ transform: "none" }, { transform: "translateX(-6px)" }, { transform: "translateX(5px)" }, { transform: "none" }], { duration: 260 });
      return w;
    }
    const w = document.createElement("div");
    w.className = "win " + cls;
    w.innerHTML = `<div class="bar"><div class="lights"><i class="r" title="Close"></i><i class="y" title="Minimize"></i><i class="g" title="Zoom"></i></div><div class="ttl">${esc(title)}</div></div><div class="body">${html}</div>`;
    document.body.appendChild(w);
    w.dataset.title = title;
    const n = wins.size;
    const W = w.offsetWidth, H = w.offsetHeight;
    const left = mobile() ? (innerWidth - W) / 2 : innerWidth / 2 - W / 2 + (n % 5) * 26 - 40;
    const top = mobile() ? Math.max(12, (innerHeight - H) / 2 - 20) : Math.max(16, innerHeight / 2 - H / 2 - 60 + (n % 5) * 24);
    w.style.left = Math.max(8, Math.min(innerWidth - W - 8, left)) + "px";
    w.style.top = Math.max(8, top) + "px";
    wins.set(key, w);
    focusWin(w);
    if (runningFor[key]) dockBtns[runningFor[key]].classList.add("running");

    // Open: zoom out of the icon / dock item that launched it
    if (!reduceMotion) {
      const F = w.getBoundingClientRect();
      if (src) {
        const S = src.getBoundingClientRect();
        w.animate([{ transform: rectTf(S, F), opacity: .35 }, { transform: "none", opacity: 1 }], { duration: 440, easing: EASE_OPEN });
      } else {
        w.animate([{ transform: "scale(.92)", opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 260, easing: EASE_OPEN });
      }
    }

    w.addEventListener("pointerdown", () => focusWin(w));
    w.querySelector(".r").addEventListener("click", (e) => { e.stopPropagation(); closeWin(key); });
    w.querySelector(".y").addEventListener("click", (e) => { e.stopPropagation(); minimizeWin(key); });
    w.querySelector(".g").addEventListener("click", (e) => { e.stopPropagation(); zoomWin(key); });
    w.querySelector(".bar").addEventListener("dblclick", (e) => { if (!e.target.closest(".lights")) minimizeWin(key); });
    dragBy(w.querySelector(".bar"), w);
    w._key = key;
    w.addEventListener("input", () => markDirty(w));
    w.querySelector(".body").addEventListener("scroll", () => markDirty(w), { passive: true });
    w.querySelectorAll("img").forEach((im) => im.complete || im.addEventListener("load", () => markDirty(w), { once: true }));
    prewarm(w);
    return w;
  }

  // Close: quick fade + shrink toward the centre (macOS close)
  function closeWin(key) {
    const w = wins.get(key); if (!w) return;
    wins.delete(key);
    dropSnap(w);
    minimized.get(key)?.remove(); minimized.delete(key);
    if (runningFor[key]) dockBtns[runningFor[key]].classList.remove("running");
    const r = w.getBoundingClientRect();
    const a = w.animate([{ transform: "none", opacity: 1 },
      { transform: `translate(${r.width * .03}px, ${r.height * .03}px) scale(.94)`, opacity: 0 }],
      { duration: reduceMotion ? 1 : 170, easing: "ease-in", fill: "forwards" });
    a.onfinish = () => w.remove();
    focusTopmost();
  }

  // Zoom (green button): animate between normal and full size
  function zoomWin(key) {
    const w = wins.get(key); if (!w || minimized.has(key)) return;
    w.getAnimations().forEach((x) => x.finish());
    const A = w.getBoundingClientRect();
    if (w.classList.contains("max")) {
      Object.assign(w.style, JSON.parse(w.dataset.prev));
      w.classList.remove("max");
    } else {
      w.dataset.prev = JSON.stringify({ left: w.style.left, top: w.style.top, width: w.style.width, height: w.style.height });
      const m = mobile() ? 8 : 14, below = mobile() ? 8 : 92, side = mobile() ? 58 : 14;
      Object.assign(w.style, { left: side + "px", top: m + "px", width: `calc(100vw - ${side + m}px)`, height: `calc(100vh - ${m + below}px)` });
      w.classList.add("max");
    }
    const B = w.getBoundingClientRect();
    markDirty(w);
    if (!reduceMotion) w.animate([{ transform: rectTf(A, B) }, { transform: "none" }], { duration: 380, easing: EASE_OPEN });
  }

  /* ---- Window snapshot: render the window once into an image (SVG foreignObject).
         The genie then animates cheap strips of that one bitmap instead of 40 live DOM copies. ---- */
  let cssText = null;
  const dataUrls = {};
  async function toDataURL(src) {
    if (dataUrls[src]) return dataUrls[src];
    const blob = await fetch(src).then((r) => r.blob());
    return (dataUrls[src] = await new Promise((res) => { const fr = new FileReader(); fr.onload = () => res(fr.result); fr.readAsDataURL(blob); }));
  }
  async function prepSnapshots() {
    if (cssText === null) cssText = await fetch("style.css").then((r) => r.text()).catch(() => "");
    await toDataURL("me-900.webp").catch(() => {});
  }
  async function snapshot(w, W) {
    await prepSnapshots();
    const c = w.cloneNode(true);
    c.classList.remove("max");
    Object.assign(c.style, { position: "relative", left: 0, top: 0, width: W.width + "px", height: W.height + "px", transform: "none", visibility: "visible", margin: 0, zIndex: 0, boxShadow: "none" });
    const b0 = w.querySelector(".body"), b1 = c.querySelector(".body");
    if (b0 && b1) {
      if (w.classList.contains("max")) { b1.style.maxHeight = "none"; b1.style.height = b0.clientHeight + "px"; }
      if (b0.scrollTop) { // keep the scrolled position
        const inner = document.createElement("div");
        inner.style.transform = `translateY(${-b0.scrollTop}px)`;
        while (b1.firstChild) inner.appendChild(b1.firstChild);
        b1.appendChild(inner); b1.style.overflow = "hidden";
      }
    }
    const srcInputs = w.querySelectorAll("input, textarea");
    c.querySelectorAll("input, textarea").forEach((el, i) => {
      if (el.tagName === "TEXTAREA") el.textContent = srcInputs[i].value; else el.setAttribute("value", srcInputs[i].value);
    });
    for (const img of c.querySelectorAll("img")) img.setAttribute("src", await toDataURL(img.getAttribute("src")));
    const html = new XMLSerializer().serializeToString(c);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W.width}" height="${W.height}"><foreignObject x="0" y="0" width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml" style="font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue',Arial,sans-serif;color:#1d1d1f"><style><![CDATA[${cssText}]]></style>${html}</div></foreignObject></svg>`;
    const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
    const img = new Image();
    img.src = url;
    await img.decode();
    return { url, w: W.width, h: W.height };
  }
  const dropSnap = (w) => { if (w._snap) { URL.revokeObjectURL(w._snap.url); w._snap = null; } };
  const idle = (fn) => (window.requestIdleCallback ? requestIdleCallback(fn, { timeout: 1500 }) : setTimeout(fn, 300));
  // Keep a fresh snapshot ready in idle time, so minimize starts instantly.
  function prewarm(w) {
    clearTimeout(w._warmT);
    w._warmT = setTimeout(() => idle(async () => {
      if (!wins.has(w._key) || minimized.has(w._key) || w.style.visibility === "hidden") return;
      if (w._snap && !w._dirty) return;
      w.getAnimations().forEach((x) => x.finish());
      const W = w.getBoundingClientRect();
      w._dirty = false;
      try { const sn = await snapshot(w, W); if (w._dirty) { URL.revokeObjectURL(sn.url); return; } dropSnap(w); w._snap = sn; } catch (e) {}
    }), 450);
  }
  const markDirty = (w) => { w._dirty = true; prewarm(w); };

  /* ---- Genie effect: the window is sliced into strips that pour into the dock ---- */
  async function genie(w, D, reverse, done, onStart) {
    w.getAnimations().forEach((x) => x.finish()); // measure the settled window, not a mid-animation frame
    const W = w.getBoundingClientRect();
    if (reduceMotion) { onStart?.(); return done(); }
    const layer = document.createElement("div");
    layer.className = "genie";

    if (mobile()) { // dock is on the side: simple scale-into-icon instead
      onStart?.();
      document.body.appendChild(layer);
      const ghost = w.cloneNode(true);
      Object.assign(ghost.style, { left: W.left + "px", top: W.top + "px", width: W.width + "px", height: W.height + "px", visibility: "visible", transformOrigin: "0 0", zIndex: 0 });
      layer.appendChild(ghost);
      const k = [{ transform: "none", opacity: 1 }, { transform: rectTf(D, W), opacity: .2 }];
      const a = ghost.animate(reverse ? k.reverse() : k, { duration: 420, easing: "cubic-bezier(.4,0,.2,1)", fill: "forwards" });
      a.onfinish = () => { layer.remove(); done(); };
      return;
    }

    // Snapshot on minimize; restore reuses the one taken when it was minimized.
    let snap = (reverse || !w._dirty) ? w._snap : null;
    if (!snap || Math.abs(snap.w - W.width) > 1 || Math.abs(snap.h - W.height) > 1) {
      dropSnap(w);
      try { snap = w._snap = await snapshot(w, W); } catch (e) { snap = null; }
    }

    const N = snap ? 72 : 24, hs = W.height / N, FR = 72;
    const bottom = D.top + D.height / 2;
    let left = N;
    const jobs = [];
    layer.style.visibility = "hidden";
    document.body.appendChild(layer);
    let proto = null;
    if (!snap) { // fallback: live DOM copies
      proto = w.cloneNode(true);
      proto.classList.remove("focused");
      Object.assign(proto.style, { position: "absolute", left: 0, width: W.width + "px", height: W.height + "px", visibility: "visible", transform: "none", zIndex: 0, willChange: "auto" });
    }
    for (let i = 0; i < N; i++) {
      const strip = document.createElement("div");
      strip.className = "strip";
      const y0 = W.top + i * hs;
      Object.assign(strip.style, { left: W.left + "px", top: y0 + "px", width: W.width + "px", height: hs + 0.6 + "px" });
      if (snap) {
        Object.assign(strip.style, { backgroundImage: `url("${snap.url}")`, backgroundSize: `${W.width}px ${W.height}px`, backgroundPosition: `0 ${-i * hs}px`, backgroundRepeat: "no-repeat" });
      } else {
        const c = i === N - 1 ? proto : proto.cloneNode(true);
        c.style.top = -i * hs + "px";
        strip.appendChild(c);
      }
      layer.appendChild(strip);

      const frames = [];
      for (let f = 0; f <= FR; f++) {
        const p = f / FR;
        const p1 = smooth(clamp(p / 0.45, 0, 1));          // phase 1: sides bend into a funnel
        const q = easeInOut(clamp((p - 0.25) / 0.75, 0, 1)); // phase 2: pour down into the dock
        const T = lerp(y0, D.top + i * (D.height / N), q);
        const H = lerp(hs, D.height / N, q);
        const mid = T + H / 2;
        const u = smooth(clamp((mid - W.top) / (bottom - W.top), 0, 1));
        let L = lerp(W.left, lerp(W.left, D.left, u), p1);
        let R = lerp(W.right, lerp(W.right, D.right, u), p1);
        const fin = Math.pow(q, 4);
        L = lerp(L, D.left, fin); R = lerp(R, D.right, fin);
        frames.push({
          transform: `translate(${(L - W.left).toFixed(2)}px, ${(T - y0).toFixed(2)}px) scale(${Math.max(.001, (R - L) / W.width).toFixed(4)}, ${(H / hs).toFixed(4)})`,
          opacity: p > .9 ? 1 - (p - .9) * 6 : 1,
        });
      }
      if (reverse) frames.reverse();
      strip.style.transform = frames[0].transform;
      jobs.push([strip, frames]);
    }
    // two frames later (strips laid out and painted) swap the window for the strips
    const go = (fn) => (snap ? requestAnimationFrame(fn) : requestAnimationFrame(() => requestAnimationFrame(fn)));
    go(() => {
      onStart?.();
      layer.style.visibility = "";
      jobs.forEach(([strip, frames]) => {
        const a = strip.animate(frames, { duration: 600, easing: "linear", fill: "forwards" });
        a.onfinish = () => { if (--left === 0) { layer.remove(); done(); } };
      });
    });
  }

  function minimizeWin(key) {
    const w = wins.get(key); if (!w || minimized.has(key)) return;
    const tile = makeDockTile(key, w);
    const D = tile._rect;
    w.classList.remove("focused");
    genie(w, D, false, () => tile.classList.add("filled"), () => { w.style.visibility = "hidden"; });
    minimized.set(key, tile);
    focusTopmost();
  }
  function restoreWin(key) {
    const w = wins.get(key), tile = minimized.get(key); if (!w || !tile) return;
    minimized.delete(key);
    const D = tile.getBoundingClientRect();
    tile.classList.remove("filled");
    genie(w, D, true, () => { w.style.visibility = ""; focusWin(w); });
    const a = tile.animate([{ width: tile.offsetWidth + "px", marginLeft: "0px" }, { width: "0px", marginLeft: "-14px" }], { duration: 300, delay: 200, easing: "ease-in-out", fill: "forwards" });
    a.onfinish = () => tile.remove();
  }
  // Minimized windows sit in the dock next to the Trash, as live thumbnails
  function makeDockTile(key, w) {
    const tile = document.createElement("button");
    tile.className = "app mini";
    tile.dataset.label = w.dataset.title;
    tile.setAttribute("aria-label", "Restore " + w.dataset.title);
    const W = w.getBoundingClientRect();
    const s = 40 / Math.max(W.width, W.height);
    const thumb = document.createElement("div");
    thumb.className = "thumb";
    const c = w.cloneNode(true);
    c.classList.remove("focused");
    Object.assign(c.style, { left: (40 - W.width * s) / 2 + "px", top: (40 - W.height * s) / 2 + "px", width: W.width + "px", height: W.height + "px", transform: `scale(${s})`, transformOrigin: "0 0", visibility: "visible", zIndex: 0, position: "absolute", willChange: "auto" });
    thumb.appendChild(c);
    tile.appendChild(thumb);
    tile.addEventListener("click", () => restoreWin(key));
    dock.insertBefore(tile, dockBtns.trash);
    tile._rect = tile.getBoundingClientRect(); // final position, measured before the grow animation
    if (!reduceMotion) tile.animate([{ width: "0px", marginLeft: "-14px" }, { width: tile.offsetWidth + "px", marginLeft: "0px" }], { duration: 260, easing: "ease-out" });
    return tile;
  }

  function dragBy(handle, el) {
    handle.addEventListener("pointerdown", (e) => {
      if (e.target.closest(".lights") || el.classList.contains("max")) return;
      const sx = e.clientX - el.offsetLeft, sy = e.clientY - el.offsetTop;
      handle.setPointerCapture(e.pointerId);
      const ow = el.offsetWidth;
      let px = 0, py = 0, raf = 0;
      const apply = () => {
        raf = 0;
        el.style.left = Math.max(-ow + 80, Math.min(innerWidth - 80, px - sx)) + "px";
        el.style.top = Math.max(0, Math.min(innerHeight - 40, py - sy)) + "px";
      };
      const mv = (ev) => { px = ev.clientX; py = ev.clientY; if (!raf) raf = requestAnimationFrame(apply); };
      const up = () => { if (raf) { cancelAnimationFrame(raf); apply(); } handle.removeEventListener("pointermove", mv); handle.removeEventListener("pointerup", up); };
      handle.addEventListener("pointermove", mv); handle.addEventListener("pointerup", up);
    });
  }
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (document.querySelector(".alert")) return closeAlert();
    let top = null, tz = -1;
    wins.forEach((w, k) => { if (!minimized.has(k) && +w.style.zIndex > tz) { tz = +w.style.zIndex; top = k; } });
    if (top) closeWin(top); else clearFilter();
  });

  /* ---- Get Info ---- */
  function openInfo(it, src) {
    if (it.id === "projects") return openProjects(src);
    const html = `
      <div class="info-head">${coverHtml(it.cover, "cv")}<div><b>${esc(it.title.replace("\n", " "))}</b><span>${esc(it.subtitle)}</span></div></div>
      <div class="textbox">${esc(it.text)}</div>
      <div class="disc">Details:</div>
      <div class="kv"><div><b>Type:</b> ${esc(it.type)}</div><div><b>Tools:</b> ${esc(it.tools)}</div></div>
      <div class="disc">Preview:</div>
      <div class="preview">${coverHtml(it.cover, "cv")}</div>`;
    makeWin(it.id, "Information about: " + it.title.replace("\n", " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()), html, "", src);
  }

  // Experience "where" text, with any names listed in e.links turned into links.
  const whereHtml = (e) => Object.entries(e.links || {}).reduce((h, [name, url]) => h.split(esc(name)).join(`<a href="${esc(url)}" target="_blank" rel="noopener">${esc(name)}</a>`), esc(e.where));
  /* ---- Notes (About) ---- */
  function openNotes(src) {
    const d = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    const PR = P.profile;
    makeWin("notes", "Notes", `
      <div class="date">${d}</div>
      <img class="me" src="me-900.webp" alt="Emon Ahammed">
      <h2>Hi, I'm Emon 👋</h2>
      <p class="lead">${esc(PR.headline)}</p>
      ${PR.paragraphs.map((t) => `<p>${esc(t)}</p>`).join("")}
      <ul class="checks">${PR.points.map(([k, v]) => `<li><b>${esc(k)}.</b> ${esc(v)}</li>`).join("")}</ul>
      <h3>Skills</h3>
      ${P.stack.map((g) => `<p><b>${esc(g.name)}</b><br><span class="muted">${g.items.map((it) => esc(it[0])).join(" · ")}</span></p>`).join("")}
      <h3>Experience</h3>
      <ul>${P.experience.map((e) => `<li><b>${esc(e.role)}</b> · ${whereHtml(e)} <span class="muted">(${esc(e.when)})</span></li>`).join("")}</ul>
      <p>See my work in <a href="#" data-open="projects">Projects 📁</a>, or say hi in Mail ✉️</p>`, "notes", src);
    wins.get("notes")?.querySelector('[data-open="projects"]')?.addEventListener("click", (e) => { e.preventDefault(); openProjects(dockBtns.finder); });
  }

  /* ---- Projects: a Finder window with a sidebar per stack and a grid of live sites ---- */
  function openProjects(src) {
    const tabs = P.projectTabs.filter((t) => P.projects.some((p) => p.cat === t.cat && !p.placeholder));
    const count = (cat) => P.projects.filter((p) => p.cat === cat && !p.placeholder).length;
    const total = P.projects.filter((p) => !p.placeholder).length;
    const w = makeWin("projects", "Projects", `
      <aside class="side"><div class="side-h">Favourites</div>
        <button data-cat="all" class="on">📁 All Projects <em>${total}</em></button>
        ${tabs.map((t) => `<button data-cat="${t.cat}">📁 ${esc(t.name)} <em>${count(t.cat)}</em></button>`).join("")}
      </aside>
      <section class="pane"><div class="path" id="f-path">All Projects</div><div class="grid" id="f-grid"></div><div class="status" id="f-status"></div></section>`, "finder", src);
    if (!w || w.dataset.ready) return;
    w.dataset.ready = "1";
    const grid = w.querySelector("#f-grid");
    const open = (p) => {
      if (!p.link) return;
      if (!p.pass) { window.open(p.link, "_blank", "noopener"); return; }
      // Password-protected store: post the storefront password so it opens unlocked.
      const f = document.createElement("form");
      f.method = "post"; f.target = "_blank"; f.action = p.link.replace(/\/$/, "") + "/password";
      f.innerHTML = `<input type="hidden" name="form_type" value="storefront_password"><input type="hidden" name="utf8" value="✓"><input type="hidden" name="password" value="${esc(p.pass)}">`;
      document.body.appendChild(f); f.submit(); f.remove();
    };
    const show = (cat) => {
      const list = P.projects.filter((p) => !p.placeholder && (cat === "all" || p.cat === cat));
      grid.innerHTML = list.map((p, i) => {
        const img = p.image ? (p.image.startsWith("http") ? p.image : "../" + p.image) : "";
        return `<button class="file" data-i="${P.projects.indexOf(p)}" title="${esc(p.desc)}"><span class="thumb">${img ? `<img src="${esc(img)}" alt="" loading="lazy" decoding="async">` : ""}</span><span class="name">${esc(p.title)}</span><span class="kind">${esc(p.tech[0] || "")}${p.pass ? " · auto-unlock" : ""}</span></button>`;
      }).join("");
      w.querySelector("#f-path").textContent = cat === "all" ? "All Projects" : tabs.find((t) => t.cat === cat).name;
      w.querySelector("#f-status").textContent = `${list.length} items · double-click to open the live site`;
      w.querySelectorAll(".side button").forEach((b) => b.classList.toggle("on", b.dataset.cat === cat));
      grid.scrollTop = 0;
    };
    w.querySelector(".side").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) show(b.dataset.cat); });
    grid.addEventListener("click", (e) => {
      const f = e.target.closest(".file"); if (!f) return;
      grid.querySelectorAll(".file.sel").forEach((x) => x.classList.remove("sel")); f.classList.add("sel");
      if (e.detail >= 2 || matchMedia("(hover: none)").matches) open(P.projects[+f.dataset.i]);
    });
    show("all");
    markDirty?.(w);
  }

  /* ---- Photos (all work) ---- */
  function openPhotos(src) {
    const w = makeWin("photos", "Photos — All Work", P.items.map((it) =>
      `<div class="ph" data-id="${it.id}">${coverHtml(it.cover, "cv")}<span>${esc(it.title.replace("\n", " "))}</span></div>`).join(""), "photos", src);
    w.querySelectorAll(".ph").forEach((el) => el.addEventListener("click", () => openInfo(P.items.find((i) => i.id === el.dataset.id), el.querySelector(".cv"))));
  }

  /* ---- Mail (contact) ---- */
  function openMail(src) {
    const w = makeWin("mail", "New Message", `
      <div class="row"><label>To:</label><input value="${esc(P.name)}" readonly></div>
      <div class="row"><label>Subject:</label><input id="m-sub" placeholder="Project inquiry"></div>
      <textarea id="m-body" placeholder="Hi Emon, I need a custom Shopify theme…"></textarea>
      <div class="actions"><a href="${esc(P.github)}" target="_blank" rel="noopener">GitHub ↗</a><button class="btn" id="m-send">Send</button></div>`, "mail", src);
    w.querySelector("#m-send")?.addEventListener("click", () => {
      const sub = w.querySelector("#m-sub").value || "Project inquiry";
      const body = w.querySelector("#m-body").value;
      location.href = `mailto:${P.email}?subject=${encodeURIComponent(sub)}&body=${encodeURIComponent(body)}`;
    });
  }

  /* ---- Trash ---- */
  const trashed = new Set();
  function refreshTrash() {
    dockBtns.trash.innerHTML = ICONS.trash(trashed.size > 0);
    if (wins.has("trash")) { closeWin("trash"); setTimeout(openTrash, 170); }
  }
  function openTrash(src) {
    const list = [...trashed].map((id) => P.items.find((i) => i.id === id));
    const w = makeWin("trash", "Trash", list.length
      ? `<div class="list">${list.map((it) => coverHtml(it.cover, "cv")).join("")}</div>
         <div style="display:flex;gap:8px;justify-content:flex-end"><button class="btn ghost" id="t-empty">Empty Trash</button><button class="btn" id="t-back">Put Back All</button></div>`
      : `<div class="empty">Trash is empty.<br>Tip: drag an icon onto the Trash.</div>`, "trash", src);
    w.querySelector("#t-back")?.addEventListener("click", () => {
      trashed.forEach((id) => restoreIcon(id)); trashed.clear(); refreshTrash();
    });
    w.querySelector("#t-empty")?.addEventListener("click", () =>
      showAlert({ title: "Finder", icon: ICONS.trash(true), msg: "These skills can't be deleted. Emon still knows all of them.", ok: "Put Back All", onOk: () => { trashed.forEach((id) => restoreIcon(id)); trashed.clear(); refreshTrash(); } }));
  }

  /* ======================= Alerts ======================= */
  let alertEl = null;
  function closeAlert() { alertEl?.remove(); alertEl = null; }
  function showAlert({ title, icon, msg, ok = "OK", cancel, onOk }) {
    closeAlert();
    alertEl = document.createElement("div");
    alertEl.className = "alert"; alertEl.setAttribute("role", "alertdialog");
    alertEl.innerHTML = `<div class="t">${esc(title)}</div><div class="c">${icon}<div>${esc(msg)}</div></div>
      <div class="bt">${cancel ? `<button class="btn ghost" data-a="c">${esc(cancel)}</button>` : ""}<button class="btn" data-a="o">${esc(ok)}</button></div>`;
    document.body.appendChild(alertEl);
    alertEl.querySelector('[data-a="o"]').focus();
    alertEl.addEventListener("click", (e) => {
      const a = e.target.dataset.a; if (!a) return;
      closeAlert(); if (a === "o") onOk?.();
    });
  }
  function appAlert(id) {
    const a = P.apps[id];
    if (id === "warn") return showAlert({ title: a.name, icon: ICONS.warn, msg: a.msg, ok: a.button, cancel: a.cancel, onOk: openMail });
    showAlert({ title: a.name, icon: ICONS[id], msg: a.msg, ok: a.button, cancel: "Close", onOk: () => filterBy(id) });
  }

  /* ======================= Desktop icons ======================= */
  const iconEls = {};
  const select = (el) => {
    if (el?.classList.contains("selected")) return;
    desktop.querySelectorAll(".icon.selected").forEach((x) => x.classList.remove("selected"));
    el?.classList.add("selected");
  };

  function filterBy(cat) {
    desktop.classList.add("filtering");
    Object.entries(iconEls).forEach(([id, el]) => {
      const it = P.items.find((i) => i.id === id);
      el.classList.toggle("match", it.cat === cat);
    });
    Object.entries(groupEls).forEach(([c, g]) => g.classList.toggle("on", c === cat));
  }
  function clearFilter() { desktop.classList.remove("filtering"); }

  // Section cards behind the icons: one per category, with a clickable heading.
  const groupEls = {};
  P.groups.forEach((g) => {
    const el = document.createElement("section");
    el.className = "group";
    const n = P.items.filter((i) => i.cat === g.cat).length;
    el.innerHTML = `<button class="gh" type="button"><span>${esc(g.name)}</span><em>${n}</em></button>`;
    el.querySelector(".gh").addEventListener("click", () => {
      if (desktop.classList.contains("filtering") && el.classList.contains("on")) clearFilter();
      else filterBy(g.cat);
    });
    desktop.appendChild(el); groupEls[g.cat] = el;
  });

  // Click empty desktop: deselect. Drag on empty desktop: Finder-style selection rectangle.
  desktop.addEventListener("pointerdown", (e) => {
    if (e.target !== desktop) return;
    select(null); clearFilter();
    document.querySelectorAll(".win.focused").forEach((x) => x.classList.remove("focused"));
    if (e.pointerType === "touch") return;
    const sx = e.clientX, sy = e.clientY;
    const box = document.createElement("div");
    box.className = "marquee";
    desktop.appendChild(box);
    desktop.setPointerCapture(e.pointerId);
    const mv = (ev) => {
      const x = Math.min(sx, ev.clientX), y = Math.min(sy, ev.clientY);
      const w = Math.abs(ev.clientX - sx), h = Math.abs(ev.clientY - sy);
      Object.assign(box.style, { left: x + "px", top: y + "px", width: w + "px", height: h + "px" });
      Object.values(iconEls).forEach((el) => {
        const r = el.querySelector(".cv").getBoundingClientRect();
        const hit = r.right > x && r.left < x + w && r.bottom > y && r.top < y + h && el.style.display !== "none";
        el.classList.toggle("selected", hit);
      });
    };
    const up = () => {
      box.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120 }).onfinish = () => box.remove();
      desktop.removeEventListener("pointermove", mv); desktop.removeEventListener("pointerup", up);
    };
    desktop.addEventListener("pointermove", mv); desktop.addEventListener("pointerup", up);
  });

  // Grid layout: desktop = one column-card per section; phone = stacked full-width cards.
  function layout() {
    const W = innerWidth, H = innerHeight, m = mobile();
    const place = (el, x, y, w, h) => Object.assign(el.style, { left: x + "px", top: y + "px", width: w + "px", height: h + "px" });
    const put = (it, x, y) => {
      const el = iconEls[it.id]; if (!el || el.dataset.moved) return;
      el.style.left = x + "px"; el.style.top = y + "px";
    };
    const HEAD = 40;
    if (!m) {
      const gap = 16, top = 70, bottom = H - 104, left = 28;
      const secW = (W - left * 2 - gap * (P.groups.length - 1)) / P.groups.length;
      const cols = secW >= 236 ? 2 : 1; // narrow windows: one icon per row inside each card
      const rows = Math.max(...P.groups.map((g) => Math.ceil(P.items.filter((i) => i.cat === g.cat).length / cols)));
      const rowH = Math.min(132, (bottom - top - HEAD - 8) / rows);
      // wide covers are 2x as wide as tall, so they must fit the cell width too
      document.documentElement.style.setProperty("--cover", Math.max(30, Math.min(60, rowH - 52, (secW / cols - 16) / 2)) + "px");
      const cardH = HEAD + rows * rowH + 8;
      const y0 = top + Math.max(0, (bottom - top - cardH) / 2); // center the row of cards
      P.groups.forEach((g, gi) => {
        const x0 = left + gi * (secW + gap);
        place(groupEls[g.cat], x0, y0, secW, cardH);
        const list = P.items.filter((i) => i.cat === g.cat);
        list.forEach((it, k) => {
          const r = Math.floor(k / cols), c = k % cols;
          const lastAlone = k === list.length - 1 && c === 0; // odd one out sits centered
          const cx = lastAlone ? x0 + secW / 2 : x0 + secW * (c + 0.5) / cols;
          put(it, cx, y0 + HEAD + rowH * (r + 0.5));
        });
      });
    } else {
      const cols = 3, gap = 8, left = 58, right = 10, top = 12, bottom = H - 58, head = 34;
      const rowsOf = (g) => Math.ceil(P.items.filter((i) => i.cat === g.cat).length / cols);
      const totalRows = P.groups.reduce((s, g) => s + rowsOf(g), 0);
      const rowH = (bottom - top - P.groups.length * head - (P.groups.length - 1) * gap) / totalRows;
      document.documentElement.style.setProperty("--cover", Math.max(26, Math.min(44, rowH - 34)) + "px");
      const w = W - left - right;
      let y = top;
      P.groups.forEach((g) => {
        const h = head + rowsOf(g) * rowH;
        place(groupEls[g.cat], left, y, w, h);
        P.items.filter((i) => i.cat === g.cat).forEach((it, k) => {
          const r = Math.floor(k / cols), c = k % cols;
          put(it, left + w * (c + 0.5) / cols, y + head + rowH * (r + 0.5) - 2);
        });
        y += h + gap;
      });
    }
  }

  const binRect = () => dockBtns.trash.getBoundingClientRect();
  const overBin = (x, y) => { const r = binRect(); return x > r.left - 10 && x < r.right + 10 && y > r.top - 14 && y < r.bottom + 10; };

  function trashIcon(it, el) {
    const r = binRect(), b = el.getBoundingClientRect();
    el.classList.add("trashing");
    el.style.transform = `translate(calc(-50% + ${r.left + r.width / 2 - (b.left + b.width / 2)}px), calc(-50% + ${r.top - b.top}px)) scale(.15)`;
    setTimeout(() => { el.style.display = "none"; }, 360);
    trashed.add(it.id); refreshTrash();
    closeWin(it.id);
  }
  function restoreIcon(id) {
    const el = iconEls[id];
    el.style.display = ""; el.style.transform = ""; el.classList.remove("trashing");
  }

  P.items.forEach((it) => {
    const el = document.createElement("div");
    el.className = "icon"; el.tabIndex = 0;
    el.setAttribute("role", "button"); el.setAttribute("aria-label", it.title.replace("\n", " "));
    el.innerHTML = `${coverHtml(it.cover, "cv")}<div class="lbl">${esc(it.title)}</div>`;
    desktop.appendChild(el); iconEls[it.id] = el;

    let down = null, dragging = false, lastClick = 0;
    el.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      down = { x: e.clientX, y: e.clientY, ox: e.clientX - el.offsetLeft, oy: e.clientY - el.offsetTop };
      dragging = false; select(el);
      el.setPointerCapture(e.pointerId);
    });
    let mx = 0, my = 0, raf = 0;
    const applyDrag = () => {
      raf = 0;
      const hot = overBin(mx, my); // read before writing
      el.style.left = Math.max(20, Math.min(innerWidth - 20, mx - down.ox)) + "px";
      el.style.top = Math.max(20, Math.min(innerHeight - 20, my - down.oy)) + "px";
      dockBtns.trash.classList.toggle("drop-hover", hot);
    };
    el.addEventListener("pointermove", (e) => {
      if (!down) return;
      if (!dragging && Math.hypot(e.clientX - down.x, e.clientY - down.y) < 4) return;
      if (!dragging) { dragging = true; el.classList.add("dragging"); el.dataset.moved = "1"; }
      mx = e.clientX; my = e.clientY;
      if (!raf) raf = requestAnimationFrame(applyDrag);
    });
    el.addEventListener("pointerup", (e) => {
      if (!down) return;
      if (raf) { cancelAnimationFrame(raf); applyDrag(); }
      el.classList.remove("dragging"); dockBtns.trash.classList.remove("drop-hover");
      if (dragging && overBin(e.clientX, e.clientY)) trashIcon(it, el);
      else if (!dragging) {
        const now = Date.now();
        if (e.pointerType === "touch" || now - lastClick < 380) { openInfo(it, el.querySelector(".cv")); lastClick = 0; }
        else lastClick = now;
      }
      down = null;
    });
    el.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openInfo(it, el.querySelector(".cv")); } });
  });
  layout();
  // re-run once the size has settled too (rotation / window snapping can fire resize mid-change)
  let relayT = 0;
  addEventListener("resize", () => { requestAnimationFrame(layout); clearTimeout(relayT); relayT = setTimeout(layout, 200); });

  /* ======================= Intro ======================= */
  setTimeout(() => prepSnapshots(), 2500);
  const order = Object.values(iconEls).sort(() => Math.random() - 0.5);
  setTimeout(() => order.forEach((el) => el.classList.add("label-in")), 350);
  order.forEach((el, i) => setTimeout(() => el.classList.add("shown"), 700 + i * 75));
})();
