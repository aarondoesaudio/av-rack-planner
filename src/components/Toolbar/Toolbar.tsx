import { useState, useRef, type RefObject } from 'react';
import { AddGearForm } from '../AddGearForm/AddGearForm';
import { AddRackModal } from '../AddRackModal/AddRackModal';
import { LibraryModal } from '../LibraryModal/LibraryModal';
import { ExportPanel } from '../ExportPanel/ExportPanel';
import { useDocument } from '../../context/DocumentContext';
import { initialState } from '../../context/documentReducer';
import type { DocumentState } from '../../types/rack';
import styles from './Toolbar.module.css';

interface Props {
  canvasRef: RefObject<HTMLDivElement | null>;
}

export function Toolbar({ canvasRef }: Props) {
  const [showAddRack, setShowAddRack] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const { dispatch, state } = useDocument();
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleSave() {
    const json = JSON.stringify(state, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rack-layout.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleLoadClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const loaded = JSON.parse(ev.target?.result as string) as DocumentState;
        dispatch({ type: 'LOAD_STATE', payload: loaded });
      } catch {
        alert('Invalid file — could not load rack layout.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  function handleClear() {
    if (window.confirm('Clear everything and start fresh?')) {
      dispatch({ type: 'LOAD_STATE', payload: initialState });
    }
  }

  return (
    <>
      <div className={styles.toolbar}>
        <span className={styles.appTitle}>AV Rack Planner</span>
        <div className={styles.divider} />
        <div className={styles.section}>
          <AddGearForm />
        </div>
        <div className={styles.divider} />
        <div className={styles.section}>
          <button className={styles.libraryBtn} onClick={() => setShowLibrary(true)}>
            📦 Library
          </button>
          <button className={styles.addRackBtn} onClick={() => setShowAddRack(true)}>
            + Add Rack
          </button>
        </div>
        <div className={styles.divider} />
        <div className={styles.section}>
          <button className={styles.saveBtn} onClick={handleSave}>
            Save
          </button>
          <button className={styles.loadBtn} onClick={handleLoadClick}>
            Load
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </div>
        <div className={styles.divider} />
        <div className={styles.section}>
          <ExportPanel canvasRef={canvasRef} />
          <button className={styles.clearBtn} onClick={handleClear}>
            Clear All
          </button>
        </div>
      </div>
      {showAddRack && <AddRackModal onClose={() => setShowAddRack(false)} />}
      {showLibrary && <LibraryModal onClose={() => setShowLibrary(false)} />}
    </>
  );
}
