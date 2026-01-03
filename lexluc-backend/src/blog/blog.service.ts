import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';

@Injectable()
export class BlogService {
  private logger = new Logger('BlogService');

  constructor(private prisma: PrismaService) {}

  create(createBlogPostDto: CreateBlogPostDto) {
    this.logger.log(
      `Creating blog post: title="${createBlogPostDto.title}", isPublished=${createBlogPostDto.isPublished}`,
    );
    return this.prisma.blogPost.create({
      data: {
        ...createBlogPostDto,
        // Auto-set publishedAt when publishing
        publishedAt: createBlogPostDto.isPublished ? new Date() : null,
      },
    });
  }

  /**
   * Get all published posts (for public blog page)
   */
  async findAllPublic(page?: string, limit?: string) {
    const pageNum = parseInt(page || '1', 10);
    const limitNum = parseInt(limit || '10', 10);
    const skip = (pageNum - 1) * limitNum;

    // Debug logging - check what's in the database
    const totalCount = await this.prisma.blogPost.count({
      where: { deletedAt: null },
    });
    const publishedCount = await this.prisma.blogPost.count({
      where: { deletedAt: null, isPublished: true },
    });
    const publishedWithDateCount = await this.prisma.blogPost.count({
      where: { deletedAt: null, isPublished: true, publishedAt: { not: null } },
    });

    this.logger.debug(
      `[findAllPublic] Total posts: ${totalCount}, Published: ${publishedCount}, Published+Date: ${publishedWithDateCount}`,
    );

    // If no pagination params, return all (for backward compatibility)
    if (!page && !limit) {
      const results = await this.prisma.blogPost.findMany({
        where: { deletedAt: null, isPublished: true },
        orderBy: { publishedAt: 'desc' },
      });
      this.logger.debug(`[findAllPublic] Returning ${results.length} posts (no pagination)`);
      return results;
    }

    const results = await this.prisma.blogPost.findMany({
      where: { deletedAt: null, isPublished: true },
      orderBy: { publishedAt: 'desc' },
      skip,
      take: limitNum,
    });
    this.logger.debug(`[findAllPublic] Returning ${results.length} posts (page ${pageNum}, limit ${limitNum})`);
    return results;
  }

  /**
   * Get all posts including drafts (for admin)
   */
  async findAllAdmin(page?: string, limit?: string) {
    const pageNum = parseInt(page || '1', 10);
    const limitNum = parseInt(limit || '10', 10);
    const skip = (pageNum - 1) * limitNum;

    // If no pagination params, return all (for backward compatibility)
    if (!page && !limit) {
      const results = await this.prisma.blogPost.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' },
      });
      this.logger.debug(`[findAllAdmin] Returning ${results.length} posts (no pagination)`);
      return results;
    }

    const results = await this.prisma.blogPost.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limitNum,
    });
    this.logger.debug(`[findAllAdmin] Returning ${results.length} posts (page ${pageNum}, limit ${limitNum})`);
    return results;
  }

  findOne(id: string) {
    return this.prisma.blogPost.findUnique({
      where: { id },
    });
  }

  findBySlug(slug: string) {
    return this.prisma.blogPost.findUnique({
      where: { slug },
    });
  }

  update(id: string, updateBlogPostDto: CreateBlogPostDto) {
    this.logger.log(
      `Updating blog post: id="${id}", isPublished=${updateBlogPostDto.isPublished}`,
    );
    return this.prisma.blogPost.update({
      where: { id },
      data: {
        ...updateBlogPostDto,
        // Auto-set publishedAt when publishing, clear when drafting
        publishedAt: updateBlogPostDto.isPublished ? new Date() : null,
      },
    });
  }

  remove(id: string) {
    return this.prisma.blogPost.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
