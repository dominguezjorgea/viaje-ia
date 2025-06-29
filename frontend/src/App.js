import React, { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSurvey, setShowSurvey] = useState(true);
  const [surveyData, setSurveyData] = useState({
    destination: '',
    dates: '',
    budget: '',
    preference: ''
  });
  const [sidebarInfo, setSidebarInfo] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [sessionId] = useState(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [historialPreguntas, setHistorialPreguntas] = useState([]);
  const [ultimoDestino, setUltimoDestino] = useState(null);
  const [showHistorial, setShowHistorial] = useState(false);
  const [ciudadesConsultadas, setCiudadesConsultadas] = useState([]);
  
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3009';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSurveySubmit = async (e) => {
    e.preventDefault();
    if (!surveyData.destination || !surveyData.dates || !surveyData.budget || !surveyData.preference) {
      alert('Por favor completa todos los campos');
      return;
    }

    const surveyMessage = `Hola Alex! Quiero planificar un viaje a ${surveyData.destination} del ${surveyData.dates}. Mi presupuesto es ${surveyData.budget} y me interesa una experiencia de ${surveyData.preference}. ¿Puedes ayudarme a planificar este viaje?`;
    
    setShowSurvey(false);
    await sendMessage(surveyMessage, true); // true indica que es formulario inicial
  };

  const sendMessage = async (message = null, esFormularioInicial = false) => {
    const currentMessage = message || inputMessage.trim();
    if (!currentMessage) return;

    setIsLoading(true);
    
    // Agregar mensaje del usuario
    const userMessage = {
      id: Date.now(),
      text: currentMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    try {
      const response = await fetch(`${backendUrl}/api/planificar-viaje`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pregunta: currentMessage,
          historial: messages.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text
          })),
          sessionId: sessionId,
          esFormularioInicial: esFormularioInicial
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Agregar respuesta de Alex
      const alexMessage = {
        id: Date.now() + 1,
        text: data.respuesta,
        sender: 'alex',
        timestamp: new Date().toLocaleTimeString(),
        clima: data.clima,
        fotos: data.fotos,
        ciudadInfo: data.ciudadInfo
      };

      setMessages(prev => [...prev, alexMessage]);
      
      // Actualizar historial, último destino y ciudades consultadas
      if (data.historial) {
        setHistorialPreguntas(data.historial);
      }
      if (data.ultimoDestino) {
        setUltimoDestino(data.ultimoDestino);
      }
      if (data.ciudadesConsultadas) {
        setCiudadesConsultadas(data.ciudadesConsultadas);
      }

      // Obtener información en tiempo real solo de la última ciudad mencionada
      if (data.ciudadInfo) {
        await fetchSidebarInfo(data.ciudadInfo.nombre);
      }

    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.',
        sender: 'alex',
        timestamp: new Date().toLocaleTimeString(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSidebarInfo = async (ciudad) => {
    try {
      const response = await fetch(`${backendUrl}/api/info-tiempo-real/${encodeURIComponent(ciudad)}`);
      const data = await response.json();
      
      if (!data.error) {
        setSidebarInfo(data);
        setShowSidebar(true);
      }
    } catch (error) {
      console.error('Error obteniendo información en tiempo real:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timeString) => {
    return new Date(timeString).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getWeatherEmoji = (temp) => {
    if (temp >= 25) return '🌞';
    if (temp >= 15) return '🌤️';
    if (temp >= 5) return '⛅';
    return '❄️';
  };

  const handleDownloadPDF = async () => {
    try {
      // Mostrar indicador de carga
      const button = document.querySelector('.download-pdf-button');
      const originalText = button.textContent;
      button.textContent = '⏳ Generando PDF...';
      button.disabled = true;

      // Llamar al endpoint del backend
      const response = await fetch(`${backendUrl}/api/descargar-itinerario/${sessionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al generar el PDF');
      }

      // Obtener el blob del PDF
      const blob = await response.blob();
      
      // Crear URL del blob y descargar
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `itinerario-viaje-${sessionId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Restaurar botón
      button.textContent = originalText;
      button.disabled = false;

    } catch (error) {
      console.error('Error descargando PDF:', error);
      alert('Error al generar el PDF. Por favor, intenta de nuevo.');
      
      // Restaurar botón en caso de error
      const button = document.querySelector('.download-pdf-button');
      if (button) {
        button.textContent = '📄 Descargar mi itinerario en PDF';
        button.disabled = false;
      }
    }
  };

  return (
    <div className="App">
      <div className="chat-container" ref={chatContainerRef}>
        <div className="chat-header">
          <div className="header-content">
            <div className="alex-info">
              <div className="alex-avatar">✈️</div>
              <div>
                <h1>Alex, tu consultor de viajes</h1>
                <p>¡Hola! Soy tu asistente personal para planificar aventuras increíbles</p>
              </div>
            </div>
            <div className="header-actions">
              <button 
                className="historial-btn"
                onClick={() => setShowHistorial(!showHistorial)}
                title="Ver historial de preguntas"
              >
                📋 Historial
              </button>
              {ciudadesConsultadas.length > 0 && (
                <div className="ciudades-consultadas">
                  <span>🌍 {ciudadesConsultadas.length} ciudad{ciudadesConsultadas.length > 1 ? 'es' : ''}</span>
                  <div className="ciudades-tooltip">
                    <div className="ciudades-list">
                      {ciudadesConsultadas.map((ciudad, index) => (
                        <div key={index} className="ciudad-item">
                          <span className={`ciudad-nombre ${ciudad.nombre === ultimoDestino?.nombre ? 'ciudad-actual' : ''}`}>
                            {ciudad.nombre}
                          </span>
                          {ciudad.nombre === ultimoDestino?.nombre && (
                            <span className="ciudad-principal">📍 Principal</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {ultimoDestino && (
                <div className="ultimo-destino">
                  <span>📍 Último: {ultimoDestino.nombre}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Panel de historial */}
        {showHistorial && (
          <div className="historial-panel">
            <h3>📋 Historial de preguntas</h3>
            {historialPreguntas.length > 0 ? (
              <div className="historial-list">
                {historialPreguntas.map((item, index) => (
                  <div key={index} className="historial-item">
                    <div className="historial-pregunta">
                      <span className="historial-icon">❓</span>
                      {item.pregunta}
                    </div>
                    <div className="historial-meta">
                      <span className="historial-fecha">
                        {formatTime(item.timestamp)}
                      </span>
                      {item.ciudad && (
                        <span className="historial-ciudad">
                          📍 {item.ciudad}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-historial">Aún no hay preguntas en el historial</p>
            )}
          </div>
        )}

        {/* Formulario inicial */}
        {showSurvey && (
          <div className="survey-container">
            <div className="survey-card">
              <h2>🎯 Cuéntame sobre tu viaje</h2>
              <p>Ayúdame a personalizar mejor mis recomendaciones</p>
              
              <form onSubmit={handleSurveySubmit} className="survey-form">
                <div className="form-group">
                  <label>🏖️ Destino:</label>
                  <input
                    type="text"
                    value={surveyData.destination}
                    onChange={(e) => setSurveyData({...surveyData, destination: e.target.value})}
                    placeholder="Ej: París, Tokio, Nueva York..."
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>📅 Fechas:</label>
                  <input
                    type="text"
                    value={surveyData.dates}
                    onChange={(e) => setSurveyData({...surveyData, dates: e.target.value})}
                    placeholder="Ej: 15-22 de marzo 2024"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>💰 Presupuesto:</label>
                  <select
                    value={surveyData.budget}
                    onChange={(e) => setSurveyData({...surveyData, budget: e.target.value})}
                    required
                  >
                    <option value="">Selecciona tu presupuesto</option>
                    <option value="Económico">Económico</option>
                    <option value="Medio">Medio</option>
                    <option value="Alto">Alto</option>
                    <option value="Premium">Premium</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>🎭 Preferencia de experiencia:</label>
                  <select
                    value={surveyData.preference}
                    onChange={(e) => setSurveyData({...surveyData, preference: e.target.value})}
                    required
                  >
                    <option value="">Selecciona tu preferencia</option>
                    <option value="Aventura">Aventura</option>
                    <option value="Relajación">Relajación</option>
                    <option value="Cultura">Cultura</option>
                    <option value="Gastronomía">Gastronomía</option>
                    <option value="Naturaleza">Naturaleza</option>
                    <option value="Urbano">Urbano</option>
                  </select>
                </div>
                
                <button type="submit" className="survey-submit">
                  🚀 ¡Empezar a planificar!
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Chat messages */}
        <div className="messages-container">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.sender === 'user' ? 'user-message' : 'alex-message'} ${message.isError ? 'error-message' : ''}`}
            >
              <div className="message-header">
                <span className="message-sender">
                  {message.sender === 'user' ? '👤 Tú' : '✈️ Alex'}
                </span>
                <span className="message-time">{message.timestamp}</span>
              </div>
              
              <div className="message-content">
                {message.text}
              </div>

              {/* Mostrar fotos si están disponibles */}
              {message.fotos && message.fotos.length > 0 && (
                <div className="photos-container">
                  <div className="photos-grid">
                    {message.fotos.map((foto, index) => (
                      <div key={index} className="photo-item">
                        <img 
                          src={foto.url} 
                          alt={foto.alt}
                          loading="lazy"
                        />
                        <div className="photo-credit">
                          📸 por{' '}
                          <a 
                            href={foto.photographerUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            {foto.photographer}
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Mostrar información del clima si está disponible */}
              {message.clima && (
                <div className="weather-info">
                  <div className="weather-header">
                    <span className="weather-emoji">{getWeatherEmoji(message.clima.temperatura)}</span>
                    <span className="weather-location">
                      {message.clima.ciudad}, {message.clima.pais}
                    </span>
                  </div>
                  <div className="weather-details">
                    <span className="temperature">{message.clima.temperatura}°C</span>
                    <span className="description">{message.clima.descripcion}</span>
                    <span className="humidity">💧 {message.clima.humedad}%</span>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="message alex-message">
              <div className="message-header">
                <span className="message-sender">✈️ Alex</span>
                <span className="message-time">Ahora</span>
              </div>
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
                <span>Alex está escribiendo...</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="input-container">
          <div className="input-wrapper">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu pregunta aquí... (ej: '¿Qué tal el transporte allí?' o '¿Cuáles son los mejores restaurantes?')"
              rows="1"
              disabled={isLoading}
            />
            <button 
              onClick={() => sendMessage()}
              disabled={isLoading || !inputMessage.trim()}
              className="send-button"
            >
              {isLoading ? '⏳' : '✈️'}
            </button>
          </div>
          <div className="input-hint">
            💡 Alex recuerda el contexto de la conversación. Puedes preguntar "¿y qué tal el transporte allí?" y sabrá a qué destino te refieres.
          </div>
        </div>

        {/* Botón de descarga de PDF */}
        {messages.length > 0 && (
          <div className="pdf-download-container">
            <button 
              onClick={handleDownloadPDF}
              className="download-pdf-button"
              title="Descargar mi itinerario en PDF"
            >
              📄 Descargar mi itinerario en PDF
            </button>
          </div>
        )}
      </div>

      {/* Sidebar con información en tiempo real */}
      {showSidebar && sidebarInfo && (
        <div className="sidebar">
          <div className="sidebar-header">
            <h3>📊 Info en tiempo real</h3>
            <button 
              onClick={() => setShowSidebar(false)}
              className="close-sidebar"
            >
              ✕
            </button>
          </div>
          
          <div className="sidebar-content">
            <div className="info-card">
              <h4>📍 {sidebarInfo.ciudad}</h4>
              <p>{sidebarInfo.pais}</p>
            </div>

            {sidebarInfo.clima && (
              <div className="info-card">
                <h4>🌤️ Clima actual</h4>
                <div className="weather-sidebar">
                  <span className="temp-large">{sidebarInfo.clima.temperatura}°C</span>
                  <span className="weather-desc">{sidebarInfo.clima.descripcion}</span>
                </div>
              </div>
            )}

            {sidebarInfo.tipoCambio && (
              <div className="info-card">
                <h4>💱 Tipo de cambio</h4>
                <div className="exchange-rate">
                  <span>1 USD = {sidebarInfo.tipoCambio.rate.toFixed(2)} {sidebarInfo.moneda}</span>
                  <small>Actualizado: {sidebarInfo.tipoCambio.fecha}</small>
                </div>
              </div>
            )}

            {sidebarInfo.diferenciaHoraria && (
              <div className="info-card">
                <h4>🕐 Diferencia horaria</h4>
                <div className="time-diff">
                  <span>Tu hora: {sidebarInfo.diferenciaHoraria.horaLocal}</span>
                  <span>Hora local: {sidebarInfo.diferenciaHoraria.horaDestino}</span>
                  <span className="diff-text">{sidebarInfo.diferenciaHoraria.diferenciaTexto}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
