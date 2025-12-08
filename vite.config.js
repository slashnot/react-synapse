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
            },
            rollupOptions: {
                external: ['react', 'react-dom', '@preact/signals-core', '@preact/signals-react', 'signals'],
                input: {
                    index: resolve(import.meta.dirname, 'index.js'),
                    store: resolve(import.meta.dirname, 'store.js'),
                    signals: resolve(import.meta.dirname, 'signals.js'),
                },
                output: [
                    {
                        format: 'es',
                        entryFileNames: 'reactSignalStore.js',
                        assetFileNames: 'assets/[name][extname]',
                    }
                ]
            },
            sourcemap: true,
        }
    }

    return libConfig;
})