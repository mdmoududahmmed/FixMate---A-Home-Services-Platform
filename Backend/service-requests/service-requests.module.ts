import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module'; // ← পাথ পরিবর্তন
import { ServiceRequestsController } from './service-requests.controller';
import { ServiceRequestsService } from './service-requests.service';

@Module({
  imports: [PrismaModule],
  controllers: [ServiceRequestsController],
  providers: [ServiceRequestsService],
})
export class ServiceRequestsModule {}