import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ServiceCategoriesModule } from './service-categories/service-categories.module';
import { ServiceRequestsModule } from '../service-requests/service-requests.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    ServiceCategoriesModule,
    ServiceRequestsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}