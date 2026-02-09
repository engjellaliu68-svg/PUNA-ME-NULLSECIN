import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-facebook";
import { requireEnv } from "../../../common/env";

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, "facebook") {
  constructor() {
    super({
      clientID: requireEnv("FACEBOOK_APP_ID"),
      clientSecret: requireEnv("FACEBOOK_APP_SECRET"),
      callbackURL: requireEnv("FACEBOOK_CALLBACK_URL"),
      profileFields: ["id", "displayName", "emails"]
    });
  }

  validate(_accessToken: string, _refreshToken: string, profile: Profile) {
    const email = profile.emails?.[0]?.value;
    return {
      provider: "FACEBOOK",
      providerUserId: profile.id,
      email,
      displayName: profile.displayName
    };
  }
}
