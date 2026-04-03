import { useRef } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { DocumentProvider, useDocument } from './context/DocumentContext';
import { useRackDnd } from './hooks/useRackDnd';
import { Toolbar } from './components/Toolbar/Toolbar';
import { RackCanvas } from './components/RackCanvas/RackCanvas';
import { WaitingArea } from './components/WaitingArea/WaitingArea';
import { DragOverlayItem } from './components/DragOverlayItem/DragOverlayItem';
import styles from './App.module.css';

function AppInner() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const rackRefsMap = useRef<Map<string, HTMLDivElement | null>>(new Map());
  const { state } = useDocument();

  function handleRackRef(rackId: string, el: HTMLDivElement | null) {
    rackRefsMap.current.set(rackId, el);
  }

  const { sensors, dragState, onDragStart, onDragMove, onDragEnd } = useRackDnd(rackRefsMap);

  const activeGear = dragState.activeGearId ? state.gear[dragState.activeGearId] : null;

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragMove={onDragMove}
      onDragEnd={onDragEnd}
    >
      <div className={styles.app}>
        <Toolbar canvasRef={canvasRef} />
        <RackCanvas
          ref={canvasRef}
          dragState={dragState}
          onRackRef={handleRackRef}
        />
        <WaitingArea />
      </div>
      <DragOverlay dropAnimation={null}>
        {activeGear ? <DragOverlayItem gear={activeGear} /> : null}
      </DragOverlay>
    </DndContext>
  );
}

export default function App() {
  return (
    <DocumentProvider>
      <AppInner />
    </DocumentProvider>
  );
}
