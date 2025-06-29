/**
 * Analiza la pregunta y el contexto, y decide cómo responder.
 * @param {string} pregunta
 * @param {object} contexto - Incluye ciudadesConsultadas, historial, datosViaje, etc.
 * @returns {object} {
 *   tema: string,
 *   ciudades: string[],
 *   esGenerica: boolean,
 *   instrucciones: string,
 * }
 */
function analizarPreguntaYContexto(pregunta, contexto) {
  // 1. Detectar tema por palabras clave
  let tema = 'general';
  if (/clima|temperatura|lluvia|frío|calor|tiempo/i.test(pregunta)) tema = 'clima';
  else if (/transporte|metro|bus|autobús|taxi|movilidad|traslado/i.test(pregunta)) tema = 'transporte';
  else if (/comida|gastronomía|restaurante|plato|cocina/i.test(pregunta)) tema = 'gastronomía';
  else if (/seguridad|peligroso|seguro|robo|delito/i.test(pregunta)) tema = 'seguridad';
  else if (/evento|festival|concierto|agenda|actividad/i.test(pregunta)) tema = 'eventos';

  // 2. Detectar si es genérica
  const esGenerica = /esas ciudades|los destinos|todas|todos|allí|todas las ciudades|los lugares|los sitios|los países/i.test(pregunta);

  // 3. Detectar ciudades mencionadas
  let ciudades = [];
  if (esGenerica && contexto.ciudadesConsultadas && contexto.ciudadesConsultadas.length > 0) {
    ciudades = contexto.ciudadesConsultadas.map(c => c.nombre);
  } else {
    // Buscar ciudades mencionadas explícitamente en la pregunta
    if (contexto.ciudadesConsultadas && contexto.ciudadesConsultadas.length > 0) {
      for (const ciudad of contexto.ciudadesConsultadas) {
        if (pregunta.toLowerCase().includes(ciudad.nombre.toLowerCase())) {
          ciudades.push(ciudad.nombre);
        }
      }
    }
    // Si no se detecta ninguna, usar el último destino
    if (ciudades.length === 0 && contexto.ultimoDestino) {
      ciudades = [contexto.ultimoDestino.nombre];
    }
  }

  // 4. Generar instrucciones para OpenAI
  let instrucciones = '';
  if (esGenerica && ciudades.length > 1) {
    instrucciones = `Responde con un bloque separado para cada ciudad (${ciudades.join(', ')}), sobre el tema "${tema}". Sé específico y no repitas información. Usa bullets y emojis.`;
  } else if (ciudades.length === 1) {
    instrucciones = `Responde sobre la ciudad de ${ciudades[0]} y el tema "${tema}". Sé específico, usa bullets y emojis.`;
  } else {
    instrucciones = `Responde sobre el tema "${tema}" para el destino consultado. Sé específico, usa bullets y emojis.`;
  }

  return {
    tema,
    ciudades,
    esGenerica,
    instrucciones
  };
}

module.exports = { analizarPreguntaYContexto }; 