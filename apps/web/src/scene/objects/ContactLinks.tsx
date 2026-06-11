// Contact link buttons rendered in the canvas (not DOM): luminous blueprint
// outlines with mono labels that light up on hover and tear with the shared
// corruption clock. Clickable via R3F raycasting; an sr-only DOM list in the
// Contact section carries the same links for a11y/SEO. They reveal a beat after
// the title + email as the user scrolls the closing stretch.
import { type ThreeEvent, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  CanvasTexture,
  Color,
  type Group,
  LinearFilter,
  type MeshBasicMaterial,
  type ShaderMaterial,
} from "three";
import { usePrefersReducedMotion } from "~/hooks/usePrefersReducedMotion";
import { useContent } from "~/i18n/useContent";
import { contactLinksReveal } from "~/scene/scenes/landingTuning";
import { glitchButtonFragmentShader, glitchButtonVertexShader } from "~/scene/shaders/glitchButton";
import { useSceneStore } from "~/state/sceneStore";

const BORDER_COLOR = new Color("#6f8fd8");
const BORDER_HOT = new Color("#cdecff");

const BUTTON_HEIGHT = 0.36;
const LABEL_HEIGHT = 0.15;
const BUTTON_PADDING = 0.5;
const BUTTON_GAP = 0.32;
// Just below the invitation + email cluster — one centred column, not parked
// at the bottom of the frame.
const ROW_Y = -0.45;

type ButtonModel = {
  id: string;
  href: string;
  external: boolean;
  texture: CanvasTexture;
  width: number;
  labelWidth: number;
  x: number;
};

// Mono label on a transparent canvas, sized to the text so the plane never
// stretches the glyphs. Mirrors the telemetry readout's typeface.
function makeLabel(text: string): { texture: CanvasTexture; aspect: number } {
  const canvas = document.createElement("canvas");
  const h = 96;
  const ctx = canvas.getContext("2d");
  const font = `600 52px "IBM Plex Mono", ui-monospace, monospace`;
  let textWidth = text.length * 30;
  if (ctx) {
    ctx.font = font;
    textWidth = ctx.measureText(text).width;
  }
  canvas.width = Math.ceil(textWidth) + 24;
  canvas.height = h;
  if (ctx) {
    ctx.font = font;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#eaf2ff";
    ctx.fillText(text, canvas.width / 2, h / 2 + 2);
  }
  const texture = new CanvasTexture(canvas);
  texture.minFilter = LinearFilter;
  return { texture, aspect: canvas.width / canvas.height };
}

function navigate(button: ButtonModel) {
  if (button.external) {
    window.open(button.href, "_blank", "noopener,noreferrer");
  } else {
    window.location.href = button.href;
  }
}

