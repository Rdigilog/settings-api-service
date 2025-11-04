import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsEnum,
  IsInt,
  Min,
  IsBoolean,
} from 'class-validator';
import {
  BillingCycle,
  ScreenshotFrequency,
  TrackingType,
} from '@prisma/client';

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

  @ApiProperty({
    enum: ScreenshotFrequency,
    description: 'How frequently screenshots are captured (NONE, 1X, 2X, 3X)',
    example: ScreenshotFrequency.NONE,
  })
  @IsEnum(ScreenshotFrequency)
  screenshotFrequency: ScreenshotFrequency;

  @ApiProperty({
    description: 'Time interval for screenshots in minutes',
    example: 30,
    default: 30,
  })
  @IsInt()
  @Min(1)
  screenshotIntervalMinutes: number;

  @ApiProperty({
    enum: TrackingType,
    description:
      'Tracking type for applications and URLs (OFF, APPS_ONLY, URLS_ONLY, BOTH)',
    example: TrackingType.OFF,
  })
  @IsEnum(TrackingType)
  appTrackingType: TrackingType;

  @ApiProperty({
    description: 'Whether app screenshot notifications are enabled',
    example: false,
    default: false,
  })
  @IsBoolean()
  appScrennshotNotification: boolean;
}
