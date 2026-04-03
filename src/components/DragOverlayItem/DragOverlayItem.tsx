import type { GearItem as GearItemType } from '../../types/rack';
import { GearItem } from '../GearItem/GearItem';
import styles from './DragOverlayItem.module.css';

interface Props {
  gear: GearItemType;
}

export function DragOverlayItem({ gear }: Props) {
  return (
    <div className={styles.overlay}>
      <GearItem gear={gear} inRack={false} isOverlay />
    </div>
  );
}
