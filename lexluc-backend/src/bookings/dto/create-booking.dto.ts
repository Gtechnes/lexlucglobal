import { IsString, IsEmail, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBookingDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsNumber()
  @Type(() => Number)
  numberOfParticipants: number;

  @IsNumber()
  @Type(() => Number)
  totalPrice: number;

  @IsString()
  tourId: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  specialRequests?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
