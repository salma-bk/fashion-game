import { useMemo } from 'react';

const GENDER_FACTOR = {
  femme: { shoulder: 1.0, hip: 1.12, height: 1.0 },
  homme: { shoulder: 1.24, hip: 0.9, height: 1.08 },
};

const BODY_FACTOR = {
  fine: 0.84,
  standard: 1.0,
  athletique: 1.1,
  pulpeuse: 1.26,
};

function useMetrics(gender, bodyType) {
  return useMemo(() => {
    const g = GENDER_FACTOR[gender] || GENDER_FACTOR.femme;
    const b = BODY_FACTOR[bodyType] ?? 1;
    const legLen = 0.95 * g.height;
    const torsoH = 0.74 * g.height;
    const neckH = 0.12;
    const headR = 0.32;
    const shoulderW = 0.46 * g.shoulder * b;
    const hipW = 0.42 * g.hip * b;
    const armR = 0.085 * Math.sqrt(b);
    const legR = 0.125 * Math.sqrt(b);
    const armLen = 0.68 * g.height;
    return { legLen, torsoH, neckH, headR, shoulderW, hipW, armR, legR, armLen };
  }, [gender, bodyType]);
}

function SkinMat({ color }) {
  return <meshPhysicalMaterial color={color} roughness={0.48} clearcoat={0.22} clearcoatRoughness={0.4} />;
}

function FabricMat({ color, roughness = 0.62 }) {
  return (
    <meshPhysicalMaterial color={color} roughness={roughness} sheen={0.35} sheenRoughness={0.7} sheenColor={color} />
  );
}

function HairMat({ color }) {
  return <meshPhysicalMaterial color={color} roughness={0.38} clearcoat={0.18} clearcoatRoughness={0.3} />;
}

function Shoes({ color, legGap, legR }) {
  return (
    <>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * legGap, legR * 0.4, legR * 0.5]} castShadow receiveShadow>
          <boxGeometry args={[legR * 1.5, legR * 0.7, legR * 2.3]} />
          <FabricMat color={color} roughness={0.42} />
        </mesh>
      ))}
    </>
  );
}

function BottomClothing({ style, color, legGap, legR, legLen, hipW }) {
  if (style === 'skirt') {
    const h = legLen * 0.42;
    return (
      <mesh position={[0, legLen - h / 2, 0]} castShadow>
        <cylinderGeometry args={[hipW * 0.52, hipW * 0.85, h, 24]} />
        <FabricMat color={color} />
      </mesh>
    );
  }

  if (style === 'shorts') {
    const h = legLen * 0.38;
    return (
      <>
        {[-1, 1].map((side) => (
          <mesh key={side} position={[side * legGap, legLen - h / 2, 0]} castShadow>
            <cylinderGeometry args={[legR * 1.18, legR * 1.1, h, 18]} />
            <FabricMat color={color} />
          </mesh>
        ))}
      </>
    );
  }

  const h = legLen * 0.96;
  return (
    <>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * legGap, h / 2, 0]} castShadow>
          <cylinderGeometry args={[legR * 1.15, legR * 1.08, h, 18]} />
          <FabricMat color={color} />
        </mesh>
      ))}
      {style === 'cargo' && (
        <mesh position={[legGap, legLen * 0.55, legR * 1.1]} castShadow>
          <boxGeometry args={[legR * 0.9, legR * 0.9, legR * 0.4]} />
          <FabricMat color={color} />
        </mesh>
      )}
    </>
  );
}

