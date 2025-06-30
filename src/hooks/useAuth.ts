// src/hooks/useAuth.ts (Versión con checkSession)
import { useState, useEffect } from 'react';

interface AdminUser {
  id: string;
  email: string;
}

const BASE_API_URL = 'https://alejandrosabater.com.ar/api';

export function useAuth() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Al iniciar, verificamos si ya existe una sesión en el servidor
    const checkUserSession = async () => {
      try {
        const response = await fetch(`${BASE_API_URL}/checkSession.php`);
        const data = await response.json();
        if (data.isLoggedIn && data.user) {
          setUser(data.user);
        }
      } catch (error) {
        console.error("No active session found:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkUserSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch(`${BASE_API_URL}/login.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        return { error: new Error(data.error || 'Error en el login') };
      }
      
      if(data.success && data.user) {
        setUser(data.user);
      }
      return { error: null };
    } catch (e) {
      return { error: new Error('No se pudo conectar al servidor.') };
    }
  };

  const signOut = async () => {
    // Aquí llamaremos a un futuro logout.php para destruir la sesión en el servidor
    setUser(null);
    // Podríamos añadir una llamada a un script logout.php si fuera necesario
    // await fetch(`${BASE_API_URL}/logout.php`);
    return { error: null };
  };

  return {
    user,
    loading,
    signIn,
    signOut,
  };
}