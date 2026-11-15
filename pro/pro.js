(function () {
  const P = window.PORTFOLIO, IC = window.ICONS;
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  /* ---------- Icons ---------- */
  const ui = (name) => `<svg class="ui" viewBox="0 0 24 24" aria-hidden="true">${IC.ui[name] || ""}</svg>`;
  const brand = (slug) => `<svg class="bi" viewBox="0 0 24 24" aria-hidden="true"><path d="${IC.brand[slug].d}"/></svg>`;
  // "wordpress" → brand mark, "ui:bot" → line icon. Returns { html, color }.
  function icon(key) {
    if (key.startsWith("ui:")) return { html: ui(key.slice(3)), color: "" };
    const b = IC.brand[key];
    return b ? { html: brand(key), color: b.c } : { html: ui("braces"), color: "" };
  }
  document.querySelectorAll("[data-ico]").forEach((el) => { el.innerHTML = ui(el.dataset.ico); });

  const about = P.items.find((i) => i.id === "about");
  const techCount = P.stack.reduce((n, g) => n + g.items.length, 0);

  /* ---------- Sections (rail, tab bar, palette) ---------- */
  const SECTIONS = [["home", "Home", "house"], ["about", "About", "user"], ["skills", "Skills", "wrench"], ["experience", "Experience", "briefcase"], ["projects", "Projects", "layout-grid"], ["contact", "Contact", "mail"], ["stats", "Stats", "trending-up"]];
  const navHtml = SECTIONS.map(([id, label, ico]) => `<a href="#${id}" data-sec="${id}" data-tip="${label}" aria-label="${label}">${ui(ico)}</a>`).join("");
  $("rail-nav").innerHTML = navHtml;
  $("tabbar").innerHTML = navHtml;

  /* ---------- Hero ---------- */
  $("first").textContent = P.name.split(" ")[0];
  $("cap-name").textContent = P.name;
  $("cap-role").textContent = "Web developer";
  $("lead").innerHTML = "Full-stack developer working across <b>custom development</b>, <b>WordPress</b>, <b>Shopify</b> and <b>AI automation</b>. I build the interface, the backend behind it, and the automation around it.";
  $("works").innerHTML = ["javascript", "react", "python", "php", "wordpress", "shopify", "n8n"].map((s) => `<b title="${s === "php" ? "PHP" : s === "n8n" ? "n8n" : s[0].toUpperCase() + s.slice(1)}" style="--c:${IC.brand[s].c}">${brand(s)}</b>`).join("");

  (async function typeLoop() {
    const el = $("typed");
    const lines = ["I build custom full-stack web apps.", "I build custom WordPress themes.", "I build Shopify themes and apps.", "I automate work with n8n and AI."];
    if (reduce) { el.textContent = lines[0]; return; }
    await sleep(900);
    for (let i = 0; ; i = (i + 1) % lines.length) {
      const t = lines[i], keep = 2; // "I " stays put; only the rest retypes
      for (let k = el.textContent.length < keep ? 1 : keep; k <= t.length; k++) { el.textContent = t.slice(0, k); await sleep(40); }
      await sleep(2000);
      for (let k = t.length; k >= keep; k--) { el.textContent = t.slice(0, k); await sleep(16); }
      await sleep(220);
    }
  })();

  // Portrait leans slightly toward the pointer
  const portrait = $("portrait");
  if (fine && !reduce) {
    let raf = 0, ev = null;
    addEventListener("pointermove", (e) => {
      ev = e; if (raf || scrollY > innerHeight) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const x = ev.clientX / innerWidth - 0.5, y = ev.clientY / innerHeight - 0.5;
        portrait.style.transform = `rotateY(${x * 9}deg) rotateX(${-y * 8}deg)`;
      });
    }, { passive: true });
  }

  /* ---------- About ---------- */
  const check = '<svg class="ui" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
  $("about-text").innerHTML = `
    <p class="rv" style="--i:1">I'm <b>${esc(P.name)}</b>, a custom developer first. I work across the <b>frontend and the backend</b>: the interface people see, and the server, APIs and database behind it. I write in <b>JavaScript</b>, <b>PHP</b> and <b>Python</b>.</p>
    <p class="rv" style="--i:2">On <b>WordPress</b> and <b>Shopify</b> I build without page builders or a pile of plugins. Custom themes, custom plugins and custom apps, written by hand so they do exactly what is needed and nothing extra.</p>
    <p class="rv" style="--i:3">I also work with <b>AI and automation</b>: n8n workflows that run on their own, AI agents connected to live tools through <b>MCP servers</b>, and AI video made with Higgsfield and Flow.</p>
    <ul class="gets rv" style="--i:4">
      <li>${check}<span><b>Full stack.</b> Frontend, backend, CMS and e-commerce.</span></li>
      <li>${check}<span><b>Built from scratch.</b> Custom code instead of templates.</span></li>
      <li>${check}<span><b>Made to last.</b> Fast, readable and easy to maintain.</span></li>
    </ul>`;
  const WHAT = [
    ["Custom development", "Full-stack web apps: frontend, backend, APIs and database, built as one project.", ["javascript", "react", "python"]],
    ["WordPress", "Custom themes and custom plugins written from scratch, plus WooCommerce stores.", ["wordpress", "woocommerce", "php"]],
    ["Shopify", "Custom Liquid themes with tailored sections, and custom apps.", ["shopify", "graphql"]],
    ["AI & automation", "n8n workflows, AI agents, MCP servers and AI video.", ["n8n", "modelcontextprotocol"]],
  ];
  $("what").innerHTML = WHAT.map(([t, d, ics], i) => `<li class="rv" style="--i:${i}"><h4>${t}</h4><div class="ics">${ics.map(brand).join("")}</div><p>${d}</p></li>`).join("");

  /* ---------- Skills ---------- */
  $("skill-groups").innerHTML = P.stack.map((g) => `<div class="sg"><h3 class="sg-h rv">${esc(g.name)}<small>${String(g.items.length).padStart(2, "0")} skills</small></h3><div class="sg-grid">` +
    g.items.map(([name, key, note], i) => {
      const ic = icon(key), dim = ic.color === "" && !key.startsWith("ui:");
      return `<article class="tile rv" style="--i:${i + 1}${ic.color ? `;--c:${ic.color}` : ""}"><span class="ic"${dim ? " data-dim" : ""}>${ic.html}</span><div><h4>${esc(name)}</h4><small>${esc(note)}</small></div></article>`;
    }).join("") + "</div></div>").join("");

  /* ---------- Experience ---------- */
  $("timeline").innerHTML = P.experience.map((e, i) => `<li class="rv" style="--i:${i}"><div class="when">${esc(e.when)}</div><div><h4>${esc(e.role)}</h4><div class="meta">${esc(e.where)}</div><p>${esc(e.text)}</p></div></li>`).join("");

  /* ---------- Projects: category tabs + "All", 6 cards initially, "View all" expands cleanly ---------- */
  const FALLBACK_ICON = { code: "react", wp: "wordpress", shopify: "shopify", ai: "n8n" };
  const baseCats = P.groups.filter((g) => P.projects.some((p) => p.cat === g.cat));
  const projCats = [...baseCats, { cat: "all", name: "All" }];
  const tabsEl = $("proj-tabs"), ink = $("tab-ink"), listEl = $("project-list"), allBtn = $("view-all"), allLabel = $("view-all-label");
  let activeCat = baseCats[0]?.cat || "all", showAll = false;

  function card(p, i) {
    const slug = IC.brand[p.icon] ? p.icon : FALLBACK_ICON[p.cat] || "react";
    const shot = p.image
      ? `<img src="${esc(p.image.startsWith("http") ? p.image : "../" + p.image)}" alt="${esc(p.title)}" loading="lazy">`
      : `<div class="bar"><i></i><i></i><i></i></div><div class="ph" style="--c:${IC.brand[slug].c || "currentColor"}">${brand(slug)}<span>${p.placeholder ? "Case study coming soon" : ""}</span></div>`;
    return `<article class="proj swap" style="--i:${Math.min(i, 8)}"><div class="shot">${shot}</div>
      <div class="body"><h4>${esc(p.title)}</h4><p>${esc(p.desc)}</p>
        <div class="tags">${p.tech.map((t) => `<span>${esc(t)}</span>`).join("")}</div>
        ${p.link ? (p.pass ? `<form class="live-form" method="post" action="${esc(p.link.replace(/\/$/, ""))}/password" target="_blank"><input type="hidden" name="form_type" value="storefront_password"><input type="hidden" name="utf8" value="✓"><input type="hidden" name="password" value="${esc(p.pass)}"><button class="more" type="submit" title="Password-protected store: the password is entered for you">View live &rarr; <small>auto-unlock</small></button></form>` : `<a class="more" href="${esc(p.link)}" target="_blank" rel="noopener">View live &rarr;</a>`) : ""}</div></article>`;
  }
  function moveInk() {
    const on = tabsEl.querySelector(".tab.on");
    if (!on) { ink.style.opacity = 0; return; }
    ink.style.opacity = 1; ink.style.width = on.offsetWidth + "px"; ink.style.transform = `translateX(${on.offsetLeft}px)`;
  }
  function catList(cat) {
    return cat === "all" ? P.projects : P.projects.filter((p) => p.cat === cat);
  }
  function renderProjects() {
    const filtered = catList(activeCat);
    const limit = activeCat === "all" ? 9 : 6;
    const list = showAll ? filtered : filtered.slice(0, limit);
    listEl.innerHTML = list.map(card).join("");
    tabsEl.querySelectorAll(".tab").forEach((t) => { const on = t.dataset.cat === activeCat; t.classList.toggle("on", on); t.setAttribute("aria-selected", on); t.tabIndex = on ? 0 : -1; });
    const activeObj = projCats.find((g) => g.cat === activeCat);
    if (showAll) {
      allLabel.textContent = "Show less";
    } else if (filtered.length > limit && activeCat !== "all") {
      allLabel.textContent = `View all ${activeObj?.name || ""} (${filtered.length})`;
    } else {
      allLabel.textContent = `View all projects (${P.projects.length})`;
    }
    allBtn.hidden = filtered.length <= limit && activeCat === "all";
    allBtn.classList.toggle("open", showAll);
    moveInk();
  }
  tabsEl.insertAdjacentHTML("beforeend", projCats.map((g) => `<button class="tab" type="button" role="tab" data-cat="${g.cat}">${esc(g.name)}<small>${catList(g.cat).length}</small></button>`).join(""));
  tabsEl.addEventListener("click", (e) => { const t = e.target.closest(".tab"); if (!t) return; activeCat = t.dataset.cat; showAll = false; renderProjects(); });
  tabsEl.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const i = projCats.findIndex((g) => g.cat === activeCat), n = projCats.length;
    activeCat = projCats[(i + (e.key === "ArrowRight" ? 1 : n - 1)) % n].cat; showAll = false; renderProjects();
    tabsEl.querySelector(".tab.on").focus();
  });
  allBtn.addEventListener("click", () => {
    const filtered = catList(activeCat);
    const limit = activeCat === "all" ? 9 : 6;
    if (!showAll && filtered.length <= limit && activeCat !== "all") {
      activeCat = "all";
      showAll = true;
    } else {
      showAll = !showAll;
    }
    renderProjects();
    if (!showAll) $("projects").scrollIntoView();
  });
  renderProjects();
  addEventListener("resize", moveInk);
  document.fonts?.ready.then(moveInk);
  $("site-link").href = P.website;

  /* ---------- Contact ---------- */
  const host = P.website.replace(/^https?:\/\//, "").replace(/\/$/, "");
  $("info").innerHTML =
    (P.email ? `<li><a href="mailto:${esc(P.email)}"><span class="ic">${ui("mail")}</span>${esc(P.email)}</a></li>` : "") +
    `<li><a href="${esc(P.website)}" target="_blank" rel="noopener"><span class="ic">${ui("globe")}</span>${esc(host)}</a></li>
     <li><span><span class="ic">${ui("briefcase")}</span>${esc(P.role)}</span></li>`;
  const form = $("form"), note = $("form-note"), sendBtn = $("send-btn");
  form.addEventListener("input", (e) => { if (e.target.classList?.contains("bad")) e.target.classList.remove("bad"); });
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (sendBtn.classList.contains("is-sending") || sendBtn.classList.contains("is-sent")) return;
    const d = new FormData(form);
    const hasInput = [...form.elements].some((f) => f.name && f.value.trim());
    if (hasInput) {
      let ok = true;
      [...form.elements].forEach((f) => { if (!f.name) return; const bad = !f.value.trim() || (f.type === "email" && !/^\S+@\S+\.\S+$/.test(f.value)); f.classList.toggle("bad", bad); if (bad) ok = false; });
      if (!ok) { note.textContent = "Please fill in all three fields with a valid email."; return; }
    }
    note.textContent = "";
    sendBtn.classList.add("is-sending");
    await sleep(reduce ? 150 : 1350);
    sendBtn.classList.remove("is-sending");
    sendBtn.classList.add("is-sent");
    note.textContent = "Your message has been sent! I'll get back to you soon.";
    if (P.email && hasInput) {
      location.href = `mailto:${P.email}?subject=${encodeURIComponent("Portfolio message from " + d.get("name"))}&body=${encodeURIComponent(d.get("message") + "\n\n" + d.get("name") + "\n" + d.get("email"))}`;
    }
    form.reset();
    await sleep(3200);
    sendBtn.classList.remove("is-sent");
    note.textContent = "";
  });

  /* ---------- Stats (real numbers from data.js) ---------- */
  $("stat-list").innerHTML = [[1, "+", "Year of experience"], [techCount, "", "Skills & technologies"], [P.stack.length, "", "Skill areas"], [P.projects.length, "", P.projects.every((p) => p.placeholder) ? "Case studies on the way" : "Projects"]]
    .map(([n, suf, l]) => `<div class="stat"><b><span data-count="${n}">0</span><i>${suf}</i></b><span>${l}</span></div>`).join("");
  function countUp(el) {
    const to = +el.dataset.count;
    if (reduce) { el.textContent = to; return; }
    const t0 = performance.now();
    (function tick(now) { const p = Math.min(1, (now - t0) / 1100); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(tick); })(t0);
  }
  $("yr").textContent = new Date().getFullYear();

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (!en.isIntersecting) return;
    io.unobserve(en.target); en.target.classList.add("in");
    en.target.querySelectorAll("[data-count]").forEach(countUp);
  }), { threshold: 0, rootMargin: "0px 0px -30px 0px" });
  document.querySelectorAll("[data-reveal]").forEach((s) => io.observe(s));

  /* ---------- Scroll spy + progress ---------- */
  const secEls = SECTIONS.map(([id]) => $(id));
  const navLinks = [...document.querySelectorAll("[data-sec]")];
  const prog = $("rail-prog"), homeLink = document.querySelector('.top-links a[href="#home"]'), projLink = document.querySelector('.top-links a[href="#projects"]');
  let sraf = 0, cur = "";
  function onScroll() {
    sraf = 0;
    const max = document.documentElement.scrollHeight - innerHeight;
    prog.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
    let id = "home";
    secEls.forEach((s) => { if (s.getBoundingClientRect().top < innerHeight * 0.42) id = s.id; });
    if (scrollY >= max - 4) id = SECTIONS[SECTIONS.length - 1][0];
    if (id === cur) return;
    cur = id;
    navLinks.forEach((a) => a.classList.toggle("on", a.dataset.sec === id));
    homeLink.classList.toggle("on", id !== "projects"); projLink.classList.toggle("on", id === "projects");
  }
  addEventListener("scroll", () => { if (!sraf) sraf = requestAnimationFrame(onScroll); }, { passive: true });
  onScroll();

  /* ---------- Clock, theme ---------- */
  const clock = $("clock");
  const tick = () => { clock.textContent = new Date().toLocaleTimeString("en-GB"); };
  tick(); setInterval(tick, 1000);
  $("theme").addEventListener("click", () => {
    const dark = document.documentElement.classList.toggle("dark");
    try { localStorage.setItem("ea-theme", dark ? "dark" : "light"); } catch (e) {}
  });

  /* ---------- Magnetic buttons ---------- */
  if (fine && !reduce) document.querySelectorAll("[data-mag]").forEach((b) => {
    b.addEventListener("pointermove", (e) => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px, ${(e.clientY - r.top - r.height / 2) * 0.26}px)`; });
    b.addEventListener("pointerleave", () => { b.style.transform = ""; });
  });

  /* ---------- Command palette (Ctrl/⌘ + K) ---------- */
  const pal = $("palette"), palIn = $("pal-input"), palList = $("pal-list");
  $("kbd").textContent = /Mac|iPhone|iPad/.test(navigator.platform) ? "⌘K" : "Ctrl K";
  const ENTRIES = [
    ...SECTIONS.map(([id, label]) => ({ label, kind: "Section", go: () => $(id).scrollIntoView() })),
    ...P.stack.flatMap((g) => g.items.map(([name]) => ({ label: name, kind: g.name, go: () => $("skills").scrollIntoView() }))),
    ...P.projects.map((p) => ({ label: p.title, kind: "Project", go: () => $("projects").scrollIntoView() })),
    { label: "Toggle dark mode", kind: "Action", go: () => $("theme").click() },
    { label: "Switch portfolio style", kind: "Action", go: () => { location.href = "../"; } },
  ];
  let shown = [], sel = 0;
  function renderPal() {
    const q = palIn.value.trim().toLowerCase();
    shown = ENTRIES.filter((e) => !q || e.label.toLowerCase().includes(q) || e.kind.toLowerCase().includes(q)).slice(0, 9);
    sel = Math.min(sel, Math.max(0, shown.length - 1));
    palList.innerHTML = shown.length ? shown.map((e, i) => `<li class="${i === sel ? "sel" : ""}" data-i="${i}">${esc(e.label)}<small>${esc(e.kind)}</small></li>`).join("") : '<li class="none">Nothing found</li>';
  }
  const openPal = () => { pal.hidden = false; palIn.value = ""; sel = 0; renderPal(); palIn.focus(); };
  const closePal = () => { pal.hidden = true; };
  const pickPal = (i) => { const e = shown[i]; if (!e) return; closePal(); e.go(); };
  $("search-btn").addEventListener("click", openPal);
  palIn.addEventListener("input", () => { sel = 0; renderPal(); });
  palList.addEventListener("click", (e) => { const li = e.target.closest("li[data-i]"); if (li) pickPal(+li.dataset.i); });
  pal.addEventListener("click", (e) => { if (e.target === pal) closePal(); });
  addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); pal.hidden ? openPal() : closePal(); return; }
    if (pal.hidden) return;
    if (e.key === "Escape") closePal();
    else if (e.key === "ArrowDown") { e.preventDefault(); sel = (sel + 1) % Math.max(1, shown.length); renderPal(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); sel = (sel - 1 + shown.length) % Math.max(1, shown.length); renderPal(); }
    else if (e.key === "Enter") { e.preventDefault(); pickPal(sel); }
  });

  /* ---------- Background canvas ----------
     1. The page grid reacts to the pointer: lines brighten in a soft circle around it,
        and the squares it passes over light up briefly, leaving a short fading trail.
     2. A few slow drifting specks, like dust on paper. */
  (function backdrop() {
    const cv = $("dust"), ctx = cv.getContext("2d");
    const G = 24, R = 170;                       // grid size (matches the CSS background) and glow radius
    let W = 0, H = 0, dots = [], raf = 0;
    let px = -999, py = -999, gx = -999, gy = -999, glow = 0, inside = false;   // pointer, eased pointer, glow strength
    let mx = 0, my = 0;
    const cells = new Map();                     // "col,row" (page coordinates) → brightness 0..1
    const rgb = () => (document.documentElement.classList.contains("dark") ? "155,135,255" : "91,61,245");

    function fit() {
      const dpr = Math.min(devicePixelRatio || 1, 1.5);
      W = innerWidth; H = innerHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(34, (W * H) / 42000));
      dots = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, r: 0.8 + Math.random() * 1.8, z: 0.3 + Math.random() * 0.9, vx: (Math.random() - 0.5) * 0.1, vy: -0.03 - Math.random() * 0.1, a: 0.1 + Math.random() * 0.28 }));
      if (reduce) draw();
    }

    function draw() {
      const c = rgb(), sy = scrollY;
      ctx.clearRect(0, 0, W, H);

      // dust
      for (const d of dots) {
        d.x += d.vx; d.y += d.vy;
        if (d.y < -10) { d.y = H + 10; d.x = Math.random() * W; }
        if (d.x < -10) d.x = W + 10; else if (d.x > W + 10) d.x = -10;
        ctx.beginPath(); ctx.fillStyle = `rgba(${c},${d.a})`;
        ctx.arc(d.x + mx * d.z * 22, d.y + my * d.z * 22, d.r, 0, 6.2832); ctx.fill();
      }
      if (reduce) return;

      // squares the pointer passed over, fading out
      for (const [key, v] of cells) {
        const [col, row] = key.split(",");
        ctx.fillStyle = `rgba(${c},${(v * 0.13).toFixed(3)})`;
        ctx.fillRect(col * G + 1, row * G + 1 - sy, G - 1, G - 1);
        if (v < 0.03) cells.delete(key); else cells.set(key, v * 0.94);
      }

      // grid lines brighten around the (eased) pointer
      glow += ((inside ? 1 : 0) - glow) * 0.08;
      gx += (px - gx) * 0.16; gy += (py - gy) * 0.16;
      if (glow > 0.01) {
        const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, R);
        g.addColorStop(0, `rgba(${c},${0.5 * glow})`); g.addColorStop(1, `rgba(${c},0)`);
        ctx.strokeStyle = g; ctx.lineWidth = 1; ctx.beginPath();
        for (let x = Math.ceil((gx - R) / G) * G; x <= gx + R; x += G) { ctx.moveTo(x + 0.5, gy - R); ctx.lineTo(x + 0.5, gy + R); }
        const off = sy % G;
        for (let y = Math.ceil((gy - R + off) / G) * G - off; y <= gy + R; y += G) { ctx.moveTo(gx - R, y + 0.5); ctx.lineTo(gx + R, y + 0.5); }
        ctx.stroke();
      }
    }
    function loop() { draw(); raf = requestAnimationFrame(loop); }
    fit(); addEventListener("resize", fit);
    if (reduce) return;
    addEventListener("pointermove", (e) => {
      if (!inside) { gx = e.clientX; gy = e.clientY; }
      px = e.clientX; py = e.clientY; inside = true;
      mx = 0.5 - px / innerWidth; my = 0.5 - py / innerHeight;
      const col = Math.floor(px / G), row = Math.floor((py + scrollY) / G);
      cells.set(col + "," + row, 1);
      if (Math.random() < 0.35) cells.set((col + (Math.random() < 0.5 ? -1 : 1)) + "," + (row + (Math.random() < 0.5 ? -1 : 1)), 0.55);   // an occasional neighbour, so the trail feels alive
    }, { passive: true });
    document.addEventListener("pointerleave", () => { inside = false; });
    addEventListener("pointerup", (e) => { if (e.pointerType === "touch") inside = false; });
    document.addEventListener("visibilitychange", () => { cancelAnimationFrame(raf); if (!document.hidden) loop(); });
    loop();
  })();

  /* ---------- Cards catch the light: a soft highlight follows the pointer inside each one ---------- */
  if (fine && !reduce) document.addEventListener("pointermove", (e) => {
    const el = e.target.closest?.(".tile, .proj, .panel, .stat");
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--x", e.clientX - r.left + "px"); el.style.setProperty("--y", e.clientY - r.top + "px");
  }, { passive: true });
})();
