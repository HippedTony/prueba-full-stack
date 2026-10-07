/**
 * Middleware de autenticación básica.
 *
 * Protege las rutas administrativas de la API validando las credenciales
 * recibidas en el header Authorization contra las variables de entorno.
 */
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

  return next();
}
