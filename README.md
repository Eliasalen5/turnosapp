# Sistema Backend de Turnos y Reservas

API REST para administrar servicios y gestionar reservas, construida con Express y MongoDB (Mongoose), con arquitectura en capas, vistas Handlebars y tiempo real mediante Socket.io.

## Stack

- **Node.js + Express** — servidor HTTP y ruteo
- **MongoDB Atlas + Mongoose** — persistencia
- **Zod** — validación de datos de entrada
- **express-handlebars** — vistas
- **Socket.io** — tiempo real
- **dotenv** — variables de entorno

## Requisitos

- Node.js 18 o superior
- Una base de datos MongoDB (Atlas o local)

## Instalación

```bash
git clone <url-del-repositorio>
cd turnosapp
npm install
```

Configurá las variables de entorno copiando el archivo de ejemplo:

```bash
cp .env.example .env
```

Editá `.env` con tu cadena de conexión:

```
PORT=8080
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/turnosapp
```

## Scripts

| Comando       | Descripción                                          |
| ------------- | ---------------------------------------------------- |
| `npm run dev` | Arranca el servidor con recarga automática (`node --watch`) |
| `npm start`   | Arranca el servidor en modo producción               |
| `npm run seed`| Carga servicios de ejemplo (si está vacía la colección) |

## Endpoints

### Servicios

| Método | Ruta                | Descripción                                                        |
| ------ | ------------------- | ------------------------------------------------------------------ |
| GET    | `/api/services`     | Listado con filtros, paginación y ordenamiento (query params)      |
| GET    | `/api/services/:sid`| Detalle de un servicio                                             |
| POST   | `/api/services`     | Alta de servicio (validado con Zod)                                |
| PUT    | `/api/services/:sid`| Actualización parcial                                              |
| DELETE | `/api/services/:sid`| Baja de servicio                                                   |

**Query params de `GET /api/services`:**

- `q` — búsqueda por nombre, categoría o descripción (case-insensitive)
- `category` — filtra por categoría exacta
- `available` — `true` | `false`
- `page` (default 1), `limit` (default 10, máx 100)
- `sort` — `name` | `price` | `duration` | `createdAt` | `updatedAt`
- `order` — `asc` | `desc`

Ejemplo:

```bash
GET /api/services?q=corte&available=true&page=1&limit=5&sort=price&order=asc
```

Respuesta:

```json
{
  "status": "success",
  "payload": [ ... ],
  "pagination": { "page": 1, "limit": 5, "total": 3, "totalPages": 1, "hasPrev": false, "hasNext": false }
}
```

### Reservas

| Método | Ruta                                   | Descripción                                  |
| ------ | -------------------------------------- | -------------------------------------------- |
| GET    | `/api/reservations`                    | Listado con servicios poblados (populate)    |
| GET    | `/api/reservations/:rid`               | Detalle de una reserva con populate          |
| POST   | `/api/reservations`                    | Crear reserva con servicios asociados        |
| POST   | `/api/reservations/:rid/services`      | Asociar un servicio (o sumar cantidad)       |
| PUT    | `/api/reservations/:rid/services/:sid` | Modificar la cantidad de un servicio         |
| DELETE | `/api/reservations/:rid/services/:sid` | Quitar un servicio de la reserva             |
| DELETE | `/api/reservations/:rid/services`      | Vaciar la reserva                            |
| DELETE | `/api/reservations/:rid`               | Eliminar la reserva                          |

Las reservas guardan **referencias** `ObjectId` + `quantity`, nunca objetos completos:

```json
{
  "services": [
    { "service": "652f1a...", "quantity": 2 }
  ]
}
```

Ejemplo de creación:

```bash
POST /api/reservations
Content-Type: application/json

{
  "services": [
    { "service": "652f1a8b...", "quantity": 2 },
    { "service": "652f1b2c...", "quantity": 1 }
  ]
}
```

`GET /api/reservations` devuelve la información completa de los servicios gracias a `populate`.

## Vistas

- `GET /` — alta y listado de servicios en tiempo real
- `GET /reservations` — listado de reservas con sus servicios

## Tiempo real (Socket.io)

El servidor emite eventos que las vistas escuchan para refrescar la información **sin recargar la página**:

- `service:created`, `service:updated`, `service:deleted`
- `reservation:created`, `reservation:updated`, `reservation:deleted`

## Arquitectura en capas

```
src/
├── config/         # env, conexión a MongoDB, handlebars, socket.io
├── models/         # schemas de Mongoose (Service, Reservation)
├── dao/            # acceso crudo a datos (operaciones Mongoose)
├── repositories/   # queries: filtros, paginación, ordenamiento, populate
├── services/       # lógica de negocio
├── controllers/    # manejo de req/res + emisión de eventos
├── routes/         # definición de rutas y validaciones
├── validations/    # schemas de Zod
├── middlewares/    # validación y manejo de errores
├── views/          # plantillas Handlebars
└── public/         # CSS y cliente Socket.io
```

Flujo: `routes → controllers → services → repositories → DAO → models`.

## Variables de entorno

| Variable   | Descripción                  |
| ---------- | ---------------------------- |
| `PORT`     | Puerto del servidor (8080)   |
| `MONGO_URI`| Cadena de conexión MongoDB   |

> El archivo `.env` no se sube al repositorio (está en `.gitignore`). Usá `.env.example` como plantilla.
