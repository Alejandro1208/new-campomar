// src/pages/admin/Login.tsx (CORREGIDO)

import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { LogIn, AlertCircle } from 'lucide-react';
import { useSiteSettings } from '../../hooks/useData'; // <-- 1. IMPORTAR HOOK

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { settings } = useSiteSettings(); // <-- 2. LLAMAR AL HOOK

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await signIn(email, password);
    
    if (error) {
      setError('Credenciales incorrectas. Por favor, verifica tu email y contraseña.');
    } else {
      navigate('/admin');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          {/* 3. LÓGICA DEL LOGO CORREGIDA */}
          {settings.site_logo_url ? (
            <img src={`https://alejandrosabater.com.ar${settings.site_logo_url}`} alt="Logo Campomar" className="h-12 mx-auto mb-4" />
          ) : (
            <div className="bg-primary text-white p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <LogIn size={32} />
            </div>
          )}
          <h1 className="text-2xl font-bold text-gray-800">Panel de Administración</h1>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start space-x-3">
            <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ... (el resto del formulario no cambia) ... */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="admin@campomar.com" required />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="••••••••" required />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-primary text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium disabled:opacity-50">
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}