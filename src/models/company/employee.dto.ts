import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsEnum, IsInt, Min } from 'class-validator';
import { BillingCycle } from '@prisma/client';

export class EmployeeSettingDto {
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  employeeId?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  currencyCode?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  countryCode?: string;

  @ApiPropertyOptional({ type: Number, default: 0 })
  @IsOptional()
  @IsNumber()
  payRate: number = 0;

  @ApiPropertyOptional({ type: Number, default: 0 })
  @IsOptional()
  @IsNumber()
  hours: number = 0;

  @ApiPropertyOptional({ enum: BillingCycle, default: BillingCycle.PER_HOUR })
  @IsOptional()
  @IsEnum(BillingCycle)
  period: BillingCycle = BillingCycle.PER_HOUR;

  @ApiProperty({ description: 'Minimum tenure before requesting leave (days)' })
  @IsInt()
  @Min(0)
  @IsOptional()
  annualLeave: number;

  @ApiProperty({ description: 'Minimum tenure before requesting leave (days)' })
  @IsInt()
  @Min(0)
  @IsOptional()
  bankHoliday: number;

}
