import { ACCESSORIES } from './optionsData';

function HairBack({ style, color }) {
  if (style === 'long') {
    return <path d="M70 60 C55 90 55 170 65 210 L85 210 C78 170 80 100 90 65 Z" fill={color} />;
  }
  if (style === 'ponytail') {
    return <path d="M128 55 C150 60 158 90 148 120 C144 100 136 80 122 68 Z" fill={color} />;
  }
  return null;
}

function HairFront({ style, color }) {
  switch (style) {
    case 'bun':
      return (
        <g fill={color}>
          <circle cx="100" cy="40" r="34" />
          <circle cx="100" cy="18" r="14" />
        </g>
      );
    case 'long':
    case 'short':
    case 'ponytail':
    default:
      return (
        <g fill={color}>
          <path d="M66 45 C66 15 134 15 134 45 L134 58 C120 44 80 44 66 58 Z" />
        </g>
      );
  }
}

function Top({ style, color }) {
  if (style === 'crop') {
    return <path d="M70 120 C70 108 130 108 130 120 L128 148 C110 154 90 154 72 148 Z" fill={color} />;
  }
  if (style === 'blouse') {
    return (
      <path
        d="M62 112 L78 104 L100 116 L122 104 L138 112 L132 168 C110 176 90 176 68 168 Z"
        fill={color}
      />
    );
  }
  return <path d="M64 110 L78 102 L100 114 L122 102 L136 110 L130 168 C110 176 90 176 70 168 Z" fill={color} />;
}

function Bottom({ style, color }) {
  if (style === 'skirt') {
    return <path d="M72 168 L128 168 L140 210 L60 210 Z" fill={color} />;
  }
  if (style === 'shorts') {
    return (
      <g fill={color}>
        <path d="M72 168 L98 168 L96 200 L76 200 Z" />
        <path d="M102 168 L128 168 L124 200 L104 200 Z" />
      </g>
    );
  }
  return (
    <g fill={color}>
      <path d="M72 168 L98 168 L94 238 L78 238 Z" />
      <path d="M102 168 L128 168 L122 238 L106 238 Z" />
    </g>
  );
}

function Shoes({ color, bottomStyle }) {
  const y = bottomStyle === 'pants' ? 238 : 210;
  return (
    <g fill={color}>
      <ellipse cx="82" cy={y + 6} rx="12" ry="7" />
      <ellipse cx="118" cy={y + 6} rx="12" ry="7" />
    </g>
  );
}

function AccessoryOverlay({ accessory }) {
  const acc = ACCESSORIES.find((a) => a.id === accessory);
  if (!acc || !acc.emoji) return null;

  const positions = {
    glasses: { x: 100, y: 42, size: 26 },
    hat: { x: 100, y: 12, size: 46 },
    bow: { x: 132, y: 30, size: 26 },
    crown: { x: 100, y: 10, size: 34 },
    bag: { x: 148, y: 150, size: 30 },
  };
  const pos = positions[acc.id] || { x: 100, y: 40, size: 26 };

  return (
    <text
      x={pos.x}
      y={pos.y}
      fontSize={pos.size}
      textAnchor="middle"
      dominantBaseline="middle"
    >
      {acc.emoji}
    </text>
  );
}

export default function Doll({ outfit }) {
  const {
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

  return (
    <svg viewBox="0 0 200 260" className="doll-svg" role="img" aria-label="Personnage habillé">
      <HairBack style={hairStyle} color={hairColor} />
      <Shoes color={shoeColor} bottomStyle={bottomStyle} />
      <Bottom style={bottomStyle} color={bottomColor} />

      {/* arms */}
      <g fill={skin}>
        <rect x="56" y="112" width="14" height="55" rx="7" transform="rotate(-8 56 112)" />
        <rect x="130" y="112" width="14" height="55" rx="7" transform="rotate(8 130 112)" />
      </g>

      <Top style={topStyle} color={topColor} />

      {/* neck + head */}
      <g fill={skin}>
        <rect x="92" y="72" width="16" height="18" />
        <circle cx="100" cy="52" r="30" />
      </g>

      <HairFront style={hairStyle} color={hairColor} />
      <AccessoryOverlay accessory={accessory} />

      {/* face */}
      <g fill="#3a2e2e">
        <circle cx="90" cy="52" r="2.2" />
        <circle cx="110" cy="52" r="2.2" />
        <path d="M93 62 Q100 67 107 62" stroke="#c9576e" strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>
      <g fill="#ff9eb5" opacity="0.7">
        <circle cx="80" cy="58" r="5" />
        <circle cx="120" cy="58" r="5" />
      </g>
    </svg>
  );
}
