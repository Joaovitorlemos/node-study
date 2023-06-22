exports.up = knex => knex.schema.createTable("links", table => {
   table.increments("id");
   table.text("url").notNullable(); // Para não receber um valor nulo

   table.integer("note_id").references("id").inTable("notes").onDelete("CASCADE"); // Para deletar automaticamente uma tag. Ex: Se eu deletar uma note, automaticamente eu deleto as tags que tinham naquela note
   table.timestamp("created_at").defaultTo(knex.fn.now());
});


exports.down = knex => knex.schema.dropTable("links");

