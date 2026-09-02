import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TechniciansService {
  constructor(private prisma: PrismaService) {}

  // ✅ Get all technicians with role 'TECHNICIAN'
  async findAll() {
    return this.prisma.user.findMany({
      where: { role: 'TECHNICIAN' },
      select: { id: true, fullName: true, phone: true },
    });
  }

  // ✅ Get all pending jobs for technician dashboard
  async findPendingJobs() {
    return this.prisma.serviceRequest.findMany({
      where: { status: 'PENDING', technicianId: null },
      include: {
        category: true,
        customer: { select: { fullName: true, phone: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ✅ Accept a job
  async acceptJob(jobId: number, technicianId: number) {
    return this.prisma.serviceRequest.update({
      where: { id: jobId },
      data: { status: 'ACCEPTED', technicianId },
    });
  }

  // ✅ Reject a job (make it available again)
  async rejectJob(jobId: number, technicianId: number) {
    return this.prisma.serviceRequest.update({
      where: { id: jobId },
      data: { technicianId: null },
    });
  }
}