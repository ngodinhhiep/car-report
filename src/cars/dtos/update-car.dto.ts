import { IsString, IsNumber, IsOptional, Min, Max } from "class-validator"
export class UpdateCarDto {
    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    maker: string;

    @IsOptional()
    @IsNumber()
    @Min(100)
    @Max(1000000)
    price: number;

    @IsOptional()
    @IsString()
    photo: string;
}