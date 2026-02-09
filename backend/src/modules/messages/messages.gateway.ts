import { Injectable } from "@nestjs/common";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from "@nestjs/websockets";
import { JwtService } from "@nestjs/jwt";
import { Server, Socket } from "socket.io";
import { MessagesService } from "./messages.service";
import { requireEnv } from "../../common/env";

@WebSocketGateway({ cors: { origin: requireEnv("APP_ORIGIN"), credentials: true } })
@Injectable()
export class MessagesGateway implements OnGatewayConnection {
  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly messagesService: MessagesService,
    private readonly jwtService: JwtService
  ) {}

  handleConnection(client: Socket) {
    const token = this.extractToken(client);
    if (!token) {
      client.disconnect();
      return;
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: requireEnv("JWT_SECRET")
      }) as { sub: string };
      client.data.userId = payload.sub;
    } catch {
      client.disconnect();
    }
  }

  @SubscribeMessage("message:send")
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { jobId: string; receiverId: string; content: string }
  ) {
    const senderId = client.data.userId as string | undefined;
    if (!senderId) {
      client.disconnect();
      return;
    }
    const message = await this.messagesService.sendMessage(senderId, payload);
    this.server.emit("message:new", message);
    return message;
  }

  private extractToken(client: Socket) {
    const authToken = client.handshake.auth?.token;
    if (typeof authToken === "string" && authToken.length > 0) {
      return authToken;
    }
    const header = client.handshake.headers.authorization;
    if (typeof header === "string" && header.startsWith("Bearer ")) {
      return header.slice(7);
    }
    return null;
  }
}
