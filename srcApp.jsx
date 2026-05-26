import { useState, useEffect, useRef } from "react";

// ─── DATOS CLÍNICOS ───────────────────────────────────────────────────────────
const DIAGNOSTICOS = ["Síndrome de Down","TEA","Daño Cerebral Adquirido","Parálisis Cerebral"];
const NIVELES = ["Bajo","Medio","Alto"];
const OBJETIVOS_LIST = ["Equilibrio y control postural","Marcha y locomoción","Coordinación motora fina","Fuerza y resistencia muscular","Integración sensorial","Autonomía en AVD","Regulación tónica","Cognición motora"];

const RPE_NIVELES = [
  {val:1,emoji:"😴",label:"Nada",desc:"Sin esfuerzo",color:"#4CAF50"},
  {val:2,emoji:"🙂",label:"Muy fácil",desc:"Casi sin notar",color:"#66BB6A"},
  {val:3,emoji:"😊",label:"Fácil",desc:"Cómodo",color:"#9CCC65"},
  {val:4,emoji:"😌",label:"Moderado",desc:"Algo de esfuerzo",color:"#D4E157"},
  {val:5,emoji:"😐",label:"Regular",desc:"Noto el cansancio",color:"#FFEE58"},
  {val:6,emoji:"😓",label:"Un poco duro",desc:"Cuesta un poco",color:"#FFCA28"},
  {val:7,emoji:"😰",label:"Duro",desc:"Me cuesta",color:"#FFA726"},
  {val:8,emoji:"😤",label:"Muy duro",desc:"Muy cansado",color:"#FF7043"},
  {val:9,emoji:"😫",label:"Agotador",desc:"Casi no puedo",color:"#EF5350"},
  {val:10,emoji:"😵",label:"Máximo",desc:"No puedo más",color:"#B71C1C"},
];

const RESPUESTAS = ["Sin incidencias","Buena tolerancia","Fatiga leve","Fatiga moderada","Fatiga alta","Muy motivado","Motivación normal","Poco motivado","Rechazó actividad","Crisis conductual leve","Crisis conductual moderada","Dolor referido","Espasticidad aumentada","Colaboración excelente"];

const ESCALAS = {
  "Síndrome de Down":["Brunet-Lézine","MACS","Test de Tinetti","Escala de Barthel","GMFCS"],
  "TEA":["ADOS-2","Sensory Profile","MABC-2","Vineland-3","Perfil Psicomotor Albaret"],
  "Daño Cerebral Adquirido":["FIM","Glasgow","NIHSS","Ashworth Modificado","Berg"],
  "Parálisis Cerebral":["GMFCS","MACS","CFCS","Ashworth Modificado","GMFM-88"],
};

const PROTOCOLOS = {
  "Síndrome de Down":{
    Bajo:{corto:"Activación muscular global, estimulación propioceptiva en sedestación, control cefálico. 4 semanas.",medio:"Transferencias asistidas, bipedestación con apoyo, trabajo MMSS en cadena cerrada. 8 semanas.",largo:"Marcha asistida funcional, AVD básicas supervisadas, integración sensorial. 16 semanas.",sesiones:"3 sesiones/semana · 45 min · Individual",tecnicas:["Estimulación propioceptiva en plano inestable (bosu)","FNP — patrones diagonales","Hidroterapia si disponible","Estimulación oral-motora","Taping neuromuscular en tronco"],progresion:"S1-4: decúbito y sedestación. S5-8: transferencias. S9-16: bipedestación y marcha.",material:"Colchoneta, bosu, pelotas, barras paralelas, espejo",alta:"Independencia en transferencias, marcha funcional con/sin ayuda técnica"},
    Medio:{corto:"Mejora equilibrio estático y dinámico, CORE, coordinación ojo-mano. 4 semanas.",medio:"Marcha en diferentes superficies, escaleras, motricidad fina funcional. 8 semanas.",largo:"Autonomía en desplazamientos, integración comunitaria, deporte adaptado. 16 semanas.",sesiones:"3 sesiones/semana · 50 min · Individual/parejas",tecnicas:["Entrenamiento equilibrio con biofeedback visual","Circuitos de obstáculos adaptados","Doble tarea cognitivo-motora","Bandas elásticas — fuerza funcional","mCIMT si hemiparesia"],progresion:"S1-4: base y fuerza. S5-8: dinámica y velocidad. S9-16: doble tarea y entorno real.",material:"Plataforma equilibrio, escalones, bandas, conos, balón medicinal 1-2kg",alta:"Marcha comunitaria, subir/bajar escaleras con apoyo, manipulación funcional"},
    Alto:{corto:"Optimización de patrones, velocidad de marcha, resistencia aeróbica. 4 semanas.",medio:"Deporte adaptado, agilidad, equilibrio monopodal. 8 semanas.",largo:"Participación deportiva, autonomía plena en AVD, prevención de lesiones. 16 semanas.",sesiones:"3-4 sesiones/semana · 55 min · Individual/grupo pequeño",tecnicas:["Entrenamiento pliométrico adaptado","HIIT adaptado 20/40","Propiocepción avanzada con perturbación","Técnica de carrera","Fortalecimiento excéntrico"],progresion:"S1-4: base aeróbica y técnica. S5-8: intensidad y agilidad. S9-16: rendimiento y prevención.",material:"Cinta, bicicleta, steps, vallas, bosu, TRX",alta:"Deporte adaptado activo, independencia funcional completa"},
  },
  "TEA":{
    Bajo:{corto:"Regulación sensorial, tolerancia al tacto y movimiento, consciencia corporal. 4 semanas.",medio:"Patrones coordinados, imitación motora, juego sensoriomotor. 8 semanas.",largo:"Integración sensorial funcional, actividades grupales, autonomía en desplazamientos. 16 semanas.",sesiones:"4 sesiones/semana · 40 min · Individual — entorno estructurado",tecnicas:["Dieta sensorial individualizada","Integración sensorial de Ayres (ASI)","Columpios terapéuticos","Masaje propioceptivo Wilbarger","Entorno con señales visuales"],progresion:"S1-4: regulación y tolerancia. S5-8: participación activa. S9-16: generalización.",material:"Columpios, materiales texturas, manta de peso, pictogramas, timer visual",alta:"Regulación autónoma, tolerancia a entornos cambiantes"},
    Medio:{corto:"Coordinación bimanual, equilibrio dinámico, imitación motora compleja. 4 semanas.",medio:"Habilidades motoras funcionales, juego motor, regulación del esfuerzo. 8 semanas.",largo:"Deporte adaptado, autonomía en recreo, generalización. 16 semanas.",sesiones:"3 sesiones/semana · 45 min · Individual o pareja estructurada",tecnicas:["Obstáculos con instrucción visual","Actividades rítmicas — música y movimiento","Juegos de pelota estructurados","Entrenamiento en espejo","Tablet como mediador"],progresion:"S1-4: habilidades individuales. S5-8: interacción motora. S9-16: deporte adaptado.",material:"Pelotas, conos, aros, steps, tablet",alta:"Juego motor con pares, habilidades deportivas básicas"},
    Alto:{corto:"Técnica deportiva, coordinación compleja, resistencia aeróbica. 4 semanas.",medio:"Deporte específico, trabajo en equipo, gestión del esfuerzo. 8 semanas.",largo:"Competición adaptada, autonomía física plena, hábito autónomo. 16 semanas.",sesiones:"3-4 sesiones/semana · 50 min · Grupo pequeño",tecnicas:["Entrenamiento con reglas visualizadas","Trabajo aeróbico con pulsómetro","Juegos de equipo simplificados","Rutinas de calentamiento predecibles","Registro propio del esfuerzo"],progresion:"S1-4: técnica individual. S5-8: táctica. S9-16: competición y autonomía.",material:"Material deportivo, pulsómetro, tablet con escala RPE, pictogramas",alta:"Participación deportiva autónoma, hábito instaurado"},
  },
  "Daño Cerebral Adquirido":{
    Bajo:{corto:"Despertar motor, prevención complicaciones, posicionamiento terapéutico. 4 semanas.",medio:"Movilizaciones activo-asistidas, control de tronco en sedestación. 8 semanas.",largo:"Transferencias funcionales, bipedestación asistida. 16 semanas.",sesiones:"5 sesiones/semana · 40 min · Individual — equipo multidisciplinar",tecnicas:["Concepto Bobath","Movilizaciones pasivas y activo-asistidas","Taping neuromuscular espasticidad","Posicionamiento terapéutico","Estimulación sensorial multimodal"],progresion:"S1-4: prevención y activación. S5-8: control postural. S9-16: funcionalidad básica.",material:"Cuñas posicionales, férulas, TENS/EMS, camilla, arnés",alta:"Transferencias independientes, sedestación estable"},
    Medio:{corto:"Reeducación de marcha, MMSS afecto, equilibrio en bipedestación. 4 semanas.",medio:"Marcha en entorno real, coordinación bimanual, funcionalidad MMSS. 8 semanas.",largo:"Independencia domiciliaria, reintegración social. 16 semanas.",sesiones:"4 sesiones/semana · 50 min · Individual",tecnicas:["Reeducación marcha en cinta soporte parcial","CIMT para MMSS","FES pie caído o mano parética","Trabajo AVD entorno simulado","Realidad virtual coordinación"],progresion:"S1-4: marcha asistida y MMSS básico. S5-8: marcha libre. S9-16: entorno real.",material:"Barras paralelas, andador, CIMT mitt, FES, VR",alta:"Marcha independiente en domicilio, AVD básicas"},
    Alto:{corto:"Optimización marcha, destreza manual fina, equilibrio avanzado. 4 semanas.",medio:"Reintegración laboral/social, deporte adaptado. 8 semanas.",largo:"Vida independiente, prevención de recidivas. 16 semanas.",sesiones:"3 sesiones/semana · 55 min · Individual/grupo",tecnicas:["Marcha con perturbaciones y doble tarea","Circuitos funcionales alta complejidad","Entrenamiento aeróbico progresivo","Destreza manual específica","Estrategias compensatorias"],progresion:"S1-4: optimización técnica. S5-8: complejidad. S9-16: entorno real.",material:"Cinta, circuito obstáculos, materiales escritura, tecnología apoyo",alta:"Reintegración sociolaboral, vida independiente"},
  },
  "Parálisis Cerebral":{
    Bajo:{corto:"Control postural decúbito/sedestación, espasticidad, estimulación activa. 4 semanas.",medio:"Transferencias asistidas, bipedestación con soporte, motricidad voluntaria. 8 semanas.",largo:"Funcionalidad máxima según GMFCS, bienestar, prevención deformidades. 16 semanas.",sesiones:"4-5 sesiones/semana · 45 min · Individual",tecnicas:["Bobath intensivo normalización del tono","Sistemas bipedestación (standing)","Fisioterapia respiratoria si restrictivo","Hidroterapia","Órtesis y férulas"],progresion:"S1-4: tono y postura. S5-8: activación voluntaria. S9-16: funcionalidad.",material:"Standing frame, cuñas, AFO, piscina, electroestimulador",alta:"Funcionalidad máxima según potencial, sin deformidades secundarias"},
    Medio:{corto:"Mejora marcha patológica, coordinación MMSS, equilibrio dinámico. 4 semanas.",medio:"Marcha en comunidad, habilidades manuales funcionales. 8 semanas.",largo:"Autonomía desplazamientos, participación escolar/laboral. 16 semanas.",sesiones:"3-4 sesiones/semana · 50 min · Individual",tecnicas:["Análisis instrumental de marcha","Cinta soporte parcial / Lokomat","CIMT hemiparesia espástica","Taping corrección postural","Hipoterapia"],progresion:"S1-4: corrección técnica. S5-8: distancia y terreno. S9-16: comunidad.",material:"Cinta, CIMT mitt, taping, ayudas técnicas marcha",alta:"Marcha comunitaria, participación escolar/laboral"},
    Alto:{corto:"Rendimiento motor, resistencia, técnica deportiva. 4 semanas.",medio:"Deporte competitivo, autonomía física, prevención sobreuso. 8 semanas.",largo:"Vida activa independiente, competición deportiva. 16 semanas.",sesiones:"3-4 sesiones/semana · 55 min · Individual/grupo deportivo",tecnicas:["Entrenamiento deportivo específico","Resistencia aeróbica y anaeróbica","Fortalecimiento excéntrico prevención","Técnicas de recuperación","Periodización con calendario"],progresion:"S1-4: base física. S5-8: específico. S9-16: puesta a punto.",material:"Material deportivo, pulsómetro, foam roller",alta:"Deporte activo y autónomo, vida independiente"},
  },
};

// ══════════════════════════════════════════════════════════════════
// MÓDULO LENGUAJE BIMODAL + ARASAAC
// ══════════════════════════════════════════════════════════════════
// ─── ARASAAC API ──────────────────────────────────────────────────────────────
// IDs directos de ARASAAC para nuestro vocabulario clínico (sin búsqueda = sin rate limit)
const ARASAAC_IDS = {
  "empezar":6349,"terminar":6517,"esperar":6054,"sentarse":8254,"levantarse":8255,
  "caminar":2304,"parar":5821,"mirar":3269,"escuchar":28292,"repetir":5861,
  "bien":38274,"no":3259,"correr":2577,"saltar":5895,"estirar":6082,
  "empujar":5828,"tirar":6534,"lanzar":8329,"coger":5786,"subir":6491,
  "bajar":5787,"girar":6192,"equilibrio":6026,"fuerza":6173,"relajar":5848,
  "respirar":5860,"cabeza":2026,"brazo":1964,"pierna":3251,"pie":3249,
  "espalda":6060,"rodilla":3264,"mano":3219,"dolor":5952,"cansado":6238,
  "mucho":3271,"poco":3261,"contento":5855,"triste":6538,"miedo":6248,
  "enfadado":5968,"tranquilo":6537,"querer":5842,"bravo":6228,"animar":6228,
  "pelota":4912,"colchoneta":6448,"escalera":6037,"silla":6455,"agua":1839,
  "música":3275,"ordenador":3284,"tablet":37381,"descanso":5938,
  "difícil":6001,"fácil":6020,"regular":5849,"no puedo":3259,
};

// Emojis de fallback por palabra (si la imagen no carga)
const WORD_EMOJI = {
  "empezar":"▶️","terminar":"⏹️","esperar":"✋","sentarse":"🪑","levantarse":"⬆️",
  "caminar":"🚶","parar":"🛑","mirar":"👀","escuchar":"👂","repetir":"🔁",
  "bien":"👍","no":"❌","correr":"🏃","saltar":"⬆️","estirar":"🤸",
  "empujar":"➡️","tirar":"⬅️","lanzar":"🎯","coger":"✊","subir":"⬆️",
  "bajar":"⬇️","girar":"🔄","equilibrio":"⚖️","fuerza":"💪","relajar":"😌",
  "respirar":"🫁","cabeza":"🧠","brazo":"💪","pierna":"🦵","pie":"🦶",
  "espalda":"🔙","rodilla":"🦵","mano":"✋","dolor":"⚡","cansado":"😮‍💨",
  "mucho":"⬆️","poco":"🤏","contento":"😊","triste":"😢","miedo":"😨",
  "enfadado":"😠","tranquilo":"😌","querer":"❤️","bravo":"👏","animar":"🙌",
  "pelota":"⚽","colchoneta":"🟩","escalera":"📶","silla":"🪑","agua":"💧",
  "música":"🎵","ordenador":"💻","tablet":"📱","descanso":"😴",
  "difícil":"😤","fácil":"😊","regular":"😐","no puedo":"🚫",
};

const ARASAAC_IMG = (id) => `https://static.arasaac.org/pictograms/${id}/${id}_300.png`;
const getPictoUrl = (arasaacKey) => {
  const id = ARASAAC_IDS[arasaacKey];
  return id ? ARASAAC_IMG(id) : null;
};
const getFallbackEmoji = (palabra) => WORD_EMOJI[palabra.toLowerCase()] || WORD_EMOJI[palabra] || "🤲";

// ─── DATOS BIMODAL ────────────────────────────────────────────────────────────
// Signos descritos según Lengua de Signos Española adaptada al bimodal clínico
const BIMODAL_DB = {
  "Rutinas de sesión": [
    { palabra: "Empezar", signo: "Manos abiertas, palmas hacia arriba, mover hacia delante simultáneamente", arasaac: "empezar", categoria: "rutina", color: "#2D6A4F" },
    { palabra: "Terminar", signo: "Manos en puño, cruzarlas delante del pecho y abrir hacia fuera", arasaac: "terminar", categoria: "rutina", color: "#2D6A4F" },
    { palabra: "Esperar", signo: "Mano abierta, palma hacia fuera, dedos arriba. Movimiento suave adelante-atrás", arasaac: "esperar", categoria: "rutina", color: "#2D6A4F" },
    { palabra: "Sentarse", signo: "Dedos índice y medio de la mano derecha sobre los de la izquierda, flexionar", arasaac: "sentarse", categoria: "rutina", color: "#2D6A4F" },
    { palabra: "Levantarse", signo: "Dedos índice y medio extendidos en mano derecha, mover hacia arriba", arasaac: "levantarse", categoria: "rutina", color: "#2D6A4F" },
    { palabra: "Caminar", signo: "Índice y medio alternando movimiento hacia adelante, imitando piernas", arasaac: "caminar", categoria: "rutina", color: "#2D6A4F" },
    { palabra: "Parar", signo: "Mano derecha abierta, palma hacia fuera, movimiento brusco hacia delante", arasaac: "parar", categoria: "rutina", color: "#2D6A4F" },
    { palabra: "Mirar", signo: "Índice y medio en V apuntando a los ojos, luego hacia el objeto", arasaac: "mirar", categoria: "rutina", color: "#2D6A4F" },
    { palabra: "Escuchar", signo: "Mano ahuecada detrás de la oreja", arasaac: "escuchar", categoria: "rutina", color: "#2D6A4F" },
    { palabra: "Repetir", signo: "Mano derecha en puño con pulgar arriba, movimiento circular horizontal", arasaac: "repetir", categoria: "rutina", color: "#2D6A4F" },
    { palabra: "Bien", signo: "Pulgar arriba con mano derecha, mover ligeramente hacia delante", arasaac: "bien", categoria: "rutina", color: "#2D6A4F" },
    { palabra: "No", signo: "Índice extendido, mover de lado a lado horizontalmente", arasaac: "no", categoria: "rutina", color: "#E74C3C" },
  ],
  "Ejercicio y movimiento": [
    { palabra: "Correr", signo: "Brazos doblados, moverlos alternando como al correr, con desplazamiento hacia delante", arasaac: "correr", categoria: "ejercicio", color: "#1A1A2E" },
    { palabra: "Saltar", signo: "Índice y medio juntos apuntando abajo, flexionar y extender como un salto", arasaac: "saltar", categoria: "ejercicio", color: "#1A1A2E" },
    { palabra: "Estirar", signo: "Manos juntas frente al pecho, separarlas hacia los lados lentamente", arasaac: "estirar", categoria: "ejercicio", color: "#1A1A2E" },
    { palabra: "Empujar", signo: "Manos abiertas palmas hacia delante, movimiento hacia adelante con fuerza", arasaac: "empujar", categoria: "ejercicio", color: "#1A1A2E" },
    { palabra: "Tirar", signo: "Manos en puño, movimiento hacia el cuerpo con fuerza", arasaac: "tirar", categoria: "ejercicio", color: "#1A1A2E" },
    { palabra: "Lanzar", signo: "Mano en puño, movimiento de lanzamiento hacia delante abriendo los dedos", arasaac: "lanzar", categoria: "ejercicio", color: "#1A1A2E" },
    { palabra: "Coger", signo: "Mano abierta, cerrar los dedos como al agarrar un objeto", arasaac: "coger", categoria: "ejercicio", color: "#1A1A2E" },
    { palabra: "Subir", signo: "Índice apuntando hacia arriba, mover hacia arriba", arasaac: "subir", categoria: "ejercicio", color: "#1A1A2E" },
    { palabra: "Bajar", signo: "Índice apuntando hacia abajo, mover hacia abajo", arasaac: "bajar", categoria: "ejercicio", color: "#1A1A2E" },
    { palabra: "Girar", signo: "Índice extendido hacia arriba, mover en círculo", arasaac: "girar", categoria: "ejercicio", color: "#1A1A2E" },
    { palabra: "Equilibrio", signo: "Brazos extendidos a los lados, palmas abajo, movimiento suave de balanceo", arasaac: "equilibrio", categoria: "ejercicio", color: "#1A1A2E" },
    { palabra: "Fuerza", signo: "Doblar brazo mostrando bíceps, mano en puño", arasaac: "fuerza", categoria: "ejercicio", color: "#1A1A2E" },
    { palabra: "Relajar", signo: "Manos abiertas palmas abajo, bajarlas lentamente con movimiento suave", arasaac: "relajar", categoria: "ejercicio", color: "#1A1A2E" },
    { palabra: "Respirar", signo: "Mano en pecho, movimiento de expansión y contracción siguiendo la respiración", arasaac: "respirar", categoria: "ejercicio", color: "#1A1A2E" },
  ],
  "Cuerpo y dolor": [
    { palabra: "Cabeza", signo: "Tocar la cabeza con la mano abierta", arasaac: "cabeza", categoria: "cuerpo", color: "#6B4226" },
    { palabra: "Brazo", signo: "Pasar la mano por el brazo contrario de arriba a abajo", arasaac: "brazo", categoria: "cuerpo", color: "#6B4226" },
    { palabra: "Pierna", signo: "Pasar la mano por la pierna de arriba a abajo", arasaac: "pierna", categoria: "cuerpo", color: "#6B4226" },
    { palabra: "Pie", signo: "Señalar el pie con el índice", arasaac: "pie", categoria: "cuerpo", color: "#6B4226" },
    { palabra: "Espalda", signo: "Señalar la espalda con el pulgar por encima del hombro", arasaac: "espalda", categoria: "cuerpo", color: "#6B4226" },
    { palabra: "Rodilla", signo: "Tocar la rodilla con la mano", arasaac: "rodilla", categoria: "cuerpo", color: "#6B4226" },
    { palabra: "Mano", signo: "Pasar la mano derecha sobre el dorso de la izquierda", arasaac: "mano", categoria: "cuerpo", color: "#6B4226" },
    { palabra: "Dolor", signo: "Índices apuntando entre sí moviéndose hacia dentro repetidamente", arasaac: "dolor", categoria: "cuerpo", color: "#E74C3C" },
    { palabra: "Aquí duele", signo: "Índice señalando la zona + signo de dolor", arasaac: "dolor", categoria: "cuerpo", color: "#E74C3C" },
    { palabra: "Cansado", signo: "Manos abiertas en el pecho, dejarlas caer hacia abajo lentamente", arasaac: "cansado", categoria: "cuerpo", color: "#E67E22" },
    { palabra: "Mucho", signo: "Manos juntas frente al pecho, separarlas hacia fuera", arasaac: "mucho", categoria: "cuerpo", color: "#6B4226" },
    { palabra: "Poco", signo: "Pulgar e índice casi juntos, pequeño espacio entre ellos", arasaac: "poco", categoria: "cuerpo", color: "#6B4226" },
  ],
  "Emociones y motivación": [
    { palabra: "Contento", signo: "Mano abierta en el pecho, movimiento circular hacia arriba", arasaac: "contento", categoria: "emocion", color: "#F39C12" },
    { palabra: "Triste", signo: "Índices en las mejillas, moverlos hacia abajo", arasaac: "triste", categoria: "emocion", color: "#3498DB" },
    { palabra: "Miedo", signo: "Manos abiertas delante del pecho, dedos extendidos, ligero temblor", arasaac: "miedo", categoria: "emocion", color: "#9B59B6" },
    { palabra: "Enfadado", signo: "Mano en puño delante de la cara, ceño fruncido", arasaac: "enfadado", categoria: "emocion", color: "#E74C3C" },
    { palabra: "Tranquilo", signo: "Manos abiertas a los lados, palmas abajo, movimiento suave descendente", arasaac: "tranquilo", categoria: "emocion", color: "#27AE60" },
    { palabra: "Querer", signo: "Mano cerrada en el pecho, movimiento circular", arasaac: "querer", categoria: "emocion", color: "#E91E63" },
    { palabra: "No quiero", signo: "Signo de querer + signo de no", arasaac: "no", categoria: "emocion", color: "#E74C3C" },
    { palabra: "Bravo", signo: "Aplaudir o pulgar arriba con movimiento hacia delante", arasaac: "bravo", categoria: "emocion", color: "#F39C12" },
    { palabra: "Animar", signo: "Puños cerrados a la altura del pecho, movimiento hacia arriba alternado", arasaac: "animar", categoria: "emocion", color: "#F39C12" },
  ],
  "Materiales y objetos": [
    { palabra: "Pelota", signo: "Manos formando una esfera con los dedos curvados", arasaac: "pelota", categoria: "material", color: "#8E44AD" },
    { palabra: "Colchoneta", signo: "Manos planas, una sobre otra, movimiento horizontal", arasaac: "colchoneta", categoria: "material", color: "#8E44AD" },
    { palabra: "Escalera", signo: "Índices alternando movimiento ascendente como peldaños", arasaac: "escalera", categoria: "material", color: "#8E44AD" },
    { palabra: "Silla", signo: "Índice y medio de la mano derecha sobre los de la izquierda, flexionar ligeramente", arasaac: "silla", categoria: "material", color: "#8E44AD" },
    { palabra: "Agua", signo: "Mano en W (índice, medio, anular extendidos) tocando los labios", arasaac: "agua", categoria: "material", color: "#2980B9" },
    { palabra: "Música", signo: "Mano derecha abierta, movimiento de dirección musical", arasaac: "música", categoria: "material", color: "#8E44AD" },
    { palabra: "Ordenador", signo: "Manos imitando teclear en teclado", arasaac: "ordenador", categoria: "material", color: "#8E44AD" },
    { palabra: "Tablet", signo: "Mano izquierda plana, índice derecho deslizando sobre ella", arasaac: "tablet", categoria: "material", color: "#8E44AD" },
  ],
  "Esfuerzo (RPE bimodal)": [
    { palabra: "Nada de esfuerzo", signo: "Manos abiertas, palmas abajo, movimiento suave horizontal. Expresión relajada", arasaac: "descanso", categoria: "rpe", color: "#4CAF50", rpe: 1 },
    { palabra: "Muy fácil", signo: "Pulgar arriba con expresión tranquila y sonrisa leve", arasaac: "fácil", categoria: "rpe", color: "#66BB6A", rpe: 2 },
    { palabra: "Fácil", signo: "Mano abierta, movimiento suave. Expresión cómoda", arasaac: "bien", categoria: "rpe", color: "#9CCC65", rpe: 3 },
    { palabra: "Moderado", signo: "Mano abierta a nivel pecho, movimiento neutro. Expresión normal", arasaac: "regular", categoria: "rpe", color: "#FFEE58", rpe: 5 },
    { palabra: "Duro", signo: "Puño cerrado con tensión. Ceño ligeramente fruncido", arasaac: "difícil", categoria: "rpe", color: "#FFA726", rpe: 7 },
    { palabra: "Muy duro", signo: "Dos puños con tensión, expresión de esfuerzo intenso", arasaac: "mucho", categoria: "rpe", color: "#FF7043", rpe: 8 },
    { palabra: "No puedo más", signo: "Manos en la cabeza o cruzadas en X. Expresión agotada", arasaac: "no puedo", categoria: "rpe", color: "#EF5350", rpe: 10 },
  ],
};

const CATEGORIAS_COLOR = {
  rutina: "#2D6A4F", ejercicio: "#1A1A2E", cuerpo: "#6B4226",
  emocion: "#F39C12", material: "#8E44AD", rpe: "#E74C3C",
};

