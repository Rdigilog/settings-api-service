/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { TicketPriority, TicketCategory } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class SendTicketMessageDto {
  @ApiProperty({ description: 'Full name of the employee' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({ description: 'Full name of the employee' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attachments?: string[];
}

export class CreateTicketDto extends SendTicketMessageDto {
  @ApiProperty({ description: 'Full name of the employee' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  subject: string;

  @ApiProperty({
    description: 'Priority level of the ticket',
    enum: TicketPriority,
    example: TicketPriority.MEDIUM,
  })
  @IsEnum(TicketPriority)
  @IsOptional()
  priority?: TicketPriority;

  @ApiProperty({
    description: 'Category of the support ticket',
    enum: TicketCategory,
    example: TicketCategory.TECHNICAL,
  })
  @IsEnum(TicketCategory, {
    message: `category must be one of: ${Object.values(TicketCategory).join(', ')}`,
  })
  category: TicketCategory;
}
