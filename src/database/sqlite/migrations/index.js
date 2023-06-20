const sqliteConnection = require("../../sqlite")
const createUsers = require("./createUsers")

// Função assíncrona para rodar minhas migrations
async function migrationsRun() {
   // Tabelas que o meu banco de dados pode ter | O .join() para juntar todas minhas migrations
   const schemas = [
      createUsers
   ].join("");

   // Chamando meu sqliteConnection. E usar uma promise para executar minhas migrations. Caso der um erro na migration capturar no console.log() qual erro foi
   sqliteConnection()
   .then(db => db.exec(schemas))
   .catch(error => console.error(error));
}

module.exports = migrationsRun;