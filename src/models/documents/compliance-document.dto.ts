import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsInt,
  IsOptional,
  IsUUID,
  IsDateString,
} from 'class-validator';
import { ComplianceDocumentType } from '@prisma/client';

export class CreateComplianceDocumentDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  employeeId: string;

  @ApiProperty({ enum: ComplianceDocumentType })
  @IsEnum(ComplianceDocumentType)
  documentType: ComplianceDocumentType;

  @ApiProperty({ example: 'https://file.url/id.pdf' })
  @IsString()
  fileUrl: string;

  @ApiProperty({ example: 'passport.pdf' })
  @IsString()
  fileName: string;

  @ApiProperty({ example: 204800 })
  @IsInt()
  fileSize: number;

  @ApiProperty({ example: 'application/pdf' })
  @IsString()
  mimeType: string;

  @ApiPropertyOptional({ example: '2026-12-31' })
  @IsOptional()
  @IsDateString()
  expiryDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateComplianceDocumentDto {
  @ApiPropertyOptional({ example: '2027-01-01' })
  @IsOptional()
  @IsDateString()
  expiryDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
