import { forwardRef } from 'react';
import { useDocument } from '../../context/DocumentContext';
import { RackPanel } from '../RackPanel/RackPanel';
import type { RackDefinition } from '../../types/rack';
import type { DragState } from '../../hooks/useRackDnd';
import styles from './RackCanvas.module.css';

interface Props {
  dragState: DragState;
  onRackRef: (rackId: string, el: HTMLDivElement | null) => void;
}

type RackGroup = { location: string; racks: RackDefinition[] };

function groupByLocation(racks: RackDefinition[]): RackGroup[] {
  const orderMap = new Map<string, number>();
  const buckets = new Map<string, RackDefinition[]>();

  for (const rack of racks) {
    const key = rack.location.trim().toLowerCase();
    if (!buckets.has(key)) {
      orderMap.set(key, orderMap.size);
      buckets.set(key, []);
    }
    buckets.get(key)!.push(rack);
  }

  return [...orderMap.entries()]
    .sort((a, b) => a[1] - b[1])
    .map(([key]) => ({
      location: buckets.get(key)![0].location.trim(),
      racks: buckets.get(key)!,
    }));
}

export const RackCanvas = forwardRef<HTMLDivElement, Props>(({ dragState, onRackRef }, ref) => {
  const { state } = useDocument();
  const groups = groupByLocation(state.racks);

  return (
    <div ref={ref} className={styles.canvas}>
      {state.racks.length === 0 ? (
        <div className={styles.empty}>
          No racks yet.<br />Click <strong>+ Add Rack</strong> in the toolbar to get started.
        </div>
      ) : (
        groups.map((group, i) => (
          <div key={`${group.location}-${i}`} className={styles.locationGroup}>
            {group.location && (
              <div className={styles.locationHeader}>{group.location}</div>
            )}
            <div className={styles.rackRow}>
              {group.racks.map((rack) => (
                <RackPanel
                  key={rack.id}
                  rack={rack}
                  pendingDropRu={dragState.pendingDropRu}
                  pendingDropRackId={dragState.pendingDropRackId}
                  isDropValid={dragState.isDropValid}
                  activeGearId={dragState.activeGearId}
                  onRackRef={onRackRef}
                />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
});

RackCanvas.displayName = 'RackCanvas';
