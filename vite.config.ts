import {defineConfig} from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
    build: {
        sourcemap: true,
        lib: {
            entry: './src/index.ts',
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
    plugins: [
        dts({
            rollupTypes: true,
        }),
    ],
});
