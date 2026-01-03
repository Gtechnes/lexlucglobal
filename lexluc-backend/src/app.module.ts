import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ServicesModule } from './services/services.module';
import { ToursModule } from './tours/tours.module';
import { BookingsModule } from './bookings/bookings.module';
import { BlogModule } from './blog/blog.module';
import { ContactsModule } from './contacts/contacts.module';
import { AdminModule } from './admin/admin.module';
import { UploadsModule } from './uploads/uploads.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ServicesModule,
    ToursModule,
    BookingsModule,
    BlogModule,
    ContactsModule,
    AdminModule,
    UploadsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
