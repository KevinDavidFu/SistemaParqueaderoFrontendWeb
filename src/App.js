import vehiculoService from './services/vehiculoService.js';
import tarifaService from './services/tarifaService.js';
import clienteService from './services/clienteService.js';
import toast from './components/common/Toast.js';
import modal from './components/common/Modal.js';
import { formatCurrency, formatDateTime, formatPlaca } from './utils/formatters.js';
import { validatePlaca, validatePrecio } from './utils/validators.js';

class App {
  constructor() {
    this.currentView = 'vehiculos';
    this.vehiculos = [];
    this.tarifas = [];
    this.clientes = [];
  }

  async init() {
    this.render();
    this.attachEventListeners();
    await this.loadInitialData();
  }

  render() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <header class="header">
        <div class="container">
          <h1>🚗 Sistema de Parqueadero</h1>
          <nav class="nav">
            <button class="nav-btn active" data-view="vehiculos">Vehículos</button>
            <button class="nav-btn" data-view="tarifas">Tarifas</button>
            <button class="nav-btn" data-view="clientes">Clientes</button>
            <button class="nav-btn" data-view="cobro">Cobro</button>
          </nav>
        </div>
      </header>

      <main class="main">
        <div class="container">
          <div id="content"></div>
        </div>
      </main>

      <footer class="footer">
        <div class="container">
          <p>&copy; 2025 Sistema de Parqueadero - Kevin David</p>
        </div>
      </footer>
    `;
    
    this.renderView();
  }

  attachEventListeners() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.currentView = e.target.dataset.view;
        this.renderView();
      });
    });
  }

  async loadInitialData() {
    try {
      [this.vehiculos, this.tarifas, this.clientes] = await Promise.all([
        vehiculoService.listarTodos(),
        tarifaService.listarTodas(),
        clienteService.listarTodos()
      ]);
      this.renderView();
    } catch (error) {
      toast.error('Error al cargar datos iniciales');
    }
  }

  renderView() {
    const content = document.getElementById('content');
    if (!content) return;

    switch(this.currentView) {
      case 'vehiculos':
        this.renderVehiculos(content);
        break;
      case 'tarifas':
        this.renderTarifas(content);
        break;
      case 'clientes':
        this.renderClientes(content);
        break;
      case 'cobro':
        this.renderCobro(content);
        break;
    }
  }

  // ========================================
  // VEHÍCULOS
  // ========================================
  
  renderVehiculos(content) {
    content.innerHTML = `
      <div class="section-header">
        <h2>Gestión de Vehículos</h2>
        <button class="btn btn-primary" id="btnNuevoVehiculo">+ Nuevo Vehículo</button>
      </div>

