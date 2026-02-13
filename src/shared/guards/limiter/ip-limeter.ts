import { Injectable } from "@nestjs/common";
import { ThrottlerGuard, ThrottlerRequest } from "@nestjs/throttler";
import { HttpException, HttpStatus } from "@nestjs/common";


const IP_TTL = 60000; 
const IP_LIMIT = 20;

@Injectable()
export class IpLimiterGuard extends ThrottlerGuard {
  protected async handleRequest(
    requestProps: ThrottlerRequest,
  ): Promise<boolean> {
    return super.handleRequest({
      ...requestProps,
      limit: IP_LIMIT,
      ttl: IP_TTL,
    });
  }

  protected async getTracker(req: Record<string, any>): Promise<string> {
    const ipAddress = req.ipAddress || req.ip ;
    if (!ipAddress) {
      throw new HttpException("IP address not found", HttpStatus.UNAUTHORIZED);
    }
    return ipAddress;
  }
}
