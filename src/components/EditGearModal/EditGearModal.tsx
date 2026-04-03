import { useState } from 'react';
import type { GearItem } from '../../types/rack';
import { useDocument } from '../../context/DocumentContext';
import { getContrastColor } from '../../utils/colorUtils';
import styles from './EditGearModal.module.css';

interface Props {
  gear: GearItem;
  onClose: () => void;
}

export function EditGearModal({ gear, onClose }: Props) {
  const { dispatch } = useDocument();
  const [name, setName] = useState(gear.name);
  const [ruSize, setRuSize] = useState(gear.ruSize);
  const [color, setColor] = useState(gear.color);
  const [isHeat, setIsHeat] = useState(gear.isHeat);
  const [isBlank, setIsBlank] = useState(gear.isBlank);

  function handleSave() {
    if (!name.trim()) return;
    dispatch({
      type: 'UPDATE_GEAR',
      payload: {
        ...gear,
        name: name.trim(),
        ruSize: Math.max(1, Math.min(14, ruSize)),
        color,
        isHeat,
        isBlank,
      },
    });
    onClose();
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Escape') onClose();
    if (e.key === 'Enter' && name.trim()) handleSave();
  }

  const textColor = getContrastColor(color);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} onKeyDown={handleKey}>
        <h2 className={styles.title}>Edit Gear</h2>

        <div className={styles.field}>
          <label className={styles.label}>Name</label>
          <input
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Size (U)</label>
          <input
            className={`${styles.input} ${styles.ruInput}`}
            type="number"
            min={1}
            max={14}
            value={ruSize}
            onChange={(e) => setRuSize(parseInt(e.target.value, 10) || 1)}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Color</label>
          <div className={styles.colorRow}>
            <input
              className={styles.colorInput}
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
            <span style={{ fontSize: 12, color: '#888' }}>{color.toUpperCase()}</span>
          </div>
        </div>

        <div className={styles.checkRow}>
          <label className={styles.checkLabel}>
            <input type="checkbox" checked={isHeat} onChange={(e) => setIsHeat(e.target.checked)} />
            Heat source
          </label>
          <label className={styles.checkLabel}>
            <input type="checkbox" checked={isBlank} onChange={(e) => setIsBlank(e.target.checked)} />
            Blank panel
          </label>
        </div>

        {/* Live preview */}
        <div
          className={styles.preview}
          style={{ backgroundColor: color, color: textColor }}
        >
          {name || '—'} · {ruSize}U
        </div>

        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.saveBtn} onClick={handleSave} disabled={!name.trim()}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
