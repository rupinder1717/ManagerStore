import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const target = 'http://localhost:7040'; // Backend (HTTP)

// ✅ Clean and working Vite config
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        port: 53302,
        https: false, // HTTP for frontend
        proxy: {
            '/api': {
                target: "http://localhost:53302",
                changeOrigin: true,
             
            }
        }
    }
});
