const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// ESTE ES EL CAMBIO CLAVE: Usamos module.exports
module.exports = async function handler(req, res) {
  
  // 1. Manejar el Preflight de CORS (OPTIONS) para que no devuelva 500
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 2. Petición GET
  if (req.method === 'GET') {
    try {
      const { rows } = await pool.query('SELECT * FROM usuarios ORDER BY id ASC');
      return res.status(200).json(rows);
    } catch (error) {
      console.error("Error en GET:", error);
      return res.status(500).json({ error: "Fallo en BD", detalle: error.message });
    }
  } 
  
  // 3. Petición POST
  else if (req.method === 'POST') {
    try {
      const { nombre } = req.body;
      const { rows } = await pool.query(
        'INSERT INTO usuarios (nombre) VALUES ($1) RETURNING *',
        [nombre]
      );
      return res.status(201).json(rows[0]);
    } catch (error) {
      console.error("Error en POST:", error);
      return res.status(500).json({ error: "Fallo en BD", detalle: error.message });
    }
  } 
  
  else {
    return res.status(405).json({ error: 'Método no permitido' });
  }
};