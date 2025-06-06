import { DatabaseModel } from './DatabaseModel';

const database = new DatabaseModel().pool;

/**
 * Classe que representa um Roteiro de viagem
 */
export class Roteiro {
    private id: number = 0;
    private usuarioId: number;
    private cidadePartida: string;
    private cidadeDestino: string;
    private dataIda: Date;
    private dataVolta: Date;
    private distancia: number;
    private tempoEstimado: string;
    private orcamento: number;

    /**
     * Construtor da classe Roteiro
     * @param usuarioId ID do usuário dono do roteiro
     * @param cidadePartida Cidade de partida
     * @param cidadeDestino Cidade destino
     * @param dataIda Data de ida
     * @param dataVolta Data de volta
     * @param distancia Distância estimada
     * @param tempoEstimado Tempo estimado de viagem
     * @param orcamento Orçamento disponível
     */
    constructor(
        usuarioId: number,
        cidadePartida: string,
        cidadeDestino: string,
        dataIda: Date,
        dataVolta: Date,
        distancia: number,
        tempoEstimado: string,
        orcamento: number
    ) {
        this.usuarioId = usuarioId;
        this.cidadePartida = cidadePartida;
        this.cidadeDestino = cidadeDestino;
        this.dataIda = dataIda;
        this.dataVolta = dataVolta;
        this.distancia = distancia;
        this.tempoEstimado = tempoEstimado;
        this.orcamento = orcamento;
    }

    // Getters e setters
    public getId(): number {
        return this.id;
    }
    public setId(id: number): void {
        this.id = id;
    }

    public getUsuarioId(): number {
        return this.usuarioId;
    }
    public setUsuarioId(usuarioId: number): void {
        this.usuarioId = usuarioId;
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

    static async listarRoteiros(): Promise<Array<Roteiro> | null> {
    const listaDeRoteiros: Array<Roteiro> = [];

    try {
        // Consulta para buscar todos os roteiros
        const querySelectRoteiros = `SELECT * FROM roteiros;`;

        // Executa a consulta no banco
        const respostaBD = await database.query(querySelectRoteiros);

        // Para cada linha retornada, cria um objeto Roteiro
        respostaBD.rows.forEach((linha) => {
            const novoRoteiro = new Roteiro(
                linha.usuario_id,
                linha.cidade_partida,
                linha.cidade_destino,
                linha.data_ida,
                linha.data_volta,
                linha.distancia,
                linha.tempo_estimado,
                linha.orcamento
            );

            // Atribui o ID do roteiro
            novoRoteiro.setId(linha.id);

            // Adiciona o objeto à lista
            listaDeRoteiros.push(novoRoteiro);
        });

        // Retorna a lista de roteiros
        return listaDeRoteiros;

    } catch (error) {
        console.log('Erro ao buscar lista de roteiros. Verifique os logs para mais detalhes.');
        console.log(error);
        return null;
    }
}

    /**
     * Cadastra um novo roteiro no banco de dados
     * @returns true se cadastro for bem-sucedido, false caso contrário
     */
    public async cadastrarRoteiro(): Promise<boolean> {
        try {
            const query = `
                INSERT INTO roteiros 
                    (usuario_id, cidade_partida, cidade_destino, data_ida, data_volta, distancia, tempo_estimado, orcamento)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING id
            `;
            const values = [
                this.usuarioId,
                this.cidadePartida,
                this.cidadeDestino,
                this.dataIda,
                this.dataVolta,
                this.distancia,
                this.tempoEstimado,
                this.orcamento
            ];

            const result = await database.query(query, values);

            if (result.rowCount !== 0) {
                this.setId(result.rows[0].id);
                return true;
            }
            return false;
        } catch (error) {
            console.log('Erro ao cadastrar roteiro:', error);
            return false;
        }
    }

    /**
     * Atualiza um roteiro existente no banco
     * @returns true se atualização for bem-sucedida, false caso contrário
     */
    public async atualizarRoteiro(): Promise<boolean> {
        try {
            const query = `
                UPDATE roteiros SET
                    cidade_partida = $1,
                    cidade_destino = $2,
                    data_ida = $3,
                    data_volta = $4,
                    distancia = $5,
                    tempo_estimado = $6,
                    orcamento = $7
                WHERE id = $8 AND usuario_id = $9
            `;
            const values = [
                this.cidadePartida,
                this.cidadeDestino,
                this.dataIda,
                this.dataVolta,
                this.distancia,
                this.tempoEstimado,
                this.orcamento,
                this.id,
                this.usuarioId
            ];

            const result = await database.query(query, values);
            return result.rowCount !== 0;
        } catch (error) {
            console.log('Erro ao atualizar roteiro:', error);
            return false;
        }
    }

    /**
     * Deleta um roteiro pelo ID e usuário dono
     * @param id ID do roteiro a deletar
     * @param usuarioId ID do usuário dono do roteiro
     * @returns true se deleção foi bem-sucedida, false caso contrário
     */
    static async deletarRoteiro(id: number, usuarioId: number): Promise<boolean> {
        try {
            const query = `
                DELETE FROM roteiros WHERE id = $1 AND usuario_id = $2 RETURNING *
            `;
            const result = await database.query(query, [id, usuarioId]);
            return result.rowCount !== 0;
        } catch (error) {
            console.log('Erro ao deletar roteiro:', error);
            return false;
        }
    }
}