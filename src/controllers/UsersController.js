const { hash, compare } = require("bcryptjs");

const AppError = require("../utils/AppError");

const sqliteConnection = require("../database/sqlite");


class UsersController {
   async create(request, response) {
      const { name, email, password } = request.body;

      const database = await sqliteConnection();
      const checkUserExists = await database.get("SELECT * FROM users WHERE email = (?)", [email]);

      if(checkUserExists) {
         throw new AppError("Este e-mail já está em uso.");
      };

      // Criptografando a senha do usuário | A função de hash() recebe dois parâmetros. Sendo o que eu quero criptografar, e o fator de complexidade da criptografia 
      // A função hash() recebe o await, por conta dela ser uma promise.
      const hashedPassword = await hash(password, 8);

      // Inserindo os dados do usuário cadastrado no banco de dados
      await database.run(
         "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",[name, email, hashedPassword]
      );
      
      return response.status(201).json();

   };

   async update(request, response) {
      const { name, email, password, old_password } = request.body;
      const { id } = request.params;

      // Conectando com o banco de dados
      const database = await sqliteConnection();
      // Pegando o id do usuário
      const user = await database.get("SELECT * FROM users WHERE id = (?)", [id]);

      // Verificando se o usuário existe
      if(!user) {
         throw new AppError("Usuário não encontrado.");
      };

      // Pegando o email do usuário para atualizar
      const userWithUpdateEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email]);

      // Fazendo a verificação do email do usuário para ver se não tem algum email já cadastrado no banco de dados
      if(userWithUpdateEmail && userWithUpdateEmail.id !== user.id) {
         throw new AppError("Este e-mail já está em uso.");
      };

      // Se existir conteúdo dentro de name, vai ser atualizado. Caso contrário vai manter o que tinha antes. | Esse é o Nullish Operator
      user.name = name ?? user.name;
      user.email = email ?? user.email;

      // Para verificar se a senha antiga foi informada!
      if(password && !old_password) {
         throw new AppError("Você precisa informar a senha antiga para definir a nova senha");
      };

      // Fazendo a atualização da senha
      if(password && old_password) {
         // Comparando a senha antiga com a senha atual
         const checkOldPassword = await compare(old_password, user.password);

         // Verificando se a senha antiga do usuário confere com a senha que ele está informando
         if(!checkOldPassword) {
            throw new AppError("A senha antiga não confere.");
         };

         // Se a senha que ele está informando confere que com a senha antiga, será feito a alteração e a criptografia da nova senha informada.
         user.password = await hash(password, 8);

      };

      // Fazendo a atualização dos dados no banco de dados
      await database.run(`
         UPDATE users SET
         name = ?,
         email = ?,
         password = ?,
         updated_at = DATETIME('now')
         WHERE id = ?`,
         [user.name, user.email, user.password, id]
      )

      // Para retornar um resposta no final
      return response.json();
   };
};

module.exports = UsersController;