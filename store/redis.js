const redis = require('redis');

const config = require('../config');

// Debido a que redis de momento corre en local con la configuración por
// defecto, no es necesario configurar el string de conexión.
const client = redis.createClient();

/**
 * Esta es una función anónima para generar la conexión con Redis.
 */
(async () => {
    await client.connect();
    console.log('Redis conectado!');
})();

async function list(table) {
    const data = await client.get(table);
    return JSON.parse(data);
    //return JSON.stringify(data)
}

/**
 * Obtiene un valor de la caché (redis).
 * @param {string} table Nombre de la tabla (prefijo de la key) 
 * @param {*} id Nombre del campo (key)
 * @returns {object} objeto almacenado en caaché
 */
async function get(table, id) {
    const key = `${table}_${id}`;
    const data = await client.get(key);
    return JSON.parse(data);
}

/**
 * Inserta o actualiza un valor en la caché.
 * 
 * La key del valor será el nombre de la tabla. Si en los datos
 * a almacenar en caché (que debe ser un objeto) se recibe el campo "id"
 * entonces la key es una combinación del nombre de la tabla con el id
 * separadas por guión bajo.
 * 
 * @param {string} table Nombre de la tabla (prefijo de la key)  
 * @param {object} data objeto a almacenar en caché
 * @returns 
 */
async function upsert(table, data) {
    let key = table;

    if (data && data.id) {
        key = `${key}_${data.id}`;
    }

    await client.set(key, JSON.stringify(data), {
        EX: 10,  // 10 segundos de validez del valor
        NX: false  // setea la key sin importar si existe o no.
    });

    return true;
}

module.exports = {
    list,
    get,
    upsert
}