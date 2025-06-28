const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const axios = require('axios');
const moment = require('moment-timezone');
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

// Mapeo de ciudades a zonas horarias y monedas
const ciudadesInfo = {
  'paris': { timezone: 'Europe/Paris', currency: 'EUR', country: 'Francia' },
  'madrid': { timezone: 'Europe/Madrid', currency: 'EUR', country: 'España' },
  'barcelona': { timezone: 'Europe/Madrid', currency: 'EUR', country: 'España' },
  'roma': { timezone: 'Europe/Rome', currency: 'EUR', country: 'Italia' },
  'rome': { timezone: 'Europe/Rome', currency: 'EUR', country: 'Italia' },
  'london': { timezone: 'Europe/London', currency: 'GBP', country: 'Reino Unido' },
  'londres': { timezone: 'Europe/London', currency: 'GBP', country: 'Reino Unido' },
  'new york': { timezone: 'America/New_York', currency: 'USD', country: 'Estados Unidos' },
  'tokyo': { timezone: 'Asia/Tokyo', currency: 'JPY', country: 'Japón' },
  'tokio': { timezone: 'Asia/Tokyo', currency: 'JPY', country: 'Japón' },
  'sydney': { timezone: 'Australia/Sydney', currency: 'AUD', country: 'Australia' },
  'sidney': { timezone: 'Australia/Sydney', currency: 'AUD', country: 'Australia' },
  'buenos aires': { timezone: 'America/Argentina/Buenos_Aires', currency: 'ARS', country: 'Argentina' },
  'mexico': { timezone: 'America/Mexico_City', currency: 'MXN', country: 'México' },
  'mexico city': { timezone: 'America/Mexico_City', currency: 'MXN', country: 'México' },
  'bogota': { timezone: 'America/Bogota', currency: 'COP', country: 'Colombia' },
  'bogotá': { timezone: 'America/Bogota', currency: 'COP', country: 'Colombia' },
  'lima': { timezone: 'America/Lima', currency: 'PEN', country: 'Perú' },
  'santiago': { timezone: 'America/Santiago', currency: 'CLP', country: 'Chile' },
  'rio de janeiro': { timezone: 'America/Sao_Paulo', currency: 'BRL', country: 'Brasil' },
  'sao paulo': { timezone: 'America/Sao_Paulo', currency: 'BRL', country: 'Brasil' },
  'berlin': { timezone: 'Europe/Berlin', currency: 'EUR', country: 'Alemania' },
  'amsterdam': { timezone: 'Europe/Amsterdam', currency: 'EUR', country: 'Países Bajos' },
  'vienna': { timezone: 'Europe/Vienna', currency: 'EUR', country: 'Austria' },
  'viena': { timezone: 'Europe/Vienna', currency: 'EUR', country: 'Austria' },
  'prague': { timezone: 'Europe/Prague', currency: 'CZK', country: 'República Checa' },
  'praga': { timezone: 'Europe/Prague', currency: 'CZK', country: 'República Checa' },
  'budapest': { timezone: 'Europe/Budapest', currency: 'HUF', country: 'Hungría' },
  'istanbul': { timezone: 'Europe/Istanbul', currency: 'TRY', country: 'Turquía' },
  'dubai': { timezone: 'Asia/Dubai', currency: 'AED', country: 'Emiratos Árabes Unidos' },
  'singapore': { timezone: 'Asia/Singapore', currency: 'SGD', country: 'Singapur' },
  'singapur': { timezone: 'Asia/Singapore', currency: 'SGD', country: 'Singapur' },
  'bangkok': { timezone: 'Asia/Bangkok', currency: 'THB', country: 'Tailandia' },
  'seoul': { timezone: 'Asia/Seoul', currency: 'KRW', country: 'Corea del Sur' },
  'seul': { timezone: 'Asia/Seoul', currency: 'KRW', country: 'Corea del Sur' },
  'beijing': { timezone: 'Asia/Shanghai', currency: 'CNY', country: 'China' },
  'pekin': { timezone: 'Asia/Shanghai', currency: 'CNY', country: 'China' },
  'shanghai': { timezone: 'Asia/Shanghai', currency: 'CNY', country: 'China' },
  'hong kong': { timezone: 'Asia/Hong_Kong', currency: 'HKD', country: 'Hong Kong' },
  'mumbai': { timezone: 'Asia/Kolkata', currency: 'INR', country: 'India' },
  'delhi': { timezone: 'Asia/Kolkata', currency: 'INR', country: 'India' },
  'cairo': { timezone: 'Africa/Cairo', currency: 'EGP', country: 'Egipto' },
  'el cairo': { timezone: 'Africa/Cairo', currency: 'EGP', country: 'Egipto' },
  'cape town': { timezone: 'Africa/Johannesburg', currency: 'ZAR', country: 'Sudáfrica' },
  'ciudad del cabo': { timezone: 'Africa/Johannesburg', currency: 'ZAR', country: 'Sudáfrica' },
  'marrakech': { timezone: 'Africa/Casablanca', currency: 'MAD', country: 'Marruecos' },
  'casablanca': { timezone: 'Africa/Casablanca', currency: 'MAD', country: 'Marruecos' },
  'lisbon': { timezone: 'Europe/Lisbon', currency: 'EUR', country: 'Portugal' },
  'lisboa': { timezone: 'Europe/Lisbon', currency: 'EUR', country: 'Portugal' },
  'porto': { timezone: 'Europe/Lisbon', currency: 'EUR', country: 'Portugal' },
  'athens': { timezone: 'Europe/Athens', currency: 'EUR', country: 'Grecia' },
  'atena': { timezone: 'Europe/Athens', currency: 'EUR', country: 'Grecia' },
  'milan': { timezone: 'Europe/Rome', currency: 'EUR', country: 'Italia' },
  'venice': { timezone: 'Europe/Rome', currency: 'EUR', country: 'Italia' },
  'venecia': { timezone: 'Europe/Rome', currency: 'EUR', country: 'Italia' },
  'florence': { timezone: 'Europe/Rome', currency: 'EUR', country: 'Italia' },
  'florencia': { timezone: 'Europe/Rome', currency: 'EUR', country: 'Italia' },
  'naples': { timezone: 'Europe/Rome', currency: 'EUR', country: 'Italia' },
  'napoles': { timezone: 'Europe/Rome', currency: 'EUR', country: 'Italia' },
  'seville': { timezone: 'Europe/Madrid', currency: 'EUR', country: 'España' },
  'sevilla': { timezone: 'Europe/Madrid', currency: 'EUR', country: 'España' },
  'valencia': { timezone: 'Europe/Madrid', currency: 'EUR', country: 'España' },
  'granada': { timezone: 'Europe/Madrid', currency: 'EUR', country: 'España' },
  'bilbao': { timezone: 'Europe/Madrid', currency: 'EUR', country: 'España' },
  'san sebastian': { timezone: 'Europe/Madrid', currency: 'EUR', country: 'España' },
  'san sebastián': { timezone: 'Europe/Madrid', currency: 'EUR', country: 'España' },
  'ibiza': { timezone: 'Europe/Madrid', currency: 'EUR', country: 'España' },
  'mallorca': { timezone: 'Europe/Madrid', currency: 'EUR', country: 'España' },
  'tenerife': { timezone: 'Atlantic/Canary', currency: 'EUR', country: 'España' },
  'las palmas': { timezone: 'Atlantic/Canary', currency: 'EUR', country: 'España' },
  'las palmas de gran canaria': { timezone: 'Atlantic/Canary', currency: 'EUR', country: 'España' }
};

