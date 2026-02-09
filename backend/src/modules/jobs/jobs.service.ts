import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateJobDto } from "./dto/create-job.dto";

@Injectable()
export class JobsService {
  constructor(private readonly prisma: PrismaService) {}

  listJobs(filters: { categoryId?: string; city?: string; locationType?: string }) {
    return this.prisma.job.findMany({
      where: {
        categoryId: filters.categoryId,
        city: filters.city,
        locationType: filters.locationType as any
      },
      include: { category: true, user: { select: { id: true, email: true } } },
      orderBy: { createdAt: "desc" }
    });
  }

  createJob(userId: string, dto: CreateJobDto) {
    return this.prisma.job.create({
      data: {
        userId,
        categoryId: dto.categoryId,
        title: dto.title,
        description: dto.description,
        city: dto.city,
        locationType: dto.locationType,
        budgetMin: dto.budgetMin,
        budgetMax: dto.budgetMax
      }
    });
  }

  getJob(id: string) {
    return this.prisma.job.findUnique({
      where: { id },
      include: { category: true, offers: true, user: { select: { id: true, email: true } } }
    });
  }
}
