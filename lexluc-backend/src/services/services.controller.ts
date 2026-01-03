import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Query } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('services')
export class ServicesController {
  constructor(private servicesService: ServicesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CONTENT_MANAGER', 'SUPER_ADMIN')
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.servicesService.create(createServiceDto);
  }

  @Get()
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.servicesService.findAll(page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.servicesService.findBySlug(slug);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CONTENT_MANAGER', 'SUPER_ADMIN')
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.servicesService.update(id, updateServiceDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CONTENT_MANAGER', 'SUPER_ADMIN')
  remove(@Param('id') id: string) {
    return this.servicesService.remove(id);
  }
}
