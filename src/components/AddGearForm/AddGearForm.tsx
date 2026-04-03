import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useDocument } from '../../context/DocumentContext';
import styles from './AddGearForm.module.css';

const DEFAULT_COLOR = '#2563eb';

export function AddGearForm() {
  const { dispatch } = useDocument();
  const [name, setName] = useState('');
  const [ruSize, setRuSize] = useState(1);
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [isHeat, setIsHeat] = useState(false);
  const [isBlank, setIsBlank] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    dispatch({
      type: 'ADD_GEAR',
      payload: {
        id: uuidv4(),
        name: name.trim(),
        ruSize: Math.max(1, Math.min(14, ruSize)),
        color,
        isHeat,
        isBlank,
      },
    });
    setName('');
    setRuSize(1);
    setIsHeat(false);
    setIsBlank(false);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={`${styles.input} ${styles.nameInput}`}
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Gear name…"
        title="Gear name"
      />
      <input
        className={`${styles.input} ${styles.ruInput}`}
        type="number"
        min={1}
        max={14}
        value={ruSize}
        onChange={(e) => setRuSize(parseInt(e.target.value, 10) || 1)}
        title="Size in rack units"
      />
      <span className={styles.uLabel}>U</span>
      <input
        className={`${styles.input} ${styles.colorInput}`}
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        title="Color"
      />
      <label className={styles.checkLabel} title="Heat source — adds heat warning bar">
        <input type="checkbox" checked={isHeat} onChange={(e) => setIsHeat(e.target.checked)} />
        Heat
      </label>
      <label className={styles.checkLabel} title="Blank panel — shows hatch pattern">
        <input type="checkbox" checked={isBlank} onChange={(e) => setIsBlank(e.target.checked)} />
        Blank
      </label>
      <button className={styles.addBtn} type="submit" disabled={!name.trim()}>
        + Add Gear
      </button>
    </form>
  );
}
