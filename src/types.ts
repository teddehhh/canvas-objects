interface Position {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

export interface Shape {
  id: string;
  position: Position;
  size: Size;
  text: string;
}

export interface Link {
  fromId: string;
  toId: string;
}
