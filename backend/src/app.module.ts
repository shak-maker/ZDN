import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './services/prisma.service';
import { ReportsService } from './services/reports.service';
import { JsonTransformationService } from './services/json-transformation.service';
import { AuthService } from './services/auth.service';
import { ReportsController } from './controllers/reports.controller';
import { AuthController } from './controllers/auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default-secret',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '24h' },
    }),
  ],
  controllers: [AppController, ReportsController, AuthController],
  providers: [
    AppService,
    PrismaService,
    ReportsService,
    JsonTransformationService,
    AuthService,
    JwtStrategy,
  ],
})
export class AppModule {}
