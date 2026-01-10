import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OnboardingStepType, InterviewMode } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class CreateOnboardingStepDto {
  @ApiProperty({ enum: OnboardingStepType })
  @IsEnum(OnboardingStepType)
  type: OnboardingStepType;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  interviewDate?: Date;

  @ApiPropertyOptional({ enum: InterviewMode })
  @IsOptional()
  @IsEnum(InterviewMode)
  interviewMode?: InterviewMode;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  meetingLink?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fomrId?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  docuemtnTypes?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  maxFileSize?: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  courseId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  taskDescription?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  taskDueDate?: Date;

  @ApiPropertyOptional({ type: [String], format: 'uuid' })
  @IsOptional()
  @IsArray()
  employees?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  maxScore?: number;

  @ApiProperty()
  @IsInt()
  order: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isRequired?: boolean;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  onboardingId: string;
}

export class UpdateOnboardingStepDto extends CreateOnboardingStepDto {}

export class CreateOnboardingDto {
  @ApiProperty({ example: 'Employee Onboarding' })
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ type: [CreateOnboardingStepDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOnboardingStepDto)
  steps?: CreateOnboardingStepDto[];
}

export class UpdateOnboardingDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ type: [CreateOnboardingStepDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOnboardingStepDto)
  steps?: CreateOnboardingStepDto[];
}
