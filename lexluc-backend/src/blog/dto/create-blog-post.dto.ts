import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateBlogPostDto {
  @IsString()
  title: string;

  @IsString()
  slug: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  excerpt?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  // NOTE: publishedAt is managed by the backend based on isPublished flag
  // Do NOT include it in the DTO - it would conflict with auto-setting logic

  @IsOptional()
  @IsString()
  metaTitle?: string;

  @IsOptional()
  @IsString()
  metaDescription?: string;
}
