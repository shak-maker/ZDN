import { IsString, IsOptional, IsDateString, IsArray, ValidateNested, IsNumber, IsDecimal } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReportDetailDto {
  @ApiPropertyOptional({ description: 'Actual density value' })
  @IsOptional()
  @IsString()
  actualDensity?: string;

  @ApiPropertyOptional({ description: 'ZDNMT value' })
  @IsOptional()
  @IsString()
  zdnmt?: string;

  @ApiPropertyOptional({ description: 'Density at 20°C' })
  @IsOptional()
  @IsString()
  densityAt20c?: string;

  @ApiPropertyOptional({ description: 'Difference ZDN RWBMT' })
  @IsOptional()
  @IsString()
  differenceZdnRwbmt?: string;

  @ApiPropertyOptional({ description: 'Difference ZDN RWBMT percentage' })
  @IsOptional()
  @IsString()
  differenceZdnRwbmtPercent?: string;

  @ApiPropertyOptional({ description: 'Dip measurement in cm' })
  @IsOptional()
  @IsString()
  dipSm?: string;

  @ApiPropertyOptional({ description: 'GOV in liters' })
  @IsOptional()
  @IsNumber()
  govLiters?: number;

  @ApiPropertyOptional({ description: 'RTC number' })
  @IsOptional()
  @IsString()
  rtcNo?: string;

  @ApiPropertyOptional({ description: 'RWBMT gross value' })
  @IsOptional()
  @IsString()
  rwbmtGross?: string;

  @ApiPropertyOptional({ description: 'RWB number' })
  @IsOptional()
  @IsString()
  rwbNo?: string;

  @ApiPropertyOptional({ description: 'Seal number' })
  @IsOptional()
  @IsString()
  sealNo?: string;

  @ApiPropertyOptional({ description: 'TOV in liters' })
  @IsOptional()
  @IsNumber()
  tovLiters?: number;

  @ApiPropertyOptional({ description: 'Temperature in Celsius' })
  @IsOptional()
  @IsString()
  temperatureC?: string;

  @ApiPropertyOptional({ description: 'Type' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ description: 'Water in liters' })
  @IsOptional()
  @IsNumber()
  waterLiters?: number;

  @ApiPropertyOptional({ description: 'Water measurement in cm' })
  @IsOptional()
  @IsString()
  waterSm?: string;
}

export class CreateReportDto {
  @ApiPropertyOptional({ description: 'Contract number' })
  @IsOptional()
  @IsString()
  contractNo?: string;

  @ApiPropertyOptional({ description: 'Customer name' })
  @IsOptional()
  @IsString()
  customer?: string;

  @ApiPropertyOptional({ description: 'Discharge commenced date and time' })
  @IsOptional()
  @IsDateString()
  dischargeCommenced?: string;

  @ApiPropertyOptional({ description: 'Discharge completed date and time' })
  @IsOptional()
  @IsDateString()
  dischargeCompleted?: string;

  @ApiPropertyOptional({ description: 'Full completed date and time' })
  @IsOptional()
  @IsDateString()
  fullCompleted?: string;

  @ApiPropertyOptional({ description: 'Handled by' })
  @IsOptional()
  @IsString()
  handledBy?: string;

  @ApiPropertyOptional({ description: 'Inspector name' })
  @IsOptional()
  @IsString()
  inspector?: string;

  @ApiPropertyOptional({ description: 'Location' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ description: 'Object description' })
  @IsOptional()
  @IsString()
  object?: string;

  @ApiPropertyOptional({ description: 'Product type' })
  @IsOptional()
  @IsString()
  product?: string;

  @ApiPropertyOptional({ description: 'Report date' })
  @IsOptional()
  @IsDateString()
  reportDate?: string;

  @ApiProperty({ description: 'Report number (unique)' })
  @IsString()
  reportNo: string;

  @ApiProperty({ description: 'Report details array', type: [CreateReportDetailDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateReportDetailDto)
  reportDetails: CreateReportDetailDto[];
}
