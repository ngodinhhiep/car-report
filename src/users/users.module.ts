import { Module, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity'; 
import { CurrentUserMiddleware } from './middlewares/current-user.middleware';
import { Report } from 'src/reports/report.entity';
import { ReportsService } from 'src/reports/reports.service';
import { Car } from 'src/cars/car.entity';
import { CarsService } from '../cars/cars.service';


@Module({
  imports: [TypeOrmModule.forFeature([User, Report, Car])],
  controllers: [UsersController],
  providers: [
    UsersService, 
    AuthService, 
    ReportsService,
    CarsService,
  ],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*')
  }
}
