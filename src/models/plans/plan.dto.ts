import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreatePlanFeatureDto {
  @ApiProperty({
    description: 'Feature ID (from the features table)',
    example: 'a83a2393-4d18-4a55-b116-397234aa40a3',
  })
  @IsUUID()
  featureId: string;

  @ApiProperty({
    description: 'Whether the feature has a limit',
    example: true,
    default: false,
  })
  @IsBoolean()
  hasLimit: boolean;

  @ApiProperty({
    description:
      'The maximum allowed value for the feature (nullable if no limit)',
    example: 10,
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  maxLimit?: number | null;
}

export class PlanDto {
  @ApiPropertyOptional({
    description: 'Unique name of the entity',
    type: String,
    example: 'MyEntity',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Description',
    type: String,
    example: 'my plan description',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Whether the entity is active',
    type: Boolean,
    default: true,
    example: true,
  })
  @IsBoolean()
  active: boolean = true;

  @ApiProperty({
    description: 'List of features associated with this plan',
    type: [CreatePlanFeatureDto],
    example: [
      {
        featureId: 'a83a2393-4d18-4a55-b116-397234aa40a3',
        hasLimit: true,
        maxLimit: 10,
      },
      {
        featureId: 'e32f8838-fbfd-48d3-8331-c5ab335b8055',
        hasLimit: false,
        maxLimit: null,
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePlanFeatureDto)
  planFeatures: CreatePlanFeatureDto[];
}

export class FeatureDto {
  @ApiProperty({
    description: 'Feature name',
    example: 'Dashboard',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Whether the feature is active',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiProperty({
    description: 'Whether the feature is archived',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  archived?: boolean;
}
