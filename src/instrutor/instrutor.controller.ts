import { Instrutor } from "../shared/model/instrutor";
import { InstrutorService } from "./instrutor.service";
import { Request, Response } from "express";

export class InstrutorController {
    private service: InstrutorService;

    constructor(service: InstrutorService) {
        this.service = service;
    }

    // CRUD - (C)reate
    async createInstrutor(req: Request<{}, {}, Instrutor>, res: Response) {
        try {
            // ENTRADA
            const instrutor = req.body;
            // PROCESSAMENTO
            const novoInstrutor = await this.service.createInstrutor(instrutor);
            // SAÍDA
            res.status(201).send(novoInstrutor);
        } catch (error) {
            // Imprime o erro
            console.log("Error - InstrutorController>createInstrutor", error);
            res.status(500).send({ error: true, message: error });
        }
    }

    // CRUD - (R)etrieve
    async getInstrutores(_: Request, res: Response) {
        try {
            // Busca os dados no banco
            const instrutores = await this.service.getAll();
            // Retorna os dados
            res.status(200).send(instrutores);
        } catch (error) {
            console.log("Error - InstrutorController>getInstrutores", error);
            res.status(500).send({ error: true, message: error });
        }
    }

    async getInstrutorById(req: Request<{ id: string }>, res: Response) {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).send({ error: true, message: "Informe o ID do instrutor" });
                return;
            }
            const instrutorId = parseInt(id);
            if (isNaN(instrutorId)) {
                res.status(400).send({ error: true, message: "Informe um ID válido" });
                return;
            }

            // Busca os dados no banco
            const instrutor = await this.service.getById(instrutorId);
            if (!instrutor) {
                res.status(404).send({ error: true, message: "Instrutor não encontrado" });
                return;
            }

            // Retorna os dados
            res.status(200).send(instrutor);
        } catch (error) {
            console.log("Error - InstrutorController>getInstrutorById", error);
            res.status(500).send({ error: true, message: error });
        }
    }

    // CRUD - (U)pdate
    async updatePartOfInstrutor(
        req: Request<{ id: string }, {}, Instrutor>,
        res: Response
    ) {
        try {
            // Pega o id dos parametros de rota
            const { id } = req.params;
            // Valida se o id foi informado
            if (!id) {
                res.status(400).send({ error: true, message: "Informe o ID do instrutor" });
                return;
            }
            // Converte o id para number
            const instrutorId = parseInt(id);
            // Valida se é um número
            if (isNaN(instrutorId)) {
                res.status(400).send({ error: true, message: "Informe um ID válido" });
                return;
            }
            // Pegar os dados do instrutor
            const instrutor = req.body;
            // Chama o service para atualizar o instrutor
            await this.service.updatePartOfInstrutor(instrutorId, instrutor);
            // Busca os dados atualizados do instrutor e retorna
            const instrutorAtualizado = await this.service.getById(instrutorId);
            res.status(200).send(instrutorAtualizado);
        } catch (error) {
            console.log("Error - InstrutorController>updateInstrutor", error);
            res.status(500).send({ error: true, message: error });
        }
    }

    async updateAllFieldsInstrutor(
        req: Request<{ id: string }, {}, Instrutor>,
        res: Response
    ) {
        try {
            // Pega o id dos parametros de rota
            const { id } = req.params;
            // Valida se o id foi informado
            if (!id) {
                res.status(400).send({ error: true, message: "Informe o ID do instrutor" });
                return;
            }
            // Converte o id para number
            const instrutorId = parseInt(id);
            // Valida se é um número
            if (isNaN(instrutorId)) {
                res.status(400).send({ error: true, message: "Informe um ID válido" });
                return;
            }
            // Pegar os dados do instrutor
            const instrutor = req.body;
            // Chama o service para atualizar o instrutor
            await this.service.updateInstrutor(instrutorId, instrutor);

            const instrutorAtualizado = await this.service.getById(instrutorId);
            res.status(200).send(instrutorAtualizado);
            console.log(instrutorAtualizado);
        } catch (error) {
            console.log("Error - InstrutorController>updateInstrutor", error);
            res.status(500).send({ error: true, message: error });
        }
    }

    async deleteInstrutor(req: Request<{ id: string }, {}, Instrutor>, res: Response) {
        try {
            // Pega o id dos parametros de rota
            const { id } = req.params;
            // Valida se o id foi informado
            if (!id) {
                res.status(400).send({ error: true, message: "Informe o ID do instrutor" });
                return;
            }
            // Converte o id para number
            const instrutorId = parseInt(id);
            // Valida se é um número
            if (isNaN(instrutorId)) {
                res.status(400).send({ error: true, message: "Informe um ID válido" });
                return;
            }
            // Pegar os dados do instrutor
            const instrutor = req.body;
            // Chama o service para atualizar o instrutor
            await this.service.deleteInstrutor(instrutorId);
            res.status(200).send();
        } catch (error) {
            console.log("Error - InstrutorController>deleteInstrutor", error);
            res.status(500).send({
                error: true,
                message: "Internal Error",
            });
        }
    }
}
