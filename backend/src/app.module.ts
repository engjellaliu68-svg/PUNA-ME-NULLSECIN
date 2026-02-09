import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { AuthModule } from "./modules/auth/auth.module";
import { CategoriesModule } from "./modules/categories/categories.module";
import { HealthModule } from "./modules/health/health.module";
import { JobsModule } from "./modules/jobs/jobs.module";
import { MessagesModule } from "./modules/messages/messages.module";
import { OffersModule } from "./modules/offers/offers.module";
import { ReviewsModule } from "./modules/reviews/reviews.module";
import { UsersModule } from "./modules/users/users.module";
import { PrismaModule } from "./prisma/prisma.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ["backend/.env.local", "backend/.env", ".env.local", ".env"]
    }),
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60, limit: 100 }]
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    JobsModule,
    OffersModule,
    MessagesModule,
    ReviewsModule,
    CategoriesModule,
    HealthModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ]
})
export class AppModule {}
