const prisma = require('../../prisma/prismaClient');

// Criar avaliação
const createReview = async (req, res) => {
  const { comment, rating, movieId } = req.body;
  const userId = req.user.id; // Pega do token JWT
  try {
    const review = await prisma.review.create({
      data: {
        comment,
        rating: Number(rating),
        movieId: Number(movieId),
        userId: Number(userId),
      }
    });
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Listar avaliações de um filme
const getReviewsByMovie = async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { movieId: Number(req.params.movieId) },
      include: { user: { select: { nickname: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(reviews);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createReview, getReviewsByMovie };