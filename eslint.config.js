import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
export default tseslint.config(
  { ignores: ['dist/**', 'node_modules/**', 'src/coss/**', 'output/**', '.playwright-cli/**', 'design-reference/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  { files: ['**/*.{ts,tsx}'], languageOptions: { globals: {...globals.browser,...globals.node} }, plugins: {'react-hooks':reactHooks}, rules: {'@typescript-eslint/no-explicit-any':'off','@typescript-eslint/no-unused-vars':['error',{argsIgnorePattern:'^_',varsIgnorePattern:'^_'}], 'react-hooks/rules-of-hooks':'error'} }
);
