const movieService = require('./service');

// Listar todos os filmes
const getAllMovies = async (req, res) => {
    try {
        const movies = await movieService.getAllMovies();
        res.status(200).json(movies);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Buscar filme por ID
const getMovieById = async (req, res) => {
    try {
        const movie = await movieService.getMovieById(req.params.id);
        if (!movie) {
            return res.status(404).json({ error: 'Filme não encontrado' });
        }
        res.status(200).json(movie);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Criar filme (verifica se é admin)
const createMovie = async (req, res) => {
    try {
        if (!req.user || req.user.user_type !== 'ADMIN') {
            return res.status(403).json({ error: "Apenas administradores podem adicionar filmes." });
        }
        const movie = await movieService.createMovie(req.body);
        res.status(201).json(movie);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Atualizar filme
const updateMovie = async (req, res) => {
    try {
        const movie = await movieService.updateMovie(req.params.id, req.body);
        res.status(200).json(movie);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Excluir filme
const deleteMovie = async (req, res) => {
    try {
        await movieService.deleteMovie(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    getAllMovies,
    getMovieById,
    createMovie,
    updateMovie,
    deleteMovie
};