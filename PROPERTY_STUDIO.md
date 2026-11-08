# Property Studio — Development Backlog & Implementation Blueprint

**Project:** Property Studio  
**Version:** 1.0  
**Initial milestone:** Phase 1 — Interactive 3D Property Walkthrough  
**Platform:** Browser (desktop and mobile)  
**Visual target:** Photorealistic

---

## 1. Repository strategy

Two independent repositories:

- `property-studio-web` — Next.js, TypeScript, Three.js, React Three Fiber.
- `property-studio-api` — NestJS, TypeScript, PostgreSQL, Sequelize-TypeScript.

No monorepo.

## 2. Core engineering decisions

### Frontend
- Next.js App Router
- React Three Fiber
- Three.js
- Drei
- Rapier physics
- Zustand
- Tailwind CSS
- shadcn/ui
- Zod

### Backend
- NestJS
- Sequelize-TypeScript
- PostgreSQL
- Zod for shared request validation patterns where appropriate
- S3-compatible object storage
- Background processing through an asynchronous task manager

### 3D asset standards
- GLB as the primary delivery format.
- glTF-compatible PBR materials.
- Metric units.
- Y-up coordinate system.
- Explicit scene-object identifiers.
- Separate architectural, furniture and environment assets.
- KTX2 texture compression.
- Meshopt geometry compression where appropriate.

## 3. Frontend implementation backlog

### M1 — Project foundation
- [ ] Initialize Next.js application.
- [ ] Configure TypeScript strict mode.
- [ ] Configure Tailwind and shadcn/ui.
- [ ] Install Three.js, R3F and Drei.
- [ ] Configure Zustand.
- [ ] Configure Zod.
- [ ] Establish feature-based folder structure.
- [ ] Configure GLB asset loading.
- [ ] Create a responsive application shell.
- [ ] Establish an error boundary for the 3D viewer.

### M2 — 3D scene engine
- [ ] Create reusable PropertyCanvas component.
- [ ] Implement PropertyScene.
- [ ] Implement GLTF loading.
- [ ] Implement environment lighting.
- [ ] Implement directional lighting.
- [ ] Implement shadows.
- [ ] Implement tone mapping and colour management.
- [ ] Implement model loading progress.
- [ ] Implement asset loading errors.
- [ ] Implement scene cleanup and disposal.

### M3 — Walkthrough controls
- [ ] Implement first-person camera.
- [ ] Implement WASD movement.
- [ ] Implement mouse-look.
- [ ] Implement mobile virtual joystick.
- [ ] Implement touch-look.
- [ ] Integrate Rapier.
- [ ] Implement player collider.
- [ ] Implement wall and furniture collision.
- [ ] Implement movement boundaries.
- [ ] Implement camera height configuration.

### M4 — Property navigation
- [ ] Define floor metadata.
- [ ] Define room metadata.
- [ ] Create room selector.
- [ ] Create floor selector.
- [ ] Implement room navigation points.
- [ ] Implement room-to-room transitions.
- [ ] Implement entry and exit points.
- [ ] Display current room.

### M5 — Object interaction
- [ ] Implement raycasting.
- [ ] Implement object selection.
- [ ] Implement object highlighting.
- [ ] Implement object metadata.
- [ ] Implement object inspection panel.
- [ ] Implement selectable-object filtering.

### M6 — Basic material editing
- [ ] Implement material metadata.
- [ ] Implement editable material identification.
- [ ] Implement colour picker.
- [ ] Implement material replacement.
- [ ] Implement roughness adjustment.
- [ ] Implement metalness adjustment.
- [ ] Implement texture assignment.
- [ ] Ensure material changes do not affect unrelated objects.
- [ ] Implement reset-to-original functionality.

### M7 — Property showcase
- [ ] Create property landing page.
- [ ] Create property gallery.
- [ ] Create property information section.
- [ ] Implement fullscreen walkthrough.
- [ ] Implement showcase mode.
- [ ] Implement editor mode.
- [ ] Implement responsive layouts.

### M8 — Performance and quality
- [ ] Implement progressive asset loading.
- [ ] Implement texture compression.
- [ ] Implement geometry optimisation.
- [ ] Implement LOD.
- [ ] Implement adaptive rendering quality.
- [ ] Test desktop performance.
- [ ] Test mobile performance.
- [ ] Test memory cleanup.
- [ ] Test navigation and collision.

