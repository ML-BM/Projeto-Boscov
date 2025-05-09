const express = require('express');
const prisma = require('./prisma/prismaClient');
const app = express();

app.use(express.json());

// Rota para criar um novo usuário
app.post('/usuarios', async (req, res) => {
    const { name, nickname, email, password, date_birth, status, user_type } = req.body; // Ajustar os campos
    try {
        const novoUsuario = await prisma.user.create({
            data: {
                name,
                nickname,
                email,
                password,
                date_birth: new Date(date_birth),
                status: status || 'ACTIVE', // Valor padrão caso não seja enviado
                user_type: user_type || 'COMMON' // Valor padrão caso não seja enviado
            }
        });
        res.status(201).json(novoUsuario); // Retornar o usuário completo
    } catch (error) {
        console.error(error); // Logar o erro para debug
        res.status(400).json({ error: 'Erro ao criar usuário.', details: error.message });
    }
});

// Iniciar o servidor
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});