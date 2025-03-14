import { Instrutor } from "../shared/model/instrutor";

export class InstrutorRepository {
  private database: any;

  constructor(database: any) {
    this.database = database;
  }

  async create(instrutor: Instrutor): Promise<Instrutor> {
    const queryInsertInstrutors = `
      insert into instrutores (nome,
      cpf,
      data_nascimento,
      matricula,
      sexo,
      email,
      data_admissao,
      data_desligamento)
      values ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id;
    `;

    const result = await this.database.one(queryInsertInstrutores, [
      instrutor.nome,
      instrutor.cpf,
      instrutor.data_nascimento,
      instrutor.matricula,
      instrutor.sexo,
      instrutor.email,
      instrutor.data_admissao,
      instrutor.data_desligamento
    ]);

    return {
      id: result.id,
      ...instrutor,
    };
  }

  async getAll(): Promise<Instrutor[]> {
    const result = await this.database.query(
      `select nome,
      cpf,
      data_nascimento,
      matricula,
      sexo,
      email,
      data_admissao,
      data_desligamento
      from instrutores`,
      []
    );
    if (result.length === 0) {
      return [];
    }
    return result.map((instrutor: any) => ({
      id: instrutor.id,
      nome: instrutor.nome,
      cpf: instrutor.cpf,
      dataNascimento: instrutor.data_nascimento,
      matricula: instrutor.matricula,
      sexo: instrutor.sexo,
      email: instrutor.email,
      admissao: instrutor.data_admissao,
      renda: instrutor.renda,
      pcd: instrutor.pcd,
    }));
  }

  async getById(id: number): Promise<Instrutor | undefined> {
    const [result] = await this.database.query(
      `select nome,
      cpf,
      data_nascimento,
      matricula,
      sexo,
      email,
      data_admissao,
      data_desligamento
      from instrutores`
       where id = $1`,
      [id]
    );
    if (!result) return;
    return {
      id,
      nome: result.nome,
      dataNascimento: result.data_nascimento,
      cpf: result.cpf,
      telefone: result.telefone,
      sexo: result.sexo,
      email: result.email,
      admissao: result.data_admissao,
      renda: result.renda,
      pcd: result.pcd,
    };
  }

  async updateInstrutor(id: number, instrutor: Instrutor): Promise<void> {
    try {
      // Monta a query de update
      const Instrutor = `
        update instrutores set
          nome = $1,
          data_nascimento = $2,
          cpf = $3,
          telefone = $4,
          sexo = $5,
          email = $6,
          escolaridade = $7,
          renda = $8,
          pcd = $9
        where id = $10
      `;
      await this.database.query(statementUpdateInstrutor, [
        instrutor.nome,
        instrutor.dataNascimento,
        instrutor.cpf,
        instrutor.telefone,
        instrutor.sexo,
        instrutor.email,
        instrutor.escolaridade,
        instrutor.renda,
        instrutor.pcd,
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
      instrutorParams.nome = saved.nome !== instrutor.nome ? instrutor.nome : saved.nome;
      // DataNascimento
      instrutorParams.dataNascimento =
        saved.dataNascimento !== instrutor.dataNascimento
          ? instrutor.dataNascimento
          : saved.dataNascimento;
      // CPF
      instrutorParams.cpf = saved.cpf !== instrutor.cpf ? instrutor.cpf : saved.cpf;
      // Telefone
      instrutor.telefone =
        saved.telefone !== instrutor.telefone ? instrutor.telefone : saved.telefone;
      // Sexo
      instrutorParams.sexo = saved.sexo !== instrutor.sexo ? instrutor.sexo : saved.sexo;
      // Email
      instrutorParams.email =
        saved.email !== instrutor.email ? instrutor.email : saved.email;
      // Escolaridade
      instrutorParams.escolaridade =
        saved.escolaridade !== instrutor.escolaridade
          ? instrutor.escolaridade
          : saved.escolaridade;
      // Renda
      instrutorParams.renda =
        saved.renda !== instrutor.renda ? instrutor.renda : saved.renda;
      // PCD
      instrutorParams.pcd = saved.pcd !== instrutor.pcd ? instrutor.pcd : saved.pcd;

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
