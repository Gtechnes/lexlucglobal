import { Injectable } from '@nestjs/common';

/**
 * Mock Prisma Service for Development
 * Provides in-memory data storage without a real database
 * Use this to test the API without PostgreSQL setup
 */
@Injectable()
export class PrismaService {
  // Mock data storage
  private users = [
    {
      id: '1',
      email: 'admin@lexlucglobal.ng',
      password: '$2b$10$YourHashedPasswordHere', // bcrypt hash of "admin123"
      firstName: 'Admin',
      lastName: 'User',
      role: 'SUPER_ADMIN',
      phone: '+234 800 000 0000',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    },
  ];

  private services = [
    {
      id: '1',
      title: 'Tourism Services',
      slug: 'tourism-services',
      description: 'Comprehensive tourism packages for Nigeria and Africa',
      content: 'Full tourism solutions including visa assistance, tours, and hospitality',
      published: true,
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    },
  ];

  private tours = [
    {
      id: '1',
      serviceId: '1',
      title: 'Safari Adventure',
      slug: 'safari-adventure',
      description: 'Experience the wildlife of Africa',
      content: 'Unforgettable safari experience',
      imageUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801',
      duration: 5,
      price: '2500.00',
      startDate: new Date('2025-03-01'),
      endDate: new Date('2025-03-06'),
      maxParticipants: 20,
      currentBookings: 5,
      highlights: ['Big Five', 'Game Drive', 'Traditional Villages'],
      inclusions: ['Accommodation', 'Meals', 'Transport'],
      exclusions: ['Flights', 'Travel Insurance'],
      itinerary: 'Day 1: Arrival and briefing',
      published: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    },
  ];

  private bookings: any[] = [];
  private contacts: any[] = [];
  private blogPosts: any[] = [];
  private mediaData: any[] = [];

  // Proxy methods to mock data
  user = {
    findUnique: async ({ where }: any) =>
      this.users.find((u) => u.email === where.email || u.id === where.id),
    findMany: async () => this.users,
    create: async ({ data }: any) => {
      const newUser = { ...data, id: Math.random().toString(), createdAt: new Date(), updatedAt: new Date() };
      this.users.push(newUser);
      return newUser;
    },
    update: async ({ where, data }: any) => {
      const index = this.users.findIndex((u) => u.id === where.id);
      if (index >= 0) {
        this.users[index] = { ...this.users[index], ...data };
        return this.users[index];
      }
      return null;
    },
    delete: async ({ where }: any) => {
      const index = this.users.findIndex((u) => u.id === where.id);
      if (index >= 0) {
        return this.users.splice(index, 1)[0];
      }
      return null;
    },
  };

  service = {
    findMany: async () => this.services,
    findUnique: async ({ where }: any) =>
      this.services.find((s) => s.id === where.id || s.slug === where.slug),
    create: async ({ data }: any) => {
      const newService = { ...data, id: Math.random().toString(), createdAt: new Date(), updatedAt: new Date() };
      this.services.push(newService);
      return newService;
    },
  };

  tour = {
    findMany: async () => this.tours,
    findUnique: async ({ where }: any) =>
      this.tours.find((t) => t.id === where.id || t.slug === where.slug),
    create: async ({ data }: any) => {
      const newTour = { ...data, id: Math.random().toString(), createdAt: new Date(), updatedAt: new Date() };
      this.tours.push(newTour);
      return newTour;
    },
  };

  booking = {
    findMany: async () => this.bookings,
    findUnique: async ({ where }: any) =>
      this.bookings.find((b) => b.id === where.id || b.referenceNo === where.referenceNo),
    create: async ({ data }: any) => {
      const newBooking = { ...data, id: Math.random().toString(), createdAt: new Date(), updatedAt: new Date() };
      this.bookings.push(newBooking);
      return newBooking;
    },
  };

  blogPost = {
    findMany: async () => this.blogPosts,
    findUnique: async ({ where }: any) =>
      this.blogPosts.find((b) => b.id === where.id || b.slug === where.slug),
    create: async ({ data }: any) => {
      const newPost = { ...data, id: Math.random().toString(), createdAt: new Date(), updatedAt: new Date() };
      this.blogPosts.push(newPost);
      return newPost;
    },
  };

  contactMessage = {
    findMany: async () => this.contacts,
    findUnique: async ({ where }: any) => this.contacts.find((c) => c.id === where.id),
    create: async ({ data }: any) => {
      const newContact = { ...data, id: Math.random().toString(), createdAt: new Date(), updatedAt: new Date() };
      this.contacts.push(newContact);
      return newContact;
    },
  };

  media = {
    findMany: async () => this.mediaData,
    create: async ({ data }: any) => {
      const newMedia = { ...data, id: Math.random().toString(), createdAt: new Date(), updatedAt: new Date() };
      this.mediaData.push(newMedia);
      return newMedia;
    },
  };

  async onModuleInit() {
    console.log('✅ PrismaService initialized (MOCK MODE - Development Only)');
  }

  async onModuleDestroy() {
    console.log('🔴 PrismaService destroyed');
  }
}
