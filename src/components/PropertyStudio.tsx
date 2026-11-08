"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import {
  ArrowLeft, BedDouble, Building2, Check, ChevronDown, ChevronRight, Footprints,
  CircleHelp, DoorOpen, Eye, Home, Layers3, Maximize2, Menu, MousePointer2,
  Palette, RotateCcw, Sofa, Sparkles, Sun, WandSparkles, X, Trash2, Plus, Move3D, RotateCw, Scaling
} from "lucide-react";
import { useEditorStore, type EditableTarget, type RoomId, type FurnitureKind } from "@/stores/editor-store";
import { WalkTouchControls } from "@/components/Walkthrough";

const PropertyScene = dynamic(() => import("@/components/PropertyScene"), {
  ssr: false,
  loading: () => <div className="scene-loading"><div className="spinner" /><span>Preparing your property...</span></div>
});

const rooms: { id: RoomId; label: string; icon: typeof Home }[] = [
  { id: "exterior", label: "Exterior", icon: Building2 },
  { id: "living", label: "Living room", icon: Sofa },
  { id: "kitchen", label: "Kitchen", icon: Home },
  { id: "bedroom", label: "Bedroom", icon: BedDouble },
  { id: "bathroom", label: "Bathroom", icon: DoorOpen }
];

const targets: { id: EditableTarget; label: string; description: string }[] = [
  { id: "walls", label: "Walls", description: "Paint and wall finish" },
  { id: "floor", label: "Floor", description: "Flooring material" },
  { id: "ceiling", label: "Ceiling", description: "Ceiling finish" },
  { id: "sofa", label: "Sofa", description: "Upholstery colour" },
  { id: "chair", label: "Chairs", description: "Chair finish" },
  { id: "bed", label: "Bedding", description: "Duvet and bed finish" },
  { id: "cabinet", label: "Cabinetry", description: "Cabinet finish" }
];

const swatches = ["#e8e2d8", "#f4f0e8", "#d8d0c4", "#c8b8a6", "#b8c2b2", "#8c9b8b", "#a7b8c7", "#6f8292", "#c5a16e", "#8a6c55", "#6e6258", "#454747"];

const finishPresets = {
  walls: [
    { label: "Matte paint", kind: "paint" as const, color: "#e8e2d8", roughness: 0.94, metalness: 0 },
    { label: "Lime plaster", kind: "plaster" as const, color: "#d9d0c2", roughness: 0.98, metalness: 0 },
    { label: "Wallpaper", kind: "wallpaper" as const, color: "#c8b8a6", roughness: 0.88, metalness: 0 },
    { label: "Concrete", kind: "concrete" as const, color: "#9b9a94", roughness: 0.9, metalness: 0 }
  ],
  floor: [
    { label: "Oak timber", kind: "timber" as const, color: "#a77c55", roughness: 0.72, metalness: 0 },
    { label: "Porcelain tile", kind: "tile" as const, color: "#d8d1c5", roughness: 0.28, metalness: 0 },
    { label: "Natural stone", kind: "stone" as const, color: "#aaa49a", roughness: 0.48, metalness: 0 },
    { label: "Polished concrete", kind: "concrete" as const, color: "#858783", roughness: 0.36, metalness: 0.04 }
  ],
  ceiling: [
    { label: "Flat white", kind: "paint" as const, color: "#f4f1ea", roughness: 0.96, metalness: 0 },
    { label: "Soft plaster", kind: "plaster" as const, color: "#e5e0d7", roughness: 0.98, metalness: 0 },
    { label: "Timber slats", kind: "timber" as const, color: "#a77c55", roughness: 0.76, metalness: 0 }
  ]
};
const furnitureCatalog: { kind: FurnitureKind; label: string }[] = [
  { kind: "sofa", label: "Sofa" },
  { kind: "armchair", label: "Armchair" },
  { kind: "coffee-table", label: "Coffee table" },
  { kind: "dining-table", label: "Dining table" },
  { kind: "bed", label: "Bed" },
  { kind: "plant", label: "Plant" },
  { kind: "floor-lamp", label: "Floor lamp" }
];
const surfaceTargets = ["walls", "floor", "ceiling"] as const;


