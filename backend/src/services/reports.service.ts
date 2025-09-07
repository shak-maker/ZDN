import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CreateReportDto } from '../dto/create-report.dto';
import { UpdateReportDto } from '../dto/update-report.dto';
import { QueryReportsDto } from '../dto/query-reports.dto';
import { JsonTransformationService } from './json-transformation.service';
import { CanonicalJsonResponse } from '../interfaces/canonical-json.interface';

@Injectable()
export class ReportsService {
  constructor(
    private prisma: PrismaService,
    private jsonTransformation: JsonTransformationService,
  ) {}

  async create(createReportDto: CreateReportDto) {
    // Check if report number already exists
    const existingReport = await this.prisma.report.findUnique({
      where: { reportNo: createReportDto.reportNo },
    });

    if (existingReport) {
      throw new ConflictException(`Report with number ${createReportDto.reportNo} already exists`);
    }

    // Transform to canonical JSON
    const canonicalJson = this.jsonTransformation.transformToCanonicalJson(createReportDto);

    // Create report with details in a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      const report = await tx.report.create({
        data: {
          contractNo: createReportDto.contractNo,
          customer: createReportDto.customer,
          dischargeCommenced: createReportDto.dischargeCommenced ? new Date(createReportDto.dischargeCommenced) : null,
          dischargeCompleted: createReportDto.dischargeCompleted ? new Date(createReportDto.dischargeCompleted) : null,
          fullCompleted: createReportDto.fullCompleted ? new Date(createReportDto.fullCompleted) : null,
          handledBy: createReportDto.handledBy,
          inspector: createReportDto.inspector,
          location: createReportDto.location,
          object: createReportDto.object,
          product: createReportDto.product,
          reportDate: createReportDto.reportDate ? new Date(createReportDto.reportDate) : null,
          reportNo: createReportDto.reportNo,
          jsonData: canonicalJson as any,
        },
      });

      // Create report details
      if (createReportDto.reportDetails && createReportDto.reportDetails.length > 0) {
        await tx.reportDetail.createMany({
          data: createReportDto.reportDetails.map((detail) => ({
            reportId: report.id,
            actualDensity: detail.actualDensity ? parseFloat(detail.actualDensity) : null,
            zdnmt: detail.zdnmt ? parseFloat(detail.zdnmt) : null,
            densityAt20c: detail.densityAt20c ? parseFloat(detail.densityAt20c) : null,
            differenceAmberRwbmt: detail.differenceAmberRwbmt ? parseFloat(detail.differenceAmberRwbmt) : null,
            differenceAmberRwbmtPercent: detail.differenceAmberRwbmtPercent ? parseFloat(detail.differenceAmberRwbmtPercent) : null,
            dipCm: detail.dipCm ? parseFloat(detail.dipCm) : null,
            govLiters: detail.govLiters,
            rtcNo: detail.rtcNo,
            rwbmtGross: detail.rwbmtGross ? parseFloat(detail.rwbmtGross) : null,
            rwbNo: detail.rwbNo,
            sealNo: detail.sealNo,
            tovLiters: detail.tovLiters,
            temperatureC: detail.temperatureC ? parseFloat(detail.temperatureC) : null,
            type: detail.type,
            waterLiters: detail.waterLiters,
            waterCm: detail.waterCm ? parseFloat(detail.waterCm) : null,
          })),
        });
      }

      return report;
    });

    return result;
  }

  async findAll(query: QueryReportsDto) {
    const { page = 1, limit = 10, search, customer, inspector, product } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { reportNo: { contains: search } },
        { customer: { contains: search } },
        { inspector: { contains: search } },
      ];
    }

    if (customer) {
      where.customer = { contains: customer };
    }

    if (inspector) {
      where.inspector = { contains: inspector };
    }

    if (product) {
      where.product = { contains: product };
    }

    const [reports, total] = await Promise.all([
      this.prisma.report.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          reportDetails: true,
        },
      }),
      this.prisma.report.count({ where }),
    ]);

    return {
      data: reports,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const report = await this.prisma.report.findUnique({
      where: { id },
      include: {
        reportDetails: true,
      },
    });

    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }

    return report;
  }

  async findByReportNo(reportNo: string): Promise<CanonicalJsonResponse> {
    const report = await this.prisma.report.findUnique({
      where: { reportNo },
      include: {
        reportDetails: true,
      },
    });

    if (!report) {
      return this.jsonTransformation.createErrorResponse('Report not found');
    }

    return report.jsonData as unknown as CanonicalJsonResponse;
  }

  async update(id: number, updateReportDto: UpdateReportDto) {
    const existingReport = await this.findOne(id);

    // Check if report number is being changed and if it already exists
    if (updateReportDto.reportNo && updateReportDto.reportNo !== existingReport.reportNo) {
      const reportWithSameNumber = await this.prisma.report.findUnique({
        where: { reportNo: updateReportDto.reportNo },
      });

      if (reportWithSameNumber) {
        throw new ConflictException(`Report with number ${updateReportDto.reportNo} already exists`);
      }
    }

    // Transform to canonical JSON if any data is being updated
    const canonicalJson = this.jsonTransformation.transformToCanonicalJson({
      ...existingReport,
      ...updateReportDto,
    } as CreateReportDto);

    const result = await this.prisma.$transaction(async (tx) => {
      // Update report
      const report = await tx.report.update({
        where: { id },
        data: {
          contractNo: updateReportDto.contractNo,
          customer: updateReportDto.customer,
          dischargeCommenced: updateReportDto.dischargeCommenced ? new Date(updateReportDto.dischargeCommenced) : undefined,
          dischargeCompleted: updateReportDto.dischargeCompleted ? new Date(updateReportDto.dischargeCompleted) : undefined,
          fullCompleted: updateReportDto.fullCompleted ? new Date(updateReportDto.fullCompleted) : undefined,
          handledBy: updateReportDto.handledBy,
          inspector: updateReportDto.inspector,
          location: updateReportDto.location,
          object: updateReportDto.object,
          product: updateReportDto.product,
          reportDate: updateReportDto.reportDate ? new Date(updateReportDto.reportDate) : undefined,
          reportNo: updateReportDto.reportNo,
          jsonData: canonicalJson as any,
        },
      });

      // Update report details if provided
      if (updateReportDto.reportDetails) {
        // Delete existing details
        await tx.reportDetail.deleteMany({
          where: { reportId: id },
        });

        // Create new details
        if (updateReportDto.reportDetails.length > 0) {
          await tx.reportDetail.createMany({
            data: updateReportDto.reportDetails.map((detail) => ({
              reportId: id,
              actualDensity: detail.actualDensity ? parseFloat(detail.actualDensity) : null,
              zdnmt: detail.zdnmt ? parseFloat(detail.zdnmt) : null,
              densityAt20c: detail.densityAt20c ? parseFloat(detail.densityAt20c) : null,
              differenceAmberRwbmt: detail.differenceAmberRwbmt ? parseFloat(detail.differenceAmberRwbmt) : null,
              differenceAmberRwbmtPercent: detail.differenceAmberRwbmtPercent ? parseFloat(detail.differenceAmberRwbmtPercent) : null,
              dipCm: detail.dipCm ? parseFloat(detail.dipCm) : null,
              govLiters: detail.govLiters,
              rtcNo: detail.rtcNo,
              rwbmtGross: detail.rwbmtGross ? parseFloat(detail.rwbmtGross) : null,
              rwbNo: detail.rwbNo,
              sealNo: detail.sealNo,
              tovLiters: detail.tovLiters,
              temperatureC: detail.temperatureC ? parseFloat(detail.temperatureC) : null,
              type: detail.type,
              waterLiters: detail.waterLiters,
              waterCm: detail.waterCm ? parseFloat(detail.waterCm) : null,
            })),
          });
        }
      }

      return report;
    });

    return result;
  }

  async remove(id: number) {
    const report = await this.findOne(id);
    
    await this.prisma.report.delete({
      where: { id },
    });

    return { message: 'Report deleted successfully' };
  }
}
