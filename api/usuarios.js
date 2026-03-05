import { sql } from '@vercel/postgres';

export default async function handler(req, res) {

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

      res.status(500).json({
        error: "Error al obtener usuarios"
      });

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

      res.status(500).json({
        error: "Error al insertar usuario"
      });

    }

  }

  // =============================
  // Otros métodos
  // =============================
  else {

    res.status(405).json({
      error: "Método no permitido"
    });

  }

}