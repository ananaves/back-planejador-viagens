// Importa a conexão com o banco
import { DatabaseModel } from '../model/DatabaseModel';

// ========= Criar um novo roteiro =================
exports.criarRoteiro = async (req, res) => {
    const {cidade_partida, cidade_destino, data_ida, data_volta, distancia, tempo_estimado, orcamento } = req.body;

    // Assumimos que req.usuarioId foi setado pelo middleware de autenticação
    const usuario_id = req.usuarioId;

    try {
        const resultado = await pool.query('INSERT INTO roteiros (usuario_id, cidade_partida, cidade_destino, data_ida, data_volta, distancia, tempo_estimado, orcamento) VALUES $1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', [usuario_id, cidade_partida, cidade_destino, data_ida, data_volta, distancia, tempo_estimado, orcamento]);
        res.status(201).json({mensagem: 'Roteiro criado com sucesso!', roteiro: resultado.rowCount[0]});
    } catch (error) {
        console.error(error);
        res.status(500).json({mensagem: 'Erro ao criar roteiro.'});
    }
};


// ========== Listar todos os roteiros do usuario ========================
exports.getRoteiros = async (req, res) => {
    const usuario_id = req.usuarioId;

    try {
        const resultado = await Pool.query('SELECT * FROM roteiros WHERE usuario_id = $1', [usuario_id]);
        res.json({roteiros: resultado.rows});
    } catch (error) {
        console.error(error);
        res.status(500).json({mensagem: 'Erro ao buscar roteiros.'});
    }
};


// =========== ATUALIZAR UM ROTEIRO =========================
exports.updateRoteiro = async (req, res) => {
    const {id} = req.params;
    const {cidade_partida, cidade_destino, data_ida, data_volta, distancia, tempo_estimado, orcamento } = req.body;
    const usuario_id = req.usuarioId;

    try {
        const resultado =  await Pool.query('UPDATE roteiros SET cidade_partida = $1, cidade_destino = $2, data_ida = $3, data_volta = $4, distancia = $5, tempo_estimado = $6, orcamento = $7 RETURNING *', [cidade_partida, cidade_destino, data_ida, data_volta, distancia, tempo_estimado, orcamento, id, usuario_id]);
        if (resultado.rows.lengh == 0) {
            return res.status(400).json({mensagem: 'Roteiro não encontrado ou sem permissão.'});
        }

        res.json({mensagem: 'Roteiro atualizado com sucesso!', roteiro: resultado.rows[0]});
    } catch (error) {
        console.error(error);
        res.status(500).json({mensagem: 'Erro ao atualizar roteiro'});
    }
};

//========= DELETAR ROTEIRO =====================
exports.deleteRoteiro = async (req, res) => {
    const { id } = req.params;
    const user_id = req.userId;

    try {
        const result = await pool.query(
            'DELETE FROM roteiros WHERE id = $1 AND usuario_id = $2 RETURNING *',
            [id, user_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Roteiro não encontrado ou sem permissão.' });
        }

        res.json({ message: 'Roteiro deletado com sucesso!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao deletar roteiro.' });
    }
};