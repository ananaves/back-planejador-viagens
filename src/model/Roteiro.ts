import { DatabaseModel } from '../model/DatabaseModel';

const Roteiros = {

    // ----------------------
    // Criar um novo roteiro
    // ----------------------
    async criarRoteiro(usuario_id, dados) {
        const { cidade_partida, cidade_destino, data_ida, data_volta, distancia, tempo_estimado, orcamento } = dados;

        const result = await pool.query(
            `INSERT INTO roteiros 
             (usuario_id, cidade_partida, cidade_destino, data_ida, data_volta, distancia, tempo_estimado, orcamento)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [usuario_id, cidade_partida, cidade_destino, data_ida, data_volta, distancia, tempo_estimado, orcamento]
        );

        return result.rows[0];
    },

    // ----------------------
    // Listar roteiros do usuário
    // ----------------------
    async listarRoteirosPorUsuario(usuario_id) {
        const result = await pool.query(
            'SELECT * FROM roteiros WHERE usuario_id = $1',
            [usuario_id]
        );

        return result.rows;
    },

    // ----------------------
    // Atualizar um roteiro
    // ----------------------
    async atualizarRoteiro(id, usuario_id, dados) {
        const { cidade_partida, cidade_destino, data_ida, data_volta, distancia, tempo_estimado, orcamento } = dados;

        const result = await pool.query(
            `UPDATE roteiros 
             SET cidade_partida = $1, cidade_destino = $2, data_ida = $3, data_volta = $4,
                 distancia = $5, tempo_estimado = $6, orcamento = $7
             WHERE id = $8 AND usuario_id = $9
             RETURNING *`,
            [cidade_partida, cidade_destino, data_ida, data_volta, distancia, tempo_estimado, orcamento, id, usuario_id]
        );

        return result.rows[0];
    },

    // ----------------------
    // Deletar um roteiro
    // ----------------------
    async deletarRoteiro(id: any, usuario_id: any) {
        const result = await pool.query(
            'DELETE FROM roteiros WHERE id = $1 AND usuario_id = $2 RETURNING *',
            [id, usuario_id]
        );

        return result.rows[0];
    }

};

module.exports = Roteiros;