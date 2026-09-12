const prisma = require("../../lib/prisma");

module.exports = async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ error: "Method not allowed" });
  }
  const slug = Array.isArray(request.query.slug) ? request.query.slug[0] : request.query.slug;
  const book = await prisma.book.findUnique({
    where: { slug },
    include: {
      author: true,
      chapters: { orderBy: { orderIndex: "asc" }, include: { audioTracks: true } }
    }
  });
  if (!book) return response.status(404).json({ error: "Book not found" });
  response.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
  return response.status(200).json({ book });
};
