// Script para crear un usuario administrador
// Ejecutar con: node create-admin.js

import bcrypt from "bcryptjs";
import { db } from "./src/config/db.js";
import { collection, addDoc } from "firebase/firestore";

async function createAdmin() {
  try {
    console.log('🔧 Creando usuario administrador...');
    
    // Datos del administrador
    const adminData = {
      nombre: 'Administrador',
      email: 'admin@example.com',
      contraseña: await bcrypt.hash('admin123', 10),
      rol: 'admin',
      activo: true,
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString()
    };
    
    // Guardar en Firestore
    const userCollection = collection(db, "usuarios");
    const docRef = await addDoc(userCollection, adminData);
    
    console.log('✅ Usuario administrador creado exitosamente');
    console.log('📧 Email: admin@example.com');
    console.log('🔑 Contraseña: admin123');
    console.log('🆔 ID:', docRef.id);
    
  } catch (error) {
    console.error('❌ Error al crear administrador:', error.message);
  }
}

createAdmin();