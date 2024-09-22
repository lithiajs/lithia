import { defineConfig } from 'lithia';

export default defineConfig({
  environments: {
    development: {
      envFileNames: ['.env.development'],
    },
  },
});
