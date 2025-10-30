export interface HemjiltDetail {
  ActualDensity: string;
  ZDNMT: string;
  DensityAt20c: string;
  diffTon: string;
  diffTonProcent: string;
  DipSm: string;
  GOVLtr: string;
  tankNo: string;
  documentWeight: string;
  billNo: string;
  sealNo: string;
  TOVltr: string;
  Temperature: string;
  Type: string;
  WaterLtr: string;
  WaterSm: string;
}

export interface Hemjilt {
  ContractNo: string;
  Customer: string;
  DischargeCommenced: string;
  DischargeCompleted: string;
  FullCompleted: string;
  HandledBy: string;
  HemjiltDetails: HemjiltDetail[];
  Inspector: string;
  Location: string;
  Object: string;
  Product: string;
  ReportDate: string;
  ReportNo: string;
}

export interface CanonicalJsonResponse {
  Message: string;
  SendDate: string;
  Success: string;
  Hemjilt: Hemjilt;
  [key: string]: any; // Add index signature for Prisma compatibility
}
