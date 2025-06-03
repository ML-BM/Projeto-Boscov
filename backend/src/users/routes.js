const express = require('express');
const router = express.Router();
const { login, register, getAllUsers, getUserById, updateUser, deleteUser } = require('./controller');
const prisma = require('../../prisma/prismaClient');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'seuSegredoSuperSecreto';

// Middleware para autenticar e decodificar o token JWT
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

// Rota de login
router.post('/login', login);

// Rota de cadastro
router.post('/register', register);

// Rota para listar todos os usuários
router.get('/users', getAllUsers);

// Rota para buscar um usuário por ID
router.get('/users/:id', getUserById);

// Rota para atualizar um usuário
router.put('/users/:id', updateUser);

// Rota para excluir um usuário
router.delete('/users/:id', deleteUser);

// Rota para pegar o perfil do usuário logado
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, nickname: true, email: true, user_type: true }
    });
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar perfil', details: error.message });
  }
});

module.exports = router;