import { API_CONFIG, HTTP_METHODS } from '../config/api.config.js';

class VehiculoService {
  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.VEHICULOS;
  }

  async listarTodos() {
    try {
      const response = await fetch(this.baseUrl);
      if (!response.ok) throw new Error('Error al obtener vehículos');
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
      if (!response.ok) throw new Error('Error al obtener vehículo');
      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async obtenerPorPlaca(placa) {
    try {
      const response = await fetch(`${this.baseUrl}?placa=${placa}`);
      if (!response.ok) throw new Error('Error al obtener vehículo');
      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async registrar(vehiculo) {
    try {
      const formData = new URLSearchParams();
      formData.append('placa', vehiculo.placa);
      formData.append('modelo', vehiculo.modelo || '');
      formData.append('tipo', vehiculo.tipo);

      const response = await fetch(this.baseUrl, {
        method: HTTP_METHODS.POST,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
      });

      if (!response.ok) throw new Error('Error al registrar vehículo');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async actualizar(id, vehiculo) {
    try {
      const formData = new URLSearchParams();
      formData.append('id', id);
      
      if (vehiculo.modelo !== undefined) {
        formData.append('modelo', vehiculo.modelo);
      }
      
      if (vehiculo.tipo !== undefined) {
        formData.append('tipo', vehiculo.tipo);
      }

      const response = await fetch(`${this.baseUrl}?${formData.toString()}`, {
        method: HTTP_METHODS.PUT,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      if (!response.ok) throw new Error('Error al actualizar vehículo');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async eliminar(placa) {
    try {
      const response = await fetch(`${this.baseUrl}?placa=${placa}`, {
        method: HTTP_METHODS.DELETE
      });

      if (!response.ok) throw new Error('Error al eliminar vehículo');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async realizarCobro(placa) {
    try {
      const cobroUrl = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.COBRO;
      const response = await fetch(`${cobroUrl}?placa=${placa}`, {
        method: HTTP_METHODS.POST
      });

      if (!response.ok) throw new Error('Error al realizar cobro');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
}

export default new VehiculoService();