const express = require('express');
const router = express.Router();
const userController = require('./controller');

// Rota para registrar um usuário (admin ou comum)
router.post('/', userController.register);

// Rota para listar todos os usuários 
router.get('/', userController.getAllUsers);

// Rota para listar um usuário
router.get('/:id', userController.getUserById);

// Rota para atualizar os usuários
router.put('/:id', userController.updateUser);

// Rota para remover um usuário
router.delete('/:id', userController.deleteUser);

// Rota para login de usuário (admin ou comum)
router.post('/login', userController.login);

module.exports = router;