import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { ServiceCategoriesController } from './service-categories.controller';

@Module({
  imports: [PrismaModule],
  controllers: [ServiceCategoriesController],
})
export class ServiceCategoriesModule {}