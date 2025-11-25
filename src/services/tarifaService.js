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

  async obtenerPorId(id) {
    try {
      const response = await fetch(`${this.baseUrl}?id=${id}`);
      if (!response.ok) throw new Error('Error al obtener tarifa');
      const data = await response.json();
      return data.success ? data.data : null;
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

  async actualizar(id, tarifa) {
    try {
      const formData = new URLSearchParams();
      formData.append('id', id);
      
      if (tarifa.precioPorHora !== undefined) {
        formData.append('precioPorHora', tarifa.precioPorHora);
      }
      
      if (tarifa.activa !== undefined) {
        formData.append('activa', tarifa.activa);
      }

      const response = await fetch(`${this.baseUrl}?${formData.toString()}`, {
        method: HTTP_METHODS.PUT,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      if (!response.ok) throw new Error('Error al actualizar tarifa');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async eliminar(id) {
    try {
      const response = await fetch(`${this.baseUrl}?id=${id}`, {
        method: HTTP_METHODS.DELETE
      });

      if (!response.ok) throw new Error('Error al eliminar tarifa');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
}

export default new TarifaService();