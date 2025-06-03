const express = require('express');
const router = express.Router();
const prisma = require('../../prisma/prismaClient');

router.get('/', async (req, res) => {
  try {
    const genres = await prisma.genre.findMany();
    res.json(genres);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar gêneros" });
  }
});

module.exports = router;