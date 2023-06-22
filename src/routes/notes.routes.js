const { Router } = require("express");

const NotesController = require("../controllers/NotesController");

const notesRoutes = Router();

const notesController = new NotesController();

// Rota para criar um usuário
notesRoutes.post("/:user_id", notesController.create);


module.exports = notesRoutes;