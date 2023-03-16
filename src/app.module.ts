import { Module, CacheModule, CacheStore } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import * as process from 'process';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.register({ 
      store: redisStore,
      host: 'localhost',
      port: 6379,
      isGlobal: true
    }),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI)
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
