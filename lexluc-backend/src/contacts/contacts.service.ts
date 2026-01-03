import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';

@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) {}

  create(createContactMessageDto: CreateContactMessageDto) {
    return this.prisma.contactMessage.create({
      data: createContactMessageDto,
    });
  }

  findAll(page?: string, limit?: string) {
    const pageNum = parseInt(page || '1', 10);
    const limitNum = parseInt(limit || '10', 10);
    const skip = (pageNum - 1) * limitNum;

    // If no pagination params, return all (for backward compatibility)
    if (!page && !limit) {
      return this.prisma.contactMessage.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' },
        include: { user: true },
      });
    }

    return this.prisma.contactMessage.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      include: { user: true },
      skip,
      take: limitNum,
    });
  }

  findOne(id: string) {
    return this.prisma.contactMessage.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  markAsRead(id: string) {
    return this.prisma.contactMessage.update({
      where: { id },
      data: { status: 'READ' },
    });
  }

  respond(id: string, response: string) {
    return this.prisma.contactMessage.update({
      where: { id },
      data: {
        status: 'RESPONDED',
        response,
        respondedAt: new Date(),
      },
    });
  }

  remove(id: string) {
    return this.prisma.contactMessage.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
