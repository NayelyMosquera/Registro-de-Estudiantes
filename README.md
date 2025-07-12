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

## Arquitectura del Sistema
El siguiente diagrama muestra la arquitectura del sistema de registro de estudiantes, ilustrando la interacción entre el navegador, la capa cliente, los servicios backend y la capa de datos.

```mermaid
flowchart TD
    %% Client Layer
    Browser[Browser]:::external

    subgraph Client_Layer [Client Layer]
        AngularUI["Angular UI<br/>(:4200)"]:::frontend
        SSR["SSR Host<br/>(server.ts)"]:::frontend
        Proxy["Proxy<br/>(proxy.conf.json)"]:::api
    end

    %% Backend Services
    subgraph Backend_Services [Backend Services]
        EstService["Estudiantes<br/>(:3001)"]:::backend
        CarrService["Carreras<br/>(:3002)"]:::backend
    end

    %% Data Layer
    subgraph Data_Layer [Data Layer]
        DBEst["MongoDB<br/>Students DB"]:::db
        DBCarr["MongoDB<br/>Courses DB"]:::db
    end

    %% Connections
    Browser -->|HTTP/HTTPS| AngularUI
    AngularUI -->|SSR Rendering| SSR
    AngularUI -->|REST API Calls| Proxy
    Proxy -->|/api/estudiantes| EstService
    Proxy -->|/api/carreras| CarrService
    EstService -->|DB Driver| DBEst
    CarrService -->|DB Driver| DBCarr

    %% Styles
    classDef external fill:#F0F0F0,stroke:#333,stroke-width:2px,color:#000000
    classDef frontend fill:#D6EAFE,stroke:#0366D6,stroke-width:2px,color:#000000
    classDef api fill:#FFF9DB,stroke:#B7950B,stroke-width:2px,color:#000000
    classDef backend fill:#A9DFBF,stroke:#229954,stroke-width:2px,color:#000000
    classDef db fill:#F5B7B1,stroke:#C0392B,stroke-width:2px,color:#000000
    style DBEst fill:#F5B7B1,stroke:#C0392B,stroke-width:2px,color:#000000
    style DBCarr fill:#F5B7B1,stroke:#C0392B,stroke-width:2px,color:#000000



```


---
## Descripción Detallada
El sistema de registro de estudiantes está compuesto por las siguientes capas:
- **Capa Cliente**: Incluye la interfaz de usuario en Angular, que se ejecuta en el puerto 4200 y utiliza SSR para renderizado del lado del servidor.
- **Capa de Servicios Backend**: Compuesta por microservicios para estudiantes (puerto 3001) y carreras (puerto 3002), que manejan la lógica de negocio.
- **Capa de Datos**: Bases de datos MongoDB para almacenar información de estudiantes y carreras.


