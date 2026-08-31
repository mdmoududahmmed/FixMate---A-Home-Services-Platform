import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TechniciansService {
  constructor(private prisma: PrismaService) {}

  // find all pending jobs
  async findPendingJobs() {
    return this.prisma.serviceRequest.findMany({
      where: { status: 'PENDING', technicianId: null },
      include: { category: true, customer: { select: { fullName: true, phone: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  // work accepted (Accept)
  async acceptJob(jobId: number, technicianId: number) {
    return this.prisma.serviceRequest.update({
      where: { id: jobId },
      data: { status: 'ACCEPTED', technicianId },
    });
  }

  // work rejected (Reject)
  async rejectJob(jobId: number, technicianId: number) {
    return this.prisma.serviceRequest.update({
      where: { id: jobId },
      data: { technicianId: null }, // to request back to pending
    });
  }
}