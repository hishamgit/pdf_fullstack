import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Alias 'pdf.worker.js' to the correct path in the public directory
      'pdf.worker.js': '\node_modules\react-pdf\node_modules\pdfjs-dist\build\pdf.worker.js',
    },
  },
});
