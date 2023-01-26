# Aplicación de Ejemplo #

Este es un proyecto de ejemplo en el uso de Node.js para el desarrollo de un
backend.  Consta de una red social en la que los usuarios pueden publicar
contenido (posts).

A nivel de arquitectura la aplicación tiene tres elementos comunes para todos 
los componentes:

1. Store: Es lo relativo al almacenamiento a largo plazo
2. Network: Todas las peticiones de red
3. Configuración
4. Microservicios
    4.1. Network: Encargada del enrutamiento
    4.2. Contoller: Lógica de negocio
    4.3. Secure: Todas las reglas de seguridad (posiblemente colocado
            antes del controller).
    4.4. Index.js: Archivo que define cómo se interactua con el microservicio.

En este proyecto la autenticación no es parte de los datos de usuario.

https://editor.swagger.io


pm2 es una herramienta que permite gestionar todos los microservicios en producción.

pm2 status

pm2 logs <id del proceso>

pm2 stop <id del proceso>

pm2 restart <id del proceso>