function TopDetail({ style, color, shoulderW, yShoulder }) {
  if (style === 'hoodie') {
    return (
      <mesh position={[0, yShoulder + 0.02, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[shoulderW * 0.22, shoulderW * 0.06, 8, 16]} />
        <FabricMat color={color} />
      </mesh>
    );
  }
  if (style === 'jacket') {
    return (
      <mesh position={[0, yShoulder - 0.3, shoulderW * 0.36]} castShadow>
        <boxGeometry args={[0.035, 0.5, 0.02]} />
        <meshStandardMaterial color="#2b2b2b" roughness={0.4} />
      </mesh>
    );
  }
  if (style === 'blouse') {
    return (
      <mesh position={[0, yShoulder + 0.02, shoulderW * 0.3]} rotation={[0.4, 0, 0]} castShadow>
        <boxGeometry args={[shoulderW * 0.5, 0.06, 0.02]} />
        <FabricMat color={color} />
      </mesh>
    );
  }
  return null;
}

function Arm({ side, shoulderW, torsoTopY, armR, armLen, skin, sleeveColor, sleeveCoverage }) {
  const x = side * (shoulderW / 2 + armR * 0.3);
  const tilt = side * 0.16;
  return (
    <group position={[x, torsoTopY - armR * 0.3, 0]} rotation={[0, 0, -tilt]}>
      <mesh position={[0, -armLen / 2, 0]} castShadow>
        <cylinderGeometry args={[armR, armR * 0.85, armLen, 16]} />
        <SkinMat color={skin} />
      </mesh>
      {sleeveCoverage > 0 && (
        <mesh position={[0, -(armLen * sleeveCoverage) / 2, 0]} castShadow>
          <cylinderGeometry args={[armR * 1.18, armR * 1.05, armLen * sleeveCoverage, 16]} />
          <FabricMat color={sleeveColor} />
        </mesh>
      )}
      <mesh position={[0, -armLen - armR * 0.5, 0]} castShadow>
        <sphereGeometry args={[armR * 0.8, 12, 12]} />
        <SkinMat color={skin} />
      </mesh>
    </group>
  );
}

function Hair({ headR, style, color }) {
  const curlyOffsets = useMemo(() => {
    const pts = [];
    const n = 10;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      const r = headR * (0.75 + (i % 3) * 0.06);
      pts.push([Math.cos(a) * r, headR * (0.3 + (i % 2) * 0.18), Math.sin(a) * r * 0.85]);
    }
    return pts;
  }, [headR]);

  if (style === 'bald') return null;

  switch (style) {
    case 'long':
      return (
        <group>
          <mesh position={[0, headR * 0.35, 0]} scale={[1.05, 0.62, 1.05]} castShadow>
            <sphereGeometry args={[headR * 1.02, 24, 24]} />
            <HairMat color={color} />
          </mesh>
          <mesh position={[0, -headR * 0.1, -headR * 0.75]} rotation={[0.15, 0, 0]} castShadow>
            <cylinderGeometry args={[headR * 0.55, headR * 0.3, headR * 2.1, 16]} />
            <HairMat color={color} />
          </mesh>
        </group>
      );
    case 'bun':
      return (
        <group>
          <mesh position={[0, headR * 0.35, 0]} scale={[1.05, 0.6, 1.05]} castShadow>
            <sphereGeometry args={[headR * 1.02, 24, 24]} />
            <HairMat color={color} />
          </mesh>
          <mesh position={[0, headR * 0.95, -headR * 0.15]} castShadow>
            <sphereGeometry args={[headR * 0.42, 16, 16]} />
            <HairMat color={color} />
          </mesh>
        </group>
      );
    case 'ponytail':
      return (
        <group>
          <mesh position={[0, headR * 0.35, 0]} scale={[1.05, 0.6, 1.05]} castShadow>
            <sphereGeometry args={[headR * 1.02, 24, 24]} />
            <HairMat color={color} />
          </mesh>
          <mesh position={[0, headR * 0.35, -headR * 1.05]} rotation={[1.0, 0, 0]} castShadow>
            <coneGeometry args={[headR * 0.32, headR * 1.5, 14]} />
            <HairMat color={color} />
          </mesh>
        </group>
      );
    case 'bob':
      return (
        <mesh position={[0, headR * 0.05, 0]} scale={[1.12, 0.95, 1.12]} castShadow>
          <sphereGeometry args={[headR * 1.0, 24, 24]} />
          <HairMat color={color} />
        </mesh>
      );
    case 'curly':
      return (
        <group>
          {curlyOffsets.map((p, i) => (
            <mesh key={i} position={p} castShadow>
              <sphereGeometry args={[headR * 0.32, 12, 12]} />
              <HairMat color={color} />
            </mesh>
          ))}
        </group>
      );
    case 'undercut':
      return (
        <mesh position={[0, headR * 0.55, 0]} scale={[0.95, 0.45, 0.95]} castShadow>
          <sphereGeometry args={[headR * 0.98, 20, 20]} />
          <HairMat color={color} />
        </mesh>
      );
    case 'short':
    default:
      return (
        <mesh position={[0, headR * 0.35, 0]} scale={[1.03, 0.55, 1.03]} castShadow>
          <sphereGeometry args={[headR * 1.0, 20, 20]} />
          <HairMat color={color} />
        </mesh>
      );
  }
}

