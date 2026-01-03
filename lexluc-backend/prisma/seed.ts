import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@lexlucglobal.ng' },
    update: {},
    create: {
      email: 'admin@lexlucglobal.ng',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'SUPER_ADMIN',
    },
  });

  console.log('✅ Created admin user:', admin.email);

  // Create sample services
  const services = await Promise.all([
    prisma.service.upsert({
      where: { slug: 'tourism' },
      update: {},
      create: {
        name: 'Tourism & Travel',
        slug: 'tourism',
        description: 'Premium tour packages and travel arrangements',
        content: 'We offer comprehensive tourism services including guided tours, accommodations, and travel logistics.',
        order: 1,
        isActive: true,
        metaTitle: 'Tourism & Travel Services',
        metaDescription: 'Explore our premium tourism and travel packages',
      },
    }),
    prisma.service.upsert({
      where: { slug: 'agriculture' },
      update: {},
      create: {
        name: 'Agriculture',
        slug: 'agriculture',
        description: 'Agricultural consultancy and supply chain solutions',
        content: 'Professional agricultural services including consulting, supply chain management, and training.',
        order: 2,
        isActive: true,
        metaTitle: 'Agriculture Services',
        metaDescription: 'Expert agricultural solutions and consulting',
      },
    }),
    prisma.service.upsert({
      where: { slug: 'mining' },
      update: {},
      create: {
        name: 'Mining & Extraction',
        slug: 'mining',
        description: 'Mining services and equipment supply',
        content: 'Comprehensive mining services including site management, equipment supply, and logistics.',
        order: 3,
        isActive: true,
        metaTitle: 'Mining Services',
        metaDescription: 'Professional mining and extraction services',
      },
    }),
  ]);

  console.log('✅ Created', services.length, 'services');

  // Create sample tours
  const tours = await Promise.all([
    prisma.tour.upsert({
      where: { slug: 'safari-adventure' },
      update: {},
      create: {
        title: 'Safari Adventure',
        slug: 'safari-adventure',
        description: 'Experience the wild in Nigeria\'s most beautiful safari destinations',
        destination: 'Yankari National Park',
        duration: 5,
        price: 1500,
        maxParticipants: 20,
        isActive: true,
        highlights: ['Wildlife viewing', 'Hot springs', 'Local village visit', 'Professional guides'],
        inclusions: ['Accommodation', 'Meals', 'Transportation', 'Guide services'],
        exclusions: ['Travel insurance', 'Personal expenses'],
        metaTitle: 'Safari Adventure Tour',
        metaDescription: 'Experience Nigerian wildlife on our guided safari adventure',
        serviceId: services[0].id,
      },
    }),
  ]);

  console.log('✅ Created', tours.length, 'tours');

  console.log('✨ Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
