# EduGestión

Sistema integral de gestión escolar.

## Estructura del proyecto

```
Escuela/
├── FrontEnd/
│   └── FrontEnd/
│       └── edugestin/          # Aplicación React + Vite + Tailwind
│           ├── src/
│           │   ├── api.js          # Cliente HTTP para el backend
│           │   ├── constants.js    # Paleta de colores
│           │   ├── components/     # Sidebar, Topbar, Badge, Modal
│           │   └── pages/          # LoginPage, DashboardPage
│           ├── package.json
│           └── vite.config.js
├── Backend/                     # API REST con Express + SQLite
│   ├── config/
│   │   └── db.js               # Conexión y esquema SQLite
│   ├── middleware/
│   │   └── auth.js             # JWT authentication
│   ├── routes/
│   │   ├── auth.js             # POST /api/auth/login
│   │   ├── students.js         # CRUD estudiantes
│   │   ├── subjects.js         # CRUD materias
│   │   ├── grades.js           # Notas
│   │   ├── attendance.js       # Asistencias
│   │   ├── users.js            # CRUD usuarios
│   │   └── dashboard.js        # Stats, actividad, gráficos
│   ├── server.js               # Punto de entrada
│   ├── seed.js                 # Poblado de datos iniciales
│   └── package.json
└── README.md
```

## Dependencias

### Frontend
| Paquete | Versión |
|---|---|
| react | ^19.2.6 |
| react-dom | ^19.2.6 |
| lucide-react | ^1.17.0 |
| recharts | ^3.8.1 |
| tailwindcss | ^4.3.0 |
| vite | ^8.0.12 |
| @tailwindcss/vite | ^4.3.0 |

### Backend
| Paquete | Versión |
|---|---|
| express | ^4.21.0 |
| better-sqlite3 | ^11.7.0 |
| jsonwebtoken | ^9.0.2 |
| bcryptjs | ^2.4.3 |
| cors | ^2.8.5 |

## Ejecución

### 1. Backend

```bash
cd Backend
npm install
npm run seed      # Puebla la base de datos
npm run dev       # http://localhost:3000
```

### 2. Frontend

```bash
cd FrontEnd/FrontEnd/edugestin
npm install
npm run dev       # http://localhost:5173
```

### Usuarios de prueba

| Usuario | Contraseña | Rol |
|---|---|---|
| admin | admin123 | Administrador |
| docente | docente123 | Docente |
| preceptor | preceptor123 | Preceptor |


## Descripción

**EduGestión** es un sistema integral de gestión escolar desarrollado para facilitar la administración de instituciones educativas. Permite gestionar estudiantes, usuarios, materias, asistencias y calificaciones desde una aplicación web moderna e intuitiva. Además, incorpora autenticación mediante JWT y un panel de control con estadísticas para optimizar el seguimiento de la información académica.



## Funcionalidades

* Autenticación de usuarios mediante JWT.
* Inicio de sesión con control de acceso por roles.
* Gestión completa de estudiantes (CRUD).
* Gestión de usuarios (CRUD).
* Gestión de materias (CRUD).
* Registro y consulta de calificaciones.
* Registro y control de asistencias.
* Dashboard con estadísticas y actividad reciente.


## Tecnologías utilizadas

### Frontend

* React
* Vite
* Tailwind CSS
* Recharts
* Lucide React

### Backend

* Node.js
* Express
* SQLite
* Better SQLite3
* JSON Web Token (JWT)
* bcryptjs
* CORS

## Autores

Proyecto desarrollado por:

* Jeremías Díaz
* Juan Carballo
* Lionel Prado
* Gerónimo Martínez
* Ignacio Kozak