      <div class="card">
        <div class="card-header">
          <h3>Vehículos Activos (${this.vehiculos.filter(v => v.activo).length})</h3>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>Placa</th>
                  <th>Modelo</th>
                  <th>Tipo</th>
                  <th>Ingreso</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                ${this.renderVehiculosRows()}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btnNuevoVehiculo').addEventListener('click', () => {
      this.showVehiculoForm();
    });

    this.attachVehiculoActions();
  }

  renderVehiculosRows() {
    if (this.vehiculos.length === 0) {
      return '<tr><td colspan="6" class="text-center">No hay vehículos registrados</td></tr>';
    }

    return this.vehiculos.map(v => `
      <tr>
        <td><strong>${v.placa}</strong></td>
        <td>${v.modelo || 'N/A'}</td>
        <td><span class="badge badge-info">${v.tipo}</span></td>
        <td>${formatDateTime(v.ingreso)}</td>
        <td>
          <span class="badge ${v.activo ? 'badge-success' : 'badge-secondary'}">
            ${v.activo ? 'Activo' : 'Retirado'}
          </span>
        </td>
        <td>
          <button class="btn btn-sm btn-primary" data-action="edit" data-id="${v.id}" style="margin-right: 0.5rem;">
            Editar
          </button>
          <button class="btn btn-sm btn-danger" data-action="delete" data-placa="${v.placa}">
            Eliminar
          </button>
        </td>
      </tr>
    `).join('');
  }

  attachVehiculoActions() {
    document.querySelectorAll('[data-action="edit"]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.dataset.id;
        this.showVehiculoEditForm(id);
      });
    });

    document.querySelectorAll('[data-action="delete"]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const placa = e.target.dataset.placa;
        modal.confirm(
          'Confirmar Eliminación',
          `¿Está seguro de eliminar el vehículo ${placa}?`,
          async () => {
            try {
              await vehiculoService.eliminar(placa);
              toast.success('Vehículo eliminado correctamente');
              this.vehiculos = await vehiculoService.listarTodos();
              this.renderView();
            } catch (error) {
              toast.error('Error al eliminar vehículo');
            }
          }
        );
      });
    });
  }

  showVehiculoForm() {
    const formHtml = `
      <form id="vehiculoForm">
        <div class="form-group">
          <label>Placa *</label>
          <input type="text" class="form-control" id="placa" required>
        </div>
        <div class="form-group">
          <label>Modelo</label>
          <input type="text" class="form-control" id="modelo">
        </div>
        <div class="form-group">
          <label>Tipo *</label>
          <select class="form-control" id="tipo" required>
            ${this.tarifas.map(t => `<option value="${t.tipo}">${t.tipo}</option>`).join('')}
          </select>
        </div>
      </form>
    `;

    modal.show('Registrar Vehículo', formHtml, async () => {
      const placa = document.getElementById('placa').value;
      const modelo = document.getElementById('modelo').value;
      const tipo = document.getElementById('tipo').value;

      const validation = validatePlaca(placa);
      if (!validation.valid) {
        toast.error(validation.message);
        return;
      }

      try {
        await vehiculoService.registrar({ placa, modelo, tipo });
        toast.success('Vehículo registrado correctamente');
        this.vehiculos = await vehiculoService.listarTodos();
        this.renderView();
      } catch (error) {
        toast.error('Error al registrar vehículo');
      }
    });
  }

  async showVehiculoEditForm(id) {
    try {
      const vehiculo = await vehiculoService.obtenerPorId(id);
      if (!vehiculo) {
        toast.error('Vehículo no encontrado');
        return;
      }

      const formHtml = `
        <form id="vehiculoEditForm">
          <div class="form-group">
            <label>Placa</label>
            <input type="text" class="form-control" value="${vehiculo.placa}" disabled>
          </div>
          <div class="form-group">
            <label>Modelo</label>
            <input type="text" class="form-control" id="modelo" value="${vehiculo.modelo || ''}">
          </div>
          <div class="form-group">
            <label>Tipo</label>
            <select class="form-control" id="tipo">
              ${this.tarifas.map(t => 
                `<option value="${t.tipo}" ${t.tipo === vehiculo.tipo ? 'selected' : ''}>${t.tipo}</option>`
              ).join('')}
            </select>
          </div>
        </form>
      `;

      modal.show('Editar Vehículo', formHtml, async () => {
        const modelo = document.getElementById('modelo').value;
        const tipo = document.getElementById('tipo').value;

        try {
          await vehiculoService.actualizar(id, { modelo, tipo });
          toast.success('Vehículo actualizado correctamente');
          this.vehiculos = await vehiculoService.listarTodos();
          this.renderView();
        } catch (error) {
          toast.error('Error al actualizar vehículo');
        }
      });
    } catch (error) {
      toast.error('Error al cargar vehículo');
    }
  }

  // ========================================
  // TARIFAS
  // ========================================
  
  renderTarifas(content) {
    content.innerHTML = `
      <div class="section-header">
        <h2>Tarifas</h2>
        <button class="btn btn-primary" id="btnNuevaTarifa">+ Nueva Tarifa</button>
      </div>

      <div class="grid">
        ${this.tarifas.map(t => `
          <div class="card">
            <div class="card-body">
              <h3>${t.tipo}</h3>
              <p class="price">${formatCurrency(t.precioPorHora)}/hora</p>
              <span class="badge ${t.activa ? 'badge-success' : 'badge-secondary'}">
                ${t.activa ? 'Activa' : 'Inactiva'}
              </span>
              <div style="margin-top: 1rem;">
                <button class="btn btn-sm btn-primary" data-action="editTarifa" data-id="${t.id}" style="margin-right: 0.5rem;">
                  Editar
                </button>
                <button class="btn btn-sm btn-danger" data-action="deleteTarifa" data-id="${t.id}">
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    document.getElementById('btnNuevaTarifa').addEventListener('click', () => {
      this.showTarifaForm();
    });

    this.attachTarifaActions();
  }

  attachTarifaActions() {
    document.querySelectorAll('[data-action="editTarifa"]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.dataset.id;
        this.showTarifaEditForm(id);
      });
    });

    document.querySelectorAll('[data-action="deleteTarifa"]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.dataset.id;
        modal.confirm(
          'Confirmar Eliminación',
          '¿Está seguro de eliminar esta tarifa?',
          async () => {
            try {
              await tarifaService.eliminar(id);
              toast.success('Tarifa eliminada correctamente');
              this.tarifas = await tarifaService.listarTodas();
              this.renderView();
            } catch (error) {
              toast.error('Error al eliminar tarifa');
            }
          }
        );
      });
    });
  }

  showTarifaForm() {
    const formHtml = `
      <form id="tarifaForm">
        <div class="form-group">
          <label>Tipo de Vehículo *</label>
          <input type="text" class="form-control" id="tipo" required>
        </div>
        <div class="form-group">
          <label>Precio por Hora (COP) *</label>
          <input type="number" class="form-control" id="precioPorHora" min="0" step="100" required>
        </div>
      </form>
    `;

    modal.show('Crear Tarifa', formHtml, async () => {
      const tipo = document.getElementById('tipo').value;
      const precioPorHora = document.getElementById('precioPorHora').value;

      const validation = validatePrecio(precioPorHora);
      if (!validation.valid) {
        toast.error(validation.message);
        return;
      }

      try {
        await tarifaService.crear({ tipo, precioPorHora });
        toast.success('Tarifa creada correctamente');
        this.tarifas = await tarifaService.listarTodas();
        this.renderView();
      } catch (error) {
        toast.error('Error al crear tarifa');
      }
    });
  }

  async showTarifaEditForm(id) {
    try {
      const tarifa = await tarifaService.obtenerPorId(id);
      if (!tarifa) {
        toast.error('Tarifa no encontrada');
        return;
      }

      const formHtml = `
        <form id="tarifaEditForm">
          <div class="form-group">
            <label>Tipo de Vehículo</label>
            <input type="text" class="form-control" value="${tarifa.tipo}" disabled>
          </div>
          <div class="form-group">
            <label>Precio por Hora (COP) *</label>
            <input type="number" class="form-control" id="precioPorHora" value="${tarifa.precioPorHora}" min="0" step="100" required>
          </div>
          <div class="form-group">
            <label>Estado</label>
            <select class="form-control" id="activa">
              <option value="true" ${tarifa.activa ? 'selected' : ''}>Activa</option>
              <option value="false" ${!tarifa.activa ? 'selected' : ''}>Inactiva</option>
            </select>
          </div>
        </form>
      `;

      modal.show('Editar Tarifa', formHtml, async () => {
        const precioPorHora = document.getElementById('precioPorHora').value;
        const activa = document.getElementById('activa').value === 'true';

        const validation = validatePrecio(precioPorHora);
        if (!validation.valid) {
          toast.error(validation.message);
          return;
        }

        try {
          await tarifaService.actualizar(id, { precioPorHora, activa });
          toast.success('Tarifa actualizada correctamente');
          this.tarifas = await tarifaService.listarTodas();
          this.renderView();
        } catch (error) {
          toast.error('Error al actualizar tarifa');
        }
      });
    } catch (error) {
      toast.error('Error al cargar tarifa');
    }
  }

  // ========================================
  // CLIENTES
  // ========================================
  
  renderClientes(content) {
    content.innerHTML = `
      <div class="section-header">
        <h2>Clientes</h2>
        <button class="btn btn-primary" id="btnNuevoCliente">+ Nuevo Cliente</button>
      </div>

      <div class="card">
        <div class="card-body">
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Documento</th>
                  <th>Teléfono</th>
                  <th>Email</th>
                  <th>Tipo</th>
                  <th>Descuento</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                ${this.clientes.map(c => `
                  <tr>
                    <td>${c.nombre}</td>
                    <td>${c.documento}</td>
                    <td>${c.telefono || 'N/A'}</td>
                    <td>${c.email || 'N/A'}</td>
                    <td><span class="badge badge-info">${c.tipoCliente}</span></td>
                    <td>${c.descuento}%</td>
                    <td>
                      <button class="btn btn-sm btn-primary" data-action="editCliente" data-id="${c.id}" style="margin-right: 0.5rem;">
                        Editar
                      </button>
                      <button class="btn btn-sm btn-danger" data-action="deleteCliente" data-id="${c.id}">
                        Eliminar
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btnNuevoCliente').addEventListener('click', () => {
      this.showClienteForm();
    });

    this.attachClienteActions();
  }

  attachClienteActions() {
    document.querySelectorAll('[data-action="editCliente"]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.dataset.id;
        this.showClienteEditForm(id);
      });
    });

    document.querySelectorAll('[data-action="deleteCliente"]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.dataset.id;
        modal.confirm('Confirmar', '¿Eliminar este cliente?', async () => {
          try {
            await clienteService.eliminar(id);
            toast.success('Cliente eliminado');
            this.clientes = await clienteService.listarTodos();
            this.renderView();
          } catch (error) {
            toast.error('Error al eliminar cliente');
          }
        });
      });
    });
  }

  showClienteForm() {
    const formHtml = `
      <form id="clienteForm">
        <div class="form-group">
          <label>Nombre *</label>
          <input type="text" class="form-control" id="nombre" required>
        </div>
        <div class="form-group">
          <label>Documento *</label>
          <input type="text" class="form-control" id="documento" required>
        </div>
        <div class="form-group">
          <label>Teléfono</label>
          <input type="text" class="form-control" id="telefono">
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" class="form-control" id="email">
        </div>
        <div class="form-group">
          <label>Tipo</label>
          <select class="form-control" id="tipoCliente">
            <option value="Eventual">Eventual</option>
            <option value="Regular">Regular</option>
            <option value="VIP">VIP</option>
          </select>
        </div>
        <div class="form-group">
          <label>Descuento (%)</label>
          <input type="number" class="form-control" id="descuento" value="0" min="0" max="100">
        </div>
      </form>
    `;

    modal.show('Registrar Cliente', formHtml, async () => {
      const cliente = {
        nombre: document.getElementById('nombre').value,
        documento: document.getElementById('documento').value,
        telefono: document.getElementById('telefono').value,
        email: document.getElementById('email').value,
        tipoCliente: document.getElementById('tipoCliente').value,
        descuento: document.getElementById('descuento').value
      };

      try {
        await clienteService.registrar(cliente);
        toast.success('Cliente registrado');
        this.clientes = await clienteService.listarTodos();
        this.renderView();
      } catch (error) {
        toast.error('Error al registrar cliente');
      }
    });
  }

  async showClienteEditForm(id) {
    try {
      const cliente = await clienteService.obtenerPorId(id);
      if (!cliente) {
        toast.error('Cliente no encontrado');
        return;
      }

      const formHtml = `
        <form id="clienteEditForm">
          <div class="form-group">
            <label>Nombre *</label>
            <input type="text" class="form-control" id="nombre" value="${cliente.nombre}" required>
          </div>
          <div class="form-group">
            <label>Documento</label>
            <input type="text" class="form-control" value="${cliente.documento}" disabled>
          </div>
          <div class="form-group">
            <label>Teléfono</label>
            <input type="text" class="form-control" id="telefono" value="${cliente.telefono || ''}">
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" class="form-control" id="email" value="${cliente.email || ''}">
          </div>
          <div class="form-group">
            <label>Tipo</label>
            <select class="form-control" id="tipoCliente">
              <option value="Eventual" ${cliente.tipoCliente === 'Eventual' ? 'selected' : ''}>Eventual</option>
              <option value="Regular" ${cliente.tipoCliente === 'Regular' ? 'selected' : ''}>Regular</option>
              <option value="VIP" ${cliente.tipoCliente === 'VIP' ? 'selected' : ''}>VIP</option>
            </select>
          </div>
          <div class="form-group">
            <label>Descuento (%)</label>
            <input type="number" class="form-control" id="descuento" value="${cliente.descuento}" min="0" max="100">
          </div>
        </form>
      `;

      modal.show('Editar Cliente', formHtml, async () => {
        const clienteActualizado = {
          nombre: document.getElementById('nombre').value,
          telefono: document.getElementById('telefono').value,
          email: document.getElementById('email').value,
          tipoCliente: document.getElementById('tipoCliente').value,
          descuento: document.getElementById('descuento').value
        };

        try {
          await clienteService.actualizar(id, clienteActualizado);
          toast.success('Cliente actualizado correctamente');
          this.clientes = await clienteService.listarTodos();
          this.renderView();
        } catch (error) {
          toast.error('Error al actualizar cliente');
        }
      });
    } catch (error) {
      toast.error('Error al cargar cliente');
    }
  }

  // ========================================
  // COBRO
  // ========================================
  
  renderCobro(content) {
    content.innerHTML = `
      <div class="section-header">
        <h2>Realizar Cobro</h2>
      </div>

      <div class="card">
        <div class="card-body">
          <form id="cobroForm">
            <div class="form-group">
              <label>Seleccione el Vehículo *</label>
              <select class="form-control" id="placaCobro" required>
                <option value="">-- Seleccione --</option>
                ${this.vehiculos.filter(v => v.activo).map(v => 
                  `<option value="${v.placa}">${v.placa} - ${v.tipo}</option>`
                ).join('')}
              </select>
            </div>
            <button type="submit" class="btn btn-primary btn-lg">Procesar Cobro</button>
          </form>

          <div id="cobroResult" class="cobro-result" style="display: none;"></div>
        </div>
      </div>
    `;

    document.getElementById('cobroForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const placa = document.getElementById('placaCobro').value;
      
      if (!placa) {
        toast.error('Seleccione un vehículo');
        return;
      }

      try {
        const result = await vehiculoService.realizarCobro(placa);
        
        if (result.success) {
          document.getElementById('cobroResult').style.display = 'block';
          document.getElementById('cobroResult').innerHTML = `
            <h3>✅ Cobro Exitoso</h3>
            <p><strong>Placa:</strong> ${result.placa}</p>
            <p><strong>Horas:</strong> ${result.horas.toFixed(2)}</p>
            <p><strong>Tarifa:</strong> ${formatCurrency(result.precioPorHora)}/hora</p>
            <p class="total"><strong>Total:</strong> ${formatCurrency(result.total)}</p>
          `;
          
          toast.success('Cobro realizado exitosamente');
          this.vehiculos = await vehiculoService.listarTodos();
        }
      } catch (error) {
        toast.error('Error al procesar cobro');
      }
    });
  }
}

export default App;