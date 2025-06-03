// src/components/admin/LoginForm.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { useWebsiteStore } from "../../store/useWebsiteStore"; // Importas el store
import { LogIn, AlertCircle } from "lucide-react";

const LoginForm: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const login = useAuthStore((state) => state.login);
    const navigate = useNavigate();

    const siteLogoPath = useWebsiteStore((state) => state.logo);
    const initialDataLoaded = useWebsiteStore(
        (state) => state.initialDataLoaded
    );

    // LOGS ESPECÍFICOS PARA ESTE COMPONENTE
    console.log(
        "LoginForm - Renderizando. initialDataLoaded:",
        initialDataLoaded
    );
    console.log("LoginForm - Renderizando. siteLogoPath:", siteLogoPath);

    const fullLogoUrl =
        siteLogoPath && siteLogoPath.startsWith("/")
            ? `http://localhost:3001${siteLogoPath}`
            : siteLogoPath;

    console.log("LoginForm - Renderizando. fullLogoUrl:", fullLogoUrl);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        const success = login(username, password);
        if (success) {
            navigate("/admin/dashboard");
        } else {
            setError("Usuario o contraseña inválidos");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-custom max-w-md w-full">
                <div className="flex justify-center mb-6">

                    {fullLogoUrl ? ( // Solo verifica si fullLogoUrl tiene un valor
                        <img
                            src={fullLogoUrl}
                            alt="Logo del Sitio"
                            className="h-16 w-auto max-h-20"
                        />
                    ) : (
                        <LogIn className="h-12 w-12 text-primary-500" />
                    )}
                </div>

                <h1 className="text-2xl font-bold text-center text-primary-500 mb-6">
                    Panel de Administración
                </h1>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg flex items-center">
                        <AlertCircle className="h-5 w-5 mr-2" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* ... (inputs) ... */}
                    <div className="mb-4">
                        <label
                            htmlFor="username"
                            className="block text-gray-700 mb-2"
                        >
                            Usuario
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label
                            htmlFor="password"
                            className="block text-gray-700 mb-2"
                        >
                            Contraseña
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-400 transition-colors duration-200"
                    >
                        Ingresar
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    <p>* Acceso restringido solo a personal autorizado.</p>
                    <p className="mt-2">
                        Para demo: usuario "admin", contraseña "admin123"
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
