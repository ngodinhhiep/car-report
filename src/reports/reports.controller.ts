import { Controller, Post, Body, UseGuards, Param, Get, Query, Res} from '@nestjs/common';
import { Response } from 'express';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { ReportDto } from './dtos/report.dto';
import { EditReportDto } from './dtos/edit-report.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { AdminGuard } from '../guards/admin.guard';
import { GetEstimatePriceDto } from './dtos/get-estimate-price.dto';
import { NotFoundException } from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedFile } from '@nestjs/common';
import { diskStorage } from 'multer';
import { UsersService } from '../users/users.service';
import { CarsService } from '../cars/cars.service';
import { Report } from './report.entity';

@Controller('reports')
export class ReportsController {
    constructor(private reportsService: ReportsService,
                private carsService: CarsService,
                private usersService: UsersService) {}

                // view all reviews (including the reviews) posted from other users to one specific car
                @Get('/car_reviews/:carId') 
                @UseGuards(AuthGuard)
                async viewCarReviews(@Res() res: Response, @Param('carId') carId: string) {
                const carReviews = await this.reportsService.getCarReviews(parseInt(carId));
                return res.render('car_reviews.hbs', { carReviews: carReviews });
                }

    @Get('/all_reviews/') 
    @UseGuards(AuthGuard)
    async viewAllReports(@Res() res: Response) {
        const allReviews = await this.reportsService.getAllReports();
        return res.render('view_all_reviews.hbs', {allReviews});
    }

    // Form edit submission for Users
    @Get('/review_edit_form/:id') 
    async reportFormEditForUser(@Param('id') id: string, @CurrentUser() user: User, @Res() res: Response) {
        const previousReview = await this.reportsService.findOneReport(parseInt(id));
        return res.render('review_edit_form', { previousReview })
    }

    // Form edit submission for Admins
    @Get('admin_report_form_edit/:id')
    @UseGuards(AdminGuard)
    async reportFormEditForAdmin(@Param('id') id: string, @Res() res: Response) {
        const report = await this.reportsService.findOneReport(parseInt(id));
        return res.render('admin-report-form-edit-page', { report })
    }

    @Get('/estimate')
    getEstimatePrice(@Query() query: GetEstimatePriceDto) {
        return this.reportsService.createEstimatePrice(query);
    }

    
    // get report submission form of a specific car
    @Get('/post_review/:id')
    @UseGuards(AuthGuard)
    async reportPage(@CurrentUser() user: User, @Param('id') id: string, @Res() res: Response) {
        const userId = user.id;
        const currentUser = await this.usersService.findOneUser(userId);
        const carFound = await this.carsService.findOneCarByItsId(parseInt(id));
        return res.render('reports-page', {carFound, currentUser});
    }

    
    // user submitted review for a specific car
    @Post('/review_submitted/:id')
    @UseGuards(AuthGuard)
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
    async reviewSubmitted(@Param('id') carId: number, @Body() body, @CurrentUser() user: User, @UploadedFile() photo: Express.Multer.File, @Res() res: Response) {
        const car = await this.carsService.findOneCarByItsId(carId); 
        const submittedReview = await this.reportsService.createReport(body, user, photo, car);
        return res.redirect('/auth/user')
    }


    // user view their reviews
    @Get('/review_history')
    @UseGuards(AuthGuard)
    async viewUserReports(@CurrentUser() user: User, @Res() res: Response) {
        const allCurrentUserReviews = await this.reportsService.getAllCurrentUserReports(user.id);

        return res.render('user_review_history', {allCurrentUserReviews})
    }


    // find a specific report with an id
    @Get('/:id')
    findOneReportWithAnID(@Param('id') id: string) {
      const report = this.reportsService.findOneReport(parseInt(id));
      if (!report) {
        throw new NotFoundException('user not found');
      }
      return report;
    }

    // add report
    @Post('/add')
    addReport(@Res() res:Response) {
    return res.render('add-report-page.hbs')
    }

    
// // submit add report
// @Post('/submit-add')
// @UseGuards(AdminGuard)
// async submitAddReports(@Body()body: CreateReportDto, user: User,@UploadedFile() photo: Express.Multer.File, @Res() res: Response) {
//     const report = await this.reportsService.createReport(body, user, photo)
    
//     return res.redirect('/reports');
// }

// user edits their own reports
@Post('/edit_review/:id')
async userEditReports(@Param('id') id:string, @Body() body: EditReportDto, @Res() res: Response) {
    const userEditedReport = await this.reportsService.editReport(parseInt(id), body)
        
      return res.redirect('/reports/review_history');
       
}

    // Admin edits users' reports
    @Post('/admin_edit_report/:id')
    async editReports(@Param('id') id: string,@CurrentUser() user: User,  @Body() body: EditReportDto, @Res() res: Response) {
        const editedReport = await this.reportsService.editReport(parseInt(id), body)
        if (editedReport) {
            return res.redirect('/reports');
        } else {
            throw new NotFoundException('Report not found');
        }
    }

    // user deletes their own reviews
    @Post('delete_review/:id')
    async userDeleteReports(@Param('id') id: string, @Res() res:Response) {
        await this.reportsService.deleteReport(parseInt(id));
        return res.redirect('/reports/review_history');
    }


    // Admin deletes reviews
    @Post('/delete/:id') // 
    @UseGuards(AdminGuard)
    async adminDeleteReports(@Param('id') id: string,  @Res() res: Response) {
        await this.reportsService.deleteReport(parseInt(id));
        return res.redirect('/reports');
    }

   
}