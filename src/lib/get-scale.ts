import type { Shape } from '../types/types';

export const getScale = (canvas: HTMLCanvasElement, shapes: Shape[]) => {
  if (shapes.length === 0) {
    return 1;
  }
  const maxX = Math.max(...shapes.map((s) => s.position.x + s.size.width));
  const maxY = Math.max(...shapes.map((s) => s.position.y + s.size.height));

  return Math.min(canvas.width / maxX, canvas.height / maxY, 1);
};
