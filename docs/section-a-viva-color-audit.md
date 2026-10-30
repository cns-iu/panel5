# Section A Viva-inspired color audit

Section A now uses a fixed YlGnBu visual styling palette inspired by Viva Human Atlas. The palette is design-only: it does not represent computational-model counts, gene expression, HPO terms, or any quantitative measurement.

Changed rendering paths:

- `web/src/components/anatomy/sectionAColors.ts` defines the exact nine Viva YlGnBu stops, fixed organ positions, and neutral gray fallback.
- `web/src/components/anatomy/AnatomyScene.tsx` applies the helper to loaded male/female GLB meshes and existing fallback organ meshes.
- Skin remains non-raycastable and transparent so internal anatomy remains visible.

Fixed visual mapping: pancreas 0.08, skin 0.14, eye 0.18, lymph node 0.26, large intestine 0.36, small intestine 0.47, lung 0.56, kidney 0.65, spinal cord 0.76, liver 0.84, brain 0.92. Unknown visible meshes use neutral gray `#5a616b`.

Section B FTU behavior, Section C expression/HPO colors, data endpoints, selection flow, and GLB loading strategy are unchanged.

Validation: `npm run typecheck`, `npm run test -- --run`, and `npm run build` passed (14 tests). `npm run test:e2e` could not start its local Vite server in the restricted environment (`listen EPERM` on port 5173). Online after-deployment evidence: `docs/screenshots/section-a-viva-after.png`.
