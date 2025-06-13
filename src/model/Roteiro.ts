import { DatabaseModel } from './DatabaseModel';
import { Request, Response, NextFunction } from 'express';

const database = new DatabaseModel().pool;

export class Roteiro {

    static async todos(req: Request, res: Response) {
        res.json({ message: "Lista de roteiros" });
    }

    private id: number = 0;
    private userId: number;
    private cidadePartida: string;
    private cidadeDestino: string;
    private dataIda: Date;
    private dataVolta: Date;
    private distancia: number;
    private tempoEstimado: string;
    private orcamento: number;

    constructor(
        userId: number,
        cidadePartida: string,
        cidadeDestino: string,
        dataIda: Date,
        dataVolta: Date,
        distancia: number,
        tempoEstimado: string,
        orcamento: number
    ) {
        this.userId = userId;
        this.cidadePartida = cidadePartida;
        this.cidadeDestino = cidadeDestino;
        this.dataIda = dataIda;
        this.dataVolta = dataVolta;
        this.distancia = distancia;
        this.tempoEstimado = tempoEstimado;
        this.orcamento = orcamento;
    }

    // Getters e Setters
    public getId(): number {
        return this.id;
    }

    public setId(id: number): void {
        this.id = id;
    }

    public getUserId(): number {
        return this.userId;
    }

    public setUserId(userId: number): void {
        this.userId = userId;
    }

    public getCidadePartida(): string {
        return this.cidadePartida;
    }

    public setCidadePartida(cidadePartida: string): void {
        this.cidadePartida = cidadePartida;
    }

    public getCidadeDestino(): string {
        return this.cidadeDestino;
    }

    public setCidadeDestino(cidadeDestino: string): void {
        this.cidadeDestino = cidadeDestino;
    }

    public getDataIda(): Date {
        return this.dataIda;
    }

    public setDataIda(dataIda: Date): void {
        this.dataIda = dataIda;
    }

    public getDataVolta(): Date {
        return this.dataVolta;
    }

    public setDataVolta(dataVolta: Date): void {
        this.dataVolta = dataVolta;
    }

    public getDistancia(): number {
        return this.distancia;
    }

    public setDistancia(distancia: number): void {
        this.distancia = distancia;
    }

    public getTempoEstimado(): string {
        return this.tempoEstimado;
    }

    public setTempoEstimado(tempoEstimado: string): void {
        this.tempoEstimado = tempoEstimado;
    }

    public getOrcamento(): number {
        return this.orcamento;
    }

    public setOrcamento(orcamento: number): void {
        this.orcamento = orcamento;
    }

    // Métodos estáticos

    static async listarRoteiros(): Promise<Array<Roteiro> | null> {
        const listaDeRoteiros: Array<Roteiro> = [];
        try {
            const querySelectRoteiro = 'SELECT * FROM roteiro';
            const resposta = await database.query(querySelectRoteiro);

            resposta.rows.forEach((linha) => {
                const novoRoteiro = new Roteiro(
                    linha.user_id,
                    linha.cidade_partida,
                    linha.cidade_destino,
                    linha.data_ida,
                    linha.data_volta,
                    linha.distancia,
                    linha.tempo_estimado,
                    linha.orcamento
                );
                novoRoteiro.setId(linha.id);
                listaDeRoteiros.push(novoRoteiro);
            });

            return listaDeRoteiros;
        } catch (error) {
            console.error('Erro ao listar roteiros:', error);
            return null;
        }
    }

    static async criarRoteiro(roteiro: Roteiro): Promise<boolean> {
        try {
            const queryCriarRoteiro = `
        INSERT INTO roteiro (
          user_id, cidade_partida, cidade_destino, data_ida,
          data_volta, distancia, tempo_estimado, orcamento
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id;
      `;

            const valores = [
                roteiro.getUserId(),
                roteiro.getCidadePartida(),
                roteiro.getCidadeDestino(),
                roteiro.getDataIda(),
                roteiro.getDataVolta(),
                roteiro.getDistancia(),
                roteiro.getTempoEstimado(),
                roteiro.getOrcamento()
            ];

            const result = await database.query(queryCriarRoteiro, valores);

            if (result.rowCount !== 0) {
                console.log(`Roteiro criado com sucesso! ID do roteiro: ${result.rows[0].id}`);
                return true;
            }

            return false;
        } catch (error) {
            console.error('Erro ao criar roteiro:', error);
            return false;
        }
    }

    static async atualizarRoteiro(roteiro: Roteiro): Promise<boolean> {
        let queryResult = false;

        try {
            const queryAtualizarRoteiro = `
        UPDATE roteiro SET
          user_id = $1,
          cidade_partida = $2,
          cidade_destino = $3,
          data_ida = $4,
          data_volta = $5,
          distancia = $6,
          tempo_estimado = $7,
          orcamento = $8
        WHERE id = $9
      `;

            const valores = [
                roteiro.getUserId(),
                roteiro.getCidadePartida(),
                roteiro.getCidadeDestino(),
                roteiro.getDataIda(),
                roteiro.getDataVolta(),
                roteiro.getDistancia(),
                roteiro.getTempoEstimado(),
                roteiro.getOrcamento(),
                roteiro.getId()
            ];

            const result = await database.query(queryAtualizarRoteiro, valores);
            return queryResult;
        } catch (error) {
            console.error('Erro ao atualizar roteiro:', error);
            return false;
        }
    }

    static async removerRoteiro(id: number): Promise<boolean> {
        let queryResult = false;

        try {
            const queryDeleteRoteiro = `DELETE FROM roteiro WHERE id = $1`;

            const result = await database.query(queryDeleteRoteiro);

            if (result.rowCount !== 0) {
                queryResult = true;
            }
            return queryResult;
        } catch (error) {
            console.error(`Error na consulta: ${error}`);
            return queryResult;
        }
    }


    static async buscarPorId(id: number): Promise<Roteiro | null> {
        try {
            const query = `SELECT * FROM roteiro WHERE id = $1`;
            const result = await database.query(query, [id]);

            if (result.rows.length > 0) {
                const linha = result.rows[0];
                const roteiro = new Roteiro(
                    linha.usuario_id,
                    linha.cidade_partida,
                    linha.cidade_destino,
                    linha.data_ida,
                    linha.data_volta,
                    linha.distancia,
                    linha.tempo_estimado,
                    linha.orcamento
                );
                roteiro.setId(linha.id);
                return roteiro;
            }

            return null;
        } catch (error) {
            console.error('Erro ao buscar roteiro por ID:', error);
            return null;
        }
    }
}
