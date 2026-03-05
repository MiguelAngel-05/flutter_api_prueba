const { Pool } = require('pg');

// Conexión a tu base de datos Neon usando la variable de entorno
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export default async function handler(req, res) {
  // 1. Manejar el Preflight de CORS (OPTIONS)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 2. GET: Obtener usuarios
  if (req.method === 'GET') {
    try {
      const { rows } = await pool.query('SELECT * FROM usuarios ORDER BY id ASC');
      return res.status(200).json(rows);
    } catch (error) {
      console.error("Error en la BD al hacer GET:", error);
      // Devolvemos el error exacto para saber qué falla
      return res.status(500).json({ error: "Fallo en GET", detalle: error.message });
    }
  } 
  
  // 3. POST: Crear usuario
  else if (req.method === 'POST') {
    try {
      const { nombre } = req.body;
      const { rows } = await pool.query(
        'INSERT INTO usuarios (nombre) VALUES ($1) RETURNING *',
        [nombre]
      );
      return res.status(201).json(rows[0]);
    } catch (error) {
      console.error("Error en la BD al hacer POST:", error);
      return res.status(500).json({ error: "Fallo en POST", detalle: error.message });
    }
  } 
  
  // Método no soportado
  else {
    return res.status(405).json({ error: 'Método no permitido' });
  }
}