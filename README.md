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
