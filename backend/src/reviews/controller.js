const prisma = require('../../prisma/prismaClient');

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Cria uma avaliação (usuário autenticado)
 *     tags: [Avaliações]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *               rating:
 *                 type: integer
 *               movieId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Avaliação criada
 *       401:
 *         description: Não autenticado
 */

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