// model
import { db } from "../config/db.js";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  query,
  where,
  orderBy
} from "firebase/firestore";

const userCollection = collection(db, "usuarios");

// Obtener todos los usuarios
export const getAllUsers = async () => {
  try {
    const q = query(userCollection, orderBy("fechaCreacion", "desc"));
    const userList = await getDocs(q);
    const users = [];
    
    userList.forEach((doc) => {
      users.push({ 
        id: doc.id, 
        ...doc.data() 
      });
    });

    return users;
  } catch (error) {
    throw new Error(`Error al obtener usuarios de Firestore: ${error.message}`);
  }
};

// Obtener un usuario por email
export const getUserByEmail = async (email) => {
  try {
    const q = query(userCollection, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const userDoc = querySnapshot.docs[0];
    return {
      id: userDoc.id,
      ...userDoc.data()
    };
  } catch (error) {
    throw new Error(`Error al obtener usuario por email de Firestore: ${error.message}`);
  }
};

// Obtener un usuario por ID
export const getUserById = async (id) => {
  try {
    const userDoc = doc(userCollection, id);
    const userSnapshot = await getDoc(userDoc);
    
    if (!userSnapshot.exists()) {
      return null;
    }
    
    return {
      id: userSnapshot.id,
      ...userSnapshot.data()
    };
  } catch (error) {
    throw new Error(`Error al obtener usuario por ID de Firestore: ${error.message}`);
  }
};

// Guardar un nuevo usuario
export const saveUser = async (user) => {
  try {
    const docRef = await addDoc(userCollection, user);
    
    // Retornar el usuario creado con su ID (sin la contraseña)
    const { contraseña, ...userWithoutPassword } = user;
    return {
      id: docRef.id,
      ...userWithoutPassword
    };
  } catch (error) {
    throw new Error(`Error al guardar usuario en Firestore: ${error.message}`);
  }
};

// Verificar si un email ya existe
export const emailExists = async (email) => {
  try {
    const user = await getUserByEmail(email);
    return user !== null;
  } catch (error) {
    throw new Error(`Error al verificar email en Firestore: ${error.message}`);
  }
};