// Imports.
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

// Connection pool.
const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const globalForPrisma = global;

export const prisma = globalForPrisma.prisma || new PrismaClient({adapter, log: ['query', 'error', 'warn']});
if (process.env.NODE_ENV !== 'production') { globalForPrisma.prisma = prisma;}
process.on('beforeExit', async () => { await prisma.$disconnect()});
