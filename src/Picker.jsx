export function ColorPicker({ colors, value, onChange, label }) {
  return (
    <div className="picker-block">
      <p className="picker-label">{label}</p>
      <div className="swatch-row">
        {colors.map((color) => (
          <button
            key={color}
            className={`swatch ${value === color ? 'swatch-active' : ''}`}
            style={{ background: color }}
            onClick={() => onChange(color)}
            aria-label={color}
          />
        ))}
      </div>
    </div>
  );
}

export function StylePicker({ options, value, onChange, label }) {
  return (
    <div className="picker-block">
      <p className="picker-label">{label}</p>
      <div className="style-row">
        {options.map((opt) => (
          <button
            key={opt.id}
            className={`style-chip ${value === opt.id ? 'style-chip-active' : ''}`}
            onClick={() => onChange(opt.id)}
          >
            {opt.emoji ? `${opt.emoji} ` : ''}
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
