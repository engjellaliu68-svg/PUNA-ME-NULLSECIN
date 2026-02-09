import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { requireEnv } from "./common/env";

async function bootstrap() {
  const requiredEnvs = [
    "APP_ORIGIN",
    "DATABASE_URL",
    "JWT_SECRET",
    "JWT_EXPIRES_IN",
    "JWT_REFRESH_SECRET",
    "JWT_REFRESH_EXPIRES_IN",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_CALLBACK_URL",
    "FACEBOOK_APP_ID",
    "FACEBOOK_APP_SECRET",
    "FACEBOOK_CALLBACK_URL"
  ];
  requiredEnvs.forEach((name) => requireEnv(name));

  const appOrigin = requireEnv("APP_ORIGIN");
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors({
    origin: appOrigin,
    credentials: true
  });

  const port = process.env.PORT || 4000;
  await app.listen(port);
}

bootstrap();
