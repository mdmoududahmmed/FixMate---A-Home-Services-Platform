import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { TechniciansService } from './technicians.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('technicians')
@UseGuards(JwtAuthGuard)
export class TechniciansController {
  constructor(private readonly techniciansService: TechniciansService) {}

  @Get('jobs/pending')
  async getPendingJobs(@Request() req) {
    return this.techniciansService.findPendingJobs();
  }

  @Post('jobs/:id/accept')
  async acceptJob(@Request() req, @Param('id') id: string) {
    return this.techniciansService.acceptJob(Number(id), req.user.sub);
  }

  @Post('jobs/:id/reject')
  async rejectJob(@Request() req, @Param('id') id: string) {
    return this.techniciansService.rejectJob(Number(id), req.user.sub);
  }
}