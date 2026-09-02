import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TechniciansService } from './technicians.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('technicians')
export class TechniciansController {
  constructor(private readonly techniciansService: TechniciansService) {}

  // ✅ Get all technicians (for "Find Technician" screen)
  @Get()
  async findAll() {
    return this.techniciansService.findAll();
  }

  // ✅ Get all pending jobs (for technician dashboard)
  @Get('jobs/pending')
  @UseGuards(JwtAuthGuard)
  async getPendingJobs(@Request() req) {
    return this.techniciansService.findPendingJobs();
  }

  // ✅ Accept a job
  @Post('jobs/:id/accept')
  @UseGuards(JwtAuthGuard)
  async acceptJob(@Request() req, @Param('id') id: string) {
    return this.techniciansService.acceptJob(Number(id), req.user.sub);
  }

  // ✅ Reject a job
  @Post('jobs/:id/reject')
  @UseGuards(JwtAuthGuard)
  async rejectJob(@Request() req, @Param('id') id: string) {
    return this.techniciansService.rejectJob(Number(id), req.user.sub);
  }
}