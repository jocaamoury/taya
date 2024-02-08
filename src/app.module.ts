// eslint-disable-next-line prettier/prettier
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { dataSourceOptions } from './configs/ormconfig';
import { Proposal, User } from './entities/entities.entity';
import { UserMiddleware } from './get-user-middleware';
import { AppController } from './implementations/app.controller';
import { AppService } from './implementations/app.service.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    TypeOrmModule.forFeature([User, Proposal]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserMiddleware)
      .exclude({ path: 'proposals/all', method: RequestMethod.GET })
      .forRoutes(
        { path: 'proposals/:id', method: RequestMethod.GET },
        { path: 'proposals', method: RequestMethod.GET },
        { path: 'proposals/refused', method: RequestMethod.GET },
        { path: 'proposals/:proposal_id/approve', method: RequestMethod.POST },
      );
  }
}
