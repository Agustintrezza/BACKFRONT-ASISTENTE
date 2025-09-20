import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export function useUserPlan() {
  const [data, setData] = useState({
    loading: true,
    planName: "basic",
    maxUsers: 0,
    maxConsultas: 0,
    maxConversaciones: 0,
    maxReservas: 0,
    maxProductosComodines: 0,
    maxSeccionesComodines: 0,
    maxProductosTotales: 0,
    maxSeccionesTotales: 0,
    consultasRestantes: 0,
    usuariosRestantes: 0,
    conversacionesRestantes: 0,
    reservasRestantes: 0,
  });

  useEffect(() => {
    async function fetchUserAndPlans() {
      try {
        const token = localStorage.getItem("token");

        // Traigo usuario
        const { data: user } = await axios.get(`${API_URL}/usuarios/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Traigo planes
        const { data: planes } = await axios.get(`${API_URL}/planes`);

        const planName = user.plan || "basic";
        const plan = planes[planName] || planes.basic;

        setData({
          loading: false,
          planName,
          ...plan,
          consultasRestantes: Math.max(0, plan.maxConsultas - (user.consultasUsadas || 0)),
          usuariosRestantes: Math.max(0, plan.maxUsers - (user.usuariosCreados || 0)),
          conversacionesRestantes: Math.max(0, plan.maxConversaciones - (user.conversacionesActivas || 0)),
          reservasRestantes: Math.max(0, plan.maxReservas - (user.reservasActivas || 0)),
        });
      } catch (err) {
        console.error("❌ Error al cargar plan de usuario:", err);
        setData((prev) => ({ ...prev, loading: false }));
      }
    }

    fetchUserAndPlans();
  }, []);

  return data;
}
