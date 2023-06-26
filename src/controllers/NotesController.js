const { request, response } = require("express");
const knex = require("../database/knex");

class NotesController{
   // Criar uma nota, com suas tags e links
   async create(request, response) {
      const { title, description, tags, links } = request.body;
      const { user_id } = request.params;

      // colocar a variável como um array, pois o insert devolve dentro de um array
      const [note_id] = await knex("notes").insert({
         title,
         description,
         user_id
      })

      const linkInsert = links.map(link => {
         return {
            note_id,
            url: link
         };
      });

      await knex("links").insert(linkInsert);


      const tagsInsert = tags.map(name => {
         return {
            note_id,
            name,
            user_id
         };
      });

      await knex("tags").insert(tagsInsert);


      response.json();
   };

   // Mostrar uma nota com suas tags e links
   async show(request, response) {
      const { id } = request.params;

      // Selecionar a nota usando o knex. Buscar as notas baseadas no id.
      const note = await knex("notes").where({ id }).first();

      // Pegando as tags com knex
      const tags = await knex("tags").where({ note_id: id }).orderBy("name");

      // Pegando os links
      const links = await knex("links").where({ note_id: id }).orderBy("created_at");

      return response.json({
         ...note,
         tags,
         links
      });
   };

   // Deletar uma nota
   async delete(request, response) {
      const { id } = request.params;

      await knex("notes").where({ id }).delete();

      return response.json();
   };

   // Listar as notes existentes do usuário
    async index( request, response) {
      const { title, user_id, tags } = request.query;

      let notes;

      if(tags) {
         const filterTags = tags.split(',').map(tag => tag.trim());

         notes = await knex("tags")
            .select([
               "notes.id",
               "notes.title",
               "notes.user_id",
            ])
            .where("notes.user_id", user_id)
            .whereLike("notes.title", `%${title}%`)
            .whereIn("name", filterTags)
            .innerJoin("notes", "notes.id", "tags.note_id")
            .orderBy("notes.title")

      } else {
         notes =  await knex("notes")
         .where({ user_id })
         .whereLike("title", `%${title}%`) // Para pesquisar pelo title, e não ter que digitar exatamente igual ao title
         .orderBy("title");
      };

      const userTags = await knex("tags").where({ user_id })
      const notesWithTags = notes.map(note => {
         const noteTags = userTags.filter(tag => tag.note_id === note.id)

         return {
            ...note,
            tags: noteTags
         }
      })

      return response.json(notesWithTags);
    }
};

module.exports = NotesController;