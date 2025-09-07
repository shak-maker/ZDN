import { Injectable, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerLimitDetail } from '@nestjs/throttler';

@Injectable()
export class RateLimitGuard extends ThrottlerGuard {
  protected async throwThrottlingException(context: ExecutionContext, throttlerLimitDetail: ThrottlerLimitDetail): Promise<void> {
    const request = context.switchToHttp().getRequest();
    const ip = request.ip || request.connection.remoteAddress;
    
    throw new HttpException(
      {
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        message: 'Too many requests from this IP, please try again later.',
        error: 'Too Many Requests',
        timestamp: new Date().toISOString(),
        path: request.url,
        ip,
      },
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }

  protected async getTracker(req: Record<string, any>): Promise<string> {
    // Use IP address as the primary tracker
    return req.ip || req.connection.remoteAddress || 'unknown';
  }
}
