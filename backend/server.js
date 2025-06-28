const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const axios = require('axios');
const moment = require('moment-timezone');
const puppeteer = require('puppeteer');
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

// Almacenamiento de contexto por sesión (en producción usarías una base de datos)
const sesionesContexto = new Map();

// Mapeo de ciudades a zonas horarias y monedas
const ciudadesInfo = {
  'paris': { timezone: 'Europe/Paris', currency: 'EUR', country: 'Francia' },
  'parís': { timezone: 'Europe/Paris', currency: 'EUR', country: 'Francia' },
  'madrid': { timezone: 'Europe/Madrid', currency: 'EUR', country: 'España' },
  'barcelona': { timezone: 'Europe/Madrid', currency: 'EUR', country: 'España' },
  'roma': { timezone: 'Europe/Rome', currency: 'EUR', country: 'Italia' },
  'rome': { timezone: 'Europe/Rome', currency: 'EUR', country: 'Italia' },
  'london': { timezone: 'Europe/London', currency: 'GBP', country: 'Reino Unido' },
  'londres': { timezone: 'Europe/London', currency: 'GBP', country: 'Reino Unido' },
  'new york': { timezone: 'America/New_York', currency: 'USD', country: 'Estados Unidos' },
  'nueva york': { timezone: 'America/New_York', currency: 'USD', country: 'Estados Unidos' },
  'tokyo': { timezone: 'Asia/Tokyo', currency: 'JPY', country: 'Japón' },
  'tokio': { timezone: 'Asia/Tokyo', currency: 'JPY', country: 'Japón' },
  'sydney': { timezone: 'Australia/Sydney', currency: 'AUD', country: 'Australia' },
  'sidney': { timezone: 'Australia/Sydney', currency: 'AUD', country: 'Australia' },
  'sídney': { timezone: 'Australia/Sydney', currency: 'AUD', country: 'Australia' },
  'buenos aires': { timezone: 'America/Argentina/Buenos_Aires', currency: 'ARS', country: 'Argentina' },
  'mexico': { timezone: 'America/Mexico_City', currency: 'MXN', country: 'México' },
  'mexico city': { timezone: 'America/Mexico_City', currency: 'MXN', country: 'México' },
  'ciudad de mexico': { timezone: 'America/Mexico_City', currency: 'MXN', country: 'México' },
  'bogota': { timezone: 'America/Bogota', currency: 'COP', country: 'Colombia' },
  'bogotá': { timezone: 'America/Bogota', currency: 'COP', country: 'Colombia' },
  'lima': { timezone: 'America/Lima', currency: 'PEN', country: 'Perú' },
  'santiago': { timezone: 'America/Santiago', currency: 'CLP', country: 'Chile' },
  'rio de janeiro': { timezone: 'America/Sao_Paulo', currency: 'BRL', country: 'Brasil' },
  'sao paulo': { timezone: 'America/Sao_Paulo', currency: 'BRL', country: 'Brasil' },
  'berlin': { timezone: 'Europe/Berlin', currency: 'EUR', country: 'Alemania' },
  'berlín': { timezone: 'Europe/Berlin', currency: 'EUR', country: 'Alemania' },
  'amsterdam': { timezone: 'Europe/Amsterdam', currency: 'EUR', country: 'Países Bajos' },
  'vienna': { timezone: 'Europe/Vienna', currency: 'EUR', country: 'Austria' },
  'viena': { timezone: 'Europe/Vienna', currency: 'EUR', country: 'Austria' },
  'prague': { timezone: 'Europe/Prague', currency: 'CZK', country: 'República Checa' },
  'praga': { timezone: 'Europe/Prague', currency: 'CZK', country: 'República Checa' },
  'budapest': { timezone: 'Europe/Budapest', currency: 'HUF', country: 'Hungría' },
  'istanbul': { timezone: 'Europe/Istanbul', currency: 'TRY', country: 'Turquía' },
  'dubai': { timezone: 'Asia/Dubai', currency: 'AED', country: 'Emiratos Árabes Unidos' },
  'dubái': { timezone: 'Asia/Dubai', currency: 'AED', country: 'Emiratos Árabes Unidos' },
  'singapore': { timezone: 'Asia/Singapore', currency: 'SGD', country: 'Singapur' },
  'singapur': { timezone: 'Asia/Singapore', currency: 'SGD', country: 'Singapur' },
  'bangkok': { timezone: 'Asia/Bangkok', currency: 'THB', country: 'Tailandia' },
  'seoul': { timezone: 'Asia/Seoul', currency: 'KRW', country: 'Corea del Sur' },
  'seul': { timezone: 'Asia/Seoul', currency: 'KRW', country: 'Corea del Sur' },
  'seúl': { timezone: 'Asia/Seoul', currency: 'KRW', country: 'Corea del Sur' },
  'beijing': { timezone: 'Asia/Shanghai', currency: 'CNY', country: 'China' },
  'pekin': { timezone: 'Asia/Shanghai', currency: 'CNY', country: 'China' },
  'pekín': { timezone: 'Asia/Shanghai', currency: 'CNY', country: 'China' },
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
  'atena': { timezone: 'Europe/Athens', currency: 'EUR', country: 'Grecia' },
  'milan': { timezone: 'Europe/Rome', currency: 'EUR', country: 'Italia' },
  'milán': { timezone: 'Europe/Rome', currency: 'EUR', country: 'Italia' },
  'venice': { timezone: 'Europe/Rome', currency: 'EUR', country: 'Italia' },
  'venecia': { timezone: 'Europe/Rome', currency: 'EUR', country: 'Italia' },
  'florence': { timezone: 'Europe/Rome', currency: 'EUR', country: 'Italia' },
  'florencia': { timezone: 'Europe/Rome', currency: 'EUR', country: 'Italia' },
  'naples': { timezone: 'Europe/Rome', currency: 'EUR', country: 'Italia' },
  'napoles': { timezone: 'Europe/Rome', currency: 'EUR', country: 'Italia' },
  'nápoles': { timezone: 'Europe/Rome', currency: 'EUR', country: 'Italia' },
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

// Función para obtener o crear contexto de sesión
function obtenerContextoSesion(sessionId) {
  if (!sesionesContexto.has(sessionId)) {
    sesionesContexto.set(sessionId, {
      ultimoDestino: null,
      ciudadesConsultadas: [], // Listado de todas las ciudades mencionadas
      historialConversacion: [],
      datosViaje: null,
      timestamp: Date.now()
    });
  }
  return sesionesContexto.get(sessionId);
}

// Función para extraer múltiples ciudades del texto
function extraerMultiplesCiudades(texto) {
  const textoLower = texto.toLowerCase();
  const ciudadesEncontradas = [];

  for (const [variacion, info] of Object.entries(ciudadesInfo)) {
    if (textoLower.includes(variacion)) {
      let ciudadNombre;
      
      // Asignar nombres específicos según el país y variación
      if (info.country === 'Estados Unidos') {
        ciudadNombre = 'Nueva York';
      } else if (info.country === 'España') {
        if (variacion.includes('barcelona')) ciudadNombre = 'Barcelona';
        else if (variacion.includes('madrid')) ciudadNombre = 'Madrid';
        else if (variacion.includes('seville') || variacion.includes('sevilla')) ciudadNombre = 'Sevilla';
        else if (variacion.includes('valencia')) ciudadNombre = 'Valencia';
        else if (variacion.includes('granada')) ciudadNombre = 'Granada';
        else if (variacion.includes('bilbao')) ciudadNombre = 'Bilbao';
        else if (variacion.includes('san sebastian') || variacion.includes('san sebastián')) ciudadNombre = 'San Sebastián';
        else if (variacion.includes('ibiza')) ciudadNombre = 'Ibiza';
        else if (variacion.includes('mallorca')) ciudadNombre = 'Mallorca';
        else if (variacion.includes('tenerife')) ciudadNombre = 'Tenerife';
        else if (variacion.includes('las palmas')) ciudadNombre = 'Las Palmas';
        else ciudadNombre = 'Ciudad de España';
      } else if (info.country === 'Italia') {
        if (variacion.includes('roma')) ciudadNombre = 'Roma';
        else if (variacion.includes('milan')) ciudadNombre = 'Milán';
        else if (variacion.includes('venice') || variacion.includes('venecia')) ciudadNombre = 'Venecia';
        else if (variacion.includes('florence') || variacion.includes('florencia')) ciudadNombre = 'Florencia';
        else if (variacion.includes('naples') || variacion.includes('napoles')) ciudadNombre = 'Nápoles';
        else ciudadNombre = 'Ciudad de Italia';
      } else if (info.country === 'Reino Unido') {
        ciudadNombre = 'Londres';
      } else if (info.country === 'Japón') {
        ciudadNombre = 'Tokio';
      } else if (info.country === 'Australia') {
        ciudadNombre = 'Sídney';
      } else if (info.country === 'Argentina') {
        ciudadNombre = 'Buenos Aires';
      } else if (info.country === 'México') {
        ciudadNombre = 'Ciudad de México';
      } else if (info.country === 'Colombia') {
        ciudadNombre = 'Bogotá';
      } else if (info.country === 'Perú') {
        ciudadNombre = 'Lima';
      } else if (info.country === 'Chile') {
        ciudadNombre = 'Santiago';
      } else if (info.country === 'Brasil') {
        ciudadNombre = 'São Paulo';
      } else if (info.country === 'Alemania') {
        ciudadNombre = 'Berlín';
      } else if (info.country === 'Países Bajos') {
        ciudadNombre = 'Ámsterdam';
      } else if (info.country === 'Austria') {
        ciudadNombre = 'Viena';
      } else if (info.country === 'República Checa') {
        ciudadNombre = 'Praga';
      } else if (info.country === 'Hungría') {
        ciudadNombre = 'Budapest';
      } else if (info.country === 'Turquía') {
        ciudadNombre = 'Estambul';
      } else if (info.country === 'Emiratos Árabes Unidos') {
        ciudadNombre = 'Dubái';
      } else if (info.country === 'Singapur') {
        ciudadNombre = 'Singapur';
      } else if (info.country === 'Tailandia') {
        ciudadNombre = 'Bangkok';
      } else if (info.country === 'Corea del Sur') {
        ciudadNombre = 'Seúl';
      } else if (info.country === 'China') {
        ciudadNombre = 'Pekín';
      } else if (info.country === 'Hong Kong') {
        ciudadNombre = 'Hong Kong';
      } else if (info.country === 'India') {
        ciudadNombre = 'Mumbai';
      } else if (info.country === 'Egipto') {
        ciudadNombre = 'El Cairo';
      } else if (info.country === 'Sudáfrica') {
        ciudadNombre = 'Ciudad del Cabo';
      } else if (info.country === 'Marruecos') {
        ciudadNombre = 'Marrakech';
      } else if (info.country === 'Portugal') {
        ciudadNombre = 'Lisboa';
      } else if (info.country === 'Grecia') {
        ciudadNombre = 'Atenas';
      } else {
        // Si no hay coincidencia específica, usar el nombre de la variación
        ciudadNombre = variacion.charAt(0).toUpperCase() + variacion.slice(1);
      }
      
      // Evitar duplicados y no agregar nombres genéricos
      if (!ciudadesEncontradas.find(c => c.nombre === ciudadNombre) && 
          !ciudadNombre.includes('Ciudad de') && 
          ciudadNombre !== 'Ciudad') {
        ciudadesEncontradas.push({
          nombre: ciudadNombre,
          info: info
        });
      }
    }
  }

  console.log('🏙️ Ciudades extraídas:', ciudadesEncontradas.map(c => c.nombre));
  return ciudadesEncontradas;
}

// Función para extraer datos del formulario del mensaje
function extraerDatosFormulario(mensaje) {
  const datos = {};
  
  // Extraer fechas (patrón: "del 15-22 de marzo 2024" o similar)
  const fechaMatch = mensaje.match(/del\s+([^,]+?)(?:\s+al\s+([^,]+?))?\s+(?:de\s+)?([^,]+?)\s+(\d{4})/i);
  if (fechaMatch) {
    const [, fechaInicio, fechaFin, mes, año] = fechaMatch;
    if (fechaFin) {
      datos.dates = `${fechaInicio} al ${fechaFin} de ${mes} ${año}`;
    } else {
      datos.dates = `${fechaInicio} de ${mes} ${año}`;
    }
  }
  
  // Extraer presupuesto
  const presupuestoMatch = mensaje.match(/presupuesto\s+(?:es\s+)?([^,]+?)(?:\s+y\s+|\s+,\s+|\s*$)/i);
  if (presupuestoMatch) {
    datos.budget = presupuestoMatch[1].trim();
  }
  
  // Extraer preferencia
  const preferenciaMatch = mensaje.match(/experiencia\s+(?:de\s+)?([^,]+?)(?:\s+y\s+|\s+,\s+|\s*$)/i);
  if (preferenciaMatch) {
    datos.preference = preferenciaMatch[1].trim();
  }
  
  return datos;
}

// Función para determinar la ciudad de referencia
function determinarCiudadReferencia(pregunta, contexto) {
  const ciudades = extraerMultiplesCiudades(pregunta);
  
  // Si se mencionan ciudades en la pregunta actual
  if (ciudades.length > 0) {
    // Usar la primera ciudad mencionada como referencia
    const ciudadReferencia = ciudades[0];
    
    // Agregar todas las ciudades encontradas al listado
    ciudades.forEach(ciudad => {
      if (!contexto.ciudadesConsultadas.find(c => c.nombre === ciudad.nombre)) {
        contexto.ciudadesConsultadas.push(ciudad);
      }
    });
    
    // Actualizar último destino
    contexto.ultimoDestino = ciudadReferencia;
    
    return ciudadReferencia;
  }
  
  // Si no se mencionan ciudades, usar la última consultada
  if (contexto.ultimoDestino) {
    return contexto.ultimoDestino;
  }
  
  return null;
}

// Función para limpiar sesiones antiguas (cada 30 minutos)
setInterval(() => {
  const ahora = Date.now();
  const treintaMinutos = 30 * 60 * 1000;
  
  for (const [sessionId, contexto] of sesionesContexto.entries()) {
    if (ahora - contexto.timestamp > treintaMinutos) {
      sesionesContexto.delete(sessionId);
    }
  }
}, 30 * 60 * 1000);

// Nuevo endpoint para información en tiempo real
app.get('/api/info-tiempo-real/:ciudad', async (req, res) => {
  try {
    const { ciudad } = req.params;
    const ciudades = extraerMultiplesCiudades(ciudad);
    
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
    const { pregunta, historial = [], sessionId = 'default', esFormularioInicial = false } = req.body;

    if (!pregunta || pregunta.trim() === '') {
      return res.status(400).json({ 
        error: 'Por favor, proporciona una pregunta válida' 
      });
    }

    // Obtener contexto de la sesión
    const contexto = obtenerContextoSesion(sessionId);
    
    let ciudadActual = null;
    let infoClima = null;
    let fotos = null;
    let mensajeValidacion = '';

    // Manejo especial para formulario inicial
    if (esFormularioInicial) {
      const ciudades = extraerMultiplesCiudades(pregunta);
      
      console.log('🔍 Ciudades detectadas en formulario inicial:', ciudades.map(c => c.nombre));
      
      // Extraer datos del formulario del mensaje
      const datosViaje = extraerDatosFormulario(pregunta);
      contexto.datosViaje = datosViaje;
      
      if (ciudades.length > 0) {
        // Tomar la primera ciudad como principal
        ciudadActual = ciudades[0];
        contexto.ultimoDestino = ciudadActual;
        
        console.log('📍 Ciudad principal seleccionada:', ciudadActual.nombre);
        
        // Agregar todas las ciudades al listado
        ciudades.forEach(ciudad => {
          if (!contexto.ciudadesConsultadas.find(c => c.nombre === ciudad.nombre)) {
            contexto.ciudadesConsultadas.push(ciudad);
          }
        });
        
        // Crear mensaje de validación si hay múltiples ciudades
        if (ciudades.length > 1) {
          const otrasCiudades = ciudades.slice(1).map(c => c.nombre).join(', ');
          mensajeValidacion = `\n\n✅ **Confirmación**: He tomado **${ciudadActual.nombre}** como tu destino principal. También mencionaste: ${otrasCiudades}. Puedes preguntarme sobre cualquiera de estos destinos en cualquier momento.`;
        }
      }
    } else {
      // Procesamiento normal para preguntas posteriores
      ciudadActual = determinarCiudadReferencia(pregunta, contexto);
      console.log('🔍 Ciudad de referencia para pregunta normal:', ciudadActual?.nombre);
    }

    // Obtener clima y fotos si hay ciudad
    if (ciudadActual) {
      const [clima, fotosData] = await Promise.all([
        obtenerClima(ciudadActual.nombre),
        obtenerFotos(ciudadActual.nombre)
      ]);
      
      infoClima = clima;
      fotos = fotosData;
    }

    // Actualizar historial de conversación con la pregunta
    const preguntaItem = {
      pregunta: pregunta.trim(),
      timestamp: new Date().toISOString(),
      ciudad: ciudadActual ? ciudadActual.nombre : null
    };
    contexto.historialConversacion.push(preguntaItem);

    // Mantener solo las últimas 10 preguntas
    if (contexto.historialConversacion.length > 10) {
      contexto.historialConversacion = contexto.historialConversacion.slice(-10);
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

CONTEXTO IMPORTANTE:
• Último destino consultado: ${contexto.ultimoDestino ? contexto.ultimoDestino.nombre : 'Ninguno'}
• Todas las ciudades mencionadas: ${contexto.ciudadesConsultadas.map(c => c.nombre).join(', ') || 'Ninguna'}
• Historial de preguntas: ${contexto.historialConversacion.map(h => h.pregunta).join(', ')}
• Si el usuario pregunta sobre "allí", "el lugar", "el destino", etc., me refiero a ${contexto.ultimoDestino ? contexto.ultimoDestino.nombre : 'el último destino mencionado'}

MANEJO DE MÚLTIPLES CIUDADES:
• Si el usuario menciona múltiples ciudades, puedo referenciar cualquiera de ellas
• Si pregunta "¿qué tal Roma?" y Roma está en el listado, respondo sobre Roma
• Si pregunta "¿y en Londres cómo está el clima?" y Londres está en el listado, respondo sobre Londres
• Siempre mantengo el contexto de todas las ciudades mencionadas

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

    // Agregar mensaje de validación si es necesario
    if (mensajeValidacion) {
      respuesta += mensajeValidacion;
    }

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

📸 **¡Mira estas hermosas fotos de ${ciudadActual.nombre} para inspirarte!**`;
    }

    // Guardar la respuesta de Alex en el historial
    const respuestaItem = {
      respuesta: respuesta,
      timestamp: new Date().toISOString(),
      ciudad: ciudadActual ? ciudadActual.nombre : null
    };
    contexto.historialConversacion.push(respuestaItem);

    res.json({ 
      respuesta,
      pregunta,
      clima: infoClima,
      fotos: fotos,
      ciudadInfo: ciudadActual,
      historial: contexto.historialConversacion,
      ultimoDestino: contexto.ultimoDestino,
      ciudadesConsultadas: contexto.ciudadesConsultadas
    });

  } catch (error) {
    console.error('Error al consultar OpenAI:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor. Intenta de nuevo más tarde.' 
    });
  }
});

// Endpoint para obtener historial de conversación
app.get('/api/historial/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    const contexto = obtenerContextoSesion(sessionId);
    
    res.json({
      historial: contexto.historialConversacion,
      ultimoDestino: contexto.ultimoDestino,
      ciudadesConsultadas: contexto.ciudadesConsultadas,
      datosViaje: contexto.datosViaje
    });
  } catch (error) {
    console.error('Error obteniendo historial:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor' 
    });
  }
});

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor funcionando correctamente' });
});

// Función para generar PDF del itinerario
async function generarPDFItinerario(sessionId) {
  try {
    const contexto = obtenerContextoSesion(sessionId);
    if (!contexto || contexto.historialConversacion.length === 0) {
      throw new Error('No hay conversación para generar el itinerario');
    }

    // Obtener información del viaje
    const ultimoDestino = contexto.ultimoDestino;
    const ciudadesConsultadas = contexto.ciudadesConsultadas;
    const historial = contexto.historialConversacion;
    const datosViaje = contexto.datosViaje;

    // Obtener fotos del destino principal
    let fotosDestino = [];
    if (ultimoDestino) {
      try {
        fotosDestino = await obtenerFotos(ultimoDestino.nombre);
        // Tomar solo las primeras 3 fotos
        fotosDestino = fotosDestino.slice(0, 3);
      } catch (error) {
        console.log('No se pudieron obtener fotos del destino');
      }
    }

    // Crear HTML del itinerario
    const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Mi Itinerario de Viaje - ViajeIA</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                background: #f8f9fa;
            }
            
            .container {
                max-width: 800px;
                margin: 0 auto;
                background: white;
                box-shadow: 0 0 20px rgba(0,0,0,0.1);
            }
            
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 40px 30px;
                text-align: center;
            }
            
            .logo {
                font-size: 2.5rem;
                margin-bottom: 10px;
            }
            
            .title {
                font-size: 2rem;
                margin-bottom: 10px;
                font-weight: 600;
            }
            
            .subtitle {
                font-size: 1.1rem;
                opacity: 0.9;
            }
            
            .destino-info {
                background: #f8f9fa;
                padding: 30px;
                border-bottom: 1px solid #e9ecef;
            }
            
            .destino-principal {
                font-size: 1.8rem;
                color: #667eea;
                margin-bottom: 15px;
                font-weight: 600;
            }
            
            .ciudades-lista {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                margin-top: 15px;
            }
            
            .ciudad-tag {
                background: #667eea;
                color: white;
                padding: 5px 12px;
                border-radius: 20px;
                font-size: 0.9rem;
            }
            
            .ciudad-principal {
                background: #28a745;
            }
            
            .fotos-destino {
                padding: 30px;
                background: white;
                border-bottom: 1px solid #e9ecef;
            }
            
            .fotos-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 15px;
                margin-top: 20px;
            }
            
            .foto-item {
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            
            .foto-item img {
                width: 100%;
                height: 150px;
                object-fit: cover;
            }
            
            .foto-credito {
                background: rgba(0,0,0,0.7);
                color: white;
                padding: 5px 8px;
                font-size: 0.7rem;
                text-align: center;
            }
            
            .conversacion {
                padding: 30px;
            }
            
            .conversacion h2 {
                color: #495057;
                margin-bottom: 20px;
                font-size: 1.5rem;
                border-bottom: 2px solid #667eea;
                padding-bottom: 10px;
            }
            
            .mensaje {
                margin-bottom: 25px;
                padding: 20px;
                border-radius: 12px;
                position: relative;
            }
            
            .mensaje-usuario {
                background: #e3f2fd;
                border-left: 4px solid #2196f3;
                margin-left: 20px;
            }
            
            .mensaje-alex {
                background: #f3e5f5;
                border-left: 4px solid #9c27b0;
                margin-right: 20px;
            }
            
            .mensaje-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
                font-size: 0.9rem;
                color: #666;
            }
            
            .mensaje-autor {
                font-weight: 600;
            }
            
            .mensaje-contenido {
                line-height: 1.6;
            }
            
            .resumen-recomendaciones {
                background: linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 100%);
                padding: 30px;
                border-left: 4px solid #28a745;
                margin: 20px 0;
            }
            
            .resumen-recomendaciones h3 {
                color: #28a745;
                margin-bottom: 15px;
                font-size: 1.3rem;
            }
            
            .recomendacion-item {
                margin-bottom: 10px;
                padding-left: 20px;
                position: relative;
            }
            
            .recomendacion-item:before {
                content: "•";
                color: #28a745;
                font-weight: bold;
                position: absolute;
                left: 0;
            }
            
            .footer {
                background: #495057;
                color: white;
                text-align: center;
                padding: 20px;
                font-size: 0.9rem;
            }
            
            .fecha-generacion {
                margin-top: 10px;
                opacity: 0.8;
            }
            
            @media print {
                body { background: white; }
                .container { box-shadow: none; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">✈️ ViajeIA</div>
                <h1 class="title">Mi Itinerario de Viaje</h1>
                <p class="subtitle">Planificado con Alex, tu consultor personal</p>
            </div>
            
            <div class="destino-info">
                <div class="destino-principal">
                    ${ultimoDestino ? ultimoDestino.nombre : 'Destino no especificado'}
                </div>
                ${datosViaje ? `
                <p><strong>Fechas:</strong> ${datosViaje.dates || 'No especificadas'}</p>
                <p><strong>Presupuesto:</strong> ${datosViaje.budget || 'No especificado'}</p>
                <p><strong>Preferencia:</strong> ${datosViaje.preference || 'No especificada'}</p>
                ` : ''}
                
                ${ciudadesConsultadas.length > 0 ? `
                <div class="ciudades-lista">
                    <strong>Ciudades consultadas:</strong><br>
                    ${ciudadesConsultadas.map(ciudad => 
                        `<span class="ciudad-tag ${ciudad.nombre === ultimoDestino?.nombre ? 'ciudad-principal' : ''}">${ciudad.nombre}</span>`
                    ).join('')}
                </div>
                ` : ''}
            </div>
            
            ${fotosDestino.length > 0 ? `
            <div class="fotos-destino">
                <h3>📸 Fotos de ${ultimoDestino.nombre}</h3>
                <div class="fotos-grid">
                    ${fotosDestino.map(foto => `
                        <div class="foto-item">
                            <img src="${foto.url}" alt="${foto.alt}" />
                            <div class="foto-credito">
                                📸 por ${foto.photographer}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}
            
            <div class="resumen-recomendaciones">
                <h3>🎯 Resumen de Recomendaciones</h3>
                <div class="recomendacion-item">
                    <strong>Destino Principal:</strong> ${ultimoDestino ? ultimoDestino.nombre : 'No especificado'}
                </div>
                ${datosViaje?.dates ? `
                <div class="recomendacion-item">
                    <strong>Fechas de Viaje:</strong> ${datosViaje.dates}
                </div>
                ` : ''}
                ${datosViaje?.budget ? `
                <div class="recomendacion-item">
                    <strong>Presupuesto:</strong> ${datosViaje.budget}
                </div>
                ` : ''}
                ${datosViaje?.preference ? `
                <div class="recomendacion-item">
                    <strong>Tipo de Experiencia:</strong> ${datosViaje.preference}
                </div>
                ` : ''}
                ${ciudadesConsultadas.length > 1 ? `
                <div class="recomendacion-item">
                    <strong>Otros Destinos Mencionados:</strong> ${ciudadesConsultadas.filter(c => c.nombre !== ultimoDestino?.nombre).map(c => c.nombre).join(', ')}
                </div>
                ` : ''}
            </div>
            
            <div class="conversacion">
                <h2>💬 Conversación Completa con Alex</h2>
                ${historial.map((item, index) => {
                    if (item.pregunta) {
                        // Es una pregunta del usuario
                        return `
                        <div class="mensaje mensaje-usuario">
                            <div class="mensaje-header">
                                <span class="mensaje-autor">👤 Tú</span>
                                <span class="mensaje-fecha">${new Date(item.timestamp).toLocaleString('es-ES')}</span>
                            </div>
                            <div class="mensaje-contenido">
                                ${item.pregunta.replace(/\n/g, '<br>')}
                            </div>
                        </div>
                        `;
                    } else if (item.respuesta) {
                        // Es una respuesta de Alex
                        return `
                        <div class="mensaje mensaje-alex">
                            <div class="mensaje-header">
                                <span class="mensaje-autor">✈️ Alex</span>
                                <span class="mensaje-fecha">${new Date(item.timestamp).toLocaleString('es-ES')}</span>
                            </div>
                            <div class="mensaje-contenido">
                                ${item.respuesta.replace(/\n/g, '<br>')}
                            </div>
                        </div>
                        `;
                    }
                    return '';
                }).join('')}
            </div>
            
            <div class="footer">
                <p>✨ Generado con ViajeIA - Tu asistente personal de viajes</p>
                <p class="fecha-generacion">Fecha de generación: ${new Date().toLocaleString('es-ES')}</p>
            </div>
        </div>
    </body>
    </html>
    `;

    // Generar PDF usando Puppeteer
    const browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    const page = await browser.newPage();
    
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      }
    });

    await browser.close();
    
    return pdf;
  } catch (error) {
    console.error('Error generando PDF:', error);
    throw error;
  }
}

// Endpoint para generar PDF del itinerario
app.get('/api/descargar-itinerario/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const pdf = await generarPDFItinerario(sessionId);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="itinerario-viaje-${sessionId}.pdf"`);
    res.setHeader('Content-Length', pdf.length);
    res.end(pdf);
    
  } catch (error) {
    console.error('Error en endpoint PDF:', error);
    res.status(500).json({ 
      error: 'Error generando el PDF del itinerario' 
    });
  }
});

app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
  console.log(`📊 Endpoint de salud: http://localhost:${port}/health`);
});

// Exportar funciones para testing
module.exports = {
  generarPDFItinerario,
  obtenerContextoSesion
}; 