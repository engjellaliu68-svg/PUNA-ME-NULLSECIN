import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { MessagesService } from "./messages.service";
import { SendMessageDto } from "./dto/send-message.dto";

@Controller("messages")
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @UseGuards(JwtAuthGuard)
  @Get("threads")
  listThreads(@CurrentUser() user: { id: string }) {
    return this.messagesService.listThreads(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get("threads/:jobId")
  listThreadMessages(@CurrentUser() user: { id: string }, @Param("jobId") jobId: string) {
    return this.messagesService.listThreadMessages(user.id, jobId);
  }

  @UseGuards(JwtAuthGuard)
  @Post("send")
  sendMessage(@CurrentUser() user: { id: string }, @Body() dto: SendMessageDto) {
    return this.messagesService.sendMessage(user.id, dto);
  }
}
