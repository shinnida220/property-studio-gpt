# Property Studio

A runnable Phase 1 frontend prototype for a photorealistic property showcase and design studio.

This starter includes:
- Next.js 15 + TypeScript
- Three.js through React Three Fiber
- Drei scene helpers
- Zustand editor state
- Procedurally assembled sample property scenes (no external GLB download required)
- Exterior, living room, kitchen, bedroom and bathroom views
- Orbit navigation and zoom
- Selectable design targets
- Live colour customisation
- Furniture visibility toggle
- Desktop and mobile responsive interface

> Important: This is a functional visual prototype, not yet the final photorealistic reconstruction. The current house is procedurally assembled from Three.js geometry so the project runs immediately without proprietary or missing model files. The next asset milestone is to replace/augment these primitives with cleaned, realistic GLB property assets and add true first-person Rapier navigation.

## Requirements

- Node.js 20.9 or newer (Node 22 LTS recommended)
- pnpm 9 or newer (npm also works)

## Setup

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000.

Using npm:

```bash
npm install
npm run dev
```

## Production build

```bash
pnpm build
pnpm start
```

## Controls

- Drag with mouse to orbit the scene.
- Scroll to zoom.
- On touch screens, use one-finger drag to orbit and pinch to zoom.
- Select a room from the left navigation or the room chips below the viewport.
- Switch between Showcase and Design modes.
- Select a design target and choose a swatch or custom colour.
- Toggle furniture visibility.
- Reset changes to return to the initial sample state.

## Project structure

```text
src/
  app/
    globals.css
    layout.tsx
    page.tsx
  components/
    PropertyScene.tsx
    PropertyStudio.tsx
  stores/
    editor-store.ts
public/
  models/
```

## Current prototype boundaries

- The sample property geometry is generated in code, not reconstructed from real photographs.
- Room navigation currently switches the displayed room scene; it is not yet continuous room-to-room first-person movement.
- The scene uses orbit controls, not the planned first-person controller.
- Colour changes are local to the browser session and are not persisted.
- Material changes are applied to the corresponding sample scene geometry. Some categories are only represented in rooms where the relevant object exists.
- The backend, user accounts, uploads, property processing and cloud save APIs are not included in this frontend starter.
- The furniture toggle currently controls the furniture visibility in the living room and kitchen; additional room-specific visibility handling is a follow-up.

## Next implementation milestones

1. Replace procedural architecture with an editable, photorealistic GLB sample property.
2. Add a true first-person controller and Rapier collision world.
3. Add continuous room transitions and doorways.
4. Add robust scene-object metadata and material-slot mapping.
5. Add object placement, removal, rotation and scaling.
6. Add design persistence and the NestJS API.
7. Add source uploads and reconstruction jobs.

## Troubleshooting

If Next.js reports a missing dependency after installation, remove `node_modules` and the lockfile, then install again.

If the 3D scene is blank, check the browser console and ensure WebGL is enabled and the browser/GPU supports WebGL 2.
