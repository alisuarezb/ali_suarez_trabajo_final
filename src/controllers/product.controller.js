// controller
import productService from "../services/product.service.js";

// Obtener todos los productos
const getProducts = async (req, res) => {
  try {
    const products = await productService.getAll();
    res.status(200).json({ 
      success: true,
      message: "Lista de productos obtenida exitosamente", 
      data: products,
      count: products.length
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Error interno del servidor al obtener productos", 
      error: error.message 
    });
  }
};

// Obtener un producto por ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID del producto es requerido"
      });
    }

    const product = await productService.getById(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado"
      });
    }

    res.status(200).json({ 
      success: true,
      message: "Producto encontrado", 
      data: product 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Error interno del servidor al obtener el producto", 
      error: error.message 
    });
  }
};

// Crear un nuevo producto
const createProduct = async (req, res) => {
  try {
    const { nombre, precio, descripcion, categoria, disponible } = req.body;
    
    // Validar campos requeridos
    if (!nombre || !precio) {
      return res.status(400).json({
        success: false,
        message: "Los campos 'nombre' y 'precio' son requeridos"
      });
    }

    if (precio <= 0) {
      return res.status(400).json({
        success: false,
        message: "El precio debe ser mayor a 0"
      });
    }

    const newProduct = {
      nombre: nombre.trim(),
      precio: parseFloat(precio),
      descripcion: descripcion?.trim() || "",
      categoria: categoria?.trim() || "General",
      disponible: disponible !== undefined ? Boolean(disponible) : true,
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString()
    };

    const createdProduct = await productService.createProduct(newProduct);
    
    res.status(201).json({ 
      success: true,
      message: "Producto creado exitosamente", 
      data: createdProduct 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Error interno del servidor al crear el producto", 
      error: error.message 
    });
  }
};

// Actualizar un producto
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID del producto es requerido"
      });
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Debe proporcionar al menos un campo para actualizar"
      });
    }

    // Validar precio si se proporciona
    if (updateData.precio !== undefined && updateData.precio <= 0) {
      return res.status(400).json({
        success: false,
        message: "El precio debe ser mayor a 0"
      });
    }

    const updatedProduct = await productService.updateProduct(id, updateData);
    
    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado"
      });
    }

    res.status(200).json({ 
      success: true,
      message: "Producto actualizado exitosamente", 
      data: updatedProduct 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Error interno del servidor al actualizar el producto", 
      error: error.message 
    });
  }
};

// Eliminar un producto
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID del producto es requerido"
      });
    }

    const deleted = await productService.deleteProduct(id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado"
      });
    }

    res.status(200).json({ 
      success: true,
      message: "Producto eliminado exitosamente"
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Error interno del servidor al eliminar el producto", 
      error: error.message 
    });
  }
};

export default { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct 
};
