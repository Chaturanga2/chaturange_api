export type Piece = {
    x_axe: number[];
    y_axe: string[];
    image?: string;
    symbol: string;
    color: string;
  } | null;
  
  export type CellType = {
    x: number;
    y: string;
    piece: Piece;
  };
  
  export type Board = CellType[][];
  