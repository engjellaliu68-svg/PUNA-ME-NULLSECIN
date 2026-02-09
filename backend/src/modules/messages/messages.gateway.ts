import { Injectable } from "@nestjs/common";
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from "@nestjs/websockets";
import { Server } from "socket.io";
import { MessagesService } from "./messages.service";

@WebSocketGateway({ cors: { origin: process.env.APP_ORIGIN || "http://localhost:3000" } })
@Injectable()
export class MessagesGateway {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly messagesService: MessagesService) {}

  @SubscribeMessage("message:send")
  async handleMessage(@MessageBody() payload: { jobId: string; senderId: string; receiverId: string; content: string }) {
    const message = await this.messagesService.sendMessage(payload.senderId, payload);
    this.server.emit("message:new", message);
    return message;
  }
}
