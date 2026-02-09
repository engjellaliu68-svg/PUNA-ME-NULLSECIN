import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { REFRESH_COOKIE_NAME } from "../../common/constants";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.authService.register(dto);
    this.setRefreshCookie(res, tokens.refreshToken);
    return { accessToken: tokens.accessToken };
  }

  @Post("login")
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.authService.login(dto);
    this.setRefreshCookie(res, tokens.refreshToken);
    return { accessToken: tokens.accessToken };
  }

  @Post("refresh")
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = this.getCookie(req, REFRESH_COOKIE_NAME);
    const tokens = await this.authService.refreshSession(refreshToken);
    this.setRefreshCookie(res, tokens.refreshToken);
    return { accessToken: tokens.accessToken };
  }

  @Post("logout")
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = this.getCookie(req, REFRESH_COOKIE_NAME);
    await this.authService.revokeRefreshToken(refreshToken);
    this.clearRefreshCookie(res);
    return { status: "ok" };
  }

  @Get("google")
  @UseGuards(AuthGuard("google"))
  googleAuth() {
    return;
  }

  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    const { redirectUrl, refreshToken } = await this.authService.oauthLogin(req.user);
    this.setRefreshCookie(res, refreshToken);
    return res.redirect(redirectUrl);
  }

  @Get("facebook")
  @UseGuards(AuthGuard("facebook"))
  facebookAuth() {
    return;
  }

  @Get("facebook/callback")
  @UseGuards(AuthGuard("facebook"))
  async facebookCallback(@Req() req: Request, @Res() res: Response) {
    const { redirectUrl, refreshToken } = await this.authService.oauthLogin(req.user);
    this.setRefreshCookie(res, refreshToken);
    return res.redirect(redirectUrl);
  }

  private setRefreshCookie(res: Response, refreshToken: string) {
    const secure = process.env.COOKIE_SECURE
      ? process.env.COOKIE_SECURE === "true"
      : process.env.NODE_ENV === "production";
    res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure,
      path: "/api/auth",
      maxAge: this.authService.getRefreshTokenMaxAgeMs(),
      domain: process.env.COOKIE_DOMAIN || undefined
    });
  }

  private clearRefreshCookie(res: Response) {
    const secure = process.env.COOKIE_SECURE
      ? process.env.COOKIE_SECURE === "true"
      : process.env.NODE_ENV === "production";
    res.clearCookie(REFRESH_COOKIE_NAME, {
      httpOnly: true,
      sameSite: "lax",
      secure,
      path: "/api/auth",
      domain: process.env.COOKIE_DOMAIN || undefined
    });
  }

  private getCookie(req: Request, name: string) {
    const header = req.headers.cookie;
    if (!header) {
      return null;
    }
    const target = `${name}=`;
    const parts = header.split(";");
    for (const part of parts) {
      const trimmed = part.trim();
      if (trimmed.startsWith(target)) {
        return decodeURIComponent(trimmed.slice(target.length));
      }
    }
    return null;
  }
}
