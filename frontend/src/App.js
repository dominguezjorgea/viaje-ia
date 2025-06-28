import React, { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [mensajes, setMensajes] = useState([]);
  const [pregunta, setPregunta] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [mostrarEncuesta, setMostrarEncuesta] = useState(true);
  const [datosViaje, setDatosViaje] = useState({
    destino: '',
    fechaInicio: '',
    fechaFin: '',
    presupuesto: '',
    preferencia: ''
  });
  const [infoTiempoReal, setInfoTiempoReal] = useState(null);
  const [cargandoInfo, setCargandoInfo] = useState(false);
  const chatRef = useRef(null);

  // Auto-scroll al último mensaje
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [mensajes]);

  // Función para obtener información en tiempo real
  const obtenerInfoTiempoReal = async (ciudad) => {
    if (!ciudad) return;
    
    setCargandoInfo(true);
    try {
      const response = await fetch(`http://localhost:3001/api/info-tiempo-real/${encodeURIComponent(ciudad)}`);
      if (response.ok) {
        const data = await response.json();
        setInfoTiempoReal(data);
      }
    } catch (error) {
      console.log('Error obteniendo información en tiempo real:', error);
    } finally {
      setCargandoInfo(false);
    }
  };

  const handleEncuestaSubmit = (e) => {
    e.preventDefault();
    
    // Validar que todos los campos estén completos
    if (!datosViaje.destino || !datosViaje.fechaInicio || !datosViaje.fechaFin || 
        !datosViaje.presupuesto || !datosViaje.preferencia) {
      alert('Por favor, completa todos los campos');
      return;
    }

    // Crear mensaje inicial con la información del formulario
    const mensajeInicial = {
      id: Date.now(),
      tipo: 'usuario',
      contenido: `Quiero viajar a ${datosViaje.destino} del ${datosViaje.fechaInicio} al ${datosViaje.fechaFin}. Mi presupuesto es ${datosViaje.presupuesto} y prefiero ${datosViaje.preferencia}.`,
      timestamp: new Date()
    };

    setMensajes([mensajeInicial]);
    setMostrarEncuesta(false);
    
    // Obtener información en tiempo real del destino
    obtenerInfoTiempoReal(datosViaje.destino);
    
    // Enviar automáticamente la primera consulta
    enviarMensajeInicial(mensajeInicial.contenido);
  };

  const enviarMensajeInicial = async (contenido) => {
    setCargando(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/planificar-viaje', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          pregunta: contenido,
          historial: []
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al procesar la solicitud');
      }

      const respuestaAlex = {
        id: Date.now() + 1,
        tipo: 'alex',
        contenido: data.respuesta,
        timestamp: new Date(),
        fotos: data.fotos || null
      };

      setMensajes(prev => [...prev, respuestaAlex]);
    } catch (err) {
      setError(err.message || 'Error de conexión. Verifica que el servidor esté corriendo.');
    } finally {
      setCargando(false);
    }
  };

  const enviarMensaje = async () => {
    if (!pregunta.trim() || cargando) return;

    const nuevoMensaje = {
      id: Date.now(),
      tipo: 'usuario',
      contenido: pregunta.trim(),
      timestamp: new Date()
    };

    setMensajes(prev => [...prev, nuevoMensaje]);
    setPregunta('');
    setCargando(true);
    setError('');

    try {
      // Enviar todo el historial de la conversación
      const historialConversacion = mensajes
        .filter(msg => msg.tipo === 'usuario' || msg.tipo === 'alex')
        .map(msg => ({
          role: msg.tipo === 'usuario' ? 'user' : 'assistant',
          content: msg.contenido
        }));

      const response = await fetch('http://localhost:3001/api/planificar-viaje', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          pregunta: pregunta.trim(),
          historial: historialConversacion
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al procesar la solicitud');
      }

      const respuestaAlex = {
        id: Date.now() + 1,
        tipo: 'alex',
        contenido: data.respuesta,
        timestamp: new Date(),
        fotos: data.fotos || null
      };

      setMensajes(prev => [...prev, respuestaAlex]);

      // Actualizar información en tiempo real si hay nueva ciudad
      if (data.ciudadInfo) {
        obtenerInfoTiempoReal(data.ciudadInfo.nombre);
      }
    } catch (err) {
      setError(err.message || 'Error de conexión. Verifica que el servidor esté corriendo.');
    } finally {
      setCargando(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    enviarMensaje();
  };

  const formatearHora = (timestamp) => {
    return timestamp.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDatosViaje(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (mostrarEncuesta) {
    return (
      <div className="App">
        <div className="container encuesta-container">
          <h1>ViajeIA - Alex, Tu Consultor Personal de Viajes</h1>
          
          <div className="encuesta">
            <h2>¡Hola! Soy Alex ✈️</h2>
            <p className="encuesta-subtitle">
              Para darte las mejores recomendaciones, necesito conocer algunos detalles de tu viaje:
            </p>
            
            <form onSubmit={handleEncuestaSubmit} className="encuesta-form">
              <div className="form-group">
                <label htmlFor="destino">¿A dónde quieres viajar? 🌍</label>
                <input
                  type="text"
                  id="destino"
                  name="destino"
                  value={datosViaje.destino}
                  onChange={handleInputChange}
                  placeholder="Ej: París, Tokio, Nueva York..."
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fechaInicio">¿Cuándo empiezas? 📅</label>
                  <input
                    type="date"
                    id="fechaInicio"
                    name="fechaInicio"
                    value={datosViaje.fechaInicio}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="fechaFin">¿Cuándo regresas? 📅</label>
                  <input
                    type="date"
                    id="fechaFin"
                    name="fechaFin"
                    value={datosViaje.fechaFin}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="presupuesto">¿Cuál es tu presupuesto aproximado? 💰</label>
                <select
                  id="presupuesto"
                  name="presupuesto"
                  value={datosViaje.presupuesto}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Selecciona tu presupuesto</option>
                  <option value="Económico (menos de $1,000 USD)">Económico (menos de $1,000 USD)</option>
                  <option value="Medio ($1,000 - $3,000 USD)">Medio ($1,000 - $3,000 USD)</option>
                  <option value="Alto ($3,000 - $7,000 USD)">Alto ($3,000 - $7,000 USD)</option>
                  <option value="Premium (más de $7,000 USD)">Premium (más de $7,000 USD)</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="preferencia">¿Qué tipo de experiencia prefieres? 🎯</label>
                <select
                  id="preferencia"
                  name="preferencia"
                  value={datosViaje.preferencia}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Selecciona tu preferencia</option>
                  <option value="Aventura">Aventura 🏔️</option>
                  <option value="Relajación">Relajación 🏖️</option>
                  <option value="Cultura">Cultura 🏛️</option>
                  <option value="Gastronomía">Gastronomía 🍕</option>
                  <option value="Naturaleza">Naturaleza 🌿</option>
                  <option value="Urbano">Urbano 🌆</option>
                </select>
              </div>

              <button type="submit" className="button encuesta-button">
                ¡Empezar a planificar con Alex! ✈️
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="app-layout">
        {/* Panel lateral */}
        <div className="sidebar">
          <div className="sidebar-header">
            <h3>🌍 Información en Tiempo Real</h3>
          </div>
          
          {cargandoInfo ? (
            <div className="sidebar-loading">
              <div className="loading-spinner"></div>
              <p>Actualizando información...</p>
            </div>
          ) : infoTiempoReal ? (
            <div className="sidebar-content">
              <div className="info-card">
                <h4>📍 {infoTiempoReal.ciudad}</h4>
                <p className="pais">{infoTiempoReal.pais}</p>
              </div>

              {/* Clima */}
              {infoTiempoReal.clima && (
                <div className="info-card">
                  <h4>🌤️ Clima Actual</h4>
                  <div className="clima-info">
                    <div className="temperatura">
                      {infoTiempoReal.clima.temperatura}°C
                    </div>
                    <div className="clima-descripcion">
                      {infoTiempoReal.clima.descripcion}
                    </div>
                    <div className="clima-detalles">
                      <span>💧 {infoTiempoReal.clima.humedad}%</span>
                      <span>🌡️ Sensación: {infoTiempoReal.clima.sensacion}°C</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Diferencia horaria */}
              {infoTiempoReal.diferenciaHoraria && (
                <div className="info-card">
                  <h4>🕐 Hora Local</h4>
                  <div className="hora-info">
                    <div className="hora-destino">
                      {infoTiempoReal.diferenciaHoraria.horaDestino}
                    </div>
                    <div className="diferencia">
                      {infoTiempoReal.diferenciaHoraria.diferenciaTexto}
                    </div>
                    <div className="hora-local">
                      Tu hora: {infoTiempoReal.diferenciaHoraria.horaLocal}
                    </div>
                  </div>
                </div>
              )}

              {/* Tipo de cambio */}
              {infoTiempoReal.tipoCambio && (
                <div className="info-card">
                  <h4>💱 Tipo de Cambio</h4>
                  <div className="cambio-info">
                    <div className="cambio-rate">
                      1 USD = {infoTiempoReal.tipoCambio.rate.toFixed(2)} {infoTiempoReal.moneda}
                    </div>
                    <div className="cambio-fecha">
                      Actualizado: {infoTiempoReal.tipoCambio.fecha}
                    </div>
                  </div>
                </div>
              )}

              <div className="sidebar-footer">
                <p>🔄 Se actualiza automáticamente</p>
              </div>
            </div>
          ) : (
            <div className="sidebar-empty">
              <p>💬 Chatea con Alex para ver información del destino</p>
            </div>
          )}
        </div>

        {/* Chat principal */}
        <div className="main-content">
          <div className="container">
            <h1>ViajeIA - Alex, Tu Consultor Personal de Viajes</h1>
            
            {/* Área del chat */}
            <div className="chat-container" ref={chatRef}>
              {mensajes.map((mensaje) => (
                <div 
                  key={mensaje.id} 
                  className={`mensaje ${mensaje.tipo === 'usuario' ? 'mensaje-usuario' : 'mensaje-alex'}`}
                >
                  <div className="mensaje-header">
                    <span className="mensaje-autor">
                      {mensaje.tipo === 'usuario' ? 'Tú' : 'Alex ✈️'}
                    </span>
                    <span className="mensaje-hora">
                      {formatearHora(mensaje.timestamp)}
                    </span>
                  </div>
                  <div className="mensaje-contenido">
                    {mensaje.contenido.split('\n').map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                    
                    {/* Mostrar fotos si están disponibles */}
                    {mensaje.fotos && mensaje.fotos.length > 0 && (
                      <div className="fotos-container">
                        <div className="fotos-grid">
                          {mensaje.fotos.map((foto, index) => (
                            <div key={index} className="foto-item">
                              <img 
                                src={foto.url} 
                                alt={foto.alt}
                                className="foto-destino"
                                loading="lazy"
                              />
                              <div className="foto-credito">
                                <a 
                                  href={foto.photographerUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="fotografo-link"
                                >
                                  📸 {foto.photographer}
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {cargando && (
                <div className="mensaje mensaje-alex">
                  <div className="mensaje-header">
                    <span className="mensaje-autor">Alex ✈️</span>
                    <span className="mensaje-hora">{formatearHora(new Date())}</span>
                  </div>
                  <div className="mensaje-contenido cargando">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    Alex está escribiendo...
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="error">
                {error}
              </div>
            )}

            {/* Formulario de entrada */}
            <form onSubmit={handleSubmit} className="form">
              <input
                type="text"
                value={pregunta}
                onChange={(e) => setPregunta(e.target.value)}
                placeholder="Escribe tu mensaje aquí..."
                className="input"
                disabled={cargando}
              />
              
              <button 
                type="submit" 
                className="button"
                disabled={cargando || !pregunta.trim()}
              >
                Enviar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
