import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  Min,
  IsUUID,
  IsArray,
} from 'class-validator';

export class CreateLeavePolicyDto {
  @ApiProperty({ description: 'Policy name', example: 'Annual Leave Policy' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Policy description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Branch IDs', type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  branches?: string[];

  @ApiProperty({ description: 'Branch IDs', type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  jobRoles?: string[];

  @ApiProperty({
    description: 'User IDs (members)',
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  members?: string[];

  @ApiProperty({ description: 'Automatically add new members', default: false })
  @IsOptional()
  @IsBoolean()
  autoAddNewMembers?: boolean;

  @ApiProperty({ description: 'Accrual schedule (e.g., MONTHLY, YEARLY)' })
  @IsString()
  accrualSchedule: string;

  @ApiProperty({
    description: 'Use employee join date as accrual start',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  joinDatePolicy?: boolean;

  @ApiProperty({
    description: 'Maximum accrual hours allowed',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  maxAccrualHours?: number;

  @ApiProperty({ description: 'Allow negative balance', default: false })
  @IsOptional()
  @IsBoolean()
  allowNegative?: boolean;

  @ApiProperty({ description: 'Requires approval', default: true })
  @IsOptional()
  @IsBoolean()
  requiresApproval?: boolean;

  @ApiProperty({ description: 'Balance rolls over annually', default: false })
  @IsOptional()
  @IsBoolean()
  balanceRollover?: boolean;

  @ApiProperty({
    description: 'Paid leave (true) or unpaid (false)',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  paid?: boolean;

  @ApiProperty({ description: 'Approval level 1 user ID', required: false })
  @IsOptional()
  @IsUUID()
  approvalLevel1Id?: string;

  @ApiProperty({ description: 'Approval level 2 user ID', required: false })
  @IsOptional()
  @IsUUID()
  approvalLevel2Id?: string;
}

export class UpdateLeavePolicyDto extends PartialType(CreateLeavePolicyDto) {}
