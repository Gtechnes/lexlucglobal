import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Query } from '@nestjs/common';
import { ToursService } from './tours.service';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('tours')
export class ToursController {
  constructor(private toursService: ToursService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CONTENT_MANAGER', 'SUPER_ADMIN')
  create(@Body() createTourDto: CreateTourDto) {
    return this.toursService.create(createTourDto);
  }

  @Get()
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.toursService.findAll(page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.toursService.findOne(id);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.toursService.findBySlug(slug);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CONTENT_MANAGER', 'SUPER_ADMIN')
  update(@Param('id') id: string, @Body() updateTourDto: UpdateTourDto) {
    return this.toursService.update(id, updateTourDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CONTENT_MANAGER', 'SUPER_ADMIN')
  remove(@Param('id') id: string) {
    return this.toursService.remove(id);
  }
}
