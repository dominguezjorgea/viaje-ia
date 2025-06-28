const puppeteer = require('puppeteer');
const fs = require('fs');

async function generarPDFItinerarioTest(contexto) {
  try {
    if (!contexto || contexto.historialConversacion.length === 0) {
      throw new Error('No hay conversación para generar el itinerario');
    }

    // Obtener información del viaje
    const ultimoDestino = contexto.ultimoDestino;
    const ciudadesConsultadas = contexto.ciudadesConsultadas;
    const historial = contexto.historialConversacion;
    const datosViaje = contexto.datosViaje;

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
            
            <div class="conversacion">
                <h2>📋 Recomendaciones y Planificación</h2>
                ${historial.map((item, index) => {
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

async function testPDF() {
  try {
    console.log('🧪 Probando generación de PDF...');
    
    // Crear un contexto de prueba
    const testContexto = {
      ultimoDestino: {
        nombre: 'París',
        info: {
          country: 'Francia',
          timezone: 'Europe/Paris',
          currency: 'EUR'
        }
      },
      ciudadesConsultadas: [
        {
          nombre: 'París',
          info: {
            country: 'Francia',
            timezone: 'Europe/Paris',
            currency: 'EUR'
          }
        },
        {
          nombre: 'Londres',
          info: {
            country: 'Reino Unido',
            timezone: 'Europe/London',
            currency: 'GBP'
          }
        }
      ],
      historialConversacion: [
        {
          pregunta: 'Hola Alex, quiero viajar a París y Londres del 15-22 de marzo 2024. Mi presupuesto es Medio y prefiero experiencia de Cultura.',
          timestamp: new Date().toISOString()
        },
        {
          pregunta: '¿Qué tal el transporte en París?',
          timestamp: new Date().toISOString()
        },
        {
          pregunta: '¿Y en Londres cómo está el clima?',
          timestamp: new Date().toISOString()
        }
      ],
      datosViaje: {
        dates: '15-22 de marzo 2024',
        budget: 'Medio',
        preference: 'Cultura'
      },
      timestamp: Date.now()
    };

    // Generar PDF
    const pdf = await generarPDFItinerarioTest(testContexto);
    
    // Guardar PDF
    fs.writeFileSync('test-itinerario.pdf', pdf);
    
    console.log('✅ PDF generado exitosamente: test-itinerario.pdf');
    console.log('📄 Tamaño del archivo:', pdf.length, 'bytes');
    
  } catch (error) {
    console.error('❌ Error generando PDF:', error);
  }
}

testPDF(); 