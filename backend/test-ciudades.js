// Script de prueba para verificar la extracción de ciudades
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

// Pruebas
console.log('=== PRUEBAS DE EXTRACCIÓN DE CIUDADES ===\n');

const pruebas = [
  'Quiero viajar a París, Roma, Londres',
  'Hola Alex! Quiero planificar un viaje a París, Roma, Londres del 15-22 de marzo 2024',
  'Me interesa Tokio, Sídney y Nueva York',
  'Barcelona, Madrid y Sevilla',
  'Solo París'
];

pruebas.forEach((prueba, index) => {
  console.log(`Prueba ${index + 1}: "${prueba}"`);
  const ciudades = extraerMultiplesCiudades(prueba);
  console.log(`Resultado: ${ciudades.map(c => c.nombre).join(', ')}`);
  console.log('---');
}); 