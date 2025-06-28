const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
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

// Ruta para planificar viajes
app.post('/api/planificar-viaje', async (req, res) => {
  try {
    const { pregunta, historial = [] } = req.body;

    if (!pregunta || pregunta.trim() === '') {
      return res.status(400).json({ 
        error: 'Por favor, proporciona una pregunta válida' 
      });
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

    const respuesta = completion.choices[0].message.content;

    res.json({ 
      respuesta,
      pregunta 
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