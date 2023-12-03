import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { Report } from './report.entity';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from '../users/user.entity';
import { GetEstimatePriceDto } from './dtos/get-estimate-price.dto';
import { EditReportDto } from './dtos/edit-report.dto';
import { Car } from '../cars/car.entity';


@Injectable()
export class ReportsService {
    constructor(@InjectRepository(Report) private repository: Repository<Report>) {}


    // user/admin create report
    createReport(reportBody: CreateReportDto, user: User, photo: Express.Multer.File, car: Car) {
        const report = this.repository.create(reportBody);
        report.user = user; // identify the exact current user sent the review
        report.car = car; // identify the exact car which the review is sent too
        if (photo) {
             report.photo = photo.filename;
        }
        return this.repository.save(report);
    }

    // admin find one report
    findOneReport(id: number) {
        if (!id) {
            throw new NotFoundException('Report not found');
        }
        return this.repository.findOneBy({id: id}); 
    }

    // view all posted reviews
    async getAllReports(): Promise<Report[]> {
        const options: FindManyOptions<Report> = {
            order: { createdAt: 'DESC' },
        }
        return this.repository.find(options);
    }

    // current user view their own posted reports
    async getAllCurrentUserReports(userId: number): Promise<Report[]> {
        
        return this.repository.find({
             where: { user: { id: userId } },
             order: { createdAt: 'DESC' },
            });
    }

    // admin delete report
    async deleteReport(id: number) {
        const report = await this.repository.findOne({ where: { id } });
        if (!report) {
          throw new NotFoundException('Report not found');
        }
        return this.repository.remove(report);
      }

      // admin edit report
    async editReport(id: number, bodyInput: Partial<Report>) {
        const report = await this.findOneReport(id);
        if(!report) {
            throw new NotFoundException('report not found');
        }
        Object.assign(report, bodyInput);
        return this.repository.save(report);
    }

    
    createEstimatePrice({ maker, model, lng, lat, year, mileage}: Partial<GetEstimatePriceDto>) {
        return this.repository.createQueryBuilder()
        .select('AVG(price)', 'price')
        .where('maker = :maker', { maker })
        .andWhere('model = :model', { model })
        .andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
        .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
        .andWhere('year - :year BETWEEN -3 AND 3', { year })
        .andWhere('year - :year BETWEEN -3 AND 3', { year })
        .andWhere('approved IS TRUE')
        .orderBy('ABS(mileage - :mileage)', 'DESC')
        .setParameters({ mileage })
        .limit(3) // only take 3 reports satisfying the conditions
        .getRawOne()
    }

    // get reviews of a specific cars (not all reviews)
    async getCarReviews(carId: number): Promise<Report[]> {
        const carReviews = await this.repository.find({ 
            where: { car: { id: carId } },
            order: { createdAt: 'DESC' },
        });
        return carReviews;
    }
}
