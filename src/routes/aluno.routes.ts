import express, { Router } from "express";
import { AlunoController } from "../controller/aluno.controller";
import { AlunoRepository } from "../repository/aluno.repository";
import { AlunoService } from "../service/aluno.service";

export class AlunoRoutes {
  private database: any;
  private router: Router;

  constructor(database: any) {
    this.database = database;
    this.router = express.Router();
    this.configureRoutes();
  }

  // Cria o repositorio, service, controller e rotas do aluno
  configureRoutes(): void {
    const alunoRepository = new AlunoRepository(this.database);
    const alunoService = new AlunoService(alunoRepository);
    const alunoController = new AlunoController(alunoService);
    this.router.post("/", alunoController.createAluno);
  }

  getRouter(): Router {
    return this.router;
  }
}
