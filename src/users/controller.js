const prisma = require('../../prisma/prismaClient'); // Caminho corrigido para o prismaClient
const { StatusCodes } = require('http-status-codes');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userSchema = require('./userSchema'); // Importar o schema de validação

// Função para registrar um usuário
const register = async (req, res) => {
    try {
        // Validar os dados de entrada usando o userSchema
        const validatedData = userSchema.parse(req.body);

        const { name, nickname, email, password, date_birth, user_type } = validatedData;

        console.log(nickname + " " + user_type)

        // Verificar se o email já está em uso
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(StatusCodes.CONFLICT).json({ error: 'Email já está em uso.' });
        }

        // Hash da senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Criar o usuário
        const user = await prisma.user.create({
            data: {
                name,
                nickname,
                email,
                password: hashedPassword,
                date_birth: new Date(date_birth),
                user_type: user_type || 'COMMON', // Valor padrão para usuários comuns
            },
        });

        res.status(StatusCodes.CREATED).json({ message: 'Usuário registrado com sucesso.', user });
    } catch (error) {
        if (error.name === 'ZodError') {
            // Retornar erros de validação do Zod
            return res.status(StatusCodes.BAD_REQUEST).json({ error: error.errors });
        }
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Erro ao registrar o usuário.' });
    }
};

// Função para login de usuário
const login = async (req, res) => {
    try {
        // Validar os dados de entrada (somente email e password são necessários para login)
        const loginSchema = userSchema.pick({ email: true, password: true });
        const validatedData = loginSchema.parse(req.body);

        const { email, password } = validatedData;

        // Verificar se o usuário existe
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Credenciais inválidas.' });
        }

        // Verificar a senha
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Credenciais inválidas.' });
        }

        // Gerar token JWT
        const token = jwt.sign(
            { id: user.id, user_type: user.user_type },
            process.env.JWT_SECRET || 'default_secret', // Use uma variável de ambiente para o segredo
            { expiresIn: '1h' }
        );

        res.status(StatusCodes.OK).json({ message: 'Login bem-sucedido.', token });
    } catch (error) {
        if (error.name === 'ZodError') {
            // Retornar erros de validação do Zod
            return res.status(StatusCodes.BAD_REQUEST).json({ error: error.errors });
        }
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Erro ao fazer login.' });
    }
};

module.exports = { register, login };