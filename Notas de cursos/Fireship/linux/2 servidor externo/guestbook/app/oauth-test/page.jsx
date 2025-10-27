'use client';

import { useState } from 'react';
import PocketBase from 'pocketbase';

export default function OAuthTest() {
  const [debugInfo, setDebugInfo] = useState('');
  const [loading, setLoading] = useState(false);

  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'https://linux.fireship.app/pb');

  const testOAuthConfig = async () => {
    setLoading(true);
    setDebugInfo('🔍 Probando configuración OAuth...\n\n');

    try {
      // 1. Test conexión básica
      setDebugInfo(prev => prev + '1. Probando conexión con PocketBase...\n');
      const health = await fetch(`http://127.0.0.1:8090/api/health`).then(r => r.json());
      setDebugInfo(prev => prev + `✅ Health: ${JSON.stringify(health)}\n\n`);

      // 2. Obtener settings (necesitas ser admin o tener permisos)
      setDebugInfo(prev => prev + '2. Obteniendo configuración de auth...\n');
      const settings = await fetch(`http://127.0.0.1:8090/api/settings`).then(r => r.json());
      
      const authProviders = settings?.authProviders || [];
      setDebugInfo(prev => prev + `✅ Proveedores OAuth: ${authProviders.length}\n`);
      
      authProviders.forEach(provider => {
        setDebugInfo(prev => prev + `   - ${provider.name} (${provider.state})\n`);
      });

      setDebugInfo(prev => prev + `\n📋 Configuración completa:\n${JSON.stringify(settings.authProviders, null, 2)}\n\n`);

      // 3. Verificar URL de callback
      setDebugInfo(prev => prev + '3. Verificando URL de callback...\n');
      const callbackUrl = `http://127.0.0.1:8090/api/oauth2-redirect`;
      setDebugInfo(prev => prev + `✅ Callback URL: ${callbackUrl}\n\n`);

      // 4. Probar OAuth flow manualmente
      setDebugInfo(prev => prev + '4. Probando flujo OAuth para GitHub...\n');
      
      const authUrl = await pb.collection('users').listAuthMethods();
      setDebugInfo(prev => prev + `✅ Métodos de auth disponibles:\n${JSON.stringify(authUrl, null, 2)}\n`);

    } catch (error) {
      setDebugInfo(prev => prev + `❌ Error: ${error.message}\n`);
      setDebugInfo(prev => prev + `Detalles: ${JSON.stringify(error, null, 2)}\n`);
    } finally {
      setLoading(false);
    }
  };

  const testDirectOAuth = async () => {
    setLoading(true);
    try {
      setDebugInfo('🔄 Iniciando OAuth directo...\n');
      
      // Método directo para OAuth
      const authMethods = await pb.collection('users').listAuthMethods();
      setDebugInfo(prev => `Métodos disponibles: ${JSON.stringify(authMethods, null, 2)}\n`);
      
      if (authMethods?.authProviders?.find(p => p.name === 'github')) {
        // Redirigir directamente a GitHub OAuth
        const redirectUrl = `http://127.0.0.1:8090/api/oauth2/github`;
        setDebugInfo(prev => prev + `🔗 Redirigiendo a: ${redirectUrl}\n`);
        window.location.href = redirectUrl;
      } else {
        setDebugInfo(prev => prev + '❌ GitHub OAuth no está configurado en PocketBase\n');
      }
    } catch (error) {
      setDebugInfo(prev => prev + `❌ Error: ${error.message}\n`);
    } finally {
      setLoading(false);
    }
  };

  const checkAdminConfig = async () => {
    setLoading(true);
    try {
      setDebugInfo('👨‍💼 Verificando configuración admin...\n');
      
      // Intentar acceder a la interfaz admin
      const adminUrl = `http://127.0.0.1:8090/_/`;
      setDebugInfo(prev => prev + `Admin URL: ${adminUrl}\n`);
      
      // Probar si la interfaz admin está accesible
      const response = await fetch(adminUrl);
      setDebugInfo(prev => prev + `Status Admin: ${response.status}\n`);
      
      if (response.status === 200) {
        setDebugInfo(prev => prev + '✅ Interfaz admin accesible\n');
        setDebugInfo(prev => prev + '💡 Ve a la interfaz admin y configura GitHub OAuth en Settings > Auth Providers\n');
      } else {
        setDebugInfo(prev => prev + '❌ No se puede acceder a la interfaz admin\n');
      }
    } catch (error) {
      setDebugInfo(prev => prev + `❌ Error admin: ${error.message}\n`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">🔧 Debug OAuth PocketBase</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <button
          onClick={testOAuthConfig}
          disabled={loading}
          className="bg-blue-500 text-white p-3 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          Test Configuración
        </button>
        
        <button
          onClick={testDirectOAuth}
          disabled={loading}
          className="bg-green-500 text-white p-3 rounded hover:bg-green-600 disabled:bg-gray-400"
        >
          Probar OAuth Directo
        </button>
        
        <button
          onClick={checkAdminConfig}
          disabled={loading}
          className="bg-purple-500 text-white p-3 rounded hover:bg-purple-600 disabled:bg-gray-400"
        >
          Verificar Admin
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded">
        <h3 className="font-bold mb-2">Debug Info:</h3>
        <pre className="whitespace-pre-wrap text-sm bg-white p-3 rounded overflow-auto max-h-96">
          {debugInfo || 'Haz click en algún botón para empezar...'}
        </pre>
      </div>

      <div className="mt-6 p-4 bg-yellow-100 rounded">
        <h3 className="font-bold mb-2">📋 Pasos para configurar OAuth:</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>Accede a la interfaz admin de PocketBase: <code>{pb.baseURL}/_/</code></li>
          <li>Ve a <strong>Settings → Auth Providers</strong></li>
          <li>Agrega GitHub OAuth con:
            <ul className="list-disc list-inside ml-4 mt-1">
              <li><strong>Client ID</strong>: De tu GitHub OAuth App</li>
              <li><strong>Client Secret</strong>: De tu GitHub OAuth App</li>
              <li><strong>Callback URL</strong>: <code>{pb.baseURL}/api/oauth2-redirect</code></li>
            </ul>
          </li>
          <li>En GitHub OAuth App settings, usa:
            <ul className="list-disc list-inside ml-4 mt-1">
              <li><strong>Homepage URL</strong>: <code>https://linux.fireship.app</code></li>
              <li><strong>Authorization callback URL</strong>: <code>{pb.baseURL}/api/oauth2-redirect</code></li>
            </ul>
          </li>
        </ol>
      </div>
    </div>
  );
}