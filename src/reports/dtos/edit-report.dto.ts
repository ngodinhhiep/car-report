import { IsString, IsOptional } from "class-validator";

export class EditReportDto {
    @IsOptional()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    content: string;

    @IsOptional()
    @IsString()
    photo: string;
}

  