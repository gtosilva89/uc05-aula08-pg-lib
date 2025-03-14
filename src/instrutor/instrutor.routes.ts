import express, { Router } from "express";
import { InstrutorController } from "./instrutor.controller";
import { InstrutorRepository } from "./instrutor.repository";
import { InstrutorService } from "./instrutor.service";

export class InstrutorRoutes {
    private database: any;
    private router: Router;

    private instrutorRepository: InstrutorRepository;
    private instrutorService: InstrutorService;
    private instrutorController: InstrutorController;

    constructor(database: any) {
        this.database = database;
        this.instrutorRepository = new InstrutorRepository(this.database);
        this.instrutorService = new InstrutorService(this.instrutorRepository);
        this.instrutorController = new InstrutorController(this.instrutorService);
        this.router = express.Router();
        this.configureRoutes();
    }

    // Cria o repositorio, service, controller e rotas do instrutor
    configureRoutes(): void {
        this.router.post("/", (req, res) =>
            this.instrutorController.createInstrutor(req, res)
        );
        this.router.get("/", (req, res) =>
            this.instrutorController.getInstrutores(req, res)
        );
        this.router.get("/:id", (req, res) =>
            this.instrutorController.getInstrutorById(req, res)
        );
        this.router.put("/:id", (req, res) =>
            this.instrutorController.updateAllFieldsInstrutor(req, res)
        );
        this.router.patch("/:id", (req, res) =>
            this.instrutorController.updatePartOfInstrutor(req, res)
        );
        this.router.delete("/:id", (req, res) =>
            this.instrutorController.deleteInstrutor(req, res)
        );
    }

    getRouter(): Router {
        return this.router;
    }
}
