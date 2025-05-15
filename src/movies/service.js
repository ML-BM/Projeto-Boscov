const prisma = require('../../prisma/prismaClient');

// Função para listar todos os filmes
const getAllMovies = async () => {
    return await prisma.movie.findMany();
};

// Função para buscar um filme pelo ID
const getMovieById = async (id) => {
    return await prisma.movie.findUnique({ where: { id: Number(id) } });
};

// Função para criar um novo filme
const createMovie = async (movieData) => {
    return await prisma.movie.create({ data: movieData });
};

// Função para excluir um filme pelo ID
const deleteMovie = async (id) => {
    return await prisma.movie.delete({ where: { id: Number(id) } });
};

module.exports = { 
    getAllMovies, 
    getMovieById, 
    createMovie, 
    deleteMovie 
};