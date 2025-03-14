import { Instrutor } from "../shared/model/instrutor";

export class InstrutorRepository {
  private database: any;

  constructor(database: any) {
    this.database = database;
  }

  async create(instrutor: Instrutor): Promise<Instrutor> {
    const queryInsertInstrutores =
    `insert into instrutores (nome, cpf, data_nascimento,
    matricula, sexo, email, data_admissao, data_desligamento)
    values ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id;`;

    const result = await this.database.one(queryInsertInstrutores, [
      instrutor.nome,
      instrutor.cpf,
      instrutor.data_nascimento,
      instrutor.matricula,
      instrutor.sexo,
      instrutor.email,
      instrutor.data_admissao,
      instrutor.data_desligamento,
    ]);

    return {
      id: result.id,
      ...instrutor,
    };
  }

  async getAll(): Promise<Instrutor> {
    const result = await this.database.query(
      `select
      nome,
      cpf,
      data_nascimento,
      matricula,
      sexo,
      email,
      data_admissao,
      data_desligamento
      from instrutores`,[]);
    if (result.length === 0) {
      return[];
    }
    return result.map((instrutor: any) => ({
      id: instrutor.id,
      nome: instrutor.nome,
      cpf: instrutor.cpf,
      data_nascimento: instrutor.data_nascimento,
      matricula: instrutor.matricula,
      sexo: instrutor.sexo,
      email: instrutor.email,
      data_admissao: instrutor.data_admissao,
      data_desligamento: instrutor.data_desligamento,
    }));
  }

  async getById(id: number): Promise<Instrutor | undefined> {
    const [result] = await this.database.query(
      `select
      nome,
      cpf,
      data_nascimento,
      matricula,
      sexo,
      email,
      data_admissao,
      data_desligamento
      from instrutores where id = $1`,[id]);
    if (!result) return;
    return {
      id,
      nome: result.nome,
      cpf: result.cpf,
      data_nascimento: result.data_nascimento,
      matricula: result.matricula,
      sexo: result.sexo,
      email: result.email,
      data_admissao: result.data_admissao,
      data_desligamento: result.data_desligamento,
    };
  }

  async updateInstrutor(id: number, instrutor: Instrutor): Promise<void> {
    try {
      // Monta a query de update
      const statementUpdateInstrutor = `
      update instrutores set
      nome = $1,
      cpf = $2,
      data_nascimento = $3,
      matricula = $4,
      sexo = $5,
      email = $6,
      data_admissao = $7,
      data_desligamento = $8
      where id = $9`;
      await this.database.query(statementUpdateInstrutor, [
        instrutor.nome,
        instrutor.cpf,
        instrutor.data_nascimento,
        instrutor.matricula,
        instrutor.sexo,
        instrutor.email,
        instrutor.data_admissao,
        instrutor.data_desligamento,
        id,
      ]);
    } catch (error) {
      throw error;
    }
  }

  async updatePartOfInstrutor(id: number, instrutor: Instrutor): Promise<void> {
    try {
      // Obter os dados do instrutor do banco
      const saved = await this.getById(id);
      if (!saved) {
        throw new Error("Instrutor não encontrado");
      }

      let instrutorParams: Instrutor = {} as Instrutor;

      // Nome
      instrutorParams.nome =
        saved.nome !== instrutor.nome ? instrutor.nome : saved.nome;
      // CPF
      instrutorParams.cpf =
        saved.cpf !== instrutor.cpf ? instrutor.cpf : saved.cpf;
      // data_nascimento
      instrutorParams.data_nascimento =
        saved.data_nascimento !== instrutor.data_nascimento
          ? instrutor.data_nascimento
          : saved.data_nascimento;
      // Matricula
      instrutorParams.matricula =
        saved.matricula !== instrutor.matricula
          ? instrutor.matricula
          : saved.matricula;
      // Sexo
      instrutorParams.sexo =
        saved.sexo !== instrutor.sexo ? instrutor.sexo : saved.sexo;
      // Email
      instrutorParams.email =
        saved.email !== instrutor.email ? instrutor.email : saved.email;
      // data_admissao
      instrutorParams.data_admissao =
        saved.data_admissao !== instrutor.data_admissao
          ? instrutor.data_admissao
          : saved.data_admissao;
      // data_desligamento
      instrutorParams.data_desligamento =
        saved.data_desligamento !== instrutor.data_desligamento
          ? instrutor.data_desligamento
          : saved.data_desligamento;

      this.updateInstrutor(id, instrutorParams);
    } catch (error) {
      throw error;
    }
  }

  async delete(id: number) {
    const instrutor = await this.getById(id);

    if (!instrutor) {
      throw new Error("Instrutor não encontrado");
    }
    // Monta a query de exclusão
    const statementDeleteInstrutores = `delete from instrutores where id = $1`;
    await this.database.query(statementDeleteInstrutores, [id]);
  }
}
