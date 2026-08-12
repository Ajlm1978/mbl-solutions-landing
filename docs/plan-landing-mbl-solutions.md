# Plan de Construcción — Landing Page MBL Solutions Group LLC

**Fecha:** 2026-08-12 · **Estado:** Plan aprobado pendiente de prompt de referencia del usuario

---

## 1. Decisiones fijadas (no reabrir sin razón)

| Decisión | Valor | Por qué |
|---|---|---|
| Idioma | **Inglés** | El decisor (practice manager / médico en EE.UU.) compra en inglés |
| Leads | **Supabase + notificación email** | Registro persistente de cada lead desde día 1; sin PHI en el form |
| Logo/dominio | **Nada aún** → wordmark tipográfico provisional + deploy en subdominio Vercel | No bloquea el build; dominio se conecta después (skill web-launch-seo) |
| Entorno | **Carpeta local + GitHub + Vercel** | Control total; arnés desde día 1 |
| Stack | React + Vite + Tailwind CSS + motion (v12) + react-router-dom | Scaffold `/new-website`; router solo para páginas legales |

## 2. Arquitectura

- **SPA de una página** (`/`) con anchor scroll entre secciones + 3 rutas legales: `/privacy`, `/terms`, `/hipaa-notice`.
- **Formulario de leads:** tabla `leads` en Supabase (insert-only vía anon key con RLS; sin lectura pública) + Edge Function que dispara email de notificación (Resend). Honeypot + validación client/server. **Cero PHI**: solo nombre, clínica, especialidad, email, teléfono.
- **Deploy:** Vercel con `vercel.json` (rewrite SPA). SSL automático → requisito de seguridad del brief cubierto.

## 3. Fases de ejecución (WIP=1, cada fase con Definition of Done)

### Fase 0 — Scaffold + Arnés
Conectar carpeta local → `/new-website mbl-solutions landing` → instalar arnés (CLAUDE.md router, `init.sh` con verificación `npm run build`, `claude-progress.md`, `feature_list.json` con las fases como features, `DECISIONS.md`) → repo GitHub → primer deploy vacío a Vercel.
**DoD:** `npm run build` verde + preview local funcionando + repo pusheado.

### Fase 1 — Sistema de diseño
`ui-ux-pro-max --design-system "landing page medical billing RCM B2B trust corporate"` + metodología refero-design. Paleta base del brief: azul marino (primario), verde azulado/teal (acento CTA), blanco, gris plata. Tipografía sobria B2B (ej. Inter/serif para headings — lo define el design system, no yo de memoria). Tokens en `tailwind.config.js`. Wordmark tipográfico "MBL Solutions Group". Anti-AI-slop check: nada de emojis como íconos → set SVG consistente (lucide).
**DoD:** tokens definidos y persistidos en `docs/kb/ARCHITECTURE.md`.

### Fase 2 — Copy en inglés
Adaptar (no traducir literal) las 7 secciones del brief al inglés B2B. H1: "Maximize Your Practice Revenue with Expert Medical Billing & Denial Management." Mensaje central: "You focus on patient care — we make sure your practice collects every dollar it's owed." Terminología correcta del nicho: clean claims, A/R days, CPT/ICD-10, UB-04/CMS-1500, payer mix.
**DoD:** copy completo por sección, revisado contra el brief.

### Fase 3 — Build de secciones (orden del brief)
1. **Hero:** headline + subhead + CTA dual ("Get a Free Billing Audit" / "Talk to an Expert") + fondo con gradiente navy/teal (sin stock photos genéricas de baja calidad).
2. **Problema:** agitación del dolor — hasta 30% de ingresos perdidos, denials, códigos cambiantes.
3. **Servicios:** 4 cards (Medical Billing, Denial Management, RCM, A/R Recovery) con íconos SVG.
4. **Por qué MBL:** 4 beneficios (ingresos, compliance HIPAA, transparencia, equipo especializado).
5. **Prueba social:** stats + testimonios — ver riesgo #1 abajo.
6. **Lead form:** 5 campos del brief + botón "Schedule My Free Consultation".
7. **Footer:** wordmark, contacto, enlaces legales.

**Animaciones (skill motion-animations, recetas del repo):** reveal on scroll (`whileInView`) por sección, stagger 40ms en cards de servicios, contadores animados en stats, microinteracciones hover/tap en CTAs (150–300ms), solo `transform`/`opacity`, `<MotionConfig reducedMotion="user">` global.
**DoD por sección:** responsive 375/768/1280 + contraste AA + reduced-motion verificado.

### Fase 4 — Backend de leads
Proyecto Supabase → tabla `leads` + RLS insert-only → Edge Function de notificación email → integración del form con estados (loading/success/error) → prueba end-to-end real con un lead de prueba.
**DoD:** lead de prueba llega a la tabla Y al email.

### Fase 5 — Legal
Páginas Privacy Policy, Terms, HIPAA Compliance Notice con **plantillas marcadas como borrador para revisión legal** — no invento lenguaje legal vinculante.
**DoD:** rutas funcionando, contenido marcado "draft — pending legal review".

### Fase 6 — SEO + Performance
Meta tags + OG + JSON-LD (`ProfessionalService`), `robots.txt`, `sitemap.xml`, imágenes WebP con dimensiones declaradas (cero CLS), lazy loading. Objetivo Lighthouse: ≥90 en Performance/SEO/Accessibility móvil.
**DoD:** Lighthouse corrido y registrado en `claude-progress.md`.

### Fase 7 — QA + Deploy
Auditoría Golden Rules (build verde, cero datos inventados sin marcar, dependencias verificadas) → `vercel deploy --prod` → smoke test en producción.
**DoD:** URL pública funcionando, form probado en producción.

### Fase 8 — Post-launch (cuando compres dominio)
Skill web-launch-seo: DNS, Google Search Console, sitemap submit, indexación manual. Opcional: analytics (Vercel Analytics o Plausible — sin cookies invasivas, mejor para un sitio health-adjacent).

## 4. Riesgos — dilo como es

1. **Testimonios y estadísticas del brief son ejemplos inventados.** "98% clean claims", "40% A/R reduction" y citas de clientes ficticios en un sitio de salud/finanzas = riesgo legal real (FTC). Opciones: (a) me das números y testimonios reales verificables, (b) reformulo como objetivos del servicio ("we target 95%+ clean claim rates") sin atribuirlos a resultados de clientes. **Necesito tu decisión antes de la Fase 3.5.**
2. **Datos de contacto:** no invento teléfono/email/dirección. Los necesito reales o el footer sale sin ellos hasta que los tengas.
3. **HIPAA:** la landing NO maneja PHI (solo datos de contacto del prospecto), así que el form es legítimo. Pero el claim "100% HIPAA compliant" en el copy debe referirse a tus operaciones de billing, no al sitio — lo redacto con esa precisión.

## 5. Qué necesito de ti para arrancar

1. **Tu prompt de referencia** (dijiste que lo mandas después del plan).
2. **Conectar una carpeta local** en esta sesión (o la próxima) para el scaffold.
3. Decisión sobre riesgo #1 (stats/testimonios) — puede esperar a Fase 3.
4. Datos de contacto reales — puede esperar a Fase 7.
