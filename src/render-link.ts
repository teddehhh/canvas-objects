import type { Shape } from './types';

export const renderLink = (context: CanvasRenderingContext2D, from: Shape, to: Shape) => {
  const startX = from.position.x + from.size.width / 2;
  const startY = from.position.y + from.size.height;
  const endX = to.position.x + to.size.width / 2;
  const endY = to.position.y;

  context.beginPath();
  context.moveTo(startX, startY);
  context.lineTo(endX, endY);
  context.strokeStyle = '#373737';
  context.lineWidth = 1;
  context.stroke();

  drawArrowhead(context, endX, endY);
};

function drawArrowhead(context: CanvasRenderingContext2D, endX: number, endY: number) {
  context.beginPath();
  context.moveTo(endX, endY);
  context.lineTo(endX - 10, endY - 5);
  context.lineTo(endX - 5, endY - 10);
  context.fillStyle = '#373737';
  context.fill();
}
