import { API_CONFIG, HTTP_METHODS } from '../config/api.config.js';

class ClienteService {
  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CLIENTES;
  }

  async listarTodos() {
    try {
      const response = await fetch(this.baseUrl);
      if (!response.ok) throw new Error('Error al obtener clientes');
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
      if (!response.ok) throw new Error('Error al obtener cliente');
      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async registrar(cliente) {
    try {
      const formData = new URLSearchParams();
      formData.append('nombre', cliente.nombre);
      formData.append('documento', cliente.documento);
      formData.append('telefono', cliente.telefono || '');
      formData.append('email', cliente.email || '');
      formData.append('tipoCliente', cliente.tipoCliente || 'Eventual');
      formData.append('descuento', cliente.descuento || '0');

      const response = await fetch(this.baseUrl, {
        method: HTTP_METHODS.POST,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
      });

      if (!response.ok) throw new Error('Error al registrar cliente');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async actualizar(id, cliente) {
    try {
      const formData = new URLSearchParams();
      formData.append('id', id);
      
      if (cliente.nombre !== undefined) {
        formData.append('nombre', cliente.nombre);
      }
      
      if (cliente.telefono !== undefined) {
        formData.append('telefono', cliente.telefono);
      }
      
      if (cliente.email !== undefined) {
        formData.append('email', cliente.email);
      }
      
      if (cliente.tipoCliente !== undefined) {
        formData.append('tipoCliente', cliente.tipoCliente);
      }
      
      if (cliente.descuento !== undefined) {
        formData.append('descuento', cliente.descuento);
      }

      const response = await fetch(`${this.baseUrl}?${formData.toString()}`, {
        method: HTTP_METHODS.PUT,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      if (!response.ok) throw new Error('Error al actualizar cliente');
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

      if (!response.ok) throw new Error('Error al eliminar cliente');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
}

export default new ClienteService();