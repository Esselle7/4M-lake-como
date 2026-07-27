# CLAUDE.md — 4M (marketing/booking · Archetipo 2)

Applica @~/.claude/ENGINEERING-CHARTER.md (gli assiomi vincolano ogni decisione).

Stack: Next 15 (app router) + React 19 + Tailwind · API routes solo per email/quote (Resend) · Cloudflare. Test nativo (`node --test`).

## Gate di decomposizione (§5.0)
Default = **una sola sessione**. Qui il lavoro è quasi sempre 1–3 file (sezione/componente/route): **niente scatter**. Scomponi solo se tocchi aree davvero indipendenti (es. API booking ∥ pagina marketing) e sai scrivere il context pack chirurgico. Un "no" ai 3 gate → in linea.

## Gate di ottimizzazione (§9.0)
Prima di ottimizzare: (1) volume & frequenza noti; (2) profilato. Qui il budget vero è **INP < 200ms / LCP < 2.5s** (Core Web Vitals), non Big-O: spezza i long task, `next/image`, font preload. Misura con Lighthouse/CrUX prima di toccare. Astro/zero-JS dove non serve interattività (YAGNI).

## Astrazioni di Corsia B (§2.1)
Sito marketing: quasi sempre codice lineare. Ogni astrazione (state manager, layer, pattern) richiede **1 riga di ADR**, persistita in `docs/adr/NNN-titolo.md` (≤10 righe). Niente ADR = lineare. Feature non banale (es. flusso booking) → SPEC in `docs/specs/` (template `~/.claude/SPEC-TEMPLATE.md`).

## Confini di attivazione skill (§2.3)
- UI: direzione estetica/craft/anti-slop → `impeccable`; dati palette/font/chart → `ui-ux-pro-max`. Non attivarle insieme.
- Sito/hero 3D premium (solo se esplicito "3D/WebGL/landing wow") → `premium-3d-site`; UI standard → `impeccable`.
- Cleanup (dead export, bundle, lib pesanti sostituibili con API native `Intl`/`Date`) → `lazy-refactor`. Over-engineering generico → `ponytail-review`/`-audit`.
- SEO/content → suite `seo-*`. SAST → `secure-by-design`. Carico → `k6`.
