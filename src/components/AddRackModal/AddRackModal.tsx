import { useState } from 'react';
import { useDocument } from '../../context/DocumentContext';
import styles from './AddRackModal.module.css';

function useLocationSuggestions() {
  const { state } = useDocument();
  const seen = new Set<string>();
  return state.racks
    .map((r) => r.location.trim())
    .filter((loc) => loc && !seen.has(loc.toLowerCase()) && seen.add(loc.toLowerCase()));
}

interface Props {
  onClose: () => void;
}

export function AddRackModal({ onClose }: Props) {
  const { dispatch } = useDocument();
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [heightRu, setHeightRu] = useState(12);
  const locationSuggestions = useLocationSuggestions();

  function handleAdd() {
    if (!name.trim()) return;
    dispatch({
      type: 'ADD_RACK',
      payload: {
        name: name.trim(),
        location: location.trim(),
        heightRu: Math.max(1, Math.min(60, heightRu)),
      },
    });
    onClose();
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Escape') onClose();
    if (e.key === 'Enter') handleAdd();
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} onKeyDown={handleKey}>
        <h2 className={styles.title}>Add Rack</h2>
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
            list="location-suggestions-add"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Stage Left"
          />
          <datalist id="location-suggestions-add">
            {locationSuggestions.map((loc) => (
              <option key={loc} value={loc} />
            ))}
          </datalist>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Height (U)</label>
          <input
            className={styles.input}
            type="number"
            min={1}
            max={60}
            value={heightRu}
            onChange={(e) => setHeightRu(parseInt(e.target.value, 10) || 12)}
          />
        </div>
        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.addBtn} onClick={handleAdd} disabled={!name.trim()}>
            Add Rack
          </button>
        </div>
      </div>
    </div>
  );
}
