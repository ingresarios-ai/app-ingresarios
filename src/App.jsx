import { useState, useRef, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { supabase } from "./supabaseClient";
import LandingPage from "./LandingPage";

// ── QUIZ DATA ─────────────────────────────────────────────────
const QUIZ = [
  {
    id: 1, emoji: "📅",
    pregunta: "¿Cuánto tiempo llevas operando en mercados financieros?",
    opciones: [
      { texto: "Soy completamente nuevo, quiero aprender", valor: "explorador" },
      { texto: "Menos de 1 año, todavía aprendiendo", valor: "explorador" },
      { texto: "1 a 3 años, operando con resultados mixtos", valor: "arquitecto" },
      { texto: "Más de 3 años, tengo experiencia real", valor: "samurai" },
    ]
  },
  {
    id: 2, emoji: "🧨",
    pregunta: "¿Cuál es tu mayor desafío como trader en este momento?",
    opciones: [
      { texto: "No saber por dónde empezar ni qué estudiar", valor: "explorador" },
      { texto: "La disciplina — me cuesta respetar el plan", valor: "samurai" },
      { texto: "El control emocional — el miedo y la codicia me dominan", valor: "alquimista" },
      { texto: "La consistencia — tengo rachas buenas y malas", valor: "arquitecto" },
    ]
  },
  {
    id: 3, emoji: "🎲",
    pregunta: "¿Cómo describes tu relación con el riesgo?",
    opciones: [
      { texto: "Conservador — prefiero ganar poco a perder algo", valor: "arquitecto" },
      { texto: "Calculado — evalúo el R:R antes de cada operación", valor: "samurai" },
      { texto: "Agresivo — asumo riesgos altos buscando retornos altos", valor: "cazador" },
      { texto: "Inconsistente — cambia según mi estado de ánimo", valor: "explorador" },
    ]
  },
  {
    id: 4, emoji: "⏰",
    pregunta: "¿Cuánto tiempo real dedicas al trading cada día?",
    opciones: [
      { texto: "Menos de 1 hora (trading pasivo o swing)", valor: "arquitecto" },
      { texto: "1 a 3 horas (seguimiento activo)", valor: "samurai" },
      { texto: "3 a 6 horas (day trader semi-profesional)", valor: "cazador" },
      { texto: "Más de 6 horas (full-time)", valor: "alquimista" },
    ]
  },
  {
    id: 5, emoji: "🎯",
    pregunta: "¿Cuál es tu principal objetivo financiero con el trading?",
    opciones: [
      { texto: "Libertad financiera total — vivir del trading", valor: "alquimista" },
      { texto: "Ingresos complementarios de $500-2000 USD/mes", valor: "arquitecto" },
      { texto: "Proteger y hacer crecer mis ahorros", valor: "samurai" },
      { texto: "Entender los mercados y aprender a invertir", valor: "explorador" },
    ]
  },
  {
    id: 6, emoji: "📊",
    pregunta: "¿Qué tipo de análisis usas más en tus operaciones?",
    opciones: [
      { texto: "Análisis técnico — gráficos, patrones, indicadores", valor: "cazador" },
      { texto: "Price Action puro — sin indicadores, solo velas", valor: "samurai" },
      { texto: "Fundamental + técnico combinado", valor: "alquimista" },
      { texto: "Todavía estoy aprendiendo los distintos métodos", valor: "explorador" },
    ]
  },
  {
    id: 7, emoji: "😤",
    pregunta: "¿Cómo reaccionas normalmente después de una pérdida?",
    opciones: [
      { texto: "Intento recuperarla inmediatamente (revenge trading)", valor: "explorador" },
      { texto: "Tomo distancia y analizo qué falló antes de volver", valor: "samurai" },
      { texto: "Me afecta durante horas o días — me bloquea", valor: "alquimista" },
      { texto: "Lo acepto como parte del proceso y sigo mi plan", valor: "arquitecto" },
    ]
  },
  {
    id: 8, emoji: "💎",
    pregunta: "¿Cuál crees que es tu mayor fortaleza como trader?",
    opciones: [
      { texto: "La paciencia — espero mis setups con disciplina", valor: "samurai" },
      { texto: "La velocidad — identifico oportunidades rápido", valor: "cazador" },
      { texto: "El análisis — proceso mucha información antes de actuar", valor: "alquimista" },
      { texto: "La constancia — soy dedicado aunque los resultados no llegan", valor: "explorador" },
    ]
  },
  {
    id: 9, emoji: "🚀",
    pregunta: "¿Qué tipo de trader quieres ser en los próximos 12 meses?",
    opciones: [
      { texto: "Trader institucional con metodología sólida y probada", valor: "samurai" },
      { texto: "Trader de alto rendimiento con estrategias sistemáticas", valor: "arquitecto" },
      { texto: "Trader full-time viviendo de los mercados con libertad total", valor: "alquimista" },
      { texto: "Trader activo con ingresos consistentes como complemento", valor: "cazador" },
    ]
  },
];

const ARQUETIPOS = {
  explorador: {
    nombre: "El Explorador", emoji: "🧭", color: "#00d4ff",
    subtitulo: "Curioso, hambriento de conocimiento, en plena construcción",
    descripcion: "Estás en la etapa más valiosa del journey: el inicio consciente. Tienes la mente abierta y la motivación necesaria para construir una base sólida. El método PEDEM fue diseñado exactamente para traders como tú — te dará estructura, claridad y un camino probado para avanzar sin los errores que destruyen cuentas en los primeros años.",
    fortaleza: "Mente abierta y disposición al aprendizaje",
    desafio: "Construir estructura antes de arriesgar capital real",
    proxPaso: "Completa el Reto de la Sombra 7 días para conocerte como trader",
    quote: '"El trader más peligroso es el que cree que ya sabe." — Juan, INGRESARIOS',
  },
  arquitecto: {
    nombre: "El Arquitecto", emoji: "📐", color: "#00f5a0",
    subtitulo: "Sistemático, metódico, construye para el largo plazo",
    descripcion: "Piensas en sistemas, no en trades aislados. Entiendes que la consistencia viene de los procesos. Tu reto es ejecutar con disciplina lo que ya sabes en teoría. PEDEM es tu lenguaje natural — úsalo para cerrar la brecha entre saber y hacer. La documentación de tus trades será tu mayor ventaja competitiva.",
    fortaleza: "Pensamiento sistemático y capacidad de análisis",
    desafio: "Pasar del análisis parálisis a la ejecución confiante",
    proxPaso: "Empieza el Simulador y aplica PEDEM en cada trade hoy",
    quote: '"Un buen sistema mediocre ejecutado perfectamente supera a un sistema perfecto mal ejecutado."',
  },
  samurai: {
    nombre: "El Samurái", emoji: "⚔️", color: "#bf5fff",
    subtitulo: "Disciplinado, paciente, respeta el proceso sobre el resultado",
    descripcion: "Tienes la mentalidad correcta — operas desde la paciencia y el respeto por el riesgo. Tu trading se parece más al arte que al juego. El siguiente nivel para ti es la maestría: afinar el timing, optimizar tus indicadores y construir un edge estadístico comprobable. El Reto del Flow te llevará a tu estado óptimo de forma consistente.",
    fortaleza: "Disciplina emocional y respeto por el plan",
    desafio: "Salir de la zona de comfort y escalar resultados",
    proxPaso: "Activa el Reto del Flow para llevar tu disciplina al siguiente nivel",
    quote: '"El samurái no desenvaina por emoción — desenvaina por preparación." — Bushido',
  },
  cazador: {
    nombre: "El Cazador", emoji: "🎯", color: "#ff9500",
    subtitulo: "Rápido, agresivo, busca la oportunidad antes que el proceso",
    descripcion: "Tienes instinto de mercado y velocidad de reacción — eso es un don real. Tu reto es canalizar esa energía con estructura. Sin un plan sólido, el cazador se convierte en la presa. El método PEDEM es la diferencia entre cazar con trampa y cazar al azar. Con disciplina, tu velocidad se convierte en tu mayor ventaja.",
    fortaleza: "Velocidad de identificación y ejecución",
    desafio: "Frenar el impulso y planificar antes de disparar",
    proxPaso: "Usa el modal PLANEAR antes de cada trade — sin excepción",
    quote: '"La velocidad sin dirección es solo caos con energía."',
  },
  alquimista: {
    nombre: "El Alquimista", emoji: "🔮", color: "#ffd700",
    subtitulo: "Integrador, profundo, busca transformar conocimiento en oro",
    descripcion: "Combinas múltiples frameworks, entiendes que el trading es psicología, probabilidad y proceso. Estás listo para el nivel institucional. Tu siguiente salto no es técnico — es mental. El Reto de la Sombra te revelará los últimos bloques inconscientes que limitan tu cuenta. Con GENY IA como coach, tienes acceso a análisis que antes solo tenían los traders de Bloomberg.",
    fortaleza: "Visión holística y capacidad de integración",
    desafio: "Convertir la complejidad en simplicidad ejecutable",
    proxPaso: "Habla con GENY IA y pídele que analice tu arquetipo en profundidad",
    quote: '"La alquimia del trading: convertir incertidumbre en probabilidad repetible." — Juan, Bloomberg',
  },
};

// ── MARKET DATA ───────────────────────────────────────────────
const genData = (base, vol, n = 120) => {
  let p = base;
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (n - i));
    p = Math.max(p + (Math.random() - 0.47) * vol, base * 0.65);
    return { t: d.toLocaleDateString("es", { month: "short", day: "numeric" }), c: +p.toFixed(2) };
  });
};
const SYMS = {
  SPX: { label: "S&P 500", base: 5200, vol: 38, color: "#00f5a0", lot: 1, premium: false },
  QQQ: { label: "NASDAQ QQQ", base: 445, vol: 6, color: "#00d4ff", lot: 10, premium: false },
  AAPL: { label: "Apple Inc.", base: 185, vol: 3.5, color: "#bf5fff", lot: 10, premium: false },
  TSLA: { label: "Tesla Inc.", base: 240, vol: 9, color: "#ff6b6b", lot: 10, premium: true },
  NVDA: { label: "NVIDIA", base: 875, vol: 18, color: "#ffd700", lot: 1, premium: true },
};
const MD = {}; Object.keys(SYMS).forEach(s => { MD[s] = genData(SYMS[s].base, SYMS[s].vol); });
const price = s => MD[s][MD[s].length - 1].c;
const chg = s => { const d = MD[s]; return ((d[d.length - 1].c - d[d.length - 2].c) / d[d.length - 2].c) * 100; };

const SOMBRA = [
  { dia: 1, titulo: "El Mercado como Espejo", emoji: "🪞", subtitulo: "Tus proyecciones en el precio", ejercicio: "Escribe 3 veces recientes en que culpaste al mercado por tus pérdidas. ¿Qué te dice eso sobre ti?", pregunta: "¿Qué parte de ti mismo estás proyectando en el mercado cuando dices 'el mercado está loco'?", duracion: "15 min", bgColor: "#bf5fff" },
  { dia: 2, titulo: "El Trader que Temes Ser", emoji: "😨", subtitulo: "El miedo como brújula de la sombra", ejercicio: "Describe al peor trader imaginable. ¿Qué características tiene? Ahora identifica cuáles existen en ti, aunque sea mínimamente.", pregunta: "¿Qué comportamiento de otros traders te irrita más? Ese es tu espejo.", duracion: "20 min", bgColor: "#ff6b6b" },
  { dia: 3, titulo: "La Rabia del Stop Loss", emoji: "🔥", subtitulo: "Emociones que sabotean tu ejecución", ejercicio: "Recuerda un trade donde la rabia te impidió respetar tu plan. Escribe qué sentiste y qué pensamiento lo disparó.", pregunta: "¿Qué necesitas demostrarle a alguien cuando haces trading?", duracion: "20 min", bgColor: "#ff9500" },
  { dia: 4, titulo: "La Envidia del Trader Exitoso", emoji: "💚", subtitulo: "Lo que deseas y niegas desear", ejercicio: "Piensa en un trader que admiras y envidias. Escribe 5 cosas que tiene y tú quieres. Acepta que quererlo es válido.", pregunta: "¿Qué te impide creer que tú también mereces ese nivel de éxito?", duracion: "15 min", bgColor: "#00c853" },
  { dia: 5, titulo: "El Impostor Interior", emoji: "🎭", subtitulo: "¿Realmente crees que puedes?", ejercicio: "Escribe las 3 voces internas que más te atacan antes de ejecutar un trade. ¿A quién le pertenecen originalmente?", pregunta: "Si supieras con certeza que no puedes fracasar, ¿qué trade harías hoy?", duracion: "20 min", bgColor: "#00d4ff" },
  { dia: 6, titulo: "El Saboteador Inconsciente", emoji: "🪤", subtitulo: "Patrones que se repiten sin razón aparente", ejercicio: "Analiza tus últimos 5 trades perdedores. Busca UN patrón de comportamiento repetido. Analízate a ti, no al mercado.", pregunta: "¿Qué beneficio oculto obtienes cuando pierdes?", duracion: "25 min", bgColor: "#ffd700" },
  { dia: 7, titulo: "El Trader Completo", emoji: "⚡", subtitulo: "Integración — luz y sombra unidas", ejercicio: "Escribe una carta a tu 'trader sombra'. Agradécele su protección y dile que ya no la necesitas para sobrevivir.", pregunta: "¿Quién eres como trader cuando integras todo lo aprendido esta semana?", duracion: "30 min", bgColor: "#00f5a0" },
];
const FLOW = [
  { dia: 1, titulo: "Diagnóstico de tu Flow", emoji: "🔬", subtitulo: "¿Cuándo fluyes naturalmente?", ejercicio: "Piensa en los 3 mejores días de trading. Describe qué condiciones estaban presentes: hora, estado emocional, preparación, entorno.", pregunta: "¿Qué tienen en común tus mejores sesiones?", duracion: "20 min", bgColor: "#00d4ff" },
  { dia: 2, titulo: "Ritual de Activación", emoji: "🧘", subtitulo: "Los 15 minutos que lo cambian todo", ejercicio: "Diseña tu ritual pre-trading: 1 ejercicio de respiración, 1 revisión del plan y 1 afirmación de intención. Escríbelo detallado.", pregunta: "¿Qué haces en los 30 minutos antes de tradear? ¿Te prepara o te dispersa?", duracion: "20 min", bgColor: "#00f5a0" },
  { dia: 3, titulo: "El Canal Óptimo", emoji: "🎯", subtitulo: "Desafío vs. habilidad — la zona de flow", ejercicio: "Califica del 1-10 tu nivel de habilidad y el desafío que buscas. Si la diferencia es mayor a 3, estás fuera del flow. Ajusta.", pregunta: "¿Estás operando en instrumentos fuera de tu nivel real?", duracion: "15 min", bgColor: "#bf5fff" },
  { dia: 4, titulo: "Eliminar Distractores", emoji: "🔇", subtitulo: "El flow requiere entorno controlado", ejercicio: "Lista los 5 mayores distractores de tu sesión. Para cada uno, define UNA acción concreta para eliminarlo mañana.", pregunta: "¿Qué tanto control tienes sobre tu entorno cuando tradeas?", duracion: "15 min", bgColor: "#ff6b6b" },
  { dia: 5, titulo: "Anclas de Flow", emoji: "⚓", subtitulo: "Disparadores que activan tu estado óptimo", ejercicio: "Identifica 3 anclas sensoriales asociadas a tu mejor estado: canción, aroma, postura o frase. Practica activarlas ahora.", pregunta: "¿Puedes acceder a tu flow de forma intencional o solo ocurre por accidente?", duracion: "20 min", bgColor: "#ffd700" },
  { dia: 6, titulo: "Recuperación y Reset", emoji: "🔄", subtitulo: "Salir del flow y volver a él", ejercicio: "Escribe tu protocolo de reset para cuando pierdes el flow: 3 pasos ejecutables en menos de 5 minutos.", pregunta: "¿Qué haces cuando notas que estás 'fuera de ti' durante el trading?", duracion: "20 min", bgColor: "#ff9500" },
  { dia: 7, titulo: "Tu Protocolo de Flow Personal", emoji: "🏆", subtitulo: "El sistema que siempre te lleva al peak", ejercicio: "Sintetiza todo en tu 'Protocolo de Flow INGRESARIOS': ritual, anclas, canal óptimo y reset. Escríbelo como manual de tu mejor yo.", pregunta: "¿Cómo es el trader que vive en estado de flow la mayoría del tiempo?", duracion: "30 min", bgColor: "#00f5a0" },
];

