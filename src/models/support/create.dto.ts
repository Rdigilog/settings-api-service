/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { TicketPriority } from '@prisma/client';
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

  @ApiProperty({ description: 'Full name of the employee' })
  @IsEnum(TicketPriority)
  @IsOptional()
  priority?: TicketPriority;
}
