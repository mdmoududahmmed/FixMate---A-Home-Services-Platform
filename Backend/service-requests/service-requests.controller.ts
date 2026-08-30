import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { ServiceRequestsService } from './service-requests.service';
import { JwtAuthGuard } from '../src/auth/jwt-auth.guard';

@Controller('service-requests')
export class ServiceRequestsController {
  constructor(private readonly serviceRequestsService: ServiceRequestsService) {}

  // API for making requests for services
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Request() req, @Body() body: any) {
    console.log('Req User:', req.user);
    const customerId = req.user.sub; 
    return this.serviceRequestsService.create(
      customerId,
      body.categoryId,
      body.description,
      body.location,
    );
  }

  // API for viewing one's own service requests
  @Get('my-orders')
  @UseGuards(JwtAuthGuard)
  async getMyOrders(@Request() req) {
    const customerId = req.user.sub;
    return this.serviceRequestsService.findMyOrders(customerId);
  }
}