// ── UTILS ─────────────────────────────────────────────────────
const fmt = n => n?.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtP = n => (n >= 0 ? "+" : "") + fmt(n);
const S = {
  app: { background: "#080F25", minHeight: "100vh", color: "#FFFFFF", fontFamily: "'Mona Sans', 'Inter', system-ui, sans-serif", fontSize: 13 },
  card: { background: "#101935", border: "1px solid #343B4F", borderRadius: 8, padding: 16, boxShadow: "0px 2px 7px rgba(20, 20, 43, 0.06)" },
  cardSm: { background: "#101935", border: "1px solid #343B4F", borderRadius: 6, padding: 12, boxShadow: "0px 2px 7px rgba(20, 20, 43, 0.06)" },
  inp: { background: "#080F25", border: "1px solid #343B4F", borderRadius: 6, padding: "9px 12px", color: "#FFFFFF", fontSize: 13, width: "100%", outline: "none", boxSizing: "border-box", transition: "border 0.2s" },
  textarea: { background: "#080F25", border: "1px solid #343B4F", borderRadius: 6, padding: "9px 12px", color: "#FFFFFF", fontSize: 13, width: "100%", outline: "none", resize: "vertical", boxSizing: "border-box", lineHeight: 1.6, transition: "border 0.2s" },
  label: { color: "#AEB9E1", fontSize: 12, marginBottom: 6, display: "block", fontWeight: 500, letterSpacing: 0.5 },
};
const navBtnTop = a => ({ background: a ? "#212C4D" : "transparent", border: "1px solid transparent", color: a ? "#FFFFFF" : "#AEB9E1", borderRadius: 4, padding: "7px 13px", cursor: "pointer", fontSize: 13, fontWeight: a ? 600 : 400, transition: "all .2s", whiteSpace: "nowrap" });
const glowBtn = (c = "#6C72FF", sm) => ({ background: c === "#00f5a0" || c === "#425cf2" ? "#6C72FF" : c, border: "none", color: "#FFFFFF", borderRadius: 4, padding: sm ? "8px 16px" : "12px 24px", cursor: "pointer", fontWeight: 600, fontSize: sm ? 13 : 14, transition: "all .2s", boxShadow: "0px 2px 4px rgba(0,0,0,0.2)" });
const redBtn = sm => ({ background: "#FF4D4D", border: "none", color: "#FFFFFF", borderRadius: 4, padding: sm ? "8px 16px" : "12px 24px", cursor: "pointer", fontWeight: 600, fontSize: sm ? 13 : 14, boxShadow: "0px 2px 4px rgba(0,0,0,0.2)" });

// Helper: genera emoji de bandera desde código de 2 letras
const countryFlag = (code) => {
  if (!code || code.length !== 2) return "🌍";
  return String.fromCodePoint(
    0x1F1E6 + code.toUpperCase().charCodeAt(0) - 65,
    0x1F1E6 + code.toUpperCase().charCodeAt(1) - 65
  );
};

// Lista de códigos de área más comunes
const DIAL_CODES = [
  { cc: "MX", code: "52", name: "México" },
  { cc: "US", code: "1", name: "EE.UU." },
  { cc: "CO", code: "57", name: "Colombia" },
  { cc: "AR", code: "54", name: "Argentina" },
  { cc: "CL", code: "56", name: "Chile" },
  { cc: "PE", code: "51", name: "Perú" },
  { cc: "VE", code: "58", name: "Venezuela" },
  { cc: "EC", code: "593", name: "Ecuador" },
  { cc: "BO", code: "591", name: "Bolivia" },
  { cc: "PY", code: "595", name: "Paraguay" },
  { cc: "UY", code: "598", name: "Uruguay" },
  { cc: "GT", code: "502", name: "Guatemala" },
  { cc: "HN", code: "504", name: "Honduras" },
  { cc: "SV", code: "503", name: "El Salvador" },
  { cc: "NI", code: "505", name: "Nicaragua" },
  { cc: "CR", code: "506", name: "Costa Rica" },
  { cc: "PA", code: "507", name: "Panamá" },
  { cc: "DO", code: "1809", name: "R. Dominicana" },
  { cc: "CU", code: "53", name: "Cuba" },
  { cc: "ES", code: "34", name: "España" },
  { cc: "BR", code: "55", name: "Brasil" },
  { cc: "CA", code: "1", name: "Canadá" },
  { cc: "GB", code: "44", name: "Reino Unido" },
];

