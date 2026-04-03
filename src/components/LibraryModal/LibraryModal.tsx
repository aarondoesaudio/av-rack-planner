import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { GEAR_LIBRARY, LIBRARY_CATEGORIES } from '../../data/gearLibrary';
import { useDocument } from '../../context/DocumentContext';
import { getContrastColor } from '../../utils/colorUtils';
import { RU_HEIGHT_PX } from '../../utils/slotUtils';
import styles from './LibraryModal.module.css';

interface Props {
  onClose: () => void;
}

export function LibraryModal({ onClose }: Props) {
  const { dispatch } = useDocument();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [justAdded, setJustAdded] = useState<Set<number>>(new Set());

  const filtered = GEAR_LIBRARY.filter((entry, _i) => {
    const matchesCategory = activeCategory === 'All' || entry.category === activeCategory;
    const matchesSearch =
      search.trim() === '' ||
      entry.name.toLowerCase().includes(search.toLowerCase()) ||
      entry.category.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  function handleAdd(index: number) {
    const entry = filtered[index];
    dispatch({
      type: 'ADD_GEAR',
      payload: {
        id: uuidv4(),
        name: entry.name,
        ruSize: entry.ruSize,
        color: entry.color,
        isHeat: entry.isHeat,
        isBlank: entry.isBlank,
      },
    });
    // Flash "Added" feedback
    setJustAdded((prev) => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
    setTimeout(() => {
      setJustAdded((prev) => {
        const next = new Set(prev);
        next.delete(index);
        return next;
      });
    }, 800);
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Escape') onClose();
  }

  const cardHeight = (ruSize: number) => Math.min(ruSize, 2) * RU_HEIGHT_PX - 4;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKey}
      >
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>Gear Library</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Search */}
        <input
          className={styles.search}
          type="text"
          placeholder="Search gear..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoFocus
        />

        {/* Category tabs */}
        <div className={styles.tabs}>
          {['All', ...LIBRARY_CATEGORIES].map((cat) => (
            <button
              key={cat}
              className={`${styles.tab} ${activeCategory === cat ? styles.tabActive : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className={styles.grid}>
          {filtered.length === 0 && (
            <div className={styles.empty}>No gear matches your search.</div>
          )}
          {filtered.map((entry, i) => {
            const textColor = getContrastColor(entry.color);
            const added = justAdded.has(i);
            const h = cardHeight(entry.ruSize);
            return (
              <button
                key={i}
                className={`${styles.card} ${added ? styles.cardAdded : ''} ${entry.isBlank ? styles.cardBlank : ''}`}
                style={{
                  backgroundColor: entry.color,
                  height: h,
                  color: textColor,
                }}
                onClick={() => handleAdd(i)}
                title={`Add ${entry.name} to Available Gear`}
              >
                {entry.isHeat && <div className={styles.heatBar} />}
                <span className={styles.cardName}>{added ? '✓ Added' : entry.name}</span>
                <span className={styles.cardMeta} style={{ color: textColor, opacity: 0.6 }}>
                  {entry.ruSize}U
                </span>
              </button>
            );
          })}
        </div>

        <p className={styles.hint}>Click any item to add it to your Available Gear tray.</p>
      </div>
    </div>
  );
}
