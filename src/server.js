/**
 * Punto de entrada de la aplicación.
 *
 * Configura e inicia la API de Express utilizada por el gestor de contactos.
 */
import 'dotenv/config';
import express from 'express';
import cors from 'cors'
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import db from './db.js';
import contactsRouter from './routes/contacts.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 4000;

// Permite peticiones desde el frontend de Next.js durante el desarrollo local.
app.use(
  cors({
    origin: "http://localhost:3000"
  })
)

// Lectura del body en JSON y en formularios.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sirve el front-end estático desde src/public (opción "vanilla").
// Si prefieres Astro / Next / Svelte, puedes ignorar esta carpeta
// y montar tu front como quieras: solo debe consumir tu propia API.
app.use(express.static(path.join(__dirname, 'public')));

// Healthcheck — úsalo para confirmar que todo arranca bien.
app.get('/health', (req, res) => {
  res.json({ status: 'ok', db: db.open });
});

// Rutas de la API.
app.use('/api/contacts', contactsRouter);

app.listen(PORT, () => {
  console.log(`▶  Servidor en http://localhost:${PORT}`);
  console.log(`   Healthcheck:  http://localhost:${PORT}/health`);
});
