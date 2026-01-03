import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';

@Injectable()
export class ToursService {
  constructor(private prisma: PrismaService) {}

  create(createTourDto: CreateTourDto) {
    return this.prisma.tour.create({
      data: createTourDto,
      include: { service: true },
    });
  }

  findAll(page?: string, limit?: string) {
    const pageNum = parseInt(page || '1', 10);
    const limitNum = parseInt(limit || '10', 10);
    const skip = (pageNum - 1) * limitNum;

    // If no pagination params, return all (for backward compatibility)
    if (!page && !limit) {
      return this.prisma.tour.findMany({
        where: { deletedAt: null, isActive: true },
        include: { service: true },
        orderBy: { createdAt: 'desc' },
      });
    }

    return this.prisma.tour.findMany({
      where: { deletedAt: null, isActive: true },
      include: { service: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limitNum,
    });
  }

  findOne(id: string) {
    return this.prisma.tour.findUnique({
      where: { id },
      include: { service: true, bookings: true },
    });
  }

  findBySlug(slug: string) {
    return this.prisma.tour.findUnique({
      where: { slug },
      include: { service: true },
    });
  }

  update(id: string, updateTourDto: UpdateTourDto) {
    return this.prisma.tour.update({
      where: { id },
      data: updateTourDto,
      include: { service: true },
    });
  }

  remove(id: string) {
    return this.prisma.tour.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
