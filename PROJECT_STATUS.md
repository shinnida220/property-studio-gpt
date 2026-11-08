# Project status

## Phase 1 — Complete
- Responsive property showcase and design studio interface
- Procedural exterior and interior sample scenes
- Room switching and orbit camera
- Material colour selection, furniture visibility and local reset

## Phase 2 — Merged
- First-person walkthrough camera
- WASD and arrow-key movement
- Desktop pointer-lock mouse look
- Mobile touch-drag look and on-screen directional controls
- Rapier dynamic capsule player
- Static collision volumes for room floors, walls and visible furniture
- Front doorway openings and guided room transitions
- Walkthrough/orbit camera switching

## Phase 3 — Implemented in PR
- Independent wall, floor and ceiling finish targets
- Finish presets for paint, plaster, wallpaper, concrete, timber, tile and stone
- Custom finish colours with roughness and metalness controls
- Procedural furniture catalogue for sofas, armchairs, tables, beds, plants and floor lamps
- Add, select, recolour, remove and transform placed furniture
- Position, rotation and uniform scale controls
- Walkthrough collision volumes for placed furniture
- Updated editor workflow and testing documentation

## Known limitations
- Editor state and added furniture are session-only and not persisted after refresh.
- Finish presets use base material properties, not image-based PBR texture maps.
- Added furniture uses procedural placeholder geometry and approximate collision shapes.
- Existing sample furniture is not yet transformable from the furniture panel.
- Rooms remain separate demo scenes connected by guided transitions; exterior remains orbit-only.
- No photogrammetry/GLB reconstruction, backend/API, authentication, uploads or cloud saving.

## Next phase
Potential Phase 4: save/load design versions, property asset import, real PBR texture libraries and dimension-aware placement/collision.
