import { sql } from '@vercel/postgres';

export default async function handler(req, res) {

  if (req.method === 'GET') {

    try {

      const { rows } = await sql`SELECT * FROM usuarios`;

      res.status(200).json(rows);

    } catch (error) {

      res.status(500).json({ error: "Error al obtener usuarios" });

    }

  }

}