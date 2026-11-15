(function () {
  const P = window.PORTFOLIO;
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const flat = (t) => t.replace(/\n/g, " ");
  const wait = (ms) => new Promise((r) => setTimeout(r, FX.reduce ? 0 : ms));

  const rain = MatrixRain($("rain"), { fade: 0.08, density: 0.85 });
  FX.cursor();

  const about = P.items.find((i) => i.id === "about");
  const PR = P.profile, IC = window.ICONS || { brand: {}, ui: {} };
  const allTools = [...new Set(P.stack.flatMap((g) => g.items.map((it) => it[0])))];
  const techCount = allTools.length;
  // Brand marks and line icons from pro/icons.js, drawn in the page's green.
  const icon = (key) => key.startsWith("ui:")
    ? `<svg class="ic ui" viewBox="0 0 24 24" aria-hidden="true">${IC.ui[key.slice(3)] || ""}</svg>`
    : IC.brand[key] ? `<svg class="ic bi" viewBox="0 0 24 24" aria-hidden="true"><path d="${IC.brand[key].d}"/></svg>` : "";
  const liveLink = (p) => !p.link ? "" : p.pass
    ? `<form class="live-form" method="post" action="${esc(p.link.replace(/\/$/, ""))}/password" target="_blank"><input type="hidden" name="form_type" value="storefront_password"><input type="hidden" name="utf8" value="✓"><input type="hidden" name="password" value="${esc(p.pass)}"><button class="more" type="submit" title="Password-protected store: the password is entered for you">View live &rarr; <small>auto-unlock</small></button></form>`
    : `<a class="more" href="${esc(p.link)}" target="_blank" rel="noopener">View live &rarr;</a>`;

  /* ---------- Hero ---------- */
  $("pitch").textContent = PR.lead;
  $("stats").innerHTML = [
    ["2", "+", "years experience"],
    [P.projects.filter((p) => !p.placeholder).length, "+", "live projects"],
    [P.stack.length, "", "skill areas"],
    [techCount, "+", "tools & tech"],
  ].map(([n, suf, l]) => `<div><dt><span data-count="${n}">0</span><b>${suf}</b></dt><dd>${l}</dd></div>`).join("");

  // Count-up numbers
  function countUp(el) {
    const to = +el.dataset.count;
    if (FX.reduce) { el.textContent = to; return; }
    const t0 = performance.now(), dur = 1100;
    (function tick(now) {
      const p = Math.min(1, (now - t0) / dur);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }

  // Rotating roles: type, hold, delete, next
  (async function rotate() {
    const el = $("rot");
    if (FX.reduce) { el.textContent = P.roles[0]; return; }
    await wait(1500);
    for (let i = 0; ; i = (i + 1) % P.roles.length) {
      const t = P.roles[i];
      for (let k = 1; k <= t.length; k++) { el.textContent = t.slice(0, k); await wait(38); }
      await wait(1500);
      for (let k = t.length; k >= 0; k--) { el.textContent = t.slice(0, k); await wait(16); }
      await wait(220);
    }
  })();

  // Name decodes on load, then keeps glitching now and then
  const name = $("name");
  name.textContent = "";
  setTimeout(async () => {
    rain.burst(0.8);
    await FX.scramble(name, P.name.toUpperCase(), 1100);
    name.classList.add("go");
    document.querySelectorAll("#stats [data-count]").forEach(countUp);
  }, FX.reduce ? 0 : 250);

  // Portrait leans toward the pointer; live coordinates readout
  const holo = document.querySelector(".holo"), coords = $("coords");
  if (FX.fine && !FX.reduce) {
    let raf = 0, ev = null;
    addEventListener("pointermove", (e) => {
      ev = e;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const x = ev.clientX / innerWidth - 0.5, y = ev.clientY / innerHeight - 0.5;
        if (scrollY < innerHeight) holo.style.transform = `rotateY(${x * 16}deg) rotateX(${-y * 14}deg)`;
        coords.textContent = `X:${String(ev.clientX).padStart(4, "0")} Y:${String(ev.clientY).padStart(4, "0")}`;
      });
    }, { passive: true });
  }

  /* ---------- Marquee ---------- */
  const strip = allTools.map((t) => `<span>${esc(t)}</span>`).join("");
  $("track").innerHTML = strip + strip;

  /* ---------- About ---------- */
  $("about-body").innerHTML = `
    <div class="cmd rv" style="--i:0">whoami</div>
    <p class="rv lead-line" style="--i:1">${esc(PR.headline)}</p>
    ${PR.paragraphs.map((t, i) => `<p class="rv" style="--i:${i + 2}">${esc(t)}</p>`).join("")}
    <div class="cmd rv" style="--i:5">ls focus/</div>
    <ul class="rv" style="--i:6">${P.projectTabs.map((g) => `<li>${esc(g.name)}</li>`).join("")}</ul>`;
  const J = (k, v, last) => `  <span class="k">"${k}"</span><span class="p">:</span> ${v}${last ? "" : '<span class="p">,</span>'}\n`;
  const S = (v) => `<span class="s">"${esc(v)}"</span>`;
  const arr = (list) => `<span class="p">[</span>${list.map(S).join('<span class="p">, </span>')}<span class="p">]</span>`;
  $("about-json").innerHTML = '<span class="p">{</span>\n' +
    J("name", S(P.name)) + J("role", S("Full-stack developer")) + J("experience", S("2+ years")) + J("company", S("Pixelora Studio (Betopia Limited)")) +
    J("focus", arr(P.projectTabs.map((g) => g.name))) +
    J("languages", arr(["JavaScript", "TypeScript", "PHP", "Python"])) +
    J("liveProjects", `<span class="nmb">${P.projects.filter((p) => !p.placeholder).length}</span>`) +
    PR.points.map(([k, v], i, a) => J(k.replace(/\s+(\w)/g, (m, c) => c.toUpperCase()).replace(/^\w/, (c) => c.toLowerCase()), S(v), i === a.length - 1)).join("") + '<span class="p">}</span>';
  $("about-json").classList.add("rv");

  /* ---------- Skills: the same stack as the Professional page, with real icons ---------- */
  $("skill-groups").innerHTML = P.stack.map((g) => `<div class="sg"><h3 class="sg-h rv">${esc(g.name)} <em>[${g.items.length}]</em></h3><div class="sg-grid">` +
    g.items.map(([name, key, note], i) => `<article class="card tile rv" style="--i:${i + 1}" data-hot>${icon(key)}<div><h3>${esc(name)}</h3><div class="st">${esc(note)}</div></div></article>`).join("") +
    "</div></div>").join("");

  // Experience "where" text, with any names listed in e.links turned into links.
  const whereHtml = (e) => Object.entries(e.links || {}).reduce((h, [name, url]) => h.split(esc(name)).join(`<a href="${esc(url)}" target="_blank" rel="noopener">${esc(name)}</a>`), esc(e.where));
  /* ---------- Experience: a commit-log style timeline ---------- */
  $("exp-log").innerHTML = P.experience.map((e, i) => `<li class="rv" style="--i:${i}">
      <span class="hash">${(0x9f3a1c + i * 0x1b2f7).toString(16).slice(0, 7)}</span>
      <div><h3>${esc(e.role)}</h3><div class="meta">${whereHtml(e)} <span>· ${esc(e.when)}</span></div><p>${esc(e.text)}</p></div></li>`).join("");

  /* ---------- Projects: tabs per stack, six cards each, then "View all" ---------- */
  const tabs = P.projectTabs.filter((t) => P.projects.some((p) => p.cat === t.cat));
  let active = tabs[0]?.cat, showAll = false;
  const SHOW = 6;
  function projCard(p, i) {
    const img = p.image ? (p.image.startsWith("http") ? p.image : "../" + p.image) : "";
    return `<article class="card proj swap" style="--i:${Math.min(i, 8)}" data-hot>
      <div class="shot">${img ? `<img src="${esc(img)}" alt="${esc(p.title)}" loading="lazy" decoding="async">` : `<b>${String(i + 1).padStart(2, "0")}</b>`}${p.placeholder ? '<span class="soon">COMING SOON</span>' : ""}</div>
      <div class="path">~/${esc(p.cat)}/${esc(p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""))}</div>
      <h3>${esc(p.title)}</h3>
      <p>${esc(p.desc)}</p>
      <div class="tags">${p.tech.map((t) => `<span>${esc(t)}</span>`).join("")}</div>
      ${liveLink(p)}
    </article>`;
  }
  function renderProjects() {
    const all = P.projects.filter((p) => p.cat === active);
    $("project-list").innerHTML = (showAll ? all : all.slice(0, SHOW)).map(projCard).join("");
    $("ptabs").querySelectorAll("button").forEach((b) => { const on = b.dataset.cat === active; b.classList.toggle("on", on); b.setAttribute("aria-selected", on); });
    const more = all.length > SHOW;
    $("p-all").hidden = !more;
    $("p-all-label").textContent = showAll ? "Show less" : `View all ${all.length}`;
    $("p-all").classList.toggle("open", showAll);
  }
  $("ptabs").innerHTML = tabs.map((t) => `<button type="button" role="tab" data-cat="${t.cat}">${esc(t.name)} <em>${P.projects.filter((p) => p.cat === t.cat).length}</em></button>`).join("");
  $("ptabs").addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; active = b.dataset.cat; showAll = false; renderProjects(); rain.burst(0.4); });
  $("p-all").addEventListener("click", () => { showAll = !showAll; renderProjects(); if (!showAll) $("projects").scrollIntoView(); });
  renderProjects();

  /* ---------- Contact ---------- */
  $("contact-cta").innerHTML =
    (P.email ? `<a class="btn solid" href="mailto:${esc(P.email)}" data-mag>Email me <i>&rarr;</i></a>` : "") +
    `<a class="btn ${P.email ? "" : "solid"}" href="${esc(P.website)}" target="_blank" rel="noopener" data-mag>Visit website <i>&nearr;</i></a>
     <a class="btn" href="../mac/" id="to-mac" data-mag>Mac-style version <i>&rarr;</i></a>`;
  $("yr").textContent = new Date().getFullYear();

  /* ---------- Live terminal ---------- */
  const out = $("t-out"), input = $("t-input");
  const print = (text, cls = "o") => { const d = document.createElement("div"); d.className = cls; d.textContent = text; out.appendChild(d); out.scrollTop = out.scrollHeight; };
  const go = (sel) => document.querySelector(sel).scrollIntoView({ behavior: FX.reduce ? "auto" : "smooth" });
  const CMDS = {
    help: () => print("commands:\n  about      who I am\n  skills     everything I work with\n  experience what I have done\n  stack      tools & tech\n  projects   recent work\n  contact    how to reach me\n  mac        open the Mac-style portfolio\n  home       back to the style chooser\n  matrix     more rain\n  clear      clear the screen", "hl"),
    about: () => { print(PR.headline, "ok"); PR.paragraphs.forEach((t) => print(t)); },
    whoami: () => print("visitor. Type 'about' to find out who Emon is."),
    skills: () => P.stack.forEach((g) => { print(g.name.toUpperCase(), "ok"); print(g.items.map((it) => "  - " + it[0]).join("\n")); }),
    experience: () => { P.experience.forEach((e) => print(`${e.role} — ${e.where} (${e.when})`)); go("#experience"); },
    stack: () => print(allTools.join(" · ")),
    projects: () => { tabs.forEach((t) => { const l = P.projects.filter((p) => p.cat === t.cat && !p.placeholder); if (!l.length) return; print(`${t.name.toUpperCase()} (${l.length})`, "ok"); print(l.slice(0, 5).map((p) => "  - " + p.title).join("\n") + (l.length > 5 ? `\n  ... and ${l.length - 5} more` : "")); }); go("#projects"); },
    contact: () => { print("website: " + P.website + (P.email ? "\nemail:   " + P.email : ""), "ok"); },
    mac: () => { print("launching desktop ...", "ok"); FX.leave("../mac/", rain); },
    home: () => { print("returning ...", "ok"); FX.leave("../", rain); },
    matrix: () => { rain.burst(1); print("wake up, visitor ...", "ok"); },
    ls: () => print("about.txt  skills/  projects/  contact.txt"),
    clear: () => { out.innerHTML = ""; },
    sudo: () => print("nice try. Permission denied: you are not Emon.", "err"),
    hire: () => { print("excellent decision. Opening contact ...", "ok"); go("#contact"); },
  };
  function run(raw) {
    const line = raw.trim(); if (!line) return;
    print(line, "i");
    const cmd = line.toLowerCase().split(/\s+/)[0];
    (CMDS[cmd] || (() => print(`command not found: ${cmd}. Type 'help'.`, "err")))();
  }
  const hist = []; let hi = 0;
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { if (input.value.trim()) hist.push(input.value); hi = hist.length; run(input.value); input.value = ""; }
    else if (e.key === "ArrowUp") { e.preventDefault(); if (hi > 0) input.value = hist[--hi]; }
    else if (e.key === "ArrowDown") { e.preventDefault(); input.value = hi < hist.length - 1 ? hist[++hi] : ((hi = hist.length), ""); }
    else if (e.key === "Tab") { e.preventDefault(); const m = Object.keys(CMDS).filter((c) => c.startsWith(input.value.toLowerCase())); if (m.length === 1) input.value = m[0]; }
  });
  $("term").addEventListener("click", (e) => { if (!getSelection().toString()) input.focus({ preventScroll: true }); });
  $("t-chips").innerHTML = ["help", "about", "skills", "experience", "projects", "matrix"].map((c) => `<button type="button" data-c="${c}">${c}</button>`).join("");
  $("t-chips").addEventListener("click", (e) => { const c = e.target.dataset.c; if (c) run(c); });
  print("ea-os v1.0 — welcome. Type 'help' to see what you can do.", "ok");

  /* ---------- Page-wide behaviour ---------- */
  document.querySelectorAll(".card").forEach((c) => {
    // once the reveal transition is over, drop it so the tilt follows the pointer without lag
    c.addEventListener("transitionend", function done(e) { if (e.propertyName === "opacity") { c.classList.remove("rv"); c.removeEventListener("transitionend", done); } });
    FX.tilt(c, 6);
  });
  document.querySelectorAll("[data-mag]").forEach((b) => FX.magnetic(b));
  FX.reveal();

  // Links that leave this page go through the wipe
  [["switch", "../"], ["to-mac", "../mac/"]].forEach(([id, href]) => $(id).addEventListener("click", (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault(); FX.leave(href, rain);
  }));
  document.querySelector(".foot a").addEventListener("click", (e) => { e.preventDefault(); FX.leave("../", rain); });

  // Scroll: progress bar, nav state, hide nav on the way down, highlight the current section
  const nav = $("nav"), bar = $("progress"), links = [...document.querySelectorAll("#links a")];
  const secs = links.map((a) => document.querySelector(a.getAttribute("href")));
  let lastY = 0, sraf = 0, cur = -1;
  function onScroll() {
    sraf = 0;
    const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    nav.classList.toggle("solid", y > 30);
    nav.classList.toggle("hide", y > lastY && y > 400);
    lastY = y;
    let idx = -1;
    secs.forEach((s, i) => { if (s.getBoundingClientRect().top < innerHeight * 0.45) idx = i; });
    if (idx !== cur) { cur = idx; links.forEach((a, i) => a.classList.toggle("on", i === idx)); if (idx >= 0) rain.burst(0.45); }
  }
  addEventListener("scroll", () => { if (!sraf) sraf = requestAnimationFrame(onScroll); }, { passive: true });
  onScroll();
})();
