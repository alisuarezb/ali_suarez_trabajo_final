
# Documentación de Autenticación

## Descripción
Sistema de autenticación JWT para la API de gestión de productos y usuarios. Incluye registro, login y protección de rutas por roles.

## Configuración

Agrega estas variables a tu archivo `.env`:
```env
JWT_SECRET=clave_secreta_segura
JWT_EXPIRES_IN=24h
```

## Endpoints principales

### Login de usuario
`POST /auth/login`

**Body:**
```json
{
  "email": "usuario@example.com",
  "contraseña": "password123"
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Autenticación exitosa",
  "data": {
    "user": {
      "id": "user_id",
      "nombre": "Usuario Ejemplo",
      "email": "usuario@example.com",
      "rol": "usuario",
      "activo": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "24h"
  }
}
```

### Registro de usuario
`POST /auth/register`

**Body:**
```json
{
  "nombre": "Nuevo Usuario",
  "email": "nuevo@example.com",
  "contraseña": "password123"
}
```

### Protección de rutas

- Las rutas para crear, actualizar y eliminar productos requieren el header:
  ```
  Authorization: Bearer <token>
  ```
- Los roles válidos son: `admin`, `editor`, `usuario`. Solo `admin` puede eliminar productos.

## Ejemplo de uso

```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "contraseña": "admin123"
  }'
```

## Códigos de estado y errores

- **200**: Operación exitosa
- **201**: Recurso creado
- **400**: Solicitud incorrecta
- **401**: No autenticado
- **403**: No autorizado
- **404**: No encontrado
- **500**: Error interno del servidor

**Ejemplo de error:**
```json
{
  "success": false,
  "message": "Token inválido o expirado",
  "statusCode": 401
}
```

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "message": "Usuario creado exitosamente",
  "data": {
    "id": "user_id",
    "nombre": "Nuevo Usuario",
    "email": "nuevo@example.com",
    "rol": "usuario",
    "activo": true,
    "fechaCreacion": "2025-01-22T10:00:00.000Z"
  }
}
```

### GET /api/users/profile
Obtiene el perfil del usuario autenticado.

**Headers requeridos:**
- `Authorization: Bearer {token}`

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Perfil obtenido exitosamente",
  "data": {
    "id": "user_id",
    "nombre": "Usuario Ejemplo",
    "email": "usuario@example.com",
    "rol": "usuario",
    "activo": true,
    "fechaCreacion": "2025-01-22T10:00:00.000Z"
  }
}
```

### GET /api/users (Solo Admin)
Obtiene todos los usuarios registrados.

**Headers requeridos:**
- `Authorization: Bearer {admin_token}`

### GET /api/users/:id (Solo Admin)
Obtiene un usuario específico por ID.

**Headers requeridos:**
- `Authorization: Bearer {admin_token}`

## Rutas de Productos Protegidas

### Rutas Públicas
- `GET /api/products` - Obtener todos los productos
- `GET /api/products/:id` - Obtener producto por ID

### Rutas Protegidas (Admin/Editor)
- `POST /api/products/create` - Crear producto
- `PUT /api/products/:id` - Actualizar producto

### Rutas Protegidas (Solo Admin)
- `DELETE /api/products/:id` - Eliminar producto

## Roles de Usuario

### usuario
- Acceso a su propio perfil
- Lectura de productos

### editor
- Todo lo de usuario
- Crear y editar productos

### admin
- Todo lo de editor
- Eliminar productos
- Gestionar usuarios
- Acceso completo al sistema

## Estructura del Usuario en Firebase

Los usuarios se almacenan en la colección `usuarios` con la siguiente estructura:

```json
{
  "nombre": "string (requerido)",
  "email": "string (requerido, único)",
  "contraseña": "string (hasheada con bcrypt)",
  "rol": "string (usuario|editor|admin, default: usuario)",
  "activo": "boolean (default: true)",
  "fechaCreacion": "string (ISO date)",
  "fechaActualizacion": "string (ISO date)"
}
```

## Códigos de Estado HTTP

### Autenticación
- **200**: Login exitoso
- **401**: Credenciales inválidas o token expirado
- **403**: Sin permisos suficientes

### Usuarios
- **201**: Usuario creado
- **409**: Email ya registrado
- **400**: Datos de entrada inválidos

## Ejemplos de Uso

### Registrar usuario
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "contraseña": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "contraseña": "password123"
  }'
```

### Obtener perfil
```bash
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Crear producto (requiere auth)
```bash
curl -X POST http://localhost:5000/api/products/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "nombre": "Producto Nuevo",
    "precio": 99.99,
    "descripcion": "Descripción del producto"
  }'
```

## Crear Usuario Administrador

Para crear un usuario administrador inicial, ejecuta:

```bash
node create-admin.js
```

Esto creará un usuario con:
- Email: admin@example.com
- Contraseña: admin123
- Rol: admin

## Pruebas

Para probar el sistema de autenticación:

```bash
node test-auth.js
```