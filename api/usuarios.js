import { sql } from '@vercel/postgres';

export default async function handler(req, res) {

  // ==== CORS ====
  res.setHeader('Access-Control-Allow-Origin', '*'); // permite todos los orígenes
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS'); // métodos permitidos
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Manejar preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // =============================
  // GET -> obtener usuarios
  // =============================
  if (req.method === 'GET') {
    try {
      const { rows } = await sql`
        SELECT * FROM usuarios
        ORDER BY id
      `;
      res.status(200).json(rows);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener usuarios" });
    }
  }

  // =============================
  // POST -> crear usuario
  // =============================
  else if (req.method === 'POST') {
    try {
      const { nombre } = req.body;
      const result = await sql`
        INSERT INTO usuarios (nombre)
        VALUES (${nombre})
        RETURNING *
      `;
      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: "Error al insertar usuario" });
    }
  } else {
    res.status(405).json({ error: "Método no permitido" });
  }
}