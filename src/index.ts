import Scanner from "@codeea/scanner";
import { connect } from "http2";
import pgp from "pg-promise";
async function main() {
const scanner = new Scanner();

// criar um objeto de conexão com o banco
const connectionString = "postgres://postgres:password@localhost:5432/matriculas_db";

const connection = pgp()(connectionString);
try {
  // Usando scanner, vamos obter os dados do aluno para inserir
  // ENTRADA
  console.log("A seguir, informe os dados do aluno: \n");
  const nome = await scanner.question("Nome Completo: ");
  const data_nascimento = await scanner.question("Data Nascimento (ex: 12/11/1990) ");
  const cpf = await scanner.question("CPF: ");
  const telefone = await scanner.question("Telefone: ");
  const sexo = await scanner.question("Sexo (M-Masculino, F-Feminino): ");
  const email = await scanner.question("Email: ");
  const escolaridade  = await scanner.question("Nível Escolaridade: ");
  const renda = await scanner.questionFloat("Renda: ");
  const pcd =  await scanner.question("É PCD? (S-Sim/N-Não) ");

  // Monta a query de inserção
  const queryInsertAlunos = `
insert into alunos (nome, data_nascimento, cpf,
telefone, sexo,  email, escolaridade, renda, pcd)
  values ($1,$2,$3,$4,$5,$6,$7,$8,$9);`


  //PROCESSAMENTO
  //insere os dados no banco
await connection.query(queryInsertAlunos, [
  nome,
  data_nascimento,
  cpf,
  telefone,
  sexo.charAt(0),
  email,
  escolaridade,
  renda,
  pcd.toLocaleUpperCase() === "S",
])

// SAIDA
// Busca os dados no banco
const results = await connection.query("select id, nome, cpf from alunos");

console.log(results);
} catch (error){
  console.log(error);
}

scanner.close();
}

(async()=>{
  await main()
})()
