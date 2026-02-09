import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { FacebookStrategy } from "./strategies/facebook.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { GoogleStrategy } from "./strategies/google.strategy";
import { requireEnv } from "../../common/env";

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: requireEnv("JWT_SECRET"),
      signOptions: { expiresIn: requireEnv("JWT_EXPIRES_IN") }
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GoogleStrategy, FacebookStrategy]
})
export class AuthModule {}
