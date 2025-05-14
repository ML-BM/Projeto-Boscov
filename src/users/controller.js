/*const prisma = require('../../prisma/prismaClient'); // Caminho corrigido para o prismaClient
const { StatusCodes } = require('http-status-codes');

const create = async (req, res) => {
    try {
        const { name, email, password, date_birth } = req.body;

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password,
                date_birth: new Date(date_birth)
            },
        });
        res.status(StatusCodes.CREATED).json(user);
    } catch (error) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Não foi possível criar o usuário" });
    }
};

module.exports = { create };*/