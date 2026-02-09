import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { ProfileType } from "@puna-jote/shared";
import { PrismaService } from "../../prisma/prisma.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

type OAuthUser = {
  provider: "GOOGLE" | "FACEBOOK";
  providerUserId: string;
  email?: string;
  displayName?: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

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

    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role
    });

    return { accessToken };
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

    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role
    });

    return { accessToken };
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

    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role
    });

    const origin = process.env.APP_ORIGIN || "http://localhost:3000";
    const redirectUrl = new URL("/auth/callback", origin);
    redirectUrl.searchParams.set("token", accessToken);
    return redirectUrl.toString();
  }
}
