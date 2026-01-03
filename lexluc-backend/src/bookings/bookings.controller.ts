import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Query } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('bookings')
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Post()
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(createBookingDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('BOOKING_MANAGER', 'SUPER_ADMIN')
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.bookingsService.findAll(page, limit);
  }

  @Get('reference/:referenceNo')
  findByReference(@Param('referenceNo') referenceNo: string) {
    return this.bookingsService.findByReference(referenceNo);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('BOOKING_MANAGER', 'SUPER_ADMIN')
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('BOOKING_MANAGER', 'SUPER_ADMIN')
  updateStatus(@Param('id') id: string, @Query('status') status: string) {
    return this.bookingsService.updateStatus(id, status);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('BOOKING_MANAGER', 'SUPER_ADMIN')
  remove(@Param('id') id: string) {
    return this.bookingsService.remove(id);
  }
}
