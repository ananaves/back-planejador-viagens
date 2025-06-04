// Importa a conexão com o banco de dados
const pool = require('../config/db');

const Usuario = {

    // ----------------------
    // Criar novo usuário
    // ----------------------
    async criarUsuario(nome, email, senha) {
        const result = await pool.query(
            `INSERT INTO usuarios (nome, email, senha) 
             VALUES ($1, $2, $3) RETURNING *`,
            [nome, email, senha]
        );

        return result.rows[0];
    },

    // ----------------------
    // Buscar usuário por email (para login)
    // ----------------------
    async buscarPorEmail(email) {
        const result = await pool.query(
            `SELECT * FROM usuarios WHERE email = $1`,
            [email]
        );

        return result.rows[0]; // Pode ser undefined se não encontrar
    },

    // ----------------------
    // Buscar usuário por ID (para middlewares ou controllers)
    // ----------------------
    async buscarPorId(id) {
        const result = await pool.query(
            `SELECT * FROM usuarios WHERE id = $1`,
            [id]
        );

        return result.rows[0];
    }

};

module.exports = Usuario;
