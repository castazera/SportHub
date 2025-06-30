# eSports Training App

Aplicación web para gestión de equipos eSports desarrollada con MERN Stack.

## Tecnologías

- **Frontend:** React, SCSS
- **Backend:** Node.js, Express
- **Base de datos:** MongoDB
- **Autenticación:** JWT

## Características

- Registro e inicio de sesión
- Gestión de jugadores (CRUD)
- Sistema de entrenamientos
- Búsqueda y filtros
- Diseño responsive

## Instalación

### Backend
```bash
npm install
npm start
```

### Frontend
```bash
cd frontend
npm install
npm start
```

### Variables de entorno

Backend (.env):
```
MONGODB_URI=mongodb://localhost:27017/esports_training
JWT_SECRET=mi_clave_secreta
PORT=3000
```

Frontend (.env):
```
REACT_APP_API_URL=http://localhost:3000/api
```

## Uso

1. Registrarse en la aplicación
2. Iniciar sesión
3. Gestionar jugadores desde la sección correspondiente
4. Crear y administrar entrenamientos

## Estructura del proyecto

```
├── src/                 # Backend
│   ├── controllers/     # Controladores
│   ├── models/          # Modelos de datos
│   ├── routes/          # Rutas de API
│   └── middlewares/     # Middleware
├── frontend/            # Frontend React
│   └── src/
│       ├── componentes/ # Componentes React
│       ├── paginas/     # Páginas principales
│       ├── hooks/       # Custom hooks
│       └── servicios/   # Servicios de API
└── README.md
```

## Autor

Brian Fernandez - DWN4AV
