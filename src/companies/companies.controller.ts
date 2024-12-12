import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { CompaniesService } from './companies.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Prisma, Company } from '@prisma/client'; // Import Prisma types
@ApiTags('companies') // Group all endpoints under the "companies" tag in Swagger
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @ApiOperation({ summary: 'Create a new company' })
  @ApiBody({
    description: 'Data for creating a company',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        vatNumber: { type: 'string' },
        address: { type: 'string' },
      },
    },
  })
  @Post()
  async create(@Body() companyData: Prisma.CompanyCreateInput): Promise<Company> {
    return this.companiesService.create(companyData);
  }

  @ApiOperation({ summary: 'Get all companies' })
  @Get()
  async findAll(): Promise<Company[]> {
    return this.companiesService.findAll();
  }

  @ApiOperation({ summary: 'Get a company by ID' })
  @ApiParam({ name: 'id', description: 'ID of the company' })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Company | null> {
    return this.companiesService.findOne(+id);
  }
  

  @ApiOperation({ summary: 'Update a company by ID' })
  @ApiParam({ name: 'id', description: 'ID of the company' })
  @ApiBody({
    description: 'Data for updating a company',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', nullable: true },
        vatNumber: { type: 'string', nullable: true },
        address: { type: 'string', nullable: true },
      },
    },
  })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateData: Prisma.CompanyUpdateInput,
  ): Promise<Company> {
    return this.companiesService.update(+id, updateData);
  }



  

  @ApiOperation({ summary: 'Delete a company by ID' })
  @ApiParam({ name: 'id', description: 'ID of the company' })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.companiesService.remove(+id); // No return statement needed
  }

  @ApiOperation({ summary: 'Insert companies using a CSV file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload a CSV file with company data',
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post('insert-many-csv')
  @UseInterceptors(FileInterceptor('file')) // File upload interceptor
  async insert_many_using_csv(@UploadedFile() file: Express.Multer.File,): Promise<{ statusCode: number; message: string }> {
    
    if (!file) {
      return {statusCode: 400,message: 'No file uploaded'};
    }

    try {
      // Call the service to handle CSV insertion
      const companiesInserted: number = await this.companiesService.insert_many_using_csv(file);

      return {statusCode: 201, message: `${companiesInserted} companies inserted successfully from the CSV`,};
    
    } catch (error) {
      console.error('Error processing CSV file:', error);

      return {statusCode: 500,message: 'Error processing CSV file'};
    }
  }
}