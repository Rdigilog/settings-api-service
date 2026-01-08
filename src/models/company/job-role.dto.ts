import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  // ArrayNotEmpty,
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateJobRoleDto {
  @ApiProperty({ type: String, example: 'Urgent' })
  @IsString()
  name: string;

  @ApiProperty({ type: String, example: '#FF0000' })
  @IsString()
  color: string;

  @ApiPropertyOptional({
    type: String,
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Employee ID of the primary report',
  })
  @IsOptional()
  @IsUUID()
  primaryReportId?: string;

  @ApiPropertyOptional({
    type: String,
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440001',
    description: 'Employee ID of the secondary report',
  })
  @IsOptional()
  @IsUUID()
  secondaryReportId?: string;

  @ApiProperty({
    type: String,
    format: 'uuid',
    isArray: true,
    example: [
      '550e8400-e29b-41d4-a716-446655440010',
      '550e8400-e29b-41d4-a716-446655440011',
    ],
    description: 'Array of permission IDs (UUIDs)',
  })
  @IsArray()
  // @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  permissions: string[];
}

export class AssignJobRoleDto {
  @ApiProperty({
    description: 'Array of user IDs to assign the job role to',
    type: [String],
    example: [
      'd4d30e9a-1a2b-4a39-9ad8-5e1e42d44d12',
      'bd4b9e7e-3e2a-4a2b-8c1b-7b9e8a6f34a1',
    ],
  })
  @IsArray()
  @IsString({ each: true })
  userIds: string[];
}
