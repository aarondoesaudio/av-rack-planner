import type { RefObject } from 'react';
import { useExport } from '../../hooks/useExport';
import styles from './ExportPanel.module.css';

interface Props {
  canvasRef: RefObject<HTMLDivElement | null>;
}

export function ExportPanel({ canvasRef }: Props) {
  const { savePng, print } = useExport(canvasRef);

  return (
    <div className={styles.panel}>
      <button className={styles.btn} onClick={savePng}>
        ↓ Save PNG
      </button>
      <button className={styles.btn} onClick={print}>
        ⎙ Print
      </button>
    </div>
  );
}
