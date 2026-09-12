const { PrismaClient } = require("@prisma/client");

const prisma = globalThis.__nahanjaPrisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalThis.__nahanjaPrisma = prisma;

module.exports = prisma;
