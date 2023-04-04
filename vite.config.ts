import {defineConfig} from 'vite';
import path from 'path';
import {svelte} from '@sveltejs/vite-plugin-svelte';
import sveltePreprocess from 'svelte-preprocess';

export default defineConfig({
    plugins: [
        svelte({
            preprocess: [
                sveltePreprocess({
                    typescript: true,
                }),
            ],
        }),
    ],
    build: {
        sourcemap: true,
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'leaflet-tracksymbol2',
            fileName: (format) => `leaflet-tracksymbol2.${format}.js`,
        },
        rollupOptions: {
            external: [
                "leaflet",
            ],
            output: {
                exports: "named",
                globals: {
                    leaflet: 'L',
                },
            },
        },
    },
});
