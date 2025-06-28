# ViajeIA - Alex, Tu Consultor Personal de Viajes ✈️

Una aplicación web moderna que combina inteligencia artificial con datos en tiempo real para crear la experiencia de planificación de viajes más personalizada e interactiva.

## 🌟 Características Principales

### 🤖 Alex - Tu Asistente Inteligente

- **Personalidad única**: Alex es entusiasta, amigable y hace preguntas relevantes
- **Memoria contextual**: Recuerda el último destino consultado y el historial completo de la conversación
- **Referencias inteligentes**: Entiende cuando preguntas "¿y qué tal el transporte allí?" y sabe a qué destino te refieres
- **Respuestas organizadas**: Usa bullets, emojis y estructura clara para facilitar la lectura

### 📋 Sistema de Memoria y Contexto

- **Historial visible**: Panel desplegable que muestra todas las preguntas anteriores con fechas y destinos
- **Contexto persistente**: Mantiene información de la sesión durante 30 minutos
- **Referencias automáticas**: Alex automáticamente usa el último destino mencionado cuando no especificas uno
- **Seguimiento de conversación**: Construye respuestas basadas en preguntas anteriores

### 🌍 Manejo de Múltiples Ciudades

- **Listado de ciudades**: Mantiene un historial de todas las ciudades mencionadas en la conversación
- **Validación inicial**: Si mencionas múltiples ciudades en el formulario, Alex toma la primera como principal y te confirma
- **Referencias múltiples**: Puedes preguntar sobre cualquier ciudad del listado ("¿qué tal Roma?" o "¿y en Londres cómo está el clima?")
- **Panel visual**: Tooltip que muestra todas las ciudades consultadas con indicador de la ciudad principal
- **Panel de tiempo real**: Siempre muestra información de la última ciudad mencionada

### 🌤️ Información en Tiempo Real

- **Clima actual**: Temperatura, sensación térmica, humedad y descripción del clima
- **Tipo de cambio**: Tasas de conversión actualizadas automáticamente
- **Diferencia horaria**: Hora local vs tu hora actual
- **Panel lateral**: Información organizada y fácil de consultar

### 📸 Fotos Inspiradoras

- **Fotos reales**: Imágenes de alta calidad de Unsplash
- **Créditos de fotógrafos**: Enlaces a los artistas originales
- **Grid responsivo**: Adaptable a diferentes tamaños de pantalla

### 🎯 Formulario Inicial Inteligente

- **Recopilación de contexto**: Destino, fechas, presupuesto y preferencias
- **Personalización**: Alex usa esta información para recomendaciones específicas
- **Experiencia fluida**: Transición suave del formulario al chat

## 🚀 Tecnologías Utilizadas

### Frontend

- **React.js**: Interfaz de usuario moderna y responsiva
- **CSS3**: Estilos avanzados con gradientes, animaciones y diseño responsivo
- **Hooks**: useState, useEffect, useRef para manejo de estado

### Backend

- **Node.js**: Servidor JavaScript del lado del servidor
- **Express.js**: Framework web para APIs RESTful
- **OpenAI GPT-3.5**: Inteligencia artificial para respuestas contextuales
- **Axios**: Cliente HTTP para llamadas a APIs externas
- **Moment.js**: Manejo de zonas horarias y fechas

### APIs Externas

- **OpenWeatherMap**: Datos meteorológicos en tiempo real
- **Unsplash**: Fotos de alta calidad de destinos turísticos
- **Exchange Rate API**: Tasas de cambio de monedas

## 📦 Instalación y Configuración

### Prerrequisitos

- Node.js (versión 14 o superior)
- npm o yarn
- Cuentas en las APIs externas (ver sección de configuración)

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd viaje-ia
```

### 2. Configurar el Backend

```bash
cd backend
npm install
```

Crear archivo `.env` basado en `env.example`:

```env
OPENAI_API_KEY=tu_clave_de_openai
OPENWEATHER_API_KEY=tu_clave_de_openweather
UNSPLASH_ACCESS_KEY=tu_clave_de_unsplash
PORT=3001
```

### 3. Configurar el Frontend

```bash
cd ../frontend
npm install
```

### 4. Obtener Claves de API

#### OpenAI API Key

1. Ve a [OpenAI Platform](https://platform.openai.com/)
2. Crea una cuenta o inicia sesión
3. Ve a "API Keys" en tu dashboard
4. Crea una nueva clave API
5. Copia la clave al archivo `.env`

#### OpenWeatherMap API Key

1. Ve a [OpenWeatherMap](https://openweathermap.org/api)
2. Regístrate para obtener una cuenta gratuita
3. Ve a "My API Keys"
4. Copia tu clave API al archivo `.env`

#### Unsplash API Key

1. Ve a [Unsplash Developers](https://unsplash.com/developers)
2. Crea una cuenta de desarrollador
3. Crea una nueva aplicación
4. Copia tu "Access Key" al archivo `.env`

### 5. Ejecutar la aplicación

#### Terminal 1 - Backend

```bash
cd backend
npm start
```

#### Terminal 2 - Frontend

```bash
cd frontend
npm start
```

La aplicación estará disponible en `http://localhost:3000`

