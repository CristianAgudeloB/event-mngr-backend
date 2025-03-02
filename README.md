
# Gestor de Eventos - Backend

Este proyecto constituye el backend para el Gestor de Eventos, una aplicación que permite crear, visualizar y administrar eventos de forma sencilla. El backend está construido con Node.js, Express, TypeScript y Prisma, ofreciendo una arquitectura modular y escalable.

## Características Principales

- **API RESTful:** Ofrece endpoints para la gestión de usuarios y eventos.
- **Autenticación JWT:** Utiliza tokens para proteger rutas y garantizar el acceso seguro.
- **Prisma como ORM:** Facilita la interacción con la base de datos y la gestión de modelos.
- **Validación con OpenAPI:** Se asegura que las solicitudes cumplan con el esquema definido en `openapi.yaml`.

## Requisitos

- **Node.js** (versión recomendada: LTS)
- **npm** (incluido con Node.js)
- **Base de Datos** (configurable con Prisma; en este caso funciona bajo SQLite)

## Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```
DATABASE_URL="file:./dev.db"
JWT_SECRET="una_clave_secreta_o_segura"
PORT=3000
```
Elie una clave para el JWT_SECRET (o configura la clave por defecto: secret_key)

## Instalación y Configuración

1. **Clona el repositorio** y ubícate en la carpeta del proyecto.
2. **Instala las dependencias**:
   ```bash
   npm install
   ```
3. **Genera y aplica las migraciones de Prisma** (esto creará o actualizará la estructura de tu base de datos):
   ```bash
   npx prisma migrate dev
   ```
   > Si es la primera vez, se te pedirá un nombre para la migración. 
4. **Inicia el servidor de desarrollo**:
   ```bash
   npm run dev
   ```
   El servidor estará disponible por defecto en `http://localhost:3000`, a menos que hayas definido otro puerto en tu archivo `.env`.

## Scripts Disponibles

En el archivo `package.json`, encontrarás los siguientes scripts útiles:

- **`npm run dev`**: Inicia el servidor en modo de desarrollo, recargando automáticamente al detectar cambios.
- **`npm test`**: Ejecuta los tests incluídos en el repositorio.

## Estructura del Proyecto

- **`src/`**  
  - **`controllers/`**: Controladores que manejan la lógica de las rutas y validan la entrada/salida de datos.  
  - **`services/`**: Servicios que contienen la lógica de negocio y se comunican con la base de datos a través de Prisma.  
  - **`routes/`**: Definición de las rutas de la aplicación y su enlace con los controladores.  
  - **`middleware/`**: Middlewares para autenticación, manejo de errores y cualquier lógica transversal.  
  - **`app.ts`**: Configuración principal de Express, incluyendo la inicialización de rutas y middlewares.  
  - **`openapi.yaml`**: Especificación OpenAPI para la validación y documentación de la API.
- **`prisma/`**: Archivos de configuración y migraciones de Prisma.
- **`.env`**: Variables de entorno (no se debe subir al repositorio público).
- **`tests/`**: Carpeta para pruebas (unitarias o de integración).

## Uso de la API

- **Endpoints de Usuarios**: Creación, actualización, eliminación y autenticación de usuarios.
- **Endpoints de Eventos**: Creación, lectura, actualización y eliminación de eventos.
- **Autenticación JWT**: Se requiere un token JWT para acceder a la mayoría de los endpoints, excepto los de registro e inicio de sesión.
