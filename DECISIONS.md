# Decisiones — MBL Solutions Landing

## 2026-08-12 — Sesión 0
1. **Arnés instalado** en greenfield (no hubo repo previo que auditar). Verificación base: `npm run build` (tsc --noEmit + vite build).
2. **Idioma inglés** — decisión del usuario; el decisor de compra en EE.UU. opera en inglés.
3. **Diseño = adaptación del reference dental** (masked cards, splash, seamless sections). Fidelidad técnica 100%; solo cambian contenido/paleta/imágenes. Spec: `docs/spec-mbl-landing-v1.md`.
4. **Paleta monocromo + acento teal-600** (usuario). Alcance del teal restringido (CLAUDE.md restricción 1).
5. **Se descarta `motion` en v1** — el reference define animaciones con hooks vanilla; menos deps, mismo resultado. Reabrir solo si una animación lo justifica.
6. **Imágenes: placeholders programáticos ahora, IA después** — la técnica masked-cards necesita URLs reales para verificarse; las definitivas requieren aprobación visual del usuario (F6).
7. **Form v1 sin backend** — submit simulado para no bloquear el build visual. Supabase + email = F7. RIESGO conocido: no publicar a producción con form simulado sin avisar al usuario.
8. **Stats/testimonios del brief NO se usan** hasta decisión del usuario (riesgo FTC). Copy actual usa lenguaje de proceso, no de resultados atribuidos.
9. `.claude/launch.json` omitido — ruta protegida en la sesión Cowork; sin impacto (npm run dev directo).

## 2026-08-12 — Sesión 2 (feedback: "gris y muerto, falta animación")
10. **Diagnóstico**: el reference es image-led; los placeholders grises mataban el diseño. Causa raíz = F6 pendiente, no el sistema de diseño.
11. **Generación IA bloqueada por plan** (Higgsfield: `job_minimum_basic_plan_required` en nano_banana; catálogo de modelos no accesible). Pivote: **arte abstracto premium generado proceduralmente** (gradient-mesh teal/esmeralda/ámbar + grano) respetando zonas de texto del spec §2. F6 queda abierta para swap por fotos IA/reales cuando haya plan o assets del usuario.
12. **Micro-animaciones añadidas** (dentro de la dirección del reference): splash → contador vira a teal en 100; feature bars → hover lift + dot teal; service cards → hover elevación/sombra; flechas overlay → group-hover fill teal + rotación; CTA hero con flecha animada; dots teal en labels ("Trusted…", "Our Services", "Compliance·Transparency·Results"). Todo con transform/opacity y respetando reduced-motion.
13. Peso de imágenes subió (~900 KB total por el grano). Aceptable para preview; optimizar en F9 (SEO/performance) si Lighthouse lo pide.
14. **Regla de trabajo (feedback del usuario, sesión 3):** si un asset generado llega defectuoso (texto horneado, watermarks, composición rota), PEDIR AL USUARIO RE-GENERARLO antes de intentar retoques costosos (inpainting/ediciones). Retocar solo si el usuario lo pide o el asset no es re-generable.
