import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsEnum } from 'class-validator';
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

  @ApiPropertyOptional({ type: Number, default: 0 })
  @IsOptional()
  @IsNumber()
  payRate: number = 0;

  @ApiPropertyOptional({ enum: BillingCycle, default: BillingCycle.PER_HOUR })
  @IsOptional()
  @IsEnum(BillingCycle)
  period: BillingCycle = BillingCycle.PER_HOUR;
}


