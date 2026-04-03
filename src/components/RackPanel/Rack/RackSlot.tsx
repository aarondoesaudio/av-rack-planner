import { useDroppable } from '@dnd-kit/core';
import { slotDroppableId, RU_HEIGHT_PX } from '../../../utils/slotUtils';
import styles from './RackSlot.module.css';

interface RackSlotProps {
  rackId: string;
  ru: number;
  isHighlighted?: boolean;
  isInvalid?: boolean;
}

export function RackSlot({ rackId, ru, isHighlighted, isInvalid }: RackSlotProps) {
  const id = slotDroppableId(rackId, ru);
  const { setNodeRef } = useDroppable({ id, data: { rackId, ru } });

  const className = [
    styles.slot,
    isHighlighted ? styles.slotOver : '',
    isInvalid ? styles.slotInvalid : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={setNodeRef}
      className={className}
      style={{ height: `${RU_HEIGHT_PX}px` }}
    >
      <span className={`${styles.ruNumber} ${styles.ruLeft}`}>{ru}</span>
      <span className={`${styles.ruNumber} ${styles.ruRight}`}>{ru}</span>
    </div>
  );
}
