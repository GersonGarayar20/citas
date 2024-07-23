import { IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export class CreateServiceDto {
    
    @IsString()
    name:string;

    @IsOptional()    
    @IsString()
    description?:string;

    @IsInt()
    duration: number;
}
