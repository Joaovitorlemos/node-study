const sqlite3 = require("sqlite3");
const sqlite = require("sqlite");

// Biblioteca do node que resolve os endereços de acordo com o ambiente
const path = require("path")

// Criar uma função assíncrona, pq irei lidar com conexões com o banco de dados, se caso o banco de dados não existir na primeira vez que eu iniciar, essa função vai criar um arquivo dele.
async function sqliteConnection() {
   const database = await sqlite.open({
      // Local aonde o arquivo db vai ficar salvo.
      filename: path.resolve(__dirname, "..", "database.db"),
      // Driver é a versão do sqlite que irei utilizar
      driver: sqlite3.Database
   });

   return database;
}

module.exports = sqliteConnection;

// SGBD - Sistema Gerenciador de Banco de Dados