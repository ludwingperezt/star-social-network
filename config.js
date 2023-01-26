module.exports = {
  api: {
    port: process.env.API_PORT || 3000
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'Texto super secreto!'
  },
  postgres: {
    host: process.env.POSTGRES_HOST || 'localhost',
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
    database: process.env.POSTGRES_DB || 'postgres',
    port: process.env.POSTGRES_PORT || '5432',
    schema: process.env.POSTGRES_SCHEMA || 'public',
  },
  mysql: {
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'root',
    database: process.env.MYSQL_DB || 'mydb',
    port: process.env.MYSQL_PORT || '3306'
  },
  postgresService: {
    host: process.env.POSTGRES_SRV_HOST || 'localhost',
    port: process.env.POSTGRES_SRV_PORT || 3001
  },
  post: {
    port: process.env.POST_PORT || 3002
  },
}