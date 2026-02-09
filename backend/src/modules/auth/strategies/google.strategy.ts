import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-google-oauth20";
import { requireEnv } from "../../../common/env";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor() {
    super({
      clientID: requireEnv("GOOGLE_CLIENT_ID"),
      clientSecret: requireEnv("GOOGLE_CLIENT_SECRET"),
      callbackURL: requireEnv("GOOGLE_CALLBACK_URL"),
      scope: ["email", "profile"]
    });
  }

  validate(_accessToken: string, _refreshToken: string, profile: Profile) {
    return {
      provider: "GOOGLE",
      providerUserId: profile.id,
      email: profile.emails?.[0]?.value,
      displayName: profile.displayName
    };
  }
}
