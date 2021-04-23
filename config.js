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
  postgresService: {
    port: process.env.POSTGRES_SRV_PORT || 3001
  }
}