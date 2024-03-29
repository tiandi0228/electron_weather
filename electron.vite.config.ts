import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin, swcPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

export default defineConfig({
    main: {
        plugins: [externalizeDepsPlugin(), swcPlugin()],
        build: {
            rollupOptions: {
                input: {
                    index: resolve(__dirname, 'src/main/index.ts')
                }
            }
        }
    },
    preload: {
        plugins: [externalizeDepsPlugin()]
    },
    renderer: {
        resolve: {
            alias: {
                '@renderer': resolve('src/renderer/src')
            }
        },
        plugins: [
            react({
                exclude: /\.stories\.(t|j)sx?$/,
                include: '**/*.tsx,.svg,.png,.jpg,.webp'
            }),
            createSvgIconsPlugin({
                iconDirs: [resolve(process.cwd(), 'src/renderer/src/assets/icons')]
            })
        ],
        build: {
            rollupOptions: {
                output: {
                    manualChunks(id): string | void {
                        if (id.includes('node_modules')) {
                            return 'vendor'
                        }
                    }
                }
            }
        }
    }
})
