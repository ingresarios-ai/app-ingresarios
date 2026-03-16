import React from "react";

const S = {
  container: {
    minHeight: "100vh",
    background: "radial-gradient(ellipse at 60% 30%, #0a1535 0%, #04070F 70%)",
    color: "#fff",
    fontFamily: "'Inter', sans-serif",
    overflowX: "hidden",
  },
  nav: (isMobile) => ({
    padding: isMobile ? "15px 20px" : "20px 40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "sticky",
    top: 0,
    background: "rgba(4, 7, 15, 0.8)",
    backdropFilter: "blur(10px)",
    zIndex: 100,
    borderBottom: "1px solid rgba(255,255,255,0.05)",
  }),
  hero: (isMobile) => ({
    padding: isMobile ? "60px 20px 40px" : "100px 20px 80px",
    textAlign: "center",
    maxWidth: 900,
    margin: "0 auto",
  }),
  title: {
    fontSize: "clamp(42px, 8vw, 72px)",
    fontWeight: 900,
    lineHeight: 1.1,
    marginBottom: 24,
    background: "linear-gradient(135deg, #fff 0%, #888 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    letterSpacing: "-0.03em",
  },
  subtitle: {
    fontSize: "clamp(18px, 2vw, 22px)",
    color: "rgba(255,255,255,0.6)",
    lineHeight: 1.6,
    marginBottom: 40,
    maxWidth: 700,
    margin: "0 auto 40px",
  },
  button: {
    background: "linear-gradient(135deg, #00f5a0 0%, #00b87a 100%)",
    border: "none",
    color: "#020F0A",
    borderRadius: 12,
    padding: "16px 36px",
    fontWeight: 800,
    fontSize: 16,
    cursor: "pointer",
    boxShadow: "0 10px 30px rgba(0,245,160,0.3)",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  section: (isMobile) => ({
    padding: isMobile ? "40px 16px" : "80px 20px",
    maxWidth: 1200,
    margin: "0 auto",
  }),
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: 30,
    marginTop: 50,
  },
  card: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 20,
    padding: 32,
    transition: "transform 0.3s ease, border 0.3s ease",
    cursor: "default",
  },
  tableContainer: {
    marginTop: 100,
    background: "rgba(255,255,255,0.02)",
    borderRadius: 24,
    border: "1px solid rgba(255,255,255,0.05)",
    overflowX: "auto",
    WebkitOverflowScrolling: "touch",
  },
  tableRow: (isMobile) => ({
    display: "grid",
    gridTemplateColumns: isMobile ? "1.2fr 1fr 1fr" : "2fr 1fr 1fr",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    padding: isMobile ? "16px 12px" : "20px 30px",
    fontSize: isMobile ? 12 : 14,
  }),
  tableHeader: {
    fontWeight: 800,
    fontSize: 14,
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: 1,
  }
};

