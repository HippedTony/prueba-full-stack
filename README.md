# Mini Gestor de Contactos

Aplicación Full Stack desarrollada como prueba técnica para gestionar contactos o leads enviados desde un formulario público.

El flujo principal de la aplicación es:

```text
Formulario público → API propia → SQLite → Panel de administración
```

La aplicación permite registrar contactos mediante un formulario público y posteriormente consultarlos desde un panel de administración protegido mediante autenticación básica.

---

## Tecnologías utilizadas

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend

- Node.js (Express)

### Base de datos

- SQLite

### Autenticación

- HTTP Basic Authentication

---

## Funcionalidades

### Formulario público

El formulario permite registrar un nuevo contacto utilizando:

- Nombre
- Correo electrónico
- Mensaje

Incluye validación tanto en el cliente como en el servidor.

Al enviar correctamente el formulario, la información es enviada a la API y almacenada en SQLite.

---

### Panel de administración

El panel de administración permite:

- Iniciar sesión mediante usuario y contraseña.
- Consultar todos los contactos registrados inicialmente del más reciente al más antiguo.
- Buscar contactos por nombre o por correo electrónico.
- Ordenar contactos del más reciente al más antiguo y viceversa.
- Cerrar sesión.
- Navegar entre el formulario público y el panel de administración.

---

## Estructura general del proyecto

```text
prueba-full-stack/
│
├── db/
│   └── app.sqlite
│
├── frontend/
│   ├── src/
│   │   └── app/
│   │       ├── page.tsx
│   │       └── admin/
│   │           └── page.tsx
│   │
│   └── package.json
│
├── src/
│   ├── middleware/
│   │   └── auth.js
│   │
│   ├── routes/
│   │   └── contact.js
│   │
│   ├── db.js
│   └── server.js
│
├── .env
└── package.json
```

---

# Instalación y ejecución local

## 1. Requisitos

Es necesario tener instalado:

- Node.js
- npm
- Git

Se necesita la version 18 o superior de Node.js para ejecutar la aplicación.

---

## 2. Clonar el repositorio

```bash
git clone https://github.com/HippedTony/prueba-full-stack.git
```

Entrar al proyecto:

```bash
cd prueba-full-stack
```

---

## 3. Instalar dependencias del backend

Desde la raíz del proyecto:

```bash
npm install
```

---

## 4. Configurar las variables de entorno del backend

Crear un archivo `.env` en la raíz del proyecto si no existe.

Ejemplo:

```env
PORT=4000

DATABASE_PATH=./db/app.sqlite

ADMIN_USER=admin
ADMIN_PASSWORD=admin123
```

Estas credenciales son utilizadas para acceder al panel de administración.

---

## 5. Ejecutar el backend

Desde la raíz:

```bash
npm run dev
```

La API estará disponible en:

```text
http://localhost:4000
```

Para verificar que el backend se encuentra activo:

```text
GET http://localhost:4000/health
```

La respuesta esperada es:

```json
{
  "status": "ok"
}
```

---

## 6. Instalar dependencias del frontend

Abrir otra terminal y entrar a:

```bash
cd frontend
```

Instalar las dependencias:

```bash
npm install
```

---

## 7. Configurar las variables de entorno del frontend

Dentro de la carpeta `frontend` crear:

```text
.env.local
```

Agregar:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

Esta variable indica al frontend dónde se encuentra la API de Express.

---

## 8. Ejecutar el frontend

Dentro de la carpeta `frontend`:

```bash
npm run dev
```

La aplicación estará disponible normalmente en:

```text
http://localhost:3000
```

# Decisiones técnicas

## Express como backend independiente

Se decidió utilizar Express en lugar de implementar el backend mediante las API Routes de Next.js.

Esto permite mantener claramente separadas las responsabilidades:

```text
Next.js
Frontend

↓

Express
API y reglas de negocio

↓

SQLite
Persistencia
```

Además, permite demostrar explícitamente la comunicación entre frontend y backend mediante HTTP y JSON.

---

## SQLite con better-sqlite3

SQLite fue utilizado ya que se tenía preconfigurado un archivo de base de datos vacío y no se requería un sistema de base de datos más complejo.

---

## Consultas parametrizadas

Para insertar información en SQLite se utilizan consultas parametrizadas.

Por ejemplo:

```sql
INSERT INTO contacts (name, email, message)
VALUES (?, ?, ?)
```

Esto evita construir las consultas SQL concatenando directamente información proporcionada por el usuario.

---

## Basic Authentication

Para proteger la vista administrativa se utilizó Basic Authentication.

Esta decisión se tomó porque el alcance de la prueba solicitaba un login simple o Basic Auth y se buscó mantener una solución pequeña y fácil de revisar.

Las credenciales no están definidas directamente en el código, sino mediante variables de entorno:

```env
ADMIN_USER
ADMIN_PASSWORD
```

---

## Filtros del lado del cliente

La búsqueda y el cambio de orden del panel administrativo se realizan en el frontend.

La búsqueda funciona utilizando nombre o correo electrónico.

Esta solución se eligió porque el volumen esperado de información para esta prueba es pequeño y evita realizar una nueva petición a la API cada vez que el usuario escribe una letra o modifica el orden.

---

# Uso de Inteligencia Artificial

Durante el desarrollo utilicé herramientas de Inteligencia Artificial como apoyo al proceso de implementación.

La IA fue utilizada principalmente para:

- Revisar la estructura inicial del proyecto.
- Revisar validaciones tanto del cliente como del servidor.
- Proponer mejoras de organización y legibilidad del código.
- Revisar la implementación de filtros y ordenamiento.
- Apoyar en la elaboración de esta documentación.

Las propuestas fueron revisadas, modificadas e integradas según los requerimientos y estructura particular del proyecto.

La IA fue utilizada como una herramienta de apoyo similar a consultar documentación, mientras que las decisiones finales sobre arquitectura, integración y funcionamiento fueron tomadas durante el desarrollo.

---

# Tiempo de desarrollo

### Desarrollo principal

Aproximadamente:

```text
2 horas
```

Durante este tiempo se implementaron los requerimientos principales:

- Configuración de SQLite.
- Persistencia de contactos.
- API con Express.
- Validaciones en frontend.
- Validaciones en backend.
- Formulario público.
- Panel de administración.
- Basic Authentication.
- Manejo básico de errores.
- Integración entre Next.js y Express.

### Funcionalidades adicionales

Después de completar los requerimientos principales se utilizaron aproximadamente:

```text
15 minutos
```

para agregar:

- Navegación entre formulario y panel administrativo.
- Botón de logout.
- Búsqueda de contactos por nombre o correo.
- Cambio de orden entre más reciente y más antiguo.

### Documentación

Finalmente se utilizaron aproximadamente:

```text
15 minutos
```

para documentar:

- Instalación.
- Ejecución local.
- Arquitectura.
- API.
- Decisiones técnicas.
- Uso de Inteligencia Artificial.

---
