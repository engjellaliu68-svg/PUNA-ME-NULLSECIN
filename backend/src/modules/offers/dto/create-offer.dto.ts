import { IsInt, IsOptional, IsString, Min } from "class-validator";

export class CreateOfferDto {
  @IsString()
  jobId!: string;

  @IsInt()
  @Min(0)
  price!: number;

  @IsOptional()
  @IsString()
  message?: string;
}
