# ViajeIA - Tu Asistente Personal de Viajes

Una aplicación web moderna que utiliza React para el frontend y Node.js + Express para el backend, integrada con la API de OpenAI para proporcionar asistencia personalizada en la planificación de viajes.

## 🚀 Características

- **Frontend React**: Interfaz moderna y responsiva
- **Backend Node.js**: API REST segura con Express
- **Integración OpenAI**: Asistente de IA para planificación de viajes
- **Diseño Moderno**: UI/UX profesional con gradientes y efectos visuales
- **Manejo de Estados**: Estados de carga, error y respuesta
- **Responsive**: Optimizado para móviles y desktop

## 📁 Estructura del Proyecto

```
viaje-ia/
├── backend/
│   ├── server.js          # Servidor Express
│   ├── package.json       # Dependencias del backend
│   └── env.example        # Variables de entorno (ejemplo)
├── frontend/
│   ├── src/
│   │   ├── App.js         # Componente principal
│   │   └── App.css        # Estilos CSS
│   └── package.json       # Dependencias del frontend
└── README.md
```

## 🛠️ Instalación y Configuración

### Prerrequisitos

- Node.js (versión 14 o superior)
- npm o yarn
- Clave de API de OpenAI

### 1. Configurar el Backend

```bash
cd backend

# Instalar dependencias
npm install

# Crear archivo .env
cp .env

# Editar .env y agregar tu clave de OpenAI
# OPENAI_API_KEY=tu_clave_aqui
```

### 2. Configurar el Frontend

```bash
cd frontend

# Instalar dependencias
npm install
```

## 🚀 Ejecutar la Aplicación

### Terminal 1 - Backend

```bash
cd backend
npm run dev
```

El servidor estará disponible en: http://localhost:3001

### Terminal 2 - Frontend

```bash
cd frontend
npm start
```

La aplicación estará disponible en: http://localhost:3000

## 🔧 Configuración de Variables de Entorno

En el archivo `backend/.env`:

```env
OPENAI_API_KEY=tu_clave_de_openai_aqui
PORT=3001
```

## 📝 Uso

1. Abre http://localhost:3000 en tu navegador
2. Escribe tu pregunta de viaje (ej: "Quiero ir a París por 5 días")
3. Haz clic en "Planificar mi viaje"
4. Espera la respuesta del asistente de IA

## 🎨 Tecnologías Utilizadas

### Frontend

- **React**: Framework de JavaScript para la interfaz de usuario
- **CSS3**: Estilos modernos con gradientes y efectos visuales
- **Hooks**: useState para manejo de estado

### Backend

- **Node.js**: Runtime de JavaScript
- **Express.js**: Framework web para crear APIs
- **OpenAI API**: Integración con ChatGPT para respuestas de IA
- **CORS**: Configuración para permitir peticiones del frontend
- **dotenv**: Manejo seguro de variables de entorno

## 🔒 Seguridad

- Las claves de API se manejan de forma segura en el backend
- Validación de entrada en el servidor
- Manejo de errores robusto
- CORS configurado correctamente

## 🚀 Scripts Disponibles

### Backend

- `npm start`: Ejecuta el servidor en producción
- `npm run dev`: Ejecuta el servidor en modo desarrollo con nodemon

### Frontend

- `npm start`: Ejecuta la aplicación en modo desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm test`: Ejecuta las pruebas

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.

## 🆘 Soporte

Si tienes problemas o preguntas:

1. Verifica que todas las dependencias estén instaladas
2. Asegúrate de que el archivo `.env` esté configurado correctamente
3. Verifica que ambos servidores (frontend y backend) estén corriendo
4. Revisa la consola del navegador y del servidor para errores

# viaje-ia
# viaje-ia
# viaje-ia