// Función para obtener tipo de cambio
async function obtenerTipoCambio(monedaOrigen = 'USD', monedaDestino) {
  try {
    const response = await axios.get(
      `https://api.exchangerate-api.com/v4/latest/${monedaOrigen}`
    );
    
    const rates = response.data.rates;
    const rate = rates[monedaDestino];
    
    return {
      rate: rate,
      fecha: response.data.date,
      base: monedaOrigen,
      target: monedaDestino
    };
  } catch (error) {
    console.log(`Error obteniendo tipo de cambio:`, error.message);
    return null;
  }
}

// Función para obtener diferencia horaria
function obtenerDiferenciaHoraria(timezoneDestino) {
  try {
    const ahora = moment();
    const horaLocal = ahora.format('HH:mm');
    const horaDestino = ahora.tz(timezoneDestino).format('HH:mm');
    const diferencia = ahora.tz(timezoneDestino).utcOffset() - ahora.utcOffset();
    const horasDiferencia = diferencia / 60;
    
    let diferenciaTexto = '';
    if (horasDiferencia === 0) {
      diferenciaTexto = 'Misma hora';
    } else if (horasDiferencia > 0) {
      diferenciaTexto = `+${horasDiferencia} horas`;
    } else {
      diferenciaTexto = `${horasDiferencia} horas`;
    }
    
    return {
      horaLocal,
      horaDestino,
      diferenciaTexto,
      timezone: timezoneDestino
    };
  } catch (error) {
    console.log(`Error calculando diferencia horaria:`, error.message);
    return null;
  }
}

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
  const textoLower = texto.toLowerCase();
  const ciudadesEncontradas = [];

  for (const [variacion, info] of Object.entries(ciudadesInfo)) {
    if (textoLower.includes(variacion)) {
      ciudadesEncontradas.push({
        nombre: info.country === 'Estados Unidos' ? 'Nueva York' : 
                info.country === 'España' && variacion.includes('barcelona') ? 'Barcelona' :
                info.country === 'España' && variacion.includes('madrid') ? 'Madrid' :
                info.country === 'España' && variacion.includes('seville') ? 'Sevilla' :
                info.country === 'España' && variacion.includes('valencia') ? 'Valencia' :
                info.country === 'España' && variacion.includes('granada') ? 'Granada' :
                info.country === 'España' && variacion.includes('bilbao') ? 'Bilbao' :
                info.country === 'España' && variacion.includes('san sebastian') ? 'San Sebastián' :
                info.country === 'España' && variacion.includes('ibiza') ? 'Ibiza' :
                info.country === 'España' && variacion.includes('mallorca') ? 'Mallorca' :
                info.country === 'España' && variacion.includes('tenerife') ? 'Tenerife' :
                info.country === 'España' && variacion.includes('las palmas') ? 'Las Palmas' :
                info.country === 'Italia' && variacion.includes('roma') ? 'Roma' :
                info.country === 'Italia' && variacion.includes('milan') ? 'Milán' :
                info.country === 'Italia' && variacion.includes('venice') ? 'Venecia' :
                info.country === 'Italia' && variacion.includes('florence') ? 'Florencia' :
                info.country === 'Italia' && variacion.includes('naples') ? 'Nápoles' :
                info.country === 'Reino Unido' ? 'Londres' :
                info.country === 'Japón' ? 'Tokio' :
                info.country === 'Australia' ? 'Sídney' :
                info.country === 'Argentina' ? 'Buenos Aires' :
                info.country === 'México' ? 'Ciudad de México' :
                info.country === 'Colombia' ? 'Bogotá' :
                info.country === 'Perú' ? 'Lima' :
                info.country === 'Chile' ? 'Santiago' :
                info.country === 'Brasil' ? 'São Paulo' :
                info.country === 'Alemania' ? 'Berlín' :
                info.country === 'Países Bajos' ? 'Ámsterdam' :
                info.country === 'Austria' ? 'Viena' :
                info.country === 'República Checa' ? 'Praga' :
                info.country === 'Hungría' ? 'Budapest' :
                info.country === 'Turquía' ? 'Estambul' :
                info.country === 'Emiratos Árabes Unidos' ? 'Dubái' :
                info.country === 'Singapur' ? 'Singapur' :
                info.country === 'Tailandia' ? 'Bangkok' :
                info.country === 'Corea del Sur' ? 'Seúl' :
                info.country === 'China' ? 'Pekín' :
                info.country === 'Hong Kong' ? 'Hong Kong' :
                info.country === 'India' ? 'Mumbai' :
                info.country === 'Egipto' ? 'El Cairo' :
                info.country === 'Sudáfrica' ? 'Ciudad del Cabo' :
                info.country === 'Marruecos' ? 'Marrakech' :
                info.country === 'Portugal' ? 'Lisboa' :
                info.country === 'Grecia' ? 'Atenas' :
                'Ciudad',
        info: info
      });
    }
  }

  return ciudadesEncontradas;
}

