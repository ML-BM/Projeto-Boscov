const prisma = require('../../prisma/prismaClient');

// Listar todos os filmes
const getAllMovies = async () => {
    return await prisma.movie.findMany();
};

// Buscar um filme pelo ID
const getMovieById = async (id) => {
    return await prisma.movie.findUnique({
        where: { id: parseInt(id) }
    });
};

// Criar um novo filme (mantido igual)
const createMovie = async (movieData) => {
  const { genreIds, ...movieFields } = movieData;
  return await prisma.movie.create({
    data: {
      ...movieFields,
      genreid: {
        create: genreIds.map(genreId => ({
          genre: { connect: { id: genreId } }
        }))
      }
    }
  });
};

// Atualizar um filme
const updateMovie = async (id, movieData) => {
    const { genreIds, ...movieFields } = movieData;

    // Converta year e duration para número
    const data = {
        ...movieFields,
        year: Number(movieFields.year),
        duration: Number(movieFields.duration),
    };

    // Atualizar gêneros: remove todos e adiciona os novos
    await prisma.movieGenre.deleteMany({ where: { movieId: parseInt(id) } });
    if (genreIds && Array.isArray(genreIds)) {
        await prisma.movieGenre.createMany({
            data: genreIds.map(genreId => ({
                movieId: parseInt(id),
                genreId: genreId
            }))
        });
    }

    return await prisma.movie.update({
        where: { id: parseInt(id) },
        data
    });
};

// Excluir um filme
const deleteMovie = async (id) => {
    // Remove todos os relacionamentos de gêneros desse filme
    await prisma.movieGenre.deleteMany({ where: { movieId: parseInt(id) } });
    // Se houver outras tabelas relacionadas (ex: avaliações), delete aqui também

    // Agora pode deletar o filme
    return await prisma.movie.delete({
        where: { id: parseInt(id) }
    });
};

module.exports = {
    getAllMovies,
    getMovieById,
    createMovie,
    updateMovie,
    deleteMovie
};