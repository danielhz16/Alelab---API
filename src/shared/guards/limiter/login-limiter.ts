import { Injectable } from "@nestjs/common";
import { ThrottlerGuard } from "@nestjs/throttler";
import { ThrottlerRequest } from "@nestjs/throttler";

const TTL = 15 * 60 * 1000; 
const LIMIT = 5;

@Injectable()
export class LoginLimiterGuard extends ThrottlerGuard {
  protected async handleRequest(
    requestProps: ThrottlerRequest,
  ): Promise<boolean> {

    return super.handleRequest({
      ...requestProps,
      limit: LIMIT,
      ttl: TTL,
    });
  }

  protected async getTracker(req: Record<string, any>): Promise<string> {
    const userIdentifier = req.body?.user;
    return userIdentifier ? `strict-user-limit:${userIdentifier}` : 'anonymous-attempt';
  }
}



