import { Request, Response } from "express";
import { DatabaseModel } from "../model/DatabaseModel";
import { Roteiro } from "../model/Roteiro";

// Interface para os dados do roteiro
interface RoteiroDTO {
  cidade_partida: string;
  cidade_destino: string;
  data_ida: Date;
  data_volta: Date;
  distancia: number;
  tempo_estimado: string;
  orcamento: number;
}

// Instância do database para acesso ao pool
const database = new DatabaseModel();

export class RoteiroController {

static async lista(req: Request, res: Response): Promise<any> {
    try {
      // Acessa a função de listar os roteiros e armazena o resultado
      const listaDeRoteiros = await Roteiro.listarRoteiros();

      // Retorna a lista de roteiros para quem fez a requisição
      return res.status(200).json(listaDeRoteiros);
    } catch (error) {
      // Lança uma mensagem de erro no console
      console.error('Erro ao acessar a listagem de roteiros', error);

      // Retorna uma mensagem de erro para quem fez a requisição
      return res.status(400).json({ mensagem: "Não foi possível acessar a listagem de roteiros" });
    }
  }

  static async novo(req: Request, res: Response): Promise<any> {
    try {
      const dados: RoteiroDTO = req.body;
      const usuario_id = (req as any).usuarioId;

      const resultado = await database.pool.query(
        `INSERT INTO roteiros 
         (usuario_id, cidade_partida, cidade_destino, data_ida, data_volta, distancia, tempo_estimado, orcamento) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [
          usuario_id,
          dados.cidade_partida,
          dados.cidade_destino,
          dados.data_ida,
          dados.data_volta,
          dados.distancia,
          dados.tempo_estimado,
          dados.orcamento
        ]
      );

      if (resultado.rows.length > 0) {
        return res.status(201).json({ mensagem: "Roteiro criado com sucesso!", roteiro: resultado.rows[0] });
      } else {
        return res.status(400).json({ mensagem: "Erro ao cadastrar o roteiro. Contate o administrador." });
      }
    } catch (error) {
      console.error(`Erro ao cadastrar roteiro. ${error}`);
      return res.status(400).json({ mensagem: "Não foi possível cadastrar o roteiro. Contate o administrador." });
    }
  }

  static async remover(req: Request, res: Response): Promise<any> {
    try {
      const idRoteiro = parseInt(req.query.idRoteiro as string);
      const usuario_id = (req as any).usuarioId;

      const resultado = await database.pool.query(
        "DELETE FROM roteiros WHERE id = $1 AND usuario_id = $2 RETURNING *",
        [idRoteiro, usuario_id]
      );

      if (resultado.rows.length > 0) {
        return res.status(200).json("Roteiro removido com sucesso");
      } else {
        return res.status(400).json("Erro ao deletar o roteiro");
      }
    } catch (error) {
      console.error("Erro ao remover o roteiro", error);
      return res.status(500).send("Erro interno");
    }
  }

  static async atualizar(req: Request, res: Response): Promise<any> {
    try {
      const dados: RoteiroDTO = req.body;
      const idRoteiro = parseInt(req.query.idRoteiro as string);
      const usuario_id = (req as any).usuarioId;

      const resultado = await database.pool.query(
        `UPDATE roteiros
         SET cidade_partida = $1, cidade_destino = $2, data_ida = $3, data_volta = $4,
             distancia = $5, tempo_estimado = $6, orcamento = $7
         WHERE id = $8 AND usuario_id = $9
         RETURNING *`,
        [
          dados.cidade_partida,
          dados.cidade_destino,
          dados.data_ida,
          dados.data_volta,
          dados.distancia,
          dados.tempo_estimado,
          dados.orcamento,
          idRoteiro,
          usuario_id
        ]
      );

      if (resultado.rows.length > 0) {
        return res.status(200).json({ mensagem: "Roteiro atualizado com sucesso!", roteiro: resultado.rows[0] });
      } else {
        return res.status(400).json("Não foi possível atualizar o roteiro no banco de dados");
      }
    } catch (error) {
      console.error(`Erro ao atualizar roteiro: ${error}`);
      return res.status(500).json({ mensagem: "Erro ao atualizar o roteiro." });
    }
  }
}

export default RoteiroController;