function LinkButton({ button }: { button: ButtonModel }) {
  const reducedMotion = usePrefersReducedMotion();
  const groupRef = useRef<Group>(null);
  const materialRef = useRef<ShaderMaterial>(null);
  const labelMaterialRef = useRef<MeshBasicMaterial>(null);
  const [hovered, setHovered] = useState(false);
  const hoverRef = useRef(0);
  const revealRef = useRef(0);
  const glitchUntilRef = useRef(0);
  const glitchNextRef = useRef(2 + button.x);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uHover: { value: 0 },
      uGlitch: { value: 0 },
      uReveal: { value: 0 },
      uAspect: { value: button.width / BUTTON_HEIGHT },
      uColor: { value: BORDER_COLOR.clone() },
      uColorHot: { value: BORDER_HOT.clone() },
    }),
    [button.width],
  );

  useEffect(() => {
    if (!hovered) return;
    document.body.style.cursor = "pointer";
    return () => {
      document.body.style.cursor = "";
    };
  }, [hovered]);

  useFrame((_, delta) => {
    const u = materialRef.current?.uniforms;
    if (!u) return;
    const t = (u.uTime.value as number) + delta;
    u.uTime.value = t;

    const reveal = contactLinksReveal(useSceneStore.getState().contactProgress);
    u.uReveal.value = reduceableLerp(u.uReveal.value as number, reveal, delta, reducedMotion);
    revealRef.current = reveal;
    // The label plane fades on the same reveal — without this the text floats
    // over earlier sections while the border is still hidden.
    if (labelMaterialRef.current) labelMaterialRef.current.opacity = u.uReveal.value as number;

    const hoverTarget = hovered ? 1 : 0;
    hoverRef.current = reduceableLerp(hoverRef.current, hoverTarget, delta, reducedMotion);
    u.uHover.value = hoverRef.current;
    // Tactile hover: the whole chip leans toward the cursor a touch.
    if (groupRef.current) {
      const scale = 1 + hoverRef.current * 0.06;
      groupRef.current.scale.setScalar(scale);
    }

    if (reducedMotion) {
      u.uGlitch.value = 0;
      return;
    }
    // Self-paced corruption flickers, decorrelated per button.
    if (t >= glitchNextRef.current) {
      glitchUntilRef.current = t + 0.4;
      glitchNextRef.current = t + 3 + ((t * 7.3) % 4);
    }
    const target = t < glitchUntilRef.current ? 1 : 0;
    u.uGlitch.value += (target - (u.uGlitch.value as number)) * Math.min(1, delta * 12);
  });

  return (
    <group ref={groupRef} position={[button.x, 0, 0]}>
      {/* Border-glow plane; also the raycast target. */}
      {/* biome-ignore lint/a11y/noStaticElementInteractions: R3F <mesh> is a canvas object, not a DOM element; the accessible links live in the Contact section's sr-only list. */}
      <mesh
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          if (revealRef.current < 0.5) return;
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          if (revealRef.current < 0.5) return;
          e.stopPropagation();
          navigate(button);
        }}
      >
        <planeGeometry args={[button.width, BUTTON_HEIGHT]} />
        <shaderMaterial
          ref={materialRef}
          transparent
          depthWrite={false}
          depthTest={false}
          vertexShader={glitchButtonVertexShader}
          fragmentShader={glitchButtonFragmentShader}
          uniforms={uniforms}
        />
      </mesh>
      {/* Label sits just in front so it composites over the glow. */}
      <mesh position={[0, 0, 0.01]} raycast={() => null}>
        <planeGeometry args={[button.labelWidth, LABEL_HEIGHT]} />
        <meshBasicMaterial
          ref={labelMaterialRef}
          map={button.texture}
          transparent
          opacity={0}
          depthWrite={false}
          depthTest={false}
        />
      </mesh>
    </group>
  );
}

// Frame-rate-independent ease toward a target; snaps under reduced motion.
function reduceableLerp(current: number, target: number, delta: number, snap: boolean): number {
  if (snap) return target;
  return current + (target - current) * Math.min(1, delta * 10);
}

export function ContactLinks() {
  const { contact } = useContent();

  const buttons = useMemo<ButtonModel[]>(() => {
    let cursor = 0;
    const models = contact.links.map((link) => {
      const { texture, aspect } = makeLabel(link.label);
      const labelWidth = LABEL_HEIGHT * aspect;
      const width = labelWidth + BUTTON_PADDING;
      const model: ButtonModel = {
        id: link.id,
        href: link.href,
        external: link.kind !== "email",
        texture,
        width,
        labelWidth,
        x: cursor + width / 2,
      };
      cursor += width + BUTTON_GAP;
      return model;
    });
    const totalWidth = cursor - BUTTON_GAP;
    // Re-centre the row around x = 0.
    for (const m of models) m.x -= totalWidth / 2;
    return models;
  }, [contact.links]);

  useEffect(
    () => () => {
      for (const b of buttons) b.texture.dispose();
    },
    [buttons],
  );

  return (
    <group position={[0, ROW_Y, 0]}>
      {buttons.map((button) => (
        <LinkButton key={button.id} button={button} />
      ))}
    </group>
  );
}
