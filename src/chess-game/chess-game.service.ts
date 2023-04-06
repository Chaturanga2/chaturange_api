import { Injectable } from '@nestjs/common';
import { CellType } from 'src/types/chess.types';

@Injectable()
export class ChessGameService {
  public readonly y_axis = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', ''];
  public readonly x_axis = [1, 2, 3, 4, 5, 6, 7, 8];

  public readonly board: CellType[][] = [];

  public moveRook(
    board: CellType[][],
    oldCell: CellType,
    newCell: CellType,
    currentPlayer: string,
  ): boolean {
    const rook = oldCell.piece;

    // Vérifier si la case de départ contient une tour de la bonne couleur
    if (!rook || rook.color !== currentPlayer || rook.symbol !== 'r') {
      return false;
    }

    // Vérifier si le déplacement est valide
    const xDiff = Math.abs(oldCell.x - newCell.x);
    const yDiff = Math.abs(
      this.y_axis.indexOf(oldCell.y) - this.y_axis.indexOf(newCell.y),
    );
    if (xDiff !== 0 && yDiff !== 0) {
      return false;
    }

    // Vérifier s'il y a des obstacles
    const startX = Math.min(oldCell.x, newCell.x);
    const endX = Math.max(oldCell.x, newCell.x);
    const startY = Math.min(
      this.y_axis.indexOf(oldCell.y),
      this.y_axis.indexOf(newCell.y),
    );
    const endY = Math.max(
      this.y_axis.indexOf(oldCell.y),
      this.y_axis.indexOf(newCell.y),
    );
    for (let x = startX + 1; x < endX; x++) {
      for (let y = startY + 1; y < endY; y++) {
        if (board[x][y].piece) {
          return false;
        }
      }
    }

    // Déplacement
    newCell.piece = rook;
    oldCell.piece = null;

    return true;
  }

  public moveKnight(
    board: CellType[][],
    oldCell: CellType,
    newCell: CellType,
    currentPlayer: string,
  ): boolean {
    const knight = oldCell.piece;

    // Vérifier si la case de départ contient un cavalier de la bonne couleur
    if (!knight || knight.color !== currentPlayer || knight.symbol !== 'n') {
      return false;
    }

    // Vérifier si le déplacement est valide
    const xDiff = Math.abs(oldCell.x - newCell.x);
    const yDiff = Math.abs(
      this.y_axis.indexOf(oldCell.y) - this.y_axis.indexOf(newCell.y),
    );
    if ((xDiff === 2 && yDiff === 1) || (xDiff === 1 && yDiff === 2)) {
      // Déplacement
      newCell.piece = knight;
      oldCell.piece = null;

      return true;
    }
    return false;
  }

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
    for (let i = 1; i < xDiff; i++) {
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
    const xDiff = Math.abs(oldCell.x - newCell.x);
    const yDiff = Math.abs(
      this.y_axis.indexOf(oldCell.y) - this.y_axis.indexOf(newCell.y),
    );
    const isDiagonal = xDiff === yDiff;
    const isHorizontal = oldCell.x === newCell.x;
    const isVertical = oldCell.y === newCell.y;

    if (!isDiagonal && !isHorizontal && !isVertical) {
      return false;
    }

    if (isDiagonal) {
      const xDirection = newCell.x > oldCell.x ? 1 : -1;
      const yDirection = newCell.y > oldCell.y ? 1 : -1;
      let x = oldCell.x + xDirection;
      let y = this.y_axis.indexOf(oldCell.y) + yDirection;
      while (x !== newCell.x && y !== this.y_axis.indexOf(newCell.y)) {
        if (board[x][y].piece) {
          return false;
        }
        x += xDirection;
        y += yDirection;
      }
    } else if (isHorizontal) {
      const start = Math.min(
        this.y_axis.indexOf(oldCell.y),
        this.y_axis.indexOf(newCell.y),
      );
      const end = Math.max(
        this.y_axis.indexOf(oldCell.y),
        this.y_axis.indexOf(newCell.y),
      );
      for (let i = start + 1; i < end; i++) {
        if (board[oldCell.x][i].piece) {
          return false;
        }
      }
    } else if (isVertical) {
      const start = Math.min(oldCell.x, newCell.x);
      const end = Math.max(oldCell.x, newCell.x);
      for (let i = start + 1; i < end; i++) {
        if (board[i][this.y_axis.indexOf(oldCell.y)].piece) {
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
