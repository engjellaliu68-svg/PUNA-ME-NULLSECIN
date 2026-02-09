import { IsString } from "class-validator";

export class SendMessageDto {
  @IsString()
  jobId!: string;

  @IsString()
  receiverId!: string;

  @IsString()
  content!: string;
}
