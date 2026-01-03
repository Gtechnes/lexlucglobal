import { IsString, IsOptional, IsNumber, IsBoolean, IsDateString, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTourDto {
  @IsString()
  title: string;

  @IsString()
  slug: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsString()
  destination: string;

  @IsNumber()
  @Type(() => Number)
  duration: number;

  @IsNumber()
  @Type(() => Number)
  price: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxParticipants?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsArray()
  highlights?: string[];

  @IsOptional()
  @IsArray()
  inclusions?: string[];

  @IsOptional()
  @IsArray()
  exclusions?: string[];

  @IsOptional()
  @IsString()
  itinerary?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  serviceId?: string;

  @IsOptional()
  @IsString()
  metaTitle?: string;

  @IsOptional()
  @IsString()
  metaDescription?: string;
}
