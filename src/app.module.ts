import { Module, CacheModule, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SocketModule } from './socket/socket.module';
import * as process from 'process';
import * as redisStore from 'cache-manager-redis-store';

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
      isGlobal: true
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    SocketModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
