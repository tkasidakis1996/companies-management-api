import { Injectable } from '@nestjs/common';
import { CompaniesDbService } from './companies-db.service';
import { Prisma, Company } from '@prisma/client'; // Use Prisma-generated types
import * as csvParser from 'csv-parser';

@Injectable()
export class CompaniesService {
  constructor(private readonly dbService: CompaniesDbService) {}

  // Create a new company
  async create(companyData: Prisma.CompanyCreateInput): Promise<Company> {
    return this.dbService.createCompany(companyData);
  }

  // Find all companies
  async findAll(): Promise<Company[]> {
    return this.dbService.getAllCompanies();
  }

  // Find a company by ID
  async findOne(id: number): Promise<Company | null> {
    return this.dbService.getCompanyById(id);
  }

  // Update a company's data
  async update(
    id: number,
    updateData: Prisma.CompanyUpdateInput,
  ): Promise<Company> {
    return this.dbService.updateCompany(id, updateData);
  }

  // Delete a company by ID
  async remove(id: number): Promise<Company> {
    return this.dbService.deleteCompany(id);
  }

  // Insert many companies using a CSV file
  async insert_many_using_csv(file: Express.Multer.File): Promise<number> {
    
    const companies: Prisma.CompanyCreateInput[] = [];
    
    try {
      
      const rows = file.buffer.toString().split('\n');
      
      rows.shift(); // Remove the header line

      for (const row of rows) {
        const [name, vatNumber, address] = row.split(',').map((col) => col.trim());
        
        if (name && vatNumber && address) {
          companies.push({ name, vatNumber, address });
        }
      }

      let insertedCount = 0;
      
      for (const companyData of companies) {
        
        try {
          
          await this.create(companyData); // Insert each company
          
          insertedCount++;

        } catch (error) {
          console.warn(`Failed to insert company: ${JSON.stringify(companyData)}`, error);
        }

      }

      return insertedCount; // Return the number of successfully inserted companies
    
    } catch (error) {
      
      console.error('Error processing the CSV file:', error);
      
      throw new Error('CSV processing failed');
    }
  }
  
}