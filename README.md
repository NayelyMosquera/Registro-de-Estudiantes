# Monorepo: Frontend Angular + Microservicios Node.js

## Estructura
- `frontend-angular`: Aplicación Angular standalone para gestión de estudiantes y carreras.
- `estudiantes-service`: Microservicio Node.js/Express para estudiantes (CRUD, CORS).
- `carreras-service`: Microservicio Node.js/Express para carreras (CRUD, CORS).

## Instrucciones rápidas

### 1. Microservicios
- Entra a cada carpeta (`estudiantes-service` y `carreras-service`)
- Ejecuta: `npm install` y luego `node index.js`

### 2. Frontend
- Entra a `frontend-angular`
- Ejecuta: `npm install` y luego `ng serve`

---

Cada microservicio expone endpoints REST y el frontend consume ambos para mostrar, crear, editar y eliminar estudiantes y carreras.