export default function PropertyStudio() {
  const activeRoom = useEditorStore((s) => s.activeRoom);
  const setRoom = useEditorStore((s) => s.setRoom);
  const selectedTarget = useEditorStore((s) => s.selectedTarget);
  const setTarget = useEditorStore((s) => s.setTarget);
  const colors = useEditorStore((s) => s.colors);
  const finishes = useEditorStore((s) => s.finishes);
  const setFinish = useEditorStore((s) => s.setFinish);
  const furniture = useEditorStore((s) => s.furniture);
  const selectedFurnitureId = useEditorStore((s) => s.selectedFurnitureId);
  const addFurniture = useEditorStore((s) => s.addFurniture);
  const selectFurniture = useEditorStore((s) => s.selectFurniture);
  const updateFurniture = useEditorStore((s) => s.updateFurniture);
  const removeSelectedFurniture = useEditorStore((s) => s.removeSelectedFurniture);
  const setColor = useEditorStore((s) => s.setColor);
  const showFurniture = useEditorStore((s) => s.showFurniture);
  const toggleFurniture = useEditorStore((s) => s.toggleFurniture);
  const reset = useEditorStore((s) => s.reset);
  const [mode, setMode] = useState<"showcase" | "design">("design");
  const [mobilePanel, setMobilePanel] = useState(false);
  const cameraMode = useEditorStore((s) => s.cameraMode);
  const setCameraMode = useEditorStore((s) => s.setCameraMode);
  const [notice, setNotice] = useState("Changes are previewed locally in this session.");
  const currentRoom = rooms.find((room) => room.id === activeRoom)!;
  const currentTarget = targets.find((target) => target.id === selectedTarget)!;
  const selectedFurniture = furniture.find((item) => item.id === selectedFurnitureId) ?? null;
  const roomFurniture = furniture.filter((item) => item.room === activeRoom);
  const isSurfaceTarget = surfaceTargets.includes(selectedTarget as (typeof surfaceTargets)[number]);

  const handleReset = () => {
    reset();
    setNotice("Design reset to the original sample.");
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark"><Building2 size={19} /></div>
          <div><strong>property<span>studio</span></strong><small>SPACES, REIMAGINED</small></div>
        </div>
        <div className="topbar-center">
          <span className="crumb-muted">Properties</span><ChevronRight size={14} />
          <strong>Modern family residence</strong>
          <span className="status-pill"><span /> Demo</span>
        </div>
        <div className="topbar-actions">
          <button className="icon-button help-button" title="Help"><CircleHelp size={18} /></button>
          <button className="avatar" title="Demo user">PS</button>
        </div>
      </header>

      <section className="workspace">
        <aside className="left-sidebar">
          <div className="sidebar-heading"><span>PROPERTY</span><button className="icon-button"><Menu size={16} /></button></div>
          <div className="property-card">
            <div className="property-thumb"><Building2 size={28} /><span>3D</span></div>
            <div><strong>Modern family residence</strong><small>Contemporary · 2 floors</small></div>
            <ChevronDown size={15} />
          </div>

          <div className="side-section">
            <div className="section-label">EXPLORE ROOMS</div>
            <div className="room-list">
              {rooms.map((room) => {
                const Icon = room.icon;
                return (
                  <button key={room.id} className={`room-item ${activeRoom === room.id ? "active" : ""}`} onClick={() => { if (room.id === "exterior" && cameraMode === "walk") setCameraMode("orbit"); setRoom(room.id); }}>
                    <Icon size={17} /><span>{room.label}</span>{activeRoom === room.id && <span className="room-active-dot" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="side-section scene-tree">
            <div className="section-label">SCENE</div>
            <div className="tree-row"><ChevronDown size={14} /><Layers3 size={16} /><span>{currentRoom.label}</span></div>
            <div className="tree-child"><span className="tree-dot wall" />Walls & structure</div>
            <div className="tree-child"><span className="tree-dot floor" />Floor & ceiling</div>
            <div className="tree-child"><span className="tree-dot furniture" />Furniture</div>
          </div>

          <div className="sidebar-bottom">
            <div className="tip-card"><Sparkles size={16} /><div><strong>Design tip</strong><p>Try warm neutral tones to create a calm, welcoming space.</p></div></div>
            <div className="user-row"><div className="avatar small">PS</div><div><strong>Demo workspace</strong><small>Personal project</small></div></div>
          </div>
        </aside>

        <section className="viewport-column">
          <div className="viewport-toolbar">
            <div className="view-breadcrumb"><span>VIEWING</span><strong>{currentRoom.label}</strong></div>
            <div className="view-actions">
              <button className={`toolbar-button ${mode === "showcase" ? "selected" : ""}`} onClick={() => setMode("showcase")}><Eye size={15} /> Showcase</button>
              <button className={`toolbar-button ${mode === "design" ? "selected" : ""}`} onClick={() => setMode("design")}><Palette size={15} /> Design</button>
              <span className="toolbar-divider" />
              <button className={`toolbar-button ${cameraMode === "walk" ? "selected" : ""}`} onClick={() => { if (activeRoom === "exterior") setRoom("living"); setCameraMode("walk"); setNotice("Walkthrough enabled. Use WASD or the on-screen controls to move; drag to look around."); }}><Footprints size={15} /> Walkthrough</button>
              <button className={`toolbar-button ${cameraMode === "orbit" ? "selected" : ""}`} onClick={() => { setCameraMode("orbit"); setNotice("Orbit view restored."); }}><Eye size={15} /> Orbit</button>
              <span className="toolbar-divider" />
              <button className="icon-button" title="Reset design" onClick={handleReset}><RotateCcw size={16} /></button>
              <button className="icon-button" title="Fullscreen" onClick={() => document.querySelector(".viewport")?.requestFullscreen?.()}><Maximize2 size={16} /></button>
            </div>
          </div>
          <div className="viewport">
            <PropertyScene />
            <div className="viewport-top-overlay">
              <div className="location-chip"><span className="live-dot" /> {currentRoom.label}</div>
              {cameraMode === "walk" ? <button className="view-chip walk-active" onClick={() => setCameraMode("orbit")}><Footprints size={14} /> Exit walkthrough</button> : <button className="view-chip" onClick={() => setNotice("Orbit around the property by dragging. Scroll or pinch to zoom.")}><MousePointer2 size={14} /> Orbit view</button>}
            </div>
            {cameraMode === "walk" && <><div className="walk-instructions">Walk through the open doorway to continue to the next room</div><WalkTouchControls /></>}
            <div className="viewport-bottom-overlay">
              <div className="camera-hint">{cameraMode === "walk" ? <><Footprints size={14} /><span>WASD to move</span><i /><span>Drag to look</span></> : <><MousePointer2 size={14} /><span>Drag to orbit</span><i /><span>Scroll to zoom</span></>}</div>
              <div className="scene-counter">{String(rooms.findIndex((room) => room.id === activeRoom) + 1).padStart(2, "0")} <span>/</span> 05</div>
            </div>
            {mode === "showcase" && <div className="showcase-banner"><Eye size={15} /> Showcase mode · Editing is disabled</div>}
          </div>
          <div className="bottom-room-strip">
            <div><strong>Explore this property</strong><span>Choose a space to preview</span></div>
            <div className="room-chips">
              {rooms.map((room) => (
                <button key={room.id} className={activeRoom === room.id ? "active" : ""} onClick={() => { if (room.id === "exterior" && cameraMode === "walk") setCameraMode("orbit"); setRoom(room.id); }}>
                  {room.label}
                </button>
              ))}
            </div>
          </div>
          <div className="notice-line"><span className="notice-dot" />{notice}</div>
        </section>

        <aside className={`right-sidebar ${mobilePanel ? "mobile-open" : ""}`}>
          <div className="editor-header">
            <div><span className="section-label">DESIGN STUDIO</span><h2>Customise space</h2></div>
            <button className="icon-button close-mobile" onClick={() => setMobilePanel(false)}><X size={18} /></button>
            <span className="beta-pill">BETA</span>
          </div>

          <div className="editor-scroll">
            <section className="editor-section">
              <div className="editor-section-title"><span>1</span><div><strong>Select an element</strong><small>Choose what you want to customise</small></div></div>
              <div className="target-list">
                {targets.map((target) => (
                  <button key={target.id} className={`target-item ${selectedTarget === target.id ? "active" : ""}`} onClick={() => setTarget(target.id)} disabled={mode === "showcase"}>
                    <div className={`target-preview ${target.id}`} />
                    <div><strong>{target.label}</strong><small>{target.description}</small></div>
                    {selectedTarget === target.id && <Check size={16} />}
                  </button>
                ))}
              </div>
            </section>

            <section className="editor-section">
              <div className="editor-section-title"><span>2</span><div><strong>{isSurfaceTarget ? "Surface finish" : "Material colour"}</strong><small>{isSurfaceTarget ? "Choose a finish preset and tune its surface response" : "Apply a colour to the selected material"}</small></div></div>
              <div className="colour-current"><div className="colour-preview" style={{ background: colors[selectedTarget] }} /><div><strong>{currentTarget.label}</strong><small>{colors[selectedTarget].toUpperCase()}</small></div></div>
              {isSurfaceTarget && <div className="finish-preset-grid">
                {finishPresets[selectedTarget as keyof typeof finishPresets].map((preset) => (
                  <button key={preset.kind + preset.label} className={`finish-preset ${finishes[selectedTarget as keyof typeof finishes].kind === preset.kind && finishes[selectedTarget as keyof typeof finishes].color === preset.color ? "active" : ""}`} onClick={() => { setFinish(selectedTarget as keyof typeof finishes, preset); setNotice(`${preset.label} applied to ${currentTarget.label.toLowerCase()}.`); }} disabled={mode === "showcase"}>
                    <span style={{ background: preset.color }} /><strong>{preset.label}</strong>
                  </button>
                ))}
              </div>}
              <div className="swatch-grid">
                {swatches.map((color) => (
                  <button key={color} className={`swatch ${colors[selectedTarget] === color ? "active" : ""}`} style={{ background: color }} title={color} onClick={() => { setColor(selectedTarget, color); setNotice(`${currentTarget.label} colour updated to ${color.toUpperCase()}.`); }} disabled={mode === "showcase"} />
                ))}
              </div>
              <label className="custom-colour">Custom colour<input type="color" value={colors[selectedTarget]} onChange={(e) => setColor(selectedTarget, e.target.value)} disabled={mode === "showcase"} /></label>
              {isSurfaceTarget && <div className="finish-tuning">
                <label>Roughness <input type="range" min="0.05" max="1" step="0.01" value={finishes[selectedTarget as keyof typeof finishes].roughness} onChange={(e) => setFinish(selectedTarget as keyof typeof finishes, { ...finishes[selectedTarget as keyof typeof finishes], roughness: Number(e.target.value) })} disabled={mode === "showcase"} /><output>{finishes[selectedTarget as keyof typeof finishes].roughness.toFixed(2)}</output></label>
                <label>Metalness <input type="range" min="0" max="1" step="0.01" value={finishes[selectedTarget as keyof typeof finishes].metalness} onChange={(e) => setFinish(selectedTarget as keyof typeof finishes, { ...finishes[selectedTarget as keyof typeof finishes], metalness: Number(e.target.value) })} disabled={mode === "showcase"} /><output>{finishes[selectedTarget as keyof typeof finishes].metalness.toFixed(2)}</output></label>
              </div>}
            </section>
            <section className="editor-section furniture-editor">
              <div className="editor-section-title"><span>3</span><div><strong>Furniture</strong><small>Add and arrange objects in this room</small></div></div>
              <div className="furniture-catalog">
                {furnitureCatalog.map((item) => <button key={item.kind} onClick={() => { addFurniture(item.kind); setNotice(`${item.label} added to ${currentRoom.label.toLowerCase()}.`); }} disabled={mode === "showcase" || activeRoom === "exterior" || cameraMode === "walk"}><Plus size={12} />{item.label}</button>)}
              </div>
              <div className="placed-furniture-list">
                <strong>Placed in this room ({roomFurniture.length})</strong>
                {roomFurniture.length === 0 ? <small>No additional furniture placed yet.</small> : roomFurniture.map((item) => <button key={item.id} className={selectedFurnitureId === item.id ? "active" : ""} onClick={() => selectFurniture(item.id)}>{furnitureCatalog.find((entry) => entry.kind === item.kind)?.label ?? item.kind}<span>{selectedFurnitureId === item.id ? "Selected" : "Select"}</span></button>)}
              </div>
              {selectedFurniture && <div className="transform-panel">
                <div className="transform-panel-title"><Move3D size={14} /><strong>Transform selected item</strong><button title="Remove furniture" onClick={() => { removeSelectedFurniture(); setNotice("Furniture removed."); }}><Trash2 size={14} /></button></div>
                <label>Position X <input type="range" min="-2.5" max="2.5" step="0.05" value={selectedFurniture.position[0]} onChange={(e) => updateFurniture(selectedFurniture.id, { position: [Number(e.target.value), selectedFurniture.position[1], selectedFurniture.position[2]] })} /><output>{selectedFurniture.position[0].toFixed(2)}</output></label>
                <label>Position Z <input type="range" min="-2.5" max="2.5" step="0.05" value={selectedFurniture.position[2]} onChange={(e) => updateFurniture(selectedFurniture.id, { position: [selectedFurniture.position[0], selectedFurniture.position[1], Number(e.target.value)] })} /><output>{selectedFurniture.position[2].toFixed(2)}</output></label>
                <label><RotateCw size={12} /> Rotation <input type="range" min="0" max="360" step="1" value={Math.round(selectedFurniture.rotation[1] * 180 / Math.PI)} onChange={(e) => updateFurniture(selectedFurniture.id, { rotation: [0, Number(e.target.value) * Math.PI / 180, 0] })} /><output>{Math.round(selectedFurniture.rotation[1] * 180 / Math.PI)}°</output></label>
                <label><Scaling size={12} /> Scale <input type="range" min="0.5" max="1.8" step="0.05" value={selectedFurniture.scale[0]} onChange={(e) => updateFurniture(selectedFurniture.id, { scale: [Number(e.target.value), Number(e.target.value), Number(e.target.value)] })} /><output>{selectedFurniture.scale[0].toFixed(2)}×</output></label>
                <label className="custom-colour">Furniture colour<input type="color" value={selectedFurniture.color} onChange={(e) => updateFurniture(selectedFurniture.id, { color: e.target.value })} /></label>
              </div>}
            </section>

            <section className="editor-section options-section">
              <div className="editor-section-title"><span>4</span><div><strong>Scene options</strong><small>Adjust what's visible</small></div></div>
              <button className="toggle-row" onClick={toggleFurniture}><span>Show furniture</span><span className={`switch ${showFurniture ? "on" : ""}`}><i /></span></button>
            </section>

            <section className="editor-section material-info">
              <div className="material-info-head"><Sun size={17} /><strong>Material properties</strong></div>
              <p>Surface presets tune colour, roughness and metalness in the live preview. Furniture added in this phase is editable and stored in the current browser session only.</p>
            </section>
          </div>

          <div className="editor-footer">
            <button className="reset-button" onClick={handleReset}><RotateCcw size={15} /> Reset changes</button>
            <button className="save-button" onClick={() => setNotice("This demo is local-only. Saved designs will be enabled when the backend is connected.")}>Save design <ChevronRight size={15} /></button>
          </div>
        </aside>
        <button className="mobile-editor-button" onClick={() => setMobilePanel(true)}><WandSparkles size={17} /> Customise</button>
      </section>
    </main>
  );
}
