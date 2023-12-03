import { Body, Get, Post, Param, UseGuards, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { NotFoundException } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedFile } from '@nestjs/common';
import { diskStorage } from 'multer';
import { Controller } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dtos/create-car.dto';
import { UpdateCarDto } from './dtos/update-car.dto';


@Controller('cars')
export class CarsController {
    constructor(private carsService: CarsService) {}

    // View car lists (For admin only)
    @Get('/admin_cars_list') 
    async adminViewCarsLists(@Res() res: Response, @CurrentUser() user: User) {
      if(user.admin) {
        const carList = await this.carsService.getAllCarsInfo();
        return res.render('view_cars_list', {carList})
      }
    }

    // View all website cars for admin
    @Get('/view_all_cars')
    @UseGuards(AuthGuard)
    async viewAllCars(@Res() res: Response) {
        const carList = await this.carsService.getAllCarsInfo();
        return res.render('our_cars', {carList})
    }

    // A form to submit new car creation for admin
    @Get('/car_create_form') 
    carCreateForm(@Res() res: Response) {
      return res.render('car_create_form', {});
    }

    // A form to update a car for admin
    @Get('/car_update_form/:id')
    async carUpdateForm(@Param('id') id: string, @Res() res: Response) {
      const carFound = await this.carsService.findOneCarByItsId(parseInt(id));
      return res.render('car_update_form', {carFound});
    }


    // Admin create cars
    @Post('/create_car')
    @UseGuards(AuthGuard) //  have to sign in in order to create the car
    @UseInterceptors(
        FileInterceptor('photo', {
          storage: diskStorage({
            destination: './public/uploads',
            filename: (req, file, callback) => {
                const originalName = file.originalname;
                callback(null, originalName);
            },  
          }),
        })
      )
    async createCar(@Body() body, @CurrentUser() user: User, @Res() res: Response, @UploadedFile() photo: Express.Multer.File) {
        if(user.admin) {
            const createNewCar = await this.carsService.createCar(body, user, photo);
            return res.redirect('/cars/admin_cars_list');
        }
    }

    // admin updates cars
    @Post('/update_car/:id')
    @UseInterceptors(
        FileInterceptor('photo', {
          storage: diskStorage({
            destination: './public/uploads',
            filename: (req, file, callback) => {
                const originalName = file.originalname;
                callback(null, originalName);
            },  
          }),
        })
      )
    async updateCar(@Param('id') id: string, @Body() body: Partial<UpdateCarDto>, @UploadedFile() photo: Express.Multer.File, @CurrentUser() user: User, @Res() res: Response) {
        if(user.admin) {
            const updatedCar = this.carsService.updateCar(parseInt(id), body, photo);
            return res.redirect('/cars/admin_cars_list')
        }
    }


    // admin deletes cars
    @Get('/delete_car/:id')
    async deleteCar(@Param('id') id: string, @CurrentUser() user: User, @Res() res: Response) {
        if(user.admin) {
            const deletedCar = this.carsService.deleteCar(parseInt(id));
            return res.redirect('/cars/admin_cars_list')
        }
    }


// Search cars by name
@Get('/search/name')
@UseGuards(AuthGuard)
async searchCarsByName(@Query('name') searchQuery: string, @Res() res: Response) {
  const searchedCars = await this.carsService.searchCarsByName(searchQuery);
  return res.render('searched_car', { searchedCars });
}

// Search cars by maker
@Get('/search/maker')
@UseGuards(AuthGuard)
async searchCarsByMaker(@Query('maker') searchQuery: string, @Res() res: Response) {
  const searchedCars = await this.carsService.searchCarsByMaker(searchQuery);
  return res.render('searched_car', { searchedCars });
}

// Search cars by price
@Get('/search/price')
@UseGuards(AuthGuard)
async searchCarsByPrice(@Query('fromPrice') fromPrice: string, @Query('toPrice') toPrice: string, @Res() res: Response) {
  const lowerPrice = parseFloat(fromPrice);
  const higherPrice = parseFloat(toPrice)
  const searchedCars = await this.carsService.searchCarsByPrice(lowerPrice, higherPrice);
  return res.render('searched_car', { searchedCars });
}
}
