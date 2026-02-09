import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MessagesController } from "./messages.controller";
import { MessagesGateway } from "./messages.gateway";
import { MessagesService } from "./messages.service";
import { requireEnv } from "../../common/env";

@Module({
  imports: [
    JwtModule.register({
      secret: requireEnv("JWT_SECRET"),
      signOptions: { expiresIn: requireEnv("JWT_EXPIRES_IN") }
    })
  ],
  controllers: [MessagesController],
  providers: [MessagesService, MessagesGateway]
})
export class MessagesModule {}
