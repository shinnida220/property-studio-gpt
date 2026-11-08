import { create } from "zustand";

export type RoomId = "exterior" | "living" | "kitchen" | "bedroom" | "bathroom";
export type EditableTarget = "walls" | "floor" | "sofa" | "chair" | "bed" | "cabinet";
export type CameraMode = "orbit" | "walk";
export type WalkDirection = "forward" | "backward" | "left" | "right";

type EditorState = {
  activeRoom: RoomId;
  selectedTarget: EditableTarget;
  colors: Record<EditableTarget, string>;
  showFurniture: boolean;
  showLabels: boolean;
  cameraMode: CameraMode;
  walkInput: Record<WalkDirection, boolean>;
  setRoom: (room: RoomId) => void;
  setTarget: (target: EditableTarget) => void;
  setColor: (target: EditableTarget, color: string) => void;
  toggleFurniture: () => void;
  toggleLabels: () => void;
  setCameraMode: (mode: CameraMode) => void;
  setWalkInput: (direction: WalkDirection, pressed: boolean) => void;
  clearWalkInput: () => void;
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

const emptyWalkInput = { forward: false, backward: false, left: false, right: false };

export const useEditorStore = create<EditorState>((set) => ({
  activeRoom: "exterior",
  selectedTarget: "walls",
  colors: { ...initialColors },
  showFurniture: true,
  showLabels: true,
  cameraMode: "orbit",
  walkInput: { ...emptyWalkInput },
  setRoom: (activeRoom) => set({ activeRoom }),
  setTarget: (selectedTarget) => set({ selectedTarget }),
  setColor: (target, color) => set((state) => ({
    colors: { ...state.colors, [target]: color }
  })),
  toggleFurniture: () => set((state) => ({ showFurniture: !state.showFurniture })),
  toggleLabels: () => set((state) => ({ showLabels: !state.showLabels })),
  setCameraMode: (cameraMode) => set({ cameraMode, walkInput: { ...emptyWalkInput } }),
  setWalkInput: (direction, pressed) => set((state) => ({
    walkInput: state.walkInput[direction] === pressed
      ? state.walkInput
      : { ...state.walkInput, [direction]: pressed }
  })),
  clearWalkInput: () => set({ walkInput: { ...emptyWalkInput } }),
  reset: () => set({
    colors: { ...initialColors },
    showFurniture: true,
    activeRoom: "exterior",
    cameraMode: "orbit",
    walkInput: { ...emptyWalkInput }
  })
}));
