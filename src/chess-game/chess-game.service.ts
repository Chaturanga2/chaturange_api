import { Injectable } from '@nestjs/common';
import { CellType, Piece } from '../types/chess.types';

@Injectable()
export class ChessGameService {
  public readonly y_axis = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', ''];
  public readonly x_axis = [1, 2, 3, 4, 5, 6, 7, 8];

  public readonly board: CellType[][] = [];

  public generatePieces(): Array<{
    x: number;
    y: string;
    s: string;
    color: string;
    image: string;
  }> {
    const pieces = [];
    for (let position = 0; position < 2; position++) {
      const type = position === 0 ? 'w' : 'b';
      const x_pos = position === 0 ? 0 : 7;

      pieces.push(
        {
          x: x_pos,
          y: 'a',
          s: 'r',
          color: type,
          image: require(`@/assets/pions/rook_${type}.png`),
        },
        {
          x: x_pos,
          y: 'b',
          s: 'n',
          color: type,
          image: require(`@/assets/pions/knight_${type}.png`),
        },
        {
          x: x_pos,
          y: 'c',
          s: 'b',
          color: type,
          image: require(`@/assets/pions/bishop_${type}.png`),
        },
        {
          x: x_pos,
          y: 'd',
          s: 'q',
          color: type,
          image: require(`@/assets/pions/queen_${type}.png`),
        },
        {
          x: x_pos,
          y: 'e',
          s: 'k',
          color: type,
          image: require(`@/assets/pions/king_${type}.png`),
        },
        {
          x: x_pos,
          y: 'f',
          s: 'b',
          color: type,
          image: require(`@/assets/pions/bishop_${type}.png`),
        },
        {
          x: x_pos,
          y: 'g',
          s: 'n',
          color: type,
          image: require(`@/assets/pions/knight_${type}.png`),
        },
        {
          x: x_pos,
          y: 'h',
          s: 'r',
          color: type,
          image: require(`@/assets/pions/rook_${type}.png`),
        },
      );
    }
    for (let i = 0; i < 8; i++) {
      pieces.push(
        {
          x: 1,
          y: this.y_axis[i],
          s: 'p',
          color: 'w',
          image: require('@/assets/pions/pawn_w.png'),
        },
        {
          x: 6,
          y: this.y_axis[i],
          s: 'p',
          color: 'b',
          image: require('@/assets/pions/pawn_b.png'),
        },
      );
    }

    return pieces;
  }

  public generateBoard(): CellType[][] {
    for (let i = 0; i < this.x_axis.length; i++) {
      const row: CellType[] = [];
      for (let j = 0; j < this.y_axis.length; j++) {
        const cell: CellType = { x: i, y: this.y_axis[j], piece: null };
        const piece = this.generatePieces().find(
          (p) => p.x === i && p.y === this.y_axis[j],
        );
        if (piece) {
          cell.piece = {
            image: piece.image,
            symbol: piece.s,
            color: piece.color,
          };
        }
        row.push(cell);
      }
      this.board.push(row);
    }
    return this.board;
  }
}
