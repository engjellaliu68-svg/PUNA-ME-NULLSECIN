import { IsEnum } from "class-validator";
import { OfferStatus } from "@puna-jote/shared";

export class UpdateOfferStatusDto {
  @IsEnum(OfferStatus)
  status!: OfferStatus;
}
