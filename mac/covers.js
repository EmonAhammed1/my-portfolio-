// Hand-drawn SVG "project covers". Each returns { w, h, body } in viewBox units.
(() => {
  const S = (w, h, body) => ({ w, h, body });
  const lines = (x, y, n, len, gap, color, op = 1) =>
    Array.from({ length: n }, (_, i) =>
      `<rect x="${x}" y="${y + i * gap}" width="${len - (i % 2) * len * 0.3}" height="4" rx="2" fill="${color}" opacity="${op}"/>`).join("");

  window.COVERS = {
    wpTheme: () => S(240, 120, `
      <defs><linearGradient id="g1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff8a5c"/><stop offset="1" stop-color="#d63c78"/></linearGradient></defs>
      <rect width="240" height="120" fill="#1b2340"/>
      <rect x="18" y="14" width="204" height="106" rx="6" fill="#fff"/>
      <circle cx="28" cy="23" r="3" fill="#ff5f57"/><circle cx="38" cy="23" r="3" fill="#febc2e"/><circle cx="48" cy="23" r="3" fill="#28c840"/>
      <rect x="18" y="31" width="204" height="1" fill="#e5e5e5"/>
      <rect x="28" y="40" width="184" height="46" rx="3" fill="url(#g1)"/>
      <text x="40" y="62" font-family="Georgia,serif" font-size="15" font-weight="700" fill="#fff">Studio.</text>
      <rect x="40" y="70" width="60" height="4" rx="2" fill="#fff" opacity=".8"/>
      <rect x="150" y="62" width="48" height="14" rx="7" fill="#fff"/>
      <rect x="28" y="94" width="56" height="20" rx="3" fill="#eef0f6"/><rect x="92" y="94" width="56" height="20" rx="3" fill="#eef0f6"/><rect x="156" y="94" width="56" height="20" rx="3" fill="#eef0f6"/>`),

    wpPlugin: () => S(120, 120, `
      <rect width="120" height="120" fill="#0e4a7b"/>
      <path d="M34 40h18a8 8 0 1 1 16 0h18v18a8 8 0 1 0 0 16v18H68a8 8 0 1 1-16 0H34z" fill="#e8f1fb"/>
      <text x="60" y="73" text-anchor="middle" font-family="Menlo,monospace" font-size="18" font-weight="700" fill="#0e4a7b">{ }</text>`),

    woo: () => S(120, 120, `
      <rect width="120" height="120" fill="#7f54b3"/>
      ${[[14, 14], [62, 14], [14, 62], [62, 62]].map(([x, y], i) => `
        <rect x="${x}" y="${y}" width="44" height="44" rx="4" fill="#fff"/>
        <rect x="${x + 6}" y="${y + 6}" width="32" height="20" rx="2" fill="${["#f7c6a3", "#b9e4d0", "#c9d4ff", "#ffe08a"][i]}"/>
        <rect x="${x + 6}" y="${y + 30}" width="20" height="3" rx="1.5" fill="#333"/>
        <rect x="${x + 6}" y="${y + 36}" width="12" height="3" rx="1.5" fill="#7f54b3"/>`).join("")}`),

    shopTheme: () => S(120, 156, `
      <rect width="120" height="156" fill="#0d3b2e"/>
      <rect x="28" y="12" width="64" height="132" rx="12" fill="#111"/>
      <rect x="32" y="16" width="56" height="124" rx="9" fill="#f6f3ec"/>
      <rect x="52" y="20" width="16" height="4" rx="2" fill="#111"/>
      <rect x="36" y="30" width="48" height="52" rx="3" fill="#95bf47"/>
      <path d="M50 46h20l-2 24H52z" fill="#fff"/><path d="M55 46c0-6 10-6 10 0" stroke="#fff" stroke-width="2.5" fill="none"/>
      ${lines(36, 88, 3, 40, 8, "#1b1b1b", .8)}
      <rect x="36" y="118" width="48" height="12" rx="6" fill="#0d3b2e"/>`),

    shopApp: () => S(120, 120, `
      <rect width="120" height="120" fill="#95bf47"/>
      <rect x="14" y="16" width="92" height="88" rx="6" fill="#fff"/>
      <rect x="14" y="16" width="26" height="88" rx="6" fill="#1a1a1a"/><rect x="34" y="16" width="6" height="88" fill="#1a1a1a"/>
      ${[0, 1, 2].map(i => `<rect x="20" y="${26 + i * 12}" width="14" height="4" rx="2" fill="#666"/>`).join("")}
      ${[0, 1, 2, 3].map(i => `
        <rect x="48" y="${28 + i * 18}" width="30" height="4" rx="2" fill="#333"/>
        <rect x="84" y="${25 + i * 18}" width="16" height="10" rx="5" fill="${i % 3 === 1 ? "#ccc" : "#008060"}"/>
        <circle cx="${i % 3 === 1 ? 89 : 95}" cy="${30 + i * 18}" r="3.5" fill="#fff"/>`).join("")}`),

    liquid: () => S(120, 120, `
      <rect width="120" height="120" fill="#121212"/>
      <g font-family="Menlo,monospace" font-size="9.5" font-weight="600">
        <text x="12" y="30" fill="#c792ea">{% for</text><text x="58" y="30" fill="#fff">p in</text>
        <text x="12" y="44" fill="#82aaff">collection</text>
        <text x="20" y="62" fill="#ffcb6b">{{ p.title }}</text>
        <text x="20" y="78" fill="#c3e88d">{{ p.price }}</text>
        <text x="12" y="96" fill="#c792ea">{% endfor %}</text>
      </g>`),

    frontend: () => S(240, 120, `
      <rect width="240" height="120" fill="#ff5a36"/>
      <rect x="16" y="18" width="70" height="84" rx="8" fill="#fff"/>
      <circle cx="51" cy="44" r="14" fill="#ffd2c4"/>${lines(30, 66, 3, 42, 9, "#222", .8)}
      <rect x="96" y="18" width="128" height="38" rx="8" fill="#1d1d1f"/>
      <rect x="106" y="30" width="60" height="5" rx="2.5" fill="#fff"/><rect x="106" y="40" width="40" height="5" rx="2.5" fill="#fff" opacity=".5"/>
      <rect x="180" y="28" width="34" height="18" rx="9" fill="#ff5a36"/>
      <rect x="96" y="64" width="128" height="38" rx="8" fill="#fff" opacity=".95"/>
      <rect x="106" y="80" width="90" height="6" rx="3" fill="#eee"/><rect x="106" y="80" width="56" height="6" rx="3" fill="#ff5a36"/>
      <circle cx="162" cy="83" r="6" fill="#fff" stroke="#ff5a36" stroke-width="2"/>`),

    backend: () => S(120, 120, `
      <rect width="120" height="120" fill="#20232a"/>
      ${[0, 1, 2].map(i => `
        <ellipse cx="60" cy="${34 + i * 24}" rx="30" ry="9" fill="${["#61dafb", "#4fb3d9", "#3a8fb7"][i]}"/>
        <rect x="30" y="${34 + i * 24}" width="60" height="16" fill="${["#61dafb", "#4fb3d9", "#3a8fb7"][i]}"/>
        <ellipse cx="60" cy="${50 + i * 24}" rx="30" ry="9" fill="${["#3ea7cf", "#3593bd", "#2b7499"][i]}"/>
        <ellipse cx="60" cy="${34 + i * 24}" rx="30" ry="9" fill="${["#9be7ff", "#7fd3f2", "#61b6dd"][i]}"/>`).reverse().join("")}`),

    api: () => S(120, 120, `
      <rect width="120" height="120" fill="#f3efe6"/>
      <g font-family="Menlo,monospace" font-size="10" font-weight="700">
        <text x="14" y="30" fill="#222">{</text>
        <text x="24" y="48" fill="#b5446e">"status"</text><text x="76" y="48" fill="#222">:</text><text x="84" y="48" fill="#2a7f62">200</text>
        <text x="24" y="66" fill="#b5446e">"ok"</text><text x="52" y="66" fill="#222">:</text><text x="60" y="66" fill="#3b5bdb">true</text>
        <text x="24" y="84" fill="#b5446e">"data"</text><text x="64" y="84" fill="#222">: [ ]</text>
        <text x="14" y="102" fill="#222">}</text>
      </g>`),

    python: () => S(120, 120, `
      <rect width="120" height="120" fill="#2b5b84"/>
      <rect x="10" y="18" width="100" height="84" rx="6" fill="#0f1720"/>
      <circle cx="19" cy="26" r="2.5" fill="#ff5f57"/><circle cx="27" cy="26" r="2.5" fill="#febc2e"/><circle cx="35" cy="26" r="2.5" fill="#28c840"/>
      <g font-family="Menlo,monospace" font-size="9" font-weight="600">
        <text x="16" y="48" fill="#ffd43b">&gt;&gt;&gt;</text><text x="38" y="48" fill="#fff">import ai</text>
        <text x="16" y="64" fill="#ffd43b">&gt;&gt;&gt;</text><text x="38" y="64" fill="#9cdcfe">ai.run()</text>
        <text x="16" y="80" fill="#6a9955">'done'</text>
        <rect x="16" y="88" width="6" height="9" fill="#fff"/>
      </g>`),

    n8n: () => S(240, 120, `
      <rect width="240" height="120" fill="#1f1c2c"/>
      <g fill="none" stroke="#ea4b71" stroke-width="2.5" opacity=".9">
        <path d="M62 60 C 84 60, 84 34, 106 34"/><path d="M62 60 C 84 60, 84 86, 106 86"/>
        <path d="M144 34 C 164 34, 164 60, 180 60"/><path d="M144 86 C 164 86, 164 60, 180 60"/>
      </g>
      ${[[26, 44, "#ff6d5a", "⚡"], [106, 18, "#7c5cff", "AI"], [106, 70, "#26c2a2", "{ }"], [180, 44, "#ffb347", "✓"]].map(([x, y, c, t]) => `
        <rect x="${x}" y="${y}" width="${x === 106 ? 38 : 36}" height="32" rx="7" fill="#2d2a3e" stroke="${c}" stroke-width="2"/>
        <text x="${x + (x === 106 ? 19 : 18)}" y="${y + 21}" text-anchor="middle" font-family="Menlo,monospace" font-size="11" font-weight="700" fill="${c}">${t}</text>`).join("")}`),

    agents: () => S(120, 156, `
      <defs><linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6d5dfc"/><stop offset="1" stop-color="#b44cf0"/></linearGradient></defs>
      <rect width="120" height="156" fill="url(#g2)"/>
      <rect x="12" y="20" width="76" height="26" rx="13" fill="#fff"/>${lines(22, 28, 2, 50, 7, "#6d5dfc")}
      <rect x="34" y="56" width="74" height="26" rx="13" fill="#1d1b3a"/>${lines(44, 64, 2, 48, 7, "#fff", .85)}
      <rect x="12" y="92" width="64" height="26" rx="13" fill="#fff"/>
      <circle cx="30" cy="105" r="3" fill="#6d5dfc"/><circle cx="42" cy="105" r="3" fill="#6d5dfc" opacity=".6"/><circle cx="54" cy="105" r="3" fill="#6d5dfc" opacity=".3"/>
      <text x="60" y="142" text-anchor="middle" font-family="-apple-system,Helvetica,sans-serif" font-size="11" font-weight="800" fill="#fff" letter-spacing="2">AGENT</text>`),

    video: () => S(240, 120, `
      <defs><linearGradient id="g3" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0f2027"/><stop offset=".5" stop-color="#203a43"/><stop offset="1" stop-color="#e0703a"/></linearGradient></defs>
      <rect width="240" height="120" fill="#0a0a0a"/>
      ${Array.from({ length: 12 }, (_, i) => `<rect x="${6 + i * 20}" y="5" width="10" height="7" rx="1.5" fill="#fff" opacity=".8"/><rect x="${6 + i * 20}" y="108" width="10" height="7" rx="1.5" fill="#fff" opacity=".8"/>`).join("")}
      <rect x="0" y="18" width="240" height="84" fill="url(#g3)"/>
      <circle cx="176" cy="46" r="16" fill="#ffb36b" opacity=".9"/>
      <path d="M0 102 L60 66 L104 86 L150 58 L240 102Z" fill="#081218" opacity=".85"/>
      <circle cx="120" cy="60" r="18" fill="#fff" opacity=".9"/><path d="M114 50 L130 60 L114 70Z" fill="#111"/>
      <text x="12" y="34" font-family="Menlo,monospace" font-size="9" fill="#fff" opacity=".8">● REC  AI</text>`),

    flow: () => S(120, 120, `
      <rect width="120" height="120" fill="#0c0c0f"/>
      <rect x="12" y="14" width="96" height="48" rx="4" fill="#2c3e8f"/>
      <circle cx="40" cy="38" r="12" fill="#f9d976"/><path d="M12 62 L44 44 L70 56 L108 36 V62Z" fill="#1b2559"/>
      ${[["#4f8cff", 12, 44], ["#ff6b9a", 58, 30], ["#3ddc97", 30, 50], ["#f9d976", 82, 26]].map(([c, x, w], i) => `<rect x="${x}" y="${72 + (i % 2) * 12}" width="${w}" height="8" rx="2" fill="${c}"/>`).join("")}
      <rect x="64" y="68" width="2" height="36" fill="#fff"/><path d="M61 66h8l-4 5z" fill="#fff"/>`),

    mcp: () => S(120, 120, `
      <rect width="120" height="120" fill="#ece6da"/>
      <g stroke="#1d1d1f" stroke-width="2">${[[24, 24], [96, 24], [24, 96], [96, 96], [60, 14], [60, 106]].map(([x, y]) => `<line x1="60" y1="60" x2="${x}" y2="${y}"/>`).join("")}</g>
      ${[[24, 24, "#e76f51"], [96, 24, "#2a9d8f"], [24, 96, "#264653"], [96, 96, "#e9c46a"], [60, 14, "#8e7dbe"], [60, 106, "#f4a261"]].map(([x, y, c]) => `<rect x="${x - 9}" y="${y - 9}" width="18" height="18" rx="4" fill="${c}"/>`).join("")}
      <circle cx="60" cy="60" r="20" fill="#1d1d1f"/>
      <text x="60" y="64" text-anchor="middle" font-family="Menlo,monospace" font-size="11" font-weight="800" fill="#fff">MCP</text>`),

    fullstack: () => S(120, 120, `
      <rect width="120" height="120" fill="#f7d046"/>
      <path d="M60 22 L102 42 L60 62 L18 42Z" fill="#1d1d1f"/>
      <path d="M18 56 L60 76 L102 56" fill="none" stroke="#1d1d1f" stroke-width="7" stroke-linejoin="round"/>
      <path d="M18 74 L60 94 L102 74" fill="none" stroke="#1d1d1f" stroke-width="7" stroke-linejoin="round" opacity=".55"/>`),

    folder: () => S(120, 96, `
      <defs><linearGradient id="fdc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7cc8ff"/><stop offset="1" stop-color="#2f8ff0"/></linearGradient></defs>
      <path d="M4 14a6 6 0 0 1 6-6h30l8 8h62a6 6 0 0 1 6 6v64a6 6 0 0 1-6 6H10a6 6 0 0 1-6-6Z" fill="#1f78d6"/>
      <path d="M4 26a6 6 0 0 1 6-6h100a6 6 0 0 1 6 6v60a6 6 0 0 1-6 6H10a6 6 0 0 1-6-6Z" fill="url(#fdc)"/>
      <rect x="22" y="44" width="76" height="6" rx="3" fill="#fff" opacity=".85"/><rect x="22" y="58" width="52" height="6" rx="3" fill="#fff" opacity=".7"/>`),

    year: () => S(120, 156, `
      <rect width="120" height="156" fill="#fff"/>
      <rect width="120" height="38" fill="#ff3b30"/>
      <text x="60" y="26" text-anchor="middle" font-family="-apple-system,Helvetica,sans-serif" font-size="14" font-weight="700" fill="#fff" letter-spacing="1">EXPERIENCE</text>
      <text x="60" y="106" text-anchor="middle" font-family="-apple-system,Helvetica,sans-serif" font-size="58" font-weight="300" fill="#1d1d1f">1+</text>
      <text x="60" y="136" text-anchor="middle" font-family="-apple-system,Helvetica,sans-serif" font-size="13" font-weight="600" fill="#8e8e93" letter-spacing="2">YEAR</text>`),
  };

  // Render a cover as an <svg> (or <img> for the photo cover).
  window.renderCover = (key, cls = "") => {
    if (key === "photo") return `<img class="${cls}" src="me-900.webp" alt="Emon Ahammed" draggable="false" style="aspect-ratio:4/5;object-fit:cover;object-position:50% 18%">`;
    const c = window.COVERS[key]();
    return `<svg class="${cls}" viewBox="0 0 ${c.w} ${c.h}" style="aspect-ratio:${c.w}/${c.h}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${c.body}</svg>`;
  };
})();
