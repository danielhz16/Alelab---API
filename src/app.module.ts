import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { LangMiddleware, IpMiddleware, LoggerMiddleware } from '@shared';
import { NotesModule } from './modules/notes/notes.module';
import { IsAuthGuard, RedisClient } from '@shared';
import helmet from 'helmet';
import { APP_GUARD } from '@nestjs/core';
import { IpLimiterGuard } from '@shared';
import { ThrottlerModule } from '@nestjs/throttler';
import { CoursesModule } from './modules/courses/courses.module';
import { FilesModule } from './modules/files/files.module';
import { DiagramsModule } from './modules/diagrams/diagram.module';
import { AppLifecycle } from './init';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 20,
      },
    ]),
    AuthModule,
    NotesModule,
    CoursesModule,
    FilesModule,
    DiagramsModule
  ],
  controllers: [AppController],
  providers: [AppService, LangMiddleware, IpMiddleware, LoggerMiddleware, AppLifecycle, {
    provide: APP_GUARD,
    useClass: IsAuthGuard,
  }, {
      provide: APP_GUARD,
      useClass: IpLimiterGuard,
    }],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(
      LoggerMiddleware,
      helmet({
        crossOriginResourcePolicy: { policy: "cross-origin" },
      }),
      LangMiddleware,
      IpMiddleware,
    ).forRoutes('*');
  }
}
