import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const [users, services, tours, bookings, posts, unreadContacts] =
      await Promise.all([
        this.prisma.user.count(),
        this.prisma.service.count(),
        this.prisma.tour.count(),
        this.prisma.booking.count(),
        this.prisma.blogPost.count(),
        this.prisma.contactMessage.count({ where: { status: 'NEW' } }),
      ]);

    return {
      users,
      services,
      tours,
      bookings,
      posts,
      unreadContacts,
    };
  }
}
