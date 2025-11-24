# 🌐 SistemaParqueaderoFrontendWeb

**Frontend web moderno que consume la API REST del Sistema de Parqueadero**

---

## 📋 Descripción

Aplicación web SPA (Single Page Application) desarrollada con **Vanilla JavaScript**, **Vite** y **CSS moderno** que consume la API REST del backend `SistemaParqueadero`. Implementa arquitectura limpia con separación de capas (Services, Components, Utils).

### Características Principales

- ✅ **Vanilla JavaScript** (sin frameworks, código limpio)
- ✅ **Vite** como bundler moderno
- ✅ **Arquitectura limpia** (Services → Components → Utils)
- ✅ **Comunicación con API REST** del backend
- ✅ **Componentes reutilizables** (Toast, Modal)
- ✅ **Responsive Design** (Mobile First)
- ✅ **Sistema de validaciones** en el cliente
- ✅ **Gestión completa de CRUD** para todas las entidades

---

## 🛠️ Stack Tecnológico

| Tecnología | Versión | Uso |
|------------|---------|-----|
| JavaScript | ES6+ | Lenguaje principal |
| Vite | 5.0+ | Build tool y dev server |
| CSS3 | Modern | Estilos responsive |
| Fetch API | Nativo | Consumo de API REST |

---

## 🚀 Instalación

### Requisitos Previos

- Node.js 18+
- npm 9+
- Backend corriendo en `http://localhost:9090/SistemaParqueadero`

### Pasos de Instalación

```bash
# 1. Crear directorio del proyecto
mkdir SistemaParqueaderoFrontendWeb
cd SistemaParqueaderoFrontendWeb

# 2. Inicializar proyecto
npm init -y

# 3. Instalar Vite
npm install -D vite

# 4. Crear estructura de archivos (ver abajo)

# 5. Ejecutar en desarrollo
npm run dev

# 6. Abrir navegador en http://localhost:5173
```

---

## 📂 Estructura del Proyecto

```
SistemaParqueaderoFrontendWeb/
├── .gitignore
├── README.md
├── package.json
├── vite.config.js
├── index.html
├── public/
│   └── favicon.ico
└── src/
    ├── main.js                    # Punto de entrada
    ├── App.js                     # Componente principal
    ├── config/
    │   └── api.config.js          # Configuración de API
    ├── services/
    │   ├── vehiculoService.js     # Servicios de vehículos
    │   ├── tarifaService.js       # Servicios de tarifas
    │   └── clienteService.js      # Servicios de clientes
    ├── components/
    │   ├── common/
    │   │   ├── Toast.js           # Notificaciones
    │   │   └── Modal.js           # Ventanas modales
    │   └── (otros componentes)
    ├── utils/
    │   ├── formatters.js          # Formateadores (fecha, moneda)
    │   └── validators.js          # Validadores
    └── styles/
        ├── main.css               # Estilos globales
        ├── components.css         # Estilos de componentes
        └── responsive.css         # Media queries
```

---

## 🔧 Configuración

### Configurar URL del Backend

Editar `src/config/api.config.js`:

```javascript
export const API_CONFIG = {
  BASE_URL: 'http://localhost:9090/SistemaParqueadero', // Cambiar si es necesario
  ENDPOINTS: {
    VEHICULOS: '/api/vehiculos',
    TARIFAS: '/api/tarifas',
    CLIENTES: '/api/clientes',
    COBRO: '/cobro'
  }
};
```

---

## 📡 Consumo de la API

### Ejemplo de Service

```javascript
// src/services/vehiculoService.js
import { API_CONFIG } from '../config/api.config.js';

class VehiculoService {
  async listarTodos() {
    const response = await fetch(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.VEHICULOS);
    const data = await response.json();
    return data.success ? data.data : [];
  }

  async registrar(vehiculo) {
    const formData = new URLSearchParams();
    formData.append('placa', vehiculo.placa);
    formData.append('tipo', vehiculo.tipo);

    const response = await fetch(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.VEHICULOS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData
    });

    return await response.json();
  }
}

export default new VehiculoService();
```

---

## 🎨 Componentes

### Toast (Notificaciones)

```javascript
import toast from './components/common/Toast.js';

toast.success('Operación exitosa');
toast.error('Error al procesar');
toast.info('Información importante');
```

### Modal (Ventanas Modales)

```javascript
import modal from './components/common/Modal.js';

modal.confirm(
  'Confirmar Eliminación',
  '¿Está seguro?',
  () => {
    // Acción al confirmar
  }
);
```

---

## 🧪 Testing

### Probar Comunicación con Backend

