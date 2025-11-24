import { API_CONFIG, HTTP_METHODS } from '../config/api.config.js';

class TarifaService {
  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.TARIFAS;
  }

  async listarTodas() {
    try {
      const response = await fetch(this.baseUrl);
      if (!response.ok) throw new Error('Error al obtener tarifas');
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async crear(tarifa) {
    try {
      const formData = new URLSearchParams();
      formData.append('tipo', tarifa.tipo);
      formData.append('precioPorHora', tarifa.precioPorHora);

      const response = await fetch(this.baseUrl, {
        method: HTTP_METHODS.POST,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
      });

      if (!response.ok) throw new Error('Error al crear tarifa');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
}

export default new TarifaService();