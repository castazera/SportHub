const config = {
  app: {
    name: 'eSports Training App',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  },

  api: {
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json'
    },
    endpoints: {
      auth: {
        login: '/api/users/login',
        register: '/api/users/register'
      },
      jugadores: {
        base: '/api/jugadores',
        byId: (id) => `/api/jugadores/${id}`
      },
      entrenamientos: {
        base: '/api/entrenamientos',
        byId: (id) => `/api/entrenamientos/${id}`
      }
    }
  },

  features: {
    notifications: true,
    cache: true,
    debug: process.env.NODE_ENV === 'development'
  },

  cache: {
    timeout: 300000,
    maxSize: 100
  },

  pagination: {
    defaultPageSize: 10,
    maxPageSize: 50,
    pageSizeOptions: [5, 10, 20, 50]
  },

  timing: {
    debounceDelay: 300,
    toastDuration: 5000
  },

  validation: {
    minPasswordLength: 6,
    maxNameLength: 50,
    emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    playerLevels: ['Principiante', 'Intermedio', 'Avanzado', 'Profesional'],
    supportedGames: ['League of Legends', 'CS:GO', 'Valorant', 'Dota 2', 'Overwatch']
  },

  ui: {
    primaryColor: '#06b6d4',
    successColor: '#10b981',
    errorColor: '#ef4444',
    warningColor: '#f59e0b'
  },

  messages: {
    errors: {
      network: 'Error de conexión. Revisa tu internet.',
      unauthorized: 'Tu sesión ha expirado. Inicia sesión nuevamente.',
      notFound: 'El recurso solicitado no fue encontrado.',
      serverError: 'Error interno del servidor. Inténtalo más tarde.',
      generic: 'Ha ocurrido un error inesperado.'
    },
    success: {
      login: 'Bienvenido! Has iniciado sesión correctamente.',
      register: 'Cuenta creada exitosamente!',
      playerCreated: 'Jugador creado exitosamente.',
      playerUpdated: 'Jugador actualizado correctamente.',
      playerDeleted: 'Jugador eliminado correctamente.'
    }
  },

  endpoints: {
    auth: {
      login: '/user/login',
      register: '/user'
    },
    players: {
      base: '/jugadores'
    },
    trainings: {
      base: '/entrenamientos'
    }
  }
};

const obtenerConfigPorEntorno = () => {
  const env = process.env.NODE_ENV || 'development';
  
  switch (env) {
    case 'production':
      return {
        ...config,
        api: {
          ...config.api,
          baseURL: process.env.REACT_APP_API_URL || 'https://api-production.com'
        }
      };
    case 'test':
      return {
        ...config,
        api: {
          ...config.api,
          baseURL: 'http://localhost:3001'
        }
      };
    default:
      return config;
  }
};

export default obtenerConfigPorEntorno(); 