const SESION_SECUENCIAS = {
  "Síndrome de Down": {
    Inicio: ["Empezar","Mirar","Escuchar","Bien"],
    Calentamiento: ["Caminar","Respirar","Estirar","Subir","Bajar"],
    "Parte principal": ["Equilibrio","Fuerza","Saltar","Coger","Lanzar"],
    "Vuelta a la calma": ["Relajar","Respirar","Estirar","Tranquilo","Terminar"],
  },
  "TEA": {
    Inicio: ["Empezar","Esperar","Mirar","Escuchar"],
    Calentamiento: ["Caminar","Correr","Saltar","Respirar"],
    "Parte principal": ["Lanzar","Coger","Girar","Equilibrio","Saltar"],
    "Vuelta a la calma": ["Parar","Respirar","Relajar","Tranquilo","Terminar"],
  },
  "Daño Cerebral Adquirido": {
    Inicio: ["Empezar","Mirar","Bien","Repetir"],
    Calentamiento: ["Estirar","Respirar","Subir","Bajar","Caminar"],
    "Parte principal": ["Empujar","Tirar","Fuerza","Equilibrio","Coger"],
    "Vuelta a la calma": ["Parar","Relajar","Respirar","Terminar"],
  },
  "Parálisis Cerebral": {
    Inicio: ["Empezar","Mirar","Escuchar","Esperar"],
    Calentamiento: ["Respirar","Estirar","Relajar","Caminar"],
    "Parte principal": ["Subir","Bajar","Equilibrio","Fuerza","Girar"],
    "Vuelta a la calma": ["Relajar","Respirar","Tranquilo","Terminar"],
  },
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const todosSignos = Object.values(BIMODAL_DB).flat();
// ══════════════════════════════════════════════════════════════════

const EJERCICIOS_CATALOGO = {
  "Síndrome de Down":{
    Bajo:[
      "Control cefálico en prono","Sedestación en cuna foam","Volteo asistido supino-prono",
      "Puente de glúteos","Circuito sensorial texturas","Marcha en barras paralelas",
      "Estimulación vibratoria segmentaria","Presión palmar objetos grandes",
      "Bipedestación estática con apoyo","Arrastre en decúbito prono",
      "Gateo asistido cuadrupedia","Balanceo en pelota Bobath",
      "Masaje propioceptivo MMII","Transferencia sedestación-bipedestación",
    ],
    Medio:[
      "Equilibrio bosu bipodal","Marcha con obstáculos bajos","Escaleras con apoyo unilateral",
      "Sentadilla goblet con banda","Ensartado de cuentas medianas","Doble tarea cognitivo-motora",
      "Manipulación cubiertos adaptados","Remo con banda elástica",
      "Equilibrio monopodal suelo","Subida step unilateral",
      "Lanzamiento y recepción pelota","Escritura funcional trazo controlado",
      "Circuito de obstáculos con velocidad","Pinza tridigital con piezas",
    ],
    Alto:[
      "Equilibrio monopodal ojos cerrados","Marcha con doble tarea cognitiva",
      "Carrera continua 10-15min","Circuito fuerza funcional 4 ejercicios",
      "HIIT adaptado 20-40","AVD completas bajo tiempo",
      "Tiro al blanco sensorial pesos","Pliometría adaptada saltos",
      "Tandem ojos cerrados colchoneta","Perturbaciones en bosu",
      "Circuito de agilidad con cambios","Manejo transporte autónomo",
    ],
  },
  "TEA":{
    Bajo:[
      "Protocolo Wilbarger presión profunda","Columpio terapéutico lineal",
      "Manta de peso en sedestación","Marcha en línea cinta adhesiva",
      "Imitación movimientos en espejo","Trampolín bilateral rítmico",
      "Respiración diafragmática guiada","Ensamblaje LEGO Duplo",
      "Baño sensorial de texturas","Input propioceptivo colchoneta",
      "Masaje con rodillo autoaplicado","Columpio rotatorio graduado",
    ],
    Medio:[
      "Carrera en circuito cerrado predecible","Circuito pictográfico 5 estaciones",
      "Lanzamiento estructurado con diana","Equilibrio monopodal con pictograma",
      "Yoga/psicomotricidad secuencia fija","Juego de pelota con normas",
      "Doble tarea ritmo y movimiento","Saltos coordinados con palmadas",
      "Bicicleta estática con pulsómetro","Obstáculos con instrucción visual",
    ],
    Alto:[
      "Circuito integración sensorial complejo","Atletismo técnica de carrera",
      "Habilidades deportivas específicas","Trabajo aeróbico con autorregistro RPE",
      "Deporte adaptado en grupo pequeño","Fútbol sala reglas simplificadas",
      "Natación técnica adaptada","Juegos cooperativos estructurados",
    ],
  },
  "Daño Cerebral Adquirido":{
    Bajo:[
      "Movilizaciones pasivas ROM completo","Posicionamiento antiespasmódico cama",
      "TENS manejo dolor y tono","Volteo y transferencias en camilla",
      "Transferencia silla-cama tabla deslizante","Estimulación sensorial MMSS afecto",
      "Ejercicios MMSS en mesa lisa","Activación muscular isométrica",
      "Fisioterapia respiratoria básica","Estimulación oral-facial si procede",
    ],
    Medio:[
      "Técnicas inhibición Bobath","Marcha en barras paralelas DCA",
      "Marcha con andador en circuito","Cinta soporte parcial de peso",
      "CIMT restricción mano sana","Realidad virtual coordinación MMSS",
      "Control tronco sedestación sin respaldo","FES pie caído",
      "Alcance y prensión objetos cotidianos","Bipedestación carga progresiva afecto",
    ],
    Alto:[
      "Marcha exterior con obstáculos reales","Plataforma equilibrio biofeedback",
      "AVD completas análisis funcional","Circuito funcional alta complejidad",
      "Doble tarea cognitivo-motora avanzada","Marcha doble tarea + objeto en mano",
      "Reintegración laboral simulada","Conducción simulada si procede",
    ],
  },
  "Parálisis Cerebral":{
    Bajo:[
      "Estiramiento cadena posterior pasivo","Standing terapéutico frame",
      "Hidroterapia 34-35°C","Control cabeza en pelota Bobath",
      "Arrastre homolateral y cruzado","Movilizaciones ROM articular",
      "Posicionamiento anti-deformidad","Activación voluntaria selectiva",
      "Estimulación vibratoria antagonistas","Fisioterapia respiratoria PC",
    ],
    Medio:[
      "Marcha en barras paralelas PC","Cinta soporte parcial Lokomat",
      "Fortalecimiento antagonistas banda","Hipoterapia monta terapéutica",
      "Equilibrio sedestación inestable","CIMT hemiparesia espástica",
      "Taping neuromuscular corrección","Escaleras con apoyo PC",
    ],
    Alto:[
      "Realidad virtual MMSS y equilibrio","Deporte adaptado boccia / atletismo",
      "Marcha comunitaria exterior","Fortalecimiento excéntrico prevención",
      "Periodización deportiva adaptada","Natación adaptada técnica",
      "Bicicleta adaptada resistencia","Trabajo aeróbico intervalos",
    ],
  },
};

const EJERCICIOS_DETALLE = {
  "Control cefálico en prono":{series:"3",reps:"30s",material:"Colchoneta, rodillo",obj:"Equilibrio y control postural",desc:"En prono sobre rodillo bajo el tórax. Elevar cabeza contra gravedad manteniendo alineación. Activación de extensores cervicales y paravertebrales.",progresion:"→ Más tiempo → Prono sin rodillo → Apoyo en antebrazos → Cuadrupedia"},
  "Sedestación en cuna foam":{series:"4",reps:"2 min",material:"Cuna foam, cojines",obj:"Equilibrio y control postural",desc:"Sedestación 90° con apoyo lateral decreciente. Activación CORE y control de tronco. Monitorizar hiperlaxitud y compensaciones.",progresion:"→ Reducir apoyo → Sin cuna → Superficie inestable → Con tarea MMSS"},
  "Volteo asistido supino-prono":{series:"4",reps:"6 c/lado",material:"Colchoneta",obj:"Marcha y locomoción",desc:"Facilitación del volteo: cabeza → hombros → tronco → MMII. Patrón cruzado. Prerequisito para marcha. Reducir asistencia progresivamente.",progresion:"→ Asistencia reducida → Autónomo → Rápido → Incorporación desde suelo"},
  "Puente de glúteos":{series:"3",reps:"12",material:"Colchoneta",obj:"Fuerza y resistencia muscular",desc:"Decúbito supino, rodillas flexionadas. Elevar caderas contrayendo glúteos y CORE. Mantener 3s en cima. Controlar compensaciones lumbares.",progresion:"→ Más tiempo → Un pie elevado → Superficie inestable → Banda en rodillas"},
  "Circuito sensorial texturas":{series:"2",reps:"2 vueltas",material:"Texturas variadas, colchoneta",obj:"Integración sensorial",desc:"Recorrido descalzo por superficies de diferente dureza, textura y estabilidad. Ritmo propio. Activar sistema plantar y propioceptivo.",progresion:"→ Ojos cerrados → Equilibrio en cada superficie → Velocidad"},
  "Marcha en barras paralelas":{series:"4",reps:"10m x3",material:"Barras paralelas, espejo",obj:"Marcha y locomoción",desc:"Marcha con apoyo bilateral. Corrección en espejo: elevación talón, extensión cadera, longitud de paso, oscilación de brazos.",progresion:"→ Apoyo unilateral → Andador → Bastón → Libre"},
  "Estimulación vibratoria segmentaria":{series:"3",reps:"3 min/zona",material:"Vibrador terapéutico",obj:"Integración sensorial",desc:"Aplicación de vibración en grandes grupos musculares. Cuádriceps, isquiotibiales, gemelos, paravertebrales. Activación neuromuscular previa al trabajo activo.",progresion:"→ Zonas distales → Integrar con movimiento → Autoaplicación"},
  "Presión palmar objetos grandes":{series:"3",reps:"10 c/mano",material:"Pelotas espuma grandes",obj:"Coordinación motora fina",desc:"Prensión esférica de pelota grande. Mantener 5 segundos, soltar. Activar flexores de muñeca y dedos. Prerequisito para pinza funcional.",progresion:"→ Pelota más pequeña → Alternancia manos → Lanzamiento suave → Objetos irregulares"},
  "Bipedestación estática con apoyo":{series:"3",reps:"45s",material:"Barra fija o silla",obj:"Equilibrio y control postural",desc:"Bipedestación apoyo bilateral en barra. Pies paralelos, rodillas semiflexionadas. Activar glúteo medio y CORE. Corregir valgo de rodilla.",progresion:"→ Apoyo unilateral → Sin apoyo → Ojos cerrados → Superficie inestable"},
  "Arrastre en decúbito prono":{series:"3",reps:"5m",material:"Colchoneta",obj:"Cognición motora",desc:"Arrastre con apoyo en antebrazos. Alternancia MMSS y activación MMII. Patrón cruzado. Activación cortical bilateral y fuerza escapular.",progresion:"→ Distancia mayor → Plano inclinado → Gateo"},
  "Gateo asistido cuadrupedia":{series:"3",reps:"5m",material:"Colchoneta",obj:"Marcha y locomoción",desc:"Gateo patrón cruzado (mano D + rodilla I). Fisio facilita alternancia MMII. Fortalece cadena extensora y coordinación bilateral.",progresion:"→ Gateo autónomo → Obstáculos bajos → Velocidad → Gateo atrás"},
  "Balanceo en pelota Bobath":{series:"3",reps:"3 min",material:"Pelota Bobath grande",obj:"Regulación tónica",desc:"Sedestación en pelota Bobath. Balanceo anteroposterior y lateral suave. Facilitar reacciones de equilibrio y normalización del tono.",progresion:"→ Balanceo activo → Con perturbaciones → MMSS libres → Actividad durante balanceo"},
  "Masaje propioceptivo MMII":{series:"1",reps:"10 min",material:"Rodillo, manos",obj:"Regulación tónica",desc:"Presiones profundas en cuádriceps, isquiotibiales y gemelos. Preparación neuromuscular previa al trabajo en carga. Mejora consciencia corporal.",progresion:"→ Autoaplicación → Diferente textura → Integrar con actividad"},
  "Transferencia sedestación-bipedestación":{series:"4",reps:"8",material:"Silla firme",obj:"Marcha y locomoción",desc:"Levantarse con movimiento controlado. Descenso en 3s, subida en 1s. Sin apoyo de brazos progresivamente. Patrón funcional básico.",progresion:"→ Sin brazos → Velocidad → Silla más baja → Con objeto en mano"},
  "Equilibrio bosu bipodal":{series:"3",reps:"40s",material:"Bosu",obj:"Equilibrio y control postural",desc:"Bipedestación sobre bosu con ojos abiertos. Activar cadena extensora y reacciones de equilibrio. Corregir desde caderas.",progresion:"→ Ojos cerrados → Movimientos MMSS → Lanzar/recibir pelota → Perturbaciones"},
  "Marcha con obstáculos bajos":{series:"4",reps:"2 vueltas",material:"Conos, aros, vallas 10cm",obj:"Marcha y locomoción",desc:"Circuito con conos en zigzag, paso por aros y vallas bajas. Énfasis en elevación del pie y control de tronco. Velocidad progresiva.",progresion:"→ Velocidad mayor → Vallas más altas → Doble tarea → Exterior"},
  "Escaleras con apoyo unilateral":{series:"3",reps:"3 subidas",material:"Escalera, pasamanos",obj:"Marcha y locomoción",desc:"Escalera paso a paso con pasamanos unilateral. Subida: pie sano primero. Bajada: pie más débil primero. Control de valgo.",progresion:"→ Pasamanos bilateral → Sin pasamanos → Paso alternante → Con objeto"},
  "Sentadilla goblet con banda":{series:"3",reps:"12",material:"Banda elástica, mancuerna",obj:"Fuerza y resistencia muscular",desc:"Sentadilla con banda en rodillas para activar abductores. Rodillas alineadas con 2º dedo. Descenso en 3s, subida en 1s.",progresion:"→ Más peso → Pausa en fondo → Monopodal → Salto al subir"},
  "Ensartado de cuentas medianas":{series:"3",reps:"10 cuentas",material:"Cuentas 2cm, cordón",obj:"Coordinación motora fina",desc:"Ensartar cuentas en cordón rígido. Coordinación bimanual: una mano sostiene, otra ensarta. Patrón cruzado fino.",progresion:"→ Cuentas más pequeñas → Cordón flexible → Velocidad → Patrón de color"},
  "Doble tarea cognitivo-motora":{series:"4",reps:"20m",material:"Cono, pelota pequeña",obj:"Cognición motora",desc:"Marcha o ejercicio motor mientras realiza tarea cognitiva: contar atrás de 3 en 3, nombrar animales, responder preguntas. Analizar impacto en patrón.",progresion:"→ Tarea más compleja → Terreno irregular → Velocidad → Exterior"},
  "Manipulación cubiertos adaptados":{series:"1",reps:"Comida funcional",material:"Cubiertos adaptados, vaso con asa",obj:"Autonomía en AVD",desc:"Uso de cuchara, tenedor y vaso adaptados. Control derrames, coordinación ojo-mano, sincronización boca-mano.",progresion:"→ Cubiertos estándar → Cuchillo → Servirse solo → Bandeja completa"},
  "Remo con banda elástica":{series:"3",reps:"12",material:"Banda elástica fijada",obj:"Fuerza y resistencia muscular",desc:"Sentado o de pie, tracción bilateral de banda. Retracción escapular, codos pegados. Fortalece dorsal, romboides y bíceps.",progresion:"→ Mayor resistencia → Polea → Unilateral → TRX"},
  "Equilibrio monopodal suelo":{series:"3",reps:"20s c/pierna",material:"Pared cerca",obj:"Equilibrio y control postural",desc:"Apoyo monopodal con rodilla en ligera flexión. Controlar valgo. Ojos abiertos, mirada fija en punto.",progresion:"→ Ojos cerrados → Movimiento MMSS → Lanzar pelota → Superficie inestable"},
  "Subida step unilateral":{series:"3",reps:"10 c/pierna",material:"Step 20cm",obj:"Fuerza y resistencia muscular",desc:"Subida lateral o frontal al step con control excéntrico en bajada. Activación glúteo y cuádriceps. Corregir valgo dinámico.",progresion:"→ Step más alto → Con peso → Velocidad → Step lateral"},
  "Lanzamiento y recepción pelota":{series:"3",reps:"15 c/tipo",material:"Pelotas diferentes tamaños",obj:"Coordinación motora fina",desc:"Lanzamiento y recepción bilateral y unilateral. Variación de distancia, tamaño y velocidad. Coordinación ojo-mano.",progresion:"→ Distancia mayor → Pelota más pequeña → Una mano → En movimiento"},
  "Escritura funcional trazo controlado":{series:"3",reps:"5 min",material:"Lápiz, papel cuadriculado",obj:"Coordinación motora fina",desc:"Trazado de líneas, curvas y letras sobre papel cuadriculado. Control de presión, agarre y postura. Preparación escritura.",progresion:"→ Letras → Palabras → Velocidad → Escritura espontánea"},
  "Circuito de obstáculos con velocidad":{series:"3",reps:"3 vueltas",material:"Conos, aros, vallas",obj:"Marcha y locomoción",desc:"Circuito cronometrado. Medir tiempo y reducirlo progresivamente. Alta demanda coordinativa y cardiovascular.",progresion:"→ Menos tiempo → Obstáculos más altos → Cambios de dirección → Exterior"},
  "Pinza tridigital con piezas":{series:"3",reps:"15 piezas",material:"Piezas ensamblaje",obj:"Coordinación motora fina",desc:"Coger y colocar piezas 3-4cm con pinza pulgar-índice-medio. Control de fuerza y precisión. Progresión por tamaño.",progresion:"→ Piezas más pequeñas → Tiempo limitado → Una mano → Mosaicos finos"},
  "Equilibrio monopodal ojos cerrados":{series:"4",reps:"25s c/pierna",material:"Colchoneta fina",obj:"Equilibrio y control postural",desc:"Apoyo monopodal en colchoneta fina con ojos cerrados. Alta demanda propioceptiva. Sin compensaciones visuales. Máxima atención.",progresion:"→ Superficie más inestable → Perturbaciones → Doble tarea → Bosu"},
  "Marcha con doble tarea cognitiva":{series:"4",reps:"30m",material:"Ninguno",obj:"Cognición motora",desc:"Marcha normal mientras cuenta atrás, nombra categorías o responde preguntas. Analizar velocidad, longitud de paso y estabilidad.",progresion:"→ Tarea más compleja → Terreno irregular → Velocidad → Exterior real"},
  "Carrera continua 10-15min":{series:"1",reps:"10-15 min",material:"Cinta o pista",obj:"Fuerza y resistencia muscular",desc:"Carrera a velocidad baja-moderada mantenida. Control técnica: apoyo antepié, oscilación brazos, tronco erecto. Monitorizar FC.",progresion:"→ Más tiempo → Velocidad → Terreno variado → Intervalos sprint"},
  "Circuito fuerza funcional 4 ejercicios":{series:"3",reps:"12 c/ejercicio",material:"Banda, mancuernas, steps",obj:"Fuerza y resistencia muscular",desc:"Circuito: sentadilla + remo + press hombro + hip hinge. 45s trabajo / 15s transición. Sin descanso entre ejercicios.",progresion:"→ Mayor peso → Menos descanso → Añadir ejercicio → Con cardio"},
  "HIIT adaptado 20-40":{series:"6",reps:"20s/40s",material:"Step, banda, espacio",obj:"Fuerza y resistencia muscular",desc:"20s trabajo intenso (step ups, sentadilla dinámica, remo explosivo) / 40s recuperación activa. Monitorizar tolerancia.",progresion:"→ 30/30 → 40/20 → Añadir rondas → Ejercicios más complejos"},
  "AVD completas bajo tiempo":{series:"1",reps:"Sesión funcional",material:"Entorno doméstico simulado",obj:"Autonomía en AVD",desc:"Vestido, alimentación, higiene, manipulación de objetos cotidianos. Cronometrar y reducir tiempo progresivamente.",progresion:"→ Eliminar adaptaciones → Nuevas AVD → Entorno real → Autónomo completo"},
  "Tiro al blanco sensorial pesos":{series:"3",reps:"10 lanzamientos",material:"Pelotas 100-500g, diana",obj:"Integración sensorial",desc:"Lanzar pelotas de diferente peso a diana. El SNC adapta la fuerza a cada peso. Calibración sensoriomotora fina.",progresion:"→ Distancia mayor → Sin ver el peso → Velocidad → No dominante"},
  "Pliometría adaptada saltos":{series:"4",reps:"8",material:"Colchoneta, caja baja",obj:"Fuerza y resistencia muscular",desc:"Saltos bilaterales con aterrizaje controlado. Énfasis en amortiguación excéntrica. Control de valgo de rodilla en aterrizaje.",progresion:"→ Mayor altura → Unilateral → Cambio de dirección → Reacción a señal"},
  "Tandem ojos cerrados colchoneta":{series:"4",reps:"30s",material:"Colchoneta fina",obj:"Equilibrio y control postural",desc:"Posición tándem (pie delante del otro) sobre colchoneta con ojos cerrados. Alta demanda propioceptiva.",progresion:"→ Moverse en tándem → Doble tarea → Más inestable → Perturbaciones"},
  "Perturbaciones en bosu":{series:"3",reps:"10 perturbaciones",material:"Bosu",obj:"Equilibrio y control postural",desc:"Bipedestación en bosu. Terapeuta aplica perturbaciones en hombros, caderas de forma impredecible. Reacciones de equilibrio activas.",progresion:"→ Más fuertes → Monopodal → Tarea secundaria → Ojos cerrados"},
  "Circuito de agilidad con cambios":{series:"3",reps:"3 vueltas",material:"Conos, escalera agilidad",obj:"Cognición motora",desc:"Circuito de agilidad con cambios de dirección, escalera de agilidad y sprints cortos. Alta demanda neurocognitiva y motora.",progresion:"→ Velocidad → Reacción a señal → Tarea cognitiva simultánea → Exterior"},
  "Manejo transporte autónomo":{series:"1",reps:"Práctica real",material:"Entorno comunitario",obj:"Autonomía en AVD",desc:"Práctica de desplazamiento real: semáforo, autobús, pago en tienda. Acompañamiento decreciente hasta autonomía.",progresion:"→ Reducir acompañamiento → Imprevistos → Autónomo completo"},
  "Protocolo Wilbarger presión profunda":{series:"1",reps:"10 min",material:"Cepillo quirúrgico suave",obj:"Integración sensorial",desc:"Presiones profundas con cepillo en MMSS, MMII y espalda. Siempre con consentimiento previo. Nunca en abdomen ni cara. Protocolo estandarizado.",progresion:"→ Autoaplicación guiada → Rutina matinal → Variación texturas → Con movimiento"},
  "Columpio terapéutico lineal":{series:"3",reps:"3 min",material:"Columpio terapéutico",obj:"Integración sensorial",desc:"Movimiento lineal lento y predecible. Ritmo constante. Monitorizar respuesta vestibular. Puede facilitar regulación o sobreestimular.",progresion:"→ Amplitud mayor → Movimiento rotatorio → Paciente impulsa → Con tarea"},
  "Manta de peso en sedestación":{series:"1",reps:"15-20 min",material:"Manta de peso (10% corporal)",obj:"Integración sensorial",desc:"Aplicar manta de peso en regazo durante actividad sedentaria. Input propioceptivo profundo. Mejora atención y regulación.",progresion:"→ Chaleco de peso → Durante actividad motora breve → Autogestión"},
  "Marcha en línea cinta adhesiva":{series:"3",reps:"10m",material:"Cinta adhesiva de color",obj:"Marcha y locomoción",desc:"Marcha sobre línea de cinta en suelo. Input visual claro y predecible. Estructura y predictibilidad del movimiento.",progresion:"→ Línea en zigzag → Sin cinta (interiorizado) → Obstáculos → Exterior"},
  "Imitación movimientos en espejo":{series:"3",reps:"10 movimientos",material:"Espejo grande",obj:"Coordinación motora fina",desc:"Fisio realiza movimiento simple. Paciente imita frente a espejo. Comenzar por movimientos unilaterales de brazo.",progresion:"→ Bilaterales → Sin espejo → Secuencias 2-3 → Imitación diferida"},
  "Trampolín bilateral rítmico":{series:"3",reps:"2 min",material:"Mini trampolín",obj:"Integración sensorial",desc:"Saltos bilaterales rítmicos. Input vestibular y propioceptivo intenso. Favorece regulación. Monitorizar respuesta.",progresion:"→ Asimétricos → Saltar y parar → Palmada al saltar → Con giro → Trampolín"},
  "Respiración diafragmática guiada":{series:"3",reps:"5 respiraciones",material:"Colchoneta, objeto ligero",obj:"Regulación tónica",desc:"Decúbito supino. Objeto en abdomen para feedback visual. Inhalar 4s → Retener 2s → Exhalar 6s. Regulación del SNA.",progresion:"→ En sedestación → En bipedestación → Antes de actividad → Autogestión"},
  "Ensamblaje LEGO Duplo":{series:"3",reps:"10 min",material:"LEGO Duplo o similar",obj:"Coordinación motora fina",desc:"Construcción libre o por modelo visual. Coordinación bimanual y planificación motora. Conectar con interés especial si posible.",progresion:"→ Piezas más pequeñas → Modelo complejo → Bajo tiempo → Colaborativa"},
  "Baño sensorial de texturas":{series:"1",reps:"10 min",material:"Cubetas arroz, arena, bolas",obj:"Integración sensorial",desc:"Exploración libre de texturas con manos y pies descalzos. Nominar texturas. Introducir nuevas progresivamente.",progresion:"→ Temperaturas variadas → Ojos cerrados → Identificar por tacto → Textura + movimiento"},
  "Input propioceptivo colchoneta":{series:"1",reps:"10 min",material:"Colchoneta gruesa, rodillo",obj:"Regulación tónica",desc:"Presiones profundas en grandes grupos musculares con rodillo. Siempre con consentimiento previo. Regulación previo a sesión.",progresion:"→ Autoaplicación → Diferentes texturas → Integrar con actividad"},
  "Masaje con rodillo autoaplicado":{series:"2",reps:"3 min/zona",material:"Foam roller",obj:"Regulación tónica",desc:"Automasaje con foam roller en muslos, gemelos y espalda. Input propioceptivo profundo. Reducción del tono previo al trabajo.",progresion:"→ Mayor presión → Zonas distales → Velocidad de rodado → Con movimiento"},
  "Columpio rotatorio graduado":{series:"2",reps:"2 min",material:"Columpio terapéutico",obj:"Integración sensorial",desc:"Rotación gradual en columpio. Estimulación vestibular intensa. Comenzar con rotaciones muy lentas y cortas. Monitorizar náuseas.",progresion:"→ Mayor amplitud → Velocidad → Cambio de dirección → Combinado con lineal"},
  "Carrera en circuito cerrado predecible":{series:"4",reps:"2 min",material:"Conos, cinta en suelo",obj:"Integración sensorial",desc:"Carrera en circuito marcado en suelo. Mismo recorrido cada sesión inicialmente. Input vestibular y propioceptivo integrado.",progresion:"→ Cambiar forma → Obstáculos → Velocidad variable → Exterior"},
  "Circuito pictográfico 5 estaciones":{series:"3",reps:"1 circuito",material:"Pictogramas, material variable",obj:"Cognición motora",desc:"5 estaciones con pictograma de la tarea. Paciente lee y ejecuta: saltar, gatear, lanzar, equilibrio, rodar. Sin instrucción verbal.",progresion:"→ Cambiar orden → Añadir estación → Tiempo por estación → Sin pictogramas"},
  "Lanzamiento estructurado con diana":{series:"4",reps:"10 lanzamientos",material:"Pelota espuma, diana",obj:"Coordinación motora fina",desc:"Lanzamiento con pictograma visible. Posición fija. Instrucción clara, sin ambigüedad. Coordinación ojo-mano y fuerza.",progresion:"→ Distancia mayor → En movimiento → Pelota pequeña → Con compañero"},
  "Equilibrio monopodal con pictograma":{series:"3",reps:"15s c/pierna",material:"Pictograma, pared",obj:"Equilibrio y control postural",desc:"Apoyo monopodal con pictograma de postura visible. Misma posición cada vez para predictibilidad.",progresion:"→ Más tiempo → Sin pictograma → Bosu → Con movimiento MMSS → Ojos cerrados"},
  "Yoga/psicomotricidad secuencia fija":{series:"1",reps:"20 min",material:"Esterilla, pictogramas posturas",obj:"Regulación tónica",desc:"Secuencia fija de posturas con pictograma. Música constante y volumen bajo. Misma secuencia siempre. Predecibilidad máxima.",progresion:"→ Nuevas posturas → Secuencia más larga → Sin pictogramas → Grupo pequeño"},
  "Juego de pelota con normas":{series:"3",reps:"10 min",material:"Pelota, conos",obj:"Cognición motora",desc:"Juego de pelota con normas visualizadas y simples. Turno por turno inicialmente. Introducir reglas progresivamente.",progresion:"→ 2 normas → 3 normas → Con compañero → Juego de equipo adaptado"},
  "Doble tarea ritmo y movimiento":{series:"3",reps:"5 min",material:"Música, material motor",obj:"Cognición motora",desc:"Ejecutar ejercicio motor mientras sigue ritmo musical con palmadas o instrumento de percusión simple.",progresion:"→ Ritmos más complejos → Cambio de ritmo → Sin instrumento → Coreografía simple"},
  "Saltos coordinados con palmadas":{series:"3",reps:"15",material:"Ninguno",obj:"Coordinación motora fina",desc:"Salto bilateral + palmada en el aire. Coordinación MMSS-MMII. Patrón predecible inicialmente.",progresion:"→ Palmada detrás → Múltiples palmadas → Con desplazamiento → Reacción a señal"},
  "Bicicleta estática con pulsómetro":{series:"1",reps:"15-20 min",material:"Bicicleta adaptada, pulsómetro",obj:"Fuerza y resistencia muscular",desc:"Pedaleo a cadencia moderada con monitorización de FC. Zona aeróbica 60-70% FCmax. Gestión autónoma del esfuerzo.",progresion:"→ Más tiempo → Resistencia → FC objetivo más alta → Exterior"},
  "Obstáculos con instrucción visual":{series:"3",reps:"3 vueltas",material:"Conos, pictogramas dirección",obj:"Cognición motora",desc:"Circuito con señales visuales de dirección y acción. Sin instrucción verbal. Lectura e interpretación de señales.",progresion:"→ Señales más abstractas → Velocidad → Sin señales → Exterior"},
  "Circuito integración sensorial complejo":{series:"3",reps:"1 vuelta",material:"Columpio, trampolín, túnel, piscina bolas",obj:"Integración sensorial",desc:"Recorrido que integra input vestibular, propioceptivo y táctil en secuencia. Ejecución autónoma con señal visual.",progresion:"→ Reducir señales → Añadir elemento nuevo → Ritmo propio → Entorno nuevo"},
  "Atletismo técnica de carrera":{series:"4",reps:"50m",material:"Pista, conos",obj:"Marcha y locomoción",desc:"Trabajo de técnica: elevación rodillas, apoyo antepié, oscilación brazos. Rutina predecible calentamiento→técnica→rodaje.",progresion:"→ Velocidad → Relevos simples → Vallas → Competición local"},
  "Habilidades deportivas específicas":{series:"4",reps:"Variable",material:"Material del deporte",obj:"Cognición motora",desc:"Técnica específica del deporte de interés. Reglas simplificadas con apoyo visual. Atletismo, natación, fútbol sala, baloncesto.",progresion:"→ Reglas completas → Con compañero → Entrenamiento real → Competición"},
  "Trabajo aeróbico con autorregistro RPE":{series:"1",reps:"20-30 min",material:"Pulsómetro, escala RPE",obj:"Fuerza y resistencia muscular",desc:"Actividad aeróbica continua con autorregistro del esfuerzo percibido cada 5 minutos. Aprender a gestionar la intensidad.",progresion:"→ Mayor duración → Intensidad objetivo → Variación → Entorno exterior"},
  "Deporte adaptado en grupo pequeño":{series:"1",reps:"45 min sesión",material:"Material deportivo",obj:"Cognición motora",desc:"Participación en actividad deportiva grupal adaptada. Fútbol sala, baloncesto, balonmano con reglas simplificadas.",progresion:"→ Grupos más grandes → Normas más complejas → Competición adaptada"},
  "Fútbol sala reglas simplificadas":{series:"1",reps:"30 min",material:"Balón, porterías",obj:"Cognición motora",desc:"Fútbol sala con reglas visualizadas y simplificadas. Equipos mixtos. Énfasis en participación y disfrute sobre el resultado.",progresion:"→ Reglas completas → Campeonato interno → Liga adaptada"},
  "Natación técnica adaptada":{series:"1",reps:"30-45 min",material:"Piscina, flotadores opcionales",obj:"Fuerza y resistencia muscular",desc:"Técnica de natación adaptada. Crol o braza según capacidad. Input vestibular, propioceptivo y resistencia en descarga.",progresion:"→ Sin flotadores → Mayor distancia → Técnica → Competición"},
  "Juegos cooperativos estructurados":{series:"1",reps:"30 min",material:"Material variable",obj:"Cognición motora",desc:"Juegos donde la victoria requiere colaboración. Paracaídas, circuito por parejas, construcción conjunta. Sin competición.",progresion:"→ Grupos más grandes → Normas más complejas → Juegos semiestructurados"},
  "Movilizaciones pasivas ROM completo":{series:"2",reps:"10 c/articulación",material:"Camilla",obj:"Regulación tónica",desc:"Movilización pasiva de hombro, codo, muñeca, cadera, rodilla y tobillo. Rango completo sin dolor. Prevención rigideces.",progresion:"→ Activo-asistida → Activa → Con resistencia → Funcional integrada"},
  "Posicionamiento antiespasmódico cama":{series:"1",reps:"30-60 min c/posición",material:"Cuñas, cojines, férulas",obj:"Regulación tónica",desc:"Posicionamiento en cama: decúbito lateral sobre lado afecto/sano con cuñas. Prevenir UPP, controlar espasticidad, mantener ROM.",progresion:"→ Sedestación con apoyo → Bipedestación standing → Posicionamiento en silla"},
  "TENS manejo dolor y tono":{series:"1",reps:"20 min",material:"Electroestimulador TENS",obj:"Regulación tónica",desc:"TENS alta frecuencia 80-100Hz en zona de espasticidad. Electrodos en vientre muscular antagonista. Umbral sensitivo.",progresion:"→ TENS + movilización → EMS activación activa → FES marcha o prensión"},
  "Volteo y transferencias en camilla":{series:"4",reps:"6 c/lado",material:"Camilla",obj:"Marcha y locomoción",desc:"Volteo asistido de supino a lateral y sedestación. Cabeza → hombros → tronco. Facilitar patrón normal.",progresion:"→ Asistencia reducida → Autónomo → Sedestación → Transferencia a silla"},
  "Transferencia silla-cama tabla deslizante":{series:"4",reps:"4 transferencias",material:"Tabla deslizante, silla",obj:"Marcha y locomoción",desc:"Transferencia lateral con tabla. Alinear superficies, deslizar peso, recolocar tabla. Mínima asistencia física.",progresion:"→ Sin tabla → Bipedestación asistida → Libre → Diferentes alturas"},
  "Estimulación sensorial MMSS afecto":{series:"2",reps:"10 min",material:"Texturas, vibrador, hielo",obj:"Integración sensorial",desc:"Estimulación táctil, propioceptiva y térmica de extremidad afecta. Preparación SN para activación motora.",progresion:"→ Movilización activo-asistida → Actividad funcional → CIMT → AVD autónoma"},
  "Ejercicios MMSS en mesa lisa":{series:"3",reps:"10",material:"Mesa, tabla lisa",obj:"Coordinación motora fina",desc:"Deslizamiento de brazo afecto sobre superficie lisa en diferentes direcciones. Asistencia proximal decreciente.",progresion:"→ Elevación contra gravedad → Alcanzar objetos → Manipulación básica → Prensión"},
  "Activación muscular isométrica":{series:"3",reps:"10s x8",material:"Colchoneta",obj:"Fuerza y resistencia muscular",desc:"Contracciones isométricas de cuádriceps, glúteos, abdominales y pectorales. Sin movimiento articular. Mantenimiento muscular en fases iniciales.",progresion:"→ Más tiempo → Con resistencia → Isotónico → Funcional"},
  "Fisioterapia respiratoria básica":{series:"3",reps:"10 min",material:"Incentivador volumétrico",obj:"Fuerza y resistencia muscular",desc:"Técnicas de higiene bronquial, expansión torácica y ejercicios respiratorios. Prevención complicaciones pulmonares en paciente encamado.",progresion:"→ Bipedestación → Con ejercicio → Técnicas activas → Aeróbico"},
  "Estimulación oral-facial si procede":{series:"2",reps:"10 min",material:"Depresor, hielo, texturas orales",obj:"Coordinación motora fina",desc:"Estimulación sensorial perioral y lingual. Facilitación del cierre labial y control de babeo. Coordinado con logopedia.",progresion:"→ Masticación guiada → Deglución controlada → Fonación básica"},
  "Técnicas inhibición Bobath":{series:"3",reps:"5 min/zona",material:"Colchoneta, rodillo",obj:"Regulación tónica",desc:"Movilización en patrones inhibidores de espasticidad. Puntos clave: cintura escapular, pelvis, tobillo. Lento y sostenido.",progresion:"→ Integrar en actividad funcional → Autoestiramiento → Grupo Bobath"},
  "Marcha en barras paralelas DCA":{series:"4",reps:"10m x3",material:"Barras paralelas, espejo",obj:"Marcha y locomoción",desc:"Marcha con apoyo bilateral. Corrección de patrón en espejo: fase de apoyo, despegue talón, extensión cadera.",progresion:"→ Apoyo unilateral → Andador → Bastón → Libre → Terreno irregular"},
  "Marcha con andador en circuito":{series:"3",reps:"50m",material:"Andador, circuito señalizado",obj:"Marcha y locomoción",desc:"Marcha con andador en circuito con giros, puerta, rampa y suelo irregular. Preparación para entorno real.",progresion:"→ Bastón → Bastón en escaleras → Libre en interior → Exterior"},
  "Cinta soporte parcial de peso":{series:"3",reps:"10 min",material:"Cinta con arnés soporte",obj:"Marcha y locomoción",desc:"Marcha en cinta con soporte parcial 30-50% peso corporal. Alta repetición del patrón correcto. Velocidad progresiva.",progresion:"→ Reducir soporte → Mayor velocidad → Sin soporte → Inclinación"},
  "CIMT restricción mano sana":{series:"1",reps:"2-3h sesión intensiva",material:"CIMT mitt, objetos cotidianos",obj:"Coordinación motora fina",desc:"Mitt en mano sana. Uso intensivo de mano parética: mover objetos, apilar, transferir agua, botones, cubiertos.",progresion:"→ Objetos más pequeños → Velocidad → Doble tarea → AVD real"},
  "Realidad virtual coordinación MMSS":{series:"3",reps:"15 min",material:"Meta Quest 3 u otro VR",obj:"Coordinación motora fina",desc:"Apps de RV para alcanzar, agarrar y manipular objetos virtuales. Alta motivación, feedback inmediato, progresión automática.",progresion:"→ Mayor dificultad → Velocidad → Objetos más pequeños → Con fisio convencional"},
  "Control tronco sedestación sin respaldo":{series:"3",reps:"2 min",material:"Camilla",obj:"Equilibrio y control postural",desc:"Sedestación en borde de camilla sin apoyo de MMSS. Fisio facilita desde pelvis. Reacciones de equilibrio activas.",progresion:"→ Movimiento MMSS → Perturbaciones → Inestable → Tarea dual"},
  "FES pie caído":{series:"3",reps:"10 min",material:"Electroestimulador FES",obj:"Marcha y locomoción",desc:"Electroestimulación funcional de tibial anterior durante la marcha. Sincronizada con fase de balanceo. Corrección pie caído.",progresion:"→ Mayor intensidad → Con marcha → Sin FES con corrección mantenida"},
  "Alcance y prensión objetos cotidianos":{series:"3",reps:"15",material:"Objetos cotidianos variados",obj:"Coordinación motora fina",desc:"Alcanzar y coger objetos de diferentes tamaños, pesos y posiciones. Simulación de tareas domésticas reales.",progresion:"→ Objetos más pequeños → Mayor distancia → Bilateral → Bajo tiempo"},
  "Bipedestación carga progresiva afecto":{series:"4",reps:"45s",material:"Paralelas o barra, báscula",obj:"Equilibrio y control postural",desc:"Bipedestación entre paralelas. Desplazar carga hacia lado afecto progresivamente. Corrección asimetría en espejo.",progresion:"→ Sin apoyo → Carga igual → Monopodal afecto → Desequilibrios activos"},
  "Marcha exterior con obstáculos reales":{series:"1",reps:"20-30 min",material:"Entorno real",obj:"Marcha y locomoción",desc:"Marcha en entorno comunitario: irregularidades, bordillos, cruces, escaleras. Supervisión decreciente.",progresion:"→ Solo con supervisión → Solo con móvil → Autónomo → Transporte público"},
  "Plataforma equilibrio biofeedback":{series:"3",reps:"10 ejercicios",material:"Plataforma con pantalla",obj:"Equilibrio y control postural",desc:"Ejercicios de control de COG con feedback visual en tiempo real. Simetría de carga, oscilación, seguimiento de diana.",progresion:"→ Mayor dificultad → Ojos cerrados → Doble tarea → Perturbaciones"},
  "AVD completas análisis funcional":{series:"1",reps:"Sesión funcional",material:"Cocina/baño/dormitorio",obj:"Autonomía en AVD",desc:"Análisis y entrenamiento en AVD complejas: cocinar, ducharse, vestirse, manejar dinero. Identificar barreras y estrategias.",progresion:"→ Eliminar adaptaciones → Nuevas AVD → Autonomía domicilio completa"},
  "Circuito funcional alta complejidad":{series:"3",reps:"4 ejercicios x 12",material:"Material variable",obj:"Cognición motora",desc:"Circuito que combina fuerza, equilibrio, coordinación y tarea cognitiva simultánea. Alta demanda del SNC.",progresion:"→ Mayor dificultad → Menos descanso → Tiempo → Entorno exterior"},
  "Doble tarea cognitivo-motora avanzada":{series:"4",reps:"20m",material:"Ninguno",obj:"Cognición motora",desc:"Marcha con tarea cognitiva compleja: cálculo mental, narración o tarea de atención dividida. Máxima demanda dual.",progresion:"→ Tarea más compleja → Terreno irregular → Velocidad → Imprevistos"},
  "Marcha doble tarea + objeto en mano":{series:"3",reps:"20m",material:"Bandeja, vaso agua",obj:"Cognición motora",desc:"Marcha con objeto en mano (bandeja con vaso de agua) + tarea cognitiva verbal. Simulación real de AVD.",progresion:"→ Objeto más inestable → Terreno irregular → Exterior → Imprevistos"},
  "Reintegración laboral simulada":{series:"1",reps:"45 min",material:"Material del trabajo del paciente",obj:"Autonomía en AVD",desc:"Simulación de tareas laborales: teclado, escritura, manipulación objetos específicos, comunicación. Adaptaciones ergonómicas.",progresion:"→ Jornada parcial → Jornada completa → Trabajo real con apoyo → Autónomo"},
  "Estiramiento cadena posterior pasivo":{series:"3",reps:"45s c/posición",material:"Colchoneta, cuña",obj:"Regulación tónica",desc:"Elongación pasiva de isquiotibiales, tríceps sural y cadena posterior. Reducción tono espástico previo al trabajo activo.",progresion:"→ Activo-asistido → Autoestiramiento → Órtesis de estiramiento → En calentamiento"},
  "Standing terapéutico frame":{series:"1",reps:"30-45 min",material:"Standing frame o plano inclinado",obj:"Regulación tónica",desc:"Carga de peso en bipedestación asistida. Prevención osteoporosis, control espasticidad extensora. Actividades MMSS durante standing.",progresion:"→ Más tiempo → Reducir soporte → Bipedestación en paralelas → Libre"},
  "Hidroterapia 34-35°C":{series:"1",reps:"30-45 min sesión",material:"Piscina terapéutica caliente",obj:"Regulación tónica",desc:"Flotación, movilizaciones en descarga, inhibición tónica por calor. Trabajo de movimiento activo sin vencer gravedad.",progresion:"→ Actividades acuáticas → Natación asistida → Natación adaptada autónoma"},
  "Control cabeza en pelota Bobath":{series:"3",reps:"3 min",material:"Pelota Bobath grande",obj:"Equilibrio y control postural",desc:"Sedestación sobre pelota grande. Facilitar enderezamiento de cabeza y control de tronco. Movimientos lentos desde pelvis.",progresion:"→ Pelota pequeña → Superficie plana → Inestabilidad progresiva → Tarea MMSS"},
  "Arrastre homolateral y cruzado":{series:"3",reps:"5m",material:"Colchoneta",obj:"Cognición motora",desc:"Arrastre prono: primero homolateral (misma mano y rodilla), luego patrón cruzado. Activación cortical bilateral.",progresion:"→ Gateo cuadrúpedo → Sobre rodillas → Semiarrodillado → Bipedestación"},
  "Movilizaciones ROM articular":{series:"2",reps:"10 c/articulación",material:"Camilla",obj:"Regulación tónica",desc:"Movilización pasiva completa en rangos fisiológicos. Prevención contracturas y deformidades secundarias en PC.",progresion:"→ Activo-asistida → Activa → Con resistencia mínima → Funcional"},
  "Posicionamiento anti-deformidad":{series:"1",reps:"30-60 min c/posición",material:"Cuñas, ortesis, cojines",obj:"Regulación tónica",desc:"Posicionamiento preventivo: caderas en abducción, tobillos a 90°, MMSS en extensión. Prevención de deformidades fijas.",progresion:"→ Tiempo progresivo → Integrar con actividad → Posicionamiento en silla"},
  "Activación voluntaria selectiva":{series:"3",reps:"10",material:"Colchoneta, retroalimentación",obj:"Fuerza y resistencia muscular",desc:"Contracciones voluntarias selectivas de grupos musculares específicos. Disociación de movimiento en PC espástica.",progresion:"→ Con resistencia → Velocidad → Funcional → Integrado en marcha"},
  "Estimulación vibratoria antagonistas":{series:"3",reps:"5 min/grupo",material:"Vibrador terapéutico",obj:"Regulación tónica",desc:"Vibración en músculos antagonistas al patrón espástico: tibial anterior, extensores muñeca, abductores cadera. Inhibición recíproca.",progresion:"→ Con movimiento activo → Bilateral → Funcional integrada"},
  "Fisioterapia respiratoria PC":{series:"2",reps:"10 min",material:"Incentivador, pelota",obj:"Fuerza y resistencia muscular",desc:"Técnicas de higiene bronquial y expansión torácica adaptadas a PC. Posiciones de drenaje, percusión y vibración.",progresion:"→ Técnicas activas → Con ejercicio → Bipedestación → Deporte"},
  "Marcha en barras paralelas PC":{series:"4",reps:"10m x4",material:"Barras paralelas, espejo",obj:"Marcha y locomoción",desc:"Marcha con apoyo. Corrección patrón en tijera, marcha punta de pie, recurvatum. Uso de espejo y feedback.",progresion:"→ Andador → Bastón → Un bastón → Libre → Escaleras → Exterior"},
  "Cinta soporte parcial Lokomat":{series:"3",reps:"15 min",material:"Cinta con arnés / Lokomat",obj:"Marcha y locomoción",desc:"Entrenamiento patrón marcha en descarga parcial. Alta repetición del patrón correcto. Neuroplasticidad. Feedback visual.",progresion:"→ Reducir soporte → Velocidad → Sin soporte → Entorno real"},
  "Fortalecimiento antagonistas banda":{series:"3",reps:"12",material:"Banda elástica",obj:"Fuerza y resistencia muscular",desc:"Fortalecimiento de tibial anterior, glúteo medio y extensores de muñeca. Ejercicio lento y controlado contra espasticidad.",progresion:"→ Mayor resistencia → Velocidad → Cadena cinética → Funcional"},
  "Hipoterapia monta terapéutica":{series:"1",reps:"45 min sesión",material:"Caballo, cincha, casco",obj:"Equilibrio y control postural",desc:"Monta terapéutica. 110 impulsos/minuto del caballo activan tronco y pelvis. Mejora control postural, tono y comunicación.",progresion:"→ Sin silla → Posiciones variadas → MMSS durante monta → Equitación adaptada"},
  "CIMT hemiparesia espástica":{series:"1",reps:"2h sesión",material:"CIMT mitt, objetos funcionales",obj:"Coordinación motora fina",desc:"Restricción extremidad sana. Tareas funcionales intensivas con miembro parético. Alta repetición para neuroplasticidad.",progresion:"→ Objetos más complejos → Velocidad → Doble tarea → AVD real"},
  "Taping neuromuscular corrección":{series:"1",reps:"3-5 días",material:"Kinesiotape",obj:"Regulación tónica",desc:"Aplicación de taping para corrección postural dinámica y modulación del tono. Tobillo, rodilla o hombro según necesidad.",progresion:"→ Combinado con ejercicio → Reducir dependencia → Sin taping"},
  "Escaleras con apoyo PC":{series:"3",reps:"3 subidas",material:"Escalera, pasamanos",obj:"Marcha y locomoción",desc:"Escalera paso a paso con apoyo bilateral inicial. Corrección de patrón específico según tipo de PC (espástica, atáxica).",progresion:"→ Apoyo unilateral → Sin apoyo → Paso alternante → Con objeto"},
  "Realidad virtual MMSS y equilibrio":{series:"3",reps:"15 min",material:"Meta Quest 3 u otro VR",obj:"Cognición motora",desc:"Apps de RV para alcanzar, equilibrio y doble tarea. Alta motivación, feedback inmediato. Complemento fisio convencional.",progresion:"→ Dificultad progresiva → Tiempo → Doble tarea → Integración funcional"},
  "Deporte adaptado boccia / atletismo":{series:"Variable",reps:"Sesión deportiva",material:"Material del deporte",obj:"Fuerza y resistencia muscular",desc:"Entrenamiento específico en boccia (GMFCS IV-V) o atletismo adaptado (I-III). Técnica, táctica y competición.",progresion:"→ Local → Regional → Nacional → Paralímpico si procede"},
  "Marcha comunitaria exterior":{series:"1",reps:"20-30 min",material:"Entorno real, ortesis/ayuda si procede",obj:"Marcha y locomoción",desc:"Marcha en entorno comunitario real con ayudas técnicas si necesario. Gestión de irregularidades, cruces, transporte.",progresion:"→ Reducir ayudas → Mayor distancia → Transporte público → Autónomo"},
  "Fortalecimiento excéntrico prevención":{series:"3",reps:"10 lentos",material:"Banda, pesas",obj:"Fuerza y resistencia muscular",desc:"Contracciones excéntricas en isquiotibiales, gemelos y cuádriceps. Prevención lesiones por sobreuso en atletas con PC.",progresion:"→ Mayor resistencia → Velocidad excéntrica → Pliométrico → Deporte específico"},
  "Periodización deportiva adaptada":{series:"Variable",reps:"Plan mensual",material:"Material deportivo",obj:"Fuerza y resistencia muscular",desc:"Planificación de cargas de entrenamiento según calendario competitivo. Macrociclos, mesociclos y microciclos adaptados.",progresion:"→ Competición local → Regional → Nacional → Juegos Paralímpicos"},
  "Natación adaptada técnica":{series:"1",reps:"30-45 min",material:"Piscina, material natación",obj:"Fuerza y resistencia muscular",desc:"Técnica de crol o braza adaptada según capacidad motora. Sin gravedad: permite movimiento activo en descarga total.",progresion:"→ Sin flotadores → Mayor distancia → Técnica depurada → Competición"},
  "Bicicleta adaptada resistencia":{series:"1",reps:"20-30 min",material:"Bicicleta adaptada",obj:"Fuerza y resistencia muscular",desc:"Pedaleo con adaptaciones según tipo PC. Trabajo aeróbico, fortalecimiento MMII y activación neuromotora.",progresion:"→ Más tiempo → Resistencia → Exterior → Bicicleta convencional si posible"},
  "Trabajo aeróbico intervalos":{series:"6",reps:"30s/90s",material:"Espacio, pulsómetro",obj:"Fuerza y resistencia muscular",desc:"Intervalos de alta intensidad relativa seguidos de recuperación activa. Adaptado a capacidad funcional. Monitorizar FC.",progresion:"→ Ratio 1:2 → 1:1 → Más series → Mayor intensidad"},
};

const PLANTILLAS = {
  "Síndrome de Down":{
    Bajo:["Control cefálico en prono","Puente de glúteos","Marcha en barras paralelas","Circuito sensorial básico"],
    Medio:["Equilibrio bosu bipodal","Marcha con obstáculos","Sentadilla goblet","Ensartado de cuentas"],
    Alto:["Equilibrio monopodal","Marcha doble tarea","HIIT 20-40","Circuito fuerza funcional"],
  },
  "TEA":{
    Bajo:["Protocolo Wilbarger","Columpio terapéutico lineal","Manta de peso","Respiración diafragmática"],
    Medio:["Carrera circuito cerrado","Circuito pictográfico","Yoga adaptado","Lanzamiento estructurado"],
    Alto:["Circuito sensorial complejo","Atletismo técnica de carrera","Deporte adaptado en grupo"],
  },
  "Daño Cerebral Adquirido":{
    Bajo:["Movilizaciones pasivas ROM","Posicionamiento antiespasmódico","TENS manejo tono","Estimulación sensorial MMSS"],
    Medio:["Técnicas inhibición Bobath","Marcha barras paralelas","CIMT restricción mano sana","Realidad virtual MMSS"],
    Alto:["Marcha exterior con obstáculos","Plataforma equilibrio biofeedback","AVD completas análisis funcional"],
  },
  "Parálisis Cerebral":{
    Bajo:["Estiramiento cadena posterior","Standing terapéutico","Control cabeza Bobath pelota","Arrastre patrón cruzado"],
    Medio:["Marcha barras paralelas PC","Fortalecimiento antagonistas","Hipoterapia monta terapéutica"],
    Alto:["Deporte adaptado boccia/atletismo","Fortalecimiento excéntrico prevención","Realidad virtual MMSS PC"],
  },
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2,9);
const hoy = () => new Date().toLocaleDateString("es-ES");
const horaActual = () => new Date().toLocaleTimeString("es-ES",{hour:"2-digit",minute:"2-digit"});
const fmtDur = (s) => `${Math.floor(s/60)}min ${s%60}s`;
const rpeData = (v) => RPE_NIVELES.find(r=>r.val===v);

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("home");
  const [patients, setPatients] = useState((() => {
    try {
      const saved = localStorage.getItem('neurox_patients');
      return saved ? JSON.parse(saved) : [
    {id:"p1",nombre:"Alejandro M.",edad:24,diagnostico:"Síndrome de Down",nivel:"Medio",creado:"15/04/2026",notas:"Hipotonía marcada. Le gusta la música.",sesiones:[],protocolos:[],objetivos:[]},
    {id:"p2",nombre:"Sara V.",edad:31,diagnostico:"TEA",nivel:"Alto",creado:"02/05/2026",notas:"Hipersensibilidad táctil. Buena motivación.",sesiones:[],protocolos:[],objetivos:[]},
    {id:"p3",nombre:"Manuel R.",edad:45,diagnostico:"Daño Cerebral Adquirido",nivel:"Medio",creado:"10/05/2026",notas:"ACV isquémico hace 6 meses. Hemiparesia derecha.",sesiones:[],protocolos:[],objetivos:[]},
  ];
    } catch(e) { return [
    {id:"p1",nombre:"Alejandro M.",edad:24,diagnostico:"Síndrome de Down",nivel:"Medio",creado:"15/04/2026",notas:"Hipotonía marcada. Le gusta la música.",sesiones:[],protocolos:[],objetivos:[]},
    {id:"p2",nombre:"Sara V.",edad:31,diagnostico:"TEA",nivel:"Alto",creado:"02/05/2026",notas:"Hipersensibilidad táctil. Buena motivación.",sesiones:[],protocolos:[],objetivos:[]},
    {id:"p3",nombre:"Manuel R.",edad:45,diagnostico:"Daño Cerebral Adquirido",nivel:"Medio",creado:"10/05/2026",notas:"ACV isquémico hace 6 meses. Hemiparesia derecha.",sesiones:[],protocolos:[],objetivos:[]},
  ]; }
  })());;
  const [selPat, setSelPat] = useState(null);
  const [selSesion, setSelSesion] = useState(null);
  const [rpeModal, setRpeModal] = useState({active:false,cb:null,title:""});
  const [printData, setPrintData] = useState(null);
  // Confirm modal
  const [confirmModal, setConfirmModal] = useState({open:false,msg:"",onOk:null});
  const showConfirm = (msg, onOk) => setConfirmModal({open:true,msg,onOk});
  const closeConfirm = () => setConfirmModal({open:false,msg:"",onOk:null});

  // Bimodal state
  const [selSigno, setSelSigno] = useState(null);
  const [favs, setFavs] = useState(() => {
    try { const s = localStorage.getItem('neurox_favs'); return s ? JSON.parse(s) : []; }
    catch(e) { return []; }
  });
  const [bimodalRpe, setBimodalRpe] = useState(false);
  const [bimodalQuery, setBimodalQuery] = useState("");
  const [bimodalResults, setBimodalResults] = useState([]);
  const [bimodalSearching, setBimodalSearching] = useState(false);
  const toggleFav = (palabra) => setFavs(f => f.includes(palabra) ? f.filter(x => x !== palabra) : [...f, palabra]);

  // Persist to localStorage whenever data changes
  useEffect(() => {
    try { localStorage.setItem('neurox_patients', JSON.stringify(patients)); }
    catch(e) { console.warn('localStorage full:', e); }
  }, [patients]);

  useEffect(() => {
    try { localStorage.setItem('neurox_favs', JSON.stringify(favs)); }
    catch(e) {}
  }, [favs]);

  const getPat = (id) => patients.find(p=>p.id===id);
  const updPat = (id,data) => setPatients(ps=>ps.map(p=>p.id===id?{...p,...data}:p));
  const addSesion = (pid,s) => setPatients(ps=>ps.map(p=>p.id===pid?{...p,sesiones:[...(p.sesiones||[]),s]}:p));
  const addProtocolo = (pid,proto) => setPatients(ps=>ps.map(p=>p.id===pid?{...p,protocolos:[...(p.protocolos||[]),{...proto,id:uid(),fecha:hoy()}]}:p));
  const addPatient = (data) => setPatients(ps=>[...ps,{...data,id:uid(),creado:hoy(),sesiones:[],protocolos:[],objetivos:[]}]);
  const deletePatient = (id) => setPatients(ps => ps.filter(p => p.id !== id));

  const toggleObjetivo = (pid,obj) => {
    const p = getPat(pid);
    const objs = p.objetivos||[];
    const exists = objs.find(o=>o.nombre===obj);
    if(exists) updPat(pid,{objetivos:objs.map(o=>o.nombre===obj?{...o,completado:!o.completado}:o)});
    else updPat(pid,{objetivos:[...objs,{nombre:obj,completado:false,fecha:hoy()}]});
  };

  const openRpe = (title,cb) => setRpeModal({active:true,cb,title});
  const closeRpe = (v) => {if(rpeModal.cb)rpeModal.cb(v);setRpeModal({active:false,cb:null,title:""});};

  if(rpeModal.active) return <RPEScale title={rpeModal.title} onSelect={closeRpe} onClose={()=>setRpeModal({active:false,cb:null,title:""})} />;
  if(printData) return <InformeImprimible data={printData} onClose={()=>setPrintData(null)} />;

  const pat = selPat?getPat(selPat.id):null;

  return(
    <div style={{minHeight:"100vh",background:"#F5F2ED",fontFamily:"'DM Serif Display',serif",color:"#1A1A2E"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');*{box-sizing:border-box;margin:0;padding:0;}::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-thumb{background:#D4C5B0;}@keyframes slideUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}@keyframes fadeIn{from{opacity:0;}to{opacity:1;}}@keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.4;}}.hov{transition:all 0.18s;cursor:pointer;}.hov:hover{transform:translateY(-1px);box-shadow:0 8px 24px rgba(26,26,46,0.1)!important;}.btn{transition:all 0.15s;cursor:pointer;}.btn:hover{opacity:0.88;transform:translateY(-1px);}.chip:hover{border-color:#2D6A4F!important;color:#2D6A4F!important;}`}</style>

      {screen==="home" && <Home patients={patients} onNav={setScreen} onSel={(p)=>{setSelPat(p);setScreen("paciente");}}
        onExport={()=>{
          const data = JSON.stringify({patients, version:"1.0", exportDate: new Date().toISOString()}, null, 2);
          const blob = new Blob([data], {type:"application/json"});
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href=url; a.download="neurox_backup_"+new Date().toLocaleDateString("es-ES").replace(/\//g,"-")+".json";
          a.click(); URL.revokeObjectURL(url);
        }}
        onImport={(e)=>{
          const file = e.target.files[0]; if(!file) return;
          const reader = new FileReader();
          reader.onload = (ev) => {
            try {
              const data = JSON.parse(ev.target.result);
              if(data.patients && Array.isArray(data.patients)) {
                setPatients(data.patients);
                alert("Datos importados: "+data.patients.length+" pacientes");
              }
            } catch(err) { alert("Error al importar: archivo no válido"); }
          };
          reader.readAsText(file);
        }}
      />}
      {screen==="pacientes" && <Pacientes patients={patients} onAdd={addPatient} onSel={(p)=>{setSelPat(p);setScreen("paciente");}} onBack={()=>setScreen("home")} onDelete={(id,nombre)=>showConfirm("¿Eliminar a "+nombre+"? Se borrarán todas sus sesiones y protocolos.",()=>deletePatient(id))} />}
      {screen==="rpe" && <RPEScale title="Escala RPE · Modo Libre" onSelect={(v)=>{alert("RPE: "+v+"/10 "+rpeData(v)?.emoji);setScreen("home");}} onClose={()=>setScreen("home")} />}
      {screen==="paciente" && pat && (
        <PacienteDetalle patient={pat} onBack={()=>setScreen("pacientes")}
          onUpdate={(d)=>updPat(selPat.id,d)}
          onAddProtocolo={(proto)=>addProtocolo(selPat.id,proto)}
          onToggleObj={(obj)=>toggleObjetivo(selPat.id,obj)}
          onIniciarSesion={()=>setScreen("sesion")}
          onVerSesion={(s)=>{setSelSesion(s);setScreen("informe");}}
          onPrintProtocolo={(proto)=>setPrintData({type:"protocolo",proto,patient:pat})}
          onPrintSesion={(s)=>setPrintData({type:"sesion",sesion:s,patient:pat})}
          onOpenRpe={openRpe}
          onDelete={(id)=>showConfirm("¿Eliminar a "+pat.nombre+"? Se borrarán todas sus sesiones y protocolos.",()=>{deletePatient(id);setScreen("pacientes");})}
          onGoFamilias={()=>setScreen("familias")}
          onGoValoraciones={()=>setScreen("valoraciones")}
          onGoAAC={()=>setScreen("bimodal-home")}
          onGoEscalas={()=>setScreen("escalas")}
          onShowConfirm={showConfirm}
        />
      )}
      {screen==="sesion" && pat && (
        <SesionActiva patient={pat}
          onFinish={(s)=>{addSesion(selPat.id,s);setSelSesion(s);setScreen("informe");}}
          onBack={()=>setScreen("paciente")}
          onOpenRpe={openRpe}
        />
      )}
      {screen==="informe" && selSesion && (
        <InformeSesion sesion={selSesion} patient={pat}
          onBack={()=>setScreen("paciente")}
          onPrint={()=>setPrintData({type:"sesion",sesion:selSesion,patient:pat})}
        />
      )}
      {screen==="familias" && pat && (
        <InformeFamilias patient={pat} onBack={()=>setScreen("paciente")}
          onPrint={(d)=>setPrintData({type:"familias",...d,patient:pat})}
        />
      )}
      {screen==="valoraciones" && pat && (
        <Valoraciones patient={pat} onBack={()=>setScreen("paciente")}
          onSave={(vals)=>{updPat(selPat.id,{valoraciones:vals});setScreen("paciente");}}
        />
      )}
      {screen==="escalas" && pat && (
        <EscalasDetalle patient={pat} onBack={()=>setScreen("paciente")} />
      )}
      {screen==="rpe" && (
        <RPEBimodal onClose={()=>setScreen("home")} />
      )}
      {/* ── BIMODAL SCREENS ── */}
      {screen==="bimodal-home" && (
        <BimodalHome onNav={setScreen} onOpenRpe={()=>setBimodalRpe(true)}
          favs={favs} allSignos={todosSignos} onSelSigno={(s)=>{setSelSigno(s);setScreen("bimodal-detalle");}}
          patientContext={selPat?getPat(selPat.id):null}
        />
      )}
      {screen==="bimodal-repositorio" && (
        <Repositorio onBack={()=>setScreen("bimodal-home")}
          onSelSigno={(s)=>{setSelSigno(s);setScreen("bimodal-detalle");}}
          favs={favs} onToggleFav={toggleFav}
        />
      )}
      {screen==="bimodal-buscador" && (
        <Buscador onBack={()=>setScreen("bimodal-home")}
          query={bimodalQuery} setQuery={setBimodalQuery}
          results={bimodalResults} setResults={setBimodalResults}
          searching={bimodalSearching} setSearching={setBimodalSearching}
          localSignos={todosSignos}
          onSelSigno={(s)=>{setSelSigno(s);setScreen("bimodal-detalle");}}
        />
      )}
      {screen==="bimodal-tarjetas" && (
        <TarjetasSesion onBack={()=>setScreen("bimodal-home")}
          patientContext={selPat?getPat(selPat.id):null}
          onSelSigno={(s)=>{setSelSigno(s);setScreen("bimodal-detalle");}}
        />
      )}
      {screen==="bimodal-favoritos" && (
        <Favoritos onBack={()=>setScreen("bimodal-home")}
          favs={favs} allSignos={todosSignos}
          onSelSigno={(s)=>{setSelSigno(s);setScreen("bimodal-detalle");}}
          onToggleFav={toggleFav}
        />
      )}
      {screen==="bimodal-detalle" && selSigno && (
        <DetalleSigno signo={selSigno} onBack={()=>setScreen(screen==="bimodal-detalle"?"bimodal-repositorio":"bimodal-home")}
          isFav={favs.includes(selSigno.palabra)} onToggleFav={()=>toggleFav(selSigno.palabra)}
        />
      )}
      {bimodalRpe && <RPEBimodal onClose={()=>setBimodalRpe(false)} />}
      {confirmModal.open && (
        <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.5)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:"1.5rem"}}>
          <div style={{background:"#fff",borderRadius:16,padding:"2rem",maxWidth:340,width:"100%",boxShadow:"0 20px 60px rgba(0,0,0,0.2)"}}>
            <p style={{fontFamily:"'DM Serif Display'",fontSize:"1.2rem",marginBottom:"0.6rem",color:"#1A1A2E"}}>Confirmar acción</p>
            <p style={{fontFamily:"'DM Sans'",fontSize:"0.85rem",color:"#6B4226",lineHeight:1.6,marginBottom:"1.5rem"}}>{confirmModal.msg}</p>
            <div style={{display:"flex",gap:"0.7rem"}}>
              <button onClick={closeConfirm} style={{flex:1,padding:"0.75rem",background:"#F5F2ED",border:"none",borderRadius:10,color:"#9B8B7A",fontFamily:"'DM Sans'",fontWeight:600,fontSize:"0.85rem",cursor:"pointer"}}>Cancelar</button>
              <button onClick={()=>{confirmModal.onOk();closeConfirm();}} style={{flex:1,padding:"0.75rem",background:"#E74C3C",border:"none",borderRadius:10,color:"#fff",fontFamily:"'DM Sans'",fontWeight:700,fontSize:"0.85rem",cursor:"pointer"}}>Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── HOME ─────────────────────────────────────────────────────────────────────
function Home({patients,onNav,onSel,onExport,onImport}){
  const totalSes = patients.reduce((a,p)=>a+(p.sesiones?.length||0),0);
  const totalProto = patients.reduce((a,p)=>a+(p.protocolos?.length||0),0);
  const sesHoy = patients.reduce((a,p)=>a+(p.sesiones?.filter(s=>s.fecha===hoy()).length||0),0);
  const ultimasSes = patients.flatMap(p=>(p.sesiones||[]).map(s=>({...s,pnombre:p.nombre,pdiag:p.diagnostico,pid:p.id}))).sort((a,b)=>b.timestamp-a.timestamp).slice(0,4);

  return(
    <div style={{maxWidth:720,margin:"0 auto",padding:"2rem 1.2rem",animation:"slideUp 0.5s ease"}}>
      <div style={{marginBottom:"2rem"}}>
        <p style={{fontFamily:"'DM Sans'",fontSize:"0.62rem",letterSpacing:"0.15em",color:"#9B8B7A",textTransform:"uppercase",marginBottom:"0.3rem"}}>NEUROX · v3.0 · Edición Completa</p>
        <h1 style={{fontSize:"clamp(2rem,6vw,3rem)",lineHeight:1.05,marginBottom:"0.3rem"}}>Panel <em style={{color:"#2D6A4F"}}>Clínico</em></h1>
        <p style={{fontFamily:"'DM Sans'",color:"#9B8B7A",fontSize:"0.78rem"}}>Borja Cotanda · Fisioterapeuta Neurológico · ASINDOWN Valencia</p>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"0.5rem",marginBottom:"0.8rem"}}>
        {[{n:patients.length,l:"Pacientes"},{n:totalSes,l:"Sesiones"},{n:totalProto,l:"Protocolos"},{n:sesHoy,l:"Hoy"}].map(s=>(
          <div key={s.l} style={{background:"#fff",borderRadius:10,padding:"0.9rem",textAlign:"center",boxShadow:"0 2px 8px rgba(26,26,46,0.05)"}}>
            <p style={{fontSize:"1.6rem",color:"#2D6A4F",marginBottom:"0.15rem",fontFamily:"'DM Serif Display'"}}>{s.n}</p>
            <p style={{fontFamily:"'DM Sans'",fontSize:"0.58rem",color:"#9B8B7A",letterSpacing:"0.1em",textTransform:"uppercase"}}>{s.l}</p>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:"0.5rem",marginBottom:"1.4rem"}}>
        <button onClick={onExport} style={{flex:1,padding:"0.55rem",background:"#fff",border:"1px solid #E8E0D5",borderRadius:8,color:"#9B8B7A",fontFamily:"'DM Sans'",fontSize:"0.7rem",cursor:"pointer",boxShadow:"0 1px 4px rgba(26,26,46,0.04)"}}>↓ Exportar datos</button>
        <label style={{flex:1,padding:"0.55rem",background:"#fff",border:"1px solid #E8E0D5",borderRadius:8,color:"#9B8B7A",fontFamily:"'DM Sans'",fontSize:"0.7rem",cursor:"pointer",textAlign:"center",boxShadow:"0 1px 4px rgba(26,26,46,0.04)"}}>
          ↑ Importar datos
          <input type="file" accept=".json" onChange={onImport} style={{display:"none"}} />
        </label>
        <div style={{flex:1,padding:"0.55rem",background:"rgba(45,106,79,0.06)",border:"1px solid rgba(45,106,79,0.2)",borderRadius:8,textAlign:"center",boxShadow:"0 1px 4px rgba(26,26,46,0.04)"}}>
          <p style={{fontFamily:"'DM Sans'",fontSize:"0.58rem",color:"#2D6A4F",letterSpacing:"0.06em"}}>GUARDADO</p>
          <p style={{fontFamily:"'DM Sans'",fontSize:"0.6rem",color:"#9B8B7A"}}>Autom. local</p>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.6rem",marginBottom:"1.2rem"}}>
        {[
          {label:"Pacientes",desc:"Perfiles, sesiones y protocolos",icon:"◎",screen:"pacientes",color:"#1A1A2E"},
          {label:"Escala RPE-DI",desc:"Esfuerzo percibido adaptado",icon:"◈",screen:"rpe",color:"#2D6A4F"},
        ].map(m=>(
          <div key={m.screen} onClick={()=>onNav(m.screen)} className="hov" style={{background:"#fff",borderRadius:12,padding:"1.2rem",boxShadow:"0 2px 10px rgba(26,26,46,0.05)"}}>
            <div style={{fontSize:"1.1rem",color:m.color,marginBottom:"0.6rem"}}>{m.icon}</div>
            <h3 style={{fontSize:"0.95rem",marginBottom:"0.2rem"}}>{m.label}</h3>
            <p style={{fontFamily:"'DM Sans'",fontSize:"0.7rem",color:"#9B8B7A",lineHeight:1.4}}>{m.desc}</p>
          </div>
        ))}
      </div>

      <div style={{background:"#fff",borderRadius:12,padding:"1.2rem",boxShadow:"0 2px 8px rgba(26,26,46,0.05)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.9rem"}}>
          <h3 style={{fontSize:"0.95rem"}}>Actividad reciente</h3>
          <button onClick={()=>onNav("pacientes")} style={{fontFamily:"'DM Sans'",fontSize:"0.7rem",color:"#2D6A4F",background:"transparent",border:"none",cursor:"pointer"}}>Ver pacientes</button>
        </div>
        {ultimasSes.length===0?(
          <p style={{fontFamily:"'DM Sans'",color:"#CCC",fontSize:"0.78rem",textAlign:"center",padding:"1.5rem 0"}}>Sin actividad. Selecciona un paciente para iniciar una sesión.</p>
        ):ultimasSes.map(s=>(
          <div key={s.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0.6rem 0",borderBottom:"1px solid #F5F2ED"}}>
            <div>
              <p style={{fontFamily:"'DM Sans'",fontWeight:600,fontSize:"0.83rem",marginBottom:"0.1rem"}}>{s.pnombre}</p>
              <p style={{fontFamily:"'DM Sans'",fontSize:"0.68rem",color:"#9B8B7A"}}>{s.fecha} · {s.hora} · {fmtDur(s.duracion)} · {s.ejercicios?.length||0} ejercicios</p>
            </div>
            <Tag label={s.rpeFinal?`RPE ${s.rpeFinal}/10`:"—"} color={s.rpeFinal>=7?"#E67E22":s.rpeFinal>=4?"#2D6A4F":"#9B8B7A"} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PACIENTES ────────────────────────────────────────────────────────────────
function Pacientes({patients,onAdd,onSel,onBack,onDelete}){
  const [adding,setAdding]=useState(false);
  const [form,setForm]=useState({nombre:"",edad:"",diagnostico:"",nivel:"",notas:""});
  const [search,setSearch]=useState("");
  const fil=patients.filter(p=>p.nombre.toLowerCase().includes(search.toLowerCase())||p.diagnostico.toLowerCase().includes(search.toLowerCase()));
  const handleAdd=()=>{if(!form.nombre||!form.edad||!form.diagnostico||!form.nivel)return;onAdd(form);setForm({nombre:"",edad:"",diagnostico:"",nivel:"",notas:""});setAdding(false);};
  return(
    <div style={{maxWidth:720,margin:"0 auto",padding:"2rem 1.2rem",animation:"slideUp 0.4s ease"}}>
      <Volver onClick={onBack}/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:"1.1rem"}}>
        <h2 style={{fontSize:"1.8rem"}}>Pacientes</h2>
        <button onClick={()=>setAdding(true)} className="btn" style={{padding:"0.5rem 1rem",background:"#2D6A4F",border:"none",borderRadius:8,color:"#fff",fontFamily:"'DM Sans'",fontSize:"0.78rem",fontWeight:600}}>+ Nuevo</button>
      </div>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar..." style={IS}/>
      {adding&&(
        <div style={{background:"#fff",borderRadius:12,padding:"1.3rem",boxShadow:"0 4px 20px rgba(26,26,46,0.1)",marginBottom:"1rem",animation:"fadeIn 0.3s ease"}}>
          <h4 style={{fontSize:"1rem",marginBottom:"0.9rem"}}>Nuevo Paciente</h4>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.6rem",marginBottom:"0.6rem"}}>
            <F label="Nombre / ID"><In value={form.nombre} onChange={v=>setForm(f=>({...f,nombre:v}))} placeholder="Nombre o código"/></F>
            <F label="Edad"><In value={form.edad} onChange={v=>setForm(f=>({...f,edad:v}))} placeholder="Años" type="number"/></F>
          </div>
          <F label="Diagnóstico"><div style={{display:"flex",flexWrap:"wrap",gap:"0.4rem",marginTop:"0.3rem"}}>{DIAGNOSTICOS.map(d=><Chip key={d} label={d} sel={form.diagnostico===d} onSel={()=>setForm(f=>({...f,diagnostico:d}))}/>)}</div></F>
          <F label="Nivel funcional"><div style={{display:"flex",gap:"0.4rem",marginTop:"0.3rem"}}>{NIVELES.map(n=><Chip key={n} label={n} sel={form.nivel===n} onSel={()=>setForm(f=>({...f,nivel:n}))}/>)}</div></F>
          <F label="Observaciones (opcional)"><textarea value={form.notas} onChange={e=>setForm(f=>({...f,notas:e.target.value}))} rows={2} placeholder="Notas clínicas..." style={{...IS,resize:"vertical",width:"100%"}}/></F>
          <div style={{display:"flex",gap:"0.5rem",marginTop:"0.8rem"}}>
            <button onClick={()=>setAdding(false)} style={{flex:1,padding:"0.6rem",background:"transparent",border:"1px solid #E8E0D5",borderRadius:8,color:"#9B8B7A",fontFamily:"'DM Sans'",cursor:"pointer",fontSize:"0.78rem"}}>Cancelar</button>
            <button onClick={handleAdd} className="btn" style={{flex:2,padding:"0.6rem",background:"#2D6A4F",border:"none",borderRadius:8,color:"#fff",fontFamily:"'DM Sans'",fontWeight:600,fontSize:"0.8rem"}}>Crear paciente</button>
          </div>
        </div>
      )}
      <div style={{display:"flex",flexDirection:"column",gap:"0.5rem"}}>
        {fil.map(p=>(
          <div key={p.id} onClick={()=>onSel(p)} className="hov" style={{background:"#fff",borderRadius:10,padding:"0.95rem 1.1rem",boxShadow:"0 2px 8px rgba(26,26,46,0.04)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <p style={{fontFamily:"'DM Sans'",fontWeight:600,fontSize:"0.88rem",marginBottom:"0.15rem"}}>{p.nombre}</p>
              <p style={{fontFamily:"'DM Sans'",fontSize:"0.68rem",color:"#9B8B7A"}}>{p.diagnostico} · {p.edad} años · {p.sesiones?.length||0} ses · {p.protocolos?.length||0} proto</p>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>
              <Tag label={p.nivel} color={p.nivel==="Alto"?"#2D6A4F":p.nivel==="Medio"?"#6B4226":"#555"}/>
              <button onClick={e=>{e.stopPropagation();onDelete(p.id,p.nombre);}} style={{padding:"0.3rem 0.5rem",background:"transparent",border:"1px solid rgba(231,76,60,0.3)",borderRadius:6,color:"#E74C3C",fontSize:"0.7rem",cursor:"pointer"}}>×</button>
              <span style={{color:"#CCC"}}>›</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PACIENTE DETALLE ─────────────────────────────────────────────────────────
function PacienteDetalle({patient:p,onBack,onUpdate,onAddProtocolo,onToggleObj,onIniciarSesion,onVerSesion,onPrintProtocolo,onPrintSesion,onOpenRpe,onDelete,onGoFamilias,onGoValoraciones,onGoAAC,onGoEscalas}){
  const [tab,setTab]=useState("sesiones");
  const [editNotes,setEditNotes]=useState(false);
  const [notes,setNotes]=useState(p.notas||"");
  const [genObjs,setGenObjs]=useState([]);
  const [generating,setGenerating]=useState(false);
  const sesiones=[...(p.sesiones||[])].reverse();
  const proto=PROTOCOLOS[p.diagnostico]?.[p.nivel];
  const catalogo=EJERCICIOS_CATALOGO[p.diagnostico]?.[p.nivel]||[];
  const escalas=ESCALAS[p.diagnostico]||[];
  const objetivos=p.objetivos||[];

  const handleGenProto=()=>{
    if(!proto||genObjs.length===0)return;
    setGenerating(true);
    setTimeout(()=>{
      onAddProtocolo({diagnostico:p.diagnostico,nivel:p.nivel,objetivos:genObjs,...proto,escalas});
      setGenerating(false);setGenObjs([]);setTab("protocolos");
    },600);
  };

  const avgRpe=sesiones.filter(s=>s.rpeFinal).length>0?(sesiones.filter(s=>s.rpeFinal).reduce((a,s)=>a+s.rpeFinal,0)/sesiones.filter(s=>s.rpeFinal).length).toFixed(1):"—";

  return(
    <div style={{maxWidth:720,margin:"0 auto",padding:"2rem 1.2rem",animation:"slideUp 0.4s ease"}}>
      <Volver onClick={onBack}/>
      <div style={{background:"#fff",borderRadius:14,padding:"1.4rem",boxShadow:"0 2px 14px rgba(26,26,46,0.07)",marginBottom:"1rem"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"0.8rem"}}>
          <div>
            <h2 style={{fontSize:"1.6rem",marginBottom:"0.2rem"}}>{p.nombre}</h2>
            <p style={{fontFamily:"'DM Sans'",fontSize:"0.73rem",color:"#9B8B7A"}}>{p.edad} años · {p.diagnostico} · Nivel {p.nivel}</p>
          </div>
          <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:"0.4rem"}}>
            <Tag label={p.nivel} color={p.nivel==="Alto"?"#2D6A4F":p.nivel==="Medio"?"#6B4226":"#555"} large/>
          </div>
        </div>
        <div style={{paddingTop:"0.8rem",borderTop:"1px solid #F0EBE3"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.3rem"}}>
            <p style={{fontFamily:"'DM Sans'",fontSize:"0.6rem",color:"#9B8B7A",letterSpacing:"0.1em",textTransform:"uppercase"}}>Observaciones clínicas</p>
            <button onClick={()=>{if(editNotes)onUpdate({notas:notes});setEditNotes(!editNotes);}} style={{fontFamily:"'DM Sans'",fontSize:"0.68rem",color:"#2D6A4F",background:"transparent",border:"none",cursor:"pointer"}}>{editNotes?"Guardar":"Editar"}</button>
          </div>
          {editNotes?<textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={2} style={{...IS,width:"100%",resize:"vertical"}}/>:<p style={{fontFamily:"'DM Sans'",fontSize:"0.8rem",color:p.notas?"#1A1A2E":"#CCC",lineHeight:1.5}}>{p.notas||"Sin observaciones"}</p>}
        </div>
      </div>

      <div style={{display:"flex",gap:"0.5rem",marginBottom:"0.6rem"}}>
        <button onClick={onIniciarSesion} className="btn" style={{flex:3,padding:"0.9rem",background:"#2D6A4F",border:"none",borderRadius:10,color:"#fff",fontFamily:"'DM Sans'",fontWeight:700,fontSize:"0.9rem"}}>▶ Iniciar sesión</button>
        <button onClick={onGoFamilias} className="btn" style={{flex:1,padding:"0.9rem",background:"#6B4226",border:"none",borderRadius:10,color:"#fff",fontFamily:"'DM Sans'",fontWeight:600,fontSize:"0.72rem",textAlign:"center",lineHeight:1.3}}>Informe<br/>Familia</button>
        <button onClick={onGoValoraciones} className="btn" style={{flex:1,padding:"0.9rem",background:"#1A1A2E",border:"none",borderRadius:10,color:"#fff",fontFamily:"'DM Sans'",fontWeight:600,fontSize:"0.72rem",textAlign:"center",lineHeight:1.3}}>Valo-<br/>raciones</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:"0.4rem",marginBottom:"0.6rem"}}>
        {[
          {label:"AAC",sub:"Bimodal",icon:"◈",color:"#2D6A4F",bg:"rgba(45,106,79,0.07)",fn:onGoAAC},
          {label:"Valorac.",sub:"Escalas",icon:"◎",color:"#1A1A2E",bg:"rgba(26,26,46,0.05)",fn:onGoValoraciones},
          {label:"Escalas",sub:"Clínicas",icon:"◇",color:"#6B4226",bg:"rgba(107,66,38,0.06)",fn:onGoEscalas},
          {label:"Informe",sub:"Familia",icon:"◉",color:"#8E44AD",bg:"rgba(142,68,173,0.06)",fn:onGoFamilias},
          {label:"Borrar",sub:"paciente",icon:"×",color:"#E74C3C",bg:"rgba(231,76,60,0.05)",fn:()=>onDelete(p.id)},
        ].map(b=>(
          <button key={b.label} onClick={b.fn} className="btn" style={{padding:"0.6rem 0.2rem",background:b.bg,border:"1.5px solid "+b.color+"40",borderRadius:8,color:b.color,fontFamily:"'DM Sans'",fontWeight:600,fontSize:"0.65rem",textAlign:"center",lineHeight:1.4,cursor:"pointer"}}>
            <div style={{fontSize:"0.9rem",marginBottom:"0.1rem"}}>{b.icon}</div>
            <div>{b.label}</div>
            <div style={{fontWeight:400,opacity:0.7,fontSize:"0.58rem"}}>{b.sub}</div>
          </button>
        ))}
      </div>

      <div style={{display:"flex",borderBottom:"2px solid #F0EBE3",marginBottom:"1rem",overflowX:"auto"}}>
        {["sesiones","protocolos","objetivos","estadísticas","escalas"].map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{padding:"0.5rem 0.9rem",background:"transparent",border:"none",borderBottom:`2px solid ${tab===t?"#2D6A4F":"transparent"}`,marginBottom:"-2px",color:tab===t?"#2D6A4F":"#9B8B7A",fontFamily:"'DM Sans'",fontSize:"0.72rem",fontWeight:tab===t?600:400,cursor:"pointer",textTransform:"capitalize",transition:"all 0.15s",whiteSpace:"nowrap"}}>{t}</button>
        ))}
      </div>

      {/* TAB SESIONES */}
      {tab==="sesiones"&&(
        <div style={{animation:"fadeIn 0.3s ease"}}>
          {sesiones.length===0?(
            <div style={{textAlign:"center",padding:"3rem 0",color:"#CCC"}}>
              <p style={{fontSize:"2rem",marginBottom:"0.5rem"}}>◈</p>
              <p style={{fontFamily:"'DM Sans'",fontSize:"0.8rem"}}>Sin sesiones. Pulsa "Iniciar sesión" para comenzar.</p>
            </div>
          ):(
            <div style={{display:"flex",flexDirection:"column",gap:"0.5rem"}}>
              {sesiones.map(s=>(
                <div key={s.id} style={{background:"#fff",borderRadius:10,padding:"1rem 1.1rem",boxShadow:"0 1px 6px rgba(26,26,46,0.05)"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"0.4rem"}}>
                    <div style={{cursor:"pointer"}} onClick={()=>onVerSesion(s)}>
                      <p style={{fontFamily:"'DM Sans'",fontWeight:600,fontSize:"0.86rem",marginBottom:"0.15rem"}}>{s.fecha} · {s.hora}</p>
                      <p style={{fontFamily:"'DM Sans'",fontSize:"0.7rem",color:"#9B8B7A"}}>{s.ejercicios?.filter(e=>e.completado).length||0}/{s.ejercicios?.length||0} ejercicios · {fmtDur(s.duracion)}</p>
                    </div>
                    <div style={{display:"flex",gap:"0.4rem",alignItems:"center"}}>
                      {s.rpeFinal&&<Tag label={`RPE ${s.rpeFinal}/10 ${rpeData(s.rpeFinal)?.emoji}`} color={s.rpeFinal>=7?"#E67E22":"#2D6A4F"}/>}
                      <button onClick={()=>onPrintSesion(s)} style={{padding:"0.3rem 0.6rem",background:"transparent",border:"1px solid #E8E0D5",borderRadius:6,color:"#9B8B7A",fontFamily:"'DM Sans'",fontSize:"0.65rem",cursor:"pointer"}}>PDF</button>
                    </div>
                  </div>
                  {s.respuestas?.length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:"0.3rem"}}>{s.respuestas.slice(0,3).map(r=><Tag key={r} label={r} color="#6B4226"/>)}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB PROTOCOLOS */}
      {tab==="protocolos"&&(
        <div style={{animation:"fadeIn 0.3s ease"}}>
          <Card2 title="Generar protocolo" icon="◈">
            <p style={{fontFamily:"'DM Sans'",fontSize:"0.75rem",color:"#9B8B7A",marginBottom:"0.8rem"}}>Selecciona objetivos para generar el protocolo clínico</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:"0.4rem",marginBottom:"1rem"}}>
              {OBJETIVOS_LIST.map(o=><Chip key={o} label={o} sel={genObjs.includes(o)} onSel={()=>setGenObjs(prev=>prev.includes(o)?prev.filter(x=>x!==o):[...prev,o])}/>)}
            </div>
            <button onClick={handleGenProto} disabled={genObjs.length===0||generating} className="btn" style={{width:"100%",padding:"0.75rem",background:genObjs.length===0?"#F0EBE3":"#2D6A4F",border:"none",borderRadius:8,color:genObjs.length===0?"#CCC":"#fff",fontFamily:"'DM Sans'",fontWeight:600,fontSize:"0.83rem",cursor:genObjs.length===0?"not-allowed":"pointer"}}>
              {generating?"Generando...":"Generar protocolo →"}
            </button>
          </Card2>

          {(p.protocolos||[]).length>0&&(
            <div style={{display:"flex",flexDirection:"column",gap:"0.6rem",marginTop:"0.8rem"}}>
              {[...(p.protocolos||[])].reverse().map((proto,i)=>(
                <div key={proto.id} style={{background:"#fff",borderRadius:10,padding:"1rem 1.1rem",boxShadow:"0 1px 6px rgba(26,26,46,0.04)"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.5rem"}}>
                    <p style={{fontFamily:"'DM Sans'",fontWeight:600,fontSize:"0.86rem"}}>Protocolo #{(p.protocolos||[]).length-i}</p>
                    <div style={{display:"flex",gap:"0.4rem",alignItems:"center"}}>
                      <p style={{fontFamily:"'DM Sans'",fontSize:"0.68rem",color:"#9B8B7A"}}>{proto.fecha}</p>
                      <button onClick={()=>onPrintProtocolo(proto)} style={{padding:"0.3rem 0.6rem",background:"transparent",border:"1px solid #E8E0D5",borderRadius:6,color:"#9B8B7A",fontFamily:"'DM Sans'",fontSize:"0.65rem",cursor:"pointer"}}>PDF</button>
                    </div>
                  </div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:"0.3rem",marginBottom:"0.5rem"}}>
                    {(proto.objetivos||[]).map(o=><Tag key={o} label={o} color="#2D6A4F"/>)}
                  </div>
                  <p style={{fontFamily:"'DM Sans'",fontSize:"0.75rem",color:"#9B8B7A"}}>{proto.sesiones}</p>
                </div>
              ))}
            </div>
          )}

          {(p.protocolos||[]).length===0&&(
            <p style={{fontFamily:"'DM Sans'",color:"#CCC",fontSize:"0.78rem",textAlign:"center",padding:"1.5rem 0"}}>Sin protocolos generados aún.</p>
          )}
        </div>
      )}

      {/* TAB OBJETIVOS */}
      {tab==="objetivos"&&(
        <div style={{animation:"fadeIn 0.3s ease"}}>
          <p style={{fontFamily:"'DM Sans'",fontSize:"0.75rem",color:"#9B8B7A",marginBottom:"1rem"}}>Marca los objetivos terapéuticos alcanzados. Se registra la fecha de consecución.</p>
          <div style={{display:"flex",flexDirection:"column",gap:"0.5rem"}}>
            {OBJETIVOS_LIST.map(obj=>{
              const reg=objetivos.find(o=>o.nombre===obj);
              return(
                <div key={obj} onClick={()=>onToggleObj(obj)} className="hov" style={{background:"#fff",borderRadius:10,padding:"0.9rem 1.1rem",boxShadow:"0 1px 6px rgba(26,26,46,0.04)",display:"flex",alignItems:"center",gap:"0.8rem",border:`1px solid ${reg?.completado?"rgba(45,106,79,0.2)":"transparent"}`}}>
                  <div style={{width:20,height:20,borderRadius:4,border:`2px solid ${reg?.completado?"#2D6A4F":"#D4C5B0"}`,background:reg?.completado?"#2D6A4F":"transparent",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:"0.65rem",flexShrink:0}}>
                    {reg?.completado?"✓":""}
                  </div>
                  <div style={{flex:1}}>
                    <p style={{fontFamily:"'DM Sans'",fontSize:"0.85rem",fontWeight:500,color:reg?.completado?"#2D6A4F":"#1A1A2E",textDecoration:reg?.completado?"none":"none"}}>{obj}</p>
                    {reg?.completado&&<p style={{fontFamily:"'DM Sans'",fontSize:"0.65rem",color:"#9B8B7A"}}>Alcanzado: {reg.fecha}</p>}
                  </div>
                  {reg?.completado&&<span style={{color:"#2D6A4F",fontSize:"0.9rem"}}>✓</span>}
                </div>
              );
            })}
          </div>
          <div style={{marginTop:"1rem",padding:"0.8rem 1rem",background:"rgba(45,106,79,0.05)",borderRadius:8}}>
            <p style={{fontFamily:"'DM Sans'",fontSize:"0.72rem",color:"#9B8B7A"}}>
              {objetivos.filter(o=>o.completado).length} de {OBJETIVOS_LIST.length} objetivos alcanzados
            </p>
            <div style={{height:4,background:"#E8E0D5",borderRadius:2,marginTop:"0.4rem",overflow:"hidden"}}>
              <div style={{height:"100%",width:`${(objetivos.filter(o=>o.completado).length/OBJETIVOS_LIST.length)*100}%`,background:"#2D6A4F",borderRadius:2,transition:"width 0.4s"}}/>
            </div>
          </div>
        </div>
      )}

      {/* TAB ESTADÍSTICAS */}
      {tab==="estadísticas"&&(
        <div style={{animation:"fadeIn 0.3s ease"}}>
          {sesiones.length<2?(
            <p style={{fontFamily:"'DM Sans'",color:"#CCC",fontSize:"0.8rem",textAlign:"center",padding:"2rem 0"}}>Necesitas al menos 2 sesiones para ver estadísticas.</p>
          ):(
            <div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"0.5rem",marginBottom:"1rem"}}>
                {[
                  {l:"Total sesiones",v:sesiones.length},
                  {l:"Duración media",v:fmtDur(Math.round(sesiones.reduce((a,s)=>a+s.duracion,0)/sesiones.length))},
                  {l:"RPE medio",v:`${avgRpe}/10`},
                  {l:"Ejercicios totales",v:sesiones.reduce((a,s)=>a+(s.ejercicios?.length||0),0)},
                  {l:"Completados",v:sesiones.reduce((a,s)=>a+(s.ejercicios?.filter(e=>e.completado).length||0),0)},
                  {l:"Objetivos alcanzados",v:`${objetivos.filter(o=>o.completado).length}/${OBJETIVOS_LIST.length}`},
                ].map(st=>(
                  <div key={st.l} style={{background:"#fff",borderRadius:8,padding:"0.85rem",boxShadow:"0 1px 6px rgba(26,26,46,0.04)"}}>
                    <p style={{fontFamily:"'DM Sans'",fontSize:"0.58rem",color:"#9B8B7A",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:"0.3rem"}}>{st.l}</p>
                    <p style={{fontSize:"1.2rem",color:"#2D6A4F",fontFamily:"'DM Serif Display'"}}>{st.v}</p>
                  </div>
                ))}
              </div>
              <div style={{background:"#fff",borderRadius:10,padding:"1rem 1.1rem",boxShadow:"0 1px 6px rgba(26,26,46,0.04)",marginBottom:"0.8rem"}}>
                <p style={{fontFamily:"'DM Sans'",fontSize:"0.62rem",color:"#9B8B7A",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:"0.8rem"}}>RPE final por sesión (últimas 10)</p>
                <div style={{display:"flex",alignItems:"flex-end",gap:"3px",height:55}}>
                  {sesiones.slice(0,10).reverse().map((s,i)=>{
                    const r=s.rpeFinal||0;
                    const rd=rpeData(r);
                    return(
                      <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:"2px"}}>
                        <div style={{width:"100%",background:rd?.color||"#E8E0D5",borderRadius:"2px 2px 0 0",height:`${r*5.5}px`,transition:"height 0.3s",minHeight:2}}/>
                        <span style={{fontFamily:"'DM Sans'",fontSize:"0.52rem",color:"#9B8B7A"}}>{r||"—"}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div style={{background:"#fff",borderRadius:10,padding:"1rem 1.1rem",boxShadow:"0 1px 6px rgba(26,26,46,0.04)"}}>
                <p style={{fontFamily:"'DM Sans'",fontSize:"0.62rem",color:"#9B8B7A",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:"0.7rem"}}>Respuestas más frecuentes</p>
                {Object.entries(sesiones.flatMap(s=>s.respuestas||[]).reduce((acc,r)=>{acc[r]=(acc[r]||0)+1;return acc;},{})).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([r,n])=>(
                  <div key={r} style={{display:"flex",alignItems:"center",gap:"0.6rem",marginBottom:"0.4rem"}}>
                    <p style={{fontFamily:"'DM Sans'",fontSize:"0.78rem",flex:1}}>{r}</p>
                    <div style={{width:60,height:4,background:"#F0EBE3",borderRadius:2,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${(n/sesiones.length)*100}%`,background:"#2D6A4F",borderRadius:2}}/>
                    </div>
                    <span style={{fontFamily:"'DM Sans'",fontSize:"0.65rem",color:"#9B8B7A"}}>{n}x</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB ESCALAS */}
      {tab==="escalas"&&(
        <div style={{animation:"fadeIn 0.3s ease"}}>
          <p style={{fontFamily:"'DM Sans'",fontSize:"0.78rem",color:"#9B8B7A",marginBottom:"1rem"}}>Escalas de valoración recomendadas para {p.diagnostico}</p>
          {escalas.map((e,i)=>(
            <div key={i} style={{background:"#fff",borderRadius:10,padding:"0.85rem 1.1rem",marginBottom:"0.5rem",boxShadow:"0 1px 6px rgba(26,26,46,0.04)",display:"flex",alignItems:"center",gap:"0.7rem"}}>
              <span style={{color:"#2D6A4F",fontSize:"0.8rem"}}>◇</span>
              <p style={{fontFamily:"'DM Sans'",fontSize:"0.85rem",fontWeight:500}}>{e}</p>
            </div>
          ))}
          <div style={{marginTop:"1rem",padding:"0.9rem 1.1rem",background:"rgba(45,106,79,0.04)",borderRadius:10,border:"1px solid rgba(45,106,79,0.1)"}}>
            <p style={{fontFamily:"'DM Sans'",fontSize:"0.72rem",color:"#2D6A4F",lineHeight:1.6}}>💡 Realiza una valoración inicial con estas escalas antes de generar el protocolo para establecer el nivel de base y los criterios de alta objetivos.</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SESIÓN ACTIVA ────────────────────────────────────────────────────────────
function SesionActiva({patient,onFinish,onBack,onOpenRpe}){
  const [fase,setFase]=useState("inicio");
  const [rpeInicio,setRpeInicio]=useState(null);
  const [rpeFinal,setRpeFinal]=useState(null);
  const [ejercicios,setEjercicios]=useState([]);
  const [notas,setNotas]=useState("");
  const [estado,setEstado]=useState("completada");
  const [timer,setTimer]=useState(0);
  const [timerOn,setTimerOn]=useState(false);
  const [ejAct,setEjAct]=useState(null);
  const [showAdd,setShowAdd]=useState(false);
  const [respuestas,setRespuestas]=useState([]);
  const timerRef=useRef(null);
  const catalogo=EJERCICIOS_CATALOGO[patient.diagnostico]?.[patient.nivel]||[];
  const plantilla=PLANTILLAS[patient.diagnostico]?.[patient.nivel]||[];

  useEffect(()=>{if(timerOn)timerRef.current=setInterval(()=>setTimer(t=>t+1),1000);else clearInterval(timerRef.current);return()=>clearInterval(timerRef.current);},[timerOn]);

  const iniciarConPlantilla=()=>{
    setEjercicios(plantilla.map(n=>({id:uid(),nombre:n,series:"3",reps:"10",carga:"",completado:false})));
    setTimerOn(true);setFase("sesion");
  };
  const iniciarVacio=()=>{setTimerOn(true);setFase("sesion");};
  const addEj=(nombre,det)=>{
    const def=det||EJERCICIOS_DETALLE[nombre]||{};
    setEjercicios(p=>[...p,{id:uid(),nombre,series:def.series||"3",reps:def.reps||"10",carga:"",completado:false,progresion:def.progresion||""}]);
    setShowAdd(false);
  };
  const updEj=(id,f,v)=>setEjercicios(p=>p.map(e=>e.id===id?{...e,[f]:v}:e));
  const toggleEj=(id)=>setEjercicios(p=>p.map(e=>e.id===id?{...e,completado:!e.completado}:e));
  const rmEj=(id)=>setEjercicios(p=>p.filter(e=>e.id!==id));
  const guardar=()=>{
    setTimerOn(false);
    onFinish({id:uid(),fecha:hoy(),hora:horaActual(),timestamp:Date.now(),duracion:timer,ejercicios,rpeInicio,rpeFinal,respuestas,notas,estado,diagnostico:patient.diagnostico,nivel:patient.nivel});
  };

  if(fase==="inicio") return(
    <div style={{maxWidth:720,margin:"0 auto",padding:"2rem 1.2rem",animation:"slideUp 0.4s ease"}}>
      <Volver onClick={onBack}/>
      <h2 style={{fontSize:"1.8rem",marginBottom:"0.3rem"}}>Iniciar <em style={{color:"#2D6A4F"}}>Sesión</em></h2>
      <p style={{fontFamily:"'DM Sans'",color:"#9B8B7A",fontSize:"0.8rem",marginBottom:"1.5rem"}}>{patient.nombre} · {patient.diagnostico} · Nivel {patient.nivel}</p>

      <Card2 title="RPE al inicio" icon="◈">
        <p style={{fontFamily:"'DM Sans'",fontSize:"0.76rem",color:"#9B8B7A",marginBottom:"0.8rem"}}>¿Cómo está el paciente antes de empezar?</p>
        {rpeInicio?(
          <div style={{display:"flex",alignItems:"center",gap:"0.8rem",padding:"0.8rem",background:rpeData(rpeInicio)?.color+"15",borderRadius:8}}>
            <span style={{fontSize:"1.6rem"}}>{rpeData(rpeInicio)?.emoji}</span>
            <div style={{flex:1}}><p style={{fontFamily:"'DM Sans'",fontWeight:600,fontSize:"0.85rem"}}>{rpeData(rpeInicio)?.label} ({rpeInicio}/10)</p></div>
            <button onClick={()=>setRpeInicio(null)} style={{fontFamily:"'DM Sans'",fontSize:"0.68rem",color:"#9B8B7A",background:"transparent",border:"none",cursor:"pointer"}}>Cambiar</button>
          </div>
        ):(
          <button onClick={()=>onOpenRpe("¿Cómo se siente el paciente?",setRpeInicio)} className="btn" style={{width:"100%",padding:"0.75rem",background:"rgba(45,106,79,0.06)",border:"1.5px dashed rgba(45,106,79,0.3)",borderRadius:8,color:"#2D6A4F",fontFamily:"'DM Sans'",fontWeight:600,fontSize:"0.83rem"}}>Abrir escala RPE →</button>
        )}
      </Card2>

      <Card2 title="Plantilla de sesión" icon="◇">
        <p style={{fontFamily:"'DM Sans'",fontSize:"0.76rem",color:"#9B8B7A",marginBottom:"0.7rem"}}>Carga la plantilla estándar para {patient.diagnostico} nivel {patient.nivel}</p>
        <div style={{display:"flex",flexWrap:"wrap",gap:"0.35rem",marginBottom:"0.8rem"}}>
          {plantilla.map(e=><Tag key={e} label={e} color="#2D6A4F"/>)}
        </div>
        <div style={{display:"flex",gap:"0.5rem"}}>
          <button onClick={iniciarConPlantilla} className="btn" style={{flex:2,padding:"0.75rem",background:"#2D6A4F",border:"none",borderRadius:8,color:"#fff",fontFamily:"'DM Sans'",fontWeight:600,fontSize:"0.83rem"}}>Usar plantilla →</button>
          <button onClick={iniciarVacio} style={{flex:1,padding:"0.75rem",background:"transparent",border:"1px solid #E8E0D5",borderRadius:8,color:"#9B8B7A",fontFamily:"'DM Sans'",fontSize:"0.78rem",cursor:"pointer"}}>Sesión libre</button>
        </div>
      </Card2>
    </div>
  );

  if(fase==="sesion") return(
    <div style={{maxWidth:720,margin:"0 auto",padding:"1.5rem 1.2rem"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.1rem"}}>
        <div>
          <p style={{fontFamily:"'DM Sans'",fontSize:"0.62rem",color:"#9B8B7A",letterSpacing:"0.1em",textTransform:"uppercase"}}>Sesión activa</p>
          <h2 style={{fontSize:"1.3rem"}}>{patient.nombre}</h2>
        </div>
        <div style={{textAlign:"right"}}>
          <p style={{fontFamily:"'DM Sans'",fontWeight:700,fontSize:"1.4rem",color:"#2D6A4F",animation:"pulse 2s infinite"}}>{fmtDur(timer)}</p>
          <p style={{fontFamily:"'DM Sans'",fontSize:"0.6rem",color:"#9B8B7A"}}>{ejercicios.filter(e=>e.completado).length}/{ejercicios.length}</p>
        </div>
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:"0.5rem",marginBottom:"0.8rem"}}>
        {ejercicios.map(e=>(
          <div key={e.id} style={{background:"#fff",borderRadius:10,padding:"0.85rem 1rem",boxShadow:"0 1px 6px rgba(26,26,46,0.05)",border:`1px solid ${e.completado?"rgba(45,106,79,0.2)":"transparent"}`,opacity:e.completado?0.7:1}}>
            <div style={{display:"flex",alignItems:"center",gap:"0.6rem"}}>
              <button onClick={()=>toggleEj(e.id)} style={{width:20,height:20,borderRadius:4,border:`2px solid ${e.completado?"#2D6A4F":"#D4C5B0"}`,background:e.completado?"#2D6A4F":"transparent",cursor:"pointer",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:"0.6rem"}}>{e.completado?"✓":""}</button>
              <div onClick={()=>setEjAct(ejAct===e.id?null:e.id)} style={{flex:1,cursor:"pointer"}}>
                <p style={{fontFamily:"'DM Sans'",fontWeight:600,fontSize:"0.83rem",textDecoration:e.completado?"line-through":"none",color:e.completado?"#9B8B7A":"#1A1A2E"}}>{e.nombre}</p>
                <p style={{fontFamily:"'DM Sans'",fontSize:"0.68rem",color:"#9B8B7A"}}>{e.series}s · {e.reps}r{e.carga?` · ${e.carga}`:""}</p>
              </div>
              <button onClick={()=>rmEj(e.id)} style={{color:"#CCC",background:"transparent",border:"none",cursor:"pointer",fontSize:"0.9rem"}}>×</button>
            </div>
            {ejAct===e.id&&(
              <div style={{animation:"fadeIn 0.2s ease",marginTop:"0.7rem"}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"0.4rem",marginBottom:"0.5rem"}}>
                  {[["Series","series"],["Reps","reps"],["Carga","carga"]].map(([l,f])=>(
                    <div key={f}>
                      <p style={{fontFamily:"'DM Sans'",fontSize:"0.58rem",color:"#9B8B7A",marginBottom:"0.2rem",textTransform:"uppercase"}}>{l}</p>
                      <input value={e[f]} onChange={ev=>updEj(e.id,f,ev.target.value)} style={{width:"100%",padding:"0.4rem 0.5rem",border:"1px solid #E8E0D5",borderRadius:5,fontFamily:"'DM Sans'",fontSize:"0.78rem",outline:"none"}}/>
                    </div>
                  ))}
                </div>
                {(EJERCICIOS_DETALLE[e.nombre]?.desc)&&(
                  <p style={{fontFamily:"'DM Sans'",fontSize:"0.7rem",color:"#6B4226",background:"rgba(107,66,38,0.06)",borderRadius:5,padding:"0.4rem 0.6rem",lineHeight:1.5}}>{EJERCICIOS_DETALLE[e.nombre].desc}</p>
                )}
                {(e.progresion||EJERCICIOS_DETALLE[e.nombre]?.progresion)&&(
                  <p style={{fontFamily:"'DM Sans'",fontSize:"0.68rem",color:"#2D6A4F",fontStyle:"italic",marginTop:"0.3rem"}}>{e.progresion||EJERCICIOS_DETALLE[e.nombre]?.progresion}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {showAdd?(
        <div style={{background:"#fff",borderRadius:10,padding:"0.9rem",boxShadow:"0 1px 6px rgba(26,26,46,0.05)",marginBottom:"0.8rem",animation:"fadeIn 0.2s ease"}}>
          <p style={{fontFamily:"'DM Sans'",fontSize:"0.62rem",color:"#9B8B7A",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:"0.6rem"}}>Añadir ejercicio</p>
          <div style={{display:"flex",flexDirection:"column",gap:"0.3rem",maxHeight:"180px",overflowY:"auto"}}>
            {catalogo.filter(n=>!ejercicios.find(e=>e.nombre===n)).map(n=>(
              <div key={n} onClick={()=>addEj(n)} className="hov" style={{padding:"0.5rem 0.7rem",borderRadius:6,background:"rgba(45,106,79,0.04)",cursor:"pointer"}}>
                <p style={{fontFamily:"'DM Sans'",fontSize:"0.8rem",color:"#2D6A4F"}}>+ {n}</p>
              </div>
            ))}
          </div>
          <button onClick={()=>setShowAdd(false)} style={{marginTop:"0.5rem",fontFamily:"'DM Sans'",fontSize:"0.7rem",color:"#9B8B7A",background:"transparent",border:"none",cursor:"pointer"}}>Cancelar</button>
        </div>
      ):(
        <button onClick={()=>setShowAdd(true)} style={{width:"100%",padding:"0.65rem",background:"transparent",border:"1.5px dashed rgba(45,106,79,0.3)",borderRadius:8,color:"#2D6A4F",fontFamily:"'DM Sans'",fontSize:"0.8rem",cursor:"pointer",marginBottom:"0.8rem"}}>+ Añadir ejercicio</button>
      )}

      <button onClick={()=>setFase("cierre")} className="btn" style={{width:"100%",padding:"0.9rem",background:"#1A1A2E",border:"none",borderRadius:10,color:"#fff",fontFamily:"'DM Sans'",fontWeight:700,fontSize:"0.9rem"}}>■ Finalizar sesión</button>
    </div>
  );

  return(
    <div style={{maxWidth:720,margin:"0 auto",padding:"2rem 1.2rem",animation:"slideUp 0.4s ease"}}>
      <h2 style={{fontSize:"1.8rem",marginBottom:"0.3rem"}}>Cerrar <em style={{color:"#2D6A4F"}}>sesión</em></h2>
      <p style={{fontFamily:"'DM Sans'",color:"#9B8B7A",fontSize:"0.78rem",marginBottom:"1.2rem"}}>Duración total: {fmtDur(timer)}</p>

      <Card2 title="RPE al finalizar" icon="◈">
        {rpeFinal?(
          <div style={{display:"flex",alignItems:"center",gap:"0.8rem",padding:"0.8rem",background:rpeData(rpeFinal)?.color+"15",borderRadius:8}}>
            <span style={{fontSize:"1.6rem"}}>{rpeData(rpeFinal)?.emoji}</span>
            <div style={{flex:1}}><p style={{fontFamily:"'DM Sans'",fontWeight:600,fontSize:"0.85rem"}}>{rpeData(rpeFinal)?.label} ({rpeFinal}/10)</p></div>
            <button onClick={()=>setRpeFinal(null)} style={{fontFamily:"'DM Sans'",fontSize:"0.68rem",color:"#9B8B7A",background:"transparent",border:"none",cursor:"pointer"}}>Cambiar</button>
          </div>
        ):(
          <button onClick={()=>onOpenRpe("RPE al finalizar",setRpeFinal)} className="btn" style={{width:"100%",padding:"0.75rem",background:"rgba(45,106,79,0.06)",border:"1.5px dashed rgba(45,106,79,0.3)",borderRadius:8,color:"#2D6A4F",fontFamily:"'DM Sans'",fontWeight:600,fontSize:"0.83rem"}}>Abrir escala RPE →</button>
        )}
      </Card2>

      <Card2 title="Respuesta del paciente" icon="◇">
        <div style={{display:"flex",flexWrap:"wrap",gap:"0.35rem"}}>
          {RESPUESTAS.map(r=><Chip key={r} label={r} sel={respuestas.includes(r)} onSel={()=>setRespuestas(p=>p.includes(r)?p.filter(x=>x!==r):[...p,r])}/>)}
        </div>
      </Card2>

      <Card2 title="Notas y estado" icon="◉">
        <textarea value={notas} onChange={e=>setNotas(e.target.value)} rows={3} placeholder="Observaciones, incidencias, próxima sesión..." style={{...IS,width:"100%",resize:"vertical",marginBottom:"0.7rem"}}/>
        <div style={{display:"flex",gap:"0.4rem"}}>
          {["completada","parcial"].map(e=><Chip key={e} label={e.charAt(0).toUpperCase()+e.slice(1)} sel={estado===e} onSel={()=>setEstado(e)}/>)}
        </div>
      </Card2>

      <button onClick={guardar} className="btn" style={{width:"100%",padding:"0.95rem",background:"#2D6A4F",border:"none",borderRadius:10,color:"#fff",fontFamily:"'DM Sans'",fontWeight:700,fontSize:"0.95rem"}}>Guardar y ver informe →</button>
    </div>
  );
}

// ─── RPE SCALE ────────────────────────────────────────────────────────────────
function RPEScale({title,onSelect,onClose}){
  const [sel,setSel]=useState(null);
  return(
    <div style={{minHeight:"100vh",background:"#0D1B0F",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"1.5rem",animation:"fadeIn 0.3s ease"}}>
      <div style={{width:"100%",maxWidth:480}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.4rem"}}>
          <p style={{fontFamily:"'DM Sans'",fontSize:"0.6rem",color:"rgba(255,255,255,0.25)",letterSpacing:"0.15em",textTransform:"uppercase"}}>ESCALA RPE-DI · NEUROX</p>
          <button onClick={onClose} style={{color:"rgba(255,255,255,0.3)",background:"transparent",border:"none",cursor:"pointer",fontSize:"1.2rem"}}>×</button>
        </div>
        <h2 style={{fontFamily:"'DM Serif Display'",fontSize:"clamp(1.3rem,4vw,1.9rem)",color:"#fff",marginBottom:"0.3rem"}}>{title||"¿Cómo estás?"}</h2>
        <p style={{fontFamily:"'DM Sans'",fontSize:"0.75rem",color:"rgba(255,255,255,0.35)",marginBottom:"1.5rem"}}>Toca cómo te sientes ahora mismo</p>
        <div style={{display:"flex",flexDirection:"column",gap:"0.4rem",marginBottom:"1.2rem"}}>
          {RPE_NIVELES.map(r=>(
            <div key={r.val} onClick={()=>setSel(r.val)} style={{display:"flex",alignItems:"center",gap:"0.9rem",padding:"0.8rem 1rem",borderRadius:10,background:sel===r.val?r.color+"20":"rgba(255,255,255,0.03)",border:`1.5px solid ${sel===r.val?r.color:"rgba(255,255,255,0.05)"}`,cursor:"pointer",transition:"all 0.15s"}}>
              <span style={{fontSize:"1.6rem",lineHeight:1}}>{r.emoji}</span>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"baseline",gap:"0.5rem"}}>
                  <span style={{fontFamily:"'DM Serif Display'",fontSize:"1rem",color:sel===r.val?r.color:"#fff"}}>{r.val}</span>
                  <span style={{fontFamily:"'DM Sans'",fontWeight:600,fontSize:"0.82rem",color:sel===r.val?r.color:"rgba(255,255,255,0.75)"}}>{r.label}</span>
                </div>
                <p style={{fontFamily:"'DM Sans'",fontSize:"0.67rem",color:"rgba(255,255,255,0.25)",margin:0}}>{r.desc}</p>
              </div>
              <div style={{width:50,height:4,borderRadius:2,background:"rgba(255,255,255,0.06)",overflow:"hidden"}}>
                <div style={{width:`${r.val*10}%`,height:"100%",background:r.color,borderRadius:2}}/>
              </div>
            </div>
          ))}
        </div>
        {sel&&(
          <button onClick={()=>onSelect(sel)} className="btn" style={{width:"100%",padding:"0.95rem",background:RPE_NIVELES.find(r=>r.val===sel)?.color,border:"none",borderRadius:12,color:"#fff",fontFamily:"'DM Sans'",fontWeight:700,fontSize:"0.95rem",animation:"fadeIn 0.2s ease"}}>
            Confirmar — {sel}/10 {RPE_NIVELES.find(r=>r.val===sel)?.emoji}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── INFORME SESIÓN ───────────────────────────────────────────────────────────
function InformeSesion({sesion:s,patient,onBack,onPrint}){
  const ri=rpeData(s.rpeInicio),rf=rpeData(s.rpeFinal);
  return(
    <div style={{maxWidth:720,margin:"0 auto",padding:"2rem 1.2rem",animation:"slideUp 0.4s ease"}}>
      <Volver onClick={onBack}/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"1.2rem"}}>
        <div>
          <p style={{fontFamily:"'DM Sans'",fontSize:"0.6rem",color:"#9B8B7A",letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:"0.2rem"}}>Informe de sesión</p>
          <h2 style={{fontSize:"1.6rem",marginBottom:"0.15rem"}}>{patient?.nombre}</h2>
          <p style={{fontFamily:"'DM Sans'",fontSize:"0.75rem",color:"#9B8B7A"}}>{s.fecha} · {s.hora} · {fmtDur(s.duracion)}</p>
        </div>
        <div style={{display:"flex",gap:"0.4rem",alignItems:"center"}}>
          <button onClick={onPrint} className="btn" style={{padding:"0.5rem 0.9rem",background:"#1A1A2E",border:"none",borderRadius:8,color:"#fff",fontFamily:"'DM Sans'",fontSize:"0.74rem"}}>Exportar PDF</button>
          <Tag label={s.estado==="completada"?"Completada":"Parcial"} color={s.estado==="completada"?"#2D6A4F":"#E67E22"}/>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"0.5rem",marginBottom:"0.9rem"}}>
        {[{l:"Duración",v:fmtDur(s.duracion)},{l:"Ejercicios",v:`${s.ejercicios?.filter(e=>e.completado).length||0}/${s.ejercicios?.length||0}`},{l:"Nivel",v:s.nivel}].map(st=>(
          <div key={st.l} style={{background:"#fff",borderRadius:8,padding:"0.8rem",textAlign:"center",boxShadow:"0 1px 6px rgba(26,26,46,0.04)"}}>
            <p style={{fontFamily:"'DM Sans'",fontSize:"0.57rem",color:"#9B8B7A",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:"0.25rem"}}>{st.l}</p>
            <p style={{fontSize:"1rem",color:"#2D6A4F",fontFamily:"'DM Serif Display'"}}>{st.v}</p>
          </div>
        ))}
      </div>

      {(ri||rf)&&(
        <div style={{background:"#fff",borderRadius:12,padding:"1.1rem",boxShadow:"0 1px 8px rgba(26,26,46,0.05)",marginBottom:"0.7rem"}}>
          <p style={{fontFamily:"'DM Sans'",fontSize:"0.6rem",color:"#9B8B7A",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:"0.7rem"}}>Esfuerzo Percibido (RPE)</p>
          <div style={{display:"flex",gap:"0.8rem",alignItems:"center"}}>
            {ri&&<div style={{flex:1,padding:"0.7rem",background:ri.color+"12",borderRadius:8,textAlign:"center"}}><p style={{fontFamily:"'DM Sans'",fontSize:"0.58rem",color:"#9B8B7A",marginBottom:"0.3rem"}}>INICIO</p><span style={{fontSize:"1.5rem"}}>{ri.emoji}</span><p style={{fontFamily:"'DM Sans'",fontWeight:600,fontSize:"0.8rem",color:ri.color}}>{s.rpeInicio}/10 · {ri.label}</p></div>}
            {ri&&rf&&<span style={{color:"#CCC",fontSize:"1.1rem"}}>→</span>}
            {rf&&<div style={{flex:1,padding:"0.7rem",background:rf.color+"12",borderRadius:8,textAlign:"center"}}><p style={{fontFamily:"'DM Sans'",fontSize:"0.58rem",color:"#9B8B7A",marginBottom:"0.3rem"}}>FINAL</p><span style={{fontSize:"1.5rem"}}>{rf.emoji}</span><p style={{fontFamily:"'DM Sans'",fontWeight:600,fontSize:"0.8rem",color:rf.color}}>{s.rpeFinal}/10 · {rf.label}</p></div>}
          </div>
          {s.rpeInicio&&s.rpeFinal&&<p style={{fontFamily:"'DM Sans'",fontSize:"0.7rem",color:"#9B8B7A",textAlign:"center",marginTop:"0.5rem"}}>Variación: {s.rpeFinal>s.rpeInicio?"+":""}{s.rpeFinal-s.rpeInicio} puntos</p>}
        </div>
      )}

      {s.ejercicios?.length>0&&(
        <div style={{background:"#fff",borderRadius:12,padding:"1.1rem",boxShadow:"0 1px 8px rgba(26,26,46,0.05)",marginBottom:"0.7rem"}}>
          <p style={{fontFamily:"'DM Sans'",fontSize:"0.6rem",color:"#9B8B7A",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:"0.7rem"}}>Ejercicios</p>
          {s.ejercicios.map((e,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:"0.6rem",padding:"0.45rem 0.6rem",background:e.completado?"rgba(45,106,79,0.04)":"rgba(26,26,46,0.02)",borderRadius:6,marginBottom:"0.3rem"}}>
              <span style={{color:e.completado?"#2D6A4F":"#CCC",fontSize:"0.78rem"}}>{e.completado?"✓":"○"}</span>
              <p style={{fontFamily:"'DM Sans'",fontSize:"0.81rem",fontWeight:500,flex:1,color:e.completado?"#1A1A2E":"#CCC",textDecoration:!e.completado?"line-through":"none"}}>{e.nombre}</p>
              <p style={{fontFamily:"'DM Sans'",fontSize:"0.68rem",color:"#9B8B7A"}}>{e.series}×{e.reps}{e.carga?` · ${e.carga}`:""}</p>
            </div>
          ))}
        </div>
      )}

      {s.respuestas?.length>0&&(
        <div style={{background:"#fff",borderRadius:12,padding:"1.1rem",boxShadow:"0 1px 8px rgba(26,26,46,0.05)",marginBottom:"0.7rem"}}>
          <p style={{fontFamily:"'DM Sans'",fontSize:"0.6rem",color:"#9B8B7A",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:"0.6rem"}}>Respuesta del paciente</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:"0.35rem"}}>{s.respuestas.map(r=><Tag key={r} label={r} color="#6B4226"/>)}</div>
        </div>
      )}

      {s.notas&&(
        <div style={{background:"#fff",borderRadius:12,padding:"1.1rem",boxShadow:"0 1px 8px rgba(26,26,46,0.05)",marginBottom:"0.7rem"}}>
          <p style={{fontFamily:"'DM Sans'",fontSize:"0.6rem",color:"#9B8B7A",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:"0.4rem"}}>Notas del fisioterapeuta</p>
          <p style={{fontFamily:"'DM Sans'",fontSize:"0.82rem",lineHeight:1.65}}>{s.notas}</p>
        </div>
      )}

      <div style={{marginTop:"1.2rem",paddingTop:"0.8rem",borderTop:"1px solid #E8E0D5",display:"flex",justifyContent:"space-between"}}>
        <p style={{fontFamily:"'DM Sans'",fontSize:"0.6rem",color:"#CCC"}}>NEUROX · {patient?.diagnostico}</p>
        <p style={{fontFamily:"'DM Sans'",fontSize:"0.6rem",color:"#CCC"}}>Borja Cotanda · ASINDOWN Valencia</p>
      </div>
    </div>
  );
}

// ─── INFORME IMPRIMIBLE (PDF) ─────────────────────────────────────────────────
function InformeImprimible({data,onClose}){
  useEffect(()=>{setTimeout(()=>window.print(),400);},[]);
  const {type,patient,sesion,proto}=data;

  return(
    <div style={{background:"#fff",minHeight:"100vh",padding:"2.5rem",maxWidth:800,margin:"0 auto",fontFamily:"'DM Sans',sans-serif",color:"#1A1A2E"}}>
      <style>{`@media print{body{background:white;}.no-print{display:none!important;}}@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display:ital@0;1&display=swap');`}</style>

      <div className="no-print" style={{marginBottom:"1.5rem",display:"flex",gap:"0.7rem"}}>
        <button onClick={()=>window.print()} style={{padding:"0.6rem 1.2rem",background:"#2D6A4F",border:"none",borderRadius:8,color:"#fff",fontFamily:"'DM Sans'",cursor:"pointer",fontSize:"0.82rem",fontWeight:600}}>🖨 Imprimir / Guardar PDF</button>
        <button onClick={onClose} style={{padding:"0.6rem 1.2rem",background:"transparent",border:"1px solid #E8E0D5",borderRadius:8,color:"#9B8B7A",fontFamily:"'DM Sans'",cursor:"pointer",fontSize:"0.82rem"}}>← Volver</button>
      </div>

      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"1.5rem",paddingBottom:"1rem",borderBottom:"2px solid #1A1A2E"}}>
        <div>
          <p style={{fontSize:"0.6rem",letterSpacing:"0.15em",color:"#9B8B7A",textTransform:"uppercase",marginBottom:"0.3rem"}}>NEUROX · Sistema de Neurorrehabilitación</p>
          <h1 style={{fontFamily:"'DM Serif Display'",fontSize:"1.8rem",color:"#1A1A2E",marginBottom:"0.15rem"}}>{type==="sesion"?"Informe de Sesión":"Protocolo Clínico"}</h1>
          <p style={{fontSize:"0.78rem",color:"#9B8B7A"}}>{patient?.nombre} · {patient?.diagnostico} · Nivel {patient?.nivel}</p>
        </div>
        <div style={{textAlign:"right"}}>
          <p style={{fontFamily:"'DM Serif Display'",fontSize:"1rem",color:"#2D6A4F"}}>Borja Cotanda</p>
          <p style={{fontSize:"0.7rem",color:"#9B8B7A"}}>Fisioterapeuta Neurológico</p>
          <p style={{fontSize:"0.7rem",color:"#9B8B7A"}}>ASINDOWN Valencia</p>
        </div>
      </div>

      {type==="sesion"&&sesion&&(
        <div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"0.7rem",marginBottom:"1.2rem"}}>
            {[{l:"Fecha",v:sesion.fecha},{l:"Hora",v:sesion.hora},{l:"Duración",v:fmtDur(sesion.duracion)},{l:"Estado",v:sesion.estado}].map(s=>(
              <div key={s.l} style={{padding:"0.7rem",background:"#F9F7F4",borderRadius:6}}>
                <p style={{fontSize:"0.58rem",color:"#9B8B7A",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:"0.25rem"}}>{s.l}</p>
                <p style={{fontSize:"0.88rem",fontWeight:600,color:"#1A1A2E"}}>{s.v}</p>
              </div>
            ))}
          </div>

          {(sesion.rpeInicio||sesion.rpeFinal)&&(
            <Section title="Esfuerzo Percibido (RPE)">
              <div style={{display:"flex",gap:"1rem"}}>
                {sesion.rpeInicio&&<p style={{fontSize:"0.85rem"}}><b>Inicio:</b> {sesion.rpeInicio}/10 — {rpeData(sesion.rpeInicio)?.label} {rpeData(sesion.rpeInicio)?.emoji}</p>}
                {sesion.rpeFinal&&<p style={{fontSize:"0.85rem"}}><b>Final:</b> {sesion.rpeFinal}/10 — {rpeData(sesion.rpeFinal)?.label} {rpeData(sesion.rpeFinal)?.emoji}</p>}
              </div>
            </Section>
          )}

          {sesion.ejercicios?.length>0&&(
            <Section title="Ejercicios realizados">
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:"0.82rem"}}>
                <thead><tr style={{borderBottom:"1px solid #E8E0D5"}}>{["Ejercicio","Series","Reps","Carga/Obs","Estado"].map(h=><th key={h} style={{padding:"0.4rem 0.6rem",textAlign:"left",fontSize:"0.65rem",color:"#9B8B7A",textTransform:"uppercase",letterSpacing:"0.08em"}}>{h}</th>)}</tr></thead>
                <tbody>{sesion.ejercicios.map((e,i)=><tr key={i} style={{borderBottom:"1px solid #F5F2ED",background:i%2===0?"transparent":"#FAFAF8"}}><td style={{padding:"0.45rem 0.6rem",fontWeight:500}}>{e.nombre}</td><td style={{padding:"0.45rem 0.6rem",color:"#9B8B7A"}}>{e.series}</td><td style={{padding:"0.45rem 0.6rem",color:"#9B8B7A"}}>{e.reps}</td><td style={{padding:"0.45rem 0.6rem",color:"#9B8B7A"}}>{e.carga||"—"}</td><td style={{padding:"0.45rem 0.6rem",color:e.completado?"#2D6A4F":"#E67E22"}}>{e.completado?"✓ Completado":"○ Parcial"}</td></tr>)}</tbody>
              </table>
            </Section>
          )}

          {sesion.respuestas?.length>0&&<Section title="Respuesta del paciente"><p style={{fontSize:"0.85rem"}}>{sesion.respuestas.join(" · ")}</p></Section>}
          {sesion.notas&&<Section title="Notas del fisioterapeuta"><p style={{fontSize:"0.85rem",lineHeight:1.65}}>{sesion.notas}</p></Section>}
        </div>
      )}

      {type==="familias"&&data.form&&(
        <FamiliasPrintContent data={data} patient={data.patient}/>
      )}
      {type==="protocolo"&&proto&&(
        <div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"0.7rem",marginBottom:"1.2rem"}}>
            {[{l:"Diagnóstico",v:proto.diagnostico},{l:"Nivel",v:proto.nivel},{l:"Fecha",v:proto.fecha}].map(s=>(
              <div key={s.l} style={{padding:"0.7rem",background:"#F9F7F4",borderRadius:6}}>
                <p style={{fontSize:"0.58rem",color:"#9B8B7A",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:"0.25rem"}}>{s.l}</p>
                <p style={{fontSize:"0.88rem",fontWeight:600}}>{s.v}</p>
              </div>
            ))}
          </div>
          {proto.objetivos?.length>0&&<Section title="Objetivos terapéuticos"><p style={{fontSize:"0.85rem"}}>{proto.objetivos.join(" · ")}</p></Section>}
          <Section title="Objetivos a corto plazo (4 semanas)"><p style={{fontSize:"0.85rem",lineHeight:1.65}}>{proto.corto}</p></Section>
          <Section title="Objetivos a medio plazo (8 semanas)"><p style={{fontSize:"0.85rem",lineHeight:1.65}}>{proto.medio}</p></Section>
          <Section title="Objetivos a largo plazo (16 semanas)"><p style={{fontSize:"0.85rem",lineHeight:1.65}}>{proto.largo}</p></Section>
          <Section title="Estructura de sesiones"><p style={{fontSize:"0.85rem"}}>{proto.sesiones}</p></Section>
          <Section title="Técnicas principales">
            {(proto.tecnicas||[]).map((t,i)=><p key={i} style={{fontSize:"0.83rem",marginBottom:"0.25rem",paddingLeft:"0.8rem",borderLeft:"2px solid #2D6A4F"}}>· {t}</p>)}
          </Section>
          <Section title="Progresión"><p style={{fontSize:"0.85rem"}}>{proto.progresion}</p></Section>
          <Section title="Material necesario"><p style={{fontSize:"0.85rem"}}>{proto.material}</p></Section>
          <Section title="Criterios de alta"><p style={{fontSize:"0.85rem"}}>{proto.alta}</p></Section>
          {proto.escalas?.length>0&&<Section title="Escalas de valoración"><p style={{fontSize:"0.85rem"}}>{proto.escalas.join(" · ")}</p></Section>}
        </div>
      )}

      <div style={{marginTop:"2rem",paddingTop:"1rem",borderTop:"1px solid #E8E0D5",display:"flex",justifyContent:"space-between",fontSize:"0.65rem",color:"#CCC"}}>
        <span>NEUROX v3.0 · Generado {hoy()}</span>
        <span>Borja Cotanda · Fisioterapeuta Neurológico · ASINDOWN Valencia</span>
      </div>
    </div>
  );
}

// ─── INFORME FAMILIAS ────────────────────────────────────────────────────────
function InformeFamilias({patient:p,onBack,onPrint}){
  const [form,setForm]=useState({
    periodo:"Último mes",logros:"",objetivos:"",recomendaciones:"",actitud:"Muy positiva",
    frecuencia:(p.sesiones||[]).length+"",notas:""
  });
  const sesiones=p.sesiones||[];
  const completadas=sesiones.filter(s=>s.estado==="completada").length;
  const avgRpe=sesiones.filter(s=>s.rpeFinal).length>0?
    (sesiones.filter(s=>s.rpeFinal).reduce((a,s)=>a+s.rpeFinal,0)/sesiones.filter(s=>s.rpeFinal).length).toFixed(1):"—";
  const objAlcanzados=(p.objetivos||[]).filter(o=>o.completado);

  const handlePrint=()=>onPrint({form,sesiones,completadas,avgRpe,objAlcanzados,periodo:form.periodo});

  return(
    <div style={{maxWidth:720,margin:"0 auto",padding:"2rem 1.2rem",animation:"slideUp 0.4s ease"}}>
      <Volver onClick={onBack}/>
      <h2 style={{fontSize:"1.8rem",marginBottom:"0.3rem"}}>Informe para <em style={{color:"#6B4226"}}>Familia</em></h2>
      <p style={{fontFamily:"'DM Sans'",color:"#9B8B7A",fontSize:"0.8rem",marginBottom:"1.5rem"}}>{p.nombre} · {p.diagnostico} · Nivel {p.nivel}</p>

      <div style={{background:"rgba(107,66,38,0.06)",border:"1px solid rgba(107,66,38,0.15)",borderRadius:10,padding:"0.9rem 1.1rem",marginBottom:"1.2rem"}}>
        <p style={{fontFamily:"'DM Sans'",fontSize:"0.72rem",color:"#6B4226",lineHeight:1.6}}>💡 Este informe está pensado para las familias: lenguaje accesible, sin jerga clínica, con los avances más importantes del periodo.</p>
      </div>

      <Card2 title="Periodo y asistencia" icon="◎">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.6rem",marginBottom:"0.7rem"}}>
          <F label="Periodo"><In value={form.periodo} onChange={v=>setForm(f=>({...f,periodo:v}))} placeholder="Ej. Mayo 2026"/></F>
          <F label="Sesiones realizadas"><In value={form.frecuencia} onChange={v=>setForm(f=>({...f,frecuencia:v}))} placeholder="Número"/></F>
        </div>
        <F label="Actitud y participación">
          <div style={{display:"flex",flexWrap:"wrap",gap:"0.4rem",marginTop:"0.3rem"}}>
            {["Excelente","Muy positiva","Positiva","Variable","Necesita motivación"].map(a=><Chip key={a} label={a} sel={form.actitud===a} onSel={()=>setForm(f=>({...f,actitud:a}))}/>)}
          </div>
        </F>
      </Card2>

      <Card2 title="Logros del periodo" icon="◈">
        <p style={{fontFamily:"'DM Sans'",fontSize:"0.72rem",color:"#9B8B7A",marginBottom:"0.6rem"}}>¿Qué ha conseguido {p.nombre.split(" ")[0]} este periodo? Escríbelo en lenguaje sencillo para la familia.</p>
        {objAlcanzados.length>0&&(
          <div style={{display:"flex",flexWrap:"wrap",gap:"0.35rem",marginBottom:"0.7rem"}}>
            {objAlcanzados.map(o=><Tag key={o.nombre} label={"✓ "+o.nombre} color="#2D6A4F"/>)}
          </div>
        )}
        <textarea value={form.logros} onChange={e=>setForm(f=>({...f,logros:e.target.value}))} rows={4} placeholder={"Ej. "+p.nombre.split(" ")[0]+" ha mejorado su equilibrio al caminar, ya puede subir escaleras con menos ayuda y ha mostrado más seguridad en sus movimientos..."} style={{...IS,resize:"vertical",width:"100%"}}/>
      </Card2>

      <Card2 title="Objetivos próximo periodo" icon="◇">
        <textarea value={form.objetivos} onChange={e=>setForm(f=>({...f,objetivos:e.target.value}))} rows={3} placeholder={"Ej. Seguiremos trabajando en la marcha en terrenos irregulares, la fuerza de piernas y la autonomía en el vestuario..."} style={{...IS,resize:"vertical",width:"100%"}}/>
      </Card2>

      <Card2 title="Recomendaciones para casa" icon="◉">
        <textarea value={form.recomendaciones} onChange={e=>setForm(f=>({...f,recomendaciones:e.target.value}))} rows={3} placeholder={"Ej. Os recomendamos que en casa practiquéis subir y bajar escaleras siempre que podáis. También sería ideal dar paseos de 20 minutos 3 veces a la semana..."} style={{...IS,resize:"vertical",width:"100%"}}/>
      </Card2>

      <Card2 title="Nota personal (opcional)" icon="◈">
        <textarea value={form.notas} onChange={e=>setForm(f=>({...f,notas:e.target.value}))} rows={2} placeholder="Algo especial que la familia deba saber este mes..." style={{...IS,resize:"vertical",width:"100%"}}/>
      </Card2>

      <button onClick={handlePrint} className="btn" style={{width:"100%",padding:"0.95rem",background:"#6B4226",border:"none",borderRadius:10,color:"#fff",fontFamily:"'DM Sans'",fontWeight:700,fontSize:"0.92rem"}}>Generar informe para familia →</button>
    </div>
  );
}

// ─── VALORACIONES ─────────────────────────────────────────────────────────────
const ESCALAS_CONFIG = {
  "Síndrome de Down":[
    {nombre:"Escala de Barthel",rango:[0,100],step:5,desc:"Independencia en AVD. 100=independiente, 0=dependiente total.",etiquetas:{0:"Dependiente",20:"Gran dependencia",60:"Dependencia moderada",80:"Dependencia leve",100:"Independiente"}},
    {nombre:"Test de Tinetti (marcha)",rango:[0,28],step:1,desc:"Evaluación de la marcha y equilibrio. <19 = alto riesgo de caída.",etiquetas:{0:"Máximo riesgo",19:"Riesgo moderado",24:"Bajo riesgo",28:"Normal"}},
    {nombre:"GMFCS",rango:[1,5],step:1,desc:"Sistema de clasificación de función motora gruesa. 1=mínima limitación, 5=silla de ruedas.",etiquetas:{1:"Sin limitaciones",2:"Limitaciones al exterior",3:"Marcha con ayudas",4:"Silla en exterior",5:"Silla siempre"}},
  ],
  "TEA":[
    {nombre:"Sensory Profile 2",rango:[0,100],step:1,desc:"Perfil de procesamiento sensorial. Menor puntuación = mayor disfunción sensorial.",etiquetas:{0:"Disfunción severa",25:"Alta atipicidad",50:"Moderada",75:"Leve",100:"Normal"}},
    {nombre:"MABC-2 (percentil)",rango:[0,99],step:1,desc:"Batería de evaluación motora. <5p = dificultad motora significativa.",etiquetas:{0:"Dificultad severa",5:"Dificultad significativa",15:"Zona riesgo",50:"Normal"}},
    {nombre:"Escala de Barthel",rango:[0,100],step:5,desc:"Independencia en AVD.",etiquetas:{0:"Dependiente",60:"Dependencia moderada",100:"Independiente"}},
  ],
  "Daño Cerebral Adquirido":[
    {nombre:"FIM (Medida Independencia Funcional)",rango:[18,126],step:1,desc:"Evaluación de la carga de cuidado. 18=dependencia completa, 126=independencia.",etiquetas:{18:"Dependencia total",36:"Dependencia máxima",72:"Dependencia moderada",108:"Dependencia mínima",126:"Independiente"}},
    {nombre:"Test de Berg",rango:[0,56],step:1,desc:"Escala de equilibrio. <45 = alto riesgo de caída.",etiquetas:{0:"Alto riesgo",20:"Riesgo alto",36:"Riesgo moderado",45:"Bajo riesgo",56:"Sin riesgo"}},
    {nombre:"Ashworth Modificado",rango:[0,4],step:1,desc:"Grado de espasticidad. 0=sin aumento tono, 4=rigidez completa.",etiquetas:{0:"Sin espasticidad",1:"Ligero aumento",2:"Aumento marcado",3:"Considerable",4:"Rigidez completa"}},
  ],
  "Parálisis Cerebral":[
    {nombre:"GMFCS",rango:[1,5],step:1,desc:"Clasificación función motora gruesa.",etiquetas:{1:"Sin limitaciones",2:"Exterior limitado",3:"Marcha con ayudas",4:"Silla exterior",5:"Silla siempre"}},
    {nombre:"MACS",rango:[1,5],step:1,desc:"Clasificación habilidad manual. 1=manipula fácilmente, 5=no maneja objetos.",etiquetas:{1:"Sin limitaciones",2:"Objetos reducidos",3:"Dificultad manipulación",4:"Selección limitada",5:"No maneja objetos"}},
    {nombre:"GMFM-88 (% total)",rango:[0,100],step:1,desc:"Medida función motora gruesa. 100=función completa.",etiquetas:{0:"Sin función",25:"Función mínima",50:"Función moderada",75:"Buena función",100:"Función completa"}},
  ],
};

function Valoraciones({patient:p,onBack,onSave}){
  const escalasDisp=ESCALAS_CONFIG[p.diagnostico]||[];
  const valsPrevias=p.valoraciones||{};
  const [vals,setVals]=useState(()=>{
    const init={};
    escalasDisp.forEach(e=>{init[e.nombre]=valsPrevias[e.nombre]||[];});
    return init;
  });
  const [nuevaVal,setNuevaVal]=useState(()=>{
    const init={};
    escalasDisp.forEach(e=>{init[e.nombre]="";});
    return init;
  });

  const addVal=(escala,puntuacion)=>{
    if(puntuacion===""||isNaN(Number(puntuacion)))return;
    setVals(v=>({...v,[escala]:[...(v[escala]||[]),{fecha:hoy(),puntuacion:Number(puntuacion)}]}));
    setNuevaVal(v=>({...v,[escala]:""}));
  };

  const getEtiqueta=(esc,val)=>{
    const etiquetas=Object.entries(esc.etiquetas).map(([k,v])=>({k:Number(k),v})).sort((a,b)=>b.k-a.k);
    return etiquetas.find(e=>val>=e.k)?.v||"";
  };

  return(
    <div style={{maxWidth:720,margin:"0 auto",padding:"2rem 1.2rem",animation:"slideUp 0.4s ease"}}>
      <Volver onClick={onBack}/>
      <h2 style={{fontSize:"1.8rem",marginBottom:"0.3rem"}}>Registro de <em style={{color:"#1A1A2E"}}>Valoraciones</em></h2>
      <p style={{fontFamily:"'DM Sans'",color:"#9B8B7A",fontSize:"0.8rem",marginBottom:"1.5rem"}}>{p.nombre} · {p.diagnostico}</p>

      {escalasDisp.map(esc=>{
        const historial=vals[esc.nombre]||[];
        const ultima=historial[historial.length-1];
        const primera=historial[0];
        const mejora=primera&&ultima&&ultima!==primera?(ultima.puntuacion-primera.puntuacion):null;

        return(
          <Card2 key={esc.nombre} title={esc.nombre} icon="◇">
            <p style={{fontFamily:"'DM Sans'",fontSize:"0.72rem",color:"#9B8B7A",marginBottom:"0.8rem"}}>{esc.desc}</p>

            {ultima&&(
              <div style={{background:"rgba(45,106,79,0.05)",borderRadius:8,padding:"0.8rem",marginBottom:"0.8rem",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"0.5rem"}}>
                <div>
                  <p style={{fontFamily:"'DM Sans'",fontSize:"0.6rem",color:"#9B8B7A",textTransform:"uppercase",letterSpacing:"0.1em"}}>Última valoración · {ultima.fecha}</p>
                  <p style={{fontFamily:"'DM Serif Display'",fontSize:"1.6rem",color:"#2D6A4F"}}>{ultima.puntuacion}<span style={{fontFamily:"'DM Sans'",fontSize:"0.7rem",color:"#9B8B7A"}}> / {esc.rango[1]}</span></p>
                  <p style={{fontFamily:"'DM Sans'",fontSize:"0.72rem",color:"#6B4226",fontStyle:"italic"}}>{getEtiqueta(esc,ultima.puntuacion)}</p>
                </div>
                {mejora!==null&&(
                  <div style={{textAlign:"right"}}>
                    <p style={{fontFamily:"'DM Sans'",fontSize:"0.6rem",color:"#9B8B7A",textTransform:"uppercase",marginBottom:"0.2rem"}}>Evolución total</p>
                    <p style={{fontFamily:"'DM Serif Display'",fontSize:"1.3rem",color:mejora>0?"#2D6A4F":mejora<0?"#E74C3C":"#9B8B7A"}}>{mejora>0?"+":""}{mejora}</p>
                  </div>
                )}
              </div>
            )}

            {historial.length>1&&(
              <div style={{marginBottom:"0.8rem"}}>
                <p style={{fontFamily:"'DM Sans'",fontSize:"0.6rem",color:"#9B8B7A",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:"0.4rem"}}>Historial</p>
                <div style={{display:"flex",alignItems:"flex-end",gap:"4px",height:40,marginBottom:"0.3rem"}}>
                  {historial.slice(-8).map((v,i)=>{
                    const pct=((v.puntuacion-esc.rango[0])/(esc.rango[1]-esc.rango[0]))*100;
                    const isLast=i===historial.slice(-8).length-1;
                    return <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:"2px"}}><div style={{width:"100%",background:isLast?"#2D6A4F":"#D4C5B0",borderRadius:"2px 2px 0 0",height:`${Math.max(pct*0.4,2)}px`,transition:"height 0.3s"}}/><span style={{fontFamily:"'DM Sans'",fontSize:"0.5rem",color:isLast?"#2D6A4F":"#9B8B7A"}}>{v.puntuacion}</span></div>;
                  })}
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:"0.2rem",maxHeight:"100px",overflowY:"auto"}}>
                  {[...historial].reverse().map((v,i)=>(
                    <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"0.25rem 0",borderBottom:"1px solid #F5F2ED"}}>
                      <p style={{fontFamily:"'DM Sans'",fontSize:"0.72rem",color:"#9B8B7A"}}>{v.fecha}</p>
                      <p style={{fontFamily:"'DM Sans'",fontSize:"0.72rem",fontWeight:600,color:"#1A1A2E"}}>{v.puntuacion}/{esc.rango[1]} — {getEtiqueta(esc,v.puntuacion)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{display:"flex",gap:"0.5rem",alignItems:"flex-end"}}>
              <div style={{flex:1}}>
                <p style={{fontFamily:"'DM Sans'",fontSize:"0.6rem",color:"#9B8B7A",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"0.3rem"}}>Nueva puntuación ({esc.rango[0]}-{esc.rango[1]})</p>
                <input type="number" min={esc.rango[0]} max={esc.rango[1]} step={esc.step} value={nuevaVal[esc.nombre]} onChange={e=>setNuevaVal(v=>({...v,[esc.nombre]:e.target.value}))} placeholder={`${esc.rango[0]}–${esc.rango[1]}`} style={IS}/>
              </div>
              <button onClick={()=>addVal(esc.nombre,nuevaVal[esc.nombre])} className="btn" style={{padding:"0.65rem 1rem",background:"#2D6A4F",border:"none",borderRadius:8,color:"#fff",fontFamily:"'DM Sans'",fontWeight:600,fontSize:"0.8rem",whiteSpace:"nowrap"}}>Registrar</button>
            </div>
          </Card2>
        );
      })}

      <button onClick={()=>onSave(vals)} className="btn" style={{width:"100%",padding:"0.9rem",background:"#1A1A2E",border:"none",borderRadius:10,color:"#fff",fontFamily:"'DM Sans'",fontWeight:700,fontSize:"0.9rem"}}>Guardar valoraciones</button>
    </div>
  );
}

function FamiliasPrintContent({data,patient:p}){
  const {form,completadas,avgRpe,objAlcanzados}=data;
  return(
    <div>
      <div style={{background:"#F9F7F4",borderRadius:8,padding:"1rem",marginBottom:"1.2rem",borderLeft:"4px solid #6B4226"}}>
        <p style={{fontSize:"0.85rem",fontWeight:600,color:"#6B4226",marginBottom:"0.3rem"}}>Periodo: {form.periodo}</p>
        <p style={{fontSize:"0.83rem"}}>Sesiones realizadas: <b>{form.frecuencia}</b> · Completadas: <b>{completadas}</b> · Esfuerzo medio: <b>{avgRpe}/10</b></p>
        <p style={{fontSize:"0.83rem",marginTop:"0.2rem"}}>Actitud y participación: <b>{form.actitud}</b></p>
      </div>
      {objAlcanzados?.length>0&&<Section title="Objetivos alcanzados este periodo"><p style={{fontSize:"0.85rem"}}>{objAlcanzados.map(o=>o.nombre).join(" · ")}</p></Section>}
      {form.logros&&<Section title="Lo que ha conseguido este periodo"><p style={{fontSize:"0.85rem",lineHeight:1.7}}>{form.logros}</p></Section>}
      {form.objetivos&&<Section title="En qué seguiremos trabajando"><p style={{fontSize:"0.85rem",lineHeight:1.7}}>{form.objetivos}</p></Section>}
      {form.recomendaciones&&<Section title="Qué podéis hacer en casa"><p style={{fontSize:"0.85rem",lineHeight:1.7}}>{form.recomendaciones}</p></Section>}
      {form.notas&&<Section title="Nota personal"><p style={{fontSize:"0.85rem",lineHeight:1.7,fontStyle:"italic"}}>{form.notas}</p></Section>}
      <div style={{marginTop:"2rem",padding:"1rem",background:"#F9F7F4",borderRadius:8,borderLeft:"4px solid #2D6A4F"}}>
        <p style={{fontSize:"0.78rem",color:"#6B4226"}}>Este informe ha sido elaborado por <b>Borja Cotanda</b>, Fisioterapeuta Neurológico en ASINDOWN Valencia. Para cualquier consulta no dude en ponerse en contacto.</p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// COMPONENTES LENGUAJE BIMODAL
// ══════════════════════════════════════════════════════════════════
// ─── HOME ─────────────────────────────────────────────────────────────────────
function BimodalHome({ onNav, onOpenRpe, favs, allSignos, onSelSigno, patientContext }) {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "2rem 1.2rem", animation: "slideUp 0.5s ease" }}>
      <Volver onClick={()=>onNav("paciente")} />
      <div style={{ marginBottom: "2rem" }}>
        <p style={{ fontSize: "0.62rem", fontFamily: "'DM Sans'", letterSpacing: "0.15em", color: "#9B8B7A", textTransform: "uppercase", marginBottom: "0.3rem" }}>NEUROX · Módulo AAC</p>
        <h1 style={{ fontFamily: "'DM Serif Display'", fontSize: "clamp(1.8rem,5vw,2.8rem)", lineHeight: 1.05, marginBottom: "0.3rem" }}>
          Lenguaje <em style={{ color: "#2D6A4F", fontStyle: "italic" }}>Bimodal</em>
        </h1>
        <p style={{ fontSize: "0.78rem", color: "#9B8B7A" }}>Pictogramas ARASAAC + Signos bimodales · Comunicación aumentativa en sesión</p>
        {patientContext && <div style={{marginTop:"0.5rem",padding:"0.4rem 0.8rem",background:"rgba(45,106,79,0.08)",borderRadius:8,display:"inline-block"}}><p style={{fontFamily:"'DM Sans'",fontSize:"0.72rem",color:"#2D6A4F",fontWeight:600}}>{patientContext.nombre} · {patientContext.diagnostico}</p></div>}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.7rem", marginBottom: "1.2rem" }}>
        {[
          { label: "Repositorio", desc: "Todos los signos organizados por categoría", icon: "◈", color: "#2D6A4F", screen: "bimodal-repositorio" },
          { label: "Buscador", desc: "Busca signos y pictogramas ARASAAC", icon: "◎", color: "#1A1A2E", screen: "bimodal-buscador" },
          { label: "Tarjetas de sesión", desc: "Secuencia visual personalizada para el paciente", icon: "◇", color: "#6B4226", screen: "bimodal-tarjetas" },
          { label: "Favoritos", desc: `${favs.length} signos guardados`, icon: "◉", color: "#8E44AD", screen: "bimodal-favoritos" },
        ].map(m => (
          <div key={m.screen} onClick={() => onNav(m.screen)} className="hov" style={{ background: "#fff", borderRadius: 12, padding: "1.2rem", boxShadow: "0 2px 10px rgba(26,26,46,0.05)", border: "1px solid rgba(26,26,46,0.04)" }}>
            <div style={{ fontSize: "1.1rem", color: m.color, marginBottom: "0.6rem" }}>{m.icon}</div>
            <h3 style={{ fontFamily: "'DM Serif Display'", fontSize: "1rem", marginBottom: "0.2rem" }}>{m.label}</h3>
            <p style={{ fontSize: "0.7rem", color: "#9B8B7A", lineHeight: 1.4 }}>{m.desc}</p>
          </div>
        ))}
      </div>

      <button onClick={onOpenRpe} className="btn" style={{ width: "100%", padding: "1rem", background: "#1A1A2E", border: "none", borderRadius: 12, color: "#fff", fontFamily: "'DM Sans'", fontWeight: 700, fontSize: "0.9rem", marginBottom: "1.2rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem" }}>
        <span style={{ fontSize: "1.2rem" }}>😊</span> Escala RPE Bimodal — Modo Paciente
      </button>

      <div style={{ background: "#fff", borderRadius: 12, padding: "1.2rem", boxShadow: "0 2px 8px rgba(26,26,46,0.05)" }}>
        <p style={{ fontSize: "0.62rem", color: "#9B8B7A", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.8rem" }}>Acceso rápido · Más usados en sesión</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {["Empezar","Terminar","Parar","Bien","Dolor","Cansado","Repetir","Esperar","Caminar","Respirar","Contento","No"].map(p => {
            const s = allSignos.find(x => x.palabra === p);
            return s ? (
              <div key={p} onClick={() => onSelSigno(s)} className="hov" style={{ padding: "0.4rem 0.8rem", background: CATEGORIAS_COLOR[s.categoria] + "12", border: `1px solid ${CATEGORIAS_COLOR[s.categoria]}30`, borderRadius: 20, cursor: "pointer" }}>
                <p style={{ fontSize: "0.75rem", color: CATEGORIAS_COLOR[s.categoria], fontWeight: 500 }}>{p}</p>
              </div>
            ) : null;
          })}
        </div>
      </div>
    </div>
  );
}

// ─── REPOSITORIO ──────────────────────────────────────────────────────────────
function Repositorio({ onBack, onSelSigno, favs, onToggleFav }) {
  const [catActiva, setCatActiva] = useState(Object.keys(BIMODAL_DB)[0]);
  const categorias = Object.keys(BIMODAL_DB);

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "2rem 1.2rem", animation: "slideUp 0.4s ease" }}>
      <Volver onClick={onBack} />
      <h2 style={{ fontFamily: "'DM Serif Display'", fontSize: "1.8rem", marginBottom: "0.3rem" }}>Repositorio</h2>
      <p style={{ fontSize: "0.75rem", color: "#9B8B7A", marginBottom: "1.2rem" }}>{todosSignos.length} signos bimodales con pictograma ARASAAC</p>

      <div style={{ display: "flex", gap: "0.4rem", overflowX: "auto", paddingBottom: "0.5rem", marginBottom: "1.2rem" }}>
        {categorias.map(c => (
          <button key={c} onClick={() => setCatActiva(c)} style={{ padding: "0.45rem 0.9rem", background: catActiva === c ? "#1A1A2E" : "#fff", border: `1px solid ${catActiva === c ? "#1A1A2E" : "#E8E0D5"}`, borderRadius: 20, color: catActiva === c ? "#fff" : "#9B8B7A", fontFamily: "'DM Sans'", fontSize: "0.73rem", fontWeight: catActiva === c ? 600 : 400, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s" }}>{c}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "0.8rem" }}>
        {BIMODAL_DB[catActiva].map(s => (
          <SignoCard key={s.palabra} signo={s} onSel={() => onSelSigno(s)} isFav={favs.includes(s.palabra)} onToggleFav={() => onToggleFav(s.palabra)} />
        ))}
      </div>
    </div>
  );
}

// ─── SIGNO CARD ───────────────────────────────────────────────────────────────
function SignoCard({ signo: s, onSel, isFav, onToggleFav }) {
  const [imgError, setImgError] = useState(false);
  const imgSrc = !imgError ? getPictoUrl(s.arasaac) : null;

  return (
    <div onClick={onSel} className="hov" style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(26,26,46,0.06)", border: `1px solid ${s.color}20`, overflow: "hidden", position: "relative" }}>
      <button onClick={e => { e.stopPropagation(); onToggleFav(); }} style={{ position: "absolute", top: 6, right: 6, background: isFav ? "#F39C12" : "rgba(255,255,255,0.8)", border: "none", borderRadius: "50%", width: 24, height: 24, cursor: "pointer", fontSize: "0.65rem", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}>
        {isFav ? "★" : "☆"}
      </button>
      <div style={{ background: s.color + "10", height: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {imgSrc ? (
          <img src={imgSrc} alt={s.palabra} style={{ width: 80, height: 80, objectFit: "contain" }} onError={() => setImgError(true)} />
        ) : (
          <span style={{ fontSize: "2.5rem" }}>{getFallbackEmoji(s.palabra)}</span>
        )}
      </div>
      <div style={{ padding: "0.6rem 0.7rem" }}>
        <p style={{ fontFamily: "'DM Sans'", fontWeight: 700, fontSize: "0.82rem", color: "#1A1A2E", marginBottom: "0.15rem" }}>{s.palabra}</p>
        <p style={{ fontSize: "0.62rem", color: s.color, textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.categoria}</p>
      </div>
    </div>
  );
}

// ─── DETALLE SIGNO ────────────────────────────────────────────────────────────
function DetalleSigno({ signo: s, onBack, isFav, onToggleFav }) {
  const [imgError, setImgError] = useState(false);
  const imgSrc = !imgError ? getPictoUrl(s.arasaac) : null;
  const [modoKiosko, setModoKiosko] = useState(false);

  if (modoKiosko) return (
    <div onClick={() => setModoKiosko(false)} style={{ minHeight: "100vh", background: s.color, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem", cursor: "pointer", animation: "fadeIn 0.3s ease" }}>
      <p style={{ fontFamily: "'DM Sans'", fontSize: "0.7rem", color: "rgba(255,255,255,0.5)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1rem" }}>Toca para volver</p>
      {imgSrc 
        ? <img src={imgSrc} alt={s.palabra} style={{ width: "min(70vw, 280px)", height: "min(70vw, 280px)", objectFit: "contain", marginBottom: "1.5rem" }} onError={() => setImgError(true)} />
        : <span style={{ fontSize: "8rem", marginBottom: "1.5rem", display:"block" }}>{getFallbackEmoji(s.palabra)}</span>}
      <h1 style={{ fontFamily: "'DM Serif Display'", fontSize: "clamp(3rem,10vw,6rem)", color: "#fff", textAlign: "center", lineHeight: 1 }}>{s.palabra}</h1>
      <p style={{ fontFamily: "'DM Sans'", fontSize: "clamp(0.9rem,3vw,1.3rem)", color: "rgba(255,255,255,0.8)", textAlign: "center", maxWidth: 500, marginTop: "1.5rem", lineHeight: 1.6 }}>{s.signo}</p>
    </div>
  );

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "2rem 1.2rem", animation: "slideUp 0.4s ease" }}>
      <Volver onClick={onBack} />

      <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 4px 24px rgba(26,26,46,0.08)", overflow: "hidden", marginBottom: "1rem" }}>
        <div style={{ background: s.color + "15", padding: "2rem", display: "flex", justifyContent: "center", alignItems: "center", minHeight: 180 }}>
          {imgSrc ? (
            <img src={imgSrc} alt={s.palabra} style={{ width: 150, height: 150, objectFit: "contain" }} onError={() => setImgError(true)} />
          ) : (
            <span style={{ fontSize: "5rem", display:"flex",alignItems:"center",justifyContent:"center" }}>{getFallbackEmoji(s.palabra)}</span>
          )}
        </div>
        <div style={{ padding: "1.4rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.8rem" }}>
            <div>
              <h2 style={{ fontFamily: "'DM Serif Display'", fontSize: "2rem", color: "#1A1A2E", marginBottom: "0.2rem" }}>{s.palabra}</h2>
              <span style={{ fontSize: "0.65rem", color: s.color, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>{s.categoria}</span>
            </div>
            <button onClick={onToggleFav} style={{ padding: "0.4rem 0.8rem", background: isFav ? "#F39C12" : "transparent", border: `1px solid ${isFav ? "#F39C12" : "#E8E0D5"}`, borderRadius: 8, color: isFav ? "#fff" : "#9B8B7A", fontFamily: "'DM Sans'", fontSize: "0.75rem", cursor: "pointer" }}>
              {isFav ? "★ Guardado" : "☆ Guardar"}
            </button>
          </div>

          <div style={{ background: s.color + "10", borderRadius: 10, padding: "1rem 1.2rem", marginBottom: "1rem", borderLeft: `3px solid ${s.color}` }}>
            <p style={{ fontSize: "0.62rem", color: s.color, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.4rem", fontWeight: 600 }}>Cómo hacer el signo</p>
            <p style={{ fontSize: "0.9rem", color: "#1A1A2E", lineHeight: 1.7 }}>{s.signo}</p>
          </div>

          <div style={{ background: "#F7F4EF", borderRadius: 8, padding: "0.8rem 1rem" }}>
            <p style={{ fontSize: "0.62rem", color: "#9B8B7A", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.3rem" }}>Uso en sesión</p>
            <p style={{ fontSize: "0.8rem", color: "#6B4226", lineHeight: 1.6 }}>
              {s.categoria === "rutina" && "Usa este signo + palabra hablada simultáneamente para estructurar la sesión. La predictibilidad reduce la ansiedad."}
              {s.categoria === "ejercicio" && "Muestra el signo antes y durante el ejercicio. El paciente aprende la asociación signo-movimiento."}
              {s.categoria === "cuerpo" && "Úsalo para preguntar '¿dónde te duele?' señalando las partes del cuerpo con el signo."}
              {s.categoria === "emocion" && "Pregunta '¿cómo estás?' al inicio de la sesión usando estos signos. Mejora la comunicación emocional."}
              {s.categoria === "material" && "Nombra los materiales con el signo antes de usarlos. Anticipa la actividad y reduce resistencias."}
              {s.categoria === "rpe" && "Muestra el pictograma al paciente y pídele que señale o imite el signo que mejor describe su esfuerzo."}
            </p>
          </div>
        </div>
      </div>

      <button onClick={() => setModoKiosko(true)} className="btn" style={{ width: "100%", padding: "1rem", background: s.color, border: "none", borderRadius: 12, color: "#fff", fontFamily: "'DM Sans'", fontWeight: 700, fontSize: "0.92rem", letterSpacing: "0.02em" }}>
        📱 Mostrar al paciente — Modo pantalla completa
      </button>
    </div>
  );
}

// ─── BUSCADOR ────────────────────────────────────────────────────────────────
function Buscador({ onBack, query, setQuery, results, setResults, searching, setSearching, localSignos, onSelSigno }) {
  const ARASAAC_SEARCH = "https://api.arasaac.org/v1/pictograms/es/search/";

  useEffect(() => {
    if (!query || query.length < 2) { setResults([]); return; }
    const t = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(ARASAAC_SEARCH + encodeURIComponent(query));
        const data = await res.json();
        setResults((data || []).slice(0, 12));
      } catch { setResults([]); }
      finally { setSearching(false); }
    }, 500);
    return () => clearTimeout(t);
  }, [query]);

  const localFiltrados = query.length > 1
    ? localSignos.filter(s => s.palabra.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "2rem 1.2rem", animation: "slideUp 0.4s ease" }}>
      <Volver onClick={onBack} />
      <h2 style={{ fontFamily: "'DM Serif Display'", fontSize: "1.8rem", marginBottom: "0.3rem" }}>Buscador</h2>
      <p style={{ fontSize: "0.75rem", color: "#9B8B7A", marginBottom: "1.2rem" }}>Signos del repositorio + pictogramas ARASAAC en tiempo real</p>

      <div style={{ position: "relative", marginBottom: "1.2rem" }}>
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar signo o pictograma... (ej: caminar, pelota, dolor)" style={{ width: "100%", padding: "0.8rem 1rem 0.8rem 2.8rem", border: "1.5px solid #E8E0D5", borderRadius: 10, fontFamily: "'DM Sans'", fontSize: "0.88rem", color: "#1A1A2E", background: "#fff", outline: "none" }} />
        <span style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#9B8B7A" }}>🔍</span>
        {searching && <div style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", width: 16, height: 16, border: "2px solid #E8E0D5", borderTopColor: "#2D6A4F", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />}
      </div>

      {localFiltrados.length > 0 && (
        <div style={{ marginBottom: "1.5rem" }}>
          <p style={{ fontSize: "0.62rem", color: "#9B8B7A", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.7rem" }}>En el repositorio bimodal</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {localFiltrados.map(s => (
              <div key={s.palabra} onClick={() => onSelSigno(s)} className="hov" style={{ padding: "0.45rem 0.9rem", background: s.color + "12", border: `1px solid ${s.color}30`, borderRadius: 20, cursor: "pointer" }}>
                <p style={{ fontSize: "0.8rem", color: s.color, fontWeight: 600 }}>{s.palabra}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div>
          <p style={{ fontSize: "0.62rem", color: "#9B8B7A", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.7rem" }}>Pictogramas ARASAAC · {results.length} resultados</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "0.7rem" }}>
            {results.map(r => (
              <div key={r._id} className="hov" style={{ background: "#fff", borderRadius: 10, boxShadow: "0 2px 8px rgba(26,26,46,0.06)", overflow: "hidden" }}>
                <div style={{ background: "#F7F4EF", padding: "0.8rem", display: "flex", justifyContent: "center" }}>
                  <img src={ARASAAC_IMG(r._id)} alt={r.keywords?.[0]?.keyword || ""} style={{ width: 80, height: 80, objectFit: "contain" }} onError={e => e.target.style.display = "none"} />
                </div>
                <div style={{ padding: "0.5rem 0.6rem" }}>
                  <p style={{ fontSize: "0.72rem", fontWeight: 600, color: "#1A1A2E", textAlign: "center" }}>{r.keywords?.[0]?.keyword || "—"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {query.length > 1 && !searching && results.length === 0 && localFiltrados.length === 0 && (
        <div style={{ textAlign: "center", padding: "3rem 0", color: "#CCC" }}>
          <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🔍</p>
          <p style={{ fontSize: "0.82rem" }}>Sin resultados para "{query}"</p>
        </div>
      )}

      {query.length === 0 && (
        <div style={{ background: "#fff", borderRadius: 12, padding: "1.2rem", boxShadow: "0 2px 8px rgba(26,26,46,0.05)" }}>
          <p style={{ fontSize: "0.62rem", color: "#9B8B7A", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.7rem" }}>Búsquedas frecuentes</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
            {["caminar","pelota","dolor","contento","agua","saltar","respirar","silla","correr","equilibrio"].map(q => (
              <div key={q} onClick={() => setQuery(q)} style={{ padding: "0.35rem 0.75rem", background: "#F7F4EF", borderRadius: 20, cursor: "pointer", fontSize: "0.78rem", color: "#6B4226" }}>{q}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── TARJETAS DE SESIÓN ───────────────────────────────────────────────────────
function TarjetasSesion({ onBack, patientContext, onSelSigno }) {
  const [config, setConfig] = useState({
    diagnostico: patientContext?.diagnostico || "Síndrome de Down",
    nombre: patientContext?.nombre || "Paciente"
  });
  const [fase, setFase] = useState("Inicio");
  const [modoPrint, setModoPrint] = useState(false);
  const secuencias = SESION_SECUENCIAS[config.diagnostico] || {};
  const fases = Object.keys(secuencias);
  const signosActuales = (secuencias[fase] || []).map(p => todosSignos.find(s => s.palabra === p)).filter(Boolean);

  if (modoPrint) return <TarjetasImprimibles config={config} secuencias={secuencias} onClose={() => setModoPrint(false)} />;

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "2rem 1.2rem", animation: "slideUp 0.4s ease" }}>
      <Volver onClick={onBack} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.2rem" }}>
        <div>
          <h2 style={{ fontFamily: "'DM Serif Display'", fontSize: "1.8rem", marginBottom: "0.2rem" }}>Tarjetas de Sesión</h2>
          <p style={{ fontSize: "0.75rem", color: "#9B8B7A" }}>Secuencia visual para el paciente antes y durante la sesión</p>
        </div>
        <button onClick={() => setModoPrint(true)} className="btn" style={{ padding: "0.5rem 0.9rem", background: "#1A1A2E", border: "none", borderRadius: 8, color: "#fff", fontFamily: "'DM Sans'", fontSize: "0.74rem" }}>Imprimir</button>
      </div>

      <div style={{ background: "#fff", borderRadius: 12, padding: "1.1rem", marginBottom: "1.1rem", boxShadow: "0 2px 8px rgba(26,26,46,0.05)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
          <div>
            <p style={{ fontSize: "0.6rem", color: "#9B8B7A", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.3rem" }}>Diagnóstico</p>
            <select value={config.diagnostico} onChange={e => setConfig(c => ({ ...c, diagnostico: e.target.value }))} style={{ width: "100%", padding: "0.55rem 0.7rem", border: "1px solid #E8E0D5", borderRadius: 7, fontFamily: "'DM Sans'", fontSize: "0.82rem", color: "#1A1A2E", background: "#fff", outline: "none" }}>
              {["Síndrome de Down","TEA","Daño Cerebral Adquirido","Parálisis Cerebral"].map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <p style={{ fontSize: "0.6rem", color: "#9B8B7A", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.3rem" }}>Nombre paciente</p>
            <input value={config.nombre} onChange={e => setConfig(c => ({ ...c, nombre: e.target.value }))} style={{ width: "100%", padding: "0.55rem 0.7rem", border: "1px solid #E8E0D5", borderRadius: 7, fontFamily: "'DM Sans'", fontSize: "0.82rem", outline: "none" }} />
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "0.4rem", overflowX: "auto", paddingBottom: "0.4rem", marginBottom: "1rem" }}>
        {fases.map(f => (
          <button key={f} onClick={() => setFase(f)} style={{ padding: "0.45rem 0.9rem", background: fase === f ? "#2D6A4F" : "#fff", border: `1px solid ${fase === f ? "#2D6A4F" : "#E8E0D5"}`, borderRadius: 20, color: fase === f ? "#fff" : "#9B8B7A", fontFamily: "'DM Sans'", fontSize: "0.73rem", fontWeight: fase === f ? 600 : 400, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s" }}>{f}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "0.7rem" }}>
        {signosActuales.map((s, i) => (
          <TarjetaSigno key={s.palabra} signo={s} orden={i + 1} onSel={() => onSelSigno(s)} />
        ))}
      </div>

      <div style={{ marginTop: "1rem", background: "rgba(45,106,79,0.05)", borderRadius: 10, padding: "0.8rem 1rem", border: "1px solid rgba(45,106,79,0.1)" }}>
        <p style={{ fontSize: "0.72rem", color: "#2D6A4F", lineHeight: 1.6 }}>💡 Muestra estas tarjetas al paciente al inicio de la sesión para anticipar la secuencia. Toca cada tarjeta para ver el signo en pantalla completa y cómo hacerlo.</p>
      </div>
    </div>
  );
}

function TarjetaSigno({ signo: s, orden, onSel }) {
  const imgSrc = getPictoUrl(s.arasaac);

  return (
    <div onClick={onSel} className="hov" style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(26,26,46,0.07)", overflow: "hidden", border: `1.5px solid ${s.color}25` }}>
      <div style={{ background: s.color + "12", padding: "0.8rem", display: "flex", justifyContent: "center", alignItems: "center", height: 100, position: "relative" }}>
        <div style={{ position: "absolute", top: 6, left: 6, width: 22, height: 22, borderRadius: "50%", background: s.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "#fff", fontSize: "0.65rem", fontWeight: 700 }}>{orden}</span>
        </div>
        {imgSrc ? (
          <img src={imgSrc} alt={s.palabra} style={{ width: 72, height: 72, objectFit: "contain" }} onError={() => setImgError(true)} />
        ) : (
          <span style={{ fontSize: "2.2rem" }}>{getFallbackEmoji(s.palabra)}</span>
        )}
      </div>
      <div style={{ padding: "0.5rem 0.7rem", textAlign: "center" }}>
        <p style={{ fontFamily: "'DM Sans'", fontWeight: 700, fontSize: "0.8rem", color: "#1A1A2E" }}>{s.palabra}</p>
      </div>
    </div>
  );
}

// ─── TARJETAS IMPRIMIBLES ─────────────────────────────────────────────────────
function TarjetasImprimibles({ config, secuencias, onClose }) {
  useEffect(() => { setTimeout(() => window.print(), 400); }, []);
  const todasFases = Object.entries(secuencias);

  return (
    <div style={{ background: "#fff", padding: "1.5rem", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@media print{.no-print{display:none!important;}body{background:white;}.pagina{page-break-after:always;}}.tarjeta-print{display:inline-flex;flex-direction:column;align-items:center;border:2px solid #E8E0D5;border-radius:8px;padding:0.5rem;margin:0.3rem;width:120px;vertical-align:top;text-align:center;}.tarjeta-print img{width:80px;height:80px;object-fit:contain;}.tarjeta-print p{font-size:0.75rem;font-weight:700;margin-top:0.3rem;}`}</style>

      <div className="no-print" style={{ marginBottom: "1.5rem", display: "flex", gap: "0.7rem" }}>
        <button onClick={() => window.print()} style={{ padding: "0.6rem 1.2rem", background: "#2D6A4F", border: "none", borderRadius: 8, color: "#fff", fontFamily: "'DM Sans'", cursor: "pointer", fontWeight: 600, fontSize: "0.82rem" }}>🖨 Imprimir tarjetas</button>
        <button onClick={onClose} style={{ padding: "0.6rem 1.2rem", background: "transparent", border: "1px solid #E8E0D5", borderRadius: 8, color: "#9B8B7A", fontFamily: "'DM Sans'", cursor: "pointer", fontSize: "0.82rem" }}>← Volver</button>
      </div>

      <div style={{ borderBottom: "2px solid #1A1A2E", paddingBottom: "0.8rem", marginBottom: "1.5rem" }}>
        <h2 style={{ fontFamily: "'DM Serif Display'", fontSize: "1.5rem", marginBottom: "0.2rem" }}>Tarjetas de Sesión — {config.nombre}</h2>
        <p style={{ fontSize: "0.75rem", color: "#9B8B7A" }}>{config.diagnostico} · NEUROX · Borja Cotanda · ASINDOWN Valencia</p>
      </div>

      {todasFases.map(([fase, signosNombres]) => {
        const signos = signosNombres.map(p => todosSignos.find(s => s.palabra === p)).filter(Boolean);
        return (
          <div key={fase} style={{ marginBottom: "1.5rem" }}>
            <p style={{ fontSize: "0.65rem", color: "#9B8B7A", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.6rem", fontWeight: 600 }}>{fase}</p>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {signos.map((s, i) => <TarjetaPrint key={s.palabra} signo={s} orden={i + 1} />)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TarjetaPrint({ signo: s, orden }) {
  const imgSrc = getPictoUrl(s.arasaac);

  return (
    <div className="tarjeta-print" style={{ borderColor: s.color + "50" }}>
      <div style={{ width: 20, height: 20, borderRadius: "50%", background: s.color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.3rem" }}>
        <span style={{ color: "#fff", fontSize: "0.6rem", fontWeight: 700 }}>{orden}</span>
      </div>
      {imgSrc ? <img src={imgSrc} alt={s.palabra} /> : <div style={{ width: 80, height: 80, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem" }}>{getFallbackEmoji(s.palabra)}</div>}
      <p style={{ color: "#1A1A2E", fontSize: "0.75rem", fontWeight: 700 }}>{s.palabra}</p>
      <p style={{ color: "#9B8B7A", fontSize: "0.55rem", marginTop: "0.15rem" }}>{s.signo.slice(0, 50)}...</p>
    </div>
  );
}

// ─── FAVORITOS ────────────────────────────────────────────────────────────────
function Favoritos({ onBack, favs, allSignos, onSelSigno, onToggleFav }) {
  const favSignos = allSignos.filter(s => favs.includes(s.palabra));
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "2rem 1.2rem", animation: "slideUp 0.4s ease" }}>
      <Volver onClick={onBack} />
      <h2 style={{ fontFamily: "'DM Serif Display'", fontSize: "1.8rem", marginBottom: "0.3rem" }}>Favoritos</h2>
      <p style={{ fontSize: "0.75rem", color: "#9B8B7A", marginBottom: "1.2rem" }}>{favSignos.length} signos guardados</p>
      {favSignos.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem 0", color: "#CCC" }}>
          <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>☆</p>
          <p style={{ fontSize: "0.82rem" }}>Sin favoritos aún. Toca la estrella en cualquier signo para guardarlo aquí.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "0.8rem" }}>
          {favSignos.map(s => <SignoCard key={s.palabra} signo={s} onSel={() => onSelSigno(s)} isFav={true} onToggleFav={() => onToggleFav(s.palabra)} />)}
        </div>
      )}
    </div>
  );
}

// ─── RPE BIMODAL ──────────────────────────────────────────────────────────────
function RPEBimodal({ onClose }) {
  const [sel, setSel] = useState(null);
  const niveles = BIMODAL_DB["Esfuerzo (RPE bimodal)"];

  return (
    <div style={{ minHeight: "100vh", background: "#0D1B0F", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "1.5rem", animation: "fadeIn 0.3s ease" }}>
      <style>{`@keyframes fadeIn{from{opacity:0;}to{opacity:1;}}`}</style>
      <div style={{ width: "100%", maxWidth: 500 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
          <p style={{ fontFamily: "'DM Sans'", fontSize: "0.6rem", color: "rgba(255,255,255,0.25)", letterSpacing: "0.15em", textTransform: "uppercase" }}>ESCALA RPE · LENGUAJE BIMODAL · NEUROX</p>
          <button onClick={onClose} style={{ color: "rgba(255,255,255,0.3)", background: "transparent", border: "none", cursor: "pointer", fontSize: "1.2rem" }}>×</button>
        </div>
        <h2 style={{ fontFamily: "'DM Serif Display'", fontSize: "clamp(1.3rem,4vw,1.9rem)", color: "#fff", marginBottom: "0.2rem" }}>¿Cómo estás?</h2>
        <p style={{ fontFamily: "'DM Sans'", fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", marginBottom: "1.5rem" }}>Toca la imagen que muestra cómo te sientes ahora</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.2rem" }}>
          {niveles.map(n => {
            const imgSrc = getPictoUrl(n.arasaac);
            return (
              <div key={n.palabra} onClick={() => setSel(n)} style={{ display: "flex", alignItems: "center", gap: "0.9rem", padding: "0.7rem 1rem", borderRadius: 12, background: sel?.palabra === n.palabra ? n.color + "25" : "rgba(255,255,255,0.04)", border: `1.5px solid ${sel?.palabra === n.palabra ? n.color : "rgba(255,255,255,0.06)"}`, cursor: "pointer", transition: "all 0.15s" }}>
                <div style={{ width: 52, height: 52, borderRadius: 8, background: n.color + "20", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {imgSrc ? <img src={imgSrc} alt={n.palabra} style={{ width: 44, height: 44, objectFit: "contain" }} onError={e => e.target.style.display="none"} /> : <span style={{ fontSize: "1.6rem" }}>{getFallbackEmoji(n.palabra)}</span>}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: "'DM Sans'", fontWeight: 700, fontSize: "0.88rem", color: sel?.palabra === n.palabra ? n.color : "#fff", marginBottom: "0.1rem" }}>{n.palabra}</p>
                  <p style={{ fontFamily: "'DM Sans'", fontSize: "0.68rem", color: "rgba(255,255,255,0.3)" }}>{n.signo.slice(0, 60)}...</p>
                </div>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: n.color, opacity: sel?.palabra === n.palabra ? 1 : 0.2 }} />
              </div>
            );
          })}
        </div>

        {sel && (
          <div style={{ animation: "fadeIn 0.2s ease" }}>
            <div style={{ padding: "1rem", background: sel.color + "20", borderRadius: 10, border: `1px solid ${sel.color}40`, marginBottom: "0.8rem" }}>
              <p style={{ fontFamily: "'DM Sans'", fontSize: "0.75rem", color: sel.color, marginBottom: "0.3rem", fontWeight: 600 }}>Signo a usar:</p>
              <p style={{ fontFamily: "'DM Sans'", fontSize: "0.85rem", color: "#fff", lineHeight: 1.6 }}>{sel.signo}</p>
            </div>
            <button onClick={onClose} style={{ width: "100%", padding: "0.95rem", background: sel.color, border: "none", borderRadius: 12, color: "#fff", fontFamily: "'DM Sans'", fontWeight: 700, fontSize: "0.95rem" }}>
              Registrado: {sel.palabra} ✓
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ESCALAS CLÍNICAS ──────────────────────────────────────────────────────
const ESCALAS_COMPLETAS = {
  "Síndrome de Down": [
    {
      nombre: "Escala de Barthel",
      acronimo: "BARTHEL",
      descripcion: "Mide la independencia en actividades básicas de la vida diaria (AVD). Ampliamente validada en discapacidad intelectual y síndromes neurológicos.",
      rango: [0, 100], paso: 5,
      interpretacion: [
        {min:0, max:20, label:"Dependencia total", color:"#E74C3C", desc:"Precisa ayuda en todas las AVD"},
        {min:21, max:40, label:"Dependencia severa", color:"#E67E22", desc:"Requiere ayuda en la mayoría de AVD"},
        {min:41, max:60, label:"Dependencia moderada", color:"#F39C12", desc:"Necesita supervisión y ayuda parcial"},
        {min:61, max:80, label:"Dependencia leve", color:"#2ECC71", desc:"Realiza la mayoría con supervisión"},
        {min:81, max:100, label:"Independiente", color:"#27AE60", desc:"Independiente en todas las AVD básicas"},
      ],
      items: [
        {nombre:"Alimentación", opciones:[{v:0,d:"Incapaz"},{v:5,d:"Necesita ayuda"},{v:10,d:"Independiente"}]},
        {nombre:"Baño", opciones:[{v:0,d:"Dependiente"},{v:5,d:"Independiente"}]},
        {nombre:"Aseo personal", opciones:[{v:0,d:"Necesita ayuda"},{v:5,d:"Independiente"}]},
        {nombre:"Vestido", opciones:[{v:0,d:"Dependiente"},{v:5,d:"Necesita ayuda"},{v:10,d:"Independiente"}]},
        {nombre:"Deposición", opciones:[{v:0,d:"Incontinente"},{v:5,d:"Accidente ocasional"},{v:10,d:"Continente"}]},
        {nombre:"Micción", opciones:[{v:0,d:"Incontinente"},{v:5,d:"Accidente ocasional"},{v:10,d:"Continente"}]},
        {nombre:"Uso del WC", opciones:[{v:0,d:"Dependiente"},{v:5,d:"Necesita ayuda"},{v:10,d:"Independiente"}]},
        {nombre:"Traslado silla-cama", opciones:[{v:0,d:"Incapaz"},{v:5,d:"Gran ayuda"},{v:10,d:"Mínima ayuda"},{v:15,d:"Independiente"}]},
        {nombre:"Deambulación", opciones:[{v:0,d:"Inmóvil"},{v:5,d:"Silla de ruedas"},{v:10,d:"Camina con ayuda"},{v:15,d:"Independiente"}]},
        {nombre:"Escaleras", opciones:[{v:0,d:"Incapaz"},{v:5,d:"Necesita ayuda"},{v:10,d:"Independiente"}]},
      ],
    },
    {
      nombre: "Test de Tinetti",
      acronimo: "TINETTI",
      descripcion: "Evalúa marcha y equilibrio. Predice riesgo de caída. Muy útil en SD con hipotonía y laxitud ligamentosa.",
      rango: [0, 28], paso: 1,
      interpretacion: [
        {min:0, max:18, label:"Alto riesgo de caída", color:"#E74C3C", desc:"Intervención prioritaria en equilibrio y marcha"},
        {min:19, max:23, label:"Riesgo moderado", color:"#F39C12", desc:"Trabajar equilibrio dinámico y marcha"},
        {min:24, max:28, label:"Bajo riesgo", color:"#27AE60", desc:"Mantenimiento y prevención"},
      ],
      items: [
        {nombre:"Equilibrio sentado", opciones:[{v:0,d:"Se inclina/resbala"},{v:1,d:"Seguro, estable"}]},
        {nombre:"Levantarse de silla", opciones:[{v:0,d:"Incapaz sin ayuda"},{v:1,d:"Capaz, usa brazos"},{v:2,d:"Capaz sin usar brazos"}]},
        {nombre:"Intentos para levantarse", opciones:[{v:0,d:"Incapaz sin ayuda"},{v:1,d:"Más de un intento"},{v:2,d:"Un solo intento"}]},
        {nombre:"Equilibrio inmediato", opciones:[{v:0,d:"Inestable"},{v:1,d:"Estable con apoyo"},{v:2,d:"Estable sin apoyo"}]},
        {nombre:"Equilibrio de pie", opciones:[{v:0,d:"Inestable"},{v:1,d:"Estable pies separados/apoyo"},{v:2,d:"Pies juntos, sin apoyo"}]},
        {nombre:"Empuje (esternón)", opciones:[{v:0,d:"Cae"},{v:1,d:"Se tambalea"},{v:2,d:"Estable"}]},
        {nombre:"Ojos cerrados", opciones:[{v:0,d:"Inestable"},{v:1,d:"Estable"}]},
        {nombre:"Vuelta 360°", opciones:[{v:0,d:"Pasos discontinuos"},{v:1,d:"Pasos continuos"}]},
        {nombre:"Sentarse", opciones:[{v:0,d:"Inseguro"},{v:1,d:"Usa brazos o movimiento brusco"},{v:2,d:"Seguro, movimiento suave"}]},
        {nombre:"Inicio de la marcha", opciones:[{v:0,d:"Vacilación/múltiples intentos"},{v:1,d:"Sin vacilación"}]},
        {nombre:"Longitud del paso D", opciones:[{v:0,d:"No sobrepasa pie contrario"},{v:1,d:"Sobrepasa pie contrario"}]},
        {nombre:"Longitud del paso I", opciones:[{v:0,d:"No sobrepasa pie contrario"},{v:1,d:"Sobrepasa pie contrario"}]},
        {nombre:"Simetría del paso", opciones:[{v:0,d:"Asimétrico"},{v:1,d:"Simétrico"}]},
        {nombre:"Continuidad del paso", opciones:[{v:0,d:"Discontinuo"},{v:1,d:"Continuo"}]},
        {nombre:"Trayectoria", opciones:[{v:0,d:"Desviación marcada"},{v:1,d:"Desviación leve"},{v:2,d:"Línea recta"}]},
        {nombre:"Tronco", opciones:[{v:0,d:"Balanceo marcado"},{v:1,d:"Sin balanceo, usa ayudas"},{v:2,d:"Sin balanceo ni ayudas"}]},
        {nombre:"Posición al caminar", opciones:[{v:0,d:"Talones separados"},{v:1,d:"Talones casi juntos"}]},
      ],
    },
    {
      nombre: "GMFCS — Clasificación Función Motora",
      acronimo: "GMFCS",
      descripcion: "Clasifica la función motora gruesa. Permite establecer objetivos realistas y comunicar el nivel funcional al equipo.",
      rango: [1, 5], paso: 1,
      interpretacion: [
        {min:1, max:1, label:"Nivel I — Sin limitaciones", color:"#27AE60", desc:"Camina sin restricciones. Limitaciones en habilidades motoras avanzadas"},
        {min:2, max:2, label:"Nivel II — Limitaciones exteriores", color:"#2ECC71", desc:"Camina en interior. Dificultad en superficies irregulares y multitudes"},
        {min:3, max:3, label:"Nivel III — Marcha con ayudas", color:"#F39C12", desc:"Camina con ayudas técnicas. Silla de ruedas para largas distancias"},
        {min:4, max:4, label:"Nivel IV — Silla en exteriores", color:"#E67E22", desc:"Movilidad autónoma limitada. Silla de ruedas eléctrica"},
        {min:5, max:5, label:"Nivel V — Dependencia total", color:"#E74C3C", desc:"Transportado. Capacidad limitada de mantener postura"},
      ],
      items: [],
    },
    {
      nombre: "MACS — Habilidad Manual",
      acronimo: "MACS",
      descripcion: "Clasifica cómo los niños/adultos usan sus manos al manipular objetos en actividades cotidianas.",
      rango: [1, 5], paso: 1,
      interpretacion: [
        {min:1, max:1, label:"Nivel I — Sin limitaciones", color:"#27AE60", desc:"Manipula objetos fácilmente con éxito"},
        {min:2, max:2, label:"Nivel II — Objetos reducidos", color:"#2ECC71", desc:"Manipula la mayoría de objetos con lentitud o menor calidad"},
        {min:3, max:3, label:"Nivel III — Dificultad manipulación", color:"#F39C12", desc:"Manipula objetos con dificultad, necesita ayuda para preparar/adaptar actividades"},
        {min:4, max:4, label:"Nivel IV — Selección limitada", color:"#E67E22", desc:"Manipula una selección limitada de objetos adaptados"},
        {min:5, max:5, label:"Nivel V — No maneja objetos", color:"#E74C3C", desc:"No maneja objetos. Capacidad muy limitada de realizar acciones sencillas"},
      ],
      items: [],
    },
  ],
  "TEA": [
    {
      nombre: "MABC-2 (Percentil)",
      acronimo: "MABC-2",
      descripcion: "Batería de evaluación motora. Detecta dificultades motrices que afectan a la participación en actividades físicas.",
      rango: [0, 99], paso: 1,
      interpretacion: [
        {min:0, max:5, label:"Dificultad motriz significativa", color:"#E74C3C", desc:"Intervención fisioterapéutica prioritaria"},
        {min:6, max:15, label:"Zona de riesgo", color:"#E67E22", desc:"Monitorizar y trabajar coordinación"},
        {min:16, max:99, label:"Función motora adecuada", color:"#27AE60", desc:"Dentro de rango normal para la edad"},
      ],
      items: [],
    },
    {
      nombre: "Escala de Barthel",
      acronimo: "BARTHEL",
      descripcion: "Independencia en AVD básicas. Adaptada para pacientes con TEA y baja colaboración.",
      rango: [0, 100], paso: 5,
      interpretacion: [
        {min:0, max:40, label:"Alta dependencia", color:"#E74C3C", desc:"Precisa apoyo intensivo en AVD"},
        {min:41, max:75, label:"Dependencia moderada", color:"#F39C12", desc:"Supervisión y apoyo parcial"},
        {min:76, max:100, label:"Independencia funcional", color:"#27AE60", desc:"Realiza AVD con mínima supervisión"},
      ],
      items: [],
    },
    {
      nombre: "Sensory Profile 2",
      acronimo: "SP-2",
      descripcion: "Perfil de procesamiento sensorial. Identifica patrones de respuesta sensorial para diseñar la dieta sensorial.",
      rango: [0, 100], paso: 1,
      interpretacion: [
        {min:0, max:25, label:"Atipicidad severa", color:"#E74C3C", desc:"Disfunción sensorial significativa. Protocolo de integración sensorial prioritario"},
        {min:26, max:50, label:"Atipicidad marcada", color:"#E67E22", desc:"Patrón sensorial atípico. Dieta sensorial individualizada"},
        {min:51, max:75, label:"Atipicidad leve", color:"#F39C12", desc:"Algunas áreas de procesamiento atípico"},
        {min:76, max:100, label:"Procesamiento típico", color:"#27AE60", desc:"Procesamiento sensorial dentro de rango normal"},
      ],
      items: [],
    },
  ],
  "Daño Cerebral Adquirido": [
    {
      nombre: "FIM — Medida de Independencia Funcional",
      acronimo: "FIM",
      descripcion: "Mide la carga de cuidados. Estándar en rehabilitación neurológica. 18 ítems en 6 áreas funcionales.",
      rango: [18, 126], paso: 1,
      interpretacion: [
        {min:18, max:35, label:"Dependencia completa", color:"#E74C3C", desc:"Asistencia total en todas las áreas"},
        {min:36, max:53, label:"Dependencia máxima", color:"#E67E22", desc:"≥75% de asistencia en la mayoría de tareas"},
        {min:54, max:71, label:"Dependencia moderada", color:"#F39C12", desc:"50-74% de asistencia"},
        {min:72, max:89, label:"Dependencia mínima", color:"#2ECC71", desc:"25-49% de asistencia"},
        {min:90, max:107, label:"Supervisión", color:"#27AE60", desc:"<25% de asistencia, supervisión"},
        {min:108, max:126, label:"Independencia completa", color:"#1E8449", desc:"Independiente en tiempo razonable y seguro"},
      ],
      items: [
        {nombre:"Alimentación", opciones:[{v:1,d:"Ayuda total"},{v:2,d:"Ayuda máxima"},{v:3,d:"Ayuda moderada"},{v:4,d:"Ayuda mínima"},{v:5,d:"Supervisión"},{v:6,d:"Independiente modificado"},{v:7,d:"Independiente completo"}]},
        {nombre:"Aseo personal", opciones:[{v:1,d:"Ayuda total"},{v:2,d:"Ayuda máxima"},{v:3,d:"Ayuda moderada"},{v:4,d:"Ayuda mínima"},{v:5,d:"Supervisión"},{v:6,d:"Independiente modificado"},{v:7,d:"Independiente completo"}]},
        {nombre:"Baño/ducha", opciones:[{v:1,d:"Ayuda total"},{v:2,d:"Ayuda máxima"},{v:3,d:"Ayuda moderada"},{v:4,d:"Ayuda mínima"},{v:5,d:"Supervisión"},{v:6,d:"Independiente modificado"},{v:7,d:"Independiente completo"}]},
        {nombre:"Vestido tren superior", opciones:[{v:1,d:"Ayuda total"},{v:2,d:"Ayuda máxima"},{v:3,d:"Ayuda moderada"},{v:4,d:"Ayuda mínima"},{v:5,d:"Supervisión"},{v:6,d:"Independiente modificado"},{v:7,d:"Independiente completo"}]},
        {nombre:"Vestido tren inferior", opciones:[{v:1,d:"Ayuda total"},{v:2,d:"Ayuda máxima"},{v:3,d:"Ayuda moderada"},{v:4,d:"Ayuda mínima"},{v:5,d:"Supervisión"},{v:6,d:"Independiente modificado"},{v:7,d:"Independiente completo"}]},
        {nombre:"Uso del WC", opciones:[{v:1,d:"Ayuda total"},{v:2,d:"Ayuda máxima"},{v:3,d:"Ayuda moderada"},{v:4,d:"Ayuda mínima"},{v:5,d:"Supervisión"},{v:6,d:"Independiente modificado"},{v:7,d:"Independiente completo"}]},
        {nombre:"Control vejiga", opciones:[{v:1,d:"Incontinencia total"},{v:2,d:">1 accidente/día"},{v:3,d:"1 accidente/día"},{v:4,d:"1 accidente/semana"},{v:5,d:"<1 accidente/mes"},{v:6,d:"Sin accidente, usa dispositivo"},{v:7,d:"Continente completo"}]},
        {nombre:"Control intestino", opciones:[{v:1,d:"Incontinencia total"},{v:2,d:">1 accidente/día"},{v:3,d:"1 accidente/día"},{v:4,d:"1 accidente/semana"},{v:5,d:"<1 accidente/mes"},{v:6,d:"Sin accidente, usa dispositivo"},{v:7,d:"Continente completo"}]},
        {nombre:"Traslado cama-silla", opciones:[{v:1,d:"Ayuda total"},{v:2,d:"Ayuda máxima"},{v:3,d:"Ayuda moderada"},{v:4,d:"Ayuda mínima"},{v:5,d:"Supervisión"},{v:6,d:"Independiente modificado"},{v:7,d:"Independiente completo"}]},
        {nombre:"Traslado WC", opciones:[{v:1,d:"Ayuda total"},{v:2,d:"Ayuda máxima"},{v:3,d:"Ayuda moderada"},{v:4,d:"Ayuda mínima"},{v:5,d:"Supervisión"},{v:6,d:"Independiente modificado"},{v:7,d:"Independiente completo"}]},
        {nombre:"Traslado bañera/ducha", opciones:[{v:1,d:"Ayuda total"},{v:2,d:"Ayuda máxima"},{v:3,d:"Ayuda moderada"},{v:4,d:"Ayuda mínima"},{v:5,d:"Supervisión"},{v:6,d:"Independiente modificado"},{v:7,d:"Independiente completo"}]},
        {nombre:"Marcha/silla de ruedas", opciones:[{v:1,d:"Ayuda total"},{v:2,d:"Ayuda máxima"},{v:3,d:"Ayuda moderada"},{v:4,d:"Ayuda mínima"},{v:5,d:"Supervisión"},{v:6,d:"Independiente modificado"},{v:7,d:"Independiente completo"}]},
        {nombre:"Escaleras", opciones:[{v:1,d:"Ayuda total"},{v:2,d:"Ayuda máxima"},{v:3,d:"Ayuda moderada"},{v:4,d:"Ayuda mínima"},{v:5,d:"Supervisión"},{v:6,d:"Independiente modificado"},{v:7,d:"Independiente completo"}]},
      ],
    },
    {
      nombre: "Test de Berg",
      acronimo: "BERG",
      descripcion: "Escala de equilibrio estático y dinámico. 14 ítems. Gold standard en neurorrehabilitación.",
      rango: [0, 56], paso: 1,
      interpretacion: [
        {min:0, max:20, label:"Equilibrio muy alterado", color:"#E74C3C", desc:"Alto riesgo de caída. Silla de ruedas recomendada"},
        {min:21, max:35, label:"Equilibrio moderadamente alterado", color:"#E67E22", desc:"Riesgo de caída. Marcha con ayuda técnica"},
        {min:36, max:44, label:"Equilibrio aceptable", color:"#F39C12", desc:"Riesgo moderado. Supervisión en exteriores"},
        {min:45, max:56, label:"Equilibrio funcional", color:"#27AE60", desc:"Bajo riesgo de caída. Marcha funcional"},
      ],
      items: [
        {nombre:"Sedestación a bipedestación", opciones:[{v:0,d:"Necesita asistencia moderada"},{v:1,d:"Necesita asistencia mínima"},{v:2,d:"Capaz tras varios intentos"},{v:3,d:"Capaz solo, usa manos"},{v:4,d:"Capaz sin usar manos"}]},
        {nombre:"Bipedestación sin apoyo 2min", opciones:[{v:0,d:"Incapaz sin apoyo"},{v:1,d:"<30 segundos"},{v:2,d:"30 segundos"},{v:3,d:"2min con supervisión"},{v:4,d:"2min seguro"}]},
        {nombre:"Sedestación sin apoyo 2min", opciones:[{v:0,d:"Incapaz sin apoyo"},{v:1,d:"<10 segundos"},{v:2,d:"30 segundos"},{v:3,d:"Con supervisión"},{v:4,d:"Seguro 2min"}]},
        {nombre:"Bipedestación a sedestación", opciones:[{v:0,d:"Necesita asistencia"},{v:1,d:"Independiente, sin control"},{v:2,d:"Usa poplíteos para controlarse"},{v:3,d:"Controla con manos"},{v:4,d:"Seguro con mínimo uso de manos"}]},
        {nombre:"Transferencias", opciones:[{v:0,d:"Necesita 2 personas"},{v:1,d:"Necesita 1 persona"},{v:2,d:"Con indicaciones verbales"},{v:3,d:"Seguro, necesita manos"},{v:4,d:"Seguro, mínimo uso de manos"}]},
        {nombre:"Bipedestación ojos cerrados 10s", opciones:[{v:0,d:"Necesita ayuda"},{v:1,d:"3 segundos"},{v:2,d:"10s con supervisión"},{v:3,d:"10s seguro"},{v:4,d:"10s seguro"}]},
        {nombre:"Bipedestación pies juntos 1min", opciones:[{v:0,d:"Necesita ayuda para mantener posición"},{v:1,d:"<15s pies juntos"},{v:2,d:"30s supervisión"},{v:3,d:"1min con supervisión"},{v:4,d:"1min seguro"}]},
        {nombre:"Alcance anterior con brazo extendido", opciones:[{v:0,d:"Pierde equilibrio"},{v:1,d:"<5cm"},{v:2,d:"5cm"},{v:3,d:"12cm"},{v:4,d:">25cm"}]},
        {nombre:"Coger objeto del suelo", opciones:[{v:0,d:"Incapaz/necesita supervisión"},{v:1,d:"Incapaz, llega a 2-5cm"},{v:2,d:"Coge pero necesita supervisión"},{v:3,d:"Coge, necesita supervisión"},{v:4,d:"Coge seguro y fácilmente"}]},
        {nombre:"Girar a mirar atrás", opciones:[{v:0,d:"Necesita supervisión"},{v:1,d:"Solo hacia un lado"},{v:2,d:"Solo hacia un lado, menos equilibrio"},{v:3,d:"Ambos lados, menos equilibrio"},{v:4,d:"Ambos lados, equilibrio bien"}]},
        {nombre:"Girar 360°", opciones:[{v:0,d:"Necesita ayuda"},{v:1,d:">4s cada lado"},{v:2,d:"4s un lado"},{v:3,d:"4s seguro"},{v:4,d:"<4s seguro"}]},
        {nombre:"Contar step alternando 4 veces", opciones:[{v:0,d:"Necesita ayuda"},{v:1,d:">20s o supervisión intensa"},{v:2,d:"≥4 pasos, supervisión"},{v:3,d:"4 pasos, supervisión mínima"},{v:4,d:"Seguro en 20s"}]},
        {nombre:"Un pie adelante, en tándem", opciones:[{v:0,d:"Pierde equilibrio al dar el paso"},{v:1,d:"Necesita ayuda al pisar"},{v:2,d:"Pasos pequeños independiente"},{v:3,d:"Pie adelante, supervisión"},{v:4,d:"Tándem independiente 30s"}]},
        {nombre:"Monopodal", opciones:[{v:0,d:"Incapaz"},{v:1,d:"Intenta levantar, <3s"},{v:2,d:"3-5s independiente"},{v:3,d:"5-10s"},{v:4,d:">10s"}]},
      ],
    },
    {
      nombre: "Ashworth Modificada",
      acronimo: "MAS",
      descripcion: "Grado de espasticidad. Evalúa la resistencia al movimiento pasivo. Fundamental en DCA con hipertonía.",
      rango: [0, 4], paso: 1,
      interpretacion: [
        {min:0, max:0, label:"Sin espasticidad", color:"#27AE60", desc:"No hay aumento del tono muscular"},
        {min:1, max:1, label:"Espasticidad leve", color:"#2ECC71", desc:"Ligero aumento del tono, mínima resistencia"},
        {min:2, max:2, label:"Espasticidad moderada", color:"#F39C12", desc:"Aumento más marcado, movimiento pasivo fácil"},
        {min:3, max:3, label:"Espasticidad considerable", color:"#E67E22", desc:"Aumento considerable, movimiento pasivo difícil"},
        {min:4, max:4, label:"Rigidez completa", color:"#E74C3C", desc:"Afecto en flexión o extensión completa"},
      ],
      items: [],
    },
    {
      nombre: "NIHSS — Severidad ACV",
      acronimo: "NIHSS",
      descripcion: "Cuantifica el déficit neurológico tras ACV. Orienta la intensidad y objetivos de la rehabilitación.",
      rango: [0, 42], paso: 1,
      interpretacion: [
        {min:0, max:0, label:"Sin déficit", color:"#1E8449"},
        {min:1, max:4, label:"ACV leve", color:"#27AE60", desc:"Déficit neurológico mínimo"},
        {min:5, max:15, label:"ACV moderado", color:"#F39C12", desc:"Déficit moderado, rehabilitación intensiva"},
        {min:16, max:20, label:"ACV moderado-grave", color:"#E67E22", desc:"Déficit importante, pronóstico reservado"},
        {min:21, max:42, label:"ACV grave", color:"#E74C3C", desc:"Déficit severo, manejo multidisciplinar"},
      ],
      items: [],
    },
  ],
  "Parálisis Cerebral": [
    {
      nombre: "GMFCS — Clasificación Función Motora",
      acronimo: "GMFCS",
      descripcion: "Estándar internacional para clasificar la función motora gruesa en PC. Determina objetivos y pronóstico.",
      rango: [1, 5], paso: 1,
      interpretacion: [
        {min:1, max:1, label:"Nivel I — Camina sin limitaciones", color:"#27AE60"},
        {min:2, max:2, label:"Nivel II — Limitaciones en exterior", color:"#2ECC71"},
        {min:3, max:3, label:"Nivel III — Marcha con ayudas técnicas", color:"#F39C12"},
        {min:4, max:4, label:"Nivel IV — Silla de ruedas en exteriores", color:"#E67E22"},
        {min:5, max:5, label:"Nivel V — Transportado en silla", color:"#E74C3C"},
      ],
      items: [],
    },
    {
      nombre: "MACS — Habilidad Manual",
      acronimo: "MACS",
      descripcion: "Clasifica cómo usan las manos al manipular objetos. Orienta el trabajo de terapia ocupacional y fisio.",
      rango: [1, 5], paso: 1,
      interpretacion: [
        {min:1, max:1, label:"Nivel I — Manipula fácilmente", color:"#27AE60"},
        {min:2, max:2, label:"Nivel II — Objetos reducidos", color:"#2ECC71"},
        {min:3, max:3, label:"Nivel III — Dificultad manipulación", color:"#F39C12"},
        {min:4, max:4, label:"Nivel IV — Selección muy limitada", color:"#E67E22"},
        {min:5, max:5, label:"Nivel V — No maneja objetos", color:"#E74C3C"},
      ],
      items: [],
    },
    {
      nombre: "GMFM-88 (% total)",
      acronimo: "GMFM",
      descripcion: "Mide la función motora gruesa en 5 dimensiones. Sensible al cambio con tratamiento. Referencia de progreso.",
      rango: [0, 100], paso: 1,
      interpretacion: [
        {min:0, max:25, label:"Función motora mínima", color:"#E74C3C", desc:"Decúbito y volteos principalmente"},
        {min:26, max:50, label:"Función motora básica", color:"#E67E22", desc:"Sedestación y gateo"},
        {min:51, max:75, label:"Función motora moderada", color:"#F39C12", desc:"Bipedestación asistida"},
        {min:76, max:90, label:"Función motora buena", color:"#2ECC71", desc:"Marcha asistida o libre"},
        {min:91, max:100, label:"Función motora completa", color:"#27AE60", desc:"Marcha libre y habilidades avanzadas"},
      ],
      items: [],
    },
    {
      nombre: "Ashworth Modificada",
      acronimo: "MAS",
      descripcion: "Evaluación de espasticidad. Fundamental para ajustar tratamiento (Bobath, FES, toxina botulínica).",
      rango: [0, 4], paso: 1,
      interpretacion: [
        {min:0, max:0, label:"Sin espasticidad", color:"#27AE60"},
        {min:1, max:1, label:"Leve", color:"#2ECC71"},
        {min:2, max:2, label:"Moderada", color:"#F39C12"},
        {min:3, max:3, label:"Considerable", color:"#E67E22"},
        {min:4, max:4, label:"Rigidez completa", color:"#E74C3C"},
      ],
      items: [],
    },
  ],
};

function EscalasDetalle({ patient: p, onBack }) {
  const [escalaActiva, setEscalaActiva] = useState(0);
  const [scores, setScores] = useState({});
  const [historial, setHistorial] = useState(p.valoraciones || {});
  const [nuevaPunt, setNuevaPunt] = useState({});
  const [saved, setSaved] = useState(false);

  const escalasDisp = ESCALAS_COMPLETAS[p.diagnostico] || [];
  const escala = escalasDisp[escalaActiva];
  if (!escala) return null;

  const scoreActual = scores[escala.nombre] || {};
  const totalScore = Object.values(scoreActual).reduce((a, b) => a + b, 0);
  const histEscala = historial[escala.nombre] || [];
  const ultimaVal = histEscala[histEscala.length - 1];

  const getInterpretacion = (val) => {
    const interp = escala.interpretacion || [];
    return interp.find(i => val >= i.min && val <= i.max);
  };

  const interpActual = getInterpretacion(totalScore);

  const registrarValoracion = () => {
    const nuevaVals = {
      ...historial,
      [escala.nombre]: [...(historial[escala.nombre] || []), { fecha: hoy(), puntuacion: totalScore }]
    };
    setHistorial(nuevaVals);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "2rem 1.2rem", animation: "slideUp 0.4s ease" }}>
      <Volver onClick={onBack} />
      <h2 style={{ fontFamily: "'DM Serif Display'", fontSize: "1.8rem", marginBottom: "0.3rem" }}>
        Escalas <em style={{ color: "#6B4226" }}>Clínicas</em>
      </h2>
      <p style={{ fontFamily: "'DM Sans'", fontSize: "0.75rem", color: "#9B8B7A", marginBottom: "1.2rem" }}>
        {p.nombre} · {p.diagnostico}
      </p>

      {/* Selector de escala */}
      <div style={{ display: "flex", gap: "0.4rem", overflowX: "auto", paddingBottom: "0.4rem", marginBottom: "1.2rem" }}>
        {escalasDisp.map((e, i) => (
          <button key={e.acronimo} onClick={() => { setEscalaActiva(i); setScores({}); }} style={{ padding: "0.4rem 0.9rem", background: escalaActiva === i ? "#6B4226" : "#fff", border: `1px solid ${escalaActiva === i ? "#6B4226" : "#E8E0D5"}`, borderRadius: 20, color: escalaActiva === i ? "#fff" : "#9B8B7A", fontFamily: "'DM Sans'", fontSize: "0.72rem", fontWeight: escalaActiva === i ? 700 : 400, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s" }}>
            {e.acronimo}
          </button>
        ))}
      </div>

      {/* Info escala */}
      <div style={{ background: "#fff", borderRadius: 12, padding: "1.2rem", boxShadow: "0 2px 10px rgba(26,26,46,0.05)", marginBottom: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.6rem" }}>
          <div>
            <h3 style={{ fontFamily: "'DM Serif Display'", fontSize: "1.2rem", marginBottom: "0.2rem" }}>{escala.nombre}</h3>
            <p style={{ fontFamily: "'DM Sans'", fontSize: "0.72rem", color: "#9B8B7A" }}>Rango: {escala.rango[0]}–{escala.rango[1]}</p>
          </div>
          {ultimaVal && (
            <div style={{ textAlign: "right" }}>
              <p style={{ fontFamily: "'DM Sans'", fontSize: "0.6rem", color: "#9B8B7A", textTransform: "uppercase" }}>Última val.</p>
              <p style={{ fontFamily: "'DM Serif Display'", fontSize: "1.4rem", color: "#6B4226" }}>{ultimaVal.puntuacion}</p>
              <p style={{ fontFamily: "'DM Sans'", fontSize: "0.62rem", color: "#9B8B7A" }}>{ultimaVal.fecha}</p>
            </div>
          )}
        </div>
        <p style={{ fontFamily: "'DM Sans'", fontSize: "0.78rem", color: "#6B4226", lineHeight: 1.6, background: "rgba(107,66,38,0.05)", padding: "0.7rem", borderRadius: 8, borderLeft: "3px solid #6B4226" }}>
          {escala.descripcion}
        </p>
      </div>

      {/* Ítems de evaluación */}
      {escala.items.length > 0 && (
        <div style={{ marginBottom: "1rem" }}>
          <p style={{ fontFamily: "'DM Sans'", fontSize: "0.62rem", color: "#9B8B7A", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.8rem" }}>Ítems de valoración</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {escala.items.map((item, idx) => (
              <div key={idx} style={{ background: "#fff", borderRadius: 10, padding: "0.9rem 1rem", boxShadow: "0 1px 6px rgba(26,26,46,0.04)", border: `1px solid ${scoreActual[idx] !== undefined ? "rgba(107,66,38,0.2)" : "transparent"}` }}>
                <p style={{ fontFamily: "'DM Sans'", fontWeight: 600, fontSize: "0.82rem", marginBottom: "0.5rem" }}>
                  <span style={{ color: "#9B8B7A", marginRight: "0.4rem" }}>{idx + 1}.</span>{item.nombre}
                  {scoreActual[idx] !== undefined && <span style={{ float: "right", color: "#6B4226", fontFamily: "'DM Serif Display'", fontSize: "1rem" }}>{scoreActual[idx]} pts</span>}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                  {item.opciones.map(op => (
                    <div key={op.v} onClick={() => setScores(s => ({ ...s, [escala.nombre]: { ...scoreActual, [idx]: op.v } }))}
                      style={{ padding: "0.3rem 0.7rem", borderRadius: 6, border: `1.5px solid ${scoreActual[idx] === op.v ? "#6B4226" : "#E8E0D5"}`, background: scoreActual[idx] === op.v ? "rgba(107,66,38,0.08)" : "#fff", cursor: "pointer", fontFamily: "'DM Sans'", fontSize: "0.72rem", color: scoreActual[idx] === op.v ? "#6B4226" : "#9B8B7A", fontWeight: scoreActual[idx] === op.v ? 600 : 400, transition: "all 0.12s" }}>
                      {op.v} — {op.d}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Puntuación directa (para escalas sin ítems) */}
      {escala.items.length === 0 && (
        <div style={{ background: "#fff", borderRadius: 12, padding: "1.2rem", boxShadow: "0 2px 10px rgba(26,26,46,0.05)", marginBottom: "1rem" }}>
          <p style={{ fontFamily: "'DM Sans'", fontSize: "0.62rem", color: "#9B8B7A", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.6rem" }}>Puntuación directa</p>
          <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
            <input type="number" min={escala.rango[0]} max={escala.rango[1]} step={escala.paso}
              value={nuevaPunt[escala.nombre] || ""}
              onChange={e => setNuevaPunt(n => ({ ...n, [escala.nombre]: Number(e.target.value) }))}
              placeholder={`${escala.rango[0]}–${escala.rango[1]}`}
              style={{ flex: 1, padding: "0.7rem 0.9rem", border: "1px solid #E8E0D5", borderRadius: 8, fontFamily: "'DM Sans'", fontSize: "0.88rem", outline: "none" }}
            />
            <button onClick={() => {
              const val = nuevaPunt[escala.nombre];
              if (val === undefined || val === "") return;
              const nuevaVals = { ...historial, [escala.nombre]: [...(historial[escala.nombre] || []), { fecha: hoy(), puntuacion: val }] };
              setHistorial(nuevaVals);
              setSaved(true);
              setTimeout(() => setSaved(false), 2000);
            }} className="btn" style={{ padding: "0.7rem 1.1rem", background: "#6B4226", border: "none", borderRadius: 8, color: "#fff", fontFamily: "'DM Sans'", fontWeight: 600, fontSize: "0.82rem" }}>
              Registrar
            </button>
          </div>
        </div>
      )}

      {/* Score total + interpretación */}
      {escala.items.length > 0 && Object.keys(scoreActual).length > 0 && (
        <div style={{ background: interpActual ? interpActual.color + "12" : "#F7F4EF", border: `1.5px solid ${interpActual ? interpActual.color + "40" : "#E8E0D5"}`, borderRadius: 12, padding: "1.2rem", marginBottom: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <p style={{ fontFamily: "'DM Sans'", fontSize: "0.65rem", color: "#9B8B7A", textTransform: "uppercase", letterSpacing: "0.1em" }}>Puntuación total</p>
            <p style={{ fontFamily: "'DM Serif Display'", fontSize: "2rem", color: interpActual ? interpActual.color : "#1A1A2E" }}>
              {totalScore}<span style={{ fontFamily: "'DM Sans'", fontSize: "0.8rem", color: "#9B8B7A" }}>/{escala.rango[1]}</span>
            </p>
          </div>
          {interpActual && (
            <>
              <p style={{ fontFamily: "'DM Sans'", fontWeight: 700, fontSize: "0.88rem", color: interpActual.color }}>{interpActual.label}</p>
              {interpActual.desc && <p style={{ fontFamily: "'DM Sans'", fontSize: "0.75rem", color: "#6B4226", marginTop: "0.2rem" }}>{interpActual.desc}</p>}
            </>
          )}
          <button onClick={registrarValoracion} className="btn" style={{ width: "100%", marginTop: "0.8rem", padding: "0.7rem", background: "#6B4226", border: "none", borderRadius: 8, color: "#fff", fontFamily: "'DM Sans'", fontWeight: 600, fontSize: "0.83rem" }}>
            {saved ? "✓ Guardado" : "Guardar valoración →"}
          </button>
        </div>
      )}

      {/* Guía de interpretación */}
      <div style={{ background: "#fff", borderRadius: 12, padding: "1.2rem", boxShadow: "0 2px 8px rgba(26,26,46,0.04)", marginBottom: "1rem" }}>
        <p style={{ fontFamily: "'DM Sans'", fontSize: "0.62rem", color: "#9B8B7A", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.7rem" }}>Guía de interpretación</p>
        {escala.interpretacion.map((int, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.7rem", padding: "0.5rem 0", borderBottom: i < escala.interpretacion.length - 1 ? "1px solid #F5F2ED" : "none" }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: int.color, flexShrink: 0 }} />
            <div>
              <p style={{ fontFamily: "'DM Sans'", fontWeight: 600, fontSize: "0.78rem" }}>{int.min}–{int.max}: {int.label}</p>
              {int.desc && <p style={{ fontFamily: "'DM Sans'", fontSize: "0.68rem", color: "#9B8B7A" }}>{int.desc}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Historial */}
      {histEscala.length > 0 && (
        <div style={{ background: "#fff", borderRadius: 12, padding: "1.2rem", boxShadow: "0 2px 8px rgba(26,26,46,0.04)" }}>
          <p style={{ fontFamily: "'DM Sans'", fontSize: "0.62rem", color: "#9B8B7A", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.8rem" }}>Historial de valoraciones</p>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "4px", height: 50, marginBottom: "0.8rem" }}>
            {histEscala.slice(-10).map((v, i) => {
              const pct = ((v.puntuacion - escala.rango[0]) / (escala.rango[1] - escala.rango[0])) * 100;
              const interp = getInterpretacion(v.puntuacion);
              const isLast = i === histEscala.slice(-10).length - 1;
              return (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
                  <div style={{ width: "100%", background: isLast ? (interp ? interp.color : "#6B4226") : "#D4C5B0", borderRadius: "2px 2px 0 0", height: `${Math.max(pct * 0.5, 2)}px`, transition: "height 0.3s" }} />
                  <span style={{ fontFamily: "'DM Sans'", fontSize: "0.5rem", color: isLast ? "#6B4226" : "#9B8B7A" }}>{v.puntuacion}</span>
                </div>
              );
            })}
          </div>
          {[...histEscala].reverse().slice(0, 5).map((v, i) => {
            const interp = getInterpretacion(v.puntuacion);
            const prev = histEscala[histEscala.length - 2 - i];
            const diff = prev ? v.puntuacion - prev.puntuacion : null;
            return (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.4rem 0", borderBottom: "1px solid #F5F2ED" }}>
                <p style={{ fontFamily: "'DM Sans'", fontSize: "0.72rem", color: "#9B8B7A" }}>{v.fecha}</p>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  {diff !== null && <span style={{ fontFamily: "'DM Sans'", fontSize: "0.7rem", color: diff > 0 ? "#27AE60" : diff < 0 ? "#E74C3C" : "#9B8B7A" }}>{diff > 0 ? "+" : ""}{diff}</span>}
                  <p style={{ fontFamily: "'DM Sans'", fontWeight: 600, fontSize: "0.8rem", color: interp ? interp.color : "#1A1A2E" }}>{v.puntuacion}/{escala.rango[1]}</p>
                  {interp && <Tag label={interp.label.split("—")[0].trim()} color={interp.color} />}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── SHARED ───────────────────────────────────────────────────────────────────
const IS={width:"100%",padding:"0.65rem 0.9rem",border:"1px solid #E8E0D5",borderRadius:8,fontFamily:"'DM Sans'",fontSize:"0.84rem",color:"#1A1A2E",background:"#fff",outline:"none"};

function Volver({onClick}){return <button onClick={onClick} style={{fontFamily:"'DM Sans'",fontSize:"0.76rem",color:"#9B8B7A",background:"transparent",border:"none",cursor:"pointer",marginBottom:"1.1rem",padding:0}}>← Volver</button>;}
function Tag({label,color,large}){return <span style={{padding:large?"0.3rem 0.8rem":"0.2rem 0.55rem",background:color+"15",color,borderRadius:20,fontFamily:"'DM Sans'",fontSize:large?"0.76rem":"0.66rem",fontWeight:500,whiteSpace:"nowrap"}}>{label}</span>;}
function Chip({label,sel,onSel}){return <div onClick={onSel} className="chip" style={{padding:"0.32rem 0.75rem",border:`1.5px solid ${sel?"#2D6A4F":"#E8E0D5"}`,borderRadius:20,cursor:"pointer",background:sel?"rgba(45,106,79,0.08)":"#fff",color:sel?"#2D6A4F":"#9B8B7A",fontFamily:"'DM Sans'",fontSize:"0.73rem",fontWeight:sel?600:400,userSelect:"none",transition:"all 0.15s"}}>{sel&&"✓ "}{label}</div>;}
function F({label,children}){return <div style={{marginBottom:"0.75rem"}}><label style={{display:"block",fontFamily:"'DM Sans'",fontSize:"0.6rem",color:"#9B8B7A",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:"0.3rem"}}>{label}</label>{children}</div>;}
function In({value,onChange,placeholder,type="text"}){return <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={IS}/>;}
function Card2({title,icon,children}){return <div style={{background:"#fff",borderRadius:12,padding:"1.2rem",boxShadow:"0 2px 10px rgba(26,26,46,0.05)",marginBottom:"0.8rem"}}><div style={{display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"0.9rem"}}><span style={{color:"#2D6A4F"}}>{icon}</span><h3 style={{fontSize:"0.95rem",fontFamily:"'DM Serif Display'"}}>{title}</h3></div>{children}</div>;}
function Section({title,children}){return <div style={{marginBottom:"1rem"}}><p style={{fontSize:"0.65rem",color:"#9B8B7A",textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:"0.4rem",fontFamily:"'DM Sans'"}}>{title}</p><div style={{padding:"0.7rem 1rem",background:"#F9F7F4",borderRadius:6,borderLeft:"3px solid #2D6A4F"}}>{children}</div></div>;}
