import { useLayoutEffect, useRef } from 'react';

export function useCanvas(draw: (context: CanvasRenderingContext2D) => void, deps: unknown[]) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    const updateSize = () => {
      const { clientWidth, clientHeight } = canvas;

      if (canvas.width !== clientWidth || canvas.height !== clientHeight) {
        canvas.width = clientWidth;
        canvas.height = clientHeight;
      }

      draw(context);
    };

    const observer = new ResizeObserver(() => {
      window.requestAnimationFrame(updateSize);
    });

    observer.observe(canvas);
    updateSize();

    return () => {
      observer.disconnect();
    };
  }, [draw, ...deps]);

  return canvasRef;
}
