import { useState } from 'react';
import styles from './graph-editor.module.css';
import { useCanvas } from './useCanvas';
import type { Link, Shape } from './types';
import { renderLink } from './render-link';
import { renderShape } from './render-shape';

export function GraphEditor() {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  function clearCanvas(context: CanvasRenderingContext2D) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  }

  const draw = (context: CanvasRenderingContext2D) => {
    clearCanvas(context);

    shapes.forEach((shape) => renderShape(context, shape, selectedId === shape.id));
    links.forEach((link) => {
      const fromShape = shapes.find((s) => s.id === link.fromId)!;
      const toShape = shapes.find((s) => s.id === link.toId)!;
      renderLink(context, fromShape, toShape);
    });
  };

  const handleAddShape = () => {
    const newShape: Shape = {
      id: Date.now().toString(),
      position: {
        x: 50 + shapes.length * 50,
        y: 50 + shapes.length * 100,
      },
      size: { width: 150, height: 50 },
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
            x: 50 + index * 50,
            y: 50 + index * 100,
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
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

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
        <button onClick={handleAddShape}>Add</button>
        <button disabled={isRemoveDisabled} onClick={handleRemoveSelected}>
          Remove
        </button>
      </div>
      <canvas ref={canvasRef} className={styles.canvas} onClick={handleCanvasClick}></canvas>
    </div>
  );
}
