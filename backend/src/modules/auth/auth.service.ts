import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { ProfileType } from "@puna-jote/shared";
import { PrismaService } from "../../prisma/prisma.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { requireEnv } from "../../common/env";

type OAuthUser = {
  provider: "GOOGLE" | "FACEBOOK";
  providerUserId: string;
  email?: string;
  displayName?: string;
};

type RefreshPayload = {
  sub: string;
  jti: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  getRefreshTokenMaxAgeMs() {
    return this.parseExpiresIn(requireEnv("JWT_REFRESH_EXPIRES_IN"));
  }

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new BadRequestException("Email already in use");
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        profile: {
          create: {
            type: dto.profileType,
            displayName: dto.displayName,
            companyName: dto.companyName
          }
        }
      }
    });

    return this.issueTokens(user.id, user.email, user.role);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const isValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    return this.issueTokens(user.id, user.email, user.role);
  }

  async oauthLogin(rawUser: unknown) {
    const oauthUser = rawUser as OAuthUser;
    if (!oauthUser?.provider || !oauthUser.providerUserId) {
      throw new UnauthorizedException("OAuth login failed");
    }

    const existingAccount = await this.prisma.oAuthAccount.findUnique({
      where: {
        provider_providerUserId: {
          provider: oauthUser.provider,
          providerUserId: oauthUser.providerUserId
        }
      },
      include: { user: true }
    });

    let user = existingAccount?.user ?? null;
    if (!user && oauthUser.email) {
      user = await this.prisma.user.findUnique({ where: { email: oauthUser.email } });
    }

    if (!user) {
      const displayName = oauthUser.displayName || oauthUser.email || "New user";
      user = await this.prisma.user.create({
        data: {
          email: oauthUser.email || `oauth_${oauthUser.providerUserId}@puna-jote.local`,
          passwordHash: null,
          profile: {
            create: {
              type: ProfileType.INDIVIDUAL,
              displayName
            }
          }
        }
      });
    }

    if (!existingAccount) {
      await this.prisma.oAuthAccount.create({
        data: {
          userId: user.id,
          provider: oauthUser.provider,
          providerUserId: oauthUser.providerUserId,
          email: oauthUser.email
        }
      });
    }

    const origin = requireEnv("APP_ORIGIN");
    const redirectUrl = new URL("/auth/callback", origin);
    const tokens = await this.issueTokens(user.id, user.email, user.role);
    return {
      redirectUrl: redirectUrl.toString(),
      refreshToken: tokens.refreshToken
    };
  }

  async refreshSession(rawRefreshToken: string | null) {
    if (!rawRefreshToken) {
      throw new UnauthorizedException("Refresh token missing");
    }

    let payload: RefreshPayload;
    try {
      payload = this.jwtService.verify(rawRefreshToken, {
        secret: requireEnv("JWT_REFRESH_SECRET")
      }) as RefreshPayload;
    } catch {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const existingToken = await this.prisma.refreshToken.findUnique({
      where: { id: payload.jti }
    });

    if (!existingToken || existingToken.userId !== payload.sub) {
      throw new UnauthorizedException("Refresh token not recognized");
    }

    if (existingToken.revokedAt || existingToken.expiresAt <= new Date()) {
      throw new UnauthorizedException("Refresh token expired");
    }

    const matches = await bcrypt.compare(rawRefreshToken, existingToken.tokenHash);
    if (!matches) {
      throw new UnauthorizedException("Refresh token invalid");
    }

    await this.prisma.refreshToken.update({
      where: { id: existingToken.id },
      data: { revokedAt: new Date() }
    });

    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    return this.issueTokens(user.id, user.email, user.role);
  }

  async revokeRefreshToken(rawRefreshToken: string | null) {
    if (!rawRefreshToken) {
      return;
    }

    let payload: RefreshPayload | null = null;
    try {
      payload = this.jwtService.verify(rawRefreshToken, {
        secret: requireEnv("JWT_REFRESH_SECRET")
      }) as RefreshPayload;
    } catch {
      payload = null;
    }

    if (!payload?.jti) {
      return;
    }

    await this.prisma.refreshToken.updateMany({
      where: { id: payload.jti, revokedAt: null },
      data: { revokedAt: new Date() }
    });
  }

  private async issueTokens(userId: string, email: string, role: string) {
    const accessToken = this.jwtService.sign(
      { sub: userId, email, role },
      {
        secret: requireEnv("JWT_SECRET"),
        expiresIn: requireEnv("JWT_EXPIRES_IN")
      }
    );

    const refreshToken = await this.createRefreshToken(userId);

    return {
      accessToken,
      refreshToken
    };
  }

  private async createRefreshToken(userId: string) {
    const tokenId = randomUUID();
    const expiresAt = new Date(Date.now() + this.parseExpiresIn(requireEnv("JWT_REFRESH_EXPIRES_IN")));
    const refreshToken = this.jwtService.sign(
      { sub: userId, jti: tokenId },
      {
        secret: requireEnv("JWT_REFRESH_SECRET"),
        expiresIn: requireEnv("JWT_REFRESH_EXPIRES_IN")
      }
    );
    const tokenHash = await bcrypt.hash(refreshToken, 10);

    await this.prisma.refreshToken.create({
      data: {
        id: tokenId,
        userId,
        tokenHash,
        expiresAt
      }
    });

    return refreshToken;
  }

  private parseExpiresIn(value: string) {
    const match = value.match(/^(\d+)([smhd])$/);
    if (!match) {
      throw new Error(`Invalid expires format: ${value}`);
    }
    const amount = Number(match[1]);
    const unit = match[2];
    if (!amount || amount <= 0) {
      throw new Error(`Invalid expires value: ${value}`);
    }
    const multipliers: Record<string, number> = {
      s: 1000,
      m: 60_000,
      h: 3_600_000,
      d: 86_400_000
    };
    return amount * multipliers[unit];
  }
}