// Nuevo endpoint para información en tiempo real
app.get('/api/info-tiempo-real/:ciudad', async (req, res) => {
  try {
    const { ciudad } = req.params;
    const ciudades = extraerCiudades(ciudad);
    
    if (ciudades.length === 0) {
      return res.status(404).json({ 
        error: 'Ciudad no encontrada o no soportada' 
      });
    }

    const ciudadInfo = ciudades[0];
    const { timezone, currency, country } = ciudadInfo.info;

    // Obtener información en paralelo
    const [clima, tipoCambio, diferenciaHoraria] = await Promise.all([
      obtenerClima(ciudadInfo.nombre),
      obtenerTipoCambio('USD', currency),
      obtenerDiferenciaHoraria(timezone)
    ]);

    res.json({
      ciudad: ciudadInfo.nombre,
      pais: country,
      moneda: currency,
      timezone: timezone,
      clima,
      tipoCambio,
      diferenciaHoraria
    });

  } catch (error) {
    console.error('Error obteniendo información en tiempo real:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor' 
    });
  }
});

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
        obtenerClima(ciudades[0].nombre),
        obtenerFotos(ciudades[0].nombre)
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

📸 **¡Mira estas hermosas fotos de ${ciudades[0].nombre} para inspirarte!**`;
    }

    res.json({ 
      respuesta,
      pregunta,
      clima: infoClima,
      fotos: fotos,
      ciudadInfo: ciudades.length > 0 ? ciudades[0] : null
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