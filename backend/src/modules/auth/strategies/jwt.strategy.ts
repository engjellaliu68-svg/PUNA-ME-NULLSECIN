import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "../../../prisma/prisma.service";
import { JWT_STRATEGY } from "../../../common/constants";
import { requireEnv } from "../../../common/env";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, JWT_STRATEGY) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: requireEnv("JWT_SECRET")
    });
  }

  async validate(payload: { sub: string }) {
    return this.prisma.user.findUnique({ where: { id: payload.sub } });
  }
}
