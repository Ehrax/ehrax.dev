// Decorative blueprint telemetry readouts drawn straight INTO the scene as
// canvas textures on planes lying in the drafting-table plane — no DOM/Html.
// Positions snap to the floor grid: major lines sit on multiples of 8, so a
// major cell center is at i*8 + 4. Values random-walk; the camera block also
// shows real scroll progress. Textures redraw imperatively on an interval
// tick (no React re-renders, no per-scroll-frame subscription) with an RGB
// split and occasional glyph scramble — deliberately glitchy, not readable.
// Reduced motion: no interval, one static draw.
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { CanvasTexture, LinearFilter, type MeshBasicMaterial } from "three";
import { usePrefersReducedMotion } from "~/hooks/usePrefersReducedMotion";
import { FLOOR_POSITION, FLOOR_ROLL_Z, FLOOR_TILT } from "~/scene/scenes/landingTuning";
import { getFloorEffectOpacity } from "~/scene/sceneTransition";
import { useSceneStore } from "~/state/sceneStore";

const GRID_PITCH = 8;

// Center of major grid cell (i, j), lifted just above the floor plane.
function cellCenter(i: number, j: number): [number, number, number] {
  return [i * GRID_PITCH + GRID_PITCH / 2, j * GRID_PITCH + GRID_PITCH / 2, 0.04];
}

const SCRAMBLE_GLYPHS = "0134578#%/¦≡∆";

function scramble(text: string): string {
  let out = "";
  for (const ch of text) {
    out +=
      ch !== "\n" && ch !== " " && Math.random() < 0.07
        ? SCRAMBLE_GLYPHS[Math.floor(Math.random() * SCRAMBLE_GLYPHS.length)]
        : ch;
  }
  return out;
}

const TEXTURE_SIZE = 256;

function createReadoutTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = TEXTURE_SIZE;
  canvas.height = TEXTURE_SIZE;
  const ctx = canvas.getContext("2d");
  const texture = new CanvasTexture(canvas);
  texture.minFilter = LinearFilter;
  return { ctx, texture };
}

// Mono text with a chromatic (RGB-split) double exposure, like a misregistered
// print on the blueprint. Offsets jitter per draw so the split crawls.
function drawReadout(ctx: CanvasRenderingContext2D, lines: string[]) {
  ctx.clearRect(0, 0, TEXTURE_SIZE, TEXTURE_SIZE);
  ctx.font = '24px "IBM Plex Mono", ui-monospace, monospace';
  ctx.textBaseline = "top";
  ctx.globalCompositeOperation = "lighter";
  const split = 1.2 + Math.random() * 1.6;
  const passes: Array<[number, string]> = [
    [-split, "rgba(255, 96, 140, 0.55)"],
    [split, "rgba(96, 220, 255, 0.55)"],
    [0, "rgba(225, 236, 255, 0.85)"],
  ];
  lines.forEach((line, row) => {
    const y = 18 + row * 38;
    for (const [dx, color] of passes) {
      ctx.fillStyle = color;
      ctx.fillText(scramble(line), 14 + dx, y);
    }
  });
}

// Each panel's resting opacity when the floor is at full light. The whole
// annotation group rides getFloorEffectOpacity, so the telemetry dims out with
// the drafting floor (well before About) and never reappears for the finale —
// every content section, and the closing name morph, stays clean of it.
const PANEL_BASE_OPACITY = { left: 0.6, camera: 0.6, note: 0.45 } as const;

export function TelemetryPanels() {
  const reducedMotion = usePrefersReducedMotion();

  const left = useMemo(createReadoutTexture, []);
  const camera = useMemo(createReadoutTexture, []);
  const note = useMemo(createReadoutTexture, []);

  const leftMat = useRef<MeshBasicMaterial>(null);
  const cameraMat = useRef<MeshBasicMaterial>(null);
  const noteMat = useRef<MeshBasicMaterial>(null);

  useFrame(() => {
    const fade = getFloorEffectOpacity(useSceneStore.getState().controllerValue);
    if (leftMat.current) leftMat.current.opacity = PANEL_BASE_OPACITY.left * fade;
    if (cameraMat.current) cameraMat.current.opacity = PANEL_BASE_OPACITY.camera * fade;
    if (noteMat.current) noteMat.current.opacity = PANEL_BASE_OPACITY.note * fade;
  });

  useEffect(() => {
    const walk = { x: 0.46021, y: -0.30817, z: 0.02114, cx: -0.62, cy: -0.62 };

    const draw = () => {
      const progress = useSceneStore.getState().controllerValue;
      if (left.ctx) {
        drawReadout(left.ctx, [
          `x0: ${walk.x.toFixed(5)}`,
          `y0: ${walk.y.toFixed(5)}`,
          `z0: ${walk.z.toFixed(5)}`,
        ]);
        left.texture.needsUpdate = true;
      }
      if (camera.ctx) {
        drawReadout(camera.ctx, [
          "camera:",
          ` ${walk.cx.toFixed(5)}`,
          ` ${walk.cy.toFixed(5)}`,
          `scroll: ${progress.toFixed(4)}`,
        ]);
        camera.texture.needsUpdate = true;
      }
      if (note.ctx) {
        drawReadout(note.ctx, ["rev. A — blueprint", "grid 8u / iso 30°"]);
        note.texture.needsUpdate = true;
      }
    };

    draw();
    if (reducedMotion) return;

    const id = setInterval(() => {
      const jump = Math.random() < 0.06 ? 8 : 1;
      walk.x += (Math.random() - 0.5) * 0.004 * jump;
      walk.y += (Math.random() - 0.5) * 0.004 * jump;
      walk.z += (Math.random() - 0.5) * 0.002 * jump;
      walk.cx += (Math.random() - 0.5) * 0.003 * jump;
      walk.cy += (Math.random() - 0.5) * 0.003 * jump;
      draw();
    }, 180);
    return () => clearInterval(id);
  }, [reducedMotion, left, camera, note]);

  useEffect(
    () => () => {
      left.texture.dispose();
      camera.texture.dispose();
      note.texture.dispose();
    },
    [left, camera, note],
  );

  // The two readouts stack as one tight annotation group on the right side
  // of the table, each spanning ~3 minor squares (well inside one major
  // cell). The planes share the floor group's tilt/roll so the text lies
  // flat on the drafting table.
  const groupOrigin = cellCenter(0, 0);
  return (
    <group rotation={[FLOOR_TILT, 0, FLOOR_ROLL_Z]} position={FLOOR_POSITION}>
      <mesh position={[groupOrigin[0], groupOrigin[1] + 1.2, groupOrigin[2]]}>
        <planeGeometry args={[2.2, 2.2]} />
        <meshBasicMaterial
          ref={leftMat}
          map={left.texture}
          transparent
          opacity={PANEL_BASE_OPACITY.left}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[groupOrigin[0], groupOrigin[1] - 1.2, groupOrigin[2]]}>
        <planeGeometry args={[2.2, 2.2]} />
        <meshBasicMaterial
          ref={cameraMat}
          map={camera.texture}
          transparent
          opacity={PANEL_BASE_OPACITY.camera}
          depthWrite={false}
        />
      </mesh>
      <mesh position={cellCenter(2, 1)}>
        <planeGeometry args={[2.2, 2.2]} />
        <meshBasicMaterial
          ref={noteMat}
          map={note.texture}
          transparent
          opacity={PANEL_BASE_OPACITY.note}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
