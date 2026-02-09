import { Body, Controller, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { OffersService } from "./offers.service";
import { CreateOfferDto } from "./dto/create-offer.dto";
import { UpdateOfferStatusDto } from "./dto/update-offer-status.dto";

@Controller("offers")
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createOffer(@CurrentUser() user: { id: string }, @Body() dto: CreateOfferDto) {
    return this.offersService.createOffer(user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id/status")
  updateStatus(
    @CurrentUser() user: { id: string },
    @Param("id") id: string,
    @Body() dto: UpdateOfferStatusDto
  ) {
    return this.offersService.updateStatus(user.id, id, dto);
  }
}
