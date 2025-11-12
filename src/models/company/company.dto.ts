import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  AppType,
  ClainEligibility,
  HolidayTypes,
  Mode,
  ProductivityTrackingMethods,
  ProductivityVisibility,
  RecurrenceType,
  ReportingDashboard,
  ScreenshotFrequency,
  TrackingMethod,
  TrackingTimeMethod,
  TrackingType,
  TrackinList,
  WEEKDAY,
} from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsJSON,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Min,
  ValidateNested,
} from 'class-validator';
import { EmployeeSettingDto } from './employee.dto';
import { Transform } from 'class-transformer';

export class CompanyUpdateDto {
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  bannerUrl?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  dateFormat?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({ type: String })
  @IsOptional()
  // @IsEmail()
  email: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  heardAboutUs?: string;

  @ApiProperty({ description: 'Minimum tenure before requesting leave (days)' })
  @IsInt()
  @Min(0)
  @IsOptional()
  totalHolidays: number;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  totalEmployee?: string;

  @ApiPropertyOptional({ enum: WEEKDAY, default: WEEKDAY.MONDAY })
  @IsOptional()
  @IsEnum(WEEKDAY)
  startWeek?: WEEKDAY;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  currencyCode?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  taxId?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiPropertyOptional({ type: [String], enum: WEEKDAY })
  @IsOptional()
  @IsEnum(WEEKDAY, { each: true })
  workingDays?: WEEKDAY[];

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  industry?: string;

  @ApiPropertyOptional({ type: Boolean, default: false })
  @Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    return false;
  })
  @IsOptional()
  @IsBoolean()
  memberTimezone?: boolean;

  @ApiPropertyOptional({ type: Boolean, default: false })
  @Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    return false;
  })
  @IsOptional()
  @IsBoolean()
  employeeWorkingDayChoice?: boolean;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  planId?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  resumptionTime?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  closingTime?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  breakTime?: string;

  @ApiPropertyOptional({ default: false })
  @Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    return false;
  })
  @IsOptional()
  @IsBoolean()
  countryTimeZone?: boolean;

  @ApiPropertyOptional({ default: false })
  @Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    return false;
  })
  @IsOptional()
  @IsBoolean()
  aboutMe?: boolean;

  @ApiPropertyOptional({ default: false })
  @Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    return false;
  })
  @IsOptional()
  @IsBoolean()
  primaryInfo?: boolean;

  @ApiPropertyOptional({ default: false })
  @Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    return false;
  })
  @IsOptional()
  @IsBoolean()
  personalInfo?: boolean;

  @ApiPropertyOptional({ default: false })
  @Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    return false;
  })
  @IsOptional()
  @IsBoolean()
  emergencyContact?: boolean;

  @ApiPropertyOptional({ default: false })
  @Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    return false;
  })
  @IsOptional()
  @IsBoolean()
  jobDetails?: boolean;

  @ApiPropertyOptional({ default: false })
  @Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    return false;
  })
  @IsOptional()
  @IsBoolean()
  bankingInfo?: boolean;

  @ApiPropertyOptional({ default: false })
  @Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    return false;
  })
  @IsOptional()
  @IsBoolean()
  identityInfo?: boolean;

  @ApiPropertyOptional({ type: Boolean, default: false })
  @Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    return false;
  })
  @IsOptional()
  @Type(() => Boolean) // ✅ converts "true"/"false" strings to boolean
  @IsBoolean()
  paymentRateDisplay: boolean = false;

  @ApiPropertyOptional({ type: Boolean, default: false })
  @Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    return false;
  })
  @IsOptional()
  @Type(() => Boolean) // ✅ converts "true"/"false" strings to boolean
  @IsBoolean()
  permissionByRole: boolean = false;

  @ApiPropertyOptional({ type: Boolean, default: false })
  @Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    return false;
  })
  @IsOptional()
  @Type(() => Boolean) // ✅ converts "true"/"false" strings to boolean
  @IsBoolean()
  receiveAllNotification: boolean = false;
}

export class RotaRuleSettingDto {
  @ApiProperty()
  @IsBoolean()
  allowMemberSwapShifts: boolean;

  @ApiProperty({ description: 'Minimum shift duration in hours' })
  @IsInt()
  @Min(1)
  minShiftDuration: number;

  @ApiProperty({ description: 'Maximum shift duration in hours' })
  @IsInt()
  @Min(1)
  maxShiftDuration: number;

  @ApiProperty({ description: 'Minimum rest time between shifts in hours' })
  @IsInt()
  @Min(0)
  minTimeBetweenShifts: number;

  @ApiProperty({ description: 'Maximum consecutive workdays allowed' })
  @IsInt()
  @Min(1)
  maxConsecutiveWorkdays: number;

