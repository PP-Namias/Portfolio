import next from 'eslint-config-next';

// Stub plugin so eslint-disable-next-line react-doctor/* directives
// are recognised (rules are enforced by react-doctor CLI, not ESLint)
const reactDoctorPlugin = {
  rules: {
    'no-giant-component': { create: () => ({}) },
    'exhaustive-deps': { create: () => ({}) },
    'effect-needs-cleanup': { create: () => ({}) },
    'no-array-index-as-key': { create: () => ({}) },
    'no-chain-state-updates': { create: () => ({}) },
    'no-conditional-effect': { create: () => ({}) },
    'no-usememo-simple-expression': { create: () => ({}) },
    'use-lazy-motion': { create: () => ({}) },
    'button-has-type': { create: () => ({}) },
    'no-danger': { create: () => ({}) },
    'iframe-missing-sandbox': { create: () => ({}) },
    'no-fetch-in-effect': { create: () => ({}) },
    'no-effect-chain': { create: () => ({}) },
    'prefer-tag-over-role': { create: () => ({}) },
    'no-multi-comp': { create: () => ({}) },
    'only-export-components': { create: () => ({}) },
  },
};

const config = [
  ...next,
  {
    plugins: { 'react-doctor': reactDoctorPlugin },
    rules: {
      'react-doctor/no-giant-component': 'off',
      'react-doctor/exhaustive-deps': 'off',
      'react-doctor/effect-needs-cleanup': 'off',
      'react-doctor/no-array-index-as-key': 'off',
      'react-doctor/no-chain-state-updates': 'off',
      'react-doctor/no-conditional-effect': 'off',
      'react-doctor/no-usememo-simple-expression': 'off',
      'react-doctor/use-lazy-motion': 'off',
      'react-doctor/button-has-type': 'off',
      'react-doctor/no-danger': 'off',
      'react-doctor/iframe-missing-sandbox': 'off',
      'react-doctor/no-fetch-in-effect': 'off',
      'react-doctor/no-effect-chain': 'off',
      'react-doctor/prefer-tag-over-role': 'off',
      'react-doctor/no-multi-comp': 'off',
      'react-doctor/only-export-components': 'off',
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'off',
    },
  },
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      '.open-next/**',
      'coverage/**',
      'src/app/api/sanity/webhook/route.ts',
      'src/components/ui/HubMenu.tsx',
      'src/components/charts/**',
      'studio/node_modules/**',
      'studio/.sanity/**',
      'studio/dist/**',
    ],
  },
  {
    rules: {
      'react-hooks/set-state-in-effect': 'off',
    },
  },
  {
    files: ['studio/**'],
    rules: {
      '@next/next/no-img-element': 'off',
    },
  },
];

export default config;
