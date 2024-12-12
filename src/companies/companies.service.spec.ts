import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesService } from './companies.service';
import { CompaniesDbService } from './companies-db.service';
import { Company } from '@prisma/client';
import { Readable } from 'stream';

// global scope //

// Define mock dependencies and variables

let companiesService: CompaniesService;

let dbServiceMock: Partial<CompaniesDbService>;

// Run the tests
RunTestsForCompaniesService();

//

// Describe function to group the tests
function RunTestsForCompaniesService() {
  
  describe('These tests test the functionality of the CompaniesService', () => {
    
    beforeEach(async () => {await setupTestEnvironment();});

    afterEach(() => {cleanupMocks();});

    // Run the tests
    it('should be defined', testServiceDefinition);
    it('should create a company', testCreateCompany);
    it('should find all companies', testFindAllCompanies);
 	it('should find a company by ID', testFindCompanyById);
	it('should update a company', testUpdateCompany);
	it('should delete a company', testDeleteCompany);
	it('should insert companies utilizing a csv', testInsertManyUsingCsv);
  });
}

// Setup function to configure the testing environment
async function setupTestEnvironment() {
  
  dbServiceMock = {createCompany: jest.fn(), 
  getAllCompanies: jest.fn(),
  getCompanyById: jest.fn(), 
  updateCompany: jest.fn(), 
  deleteCompany: jest.fn()};

  const module: TestingModule = await Test.createTestingModule({providers: [CompaniesService, {provide: CompaniesDbService, useValue: dbServiceMock}]}).compile();

  companiesService = module.get<CompaniesService>(CompaniesService);
}

// Cleanup function to reset mocks after each test
function cleanupMocks() {
  
  jest.clearAllMocks();

}

// Test case: Ensure the service is defined
function testServiceDefinition() {
  expect(companiesService).toBeDefined();
}

// Test case: Test creating a company
async function testCreateCompany() {
  
  const mockCompany = {id: 1, name: 'Test Company', vatNumber: '123456789', address: 'Test Street'};

  // Mock the createCompany method
  (dbServiceMock.createCompany as jest.Mock).mockResolvedValue(mockCompany);

  const companyData = { name: 'Test Company', vatNumber: '123456789', address: 'Test Street' };
  
  const result = await companiesService.create(companyData);

  // Assertions
  expect(dbServiceMock.createCompany).toHaveBeenCalledWith(companyData);
  
  expect(result).toEqual(mockCompany);
}

// Test case: Test finding all companies
async function testFindAllCompanies() {
  
  const mockCompanies = [{ id: 1, name: 'Company A', vatNumber: '111', address: 'Address A' },{ id: 2, name: 'Company B', vatNumber: '222', address: 'Address B' }];

  // Mock the getAllCompanies method
  (dbServiceMock.getAllCompanies as jest.Mock).mockResolvedValue(mockCompanies);

  const result = await companiesService.findAll();

  // Assertions
  expect(dbServiceMock.getAllCompanies).toHaveBeenCalled();
  expect(result).toEqual(mockCompanies);
}

// Test case: Find a company by ID
async function testFindCompanyById() {
  
  const mockCompany: Company = {id: 1, name: 'Company A', vatNumber: '111', address: 'Address A'};

  (dbServiceMock.getCompanyById as jest.Mock).mockResolvedValue(mockCompany);

  const result = await companiesService.findOne(1);

  expect(dbServiceMock.getCompanyById).toHaveBeenCalledWith(1);
  expect(result).toEqual(mockCompany);
}

// Test case: Update a company
async function testUpdateCompany() {
  
  const mockUpdatedCompany: Company = {id: 1, name: 'Updated Company', vatNumber: '123456789', address: 'Updated Address'};

  const updateData = { name: 'Updated Company', address: 'Updated Address'};

  // Mock the updateCompany method
  (dbServiceMock.updateCompany as jest.Mock).mockResolvedValue(mockUpdatedCompany);

  const result = await companiesService.update(1, updateData);

  // Assertions
  expect(dbServiceMock.updateCompany).toHaveBeenCalledWith(1, updateData);
  expect(result).toEqual(mockUpdatedCompany);
}

// Test case: Delete a company
async function testDeleteCompany() {
  
  const mockDeletedCompany: Company = {id: 1, name: 'Deleted Company', vatNumber: '123456789', address: 'Deleted Address'};

  (dbServiceMock.deleteCompany as jest.Mock).mockResolvedValue(mockDeletedCompany);

  const result = await companiesService.remove(1);

  expect(dbServiceMock.deleteCompany).toHaveBeenCalledWith(1);
  expect(result).toEqual(mockDeletedCompany);
}

// Test case: Insert many using CSV
async function testInsertManyUsingCsv() {
  const mockFile: Express.Multer.File = {
    buffer: Buffer.from(
      'name,vatNumber,address\nCompany A,123456789,Address A\nCompany B,987654321,Address B'
    ),
    fieldname: 'file',
    originalname: 'test.csv',
    encoding: '7bit',
    mimetype: 'text/csv',
    size: 1024,
    destination: '',
    filename: '',
    path: '',
    stream: Readable.from([]), // Provide an empty readable stream
  };

  const mockCompanies = [
    { name: 'Company A', vatNumber: '123456789', address: 'Address A' },
    { name: 'Company B', vatNumber: '987654321', address: 'Address B' },
  ];

  // Simulate successful insertion for each company
  (dbServiceMock.createCompany as jest.Mock).mockResolvedValueOnce({ id: 1, ...mockCompanies[0] });
  (dbServiceMock.createCompany as jest.Mock).mockResolvedValueOnce({ id: 2, ...mockCompanies[1] });

  const result = await companiesService.insert_many_using_csv(mockFile);

  // Assertions
  expect(dbServiceMock.createCompany).toHaveBeenCalledTimes(2);
  expect(dbServiceMock.createCompany).toHaveBeenCalledWith(mockCompanies[0]);
  expect(dbServiceMock.createCompany).toHaveBeenCalledWith(mockCompanies[1]);

  expect(result).toEqual(2); // Both companies inserted successfully
}