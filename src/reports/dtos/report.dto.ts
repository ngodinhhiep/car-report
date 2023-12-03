import { Expose, Transform } from 'class-transformer';
import { User } from '../../users/user.entity';

export class ReportDto {
    @Expose()
    id: number;

    @Expose()
    price: number;

    @Expose()
    year: number;

    @Expose()
    lng: number;

    @Expose()
    lat: number;

    @Expose()
    maker: string;

    @Expose()
    model: string;

    @Expose()
    mileage: number;

    @Expose()
    approved: boolean;

    @Transform(({obj}) => obj.user.id) // look at the original response, look at its .user.id value
    @Expose()
    userId: number; // assign that .user.id to userId
}