// ── AUTHENTICATION COMPONENT ─────────────────────────────────
function AuthScreen({ onLogin, onRegisterPending, isMobile }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dialCode, setDialCode] = useState({ cc: "MX", code: "52", name: "México" });
  const [geoLoading, setGeoLoading] = useState(false);
  const [showDialMenu, setShowDialMenu] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  // Auto-detectar país por IP al cambiar a modo registro
  useEffect(() => {
    if (!isLogin) {
      setGeoLoading(true);
      fetch("https://ipapi.co/json/")
        .then(r => r.json())
        .then(data => {
          const found = DIAL_CODES.find(d => d.cc === data.country_code);
          if (found) setDialCode(found);
        })
        .catch(() => {})
        .finally(() => setGeoLoading(false));
    }
  }, [isLogin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    // Validar todos los campos
    if (isLogin) {
      if (!email || !password) {
        setError("Por favor, completa todos los campos.");
        return;
      }
    } else {
      if (!name || !email || !password || !phone || !confirmPassword) {
        setError("Todos los campos son obligatorios.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Las contraseñas no coinciden. Verifica e intenta de nuevo.");
        return;
      }
      if (password.length < 8) {
        setError("La contraseña debe tener al menos 8 caracteres.");
        return;
      }
      if (phone.replace(/\D/g, "").length < 6) {
        setError("Ingresa un número de teléfono válido.");
        return;
      }
    }
    setLoading(true);
    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          if (error.message.includes("Invalid") || error.message.includes("invalid") || error.message.includes("credentials")) {
            setError("Correo o contraseña incorrectos.");
          } else if (error.message.includes("confirmed") || error.message.includes("not confirmed")) {
            setError("Tu correo aún no está confirmado. Revisa tu bandeja de entrada.");
          } else {
            setError(error.message);
          }
        } else if (data.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", data.user.id)
            .single();
          onLogin({ ...data.user, ...profile }, false);
        }
      } else {
        const fullPhone = `+${dialCode.code}${phone.replace(/\D/g, "")}`;
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name, phone: fullPhone } },
        });
        if (error) {
          setError(error.message);
        } else if (data.user) {
          // Enviar datos al webhook de LeadConnector
          fetch("https://services.leadconnectorhq.com/hooks/jTugwykceKyJlATOSvkb/webhook-trigger/bfea9bc6-0e48-4374-89d3-bd9426b7c4a4", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, phone: fullPhone }),
          }).catch(() => {}); // silencioso si falla
          // Mostrar pantalla de verificación — el usuario DEBE confirmar su email antes de continuar
          onRegisterPending(email);
        }
      }
    } catch (err) {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (field) => ({
    width: "100%",
    height: 52,
    background: focusedField === field ? "rgba(108,114,255,0.06)" : "rgba(8, 15, 37, 0.6)",
    border: focusedField === field ? "1px solid #6C72FF" : "1px solid rgba(255,255,255,0.08)",
    borderRadius: 10,
    padding: "0 16px",
    color: "#FFFFFF",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
    transition: "all 0.25s ease",
    boxShadow: focusedField === field ? "0 0 0 3px rgba(108,114,255,0.12)" : "none",
  });

  const accentColor = isLogin ? "#6C72FF" : "#00f5a0";
  const accentColorRGB = isLogin ? "108,114,255" : "0,245,160";

  const testimonials = [
    "\"Pasé de perder el 30% a generar ingresos consistentes en 90 días.\" — Carlos M.",
    "\"El método PEDEM cambió completamente mi forma de operar.\" — María J.",
    "\"Por fin entendí que el trading es psicología, no suerte.\" — Andrés T.",
    "\"INGRESARIOS me dio la estructura que ningún curso me dio.\" — Sofía R.",
  ];

  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      flexDirection: isMobile ? "column" : "row",
      background: "#04070F", 
      color: "#fff", 
      fontFamily: "'Inter', sans-serif", 
      overflowX: "hidden" 
    }}>

      {/* ── LEFT PANEL ── */}
      <div style={{ 
        flex: isMobile ? "none" : 1, 
        display: "flex", 
        flexDirection: "column", 
        justifyContent: "space-between", 
        padding: isMobile ? "40px 24px" : "48px 56px", 
        position: "relative", 
        overflow: "hidden", 
        minWidth: 0,
        height: isMobile ? (isLogin ? "35vh" : "25vh") : "auto"
      }}>
        {/* Chart Background Image */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(/${isLogin ? "auth_bg_login" : "auth_bg_register"}.png)`,
          backgroundSize: "cover", backgroundPosition: "center right",
          opacity: 0.55,
          transition: "background-image 0.5s",
          pointerEvents: "none"
        }} />
        {/* Dark gradient overlay: left dark → transparent → slightly dark on right */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to right, rgba(4,7,15,0.92) 0%, rgba(4,7,15,0.65) 40%, rgba(4,7,15,0.45) 100%)",
          pointerEvents: "none"
        }} />
        {/* Bottom fade */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "30%",
          background: "linear-gradient(to top, rgba(4,7,15,0.9) 0%, transparent 100%)",
          pointerEvents: "none"
        }} />

        {/* Logo */}
        <div style={{ position: "relative", zIndex: 2 }}>
          <img
            src="/logo-negro.png"
            alt="INGRESARIOS"
            style={{
              height: 36,
              width: "auto",
              filter: "brightness(0) invert(1)",
              opacity: 0.95
            }}
          />
        </div>

        {/* Main headline */}
        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `rgba(${accentColorRGB},0.12)`, border: `1px solid rgba(${accentColorRGB},0.3)`, borderRadius: 20, padding: "6px 14px", marginBottom: 24, transition: "all 0.5s" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: accentColor, boxShadow: `0 0 8px ${accentColor}` }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: accentColor, letterSpacing: 1, textTransform: "uppercase" }}>
              {isLogin ? "Plataforma de Trading de Élite" : "Únete a la Comunidad"}
            </span>
          </div>
          <h2 style={{ fontSize: isMobile ? 32 : 42, fontWeight: 900, lineHeight: 1.1, letterSpacing: -1.5, margin: "0 0 20px" }}>
            {isLogin ? (
              <><span style={{ color: "#fff" }}>Bienvenido</span><br /><span style={{ color: accentColor }}> de vuelta.</span></>
            ) : (
              <><span style={{ color: "#fff" }}>Tu journey</span><br /><span style={{ color: accentColor }}> empieza hoy.</span></>
            )}
          </h2>
          <p style={{ fontSize: 15, color: "rgba(174, 185, 225, 0.7)", maxWidth: 360, lineHeight: 1.7 }}>
            {isLogin
              ? "El entorno de análisis, disciplina y resultados que los mercados exigen. Tu sesión te espera."
              : "Accede al método PEDEM, tu arquetipo de trader, AI coaching y una comunidad de alto rendimiento."}
          </p>

          {/* Feature pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 32 }}>
            {["⚡ Simulador Pro", "🧠 GENY IA Coach", "📊 Método PEDEM", "🎯 Retos Semanales"].map(f => (
              <div key={f} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "7px 14px", fontSize: 12, color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial - Hidden on mobile to save space */}
        {!isMobile && (
          <div style={{ position: "relative", zIndex: 2, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "20px 24px" }}>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, margin: 0 }}>
              {testimonials[Math.floor(Date.now() / 1000) % testimonials.length]}
            </p>
          </div>
        )}
      </div>

      {/* ── RIGHT PANEL ── */}
      <div style={{ 
        width: isMobile ? "100%" : 480, 
        flexShrink: 0, 
        background: isMobile ? "transparent" : "rgba(10, 16, 35, 0.95)", 
        borderLeft: isMobile ? "none" : "1px solid rgba(255,255,255,0.06)", 
        display: "flex", 
        flexDirection: "column", 
        justifyContent: "center", 
        padding: isMobile ? "32px 24px 60px" : "56px 48px", 
        position: "relative" 
      }}>

        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontWeight: 900, fontSize: 26, margin: "0 0 6px", letterSpacing: -0.5 }}>
            {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
          </h1>
          <p style={{ margin: 0, fontSize: 14, color: "rgba(174, 185, 225, 0.5)" }}>
            {isLogin ? "Ingresa tus credenciales para continuar." : "Completa el formulario para empezar."}
          </p>
        </div>

        {/* Tab switcher */}
        <div style={{ display: "flex", background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: 4, marginBottom: 32, border: "1px solid rgba(255,255,255,0.06)" }}>
          {[{ label: "Iniciar Sesión", val: true }, { label: "Registrarse", val: false }].map(({ label, val }) => (
            <button
              key={label}
              onClick={() => { setIsLogin(val); setError(""); }}
              style={{
                flex: 1, border: "none", borderRadius: 7, padding: "10px", cursor: "pointer", fontSize: 13, fontWeight: 600, transition: "all 0.25s",
                background: isLogin === val ? (val ? "#6C72FF" : "#00f5a0") : "transparent",
                color: isLogin === val ? "#fff" : "rgba(174, 185, 225, 0.5)",
                boxShadow: isLogin === val ? (val ? "0 4px 12px rgba(108,114,255,0.3)" : "0 4px 12px rgba(0,245,160,0.25)") : "none",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* 1. Nombre */}
          {!isLogin && (
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "rgba(174, 185, 225, 0.6)", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 8 }}>Nombre de Trader</label>
              <input
                type="text" value={name} onChange={e => setName(e.target.value)} required
                onFocus={() => setFocusedField("name")} onBlur={() => setFocusedField(null)}
                style={inputStyle("name")} placeholder="Ej. Alexander"
              />
            </div>
          )}

          {/* 2. Email */}
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "rgba(174, 185, 225, 0.6)", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 8 }}>Correo Electrónico</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)} required
              onFocus={() => setFocusedField("email")} onBlur={() => setFocusedField(null)}
              style={inputStyle("email")} placeholder="trader@dominio.com"
            />
          </div>
          {!isLogin && (
            <div style={{ position: "relative" }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "rgba(174, 185, 225, 0.6)", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 8 }}>
                Teléfono {geoLoading && <span style={{ fontSize: 10, color: "rgba(174,185,225,0.4)", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>Detectando país...</span>}
              </label>
              <div style={{ display: "flex", gap: 0, position: "relative" }}>
                {/* Selector de código de área */}
                <button
                  type="button"
                  onClick={() => setShowDialMenu(v => !v)}
                  onBlur={() => setTimeout(() => setShowDialMenu(false), 200)}
                  style={{
                    height: 52, padding: "0 14px", background: focusedField === "phone" ? "rgba(108,114,255,0.06)" : "rgba(8,15,37,0.6)",
                    border: focusedField === "phone" ? "1px solid #6C72FF" : "1px solid rgba(255,255,255,0.08)",
                    borderRight: "none", borderRadius: "10px 0 0 10px", color: "#fff", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 8, fontSize: 14, flexShrink: 0, whiteSpace: "nowrap",
                  }}
                >
                  <span style={{ fontSize: 18 }}>{countryFlag(dialCode.cc)}</span>
                  <span style={{ color: "rgba(174,185,225,0.8)", fontSize: 13 }}>+{dialCode.code}</span>
                  <span style={{ fontSize: 10, opacity: 0.5 }}>▼</span>
                </button>
                {/* Input del número */}
                <input
                  type="tel" value={phone} onChange={e => setPhone(e.target.value)} required
                  onFocus={() => setFocusedField("phone")} onBlur={() => setFocusedField(null)}
                  style={{
                    ...inputStyle("phone"),
                    borderRadius: "0 10px 10px 0",
                    borderLeft: focusedField === "phone" ? "1px solid #6C72FF" : "1px solid rgba(255,255,255,0.08)",
                  }}
                  placeholder="Ej. 5512345678"
                />
              </div>
              {/* Dropdown de países */}
              {showDialMenu && (
                <div style={{
                  position: "absolute", top: "100%", left: 0, zIndex: 50, marginTop: 4,
                  background: "#0a1020", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10,
                  width: 240, maxHeight: 220, overflowY: "auto", boxShadow: "0 12px 40px rgba(0,0,0,0.6)",
                }}>
                  {DIAL_CODES.map(d => (
                    <button
                      key={`${d.cc}-${d.code}`} type="button"
                      onClick={() => { setDialCode(d); setShowDialMenu(false); }}
                      style={{
                        width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 16px",
                        background: d.cc === dialCode.cc ? "rgba(108,114,255,0.15)" : "transparent",
                        border: "none", color: "#fff", cursor: "pointer", fontSize: 13, textAlign: "left",
                      }}
                    >
                      <span style={{ fontSize: 18 }}>{countryFlag(d.cc)}</span>
                      <span style={{ flex: 1, color: "rgba(174,185,225,0.85)" }}>{d.name}</span>
                      <span style={{ color: "rgba(174,185,225,0.4)", fontSize: 12 }}>+{d.code}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3+4. Contraseña y confirmación — solo en registro */}
          {!isLogin ? (
            <>
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "rgba(174, 185, 225, 0.6)", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 8 }}>Contraseña</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required
                    onFocus={() => setFocusedField("pass")} onBlur={() => setFocusedField(null)}
                    style={{ ...inputStyle("pass"), paddingRight: 48 }} placeholder="Mín. 8 caracteres"
                  />
                  <span onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", cursor: "pointer", fontSize: 16, color: "rgba(174,185,225,0.4)", userSelect: "none" }}>
                    {showPass ? "🙈" : "👁"}
                  </span>
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "rgba(174, 185, 225, 0.6)", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 8 }}>Confirmar Contraseña</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showConfirm ? "text" : "password"} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required
                    onFocus={() => setFocusedField("confirm")} onBlur={() => setFocusedField(null)}
                    style={{
                      ...inputStyle("confirm"),
                      paddingRight: 48,
                      borderColor: confirmPassword && password !== confirmPassword
                        ? "rgba(255,80,80,0.6)"
                        : confirmPassword && password === confirmPassword
                          ? "rgba(0,245,160,0.5)"
                          : undefined,
                    }}
                    placeholder="Repite tu contraseña"
                  />
                  <span onClick={() => setShowConfirm(!showConfirm)} style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", cursor: "pointer", fontSize: 16, color: "rgba(174,185,225,0.4)", userSelect: "none" }}>
                    {showConfirm ? "🙈" : "👁"}
                  </span>
                  {confirmPassword && (
                    <span style={{ position: "absolute", right: 46, top: "50%", transform: "translateY(-50%)", fontSize: 14 }}>
                      {password === confirmPassword ? "✅" : "❌"}
                    </span>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: "rgba(174, 185, 225, 0.6)", letterSpacing: 1.2, textTransform: "uppercase" }}>Contraseña</label>
                <span style={{ fontSize: 12, color: "#6C72FF", cursor: "pointer" }}>¿Olvidaste tu clave?</span>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required
                  onFocus={() => setFocusedField("pass")} onBlur={() => setFocusedField(null)}
                  style={{ ...inputStyle("pass"), paddingRight: 48 }} placeholder="••••••••"
                />
                <span onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", cursor: "pointer", fontSize: 16, color: "rgba(174,185,225,0.4)", userSelect: "none" }}>
                  {showPass ? "🙈" : "👁"}
                </span>
              </div>
            </div>
          )}

          {error && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255, 80, 80, 0.08)", border: "1px solid rgba(255,80,80,0.2)", borderRadius: 10, padding: "12px 16px" }}>
              <span style={{ fontSize: 16 }}>⚠️</span>
              <span style={{ fontSize: 13, color: "#ff7b7b" }}>{error}</span>
            </div>
          )}

          <button
            type="submit" disabled={loading}
            style={{
              marginTop: 8, height: 54, width: "100%", border: "none", borderRadius: 12, cursor: loading ? "not-allowed" : "pointer",
              fontWeight: 700, fontSize: 15, letterSpacing: 0.3, transition: "all 0.3s",
              background: loading
                ? "rgba(108,114,255,0.4)"
                : isLogin
                  ? "linear-gradient(135deg, #6C72FF 0%, #4B50E0 100%)"
                  : "linear-gradient(135deg, #00f5a0 0%, #00b87a 100%)",
              color: isLogin || loading ? "#fff" : "#020F0A",
              boxShadow: loading ? "none" : isLogin ? "0 8px 24px rgba(108,114,255,0.35)" : "0 8px 24px rgba(0,245,160,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            }}
          >
            {loading ? (
              <><span style={{ display: "inline-block", width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> Procesando...</>
            ) : (
              isLogin ? "Entrar al Dashboard →" : "Comenzar Journey →"
            )}
          </button>
        </form>

        <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
          <p style={{ fontSize: 13, color: "rgba(174, 185, 225, 0.4)", margin: 0 }}>
            {isLogin ? "¿Aún no tienes cuenta?" : "¿Ya eres miembro?"}
            {" "}
            <span
              onClick={() => { setIsLogin(!isLogin); setError(""); }}
              style={{ color: accentColor, fontWeight: 700, cursor: "pointer", transition: "color 0.3s" }}
            >
              {isLogin ? "Regístrate gratis" : "Inicia sesión"}
            </span>
          </p>
        </div>

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}


const ChartTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return <div style={{ ...S.cardSm, minWidth: 110 }}><div style={{ color: "#888", fontSize: 10 }}>{label}</div><div style={{ color: "#00f5a0", fontWeight: 700 }}>${fmt(payload[0]?.value)}</div></div>;
};

// ── PREMIUM ───────────────────────────────────────────────────
// ── PART 1 OF APP CODE ────────────────────────────────────────
const WA_NUMBER = "573227476543";
const WA_MSG = encodeURIComponent("¡Hola Juan! Quiero acceder al Plan PREMIUM de INGRESARIOS 🚀");
const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${WA_MSG}`;
const PREMIUM_FEATURES = [
  { free: true, label: "Simulador con 5 activos" }, { free: true, label: "Método PEDEM completo" }, { free: true, label: "Bitácora de trades" },
  { free: true, label: "Reto Sombra 7 días" }, { free: true, label: "Reto Flow 7 días" }, { free: true, label: "GENY IA Chat (limitado)" },
  { free: false, label: "20+ activos en vivo" }, { free: false, label: "Torneos con premios reales" }, { free: false, label: "Reto 21 — Certificación" },
  { free: false, label: "GENY IA ilimitado" }, { free: false, label: "Academia 7 Mundos" }, { free: false, label: "Señales Geny Trend" },
  { free: false, label: "Comunidad privada" }, { free: false, label: "Sesiones en vivo con Juan" },
];
function PremiumModal({ onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 16 }}>
      <div style={{ maxWidth: 520, width: "100%", maxHeight: "92vh", overflowY: "auto", borderRadius: 16, border: "1px solid rgba(255,215,0,0.25)", background: "linear-gradient(160deg,#0d1117,#0f1620)", padding: 0 }}>
        <div style={{ background: "linear-gradient(135deg,#ffd70022,#ff990022)", borderBottom: "1px solid rgba(255,215,0,0.2)", padding: "24px 24px 20px", borderRadius: "16px 16px 0 0", textAlign: "center" }}>
          <div style={{ fontSize: 38, marginBottom: 8 }}>👑</div>
          <div style={{ fontWeight: 900, fontSize: 22, background: "linear-gradient(90deg,#ffd700,#ffaa00)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>INGRESARIOS PREMIUM</div>
          <div style={{ color: "#aaa", fontSize: 13, marginTop: 6 }}>Acceso completo a la plataforma institucional</div>
          <div style={{ marginTop: 14, display: "inline-block", background: "rgba(255,215,0,0.1)", border: "1px solid rgba(255,215,0,0.3)", borderRadius: 8, padding: "6px 20px" }}>
            <span style={{ color: "#888", fontSize: 12, textDecoration: "line-through" }}>$197 USD/mes</span>
            <span style={{ color: "#ffd700", fontWeight: 900, fontSize: 20, marginLeft: 10 }}>$97 USD</span>
            <span style={{ color: "#888", fontSize: 12 }}>/mes</span>
          </div>
        </div>
        <div style={{ padding: "20px 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 20 }}>
            {PREMIUM_FEATURES.map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", borderRadius: 8, background: f.free ? "rgba(255,255,255,0.02)" : "rgba(255,215,0,0.05)", border: `1px solid ${f.free ? "rgba(255,255,255,0.06)" : "rgba(255,215,0,0.15)"}` }}>
                <span style={{ fontSize: 14, flexShrink: 0 }}>{f.free ? "✅" : "⭐"}</span>
                <span style={{ color: f.free ? "#777" : "#ddb", fontSize: 12 }}>{f.label}</span>
              </div>
            ))}
          </div>
          <div style={{ background: "rgba(0,245,160,0.06)", border: "1px solid rgba(0,245,160,0.2)", borderRadius: 10, padding: "12px 16px", marginBottom: 18, display: "flex", gap: 12, alignItems: "center" }}>
            <span style={{ fontSize: 22 }}>🛡️</span>
            <div><div style={{ color: "#00f5a0", fontWeight: 700, fontSize: 13 }}>Garantía 7 días sin riesgo</div><div style={{ color: "#777", fontSize: 12, marginTop: 2 }}>Si no ves valor, te devolvemos el 100% sin preguntas.</div></div>
          </div>
          <a href={WA_LINK} target="_blank" rel="noreferrer" style={{ display: "block", textDecoration: "none" }}>
            <div style={{ background: "linear-gradient(135deg,#25d36622,#25d36644)", border: "2px solid #25d366aa", borderRadius: 12, padding: "16px 20px", textAlign: "center", cursor: "pointer" }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>💬</div>
              <div style={{ color: "#25d366", fontWeight: 900, fontSize: 16 }}>Quiero acceso PREMIUM</div>
              <div style={{ color: "#25d36699", fontSize: 12, marginTop: 4 }}>Toca aquí → te contactamos por WhatsApp en menos de 2 horas</div>
            </div>
          </a>
          <button onClick={onClose} style={{ marginTop: 12, background: "transparent", border: "none", color: "#555", fontSize: 12, width: "100%", cursor: "pointer", padding: "8px 0" }}>Seguir con versión gratuita →</button>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// QUIZ SCREEN
// ════════════════════════════════════════════════════════════════
function QuizScreen({ userName, onComplete, isMobile }) {
  const [step, setStep] = useState(0); // 0-8 = preguntas
  const [respuestas, setResp] = useState([]);
  const [seleccion, setSel] = useState(null);
  const [animating, setAnim] = useState(false);

  const calcArquetipo = (resps) => {
    const conteo = {};
    resps.forEach(v => { conteo[v] = (conteo[v] || 0) + 1; });
    return Object.entries(conteo).sort((a, b) => b[1] - a[1])[0][0];
  };

  const handleOpcion = (valor) => {
    if (animating) return;
    setSel(valor); setAnim(true);
    setTimeout(() => {
      const nuevas = [...respuestas, valor];
      setResp(nuevas); setSel(null); setAnim(false);
      if (step < 8) setStep(s => s + 1);
      else { const arq = calcArquetipo(nuevas); onComplete(userName || "Trader", arq); }
    }, 520);
  };

  const pct = Math.round(((step + 1) / 9) * 100);
  const q = QUIZ[step];

  // PREGUNTAS
  return (
    <div style={{ minHeight: "100vh", background: "#080c10", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: isMobile ? "24px 16px" : 20 }}>
      <div style={{ maxWidth: 540, width: "100%" }}>
        {/* Progress */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <img src="/logo-negro.png" alt="INGRESARIOS" style={{ height: 18, width: "auto", filter: "brightness(0) invert(1)", opacity: 0.9 }} />
            <div style={{ color: "#555", fontSize: 12 }}>Pregunta {step + 1} de 9</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 6, height: 6 }}>
            <div style={{ background: "linear-gradient(90deg,#00f5a0,#00d4ff)", borderRadius: 6, height: 6, width: `${pct}%`, transition: "width .5s ease" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            <div style={{ display: "flex", gap: 4 }}>
              {QUIZ.map((_, i) => (
                <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: i < step ? "#00f5a0" : i === step ? "#00d4ff" : "rgba(255,255,255,0.1)", transition: "background .3s" }} />
              ))}
            </div>
            <div style={{ color: "#555", fontSize: 11 }}>{pct}% completado</div>
          </div>
        </div>

        {/* Pregunta */}
        <div style={{ ...S.card, marginBottom: 16, padding: isMobile ? "20px 16px" : "28px 24px", textAlign: "center", background: "rgba(255,255,255,0.03)" }}>
          <div style={{ fontSize: isMobile ? 32 : 44, marginBottom: 16 }}>{q.emoji}</div>
          <div style={{ fontWeight: 800, fontSize: isMobile ? 16 : 18, lineHeight: 1.4, color: "#fff" }}>{q.pregunta}</div>
        </div>

        {/* Opciones */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {q.opciones.map((op, i) => (
            <button key={i} onClick={() => handleOpcion(op.valor)} style={{ background: seleccion === op.valor ? "rgba(0,245,160,0.15)" : "rgba(255,255,255,0.03)", border: `1.5px solid ${seleccion === op.valor ? "#00f5a0" : "rgba(255,255,255,0.1)"}`, borderRadius: 12, padding: "14px 20px", cursor: "pointer", color: seleccion === op.valor ? "#00f5a0" : "#ccc", fontSize: 14, textAlign: "left", fontWeight: seleccion === op.valor ? 700 : 400, transition: "all .2s", transform: seleccion === op.valor ? "scale(1.01)" : "scale(1)" }}>
              <span style={{ marginRight: 12, color: seleccion === op.valor ? "#00f5a0" : "#444", fontWeight: 700 }}>{String.fromCharCode(65 + i)}.</span>
              {op.texto}
            </button>
          ))}
        </div>

        {step > 0 && (
          <button onClick={() => { setStep(s => s - 1); setResp(r => r.slice(0, -1)); }} style={{ marginTop: 14, background: "transparent", border: "none", color: "#444", fontSize: 12, cursor: "pointer", width: "100%", padding: "8px 0" }}>
            ← Pregunta anterior
          </button>
        )}
      </div>
    </div>
  );
}

// ── PART 2 OF APP CODE ────────────────────────────────────────
// ════════════════════════════════════════════════════════════════
// RESULTADO SCREEN
// ════════════════════════════════════════════════════════════════
function ResultadoScreen({ nombre, arquetipo, onEnter, isMobile }) {
  const A = ARQUETIPOS[arquetipo];
  const [genyInsight, setGenyInsight] = useState("");
  const [loadingGeny, setLoadingGeny] = useState(false);
  const [insightReady, setInsightReady] = useState(false);

  useEffect(() => {
    const getInsight = async () => {
      setLoadingGeny(true);
      try {
        const res = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system: "Eres GENY, coach IA de INGRESARIOS. Experto en psicología Jungiana del trader, método PEDEM y flow state. Español latinoamericano, cálido, motivador y preciso. Máximo 3 oraciones impactantes.", messages: [{ role: "user", content: `El trader ${nombre} obtuvo el arquetipo "${A.nombre}". Dale una bienvenida personalizada al simulador INGRESARIOS con un insight profundo sobre su arquetipo y el primer paso concreto que debe dar hoy. Menciona el método PEDEM.` }] }) });
        const d = await res.json();
        setGenyInsight(d.content?.[0]?.text || "");
      } catch { setGenyInsight(`${nombre}, tu arquetipo revela mucho sobre tu journey. El método PEDEM fue diseñado para traders exactamente como tú. Da el primer paso hoy.`); }
      setLoadingGeny(false); setInsightReady(true);
    };
    getInsight();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#080c10", display: "flex", alignItems: "center", justifyContent: "center", padding: isMobile ? "32px 16px" : 20 }}>
      <div style={{ maxWidth: 560, width: "100%" }}>
        {/* Header resultado */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ marginBottom: 16, display: "flex", justifyContent: "center" }}>
            <img src="/logo-negro.png" alt="INGRESARIOS" style={{ height: 22, width: "auto", filter: "brightness(0) invert(1)", opacity: 0.7 }} />
          </div>
          <div style={{ fontSize: isMobile ? 48 : 64, marginBottom: 12 }}>{A.emoji}</div>
          <div style={{ fontWeight: 900, fontSize: isMobile ? 24 : 28, color: A.color, marginBottom: 6 }}>{A.nombre}</div>
          <div style={{ color: "#888", fontSize: isMobile ? 13 : 14, fontStyle: "italic" }}>{A.subtitulo}</div>
          <div style={{ color: "#666", fontSize: isMobile ? 12 : 13, marginTop: 8 }}>Hola, <span style={{ color: "#fff", fontWeight: 700 }}>{nombre}</span></div>
        </div>

        {/* Descripción */}
        <div style={{ ...S.card, marginBottom: 14, borderColor: `${A.color}33`, background: `linear-gradient(135deg,${A.color}08,rgba(255,255,255,0.02))`, padding: "20px 22px" }}>
          <div style={{ color: "#ccc", fontSize: 14, lineHeight: 1.8 }}>{A.descripcion}</div>
        </div>

        {/* Fortaleza / Desafío / Próximo Paso */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
          {[["💪 Fortaleza", A.fortaleza, "#00f5a0"], ["⚡ Desafío", A.desafio, "#ff9500"], ["🚀 Próximo Paso", A.proxPaso, "#00d4ff"]].map(([l, v, c]) => (
            <div key={l} style={{ ...S.cardSm, borderTop: `3px solid ${c}` }}>
              <div style={{ color: c, fontSize: 10, fontWeight: 700, marginBottom: 6 }}>{l}</div>
              <div style={{ color: "#ccc", fontSize: 12, lineHeight: 1.5 }}>{v}</div>
            </div>
          ))}
        </div>

        {/* GENY insight */}
        <div style={{ ...S.card, marginBottom: 20, borderColor: "rgba(0,245,160,0.2)", background: "rgba(0,245,160,0.04)", padding: "16px 18px" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#00f5a0,#00d4ff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>🤖</div>
            <div>
              <div style={{ color: "#00f5a0", fontWeight: 700, fontSize: 12, marginBottom: 6 }}>GENY IA — Mensaje personalizado para ti</div>
              {loadingGeny ? <div style={{ color: "#555", fontSize: 13 }}>Analizando tu arquetipo...</div>
                : <div style={{ color: "#ccc", fontSize: 13, lineHeight: 1.7 }}>{genyInsight}</div>}
            </div>
          </div>
        </div>

        {/* Quote */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ color: `${A.color}88`, fontSize: 12, fontStyle: "italic", lineHeight: 1.7 }}>{A.quote}</div>
        </div>

        {/* CTA */}
        <button onClick={onEnter} style={{ background: `linear-gradient(135deg,${A.color},${A.color}aa)`, border: "none", borderRadius: 14, padding: "18px 0", cursor: "pointer", fontWeight: 900, fontSize: 17, color: "#000", width: "100%", boxShadow: `0 4px 32px ${A.color}44` }}>
          Entrar al Simulador INGRESARIOS {A.emoji}
        </button>

        <div style={{ textAlign: "center", marginTop: 14, color: "#333", fontSize: 12 }}>
          Tu arquetipo y sesión han sido guardados permanentemente en tu perfil.
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// PEDEM MODALS
// ════════════════════════════════════════════════════════════════
function PedemPlanModal({ sym, dir, px, onConfirm, onCancel, isMobile }) {
  const [f, setF] = useState({ setup: "", tesis: "", rr: "1:2", sl: "", tp: "" });
  const ok = f.setup && f.tesis && f.sl && f.tp;
  const fields = [{ k: "setup", l: "📋 Setup / Patrón técnico", ph: "Ej: Ruptura de resistencia con engulfing...", multi: true }, { k: "tesis", l: "🧠 Tesis del trade", ph: "¿Por qué este trade?", multi: true }, { k: "rr", l: "⚖️ Relación R:R", ph: "Ej: 1:2" }, { k: "sl", l: "🛑 Stop Loss", ph: `Ej: ${(px * .99).toFixed(2)}` }, { k: "tp", l: "🎯 Take Profit", ph: `Ej: ${(px * 1.02).toFixed(2)}` }];
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16 }}>
      <div style={{ ...S.card, maxWidth: 480, width: "100%", maxHeight: "92vh", overflowY: "auto" }}>
        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "center", gap: 10, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ fontSize: 20 }}>📐</div>
            <div><div style={{ fontWeight: 900, fontSize: 14, color: "#00f5a0" }}>PEDEM · PLANEAR</div><div style={{ color: "#666", fontSize: 11 }}>Completa tu plan antes de ejecutar</div></div>
          </div>
          <div style={{ marginLeft: isMobile ? 0 : "auto", ...S.cardSm, padding: "4px 10px", marginTop: isMobile ? 8 : 0 }}><span style={{ color: dir === "BUY" ? "#00f5a0" : "#ff6b6b", fontWeight: 700 }}>{dir}</span><span style={{ color: "#888" }}> {sym} @ </span><span>${fmt(px)}</span></div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {fields.map(({ k, l, ph, multi }) => (
            <div key={k}><label style={S.label}>{l}</label>
              {multi ? <textarea rows={2} style={S.textarea} placeholder={ph} value={f[k]} onChange={e => setF(p => ({ ...p, [k]: e.target.value }))} />
                : <input style={S.inp} placeholder={ph} value={f[k]} onChange={e => setF(p => ({ ...p, [k]: e.target.value }))} />}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <button style={redBtn()} onClick={onCancel}>Cancelar</button>
          <button style={{ ...glowBtn(), opacity: ok ? 1 : 0.4, flex: 1 }} disabled={!ok} onClick={() => onConfirm(f)}>⚡ Ejecutar Trade</button>
        </div>
      </div>
    </div>
  );
}
function PedemCloseModal({ trade, curPrice, onConfirm, onCancel, isMobile }) {
  const [f, setF] = useState({ que_paso: "", errores: "", mejora: "" });
  const pl = (curPrice - trade.entry) * trade.qty * (trade.dir === "BUY" ? 1 : -1);
  const ok = f.que_paso && f.mejora;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16 }}>
      <div style={{ ...S.card, maxWidth: 460, width: "100%", maxHeight: "92vh", overflowY: "auto" }}>
        <div style={{ fontWeight: 900, fontSize: 14, color: "#00d4ff", marginBottom: 14 }}>📓 PEDEM · EVALUAR & MEJORAR</div>
        <div style={{ ...S.cardSm, marginBottom: 12, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          {[["Trade", `${trade.dir} ${trade.sym}×${trade.qty}`], ["Entrada", `$${fmt(trade.entry)}`], ["Salida", `$${fmt(curPrice)}`]].map(([l, v]) => (<div key={l} style={{ minWidth: isMobile ? "45%" : "auto" }}><div style={{ color: "#666", fontSize: 10 }}>{l}</div><div style={{ fontWeight: 700, fontSize: isMobile ? 12 : 14 }}>{v}</div></div>))}
          <div style={{ minWidth: isMobile ? "45%" : "auto" }}><div style={{ color: "#666", fontSize: 10 }}>P&L</div><div style={{ fontWeight: 900, fontSize: isMobile ? 14 : 15, color: pl >= 0 ? "#00f5a0" : "#ff6b6b" }}>{fmtP(pl)}</div></div>
        </div>
        {[["que_paso", "📝 ¿Qué pasó?", "Describe cómo se desarrolló el trade..."], ["errores", "⚠️ Errores (opcional)", "SL no respetado, revenge trading..."], ["mejora", "🚀 ¿Qué mejorarás?", "Acción concreta para el próximo trade..."]].map(([k, l, ph]) => (
          <div key={k} style={{ marginBottom: 10 }}><label style={S.label}>{l}</label><textarea rows={2} style={S.textarea} placeholder={ph} value={f[k]} onChange={e => setF(p => ({ ...p, [k]: e.target.value }))} /></div>
        ))}
        <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
          <button style={redBtn()} onClick={onCancel}>Cancelar</button>
          <button style={{ ...glowBtn("#00d4ff"), opacity: ok ? 1 : 0.4, flex: 1 }} disabled={!ok} onClick={() => onConfirm(f)}>✅ Cerrar & Documentar</button>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// RETO SCREEN
// ════════════════════════════════════════════════════════════════
function RetoScreen({ tipo, data, color, completados, setCompletados, respuestas, setRespuestas, addXp, addCoins, isMobile }) {
  const [diaActivo, setDiaActivo] = useState(0);
  const [resp, setResp] = useState({ ejercicio: "", reflexion: "" });
  const [genyResp, setGenyResp] = useState("");
  const [loadingGeny, setLoadingGeny] = useState(false);
  const dia = data[diaActivo]; const completado = completados.includes(diaActivo); const savedResp = respuestas[diaActivo] || {};
  useEffect(() => { setResp(respuestas[diaActivo] || { ejercicio: "", reflexion: "" }); setGenyResp(""); }, [diaActivo]);
  const completar = async () => {
    if (!resp.ejercicio || !resp.reflexion) return;
    setRespuestas(p => ({ ...p, [diaActivo]: resp })); setCompletados(p => [...new Set([...p, diaActivo])]); addXp(40); addCoins(20); setLoadingGeny(true);
    try { const res = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system: `Eres GENY, coach IA de INGRESARIOS. Experto en Jung y flow. Español latinoamericano. 3-4 oraciones de feedback sobre el ejercicio del reto ${tipo === "sombra" ? "de la Sombra" : "del Flow"} completado.`, messages: [{ role: "user", content: `Día ${diaActivo + 1}: ${dia.titulo}\nEjercicio: ${resp.ejercicio}\nReflexión: ${resp.reflexion}` }] }) }); const d = await res.json(); setGenyResp(d.content?.[0]?.text || ""); } catch { setGenyResp("Excelente trabajo. La introspección honesta es el primer paso hacia el trader que quieres ser."); }
    setLoadingGeny(false);
  };
  const pct = Math.round((completados.length / 7) * 100);
  return (
    <div>
      <div style={{ ...S.card, marginBottom: 14, background: `linear-gradient(135deg,${color}12,rgba(255,255,255,0.02))`, borderColor: `${color}33` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ fontSize: 34 }}>{tipo === "sombra" ? "🌑" : "⚡"}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 900, fontSize: 16, color }}>{tipo === "sombra" ? "Reto de la Sombra — 7 Días" : "Reto del Flow — 7 Días"}</div>
            <div style={{ color: "#888", fontSize: 11, marginTop: 2 }}>{tipo === "sombra" ? "Psicología Jungiana aplicada al trading" : "Activa tu estado de flow · Zona óptima"}</div>
            <div style={{ marginTop: 7, background: "rgba(255,255,255,0.06)", borderRadius: 5, height: 7 }}><div style={{ background: `linear-gradient(90deg,${color},${color}aa)`, borderRadius: 5, height: 7, width: `${pct}%`, transition: "width .5s" }} /></div>
            <div style={{ color: "#666", fontSize: 11, marginTop: 3 }}>{completados.length}/7 días · {pct}%</div>
          </div>
          {completados.length === 7 && <div style={{ ...S.cardSm, color: "#ffd700", fontWeight: 700, textAlign: "center", padding: "8px 14px" }}>🏆 COMPLETADO<br /><span style={{ fontSize: 10, color: "#ffd700aa" }}>+280 XP · +140 🪙</span></div>}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 7, marginBottom: 14 }}>
        {data.map((d, i) => {
          const comp = completados.includes(i); const act = diaActivo === i; return (
            <button key={i} onClick={() => setDiaActivo(i)} style={{ background: act ? `${color}22` : comp ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.02)", border: `2px solid ${act ? color : comp ? `${color}55` : "rgba(255,255,255,0.07)"}`, borderRadius: 10, padding: "10px 4px", cursor: "pointer", textAlign: "center", transition: "all .2s" }}>
              <div style={{ fontSize: 17 }}>{comp ? "✅" : d.emoji}</div>
              <div style={{ color: act ? color : comp ? "#aaa" : "#555", fontSize: 10, fontWeight: 700, marginTop: 3 }}>Día {i + 1}</div>
            </button>
          );
        })}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 }}>
        <div>
          <div style={{ ...S.card, borderColor: `${dia.bgColor}33`, background: `linear-gradient(135deg,${dia.bgColor}10,rgba(255,255,255,0.02))`, marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}><div style={{ fontSize: 26 }}>{dia.emoji}</div><div><div style={{ fontWeight: 900, fontSize: 14, color: dia.bgColor }}>Día {dia.dia} — {dia.titulo}</div><div style={{ color: "#777", fontSize: 11 }}>{dia.subtitulo} · ⏱ {dia.duracion}</div></div></div>
            <div style={{ marginBottom: 12 }}><div style={{ color: "#888", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 7 }}>✍️ Ejercicio del día</div><div style={{ color: "#ccc", fontSize: 13, lineHeight: 1.7, background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "10px 12px" }}>{dia.ejercicio}</div></div>
            <div><div style={{ color: "#888", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 7 }}>💭 Pregunta de reflexión</div><div style={{ color: `${dia.bgColor}dd`, fontSize: 13, lineHeight: 1.7, fontStyle: "italic", background: `${dia.bgColor}10`, borderRadius: 8, padding: "10px 12px", borderLeft: `3px solid ${dia.bgColor}` }}>{dia.pregunta}</div></div>
          </div>
        </div>
        <div style={S.card}>
          <div style={{ fontWeight: 700, marginBottom: 12 }}>{completado ? "✅ Día Completado" : "📝 Tu Respuesta"}</div>
          <div style={{ marginBottom: 10 }}><label style={S.label}>Ejercicio del día</label><textarea rows={4} style={{ ...S.textarea, opacity: completado ? 0.6 : 1, fontSize: isMobile ? 14 : 13 }} disabled={completado} placeholder="Escribe tu respuesta al ejercicio..." value={completado ? savedResp.ejercicio || "" : resp.ejercicio} onChange={e => setResp(p => ({ ...p, ejercicio: e.target.value }))} /></div>
          <div style={{ marginBottom: 12 }}><label style={S.label}>Reflexión</label><textarea rows={3} style={{ ...S.textarea, opacity: completado ? 0.6 : 1, fontSize: isMobile ? 14 : 13 }} disabled={completado} placeholder="Tu respuesta a la pregunta..." value={completado ? savedResp.reflexion || "" : resp.reflexion} onChange={e => setResp(p => ({ ...p, reflexion: e.target.value }))} /></div>
          {!completado && <button style={{ ...glowBtn(color), width: "100%", textAlign: "center", padding: isMobile ? "14px" : "12px", fontSize: isMobile ? 14 : 13, opacity: (resp.ejercicio && resp.reflexion) ? 1 : 0.4 }} disabled={!resp.ejercicio || !resp.reflexion} onClick={completar}>✅ Completar Día {dia.dia} · +40 XP · +20 🪙</button>}
          {(loadingGeny || genyResp) && <div style={{ marginTop: 12, ...S.cardSm, borderColor: `${color}44`, background: `${color}08` }}><div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}><span style={{ fontSize: 16 }}>🤖</span><span style={{ color, fontWeight: 700, fontSize: 12 }}>Feedback de GENY</span></div>{loadingGeny ? <div style={{ color: "#666" }}>Analizando...</div> : <div style={{ color: "#ccc", fontSize: 12, lineHeight: 1.7 }}>{genyResp}</div>}</div>}
        </div>
      </div>
    </div>
  );
}

