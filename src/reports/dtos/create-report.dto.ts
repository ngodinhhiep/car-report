import {IsString} from 'class-validator';
export class CreateReportDto {
   
    @IsString()
    title: string;

    @IsString()
    content: string;

    @IsString()
    photo: string;
}