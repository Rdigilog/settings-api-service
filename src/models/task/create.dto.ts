import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

enum RecurrenceType {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
}

enum TaskStatus {
  DRAFT = 'DRAFT',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export class CreateTaskDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ default: false })
  @IsBoolean()
  @IsOptional()
  isRecurring?: boolean;

  @ApiPropertyOptional({ enum: RecurrenceType })
  @IsOptional()
  @IsEnum(RecurrenceType)
  recurrence?: RecurrenceType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  interval?: number;

  @ApiProperty()
  @IsDateString()
  startDate: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiProperty({ enum: TaskStatus, default: TaskStatus.DRAFT })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiProperty()
  @IsUUID()
  managerId: string;

  @ApiProperty()
  @IsUUID()
  companyId: string;

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsOptional()
  checklist?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsOptional()
  category?: string[];

  @ApiProperty()
  @IsString()
  timeType: string;

  @ApiPropertyOptional({ default: 0 })
  @IsInt()
  @IsOptional()
  metrics?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  startTime?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  finishTime?: string;

  @ApiProperty({ enum: Priority, default: Priority.LOW })
  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;

  @ApiPropertyOptional({ type: [String], description: 'User IDs of assignees' })
  @IsArray()
  @IsOptional()
  assigneeIds?: string[];
}

export class CreateTaskStageDto {
  @ApiProperty()
  @IsString()
  name: string;

  // @ApiProperty()
  // @IsString()
  // companyId: string;
}

export class UpdateTaskStageDto {
  @ApiPropertyOptional()
  @IsString()
  name?: string;
}
