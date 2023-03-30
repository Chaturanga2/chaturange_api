import { ChessGameState } from './ChessGameState';

export class ChessGameEngine {
  maxDepth: number;

  constructor(maxDepth: number) {
    this.maxDepth = maxDepth;
  }

  generatePossibleMoves(gameState: ChessGameState, player: number): number[][] {
    let possibleMoves: number[][] = [];

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = gameState.board[row][col];

        if (piece === 0 || Math.sign(piece) !== player) {
          continue;
        }

        switch (Math.abs(piece)) {
          case 1: // Pawn
            possibleMoves = this.generatePossibleMovesForPieces(
              gameState,
              piece,
              row,
              col,
            );
            break;
          case 2: // Knight
            possibleMoves = this.generatePossibleMovesForPieces(
              gameState,
              piece,
              row,
              col,
            );
            break;
          case 3: // Bishop
            possibleMoves = this.generatePossibleMovesForPieces(
              gameState,
              piece,
              row,
              col,
            );
            break;
          case 4: // Rook
            possibleMoves = this.generatePossibleMovesForPieces(
              gameState,
              piece,
              row,
              col,
            );
            break;
          case 5: // Queen
            possibleMoves = this.generatePossibleMovesForPieces(
              gameState,
              piece,
              row,
              col,
            );
            break;
          case 6: // King
            possibleMoves = this.generatePossibleMovesForPieces(
              gameState,
              piece,
              row,
              col,
            );
            break;
        }
      }
    }

    return possibleMoves;
  }

  private generatePossibleMovesForPieces(
    gameState: ChessGameState,
    piece: number,
    row: number,
    col: number,
  ): number[][] {
    const possibleMoves: number[][] = [];
    const player = gameState.currentPlayer;

    if (piece === 1) {
      // Possible moves for pawn
      const direction = player === 1 ? 1 : -1;
      const startingRow = player === 1 ? 1 : 6;

      if (gameState.board[row + direction][col] === 0) {
        possibleMoves.push([row + direction, col]);

        if (
          row === startingRow &&
          gameState.board[row + 2 * direction][col] === 0
        ) {
          possibleMoves.push([row + 2 * direction, col]);
        }
      }

      if (col > 0 && gameState.board[row + direction][col - 1] * player < 0) {
        possibleMoves.push([row + direction, col - 1]);
      }

      if (col < 7 && gameState.board[row + direction][col + 1] * player < 0) {
        possibleMoves.push([row + direction, col + 1]);
      }
    } else if (piece === 2) {
      // Possible moves for knight
      const moves: number[][] = [
        [-2, -1],
        [-2, 1],
        [-1, -2],
        [-1, 2],
        [1, -2],
        [1, 2],
        [2, -1],
        [2, 1],
      ];

      for (let i = 0; i < moves.length; i++) {
        const newRow = row + moves[i][0];
        const newCol = col + moves[i][1];

        if (newRow >= 0 && newRow <= 7 && newCol >= 0 && newCol <= 7) {
          const pieceAtNewPosition = gameState.board[newRow][newCol];
          if (pieceAtNewPosition === 0 || pieceAtNewPosition * player < 0) {
            possibleMoves.push([newRow, newCol]);
          }
        }
      }
    } else if (piece === 3) {
      // Possible moves for bishop
      const directions: number[][] = [
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1],
      ];
    } else if (piece === 4) {
      // Possible moves for rook
      const directions: number[][] = [
        [-1, 0],
        [0, -1],
        [1, 0],
        [0, 1],
      ];
    } else if (piece === 5) {
      // Possible moves for queen
      const directions: number[][] = [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 0],
        [1, 1],
      ];
    } else if (piece === 6) {
      // Possible moves for king
      const directions: number[][] = [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 0],
        [1, 1],
      ];
    }

    return possibleMoves;
  }

  private findKingPosition(
    board: number[][],
    player: number,
  ): [number, number] {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];

        if (Math.abs(piece) === 6 && Math.sign(piece) === player) {
          return [row, col];
        }
      }
    }

    throw new Error(`Could not find king for player ${player}`);
  }

  isKingInCheck(
    gameState: ChessGameState,
    kingPosition: [number, number],
    player: number,
  ): boolean {
    const board = gameState.board;

    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        const piece = board[row][col];
        if (piece !== 0 && piece !== player) {
          const possibleMoves = this.generatePossibleMovesForPieces(
            gameState,
            piece,
            row,
            col,
          );
          if (possibleMoves.includes(kingPosition)) {
            return true;
          }
        }
      }
    }

    return false;
  }

  private calculateScore(gameState: ChessGameState, player: number): number {
    const pieceValues = [0, 1, 3, 3, 5, 9, Infinity];
    let score = 0;

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = gameState.board[row][col];

        if (piece !== 0) {
          const pieceValue = pieceValues[Math.abs(piece)];
          score += Math.sign(piece) === player ? pieceValue : -pieceValue;
        }
      }
    }

    const opponent = player === 1 ? -1 : 1;
    const kingPosition = this.findKingPosition(gameState.board, opponent);
    const inCheck = this.isKingInCheck(gameState, kingPosition, player);

    if (inCheck) {
      score += 10;
    }

    return score;
  }

  private isGameOver(gameState: ChessGameState): boolean {
    const board = gameState.board;
    const player = gameState.currentPlayer;
    const opponent = player === 1 ? -1 : 1;

    const opponentMoves = this.generatePossibleMoves(gameState, opponent);
    const playerMoves = this.generatePossibleMoves(gameState, player);

    const kingPosition = this.findKingPosition(board, opponent);

    const opponentInCheck = this.isKingInCheck(
      gameState,
      kingPosition,
      opponent,
    );
    const playerInCheck = this.isKingInCheck(gameState, kingPosition, player);

    // Check for checkmate
    if (opponentInCheck && opponentMoves.length === 0) {
      return true;
    }

    // Check for stalemate
    if (!playerInCheck && playerMoves.length === 0) {
      return true;
    }

    // Check for insufficient material
    const remainingPieces = board
      .flat()
      .filter((p) => p !== 0 && Math.abs(p) !== 6);

    const hasInsufficientMaterial =
      remainingPieces.length <= 2 ||
      (remainingPieces.length === 3 &&
        remainingPieces.every((p) => Math.abs(p) === 3 || Math.abs(p) === 6));

    if (hasInsufficientMaterial) {
      return true;
    }

    return false;
  }

  private makeMove(gameState: ChessGameState, move: number[]): ChessGameState {
    const [fromRow, fromCol, toRow, toCol] = move;
    const piece = gameState.board[fromRow][fromCol];
    gameState.board[fromRow][fromCol] = 0;
    gameState.board[toRow][toCol] = piece;
    gameState.currentPlayer = -gameState.currentPlayer;
    return gameState;
  }

  evaluateGameState(
    gameState: ChessGameState,
    player: number,
    depth: number,
    alpha: number,
    beta: number,
  ): number {
    if (depth === 0 || this.isGameOver(gameState)) {
      return this.calculateScore(gameState, player);
    }

    const possibleMoves = this.generatePossibleMoves(gameState, player);

    if (possibleMoves.length === 0) {
      return this.calculateScore(gameState, player);
    }

    let bestScore =
      player === 1 ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;

    for (const move of possibleMoves) {
      const newGameState = this.makeMove(gameState, move);
      const score = this.evaluateGameState(
        newGameState,
        1 - player,
        depth - 1,
        alpha,
        beta,
      );

      if (player === 1) {
        bestScore = Math.max(bestScore, score);
        alpha = Math.max(alpha, score);
      } else {
        bestScore = Math.min(bestScore, score);
        beta = Math.min(beta, score);
      }

      if (beta <= alpha) {
        break;
      }
    }

    return bestScore;
  }

  getBestMove(gameState: ChessGameState, player: number): number[] {
    const possibleMoves = this.generatePossibleMoves(gameState, player);

    let bestMove: number[] | null = null;
    let bestScore = -Infinity;

    for (const move of possibleMoves) {
      const newGameState = gameState.clone();
      newGameState.applyMove(move);

      const score = this.evaluateGameState(
        newGameState,
        player,
        1,
        -Infinity,
        Infinity,
      );

      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }

      if (bestMove) {
        return bestMove;
      } else {
        throw new Error('No move found');
      }
    }
  }
}
