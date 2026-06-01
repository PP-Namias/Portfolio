import next from 'eslint-config-next';

const config = [
  ...next,
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      '.open-next/**',
      'coverage/**',
      'src/app/api/sanity/webhook/route.ts',
      'src/components/ui/HubMenu.tsx',
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
];

export default config;
