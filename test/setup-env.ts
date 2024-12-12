const path = require('path');

process.env.DATABASE_URL = `file:${path.resolve(__dirname, '../prisma/test.sqlite')}`;
process.env.PRISMA_SCHEMA = path.resolve(__dirname, '../prisma/schema.test.prisma');

console.log('Test environment loaded with:', {
    DATABASE_URL: process.env.DATABASE_URL,
    PRISMA_SCHEMA: process.env.PRISMA_SCHEMA,
});
