import { Injectable } from '@nestjs/common';
import { CreateReportDto, CreateReportDetailDto } from '../dto/create-report.dto';
import { CanonicalJsonResponse, Hemjilt, HemjiltDetail } from '../interfaces/canonical-json.interface';

@Injectable()
export class JsonTransformationService {
  transformToCanonicalJson(reportData: CreateReportDto): CanonicalJsonResponse {
    const now = this.formatDateTime(new Date().toISOString());
    
    const hemjilt: Hemjilt = {
      ContractNo: reportData.contractNo || '',
      Customer: reportData.customer || '',
      DischargeCommenced: this.formatDateTime(reportData.dischargeCommenced),
      DischargeCompleted: this.formatDateTime(reportData.dischargeCompleted),
      FullCompleted: this.formatDateTime(reportData.fullCompleted),
      HandledBy: reportData.handledBy || '',
      HemjiltDetails: reportData.reportDetails.map(detail => this.transformDetail(detail)),
      Inspector: reportData.inspector || '',
      Location: reportData.location || '',
      Object: reportData.object || '',
      Product: reportData.product || '',
      ReportDate: this.formatDateTime(reportData.reportDate),
      ReportNo: reportData.reportNo
    };

    return {
      Message: '',
      SendDate: now,
      Success: 'true',
      Hemjilt: hemjilt
    };
  }

  private transformDetail(detail: CreateReportDetailDto): HemjiltDetail {
    return {
      ActualDensity: detail.actualDensity || '0',
      ZDNMT: detail.zdnmt || '0',
      DensityAt20c: detail.densityAt20c || '0',
      DifferenceZdnRWBMT: detail.differenceZdnRwbmt || '0',
      DifferenceZdnRWBMTProcent: detail.differenceZdnRwbmtPercent || '0',
      DipSm: detail.dipSm || '0',
      GOVLtr: detail.govLiters?.toString() || '0',
      RTCNo: detail.rtcNo || '',
      RWBMTGross: detail.rwbmtGross || '0',
      RWBNo: detail.rwbNo || '',
      SealNo: detail.sealNo || '',
      TOVltr: detail.tovLiters?.toString() || '0',
      Temperature: detail.temperatureC || '0',
      Type: detail.type || '',
      WaterLtr: detail.waterLiters?.toString() || '0',
      WaterSm: detail.waterSm || '0'
    };
  }

  private formatDateTime(dateTime?: string): string {
    if (!dateTime) return '';
    
    try {
      const date = new Date(dateTime);
      return date.toISOString().replace('T', ' ').replace('Z', '').substring(0, 19);
    } catch {
      return '';
    }
  }

  private formatDate(date?: string): string {
    if (!date) return '';
    
    try {
      const dateObj = new Date(date);
      return dateObj.toISOString().split('T')[0];
    } catch {
      return '';
    }
  }

  createErrorResponse(message: string): CanonicalJsonResponse {
    return {
      Message: message,
      SendDate: this.formatDateTime(new Date().toISOString()),
      Success: 'false',
      Hemjilt: {
        ContractNo: '',
        Customer: '',
        DischargeCommenced: '',
        DischargeCompleted: '',
        FullCompleted: '',
        HandledBy: '',
        HemjiltDetails: [],
        Inspector: '',
        Location: '',
        Object: '',
        Product: '',
        ReportDate: '',
        ReportNo: ''
      }
    };
  }
}
