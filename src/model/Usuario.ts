import { Request, Response, NextFunction } from 'express';
import { DatabaseModel } from './DatabaseModel';

// Armazena o pool de conexões com o banco de dados
const database = new DatabaseModel().pool;

/**
 * Classe que representa um Usuário
 */
export class Usuario {


    
  static async todos(req: Request, res: Response) {
    // sua lógica para buscar todos os usuários no banco
    res.json({ message: "Lista de usuários" });
  }
    private id: number = 0;
    private nome: string;
    private email: string;
    private senha: string;

    /**
     * Construtor da classe Usuario
     * 
     * @param nome Nome do usuário
     * @param email Email do usuário
     * @param senha Senha do usuário
     */
    constructor(nome: string, email: string, senha: string) {
        this.nome = nome;
        this.email = email;
        this.senha = senha;
    }

    /* Getters e Setters */

    public getId(): number {
        return this.id;
    }

    public setId(id: number): void {
        this.id = id;
    }

    public getNome(): string {
        return this.nome;
    }

    public setNome(nome: string): void {
        this.nome = nome;
    }

    public getEmail(): string {
        return this.email;
    }

    public setEmail(email: string): void {
        this.email = email;
    }

    public getSenha(): string {
        return this.senha;
    }

    public setSenha(senha: string): void {
        this.senha = senha;
    }

    static async listarUsuarios(): Promise<Array<Usuario> | null> {
    const listaDeUsuarios: Array<Usuario> = [];

    try {
        // Consulta para buscar todos os usuários ativos (exemplo com status_usuario)
        const querySelectUsuario = `SELECT * FROM usuarios`;

        // Executa a consulta no banco
        const respostaBD = await database.query(querySelectUsuario);

        // Para cada linha retornada, cria um objeto Usuario
        respostaBD.rows.forEach((linha) => {
            const novoUsuario = new Usuario(
                linha.nome,
                linha.email,
                linha.senha
            );

            // Atribui o ID do usuário (supondo que a coluna seja id_usuario)
            novoUsuario.setId(linha.id_usuario);
            // Se tiver campo status_usuario, você pode criar e setar esse atributo também, se quiser

            // Adiciona o objeto à lista
            listaDeUsuarios.push(novoUsuario);
        });

        // Retorna a lista de usuários
        return listaDeUsuarios;

    } catch (error) {
        console.log('Erro ao buscar lista de usuários. Verifique os logs para mais detalhes.');
        console.log(error);
        return null;
    }
}


    /**
     * Cria um novo usuário no banco de dados
     * 
     * @param usuario Objeto do tipo Usuario
     * @returns Retorna true se o cadastro for bem-sucedido, false caso contrário
     */
    static async criarUsuario(usuario: Usuario): Promise<boolean> {
        try {
            const query = `
                INSERT INTO usuarios (nome, email, senha)
                VALUES ($1, $2, $3) RETURNING id
            `;
            const result = await database.query(query, [usuario.getNome(), usuario.getEmail(), usuario.getSenha()]);

            if (result.rowCount !== 0) {
                usuario.setId(result.rows[0].id);
                console.log(`Usuário criado com sucesso! ID: ${usuario.getId()}`);
                return true;
            }

            return false;
        } catch (error) {
            console.log('Erro ao criar usuário:', error);
            return false;
        }
    }

static async atualizarUsuario(usuario: Usuario): Promise<boolean> {
    let queryResult = false;

    try {
        const queryAtualizarUsuario = `
            UPDATE usuarios SET
                nome = '${usuario.getNome()}',
                email = '${usuario.getEmail()}',
                senha = '${usuario.getSenha()}'
            WHERE id = ${usuario.getId()}
        `;

        await database.query(queryAtualizarUsuario)
            .then(result => {
                if (result.rowCount != 0) {
                    queryResult = true;
                }
            });

        return queryResult;
    } catch (error) {
        console.log(`Erro na consulta: ${error}`);
        return queryResult;
    }
}


static async removerUsuario(id_usuario: number): Promise<boolean> {
    let queryResult = false;

    try {
        // Aqui você pode adaptar caso tenha tabelas relacionadas, por exemplo, desativar dados vinculados
        // Exemplo fictício: atualizar algo relacionado ao usuário
        const queryUpdateRelacionado = `
            UPDATE outra_tabela
            SET status = FALSE
            WHERE id_usuario = ${id_usuario}
        `;
        await database.query(queryUpdateRelacionado);

        // Atualiza o status do usuário para "inativo" no banco de dados
        const queryDeleteUsuario = `
            UPDATE usuarios
            SET status_usuario = FALSE
            WHERE id = ${id_usuario}
        `;

        const result = await database.query(queryDeleteUsuario);

        if (result.rowCount != 0) {
            queryResult = true;
        }

        return queryResult;
    } catch (error) {
        console.log(`Erro na consulta: ${error}`);
        return queryResult;
    }
}



    /**
     * Busca um usuário por email
     * 
     * @param email Email do usuário a ser buscado
     * @returns Retorna um objeto Usuario ou null
     */
    static async buscarPorEmail(email: string): Promise<Usuario | null> {
        try {
            const query = `SELECT * FROM usuarios WHERE email = $1`;
            const result = await database.query(query, [email]);

            if (result.rows.length > 0) {
                const userData = result.rows[0];
                const usuario = new Usuario(userData.nome, userData.email, userData.senha);
                usuario.setId(userData.id);
                return usuario;
            }

            return null;
        } catch (error) {
            console.log('Erro ao buscar usuário por email:', error);
            return null;
        }
    }

    /**
     * Busca um usuário por ID
     * 
     * @param id ID do usuário a ser buscado
     * @returns Retorna um objeto Usuario ou null
     */
    static async buscarPorId(id: number): Promise<Usuario | null> {
        try {
            const query = `SELECT * FROM usuarios WHERE id = $1`;
            const result = await database.query(query, [id]);

            if (result.rows.length > 0) {
                const userData = result.rows[0];
                const usuario = new Usuario(userData.nome, userData.email, userData.senha);
                usuario.setId(userData.id);
                return usuario;
            }

            return null;
        } catch (error) {
            console.log('Erro ao buscar usuário por ID:', error);
            return null;
        }
    }
}
