export class ChessGameState {
  board: number[][];
  currentPlayer: number;

  constructor(board: number[][], currentPlayer: number) {
    this.board = board;
    this.currentPlayer = currentPlayer;
  }

  clone(): ChessGameState {
    const clonedBoard: number[][] = [];

    for (let i = 0; i < this.board.length; i++) {
      const row: number[] = [];

      for (let j = 0; j < this.board[i].length; j++) {
        row.push(this.board[i][j]);
      }

      clonedBoard.push(row);
    }

    return new ChessGameState(clonedBoard, this.currentPlayer);
  }

  applyMove(move: number[]) {
    const [fromRow, fromCol, toRow, toCol] = move;
    const piece = this.board[fromRow][fromCol];

    this.board[fromRow][fromCol] = 0;
    this.board[toRow][toCol] = piece;

    this.currentPlayer = 1 - this.currentPlayer;
  }
}

