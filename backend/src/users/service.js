const prisma = require('../../prisma/prismaClient');

// Criar usuário
const createUser = async (userData) => {
    return await prisma.user.create({ data: userData });
};

// Buscar usuário por email
const findUserByEmail = async (email) => {
    return await prisma.user.findUnique({ where: { email } });
};

// Buscar todos os usuários
const findAllUsers = async () => {
    return await prisma.user.findMany();
};

// Buscar usuário por ID
const findUserById = async (id) => {
    return await prisma.user.findUnique({ where: { id: parseInt(id) } });
};

// Atualizar usuário por ID
const updateUserById = async (id, userData) => {
    return await prisma.user.update({
        where: { id: parseInt(id) },
        data: userData,
    });
};

// Excluir usuário por ID
const deleteUserById = async (id) => {
    return await prisma.user.delete({ where: { id: parseInt(id) } });
};

module.exports = {
    createUser,
    findUserByEmail,
    findAllUsers,
    findUserById,
    updateUserById,
    deleteUserById
};