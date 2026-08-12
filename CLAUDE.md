# MBL Solutions Group — Landing Page

Landing de generación de leads para MBL Solutions Group LLC (medical billing, denial management, RCM).
Idioma del sitio: **inglés**. Público: médicos independientes, clínicas, ASCs en EE.UU.

## Stack (real, verificado)
React 18 + Vite 6 + TypeScript + Tailwind CSS 3.4. **Cero librerías externas de UI/animación** —
las animaciones son hooks vanilla (IntersectionObserver + ResizeObserver). Todo el UI vive en `src/App.tsx`.

## Quick Start
- Instalar + verificar: `./init.sh` (o `npm install && npm run build`)
- Dev server: `npm run dev` (puerto 5173)
- Verificación base: `npm run build` (tsc --noEmit + vite build) — **debe estar verde antes de declarar cualquier cosa "listo"**

## Documentos fuente (leer antes de tocar UI)
- `docs/spec-mbl-landing-v1.md` — spec de build v1 (estructura, copy, paleta, reglas). ES LA VERDAD del diseño.
- `docs/plan-landing-mbl-solutions.md` — plan maestro por fases (Supabase, legal, SEO, deploy).
- `claude-progress.md` — estado verificado actual. `feature_list.json` — features y su verificación.

## Restricciones duras
1. Paleta: negro/blanco/glass + acento `teal-600` SOLO en CTAs, "Free Billing Audit" y badge activo. Si dudas, monocromo.
2. No agregar dependencias sin registrarlo en DECISIONS.md. v1 = cero deps de UI.
3. Técnica masked-cards y clases del reference NO se modifican sin decisión registrada.
4. **No inventar datos**: nada de teléfonos, emails, direcciones, estadísticas de clientes ni testimonios. Placeholders marcados o nada.
5. Nada de PHI en el formulario (solo datos de contacto del prospecto). El claim HIPAA refiere a operaciones de billing, no al sitio.
6. Emojis como íconos: prohibido. SVG inline.
7. Breakpoint único `md:` (768px). Responsive verificado a 375/768/1280 antes de cerrar una sección.
8. `prefers-reduced-motion` respetado en splash y reveals.
9. WIP=1: una feature de `feature_list.json` a la vez, con su Definition of Done.
10. Imágenes: WebP en `public/img/`, light/high-key para que el texto negro lea (ver spec §2).

## Rituales
- **Arranque:** leer `claude-progress.md` + `feature_list.json`, correr `npm run build` para confirmar base verde.
- **Cierre:** actualizar `claude-progress.md` (evidencia real, no "se ve bien") y `DECISIONS.md` si hubo decisiones.
