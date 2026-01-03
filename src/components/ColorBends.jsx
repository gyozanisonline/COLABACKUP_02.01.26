import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useControls } from 'leva';
import * as THREE from 'three';

const ColorBendsShader = {
    uniforms: {
        uTime: { value: 0 },
        uColor1: { value: new THREE.Color('#ff0000') },
        uColor2: { value: new THREE.Color('#0000ff') },
        uColor3: { value: new THREE.Color('#00ff00') },
        uSpeed: { value: 0.5 },
        uComplexity: { value: 3.0 },
    },
    vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    fragmentShader: `
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    uniform float uComplexity;
    varying vec2 vUv;

    // ... (noise functions same)

    void main() {
      float noise = snoise(vUv * uComplexity + uTime * uSpeed);
      vec3 color = mix(uColor1, uColor2, vUv.x + noise * 0.2);
      color = mix(color, uColor3, vUv.y + noise * 0.2);
      gl_FragColor = vec4(color, 1.0);
    }
  `
};

function GradientPlane() {
    const mesh = useRef();

    // Leva controls
    const { color1, color2, color3, speed, complexity } = useControls('Color Bends', {
        color1: '#ff0055',
        color2: '#0055ff',
        color3: '#55ff00',
        speed: { value: 0.2, min: 0.0, max: 2.0 },
        complexity: { value: 3.0, min: 1.0, max: 10.0 }
    });

    useFrame((state, delta) => {
        if (mesh.current) {
            mesh.current.material.uniforms.uTime.value += delta;
            mesh.current.material.uniforms.uColor1.value.set(color1);
            mesh.current.material.uniforms.uColor2.value.set(color2);
            mesh.current.material.uniforms.uColor3.value.set(color3);
            mesh.current.material.uniforms.uSpeed.value = speed;
            mesh.current.material.uniforms.uComplexity.value = complexity;
        }
    });

    return (
        <mesh ref={mesh} scale={[10, 10, 1]}>
            <planeGeometry args={[2, 2]} />
            <shaderMaterial args={[ColorBendsShader]} />
        </mesh>
    );
}

export default function ColorBends() {
    return (
        <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
            <Canvas>
                <GradientPlane />
            </Canvas>
        </div>
    );
}
