import { useLayoutEffect, useRef } from 'react';
import styles from './graph-editor.module.css';

export function GraphEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const draw = (context: CanvasRenderingContext2D) => {
    context.fillRect(0, 0, 100, 100);
  };

  useLayoutEffect(() => {
    const updateSize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;

      if (!canvas || !container) {
        return;
      }
      const { clientWidth, clientHeight } = canvas;
      canvas.width = clientWidth;
      canvas.height = clientHeight;

      const context = canvas.getContext('2d');
      if (context) {
        draw(context);
      }
    };

    const observer = new ResizeObserver(updateSize);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    updateSize();

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={styles.container}>
      <div className={styles.buttonContainer}>
        <button>Add</button>
        <button>Remove</button>
      </div>
      <canvas ref={canvasRef} className={styles.canvas}></canvas>
    </div>
  );
}
