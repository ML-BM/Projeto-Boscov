const express = require('express');
const router = express.Router();
const { createReview, getReviewsByMovie } = require('./controller');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'seuSegredoSuperSecreto';

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

// Middleware de autenticação
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Token não fornecido.' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
}

// Criar avaliação (usuário autenticado)
router.post('/', authenticateToken, createReview);

// Listar avaliações de um filme
router.get('/movie/:movieId', getReviewsByMovie);

module.exports = router;