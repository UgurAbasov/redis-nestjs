import { RedisModule } from '@liaoliaots/nestjs-redis';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
@Module({
  imports: [CacheModule.register({isGlobal: true}),
    RedisModule.forRoot({
      config: {
        host: 'localhost',
        port: 6379,
      }
    })
    , EventsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}