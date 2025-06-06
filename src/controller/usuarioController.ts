import { Request, Response } from "express";
import { Usuario } from "../model/Usuario";

interface UsuarioDTO {
  nome: string;
  email: string;
  senha: string;
  telefone?: string;        // Você pode incluir se o model suportar
  dataNascimento?: Date;    // Também se suportar no model
}

export class UsuarioController {

static async lista(req: Request, res: Response): Promise<any> {
  try {
    // Acessa a função de listar os usuários e armazena o resultado
    const listaDeUsuarios = await Usuario.listarUsuarios();

    // Retorna a lista de usuários para quem fez a requisição
    return res.status(200).json(listaDeUsuarios);
  } catch (error) {
    // Lança uma mensagem de erro no console
    console.error('Erro ao acessar a listagem de usuários', error);

    // Retorna uma mensagem de erro para quem fez a requisição
    return res.status(400).json({ mensagem: "Não foi possível acessar a listagem de usuários" });
  }
}


  static async novo(req: Request, res: Response): Promise<any> {
    try {
      const usuarioRecebido: UsuarioDTO = req.body;

      const novoUsuario = new Usuario(
        usuarioRecebido.nome,
        usuarioRecebido.email,
        usuarioRecebido.senha
      );

      // Corrigi o nome do método para criar usuário (conforme model)
      const respostaClasse = await Usuario.criarUsuario(novoUsuario);

      if (respostaClasse) {
        return res.status(201).json({ mensagem: "Usuário cadastrado com sucesso!" });
      } else {
        return res.status(400).json({ mensagem: "Erro ao cadastrar o usuário. Contate o administrador." });
      }
    } catch (error) {
      console.error(`Erro ao cadastrar um usuário. ${error}`);
      return res.status(400).json({ mensagem: "Não foi possível cadastrar o usuário. Contate o administrador." });
    }
  }

  static async remover(req: Request, res: Response): Promise<any> {
    try {
      const idUsuario = parseInt(req.query.idUsuario as string);

      // Corrigi o nome do método para remover usuário
      const result = await Usuario.removerUsuario(idUsuario);

      if (result) {
        return res.status(200).json("Usuário removido com sucesso");
      } else {
        return res.status(400).json("Erro ao deletar o usuário");
      }
    } catch (error) {
      console.error("Erro ao remover o usuário", error);
      return res.status(500).send("Erro interno");
    }
  }

  static async atualizar(req: Request, res: Response): Promise<any> {
    try {
      const dadosRecebidos: UsuarioDTO = req.body;

      const usuario = new Usuario(
        dadosRecebidos.nome,
        dadosRecebidos.email,
        dadosRecebidos.senha
      );

      // Corrigi o método setter do ID para o padrão do seu model (setId)
      usuario.setId(parseInt(req.query.idUsuario as string));

      // Corrigi o nome do método para atualizar usuário
      if (await Usuario.atualizarUsuario(usuario)) {
        return res.status(200).json({ mensagem: "Cadastro atualizado com sucesso!" });
      } else {
        return res.status(400).json("Não foi possível atualizar o usuário no banco de dados");
      }
    } catch (error) {
      console.error(`Erro no modelo: ${error}`);
      return res.status(500).json({ mensagem: "Erro ao atualizar o usuário." });
    }
  }
}

export default UsuarioController;
