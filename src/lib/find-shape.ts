import type { Shape } from '../types/types';

export const findShape = (shapes: Shape[], x: number, y: number) => {
  return [...shapes].find(
    (s) =>
      x >= s.position.x &&
      x <= s.position.x + s.size.width &&
      y >= s.position.y &&
      y <= s.position.y + s.size.height,
  );
};
