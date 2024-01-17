import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private prismaClient : PrismaService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest<Request>();
      const token = this.extractTokenFromHeader(request);
  
      if (!token) {
        throw new UnauthorizedException("No token provided");
      }
  
      try {
        const payload = await this.jwtService.verifyAsync(token, {
          secret: process.env.JWT_SECRET,
        });
  
        const user = await this.prismaClient.user.findUnique({
          where: { id: payload.user_id },
        });
  
        if (!user || user.rememberToken !== token) {
          throw new UnauthorizedException("Invalid token or user does not exist");
        }
  
        request['auth'] = payload;
      } catch (error) {
        throw new UnauthorizedException("Unauthorized access");
      }
      return true;
    }
  
    private extractTokenFromHeader(request: Request): string | undefined {
      const authHeader = request.headers.authorization;
      if (!authHeader) {
        return undefined;
      }
  
      const [type, token] = authHeader.split(' ');
      return type === 'Bearer' ? token : undefined;
    }
  }