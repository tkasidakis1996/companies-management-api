import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { CompaniesDbService } from './companies-db.service';
import { PrismaService } from '../prisma.service'; // Import PrismaService directly

@Module({
  imports: [], // No need for AppModule
  controllers: [CompaniesController],
  providers: [CompaniesService, CompaniesDbService, PrismaService], // Provide PrismaService here
})
export class CompaniesModule {}