## 4. Backend implementation backlog

### B1 — Foundation
- [ ] Initialize NestJS.
- [ ] Configure PostgreSQL.
- [ ] Configure Sequelize-TypeScript.
- [ ] Configure database migrations.
- [ ] Configure request validation.
- [ ] Configure authentication.
- [ ] Configure authorization.
- [ ] Configure S3 storage.
- [ ] Configure structured logging.

### B2 — Property management
- [ ] Create Property model.
- [ ] Create PropertySource model.
- [ ] Create PropertyAsset model.
- [ ] Create PropertyFloor model.
- [ ] Create PropertyRoom model.
- [ ] Create SceneObject model.
- [ ] Implement property CRUD.
- [ ] Implement property ownership.
- [ ] Implement property permissions.
- [ ] Implement property publishing.

### B3 — Asset management
- [ ] Implement upload URL generation.
- [ ] Implement source registration.
- [ ] Implement asset metadata.
- [ ] Implement asset versioning.
- [ ] Implement asset validation.
- [ ] Implement asset listing.
- [ ] Implement asset deletion with ownership checks.

### B4 — Design management
- [ ] Create PropertyDesign model.
- [ ] Create DesignChange model.
- [ ] Implement design creation.
- [ ] Implement design retrieval.
- [ ] Implement design updates.
- [ ] Implement design duplication.
- [ ] Implement design ownership and permissions.

### B5 — Asynchronous processing foundation
- [ ] Create async task models.
- [ ] Implement task creation.
- [ ] Implement task status tracking.
- [ ] Implement retry handling.
- [ ] Implement failure reporting.
- [ ] Implement processing history.

## 5. Initial database entities

1. User
2. Property
3. PropertyMember
4. PropertySource
5. PropertyAsset
6. PropertyFloor
7. PropertyRoom
8. SceneObject
9. PropertyDesign
10. DesignChange
11. AsyncTaskManager
12. AsyncTaskProcessor

Use UUID primary keys, JSONB for flexible scene metadata and proper foreign-key constraints.

## 6. Initial API contracts

| Method | Endpoint |
|---|---|
| POST | /v1/properties |
| GET | /v1/properties |
| GET | /v1/properties/:id |
| PATCH | /v1/properties/:id |
| POST | /v1/properties/:id/sources |
| GET | /v1/properties/:id/assets |
| GET | /v1/properties/:id/scene |
| GET | /v1/properties/:id/rooms |
| POST | /v1/properties/:id/designs |
| GET | /v1/properties/:id/designs |
| PATCH | /v1/properties/:id/designs/:designId |

Asset uploads should use presigned URLs. Large 3D files should not pass through the NestJS application server.

## 7. Scene manifest

The frontend should consume a versioned scene manifest containing:

- Property information.
- Scene asset locations.
- Floor definitions.
- Room definitions.
- Object identifiers.
- Object transformations.
- Material definitions.
- Navigation points.
- Collision configuration.

The manifest should be independent of the React component structure.

## 8. Phase 1 delivery criteria

A complete demonstration property must:

1. Load successfully in a browser.
2. Display its exterior.
3. Allow users to enter the building.
4. Allow movement between rooms.
5. Support desktop and mobile navigation.
6. Prevent movement through walls.
7. Support object selection.
8. Allow supported material colour changes.
9. Preserve unrelated object materials.
10. Load assets progressively.
11. Clean up GPU resources appropriately.
12. Work in read-only showcase mode.

## 9. Deferred functionality

The following are explicitly outside Phase 1:

- Automated photo-to-3D reconstruction.
- AI object recognition.
- Automatic furniture removal.
- AI-generated interior design.
- Full furniture marketplace.
- Real-time multi-user collaboration.
- VR support.
- Advanced structural modifications.

The architecture must accommodate these features without requiring a fundamental redesign.

## 10. Development order

1. Frontend foundation.
2. 3D scene engine.
3. Sample property integration.
4. First-person navigation.
5. Physics and collisions.
6. Room navigation.
7. Object selection.
8. Material editing.
9. Property showcase interface.
10. Backend integration.
11. Performance testing.
12. Phase 1 acceptance testing.

**Development principle:** A working, visually impressive 3D experience takes priority over implementing a large number of incomplete features.