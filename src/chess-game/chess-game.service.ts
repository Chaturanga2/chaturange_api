import { Injectable } from '@nestjs/common';
import { CellType, GameSocketEmitType, Piece } from '../types/chess.types';

@Injectable()
export class ChessGameService {
  public readonly y_axis = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', ''];
  public readonly x_axis = [1, 2, 3, 4, 5, 6, 7, 8];
  public readonly board: CellType[][] = [];
  public readonly socketEvents: GameSocketEmitType = {} as GameSocketEmitType;

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
            moved: false,
            image: piece.image,
            symbol: piece.s,
            color: piece.color,
          };
        }
        row.push(cell);
      }
      this.board.push(row);
    }
    console.log(this.board);
    return this.board;
  }

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
      this.socketEvents.message = `C'est au tour du joueur ${currentPlayer}`;
      this.socketEvents.currentPlayer = currentPlayer;
      this.socketEvents.board = board;
      return this.socketEvents;
    }
    // Calculer la direction de déplacement du pion
    const direction = currentPlayer === 'w' ? 1 : -1;

    // Vérifier si le déplacement est valide
    if (oldCell.y === newCell.y) {
      // Déplacement en avant
      if (oldCell.x + direction === newCell.x && !newCell.piece) {
        // Déplacement simple

        // newCell.piece = oldCell.piece;
        board[newCell.x][this.y_axis.indexOf(newCell.y)].piece = oldCell.piece;
        board[oldCell.x][this.y_axis.indexOf(oldCell.y)].piece = null;

        this.socketEvents.currentPlayer = currentPlayer === 'w' ? 'b' : 'w';
        this.socketEvents.message = `C'est au tour du joueur ${currentPlayer}`;
        this.socketEvents.board = board;
        // Générer l'historique du coup
        this.historyMove(currentPlayer, oldCell, newCell);
        return this.socketEvents;
      } else if (
        oldCell.x + direction * 2 === newCell.x &&
        !oldCell.piece.moved &&
        !newCell.piece
      ) {
        // Déplacement double au premier coup
        // newCell.piece = oldCell.piece;
        board[newCell.x][this.y_axis.indexOf(newCell.y)].piece = oldCell.piece;
        board[oldCell.x][this.y_axis.indexOf(oldCell.y)].piece = null;

        this.socketEvents.currentPlayer = currentPlayer === 'w' ? 'b' : 'w';
        this.socketEvents.message = `C'est au tour du joueur ${currentPlayer}`;
        this.socketEvents.board = board;
        // Générer l'historique du coup
        this.historyMove(currentPlayer, oldCell, newCell);
        return this.socketEvents;
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
        // newCell.piece = oldCell.piece;
        board[newCell.x][this.y_axis.indexOf(newCell.y)].piece = oldCell.piece;
        board[oldCell.x][this.y_axis.indexOf(oldCell.y)].piece = null;

        this.socketEvents.currentPlayer = currentPlayer === 'w' ? 'b' : 'w';
        this.socketEvents.message = `C'est au tour du joueur ${currentPlayer}`;
        this.socketEvents.board = board;
        // Générer l'historique du coup
        this.historyMove(currentPlayer, oldCell, newCell);
        return this.socketEvents;
      }
    }

    this.socketEvents.message = `Movement invalide`;
    this.socketEvents.board = board;
    this.socketEvents.currentPlayer = currentPlayer;
    return this.socketEvents;
  }

  public movePieces(
    pieceName: string,
    board: CellType[][],
    oldCell: CellType,
    newCell: CellType,
    currentPlayer: string,
  ): GameSocketEmitType {
    switch (pieceName) {
      case 'pawn':
        return this.movePawn(board, oldCell, newCell, currentPlayer);
      default:
        this.socketEvents.message = `Movement invalide`;
        this.socketEvents.board = board;
        this.socketEvents.currentPlayer = currentPlayer;
        return this.socketEvents;
    }
  }

  public historyMove(
    currentPlayer: string,
    oldCell: CellType,
    newCell: CellType,
  ): void {
    this.socketEvents.shot = `P->${newCell.x}${newCell.y}`;
  }
}
