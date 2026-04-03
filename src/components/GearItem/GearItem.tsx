import { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { GearItem as GearItemType } from '../../types/rack';
import { useDocument } from '../../context/DocumentContext';
import { HeatBar } from './HeatBar';
import { EditGearModal } from '../EditGearModal/EditGearModal';
import { RU_HEIGHT_PX } from '../../utils/slotUtils';
import { getContrastColor, getSubtleColor } from '../../utils/colorUtils';
import styles from './GearItem.module.css';

interface GearItemProps {
  gear: GearItemType;
  inRack?: boolean;
  isOverlay?: boolean;
}

// Inline SVG icons — clean, no unicode dependency
function IconEdit() {
  return (
    <svg viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 1.5 l2 2L4 10H2v-2L8.5 1.5z" />
    </svg>
  );
}

function IconDuplicate() {
  return (
    <svg viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="7" height="7" rx="1" />
      <path d="M1 8V2a1 1 0 011-1h6" />
    </svg>
  );
}

function IconDelete() {
  return (
    <svg viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h8M5 3V2h2v1M4 3l.5 7h3l.5-7" />
    </svg>
  );
}

export function GearItem({ gear, inRack = false, isOverlay = false }: GearItemProps) {
  const { dispatch } = useDocument();
  const [showEdit, setShowEdit] = useState(false);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `gear-${gear.id}`,
    data: { gearId: gear.id },
    disabled: isOverlay,
  });

  const height = inRack
    ? gear.ruSize * RU_HEIGHT_PX - 2
    : Math.min(gear.ruSize, 2) * RU_HEIGHT_PX - 4;

  const style: React.CSSProperties = {
    backgroundColor: gear.color,
    height: `${height}px`,
    transform: isOverlay ? undefined : CSS.Translate.toString(transform),
  };

  const textColor = getContrastColor(gear.color);
  const subtleColor = getSubtleColor(gear.color);

  const classNames = [
    styles.gearItem,
    gear.isBlank ? styles.hatch : '',
    isDragging && !isOverlay ? styles.dragging : '',
    !inRack ? styles.waitingItem : '',
  ]
    .filter(Boolean)
    .join(' ');

  function handleDuplicate(e: React.MouseEvent) {
    e.stopPropagation();
    dispatch({ type: 'DUPLICATE_GEAR', payload: gear.id });
  }

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    if (window.confirm(`Remove "${gear.name}" from the project? This cannot be undone.`)) {
      dispatch({ type: 'DELETE_GEAR', payload: gear.id });
    }
  }

  function handleEdit(e: React.MouseEvent) {
    e.stopPropagation();
    setShowEdit(true);
  }

  return (
    <>
      <div
        ref={setNodeRef}
        className={classNames}
        style={style}
        {...(isOverlay ? {} : { ...listeners, ...attributes })}
      >
        {gear.isHeat && <HeatBar />}

        {/* Action buttons — appear on hover, stopPropagation prevents drag */}
        {!isOverlay && (
          <div className={styles.actions}>
            <button
              className={`${styles.actionBtn} ${styles.editBtn}`}
              title="Edit"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={handleEdit}
              aria-label="Edit gear"
            >
              <IconEdit />
            </button>
            <button
              className={`${styles.actionBtn} ${styles.duplicateBtn}`}
              title="Duplicate"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={handleDuplicate}
              aria-label="Duplicate gear"
            >
              <IconDuplicate />
            </button>
            <button
              className={`${styles.actionBtn} ${styles.deleteBtn}`}
              title="Delete"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={handleDelete}
              aria-label="Delete gear"
            >
              <IconDelete />
            </button>
          </div>
        )}

        <span className={styles.label} style={{ color: textColor }}>
          {gear.name}
        </span>
        <span className={styles.ruLabel} style={{ color: subtleColor }}>
          {gear.ruSize}U
        </span>
      </div>

      {showEdit && <EditGearModal gear={gear} onClose={() => setShowEdit(false)} />}
    </>
  );
}
