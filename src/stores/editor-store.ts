import { create } from "zustand";

export type RoomId = "exterior" | "living" | "kitchen" | "bedroom" | "bathroom";
export type EditableTarget = "walls" | "floor" | "sofa" | "chair" | "bed" | "cabinet";

type EditorState = {
  activeRoom: RoomId;
  selectedTarget: EditableTarget;
  colors: Record<EditableTarget, string>;
  showFurniture: boolean;
  showLabels: boolean;
  setRoom: (room: RoomId) => void;
  setTarget: (target: EditableTarget) => void;
  setColor: (target: EditableTarget, color: string) => void;
  toggleFurniture: () => void;
  toggleLabels: () => void;
  reset: () => void;
};

const initialColors: Record<EditableTarget, string> = {
  walls: "#e8e2d8",
  floor: "#a77c55",
  sofa: "#8c9b8b",
  chair: "#c69b67",
  bed: "#d9d2c5",
  cabinet: "#7a6653"
};

export const useEditorStore = create<EditorState>((set) => ({
  activeRoom: "exterior",
  selectedTarget: "walls",
  colors: { ...initialColors },
  showFurniture: true,
  showLabels: true,
  setRoom: (activeRoom) => set({ activeRoom }),
  setTarget: (selectedTarget) => set({ selectedTarget }),
  setColor: (target, color) => set((state) => ({
    colors: { ...state.colors, [target]: color }
  })),
  toggleFurniture: () => set((state) => ({ showFurniture: !state.showFurniture })),
  toggleLabels: () => set((state) => ({ showLabels: !state.showLabels })),
  reset: () => set({ colors: { ...initialColors }, showFurniture: true, activeRoom: "exterior" })
}));