  @ApiProperty({ description: 'Maximum weekly hours per employee' })
  @IsInt()
  @Min(1)
  maxWeeklyHoursPerEmployee: number;

  @ApiProperty({ description: 'Minimum weekly hours per employee' })
  @IsInt()
  @Min(0)
  minWeeklyHoursPerEmployee: number;
}

export class ShiftSettingDto {
  @ApiProperty()
  @IsBoolean()
  enableShiftTrading: boolean;

  @ApiProperty()
  @IsBoolean()
  allowTradesAcrossLocations: boolean;

  @ApiProperty()
  @IsBoolean()
  allowTradesAcrossRoles: boolean;

  @ApiProperty({
    required: false,
    description: 'Minimum notice time (hours) for trade requests',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  minNoticeTimeForTradeRequest?: number;

  @ApiProperty({
    required: false,
    description: 'Latest approval time before shift (hours)',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  latestApprovalTimeBeforeShift?: number;

  @ApiProperty()
  @IsBoolean()
  allowSameDayShiftTrades: boolean;

  @ApiProperty()
  @IsBoolean()
  enableOpenShifts: boolean;

  @ApiProperty({
    required: false,
    description: 'Claim eligibility type (all, qualified, branch/department)',
    enum: ClainEligibility, // <-- add this for Swagger UI to show dropdown
    example: ClainEligibility.ALL_EMPLOYEE,
  })
  @IsOptional()
  @IsEnum(ClainEligibility, {
    message: `claimEligibility must be one of: ${Object.values(ClainEligibility).join(', ')}`,
  })
  claimEligibility?: ClainEligibility;

  @ApiProperty({
    required: false,
    description: 'Minimum notice to claim open shift (hours)',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  minNoticeToClaim?: number;

  @ApiProperty({
    required: false,
    description: 'Minimum notice to claim open shift (hours)',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  hours?: number;

  @ApiProperty({
    required: false,
    description: 'Minimum notice to claim open shift (hours)',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  days?: number;

  @ApiProperty()
  @IsBoolean()
  limitOpenShiftsPerWeekPerEmployee: boolean;

  @ApiProperty()
  @IsBoolean()
  allowAdminOverride: boolean;
}

export class HolidayRequestRuleSettingDto {
  @ApiProperty()
  @IsBoolean()
  enableHolidayRequests: boolean;

  @ApiProperty({
    type: [String],
    description: 'Types of leave allowed',
    enum: HolidayTypes,
    example: [HolidayTypes.MATERNITY, HolidayTypes.SICK_LEAVE], // example
  })
  @IsArray()
  @IsEnum(HolidayTypes, {
    each: true,
    message: `Each holiday type must be one of: ${Object.values(HolidayTypes).join(', ')}`,
  })
  holidayTypesAllowed: HolidayTypes[];

  @ApiProperty({ description: 'Minimum notice before requesting leave (days)' })
  @IsInt()
  @Min(0)
  minNoticeBeforeLeave: number;

  @ApiProperty({ description: 'Maximum days off per request' })
  @IsInt()
  @Min(1)
  maxDaysOffPerRequest: number;

  @ApiProperty()
  @IsBoolean()
  allowHalfDayRequests: boolean;

  @ApiProperty({ description: 'Minimum tenure before requesting leave (days)' })
  @IsInt()
  @Min(0)
  minTenureBeforeLeave: number;

  @ApiProperty()
  @IsBoolean()
  excludeNewStarters: boolean;

  @ApiProperty({
    type: String,
    description: 'Approval required from (Line Manager, HR/Admin, etc.)',
  })
  @IsString()
  approvalRequiredFrom: string;

  @ApiProperty()
  @IsBoolean()
  autoApproveIfNoConflict: boolean;

  @ApiProperty({ description: 'Days before escalation if unapproved' })
  @IsInt()
  @Min(1)
  escalateUnapprovedAfterDays: number;

  @ApiProperty()
  @IsBoolean()
  allowMultiLevelApprovals: boolean;
}

export class AppsDto {
  @ApiProperty({ example: 'Slack' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Communication', required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ example: 'https://slack.com', required: false })
  @IsOptional()
  @IsUrl()
  url?: string;

  @ApiProperty({ enum: AppType, default: AppType.PRODUCTIVE })
  @IsOptional()
  @IsEnum(AppType)
  type?: AppType;
}

export class DigiTimeSettingDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  enableTimeTracking: boolean;

  @ApiProperty({
    enum: TrackingTimeMethod,
    isArray: true,
    required: false,
    description: 'List of tracking methods to use',
  })
  @IsOptional()
  @IsArray()
  @IsEnum(TrackingTimeMethod, { each: true })
  trackingMethod?: TrackingTimeMethod[];

  @ApiProperty({ example: 15.5 })
  @IsNumber()
  baseHourlyRate: number;

  @ApiProperty({ example: 'GBP', required: false })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  allowRoleBasedRates: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  allowCustomRatePerEmployee: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  productivityEnabled: boolean;

  @ApiProperty({
    type: [String],
    enum: ProductivityTrackingMethods,
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(ProductivityTrackingMethods, { each: true })
  productivityTrackingMethod?: ProductivityTrackingMethods[];

  @ApiProperty({
    enum: ProductivityVisibility,
    required: false,
  })
  @IsOptional()
  @IsEnum(ProductivityVisibility)
  productivityVisibility?: ProductivityVisibility;

  @ApiProperty({ example: true })
  @IsBoolean()
  enableOvertime: boolean;

  @ApiProperty({ enum: RecurrenceType, required: false })
  @IsOptional()
  @IsEnum(RecurrenceType)
  trackingType?: RecurrenceType;

  @ApiProperty({ example: 8, required: false })
  @IsOptional()
  @IsNumber()
  standardDailyHours?: number;

  @ApiProperty({ example: 40, required: false })
  @IsOptional()
  @IsNumber()
  standardWeeklyHours?: number;

  @ApiProperty({ example: 4, required: false })
  @IsOptional()
  @IsNumber()
  maxDailyOvertime?: number;

  @ApiProperty({ example: 10, required: false })
  @IsOptional()
  @IsNumber()
  maxWeeklyOvertime?: number;

  @ApiProperty({ example: 15.0, required: false })
  @IsOptional()
  @IsNumber()
  standardOvertimeRate?: number;

  @ApiProperty({ example: 20.0, required: false })
  @IsOptional()
  @IsNumber()
  weekendOvertimeRate?: number;

  @ApiProperty({ type: [AppsDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AppsDto)
  apps?: AppsDto[];
}

export class BreakSettingDto {
  @ApiProperty({ example: 'Tea break' })
  @IsString()
  name: string;

  @ApiProperty({ example: 15, description: 'Duration in minutes' })
  @IsInt()
  @Min(1)
  durationMinutes: number;

  @ApiProperty({ example: true, description: 'Whether this break is active' })
  @IsBoolean()
  @IsOptional()
  status?: boolean = true;
}

export class BreakComplianceSettingDto {
  @ApiProperty({
    example: true,
    description: 'Enable or disable breaks globally',
  })
  @IsBoolean()
  enabled: boolean;

  @ApiProperty({
    enum: Mode,
    description: 'Defines how breaks are grouped (ALL, SHIFT, CUSTOM)',
    example: Mode.ALL,
  })
  @IsEnum(Mode, {
    message: `breakTimeGrouping must be one of: ${Object.values(Mode).join(', ')}`,
  })
  @IsOptional()
  breakTimeGrouping?: Mode = Mode.ALL;

  @ApiProperty({
    description: 'Break duration in minutes',
    example: 0,
    minimum: 0,
  })
  @IsInt({ message: 'breakTime must be an integer' })
  @Min(0, { message: 'breakTime cannot be negative' })
  @IsOptional()
  breakTime?: number = 0;

  @ApiProperty({
    type: [BreakSettingDto],
    description: 'List of defined breaks',
  })
  @IsOptional()
  breaks?: BreakSettingDto[];
}

export class PayRateDto {
  @ApiPropertyOptional({ type: Boolean, default: false })
  @IsOptional()
  @Type(() => Boolean) // ✅ converts "true"/"false" strings to boolean
  @IsBoolean()
  paymentRateDisplay: boolean = false;

  @ApiPropertyOptional({ type: [EmployeeSettingDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => EmployeeSettingDto)
  staffs?: EmployeeSettingDto[];
}

export class ActivityTrackingSettingDto {
  @ApiProperty({
    description: 'Enable or disable monitoring',
    default: false,
    example: true,
  })
  @Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    return false;
  })
  @IsBoolean()
  @IsOptional()
  enableMonitoring?: boolean;

  @ApiProperty({
    description: 'Tracking methods used',
    enum: TrackingMethod,
    isArray: true,
    required: false,
  })
  @IsEnum(TrackingMethod, { each: true })
  @IsArray()
  @IsOptional()
  trackingMethods?: TrackingMethod[];

  @ApiProperty({
    description: 'List of dashboards available for reporting',
    enum: ReportingDashboard,
    isArray: true,
    required: false,
  })
  @IsEnum(ReportingDashboard, { each: true })
  @IsArray()
  @IsOptional()
  reportingDashboard?: ReportingDashboard[];

  @ApiProperty({
    description: 'List of dashboards available for reporting',
    isArray: true,
    required: false,
  })
  @IsArray()
  @IsOptional()
  memberIds?: string[];

  @ApiProperty({
    description: 'Application tracking mode',
    enum: Mode,
    default: Mode.INDIVIDUAL,
    required: false,
  })
  @IsEnum(Mode)
  @IsOptional()
  appTrackingMode?: Mode;

  @ApiProperty({
    description: 'Tracking level configuration',
    enum: TrackinList,
    default: TrackinList.OFF,
    required: false,
  })
  @IsEnum(TrackinList)
  @IsOptional()
  track?: TrackinList;

  @ApiProperty({
    description:
      'List of productive applications or URLs with categories (JSON)',
    required: false,
  })
  // @IsJSON()
  @IsOptional()
  productiveApps?: any;

  @ApiProperty({
    description:
      'List of unproductive applications or URLs with categories (JSON)',
    required: false,
  })
  // @IsJSON()
  @IsOptional()
  unproductiveApps?: any;

  @ApiProperty({
    description: 'Screenshot capture mode',
    enum: Mode,
    default: Mode.INDIVIDUAL,
    required: false,
  })
  @IsEnum(Mode)
  @IsOptional()
  screenshotMode?: Mode;

  @ApiProperty({
    description: 'Screenshot frequency',
    enum: ScreenshotFrequency,
    default: ScreenshotFrequency.NONE,
    required: false,
  })
  @IsEnum(ScreenshotFrequency)
  @IsOptional()
  screenshotFrequency?: ScreenshotFrequency;

  @ApiProperty({
    description: 'Interval (in minutes) between screenshots',
    default: 30,
    required: false,
  })
  @IsInt()
  @IsOptional()
  screenshotIntervalMinutes?: number;

  @ApiProperty({
    description: 'Frequency control mode for screenshots',
    enum: Mode,
    default: Mode.ALL,
    required: false,
  })
  @IsEnum(Mode)
  @IsOptional()
  controlFrequencyOfScreenshot?: Mode;

  @ApiProperty({
    description: 'Type of app tracking',
    enum: TrackingType,
    default: TrackingType.OFF,
    required: false,
  })
  @IsEnum(TrackingType)
  @IsOptional()
  appTrackingType?: TrackingType;

  @ApiProperty({
    description: 'Notify users when a screenshot is taken',
    default: false,
    required: false,
  })
  @Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    return false;
  })
  @IsBoolean()
  @IsOptional()
  appScreenshotNotification?: boolean;

  @ApiProperty({
    description: 'Allow manager to delete screenshots',
    default: false,
    required: false,
  })
  @Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    return false;
  })
  @IsBoolean()
  @IsOptional()
  managerDeleteScreenshot?: boolean;
}

export class NotificationSettingDto {
  @ApiProperty({
    description: 'Enable or disable DigiRota notifications',
    default: false,
  })
  @IsBoolean()
  digiRota: boolean;

  @ApiProperty({
    description: 'Enable or disable DigiTime notifications',
    default: false,
  })
  @IsBoolean()
  digiTime: boolean;

  @ApiProperty({
    description: 'Enable or disable DigiOff notifications',
    default: false,
  })
  @IsBoolean()
  digiOff: boolean;

  @ApiProperty({
    description: 'Enable or disable celebration notifications',
    default: false,
  })
  @IsBoolean()
  celebration: boolean;

  @ApiProperty({
    description: 'Enable or disable event notifications',
    default: false,
  })
  @IsBoolean()
  events: boolean;

  @ApiProperty({
    description: 'Enable or disable news and updates notifications',
    default: false,
  })
  @IsBoolean()
  newsUpdates: boolean;

  @ApiProperty({
    description: 'Enable or disable push notifications',
    default: false,
  })
  @IsBoolean()
  pushNotification: boolean;

  @ApiProperty({
    description: 'Enable or disable in-app notifications',
    default: false,
  })
  @IsBoolean()
  inAppNotification: boolean;

  @ApiProperty({
    description: 'Enable or disable email notifications',
    default: false,
  })
  @IsBoolean()
  emailNotification: boolean;

  @ApiProperty({
    description: 'Enable or disable SMS notifications',
    default: false,
  })
  @IsBoolean()
  smsNotification: boolean;

  @ApiProperty({
    type: [String],
    description: 'array of job role ids',
    enum: HolidayTypes,
    example: [], // example
  })
  @IsArray()
  jobroleIds: string[];
}
