import { useState } from 'react';
import type { RackDefinition } from '../../types/rack';
import { useDocument } from '../../context/DocumentContext';
import styles from './EditRackModal.module.css';

interface Props {
  rack: RackDefinition;
  onClose: () => void;
}

export function EditRackModal({ rack, onClose }: Props) {
  const { dispatch, state } = useDocument();
  const [name, setName] = useState(rack.name);
  const [location, setLocation] = useState(rack.location);
  const [heightVal, setHeightVal] = useState(String(rack.heightRu));

  const locationSuggestions = (() => {
    const seen = new Set<string>();
    return state.racks
      .map((r) => r.location.trim())
      .filter((loc) => loc && !seen.has(loc.toLowerCase()) && seen.add(loc.toLowerCase()));
  })();

  function handleSave() {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    const newHeight = parseInt(heightVal, 10);
    if (isNaN(newHeight) || newHeight < 1 || newHeight > 60) return;

    if (newHeight < rack.heightRu) {
      const affected = rack.placed.filter((p) => {
        const g = state.gear[p.gearId];
        return g ? p.startRu + g.ruSize - 1 > newHeight : false;
      });
      if (affected.length > 0) {
        const ok = window.confirm(
          `Reducing height to ${newHeight}U will remove ${affected.length} item(s) from the rack and return them to the waiting area. Continue?`
        );
        if (!ok) return;
      }
    }

    dispatch({
      type: 'UPDATE_RACK',
      payload: {
        rackId: rack.id,
        name: trimmedName,
        location: location.trim(),
        heightRu: newHeight,
      },
    });
    onClose();
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Escape') onClose();
    if (e.key === 'Enter' && name.trim()) handleSave();
  }

  const heightNum = parseInt(heightVal, 10);
  const heightValid = !isNaN(heightNum) && heightNum >= 1 && heightNum <= 60;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} onKeyDown={handleKey}>
        <h2 className={styles.title}>Edit Rack</h2>

        <div className={styles.field}>
          <label className={styles.label}>Rack Name</label>
          <input
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. FOH Rack"
            autoFocus
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Location</label>
          <input
            className={styles.input}
            list="location-suggestions-edit"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Stage Left"
          />
          <datalist id="location-suggestions-edit">
            {locationSuggestions.map((loc) => (
              <option key={loc} value={loc} />
            ))}
          </datalist>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Height (U)</label>
          <input
            className={`${styles.input} ${styles.ruInput}`}
            type="number"
            min={1}
            max={60}
            value={heightVal}
            onChange={(e) => setHeightVal(e.target.value)}
          />
        </div>

        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button
            className={styles.saveBtn}
            onClick={handleSave}
            disabled={!name.trim() || !heightValid}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
