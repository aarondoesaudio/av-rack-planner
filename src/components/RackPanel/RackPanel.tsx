import type { RackDefinition } from '../../types/rack';
import { RackHeader } from './RackHeader';
import { Rack } from './Rack/Rack';
import styles from './RackPanel.module.css';

interface Props {
  rack: RackDefinition;
  pendingDropRu: number | null;
  pendingDropRackId: string | null;
  isDropValid: boolean;
  activeGearId: string | null;
  onRackRef: (rackId: string, el: HTMLDivElement | null) => void;
}

export function RackPanel({
  rack,
  pendingDropRu,
  pendingDropRackId,
  isDropValid,
  activeGearId,
  onRackRef,
}: Props) {
  return (
    <div className={styles.panel}>
      <RackHeader rack={rack} />
      <Rack
        ref={(el) => onRackRef(rack.id, el)}
        rack={rack}
        pendingDropRu={pendingDropRu}
        pendingDropRackId={pendingDropRackId}
        isDropValid={isDropValid}
        activeGearId={activeGearId}
      />
    </div>
  );
}
