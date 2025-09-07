export interface HemjiltDetail {
  ActualDensity: string;
  ZDNMT: string;
  DensityAt20c: string;
  DifferenceZdnRWBMT: string;
  DifferenceZdnRWBMTProcent: string;
  DipSm: string;
  GOVLtr: string;
  RTCNo: string;
  RWBMTGross: string;
  RWBNo: string;
  SealNo: string;
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
}

export interface CanonicalJsonResponse {
  Message: string;
  SendDate: string;
  Success: boolean;
  Hemjilt: Hemjilt;
  Inspector: string;
  Location: string;
  Object: string;
  Product: string;
  ReportDate: string;
  ReportNo: string;
  [key: string]: any; // Add index signature for Prisma compatibility
}
