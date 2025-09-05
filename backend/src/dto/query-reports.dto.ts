import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryReportsDto {
  @ApiPropertyOptional({ description: 'Page number', minimum: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', minimum: 1, maximum: 100, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Search term for report number, customer, or inspector' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by customer' })
  @IsOptional()
  @IsString()
  customer?: string;

  @ApiPropertyOptional({ description: 'Filter by inspector' })
  @IsOptional()
  @IsString()
  inspector?: string;

  @ApiPropertyOptional({ description: 'Filter by product' })
  @IsOptional()
  @IsString()
  product?: string;
}
