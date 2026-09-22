import { useEffect, useState } from 'react';
import Doll from './Doll';
import { ColorPicker, StylePicker } from './Picker';
import {
  SKIN_TONES,
  HAIR_STYLES,
  HAIR_COLORS,
  TOP_STYLES,
  TOP_COLORS,
  BOTTOM_STYLES,
  BOTTOM_COLORS,
  SHOE_COLORS,
  ACCESSORIES,
  BACKGROUNDS,
  randomOutfit,
} from './optionsData';
import './App.css';

const DEFAULT_OUTFIT = {
  skin: SKIN_TONES[0],
  hairStyle: 'long',
  hairColor: HAIR_COLORS[0],
  topStyle: 'tshirt',
  topColor: TOP_COLORS[0],
  bottomStyle: 'skirt',
  bottomColor: BOTTOM_COLORS[0],
  shoeColor: SHOE_COLORS[0],
  accessory: 'none',
  background: 'pink',
};

const TABS = [
  { id: 'peau', label: 'Peau' },
  { id: 'cheveux', label: 'Cheveux' },
  { id: 'haut', label: 'Haut' },
  { id: 'bas', label: 'Bas' },
  { id: 'chaussures', label: 'Chaussures' },
  { id: 'accessoires', label: 'Accessoires' },
  { id: 'decor', label: 'Décor' },
];

export default function App() {
  const [outfit, setOutfit] = useState(DEFAULT_OUTFIT);
  const [activeTab, setActiveTab] = useState('peau');
  const [saved, setSaved] = useState(() => {
    try {
      const raw = localStorage.getItem('fashion-game-looks');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('fashion-game-looks', JSON.stringify(saved));
  }, [saved]);

  const update = (key) => (value) => setOutfit((prev) => ({ ...prev, [key]: value }));

  const background = BACKGROUNDS.find((b) => b.id === outfit.background)?.value;

  const saveLook = () => {
    setSaved((prev) => [...prev, { ...outfit, id: Date.now() }]);
  };

  const loadLook = (look) => {
    const { id, ...rest } = look;
    setOutfit(rest);
  };

  const removeLook = (id) => {
    setSaved((prev) => prev.filter((look) => look.id !== id));
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>✨ Fashion Studio</h1>
        <p>Crée ton look parfait !</p>
      </header>

      <main className="app-main">
        <section className="stage" style={{ background }}>
          <Doll outfit={outfit} />
          <div className="stage-actions">
            <button className="btn btn-primary" onClick={() => setOutfit(randomOutfit())}>
              🎲 Tenue surprise
            </button>
            <button className="btn btn-secondary" onClick={saveLook}>
              💾 Sauvegarder le look
            </button>
          </div>
        </section>

        <section className="wardrobe">
          <nav className="tabs">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                className={`tab ${activeTab === tab.id ? 'tab-active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="tab-panel">
            {activeTab === 'peau' && (
              <ColorPicker label="Teint" colors={SKIN_TONES} value={outfit.skin} onChange={update('skin')} />
            )}

            {activeTab === 'cheveux' && (
              <>
                <StylePicker
                  label="Coiffure"
                  options={HAIR_STYLES}
                  value={outfit.hairStyle}
                  onChange={update('hairStyle')}
                />
                <ColorPicker
                  label="Couleur"
                  colors={HAIR_COLORS}
                  value={outfit.hairColor}
                  onChange={update('hairColor')}
                />
              </>
            )}

            {activeTab === 'haut' && (
              <>
                <StylePicker label="Style" options={TOP_STYLES} value={outfit.topStyle} onChange={update('topStyle')} />
                <ColorPicker label="Couleur" colors={TOP_COLORS} value={outfit.topColor} onChange={update('topColor')} />
              </>
            )}

            {activeTab === 'bas' && (
              <>
                <StylePicker
                  label="Style"
                  options={BOTTOM_STYLES}
                  value={outfit.bottomStyle}
                  onChange={update('bottomStyle')}
                />
                <ColorPicker
                  label="Couleur"
                  colors={BOTTOM_COLORS}
                  value={outfit.bottomColor}
                  onChange={update('bottomColor')}
                />
              </>
            )}

            {activeTab === 'chaussures' && (
              <ColorPicker label="Couleur" colors={SHOE_COLORS} value={outfit.shoeColor} onChange={update('shoeColor')} />
            )}

            {activeTab === 'accessoires' && (
              <StylePicker
                label="Accessoire"
                options={ACCESSORIES}
                value={outfit.accessory}
                onChange={update('accessory')}
              />
            )}

            {activeTab === 'decor' && (
              <StylePicker
                label="Fond"
                options={BACKGROUNDS}
                value={outfit.background}
                onChange={update('background')}
              />
            )}
          </div>
        </section>
      </main>

      {saved.length > 0 && (
        <section className="gallery">
          <h2>Mes looks sauvegardés</h2>
          <div className="gallery-grid">
            {saved.map((look) => (
              <div key={look.id} className="gallery-card">
                <div
                  className="gallery-stage"
                  style={{ background: BACKGROUNDS.find((b) => b.id === look.background)?.value }}
                >
                  <Doll outfit={look} />
                </div>
                <div className="gallery-actions">
                  <button className="btn btn-small" onClick={() => loadLook(look)}>
                    Porter
                  </button>
                  <button className="btn btn-small btn-danger" onClick={() => removeLook(look.id)}>
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
