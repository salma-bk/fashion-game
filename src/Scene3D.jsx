import { Canvas } from '@react-three/fiber';
import { PresentationControls, ContactShadows } from '@react-three/drei';
import Character3D from './Character3D';

function Lights() {
  return (
    <>
      <ambientLight intensity={0.7} />
      <hemisphereLight args={['#fff3fa', '#6b4a63', 0.55]} />
      <directionalLight position={[3, 5, 4]} intensity={1.15} castShadow shadow-mapSize={[1024, 1024]} />
    </>
  );
}

export default function Scene3D({ outfit, interactive = true }) {
  return (
    <Canvas
      shadows={interactive}
      dpr={interactive ? [1, 2] : 1}
      frameloop={interactive ? 'always' : 'demand'}
      camera={{ position: [0, 0, 4.6], fov: 34 }}
      gl={{ alpha: true, antialias: true }}
    >
      <Lights />
      {interactive ? (
        <PresentationControls
          global
          polar={[-0.2, 0.35]}
          azimuth={[-1.3, 1.3]}
          rotation={[0, 0.4, 0]}
          config={{ mass: 1, tension: 220, friction: 26 }}
          snap={{ mass: 2, tension: 300 }}
        >
          <Character3D outfit={outfit} />
        </PresentationControls>
      ) : (
        <group rotation={[0, 0.5, 0]}>
          <Character3D outfit={outfit} />
        </group>
      )}
      {interactive && <ContactShadows position={[0, -1.3, 0]} opacity={0.4} scale={4} blur={2.2} far={2} />}
    </Canvas>
  );
}
