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

export class SendTicketMessageDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attachments?: string[];
}

export class CreateTicketDto extends SendTicketMessageDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  subject: string;

  @IsEnum(TicketPriority)
  @IsOptional()
  priority?: TicketPriority;

}
