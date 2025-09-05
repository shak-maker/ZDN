import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ReportsService } from '../services/reports.service';
import { CreateReportDto } from '../dto/create-report.dto';
import { UpdateReportDto } from '../dto/update-report.dto';
import { QueryReportsDto } from '../dto/query-reports.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ApiKeyGuard } from '../guards/api-key.guard';

@ApiTags('Reports')
@Controller('api/reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new report' })
  @ApiResponse({ status: 201, description: 'Report created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Report number already exists' })
  create(@Body() createReportDto: CreateReportDto) {
    return this.reportsService.create(createReportDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all reports with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'Reports retrieved successfully' })
  findAll(@Query() query: QueryReportsDto) {
    return this.reportsService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a report by ID' })
  @ApiResponse({ status: 200, description: 'Report retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Report not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reportsService.findOne(id);
  }

  @Get('external/:reportNo')
  @UseGuards(ApiKeyGuard)
  @ApiOperation({ summary: 'Get report by report number (External API)' })
  @ApiResponse({ status: 200, description: 'Report retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Report not found' })
  findByReportNo(@Param('reportNo') reportNo: string) {
    return this.reportsService.findByReportNo(reportNo);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a report' })
  @ApiResponse({ status: 200, description: 'Report updated successfully' })
  @ApiResponse({ status: 404, description: 'Report not found' })
  @ApiResponse({ status: 409, description: 'Report number already exists' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateReportDto: UpdateReportDto) {
    return this.reportsService.update(id, updateReportDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a report' })
  @ApiResponse({ status: 200, description: 'Report deleted successfully' })
  @ApiResponse({ status: 404, description: 'Report not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.reportsService.remove(id);
  }
}
