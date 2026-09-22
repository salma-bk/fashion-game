export const SKIN_TONES = ['#ffe0bd', '#f1c27d', '#e0ac69', '#c68642', '#8d5524'];

export const HAIR_STYLES = [
  { id: 'short', label: 'Court' },
  { id: 'long', label: 'Long' },
  { id: 'bun', label: 'Chignon' },
  { id: 'ponytail', label: 'Couette' },
];

export const HAIR_COLORS = ['#2b1b0e', '#5a3825', '#caa472', '#e8b7d4', '#7a5cc0', '#e53e5c'];

export const TOP_STYLES = [
  { id: 'tshirt', label: 'T-shirt' },
  { id: 'crop', label: 'Crop top' },
  { id: 'blouse', label: 'Blouse' },
];

export const TOP_COLORS = ['#ff6ea9', '#ffd23f', '#5ec8d8', '#a78bfa', '#ffffff', '#ff8552'];

export const BOTTOM_STYLES = [
  { id: 'skirt', label: 'Jupe' },
  { id: 'pants', label: 'Pantalon' },
  { id: 'shorts', label: 'Short' },
];

export const BOTTOM_COLORS = ['#2b2d42', '#ff6ea9', '#5ec8d8', '#ffd23f', '#ffffff', '#7a5cc0'];

export const SHOE_COLORS = ['#ff6ea9', '#2b2d42', '#ffffff', '#ffd23f', '#7a5cc0'];

export const ACCESSORIES = [
  { id: 'none', label: 'Aucun', emoji: '' },
  { id: 'glasses', label: 'Lunettes', emoji: '🕶️' },
  { id: 'hat', label: 'Chapeau', emoji: '👒' },
  { id: 'bow', label: 'Noeud', emoji: '🎀' },
  { id: 'crown', label: 'Couronne', emoji: '👑' },
  { id: 'bag', label: 'Sac', emoji: '👜' },
];

export const BACKGROUNDS = [
  { id: 'pink', label: 'Rose', value: 'linear-gradient(180deg, #ffe3ef 0%, #ffd1e3 100%)' },
  { id: 'sunset', label: 'Coucher de soleil', value: 'linear-gradient(180deg, #ffd6a5 0%, #ff9ecb 100%)' },
  { id: 'sky', label: 'Ciel', value: 'linear-gradient(180deg, #cdeffd 0%, #a5d8ff 100%)' },
  { id: 'lilac', label: 'Lilas', value: 'linear-gradient(180deg, #ead6ff 0%, #d0b3ff 100%)' },
];

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function randomOutfit() {
  return {
    skin: randomFrom(SKIN_TONES),
    hairStyle: randomFrom(HAIR_STYLES).id,
    hairColor: randomFrom(HAIR_COLORS),
    topStyle: randomFrom(TOP_STYLES).id,
    topColor: randomFrom(TOP_COLORS),
    bottomStyle: randomFrom(BOTTOM_STYLES).id,
    bottomColor: randomFrom(BOTTOM_COLORS),
    shoeColor: randomFrom(SHOE_COLORS),
    accessory: randomFrom(ACCESSORIES).id,
    background: randomFrom(BACKGROUNDS).id,
  };
}
