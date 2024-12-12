import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service'; // Import the PrismaService
import { CompaniesModule } from './companies/companies.module';
import { ExternalModule } from './external/external.module'; // Import the ExternalModule

@Module({
  imports: [
    CompaniesModule,  // Import the Companies module
    ExternalModule,   // Import the External module
  ],
  providers: [PrismaService], // Register PrismaService globally
  exports: [PrismaService],   // Export PrismaService if needed in other modules
})
export class AppModule {}



