import { useState } from 'react';
import styles from './graph-editor.module.css';
import { useCanvas } from '../lib/hooks/useCanvas';
import type { Link, Shape } from '../types/types';
import { renderLink } from '../lib/render-link';
import { renderShape } from '../lib/render-shape';
import { SHAPE_HEIGHT, SHAPE_WIDTH } from '../lib/constants/shape';
import { OFFSET_X, OFFSET_Y } from '../lib/constants/offset';

export function GraphEditor() {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  function clearCanvas(context: CanvasRenderingContext2D) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  }

  const getScale = (canvasWidth: number, canvasHeight: number) => {
    if (shapes.length === 0) {
      return 1;
    }
    const maxX = Math.max(...shapes.map((s) => s.position.x + s.size.width));
    const maxY = Math.max(...shapes.map((s) => s.position.y + s.size.height));

    return Math.min(canvasWidth / maxX, canvasHeight / maxY, 1);
  };

  const draw = (context: CanvasRenderingContext2D) => {
    clearCanvas(context);

    const scale = getScale(context.canvas.width, context.canvas.height);

    context.save();
    context.scale(scale, scale);

    shapes.forEach((shape) => renderShape(context, shape, selectedId === shape.id));
    links.forEach((link) => {
      const fromShape = shapes.find((s) => s.id === link.fromId)!;
      const toShape = shapes.find((s) => s.id === link.toId)!;
      renderLink(context, fromShape, toShape);
    });

    context.restore();
  };

  const handleAddShape = () => {
    const newShape: Shape = {
      id: Date.now().toString(),
      position: {
        x: shapes.length * OFFSET_X,
        y: shapes.length * OFFSET_Y,
      },
      size: { width: SHAPE_WIDTH, height: SHAPE_HEIGHT },
      text: `Shape ${shapes.length + 1}`,
    };

    setShapes([...shapes, newShape]);

    if (shapes.length) {
      setLinks([...links, { fromId: shapes[shapes.length - 1]!.id, toId: newShape.id }]);
    }
  };

  const handleRemoveSelected = () => {
    setShapes(
      shapes
        .filter((shape) => shape.id !== selectedId)
        .map((shape, index) => ({
          ...shape,
          position: {
            x: index * OFFSET_X,
            y: index * OFFSET_Y,
          },
        })),
    );
    setLinks(
      links
        .map((link, index) => {
          if (link.toId === selectedId && index < links.length - 1) {
            return { fromId: link.fromId, toId: links[index + 1]!.toId };
          }
          return link;
        })
        .filter((link) => link.fromId !== selectedId && link.toId !== selectedId),
    );
    setSelectedId(null);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const scale = getScale(canvas.width, canvas.height);

    const mouseX = (e.clientX - rect.left) / scale;
    const mouseY = (e.clientY - rect.top) / scale;

    const clickedShape = [...shapes]
      .reverse()
      .find(
        (shape) =>
          mouseX >= shape.position.x &&
          mouseX <= shape.position.x + shape.size.width &&
          mouseY >= shape.position.y &&
          mouseY <= shape.position.y + shape.size.height,
      );

    setSelectedId(clickedShape ? clickedShape.id : null);
  };

  const isRemoveDisabled = selectedId === null;

  const canvasRef = useCanvas(draw, [shapes, selectedId]);

  return (
    <div className={styles.container}>
      <div className={styles.buttonContainer}>
        <button onClick={handleAddShape}>
          <span>&#43;</span>Add
        </button>
        <button
          className={styles.removeButton}
          disabled={isRemoveDisabled}
          onClick={handleRemoveSelected}
        >
          <span>&#128465;</span>Remove
        </button>
      </div>
      <canvas ref={canvasRef} className={styles.canvas} onClick={handleCanvasClick}></canvas>
    </div>
  );
}
