export type JwtPayload = {
  sub: string;
  email: string;
  role: UserRole;
};

export type AuthTokens = {
  accessToken: string;
};

export type AuthUser = {
  id: string;
  email: string;
  role: UserRole;
};

export enum UserRole {
  USER = "USER",
  PROVIDER = "PROVIDER",
  ADMIN = "ADMIN"
}
