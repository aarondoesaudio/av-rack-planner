import { useCallback } from 'react';
import html2canvas from 'html2canvas';

export function useExport(targetRef: React.RefObject<HTMLDivElement | null>) {
  const savePng = useCallback(async () => {
    const el = targetRef.current;
    if (!el) return;
    try {
      // Temporarily expand the element so html2canvas sees full content
      const prevOverflow = el.style.overflow;
      const prevHeight = el.style.height;
      el.style.overflow = 'visible';
      el.style.height = el.scrollHeight + 'px';

      const canvas = await html2canvas(el, {
        backgroundColor: '#141414',
        scale: 2,
        useCORS: true,
        logging: false,
        width: el.scrollWidth,
        height: el.scrollHeight,
        windowWidth: el.scrollWidth,
        windowHeight: el.scrollHeight,
        scrollX: 0,
        scrollY: 0,
      });

      // Restore original styles
      el.style.overflow = prevOverflow;
      el.style.height = prevHeight;
      const link = document.createElement('a');
      link.download = 'rack-layout.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Export failed:', err);
    }
  }, [targetRef]);

  const print = useCallback(() => {
    window.print();
  }, []);

  return { savePng, print };
}
