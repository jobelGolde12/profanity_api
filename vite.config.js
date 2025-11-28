import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],

    // This fixes mixed-content in Railway
   // server: {
    //    https: true,
     //   strictPort: true,
     //   host: true,
   // },
});