## 🎮 Cómo Usar

### 1. Formulario Inicial

- Completa el formulario con tu destino, fechas, presupuesto y preferencias
- **Múltiples ciudades**: Si escribes "París, Roma, Londres", Alex tomará París como principal y te confirmará las otras ciudades
- Esta información ayuda a Alex a darte recomendaciones más específicas

### 2. Chat con Alex

- Escribe preguntas naturales como "¿Qué tal el transporte allí?"
- Alex recordará el contexto y te dará respuestas personalizadas
- **Referencias múltiples**: Puedes preguntar "¿qué tal Roma?" o "¿y en Londres cómo está el clima?" y Alex sabrá a qué te refieres
- Usa el botón "📋 Historial" para ver tus preguntas anteriores
- **Panel de ciudades**: Hover sobre "🌍 X ciudades" para ver todas las ciudades consultadas

### 3. Información en Tiempo Real

- El panel lateral se actualiza automáticamente con información del **último destino mencionado**
- Incluye clima, tipo de cambio y diferencia horaria
- Se puede cerrar y abrir según necesites

### 4. Fotos Inspiradoras

- Alex incluye fotos reales del destino en sus respuestas
- Haz clic en los créditos de fotógrafos para ver más de su trabajo

## 🔧 Características Técnicas Avanzadas

### Sistema de Memoria

- **Almacenamiento por sesión**: Cada usuario tiene su propio contexto
- **Limpieza automática**: Las sesiones se limpian después de 30 minutos
- **Persistencia de estado**: Mantiene el último destino y historial de preguntas

### Manejo de Contexto

- **Extracción de ciudades**: Detecta automáticamente nombres de ciudades en el texto
- **Referencias contextuales**: Entiende pronombres como "allí", "el lugar", etc.
- **Historial inteligente**: Construye respuestas basadas en conversaciones anteriores

### APIs y Datos

- **Manejo de errores robusto**: Fallbacks elegantes cuando las APIs no responden
- **Caché inteligente**: Evita llamadas repetidas a APIs externas
- **Datos estructurados**: Información organizada y fácil de procesar

## 📱 Diseño Responsivo

La aplicación está completamente optimizada para:

- **Desktop**: Experiencia completa con sidebar y panel de historial
- **Tablet**: Layout adaptativo con elementos reorganizados
- **Mobile**: Interfaz optimizada para pantallas pequeñas

## 🎨 Características de UX/UI

- **Animaciones suaves**: Transiciones fluidas entre estados
- **Indicadores de carga**: Feedback visual durante las consultas
- **Auto-scroll**: El chat se desplaza automáticamente a nuevos mensajes
- **Diseño moderno**: Gradientes, sombras y efectos visuales atractivos
- **Accesibilidad**: Contraste adecuado y navegación por teclado

## 🔒 Seguridad y Privacidad

- **Variables de entorno**: Claves API protegidas en el servidor
- **Validación de entrada**: Sanitización de datos del usuario
- **Rate limiting**: Protección contra abuso de APIs
- **Sin almacenamiento persistente**: Los datos se mantienen solo en memoria

## 🚀 Despliegue

### Heroku

1. Conecta tu repositorio a Heroku
2. Configura las variables de entorno en el dashboard
3. Despliega automáticamente

### Vercel/Netlify (Frontend)

1. Conecta el directorio `frontend` a tu plataforma
2. Configura la URL del backend en las variables de entorno
3. Despliega

### Railway/Render (Backend)

1. Conecta el directorio `backend` a tu plataforma
2. Configura todas las variables de entorno
3. Despliega

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para detalles.

## 🙏 Agradecimientos

- **OpenAI** por proporcionar la API de GPT-3.5
- **OpenWeatherMap** por los datos meteorológicos
- **Unsplash** por las hermosas fotos de destinos
- **Exchange Rate API** por las tasas de cambio
- **React y Node.js** por las excelentes herramientas de desarrollo

## 📞 Soporte

Si tienes problemas o preguntas:

1. Revisa la sección de configuración de APIs
2. Verifica que todas las variables de entorno estén configuradas
3. Asegúrate de que ambos servidores (frontend y backend) estén corriendo
4. Abre un issue en el repositorio con detalles del problema

---

**¡Disfruta planificando tus viajes con Alex! ✈️🌍**
