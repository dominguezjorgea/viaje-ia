# ViajeIA - Tu Asistente Personal de Viajes

Una aplicación web moderna que utiliza React para el frontend y Node.js + Express para el backend, integrada con la API de OpenAI para proporcionar asistencia personalizada en la planificación de viajes, incluyendo información del clima en tiempo real y fotos hermosas de los destinos.

## 🚀 Características

- **Frontend React**: Interfaz moderna y responsiva
- **Backend Node.js**: API REST segura con Express
- **Integración OpenAI**: Asistente de IA para planificación de viajes
- **Información del Clima**: Datos meteorológicos en tiempo real con OpenWeatherMap
- **Fotos de Destinos**: Imágenes hermosas automáticas con Unsplash
- **Formulario de Encuesta**: Captura inicial de preferencias de viaje
- **Chat Conversacional**: Historial de conversación mantenido
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
- Clave de API de OpenWeatherMap (opcional, para información del clima)
- Clave de API de Unsplash (opcional, para fotos de destinos)

### 1. Configurar el Backend

```bash
cd backend

# Instalar dependencias
npm install

# Crear archivo .env
cp env.example .env

# Editar .env y agregar tus claves de API
# OPENAI_API_KEY=tu_clave_de_openai_aqui
# OPENWEATHER_API_KEY=tu_clave_de_openweather_aqui
# UNSPLASH_ACCESS_KEY=tu_clave_de_unsplash_aqui
```

### 2. Configurar el Frontend

```bash
cd frontend

# Instalar dependencias
npm install
```

## 🔑 Obtener Claves de API

### OpenAI API Key

1. Ve a https://platform.openai.com/
2. Crea una cuenta o inicia sesión
3. Ve a "API Keys" y genera una nueva clave
4. Copia la clave en tu archivo `.env`

### OpenWeatherMap API Key (Opcional)

1. Ve a https://openweathermap.org/
2. Haz clic en "Sign Up" (registro gratuito)
3. Completa el formulario con tu email y contraseña
4. Verifica tu email (revisa spam si no llega)
5. Inicia sesión y ve a "My API Keys"
6. Copia tu API Key (es gratuita y permite 1000 llamadas/día)
7. Agrega la clave en tu archivo `.env`

### Unsplash API Key (Opcional)

1. Ve a https://unsplash.com/developers
2. Haz clic en "Register as a developer"
3. Crea una cuenta o inicia sesión
4. Crea una nueva aplicación
5. Copia tu Access Key (es gratuita y permite 5000 llamadas/día)
6. Agrega la clave en tu archivo `.env`

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
OPENWEATHER_API_KEY=tu_clave_de_openweather_aqui
UNSPLASH_ACCESS_KEY=tu_clave_de_unsplash_aqui
PORT=3001
```

## 📝 Uso

1. Abre http://localhost:3000 en tu navegador
2. Completa el formulario inicial con:
   - Destino de viaje
   - Fechas de inicio y fin
   - Presupuesto aproximado
   - Tipo de experiencia preferida
3. Alex te dará recomendaciones personalizadas
4. Si mencionas un destino, Alex automáticamente incluirá:
   - Información del clima actual
   - 3 fotos hermosas del lugar
5. Continúa la conversación con preguntas específicas

## 🌤️ Funcionalidad del Clima

La aplicación automáticamente detecta cuando mencionas un destino y muestra:

- Temperatura actual en grados Celsius
- Sensación térmica
- Condición del clima (soleado, nublado, lluvioso, etc.)
- Humedad del aire
- Consejos personalizados basados en el clima

## 📸 Funcionalidad de Fotos

Cuando Alex responde sobre un destino, automáticamente muestra:

- 3 fotos hermosas del lugar en formato landscape
- Créditos a los fotógrafos de Unsplash
- Diseño responsivo con efectos hover
- Carga lazy para mejor rendimiento

**Ciudades soportadas**: París, Madrid, Barcelona, Roma, Londres, Nueva York, Tokio, Sídney, Buenos Aires, Ciudad de México, Bogotá, Lima, Santiago, Río de Janeiro, São Paulo, Berlín, Ámsterdam, Viena, Praga, Budapest, Estambul, Dubái, Singapur, Bangkok, Seúl, Pekín, Shanghái, Hong Kong, Mumbai, Delhi, El Cairo, Ciudad del Cabo, Marrakech, Casablanca, Lisboa, Oporto, Atenas, Milán, Venecia, Florencia, Nápoles, Sevilla, Valencia, Granada, Bilbao, San Sebastián, Ibiza, Mallorca, Tenerife, Las Palmas y más.

## 🎨 Tecnologías Utilizadas

### Frontend

- **React**: Framework de JavaScript para la interfaz de usuario
- **CSS3**: Estilos modernos con gradientes y efectos visuales
- **Hooks**: useState, useEffect, useRef para manejo de estado

### Backend

- **Node.js**: Runtime de JavaScript
- **Express.js**: Framework web para crear APIs
- **OpenAI API**: Integración con ChatGPT para respuestas de IA
- **OpenWeatherMap API**: Información meteorológica en tiempo real
- **Unsplash API**: Fotos de alta calidad de destinos turísticos
- **Axios**: Cliente HTTP para llamadas a APIs externas
- **CORS**: Configuración para permitir peticiones del frontend
- **dotenv**: Manejo seguro de variables de entorno

## 🔒 Seguridad

- Las claves de API se manejan de forma segura en el backend
- Validación de entrada en el servidor
- Manejo de errores robusto
- CORS configurado correctamente
- Variables de entorno para configuración sensible

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
5. Si el clima no aparece, verifica que tu API key de OpenWeatherMap sea válida
6. Si las fotos no aparecen, verifica que tu API key de Unsplash sea válida

# viaje-ia

# viaje-ia

# viaje-ia
