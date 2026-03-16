import { useState } from 'react';
import type { Link, Shape } from '../../types/types';
import { OFFSET_X, OFFSET_Y } from '../constants/offset';
import { SHAPE_HEIGHT, SHAPE_WIDTH } from '../constants/shape';
import { getRandomColor } from '../get-random-color';

export function useGraph() {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const addShape = () => {
    const newShape: Shape = {
      id: Date.now().toString(),
      position: {
        x: shapes.length * OFFSET_X,
        y: shapes.length * OFFSET_Y,
      },
      size: { width: SHAPE_WIDTH, height: SHAPE_HEIGHT },
      text: `Shape ${shapes.length + 1}`,
      color: getRandomColor(),
    };

    setShapes([...shapes, newShape]);

    if (shapes.length) {
      setLinks([...links, { fromId: shapes[shapes.length - 1]!.id, toId: newShape.id }]);
    }
  };

  const removeShape = () => {
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

  return { shapes, links, selectedId, setSelectedId, addShape, removeShape };
}
