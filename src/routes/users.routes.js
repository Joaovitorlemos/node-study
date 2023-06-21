const { Router } = require("express");

const UsersController = require("../controllers/UsersController");

const usersRoutes = Router();

const usersController = new UsersController();

// Rota para criar um usuário
usersRoutes.post("/", usersController.create);

//Rota para atualizar os dados do usuário
usersRoutes.put("/:id", usersController.update);

module.exports = usersRoutes;