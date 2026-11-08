"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { CapsuleCollider, CuboidCollider, Physics, RigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { useEditorStore, type RoomId, type WalkDirection } from "@/stores/editor-store";

const ROOM_ORDER: Exclude<RoomId, "exterior">[] = ["living", "kitchen", "bedroom", "bathroom"];
const ROOM_SIZE: Record<Exclude<RoomId, "exterior">, { width: number; depth: number }> = {
  living: { width: 7, depth: 6 },
  kitchen: { width: 6, depth: 5 },
  bedroom: { width: 6, depth: 5 },
  bathroom: { width: 4.5, depth: 4 }
};

function RoomCollision({ room, showFurniture }: { room: Exclude<RoomId, "exterior">; showFurniture: boolean }) {
  const { width, depth } = ROOM_SIZE[room];
  const wallHeight = 3;
  const wallThickness = 0.12;
  const doorwayWidth = 1.25;
  const frontSegmentWidth = (width - doorwayWidth) / 2;

  return (
    <RigidBody type="fixed" colliders={false}>
      <CuboidCollider args={[width / 2, 0.1, depth / 2]} position={[0, -0.1, 0]} />
      <CuboidCollider args={[wallThickness / 2, wallHeight / 2, depth / 2]} position={[-width / 2, wallHeight / 2, 0]} />
      <CuboidCollider args={[wallThickness / 2, wallHeight / 2, depth / 2]} position={[width / 2, wallHeight / 2, 0]} />
      <CuboidCollider args={[width / 2, wallHeight / 2, wallThickness / 2]} position={[0, wallHeight / 2, -depth / 2]} />
      <CuboidCollider args={[frontSegmentWidth / 2, wallHeight / 2, wallThickness / 2]} position={[-(doorwayWidth / 2 + frontSegmentWidth / 2), wallHeight / 2, depth / 2]} />
      <CuboidCollider args={[frontSegmentWidth / 2, wallHeight / 2, wallThickness / 2]} position={[(doorwayWidth / 2 + frontSegmentWidth / 2), wallHeight / 2, depth / 2]} />
      <CuboidCollider args={[doorwayWidth / 2, 0.3, wallThickness / 2]} position={[0, wallHeight - 0.3, depth / 2]} />
      {showFurniture && room === "living" && (
        <>
          <CuboidCollider args={[1.05, 0.48, 0.44]} position={[0, 0.48, 1]} />
          <CuboidCollider args={[0.42, 0.5, 0.42]} position={[-2.1, 0.5, -1.4]} />
          <CuboidCollider args={[0.65, 0.38, 0.4]} position={[0.5, 0.38, -0.75]} />
        </>
      )}
      {showFurniture && room === "kitchen" && (
        <>
          <CuboidCollider args={[2.2, 0.9, 0.38]} position={[0, 0.95, -1.65]} />
          <CuboidCollider args={[0.85, 0.45, 0.48]} position={[0, 0.82, 0.7]} />
          <CuboidCollider args={[0.4, 0.5, 0.4]} position={[-1.25, 0.5, 0.7]} />
          <CuboidCollider args={[0.4, 0.5, 0.4]} position={[1.25, 0.5, 0.7]} />
        </>
      )}
      {showFurniture && room === "bedroom" && (
        <>
          <CuboidCollider args={[0.95, 0.52, 1.12]} position={[0, 0.52, 0.2]} />
          <CuboidCollider args={[0.42, 0.9, 0.38]} position={[-2, 0.9, -1.5]} />
        </>
      )}
      {room === "bathroom" && (
        <>
          <CuboidCollider args={[0.65, 0.52, 0.65]} position={[0.9, 0.52, -1]} />
          <CuboidCollider args={[0.34, 0.46, 0.34]} position={[-1, 0.46, 0.7]} />
        </>
      )}
    </RigidBody>
  );
}

