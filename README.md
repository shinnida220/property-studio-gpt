# Property Studio

A browser-based property showcase and design studio prototype built with Next.js, React Three Fiber, Three.js and Zustand.

## Features by phase

### Phase 1 — Property showcase
- Responsive browser interface for desktop and mobile.
- Procedural sample property with exterior, living room, kitchen, bedroom and bathroom.
- Orbit camera, room switching and zoom.
- Live material colour customisation and furniture visibility toggle.

### Phase 2 — First-person walkthrough
- Rapier-powered capsule player and room collision volumes.
- WASD / arrow-key movement and desktop pointer-lock mouse look.
- Mobile touch-drag look and on-screen directional controls.
- Guided doorway transitions between the four interior demo rooms.
- Orbit / walkthrough camera switching.

### Phase 3 — Expanded design editor
- Separate wall, floor and ceiling finish targets.
- Surface presets: matte paint, lime plaster, wallpaper, concrete, timber, porcelain tile, natural stone and ceiling finishes.
- Custom surface colours plus roughness and metalness controls.
- Furniture catalogue: sofa, armchair, coffee table, dining table, bed, plant and floor lamp.
- Add furniture to the active interior room, select it from the placed-items list or by clicking it in the 3D scene.
- Transform placed furniture with position X/Z, rotation and uniform scale controls.
- Change placed furniture colour, remove selected items, and reset the editor.
- Collision volumes are generated for placed furniture while in walkthrough mode.

> This remains a procedural prototype, not a photogrammetry or floor-plan reconstruction system. Interior rooms are separate demo scenes connected by guided doorway progression, not one metrically accurate building.

## Requirements

- Node.js 20.9 or newer (Node 22 LTS recommended).
- pnpm 9 or newer (npm also works).

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

## Editor workflow

1. Choose an interior room from the room list or room chips.
2. Keep the camera in **Orbit** mode and use **Design** mode.
3. Under **Select an element**, choose Walls, Floor or Ceiling.
4. Pick a finish preset, then tune its colour, roughness and metalness. Custom colour and swatches are also available.
5. Under **Furniture**, add an item to the current room.
6. Select the new item in the placed-items list or click it in the 3D view.
7. Adjust its X/Z position, rotation, uniform scale and colour. Use the remove icon to delete it.
8. Toggle furniture visibility to hide or show both the sample furniture and added furniture.
9. Use **Reset** to restore initial surface values and remove added furniture.

Furniture placement and transformation controls are intentionally available in Orbit mode. Switch to Walkthrough to inspect the result in first person.

## Controls

### Orbit
- Drag to orbit the scene.
- Scroll to zoom.
- Touch screens support drag and pinch gestures.

### Walkthrough
- Select **Walkthrough** in the viewport toolbar (an interior room is selected automatically if you are on the exterior).
- Desktop: click the 3D view to capture the mouse, use WASD or arrow keys to move, and move the mouse to look around. Press Escape to release pointer lock.
- Mobile: drag on the 3D view to look around and use the on-screen directional pad to move.
- Walk through the open doorway at the front of each interior room to continue to the next room.
- Select **Orbit** to return to the orbit camera.

## Persistence and prototype boundaries

- Editor changes, placed furniture and transforms live in Zustand client state only. They are not saved to a backend and are lost on a full page refresh.
- Reset clears added furniture and restores initial surface presets.
- Finish presets currently tune base colour, roughness and metalness; they do not yet load manufacturer texture maps, normal maps, UV-mapped materials or PBR asset libraries.
- Placed furniture is procedural geometry. It is not an imported product catalogue or a physically dimensioned furniture model.
- Collision shapes for placed furniture are approximations; rotation and scaled dimensions are applied, but detailed mesh-level collision is not implemented.
- Existing sample furniture retains its original fixed positions; the transform panel currently edits furniture added through the Phase 3 catalogue.
- The four interior rooms remain separate demo scenes with guided transitions. The exterior remains orbit-only.
- Authentication, property uploads, GLB reconstruction, backend APIs, cloud saving and multi-user collaboration are not included.
