import { Injectable } from '@nestjs/common';
import { CellType, GameSocketEmitType, Piece } from '../types/chess.types';

@Injectable()
export class ChessGameService {
  public readonly y_axis = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', ''];
  public readonly x_axis = [1, 2, 3, 4, 5, 6, 7, 8];
  public readonly board: CellType[][] = [];
  public readonly socketEvents: GameSocketEmitType = {} as GameSocketEmitType;

  public movePawn(
    board: CellType[][],
    oldCell: CellType,
    newCell: CellType,
    currentPlayer: string,
  ): GameSocketEmitType {
    // Vérifier si la case de départ contient un pion de la bonne couleur
    if (
      !oldCell.piece ||
      oldCell.piece.color !== currentPlayer ||
      oldCell.piece.symbol !== 'p'
    ) {
      return this.invalidMove(currentPlayer, board, "C'est au tour du joueur");
    }
    // Calculer la direction de déplacement du pion
    const direction = currentPlayer === 'w' ? 1 : -1;

    // Vérifier si le déplacement est valide
    if (oldCell.y === newCell.y) {
      // Déplacement en avant
      if (oldCell.x + direction === newCell.x && !newCell.piece) {
        // Déplacement simple
        return this.initReturnSocket(currentPlayer, board, oldCell, newCell);
      } else if (
        oldCell.x + direction * 2 === newCell.x &&
        !oldCell.piece.moved &&
        !newCell.piece
      ) {
        // Déplacement double au premier coup
        return this.initReturnSocket(currentPlayer, board, oldCell, newCell);
      }
    } else if (
      Math.abs(
        this.y_axis.indexOf(oldCell.y) - this.y_axis.indexOf(newCell.y),
      ) === 1 &&
      oldCell.x + direction === newCell.x
    ) {
      // Prise en diagonale
      const toCell = newCell;
      if (toCell.piece && toCell.piece.color !== currentPlayer) {
        return this.initReturnSocket(currentPlayer, board, oldCell, newCell);
      }
    }
    return this.invalidMove(currentPlayer, board, 'Movement invalide');
  }

