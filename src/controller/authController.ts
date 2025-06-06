import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { DatabaseModel } from "../model/DatabaseModel";

const JWT_SECRET = process.env.JWT_SECRET || "senha_secreta";

// Cria instância da classe para acessar o pool
const database = new DatabaseModel();

export class AuthController {
    
    static async register(req: Request, res: Response): Promise<any> {
        const { email, senha } = req.body;

        try {
            // Agora uso database.pool.query, e não DatabaseModel.query
            const usuarioExistente = await database.pool.query('SELECT * FROM usuario WHERE email = $1', [email]);

            if (usuarioExistente.rows.length > 0) {
                return res.status(400).json({ mensagem: "Usuário já existe!" });
            }

            const hashedSenha = await bcrypt.hash(senha, 10);

            await database.pool.query(
                'INSERT INTO usuario (email, senha) VALUES ($1, $2)',
                [email, hashedSenha]
            );

            return res.status(201).json({ mensagem: "Usuário registrado com sucesso!" });

        } catch (error) {
            console.error("Erro no registro:", error);
            return res.status(500).json({ mensagem: "Erro ao registrar usuário." });
        }
    }

    static async login(req: Request, res: Response): Promise<any> {
        const { email, senha } = req.body;

        try {
            const usuario = await database.pool.query('SELECT * FROM usuario WHERE email = $1', [email]);

            if (usuario.rows.length === 0) {
                return res.status(400).json({ mensagem: "Usuário não encontrado." });
            }

            const isMatch = await bcrypt.compare(senha, usuario.rows[0].senha);
            if (!isMatch) {
                return res.status(400).json({ mensagem: "Senha incorreta." });
            }

            const token = jwt.sign(
                { usuarioId: usuario.rows[0].id },
                JWT_SECRET,
                { expiresIn: "1h" }
            );

            return res.status(200).json({
                mensagem: "Login bem-sucedido!",
                token
            });

        } catch (error) {
            console.error("Erro no login:", error);
            return res.status(500).json({ mensagem: "Erro ao fazer login." });
        }
    }
}
