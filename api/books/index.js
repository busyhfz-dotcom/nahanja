const prisma = require("../../lib/prisma");

module.exports = async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ error: "Method not allowed" });
  }
  const books = await prisma.book.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { id: true, name: true } },
      _count: { select: { chapters: true } }
    }
  });
  response.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
  return response.status(200).json({ books });
};
