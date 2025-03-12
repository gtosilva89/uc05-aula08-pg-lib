import Scanner from "@codeea/scanner";
import { Database } from "./database";
import { AlunoRepository } from "./repository/aluno.repository";
import { Aluno } from "./model/Aluno";

const scanner = new Scanner();
const database = new Database();
const alunoRepository = new AlunoRepository(database);

async function main() {
  // CRUD
  // (C)reate - Criar -> INSERT
  // (R)etrieve - Obter -> SELECT
  // (U)pdate - Atualizar -> UPDATE WITH WHERE
  // (D)elete - Excluir -> DELETE WITH WHERE

  let comando = 0;
  do {
    // 10 - Tabela Alunos
    // 20 - Tabela Instrutores
    // 30 - Tabela Cursos
    // 40 - Tabela Turmas
    // 50 - Tabela Matriculas
    console.log(`
      Comandos Disponíveis:
      10 - Criar Aluno
      11 - Listar Alunos
      12 - Atualizar Dados Aluno
      14 - Excluir Aluno\n

      0-Sair\n
      `);
    comando = await scanner.questionInt("Informe o comando:");
    switch (comando) {
      case 10:
        await createAluno();
        break;
      case 11:
        await getAlunos();
        break;
      case 12:
        await updateAluno();
        break;
      case 13:
        console.log("Opção Inválida");
        break;
      case 14:
        await deleteAluno();
        break;
      default:
        break;
    }
  } while (comando > 0);
}

async function inputDataAluno(): Promise<Aluno> {
  const nome = await scanner.question("Nome Completo: ");
  const dataNascimento = await scanner.question(
    "Data Nascimento (ex: 12/11/1990): "
  );
  const cpf = await scanner.question("CPF: ");
  const telefone = await scanner.question("Telefone: ");
  const sexo = await scanner.question("Sexo (M-Masculino/F-Feminino): ");
  const email = await scanner.question("Email: ");
  const escolaridade = await scanner.question("Nível Escolaridade: ");
  const renda = await scanner.questionFloat("Renda: ");
  const pcd = await scanner.question("É PCD? (S-Sim/N-Não): ");

  const [dia, mes, ano] = dataNascimento.split("/");

  return {
    nome,
    dataNascimento: new Date(`${mes}/${dia}/${ano}`),
    cpf,
    telefone,
    sexo: sexo.charAt(0),
    email,
    escolaridade,
    renda,
    pcd: pcd.toUpperCase() === "S",
  };
}

// CRUD - (C)reate
async function createAluno() {
  try {
    // Usando o scanner, vamos obter os dados do aluno para inserir

    // ENTRADA
    console.log("A seguir, informe os dados do aluno: \n");
    const aluno = await inputDataAluno();

    // PROCESSAMENTO
    await alunoRepository.createAluno(aluno);

    // SAÍDA
    await getAlunos();
  } catch (error) {
    // Imprime o erro
    console.log(error);
  }
}

// CRUD - (R)etrieve
async function getAlunos() {
  // Busca os dados no banco
  const results = await alunoRepository.getAll();

  // Imprime os dados
  console.log(results);
}

async function getAlunoById(id: Number): Promise<any> {
  // Busca os dados no banco
  const results = await database.query("select * from alunos where id = $1", [
    id,
  ]);

  // Imprime os dados
  console.log(results);
}

// CRUD - (U)pdate
async function updateAluno() {
  try {
    // Usando o scanner, vamos obter os dados do aluno para inserir

    // ENTRADA
    console.log("A seguir, informe os dados do aluno a ser atualizado: \n");
    const id = await scanner.questionInt("Informe o id do aluno: ");
    if (!id) {
      console.log("Informe o ID do aluno");
      return;
    }

    const aluno = await inputDataAluno();

    // Monta a query de inserção
    const statementUpdateAlunos = `
      update alunos set
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

    // PROCESSAMENTO

    // Insere os dados no banco
    await database.query(statementUpdateAlunos, [
      aluno.nome,
      aluno.dataNascimento,
      aluno.cpf,
      aluno.telefone,
      aluno.sexo,
      aluno.email,
      aluno.escolaridade,
      aluno.renda,
      aluno.pcd,
      id,
    ]);

    // SAÍDA
    const alunoAtualizado = await getAlunoById(id);
    console.log(alunoAtualizado);
  } catch (error) {
    // Imprime o erro
    console.log(error);
  }
}

async function deleteAluno(): Promise<void> {
  try {
    console.log("A seguir, informe os dados do aluno a ser excluído: \n");
    const id = await scanner.questionInt("Informe o id do aluno: ");
    if (!id) {
      console.log("Informe o ID do aluno");
      return;
    }
    // Monta a query de exclusão
    const statementDeleteAlunos = `
      delete from alunos where id = $1
    `;
    await database.query(statementDeleteAlunos, [id]);
  } catch (error) {
    // Imprime o erro
    console.log(error);
  }
}

(async () => {
  await main();
  scanner.close();
  await database.closeConnection();
})();
