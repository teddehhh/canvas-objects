import { type Shape } from '../types/types';
import { SELECTED_SHAPE_COLOR, FILL_SHAPE_COLOR } from './constants/colors';

export const renderShape = (ctx: CanvasRenderingContext2D, shape: Shape, isSelected?: boolean) => {
  const { position, size, text } = shape;
  const { x, y } = position;
  const { width, height } = size;

  ctx.beginPath();
  ctx.rect(x, y, width, height);

  ctx.strokeStyle = isSelected ? SELECTED_SHAPE_COLOR : shape.color;
  ctx.lineWidth = isSelected ? 2 : 1;
  ctx.fillStyle = FILL_SHAPE_COLOR;

  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = isSelected ? SELECTED_SHAPE_COLOR : shape.color;
  ctx.font = '16px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.fillText(text, x + width / 2, y + height / 2);
};
