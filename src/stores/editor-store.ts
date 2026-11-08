import { create } from "zustand";

export type RoomId = "exterior" | "living" | "kitchen" | "bedroom" | "bathroom";
export type EditableTarget = "walls" | "floor" | "ceiling" | "sofa" | "chair" | "bed" | "cabinet";
export type CameraMode = "orbit" | "walk";
export type WalkDirection = "forward" | "backward" | "left" | "right";
export type FinishKind = "paint" | "plaster" | "wallpaper" | "timber" | "tile" | "stone" | "concrete" | "fabric";
export type TransformMode = "translate" | "rotate" | "scale";
export type FurnitureKind = "sofa" | "armchair" | "coffee-table" | "dining-table" | "bed" | "plant" | "floor-lamp";

export type SurfaceFinish = {
  color: string;
  kind: FinishKind;
  roughness: number;
  metalness: number;
};

export type FurnitureItem = {
  id: string;
  room: Exclude<RoomId, "exterior">;
  kind: FurnitureKind;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color: string;
};

type EditorState = {
  activeRoom: RoomId;
  selectedTarget: EditableTarget;
  colors: Record<EditableTarget, string>;
  finishes: Record<"walls" | "floor" | "ceiling", SurfaceFinish>;
  showFurniture: boolean;
  showLabels: boolean;
  cameraMode: CameraMode;
  walkInput: Record<WalkDirection, boolean>;
  furniture: FurnitureItem[];
  selectedFurnitureId: string | null;
  transformMode: TransformMode;
  setRoom: (room: RoomId) => void;
  setTarget: (target: EditableTarget) => void;
  setColor: (target: EditableTarget, color: string) => void;
  setFinish: (target: "walls" | "floor" | "ceiling", finish: SurfaceFinish) => void;
  toggleFurniture: () => void;
  toggleLabels: () => void;
  setCameraMode: (mode: CameraMode) => void;
  setWalkInput: (direction: WalkDirection, pressed: boolean) => void;
  clearWalkInput: () => void;
  addFurniture: (kind: FurnitureKind) => void;
  selectFurniture: (id: string | null) => void;
  updateFurniture: (id: string, patch: Partial<Pick<FurnitureItem, "position" | "rotation" | "scale" | "color">>) => void;
  removeSelectedFurniture: () => void;
  setTransformMode: (mode: TransformMode) => void;
  reset: () => void;
};

const initialColors: Record<EditableTarget, string> = {
  walls: "#e8e2d8",
  floor: "#a77c55",
  ceiling: "#f4f1ea",
  sofa: "#8c9b8b",
  chair: "#c69b67",
  bed: "#d9d2c5",
  cabinet: "#7a6653"
};

const initialFinishes: Record<"walls" | "floor" | "ceiling", SurfaceFinish> = {
  walls: { color: "#e8e2d8", kind: "paint", roughness: 0.92, metalness: 0 },
  floor: { color: "#a77c55", kind: "timber", roughness: 0.72, metalness: 0 },
  ceiling: { color: "#f4f1ea", kind: "paint", roughness: 0.96, metalness: 0 }
};

const emptyWalkInput = { forward: false, backward: false, left: false, right: false };

export const useEditorStore = create<EditorState>((set) => ({
  activeRoom: "exterior",
  selectedTarget: "walls",
  colors: { ...initialColors },
  finishes: { ...initialFinishes },
  showFurniture: true,
  showLabels: true,
  cameraMode: "orbit",
  walkInput: { ...emptyWalkInput },
  furniture: [],
  selectedFurnitureId: null,
  transformMode: "translate",
  setRoom: (activeRoom) => set({ activeRoom, selectedFurnitureId: null }),
  setTarget: (selectedTarget) => set({ selectedTarget, selectedFurnitureId: null }),
  setColor: (target, color) => set((state) => ({
    colors: { ...state.colors, [target]: color },
    ...(target === "walls" || target === "floor" || target === "ceiling"
      ? { finishes: { ...state.finishes, [target]: { ...state.finishes[target], color } } }
      : {})
  })),
  setFinish: (target, finish) => set((state) => ({
    finishes: { ...state.finishes, [target]: finish },
    colors: { ...state.colors, [target]: finish.color }
  })),
  toggleFurniture: () => set((state) => ({ showFurniture: !state.showFurniture })),
  toggleLabels: () => set((state) => ({ showLabels: !state.showLabels })),
  setCameraMode: (cameraMode) => set({ cameraMode, walkInput: { ...emptyWalkInput }, selectedFurnitureId: null }),
  setWalkInput: (direction, pressed) => set((state) => ({
    walkInput: state.walkInput[direction] === pressed
      ? state.walkInput
      : { ...state.walkInput, [direction]: pressed }
  })),
  clearWalkInput: () => set({ walkInput: { ...emptyWalkInput } }),
  addFurniture: (kind) => set((state) => {
    if (state.activeRoom === "exterior") return state;
    const roomItems = state.furniture.filter((item) => item.room === state.activeRoom);
    const offset = (roomItems.length % 4) * 0.35;
    const item: FurnitureItem = {
      id: `furniture-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      room: state.activeRoom,
      kind,
      position: [offset, 0, -0.5 + offset],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      color: kind === "plant" ? "#557653" : kind === "floor-lamp" ? "#b99b65" : "#8c9b8b"
    };
    return { furniture: [...state.furniture, item], selectedFurnitureId: item.id, selectedTarget: "sofa" };
  }),
  selectFurniture: (selectedFurnitureId) => set({ selectedFurnitureId }),
  updateFurniture: (id, patch) => set((state) => ({
    furniture: state.furniture.map((item) => item.id === id ? { ...item, ...patch } : item)
  })),
  removeSelectedFurniture: () => set((state) => ({
    furniture: state.furniture.filter((item) => item.id !== state.selectedFurnitureId),
    selectedFurnitureId: null
  })),
  setTransformMode: (transformMode) => set({ transformMode }),
  reset: () => set({
    colors: { ...initialColors },
    finishes: { ...initialFinishes },
    showFurniture: true,
    activeRoom: "exterior",
    cameraMode: "orbit",
    walkInput: { ...emptyWalkInput },
    furniture: [],
    selectedFurnitureId: null,
    transformMode: "translate"
  })
}));
