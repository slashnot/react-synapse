import { defineConfig } from 'vite'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig(() => {
    // Production/Library build mode
    const libConfig = {
        build: {
            lib: {
                entry: {
                    index: resolve(import.meta.dirname, 'index.js'),
                    store: resolve(import.meta.dirname, 'store.js'),
                    signals: resolve(import.meta.dirname, 'signals.js'),
                },
                formats: ['es'],
            },
            rollupOptions: {
                external: [
                    'react',
                    'react-dom',
                    '@preact/signals-core',
                    '@preact/signals-react',
                    'react-set-signal',
                    'mutative'
                ],
                output: {
                    format: 'es',
                    entryFileNames: '[name].js',
                    // Put shared code in a predictable chunk name
                    chunkFileNames: '_shared.js',
                }
            },
            // Disable sourcemaps for cleaner debugging
            sourcemap: false,
        }
    }

    return libConfig;
})