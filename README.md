# Property Studio

A browser-based property showcase and design studio prototype built with Next.js, React Three Fiber and Three.js.

## Phase 1 + Phase 2 features

- Next.js 15 + TypeScript + React 19
- Three.js through React Three Fiber and Drei
- Zustand editor state
- Procedurally assembled sample property scenes
- Exterior, living room, kitchen, bedroom and bathroom views
- Room switching and orbit camera controls
- Live material colour customisation and furniture visibility toggle
- First-person walkthrough mode powered by Rapier physics
- WASD / arrow-key movement and pointer-lock mouse look on desktop
- Touch-drag look and on-screen directional movement controls on mobile
- Static wall, floor and furniture collision volumes
- Doorway-triggered room progression through the four interior demo scenes
- Responsive interface and local reset

> This is a procedural prototype, not a photogrammetry or floor-plan reconstruction system. The interior rooms are separate demo scenes connected by a guided doorway progression, not a metrically accurate architectural floor plan.

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

## Design
- Select a room from the navigation or room chips.
- Switch between Showcase and Design modes.
- Select an element and choose a swatch or custom colour.
- Toggle furniture visibility.
- Reset to the initial sample state.

## Prototype boundaries
- Geometry is generated in code; real property uploads and GLB reconstruction are not included.
- Room-to-room navigation is a guided demo sequence rather than a single connected building.
- Collision volumes are hand-authored primitive shapes and will need replacement or generation for imported assets.
- The exterior remains orbit-only.
- Design state is local and is not persisted.
- Authentication, backend APIs, uploads, processing jobs and cloud saving are not included.
