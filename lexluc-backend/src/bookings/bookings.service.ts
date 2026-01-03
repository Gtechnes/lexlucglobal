import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  create(createBookingDto: CreateBookingDto) {
    return this.prisma.booking.create({
      data: createBookingDto,
      include: { tour: true, user: true },
    });
  }

  findAll(page?: string, limit?: string) {
    const pageNum = parseInt(page || '1', 10);
    const limitNum = parseInt(limit || '10', 10);
    const skip = (pageNum - 1) * limitNum;

    // If no pagination params, return all (for backward compatibility)
    if (!page && !limit) {
      return this.prisma.booking.findMany({
        where: { deletedAt: null },
        include: { tour: true, user: true },
        orderBy: { createdAt: 'desc' },
      });
    }

    return this.prisma.booking.findMany({
      where: { deletedAt: null },
      include: { tour: true, user: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limitNum,
    });
  }

  findOne(id: string) {
    return this.prisma.booking.findUnique({
      where: { id },
      include: { tour: true, user: true },
    });
  }

  findByReference(referenceNo: string) {
    return this.prisma.booking.findUnique({
      where: { referenceNo },
      include: { tour: true, user: true },
    });
  }

  updateStatus(id: string, status: string) {
    return this.prisma.booking.update({
      where: { id },
      data: { status: status as any },
      include: { tour: true, user: true },
    });
  }

  remove(id: string) {
    return this.prisma.booking.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
