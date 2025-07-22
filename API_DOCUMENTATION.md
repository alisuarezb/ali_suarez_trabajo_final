# API de Gestión de Productos

## Descripción
API REST para la gestión de productos con Firebase Firestore como base de datos. Las rutas GET son públicas, pero las rutas para crear, actualizar y eliminar productos requieren autenticación mediante JWT y roles de usuario.

## Configuración

### Variables de Entorno
Crea un archivo `.env` basado en `.env.example` con tus credenciales de Firebase:

```env
# Configuración de Firebase
APIKEY=tu_api_key_aqui
AUTHDOMAIN=tu_proyecto.firebaseapp.com
PROJECTID=tu_proyecto_id
STORAGEBUCKET=tu_proyecto.appspot.com
MESSAGINGSENDERID=123456789
APPID=1:123456789:web:abcdef123456
MEASUREMENTID=G-ABCDEF123

# Configuración del servidor
PORT=5000
NODE_ENV=development
```

### Instalación
```bash
npm install
npm start
```

## Endpoints de la API

### Rutas de Autenticación (públicas)

#### POST /auth/login
Autentica un usuario y devuelve un token JWT.

**Body requerido:**
```json
{
  "email": "usuario@ejemplo.com",
  "contraseña": "miContraseña123"
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Autenticación exitosa",
  "data": {
    "user": {
      "id": "user_id",
      "nombre": "Juan Pérez",
      "email": "usuario@ejemplo.com",
      "rol": "admin",
      "activo": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "24h"
  }
}
```

#### POST /auth/register
Registra un nuevo usuario.

**Body requerido:**
```json
{
  "nombre": "Juan Pérez",
  "email": "usuario@ejemplo.com",
  "contraseña": "miContraseña123",
  "rol": "usuario"
}
```

### Rutas de Productos

#### Rutas públicas (sin autenticación)

### GET /api/products
Obtiene todos los productos.

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Lista de productos obtenida exitosamente",
  "data": [
    {
      "id": "producto_id",
      "nombre": "Producto Ejemplo",
      "precio": 99.99,
      "descripcion": "Descripción del producto",
      "categoria": "Electrónicos",
      "disponible": true,
      "fechaCreacion": "2025-01-01T00:00:00.000Z",
      "fechaActualizacion": "2025-01-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

### GET /api/products/:id
Obtiene un producto específico por ID.

**Parámetros:**
- `id` (string): ID del producto

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Producto encontrado",
  "data": {
    "id": "producto_id",
    "nombre": "Producto Ejemplo",
    "precio": 99.99,
    "descripcion": "Descripción del producto",
    "categoria": "Electrónicos",
    "disponible": true,
    "fechaCreacion": "2025-01-01T00:00:00.000Z",
    "fechaActualizacion": "2025-01-01T00:00:00.000Z"
  }
}
```

### POST /api/products/create
Crea un nuevo producto.

**Headers requeridos:**
- `Content-Type: application/json`

- `Authorization: Bearer <token>` (requerido, solo usuarios autenticados con rol admin/editor)

**Body requerido:**
```json
{
  "nombre": "Nuevo Producto",
  "precio": 149.99,
  "descripcion": "Descripción opcional",
  "categoria": "Categoría opcional",
  "disponible": true
}
```

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "message": "Producto creado exitosamente",
  "data": {
    "id": "nuevo_producto_id",
    "nombre": "Nuevo Producto",
    "precio": 149.99,
    "descripcion": "Descripción opcional",
    "categoria": "Categoría opcional",
    "disponible": true,
    "fechaCreacion": "2025-01-01T00:00:00.000Z",
    "fechaActualizacion": "2025-01-01T00:00:00.000Z"
  }
}
```

### PUT /api/products/:id
Actualiza un producto existente.

**Headers requeridos:**
- `Content-Type: application/json`

- `Authorization: Bearer <token>` (requerido, solo usuarios autenticados con rol admin/editor)

**Parámetros:**
- `id` (string): ID del producto a actualizar

**Body (campos opcionales):**
```json
{
  "nombre": "Producto Actualizado",
  "precio": 199.99,
  "descripcion": "Nueva descripción",
  "categoria": "Nueva categoría",
  "disponible": false
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Producto actualizado exitosamente",
  "data": {
    "id": "producto_id",
    "nombre": "Producto Actualizado",
    "precio": 199.99,
    "descripcion": "Nueva descripción",
    "categoria": "Nueva categoría",
    "disponible": false,
    "fechaCreacion": "2025-01-01T00:00:00.000Z",
    "fechaActualizacion": "2025-01-22T10:30:00.000Z"
  }
}
```

### DELETE /api/products/:id
Elimina un producto.

**Parámetros:**
- `id` (string): ID del producto a eliminar

**Headers requeridos:**
- `Authorization: Bearer <token>` (requerido, solo usuarios autenticados con rol admin)

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Producto eliminado exitosamente"
}
```

## Códigos de Estado HTTP

- **200**: Operación exitosa
- **201**: Recurso creado exitosamente
- **400**: Solicitud incorrecta (datos inválidos)
- **404**: Recurso no encontrado
- **500**: Error interno del servidor

## Estructura de Errores

```json
{
  "success": false,
  "message": "Descripción del error",
  "statusCode": 400
}
```

## Estructura del Producto en Firebase

Los productos se almacenan en la colección `productos` con la siguiente estructura:

```json
{
  "nombre": "string (requerido)",
  "precio": "number (requerido, > 0)",
  "descripcion": "string (opcional)",
  "categoria": "string (opcional, default: 'General')",
  "disponible": "boolean (opcional, default: true)",
  "fechaCreacion": "string (ISO date)",
  "fechaActualizacion": "string (ISO date)"
}
```

## Ejemplos de Uso

### Crear un producto
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

### Obtener todos los productos
```bash
curl http://localhost:5000/api/products
```

### Obtener un producto por ID
```bash
curl http://localhost:5000/api/products/PRODUCT_ID
```

### Actualizar un producto
```bash
curl -X PUT http://localhost:5000/api/products/PRODUCT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <tu_token>" \
  -d '{
    "precio": 549.99,
    "disponible": false
  }'
```

### Eliminar un producto
```bash
curl -X DELETE http://localhost:5000/api/products/PRODUCT_ID \
  -H "Authorization: Bearer <tu_token>"
```