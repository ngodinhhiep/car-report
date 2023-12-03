import { IsString, IsNumber, Min, Max } from "class-validator";

 
 export class CreateCarDto {

    @IsString()
    name: string;

    @IsString()
    maker: string;

    @IsNumber()
    @Min(100)
    @Max(1000000)
    price: number;

    @IsString()
    photo: string;
 }