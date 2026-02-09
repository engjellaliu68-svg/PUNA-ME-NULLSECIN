import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { SendMessageDto } from "./dto/send-message.dto";

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async listThreads(userId: string) {
    return this.prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }]
      },
      orderBy: { createdAt: "desc" }
    });
  }

  async listThreadMessages(userId: string, jobId: string) {
    return this.prisma.message.findMany({
      where: {
        jobId,
        OR: [{ senderId: userId }, { receiverId: userId }]
      },
      orderBy: { createdAt: "asc" }
    });
  }

  async sendMessage(senderId: string, dto: SendMessageDto) {
    return this.prisma.message.create({
      data: {
        jobId: dto.jobId,
        senderId,
        receiverId: dto.receiverId,
        content: dto.content
      }
    });
  }
}
