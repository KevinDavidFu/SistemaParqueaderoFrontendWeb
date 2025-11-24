export const API_CONFIG = {
  BASE_URL: 'http://localhost:9090/SistemaParqueadero',
  ENDPOINTS: {
    VEHICULOS: '/api/vehiculos',
    TARIFAS: '/api/tarifas',
    CLIENTES: '/api/clientes',
    COBRO: '/cobro',
    HEALTH: '/health'
  },
  TIMEOUT: 10000
};

export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
};