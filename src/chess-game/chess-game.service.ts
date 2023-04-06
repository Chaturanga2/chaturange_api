import { Injectable } from '@nestjs/common';
import { CellType } from 'src/types/chess.types';

@Injectable()
export class ChessGameService {
  public readonly y_axis = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', ''];
  public readonly x_axis = [1, 2, 3, 4, 5, 6, 7, 8];

  public readonly board: CellType[][] = [];

  public moveBishop(
    board: CellType[][],
    oldCell: CellType,
    newCell: CellType,
    currentPlayer: string,
  ): boolean {
    const bishop = oldCell.piece;

    // Vérifier si la case de départ contient un fou de la bonne couleur
    if (!bishop || bishop.color !== currentPlayer || bishop.symbol !== 'b') {
      return false;
    }

    // Vérifier si le déplacement est valide
    const xDiff = Math.abs(oldCell.x - newCell.x);
    const yDiff = Math.abs(
      this.y_axis.indexOf(oldCell.y) - this.y_axis.indexOf(newCell.y),
    );
    if (xDiff !== yDiff) {
      return false;
    }
    const xDirection = oldCell.x < newCell.x ? 1 : -1;
    const yDirection =
      this.y_axis.indexOf(oldCell.y) < this.y_axis.indexOf(newCell.y) ? 1 : -1;
    for (let i = 1; i < x; i++) {
      const currentCell =
        board[oldCell.x + i * xDirection][
          this.y_axis.indexOf(oldCell.y) + i * yDirection
        ];
      if (currentCell.piece) {
        return false;
      }
    }

    // Déplacement
    newCell.piece = oldCell.piece;
    oldCell.piece = null;

    return true;
  }

  public moveQueen(
    board: CellType[][],
    oldCell: CellType,
    newCell: CellType,
    currentPlayer: string,
  ): boolean {
    const queen = oldCell.piece;

    // Vérifier si la case de départ contient une reine de la bonne couleur
    if (!queen || queen.color !== currentPlayer || queen.symbol !== 'q') {
      return false;
    }

    // Vérifier si le déplacement est valide
    if (oldCell.x === newCell.x) {
      // Déplacement horizontal
      const min = Math.min(
        this.y_axis.indexOf(oldCell.y),
        this.y_axis.indexOf(newCell.y),
      );
      const max = Math.max(
        this.y_axis.indexOf(oldCell.y),
        this.y_axis.indexOf(newCell.y),
      );
      for (let i = min + 1; i < max; i++) {
        if (board[oldCell.x][i].piece) {
          return false;
        }
      }
    } else if (oldCell.y === newCell.y) {
      // Déplacement vertical
      const min = Math.min(oldCell.x, newCell.x);
      const max = Math.max(oldCell.x, newCell.x);
      for (let i = min + 1; i < max; i++) {
        if (board[i][this.y_axis.indexOf(oldCell.y)].piece) {
          return false;
        }
      }
    } else {
      // Déplacement diagonal
      const xDiff = Math.abs(oldCell.x - newCell.x);
      const yDiff =
        this.y_axis.indexOf(oldCell.y) - this.y_axis.indexOf(newCell.y);
      if (xDiff !== yDiff) {
        return false;
      }
      const xDirection = oldCell.x < newCell.x ? 1 : -1;
      const yDirection =
        this.y_axis.indexOf(oldCell.y) < this.y_axis.indexOf(newCell.y)
          ? 1
          : -1;
      for (let i = 1; i < xDiff; i++) {
        if (
          board[oldCell.x + i * xDirection][
            this.y_axis.indexOf(oldCell.y) + i * yDirection
          ].piece
        ) {
          return false;
        }
      }
    }

    // Déplacement
    newCell.piece = queen;
    oldCell.piece = null;

    return true;
  }

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
    if (xDiff > 1 || yDiff > 1) {
      return false;
    }

    // Déplacement
    newCell.piece = king;
    oldCell.piece = null;

    return true;
  }
}
