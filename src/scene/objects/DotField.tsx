import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Color, type ShaderMaterial } from "three";
import { dotFieldFragmentShader, dotFieldVertexShader } from "../shaders/dotField";

type DotFieldProps = {
  baseColor: string;
  dotColor: string;
  progress: number;
};

export function DotField({ baseColor, dotColor, progress }: DotFieldProps) {
  const materialRef = useRef<ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uColorA: { value: new Color(baseColor) },
      uColorB: { value: new Color(dotColor) },
      uProgress: { value: 0 },
      uTime: { value: 0 },
    }),
    [baseColor, dotColor],
  );

  useFrame(({ clock }, delta) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value = clock.elapsedTime;
    materialRef.current.uniforms.uProgress.value +=
      (progress - materialRef.current.uniforms.uProgress.value) * Math.min(delta * 5, 1);

    materialRef.current.uniforms.uColorA.value.lerp(new Color(baseColor), Math.min(delta * 4, 1));
    materialRef.current.uniforms.uColorB.value.lerp(new Color(dotColor), Math.min(delta * 4, 1));
  });

  return (
    <mesh position={[0, 0, -8]} scale={[18, 10, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        vertexShader={dotFieldVertexShader}
        fragmentShader={dotFieldFragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}