function Accessory({ type, headR, topColor, bottomColor }) {
  if (!type || type === 'none') return null;

  switch (type) {
    case 'glasses': {
      const lensR = headR * 0.17;
      return (
        <group position={[0, headR * 0.05, headR * 0.9]}>
          {[-1, 1].map((side) => (
            <mesh key={side} position={[side * headR * 0.33, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[lensR, lensR, headR * 0.05, 16]} />
              <meshStandardMaterial color="#2b2b2b" roughness={0.25} metalness={0.3} />
            </mesh>
          ))}
          <mesh>
            <boxGeometry args={[headR * 0.3, headR * 0.04, headR * 0.04]} />
            <meshStandardMaterial color="#2b2b2b" />
          </mesh>
        </group>
      );
    }
    case 'hat':
      return (
        <group position={[0, headR * 1.05, 0]}>
          <mesh position={[0, headR * 0.35, 0]}>
            <coneGeometry args={[headR * 0.65, headR * 0.9, 20]} />
            <meshStandardMaterial color={topColor} roughness={0.5} />
          </mesh>
          <mesh>
            <cylinderGeometry args={[headR * 1.05, headR * 1.05, headR * 0.08, 24]} />
            <meshStandardMaterial color={topColor} roughness={0.5} />
          </mesh>
        </group>
      );
    case 'cap':
      return (
        <group position={[0, headR * 0.85, 0]}>
          <mesh scale={[1, 0.7, 1]}>
            <sphereGeometry args={[headR * 1.05, 20, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color={topColor} roughness={0.5} />
          </mesh>
          <mesh position={[0, -headR * 0.1, headR * 0.9]} rotation={[0.3, 0, 0]}>
            <boxGeometry args={[headR * 0.6, headR * 0.05, headR * 0.4]} />
            <meshStandardMaterial color={topColor} roughness={0.5} />
          </mesh>
        </group>
      );
    case 'bow': {
      const s = headR * 0.28;
      return (
        <group position={[headR * 0.7, headR * 0.5, 0]} rotation={[0, 0, 0.15]}>
          <mesh position={[-s * 0.55, 0, 0]} rotation={[0, 0, 0.5]}>
            <coneGeometry args={[s * 0.55, s, 4]} />
            <meshStandardMaterial color={bottomColor} roughness={0.5} />
          </mesh>
          <mesh position={[s * 0.55, 0, 0]} rotation={[0, 0, -0.5]}>
            <coneGeometry args={[s * 0.55, s, 4]} />
            <meshStandardMaterial color={bottomColor} roughness={0.5} />
          </mesh>
          <mesh>
            <sphereGeometry args={[s * 0.35, 10, 10]} />
            <meshStandardMaterial color={bottomColor} roughness={0.5} />
          </mesh>
        </group>
      );
    }
    case 'crown':
      return (
        <group position={[0, headR * 1.02, 0]}>
          <mesh>
            <cylinderGeometry args={[headR * 0.68, headR * 0.72, headR * 0.28, 20]} />
            <meshStandardMaterial color="#d4af37" roughness={0.3} metalness={0.65} />
          </mesh>
          {[0, 1, 2, 3, 4].map((i) => {
            const a = (i / 5) * Math.PI * 2;
            return (
              <mesh key={i} position={[Math.cos(a) * headR * 0.68, headR * 0.28, Math.sin(a) * headR * 0.68]}>
                <coneGeometry args={[headR * 0.12, headR * 0.3, 6]} />
                <meshStandardMaterial color="#d4af37" roughness={0.3} metalness={0.65} />
              </mesh>
            );
          })}
        </group>
      );
    case 'scarf':
      return (
        <mesh position={[0, -headR * 1.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[headR * 0.65, headR * 0.22, 10, 20]} />
          <meshStandardMaterial color={bottomColor} roughness={0.6} />
        </mesh>
      );
    default:
      return null;
  }
}

function Head({ headY, headR, skin, hairStyle, hairColor, accessory, topColor, bottomColor }) {
  return (
    <group position={[0, headY, 0]}>
      <mesh castShadow scale={[1, 1.06, 0.94]}>
        <sphereGeometry args={[headR, 32, 32]} />
        <SkinMat color={skin} />
      </mesh>

      {/* nose */}
      <mesh position={[0, -headR * 0.03, headR * 0.95]} scale={[0.55, 0.7, 0.6]}>
        <sphereGeometry args={[headR * 0.14, 10, 10]} />
        <SkinMat color={skin} />
      </mesh>

      {/* eyebrows */}
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          position={[side * headR * 0.32, headR * 0.22, headR * 0.86]}
          rotation={[0, 0, side * -0.12]}
        >
          <boxGeometry args={[headR * 0.26, headR * 0.045, headR * 0.03]} />
          <meshStandardMaterial color="#3a2a20" roughness={0.7} />
        </mesh>
      ))}

      {/* eyes (whites) */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * headR * 0.32, headR * 0.05, headR * 0.88]}>
          <sphereGeometry args={[headR * 0.1, 12, 12]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>
      ))}
      {/* eyes (iris/pupil) */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * headR * 0.32, headR * 0.05, headR * 0.95]}>
          <sphereGeometry args={[headR * 0.06, 10, 10]} />
          <meshPhysicalMaterial color="#2b2b2b" roughness={0.2} clearcoat={0.8} clearcoatRoughness={0.15} />
        </mesh>
      ))}
      {/* catchlights */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * headR * 0.32 + headR * 0.02, headR * 0.08, headR * 1.0]}>
          <sphereGeometry args={[headR * 0.018, 6, 6]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}

      {/* mouth (smile curve) */}
      <mesh position={[0, -headR * 0.38, headR * 0.87]} rotation={[0, 0, Math.PI]}>
        <torusGeometry args={[headR * 0.16, headR * 0.026, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#c9576e" roughness={0.4} />
      </mesh>

      {/* blush */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * headR * 0.55, -headR * 0.15, headR * 0.68]}>
          <sphereGeometry args={[headR * 0.14, 10, 10]} />
          <meshStandardMaterial color="#ff9eb5" transparent opacity={0.4} roughness={0.8} />
        </mesh>
      ))}

      <Hair headR={headR} style={hairStyle} color={hairColor} />
      <Accessory type={accessory} headR={headR} topColor={topColor} bottomColor={bottomColor} />
    </group>
  );
}

