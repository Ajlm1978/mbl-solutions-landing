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
