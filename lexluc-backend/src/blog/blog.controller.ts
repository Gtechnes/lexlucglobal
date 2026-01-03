import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Query, Logger } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('blog')
export class BlogController {
  private logger = new Logger('BlogController');

  constructor(private blogService: BlogService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CONTENT_MANAGER', 'SUPER_ADMIN')
  create(@Body() createBlogPostDto: CreateBlogPostDto) {
    this.logger.log(`POST /blog - Creating post with isPublished=${createBlogPostDto.isPublished}`);
    return this.blogService.create(createBlogPostDto);
  }

  /**
   * Public endpoint - returns only published posts
   * MUST be before @Get(':id') to match correctly
   */
  @Get('public')
  async findAllPublic(@Query('page') page?: string, @Query('limit') limit?: string) {
    this.logger.log(`GET /blog/public - page=${page}, limit=${limit}`);
    const results = await this.blogService.findAllPublic(page, limit);
    this.logger.log(`GET /blog/public - Returning ${Array.isArray(results) ? results.length : 0} posts`);
    return results;
  }

  /**
   * Admin endpoint - returns all posts (published + draft)
   * MUST be before @Get(':id') to match correctly
   */
  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CONTENT_MANAGER', 'SUPER_ADMIN')
  async findAllAdmin(@Query('page') page?: string, @Query('limit') limit?: string) {
    this.logger.log(`GET /blog/admin - page=${page}, limit=${limit}`);
    const results = await this.blogService.findAllAdmin(page, limit);
    this.logger.log(`GET /blog/admin - Returning ${Array.isArray(results) ? results.length : 0} posts`);
    return results;
  }

  /**
   * Get post by ID - comes AFTER specific routes
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    this.logger.log(`GET /blog/:id - id=${id}`);
    return this.blogService.findOne(id);
  }

  /**
   * Get post by slug - comes AFTER specific routes
   */
  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    this.logger.log(`GET /blog/slug/:slug - slug=${slug}`);
    return this.blogService.findBySlug(slug);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CONTENT_MANAGER', 'SUPER_ADMIN')
  update(@Param('id') id: string, @Body() updateBlogPostDto: CreateBlogPostDto) {
    this.logger.log(`PATCH /blog/:id - id=${id}, isPublished=${updateBlogPostDto.isPublished}`);
    return this.blogService.update(id, updateBlogPostDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CONTENT_MANAGER', 'SUPER_ADMIN')
  remove(@Param('id') id: string) {
    this.logger.log(`DELETE /blog/:id - id=${id}`);
    return this.blogService.remove(id);
  }
}
