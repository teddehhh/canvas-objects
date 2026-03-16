import type { Shape } from 'src/types/types';

export const renderShape = (ctx: CanvasRenderingContext2D, shape: Shape, isSelected?: boolean) => {
  const { position, size, text } = shape;
  const { x, y } = position;
  const { width, height } = size;

  ctx.beginPath();
  ctx.rect(x, y, width, height);

  ctx.strokeStyle = isSelected ? '#9E7157' : '#8eb38e';
  ctx.lineWidth = isSelected ? 2 : 1;
  ctx.fillStyle = '#ffffff';

  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = isSelected ? '#9E7157' : '#8eb38e';
  ctx.font = '16px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.fillText(text, x + width / 2, y + height / 2);
};
