## Crear usuario administrador

Para crear un usuario administrador inicial en la base de datos, ejecuta el siguiente script:

```bash
node create-admin.js
```

Esto creará un usuario con:
- Email: `admin@example.com`
- Contraseña: `admin123`
- Rol: `admin`

Puedes usar estas credenciales para autenticación y administración de productos desde el inicio.

# API REST de Gestión de Productos

API REST para administrar productos y usuarios, con autenticación JWT y Firestore como base de datos. Arquitectura escalable por capas y manejo centralizado de errores.

## Características principales

- Express para servidor y rutas
- Firebase Firestore como base de datos en la nube
- Arquitectura por capas: rutas, controladores, servicios, modelos, middlewares
- Autenticación JWT y autorización por roles (admin, editor, usuario)
- Manejo centralizado de errores y validación de datos
- CORS habilitado para peticiones cruzadas
- Documentación completa en archivos markdown

## Instalación y configuración

1. Clona el repositorio:
   ```bash
   git clone https://github.com/alisuarezb/ali_suarez_trabajo_final.git
   cd ali_suarez_trabajo_final
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura Firebase:
   - Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
   - Habilita Firestore Database
   - Crea una colección llamada `productos`
   - Obtén las credenciales y colócalas en `.env` (ver ejemplo abajo)

4. Configura variables de entorno:
   - Copia `.env.example` a `.env` y completa tus credenciales:
     ```bash
     cp .env.example .env
     ```
   - Edita `.env`:
     ```env
     # Firebase
     APIKEY=tu_api_key_aqui
     AUTHDOMAIN=tu_proyecto.firebaseapp.com
     PROJECTID=tu_proyecto_id
     STORAGEBUCKET=tu_proyecto.appspot.com
     MESSAGINGSENDERID=123456789
     APPID=1:123456789:web:abcdef123456
     MEASUREMENTID=G-ABCDEF123

     # Servidor
     PORT=5000
     NODE_ENV=development

     # JWT
     JWT_SECRET=tu_clave_secreta_muy_segura
     JWT_EXPIRES_IN=24h
     ```

## Comandos útiles

- Iniciar servidor en producción:
  ```bash
  npm start
  ```
- Iniciar servidor en desarrollo (con Nodemon):
  ```bash
  npm run dev
  ```
- Probar la API:
  ```bash
  node test-api.js
  ```

## Estructura del proyecto

```plaintext
src/
├── config/           # Configuración de Firebase
├── controllers/      # Lógica de respuesta (productos, usuarios)
├── services/         # Lógica de negocio
├── models/           # Acceso a datos (Firestore)
├── routes/           # Definición de rutas
├── middlewares/      # Autenticación JWT y manejo de errores
├── utils/            # Funciones auxiliares
└── index.js          # Punto de entrada del servidor
```

## Endpoints principales

### Autenticación
- `POST /auth/login` - Login de usuario, devuelve token JWT
- `POST /auth/register` - Registro de usuario

### Productos
- `GET /api/products` - Obtener todos los productos (pública)
- `GET /api/products/:id` - Obtener producto por ID (pública)
- `POST /api/products/create` - Crear producto (**requiere autenticación y rol admin/editor**)
- `PUT /api/products/:id` - Actualizar producto (**requiere autenticación y rol admin/editor**)
- `DELETE /api/products/:id` - Eliminar producto (**requiere autenticación y rol admin**)

### Usuarios
- `GET /api/users` - Obtener todos los usuarios (**requiere autenticación**)
- `GET /api/users/:id` - Obtener usuario por ID (**requiere autenticación**)

## Ejemplo de uso: crear producto

```bash
curl -X POST http://localhost:5000/api/products/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <tu_token>" \
  -d '{
    "nombre": "Smartphone Samsung",
    "precio": 599.99,
    "descripcion": "Smartphone con pantalla AMOLED",
    "categoria": "Electrónicos",
    "disponible": true
  }'
```

## Estructura de datos de producto

```json
{
  "nombre": "string (requerido)",
  "precio": "number (requerido, > 0)",
  "descripcion": "string (opcional)",
  "categoria": "string (opcional)",
  "disponible": "boolean (opcional, default: true)",
  "fechaCreacion": "string (ISO date)",
  "fechaActualizacion": "string (ISO date)"
}
```

## Manejo de errores

La API responde con los siguientes códigos de estado:
- **200**: Operación exitosa
- **201**: Recurso creado
- **400**: Solicitud incorrecta
- **401**: No autenticado
- **403**: No autorizado
- **404**: No encontrado
- **500**: Error del servidor

## Documentación adicional

- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md): Documentación completa de la API
- [AUTH_DOCUMENTATION.md](./AUTH_DOCUMENTATION.md): Documentación de autenticación y roles

## Licencia

Este proyecto está licenciado bajo la licencia MIT. Consulta el archivo [LICENSE](./LICENSE) para más detalles.
