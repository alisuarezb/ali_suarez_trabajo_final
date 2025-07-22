
# API de Gestión de Productos

API REST para administrar productos y usuarios, con autenticación JWT y Firestore como base de datos. Las rutas GET son públicas, pero crear, actualizar y eliminar productos requieren autenticación y roles.


## Configuración rápida

1. Instala dependencias:
   ```bash
   npm install
   ```
2. Configura Firebase y variables de entorno en `.env` (ver ejemplo en README.md)
3. Inicia el servidor:
   ```bash
   npm start
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


### Ejemplo: crear producto
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


### Ejemplo: actualizar producto
```bash
curl -X PUT http://localhost:5000/api/products/PRODUCT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <tu_token>" \
  -d '{
    "precio": 549.99,
    "disponible": false
  }'
```


### Ejemplo: eliminar producto
```bash
curl -X DELETE http://localhost:5000/api/products/PRODUCT_ID \
  -H "Authorization: Bearer <tu_token>"
```


## Estructura de datos de producto
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
  "message": "Descripción del error",
  "statusCode": 400
}
```