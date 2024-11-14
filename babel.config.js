module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        targets: {
          node: 20,
        },
        corejs: 3,
        // debug: true,
      },
    ],
    '@babel/preset-typescript',
  ],
};
