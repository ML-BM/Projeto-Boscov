const express = require('express');
const router = express.Router();
const isAdmin = require('../middlewares/isAdmin');
const movieService = require('./service');

/**
 * @swagger
 * /movies:
 *   get:
 *     summary: Lista todos os filmes
 *     tags: [Filmes]
 *     responses:
 *       200:
 *         description: Lista de filmes
 */

/**
 * @swagger
 * /movies:
 *   post:
 *     summary: Cria um novo filme (apenas ADMIN)
 *     tags: [Filmes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               director:
 *                 type: string
 *               year:
 *                 type: integer
 *               duration:
 *                 type: integer
 *               producer:
 *                 type: string
 *               classification:
 *                 type: string
 *               poster:
 *                 type: string
 *               genreIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       201:
 *         description: Filme criado
 *       400:
 *         description: Erro ao criar filme
 */

// Listar todos os filmes (GET /movies)
router.get('/', async (req, res) => {
    try {
        const movies = await movieService.getAllMovies();
        res.status(200).json(movies);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Buscar um filme por ID (GET /movies/:id)
router.get('/:id', async (req, res) => {
    try {
        const movie = await movieService.getMovieById(req.params.id);
        if (!movie) {
            return res.status(404).json({ error: 'Filme não encontrado' });
        }
        res.status(200).json(movie);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Criar filme (POST /movies, apenas ADMIN)
router.post('/', isAdmin, async (req, res) => {
    try {
        const movie = await movieService.createMovie(req.body);
        res.status(201).json(movie);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Atualizar filme (PUT /movies/:id, apenas ADMIN)
router.put('/:id', isAdmin, async (req, res) => {
    try {
        const movie = await movieService.updateMovie(req.params.id, req.body);
        res.status(200).json(movie);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Excluir filme (DELETE /movies/:id, apenas ADMIN)
router.delete('/:id', isAdmin, async (req, res) => {
    try {
        await movieService.deleteMovie(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;