import styles from './graph-editor.module.css';
import { useCanvas } from '../../lib/hooks/useCanvas';
import { renderLink } from '../../lib/render-link';
import { renderShape } from '../../lib/render-shape';
import { useGraph } from '../../lib/hooks/useGraph';
import { getScale } from '../../lib/get-scale';
import { findShape } from '../../lib/find-shape';
import { clearCanvas } from '../../lib/clear-canvas';

export function GraphEditor() {
  const { shapes, links, selectedId, setSelectedId, addShape, removeShape } = useGraph();
  const canvasRef = useCanvas(draw, [shapes, selectedId]);

  const handleAddShape = () => {
    addShape();
  };

  const handleRemoveSelected = () => {
    removeShape();
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const scale = getScale(canvas, shapes);

    const mouseX = (e.clientX - rect.left) / scale;
    const mouseY = (e.clientY - rect.top) / scale;

    const clickedShape = findShape(shapes, mouseX, mouseY);

    setSelectedId(clickedShape ? clickedShape.id : null);
  };

  const isRemoveDisabled = selectedId === null;

  function draw(context: CanvasRenderingContext2D) {
    clearCanvas(context);

    const scale = getScale(context.canvas, shapes);

    context.save();
    context.scale(scale, scale);

    shapes.forEach((shape) => renderShape(context, shape, selectedId === shape.id));
    links.forEach((link) => {
      const fromShape = shapes.find((s) => s.id === link.fromId)!;
      const toShape = shapes.find((s) => s.id === link.toId)!;
      renderLink(context, fromShape, toShape);
    });

    context.restore();
  }

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
