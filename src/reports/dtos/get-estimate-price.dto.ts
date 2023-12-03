import {
    IsString,
    IsNumber,
    IsLongitude,
    IsLatitude,
    Min,
    Max,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class GetEstimatePriceDto {
    
    @IsString()
    maker: string;

    @IsString()
    model: string;

    @Transform(({value}) => parseInt(value))
    @IsNumber()
    @Min(1930)
    @Max(2023)
    year: number;

    @Transform(({value}) => parseFloat(value))
    @IsLatitude()
    lng: number;

    @Transform(({value}) => parseFloat(value))
    @IsLongitude()
    lat: number;

    @Transform(({value}) => parseFloat(value))
    @IsNumber()
    @Min(0)
    @Max(100000)
    mileage: number;
}