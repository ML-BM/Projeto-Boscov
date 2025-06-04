const jwt = require("jsonwebtoken");
const userSchema = require("./userSchema");
const userService = require("./service");
const prisma = require("../../prisma/prismaClient");
const bcrypt = require("bcrypt");
const SECRET = process.env.JWT_SECRET || 'seuSegredoSuperSecreto';

// Login
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Usuário não encontrado" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Senha inválida" });

    const token = jwt.sign(
      { id: user.id, user_type: user.user_type },
      SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        user_type: user.user_type,
        name: user.name,           // <-- Adicione se quiser mostrar o nome também
        nickname: user.nickname,   // <-- ESSENCIAL para aparecer no frontend!
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao fazer login", details: error.message });
  }
};
module.exports = { login };
// Cadastro
const register = async (req, res) => {
  const { name, nickname, email, password, date_birth, user_type } = req.body;
  try {
    userSchema.parse(req.body); // <-- Isso valida os dados!
    const hashedPassword = await bcrypt.hash(password, 10);

    // Só aceita ADMIN se explicitamente enviado e válido
    let finalUserType = "COMMON";
    if (user_type && user_type === "ADMIN") {
      finalUserType = "ADMIN";
    }

    const user = await prisma.user.create({
      data: {
        name,
        nickname,
        email,
        password: hashedPassword,
        date_birth: date_birth ? new Date(date_birth) : null,
        user_type: finalUserType,
      },
    });
    res
      .status(201)
      .json({
        message: "Usuário cadastrado com sucesso!",
        user: {
          id: user.id,
          email: user.email,
          user_type: user.user_type,
          name: user.name,           // <-- Adicione se quiser mostrar o nome também
          nickname: user.nickname,   // <-- ESSENCIAL para aparecer no frontend!
        },
      });
  } catch (error) {
    return res.status(400).json({ error: error.errors ? error.errors[0].message : error.message });
  }
};

module.exports = { register };
// Listar todos os usuários
const getAllUsers = async (req, res) => {
  try {
    const users = await userService.findAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erro ao buscar usuários", details: error.message });
  }
};

// Buscar usuário por ID
const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userService.findUserById(id);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erro ao buscar usuário", details: error.message });
  }
};

// Atualizar usuário
const updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const userData = userSchema.partial().parse(req.body);
    const updatedUser = await userService.updateUserById(id, userData);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    if (error.name === "ZodError") {
      res
        .status(400)
        .json({ error: "Erro de validação", details: error.errors });
    } else {
      res
        .status(500)
        .json({ error: "Erro ao atualizar usuário", details: error.message });
    }
  }
};

// Excluir usuário
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await userService.deleteUserById(id);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erro ao excluir usuário", details: error.message });
  }
};

module.exports = {
  login,
  register,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
