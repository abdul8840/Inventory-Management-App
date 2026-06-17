const cssInteropPlugin = require('react-native-css-interop/dist/babel-plugin').default;

module.exports = function (api) {
  const isTest = api.env('test');

  return {
    presets: ['module:@react-native/babel-preset'],
    plugins: [
      !isTest && cssInteropPlugin,
      !isTest && [
        '@babel/plugin-transform-react-jsx',
        {
          runtime: 'automatic',
          importSource: 'react-native-css-interop'
        }
      ],
      'react-native-reanimated/plugin'
    ].filter(Boolean)
  };
};
