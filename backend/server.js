const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configurar OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Función para obtener fotos de Unsplash
async function obtenerFotos(ciudad) {
  try {
    const accessKey = process.env.UNSPLASH_ACCESS_KEY;
    if (!accessKey) {
      console.log('Unsplash API key no configurada');
      return null;
    }

    const response = await axios.get(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(ciudad + ' travel')}&per_page=3&orientation=landscape`,
      {
        headers: {
          'Authorization': `Client-ID ${accessKey}`
        }
      }
    );

    const fotos = response.data.results.map(foto => ({
      url: foto.urls.regular,
      alt: foto.alt_description || `${ciudad} travel`,
      photographer: foto.user.name,
      photographerUrl: foto.user.links.html
    }));

    return fotos;
  } catch (error) {
    console.log(`Error obteniendo fotos para ${ciudad}:`, error.message);
    return null;
  }
}

// Función para obtener el clima de una ciudad
async function obtenerClima(ciudad) {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) {
      console.log('OpenWeather API key no configurada');
      return null;
    }

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(ciudad)}&appid=${apiKey}&units=metric&lang=es`
    );

    const data = response.data;
    return {
      temperatura: Math.round(data.main.temp),
      sensacion: Math.round(data.main.feels_like),
      humedad: data.main.humidity,
      descripcion: data.weather[0].description,
      icono: data.weather[0].icon,
      ciudad: data.name,
      pais: data.sys.country
    };
  } catch (error) {
    console.log(`Error obteniendo clima para ${ciudad}:`, error.message);
    return null;
  }
}

// Función para extraer nombres de ciudades del texto
function extraerCiudades(texto) {
  // Lista de ciudades comunes y sus variaciones
  const ciudadesComunes = {
    'paris': 'París',
    'paris,': 'París',
    'paris.': 'París',
    'madrid': 'Madrid',
    'barcelona': 'Barcelona',
    'roma': 'Roma',
    'rome': 'Roma',
    'london': 'Londres',
    'londres': 'Londres',
    'new york': 'Nueva York',
    'tokyo': 'Tokio',
    'tokio': 'Tokio',
    'sydney': 'Sídney',
    'sidney': 'Sídney',
    'buenos aires': 'Buenos Aires',
    'mexico': 'Ciudad de México',
    'mexico city': 'Ciudad de México',
    'bogota': 'Bogotá',
    'bogotá': 'Bogotá',
    'lima': 'Lima',
    'santiago': 'Santiago',
    'rio de janeiro': 'Río de Janeiro',
    'sao paulo': 'São Paulo',
    'berlin': 'Berlín',
    'amsterdam': 'Ámsterdam',
    'amsterdam,': 'Ámsterdam',
    'amsterdam.': 'Ámsterdam',
    'vienna': 'Viena',
    'viena': 'Viena',
    'prague': 'Praga',
    'praga': 'Praga',
    'budapest': 'Budapest',
    'istanbul': 'Estambul',
    'dubai': 'Dubái',
    'dubai,': 'Dubái',
    'dubai.': 'Dubái',
    'singapore': 'Singapur',
    'singapur': 'Singapur',
    'bangkok': 'Bangkok',
    'seoul': 'Seúl',
    'seul': 'Seúl',
    'beijing': 'Pekín',
    'pekin': 'Pekín',
    'shanghai': 'Shanghái',
    'shanghai,': 'Shanghái',
    'shanghai.': 'Shanghái',
    'hong kong': 'Hong Kong',
    'mumbai': 'Mumbai',
    'delhi': 'Delhi',
    'cairo': 'El Cairo',
    'el cairo': 'El Cairo',
    'cape town': 'Ciudad del Cabo',
    'ciudad del cabo': 'Ciudad del Cabo',
    'marrakech': 'Marrakech',
    'casablanca': 'Casablanca',
    'lisbon': 'Lisboa',
    'lisboa': 'Lisboa',
    'porto': 'Oporto',
    'athens': 'Atenas',
    'atena': 'Atenas',
    'milan': 'Milán',
    'milan,': 'Milán',
    'milan.': 'Milán',
    'venice': 'Venecia',
    'venecia': 'Venecia',
    'florence': 'Florencia',
    'florencia': 'Florencia',
    'naples': 'Nápoles',
    'napoles': 'Nápoles',
    'seville': 'Sevilla',
    'sevilla': 'Sevilla',
    'valencia': 'Valencia',
    'granada': 'Granada',
    'bilbao': 'Bilbao',
    'san sebastian': 'San Sebastián',
    'san sebastián': 'San Sebastián',
    'ibiza': 'Ibiza',
    'mallorca': 'Mallorca',
    'tenerife': 'Tenerife',
    'las palmas': 'Las Palmas',
    'las palmas de gran canaria': 'Las Palmas de Gran Canaria'
  };

  const textoLower = texto.toLowerCase();
  const ciudadesEncontradas = [];

  for (const [variacion, ciudad] of Object.entries(ciudadesComunes)) {
    if (textoLower.includes(variacion)) {
      ciudadesEncontradas.push(ciudad);
    }
  }

  return ciudadesEncontradas;
}

