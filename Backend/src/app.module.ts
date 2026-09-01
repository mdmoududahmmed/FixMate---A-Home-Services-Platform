// TODO: FIX 404 ERROR ON /technicians API - Check TechniciansModule in this file
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ServiceCategoriesModule } from './service-categories/service-categories.module';
import { ServiceRequestsModule } from '../service-requests/service-requests.module';
import { TechniciansModule } from './technicians/technicians.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    ServiceCategoriesModule,
    ServiceRequestsModule,
    TechniciansModule,
    MessagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}