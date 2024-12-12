import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

// Global variable for the app instance
let app: INestApplication;

async function setupTestEnvironment(): Promise<INestApplication> {
    
  try {
      console.log("Setting up the test environment...");
      console.log("Environment Variables:", {
          DATABASE_URL: process.env.DATABASE_URL,
          PRISMA_SCHEMA: process.env.PRISMA_SCHEMA,
      });

      const moduleFixture = await Test.createTestingModule({
          imports: [AppModule],
      }).compile();

      const app = moduleFixture.createNestApplication();
      
      await app.init();

      console.log("setupTestEnvironment() initialized app successfully");
      
      return app;
    
    } catch (error) {
        
        console.error("Error during test environment setup:", error);
        
        throw error;
    }
}

// Test function for creating a company
async function testCreateCompany() {

  console.log("Inside the testCreateCompany()")


  const response = await request(app.getHttpServer())
    .post('/companies')
    .send({
      name: 'Test Company',
      vatNumber: '123456789',
      address: 'Test Address',
    })
    .expect(201);

  expect(response.body).toMatchObject({
    id: expect.any(Number),
    name: 'Test Company',
    vatNumber: '123456789',
    address: 'Test Address',
  });
}

// Test function for getting all companies
async function testFindAllCompanies() {
  const response = await request(app.getHttpServer())
    .get('/companies')
    .expect(200);

  expect(response.body).toBeInstanceOf(Array);
}

// Test function for getting a company by ID
async function testFindCompanyById() {
  const response = await request(app.getHttpServer())
    .get('/companies/1')
    .expect(200);

  expect(response.body).toMatchObject({
    id: 1,
    name: expect.any(String),
    vatNumber: expect.any(String),
    address: expect.any(String),
  });
}

// Test function for updating a company
async function testUpdateCompany() {
  const response = await request(app.getHttpServer())
    .put('/companies/1')
    .send({ name: 'Updated Company' })
    .expect(200);

  expect(response.body).toMatchObject({
    id: 1,
    name: 'Updated Company',
  });
}

// Test function for deleting a company
async function testDeleteCompany() {
  await request(app.getHttpServer()).delete('/companies/1').expect(200);
}

// Test function for inserting companies using CSV
async function testInsertCompaniesFromCsv() {
  const csvFile = Buffer.from(
    'name,vatNumber,address\nCompany A,111,Address A\nCompany B,222,Address B',
  );

  const response = await request(app.getHttpServer())
    .post('/companies/insert-many-csv')
    .attach('file', csvFile, 'test.csv')
    .expect(201);

  expect(response.body).toMatchObject({
    statusCode: 201,
    message: '2 companies inserted successfully from the CSV',
  });
}

// Main test suite
describe('CompaniesController (e2e)', () => {
  
  beforeAll(async () => {
    console.log("Initializing test environment...");
    app = await setupTestEnvironment();
    console.log("App initialized:", app ? "successfully created" : "undefined");
  });


  afterAll(async () => {
    if (app) {
        console.log("Closing app...");
        await app.close();
    } else {
        console.error("App is undefined during teardown");
    }
  });

  it('/companies (POST) should create a company', testCreateCompany);
  it('/companies (GET) should return all companies', testFindAllCompanies);
  it('/companies/:id (GET) should return a single company', testFindCompanyById);
  it('/companies/:id (PUT) should update a company', testUpdateCompany);
  it('/companies/:id (DELETE) should delete a company', testDeleteCompany);
  it('/companies/insert-many-csv (POST) should insert companies from CSV', testInsertCompaniesFromCsv);
});
