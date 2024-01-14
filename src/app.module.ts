import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma.service';
import { AuthGuard } from './guards/auth.guard';
import { UsersService } from './users/users.service';


@Module({
  imports: [UsersModule, ],
  controllers: [AppController],
  providers: [AppService, PrismaService, AuthGuard,UsersService],
})
export class AppModule {}
