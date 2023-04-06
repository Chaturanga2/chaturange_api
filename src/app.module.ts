import {
  CacheModule,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SocketModule } from './socket/socket.module';
import * as process from 'process';
import * as redisStore from 'cache-manager-redis-store';
import { AuthMiddleware } from './middleware/auth-middleware.service';
import { UserController } from './user/controllers/user.controller';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from './user/user.module';
import { ChessGameService } from './chess-game/chess-game.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    SocketModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtService, ChessGameService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(UserController);
  }
}