// Ruta para planificar viajes
app.post('/api/planificar-viaje', async (req, res) => {
  try {
    const { pregunta, historial = [] } = req.body;

    if (!pregunta || pregunta.trim() === '') {
      return res.status(400).json({ 
        error: 'Por favor, proporciona una pregunta válida' 
      });
    }

    // Extraer ciudades mencionadas en la pregunta
    const ciudades = extraerCiudades(pregunta);
    let infoClima = null;
    let fotos = null;

    // Obtener clima y fotos de la primera ciudad encontrada
    if (ciudades.length > 0) {
      const [clima, fotosData] = await Promise.all([
        obtenerClima(ciudades[0]),
        obtenerFotos(ciudades[0])
      ]);
      
      infoClima = clima;
      fotos = fotosData;
    }

    // Construir el array de mensajes con el historial
    const mensajes = [
      {
        role: "system",
        content: `¡Hola! Soy Alex, tu consultor personal de viajes ✈️🌍

Siempre me presento como "Alex, tu consultor personal de viajes" y soy:
• Entusiasta y amigable en todas mis respuestas 😊
• Curioso por conocer mejor tus preferencias - siempre hago preguntas relevantes
• Organizado - uso bullets (•) para estructurar la información
• Visual - incluyo emojis de viajes relevantes en mis respuestas

Mi estilo de respuesta:
1. Me presento brevemente como Alex
2. Muestro entusiasmo por tu consulta
3. Hago 2-3 preguntas específicas para personalizar mejor mi recomendación
4. Proporciono información organizada con bullets y emojis
5. Termino con una nota amigable y motivacional

IMPORTANTE - Uso del contexto inicial:
Si el usuario ya completó el formulario inicial, tengo información sobre:
• Destino específico
• Fechas de viaje
• Presupuesto (Económico/Medio/Alto/Premium)
• Preferencia de experiencia (Aventura/Relajación/Cultura/Gastronomía/Naturaleza/Urbano)

Debo usar esta información para:
• Hacer recomendaciones específicas al presupuesto
• Sugerir actividades según la preferencia
• Considerar la duración del viaje
• Adaptar el tono según el tipo de experiencia

INFORMACIÓN DEL CLIMA:
Si tengo información del clima actual del destino, debo incluirla de forma natural en mi respuesta, mencionando:
• La temperatura actual
• La descripción del clima
• Recomendaciones basadas en el clima (qué ropa llevar, actividades apropiadas, etc.)

FOTOS DEL DESTINO:
Si tengo fotos del destino, debo mencionar que se están mostrando fotos hermosas del lugar para inspirar al viajero.

Ejemplos de emojis que uso: ✈️🌍🏖️🏔️🗺️🍕🎭🎨🏛️🌅🌆🏨🚗🚇🎒💼📸

IMPORTANTE: Mantén el contexto de la conversación. Si ya hemos hablado sobre un destino, no te repitas. Construye sobre la información anterior y haz preguntas más específicas basadas en lo que ya sabemos.

Sé específico, útil y siempre mantén un tono cálido y profesional.`
      },
      // Agregar el historial de la conversación
      ...historial,
      // Agregar la nueva pregunta
      {
        role: "user",
        content: pregunta
      }
    ];

    // Llamar a la API de OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: mensajes,
      max_tokens: 800,
      temperature: 0.8,
    });

    let respuesta = completion.choices[0].message.content;

    // Agregar información del clima si está disponible
    if (infoClima) {
      const climaInfo = `

🌤️ **Clima actual en ${infoClima.ciudad}, ${infoClima.pais}:**
• Temperatura: ${infoClima.temperatura}°C (sensación térmica: ${infoClima.sensacion}°C)
• Condición: ${infoClima.descripcion}
• Humedad: ${infoClima.humedad}%

💡 **Consejo de Alex:** ${infoClima.temperatura > 25 ? '¡Perfecto para actividades al aire libre! 🌞' : 
                        infoClima.temperatura > 15 ? 'Temperatura agradable para explorar la ciudad 🚶‍♂️' : 
                        '¡No olvides llevar abrigo! 🧥'}`;

      respuesta += climaInfo;
    }

    // Agregar mención de fotos si están disponibles
    if (fotos && fotos.length > 0) {
      respuesta += `

📸 **¡Mira estas hermosas fotos de ${ciudades[0]} para inspirarte!**`;
    }

    res.json({ 
      respuesta,
      pregunta,
      clima: infoClima,
      fotos: fotos
    });

  } catch (error) {
    console.error('Error al consultar OpenAI:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor. Intenta de nuevo más tarde.' 
    });
  }
});

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor funcionando correctamente' });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
}); 