// ── PART 3 OF APP CODE ────────────────────────────────────────
// ════════════════════════════════════════════════════════════════
// DASHBOARD
// ════════════════════════════════════════════════════════════════
function Dashboard({ authUser, nombre, arquetipo, goSim, goRetoFlow, goRetoSombra, openPremium, isMobile }) {
  const A = ARQUETIPOS[arquetipo] || ARQUETIPOS.explorador;
  const metrics = [
    { label: "Balance Virtual", value: "$100,000", sub: "USD", color: "#6C72FF", icon: "◈" },
    { label: "P&L Total", value: "+$0.00", sub: "0.00%", color: "#00f5a0", icon: "◉" },
    { label: "Win Rate", value: "0%", sub: "sin trades", color: "#00d4ff", icon: "◎" },
    { label: "GENY Coins", value: "50", sub: "monedas", color: "#ffd700", icon: "✦" },
    { label: "XP Ganado", value: "0", sub: "pts. totales", color: "#bf5fff", icon: "◆" },
    { label: "Trades Cerrados", value: "0", sub: "operaciones", color: "#ff9f7f", icon: "◇" },
  ];
  return (
    <div style={{ padding: isMobile ? "20px 16px" : "28px 32px", maxWidth: 1200, margin: "0 auto", paddingBottom: 60, width: "100%" }}>
      <style>{`
        .metric-card { transition: all 0.25s ease; }
        .metric-card:hover { transform: translateY(-3px); box-shadow: 0 8px 32px rgba(0,0,0,0.4) !important; }
        .reto-card { transition: all 0.25s ease; cursor: pointer; }
        .reto-card:hover { transform: translateY(-3px); }
        .feature-card { transition: all 0.25s ease; }
        .feature-card:hover { opacity: 0.85 !important; transform: translateY(-2px); }
      `}</style>

      {/* Hero Banner */}
      <div style={{
        background: "linear-gradient(135deg, rgba(108,114,255,0.12) 0%, rgba(0,212,255,0.06) 50%, rgba(191,95,255,0.08) 100%)",
        border: "1px solid rgba(108,114,255,0.2)",
        padding: isMobile ? "20px" : "28px 32px", marginBottom: 28,
        display: "flex", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center",
        flexDirection: isMobile ? "column" : "row",
        gap: 20,
        position: "relative", overflow: "hidden",
      }}>
        {/* BG decoration */}
        <div style={{ position: "absolute", right: -40, top: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(108,114,255,0.05)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: 80, bottom: -60, width: 140, height: 140, borderRadius: "50%", background: "rgba(0,212,255,0.04)", pointerEvents: "none" }} />

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 16,
            background: `linear-gradient(135deg, ${A.color}30, ${A.color}10)`,
            border: `1px solid ${A.color}40`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, flexShrink: 0,
          }}>
            {A.emoji}
          </div>
          <div>
            <div style={{ fontSize: 12, color: "rgba(174,185,225,0.5)", fontWeight: 500, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 4 }}>
              Bienvenido de vuelta
            </div>
            <div style={{ fontWeight: 900, fontSize: 26, color: "#fff", letterSpacing: -0.5, lineHeight: 1.1 }}>
              {nombre || "Trader"}
            </div>
            <div style={{ color: A.color, fontWeight: 700, fontSize: 13, marginTop: 4 }}>
              {A.nombre} · Nivel 1
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: isMobile ? "flex-start" : "flex-end", width: isMobile ? "100%" : "auto" }}>
          {/* XP Bar */}
          <div style={{ width: isMobile ? "100%" : 280 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: "rgba(174,185,225,0.5)", fontWeight: 600 }}>Progreso Nivel 2</span>
              <span style={{ fontSize: 11, color: A.color, fontWeight: 700 }}>0 / 100 XP</span>
            </div>
            <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ width: "0%", height: "100%", background: `linear-gradient(90deg, ${A.color}, ${A.color}80)`, borderRadius: 4, transition: "width 1s ease" }} />
            </div>
          </div>
          <button
            onClick={goSim}
            style={{
              background: "linear-gradient(135deg, #00f5a0 0%, #00b87a 100%)",
              border: "none", color: "#020F0A",
              borderRadius: 10, padding: "11px 22px",
              fontWeight: 700, cursor: "pointer",
              fontSize: 13, letterSpacing: 0.3,
              display: "flex", alignItems: "center", gap: 8,
              boxShadow: "0 4px 20px rgba(0,245,160,0.25)",
              transition: "all 0.2s",
            }}
          >
            <span>＋</span> Nuevo Trade
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(auto-fit, minmax(172px, 1fr))", gap: isMobile ? 10 : 14, marginBottom: 28 }}>
        {metrics.map((m, i) => (
          <div
            key={i}
            className="metric-card"
            style={{
              background: "rgba(255,255,255,0.025)",
              border: `1px solid rgba(255,255,255,0.07)`,
              borderRadius: 12, padding: "18px 20px",
              position: "relative", overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${m.color}60, transparent)`, borderRadius: "12px 12px 0 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: "rgba(174,185,225,0.5)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8 }}>{m.label}</div>
              <div style={{ fontSize: 18, color: m.color, opacity: 0.7 }}>{m.icon}</div>
            </div>
            <div style={{ fontWeight: 900, fontSize: 22, color: "#fff", letterSpacing: -0.5, marginBottom: 2 }}>{m.value}</div>
            <div style={{ fontSize: 11, color: "rgba(174,185,225,0.35)", fontWeight: 500 }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Retos Section */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{ width: 3, height: 18, background: "linear-gradient(180deg, #6C72FF, #00d4ff)", borderRadius: 2 }} />
          <h3 style={{ fontWeight: 800, fontSize: 14, color: "#fff", textTransform: "uppercase", letterSpacing: 1.2, margin: 0 }}>
            Retos Activos
          </h3>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
          {/* Reto Sombra */}
          <div
            onClick={goRetoSombra}
            className="reto-card"
            style={{
              background: "linear-gradient(135deg, rgba(191,95,255,0.08) 0%, rgba(108,114,255,0.04) 100%)",
              border: "1px solid rgba(191,95,255,0.25)",
              borderRadius: 14, padding: "22px 24px",
              display: "flex", alignItems: "center", gap: 18,
            }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(191,95,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>🌑</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 15, color: "#bf5fff", marginBottom: 4 }}>Reto de la Sombra</div>
              <div style={{ color: "rgba(174,185,225,0.5)", fontSize: 12 }}>7 días · Psicología Jungiana</div>
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <span style={{ fontSize: 10, fontWeight: 700, background: "rgba(191,95,255,0.2)", color: "#bf5fff", border: "1px solid rgba(191,95,255,0.3)", borderRadius: 4, padding: "2px 8px", letterSpacing: 0.5 }}>PSICOLOGÍA</span>
                <span style={{ fontSize: 10, fontWeight: 700, background: "rgba(255,255,255,0.05)", color: "rgba(174,185,225,0.5)", borderRadius: 4, padding: "2px 8px", border: "1px solid rgba(255,255,255,0.08)" }}>0/7</span>
              </div>
            </div>
            <div style={{ color: "rgba(174,185,225,0.3)", fontSize: 18 }}>›</div>
          </div>

          {/* Reto Flow */}
          <div
            onClick={goRetoFlow}
            className="reto-card"
            style={{
              background: "linear-gradient(135deg, rgba(0,245,160,0.06) 0%, rgba(0,212,255,0.04) 100%)",
              border: "1px solid rgba(0,245,160,0.2)",
              borderRadius: 14, padding: "22px 24px",
              display: "flex", alignItems: "center", gap: 18,
            }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(0,245,160,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>⚡</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 15, color: "#00f5a0", marginBottom: 4 }}>Reto del Flow</div>
              <div style={{ color: "rgba(174,185,225,0.5)", fontSize: 12 }}>7 días · Estado Óptimo</div>
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <span style={{ fontSize: 10, fontWeight: 700, background: "rgba(0,245,160,0.15)", color: "#00f5a0", border: "1px solid rgba(0,245,160,0.25)", borderRadius: 4, padding: "2px 8px", letterSpacing: 0.5 }}>MENTAL</span>
                <span style={{ fontSize: 10, fontWeight: 700, background: "rgba(255,255,255,0.05)", color: "rgba(174,185,225,0.5)", borderRadius: 4, padding: "2px 8px", border: "1px solid rgba(255,255,255,0.08)" }}>0/7</span>
              </div>
            </div>
            <div style={{ color: "rgba(174,185,225,0.3)", fontSize: 18 }}>›</div>
          </div>
        </div>
      </div>

      {/* Premium features */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 3, height: 18, background: "linear-gradient(180deg, #ffd700, #ff9f1c)", borderRadius: 2 }} />
            <h3 style={{ fontWeight: 800, fontSize: 14, color: authUser?.premium ? "#ffd700" : "rgba(174,185,225,0.6)", textTransform: "uppercase", letterSpacing: 1.2, margin: 0 }}>
              {authUser?.premium ? "✦ Beneficios Premium" : "Funciones Exclusivas"}
            </h3>
          </div>
          {!authUser?.premium && (
            <button
              onClick={openPremium}
              style={{ background: "rgba(255,215,0,0.1)", border: "1px solid rgba(255,215,0,0.25)", color: "#ffd700", borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
            >
              Ver planes →
            </button>
          )}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 10 }}>
          {PREMIUM_FEATURES.filter(f => !f.free).map((f, i) => {
            const isLocked = !authUser?.premium;
            return (
              <div
                key={i}
                className="feature-card"
                onClick={isLocked ? openPremium : undefined}
                style={{
                  background: isLocked ? "rgba(255,255,255,0.02)" : "linear-gradient(135deg, rgba(255,215,0,0.08), rgba(255,170,0,0.04))",
                  border: isLocked ? "1px solid rgba(255,215,0,0.1)" : "1px solid rgba(255,215,0,0.35)",
                  borderRadius: 10, padding: "14px 18px",
                  display: "flex", alignItems: "center", gap: 14,
                  opacity: isLocked ? 0.5 : 1,
                  cursor: isLocked ? "pointer" : "default",
                }}
              >
                <div style={{ fontSize: 18, flexShrink: 0 }}>{isLocked ? "🔒" : "⭐"}</div>
                <div style={{ fontWeight: 600, fontSize: 13, color: isLocked ? "rgba(174,185,225,0.6)" : "#fff" }}>{f.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// PERFIL DE USUARIO
// ════════════════════════════════════════════════════════════════
function ProfileScreen({ authUser, arquetipo, openPremium, handleLogout, isMobile, onUpdateName }) {
  const A = ARQUETIPOS[arquetipo] || ARQUETIPOS.explorador;
  const isPremium = authUser?.premium;

  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(authUser?.name || "");

  const handleSaveName = async () => {
    if (!tempName.trim()) return;
    const success = await onUpdateName(tempName.trim());
    if (success) setIsEditingName(false);
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: isMobile ? "24px 16px" : "40px 24px", paddingBottom: 100 }}>
      {/* Cabecera del Perfil */}
      <div style={{ ...S.card, display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "center", gap: isMobile ? 20 : 32, marginBottom: 32, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -80, right: -80, width: 250, height: 250, background: isPremium ? "#ffd700" : A.color, filter: "blur(100px)", opacity: 0.15 }} />
        <div style={{ width: isMobile ? 80 : 100, height: isMobile ? 80 : 100, borderRadius: 50, background: "rgba(255,255,255,0.05)", border: `2px solid ${isPremium ? "#ffd700" : A.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: isMobile ? 36 : 48, boxShadow: `0 0 30px ${isPremium ? "#ffd700" : A.color}33` }}>
          {isPremium ? "👑" : "👤"}
        </div>
        <div style={{ flex: 1, width: "100%" }}>
          {isEditingName ? (
            <div style={{ marginBottom: 16 }}>
              <input
                value={tempName}
                onChange={e => setTempName(e.target.value)}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: `1px solid ${A.color}44`,
                  borderRadius: 8,
                  padding: "8px 12px",
                  color: "#fff",
                  fontSize: isMobile ? 20 : 24,
                  fontWeight: 800,
                  width: "100%",
                  marginBottom: 12,
                  outline: "none"
                }}
                autoFocus
              />
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={handleSaveName}
                  style={{ background: "#00f5a0", color: "#000", border: "none", padding: "6px 16px", borderRadius: 6, fontWeight: 700, cursor: "pointer", fontSize: 13 }}
                >
                  Guardar
                </button>
                <button
                  onClick={() => { setIsEditingName(false); setTempName(authUser?.name || ""); }}
                  style={{ background: "rgba(255,255,255,0.1)", color: "#fff", border: "none", padding: "6px 16px", borderRadius: 6, fontWeight: 700, cursor: "pointer", fontSize: 13 }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <h1 style={{ fontWeight: 900, fontSize: isMobile ? 24 : 32, marginBottom: 4, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              {authUser?.name}
              {isPremium && <span style={{ fontSize: 10, padding: "3px 8px", background: "linear-gradient(90deg,#ffd700,#ffaa00)", color: "#000", borderRadius: 12, fontWeight: 900, letterSpacing: 1 }}>PRO</span>}
              <button
                onClick={() => setIsEditingName(true)}
                style={{ background: "rgba(255,255,255,0.05)", border: "none", padding: 8, borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <span style={{ fontSize: 14 }}>✏️</span>
              </button>
            </h1>
          )}
          <div style={{ color: "#888", fontSize: isMobile ? 13 : 15, marginBottom: 12 }}>{authUser?.email}</div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", background: `${A.color}15`, borderRadius: 20, border: `1px solid ${A.color}33` }}>
            <span style={{ fontSize: 16 }}>{A.emoji}</span>
            <span style={{ color: A.color, fontWeight: 700, fontSize: 12 }}>Arquetipo: {A.nombre}</span>
          </div>
        </div>
      </div>

      {/* Tarjeta de Suscripción */}
      <div style={{ ...S.card, marginBottom: 32, borderColor: isPremium ? "rgba(255,215,0,0.3)" : "rgba(255,255,255,0.05)", background: isPremium ? "linear-gradient(160deg,rgba(255,215,0,0.03),transparent)" : S.card.background }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "stretch" : "flex-start", flexDirection: isMobile ? "column" : "row", gap: 20 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ fontSize: 24 }}>{isPremium ? "⭐" : "✅"}</div>
              <h2 style={{ fontWeight: 900, fontSize: isMobile ? 18 : 22, color: isPremium ? "#ffd700" : "#fff" }}>
                Plan {isPremium ? "Premium" : "Básico"}
              </h2>
            </div>
            <p style={{ color: "#aaa", fontSize: 13, maxWidth: 400, lineHeight: 1.6 }}>
              {isPremium
                ? "Tienes acceso ilimitado a todos los mercados del simulador PEDEM, acompañamiento de GENY IA sin restricciones y la Academia 7 Mundos."
                : "Estás operando con acceso limitado. Desbloquea más activos, IA avanzada y la Academia 7 Mundos."}
            </p>
          </div>
          {!isPremium && (
            <button onClick={openPremium} style={{ background: "linear-gradient(135deg,#ffd700,#ffaa00)", color: "#000", border: "none", borderRadius: 12, padding: isMobile ? "14px 20px" : "16px 32px", fontWeight: 900, fontSize: 14, cursor: "pointer", boxShadow: "0 10px 25px rgba(255,215,0,0.25)" }}>
              Hacer Upgrade Ahora
            </button>
          )}
        </div>
      </div>

      {/* Ajustes y Preferencias (Placeholder) */}
      <div style={{ ...S.card, marginBottom: 32 }}>
        <h3 style={{ fontWeight: 900, fontSize: 18, marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>Ajustes de Cuenta</h3>
        <div style={{ display: "grid", gap: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "rgba(255,255,255,0.02)", borderRadius: 8 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Notificaciones del Reto</div>
              <div style={{ color: "#777", fontSize: 12 }}>Recibe avisos diarios del Sombra & Flow</div>
            </div>
            <div style={{ width: 44, height: 24, background: "#00f5a0", borderRadius: 12, position: "relative", cursor: "pointer", opacity: 0.5 }}>
              <div style={{ width: 20, height: 20, background: "#fff", borderRadius: 10, position: "absolute", right: 2, top: 2 }} />
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "rgba(255,255,255,0.02)", borderRadius: 8 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Divisa Preferida</div>
              <div style={{ color: "#777", fontSize: 12 }}>Moneda del balance simulado</div>
            </div>
            <div style={{ color: "#00f5a0", fontWeight: 700, fontSize: 14 }}>USD ($)</div>
          </div>
        </div>
      </div>

      {/* Zona de Peligro / Cerrar Sesión */}
      <div style={{ marginTop: 40, borderTop: "1px solid rgba(255,107,107,0.2)", paddingTop: 32, textAlign: "center" }}>
        <button onClick={handleLogout} style={{ background: "transparent", border: "1px solid #ff6b6b", color: "#ff6b6b", borderRadius: 8, padding: "12px 24px", fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "all 0.2s" }} onMouseOver={e => e.currentTarget.style.background = "rgba(255,107,107,0.1)"} onMouseOut={e => e.currentTarget.style.background = "transparent"}>
          Cerrar Sesión Segura
        </button>
      </div>

    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// SIMULADOR
// ════════════════════════════════════════════════════════════════
function Simulador({ portfolio, setPortfolio, trades, setTrades, bitacora, setBitacora, openPremium, isMobile }) {
  const [sym, setSym] = useState("SPX");
  const [qty, setQty] = useState(1);
  const [modalPlan, setModalPlan] = useState(null); // {sym, dir, px}
  const [modalClose, setModalClose] = useState(null); // {trade, curPrice}
  const curPrice = price(sym); // use current simulated price

  // Mock chart data
  const chartData = Array.from({ length: 40 }).map((_, i) => {
    const base = price(sym);
    const vol = SYMS[sym].vol;
    const px = base + (Math.sin(i / 2) * vol) + (Math.random() * vol / 2);
    return { time: `10:${String(i).padStart(2, '0')}`, price: px };
  });

  const actTrade = Object.values(trades).find(t => t.sym === sym);
  const pl = actTrade ? (curPrice - actTrade.entry) * actTrade.qty * (actTrade.dir === "BUY" ? 1 : -1) : 0;

  const handlePlan = (dir) => setModalPlan({ sym, dir, px: curPrice });
  const execTrade = (form) => {
    setTrades(p => ({ ...p, [sym]: { sym, dir: modalPlan.dir, entry: modalPlan.px, qty, form, time: new Date().toLocaleTimeString() } }));
    setModalPlan(null);
  };
  const closeTrade = (form) => {
    const t = modalClose.trade;
    const px = modalClose.curPrice;
    const finalPl = (px - t.entry) * t.qty * (t.dir === "BUY" ? 1 : -1);
    setPortfolio(p => p + finalPl);
    setBitacora(p => [{ ...t, exit: px, pl: finalPl, eval: form, date: new Date().toLocaleString() }, ...p]);
    const nl = { ...trades }; delete nl[t.sym]; setTrades(nl);
    setModalClose(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Top Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid #222", background: "#0d1117" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <select style={{ ...S.inp, width: 140, fontWeight: 900, fontSize: 16, border: "none", background: "transparent", padding: 0 }} value={sym} onChange={e => setSym(e.target.value)}>
            {Object.keys(SYMS).map(k => <option key={k} value={k} disabled={SYMS[k].premium}>{k}{SYMS[k].premium ? " ⭐" : ""}</option>)}
          </select>
          <div style={{ fontWeight: 900, fontSize: 22, color: SYMS[sym].premium ? "#ffd700" : "#fff" }}>
            ${fmt(curPrice)}
          </div>
          <div style={{ color: "#00f5a0", fontSize: 12, fontWeight: 700, padding: "4px 8px", background: "rgba(0,245,160,0.1)", borderRadius: 4 }}>+1.24%</div>
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "#666", fontSize: 11, textTransform: "uppercase" }}>Capital (Simulado)</div>
            <div style={{ fontWeight: 900, fontSize: 16, color: "#fff" }}>${fmt(portfolio)}</div>
          </div>
          {Object.keys(trades).length > 0 && (
            <div style={{ textAlign: "right", paddingLeft: 16, borderLeft: "1px solid #333" }}>
              <div style={{ color: "#666", fontSize: 11, textTransform: "uppercase" }}>P&L Abierto</div>
              <div style={{ fontWeight: 900, fontSize: 16, color: Object.values(trades).reduce((s, t) => s + (curPrice - t.entry) * t.qty * (t.dir === "BUY" ? 1 : -1), 0) >= 0 ? "#00f5a0" : "#ff6b6b" }}>
                {fmtP(Object.values(trades).reduce((s, t) => s + (curPrice - t.entry) * t.qty * (t.dir === "BUY" ? 1 : -1), 0))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden", flexDirection: isMobile ? "column" : "row" }}>
        {/* Main Chart Area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#0a0e14", height: isMobile ? "50vh" : "auto" }}>
          {SYMS[sym].premium ? (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", textAlign: "center", padding: 20 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>⭐</div>
              <div style={{ fontWeight: 900, fontSize: 20, color: "#ffd700", marginBottom: 8 }}>Activo Exclusivo PREMIUM</div>
              <div style={{ color: "#888", fontSize: 13, marginBottom: 20, maxWidth: 300 }}>Este mercado solo está disponible en la versión institucional.</div>
              <button onClick={openPremium} style={{ ...glowBtn("#ffd700"), color: "#000" }}>Desbloquear Acceso</button>
            </div>
          ) : (
            <div style={{ flex: 1, padding: 16, position: "relative" }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="c" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#00f5a0" stopOpacity={0.2} /><stop offset="95%" stopColor="#00f5a0" stopOpacity={0} /></linearGradient>
                  </defs>
                  <XAxis dataKey="time" hide />
                  <YAxis domain={['dataMin', 'dataMax']} hide />
                  <Tooltip content={<ChartTip />} />
                  {actTrade && <ReferenceLine y={actTrade.entry} stroke={actTrade.dir === "BUY" ? "#00f5a0" : "#ff6b6b"} strokeDasharray="3 3" label={{ position: "left", value: `${actTrade.dir} @ ${fmt(actTrade.entry)}`, fill: actTrade.dir === "BUY" ? "#00f5a0" : "#ff6b6b", fontSize: 11, fontWeight: 700 }} />}
                  <Area type="monotone" dataKey="price" stroke="#00f5a0" strokeWidth={2} fillOpacity={1} fill="url(#c)" animationDuration={300} />
                </AreaChart>
              </ResponsiveContainer>
              {actTrade && (
                <div style={{ position: "absolute", bottom: isMobile ? 12 : 24, left: isMobile ? 12 : 24, right: isMobile ? 12 : "auto", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(10px)", border: "1px solid #333", borderRadius: 12, padding: isMobile ? "12px 16px" : "16px 20px", display: "flex", gap: isMobile ? 12 : 24, alignItems: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
                  <div><div style={{ color: "#888", fontSize: 10, textTransform: "uppercase" }}>Posición</div><div style={{ fontWeight: 900, fontSize: isMobile ? 14 : 16, color: actTrade.dir === "BUY" ? "#00f5a0" : "#ff6b6b" }}>{actTrade.dir} {sym} × {actTrade.qty}</div></div>
                  <div><div style={{ color: "#888", fontSize: 10, textTransform: "uppercase" }}>P&L</div><div style={{ fontWeight: 900, fontSize: isMobile ? 16 : 18, color: pl >= 0 ? "#00f5a0" : "#ff6b6b" }}>{fmtP(pl)}</div></div>
                  <button onClick={() => setModalClose({ trade: actTrade, curPrice })} style={{ ...glowBtn("#ff6b6b"), padding: isMobile ? "6px 12px" : "8px 16px", fontSize: isMobile ? 12 : 13 }}>Cerrar & Evaluar →</button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Panel - Action */}
        <div style={{ width: isMobile ? "100%" : 320, background: "#0d1117", borderLeft: isMobile ? "none" : "1px solid #222", borderTop: isMobile ? "1px solid #222" : "none", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: 16, borderBottom: "1px solid #222" }}>
            <div style={{ fontWeight: 900, fontSize: 14, marginBottom: 16, color: "#ccc" }}>NUEVO TRADE — PEDEM</div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <label style={S.label}>Cantidad (Contratos/Acciones)</label>
                <div style={{ color: "#00d4ff", fontSize: 11, fontWeight: 700 }}>{qty}</div>
              </div>
              <input type="range" min="1" max="100" value={qty} onChange={e => setQty(Number(e.target.value))} style={{ width: "100%", accentColor: "#00f5a0" }} disabled={SYMS[sym].premium || actTrade} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <button disabled={SYMS[sym].premium || actTrade} onClick={() => handlePlan("BUY")} style={{ ...glowBtn(), opacity: (SYMS[sym].premium || actTrade) ? 0.3 : 1 }}>BUY <span style={{ fontSize: 10 }}>/ LONG</span></button>
              <button disabled={SYMS[sym].premium || actTrade} onClick={() => handlePlan("SELL")} style={{ ...glowBtn("#ff6b6b"), opacity: (SYMS[sym].premium || actTrade) ? 0.3 : 1 }}>SELL <span style={{ fontSize: 10 }}>/ SHORT</span></button>
            </div>
          </div>

          <div style={{ padding: 16, flex: 1, overflowY: "auto" }}>
            <div style={{ fontWeight: 900, fontSize: 12, color: "#666", marginBottom: 12, letterSpacing: 1 }}>BITÁCORA RECIENTE</div>
            {bitacora.length === 0 ? <div style={{ color: "#444", fontSize: 12, fontStyle: "italic" }}>Aún no hay trades cerrados.</div> : bitacora.slice(0, 4).map((t, i) => (
              <div key={i} style={{ ...S.cardSm, padding: "10px 12px", marginBottom: 8, borderLeft: `3px solid ${t.pl >= 0 ? "#00f5a0" : "#ff6b6b"}`, background: "rgba(255,255,255,0.02)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <div style={{ fontWeight: 700, fontSize: 12 }}>{t.dir} {t.sym}</div>
                  <div style={{ fontWeight: 900, fontSize: 13, color: t.pl >= 0 ? "#00f5a0" : "#ff6b6b" }}>{fmtP(t.pl)}</div>
                </div>
                <div style={{ color: "#777", fontSize: 10 }}>{t.date.split(",")[1]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {modalPlan && <PedemPlanModal sym={modalPlan.sym} dir={modalPlan.dir} px={modalPlan.px} onConfirm={execTrade} onCancel={() => setModalPlan(null)} isMobile={isMobile} />}
      {modalClose && <PedemCloseModal trade={modalClose.trade} curPrice={modalClose.curPrice} onConfirm={closeTrade} onCancel={() => setModalClose(null)} isMobile={isMobile} />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// VERIFY EMAIL SCREEN
// ═══════════════════════════════════════════════════════════════
function VerifyEmailScreen({ email, onBack }) {
  const [resent, setResent] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown > 0) {
      const t = setTimeout(() => setCooldown(c => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [cooldown]);

  const handleResend = async () => {
    if (cooldown > 0) return;
    await supabase.auth.resend({ type: "signup", email });
    setResent(true);
    setCooldown(60);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "radial-gradient(ellipse at 60% 30%, #0a1535 0%, #04070F 70%)", fontFamily: "'Inter', sans-serif", padding: 24 }}>
      <div style={{ maxWidth: 460, width: "100%", textAlign: "center" }}>
        {/* Icono animado */}
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, #00f5a0 0%, #00b87a 100%)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 32px", boxShadow: "0 0 40px rgba(0,245,160,0.3)", fontSize: 36 }}>
          ✉️
        </div>

        {/* Logo */}
        <img src="/logo-negro.png" alt="INGRESARIOS" style={{ height: 28, marginBottom: 28, filter: "brightness(0) invert(1)" }} />

        <h1 style={{ fontWeight: 900, fontSize: 28, color: "#fff", margin: "0 0 12px", letterSpacing: -0.5 }}>
          Verifica tu correo
        </h1>
        <p style={{ color: "rgba(174,185,225,0.65)", fontSize: 15, lineHeight: 1.7, margin: "0 0 8px" }}>
          Te enviamos un enlace de activación a:
        </p>
        <div style={{ display: "inline-block", background: "rgba(108,114,255,0.12)", border: "1px solid rgba(108,114,255,0.3)", borderRadius: 8, padding: "8px 20px", marginBottom: 32 }}>
          <span style={{ color: "#a5aaff", fontWeight: 700, fontSize: 15 }}>{email}</span>
        </div>

        {/* Pasos */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "24px 28px", marginBottom: 28, textAlign: "left" }}>
          {[
            { num: "1", text: "Revisa tu bandeja de entrada (y la carpeta de spam)" },
            { num: "2", text: `Haz clic en "Confirmar correo electrónico"` },
            { num: "3", text: "Serás redirigido automáticamente al onboarding" },
          ].map(({ num, text }) => (
            <div key={num} style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: num !== "3" ? 16 : 0 }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg,#6C72FF,#4B50E0)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, flexShrink: 0, marginTop: 1 }}>
                {num}
              </div>
              <p style={{ color: "rgba(174,185,225,0.8)", fontSize: 14, lineHeight: 1.5, margin: 0 }}>{text}</p>
            </div>
          ))}
        </div>

        {/* Reenviar */}
        <button
          onClick={handleResend} disabled={cooldown > 0}
          style={{ width: "100%", height: 50, border: "1px solid rgba(0,245,160,0.25)", borderRadius: 12, background: resent ? "rgba(0,245,160,0.06)" : "transparent", color: cooldown > 0 ? "rgba(174,185,225,0.35)" : "#00f5a0", fontSize: 14, fontWeight: 600, cursor: cooldown > 0 ? "not-allowed" : "pointer", marginBottom: 14, transition: "all 0.25s" }}
        >
          {resent && cooldown > 0 ? `Reenviar en ${cooldown}s` : resent ? "✓ Correo reenviado" : "Reenviar correo de verificación"}
        </button>

        <button
          onClick={onBack}
          style={{ background: "transparent", border: "none", color: "rgba(174,185,225,0.45)", fontSize: 13, cursor: "pointer", padding: "8px 0" }}
        >
          ← Volver al inicio de sesión
        </button>
      </div>
      <style>{`@keyframes pulse { 0%,100%{box-shadow:0 0 40px rgba(0,245,160,0.3)} 50%{box-shadow:0 0 60px rgba(0,245,160,0.5)} }`}</style>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// SPLASH SCREEN (Loading phase)
// ════════════════════════════════════════════════════════════════
function SplashScreen() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#04070F" }}>
      <img src="/logo-negro.png" alt="INGRESARIOS" style={{ height: 40, filter: "brightness(0) invert(1)", animation: "pulse 2s infinite ease-in-out" }} />
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(0.98); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// TABS / MAIN LAYOUT
// ════════════════════════════════════════════════════════════════
export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [view, setView] = useState("auth"); // auth, verify_email, quiz, res, main
  const [authUser, setAuthUser] = useState(null);
  const [pendingEmail, setPendingEmail] = useState(""); // email pendiente de verificación
  const [tab, setTab] = useState("dash");

  // User Profile States
  const [arquetipo, setArq] = useState(null);
  const [nombre, setNom] = useState("");

  const [portfolio, setPort] = useState(100000);
  const [trades, setTrades] = useState({});
  const [bitacora, setBitacora] = useState([]);

  const [compFlow, setCompFlow] = useState([]);
  const [respFlow, setRespFlow] = useState({});
  const [compSombra, setCompSombra] = useState([]);
  const [respSombra, setRespSombra] = useState({});

  const [showPremium, setShowPremium] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAcademyMenu, setShowAcademyMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const [xp, setXp] = useState(0);
  const [coins, setCoins] = useState(0);

  // Verificar sesión Supabase al montar
  useEffect(() => {
    // Obtener sesión actual al iniciar
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      try {
        if (session?.user) {
          const user = session.user;
          // Solo proceder si el email está confirmado
          if (user.email_confirmed_at || user.confirmed_at) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", user.id)
              .single();
            handleLoginStatus({ ...user, ...profile }, false);
          } else {
            // Sesión existe pero email no confirmado -> forzar pantalla de verificación
            setPendingEmail(user.email);
            setView("verify_email");
          }
        }
      } finally {
        setInitializing(false);
      }
    });

    // Escuchar todos los cambios de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if ((event === "SIGNED_IN" || event === "USER_UPDATED") && session?.user) {
        const user = session.user;
        // Solo proceder si el email está confirmado
        if (!user.email_confirmed_at && !user.confirmed_at) {
          // El email aún no está verificado — mostrar pantalla de verificación
          setPendingEmail(user.email);
          setView("verify_email");
          return;
        }

        // Verificar si ya existe perfil; si no, crearlo
        const { data: existing } = await supabase
          .from("profiles")
          .select("id, arquetipo, name, xp, coins, premium, phone")
          .eq("id", user.id)
          .single();

        if (!existing) {
          const metaName = user.user_metadata?.name || user.email?.split("@")[0];
          const metaPhone = user.user_metadata?.phone || null;
          await supabase.from("profiles").insert({
            id: user.id,
            name: metaName,
            phone: metaPhone,
            arquetipo: null,
            xp: 0,
            coins: 50,
            premium: false,
          });
          handleLoginStatus({ ...user, name: metaName, arquetipo: null, xp: 0, coins: 50, premium: false }, true);
        } else {
          handleLoginStatus({ ...user, ...existing }, !existing.arquetipo);
        }
      } else if (event === "SIGNED_OUT" || !session) {
        setAuthUser(null);
        setNom("");
        setArq(null);
        setPendingEmail("");
        setView("auth");
        setTab("dash");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLoginStatus = (user, isNew) => {
    // Doble verificación: si el email no está confirmado, no dejar pasar
    if (!user.email_confirmed_at && !user.confirmed_at) {
      setPendingEmail(user.email);
      setView("verify_email");
      return;
    }

    setAuthUser(user);
    setNom(user.name || user.email?.split("@")[0] || "");
    setArq(user.arquetipo);
    setXp(user.xp || 0);
    setCoins(user.coins || 50);

    // El quiz solo se muestra si el usuario NO tiene un arquetipo guardado
    if (!user.arquetipo) {
      setView("quiz");
    } else {
      setView("main");
    }
  };

  const updateProfileName = async (newName) => {
    if (!authUser) return false;
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ name: newName })
        .eq("id", authUser.id);

      if (error) throw error;

      // Actualizar estados locales
      setNom(newName);
      setAuthUser(prev => ({ ...prev, name: newName }));
      return true;
    } catch (err) {
      console.error("Error updating name:", err);
      alert("Error al actualizar el nombre. Inténtalo de nuevo.");
      return false;
    }
  };


  const handleLogout = async () => {
    setShowUserMenu(false);
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // Siempre limpiar estado local y volver a auth aunque falle signOut
      setAuthUser(null);
      setNom("");
      setArq(null);
      setView("auth");
      setTab("dash");
    }
  };

  const saveUserProgress = async (updatedFields) => {
    if (!authUser) return;
    const updUser = { ...authUser, ...updatedFields };
    setAuthUser(updUser);
    // Sincronizar con Supabase
    await supabase.from("profiles").upsert({
      id: authUser.id,
      name: updUser.name,
      arquetipo: updUser.arquetipo,
      xp: updUser.xp,
      coins: updUser.coins,
      premium: updUser.premium,
    });
  };

  const TABS_CONTENT = [
    { k: "sim", l: "Simulador", i: "📈" },
    { k: "ret-s", l: "Reto Sombra", i: "🌑" },
    { k: "ret-f", l: "Reto Flow", i: "⚡" },
    { k: "geny", l: "GENY IA", i: "🤖" },
    {
      k: "aca-n1",
      l: "Academia Nivel 1",
      i: "📚",
      submenu: [
        { k: "aca-n1-v1", l: "Video 1", i: "▶️" },
        { k: "aca-n1-v2", l: "Video 2", i: "▶️" },
        { k: "aca-n1-v3", l: "Video 3", i: "▶️" },
        { k: "aca-n1-v4", l: "Video 4", i: "▶️" },
        { k: "aca-n1-v5", l: "Video 5", i: "▶️" },
      ]
    },
    // Premium Items
    { k: "aca", l: "Academia 7 Mundos", i: "🏛️", premium: true },
    { k: "trn", l: "Torneos en Vivo", i: "🏆", premium: true },
    { k: "sig", l: "Señales Geny Trend", i: "📡", premium: true },
    { k: "cer", l: "Certificación 21", i: "🎓", premium: true },
    { k: "com", l: "Comunidad Privada", i: "💬", premium: true },
  ];

  const TABS_USER = [
    { k: "dash", l: "Dashboard", i: "🏠" },
    { k: "bit", l: "Tu Bitácora", i: "📓" },
    { k: "profile", l: "Ajustes", i: "⚙️" }
  ];

  const navBtn = (active) => ({
    background: active ? "#212C4D" : "transparent",
    border: "none",
    color: active ? "#FFFFFF" : "#AEB9E1",
    borderRadius: 6,
    cursor: "pointer",
    transition: "background 0.2s, color 0.2s",
    fontWeight: active ? 600 : 500,
    width: "100%",
    justifyContent: "flex-start",
    textAlign: "left",
    padding: "10px 12px"
  });

  if (window.location.pathname === "/landing") {
    return <LandingPage onStart={() => { window.location.pathname = "/"; }} isMobile={isMobile} />;
  }

  if (view === "auth") return (
    <AuthScreen
      onLogin={handleLoginStatus}
      onRegisterPending={(email) => { setPendingEmail(email); setView("verify_email"); }}
      isMobile={isMobile}
    />
  );

  if (initializing) return <SplashScreen />;

  if (view === "verify_email") return (
    <VerifyEmailScreen
      email={pendingEmail}
      onBack={() => setView("auth")}
    />
  );

  if (view === "quiz") return <QuizScreen userName={authUser?.name} isMobile={isMobile} onComplete={(n, a) => {
    setNom(n);
    setArq(a);
    saveUserProgress({ name: n, arquetipo: a });
    setView("res");
  }} />;

  if (view === "res") return <ResultadoScreen nombre={nombre} arquetipo={arquetipo} isMobile={isMobile} onEnter={() => setView("main")} />;

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: isMobile ? "column" : "row",
      height: "100vh", 
      background: "#04070F", 
      color: "#FFFFFF", 
      fontFamily: "'Inter', 'Mona Sans', system-ui, sans-serif",
      overflow: "hidden"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(108,114,255,0.3); border-radius: 4px; }
        .nav-item { transition: all 0.2s ease; }
        .nav-item:hover { background: rgba(108,114,255,0.08) !important; color: #fff !important; }
        .nav-item-active { background: rgba(108,114,255,0.15) !important; border-left: 2px solid #6C72FF !important; color: #fff !important; }
        .stat-card-glow:hover { box-shadow: 0 0 20px rgba(108,114,255,0.15); transform: translateY(-1px); }
        .upgrade-btn:hover { box-shadow: 0 8px 30px rgba(108,114,255,0.5) !important; transform: translateY(-1px); }
        @keyframes pulse-dot { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        .mobile-sidebar-enter { transform: translateX(-100%); transition: transform 0.3s ease-out; }
        .mobile-sidebar-enter-active { transform: translateX(0); }
      `}</style>

      {/* ─── MOBILE TOP BAR ─────────────────────────────────────── */}
      {isMobile && (
        <div style={{
          height: 60,
          background: "#080F25",
          borderBottom: "1px solid rgba(108,114,255,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          zIndex: 1000,
          flexShrink: 0
        }}>
          <img 
            src="/logo-negro.png" 
            alt="INGRESARIOS" 
            style={{ height: 20, filter: "brightness(0) invert(1)" }} 
          />
          <button 
            onClick={() => setShowMobileSidebar(true)}
            style={{
              background: "transparent",
              border: "none",
              color: "#fff",
              fontSize: 24,
              cursor: "pointer",
              padding: 0,
              display: "flex",
              alignItems: "center"
            }}
          >
            ☰
          </button>
        </div>
      )}

      {/* ─── MOBILE SIDEBAR BACKDROP ────────────────────────────── */}
      {isMobile && showMobileSidebar && (
        <div 
          onClick={() => setShowMobileSidebar(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(4px)",
            zIndex: 1100,
          }}
        />
      )}

      {/* ─── SIDEBAR ─────────────────────────────────────────────── */}
      <div style={{
        width: 260,
        background: "linear-gradient(180deg, #080F25 0%, #04070F 100%)",
        borderRight: "1px solid rgba(108,114,255,0.15)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        height: "100vh",
        position: isMobile ? "fixed" : "sticky",
        left: isMobile ? (showMobileSidebar ? 0 : -260) : 0,
        top: 0,
        boxShadow: "4px 0 24px rgba(0,0,0,0.4)",
        zIndex: 1200,
        transition: "left 0.3s ease-in-out",
      }}>

        {/* Logo (Hidden on mobile inside sidebar if we want to save space, but let's keep it with a close button) */}
        <div style={{ padding: "24px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <img 
              src="/logo-negro.png" 
              alt="INGRESARIOS" 
              style={{ height: 26, display: "block", filter: "brightness(0) invert(1)" }} 
            />
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#00f5a0", animation: "pulse-dot 2s infinite" }} />
              <span style={{ fontSize: 11, color: "rgba(174,185,225,0.5)", letterSpacing: 0.5 }}>Plataforma activa</span>
            </div>
          </div>
          {isMobile && (
            <button 
              onClick={() => setShowMobileSidebar(false)}
              style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 20, cursor: "pointer" }}
            >
              ✕
            </button>
          )}
        </div>

        {/* User Card */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div
            onClick={() => setShowUserMenu(!showUserMenu)}
            style={{
              display: "flex", alignItems: "center", gap: 12, cursor: "pointer",
              padding: "10px 12px", borderRadius: 10,
              background: showUserMenu ? "rgba(108,114,255,0.12)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${showUserMenu ? "rgba(108,114,255,0.3)" : "rgba(255,255,255,0.06)"}`,
              transition: "all 0.2s",
            }}
          >
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: "linear-gradient(135deg, #6C72FF 0%, #00d4ff 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, flexShrink: 0,
            }}>
              {arquetipo ? ARQUETIPOS[arquetipo]?.emoji || "⚡" : "⚡"}
            </div>
            <div style={{ flex: 1, overflow: "hidden" }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {nombre?.split(" ")[0] || "Trader"}
              </div>
              <div style={{ fontSize: 11, color: authUser?.premium ? "#ffd700" : "rgba(174,185,225,0.5)", fontWeight: 500, marginTop: 1 }}>
                {authUser?.premium ? "★ Premium" : "Plan Free"}
              </div>
            </div>
            <span style={{ fontSize: 10, color: "rgba(174,185,225,0.4)", transform: showUserMenu ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span>
          </div>

          {/* Dropdown */}
          {showUserMenu && (
            <div style={{
              marginTop: 6, background: "rgba(8,15,37,0.95)",
              border: "1px solid rgba(108,114,255,0.2)", borderRadius: 10, overflow: "hidden",
              backdropFilter: "blur(12px)",
            }}>
              <div style={{ padding: "8px 12px 4px", fontSize: 10, color: "rgba(174,185,225,0.4)", letterSpacing: 1.2, textTransform: "uppercase", fontWeight: 700 }}>Mi Cuenta</div>
              {TABS_USER.map(t => (
                <button
                  key={t.k}
                  onClick={() => { setTab(t.k); setShowUserMenu(false); }}
                  className="nav-item"
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 10,
                    padding: "9px 14px", background: "transparent", border: "none",
                    color: tab === t.k ? "#fff" : "rgba(174,185,225,0.7)",
                    cursor: "pointer", fontSize: 13, fontWeight: tab === t.k ? 600 : 400,
                    borderLeft: tab === t.k ? "2px solid #6C72FF" : "2px solid transparent",
                  }}
                >
                  <span style={{ fontSize: 15 }}>{t.i}</span>
                  <span>{t.l}</span>
                </button>
              ))}
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", margin: "4px 0" }} />
              <button
                onClick={handleLogout}
                className="nav-item"
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 10,
                  padding: "9px 14px", background: "transparent", border: "none",
                  color: "rgba(255,100,100,0.7)", cursor: "pointer", fontSize: 13,
                }}
              >
                <span style={{ fontSize: 15 }}>⎋</span>
                <span>Cerrar sesión</span>
              </button>
            </div>
          )}

          {/* XP + Coins row */}
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <div style={{
              flex: 1, padding: "8px 12px", borderRadius: 8,
              background: "rgba(108,114,255,0.08)", border: "1px solid rgba(108,114,255,0.15)",
            }}>
              <div style={{ fontSize: 10, color: "rgba(174,185,225,0.5)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8 }}>XP</div>
              <div style={{ fontWeight: 800, fontSize: 16, color: "#6C72FF", letterSpacing: -0.5 }}>{xp}</div>
            </div>
            <div style={{
              flex: 1, padding: "8px 12px", borderRadius: 8,
              background: "rgba(255,215,0,0.06)", border: "1px solid rgba(255,215,0,0.15)",
            }}>
              <div style={{ fontSize: 10, color: "rgba(174,185,225,0.5)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8 }}>Coins</div>
              <div style={{ fontWeight: 800, fontSize: 16, color: "#ffd700", letterSpacing: -0.5 }}>{coins}</div>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 12px" }}>
          <div style={{ fontSize: 10, color: "rgba(174,185,225,0.35)", fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", padding: "0 8px", marginBottom: 8 }}>Plataforma</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {TABS_CONTENT.map(t => {
              const isLocked = t.premium && !authUser?.premium;
              const isActive = tab === t.k || (t.submenu && t.submenu.some(s => s.k === tab));
              if (t.submenu) {
                return (
                  <div key={t.k}>
                    <div
                      onClick={() => setShowAcademyMenu(!showAcademyMenu)}
                      className="nav-item"
                      style={{
                        display: "flex", alignItems: "center", gap: 10, padding: "9px 10px",
                        borderRadius: 8, cursor: "pointer", color: "rgba(174,185,225,0.7)",
                        borderLeft: isActive ? "2px solid #6C72FF" : "2px solid transparent",
                        background: isActive ? "rgba(108,114,255,0.1)" : "transparent",
                      }}
                    >
                      <span style={{ fontSize: 16, width: 22, textAlign: "center" }}>{t.i}</span>
                      <span style={{ flex: 1, fontSize: 13, fontWeight: isActive ? 600 : 400, color: isActive ? "#fff" : undefined }}>{t.l}</span>
                      <span style={{ fontSize: 10, opacity: 0.5, transform: showAcademyMenu ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span>
                    </div>
                    {showAcademyMenu && (
                      <div style={{ paddingLeft: 20, marginTop: 2, borderLeft: "1px solid rgba(108,114,255,0.2)", marginLeft: 18 }}>
                        {t.submenu.map(sub => (
                          <button
                            key={sub.k}
                            onClick={() => setTab(sub.k)}
                            className="nav-item"
                            style={{
                              width: "100%", display: "flex", alignItems: "center", gap: 8,
                              padding: "7px 10px", background: "transparent", border: "none",
                              color: tab === sub.k ? "#fff" : "rgba(174,185,225,0.55)",
                              cursor: "pointer", fontSize: 12, fontWeight: tab === sub.k ? 600 : 400,
                              borderRadius: 6, borderLeft: tab === sub.k ? "2px solid #6C72FF" : "2px solid transparent",
                            }}
                          >
                            <span style={{ fontSize: 12 }}>{sub.i}</span>
                            <span>{sub.l}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <button
                  key={t.k}
                  onClick={() => isLocked ? setShowPremium(true) : setTab(t.k)}
                  className={`nav-item${isActive ? " nav-item-active" : ""}`}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 10,
                    padding: "9px 10px", background: "transparent", border: "none",
                    borderLeft: isActive ? "2px solid #6C72FF" : "2px solid transparent",
                    color: isLocked ? "rgba(174,185,225,0.3)" : isActive ? "#fff" : "rgba(174,185,225,0.7)",
                    cursor: isLocked ? "not-allowed" : "pointer",
                    borderRadius: 8, fontSize: 13, fontWeight: isActive ? 600 : 400,
                  }}
                >
                  <span style={{ fontSize: 16, width: 22, textAlign: "center" }}>{t.i}</span>
                  <span style={{ flex: 1, textAlign: "left" }}>{t.l}</span>
                  {isLocked && (
                    <span style={{
                      fontSize: 9, fontWeight: 800, letterSpacing: 0.5,
                      background: "rgba(255,215,0,0.12)", color: "#ffd700",
                      padding: "2px 6px", borderRadius: 4, border: "1px solid rgba(255,215,0,0.2)",
                    }}>PRO</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Upgrade CTA */}
        {!authUser?.premium && (
          <div style={{ padding: "16px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            <button
              onClick={() => setShowPremium(true)}
              className="upgrade-btn"
              style={{
                width: "100%",
                background: "linear-gradient(135deg, #6C72FF 0%, #a78bfa 100%)",
                border: "none", color: "#fff",
                borderRadius: 10, padding: "12px 16px",
                fontWeight: 700, fontSize: 13, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                boxShadow: "0 4px 20px rgba(108,114,255,0.3)",
                transition: "all 0.25s ease",
                letterSpacing: 0.3,
              }}
            >
              <span>✦</span> Activar Premium
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area (Right) */}
      <div style={{
        flex: 1, height: "100vh", overflowY: "auto", display: "flex", flexDirection: "column",
        background: "radial-gradient(ellipse at 60% 10%, rgba(108,114,255,0.04) 0%, transparent 60%), #04070F",
      }}>
        {tab === "dash" && <Dashboard authUser={authUser} nombre={nombre} arquetipo={arquetipo} goSim={() => setTab("sim")} goRetoFlow={() => setTab("ret-f")} goRetoSombra={() => setTab("ret-s")} openPremium={() => setShowPremium(true)} isMobile={isMobile} />}
        {tab === "sim" && <Simulador portfolio={portfolio} setPortfolio={setPort} trades={trades} setTrades={setTrades} bitacora={bitacora} setBitacora={setBitacora} openPremium={() => setShowPremium(true)} isMobile={isMobile} />}
        {tab === "ret-s" && <div style={{ padding: isMobile ? "20px 16px" : "28px 32px", maxWidth: 900, margin: "0 auto", width: "100%" }}><RetoScreen tipo="sombra" data={SOMBRA} color="#ff6b6b" completados={compSombra} setCompletados={setCompSombra} respuestas={respSombra} setRespuestas={setRespSombra} addXp={x => setXp(p => p + x)} addCoins={c => setCoins(p => p + c)} isMobile={isMobile} /></div>}
        {tab === "ret-f" && <div style={{ padding: isMobile ? "20px 16px" : "28px 32px", maxWidth: 900, margin: "0 auto", width: "100%" }}><RetoScreen tipo="flow" data={FLOW} color="#00d4ff" completados={compFlow} setCompletados={setCompFlow} respuestas={respFlow} setRespuestas={setRespFlow} addXp={x => setXp(p => p + x)} addCoins={c => setCoins(p => p + c)} isMobile={isMobile} /></div>}

        {tab === "bit" && (
          <div style={{ padding: isMobile ? "20px 16px" : "28px 32px", maxWidth: 800, margin: "0 auto", width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
              <div style={{ width: 3, height: 20, background: "linear-gradient(180deg, #00d4ff, #6C72FF)", borderRadius: 2 }} />
              <h2 style={{ fontWeight: 900, fontSize: 20, margin: 0, letterSpacing: -0.5 }}>Bitácora PEDEM</h2>
            </div>
            {bitacora.length === 0 ? (
              <div style={{
                background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 14, padding: "48px 32px", textAlign: "center",
              }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>📋</div>
                <div style={{ color: "rgba(174,185,225,0.5)", fontSize: 14 }}>Sin registros todavía. Opera en el simulador para ver tus trades aquí.</div>
              </div>
            ) : bitacora.map((t, i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.025)",
                border: `1px solid rgba(255,255,255,0.07)`,
                borderLeft: `3px solid ${t.pl >= 0 ? "#00f5a0" : "#ff6b6b"}`,
                borderRadius: 12, padding: "18px 22px", marginBottom: 12,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 16, color: t.pl >= 0 ? "#00f5a0" : "#ff6b6b" }}>{t.dir} {t.sym}</div>
                    <div style={{ color: "rgba(174,185,225,0.4)", fontSize: 11, marginTop: 2 }}>{t.date}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 900, fontSize: 18, color: t.pl >= 0 ? "#00f5a0" : "#ff6b6b" }}>{fmtP(t.pl)}</div>
                    <div style={{ color: "rgba(174,185,225,0.4)", fontSize: 11 }}>{t.qty} contratos</div>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, background: "rgba(255,255,255,0.02)", padding: "12px 14px", borderRadius: 8 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 10, color: "#00f5a0", marginBottom: 5, letterSpacing: 0.8, textTransform: "uppercase" }}>Plan</div>
                    <div style={{ fontSize: 12, color: "rgba(174,185,225,0.7)" }}>{t.form.setup}</div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 10, color: "#00d4ff", marginBottom: 5, letterSpacing: 0.8, textTransform: "uppercase" }}>Evaluación</div>
                    <div style={{ fontSize: 12, color: "rgba(174,185,225,0.7)" }}>{t.eval?.que_paso || "Sin documentar"}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "profile" && <ProfileScreen authUser={authUser} arquetipo={arquetipo} openPremium={() => setShowPremium(true)} handleLogout={handleLogout} isMobile={isMobile} onUpdateName={updateProfileName} />}

        {tab === "geny" && (
          <div style={{ padding: "28px 32px", maxWidth: 800, margin: "0 auto", width: "100%" }}>
            <div style={{
              background: "linear-gradient(135deg, rgba(0,245,160,0.08), rgba(0,212,255,0.06))",
              border: "1px solid rgba(0,245,160,0.2)",
              borderRadius: 14, padding: "22px 24px", marginBottom: 20,
              display: "flex", alignItems: "center", gap: 16,
            }}>
              <div style={{ fontSize: 36 }}>🤖</div>
              <div>
                <div style={{ fontWeight: 900, fontSize: 17, background: "linear-gradient(90deg,#00f5a0,#00d4ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 4 }}>GENY IA · Tu Coach Personal</div>
                <div style={{ color: "rgba(174,185,225,0.5)", fontSize: 13 }}>Consultas limitadas en versión gratuita.</div>
              </div>
            </div>
            <div style={{
              background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 14, padding: "60px 32px", textAlign: "center",
            }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>💬</div>
              <div style={{ color: "rgba(174,185,225,0.4)", fontSize: 14 }}>El chat con GENY estará disponible próximamente.</div>
            </div>
          </div>
        )}

        {/* Coming Soon screens */}
        {["aca", "trn", "sig", "cer", "com"].map(k => tab === k && (
          <div key={k} style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", flexDirection: "column", gap: 16 }}>
            <div style={{
              background: "rgba(255,255,255,0.02)", border: "1px solid rgba(108,114,255,0.15)",
              borderRadius: 20, padding: "48px 64px", textAlign: "center",
            }}>
              <div style={{ fontSize: 48, marginBottom: 20 }}>
                {k === "aca" ? "🏛️" : k === "trn" ? "🏆" : k === "sig" ? "📡" : k === "cer" ? "🎓" : "💬"}
              </div>
              <div style={{ fontWeight: 900, fontSize: 22, color: "#fff", marginBottom: 8 }}>
                {k === "aca" ? "Academia 7 Mundos" : k === "trn" ? "Torneos en Vivo" : k === "sig" ? "Señales Geny Trend" : k === "cer" ? "Certificación 21" : "Comunidad Privada"}
              </div>
              <div style={{ color: "rgba(174,185,225,0.4)", fontSize: 14, marginBottom: 24 }}>Disponible en Plan Premium</div>
              <button
                onClick={() => setShowPremium(true)}
                style={{
                  background: "linear-gradient(135deg, #6C72FF, #a78bfa)",
                  border: "none", color: "#fff", borderRadius: 10, padding: "12px 28px",
                  fontWeight: 700, fontSize: 14, cursor: "pointer",
                  boxShadow: "0 4px 20px rgba(108,114,255,0.3)",
                }}
              >
                ✦ Activar Premium
              </button>
            </div>
          </div>
        ))}
      </div>
      {showPremium && <PremiumModal onClose={() => setShowPremium(false)} />}
    </div>
  );
}

