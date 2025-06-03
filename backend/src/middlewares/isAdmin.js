const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'seuSegredoSuperSecreto';

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Token não fornecido.' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, SECRET);
        if (!decoded.user_type) {
            return res.status(403).json({ error: 'Tipo de usuário não informado no token.' });
        }
        if (decoded.user_type !== 'ADMIN') {
            return res.status(403).json({ error: 'Acesso permitido apenas para administradores.' });
        }
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Token inválido ou expirado.' });
    }
};