  public moveRook(
    board: CellType[][],
    oldCell: CellType,
    newCell: CellType,
    currentPlayer: string,
  ): GameSocketEmitType {
    const rook = oldCell.piece;

    // Vérifier si la case de départ contient une tour de la bonne couleur
    if (
      !oldCell.piece ||
      oldCell.piece.color !== currentPlayer ||
      oldCell.piece.symbol !== 'r'
    ) {
      this.socketEvents.message = `C'est au tour du joueur ${currentPlayer}`;
      this.socketEvents.currentPlayer = currentPlayer;
      this.socketEvents.board = board;
      return this.socketEvents;
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
          this.socketEvents.message = `Movement invalide`;
          this.socketEvents.board = board;
          this.socketEvents.currentPlayer = currentPlayer;
          return this.socketEvents;
        }
      }
    } else if (oldCell.y === newCell.y) {
      // Déplacement vertical
      const min = Math.min(oldCell.x, newCell.x);
      const max = Math.max(oldCell.x, newCell.x);
      for (let i = min + 1; i < max; i++) {
        if (board[i][this.y_axis.indexOf(oldCell.y)].piece) {
          this.socketEvents.message = `Movement invalide`;
          this.socketEvents.board = board;
          this.socketEvents.currentPlayer = currentPlayer;
          return this.socketEvents;
        }
      }
    } else {
      this.socketEvents.message = `Movement invalide`;
      this.socketEvents.board = board;
      this.socketEvents.currentPlayer = currentPlayer;
      return this.socketEvents;
    }

    // Déplacement
    return this.initReturnSocket(currentPlayer, board, oldCell, newCell);
  }

  public moveKnight(
    board: CellType[][],
    oldCell: CellType,
    newCell: CellType,
    currentPlayer: string,
  ): GameSocketEmitType {
    const knight = oldCell.piece;

    // Vérifier si la case de départ contient un cavalier de la bonne couleur
    if (
      !oldCell.piece ||
      oldCell.piece.color !== currentPlayer ||
      oldCell.piece.symbol !== 'n'
    ) {
      return this.invalidMove(currentPlayer, board, "C'est au tour du joueur");
    }

    /// Vérifier si le déplacement est valide
    const x = Math.abs(oldCell.x - newCell.x);
    const y = Math.abs(
      this.y_axis.indexOf(oldCell.y) - this.y_axis.indexOf(newCell.y),
    );
    if ((x === 2 && y === 1) || (x === 1 && y === 2)) {
      // Déplacement
      return this.initReturnSocket(currentPlayer, board, oldCell, newCell);
    }
    return this.invalidMove(currentPlayer, board, 'Movement invalide');
  }

  public moveBishop(
    board: CellType[][],
    oldCell: CellType,
    newCell: CellType,
    currentPlayer: string,
  ): GameSocketEmitType {
    // Vérifier si la case de départ contient un fou de la bonne couleur
    if (
      !oldCell.piece ||
      oldCell.piece.color !== currentPlayer ||
      oldCell.piece.symbol !== 'b'
    ) {
      return this.invalidMove(currentPlayer, board, "C'est au tour du joueur");
    }

    // Vérifier si le déplacement est valide
    const xDiff = Math.abs(oldCell.x - newCell.x);
    const yDiff = Math.abs(
      this.y_axis.indexOf(oldCell.y) - this.y_axis.indexOf(newCell.y),
    );
    if (xDiff !== yDiff) {
      return this.invalidMove(currentPlayer, board, 'Movement invalide');
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
        return this.invalidMove(currentPlayer, board, 'Movement invalide');
      }
    }

    // Déplacement
    newCell.piece = oldCell.piece;
    oldCell.piece = null;

    return this.initReturnSocket(currentPlayer, board, oldCell, newCell);
  }

  public moveQueen(
    board: CellType[][],
    oldCell: CellType,
    newCell: CellType,
    currentPlayer: string,
  ): GameSocketEmitType {
    // Vérifier si la case de départ contient une reine de la bonne couleur
    if (
      !oldCell.piece ||
      oldCell.piece.color !== currentPlayer ||
      oldCell.piece.symbol !== 'q'
    ) {
      return this.invalidMove(currentPlayer, board, "C'est au tour du joueur");
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
      return this.invalidMove(
        currentPlayer,
        board,
        'Movement invalide du joueur',
      );
    }

    if (isDiagonal) {
      const xDirection = newCell.x > oldCell.x ? 1 : -1;
      const yDirection = newCell.y > oldCell.y ? 1 : -1;
      let x = oldCell.x + xDirection;
      let y = this.y_axis.indexOf(oldCell.y) + yDirection;
      while (x !== newCell.x && y !== this.y_axis.indexOf(newCell.y)) {
        if (board[x][y].piece) {
          return this.invalidMove(
            currentPlayer,
            board,
            'Movement invalide du joueur',
          );
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
          return this.invalidMove(
            currentPlayer,
            board,
            'Movement invalide du joueur',
          );
        }
      }
    } else if (isVertical) {
      const start = Math.min(oldCell.x, newCell.x);
      const end = Math.max(oldCell.x, newCell.x);
      for (let i = start + 1; i < end; i++) {
        if (board[i][this.y_axis.indexOf(oldCell.y)].piece) {
          return this.invalidMove(
            currentPlayer,
            board,
            'Movement invalide du joueur',
          );
        }
      }
    }

    // Déplacement
    return this.initReturnSocket(currentPlayer, board, oldCell, newCell);
  }

  public moveKing(
    board: CellType[][],
    oldCell: CellType,
    newCell: CellType,
    currentPlayer: string,
  ): GameSocketEmitType {
    const king = oldCell.piece;

    // Vérifier si la case de départ contient un roi de la bonne couleur
    if (
      !oldCell.piece ||
      oldCell.piece.color !== currentPlayer ||
      oldCell.piece.symbol !== 'k'
    ) {
      return this.invalidMove(currentPlayer, board, "C'est au tour du joueur");
    }
    // Vérifier si le déplacement est valide
    const xDiff = oldCell.x === newCell.x ? 0 : 1;
    const yDiff =
      this.y_axis.indexOf(oldCell.y) - this.y_axis.indexOf(newCell.y);
    if (xDiff > 1 || yDiff > 1) {
      return this.invalidMove(
        currentPlayer,
        board,
        'Movement invalide du joueur',
      );
    }
    return this.initReturnSocket(currentPlayer, board, oldCell, newCell);
  }

  public movePieces(
    pieceName: string,
    board: CellType[][],
    oldCell: CellType,
    newCell: CellType,
    currentPlayer: string,
  ): GameSocketEmitType {
    if (pieceName === 'pawn') {
      return this.movePawn(board, oldCell, newCell, currentPlayer);
    } else if (pieceName === 'rook') {
      return this.moveRook(board, oldCell, newCell, currentPlayer);
    } else if (pieceName === 'knight') {
      return this.moveKnight(board, oldCell, newCell, currentPlayer);
    } else if (pieceName === 'bishop') {
      return this.moveBishop(board, oldCell, newCell, currentPlayer);
    } else if (pieceName === 'queen') {
      return this.moveQueen(board, oldCell, newCell, currentPlayer);
    } else if (pieceName === 'king') {
      return this.moveKing(board, oldCell, newCell, currentPlayer);
    } else {
      return this.invalidMove(currentPlayer, board, 'Movement invalide');
    }
  }

  public historyMove(
    currentPlayer: string,
    x: number,
    y: string,
    s: string,
  ): void {
    this.socketEvents.shot = `${s}.${x}${y}`;
  }

  public initReturnSocket(
    currentPlayer: string,
    board: CellType[][],
    oldCell: CellType,
    newCell: CellType,
  ): GameSocketEmitType {
    const x = newCell.x;
    const y = newCell.y;
    const s = oldCell.piece.symbol;
    board[newCell.x][this.y_axis.indexOf(newCell.y)].piece = oldCell.piece;
    board[oldCell.x][this.y_axis.indexOf(oldCell.y)].piece = null;
    this.socketEvents.currentPlayer = currentPlayer === 'w' ? 'b' : 'w';
    this.socketEvents.message = `C'est au tour du joueur ${currentPlayer}`;
    this.socketEvents.board = board;
    // Générer l'historique du coup
    this.historyMove(currentPlayer, x, y, s);
    return this.socketEvents;
  }

  public invalidMove(
    currentPlayer: string,
    board: CellType[][],
    message: string,
  ): GameSocketEmitType {
    this.socketEvents.message = `${message} ${currentPlayer}`;
    this.socketEvents.currentPlayer = currentPlayer;
    this.socketEvents.board = board;
    return this.socketEvents;
  }
}
