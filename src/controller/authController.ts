// Importa o bcrypt para hash de senha
const bcrypt = require('bcrypt');

// Importa o jwt para gerar o token
const jwt = require('jsonwebtoken');

// Importa o pool de conexão do POstgreSQL
import { DatabaseModel } from '../model/DatabaseModel';


// Define um segredo para assinar o token JWT (armazenar no .env)
const JWT_SECRET = process.env.JWT_SECRET || 'senha_secreta';

// ========= FUNÇÃO DE REGISTRO =============
exports.register = async (req, res) => {
    const {email, senha} = req.body;

    try {
        //verifica se o usuario ja existe no banco
        const usuarioExistente = await pool.query('SELECT * FROM usuario WHERE email = $1', [email]);
        if (usuarioExistente.rows.lengh > 0) {
            return res.status(400).json({mensagem: 'Usuario já existe!'});
        }
        // Gerar um hash da senha
        const hashedSenha = await bcrypt.hash(senha, 10);

        // Insere o novo usuario no banco
        await pool.query('INSERT INTO usuario (email, senha) VALUES ($1, $2)', [email, hashedSenha]);

        res.status(201).json({mensagem: 'usuario reguistrado com sucesso!'});
    } catch (error) {
        console.error(error);
        res.status(500).json({mensagem: 'Erro ao registrar usuario.'});
    }
};


// =========== FUNÇÃO DE LOGIN =============
exports.login = async (req, res) => {
    const {email, senha} = req.body;

    try {
        //Busca o usuario pelo email
        const usuario = await pool.query('SELECT * FROM usuario WHERE email = $1', [email]);
        if (usuario.rows.lengh == 0) {
            return res.status(400).json({mensagem: 'Usuario não encontrado.'});
        }

        //Compara a senha fornecida com a senha hash
        const isMatch = await bcrypt.compare(senha, usuario.rows[0].senha);
        if (!isMatch) {
            return res.status(400).json({mensagem: 'Senha incorreta.'});
        }

        // Gera um token JWT
        const token = jwt.sign({usuarioId: usuario.rows[0].id}, JWT_SECRET, {expiresIn: '1h'});
        res.json({token, mensagem: 'Login bem-sucedido!'});
    } catch (error) {
        console.error(error);
        res.status(500).json({mensagem: 'Erro ao fazer login'});
    }
};


