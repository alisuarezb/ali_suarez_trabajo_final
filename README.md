# API REST de Gestión de Productos

API REST completa para la gestión de productos con Firebase Firestore, implementando una arquitectura escalable por capas con autenticación y manejo de errores.

## Características

- **Express** para gestionar rutas y middleware
- **Firebase Firestore** como base de datos en la nube
- **Arquitectura por capas** (rutas, controladores, servicios, modelos)
- **Autenticación JWT** con roles de usuario
- **Manejo centralizado de errores**
- **Validación de datos**
- **CORS** configurado para peticiones de origen cruzado
- **Documentación completa de la API**

## Instalación y Configuración

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar Firebase

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilita Firestore Database
3. Crea una colección llamada `productos`
4. Obtén las credenciales de configuración

### 3. Configurar variables de entorno

Copia el archivo `.env.example` a `.env` y completa con tus credenciales:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus datos de Firebase:

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

# Configuración JWT
JWT_SECRET=tu_clave_secreta_muy_segura_cambiala_en_produccion
JWT_EXPIRES_IN=24h
```

## Comandos disponibles

### Iniciar el servidor en producción

```bash
npm start
```

### Iniciar el servidor en desarrollo (con Nodemon)

```bash
npm run dev
```

### Probar la API

```bash
node test-api.js
```

### Actualizar dependencias (Opcional)

Para poder todas estas dependencias a su última versión, deberás instalar un paquete llamado `npm-check-updates` de forma global:

```bash
npm install -g npm-check-updates
```

Una vez instalado deberás correr el siguiente comando:

```bash
ncu -u
```

Esto modificará tu archivo package.json para que todas las dependencias estén listadas en sus últimas versiones.

Una vez completado este proceso, basta con ejecutar el siguiente comando para actualizar todas tus dependencias:

```bash
npm install
```

## Estructura del proyecto

```plaintext
src/
├── config/                    # Configuraciones
│   └── db.js                 # Configuración de Firebase Firestore
│
├── controllers/              # Controladores (lógica de respuesta)
│   ├── product.controller.js # Controlador de productos
│   └── user.controller.js    # Controlador de usuarios
│
├── services/                 # Servicios (lógica de negocio)
│   ├── product.service.js    # Servicio de productos
│   └── user.service.js       # Servicio de usuarios
│
├── models/                   # Modelos (acceso a datos)
│   ├── product.model.js      # Modelo de productos
│   └── user.model.js         # Modelo de usuarios
│
├── routes/                   # Definición de rutas
│   ├── product.route.js      # Rutas de productos
│   ├── auth.routes.js        # Rutas de autenticación
│   └── user.routes.js        # Rutas de usuarios
│
├── middlewares/              # Middlewares personalizados
│   ├── auth.middleware.js    # Autenticación JWT
│   └── error.middleware.js   # Manejo de errores
│
├── utils/                    # Utilidades
│   └── index.js             # Funciones auxiliares
│
└── index.js                 # Punto de entrada del servidor
```

## API Endpoints

Todas las rutas son públicas y no requieren autenticación:

- `GET /api/products` - Obtener todos los productos
- `GET /api/products/:id` - Obtener producto por ID
- `POST /api/products/create` - Crear producto
- `PUT /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Eliminar producto

## Estructura de Datos

Los productos tienen la siguiente estructura:

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

## Manejo de Errores

La API maneja los siguientes códigos de estado:
- **200**: Operación exitosa
- **201**: Recurso creado
- **400**: Solicitud incorrecta
- **404**: No encontrado
- **500**: Error del servidor

## Documentación Completa

Consulta [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) para la documentación completa de la API.
---

## Licencia

Este proyecto está licenciado bajo la licencia **MIT**. Consulta el archivo [LICENSE](./LICENSE) para más detalles.
