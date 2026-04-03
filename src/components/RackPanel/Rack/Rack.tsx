import { forwardRef } from 'react';
import type { RackDefinition } from '../../../types/rack';
import { useDocument } from '../../../context/DocumentContext';
import { RackSlot } from './RackSlot';
import { GearItem } from '../../GearItem/GearItem';
import { RU_HEIGHT_PX, ruToVisualTop } from '../../../utils/slotUtils';
import styles from './Rack.module.css';

interface RackProps {
  rack: RackDefinition;
  pendingDropRu: number | null;
  pendingDropRackId: string | null;
  isDropValid: boolean;
  activeGearId: string | null;
}

export const Rack = forwardRef<HTMLDivElement, RackProps>(
  ({ rack, pendingDropRu, pendingDropRackId, isDropValid, activeGearId }, ref) => {
    const { state } = useDocument();

    const totalHeight = rack.heightRu * RU_HEIGHT_PX;
    const isTargetRack = pendingDropRackId === rack.id;

    // Build set of highlighted RUs
    const highlightedRus = new Set<number>();
    const invalidRus = new Set<number>();

    if (isTargetRack && pendingDropRu !== null && activeGearId) {
      const gear = state.gear[activeGearId];
      if (gear) {
        for (let i = 0; i < gear.ruSize; i++) {
          const ru = pendingDropRu + i;
          if (isDropValid) {
            highlightedRus.add(ru);
          } else {
            invalidRus.add(ru);
          }
        }
      }
    }

    // Slots from top to bottom visually = high RU to RU 1
    const slots = Array.from({ length: rack.heightRu }, (_, i) => rack.heightRu - i);

    return (
      <div className={styles.rackOuter}>
        <div ref={ref} className={styles.rackFrame}>
          <div className={styles.slotsContainer} style={{ height: `${totalHeight}px` }}>
            {slots.map((ru) => (
              <RackSlot
                key={ru}
                rackId={rack.id}
                ru={ru}
                isHighlighted={highlightedRus.has(ru)}
                isInvalid={invalidRus.has(ru)}
              />
            ))}

            {/* Gear items absolutely positioned over the slots */}
            <div className={styles.gearLayer}>
              {rack.placed.map((placed) => {
                const gear = state.gear[placed.gearId];
                if (!gear) return null;
                // top = visual position of the top edge of this gear item
                const top = ruToVisualTop(placed.startRu + gear.ruSize - 1, rack.heightRu);
                return (
                  <div
                    key={placed.gearId}
                    className={styles.gearWrapper}
                    style={{
                      top: `${top}px`,
                      height: `${gear.ruSize * RU_HEIGHT_PX}px`,
                    }}
                  >
                    <GearItem gear={gear} inRack />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

Rack.displayName = 'Rack';
