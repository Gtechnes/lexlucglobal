import { IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateContactMessageDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsString()
  subject: string;

  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  userId?: string;
}
