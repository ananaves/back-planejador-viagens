import { Request, Response } from "express";
import { Roteiro } from "../model/Roteiro";

interface RoteiroDTO {
  userId: number;
  cidadePartida: string;
  cidadeDestino: string;
  dataIda: Date;
  dataVolta: Date;
  distancia: number;
  tempoEstimado: string;
  orcamento: number;
}

export class roteiroController {
  static async lista(req: Request, res: Response): Promise<any> {
    try {
      const listaDeRoteiros = await Roteiro.listarRoteiros();
      return res.status(200).json(listaDeRoteiros);
    } catch (error) {
      console.error("Erro ao acessar a listagem de roteiros", error);
      return res
        .status(400)
        .json({ mensagem: "Não foi possível acessar a listagem de roteiros" });
    }
  }

  static async novo(req: Request, res: Response): Promise<any> {
    try {
      const roteiroRecebido: RoteiroDTO = req.body;

      const novoRoteiro = new Roteiro(
        roteiroRecebido.userId,
        roteiroRecebido.cidadePartida,
        roteiroRecebido.cidadeDestino,
        roteiroRecebido.dataIda,
        roteiroRecebido.dataVolta,
        roteiroRecebido.distancia,
        roteiroRecebido.tempoEstimado,
        roteiroRecebido.orcamento
      );

      const respostaClasse = await Roteiro.criarRoteiro(novoRoteiro);

      if (respostaClasse) {
        return res
          .status(201)
          .json({ mensagem: "Roteiro cadastrado com sucesso!" });
      } else {
        return res
          .status(400)
          .json({ mensagem: "Erro ao cadastrar o roteiro. Contate o administrador." });
      }
    } catch (error) {
      console.error(`Erro ao cadastrar um roteiro. ${error}`);
      return res
        .status(400)
        .json({ mensagem: "Não foi possível cadastrar o roteiro. Contate o administrador." });
    }
  }

  static async remover(req: Request, res: Response): Promise<any> {
    try {
      const idRoteiro = parseInt(req.query.idRoteiro as string);

      const result = await Roteiro.removerRoteiro(idRoteiro);

      if (result) {
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
      const dadosRecebidos: RoteiroDTO = req.body;

      const roteiro = new Roteiro(
        dadosRecebidos.userId,
        dadosRecebidos.cidadePartida,
        dadosRecebidos.cidadeDestino,
        dadosRecebidos.dataIda,
        dadosRecebidos.dataVolta,
        dadosRecebidos.distancia,
        dadosRecebidos.tempoEstimado,
        dadosRecebidos.orcamento
      );

      roteiro.setId(parseInt(req.query.idRoteiro as string));

      if (await Roteiro.atualizarRoteiro(roteiro)) {
        return res.status(200).json({ mensagem: "Roteiro atualizado com sucesso!" });
      } else {
        return res
          .status(400)
          .json("Não foi possível atualizar o roteiro no banco de dados");
      }
    } catch (error) {
      console.error(`Erro no modelo: ${error}`);
      return res.status(500).json({ mensagem: "Erro ao atualizar o roteiro." });
    }
  }
}

export default roteiroController;
