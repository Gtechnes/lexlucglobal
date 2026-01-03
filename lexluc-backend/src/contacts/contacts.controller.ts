import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Query } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('contacts')
export class ContactsController {
  constructor(private contactsService: ContactsService) {}

  @Post()
  create(@Body() createContactMessageDto: CreateContactMessageDto) {
    return this.contactsService.create(createContactMessageDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('BOOKING_MANAGER', 'SUPER_ADMIN')
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.contactsService.findAll(page, limit);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('BOOKING_MANAGER', 'SUPER_ADMIN')
  findOne(@Param('id') id: string) {
    return this.contactsService.findOne(id);
  }

  @Patch(':id/read')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('BOOKING_MANAGER', 'SUPER_ADMIN')
  markAsRead(@Param('id') id: string) {
    return this.contactsService.markAsRead(id);
  }

  @Patch(':id/respond')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('BOOKING_MANAGER', 'SUPER_ADMIN')
  respond(@Param('id') id: string, @Body() body: { response: string }) {
    return this.contactsService.respond(id, body.response);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  remove(@Param('id') id: string) {
    return this.contactsService.remove(id);
  }
}
