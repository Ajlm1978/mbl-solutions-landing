# SPEC DE BUILD — MBL Solutions Group Landing v1
**Base:** prompt de referencia dental (fidelidad técnica 100%) · **Contenido:** brief MBL · **Paleta:** monocromo + acento teal · **Fecha:** 2026-08-12

---

## 0. Reglas de adaptación

- La **técnica no se toca**: masked cards (`useMaskPositions`, `useImageWidth`, `MaskedCard`, `useIsMobile`), `useStaggeredReveal`, splash counter, navbar y toda la especificación CSS/estructural del reference se implementan **exactamente igual**. Solo cambian: textos, imágenes, título, logo y el acento de color.
- **Acento teal (Tailwind `teal-600`/`teal-700`, sin extender config):** SOLO en (a) botones CTA principales (`bg-teal-600 text-white hover:bg-teal-700` en vez de `bg-white`/`bg-black`), (b) texto "Free Billing Audit" del hero (reemplaza el "Free Consultation" blanco), (c) badge numérico del servicio activo (`border-teal-600 text-teal-600`). Todo lo demás queda negro/blanco/glass como el reference. Regla: si dudas, monocromo.
- Stack: **React + Vite + TypeScript + Tailwind, cero librerías externas**, todo en `App.tsx` (igual al reference). El plan original contemplaba `motion`; se descarta en v1 — el reference ya define las animaciones con hooks vanilla y funciona.

## 1. Setup

- **Fuente:** Open Sauce One, mismos `<link>` exactos del reference.
- **Title:** `MBL Solutions Group — Medical Billing & Revenue Cycle Management`
- **index.css y tailwind config:** idénticos al reference.

## 2. Imágenes (generadas con IA — pendiente de generación y aprobación)

4 imágenes a generar antes del build de secciones. Requisitos técnicos para que la técnica masked-cards funcione:
- `HERO_IMAGE` y `SECTION2_IMAGE`: **wide (≥2048px ancho, ratio ~16:9)**, high-key (fondo claro, tonos neutros/piedra) con zonas limpias arriba-izquierda y abajo-izquierda para texto negro, y zona derecha con más densidad visual (ahí cae el `focalX` 0.7–0.8). Tema: consultorio/oficina médica moderna, luz natural, profesional revisando métricas — SIN rostros reconocibles en primer plano, SIN documentos legibles (nada que parezca PHI).
- `SECTION3_IMG1`, `SECTION3_IMG2`: cuadradas/verticales, detalle de manos con tablet/gráficos de ingresos, estetoscopio sobre escritorio.
- `SECTION3_BG`: vertical/alta, profesional sonriente de espaldas o perfil difuminado, zonas oscuras abajo para las overlay cards.
- Guardar en `/public/img/` como WebP; declarar dimensiones. (URLs del reference NO se usan — son de dental.)

## 3. Constantes de datos

```ts
const featureBars = ['Revenue Cycle Management', 'Denial Management', 'A/R Recovery'];
const services = [
  { name: 'Medical\nBilling', num: '01', active: true },
  { name: 'Denial\nAppeals', num: '02', active: false },
  { name: 'RCM\nOversight', num: '03', active: false },
  { name: 'A/R\nRecovery', num: null, active: false },
];
const navLinks = ['Home', 'Services', 'Why MBL', 'Process', 'Contact'];
```

## 4. Splash

Idéntico al reference (0→100 en 2000ms, bottom-left, negro sobre blanco). El 0→100 conecta con el mensaje "collect every dollar" — se queda tal cual.

## 5. Navbar

- **Logo:** dos líneas "MBL" / "Solutions" (mismas clases). Sub-línea: `medical billing & rcm`.
- **Desktop:** botón "Menu" (igual) + texto derecho "Free Billing Audit" (reemplaza "Dental Emergency").
- **Mobile menu:** links de `navLinks`; bottom section: texto "Free Billing Audit" + botón full-width **teal** "Schedule Free Consultation".

## 6. Sección 1 — HERO (masked cards sobre HERO_IMAGE)

- **3 feature bars:** textos de `featureBars`, mismas clases.
- **Main card:**
  - Top-left: `"We make sure your practice collects"` `<br/>` `"every dollar it has earned"`
  - Bottom-left label: `"Trusted Medical Billing Partner"`
  - H1 (clamp 3rem–11rem, leading 0.79): `"Billing"` `<br/>` `"Experts"`
  - Bottom-right: `"Free Billing Audit"` en **`text-teal-400` o blanco según legibilidad sobre la imagen final** (verificar contraste en preview).

