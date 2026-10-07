// ─────────────────────────────────────────────────────────────
//  Rutas de contactos. Los stubs responden 501 a propósito:
//  son los que tienes que construir.
// ─────────────────────────────────────────────────────────────
import { Router } from 'express';

import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/contacts  —  PÚBLICO
// Recibe el formulario de contacto y lo guarda en la base de datos.
// TODO: valida en el servidor (no confíes solo en el front) y guarda.
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

// GET /api/contacts  —  PROTEGIDO (vista de administración)
// Devuelve los contactos guardados, del más reciente al más antiguo.
// TODO: léelos de la base de datos y devuélvelos.
router.get('/', requireAuth, (req, res, next) => {
  try {
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
