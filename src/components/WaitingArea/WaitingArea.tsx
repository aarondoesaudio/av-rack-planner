import { useDroppable } from '@dnd-kit/core';
import { useDocument } from '../../context/DocumentContext';
import { GearItem } from '../GearItem/GearItem';
import { RU_HEIGHT_PX } from '../../utils/slotUtils';
import styles from './WaitingArea.module.css';

export function WaitingArea() {
  const { state } = useDocument();
  const { setNodeRef, isOver } = useDroppable({ id: 'waiting' });

  return (
    <div className={styles.container}>
      <div className={styles.title}>Available Gear</div>
      <div
        ref={setNodeRef}
        className={`${styles.dropZone} ${isOver ? styles.over : ''}`}
      >
        {state.waiting.length === 0 && (
          <span className={styles.empty}>All gear is placed in racks</span>
        )}
        {state.waiting.map((gearId) => {
          const gear = state.gear[gearId];
          if (!gear) return null;
          const height = Math.min(gear.ruSize, 2) * RU_HEIGHT_PX - 4;
          return (
            <div key={gearId} className={styles.itemWrapper} style={{ height: `${height}px` }}>
              <GearItem gear={gear} inRack={false} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
