export type Piece = {
  image?: string;
  symbol: string;
  color: string;
  moved: boolean;
} | null;

export type CellType = {
  x: number;
  y: string;
  piece: Piece;
};
