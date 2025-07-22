//router
import { Router } from "express";
import productController from "../controllers/product.controller.js";
import { authMiddleware, requireRole } from "../middlewares/auth.middleware.js";

const router = Router();

// Rutas públicas (sin autenticación)
// GET /api/products - Obtener todos los productos
router.get("/", productController.getProducts);

// GET /api/products/:id - Obtener un producto por ID
router.get("/:id", productController.getProductById);

// Rutas protegidas (requieren autenticación)
// POST /api/products/create - Crear un nuevo producto
router.post("/create", 
  authMiddleware, 
  requireRole(['admin', 'editor']), 
  productController.createProduct
);

// PUT /api/products/:id - Actualizar un producto
router.put("/:id", 
  authMiddleware, 
  requireRole(['admin', 'editor']), 
  productController.updateProduct
);

// DELETE /api/products/:id - Eliminar un producto (solo admin)
router.delete("/:id", 
  authMiddleware, 
  requireRole(['admin']), 
  productController.deleteProduct
);

export default router;
