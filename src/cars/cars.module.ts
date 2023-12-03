import { Module } from '@nestjs/common';
import { MiddlewareConsumer } from '@nestjs/common';
import { ParseNumberMiddleware } from '../users/middlewares/parseNumber.middleware';
import { CarsController } from './cars.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from './car.entity';
import { CarsService } from '../cars/cars.service';

@Module({
  imports: [TypeOrmModule.forFeature([Car])],
  controllers: [CarsController],
  providers: [CarsService]
})
export class CarsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ParseNumberMiddleware).forRoutes('*')
  }
}
