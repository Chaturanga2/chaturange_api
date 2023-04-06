import { Injectable } from '@nestjs/common';
import { CellType } from 'src/types/chess.types';

@Injectable()
export class ChessGameService {
  public readonly y_axis = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', ''];
  public readonly x_axis = [1, 2, 3, 4, 5, 6, 7, 8];

  public readonly board: CellType[][] = [];

  public moveKing(
    board: CellType[][],
    oldCell: CellType,
    newCell: CellType,
    currentPlayer: string,
  ): boolean {
    const king = oldCell.piece;

    // Vérifier si la case de départ contient un roi de la bonne couleur
    if (!king || king.color !== currentPlayer || king.symbol !== 'k') {
      return false;
    }

    // Vérifier si le déplacement est valide
    const xDiff = oldCell.x === newCell.x ? 0 : 1;
    const yDiff =
      this.y_axis.indexOf(oldCell.y) - this.y_axis.indexOf(newCell.y);
    const y = this.y_axis[this.y_axis.indexOf(oldCell.y) - yDiff];
    if (xDiff > 1 || yDiff > 1) {
      return false;
    }

    // Déplacement
    newCell.piece = king;
    newCell.x = oldCell.x + xDiff;
    newCell.y = y;
    oldCell.piece = null;

    return true;
  }
}
