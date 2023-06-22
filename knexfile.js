const path = require("path")

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: path.resolve(__dirname, "src", "database", "database.db")
    },
    pool: {
      // Adicionando essa funcionalidade para conseguir deletar em "CASCADE" no SQLite. Porque por padrão no SQLite essa função está desabilitada.
      afterCreate: (connection, callback) => connection.run("PRAGMA foreign_keys = ON", callback)
    },
    migrations: {
      directory: path.resolve(__dirname, "src", "database", "knex", "migrations")
    },
    useNullAsDefault: true
  }
};
