import React, { useState, useEffect, useRef } from 'react';

export default function App() {
  const canvasRef = useRef(null);
  
  // 👥 Configuración de Modos, Nombres y Dificultad
  const [modoJuego, setModoJuego] = useState('1P'); 
  const [dificultad, setDificultad] = useState('NORMAL'); // 'NORMAL' o 'DIFICIL'
  const [nombreJ1, setNombreJ1] = useState('Jugador 1');
  const [nombreJ2, setNombreJ2] = useState('Jugador 2');
  const [turnoActual, setTurnoActual] = useState(1); 
  const [scoreJ1, setScoreJ1] = useState(0);
  const [scoreJ2, setScoreJ2] = useState(0);

  // 📊 Estados del juego actual
  const [dinero, setDinero] = useState(200);
  const [score, setScore] = useState(0);
  const [juegoEstado, setJuegoEstado] = useState('MENU_MODOS'); 
  const [motivoTermino, setMotivoTermino] = useState('');

  const DISTANCIA_META = 3000;
  const mapaEstaticoRef = useRef({ plataformas: [], elementos: [] });

  const estadoRef = useRef({
    jugador: { x: 50, y: 200, ancho: 32, alto: 40, velX: 0, velY: 0, velocidad: 5.5, fuerzaSalto: 14.5, enSuelo: false },
    plataformas: [],
    elementos: [], 
    teclas: {},
    dineroActual: 200,
    scoreActual: 0,
    camaraX: 0,
    ultimoSpawnX: 400,
    gravedad: 0.65,
    friccion: 0.85
  });

  // Generador dinámico calibrado según dificultad
  const pregenerarMundoVersusFijo = () => {
    const plataformas = [
      { x: 0, y: 360, ancho: 1200, alto: 40, color: '#1e293b', esSueloFirme: true },
      { x: 350, y: 240, ancho: 200, alto: 15, color: '#334155', esSueloFirme: false },
      { x: 650, y: 240, ancho: 250, alto: 15, color: '#334155', esSueloFirme: false },
      { x: 500, y: 130, ancho: 150, alto: 15, color: '#475569', esSueloFirme: false },
      { x: 850, y: 130, ancho: 200, alto: 15, color: '#475569', esSueloFirme: false },
    ];
    const elementos = [];

    // Banco de ítems normales (Equilibrado)
    const itemsNormal = [
      { item: '🪙 $5', valor: 5, tipo: 'bueno' },
      { item: '💵 $10', valor: 10, tipo: 'bueno' },
      { item: '💵 $15', valor: 15, tipo: 'bueno' },
      { item: '📱 -$40', valor: -40, tipo: 'malo' }, 
      { item: '🛍️ -$20', valor: -20, tipo: 'malo' }
    ];

    // Banco de ítems modo DIFÍCIL: ¡SÓLO GASTOS EN EL MAPA!
    const itemsDificil = [
      { item: '🛍️ -$35', valor: -35, tipo: 'malo' }, 
      { item: '🛍️ -$25', valor: -25, tipo: 'malo' }, 
      { item: '📱 -$50', valor: -50, tipo: 'malo' }, 
      { item: '🧾 -$40', valor: -40, tipo: 'malo' }, 
      { item: '☕ -$15', valor: -15, tipo: 'malo' }  
    ];

    const listaPool = dificultad === 'DIFICIL' ? itemsDificil : itemsNormal;
    const pasoDistancia = dificultad === 'DIFICIL' ? 140 : 260;

    let ultimoPisoY = 360;

    for (let x = 400; x < DISTANCIA_META + 400; x += pasoDistancia) {
      if (x >= DISTANCIA_META - 100) break;

      let proximoPisoY = [360, 240, 130][Math.floor(Math.random() * 3)];
      
      if (Math.abs(ultimoPisoY - proximoPisoY) > 150) {
        plataformas.push({ x: x - 60, y: 240, ancho: 100, alto: 15, color: '#334155', esSueloFirme: false });
      }

      plataformas.push({
        x: x,
        y: proximoPisoY,
        ancho: 180,
        alto: 15,
        color: proximoPisoY === 360 ? '#1e293b' : '#334155',
        esSueloFirme: proximoPisoY === 360
      });

      if (proximoPisoY !== 360 && Math.random() < 0.4) {
        plataformas.push({ x: x, y: 360, ancho: 180, alto: 40, color: '#1e293b', esSueloFirme: true });
      }

      const itemTipo = listaPool[Math.floor(Math.random() * listaPool.length)];
      const itemY = itemTipo.tipo === 'malo' ? (proximoPisoY === 130 ? 215 : 335) : (proximoPisoY - 30);

      elementos.push({
        x: x + 50,
        y: itemY,
        item: itemTipo.item,
        valor: itemTipo.valor,
        tipo: itemTipo.tipo,
        ancho: 45,
        alto: 30,
        velX: itemTipo.item.includes('📱') ? (dificultad === 'DIFICIL' ? -2.2 : -1.4) : 0
      });

      ultimoPisoY = proximoPisoY;
    }

    plataformas.push({ x: DISTANCIA_META - 100, y: 360, ancho: 400, alto: 40, color: '#065f46', esSueloFirme: true });
    mapaEstaticoRef.current = { plataformas, elementos };
  };

  const iniciarTurno = (numeroTurno) => {
    const { jugador } = estadoRef.current;
    setTurnoActual(numeroTurno);
    
    const dineroInicial = dificultad === 'DIFICIL' ? 500 : 200;
    
    estadoRef.current.dineroActual = dineroInicial;
    estadoRef.current.scoreActual = 0;
    estadoRef.current.camaraX = 0;
    
    jugador.x = 50;
    jugador.y = 150;
    jugador.velX = 0;
    jugador.velY = 0;

    estadoRef.current.plataformas = JSON.parse(JSON.stringify(mapaEstaticoRef.current.plataformas));
    estadoRef.current.elementos = JSON.parse(JSON.stringify(mapaEstaticoRef.current.elementos));

    setDinero(dineroInicial);
    setScore(0);
    setJuegoEstado('JUGANDO');
  };

  useEffect(() => {
    const hDown = (e) => { estadoRef.current.teclas[e.key] = true; };
    const hUp = (e) => { estadoRef.current.teclas[e.key] = false; };
    window.addEventListener('keydown', hDown);
    window.addEventListener('keyup', hUp);
    return () => { window.removeEventListener('keydown', hDown); window.removeEventListener('keyup', hUp); };
  }, []);

  useEffect(() => {
    if (juegoEstado !== 'JUGANDO') return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animFrameId;

    const gameLoop = () => {
      const { jugador, plataformas, elementos, teclas, gravedad, friccion, camaraX } = estadoRef.current;

      if (teclas['ArrowLeft'] || teclas['a'] || teclas['A']) { if (jugador.velX > -jugador.velocidad) jugador.velX--; }
      if (teclas['ArrowRight'] || teclas['d'] || teclas['D']) { if (jugador.velX < jugador.velocidad) jugador.velX++; }
      
      if ((teclas['ArrowUp'] || teclas['w'] || teclas['W'] || teclas[' ']) && jugador.enSuelo) {
        jugador.velY = -jugador.fuerzaSalto;
        jugador.enSuelo = false;
      }

      const quiereBajar = teclas['ArrowDown'] || teclas['s'] || teclas['S'];

      jugador.velX *= friccion;
      jugador.velY += gravedad;
      const prevY = jugador.y;
      jugador.x += jugador.velX;
      jugador.y += jugador.velY;
      if (jugador.x < 0) jugador.x = 0;

      if (jugador.x - camaraX > 200) estadoRef.current.camaraX = jugador.x - 200;

      jugador.enSuelo = false;
      for (let p of plataformas) {
        if (jugador.x + jugador.ancho > p.x && jugador.x < p.x + p.ancho && prevY + jugador.alto <= p.y && jugador.y + jugador.alto >= p.y) {
          if (p.esSueloFirme || !quiereBajar) {
            jugador.y = p.y - jugador.alto;
            jugador.velY = 0;
            jugador.enSuelo = true;
          }
        }
      }

      if (jugador.y > canvas.height) estadoRef.current.dineroActual = 0;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(-estadoRef.current.camaraX, 0);

      // Dibujar Pisos
      for (let p of plataformas) {
        ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.roundRect(p.x, p.y, p.ancho, p.alto, 5); ctx.fill();
        ctx.fillStyle = p.esSueloFirme ? '#10b981' : '#34d399'; 
        ctx.fillRect(p.x, p.y, p.ancho, 4);
      }

      // Bandera de Meta
      ctx.font = '50px sans-serif';
      ctx.fillText('🏁', DISTANCIA_META, 320);
      ctx.font = 'bold 11px sans-serif';
      ctx.fillStyle = '#34d399';
      ctx.fillText('LIBERTAD FINANCIERA', DISTANCIA_META - 35, 350);

      // Dibujar Items
      for (let i = elementos.length - 1; i >= 0; i--) {
        const e = elementos[i];
        if (e.item.includes('📱')) e.x += e.velX;
        ctx.font = 'bold 16px sans-serif';
        ctx.fillStyle = e.tipo === 'bueno' ? '#4ade80' : '#f87171';
        ctx.fillText(e.item, e.x, e.y);

        if (jugador.x < e.x + e.ancho && jugador.x + jugador.ancho > e.x && jugador.y < e.y && jugador.y + jugador.alto > e.y - 25) {
          estadoRef.current.dineroActual = Math.max(0, estadoRef.current.dineroActual + e.valor);
          estadoRef.current.scoreActual = Math.max(0, estadoRef.current.scoreActual - 20); 
          
          setDinero(estadoRef.current.dineroActual);
          setScore(estadoRef.current.scoreActual);
          elementos.splice(i, 1);
          continue;
        }
      }

      // Puntos pasivos en modo difícil por avanzar invicto
      if (dificultad === 'DIFICIL' && jugador.velX > 1) {
        estadoRef.current.scoreActual += 1;
        setScore(Math.floor(estadoRef.current.scoreActual / 5));
      }

      // Personaje
      ctx.fillStyle = '#4f46e5';
      ctx.beginPath(); ctx.roundRect(jugador.x, jugador.y, jugador.ancho, jugador.alto, 8); ctx.fill();
      ctx.font = '22px sans-serif';
      ctx.fillText(estadoRef.current.dineroActual < 50 ? '😰' : '🏃‍♂️', jugador.x + 4, jugador.y + 28);

      ctx.restore();

      if (jugador.x >= DISTANCIA_META) {
        const scoreConBono = score + 500;
        evaluarFinPartida(scoreConBono, `¡ALCANZÓ LA META! Conseguiste +500 pts.`);
        return;
      }

      if (estadoRef.current.dineroActual <= 0) {
        evaluarFinPartida(score, "Quebró económicamente.");
        return;
      }

      animFrameId = requestAnimationFrame(gameLoop);
    };

    const evaluarFinPartida = (scoreFinal, motivo) => {
      if (modoJuego === '1P') {
        setScoreJ1(scoreFinal);
        setMotivoTermino(motivo);
        setJuegoEstado('FINALIZADO');
      } else {
        if (turnoActual === 1) {
          setScoreJ1(scoreFinal);
          setMotivoTermino(`${nombreJ1}: ${motivo}`);
          setJuegoEstado('INTERMEDIO');
        } else {
          setScoreJ2(scoreFinal);
          setJuegoEstado('FINALIZADO');
        }
      }
    };

    animFrameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animFrameId);
  }, [juegoEstado, turnoActual, modoJuego, score, dificultad]);

  const obtenerGanador = () => {
    if (modoJuego === '1P') {
      return `📊 Score final: ${scoreJ1} puntos. Dificultad: ${dificultad}.`;
    }
    if (scoreJ1 > scoreJ2) return `🏆 ¡Ganó ${nombreJ1} con ${scoreJ1} pts! Estrategia financiera superior.`;
    if (scoreJ2 > scoreJ1) return `🏆 ¡Ganó ${nombreJ2} con ${scoreJ2} pts! Evitó mejor las deudas de consumo.`;
    return "👔 ¡Empate técnico en finanzas! Misma cultura de ahorro.";
  };

  const configurarModoYFrenar = (modo) => {
    setModoJuego(modo);
    setJuegoEstado('CONFIGURACION');
  };

  const iniciarJuegoFinal = () => {
    pregenerarMundoVersusFijo();
    setJuegoEstado('INICIO_TURNO');
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen flex flex-col justify-between p-4 font-sans select-none">
      
      <header className="max-w-md w-full mx-auto bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-xl flex justify-between items-center">
        <div>
          <span className="block text-[10px] font-bold uppercase tracking-wider text-amber-400">
            {juegoEstado === 'JUGANDO' ? `${turnoActual === 1 ? nombreJ1 : nombreJ2} [${dificultad}]` : 'Módulo Educativo'}
          </span>
          <span className={`text-2xl font-black ${dinero < 60 ? 'text-rose-400' : 'text-emerald-400'}`}>${dinero}</span>
        </div>
        <div className="text-right">
          <span className="block text-gray-400 text-[10px] font-bold uppercase tracking-wider">Score</span>
          <span className="text-xl font-bold text-blue-400">{score} pts</span>
        </div>
      </header>

      <main className="max-w-md w-full mx-auto my-auto mt-4 mb-4 bg-slate-900 rounded-3xl border border-slate-800 relative overflow-hidden shadow-2xl h-[420px] flex flex-col justify-center items-center">
        
        {/* MENÚ DE SELECCIÓN DE MODO */}
        {juegoEstado === 'MENU_MODOS' && (
          <div className="p-8 text-center space-y-6 w-full px-10">
            <span className="text-6xl block animate-bounce">🎮</span>
            <h2 className="text-2xl font-black text-emerald-400 tracking-wide">Financial Arcade</h2>
            <p className="text-xs text-slate-400 leading-relaxed">Selecciona la modalidad para poner a prueba tu ahorro:</p>
            <div className="grid grid-cols-1 gap-3">
              <button onClick={() => configurarModoYFrenar('1P')} className="bg-slate-800 hover:bg-slate-700 border border-slate-700 py-3 rounded-xl font-bold text-sm transition cursor-pointer">
                👤 Un Solo Jugador
              </button>
              <button onClick={() => configurarModoYFrenar('2P')} className="bg-emerald-500 hover:bg-emerald-400 text-white py-3 rounded-xl font-bold text-sm transition shadow-lg cursor-pointer">
                👥 Modo 2 Jugadores (Versus)
              </button>
            </div>
          </div>
        )}

        {/* CONFIGURACIÓN INTEGRAL DE DIFICULTAD Y NOMBRES */}
        {juegoEstado === 'CONFIGURACION' && (
          <div className="p-6 text-center space-y-4 w-full px-8">
            <h2 className="text-lg font-black text-emerald-400 uppercase tracking-wide">🛠️ Parámetros de Simulación</h2>
            
            {/* Selector de dificultad */}
            <div className="space-y-1 text-left">
              <label className="text-xs text-slate-400 block font-bold">Dificultad del Mercado:</label>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setDificultad('NORMAL')} className={`py-2 text-xs rounded-xl font-bold border transition cursor-pointer ${dificultad === 'NORMAL' ? 'bg-blue-600/20 text-blue-400 border-blue-500' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
                  Normal ($200)
                </button>
                <button type="button" onClick={() => setDificultad('DIFICIL')} className={`py-2 text-xs rounded-xl font-bold border transition cursor-pointer ${dificultad === 'DIFICIL' ? 'bg-rose-600/20 text-rose-400 border-rose-500' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
                  🔥 Solo Gastos ($500)
                </button>
              </div>
            </div>

            {/* Inputs de nombres */}
            <div className="space-y-2 text-left pt-1">
              <label className="text-xs text-slate-400 block font-bold">Nombre Jugador 1:</label>
              <input type="text" value={nombreJ1} onChange={(e)=>setNombreJ1(e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-2 rounded-xl text-sm text-slate-200 focus:outline-none" />
              
              {modoJuego === '2P' && (
                <>
                  <label className="text-xs text-slate-400 block font-bold mt-2">Nombre Jugador 2:</label>
                  <input type="text" value={nombreJ2} onChange={(e)=>setNombreJ2(e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-2 rounded-xl text-sm text-slate-200 focus:outline-none" />
                </>
              )}
            </div>

            <button onClick={iniciarJuegoFinal} className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-black py-3 rounded-xl transition cursor-pointer">¡GENERAR MAPA ESPEJO!</button>
          </div>
        )}

        {/* PANTALLA 3: PRE-TURNO */}
        {juegoEstado === 'INICIO_TURNO' && (
          <div className="p-8 text-center space-y-4">
            <span className="text-5xl block">🏁</span>
            <h3 className="text-xl font-extrabold">Preparado: {turnoActual === 1 ? nombreJ1 : nombreJ2}</h3>
            <p className="text-xs text-slate-400 leading-relaxed px-4">
              Avanza 3000m hasta la bandera de la Libertad Financiera. <br/><br/>
              {dificultad === 'DIFICIL' ? (
                <span className="text-rose-400 font-bold block bg-rose-950/30 p-2 rounded-lg border border-rose-900/40 text-xs">
                  🚨 MODO CRISIS EXTREMA: Tienes $500 iniciales, pero NO HAY INGRESOS. El mapa tiene solo gastos y descuentos seguidos. ¡Tu única meta es esquivarlos y sobrevivir!
                </span>
              ) : (
                <span className="text-blue-400 block">Dificultad balanceada con monedas y billetes normales.</span>
              )}
            </p>
            <button onClick={() => iniciarTurno(turnoActual)} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition cursor-pointer">
              ¡INICIAR PARTIDA!
            </button>
          </div>
        )}

        {/* CANVAS */}
        {juegoEstado === 'JUGANDO' && <canvas ref={canvasRef} width={400} height={420} className="w-full h-full" />}

        {/* INTERMEDIO */}
        {juegoEstado === 'INTERMEDIO' && (
          <div className="p-8 text-center space-y-4 w-full">
            <span className="text-5xl block">⏳</span>
            <h2 className="text-2xl font-black text-amber-400">¡Fin del Turno de {nombreJ1}!</h2>
            <p className="text-xs text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800 italic">"{motivoTermino}"</p>
            <p className="text-sm text-slate-200">Puntaje: <b className="text-blue-400 text-base">{scoreJ1} pts</b>.</p>
            <hr className="border-slate-800 my-2"/>
            <h3 className="text-base font-bold text-slate-300">Sigue el turno de: <b className="text-emerald-400">{nombreJ2}</b></h3>
            <button onClick={() => iniciarTurno(2)} className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-black py-3 rounded-xl transition shadow-lg cursor-pointer">LANZAR TURNO 2</button>
          </div>
        )}

        {/* FIN DE LA PARTIDA */}
        {juegoEstado === 'FINALIZADO' && (
          <div className="p-8 text-center space-y-4 w-full px-6">
            <span className="text-5xl block">🏆</span>
            <h2 className="text-2xl font-black text-blue-400">{modoJuego === '1P' ? 'Resultados' : 'Marcador Final'}</h2>
            
            {modoJuego === '2P' ? (
              <div className="grid grid-cols-2 gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <div className="p-2 border-r border-slate-800">
                  <span className="text-[11px] block text-slate-400 font-bold">{nombreJ1}</span>
                  <span className="text-lg font-black text-white">{scoreJ1} pts</span>
                </div>
                <div>
                  <span className="text-[11px] block text-slate-400 font-bold">{nombreJ2}</span>
                  <span className="text-lg font-black text-white">{scoreJ2} pts</span>
                </div>
              </div>
            ) : (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <p className="text-xs text-slate-400">Estatus del recorrido:</p>
                <p className="text-xs text-slate-200 italic mt-1 font-semibold">"{motivoTermino}"</p>
              </div>
            )}

            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs p-4 rounded-xl font-bold leading-relaxed">
              {obtenerGanador()}
            </div>

            <button onClick={() => { setJuegoEstado('MENU_MODOS'); setTurnoActual(1); setScoreJ1(0); setScoreJ2(0); }} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition shadow-lg cursor-pointer">VOLVER AL MENÚ</button>
          </div>
        )}
      </main>

      <footer className="text-center text-[10px] text-slate-600 font-mono tracking-widest max-w-md w-full mx-auto">
        A-D (MOVER) | ESPACIO (SALTAR) | S (BAJAR PISO)
      </footer>
    </div>
  );
}