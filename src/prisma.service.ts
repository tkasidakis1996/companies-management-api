import { PrismaClient } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor() {
        const schema = process.env.PRISMA_SCHEMA || './prisma/schema.prisma';
        console.log(`PrismaService using schema: ${schema}`);

        super({
            datasources: {
                db: {
                    url: process.env.DATABASE_URL,
                },
            },
        });
    }
}
