const prisma = require('../../prisma/prismaClient');

// Função para registrar um novo usuário
const createUser = async (userData) => {
    return await prisma.user.create({
        data: userData,
    });
};

// Função para buscar um usuário pelo email
const findUserByEmail = async (email) => {
    return await prisma.user.findUnique({
        where: { email },
    });
};

// Função para buscar todos os usuários
const findAllUsers = async () => {
    return await prisma.user.findMany();
};

// Função para buscar um usuário pelo ID
const findUserById = async (id) => {
    return await prisma.user.findUnique({
        where: { id: Number(id) },
    });
};

// Função para atualizar um usuário
const updateUserById = async (id, userData) => {
    return await prisma.user.update({
        where: { id: Number(id) },
        data: userData,
    });
};

// Função para remover um usuário
const deleteUserById = async (id) => {
    return await prisma.user.delete({
        where: { id: Number(id) },
    });
};

module.exports = {
    createUser,
    findUserByEmail,
    findAllUsers,
    findUserById,
    updateUserById,
    deleteUserById,
};