export default function LandingPage({ onStart, isMobile }) {
  return (
    <div style={S.container}>
      <nav style={S.nav(isMobile)}>
        <img 
          src="/logo-negro.png" 
          alt="Logo" 
          style={{ height: 28, filter: "brightness(0) invert(1)" }} 
        />
        <button 
          onClick={onStart}
          style={{ ...S.button, padding: "10px 24px", fontSize: 14 }}
        >
          Iniciar Sesión
        </button>
      </nav>

      <header style={S.hero(isMobile)}>
        <div style={{ color: "#00f5a0", fontWeight: 800, fontSize: 13, textTransform: "uppercase", letterSpacing: 3, marginBottom: 16 }}>
          MÉTODO PEDEM · IA GENERATIVA
        </div>
        <h1 style={S.title}>Transforma tu Trading en un Proceso de Élite.</h1>
        <p style={S.subtitle}>
          Mucho más que un simulador. Una academia interactiva apoyada por Inteligencia Artificial para desarrollar tu Arquetipo de Trader.
        </p>
        <button 
          onClick={onStart}
          onMouseOver={e => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 15px 40px rgba(0,245,160,0.4)";
          }}
          onMouseOut={e => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,245,160,0.3)";
          }}
          style={S.button}
        >
          Comenzar Gratis Ahora
        </button>
      </header>

      <section style={S.section(isMobile)}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <h2 style={{ fontSize: 32, fontWeight: 800 }}>Por qué Ingresarios</h2>
        </div>
        <div style={S.grid}>
          <div style={S.card}>
            <div style={{ fontSize: 40, marginBottom: 20 }}>🧠</div>
            <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>Método PEDEM</h3>
            <p style={{ color: "#999", lineHeight: 1.6, fontSize: 15 }}>Preparación, Ejecución, Diario, Evaluación y Mejora. El ciclo profesional para dominar los mercados.</p>
          </div>
          <div style={S.card}>
            <div style={{ fontSize: 40, marginBottom: 20 }}>🤖</div>
            <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>GENY IA Coach</h3>
            <p style={{ color: "#999", lineHeight: 1.6, fontSize: 15 }}>Feedback personalizado sobre tus errores y aciertos basado en psicología conductual y análisis de datos.</p>
          </div>
          <div style={S.card}>
            <div style={{ fontSize: 40, marginBottom: 20 }}>🌑</div>
            <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>Reto de la Sombra</h3>
            <p style={{ color: "#999", lineHeight: 1.6, fontSize: 15 }}>Identifica tus sesgos cognitivos y autosabotaje mediante ejercicios de introspección profunda.</p>
          </div>
        </div>
      </section>

      <section style={S.section(isMobile)}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <h2 style={{ fontSize: 32, fontWeight: 800 }}>Elige tu Camino</h2>
          <p style={{ color: "#666", marginTop: 10 }}>Acceso total a la tecnología institucional de trading.</p>
        </div>

        <div style={S.tableContainer}>
          <div style={{ ...S.tableRow(isMobile), background: "rgba(255,255,255,0.03)" }}>
            <div style={S.tableHeader}>Característica</div>
            <div style={{ ...S.tableHeader, color: "#fff", textAlign: "center" }}>Plan Free</div>
            <div style={{ ...S.tableHeader, color: "#ffd700", textAlign: "center" }}>Premium 👑</div>
          </div>
          <div style={S.tableRow(isMobile)}>
            <div>Simulador con activos principales</div>
            <div style={{ textAlign: "center" }}>✅ 5 Activos</div>
            <div style={{ textAlign: "center", color: "#ffd700" }}>✅ 20+ Activos</div>
          </div>
          <div style={S.tableRow(isMobile)}>
            <div>Coach GENY IA</div>
            <div style={{ textAlign: "center" }}>Limitado</div>
            <div style={{ textAlign: "center", color: "#ffd700" }}>Ilimitado</div>
          </div>
          <div style={S.tableRow(isMobile)}>
            <div>Retos Psicológicos (Sombra/Flow)</div>
            <div style={{ textAlign: "center" }}>✅ 7 Días</div>
            <div style={{ textAlign: "center", color: "#ffd700" }}>✅ 21 Días</div>
          </div>
          <div style={S.tableRow(isMobile)}>
            <div>Academia 7 Mundos</div>
            <div style={{ textAlign: "center" }}>❌ No incl.</div>
            <div style={{ textAlign: "center", color: "#ffd700" }}>✅ Acceso Total</div>
          </div>
          <div style={S.tableRow(isMobile)}>
            <div>Señales Geny Trend</div>
            <div style={{ textAlign: "center" }}>❌ No incl.</div>
            <div style={{ textAlign: "center", color: "#ffd700" }}>✅ Tiempo Real</div>
          </div>
          <div style={{ ...S.tableRow(isMobile), borderBottom: "none", padding: isMobile ? "30px 12px" : "40px 30px" }}>
            <div></div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 900, marginBottom: 10 }}>$0</div>
              <button onClick={onStart} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontWeight: 700 }}>Empezar</button>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 900, marginBottom: 10, color: "#ffd700" }}>$97<span style={{ fontSize: 12, color: "#888" }}>/mes</span></div>
              <button onClick={onStart} style={{ ...S.button, padding: isMobile ? "8px 12px" : "8px 16px", fontSize: isMobile ? 12 : 14 }}>Hacerme Premium</button>
            </div>
          </div>
        </div>
      </section>

      <footer style={{ padding: "60px 20px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.05)", marginTop: 100 }}>
        <img 
          src="/logo-negro.png" 
          alt="Logo" 
          style={{ height: 20, filter: "brightness(0) invert(1)", marginBottom: 20, opacity: 0.5 }} 
        />
        <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>
          © 2026 Ingresarios · Educando a la próxima generación de traders.
        </div>
      </footer>
    </div>
  );
}
