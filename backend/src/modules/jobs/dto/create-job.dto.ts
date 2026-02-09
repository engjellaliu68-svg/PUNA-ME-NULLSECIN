import { IsEnum, IsInt, IsOptional, IsString, Min } from "class-validator";
import { JobLocationType } from "@puna-jote/shared";

export class CreateJobDto {
  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsString()
  categoryId!: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsEnum(JobLocationType)
  locationType!: JobLocationType;

  @IsOptional()
  @IsInt()
  @Min(0)
  budgetMin?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  budgetMax?: number;
}
