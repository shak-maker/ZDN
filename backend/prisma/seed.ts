import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('Created admin user:', adminUser.username);

  // Create regular user
  const userPassword = await bcrypt.hash('user123', 10);
  const regularUser = await prisma.user.upsert({
    where: { username: 'user' },
    update: {},
    create: {
      username: 'user',
      email: 'user@example.com',
      password: userPassword,
      role: 'USER',
    },
  });

  console.log('Created regular user:', regularUser.username);

  // Create API key for external access
  const apiKey = await prisma.apiKey.upsert({
    where: { key: 'sample-api-key-12345' },
    update: {},
    create: {
      key: 'sample-api-key-12345',
      name: 'Sample API Key',
      description: 'Sample API key for external clients',
      isActive: true,
    },
  });

  console.log('Created API key:', apiKey.name);

  // Create sample report
  const sampleReport = await prisma.report.upsert({
    where: { reportNo: '00000/00006662/25' },
    update: {},
    create: {
      contractNo: 'CONTRACT-001',
      customer: 'M-Oil Group',
      dischargeCommenced: new Date('2025-08-29T11:00:00Z'),
      dischargeCompleted: new Date('2025-08-29T12:15:00Z'),
      fullCompleted: new Date('2025-08-29T12:15:00Z'),
      handledBy: 'Inspector Name',
      inspector: 'Z.Unen',
      location: 'TEDSan Oil Terminal, Ulaanbaatar',
      object: 'RTCs Inspection',
      product: 'Gas Oil',
      reportDate: new Date('2025-08-29'),
      reportNo: '00000/00006662/25',
      jsonData: {
        Message: '',
        SendDate: '2025-08-29T12:15:00Z',
        Success: true,
        Hemjilt: {
          ContractNo: 'CONTRACT-001',
          Customer: 'M-Oil Group',
          DischargeCommenced: '2025-08-29 11:00:00',
          DischargeCompleted: '2025-08-29 12:15:00',
          FullCompleted: '2025-08-29 12:15:00',
          HandledBy: 'Inspector Name',
          Inspector: 'Z.Unen',
          Location: 'TEDSan Oil Terminal, Ulaanbaatar',
          Object: 'RTCs Inspection',
          Product: 'Gas Oil',
          ReportDate: '2025-08-29',
          ReportNo: '00000/00006662/25',
          HemjiltDetails: [
            {
              ActualDensity: '0.8515',
              ZDNMT: '61.266',
              DensityAt20c: '0.8237',
              DiffrenceAmberRWBMT: '-0.254',
              DiffrenceAmberRWBMTProcent: '-0.4',
              DipSm: '255.0',
              GOVLtr: '72936',
              RTCNo: '51389831',
              RWBMTGross: '61.520',
              RWBNo: '24243332',
              SealNo: '4238841',
              TOVltr: '72936',
              Temprature: '21.0',
              Type: '106',
              WaterLtr: '0.0',
              WaterSm: '0.0',
            },
          ],
        },
      },
    },
  });

  // Create sample report details
  await prisma.reportDetail.upsert({
    where: { id: 1 },
    update: {},
    create: {
      reportId: sampleReport.id,
      actualDensity: 0.8515,
      zdnmt: 61.266,
      densityAt20c: 0.8237,
      differenceAmberRwbmt: -0.254,
      differenceAmberRwbmtPercent: -0.4,
      dipCm: 255.0,
      govLiters: 72936,
      rtcNo: '51389831',
      rwbmtGross: 61.520,
      rwbNo: '24243332',
      sealNo: '4238841',
      tovLiters: 72936,
      temperatureC: 21.0,
      type: '106',
      waterLiters: 0,
      waterCm: 0.0,
    },
  });

  console.log('Created sample report:', sampleReport.reportNo);

  console.log('Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
