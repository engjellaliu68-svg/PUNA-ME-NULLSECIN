import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateOfferDto } from "./dto/create-offer.dto";
import { UpdateOfferStatusDto } from "./dto/update-offer-status.dto";

@Injectable()
export class OffersService {
  constructor(private readonly prisma: PrismaService) {}

  createOffer(providerId: string, dto: CreateOfferDto) {
    return this.prisma.offer.create({
      data: {
        jobId: dto.jobId,
        providerId,
        price: dto.price,
        message: dto.message
      }
    });
  }

  async updateStatus(userId: string, offerId: string, dto: UpdateOfferStatusDto) {
    const offer = await this.prisma.offer.findUnique({ where: { id: offerId } });
    if (!offer || offer.providerId !== userId) {
      throw new ForbiddenException("Not allowed");
    }

    return this.prisma.offer.update({
      where: { id: offerId },
      data: { status: dto.status }
    });
  }
}
