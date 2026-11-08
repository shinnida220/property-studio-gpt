"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import {
  ArrowLeft, BedDouble, Building2, Check, ChevronDown, ChevronRight, Footprints,
  CircleHelp, DoorOpen, Eye, Home, Layers3, Maximize2, Menu, MousePointer2,
  Palette, RotateCcw, Sofa, Sparkles, Sun, WandSparkles, X
} from "lucide-react";
import { useEditorStore, type EditableTarget, type RoomId } from "@/stores/editor-store";
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
  { id: "sofa", label: "Sofa", description: "Upholstery colour" },
  { id: "chair", label: "Chairs", description: "Chair finish" },
  { id: "bed", label: "Bedding", description: "Duvet and bed finish" },
  { id: "cabinet", label: "Cabinetry", description: "Cabinet finish" }
];

const swatches = ["#e8e2d8", "#f4f0e8", "#d8d0c4", "#c8b8a6", "#b8c2b2", "#8c9b8b", "#a7b8c7", "#6f8292", "#c5a16e", "#8a6c55", "#6e6258", "#454747"];

export default function PropertyStudio() {
  const activeRoom = useEditorStore((s) => s.activeRoom);
  const setRoom = useEditorStore((s) => s.setRoom);
  const selectedTarget = useEditorStore((s) => s.selectedTarget);
  const setTarget = useEditorStore((s) => s.setTarget);
  const colors = useEditorStore((s) => s.colors);
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
                <button key={room.id} className={activeRoom === room.id ? "active" : ""} onClick={() => setRoom(room.id)}>
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
              <div className="editor-section-title"><span>2</span><div><strong>Choose a colour</strong><small>Apply a new finish</small></div></div>
              <div className="colour-current"><div className="colour-preview" style={{ background: colors[selectedTarget] }} /><div><strong>{currentTarget.label}</strong><small>{colors[selectedTarget].toUpperCase()}</small></div></div>
              <div className="swatch-grid">
                {swatches.map((color) => (
                  <button key={color} className={`swatch ${colors[selectedTarget] === color ? "active" : ""}`} style={{ background: color }} title={color} onClick={() => { setColor(selectedTarget, color); setNotice(`${currentTarget.label} colour updated to ${color.toUpperCase()}.`); }} disabled={mode === "showcase"} />
                ))}
              </div>
              <label className="custom-colour">Custom colour<input type="color" value={colors[selectedTarget]} onChange={(e) => setColor(selectedTarget, e.target.value)} disabled={mode === "showcase"} /></label>
            </section>

            <section className="editor-section options-section">
              <div className="editor-section-title"><span>3</span><div><strong>Scene options</strong><small>Adjust what's visible</small></div></div>
              <button className="toggle-row" onClick={toggleFurniture}><span>Show furniture</span><span className={`switch ${showFurniture ? "on" : ""}`}><i /></span></button>
            </section>

            <section className="editor-section material-info">
              <div className="material-info-head"><Sun size={17} /><strong>Material properties</strong></div>
              <p>Colour changes update the selected material in the live 3D preview. Advanced textures and physically based material controls will be added in the next editor milestone.</p>
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
