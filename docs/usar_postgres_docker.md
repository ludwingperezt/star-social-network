# Como utilizar Postgres con Docker

Para los que quieran usar postgres, yo lo hice así:

1.  Configurar el archivo de docker-compose para definir los servicios.
    El archivo de ejemplo también contiene un servicio para la administración
    del servidor Postgres vía web a través de pgAdmin 4, al que se puede acceder
    a través de http://localhost:5050
    Las credenciales de acceso son: 
    correo electrónico: admin@admin.com
    contraseña: postgres
```
version: "3.7"
services:
  postgres:
    image: postgres:11
    volumes:
      - type: volume
        source: platzi_node_practico_postgres_data
        target: /var/lib/postgresql/data
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_PASSWORD=postgres
  pgadmin:
    image: dpage/pgadmin4
    depends_on:
      - postgres
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@admin.com
      PGADMIN_DEFAULT_PASSWORD: postgres
    ports:
      - "5050:80"
volumes:
  platzi_node_practico_postgres_data:
```

2.  Configurar las variables de entorno generales en config.js
```
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
  }
}
```
3.  Instalar el driver de conexión de Postgres:
```
npm i express pg
```
4.  Crear el pool de conexión en el archivo postgres.js
    Es necesario configurar el schema (por defecto es public) porque de no hacerlo, al consultar la tabla
    user se retorna la lista de usuarios de la base de datos y no los que hemos definido en nuestra tabla
    user.

```
const { Pool } = require('pg');
const config = require('../config');

const SCHEMA = config.postgres.schema;

const dbconf = {
  host: config.postgres.host,
  user: config.postgres.user,
  password: config.postgres.password,
  database: config.postgres.database,
  port: config.postgres.port,
};

const pool = new Pool(dbconf);

function handleCon(){
  // Función para gestionar la conexión con la base de datos
  pool.connect((err) => {
    if (err) {
      console.error('[ERROR]', err);
      setTimeout(handleCon, 2000);
    } else {
      console.log('DB Connected');
    }
  });
}

handleCon();

function list(table) {
  return pool.query(`SELECT * FROM ${SCHEMA}.${table}`)
    .then(res => {
      // Es necesario retornar una promesa que contenga solo el resultado de la
      // consulta, de lo contrario se retornará el objeto que contiene toda la 
      // consulta, la cual está formada por los datos en la tabla y otros 
      // adicionales.
      return res.rows;
    });
}

module.exports = {
  list,
};
```

Fuentes
 * [https://node-postgres.com/features/pooling](https://node-postgres.com/features/pooling)
 * [https://blog.logrocket.com/nodejs-expressjs-postgresql-crud-rest-api-example/](https://blog.logrocket.com/nodejs-expressjs-postgresql-crud-rest-api-example/)
 * Comentario de @jonathandev