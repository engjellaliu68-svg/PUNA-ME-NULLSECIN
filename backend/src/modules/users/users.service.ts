import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  getMe(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true }
    });
  }

  updateMe(userId: string, dto: UpdateUserDto) {
    return this.prisma.profile.update({
      where: { userId },
      data: {
        displayName: dto.displayName,
        companyName: dto.companyName,
        bio: dto.bio,
        phone: dto.phone,
        city: dto.city,
        country: dto.country
      }
    });
  }
}
