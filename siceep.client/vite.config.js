import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const CARPETA_CLIENTE = fileURLToPath(new URL('.', import.meta.url));

/**
 * Busca el .env compartido subiendo por los directorios padres.
 * Se identifica porque contiene la llave SICEEP_URLS.
 * Si no existe, se usa la carpeta del proyecto (comportamiento por defecto).
 */
function encontrarEnvDir() {
    let dir = CARPETA_CLIENTE;
    for (let i = 0; i < 6; i++) {
        const candidato = path.join(dir, '.env');
        if (fs.existsSync(candidato) && fs.readFileSync(candidato, 'utf8').includes('SICEEP_URLS')) {
            return dir;
        }
        const padre = path.dirname(dir);
        if (padre === dir) break;
        dir = padre;
    }
    return CARPETA_CLIENTE;
}

export default defineConfig(({ mode }) => {
    const envDir = encontrarEnvDir();
    const env = loadEnv(mode, envDir, '');

    const puerto = Number(env.VITE_PORT) || 50412;
    const claveCert = path.resolve(CARPETA_CLIENTE, env.VITE_HTTPS_KEY || 'certs/localhost-key.pem');
    const certificado = path.resolve(CARPETA_CLIENTE, env.VITE_HTTPS_CERT || 'certs/localhost.pem');

    // El destino del proxy se deriva de SICEEP_URLS: se usa la primera URL HTTPS.
    const destinos = (env.SICEEP_URLS || '').split(';').map(u => u.trim()).filter(Boolean);
    const destino = destinos.find(u => u.startsWith('https://')) || 'https://localhost:7109';

    return {
        plugins: [react()],
        envDir,
        server: {
            https: {
                key: fs.readFileSync(claveCert),
                cert: fs.readFileSync(certificado),
            },
            port: puerto,
            proxy: {
                '/api': {
                    target: destino,
                    secure: false,
                    changeOrigin: true,
                },
            },
        },
        preview: {
            port: puerto,
        },
    };
});
