import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { DatabaseModel } from '../model/DatabaseModel';

const SECRET = 'bananinha';
const database = new DatabaseModel().pool;

interface JwtPayload {
    id: number;
    nome: string;
    username: string;
    exp: number;
}

export class Auth {

    static async validacaoUsuario(req: Request, res: Response): Promise<any> {
        const { username, senha } = req.body;
        const querySelectUser = `SELECT id_usuario, nome, username, senha FROM usuarios WHERE username=$1 AND senha=$2;`;

        try {
            const queryResult = await database.query(querySelectUser, [username, senha]);
            if (queryResult.rowCount != 0) {
                const usuario = {
                    id_usuario: queryResult.rows[0].id_usuario,
                    nome: queryResult.rows[0].nome,
                    username: queryResult.rows[0].username
                }
                const tokenUsuario = Auth.generateToken(parseInt(usuario.id_usuario), usuario.nome, usuario.username);
                return res.status(200).json({ auth: true, token: tokenUsuario, usuario: usuario });
            } else {
                return res.status(401).json({ auth: false, token: null, message: "Usuário e/ou senha incorretos" });
            }
        } catch (error) {
            console.log(`Erro no modelo: ${error}`);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    static generateToken(id: number, nome: string, username: string) {
        return jwt.sign({ id, nome, username }, SECRET, { expiresIn: '1h' });
    }

    static verifyToken(req: Request, res: Response, next: NextFunction): void {
        const token = req.headers['x-access-token'] as string;

        if (!token) {
            res.status(401).json({ message: "Token não informado", auth: false });
            return;
        }

        try {
            const decoded = jwt.verify(token, SECRET) as JwtPayload;

            const { exp, id } = decoded;
            const currentTime = Math.floor(Date.now() / 1000);

            if (!exp || !id) {
                res.status(401).json({ message: "Token inválido, faça o login", auth: false });
                return;
            }

            if (currentTime > exp) {
                res.status(401).json({ message: "Token expirado, faça o login novamente", auth: false });
                return;
            }

            req.body.userId = id;
            next();
        } catch (err: any) {
            if (err.name === 'TokenExpiredError') {
                res.status(401).json({ message: "Token expirado, faça o login novamente", auth: false });
            } else {
                res.status(401).json({ message: "Token inválido, faça o login", auth: false });
            }
        }
    }
}