```bash
# 1. Asegurarse que el backend está corriendo
curl http://localhost:9090/SistemaParqueadero/health

# 2. Ejecutar frontend
npm run dev

# 3. Abrir navegador en http://localhost:5173

# 4. Abrir DevTools (F12) → Console
# Verificar que no hay errores de CORS
# Verificar que las llamadas fetch funcionan correctamente
```

### Verificar en Browser DevTools

1. **Network Tab**: Ver llamadas a `http://localhost:9090`
2. **Console**: Ver logs de servicios
3. **Application → Storage**: Verificar que no usa localStorage (si aplica)

---

## 📦 Build para Producción

```bash
# Compilar para producción
npm run build

# La carpeta dist/ contendrá los archivos optimizados
# dist/
#   ├── index.html
#   ├── assets/
#   │   ├── index-[hash].js
#   │   └── index-[hash].css

# Previsualizar build
npm run preview
```

---

## 🚀 Despliegue

### Opción 1: Servidor Estático (Nginx)

```nginx
server {
    listen 80;
    server_name tu-dominio.com;
    root /ruta/a/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Opción 2: Vercel / Netlify

```bash
# Vercel
vercel --prod

# Netlify
netlify deploy --prod --dir=dist
```

### Opción 3: Apache

```apache
<VirtualHost *:80>
    ServerName tu-dominio.com
    DocumentRoot /ruta/a/dist

    <Directory /ruta/a/dist>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

---

## 🔒 Configuración CORS

Si tienes problemas de CORS, asegúrate que el backend tiene:

```java
// Backend: CORSFilter.java
res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
```

---

## 🐛 Troubleshooting

### Error: CORS blocked

```
Solución:
1. Verificar que el backend tiene CORSFilter configurado
2. Verificar que la URL del backend en api.config.js es correcta
3. Verificar que el backend está corriendo
```

### Error: Failed to fetch

```
Solución:
1. Verificar que el backend está en http://localhost:9090
2. Verificar que el endpoint existe en el backend
3. Ver la consola del backend para errores
```

### Cambios no se reflejan

```
Solución:
1. Limpiar caché del navegador (Ctrl+Shift+R)
2. Reiniciar Vite (Ctrl+C → npm run dev)
3. Verificar que guardaste los archivos
```

---

## 📚 Funcionalidades

### Gestión de Vehículos
- ✅ Listar vehículos activos
- ✅ Registrar entrada de vehículo
- ✅ Eliminar vehículo
- ✅ Ver detalles (placa, modelo, tipo, ingreso)

### Gestión de Tarifas
- ✅ Listar tarifas disponibles
- ✅ Crear nuevas tarifas
- ✅ Ver precio por hora

### Gestión de Clientes
- ✅ Listar clientes
- ✅ Registrar nuevo cliente
- ✅ Eliminar cliente
- ✅ Descuentos por tipo de cliente

### Cobro
- ✅ Seleccionar vehículo activo
- ✅ Calcular tiempo de permanencia
- ✅ Aplicar tarifa correspondiente
- ✅ Mostrar total a pagar
- ✅ Registrar salida

---

## 🎯 Principios de Desarrollo

### Clean Code
- Nombres descriptivos
- Funciones cortas y específicas
- Separación de responsabilidades
- Comentarios solo cuando es necesario

### Arquitectura
```
View (App.js)
    ↓
Services (vehiculoService, tarifaService, clienteService)
    ↓
API REST (Backend en :9090)
    ↓
Database (MySQL)
```

### Patrón de Servicios
- Singleton pattern para servicios
- Manejo de errores consistente
- Transformación de datos en DTOs

---

## 🔗 Enlaces Relacionados

- **Backend API**: `http://localhost:9090/SistemaParqueadero`
- **API Docs**: `http://localhost:9090/SistemaParqueadero/api-docs`
- **Health Check**: `http://localhost:9090/SistemaParqueadero/health`
- **OpenAPI**: `http://localhost:9090/SistemaParqueadero/openapi.json`

---

## 👨‍💻 Autor

**Kevin David**  
Proyecto Académico - Sistema de Gestión de Parqueadero  
Versión: 1.0 (Frontend Separado)

---

## 📄 Licencia

MIT License

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crear rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m 'Agregar nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Pull Request

---

## 📝 Changelog

### v1.0.0 (2025-01-15)
- ✅ Implementación inicial
- ✅ Integración completa con backend API
- ✅ CRUD de vehículos, tarifas y clientes
- ✅ Sistema de cobro funcional
- ✅ Componentes Toast y Modal
- ✅ Responsive design
- ✅ Validaciones en cliente