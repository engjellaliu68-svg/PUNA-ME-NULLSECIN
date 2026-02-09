import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./modules/auth/auth.module";
import { CategoriesModule } from "./modules/categories/categories.module";
import { JobsModule } from "./modules/jobs/jobs.module";
import { MessagesModule } from "./modules/messages/messages.module";
import { OffersModule } from "./modules/offers/offers.module";
import { ReviewsModule } from "./modules/reviews/reviews.module";
import { UsersModule } from "./modules/users/users.module";
import { PrismaModule } from "./prisma/prisma.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    JobsModule,
    OffersModule,
    MessagesModule,
    ReviewsModule,
    CategoriesModule
  ]
})
export class AppModule {}
