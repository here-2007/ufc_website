export default [
  {
    ignores: ['.next/**', 'node_modules/**', 'prisma/migrations/**', '**/*.{ts,tsx}'],
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
];
