const prisma = require("../lib/prisma");

module.exports = async function handler(_request, response) {
  try {
    await prisma.$queryRawUnsafe("SELECT 1");
    response.setHeader("Cache-Control", "no-store");
    return response.status(200).json({ status: "ok", database: "connected" });
  } catch (error) {
    console.error("Database health check failed", error);
    return response.status(503).json({ status: "error", database: "unavailable" });
  }
};
