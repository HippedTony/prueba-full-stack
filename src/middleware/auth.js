// ─────────────────────────────────────────────────────────────
//  Autenticación de la vista de administración.
//  AHORA MISMO NO PROTEGE NADA: es tu trabajo implementarla.
// ─────────────────────────────────────────────────────────────

// TODO (candidato): implementa una autenticación simple para proteger
// el listado de contactos (Basic Auth o un login sencillo).
// Tienes ADMIN_USER / ADMIN_PASSWORD disponibles en el archivo .env.
export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    res.setHeader("WWW-Authenticate", 'Basic realm="Admin"');

    return res.status(401).json({
      error: "Authentication required"
    })
  }

  const encodedCredentials = authHeader.split(" ")[1]

  const decodedCredentials = Buffer.from(
    encodedCredentials,
    "base64"
  ).toString("utf-8")

  const separatorIndex = decodedCredentials.indexOf(":")

  const username = decodedCredentials.slice(0, separatorIndex);
  const password = decodedCredentials.slice(separatorIndex + 1);

  if (username !== process.env.ADMIN_USER || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({
      error: 'Invalid credentials'
    })
  }
  // console.warn('[auth] ⚠  Ruta SIN PROTECCIÓN: falta implementar requireAuth()');
  // TODO: reemplaza esta línea por una verificación real
  //       (y responde 401 cuando las credenciales no sean válidas).
  return next();
}
