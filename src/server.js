const express = require('express');
const { send } = require('express/lib/response');

const app = express();

// Adicionando Routes Params com a rota/:name
app.get("/message/:id/:user", (request, response) => {

   // Desestruturando os parâmetros
   const { id, user } = request.params;

   // Fazendo a request para ver o parâmetro da ID
   response.send(`
      Mensagem ID: ${id}.
      Para o o usuário: ${user}
   `);
});


// Adicionando um Query Params para minha rota
app.get("/users", (request, response) => {
   const { page, limit } = request.query;

   response.send(`Página: ${page}. Mostrar: ${limit}`)
});

const PORT = 3333;
app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`));