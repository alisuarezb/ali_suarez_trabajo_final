// services
import { 
  getAllProducts, 
  getProductById, 
  saveProduct, 
  updateProduct, 
  deleteProduct 
} from "../models/product.model.js";

const getAll = async () => {
  try {
    return await getAllProducts();
  } catch (error) {
    throw new Error(`Error en el servicio al obtener productos: ${error.message}`);
  }
};

const getById = async (id) => {
  try {
    return await getProductById(id);
  } catch (error) {
    throw new Error(`Error en el servicio al obtener producto por ID: ${error.message}`);
  }
};

const createProduct = async (product) => {
  try {
    return await saveProduct(product);
  } catch (error) {
    throw new Error(`Error en el servicio al crear producto: ${error.message}`);
  }
};

const updateProductService = async (id, updateData) => {
  try {
    // Agregar fecha de actualización
    const dataToUpdate = {
      ...updateData,
      fechaActualizacion: new Date().toISOString()
    };
    
    return await updateProduct(id, dataToUpdate);
  } catch (error) {
    throw new Error(`Error en el servicio al actualizar producto: ${error.message}`);
  }
};

const deleteProductService = async (id) => {
  try {
    return await deleteProduct(id);
  } catch (error) {
    throw new Error(`Error en el servicio al eliminar producto: ${error.message}`);
  }
};

export default { 
  getAll, 
  getById, 
  createProduct, 
  updateProduct: updateProductService, 
  deleteProduct: deleteProductService 
};
