import {defineConfig} from 'vitest/config';
import react from '@vitejs/plugin-react';
export default defineConfig({plugins:[react()],test:{environment:'jsdom',globals:true,include:['web/src/**/*.test.ts','web/src/**/*.test.tsx'],setupFiles:['./vitest.setup.ts']}});
