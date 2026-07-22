---
name: run-portfolio
description: Serve and visually verify the Meu-Portif-lio static site (plain HTML/CSS/JS, no build step, GitHub Pages) on this Windows machine, where python3 and chromium-cli are not available.
---

# Running this project

This repo is a **single-page static site** — `index.html` + `styles/main.css` +
`js/main.js`. No build step, no package.json. It's deployed straight to
GitHub Pages from the `main` branch at
`https://gustavopessoa85.github.io/Meu-Portif-lio/`.

All asset paths in `index.html`/`main.css` are **relative, no leading slash**
(e.g. `styles/main.css`, `imagens-Projetos/foo.png`). This is deliberate —
it lets the site work both opened directly as `file://` and hosted at the
GitHub Pages project subpath. Don't reintroduce root-relative
(`/Meu-Portif-lio/...`) paths.

## Serving locally

This machine has **no `python3`/`python`** on PATH usable for
`http.server` (the `python3`/`python` shims just open the Microsoft Store).
Use Node instead — it's always available here. Write a tiny static server
(no dependency needed):

```bash
cd ~/source/repos/Meu-Portif-lio
cat > .tmp-server.js <<'EOF'
const http = require('http');
const fs = require('fs');
const path = require('path');
const types = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript',
  '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png'
};
http.createServer((req, res) => {
  let filePath = path.join(__dirname, decodeURIComponent(req.url.split('?')[0]));
  if (filePath.endsWith('/')) filePath = path.join(filePath, 'index.html');
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found: ' + filePath); return; }
    res.writeHead(200, { 'Content-Type': types[path.extname(filePath)] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(8123, () => console.log('listening on 8123'));
EOF
node .tmp-server.js &
sleep 1
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8123/index.html   # expect 200
```

Stop it by finding the PID bound to the port (background `&` + `kill %1`
doesn't reliably work in this environment) and stopping it via PowerShell:

```bash
PID=$(powershell -Command "Get-NetTCPConnection -LocalPort 8123 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess" 2>/dev/null)
[ -n "$PID" ] && powershell -Command "Stop-Process -Id $PID -Force"
```

Delete `.tmp-server.js` when done (it's a scratch file, not committed).

## Driving it / screenshots

**`chromium-cli` is NOT installed on this machine** — don't assume it's
there. Instead, `npx playwright` works but needs a local `node_modules` to
`require('playwright')` from (global `npx` install doesn't expose it to a
plain `require`). Set it up in a **scratch dir outside the repo** so no
`node_modules`/lockfile ever lands in git history:

```bash
mkdir -p /tmp/pw-scratch/shots && cd /tmp/pw-scratch
npm init -y >/dev/null 2>&1
npm install playwright
npx playwright install chromium   # only needed once per machine; browser binary is cached globally afterward
```

Then a small script (adjust the URL/selectors per what you're checking):

```js
// /tmp/pw-scratch/screenshot.js
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  page.on('requestfailed', r => errors.push('REQUESTFAILED: ' + r.url()));

  await page.goto('http://localhost:8123/index.html', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'shots/01-hero.png' });
  // ...scrollIntoView / click / more screenshots as needed...

  await browser.close();
  console.log('CONSOLE_ERRORS:', errors.length ? JSON.stringify(errors) : 'none');
})();
```

Run with `node screenshot.js`. **Gotcha:** don't chain two
`scrollIntoViewIfNeeded()` calls back-to-back with a click in between and
expect the nav's scroll-spy (IntersectionObserver in `js/main.js`) to have
settled instantly — the smooth-scroll animations can overlap and leave a
transient double-active nav link in a screenshot taken too early. If
checking active-link state specifically, query
`page.$$eval('.nav-link.active', els => els.map(e => e.textContent))`
after a single settled scroll, not mid-choreography.

To view a screenshot: convert the `/tmp/...` path to a Windows path first
(the Read tool needs a Windows path, and `/tmp` here is not the same tree
Node/PowerShell see):

```bash
cygpath -w /tmp/pw-scratch/shots/01-hero.png
```
Then `Read` that Windows path.

Clean up `/tmp/pw-scratch` when done — it's scratch tooling, not part of
the site.

## Known-good asset checklist

After any edit, sanity-check these all resolve (200) before considering a
change verified:

```bash
for p in index.html styles/main.css js/main.js favicon.svg; do
  curl -s -o /dev/null -w "$p: %{http_code}\n" "http://localhost:8123/$p"
done
```

## Content facts (avoid re-deriving / re-asking)

- GitHub user: `GustavoPessoa85`. Portfolio repo: `Meu-Portif-lio`.
- Content is sourced from his actual résumé (`Currículo - Gustavo Pessoa
  Oliveira da Silva.pdf`, lives in his Downloads folder — copy it to a
  scratch path with PowerShell `Copy-Item -LiteralPath` if you need to
  re-read it, since the `í` in the filename breaks plain bash `cp`/`cat`).
  Treat the résumé as the source of truth over anything inferred earlier
  in a conversation.
- Employer is **Prolins Software House** (not "Prolins IT Solutions" —
  that was a past mistake, already corrected on the site). Role since
  08/2024: **Desenvolvedor Back-end**, acting as responsável técnico
  (architecture, data modeling, requirements, stakeholder comms) — not a
  "júnior" and not primarily "estudante". No seniority labels
  (júnior/pleno/sênior) in any copy.
- Primary specialization is now **C# / .NET 8** (ASP.NET Core, Entity
  Framework, Dapper) for corporate systems at Prolins — a financial
  system, a gas cylinder exchange/logistics system, and an event-transport
  system are the three flagship projects (all proprietary/internal, no
  public demo or repo — presented in the "Experiência" section as
  `sistema interno` cards, not linked). PHP (7.4/8.1/8.3, CodeIgniter,
  Laravel) is solid complementary experience for legacy-system maintenance
  (vet clinic, plastic surgery clinic, recruitment system, glucose
  monitoring w/ AI alerts) — don't frame him as "a PHP dev," he's a
  back-end dev who works across PHP and .NET.
- Also has real DevOps/cloud breadth from the résumé: Docker, CI/CD, Git
  Flow, Linux server management, Apache/Nginx, SQL Server (in addition to
  MariaDB/MySQL), and AWS (EC2, ECS, RDS, S3, CloudWatch) as "estudos
  aplicados" (applied study, not production claim — keep that qualifier).
  Location: Fortaleza, CE. ADS at Cruzeiro do Sul Virtual, conclusão
  prevista **2027** (not "último semestre" — that was also a past
  mistake).
- No profile photo currently (removed by request; original selfie wasn't
  considered professional enough). The "Sobre" section is text/badges
  only. If a better photo is provided later, re-add an image block —
  don't assume there should be a placeholder.
- Site nav/sections as of the résumé-driven content pass: Início, Sobre,
  **Experiência** (new — one entry per employer, with sub-cards per
  flagship system), Skills (9 category cards mirroring the résumé's own
  competência groupings), Projetos (personal/open-source only, keeps its
  demo+código links), Contato.
- Live project demos are only linked for repos confirmed to actually serve
  on GitHub Pages (checked via `curl -o /dev/null -w "%{http_code}"
  https://gustavopessoa85.github.io/<repo>/`) — `Jogo-da-velha` for example
  exists but has no Pages deploy, so it's intentionally not linked.
