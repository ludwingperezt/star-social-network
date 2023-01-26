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

En este proyecto la autenticación no es parte de los datos de usuario sino que es
almacenada en una tabla independiente.

## Documentación

Para documentar la API se usa el standar OpenAPI de swagger. Para buscar una plantilla
para la documentación se puede ir a la siguiente URL:
[Swagger Editor](https://editor.swagger.io)

## Gestión de microservicios con pm2

pm2 es una herramienta que permite gestionar todos los microservicios en producción.

### Comandos

* ´´´pm2 status´´´ para ver el estado de los microservicios gestionados

* ´´´pm2 logs <id del proceso>´´´ Para ver los logs de un microservicio

* ´´´pm2 stop <id del proceso>´´´ Para detener uno o varios microservicios

* ´´´pm2 restart <id del proceso>´´´ Para reiniciar algún microservicio.

## Despliegue en un servidor

1. Instalar node
2. Instalar git
3. Instalar pm2
4. Clonar el proyecto desde git
5. Instalar las dependencias
6. Iniciar los servicios con pm2
7. Instalar nginx como reverse proxy
8. Configurar las rutas de nginx para que funcione como un reverse proxy
    - Modificar el archivo /etc/nginx/sites-available/default y agregar lo siguiente:
        ´´´
        location /api/user {
            proxy_pass http://localhost:3000
        }

        location /api/auth {
            proxy_pass http://localhost:3000
        }

        location /api/posts {
            proxy_pass http://localhost:3002
        }
        ´´´
    - Reiniciar nginx