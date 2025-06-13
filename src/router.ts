import { Router } from "express";
import Usuario from "./controller/usuarioController";
import Roteiro from "./controller/roteiroController";

const router = Router();

// Rota para listar todos os usuários
router.get("/usuario", Usuario.lista);

// Rota para cadastrar novo usuário
router.post("/novo/usuario", Usuario.novo);

// Rota para atualizar usuário
router.put("/atualizar/usuario", Usuario.atualizar);

// Rota para remover usuário
router.delete("/remover/usuario", Usuario.remover);


// Rota para listar todos os roteiros
router.get("/roteiro", Roteiro.lista);

// Rota para cadastrar novo usuário
router.post("/novo/roteiro", Roteiro.novo);

// Rota para atualizar usuário
router.put("/atualizar/roteiro", Roteiro.atualizar);

// Rota para remover usuário
router.delete("/remover/roteiro", Roteiro.remover);

export { router };
