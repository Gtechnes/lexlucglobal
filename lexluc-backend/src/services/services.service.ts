import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  create(createServiceDto: CreateServiceDto) {
    return this.prisma.service.create({
      data: createServiceDto,
    });
  }

  findAll(page?: string, limit?: string) {
    const pageNum = parseInt(page || '1', 10);
    const limitNum = parseInt(limit || '10', 10);
    const skip = (pageNum - 1) * limitNum;

    // If no pagination params, return all (for backward compatibility)
    if (!page && !limit) {
      return this.prisma.service.findMany({
        where: { deletedAt: null },
        orderBy: { order: 'asc' },
      });
    }

    return this.prisma.service.findMany({
      where: { deletedAt: null },
      orderBy: { order: 'asc' },
      skip,
      take: limitNum,
    });
  }

  findOne(id: string) {
    return this.prisma.service.findUnique({
      where: { id },
    });
  }

  findBySlug(slug: string) {
    return this.prisma.service.findUnique({
      where: { slug },
      include: { tours: true },
    });
  }

  update(id: string, updateServiceDto: UpdateServiceDto) {
    return this.prisma.service.update({
      where: { id },
      data: updateServiceDto,
    });
  }

  remove(id: string) {
    return this.prisma.service.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
