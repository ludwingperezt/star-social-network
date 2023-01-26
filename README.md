# NodeSocial

NodeSocial es una red social prototipo desarrollada como un proyecto de demostración
de una aplicación completa escrita en Node.js.

Proyecto del curso Node.js práctico de platzi.

Para encender el proyecto general (puerto 3000):
´´´
nodemon api/index.js
´´´

Para encender la API de acceso a la base de datos (puerto 3001):
´´´
nodemon postgres/index.js
´´´


Para encender el microservicio de posts (puerto 3002):
´´´
nodemon posts/index.js
´´´

O con pm2:
´´´
pm2 start api/index.js --name servicio-principal
´´´

´´´
pm2 start mysql/index.js --name servicio-datos
´´´

´´´
pm2 start posts/index.js --name servicio-posts
´´´

