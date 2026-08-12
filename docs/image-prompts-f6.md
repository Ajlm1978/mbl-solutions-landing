# Prompts de imágenes F6 — MBL Landing (v2)

**Dirección corregida:** MBL vende servicios B2B de facturación médica a clínicas y consultorios —
NO atención médica. Regla dura: **cero batas blancas, cero pacientes, cero salas clínicas.**
El mundo visual es el back-office de ingresos: especialistas de billing, dashboards financieros,
claims, oficinas modernas. El guiño "médico" entra solo por documentos de seguros/claims, sutil.

Genera en la mayor resolución posible. Nombres de archivo y aspect ratios obligatorios;
las zonas claras/oscuras hacen que el texto lea — si no salen, re-tira.

---

## 1. `hero.webp` — Hero mosaico · 16:9 (mín. 2048px ancho)

> Bright modern corporate office of a medical billing company, editorial photography, wide shot. Left two thirds of the frame: airy white and warm-stone open workspace flooded with natural daylight, clean and minimal, generous empty negative space for text overlay. Right third: richer and deeper color — teal-green glass wall, warm wood, two billing specialists in smart business casual working at dual-monitor workstations displaying abstract financial dashboards with teal charts, slightly out of focus. Bottom right corner falls into soft dark teal shadow. Color palette: white, warm stone, vivid teal accents, touches of warm amber. High-key, crisp, premium. No white coats, no patients, no medical rooms. No text, no logos, no watermarks.

**Crítico:** izquierda clara (texto negro encima), esquina inferior derecha oscura (texto teal claro encima).

## 2. `section2.webp` — Mosaico servicios · 16:9 (mín. 2048px ancho)

> Overhead editorial photograph of a revenue cycle management workspace: light oak desk, open laptop showing a colorful accounts-receivable dashboard with teal and emerald bar charts (screen content abstract, not readable), neatly stacked health insurance claim forms, a modern calculator, pen, ceramic coffee cup, small green plant. Bright natural window light. Upper left area lighter with clean negative space; right side and bottom right deeper with rich teal shadow tones. Vivid but professional color grading. No medical instruments, no stethoscope. No readable text, no logos.

**Crítico:** esquina superior izquierda clara (títulos negros en desktop), lado derecho oscuro (texto blanco).

## 3. `s3-detail-1.webp` — Detalle A · 1:1 (mín. 800px)

> Close-up editorial photo of a financial analyst's hands holding a tablet displaying a bright abstract teal revenue growth chart trending upward, modern office background softly blurred with warm daylight, green plants and wood tones. Business setting, not clinical. Vivid professional color, shallow depth of field. No readable text, no logos.

## 4. `s3-detail-2.webp` — Detalle B · 1:1 (mín. 800px)

> Close-up editorial photo of hands with a pen reviewing a neat stack of health insurance claim documents beside a modern calculator and keyboard, light wood desk, warm natural daylight, subtle teal accents (folder, pen), vivid color, shallow depth of field. Documents abstract, not readable. Office setting, no medical instruments. No logos.

## 5. `s3-portrait.webp` — Retrato vertical · 3:4 (mín. 1000×1330)

> Vertical editorial portrait of a smiling confident revenue cycle account manager in smart business attire with a subtle teal blouse or pocket square, arms crossed, holding a tablet, standing in a bright modern corporate office corridor. Warm daylight from the left, background softly blurred with teal glass panels and green plants. Lower third of the frame noticeably darker in soft teal shadow, upper part bright. Premium corporate photography, warm and human, approachable expert. No white coat, no medical setting. No text, no logos.

**Crítico:** tercio inferior oscuro (ahí van dos cards con texto, una blanca y una glass con texto blanco).

---

## Entrega
Guarda las 5 con esos nombres exactos en `public/img/`, o pásamelas y yo las convierto a WebP,
optimizo y verifico contraste de zonas de texto antes de commitear.
