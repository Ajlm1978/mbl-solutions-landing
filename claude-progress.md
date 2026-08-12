# Progreso — MBL Solutions Landing

## Estado Verificado Actual
- Proyecto: scaffold Vite+React+TS+Tailwind creado (Sesión 0). Build: PENDIENTE de primera verificación.
- Imágenes: **F6 COMPLETADA** — fotografía IA B2B (oficina RCM, account manager, claims, dashboards) provista por el usuario, texto horneado eliminado por inpainting (OpenCV, 3 pasadas con QA visual), WebP optimizado (78–196 KB c/u). Commit `8ffd059`.
- Backend leads: NO implementado (v1 = submit simulado). Supabase = Fase 4 del plan.
- Deploy: NO realizado.

## Sesión 0 — 2026-08-12
- Plan maestro aprobado (`docs/plan-landing-mbl-solutions.md`), decisiones del usuario: inglés, Supabase+email, sin logo/dominio aún, carpeta local+GitHub+Vercel.
- Prompt de referencia dental recibido → adaptado a MBL en `docs/spec-mbl-landing-v1.md`. Decisiones: adaptar (no literal), monocromo+teal, imágenes IA.
- Scaffold + arnés instalados. App.tsx implementado según spec (splash, navbar+menú móvil, 4 secciones, form v1 con honeypot).
- Imágenes placeholder programáticas (gradientes WebP) en `public/img/` — F6 las reemplaza por IA aprobadas.
- **Evidencia de verificación (2026-08-12):** `npm install` (137 pkgs) + `npm run build` VERDE — tsc --noEmit sin errores, vite build OK (JS 162.7 kB / gzip 51.3 kB, CSS 20.4 kB). Ejecutado en copia limpia del repo (sandbox Linux). Commit inicial: `eb87f68`.
- Nota entorno: en la máquina Windows del usuario hay que correr `npm install` local antes de `npm run dev` (node_modules no se versiona ni se comparte entre SOs).
- Pendiente de verificación visual: preview manual 375/768/1280, contraste del link "Free Billing Audit" sobre imagen final, reduced-motion.

## Sesión 1 — 2026-08-12 (continuación)
- Repo GitHub creado por el usuario y push realizado: `github.com/Ajlm1978/mbl-solutions-landing` (branch main, remote sin credenciales).
- Deploy directo vía conector Vercel falló (403: el conector no puede crear proyectos). Ruta elegida: importar el repo desde vercel.com/new → auto-deploy en cada push.
- SEGURIDAD: el PAT usado se compartió por chat → debe ser REVOCADO por el usuario.

## Pendientes que NO se inventan (bloqueados por el usuario)
- Datos de contacto reales del footer.
- Decisión sobre stats/testimonios (riesgo FTC — ver plan §4.1).
- Dominio + cuenta Vercel/GitHub para deploy.