function Bag({ yShoulder, hipW }) {
  const bagColor = '#8b5e34';
  return (
    <group>
      <mesh position={[hipW * 0.85, yShoulder * 0.62, hipW * 0.3]} castShadow>
        <boxGeometry args={[0.22, 0.26, 0.14]} />
        <meshStandardMaterial color={bagColor} roughness={0.6} />
      </mesh>
      <mesh position={[hipW * 0.2, yShoulder * 0.85, hipW * 0.05]} rotation={[0, 0, 0.7]}>
        <boxGeometry args={[0.04, yShoulder * 0.5, 0.04]} />
        <meshStandardMaterial color={bagColor} roughness={0.6} />
      </mesh>
    </group>
  );
}

export default function Character3D({ outfit }) {
  const {
    gender = 'femme',
    bodyType = 'standard',
    skin,
    hairStyle,
    hairColor,
    topStyle,
    topColor,
    bottomStyle,
    bottomColor,
    shoeColor,
    accessory,
  } = outfit;

  const m = useMetrics(gender, bodyType);
  const yHip = m.legLen;
  const yShoulder = yHip + m.torsoH;
  const yHead = yShoulder + m.neckH + m.headR;
  const legGap = m.hipW * 0.3;

  const sleeveCoverage = topStyle === 'hoodie' || topStyle === 'jacket' ? 0.72 : 0;
  const coverageMap = { crop: 0.48, tank: 0.6 };
  const coverage = coverageMap[topStyle] ?? 1;
  const topH = m.torsoH * coverage;
  const bottomWidthAtCoverage = m.shoulderW + (m.hipW - m.shoulderW) * coverage;

  const totalHeight = yHead + m.headR;

  return (
    <group position={[0, -totalHeight / 2, 0]}>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * legGap, m.legLen / 2, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[m.legR * 0.95, m.legR, m.legLen, 20]} />
          <SkinMat color={skin} />
        </mesh>
      ))}

      <BottomClothing
        style={bottomStyle}
        color={bottomColor}
        legGap={legGap}
        legR={m.legR}
        legLen={m.legLen}
        hipW={m.hipW}
      />

      <Shoes color={shoeColor} legGap={legGap} legR={m.legR} />

      <mesh position={[0, yHip + m.torsoH / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[m.shoulderW / 2, m.hipW / 2, m.torsoH, 24]} />
        <SkinMat color={skin} />
      </mesh>

      <mesh position={[0, yShoulder - topH / 2, 0]} castShadow>
        <cylinderGeometry args={[(m.shoulderW * 1.1) / 2, (bottomWidthAtCoverage * 1.1) / 2, topH, 24]} />
        <FabricMat color={topColor} />
      </mesh>
      <TopDetail style={topStyle} color={topColor} shoulderW={m.shoulderW} yShoulder={yShoulder} />

      <Arm
        side={-1}
        shoulderW={m.shoulderW}
        torsoTopY={yShoulder}
        armR={m.armR}
        armLen={m.armLen}
        skin={skin}
        sleeveColor={topColor}
        sleeveCoverage={sleeveCoverage}
      />
      <Arm
        side={1}
        shoulderW={m.shoulderW}
        torsoTopY={yShoulder}
        armR={m.armR}
        armLen={m.armLen}
        skin={skin}
        sleeveColor={topColor}
        sleeveCoverage={sleeveCoverage}
      />

      <mesh position={[0, yShoulder + m.neckH / 2, 0]} castShadow>
        <cylinderGeometry args={[m.headR * 0.32, m.headR * 0.36, m.neckH, 16]} />
        <SkinMat color={skin} />
      </mesh>

      <Head
        headY={yHead}
        headR={m.headR}
        skin={skin}
        hairStyle={hairStyle}
        hairColor={hairColor}
        accessory={accessory}
        topColor={topColor}
        bottomColor={bottomColor}
      />

      {accessory === 'bag' && <Bag yShoulder={yShoulder} hipW={m.hipW} />}
    </group>
  );
}
