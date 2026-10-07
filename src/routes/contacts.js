/**
 * Rutas de la API para la gestión de contactos.
 *
 * Incluye endpoints para:
 * - Crear nuevos contactos desde el formulario público.
 * - Consultar todos los contactos desde el panel de administración.
 *
 * POST /api/contacts es público.
 * GET /api/contacts está protegido con autenticación básica.
 */
import { Router } from 'express';

import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * POST /api/contacts
 *
 * Crea un nuevo contacto después de validar y normalizar los datos recibidos.
 *
 * Campos requeridos:
 * - name
 * - email
 * - message
 *
 * Respuestas:
 * - 201 si el contacto se crea correctamente.
 * - 400 si los datos enviados no son válidos.
 * - 500 si ocurre un error inesperado en el servidor.
 */
router.post('/', (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        error: "Name, email and message are required",
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const clearMessage = message.trim();

    if (cleanName.length < 2) {
      return res.status(400).json({
        error: "Name must contain at least 2 characters",
      });
    }

    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        error: "Invalid email",
      });
    }

    if (clearMessage.length < 5) {
      return res.status(400).json({
        error: "Message must contain at least 5 characters",
      });
    }

    // Utiliza una consulta parametrizada para insertar los datos de forma segura.
    const statement = db.prepare(`
        INSERT INTO contacts (name, email, message)
        VALUES (?, ?, ?)
      `);

    const result = statement.run(
      cleanName,
      cleanEmail,
      clearMessage,
    );

    const contact = db.prepare(`
        SELECT * FROM contacts WHERE id = ?
      `)
      .get(result.lastInsertRowid);

    return res.status(201).json({
      message: "Contact created successfully",
      contact
    });
  } catch (error) {
    next(error)
  }
});

/**
 * GET /api/contacts
 *
 * Devuelve todos los contactos almacenados.
 * Este endpoint está protegido mediante autenticación básica.
 *
 * Los contactos se devuelven inicialmente del más reciente al más antiguo.
 */
router.get('/', requireAuth, (req, res, next) => {
  try {
    // Utiliza el id como criterio secundario cuando dos registros tienen la misma fecha.
    const contacts = db.prepare(`
        SELECT * FROM contacts ORDER BY created_at DESC, id DESC
      `)
      .all();

    return res.json({
      contacts,
    });
  } catch (error) {
    next(error)
  }
});

export default router;
