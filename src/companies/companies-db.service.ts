import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CompaniesDbService {
  constructor(private readonly prisma: PrismaService) {}

  async createCompany(data: Prisma.CompanyCreateInput) {
    return this.prisma.company.create({ data });
  }

  async getAllCompanies() {
    return this.prisma.company.findMany();
  }

  async getCompanyById(id: number) {
    return this.prisma.company.findUnique({ where: { id } });
  }

  async updateCompany(id: number, data: Prisma.CompanyUpdateInput) {
    return this.prisma.company.update({ where: { id }, data });
  }

  async deleteCompany(id: number) {
    return this.prisma.company.delete({ where: { id } });
  }
}