function Player({ room }: { room: Exclude<RoomId, "exterior"> }) {
  const body = useRef<any>(null);
  const { camera, gl } = useThree();
  const yaw = useRef(0);
  const pitch = useRef(0);
  const keys = useRef(new Set<string>());
  const touchLook = useRef<{ id: number; x: number; y: number } | null>(null);
  const walkInput = useEditorStore((state) => state.walkInput);
  const setRoom = useEditorStore((state) => state.setRoom);
  const { depth } = ROOM_SIZE[room];
  const transitionLock = useRef(false);

  useEffect(() => {
    const element = gl.domElement;
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = 68;
      camera.updateProjectionMatrix();
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (["KeyW", "KeyA", "KeyS", "KeyD", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.code)) event.preventDefault();
      keys.current.add(event.code);
    };
    const onKeyUp = (event: KeyboardEvent) => keys.current.delete(event.code);
    const onBlur = () => keys.current.clear();
    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "touch") {
        touchLook.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
      } else if (document.pointerLockElement !== element) {
        void element.requestPointerLock?.();
      }
    };
    const onPointerMove = (event: PointerEvent) => {
      if (document.pointerLockElement === element) {
        yaw.current -= event.movementX * 0.0022;
        pitch.current = THREE.MathUtils.clamp(pitch.current - event.movementY * 0.0022, -1.15, 1.15);
      } else if (touchLook.current?.id === event.pointerId) {
        const dx = event.clientX - touchLook.current.x;
        const dy = event.clientY - touchLook.current.y;
        touchLook.current.x = event.clientX;
        touchLook.current.y = event.clientY;
        yaw.current -= dx * 0.004;
        pitch.current = THREE.MathUtils.clamp(pitch.current - dy * 0.004, -1.15, 1.15);
      }
    };
    const onPointerUp = (event: PointerEvent) => {
      if (touchLook.current?.id === event.pointerId) touchLook.current = null;
    };
    element.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);
    return () => {
      element.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
      if (document.pointerLockElement === element) document.exitPointerLock();
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.fov = 42;
        camera.updateProjectionMatrix();
      }
    };
  }, [camera, gl]);

  useEffect(() => {
    if (!body.current) return;
    body.current.setTranslation({ x: 0, y: 0.92, z: depth / 2 - 1.35 }, true);
    body.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
    yaw.current = 0;
    pitch.current = 0;
    transitionLock.current = false;
  }, [room, depth]);

  useFrame(() => {
    const rigidBody = body.current;
    if (!rigidBody) return;
    const pressed = (direction: WalkDirection) => walkInput[direction];
    const forward = pressed("forward") || keys.current.has("KeyW") || keys.current.has("ArrowUp");
    const backward = pressed("backward") || keys.current.has("KeyS") || keys.current.has("ArrowDown");
    const left = pressed("left") || keys.current.has("KeyA") || keys.current.has("ArrowLeft");
    const right = pressed("right") || keys.current.has("KeyD") || keys.current.has("ArrowRight");
    const inputX = Number(right) - Number(left);
    const inputZ = Number(backward) - Number(forward);
    const length = Math.hypot(inputX, inputZ) || 1;
    const speed = 3.25;
    const directionX = (Math.cos(yaw.current) * inputX + Math.sin(yaw.current) * inputZ) / length;
    const directionZ = (-Math.sin(yaw.current) * inputX + Math.cos(yaw.current) * inputZ) / length;
    const velocity = rigidBody.linvel();
    rigidBody.setLinvel({ x: directionX * speed, y: velocity.y, z: directionZ * speed }, true);

    const position = rigidBody.translation();
    camera.position.set(position.x, position.y + 0.82, position.z);
    camera.rotation.order = "YXZ";
    camera.rotation.set(pitch.current, yaw.current, 0);

    if (!transitionLock.current && position.z > depth / 2 + 0.05 && Math.abs(position.x) < 0.72) {
      transitionLock.current = true;
      const index = ROOM_ORDER.indexOf(room);
      setRoom(ROOM_ORDER[(index + 1) % ROOM_ORDER.length]);
    }
  });

  return (
    <RigidBody
      ref={body}
      type="dynamic"
      colliders={false}
      position={[0, 0.92, depth / 2 - 1.35]}
      enabledRotations={[false, false, false]}
      linearDamping={8}
      angularDamping={8}
      canSleep={false}
      ccd
    >
      <CapsuleCollider args={[0.48, 0.28]} />
    </RigidBody>
  );
}

export function WalkthroughPhysics({ room }: { room: RoomId }) {
  const showFurniture = useEditorStore((state) => state.showFurniture);
  if (room === "exterior") return null;
  return (
    <Physics gravity={[0, -9.81, 0]} timeStep={1 / 60}>
      <RoomCollision room={room} showFurniture={showFurniture} />
      <Player room={room} />
    </Physics>
  );
}

export function WalkTouchControls() {
  const setWalkInput = useEditorStore((state) => state.setWalkInput);
  const clearWalkInput = useEditorStore((state) => state.clearWalkInput);
  const directions: { key: WalkDirection; label: string; symbol: string }[] = [
    { key: "forward", label: "Move forward", symbol: "↑" },
    { key: "left", label: "Move left", symbol: "←" },
    { key: "backward", label: "Move backward", symbol: "↓" },
    { key: "right", label: "Move right", symbol: "→" }
  ];
  return (
    <div className="walk-touch-controls" onPointerUp={clearWalkInput} onPointerCancel={clearWalkInput} onPointerLeave={clearWalkInput}>
      {directions.map(({ key, label, symbol }) => (
        <button
          key={key}
          type="button"
          aria-label={label}
          onContextMenu={(event) => event.preventDefault()}
          onPointerDown={(event) => { event.preventDefault(); setWalkInput(key, true); }}
          onPointerUp={(event) => { event.preventDefault(); setWalkInput(key, false); }}
          onPointerCancel={() => setWalkInput(key, false)}
        >{symbol}</button>
      ))}
    </div>
  );
}
