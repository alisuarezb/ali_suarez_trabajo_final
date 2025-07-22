// model
import { db } from "../config/db.js";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy
} from "firebase/firestore";

const productCollection = collection(db, "productos");

// Obtener todos los productos
export const getAllProducts = async () => {
  try {
    const q = query(productCollection, orderBy("fechaCreacion", "desc"));
    const productList = await getDocs(q);
    const products = [];
    
    productList.forEach((doc) => {
      products.push({ 
        id: doc.id, 
        ...doc.data() 
      });
    });

    return products;
  } catch (error) {
    throw new Error(`Error al obtener productos de Firestore: ${error.message}`);
  }
};

// Obtener un producto por ID
export const getProductById = async (id) => {
  try {
    const productDoc = doc(productCollection, id);
    const productSnapshot = await getDoc(productDoc);
    
    if (!productSnapshot.exists()) {
      return null;
    }
    
    return {
      id: productSnapshot.id,
      ...productSnapshot.data()
    };
  } catch (error) {
    throw new Error(`Error al obtener producto por ID de Firestore: ${error.message}`);
  }
};

// Guardar un nuevo producto
export const saveProduct = async (product) => {
  try {
    const docRef = await addDoc(productCollection, product);
    
    // Retornar el producto creado con su ID
    return {
      id: docRef.id,
      ...product
    };
  } catch (error) {
    throw new Error(`Error al guardar producto en Firestore: ${error.message}`);
  }
};

// Actualizar un producto
export const updateProduct = async (id, updateData) => {
  try {
    const productDoc = doc(productCollection, id);
    
    // Verificar si el documento existe
    const productSnapshot = await getDoc(productDoc);
    if (!productSnapshot.exists()) {
      return null;
    }
    
    // Actualizar el documento
    await updateDoc(productDoc, updateData);
    
    // Retornar el producto actualizado
    const updatedSnapshot = await getDoc(productDoc);
    return {
      id: updatedSnapshot.id,
      ...updatedSnapshot.data()
    };
  } catch (error) {
    throw new Error(`Error al actualizar producto en Firestore: ${error.message}`);
  }
};

// Eliminar un producto
export const deleteProduct = async (id) => {
  try {
    const productDoc = doc(productCollection, id);
    
    // Verificar si el documento existe
    const productSnapshot = await getDoc(productDoc);
    if (!productSnapshot.exists()) {
      return false;
    }
    
    // Eliminar el documento
    await deleteDoc(productDoc);
    return true;
  } catch (error) {
    throw new Error(`Error al eliminar producto de Firestore: ${error.message}`);
  }
};
