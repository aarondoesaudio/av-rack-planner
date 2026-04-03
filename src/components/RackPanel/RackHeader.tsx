import { useState } from 'react';
import type { RackDefinition } from '../../types/rack';
import { useDocument } from '../../context/DocumentContext';
import { EditRackModal } from '../EditRackModal/EditRackModal';
import styles from './RackHeader.module.css';

interface Props {
  rack: RackDefinition;
}

export function RackHeader({ rack }: Props) {
  const { dispatch } = useDocument();
  const [showEdit, setShowEdit] = useState(false);

  function handleDelete() {
    if (window.confirm(`Remove rack "${rack.name}"? All items will return to the waiting area.`)) {
      dispatch({ type: 'REMOVE_RACK', payload: rack.id });
    }
  }

  return (
    <>
      <div className={styles.header}>
        <div className={styles.topRow}>
          <div className={styles.nameBlock}>
            <span className={styles.name}>{rack.name || 'Unnamed Rack'}</span>
            {rack.location && (
              <span className={styles.location}>{rack.location}</span>
            )}
          </div>
          <div className={styles.btnGroup}>
            <button className={styles.editBtn} onClick={() => setShowEdit(true)}>
              Edit
            </button>
            <button className={styles.deleteBtn} onClick={handleDelete}>
              Remove
            </button>
          </div>
        </div>
        <div className={styles.heightLabel}>
          {rack.heightRu}U rack
        </div>
      </div>

      {showEdit && (
        <EditRackModal rack={rack} onClose={() => setShowEdit(false)} />
      )}
    </>
  );
}