## 7. Sección 2 — SERVICES (masked cards sobre SECTION2_IMAGE)

- **Card 0:** heading `"Our Services"` · subtitle `"End-to-end revenue cycle support"`
- **Card 1 (tall):** texto `"Tired of denied claims and delayed payments?"` `<br/>` `"We investigate, correct, and appeal — relentlessly."` · botón **teal** `"Get My Audit"` (mismas clases de tamaño/posición, `bg-teal-600 text-white`).
- **Card 2:** heading grande `"Denial"` `<br/>` `"Management"`
- **Card 3 (services strip):** 4 sub-cards de `services`; badge activo `border-teal-600 text-teal-600`, resto igual al reference.

## 8. Sección 3 — WHY MBL + CONSULTATION (sin masked cards, igual al reference)

- **Heading card:** H2 `"Why"` `<br/>` `"MBL"` · subtitle `"Compliance. Transparency. Results."`
- **Dos image cards:** SECTION3_IMG1/2, alt: "Revenue analytics review", "Medical practice operations".
- **Consultation card (bg-zinc-200):** label `"Consultation"` · heading `"Free"` `<br/>` `"Billing"` `<br/>` `"Audit"` · botón **teal** `"Book Online"` → scroll a `#contact`.
- **Columna derecha (SECTION3_BG + overlays):**
  - Overlay 1 (blanca): `"How We"` `<br/>` `"Recover Your"` `<br/>` `"Revenue"` + flecha (mismo SVG).
  - Overlay 2 (glass): `"HIPAA-"` `<br/>` `"Compliant"` `<br/>` `"Operations"` + flecha blanca.

## 9. Sección 4 — CONTACT / LEAD FORM (nueva, no está en el reference)

Extiende el mismo lenguaje visual (NO rompe la estética):
- `<section id="contact">`: `min-h-[70vh] w-full flex flex-col px-3 md:px-5 pt-1.5 md:pt-2 pb-3 gap-1.5 md:gap-2`, con `useStaggeredReveal` propio.
- Card única `bg-stone-50 rounded-xl md:rounded-2xl p-6 md:p-10`, grid 2 cols en desktop:
  - Izquierda: H2 clamp bold `"Stop leaving"` `<br/>` `"money on"` `<br/>` `"the table"` + párrafo corto ("Get a free consultation and find out how much revenue we can recover for your practice.").
  - Derecha: form con 5 campos (Full Name, Practice Name, Medical Specialty, Email, Phone) — inputs `bg-white rounded-xl border border-neutral-200 px-4 py-3 text-sm focus:outline-none focus:border-teal-600`, labels `text-xs font-semibold`. Honeypot oculto. Botón submit full-width **teal** pill `"Schedule My Free Consultation"`. Estados loading/success/error.
- **v1:** el submit hace `console.log` + estado success (backend Supabase = Fase 4 del plan maestro; no bloquear el build visual).
- **Footer** dentro de la misma sección, debajo de la card: wordmark MBL + `"© 2026 MBL Solutions Group LLC"` + links `Privacy · Terms · HIPAA Notice` (rutas placeholder `#` en v1; páginas reales = Fase 5 del plan). **Sin teléfono/email inventados** — se agregan cuando el usuario los provea.

## 10. Design rules (heredadas + ajustes)

Todas las del reference (spacing seamless, rounded-xl/2xl, tipografía bold clamp con leading apretado, hover:scale-105, breakpoint único `md:`) MÁS:
- Acento teal solo donde lo define la sección 0 de este spec.
- CTAs "Get My Audit" / "Book Online" / botón del form hacen smooth-scroll a `#contact`.
- `prefers-reduced-motion`: los hooks de reveal y el splash respetan `matchMedia('(prefers-reduced-motion: reduce)')` → sin translate/delays (mejora sobre el reference, costo cero).

## 11. Orden de build (WIP=1)

1. Scaffold `/new-website` + arnés (Fase 0 del plan maestro) — requiere carpeta conectada.
2. Generar y aprobar las 5 imágenes.
3. `App.tsx`: hooks + splash + navbar → verificar en preview.
4. Sección 1 → 2 → 3 → 4 (cada una: responsive 375/768/1280 + contraste + reduced-motion antes de seguir).
5. Build verde + deploy Vercel subdominio.

## 12. Pendientes que NO se inventan
- Datos de contacto reales (footer).
- Backend Supabase del form (Fase 4 plan maestro).
- Páginas legales reales (Fase 5).
- Dominio + SEO/Search Console (Fase 8, skill web-launch-seo).
