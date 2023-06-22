exports.up = knex => knex.schema.createTable("tags", table => {
   table.increments("id");
   table.text("name").notNullable(); // Para não receber um valor nulo

   table.integer("note_id").references("id").inTable("notes").onDelete("CASCADE"); // Para deletar automaticamente uma tag. Ex: Se eu deletar uma note, automaticamente eu deleto as tags que tinham naquela note
   table.integer("user_id").references("id").inTable("users");
});


exports.down = knex => knex.schema.dropTable("tags");
