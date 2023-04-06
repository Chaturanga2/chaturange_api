import { Test, TestingModule } from '@nestjs/testing';
import { ChessGameService } from './chess-game.service';

describe('ChessGameService', () => {
  let service: ChessGameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChessGameService],
    }).compile();

    service = module.get<ChessGameService>(ChessGameService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
