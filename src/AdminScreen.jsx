import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

const S = {
  app: { background: "#080F25", minHeight: "100vh", color: "#FFFFFF", fontFamily: "'Mona Sans', 'Inter', system-ui, sans-serif", fontSize: 13, padding: 24 },
  card: { background: "#101935", border: "1px solid #343B4F", borderRadius: 12, padding: 20, boxShadow: "0px 10px 30px rgba(0,0,0,0.5)" },
  inp: { background: "#080F25", border: "1px solid #343B4F", borderRadius: 8, padding: "10px 14px", color: "#FFFFFF", fontSize: 13, width: "100%", outline: "none" },
  btn: (c = "#6C72FF") => ({ background: c, border: "none", color: "#FFFFFF", borderRadius: 8, padding: "10px 20px", cursor: "pointer", fontWeight: 600, transition: "all .2s" }),
  badge: (bg, c) => ({ background: bg, color: c, padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, textTransform: "uppercase" }),
};

export default function AdminScreen({ onBack }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [xpFilter, setXpFilter] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) console.error("Error fetching users:", error);
    else setUsers(data);
    setLoading(false);
  };

  const toggleAdmin = async (userId, current) => {
    if (userId === "594f0058-a903-4638-9fb1-a861417659f8" && current) {
      alert("No se puede revocar el acceso al administrador principal.");
      return;
    }
    
    if (!window.confirm(`¿Estás seguro de que deseas ${current ? 'quitar' : 'dar'} acceso de administrador a este usuario?`)) return;

    const { error } = await supabase
      .from("profiles")
      .update({ is_admin: !current })
      .eq("id", userId);
    if (!error) fetchUsers();
  };

  const togglePremium = async (userId, current) => {
    if (!window.confirm(`¿Estás seguro de que deseas ${current ? 'quitar' : 'activar'} el plan Premium para este usuario?`)) return;

    const { error } = await supabase
      .from("profiles")
      .update({ premium: !current })
      .eq("id", userId);
    if (!error) fetchUsers();
  };

  const filteredUsers = users.filter(u => {
    const matchSearch = (u.name || "").toLowerCase().includes(search.toLowerCase());
    const matchXp = (u.xp || 0) >= xpFilter;
    return matchSearch && matchXp;
  });

  if (loading) return (
    <div style={{ ...S.app, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: "#6C72FF" }}>Cargando Panel Administrativo...</div>
    </div>
  );

  return (
    <div style={S.app}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 900, margin: 0, letterSpacing: -0.5 }}>Panel de Control Ingresarios</h1>
            <p style={{ color: "rgba(174,185,225,0.6)", margin: "4px 0 0" }}>Gestionando {users.length} usuarios registrados</p>
          </div>
          <button onClick={onBack} style={{ ...S.btn("rgba(255,255,255,0.05)"), border: "1px solid #343B4F" }}>Volver a la App</button>
        </div>

        {/* Filters */}
        <div style={{ ...S.card, marginBottom: 24, display: "flex", gap: 20, alignItems: "flex-end" }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", fontSize: 11, color: "#AEB9E1", marginBottom: 8, fontWeight: 600 }}>BUSCAR USUARIO</label>
            <input 
              style={S.inp} 
              placeholder="Nombre de usuario..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
            />
          </div>
          <div style={{ width: 250 }}>
            <label style={{ display: "block", fontSize: 11, color: "#AEB9E1", marginBottom: 8, fontWeight: 600 }}>AVANCE MÍNIMO (XP): {xpFilter}</label>
            <input 
              type="range" 
              min="0" max="5000" step="100" 
              value={xpFilter} 
              onChange={e => setXpFilter(Number(e.target.value))} 
              style={{ width: "100%", accentColor: "#6C72FF" }}
            />
          </div>
          <div style={{ width: 150 }}>
             <button onClick={fetchUsers} style={{ ...S.btn("#6C72FF"), width: "100%" }}>Actualizar</button>
          </div>
        </div>

        {/* User Table */}
        <div style={{ ...S.card, padding: 0, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid #343B4F" }}>
              <tr>
                {["Usuario", "Membresía", "Progreso", "Acceso Admin", "Acciones"].map(h => (
                  <th key={h} style={{ padding: "16px 20px", fontSize: 11, color: "rgba(174,185,225,0.5)", fontWeight: 700, textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} style={{ borderBottom: "1px solid rgba(52, 59, 79, 0.4)", transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.01)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "16px 20px" }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{user.name || "Sin nombre"}</div>
                    <div style={{ fontSize: 11, color: "rgba(174,185,225,0.4)" }}>{user.id.slice(0, 8)}...</div>
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    {user.premium ? (
                      <span style={S.badge("rgba(255, 215, 0, 0.15)", "#FFD700")}>PLUS ⭐</span>
                    ) : (
                      <span style={S.badge("rgba(174, 185, 225, 0.1)", "rgba(174, 185, 225, 0.6)")}>GRATIS</span>
                    )}
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    <div style={{ width: 120, height: 6, background: "#080F25", borderRadius: 3, overflow: "hidden", marginBottom: 6 }}>
                      <div style={{ width: `${Math.min((user.xp / 5000) * 100, 100)}%`, height: "100%", background: "#00f5a0" }} />
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 700 }}>{user.xp} XP <span style={{ color: "#ffd700", marginLeft: 4 }}>{user.coins} C</span></div>
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <div style={{ 
                        width: 36, height: 20, borderRadius: 10, position: "relative", cursor: "pointer",
                        background: user.is_admin ? "#6C72FF" : "#343B4F",
                        transition: "all 0.3s"
                      }} onClick={() => toggleAdmin(user.id, user.is_admin)}>
                        <div style={{ 
                          width: 14, height: 14, borderRadius: "50%", background: "#fff",
                          position: "absolute", top: 3, left: user.is_admin ? 18 : 4,
                          transition: "all 0.3s"
                        }} />
                      </div>
                      <span style={{ fontSize: 12, color: user.is_admin ? "#fff" : "rgba(174,185,225,0.5)" }}>
                        {user.is_admin ? "ADMIN" : "USUARIO"}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    <button 
                      onClick={() => togglePremium(user.id, user.premium)}
                      style={{ ...S.btn(user.premium ? "rgba(255, 77, 77, 0.1)" : "rgba(0, 245, 160, 0.1)"), color: user.premium ? "#ff6b6b" : "#00f5a0", width: "100%", fontSize: 12, padding: "8px 12px" }}
                    >
                      {user.premium ? "Degradar a Free" : "Promover a Plus"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <div style={{ padding: 40, textAlign: "center", color: "rgba(174,185,225,0.4)" }}>
              No se encontraron usuarios con los filtros aplicados.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
